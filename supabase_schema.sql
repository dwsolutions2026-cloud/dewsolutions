-- 1. Criação das Tabelas

-- Profiles (Extensão de auth.users)
CREATE TABLE public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('admin', 'empresa', 'candidato')),
  created_at timestamptz default now()
);

-- Empresas
CREATE TABLE public.empresas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade unique,
  nome text not null,
  cnpj text unique not null check (cnpj ~ '^\d{14}$'), -- armazenar sempre só números (14 dígitos)
  setor text,
  cidade text,
  estado text,
  site text,
  logo_url text,
  ativa boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- Vagas
CREATE TABLE public.vagas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references public.empresas on delete cascade not null,
  titulo text not null,
  descricao text not null,
  requisitos text,
  beneficios text,
  regime text,
  modalidade text,
  cidade text,
  estado text,
  salario_min numeric,
  salario_max numeric,
  exibir_salario boolean default false,
  status text default 'ativa' check (status in ('ativa', 'encerrada')),
  created_at timestamptz default now(),
  updated_at timestamptz,
  created_by uuid references auth.users
);

-- Candidatos
CREATE TABLE public.candidatos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade unique,
  nome text not null,
  email text not null,
  telefone text,
  cidade text,
  estado text,
  curriculo_url text,
  lgpd_aceito boolean default false,
  lgpd_aceito_em timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- Candidaturas
CREATE TABLE public.candidaturas (
  id uuid primary key default gen_random_uuid(),
  candidato_id uuid references public.candidatos on delete cascade not null,
  vaga_id uuid references public.vagas on delete cascade not null,
  created_at timestamptz default now(),
  unique(candidato_id, vaga_id)
);


-- 2. Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidaturas ENABLE ROW LEVEL SECURITY;


-- 3. Funções Utilitárias de Autenticação

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;


-- 4. Políticas de Segurança (Policies)

-- Profiles
CREATE POLICY "Admin pode tudo em profiles" ON public.profiles FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "Usuários podem ler o próprio profile" ON public.profiles FOR SELECT USING (id = auth.uid());

-- Empresas
CREATE POLICY "Admin pode tudo em empresas" ON public.empresas FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "Empresa lê próprio registro" ON public.empresas FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Empresa atualiza próprio registro" ON public.empresas FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Público e candidatos veem empresas ativas" ON public.empresas FOR SELECT USING (ativa = true);

-- Vagas
CREATE POLICY "Admin pode tudo em vagas" ON public.vagas FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "Empresa pode gerenciar proprias vagas" ON public.vagas FOR ALL 
  USING (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()))
  WITH CHECK (empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()));
CREATE POLICY "Público pode ver vagas ativas" ON public.vagas FOR SELECT USING (status = 'ativa');

-- Candidatos
CREATE POLICY "Admin pode ler tudo em candidatos" ON public.candidatos FOR SELECT USING (public.get_my_role() = 'admin');
CREATE POLICY "Candidato pode ler e atualizar próprio perfil" ON public.candidatos FOR ALL 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Empresa pode ler candidatos de suas vagas" ON public.candidatos FOR SELECT USING (
  id IN (
    SELECT c.candidato_id FROM public.candidaturas c
    INNER JOIN public.vagas v ON v.id = c.vaga_id
    INNER JOIN public.empresas e ON e.id = v.empresa_id
    WHERE e.user_id = auth.uid()
  )
);

-- Candidaturas
CREATE POLICY "Admin pode tudo em candidaturas" ON public.candidaturas FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "Empresa pode ler candidaturas de suas vagas" ON public.candidaturas FOR SELECT USING (
  vaga_id IN (SELECT id FROM public.vagas WHERE empresa_id IN (SELECT id FROM public.empresas WHERE user_id = auth.uid()))
);
CREATE POLICY "Candidato pode gerenciar proprias candidaturas" ON public.candidaturas FOR ALL 
  USING (candidato_id IN (SELECT id FROM public.candidatos WHERE user_id = auth.uid()))
  WITH CHECK (candidato_id IN (SELECT id FROM public.candidatos WHERE user_id = auth.uid()));


-- 5. Triggers e Functions

-- Criar profile automaticamente ao cadastrar user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'candidato'); -- Sempre insere como candidato para evitar Injection no raw_user_meta_data
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Atualizar campo updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_empresas_updated BEFORE UPDATE ON public.empresas FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_vagas_updated BEFORE UPDATE ON public.vagas FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_candidatos_updated BEFORE UPDATE ON public.candidatos FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

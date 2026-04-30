-- Oportunidade Leads
CREATE TABLE public.oportunidade_leads (
  id uuid primary key default gen_random_uuid(),
  nome_empresa text not null,
  nome_responsavel text not null,
  email text not null,
  telefone text not null,
  cargo_vaga text not null,
  cidade text not null,
  mensagem text,
  status text default 'novo' check (status in ('novo', 'em_contato', 'fechado', 'sem_interesse')),
  criado_em timestamptz default now(),
  atualizado_em timestamptz
);

-- Configurações do Site
CREATE TABLE public.configuracoes_site (
  chave text primary key,
  valor text not null,
  atualizado_em timestamptz default now()
);

-- Inserir valores padrão para configurações
INSERT INTO public.configuracoes_site (chave, valor) VALUES 
('whatsapp_numero', '4197010813'),
('whatsapp_mensagem', 'Olá! Tenho interesse em anunciar uma oportunidade.\n\n🏢 Empresa: {nome_empresa}\n👤 Responsável: {nome_responsavel}\n📧 E-mail: {email}\n📱 Telefone: {telefone}\n💼 Vaga: {cargo_vaga}\n📍 Cidade: {cidade}\n\n{mensagem}\n\nGostaria de saber mais informações!')
ON CONFLICT (chave) DO NOTHING;

-- Habilitar RLS
ALTER TABLE public.oportunidade_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_site ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Admin pode tudo em oportunidade_leads" ON public.oportunidade_leads FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "Público pode inserir leads" ON public.oportunidade_leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin pode tudo em configuracoes_site" ON public.configuracoes_site FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "Público pode ler configurações" ON public.configuracoes_site FOR SELECT USING (true);

-- Trigger updated_at para oportunidade_leads
CREATE TRIGGER on_oportunidade_leads_updated BEFORE UPDATE ON public.oportunidade_leads FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_configuracoes_site_updated BEFORE UPDATE ON public.configuracoes_site FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

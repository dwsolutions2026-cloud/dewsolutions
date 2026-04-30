-- Adicionar novas configurações
INSERT INTO public.configuracoes_site (chave, valor) VALUES 
('prazo_retorno_texto', 'Retornamos em até 1 dia útil'),
('admin_email_notificacao', 'admin@exemplo.com')
ON CONFLICT (chave) DO NOTHING;

-- Tabela de eventos para o funil
CREATE TABLE IF NOT EXISTS public.eventos_funil (
  id uuid primary key default gen_random_uuid(),
  evento text not null,
  ip_hash text,
  criado_em timestamptz default now()
);

-- Habilitar RLS e políticas para eventos_funil
ALTER TABLE public.eventos_funil ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin pode ler eventos_funil') THEN
        CREATE POLICY "Admin pode ler eventos_funil" ON public.eventos_funil FOR SELECT USING (public.get_my_role() = 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Público pode inserir eventos_funil') THEN
        CREATE POLICY "Público pode inserir eventos_funil" ON public.eventos_funil FOR INSERT WITH CHECK (true);
    END IF;
END $$;

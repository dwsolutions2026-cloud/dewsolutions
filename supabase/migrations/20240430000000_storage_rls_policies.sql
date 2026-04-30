-- Habilitar RLS em storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para evitar conflitos em reexecuções
DROP POLICY IF EXISTS "Admin pode tudo em curriculos" ON storage.objects;
DROP POLICY IF EXISTS "Candidato pode gerenciar proprio curriculo" ON storage.objects;
DROP POLICY IF EXISTS "Empresa pode ler curriculo de candidaturas" ON storage.objects;

-- 1. Política do Admin: Acesso total ao bucket
CREATE POLICY "Admin pode tudo em curriculos" 
ON storage.objects FOR ALL 
USING (
  bucket_id = 'curriculos' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. Política do Candidato: Acesso exclusivo ao arquivo correspondente ao seu user_id
CREATE POLICY "Candidato pode gerenciar proprio curriculo" 
ON storage.objects FOR ALL 
USING (
  bucket_id = 'curriculos' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'candidato' AND
  (auth.uid()::text || '.pdf') = name
)
WITH CHECK (
  bucket_id = 'curriculos' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'candidato' AND
  (auth.uid()::text || '.pdf') = name
);

-- 3. Política da Empresa: Acesso restrito a candidatos que se candidataram em suas vagas
CREATE POLICY "Empresa pode ler curriculo de candidaturas"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'curriculos' AND 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'empresa' AND
  EXISTS (
    SELECT 1 
    FROM public.candidaturas c
    JOIN public.candidatos cand ON cand.id = c.candidato_id
    JOIN public.vagas v ON v.id = c.vaga_id
    JOIN public.empresas e ON e.id = v.empresa_id
    WHERE e.user_id = auth.uid() 
      AND (cand.user_id::text || '.pdf') = storage.objects.name
  )
);

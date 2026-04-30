-- 1. Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Admin pode tudo em curriculos" ON storage.objects;
DROP POLICY IF EXISTS "Candidato pode gerenciar proprio curriculo" ON storage.objects;
DROP POLICY IF EXISTS "Empresa pode ler curriculo de candidaturas" ON storage.objects;

-- 1. Política do Admin: Acesso total ao bucket
CREATE POLICY "Admin pode tudo em curriculos" 
ON storage.objects FOR ALL 
TO authenticated
USING (
  bucket_id = 'curriculos' AND 
  (SELECT (role = 'admin') FROM public.profiles WHERE id = auth.uid())
);

-- 2. Política do Candidato: Pode ler, subir e deletar seu próprio arquivo
-- O arquivo deve ter o nome do user_id + .pdf
CREATE POLICY "Candidato pode gerenciar proprio curriculo" 
ON storage.objects FOR ALL 
TO authenticated
USING (
  bucket_id = 'curriculos' AND 
  (auth.uid()::text || '.pdf') = name
)
WITH CHECK (
  bucket_id = 'curriculos' AND 
  (auth.uid()::text || '.pdf') = name
);

-- 3. Política da Empresa: Pode ler apenas currículos de candidatos vinculados às suas vagas
CREATE POLICY "Empresa pode ler curriculo de candidaturas"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'curriculos' AND 
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

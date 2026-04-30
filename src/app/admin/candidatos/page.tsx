import { createClient } from '@/utils/supabase/server'
import { CandidatosClient } from './CandidatosClient'

export const dynamic = 'force-dynamic'

export default async function AdminCandidatosPage() {
  const supabase = await createClient()

  const { data: empresas, error } = await supabase
    .from('empresas')
    .select(`
      id,
      nome,
      vagas (
        id,
        titulo,
        candidaturas (
          id,
          status,
          data_entrevista,
          local_entrevista,
          candidato:candidatos (
            id,
            nome,
            email,
            curriculo_url
          )
        )
      )
    `)
    .order('nome')

  return (
    <CandidatosClient
      empresas={empresas || []}
      error={error?.message}
      supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
    />
  )
}

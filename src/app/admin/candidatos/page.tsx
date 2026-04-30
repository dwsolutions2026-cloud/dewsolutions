import { createClient } from '@/utils/supabase/server'
import { CandidatosClient } from './CandidatosClient'

export const dynamic = 'force-dynamic'

export default async function AdminCandidatosPage() {
  const supabase = await createClient()

  const { data: rawEmpresas, error } = await supabase
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
            curriculo_url,
            user_id
          )
        )
      )
    `)
    .order('nome')

  // Formatar os dados para garantir que candidato seja um objeto único, não um array
  const empresas = rawEmpresas?.map(empresa => ({
    ...empresa,
    vagas: empresa.vagas.map(vaga => ({
      ...vaga,
      candidaturas: vaga.candidaturas.map(candidatura => ({
        ...candidatura,
        candidato: Array.isArray(candidatura.candidato) ? candidatura.candidato[0] : candidatura.candidato
      }))
    }))
  }))

  return (
    <CandidatosClient
      empresas={(empresas as any) || []}
      error={error?.message}
      supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
    />
  )
}

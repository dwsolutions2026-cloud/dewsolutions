import { createClient } from '@/utils/supabase/server'
import { VagasAdminClient } from './VagasAdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminVagasPage() {
  const supabase = await createClient()

  const [{ data: vagas, error }, { data: empresas }] = await Promise.all([
    supabase
      .from('vagas')
      .select(`
        id, titulo, area, cidade, estado, status, created_at,
        regime, modalidade, quantidade_vagas,
        salario_min, salario_max, exibir_salario,
        descricao, requisitos, beneficios, empresa_id,
        empresa:empresas (id, nome),
        candidaturas (count)
      `)
      .order('created_at', { ascending: false }),
    supabase.from('empresas').select('id, nome').eq('ativa', true).order('nome'),
  ])

  const formattedVagas = vagas?.map(vaga => ({
    ...vaga,
    empresa: Array.isArray(vaga.empresa) ? vaga.empresa[0] : vaga.empresa
  }))

  return (
    <VagasAdminClient
      vagas={(formattedVagas as any) || []}
      empresas={empresas || []}
      error={error?.message}
    />
  )
}

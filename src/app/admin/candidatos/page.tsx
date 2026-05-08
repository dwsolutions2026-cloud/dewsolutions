import { createClient } from '@/utils/supabase/server'
import { CandidatosClient } from './CandidatosClient'
import { checkAdmin } from '@/app/actions/admin'
import { redirect } from 'next/navigation'

export default async function AdminCandidatosPage() {
  const isAdmin = await checkAdmin()
  if (!isAdmin) redirect('/login')

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
          created_at,
          data_entrevista,
          local_entrevista,
          candidato:candidatos (
            id,
            nome,
            email,
            curriculo_url,
            avatar_url,
            user_id
          )
        )
      )
    `)

  return (
    <div className="animate-in fade-in duration-700">
      <CandidatosClient 
        empresas={empresas || []} 
        error={error?.message}
      />
    </div>
  )
}

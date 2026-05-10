import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CandidaturasListClient } from './CandidaturasListClient'

export default async function MinhasCandidaturasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // First, get the candidato record linked to the auth user
  const { data: candidato } = await supabase
    .from('candidatos')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const { data: candidaturas } = candidato
    ? await supabase
        .from('candidaturas')
        .select(`
          *,
          vaga:vagas (
            id,
            titulo,
            modalidade,
            empresa:empresas (
              nome
            )
          )
        `)
        .eq('candidato_id', candidato.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight mb-1">Minhas Candidaturas</h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">
          Acompanhe o status dos processos seletivos que você está participando.
        </p>
      </div>

      <CandidaturasListClient initialData={candidaturas || []} candidatoId={candidato?.id} />
    </div>
  )
}

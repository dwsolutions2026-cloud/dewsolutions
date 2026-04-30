import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PerfilEditarClient } from './PerfilEditarClient'

export default async function PerfilEditarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: candidato } = await supabase
    .from('candidatos')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!candidato) redirect('/candidato/minha-area')

  return (
    <div className="animate-in fade-in duration-700">
      <PerfilEditarClient initialData={candidato} />
    </div>
  )
}

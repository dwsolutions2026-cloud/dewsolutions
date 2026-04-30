import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PerfilEditarClient } from './PerfilEditarClient'

export const metadata = {
  title: 'Editar Perfil | D&W Solutions',
}

export default async function PerfilEditarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: candidato } = await supabase
    .from('candidatos')
    .select('nome, telefone, cidade, estado')
    .eq('user_id', user.id)
    .single()

  if (!candidato) {
    return <div className="p-8">Perfil não encontrado.</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Informações Pessoais</h1>
        <p className="text-muted-foreground mt-2">Atualize seus dados de contato e localização para que as empresas possam te encontrar facilmente.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <PerfilEditarClient initialData={candidato} />
      </div>
    </div>
  )
}

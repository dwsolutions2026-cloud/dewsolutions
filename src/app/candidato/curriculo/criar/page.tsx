import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CurriculoBuilderClient } from '@/components/vagas/CurriculoBuilderClient'

export const metadata = {
  title: 'Criar Currículo | D&W Solutions',
}

export default async function CurriculoCriarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: candidato } = await supabase
    .from('candidatos')
    .select('user_id, curriculo_json, curriculo_url')
    .eq('user_id', user.id)
    .single()

  if (!candidato) {
    return <div className="p-8 text-center">Perfil do candidato não encontrado.</div>
  }

  // Se já tem currículo, redireciona para editar
  if (candidato.curriculo_json || candidato.curriculo_url) {
    redirect('/candidato/curriculo/editar')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Criar Currículo</h1>
        <p className="text-muted-foreground mt-2">
          Preencha suas informações para criar seu currículo no sistema.
        </p>
      </div>

      <CurriculoBuilderClient 
        initialData={null} 
        userId={user.id} 
      />
    </div>
  )
}

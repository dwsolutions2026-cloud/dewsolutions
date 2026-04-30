import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CurriculoBuilderClient } from '@/components/vagas/CurriculoBuilderClient'

export const metadata = {
  title: 'Meu Currículo | D&W Solutions',
}

export default async function CurriculoEditarPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Meu Currículo</h1>
        <p className="text-muted-foreground mt-2">
          Mantenha seus dados profissionais atualizados para atrair as melhores oportunidades.
        </p>
      </div>

      <CurriculoBuilderClient 
        initialData={candidato.curriculo_json} 
        userId={user.id} 
      />
    </div>
  )
}

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CurriculoBuilderClient } from '@/components/vagas/CurriculoBuilderClient'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CurriculoEditarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: candidato } = await supabase
    .from('candidatos')
    .select('curriculo_json')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div>
        <Link 
          href="/candidato/curriculo" 
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-4xl font-black text-primary tracking-tight">Editar Meu Currículo</h1>
        <p className="text-muted-foreground text-lg font-medium">Aprimore suas informações profissionais.</p>
      </div>

      <CurriculoBuilderClient initialData={candidato?.curriculo_json} />
    </div>
  )
}

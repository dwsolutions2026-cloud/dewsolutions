import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { VagaForm } from '@/components/vagas/VagaForm'
import { saveVagaAction } from '@/app/actions/empresa'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EmpresaNovaVagaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: empresa } = await supabase
    .from('empresas')
    .select('id, nome')
    .eq('user_id', user.id)
    .single()

  if (!empresa) redirect('/login')

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div>
        <Link 
          href="/empresa/vagas" 
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-4xl font-black text-primary tracking-tight">Publicar Nova Oportunidade</h1>
        <p className="text-muted-foreground text-lg font-medium">Preencha os detalhes da vaga para atrair os melhores talentos.</p>
      </div>

      <div className="bg-secondary rounded-[3rem] border-none p-8 md:p-12 shadow-sm">
        <VagaForm 
          empresas={[empresa]} 
          onSubmit={saveVagaAction} 
          initialData={{ empresa_id: empresa.id }}
        />
      </div>
    </div>
  )
}

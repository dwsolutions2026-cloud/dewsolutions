import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { VagaForm } from '@/components/vagas/VagaForm'
import { createVagaAdminAction } from '@/app/actions/vagas'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AdminNovaVagaPage() {
  const supabase = await createClient()
  
  const { data: empresas } = await supabase
    .from('empresas')
    .select('id, nome')
    .order('nome')

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div>
        <Link 
          href="/admin/vagas" 
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Vagas
        </Link>
        <h1 className="text-4xl font-black text-primary tracking-tight">Criar Nova Oportunidade</h1>
        <p className="text-muted-foreground text-lg font-medium">Publique uma vaga em nome de uma empresa parceira.</p>
      </div>

      <div className="bg-secondary rounded-[3rem] border-none p-8 md:p-12 shadow-sm">
        <VagaForm 
          empresas={empresas || []} 
          onSubmit={createVagaAdminAction} 
        />
      </div>
    </div>
  )
}

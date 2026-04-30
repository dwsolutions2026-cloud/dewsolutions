import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { VagaForm } from '@/components/vagas/VagaForm'

export const dynamic = 'force-dynamic'

export default async function NovaVagaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Ensure user has empresa
  const { data: empresa } = await supabase
    .from('empresas')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!empresa) redirect('/empresa/dashboard')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/empresa/vagas" className="p-2 bg-white border border-border rounded-lg text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary">Publicar Nova Vaga</h1>
          <p className="text-muted-foreground text-sm mt-1">Preencha os dados abaixo para anunciar uma nova oportunidade.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 md:p-8">
        <VagaForm empresaId={empresa.id} />
      </div>
    </div>
  )
}

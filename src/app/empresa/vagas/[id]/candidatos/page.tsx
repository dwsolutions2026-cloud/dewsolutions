import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Users, Mail, Phone, CalendarClock, FileText } from 'lucide-react'
import Link from 'next/link'
import { CandidatosListClient } from './CandidatosListClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EmpresaVagaCandidatosPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: vaga } = await supabase
    .from('vagas')
    .select('*, empresa:empresas(user_id)')
    .eq('id', id)
    .single()

  const empresaData = Array.isArray(vaga?.empresa) ? vaga.empresa[0] : vaga?.empresa

  if (!vaga || !empresaData || (empresaData as any).user_id !== user.id) {
    notFound()
  }

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: candidaturas } = await supabaseAdmin
    .from('candidaturas')
    .select(`
      id,
      status,
      created_at,
      data_entrevista,
      candidato:candidatos (
        id,
        nome,
        email,
        telefone,
        avatar_url
      )
    `)
    .eq('vaga_id', id)
    .order('created_at', { ascending: false })

  const validCandidaturas = (candidaturas || []).filter((c: any) => c && c.candidato) as any[]

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <Link 
          href="/empresa/vagas" 
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-xs mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Minhas Vagas
        </Link>
        <h1 className="text-2xl font-black text-primary tracking-tight">Candidatos Inscritos</h1>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Vaga: <span className="text-accent font-black">{vaga.titulo}</span></p>
      </div>

      <CandidatosListClient candidaturas={validCandidaturas} vagaTitulo={vaga.titulo} />
    </div>
  )
}

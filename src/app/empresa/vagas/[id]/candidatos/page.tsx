import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Users, Mail, Phone, CalendarClock, FileText } from 'lucide-react'
import Link from 'next/link'

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

  const validCandidaturas = (candidaturas || []).filter((c: any) => c && c.candidato)

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

      <div className="flex flex-col gap-4">
        {validCandidaturas && validCandidaturas.length > 0 ? (
          validCandidaturas.map((c: any) => (
            <div 
              key={c.id} 
              className="bg-secondary p-5 rounded-sm border border-border/10 hover:border-accent/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Avatar do Candidato */}
                <div className="w-12 h-12 rounded-sm overflow-hidden bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 shadow-inner">
                  {c.candidato.avatar_url ? (
                    <img src={c.candidato.avatar_url} alt={c.candidato.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent text-white text-base font-black">
                      {c.candidato.nome.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-primary group-hover:text-accent transition-colors truncate">
                      {c.candidato.nome}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest ${
                      c.status === 'aprovado' ? 'border-green-100 bg-green-50 text-green-700' :
                      c.status === 'reprovado' ? 'border-red-100 bg-red-50 text-red-700' :
                      c.status === 'entrevista' ? 'border-purple-100 bg-purple-50 text-purple-700' :
                      'border-blue-100 bg-blue-50 text-blue-700'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-accent" /> {c.candidato.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-accent" /> {c.candidato.telefone || 'Não informado'}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold">
                      Inscrito em {new Date(c.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                {c.data_entrevista && (
                  <div className="hidden lg:flex items-center gap-2 text-xs text-purple-600 font-bold border border-purple-100 bg-purple-50 px-3 py-1.5 rounded-sm mr-2">
                    <CalendarClock className="w-3.5 h-3.5" /> 
                    {new Date(c.data_entrevista).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                )}
                
                <Link 
                  href={`/empresa/talentos/${c.candidato.id}`}
                  className="px-4 py-2 bg-muted text-primary hover:bg-primary hover:text-white rounded-sm font-black text-[10px] transition-all uppercase tracking-wider"
                >
                  Ver Perfil
                </Link>
                <button className="px-4 py-2 border border-border text-muted-foreground hover:bg-muted rounded-sm font-black text-[10px] transition-all uppercase tracking-wider">
                  Gerenciar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-16 bg-secondary border-none rounded-sm text-center space-y-4 shadow-sm opacity-70">
            <Users className="mx-auto h-12 w-12 opacity-20 mb-2 text-muted-foreground" />
            <p className="text-xl font-bold text-primary">Nenhum candidato inscrito ainda</p>
            <p className="text-xs text-muted-foreground font-medium">Sua vaga está ativa e aguardando interessados.</p>
          </div>
        )}
      </div>
    </div>
  )
}

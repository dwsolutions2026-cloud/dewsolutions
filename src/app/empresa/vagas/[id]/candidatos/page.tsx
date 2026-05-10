import { createClient } from '@/utils/supabase/server'
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

  const { data: candidaturas } = await supabase
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
    <div className="space-y-12 animate-in fade-in duration-700">
      <div>
        <Link 
          href="/empresa/vagas" 
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Minhas Vagas
        </Link>
        <h1 className="text-4xl font-black text-primary tracking-tight">Candidatos Inscritos</h1>
        <p className="text-muted-foreground text-lg font-medium">Vaga: <span className="text-primary font-bold">{vaga.titulo}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {validCandidaturas && validCandidaturas.length > 0 ? (
          validCandidaturas.map((c: any) => (
            <div key={c.id} className="bg-secondary p-8 rounded-[2.5rem] border-none shadow-sm flex flex-col group hover:border-accent/30 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {/* Avatar do Candidato */}
                  <div className="w-14 h-14 rounded-sm overflow-hidden bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    {c.candidato.avatar_url ? (
                      <img src={c.candidato.avatar_url} alt={c.candidato.nome} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent text-white text-xl font-black">
                        {c.candidato.nome.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">{c.candidato.nome}</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Inscrito em {new Date(c.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  c.status === 'aprovado' ? 'bg-green-100 text-green-700' :
                  c.status === 'reprovado' ? 'bg-red-100 text-red-700' :
                  c.status === 'entrevista' ? 'bg-purple-100 text-purple-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {c.status}
                </span>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                  <Mail className="w-4 h-4 text-accent" /> {c.candidato.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                  <Phone className="w-4 h-4 text-accent" /> {c.candidato.telefone || 'Não informado'}
                </div>
                {c.data_entrevista && (
                  <div className="flex items-center gap-3 text-sm text-purple-600 font-bold">
                    <CalendarClock className="w-4 h-4" /> 
                    Entrevista: {new Date(c.data_entrevista).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                )}
              </div>

              <div className="mt-auto flex gap-2">
                <Link 
                  href={`/empresa/talentos/${c.candidato.id}`}
                  className="flex-1 py-3 bg-muted text-primary hover:bg-primary hover:text-white rounded-sm font-bold text-xs text-center transition-all"
                >
                  Ver Perfil
                </Link>
                <button className="flex-1 py-3 border border-border text-muted-foreground hover:bg-muted rounded-sm font-bold text-xs transition-all">
                  Gerenciar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-20 bg-secondary border-none rounded-[3rem] text-center space-y-4 shadow-sm">
            <Users className="mx-auto h-16 w-16 opacity-20 mb-4 text-muted-foreground" />
            <p className="text-2xl font-bold text-primary">Nenhum candidato inscrito ainda</p>
            <p className="text-muted-foreground font-medium">Sua vaga está ativa e aguardando interessados.</p>
          </div>
        )}
      </div>
    </div>
  )
}

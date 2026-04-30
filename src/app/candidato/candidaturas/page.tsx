import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Briefcase, MapPin, Building2, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function MinhasCandidaturasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: candidaturas } = await supabase
    .from('candidaturas')
    .select(`
      *,
      vaga:vagas (
        id,
        titulo,
        cidade,
        estado,
        empresa:empresas (nome)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight mb-1">Minhas Candidaturas</h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">Acompanhe o status de suas aplicações.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {candidaturas && candidaturas.length > 0 ? (
          candidaturas.map((cand: any) => (
            <div key={cand.id} className="bg-card p-5 rounded-2xl border border-border hover:border-accent/20 shadow-sm transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-inner shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-primary mb-0.5 truncate">{cand.vaga?.titulo}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {cand.vaga?.empresa?.nome}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {cand.vaga?.cidade} - {cand.vaga?.estado}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 lg:border-l lg:border-border lg:pl-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-muted-foreground mb-1 opacity-60">Status</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                      cand.status === 'aprovado' ? 'bg-green-50 text-green-600 border-green-100' :
                      cand.status === 'reprovado' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {cand.status}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-muted-foreground mb-1 opacity-60">Candidatado em</span>
                    <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                      <Clock className="w-3 h-3 text-accent" />
                      {new Date(cand.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <Link 
                    href={`/vagas/${cand.vaga_id}`}
                    className="p-2 bg-muted text-primary hover:bg-primary hover:text-white rounded-lg transition-all ml-auto lg:ml-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 bg-card border border-border rounded-[2.5rem] text-center space-y-4 shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 opacity-20 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-xl font-bold text-primary">Nenhuma candidatura ainda</p>
              <p className="text-sm text-muted-foreground font-medium opacity-60">Explore as vagas disponíveis e comece sua jornada hoje!</p>
            </div>
            <Link 
              href="/vagas"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-accent/20 hover:scale-105 transition-all"
            >
              Ver Vagas Disponíveis
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

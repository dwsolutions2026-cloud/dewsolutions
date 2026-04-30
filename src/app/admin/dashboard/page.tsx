import { createClient } from '@/utils/supabase/server'
import { Users, Briefcase, Building2, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Buscar estatísticas
  const [
    { count: totalVagas },
    { count: totalCandidatos },
    { count: totalEmpresas },
    { data: ultimasCandidaturas }
  ] = await Promise.all([
    supabase.from('vagas').select('*', { count: 'exact', head: true }),
    supabase.from('candidatos').select('*', { count: 'exact', head: true }),
    supabase.from('empresas').select('*', { count: 'exact', head: true }),
    supabase.from('candidaturas').select(`
      id,
      created_at,
      status,
      candidato:candidatos(nome),
      vaga:vagas(titulo)
    `).order('created_at', { ascending: false }).limit(5)
  ])

  const stats = [
    { label: 'Total de Vagas', value: totalVagas || 0, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Candidatos', value: totalCandidatos || 0, icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Empresas', value: totalEmpresas || 0, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-100' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight mb-1">Dashboard Administrativo</h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">Visão geral do desempenho da plataforma.</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-[1.5rem] border border-border shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-20 -mr-12 -mt-12 rounded-full group-hover:scale-110 transition-transform`} />
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades Recentes */}
        <div className="bg-card rounded-[2rem] border border-border p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-black text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" /> Últimas Candidaturas
            </h2>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="space-y-3 flex-1">
            {ultimasCandidaturas?.map((cand: any) => (
              <div key={cand.id} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/10 border border-border/50 group hover:border-accent/30 transition-all">
                <div className="space-y-0.5">
                  <p className="font-bold text-primary text-xs group-hover:text-accent transition-colors">{cand.candidato?.nome}</p>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{cand.vaga?.titulo}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-muted-foreground font-bold">{new Date(cand.created_at).toLocaleDateString('pt-BR')}</p>
                  <span className="text-[8px] font-black uppercase text-accent tracking-tighter">{cand.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-primary rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent opacity-20 blur-3xl -mr-24 -mt-24" />
          <h2 className="text-xl font-bold mb-6 relative">Ações Rápidas</h2>
          <div className="grid grid-cols-1 gap-3 relative">
            <Link 
              href="/admin/vagas" 
              className="w-full py-3 px-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-sm flex items-center justify-between group transition-all"
            >
              Gerenciar Vagas <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/admin/empresas/nova" 
              className="w-full py-3 px-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-sm flex items-center justify-between group transition-all"
            >
              Cadastrar Nova Empresa <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/admin/talentos" 
              className="w-full py-3 px-5 bg-accent text-accent-foreground rounded-xl font-black text-sm flex items-center justify-between group transition-all"
            >
              Ver Banco de Talentos <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

import { createClient } from '@/utils/supabase/server'
import { LeadsAdminClient } from './LeadsAdminClient'
import { TrendingUp, CheckCircle2, Clock, Send, Search, Filter, Eye, MessageSquare } from 'lucide-react'
import Form from 'next/form'

export default async function AdminOportunidadesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string, status?: string }>
}) {
  const { q, status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('oportunidade_leads')
    .select('*')
    .order('criado_em', { ascending: false })

  if (q) {
    query = query.or(`nome_empresa.ilike.%${q}%,nome_responsavel.ilike.%${q}%`)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data: leads, error } = await query

  // Stats
  const { data: statsData } = await supabase.from('oportunidade_leads').select('status, criado_em')
  
  const totalLeads = statsData?.length || 0
  const novos24h = statsData?.filter(l => new Date(l.criado_em) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length || 0
  const emContato = statsData?.filter(l => l.status === 'em_contato').length || 0
  const fechadosMes = statsData?.filter(l => l.status === 'fechado' && new Date(l.criado_em).getMonth() === new Date().getMonth()).length || 0

  // Funnel Stats (Last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data: funnelData } = await supabase
    .from('eventos_funil')
    .select('evento')
    .gte('criado_em', thirtyDaysAgo)

  const funnel = {
    visualizaram: funnelData?.filter(e => e.evento === 'pagina_visualizada').length || 0,
    submeteram: funnelData?.filter(e => e.evento === 'formulario_submetido').length || 0,
    abriram: funnelData?.filter(e => e.evento === 'whatsapp_aberto').length || 0,
    leads: totalLeads
  }

  const stats = [
    { label: 'Total de Leads', value: totalLeads, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Novos (24h)', value: novos24h, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Em Contato', value: emContato, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Fechados (Mês)', value: fechadosMes, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Empresas Interessadas</h1>
          <p className="text-muted-foreground text-sm font-medium">Gestão de leads captados pela página de "Anunciar Oportunidade".</p>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={`/api/admin/oportunidade-leads/exportar?q=${q || ''}&status=${status || ''}`}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            📥 Exportar CSV
          </a>
        </div>
      </div>

      {/* Funil de Conversão */}
      <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-6">
        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" /> Funil de Conversão (Últimos 30 dias)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Visualizaram a página', value: funnel.visualizaram, icon: Eye, color: 'text-muted-foreground' },
            { label: 'Submeteram form', value: funnel.submeteram, icon: Send, color: 'text-blue-500', pct: funnel.visualizaram ? Math.round((funnel.submeteram / funnel.visualizaram) * 100) : 0 },
            { label: 'Abriram WhatsApp', value: funnel.abriram, icon: MessageSquare, color: 'text-green-500', pct: funnel.submeteram ? Math.round((funnel.abriram / funnel.submeteram) * 100) : 0 },
            { label: 'Viraram Leads', value: funnel.leads, icon: CheckCircle2, color: 'text-accent', pct: 100 },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-muted/20 border border-border/50 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{item.label}</p>
                <p className="text-xl font-black text-primary flex items-baseline gap-2">
                  {item.value}
                  {item.pct !== undefined && <span className="text-[10px] text-accent">({item.pct}%)</span>}
                </p>
              </div>
              <item.icon className={`absolute -right-2 -bottom-2 w-12 h-12 ${item.color} opacity-5 group-hover:scale-110 transition-transform`} />
            </div>
          ))}
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-4xl border border-border shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">{stat.label}</p>
              <p className="text-2xl font-black text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros Unificados */}
      <Form action="" className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Busca</label>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Empresa ou responsável..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-1.5">
          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Status</label>
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <select
              name="status"
              defaultValue={status}
              onChange={(e) => e.target.form?.requestSubmit()}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
            >
              <option value="">Todos</option>
              <option value="novo">Novo</option>
              <option value="em_contato">Em Contato</option>
              <option value="fechado">Fechado</option>
              <option value="sem_interesse">Sem Interesse</option>
            </select>
          </div>
        </div>
        
        {/* Manter o estado da busca ao mudar o status e vice-versa é automático com o Form do Next.js se ambos estiverem no mesmo form */}
      </Form>

      {error ? (
        <div className="p-10 bg-red-50 text-red-500 rounded-2xl text-center border border-red-100 font-bold text-sm">
          Erro ao carregar leads: {error.message}
        </div>
      ) : (
        <LeadsAdminClient leads={leads || []} />
      )}
    </div>
  )
}

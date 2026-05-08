import { createClient } from '@/utils/supabase/server'
import { Users, Briefcase, Building2, TrendingUp, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { UltimasCandidaturasClient } from './UltimasCandidaturasClient'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalVagas },
    { count: totalCandidatos },
    { count: totalEmpresas },
    { count: totalCandidaturas },
    { data: ultimasCandidaturas },
  ] = await Promise.all([
    supabase.from('vagas').select('*', { count: 'exact', head: true }),
    supabase.from('candidatos').select('*', { count: 'exact', head: true }),
    supabase.from('empresas').select('*', { count: 'exact', head: true }),
    supabase.from('candidaturas').select('*', { count: 'exact', head: true }),
    supabase
      .from('candidaturas')
      .select(
        `
        id,
        created_at,
        status,
        candidato:candidatos(nome),
        vaga:vagas(
          titulo,
          empresa:empresas(nome)
        )
      `
      )
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  const stats = [
    {
      label: 'Vagas Publicadas',
      value: totalVagas ?? 0,
      icon: Briefcase,
      color: 'text-blue-700 dark:text-blue-300',
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      href: '/admin/vagas',
    },
    {
      label: 'Candidatos',
      value: totalCandidatos ?? 0,
      icon: Users,
      color: 'text-amber-700 dark:text-amber-300',
      bg: 'bg-amber-100 dark:bg-amber-900/40',
      href: '/admin/candidatos',
    },
    {
      label: 'Empresas',
      value: totalEmpresas ?? 0,
      icon: Building2,
      color: 'text-purple-700 dark:text-purple-300',
      bg: 'bg-purple-100 dark:bg-purple-900/40',
      href: '/admin/empresas',
    },
    {
      label: 'Candidaturas',
      value: totalCandidaturas ?? 0,
      icon: TrendingUp,
      color: 'text-green-700 dark:text-green-300',
      bg: 'bg-green-100 dark:bg-green-900/40',
      href: '/admin/candidatos',
    },
  ]

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    inscrito: { label: 'Inscrito', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    em_analise: { label: 'Em análise', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    entrevista: { label: 'Entrevista', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    reprovado: { label: 'Reprovado', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  }

  return (
    <div className="animate-in space-y-8 fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-primary">
          Painel Administrativo
        </h1>
        <p className="text-sm font-medium text-muted-foreground">
          Acompanhe as vagas, empresas parceiras e o volume de candidaturas da plataforma.
        </p>
      </div>

      {/* KPIs — 4 cards com contraste adequado */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative overflow-hidden rounded-sm border-none bg-secondary p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div
              className={`absolute right-0 top-0 -mr-10 -mt-10 h-20 w-20 rounded-full ${stat.bg} opacity-30 transition-transform group-hover:scale-110`}
            />
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-sm ${stat.bg} ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-primary">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Últimas candidaturas */}
        <div className="flex flex-col rounded-sm border-none bg-secondary p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-black text-primary">
              <Clock className="h-4 w-4 text-accent" /> Últimas candidaturas
            </h2>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>

          <UltimasCandidaturasClient initialData={ultimasCandidaturas as any} />
        </div>

        {/* Ações rápidas */}
        <div className="relative overflow-hidden rounded-sm bg-secondary p-8 text-primary shadow-sm border-none">
          <div className="absolute right-0 top-0 -mr-24 -mt-24 h-48 w-48 bg-accent opacity-5 blur-3xl" />
          <div className="relative space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-black">Ações rápidas</h2>
              <p className="max-w-md text-sm text-muted-foreground font-medium">
                Acesse os fluxos principais para manter a operação de vagas e empresas organizada.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/admin/vagas"
                className="flex items-center justify-between rounded-sm bg-background/50 px-5 py-3 text-sm font-bold transition-all hover:bg-background/80 hover:text-accent border-none"
              >
                Gerenciar vagas <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/admin/empresas/nova"
                className="flex items-center justify-between rounded-sm bg-background/50 px-5 py-3 text-sm font-bold transition-all hover:bg-background/80 hover:text-accent border-none"
              >
                Cadastrar empresa <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/admin/talentos"
                className="flex items-center justify-between rounded-sm bg-accent px-5 py-3 text-sm font-black text-white transition-all hover:opacity-90"
              >
                Ver banco de talentos <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/admin/oportunidades"
                className="flex items-center justify-between rounded-sm bg-background/50 px-5 py-3 text-sm font-bold transition-all hover:bg-background/80 hover:text-accent border-none"
              >
                Leads de Empresas <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


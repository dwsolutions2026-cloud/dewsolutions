import { createClient } from '@/utils/supabase/server'
import { Briefcase, Users, TrendingUp, PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default async function EmpresaDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: empresa } = await supabase
    .from('empresas')
    .select('id, nome')
    .eq('user_id', user.id)
    .single()

  if (!empresa) {
    return (
      <div className="rounded-sm border-none bg-secondary p-8 text-center text-sm font-bold text-muted-foreground">
        Empresa não encontrada. Entre em contato com o administrador para
        concluir a configuração do seu acesso.
      </div>
    )
  }

  const { count: totalVagas } = await supabase
    .from('vagas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresa.id)

  const { data: vagasComCandidaturas } = await supabase
    .from('vagas')
    .select(`
      id,
      titulo,
      candidaturas (status)
    `)
    .eq('empresa_id', empresa.id)

  const totalCandidaturas = vagasComCandidaturas?.reduce((acc, vaga) => acc + (vaga.candidaturas?.length || 0), 0) || 0

  // Calculate funnel metrics
  const funil = {
    inscrito: 0,
    em_analise: 0,
    entrevista: 0,
    aprovado: 0,
    reprovado: 0
  }

  vagasComCandidaturas?.forEach(vaga => {
    vaga.candidaturas?.forEach((cand: any) => {
      if (cand.status in funil) {
        funil[cand.status as keyof typeof funil]++
      }
    })
  })

  return (
    <div className="animate-in space-y-8 fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-primary">
          Olá, {empresa.nome}
        </h1>
        <p className="text-sm font-medium text-muted-foreground opacity-80">
          Gerencie suas oportunidades e acompanhe os candidatos recebidos pela
          plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="group flex items-center gap-5 rounded-sm border-none bg-secondary p-6 shadow-sm transition-all hover:border-accent/30">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-accent/10 text-accent transition-transform group-hover:scale-110">
            <Briefcase className="h-7 w-7" />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
              Vagas Publicadas
            </p>
            <p className="text-3xl font-black leading-none text-primary">
              {totalVagas || 0}
            </p>
          </div>
        </div>

        <div className="group flex items-center gap-5 rounded-sm border-none bg-secondary p-6 shadow-sm transition-all hover:border-accent/30">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-purple-100 text-purple-600 transition-transform group-hover:scale-110 dark:bg-purple-900/20">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
              Total de Candidaturas
            </p>
            <p className="text-3xl font-black leading-none text-primary">
              {totalCandidaturas}
            </p>
          </div>
        </div>
      </div>

      {/* Funil de Candidatos */}
      <div className="bg-secondary rounded-sm p-8 shadow-sm border-none">
        <div className="mb-6">
          <h2 className="text-lg font-black tracking-tight text-primary mb-1">Funil de Candidatos</h2>
          <p className="text-xs font-medium text-muted-foreground">Acompanhe a taxa de conversão geral das suas vagas ativas e inativas.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-blue-600 dark:text-blue-400">Inscritos</span>
              <span>{funil.inscrito}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: totalCandidaturas ? `${(funil.inscrito / totalCandidaturas) * 100}%` : '0%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-amber-600 dark:text-amber-400">Em Análise</span>
              <span>{funil.em_analise}</span>
            </div>
            <div className="h-2 w-11/12 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: totalCandidaturas ? `${(funil.em_analise / totalCandidaturas) * 100}%` : '0%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-purple-600 dark:text-purple-400">Em Entrevista</span>
              <span>{funil.entrevista}</span>
            </div>
            <div className="h-2 w-4/5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: totalCandidaturas ? `${(funil.entrevista / totalCandidaturas) * 100}%` : '0%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-green-600 dark:text-green-400">Aprovados</span>
              <span>{funil.aprovado}</span>
            </div>
            <div className="h-2 w-2/3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: totalCandidaturas ? `${(funil.aprovado / totalCandidaturas) * 100}%` : '0%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-sm bg-secondary border border-border/40 p-8 text-primary shadow-xl md:p-12">
        <div className="absolute right-0 top-0 -mr-24 -mt-24 h-48 w-48 bg-accent opacity-10 blur-3xl" />
        <div className="relative max-w-xl">
          <h2 className="mb-3 flex items-center gap-2.5 text-2xl font-black tracking-tight text-primary">
            <TrendingUp className="h-6 w-6 text-accent" /> Expanda seu time
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground font-medium">
            Precisa contratar? Publique uma nova vaga e comece a receber
            candidaturas qualificadas pelo painel da empresa.
          </p>
          <Link
            href="/empresa/vagas/nova"
            className="inline-flex items-center gap-2.5 rounded-sm bg-accent px-8 py-3 text-sm font-black text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:scale-105"
          >
            <PlusCircle className="h-4 w-4" /> Publicar vaga
          </Link>
        </div>
      </div>
    </div>
  )
}

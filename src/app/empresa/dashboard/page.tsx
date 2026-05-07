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
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm font-bold text-muted-foreground">
        Empresa não encontrada. Entre em contato com o administrador para
        concluir a configuração do seu acesso.
      </div>
    )
  }

  const { count: totalVagas } = await supabase
    .from('vagas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresa.id)

  const { data: vagasIds } = await supabase
    .from('vagas')
    .select('id')
    .eq('empresa_id', empresa.id)

  const { count: totalCandidaturas } = await supabase
    .from('candidaturas')
    .select('*', { count: 'exact', head: true })
    .in('vaga_id', vagasIds?.map((vaga) => vaga.id) || [])

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
        <div className="group flex items-center gap-5 rounded-4xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent/30">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
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

        <div className="group flex items-center gap-5 rounded-4xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent/30">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 transition-transform group-hover:scale-110 dark:bg-purple-900/20">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
              Total de Candidaturas
            </p>
            <p className="text-3xl font-black leading-none text-primary">
              {totalCandidaturas || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-4xl bg-primary p-8 text-white shadow-xl shadow-primary/20 md:p-12">
        <div className="absolute right-0 top-0 -mr-24 -mt-24 h-48 w-48 bg-accent opacity-20 blur-3xl" />
        <div className="relative max-w-xl">
          <h2 className="mb-3 flex items-center gap-2.5 text-2xl font-black tracking-tight">
            <TrendingUp className="h-6 w-6 text-accent" /> Expanda seu time
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-white/75">
            Precisa contratar? Publique uma nova vaga e comece a receber
            candidaturas qualificadas pelo painel da empresa.
          </p>
          <Link
            href="/empresa/vagas/nova"
            className="inline-flex items-center gap-2.5 rounded-xl bg-accent px-8 py-3 text-sm font-black text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:scale-105"
          >
            <PlusCircle className="h-4 w-4" /> Publicar vaga
          </Link>
        </div>
      </div>
    </div>
  )
}

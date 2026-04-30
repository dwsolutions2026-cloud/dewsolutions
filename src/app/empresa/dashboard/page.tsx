import { createClient } from '@/utils/supabase/server'
import { Briefcase, Users, TrendingUp, PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default async function EmpresaDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: empresa } = await supabase
    .from('empresas')
    .select('id, nome')
    .eq('user_id', user.id)
    .single()

  if (!empresa) return (
    <div className="p-8 bg-card border border-border rounded-2xl text-center font-bold text-sm text-muted-foreground">
      Empresa não encontrada. Entre em contato com o administrador.
    </div>
  )

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
    .in('vaga_id', vagasIds?.map(v => v.id) || [])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight mb-1">
          Olá, {empresa.nome}
        </h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">Gerencie suas oportunidades e acompanhe os candidatos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-card p-6 rounded-4xl border border-border shadow-sm flex items-center gap-5 group hover:border-accent/30 transition-all">
          <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform shrink-0">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Vagas Publicadas</p>
            <p className="text-3xl font-black text-primary leading-none">{totalVagas || 0}</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-4xl border border-border shadow-sm flex items-center gap-5 group hover:border-accent/30 transition-all">
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Total de Candidatos</p>
            <p className="text-3xl font-black text-primary leading-none">{totalCandidaturas || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-primary rounded-4xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent opacity-20 blur-3xl -mr-24 -mt-24" />
        <div className="max-w-xl relative">
          <h2 className="text-2xl font-black mb-3 flex items-center gap-2.5 tracking-tight">
            <TrendingUp className="w-6 h-6 text-accent" /> Expanda seu Time
          </h2>
          <p className="text-white/70 text-sm mb-8 leading-relaxed">
            Precisa de novos talentos? Publique uma nova vaga e comece a receber candidaturas qualificadas agora mesmo.
          </p>
          <Link 
            href="/empresa/vagas/nova"
            className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-8 py-3 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-accent/20"
          >
            <PlusCircle className="w-4 h-4" /> Publicar Oportunidade
          </Link>
        </div>
      </div>
    </div>
  )
}

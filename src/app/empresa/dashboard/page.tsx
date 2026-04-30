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

  if (!empresa) return <div>Empresa não encontrada</div>

  const { count: totalVagas } = await supabase
    .from('vagas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresa.id)

  const { data: candidaturas } = await supabase
    .from('candidaturas')
    .select('id', { count: 'exact', head: true })
    .in('vaga_id', (await supabase.from('vagas').select('id').eq('empresa_id', empresa.id)).data?.map(v => v.id) || [])

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-primary mb-2">Bem-vinda, {empresa.nome}</h1>
        <p className="text-muted-foreground text-lg font-medium">Gerencie suas oportunidades e talentos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm flex items-center gap-8 group hover:border-accent/40 transition-all">
          <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <Briefcase className="w-10 h-10" />
          </div>
          <div>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Vagas Publicadas</p>
            <p className="text-5xl font-black text-primary">{totalVagas || 0}</p>
          </div>
        </div>

        <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm flex items-center gap-8 group hover:border-accent/40 transition-all">
          <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
            <Users className="w-10 h-10" />
          </div>
          <div>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total de Candidatos</p>
            <p className="text-5xl font-black text-primary">{candidaturas?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-primary rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-20 blur-3xl -mr-32 -mt-32" />
        <div className="max-w-xl relative">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-accent" /> Expanda seu Time
          </h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            Precisa de novos talentos? Publique uma nova vaga e comece a receber candidaturas qualificadas agora mesmo.
          </p>
          <Link 
            href="/empresa/vagas/nova"
            className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-accent/20"
          >
            <PlusCircle className="w-5 h-5" /> Publicar Oportunidade
          </Link>
        </div>
      </div>
    </div>
  )
}

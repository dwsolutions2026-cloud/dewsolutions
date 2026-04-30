import { createClient } from '@/utils/supabase/server'
import { Briefcase, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function EmpresaDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get empresa id
  const { data: empresa } = await supabase
    .from('empresas')
    .select('id, nome')
    .eq('user_id', user.id)
    .single()

  if (!empresa) return <div>Acesso negado. Perfil de empresa não encontrado.</div>

  // Métricas
  const { count: vagasAtivasCount } = await supabase
    .from('vagas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresa.id)
    .eq('status', 'ativa')

  const { count: candidaturasCount } = await supabase
    .from('candidaturas')
    .select('*, vagas!inner(empresa_id)', { count: 'exact', head: true })
    .eq('vagas.empresa_id', empresa.id)

  // Candidaturas recentes
  const { data: candidaturasRecentes } = await supabase
    .from('candidaturas')
    .select(`
      id,
      created_at,
      candidato:candidatos(nome, cidade, estado),
      vaga:vagas!inner(id, titulo, empresa_id)
    `)
    .eq('vagas.empresa_id', empresa.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Olá, {empresa.nome}</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo ao seu painel de recrutamento.</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Vagas Ativas</p>
            <p className="text-2xl font-bold text-primary">{vagasAtivasCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total de Candidaturas</p>
            <p className="text-2xl font-bold text-primary">{candidaturasCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Performance</p>
            <p className="text-2xl font-bold text-primary">Alta</p>
          </div>
        </div>
      </div>

      {/* Candidaturas Recentes */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">Candidaturas Recentes</h2>
          <Link href="/empresa/vagas" className="text-sm font-medium text-accent hover:underline">
            Ver todas as vagas
          </Link>
        </div>
        
        {candidaturasRecentes && candidaturasRecentes.length > 0 ? (
          <div className="divide-y divide-border">
            {candidaturasRecentes.map((cand: any) => (
              <div key={cand.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-semibold text-primary">{(Array.isArray(cand.candidato) ? cand.candidato[0] : cand.candidato)?.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    Candidatou-se a: <span className="font-medium">{(Array.isArray(cand.vaga) ? cand.vaga[0] : cand.vaga)?.titulo}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(Array.isArray(cand.candidato) ? cand.candidato[0] : cand.candidato)?.cidade} - {(Array.isArray(cand.candidato) ? cand.candidato[0] : cand.candidato)?.estado} • {new Date(cand.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Link 
                  href={`/empresa/vagas/${cand.vaga.id}/candidatos`}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors text-center"
                >
                  Ver Perfil
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Ainda não há candidaturas recentes para suas vagas.
          </div>
        )}
      </div>
    </div>
  )
}

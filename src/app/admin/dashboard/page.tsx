import { createClient } from '@/utils/supabase/server'
import { Briefcase, Building2, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { count: empresasCount } = await supabase.from('empresas').select('*', { count: 'exact', head: true })
  const { count: vagasCount } = await supabase.from('vagas').select('*', { count: 'exact', head: true })
  const { count: candidatosCount } = await supabase.from('candidatos').select('*', { count: 'exact', head: true })

  const { data: vagasRecentes } = await supabase
    .from('vagas')
    .select('id, titulo, status, created_at, empresa:empresas(nome)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-primary">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo ao painel administrativo D&W Solutions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Empresas</p>
            <p className="text-2xl font-bold text-primary">{empresasCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total de Vagas</p>
            <p className="text-2xl font-bold text-primary">{vagasCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Candidatos</p>
            <p className="text-2xl font-bold text-primary">{candidatosCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Atividade</p>
            <p className="text-2xl font-bold text-primary">Alta</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold font-serif text-primary">Vagas Recentes</h2>
          <Link href="/admin/vagas" className="text-sm font-medium text-accent hover:underline">
            Ver todas
          </Link>
        </div>
        
        {vagasRecentes && vagasRecentes.length > 0 ? (
          <div className="divide-y divide-border">
            {vagasRecentes.map((vaga: any) => (
              <div key={vaga.id} className="p-6 flex justify-between items-center hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-semibold text-primary">{vaga.titulo}</p>
                  <p className="text-sm text-muted-foreground">
                    {vaga.empresa.nome} • {new Date(vaga.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  vaga.status === 'ativa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {vaga.status === 'ativa' ? 'Ativa' : 'Encerrada'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Nenhuma vaga cadastrada.
          </div>
        )}
      </div>
    </div>
  )
}

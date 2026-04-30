import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Users, Edit, ExternalLink, Briefcase } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EmpresaVagasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get empresa id
  const { data: empresa } = await supabase
    .from('empresas')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!empresa) return <div>Acesso negado.</div>

  // Fetch vagas with candidates count
  const { data: vagas, error } = await supabase
    .from('vagas')
    .select(`
      id,
      titulo,
      cidade,
      estado,
      status,
      created_at,
      candidaturas (count)
    `)
    .eq('empresa_id', empresa.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Minhas Vagas</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus anúncios e acompanhe os candidatos.</p>
        </div>
        <Link 
          href="/empresa/vagas/nova"
          className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Vaga
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-500">Erro ao carregar vagas.</div>
        ) : vagas && vagas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Cargo</th>
                  <th className="p-4 font-medium">Localização</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-center">Candidatos</th>
                  <th className="p-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vagas.map((vaga: any) => {
                  const candidaturasCount = vaga.candidaturas[0]?.count || 0
                  
                  return (
                    <tr key={vaga.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-primary">{vaga.titulo}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Criada em {new Date(vaga.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {vaga.cidade} - {vaga.estado}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          vaga.status === 'ativa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {vaga.status === 'ativa' ? 'Ativa' : 'Encerrada'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <Users className="w-4 h-4" />
                          {candidaturasCount}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/vagas/${vaga.id}`}
                            target="_blank"
                            title="Ver vaga pública"
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link 
                            href={`/empresa/vagas/${vaga.id}/editar`}
                            title="Editar vaga"
                            className="p-2 text-muted-foreground hover:text-accent transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <Link 
                            href={`/empresa/vagas/${vaga.id}/candidatos`}
                            className="ml-2 text-sm font-medium bg-primary text-white px-3 py-1.5 rounded hover:bg-primary/90 transition-colors"
                          >
                            Ver Candidatos
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-primary mb-2">Nenhuma vaga publicada</h3>
            <p className="text-muted-foreground mb-6">Crie sua primeira vaga para começar a receber currículos.</p>
            <Link 
              href="/empresa/vagas/nova"
              className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Publicar Vaga
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

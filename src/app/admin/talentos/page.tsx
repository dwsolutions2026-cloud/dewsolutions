import { createClient } from '@/utils/supabase/server'
import { Users, Search, MapPin, FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { DeleteCandidatoButton } from '@/components/admin/DeleteCandidatoButton'

export default async function AdminTalentosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()
  const query = q || ''

  let dbQuery = supabase
    .from('candidatos')
    .select(`
      *,
      candidaturas (count)
    `)
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`nome.ilike.%${query}%,email.ilike.%${query}%,cidade.ilike.%${query}%`)
  }

  const { data: talentos, error } = await dbQuery

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Banco de Talentos</h1>
          <p className="text-muted-foreground">Todos os profissionais cadastrados na plataforma</p>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <form action="">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nome, e-mail ou cidade..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          />
        </form>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-500">
            <p className="font-bold">Erro ao carregar banco de talentos:</p>
            <p className="text-sm opacity-80">{error.message}</p>
          </div>
        ) : talentos && talentos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 text-sm font-semibold text-primary">Candidato</th>
                  <th className="px-6 py-4 text-sm font-semibold text-primary">Localização</th>
                  <th className="px-6 py-4 text-sm font-semibold text-primary">Currículo</th>
                  <th className="px-6 py-4 text-sm font-semibold text-primary text-center">Candidaturas</th>
                  <th className="px-6 py-4 text-sm font-semibold text-primary text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {talentos.map((talento) => (
                  <tr key={talento.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-primary">{talento.nome}</span>
                        <span className="text-xs text-muted-foreground">{talento.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        {talento.cidade ? `${talento.cidade} - ${talento.estado}` : 'Não informado'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {talento.curriculo_url ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <FileText className="w-3 h-3" />
                          PDF Anexo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          <Users className="w-3 h-3" />
                          Interno (Online)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium">{talento.candidaturas[0]?.count || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/talentos/${talento.id}`}
                          className="p-1.5 text-muted-foreground hover:text-accent rounded-md hover:bg-accent/5 transition-colors"
                          title="Ver Perfil"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <DeleteCandidatoButton 
                          candidatoId={talento.id}
                          userId={talento.user_id}
                          curriculoUrl={talento.curriculo_url}
                          nome={talento.nome}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <Users className="mx-auto h-12 w-12 opacity-20 mb-4" />
            <p>Nenhum talento encontrado no banco de dados.</p>
          </div>
        )}
      </div>
    </div>
  )
}

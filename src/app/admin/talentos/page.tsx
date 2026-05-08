import { createClient } from '@/utils/supabase/server'
import { Users, Search, MapPin, FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { DeleteCandidatoButton } from '@/components/admin/DeleteCandidatoButton'
import Form from 'next/form'

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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight">Banco de Talentos</h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">Todos os profissionais cadastrados na plataforma.</p>
      </div>

      {/* Barra de Busca */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
        <Form action="">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nome, e-mail ou cidade..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all shadow-sm text-sm font-medium"
          />
        </Form>
      </div>

      <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
        {error ? (
          <div className="p-10 text-center text-red-500 font-bold text-sm">
            <p>Erro ao carregar banco de talentos:</p>
            <p className="text-xs opacity-80">{error.message}</p>
          </div>
        ) : talentos && talentos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground w-16">Foto</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Candidato</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Localização</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Currículo</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Candidaturas</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {talentos.map((talento) => (
                  <tr key={talento.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                        {talento.avatar_url ? (
                          <img src={talento.avatar_url} alt={talento.nome} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-accent font-black text-xs">{talento.nome.charAt(0)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-primary text-sm group-hover:text-accent transition-colors">{talento.nome}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{talento.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                        <MapPin className="w-3 h-3 text-accent" />
                        {talento.cidade ? `${talento.cidade} - ${talento.estado}` : 'Não informado'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {talento.curriculo_url ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                          <FileText className="w-2.5 h-2.5" /> PDF
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                          <Users className="w-2.5 h-2.5" /> Online
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-base font-black text-primary">{talento.candidaturas[0]?.count || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/talentos/${talento.id}`}
                          className="p-2 text-muted-foreground hover:text-accent rounded-lg hover:bg-accent/10 transition-all"
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
          <div className="p-16 text-center text-muted-foreground">
            <Users className="mx-auto h-12 w-12 opacity-20 mb-4" />
            <p className="text-xl font-bold text-primary">Nenhum talento encontrado.</p>
            <p className="text-sm font-medium opacity-60">O banco de talentos será populado conforme novos usuários se cadastrarem.</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { createClient } from '@/utils/supabase/server'
import { VagaCard } from '@/components/vagas/VagaCard'
import { Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function VagasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q : ''
  const modalidade = typeof params.modalidade === 'string' ? params.modalidade : ''
  const regime = typeof params.regime === 'string' ? params.regime : ''

  const supabase = await createClient()

  let query = supabase
    .from('vagas')
    .select(`
      *,
      empresa:empresas(nome, logo_url)
    `)
    .eq('status', 'ativa')
    .order('created_at', { ascending: false })

  if (q) {
    query = query.or(`titulo.ilike.%${q}%,descricao.ilike.%${q}%`)
  }
  if (modalidade) {
    query = query.eq('modalidade', modalidade)
  }
  if (regime) {
    query = query.eq('regime', regime)
  }

  const { data: vagas, error } = await query

  return (
    <div className="bg-muted min-h-[calc(100vh-140px)] py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-border">
          <h1 className="text-2xl font-bold text-primary mb-6">Buscar Vagas</h1>
          
          <form className="flex flex-col md:flex-row gap-4" action="/vagas" method="GET">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type="text" 
                name="q"
                defaultValue={q}
                placeholder="Cargo, palavra-chave ou empresa" 
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
              />
            </div>
            
            <select 
              name="modalidade" 
              defaultValue={modalidade}
              className="px-4 py-3 rounded-lg border border-border focus:border-accent outline-none bg-white md:w-48"
            >
              <option value="">Modalidade (Todas)</option>
              <option value="Presencial">Presencial</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Remoto">Remoto</option>
            </select>

            <select 
              name="regime" 
              defaultValue={regime}
              className="px-4 py-3 rounded-lg border border-border focus:border-accent outline-none bg-white md:w-48"
            >
              <option value="">Regime (Todos)</option>
              <option value="CLT">CLT</option>
              <option value="PJ">PJ</option>
              <option value="Estágio">Estágio</option>
              <option value="Temporário">Temporário</option>
            </select>

            <button 
              type="submit"
              className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg">
              Erro ao buscar vagas. Tente novamente mais tarde.
            </div>
          )}

          {!error && (!vagas || vagas.length === 0) && (
            <div className="bg-white p-12 rounded-xl border border-border text-center">
              <h3 className="text-lg font-medium text-primary mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-muted-foreground">Tente ajustar seus filtros de busca para encontrar mais resultados.</p>
            </div>
          )}

          {!error && vagas && vagas.map((vaga: any) => (
            <VagaCard key={vaga.id} vaga={vaga} />
          ))}
        </div>
      </div>
    </div>
  )
}

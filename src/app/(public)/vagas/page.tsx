import { createClient, isSupabaseConfigured } from '@/utils/supabase/server'
import { Search, MapPin, Briefcase, DollarSign, Filter, Building2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Vagas de Emprego | DW Solutions',
  description: 'Encontre as melhores oportunidades de trabalho. Filtre por cargo, área ou cidade.',
}

export default async function VagasPublicPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; area?: string; cidade?: string }>
}) {
  const { q, area, cidade } = await searchParams

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-6xl animate-in space-y-6 px-4 pb-6 pt-32 fade-in duration-700 sm:space-y-8 sm:px-6 sm:pb-10 sm:pt-36">
        <div className="space-y-1 text-center sm:space-y-2 sm:text-left">
          <h1 className="text-2xl font-black tracking-tight text-primary sm:text-3xl md:text-4xl">
            Oportunidades Abertas
          </h1>
          <p className="text-xs font-medium text-muted-foreground opacity-70 sm:text-sm">
            Explore as vagas selecionadas pela{' '}
            <span className="font-bold text-primary">DW Solutions</span>.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-10 text-center sm:rounded-2xl sm:p-16">
          <p className="text-sm font-bold text-muted-foreground sm:text-base">
            Configure o Supabase no ambiente local para carregar as vagas publicadas.
          </p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  let query = supabase
    .from('vagas')
    .select(`
      *,
      empresa:empresas (nome, cidade, estado)
    `)
    .eq('status', 'ativa')
    .order('created_at', { ascending: false })

  if (q) {
    // Busca avançada em múltiplos campos
    query = query.or(`titulo.ilike.%${q}%,descricao.ilike.%${q}%,cidade.ilike.%${q}%`)
  }

  if (area) {
    query = query.eq('area', area)
  }

  if (cidade) {
    query = query.ilike('cidade', `%${cidade}%`)
  }

  const { data: vagas, error } = await query

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-6 px-4 pb-6 pt-32 fade-in duration-700 sm:space-y-8 sm:px-6 sm:pb-10 sm:pt-36">
      <div className="space-y-1 text-center sm:space-y-2 sm:text-left">
        <h1 className="text-2xl font-black tracking-tight text-primary sm:text-3xl md:text-4xl">
          Oportunidades Abertas
        </h1>
        <p className="text-xs font-medium text-muted-foreground opacity-70 sm:text-sm">
          Explore as vagas selecionadas pela{' '}
          <span className="font-bold text-primary">DW Solutions</span>.
        </p>
      </div>

      <form className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-card p-3 shadow-sm sm:grid-cols-12 sm:gap-3 sm:rounded-2xl sm:p-4">
        <div className="group relative sm:col-span-5">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-3.5 sm:h-4 sm:w-4" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cargo ou palavra-chave..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent sm:rounded-xl sm:py-2.5 sm:pl-10 sm:pr-4"
          />
        </div>
        <div className="group relative sm:col-span-3">
          <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-3.5 sm:h-4 sm:w-4" />
          <input
            type="text"
            name="cidade"
            defaultValue={cidade}
            placeholder="Cidade..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent sm:rounded-xl sm:py-2.5 sm:pl-10 sm:pr-4"
          />
        </div>
        <div className="sm:col-span-2">
          <select
            name="area"
            defaultValue={area}
            className="w-full cursor-pointer appearance-none rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent sm:rounded-xl sm:px-4"
          >
            <option value="">Áreas</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Vendas">Vendas</option>
            <option value="Marketing">Marketing</option>
            <option value="RH">RH</option>
          </select>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90 sm:col-span-2 sm:rounded-xl">
          <Filter className="h-4 w-4" />
          <span>Filtrar</span>
        </button>
      </form>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-xs font-bold text-red-500 dark:border-red-900/20 dark:bg-red-950/10 sm:rounded-2xl sm:p-10 sm:text-sm">
            Erro ao carregar vagas: {error.message}
          </div>
        ) : vagas && vagas.length > 0 ? (
          vagas.map((vaga) => (
            <Link
              key={vaga.id}
              href={`/vagas/${vaga.slug || vaga.id}`}
              className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-accent/30 hover:shadow-md sm:rounded-2xl sm:p-6"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center sm:gap-6">
                <div className="flex-1 space-y-2 sm:space-y-3.5">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold leading-snug text-primary transition-colors group-hover:text-accent sm:text-lg md:text-lg">
                      {vaga.titulo}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground sm:text-[10px]">
                      <Building2 className="h-3 w-3 text-accent" /> {(vaga.empresa as any)?.nome}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-bold text-muted-foreground sm:gap-3">
                    <span className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/50 px-2 py-1 sm:px-2.5">
                      <MapPin className="h-2.5 w-2.5 text-accent sm:h-3 sm:w-3" /> {vaga.cidade} -{' '}
                      {vaga.estado}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/50 px-2 py-1 sm:px-2.5">
                      <Briefcase className="h-2.5 w-2.5 text-accent sm:h-3 sm:w-3" /> {vaga.modalidade}
                    </span>
                    {vaga.salario_min && (
                      <span className="flex items-center gap-1.5 rounded-lg border border-accent/10 bg-accent/5 px-2 py-1 text-accent sm:px-2.5">
                        <DollarSign className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(vaga.salario_min)}{' '}
                        -{' '}
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(vaga.salario_max)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="hidden items-center text-accent/50 transition-colors group-hover:text-accent md:flex">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-xl border border-border bg-card p-10 text-center sm:rounded-2xl sm:p-16">
            <p className="text-sm font-bold text-muted-foreground sm:text-base">
              Nenhuma vaga encontrada. Tente ajustar seus filtros.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

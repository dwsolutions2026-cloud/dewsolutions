import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Filter,
  MapPin,
  Search,
} from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/utils/supabase/server'
import { AREAS_TRABALHO } from '@/lib/constants'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Vagas de Emprego | DW Solutions',
  description: 'Encontre oportunidades selecionadas pela D&W Solutions.',
}

const PAGE_SIZE = 10

export default async function VagasPublicPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; area?: string; cidade?: string; page?: string }>
}) {
  const { q, area, cidade, page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  // Sanitize to prevent ilike injection
  const sanitize = (s?: string) => s?.replace(/[%_\\]/g, (c) => `\\${c}`).slice(0, 120)
  const safeQ = sanitize(q)
  const safeCidade = sanitize(cidade)

  if (!isSupabaseConfigured()) {
    return (
      <div className="animate-in space-y-6 px-5 pb-8 pt-32 fade-in duration-700 sm:space-y-8 sm:px-8 sm:pt-36 lg:px-[4.5rem] xl:px-20">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
            Oportunidades Abertas
          </h1>
          <p className="max-w-2xl text-sm font-medium text-muted-foreground sm:text-base">
            Explore as vagas selecionadas pela{' '}
            <span className="font-bold text-primary">D&amp;W Solutions</span>.
          </p>
        </div>
        <div className="surface-card rounded-sm p-10 text-center shadow-none sm:p-16">
          <p className="text-sm font-bold text-muted-foreground sm:text-base">
            Nenhuma vaga disponível no momento.
          </p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  let query = supabase
    .from('vagas')
    .select(
      `
      *,
      empresa:empresas!inner (nome, cidade, estado, ativa)
    `,
      { count: 'exact' }
    )
    .eq('status', 'ativa')
    .eq('empresa.ativa', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (safeQ) {
    query = query.or(
      `titulo.ilike.%${safeQ}%,descricao.ilike.%${safeQ}%,cidade.ilike.%${safeQ}%`
    )
  }
  if (area) query = query.eq('area', area)
  if (safeCidade) query = query.ilike('cidade', `%${safeCidade}%`)

  const { data: vagas, count: totalCount, error } = await query
  const totalPages = Math.ceil((totalCount ?? 0) / PAGE_SIZE)

  const buildPageHref = (p: number) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (area) params.set('area', area)
    if (cidade) params.set('cidade', cidade)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/vagas${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="animate-in space-y-6 px-5 pb-8 pt-32 fade-in duration-700 sm:space-y-8 sm:px-8 sm:pt-36 lg:px-[4.5rem] xl:px-20">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
            Oportunidades Abertas
          </h1>
          <p className="max-w-2xl text-sm font-medium text-muted-foreground sm:text-base">
            Explore as vagas selecionadas pela{' '}
            <span className="font-bold text-primary">D&amp;W Solutions</span>.
          </p>
        </div>
        {totalCount != null && totalCount > 0 && (
          <span className="mb-0.5 inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
            {totalCount} {totalCount === 1 ? 'vaga encontrada' : 'vagas encontradas'}
          </span>
        )}
      </div>

      {/* Formulário de busca */}
      <form className="surface-muted grid grid-cols-1 gap-2 rounded-sm p-3 sm:grid-cols-12 sm:gap-3 sm:p-4">
        <div className="group relative sm:col-span-5">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-3.5 sm:h-4 sm:w-4" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cargo ou palavra-chave..."
            className="surface-input w-full rounded-sm py-2.5 pl-9 pr-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent sm:pl-10 sm:pr-4"
          />
        </div>
        <div className="group relative sm:col-span-3">
          <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-3.5 sm:h-4 sm:w-4" />
          <input
            type="text"
            name="cidade"
            defaultValue={cidade}
            placeholder="Cidade..."
            className="surface-input w-full rounded-sm py-2.5 pl-9 pr-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent sm:pl-10 sm:pr-4"
          />
        </div>
        <div className="sm:col-span-2">
          <select
            name="area"
            defaultValue={area ?? ''}
            className="surface-input w-full cursor-pointer appearance-none rounded-sm px-3 py-2.5 text-sm font-medium text-foreground outline-none transition-all focus:ring-2 focus:ring-accent sm:px-4"
          >
            <option value="">Todas as áreas</option>
            {AREAS_TRABALHO.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs font-black uppercase tracking-widest text-primary-foreground transition-all hover:opacity-90 sm:col-span-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtrar</span>
        </button>
      </form>

      {/* Lista de vagas */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {error ? (
          <div className="rounded-sm border border-red-200 bg-red-50 p-6 text-center text-sm font-bold text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300 sm:p-10">
            Erro ao carregar vagas: {error.message}
          </div>
        ) : vagas && vagas.length > 0 ? (
          vagas.map((vaga) => (
            <Link
              key={vaga.id}
              href={`/vagas/${vaga.slug || vaga.id}`}
              className="surface-card group rounded-sm p-4 shadow-none transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-center">
                <div className="flex-1 space-y-2 sm:space-y-3.5">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold leading-snug text-primary transition-colors group-hover:text-accent sm:text-lg">
                      {vaga.titulo}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <Building2 className="h-3 w-3 text-accent" />
                      {(vaga.empresa as any)?.nome}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <span className="flex items-center gap-1.5 rounded-sm border border-border/60 bg-background px-2.5 py-1 text-xs font-semibold text-foreground sm:px-3">
                      <MapPin className="h-3 w-3 shrink-0 text-accent" />
                      {vaga.cidade} — {vaga.estado}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-sm border border-border/60 bg-background px-2.5 py-1 text-xs font-semibold text-foreground sm:px-3">
                      <Briefcase className="h-3 w-3 shrink-0 text-accent" />
                      {vaga.modalidade}
                    </span>
                    {vaga.salario_min && vaga.salario_max && (
                      <span className="flex items-center gap-1.5 rounded-sm bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent sm:px-3">
                        <DollarSign className="h-3 w-3 shrink-0" />
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          maximumFractionDigits: 0,
                        }).format(vaga.salario_min)}{' '}
                        –{' '}
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          maximumFractionDigits: 0,
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
          <div className="surface-card rounded-sm p-10 text-center shadow-none sm:p-16">
            <p className="text-sm font-bold text-foreground sm:text-base">
              {q || area || cidade
                ? 'Nenhuma vaga encontrada para os filtros aplicados.'
                : 'Nenhuma vaga cadastrada no momento.'}
            </p>
            {(q || area || cidade) && (
              <Link
                href="/vagas"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Limpar filtros
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-3 pt-2"
          aria-label="Paginação de vagas"
        >
          {page > 1 ? (
            <Link
              href={buildPageHref(page - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-card font-bold text-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-border/30 bg-card text-muted-foreground opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}

          <span className="text-sm font-bold text-foreground">
            {page} de {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={buildPageHref(page + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-card font-bold text-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label="Próxima página"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-border/30 bg-card text-muted-foreground opacity-40">
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </nav>
      )}
    </div>
  )
}

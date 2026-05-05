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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-6 sm:pt-36 sm:pb-10 space-y-6 sm:space-y-8 animate-in fade-in duration-700">
        <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tight">Oportunidades Abertas</h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium opacity-70">
            Explore as vagas selecionadas pela <span className="text-primary font-bold">DW Solutions</span>.
          </p>
        </div>

        <div className="p-10 sm:p-16 bg-card rounded-xl sm:rounded-2xl text-center border border-border">
          <p className="text-muted-foreground font-bold text-sm sm:text-base">
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-6 sm:pt-36 sm:pb-10 space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tight">Oportunidades Abertas</h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium opacity-70">Explore as vagas selecionadas pela <span className="text-primary font-bold">DW Solutions</span>.</p>
      </div>

      {/* Filtros e Busca */}
      <form className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 p-3 sm:p-4 bg-card rounded-xl sm:rounded-2xl border border-border shadow-sm">
        <div className="sm:col-span-5 relative group">
          <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 sm:w-4 h-3.5 sm:h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cargo ou palavra-chave..."
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-2.5 rounded-lg sm:rounded-xl text-sm border border-border focus:ring-2 focus:ring-accent outline-none bg-card transition-all font-medium"
          />
        </div>
        <div className="sm:col-span-3 relative group">
          <MapPin className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 sm:w-4 h-3.5 sm:h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            name="cidade"
            defaultValue={cidade}
            placeholder="Cidade..."
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-2.5 rounded-lg sm:rounded-xl text-sm border border-border focus:ring-2 focus:ring-accent outline-none bg-card transition-all font-medium"
          />
        </div>
        <div className="sm:col-span-2">
          <select
            name="area"
            defaultValue={area}
            className="w-full px-3 sm:px-4 py-2.5 rounded-lg sm:rounded-xl text-sm border border-border focus:ring-2 focus:ring-accent outline-none bg-card transition-all font-medium appearance-none cursor-pointer"
          >
            <option value="">Áreas</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Vendas">Vendas</option>
            <option value="Marketing">Marketing</option>
            <option value="RH">RH</option>
          </select>
        </div>
        <button className="sm:col-span-2 bg-primary text-white px-4 py-2.5 rounded-lg sm:rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
          <Filter className="w-4 h-4" /> <span>Filtrar</span>
        </button>
      </form>

      {/* Lista de Vagas */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {error ? (
          <div className="p-6 sm:p-10 bg-red-50 dark:bg-red-950/10 text-red-500 rounded-xl sm:rounded-2xl text-center font-bold text-xs sm:text-sm border border-red-200 dark:border-red-900/20">
            Erro ao carregar vagas: {error.message}
          </div>
        ) : vagas && vagas.length > 0 ? (
          vagas.map((vaga) => (
            <Link 
              key={vaga.id} 
              href={`/vagas/${vaga.slug || vaga.id}`}
              className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border hover:border-accent/30 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3.5 flex-1">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg md:text-lg font-bold text-primary group-hover:text-accent transition-colors leading-snug">{vaga.titulo}</h3>
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <Building2 className="w-3 h-3 text-accent" /> {(vaga.empresa as any)?.nome}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs font-bold text-muted-foreground">
                    <span className="flex items-center gap-1.5 bg-muted/50 px-2 sm:px-2.5 py-1 rounded-lg border border-border/50">
                      <MapPin className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-accent" /> {vaga.cidade} - {vaga.estado}
                    </span>
                    <span className="flex items-center gap-1.5 bg-muted/50 px-2 sm:px-2.5 py-1 rounded-lg border border-border/50">
                      <Briefcase className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-accent" /> {vaga.modalidade}
                    </span>
                    {vaga.salario_min && (
                      <span className="flex items-center gap-1.5 bg-accent/5 text-accent px-2 sm:px-2.5 py-1 rounded-lg border border-accent/10">
                        <DollarSign className="w-2.5 sm:w-3 h-2.5 sm:h-3" /> 
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vaga.salario_min)} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vaga.salario_max)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="hidden md:flex items-center text-accent/50 group-hover:text-accent transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-10 sm:p-16 bg-card rounded-xl sm:rounded-2xl text-center border border-border">
            <p className="text-muted-foreground font-bold text-sm sm:text-base">Nenhuma vaga encontrada. Tente ajustar seus filtros.</p>
          </div>
        )}
      </div>
    </div>
  )
}

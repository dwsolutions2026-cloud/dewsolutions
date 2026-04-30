import { createClient } from '@/utils/supabase/server'
import { Search, MapPin, Briefcase, DollarSign, Filter, Building2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function VagasPublicPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; area?: string }>
}) {
  const { q, area } = await searchParams
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
    query = query.ilike('titulo', `%${q}%`)
  }
  if (area) {
    query = query.eq('area', area)
  }

  const { data: vagas, error } = await query

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-primary tracking-tight">Oportunidades Abertas</h1>
        <p className="text-muted-foreground text-sm font-medium opacity-70">Explore as vagas disponíveis e encontre o seu próximo desafio.</p>
      </div>

      {/* Filtros e Busca */}
      <form className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-card rounded-2xl border border-border shadow-sm">
        <div className="md:col-span-6 relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por cargo ou palavra-chave..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none bg-card transition-all text-sm font-medium"
          />
        </div>
        <div className="md:col-span-4">
          <select
            name="area"
            defaultValue={area}
            className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none bg-card transition-all text-sm font-medium appearance-none cursor-pointer"
          >
            <option value="">Todas as áreas</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Vendas">Vendas</option>
            <option value="Marketing">Marketing</option>
            <option value="RH">RH</option>
          </select>
        </div>
        <button className="md:col-span-2 bg-primary text-white px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
          <Filter className="w-3.5 h-3.5" /> Filtrar
        </button>
      </form>

      {/* Lista de Vagas */}
      <div className="grid grid-cols-1 gap-4">
        {error ? (
          <div className="p-10 bg-red-50 text-red-500 rounded-2xl text-center font-bold text-sm">
            Erro ao carregar vagas: {error.message}
          </div>
        ) : vagas && vagas.length > 0 ? (
          vagas.map((vaga) => (
            <Link 
              key={vaga.id} 
              href={`/vagas/${vaga.slug || vaga.id}`}
              className="bg-card p-6 rounded-2xl border border-border hover:border-accent/30 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors leading-snug">{vaga.titulo}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <Building2 className="w-3.5 h-3.5 text-accent" /> {(vaga.empresa as any)?.nome}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-xs font-bold text-muted-foreground">
                    <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg border border-border/50">
                      <MapPin className="w-3 h-3 text-accent" /> {vaga.cidade} - {vaga.estado}
                    </span>
                    <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg border border-border/50">
                      <Briefcase className="w-3 h-3 text-accent" /> {vaga.modalidade}
                    </span>
                    {vaga.salario_min && (
                      <span className="flex items-center gap-1.5 bg-accent/5 text-accent px-2.5 py-1 rounded-lg border border-accent/10">
                        <DollarSign className="w-3 h-3" /> 
                        {vaga.salario_min.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        {vaga.salario_max && ` - ${vaga.salario_max.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center justify-end">
                  <div className="px-5 py-2.5 bg-primary/5 text-primary rounded-xl font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    Ver Detalhes <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-16 bg-card border border-border rounded-[2.5rem] text-center space-y-4 shadow-sm opacity-60">
            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Search className="w-6 h-6 text-muted-foreground opacity-20" />
            </div>
            <p className="text-lg font-bold text-primary">Nenhuma vaga encontrada</p>
            <p className="text-sm text-muted-foreground font-medium opacity-70">Tente ajustar seus filtros ou buscar por outro termo.</p>
          </div>
        )}
      </div>
    </div>
  )
}

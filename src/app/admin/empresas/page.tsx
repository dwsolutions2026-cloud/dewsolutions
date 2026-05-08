import { createClient } from '@/utils/supabase/server'
import { Building2, Search, Globe, MapPin, Plus, Mail } from 'lucide-react'
import Link from 'next/link'
import Form from 'next/form'
import { getSafeHttpUrl } from '@/lib/security'

export default async function AdminEmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()
  const query = q || ''

  let dbQuery = supabase
    .from('empresas')
    .select(`
      *,
      vagas (count)
    `)
    .order('nome', { ascending: true })

  if (query) {
    dbQuery = dbQuery.ilike('nome', `%${query}%`)
  }

  const { data: empresas, error } = await dbQuery

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Empresas Parceiras</h1>
          <p className="text-muted-foreground text-sm font-medium">Gestão de empresas cadastradas na plataforma.</p>
        </div>
        <Link 
          href="/admin/empresas/nova"
          className="bg-accent text-accent-foreground px-5 py-2.5 rounded-sm font-black flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto justify-center text-sm"
        >
          <Plus className="w-4 h-4" /> Nova Empresa
        </Link>
      </div>

      {/* Barra de Busca */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
        <Form action="">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nome da empresa..."
            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-border bg-card focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all shadow-sm text-sm font-medium"
          />
        </Form>
      </div>

      <div className="flex flex-col gap-3">
        {error ? (
          <div className="p-10 bg-red-50 text-red-500 rounded-sm text-center border border-red-100 font-bold text-sm">
            Erro ao carregar empresas: {error.message}
          </div>
        ) : empresas && empresas.length > 0 ? (
          empresas.map((empresa) => (
            <div key={empresa.id} className="bg-secondary rounded-sm border-none p-4 shadow-sm hover:shadow-md hover:border-accent/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Coluna 1: Nome e Setor */}
              <div className="flex items-center gap-4 flex-1 min-w-0 md:max-w-[30%]">
                <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-primary truncate">{empresa.nome}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest truncate">{empresa.setor || 'Sem setor'}</p>
                    <span className="text-muted-foreground/30">•</span>
                    <span className="text-[9px] font-bold text-accent whitespace-nowrap">{empresa.vagas[0]?.count || 0} vagas</span>
                  </div>
                </div>
              </div>

              {/* Coluna 2: Contato e Localização */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-muted-foreground font-medium flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-accent shrink-0" /> 
                  <span className="truncate">{empresa.email}</span>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0" /> 
                  <span className="truncate">{empresa.cidade} - {empresa.estado}</span>
                </div>
              </div>

              {/* Coluna 3: Ações */}
              <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t border-border md:border-none">
                <Link 
                  href={`/admin/empresas/${empresa.slug || empresa.id}/editar`}
                  className="px-4 py-2 bg-background border border-border text-muted-foreground hover:border-accent hover:text-accent rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all"
                >
                  Editar
                </Link>
                <Link 
                  href={`/admin/empresas/${empresa.slug || empresa.id}`}
                  className="px-4 py-2 bg-muted text-primary hover:bg-primary hover:text-white rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all"
                >
                  Ver Detalhes
                </Link>
              </div>

            </div>
          ))
        ) : (
          <div className="p-16 bg-secondary border-none rounded-sm text-center space-y-4 shadow-sm">
            <Building2 className="mx-auto h-12 w-12 opacity-20 mb-2 text-muted-foreground" />
            <p className="text-xl font-bold text-primary">Nenhuma empresa encontrada</p>
            <p className="text-muted-foreground text-sm font-medium">Cadastre novas empresas parceiras para começar a publicar vagas.</p>
          </div>
        )}
      </div>
    </div>
  )
}

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
          className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto justify-center text-sm"
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
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all shadow-sm text-sm font-medium"
          />
        </Form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {error ? (
          <div className="col-span-full p-10 bg-red-50 text-red-500 rounded-2xl text-center border border-red-100 font-bold text-sm">
            Erro ao carregar empresas: {error.message}
          </div>
        ) : empresas && empresas.length > 0 ? (
          empresas.map((empresa) => (
            <div key={empresa.id} className="bg-card rounded-4xl border border-border p-6 shadow-sm hover:shadow-lg hover:border-accent/30 transition-all group flex flex-col h-full">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-primary truncate">{empresa.nome}</h3>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{empresa.setor || 'Setor não informado'}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                  <Mail className="w-3.5 h-3.5 text-accent" /> {empresa.email}
                </div>
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                  <MapPin className="w-3.5 h-3.5 text-accent" /> {empresa.cidade} - {empresa.estado}
                </div>
                {getSafeHttpUrl(empresa.site) && (
                  <a 
                    href={getSafeHttpUrl(empresa.site)!} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-xs text-accent font-bold hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" /> Visitar Site
                  </a>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-muted-foreground">Vagas Ativas</span>
                  <span className="text-xl font-black text-primary">{empresa.vagas[0]?.count || 0}</span>
                </div>
                <Link 
                  href={`/admin/empresas/${empresa.slug || empresa.id}`}
                  className="px-4 py-2 bg-muted text-primary hover:bg-primary hover:text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-16 bg-card border border-border rounded-4xl text-center space-y-4 shadow-sm">
            <Building2 className="mx-auto h-12 w-12 opacity-20 mb-2 text-muted-foreground" />
            <p className="text-xl font-bold text-primary">Nenhuma empresa encontrada</p>
            <p className="text-muted-foreground text-sm font-medium">Cadastre novas empresas parceiras para começar a publicar vagas.</p>
          </div>
        )}
      </div>
    </div>
  )
}

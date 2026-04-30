import { createClient } from '@/utils/supabase/server'
import { Briefcase, Search, Plus } from 'lucide-react'
import Link from 'next/link'
import { VagasAdminClient } from './VagasAdminClient'
import Form from 'next/form'

export default async function AdminVagasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()
  const query = q || ''

  let dbQuery = supabase
    .from('vagas')
    .select(`
      *,
      empresa:empresas (nome),
      candidaturas (count)
    `)
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.ilike('titulo', `%${query}%`)
  }

  const { data: vagas, error } = await dbQuery

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Gestão de Vagas</h1>
          <p className="text-muted-foreground text-sm font-medium">Controle total sobre as oportunidades publicadas.</p>
        </div>
        <Link 
          href="/admin/vagas/nova"
          className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto justify-center text-sm"
        >
          <Plus className="w-4 h-4" /> Criar Nova Vaga
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
            placeholder="Buscar por título da vaga..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all shadow-sm text-sm font-medium"
          />
        </Form>
      </div>

      {error ? (
        <div className="p-10 bg-red-50 text-red-500 rounded-2xl text-center border border-red-100 font-bold text-sm">
          Erro ao carregar vagas: {error.message}
        </div>
      ) : vagas && vagas.length > 0 ? (
        <VagasAdminClient vagas={vagas} />
      ) : (
        <div className="p-16 bg-card border border-border rounded-[2rem] text-center space-y-4 shadow-sm">
          <Briefcase className="mx-auto h-12 w-12 opacity-20 mb-2 text-muted-foreground" />
          <p className="text-xl font-bold text-primary">Nenhuma vaga encontrada</p>
          <p className="text-muted-foreground text-sm font-medium">Comece publicando sua primeira oportunidade na plataforma.</p>
        </div>
      )}
    </div>
  )
}

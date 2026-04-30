import { createClient } from '@/utils/supabase/server'
import { Briefcase, Plus, MapPin, Users, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function EmpresaVagasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: empresa } = await supabase
    .from('empresas')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!empresa) return null

  const { data: vagas, error } = await supabase
    .from('vagas')
    .select(`
      *,
      candidaturas (count)
    `)
    .eq('empresa_id', empresa.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight mb-1">Minhas Vagas</h1>
          <p className="text-muted-foreground text-sm font-medium opacity-70">Acompanhe e gerencie suas oportunidades publicadas.</p>
        </div>
        <Link 
          href="/empresa/vagas/nova"
          className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Nova Vaga
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {error ? (
          <div className="p-10 bg-red-50 text-red-500 rounded-2xl text-center border border-red-100 font-bold text-sm">
            Erro ao carregar vagas.
          </div>
        ) : vagas && vagas.length > 0 ? (
          vagas.map((vaga) => (
            <div key={vaga.id} className="bg-card p-5 rounded-2xl border border-border hover:border-accent/20 shadow-sm transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-inner shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-primary mb-0.5 truncate">{vaga.titulo}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {vaga.cidade} - {vaga.estado}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] border font-black ${
                        vaga.status === 'ativa' 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {vaga.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 lg:border-l lg:border-border lg:pl-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-muted-foreground mb-1 opacity-60">Candidatos</span>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-accent" />
                      <span className="text-xl font-black text-primary leading-none">{vaga.candidaturas[0]?.count || 0}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/empresa/vagas/${vaga.id}/candidatos`}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-accent/10 hover:scale-105 active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver Candidatos
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 bg-card border border-border border-dashed rounded-[2.5rem] text-center space-y-4 shadow-sm opacity-60">
            <Briefcase className="mx-auto h-10 w-10 opacity-20 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-lg font-bold text-primary">Nenhuma vaga publicada</p>
              <p className="text-xs text-muted-foreground font-medium opacity-70">Suas oportunidades aparecerão aqui após serem publicadas.</p>
            </div>
            <Link
              href="/empresa/vagas/nova"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 rounded-xl font-black text-xs shadow-md hover:scale-105 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Publicar Primeira Vaga
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

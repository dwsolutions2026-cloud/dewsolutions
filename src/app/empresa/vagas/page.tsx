import { createClient } from '@/utils/supabase/server'
import { Briefcase, Search, Plus, MapPin, Users, Edit3 } from 'lucide-react'
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
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary">Minhas Vagas</h1>
          <p className="text-muted-foreground text-lg font-medium">Acompanhe e gerencie suas oportunidades publicadas.</p>
        </div>
        <Link 
          href="/empresa/vagas/nova"
          className="bg-accent text-accent-foreground px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" /> Nova Vaga
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {error ? (
          <div className="p-12 bg-red-50 text-red-500 rounded-3xl text-center border border-red-100 font-bold">
            Erro ao carregar vagas.
          </div>
        ) : vagas && vagas.length > 0 ? (
          vagas.map((vaga) => (
            <div key={vaga.id} className="bg-card p-8 rounded-[2.5rem] border border-border hover:border-accent/30 shadow-sm transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-primary mb-1">{vaga.titulo}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {vaga.cidade} - {vaga.estado}
                      </span>
                      <span className={`px-2 py-0.5 rounded ${
                        vaga.status === 'ativa' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {vaga.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 lg:border-l lg:border-border lg:pl-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground mb-1">Candidatos</span>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      <span className="text-2xl font-black text-primary">{vaga.candidaturas[0]?.count || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/empresa/vagas/${vaga.id}/candidatos`}
                      className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-black text-xs transition-all shadow-lg shadow-accent/20"
                    >
                      Ver Candidatos
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 bg-card border border-border rounded-[3rem] text-center space-y-4 shadow-sm">
            <Briefcase className="mx-auto h-16 w-16 opacity-20 mb-4 text-muted-foreground" />
            <p className="text-2xl font-bold text-primary">Nenhuma vaga publicada</p>
            <p className="text-muted-foreground font-medium">Suas oportunidades aparecerão aqui após serem publicadas.</p>
          </div>
        )}
      </div>
    </div>
  )
}

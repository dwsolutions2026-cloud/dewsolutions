import { createClient } from '@/utils/supabase/server'
import { Briefcase, Plus, MapPin, Users, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function EmpresaVagasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: empresa } = await supabase
    .from('empresas')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!empresa) return null

  const { data: vagas, error } = await supabase
    .from('vagas')
    .select(
      `
      *,
      candidaturas (count)
    `
    )
    .eq('empresa_id', empresa.id)
    .order('created_at', { ascending: false })

  return (
    <div className="animate-in space-y-8 fade-in duration-700">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-2xl font-black tracking-tight text-primary">
            Minhas Vagas
          </h1>
          <p className="text-sm font-medium text-muted-foreground opacity-70">
            Acompanhe e gerencie as oportunidades publicadas pela sua empresa.
          </p>
        </div>
        <Link
          href="/empresa/vagas/nova"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-black uppercase tracking-widest text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95 md:w-auto"
        >
          <Plus className="h-4 w-4" /> Nova Vaga
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center text-sm font-bold text-red-500">
            Erro ao carregar vagas.
          </div>
        ) : vagas && vagas.length > 0 ? (
          vagas.map((vaga) => (
            <div
              key={vaga.id}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-accent/20"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-accent shadow-inner transition-all group-hover:bg-accent group-hover:text-white">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-0.5 truncate text-base font-bold text-primary">
                      {vaga.titulo}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {vaga.cidade} - {vaga.estado}
                      </span>
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[9px] font-black ${
                          vaga.status === 'ativa'
                            ? 'border-green-100 bg-green-50 text-green-600'
                            : 'border-red-100 bg-red-50 text-red-600'
                        }`}
                      >
                        {vaga.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 lg:border-l lg:border-border lg:pl-6">
                  <div className="flex flex-col">
                    <span className="mb-1 text-[9px] font-black uppercase text-muted-foreground opacity-60">
                      Candidatos
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-accent" />
                      <span className="text-xl font-black leading-none text-primary">
                        {vaga.candidaturas[0]?.count || 0}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/empresa/vagas/${vaga.id}/candidatos`}
                    className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-[10px] font-black uppercase tracking-widest text-accent-foreground shadow-md shadow-accent/10 transition-all hover:scale-105 active:scale-95"
                  >
                    <Eye className="h-3.5 w-3.5" /> Ver candidatos
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-4 rounded-[2.5rem] border border-dashed border-border bg-card p-12 text-center opacity-60 shadow-sm">
            <Briefcase className="mx-auto h-10 w-10 text-muted-foreground opacity-20" />
            <div className="space-y-1">
              <p className="text-lg font-bold text-primary">Nenhuma vaga publicada</p>
              <p className="text-xs font-medium text-muted-foreground opacity-70">
                Suas oportunidades aparecerão aqui assim que forem publicadas.
              </p>
            </div>
            <Link
              href="/empresa/vagas/nova"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs font-black text-accent-foreground shadow-md transition-all hover:scale-105"
            >
              <Plus className="h-3.5 w-3.5" /> Publicar primeira vaga
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

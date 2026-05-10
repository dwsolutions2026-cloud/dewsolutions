import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Building2, Mail, MapPin, Globe, Briefcase, Edit3, ArrowLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getSafeHttpUrl } from '@/lib/security'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AdminEmpresaDetalhesPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Safe: two separate .eq() queries instead of string-interpolated .or()
  const { data: bySlug } = await supabase
    .from('empresas')
    .select('*, vagas (*, candidaturas (count))')
    .eq('slug', slug)
    .maybeSingle()

  const { data: byId } = !bySlug
    ? await supabase
        .from('empresas')
        .select('*, vagas (*, candidaturas (count))')
        .eq('id', slug)
        .maybeSingle()
    : { data: null }

  const empresa = bySlug ?? byId
  if (!empresa) notFound()

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href="/admin/empresas" 
            className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-xs mb-2.5"
          >
            <ArrowLeft className="w-3 h-3" /> Voltar para Empresas
          </Link>
          <h1 className="text-2xl font-black text-primary tracking-tight">{empresa.nome}</h1>
          <p className="text-muted-foreground text-sm font-medium opacity-70">Detalhes e histórico da empresa parceira.</p>
        </div>
        <Link 
          href={`/admin/empresas/${empresa.slug || empresa.id}/editar`}
          className="bg-accent text-accent-foreground px-5 py-2.5 rounded-sm font-black flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
        >
          <Edit3 className="w-4 h-4" /> Editar Cadastro
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-secondary rounded-sm border-none p-6 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-muted rounded-sm flex items-center justify-center text-accent mb-4 shadow-inner">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-primary">{empresa.nome}</h2>
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-60">{empresa.setor}</span>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-sm bg-accent/5 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-0.5 opacity-60">E-mail Corporativo</p>
                  <p className="text-xs font-bold text-primary truncate">{empresa.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-sm bg-accent/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-0.5 opacity-60">Sede</p>
                  <p className="text-xs font-bold text-primary">{empresa.cidade} - {empresa.estado}</p>
                </div>
              </div>
              {getSafeHttpUrl(empresa.site) && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-sm bg-accent/5 flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider mb-0.5 opacity-60">Site Oficial</p>
                    <a href={getSafeHttpUrl(empresa.site)!} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-accent hover:underline truncate block">{empresa.site}</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary rounded-sm p-6 text-white shadow-xl shadow-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-5 opacity-60">Performance</h3>
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-0.5">
                <p className="text-2xl font-black">{empresa.vagas?.length || 0}</p>
                <p className="text-[8px] font-bold uppercase opacity-50 tracking-widest">Vagas Totais</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-black">
                  {empresa.vagas?.reduce((acc: number, v: any) => acc + (v.candidaturas?.[0]?.count || 0), 0)}
                </p>
                <p className="text-[8px] font-bold uppercase opacity-50 tracking-widest">Candidatos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vagas List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-primary flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-accent" /> Histórico de Vagas
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {empresa.vagas && empresa.vagas.length > 0 ? (
              empresa.vagas.map((vaga: any) => (
                <div key={vaga.id} className="bg-secondary p-4 rounded-sm border-none hover:border-accent/20 shadow-sm transition-all group flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary group-hover:text-accent transition-colors">{vaga.titulo}</h4>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                        vaga.status === 'ativa' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {vaga.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Inscritos</p>
                      <p className="text-lg font-black text-primary leading-none">{vaga.candidaturas?.[0]?.count || 0}</p>
                    </div>
                    <Link 
                      href={`/admin/vagas/${vaga.slug || vaga.id}/editar`}
                      className="p-2 bg-muted text-primary hover:bg-primary hover:text-white rounded-sm transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 bg-secondary border border-dashed rounded-sm text-center opacity-40">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="font-bold text-xs uppercase tracking-widest">Nenhuma vaga publicada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

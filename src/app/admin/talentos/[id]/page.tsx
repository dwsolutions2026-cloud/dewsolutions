import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { 
  Mail, 
  MapPin, 
  FileText, 
  History,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminTalentoPerfilPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: candidato, error } = await supabase
    .from('candidatos')
    .select(`
      *,
      candidaturas (
        id,
        status,
        created_at,
        vaga:vagas (
          id,
          titulo,
          empresa:empresas (nome)
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !candidato) notFound()

  const curriculo = candidato.curriculo_json as any

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Link 
        href="/admin/talentos" 
        className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-xs mb-2"
      >
        <ArrowLeft className="w-3 h-3" /> Voltar para Talentos
      </Link>

      {/* Header Perfil */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-6 rounded-[2rem] border border-border shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-accent/20 shrink-0">
            {candidato.nome.charAt(0)}
          </div>
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-black text-primary tracking-tight truncate">{candidato.nome}</h1>
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                <Mail className="w-3.5 h-3.5 text-accent" /> {candidato.email}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                <MapPin className="w-3.5 h-3.5 text-accent" /> {candidato.cidade} - {candidato.estado}
              </span>
            </div>
          </div>
        </div>
        
        {candidato.curriculo_url && (
          <a 
            href={supabase.storage.from('curriculos').getPublicUrl(candidato.curriculo_url).data.publicUrl}
            target="_blank"
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/10"
          >
            <FileText className="w-4 h-4" /> PDF Original
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Currículo (JSON) */}
        <div className="lg:col-span-2 space-y-8">
          {curriculo ? (
            <div className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm">
              <div className="p-6 bg-muted/30 border-b border-border">
                <h2 className="text-lg font-black text-primary flex items-center gap-3">
                  <FileText className="w-5 h-5 text-accent" /> Currículo Digital
                </h2>
              </div>
              <div className="p-8 space-y-10">
                {/* Objetivo */}
                {curriculo.objetivo && (
                  <section className="space-y-3">
                    <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Objetivo Profissional</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium text-sm">{curriculo.objetivo}</p>
                  </section>
                )}

                {/* Experiências */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Experiência Profissional</h3>
                  <div className="space-y-6">
                    {curriculo.experiencias?.map((exp: any, i: number) => (
                      <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1 before:h-full before:bg-muted before:rounded-full">
                        <div className="absolute left-[-4px] top-1.5 w-3 h-3 bg-accent rounded-full border-2 border-card" />
                        <h4 className="font-bold text-base text-primary">{exp.cargo}</h4>
                        <p className="text-accent font-black text-[10px] uppercase tracking-wider mb-1.5">{exp.empresa} · {exp.periodo}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{exp.descricao}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Formação */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Formação Acadêmica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {curriculo.formacoes?.map((form: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-muted/20 border border-border">
                        <h4 className="font-bold text-sm text-primary">{form.curso}</h4>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">{form.instituicao}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[9px] font-black text-accent uppercase">{form.status}</span>
                          <span className="text-[9px] text-muted-foreground">{form.periodo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-[2rem] border border-border p-10 text-center space-y-3 shadow-sm opacity-60">
              <FileText className="w-12 h-12 mx-auto opacity-20" />
              <p className="text-lg font-bold text-primary">Sem currículo detalhado.</p>
              <p className="text-sm text-muted-foreground">O candidato ainda não preencheu o formulário de currículo.</p>
            </div>
          )}
        </div>

        {/* Coluna Histórico */}
        <div className="space-y-8">
          <div className="bg-card rounded-[2rem] border border-border p-6 shadow-sm">
            <h3 className="text-lg font-black text-primary mb-6 flex items-center gap-2.5">
              <History className="w-4.5 h-4.5 text-accent" /> Histórico
            </h3>
            <div className="space-y-3">
              {candidato.candidaturas?.map((cand: any) => (
                <div key={cand.id} className="p-4 rounded-xl bg-muted/10 border border-border group hover:border-accent/30 transition-all">
                  <h4 className="font-bold text-primary text-xs mb-0.5 group-hover:text-accent transition-colors">{cand.vaga?.titulo}</h4>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-2.5">{(cand.vaga as any)?.empresa?.nome}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-tighter bg-accent/10 text-accent">
                      {cand.status}
                    </span>
                    <span className="text-[8px] text-muted-foreground font-bold">
                      {new Date(cand.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
              {(!candidato.candidaturas || candidato.candidaturas.length === 0) && (
                <p className="text-center py-8 text-xs text-muted-foreground font-medium italic opacity-60">Nenhuma candidatura registrada.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

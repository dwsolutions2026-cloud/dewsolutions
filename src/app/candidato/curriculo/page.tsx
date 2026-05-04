import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { 
  FileText, 
  Edit3, 
  ArrowLeft, 
  Download, 
  Globe, 
  Link as LinkIcon, 
  GraduationCap, 
  Briefcase,
  UserCircle2
} from 'lucide-react'
import Link from 'next/link'
import { getCurriculoDownloadUrl, getSafeHttpUrl } from '@/lib/security'

export default async function CurriculoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: candidato } = await supabase
    .from('candidatos')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!candidato) redirect('/candidato/minha-area')

  const curriculo = candidato.curriculo_json as any

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href="/candidato/minha-area" 
            className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-xs mb-2.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Minha Área
          </Link>
          <h1 className="text-2xl font-black text-primary tracking-tight">Meu Currículo</h1>
          <p className="text-muted-foreground text-sm font-medium opacity-70">Visualize e gerencie seu perfil profissional.</p>
        </div>
        <div className="flex gap-3">
          {candidato.curriculo_url && (
            <a 
              href={getCurriculoDownloadUrl(candidato.curriculo_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border text-primary px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-muted transition-all"
            >
              <Download className="w-4 h-4" /> Baixar PDF
            </a>
          )}
          <Link 
            href="/candidato/curriculo/editar"
            className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-105 transition-all uppercase tracking-widest"
          >
            <Edit3 className="w-4 h-4" /> Editar Currículo
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
        {curriculo ? (
          <div className="divide-y divide-border/50">
            {/* Seção Resumo */}
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                  <UserCircle2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-primary">Resumo Profissional</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                {curriculo.objetivo || 'Nenhum objetivo profissional cadastrado.'}
              </p>
              
              <div className="flex gap-4">
                {getSafeHttpUrl(curriculo.linkedin) && (
                  <a href={getSafeHttpUrl(curriculo.linkedin)!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-accent hover:underline">
                    <Globe className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                )}
                {getSafeHttpUrl(curriculo.github) && (
                  <a href={getSafeHttpUrl(curriculo.github)!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-accent hover:underline">
                    <LinkIcon className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
              </div>
            </div>

            {/* Experiências */}
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-primary">Experiência Profissional</h2>
              </div>
              
              <div className="space-y-10">
                {curriculo.experiencias?.map((exp: any, i: number) => (
                  <div key={i} className="relative pl-6 border-l-2 border-muted pb-2 last:pb-0">
                    <div className="absolute left-[-7px] top-1 w-3 h-3 bg-accent rounded-full border-2 border-card" />
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-primary">{exp.cargo}</h3>
                      <p className="text-accent font-black text-[10px] uppercase tracking-widest">{exp.empresa} · {exp.periodo}</p>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {exp.descricao}
                    </p>
                  </div>
                ))}
                {(!curriculo.experiencias || curriculo.experiencias.length === 0) && (
                  <p className="text-sm text-muted-foreground italic opacity-60">Nenhuma experiência cadastrada.</p>
                )}
              </div>
            </div>

            {/* Formação */}
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-primary">Formação Acadêmica</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {curriculo.formacoes?.map((form: any, i: number) => (
                  <div key={i} className="p-5 rounded-2xl bg-muted/10 border border-border space-y-3">
                    <h3 className="text-sm font-bold text-primary">{form.curso}</h3>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{form.instituicao}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 opacity-70">{form.periodo}</p>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest border border-accent/10">
                      {form.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center space-y-6">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto text-muted-foreground opacity-20">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-primary">Crie seu currículo digital</h2>
              <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto opacity-70">
                Use nosso construtor inteligente para criar um currículo atraente e aumentar suas chances.
              </p>
            </div>
            <Link 
              href="/candidato/curriculo/editar"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-xl font-black text-sm shadow-lg shadow-accent/20 hover:scale-105 transition-all"
            >
              Começar Agora
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

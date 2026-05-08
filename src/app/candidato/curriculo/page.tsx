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
  UserCircle2,
} from 'lucide-react'
import Link from 'next/link'
import { getCurriculoDownloadUrl, getSafeHttpUrl } from '@/lib/security'

export default async function CurriculoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: candidato } = await supabase
    .from('candidatos')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!candidato) redirect('/candidato/minha-area')

  const curriculo = candidato.curriculo_json as any

  return (
    <div className="max-w-5xl animate-in space-y-6 fade-in duration-700">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <Link
            href="/candidato/minha-area"
            className="mb-2 flex items-center gap-2 text-xs font-bold text-foreground/70 transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar para Minha Área
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Meu Currículo</h1>
          <p className="text-sm font-medium text-foreground/70">
            Visualize e gerencie seu perfil profissional.
          </p>
        </div>

        <div className="flex gap-3">
          {candidato.curriculo_url && (
            <a
              href={getCurriculoDownloadUrl(candidato.curriculo_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-sm border border-border bg-background px-4 py-2 text-xs font-black text-foreground transition-all hover:bg-muted"
            >
              <Download className="h-4 w-4" /> Baixar PDF
            </a>
          )}
          <Link
            href="/candidato/curriculo/editar"
            className="flex items-center gap-2 rounded-sm bg-accent px-4 py-2 text-xs font-black uppercase tracking-widest text-accent-foreground transition-all hover:scale-105"
          >
            <Edit3 className="h-4 w-4" /> Editar Currículo
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-[#d9d1c7] bg-white shadow-none">
        {curriculo ? (
          <div className="divide-y divide-[#d9d1c7]">
            <div className="space-y-4 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 text-accent">
                  <UserCircle2 className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-black">Resumo Profissional</h2>
              </div>

              <p className="text-sm font-medium leading-relaxed text-black/78">
                {curriculo.objetivo || 'Nenhum objetivo profissional cadastrado.'}
              </p>

              <div className="flex gap-4">
                {getSafeHttpUrl(curriculo.linkedin) && (
                  <a
                    href={getSafeHttpUrl(curriculo.linkedin)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" /> LinkedIn
                  </a>
                )}
                {getSafeHttpUrl(curriculo.github) && (
                  <a
                    href={getSafeHttpUrl(curriculo.github)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                  >
                    <LinkIcon className="h-3.5 w-3.5" /> GitHub
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-5 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 text-accent">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-black">Experiência Profissional</h2>
              </div>

              <div className="space-y-6">
                {curriculo.experiencias?.map((exp: any, i: number) => (
                  <div
                    key={i}
                    className="relative border-l-2 border-black/18 pl-5"
                  >
                    <div className="absolute left-[-7px] top-1 h-3 w-3 rounded-full border-2 border-white bg-accent" />
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-black">{exp.cargo}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">
                        {exp.empresa} · {exp.periodo}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-black/78">{exp.descricao}</p>
                  </div>
                ))}

                {(!curriculo.experiencias || curriculo.experiencias.length === 0) && (
                  <p className="text-sm italic text-black/60">Nenhuma experiência cadastrada.</p>
                )}
              </div>
            </div>

            <div className="space-y-5 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 text-accent">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-black">Formação Acadêmica</h2>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {curriculo.formacoes?.map((form: any, i: number) => (
                  <div
                    key={i}
                    className="space-y-2 rounded-sm border border-[#d9d1c7] bg-white p-4"
                  >
                    <h3 className="text-sm font-bold text-black">{form.curso}</h3>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/72">
                        {form.instituicao}
                      </p>
                      <p className="mt-1 text-[10px] text-black/60">{form.periodo}</p>
                    </div>
                    <span className="inline-block rounded-full border border-accent/10 bg-accent/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-accent">
                      {form.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-sm bg-[#f0e6d8] text-black/30">
              <FileText className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-black">Crie seu currículo digital</h2>
              <p className="mx-auto max-w-sm text-sm font-medium text-black/70">
                Use nosso construtor inteligente para criar um currículo atraente e aumentar
                suas chances.
              </p>
            </div>
            <Link
              href="/candidato/curriculo/editar"
              className="inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-3 text-sm font-black text-accent-foreground transition-all hover:scale-105"
            >
              Começar Agora
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

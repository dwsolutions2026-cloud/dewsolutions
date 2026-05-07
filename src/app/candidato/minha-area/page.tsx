import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  UserCircle2,
  FileText,
  Send,
  ChevronRight,
  Briefcase,
  AlertCircle,
} from 'lucide-react'

export default async function MinhaAreaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: candidato } = await supabase
    .from('candidatos')
    .select('id, nome, curriculo_json, curriculo_url')
    .eq('user_id', user.id)
    .single()

  const { count: totalCandidaturas } = await supabase
    .from('candidaturas')
    .select('*', { count: 'exact', head: true })
    .eq('candidato_id', (candidato as any)?.id)

  const hasResume = !!(candidato?.curriculo_url || candidato?.curriculo_json)

  return (
    <div className="animate-in space-y-8 fade-in duration-700">
      <div>
        <h1 className="mb-1 text-2xl font-black tracking-tight text-primary">
          Olá, {candidato?.nome || 'Candidato'}
        </h1>
        <p className="text-sm font-medium text-muted-foreground opacity-70">
          Bem-vindo à sua área exclusiva.
        </p>
      </div>

      {!hasResume && (
        <div className="flex items-center gap-4 rounded-xl border border-accent/20 bg-accent/10 p-5 text-accent">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold">Seu currículo ainda não está completo.</p>
            <p className="text-xs opacity-80">
              Complete seu perfil e envie seu currículo para se candidatar às melhores vagas.
            </p>
          </div>
          <Link
            href="/candidato/curriculo"
            className="whitespace-nowrap rounded-lg bg-accent px-5 py-2 text-xs font-black text-accent-foreground shadow-md shadow-accent/10 transition-all hover:scale-105"
          >
            Completar agora
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="surface-warm flex flex-col items-center rounded-4xl p-6 text-center group">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-accent transition-transform group-hover:scale-110">
            <Send className="h-6 w-6" />
          </div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Candidaturas Ativas
          </p>
          <p className="text-3xl font-black text-primary">{totalCandidaturas || 0}</p>
        </div>

        <Link
          href="/candidato/perfil"
          className="surface-warm group flex h-full flex-col rounded-4xl p-6 transition-all hover:border-accent/40 hover:shadow-lg"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all group-hover:bg-accent group-hover:text-white">
            <UserCircle2 className="h-5 w-5" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-primary">Meu Perfil</h3>
          <p className="mb-4 flex-1 text-xs font-medium text-muted-foreground">
            Mantenha seus dados de contato e localização sempre atualizados.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent">
            Acessar perfil <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        <Link
          href="/candidato/curriculo"
          className="surface-warm group flex h-full flex-col rounded-4xl p-6 transition-all hover:border-accent/40 hover:shadow-lg"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all group-hover:bg-accent group-hover:text-white">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-primary">Currículo</h3>
          <p className="mb-4 flex-1 text-xs font-medium text-muted-foreground">
            Edite sua experiência, formação e habilidades no nosso construtor.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent">
            Editar currículo <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-4xl bg-primary p-8 text-white shadow-xl shadow-primary/20 md:p-12">
        <div className="absolute right-0 top-0 -mr-24 -mt-24 h-48 w-48 bg-accent opacity-20 blur-3xl" />
        <div className="relative max-w-xl">
          <h2 className="mb-4 text-2xl font-black leading-tight tracking-tight md:text-3xl">
            Encontre sua próxima grande oportunidade.
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-white/70">
            Confira as vagas selecionadas pela{' '}
            <span className="font-bold text-white underline decoration-accent">
              DW Solutions
            </span>{' '}
            que combinam com seu perfil.
          </p>
          <Link
            href="/vagas"
            className="inline-flex items-center gap-2.5 rounded-xl bg-accent px-8 py-3 text-sm font-black text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:scale-105"
          >
            <Briefcase className="h-4 w-4" /> Explorar Vagas
          </Link>
        </div>
      </div>
    </div>
  )
}

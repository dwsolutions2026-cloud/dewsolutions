import { createClient, isSupabaseConfigured } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import {
  MapPin,
  Briefcase,
  Building2,
  Share2,
  DollarSign,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { BotaoCandidatar } from '@/components/vagas/BotaoCandidatar'
import { Metadata } from 'next'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

async function getPublicVaga(slugOrId: string) {
  const supabase = await createClient()
  const cleaned = decodeURIComponent(slugOrId)

  let query = supabase
    .from('vagas')
    .select(
      `
      *,
      empresa:empresas (*)
    `
    )
    .eq('status', 'ativa')

  query = uuidPattern.test(cleaned) ? query.eq('id', cleaned) : query.eq('slug', cleaned)

  const { data, error } = await query.maybeSingle()

  if (error || !data || !(data.empresa as any)?.ativa) {
    return { vaga: null, supabase }
  }

  return { vaga: data, supabase }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isSupabaseConfigured()) {
    return {
      title: 'Vagas | DW Solutions',
      description: 'Acompanhe as oportunidades publicadas na D&W Solutions.',
    }
  }

  const { slug } = await params
  const { vaga } = await getPublicVaga(slug)

  if (!vaga) {
    return { title: 'Vaga não encontrada | DW Solutions' }
  }

  return {
    title: `${vaga.titulo} | ${(vaga.empresa as any)?.nome} — DW Solutions`,
    description: `Candidate-se para ${vaga.titulo} em ${vaga.cidade}/${vaga.estado}. Modalidade: ${vaga.modalidade}. Oportunidade selecionada pela D&W Solutions.`,
    openGraph: {
      title: `${vaga.titulo} — DW Solutions`,
      description: `${(vaga.empresa as any)?.nome} · ${vaga.cidade}/${vaga.estado} · ${vaga.modalidade}`,
      type: 'website',
    },
  }
}

export default async function VagaDetalhesPage({ params }: Props) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-6xl animate-in px-4 pb-6 pt-32 fade-in duration-700 sm:px-6 sm:pb-10 sm:pt-36">
        <div className="surface-card rounded-xl p-10 text-center shadow-none sm:rounded-2xl sm:p-16">
          <p className="text-sm font-bold text-muted-foreground sm:text-base">
            Os detalhes desta vaga estarão disponíveis assim que o ambiente for configurado.
          </p>
        </div>
      </div>
    )
  }

  const { slug } = await params
  const { vaga, supabase } = await getPublicVaga(slug)

  if (!vaga) notFound()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let jaCandidatou = false

  if (user) {
    const { data: candidatura } = await supabase
      .from('candidaturas')
      .select('id')
      .eq('vaga_id', vaga.id)
      .eq('user_id', user.id)
      .single()

    jaCandidatou = !!candidatura
  }

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-6 px-4 pb-6 pt-32 fade-in duration-700 sm:space-y-8 sm:px-6 sm:pb-10 sm:pt-36">
      <div className="flex items-center justify-between">
        <Link
          href="/vagas"
          className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground transition-colors hover:text-primary sm:gap-2 sm:text-xs"
        >
          <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Voltar
        </Link>
        <button
          className="rounded-full p-2 text-muted-foreground transition-all hover:bg-accent/5 hover:text-accent"
          aria-label="Compartilhar"
        >
          <Share2 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="lg:col-span-2">
          <div className="surface-warm space-y-8 rounded-2xl p-5 shadow-none sm:space-y-10 sm:rounded-[2rem] sm:p-8 lg:p-10">
            <div className="space-y-4 sm:space-y-5">
              <div className="inline-flex items-center rounded-full border border-accent/10 bg-accent/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-accent sm:px-3 sm:text-[10px]">
                {vaga.area}
              </div>

              <h1 className="text-2xl font-black leading-[1.1] tracking-tight text-primary sm:text-3xl md:text-4xl lg:text-5xl">
                {vaga.titulo}
              </h1>

              <div className="flex flex-wrap gap-3 text-[9px] font-bold text-muted-foreground sm:gap-5 sm:text-xs">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-accent sm:h-8 sm:w-8">
                    <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <span className="line-clamp-1">{(vaga.empresa as any)?.nome}</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-accent sm:h-8 sm:w-8">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  {vaga.cidade} - {vaga.estado}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-accent sm:h-8 sm:w-8">
                    <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  {vaga.modalidade}
                </div>
              </div>
            </div>

            <div className="h-px bg-border/50" />

            <div className="space-y-8 sm:space-y-10">
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-lg font-black uppercase tracking-tight text-primary sm:text-xl">
                  Descrição da vaga
                </h2>
                <p className="whitespace-pre-wrap text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
                  {vaga.descricao}
                </p>
              </section>

              {vaga.requisitos && (
                <section className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg font-black uppercase tracking-tight text-primary sm:text-xl">
                    Requisitos
                  </h2>
                  <div className="space-y-2.5 rounded-lg bg-background/30 p-4 sm:rounded-2xl sm:p-6 dark:bg-background/10">
                    {vaga.requisitos.split('\n').map((req: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 sm:gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent sm:h-4 sm:w-4" />
                        <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                          {req}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {vaga.beneficios && (
                <section className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg font-black uppercase tracking-tight text-primary sm:text-xl">
                    Benefícios
                  </h2>
                  <p className="whitespace-pre-wrap text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
                    {vaga.beneficios}
                  </p>
                </section>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 self-start sm:space-y-6">
          <div className="surface-warm space-y-4 rounded-xl p-4 shadow-none sm:space-y-6 sm:rounded-[2rem] sm:p-6">
            {vaga.exibir_salario && vaga.salario_min && (
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60 sm:text-[10px]">
                  Remuneração
                </p>
                <p className="text-xl font-black text-primary sm:text-2xl">
                  <DollarSign className="mr-1 inline h-5 w-5 text-accent" />
                  {vaga.salario_min.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                  {vaga.salario_max &&
                    ` - ${vaga.salario_max.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}`}
                </p>
              </div>
            )}

            <BotaoCandidatar 
              vagaId={vaga.id} 
              jaCandidatou={jaCandidatou} 
              isAutenticado={!!user} 
            />

            <p className="px-2 text-center text-[8px] font-medium leading-relaxed text-muted-foreground opacity-60 sm:text-[10px]">
              Ao se candidatar, seu currículo será compartilhado com o recrutador.
            </p>
          </div>

          <div className="surface-warm space-y-4 rounded-xl p-4 shadow-none sm:rounded-[2rem] sm:p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary opacity-70 sm:text-sm">
              Empresa
            </h3>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/30 text-accent dark:bg-background/10 sm:h-10 sm:w-10 sm:rounded-xl">
                <Building2 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>
              <p className="line-clamp-2 text-xs font-bold text-primary sm:text-sm">
                {(vaga.empresa as any)?.nome}
              </p>
            </div>
            <p className="text-[8px] italic leading-relaxed text-muted-foreground opacity-80 sm:text-xs">
              {(vaga.empresa as any)?.setor} · {(vaga.empresa as any)?.cidade} -{' '}
              {(vaga.empresa as any)?.estado}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { WhatsAppIcon } from '@/components/WhatsAppIcon'
import { DWSOLUTIONS_WHATSAPP_URL } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'D&W Solutions | Recrutamento e Seleção de Alta Performance',
  description:
    'Soluções inteligentes em recrutamento e seleção para empresas que precisam contratar com precisão.',
}

const shellPadding = 'px-5 sm:px-8 lg:px-10 xl:px-12'

const differentiators = [
  {
    title: 'Precisão',
    description: 'Processos assertivos e eficientes.',
    icon: Target,
  },
  {
    title: 'Conexão',
    description: 'Conectamos pessoas a propósito.',
    icon: Users,
  },
  {
    title: 'Resultados',
    description: 'Foco em resultados que geram impacto.',
    icon: TrendingUp,
  },
]

const services = [
  {
    title: 'Recrutamento e Seleção',
    description:
      'Identificamos e selecionamos os melhores talentos para impulsionar o crescimento da sua empresa.',
    icon: Search,
  },
  {
    title: 'Headhunting',
    description:
      'Busca especializada de executivos e profissionais de alta performance no mercado.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Avaliação Psicológica',
    description:
      'Análise profunda de competências e perfis comportamentais para garantir o fit cultural.',
    icon: ShieldCheck,
  },
  {
    title: 'Consultoria de RH',
    description:
      'Estruturação de processos internos, cargos e salários para otimizar sua gestão de pessoas.',
    icon: BrainCircuit,
  },
  {
    title: 'Suporte Especializado',
    description: 'Atendimento dedicado para garantir agilidade em todas as etapas do processo seletivo.',
    icon: Users,
  },
  {
    title: 'Treinamento e Desenvolvimento',
    description: 'Programas sob medida para elevar a performance das suas equipes.',
    icon: TrendingUp,
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <section
        id="home"
        className="relative isolate min-h-svh overflow-hidden bg-background pt-20 sm:pt-28"
      >
        <div className="absolute bottom-0 right-0 z-0 top-20 sm:top-28 lg:left-[15%] lg:translate-x-40">
          <Image
            src="/images/hero-team.png"
            alt="Equipe D&W Solutions"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover object-center opacity-10 transition-opacity duration-700 lg:object-contain lg:object-bottom-right lg:opacity-100"
          />
        </div>

        <div className="relative z-10 flex min-h-[calc(100svh-80px)] w-full items-center sm:min-h-[calc(100svh-112px)]">
          <div className="w-full lg:max-w-[50%]">
            <div className={`${shellPadding} pb-10 pt-4 sm:pb-6`}>
              <div className="relative mb-6 h-[60px] w-[140px] sm:mb-7 sm:h-[110px] sm:w-[280px]">
                <Logo width={280} height={110} variant="auto" />
              </div>

              <div className="max-w-176 space-y-5">
                <h1 className="text-[1.7rem] font-semibold leading-[1.1] tracking-tight text-primary dark:text-white sm:text-[3.7rem] lg:text-[4.35rem] lg:leading-[0.98] lg:tracking-[-0.055em]">
                  <span className="block whitespace-nowrap">Soluções inteligentes em</span>
                  <span className="block whitespace-nowrap">
                    <span className="text-accent italic">recrutamento</span> e{' '}
                    <span className="text-accent italic">seleção.</span>
                  </span>
                </h1>

                <div className="space-y-1.5 text-base leading-relaxed text-muted-foreground dark:text-white/78 sm:text-[1.05rem]">
                  <p>Conectamos talentos às oportunidades certas.</p>
                  <p>Inteligência. Estratégia. Resultados.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/anunciar-oportunidade"
                  className="gold-gradient group relative flex min-w-[240px] flex-col items-center justify-center gap-0.5 rounded-sm px-7 py-3 text-center shadow-[0_10px_35px_rgba(197,160,89,0.22)] transition-transform hover:scale-[1.01]"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/60">Para Empresas</span>
                  <span className="flex items-center gap-2 text-sm font-bold tracking-wider text-black">
                    ANUNCIAR VAGA
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  href="/vagas"
                  className="group relative flex min-w-[240px] flex-col items-center justify-center gap-0.5 rounded-sm border border-accent/80 bg-background/35 px-7 py-3 text-center backdrop-blur-[2px] transition-colors hover:bg-accent/10 dark:bg-black/20"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent/70">Para Talentos</span>
                  <span className="flex items-center gap-2 text-sm font-bold tracking-wider text-accent">
                    EXPLORAR VAGAS
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </div>

            <div className={shellPadding}>
              <div className="grid sm:grid-cols-3">
                {differentiators.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex gap-4 py-4 sm:pr-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/70 text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h2 className="text-lg font-semibold text-primary dark:text-white">
                          {item.title}
                        </h2>
                        <p className="text-sm leading-relaxed text-muted-foreground dark:text-white/68">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="border-t border-border/60 bg-background py-16 transition-colors duration-300 sm:py-20">
        <div className={`grid gap-10 ${shellPadding} lg:grid-cols-[0.9fr_1.1fr]`}>
          <div className="space-y-5">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-accent">Sobre nós</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-primary dark:text-white sm:text-5xl">
              Recrutamento com leitura de negócio, clareza e método.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-muted-foreground sm:text-lg dark:text-white/72">
            <p>
              A D&amp;W Solutions atua para tornar a contratação mais segura, humana e eficiente.
              Nosso trabalho une visão consultiva, curadoria de talentos e processos bem definidos.
            </p>
            <p>
              Priorizamos aderência real entre candidato, vaga e cultura organizacional. Isso reduz
              ruído, acelera decisões e melhora a qualidade das contratações.
            </p>
          </div>
        </div>
      </section>

      <section id="servicos" className="bg-background py-16 transition-colors duration-300 sm:py-20">
        <div className={shellPadding}>
          <div className="mb-12 max-w-3xl space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-accent">Serviços</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-primary dark:text-white sm:text-5xl">
              Soluções estratégicas para fortalecer sua contratação.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.title}
                  className="rounded-sm border border-border bg-card p-6 shadow-[0_24px_60px_rgba(0,0,0,0.08)] transition-colors duration-300 dark:border-white/10 dark:bg-white/3 dark:shadow-[0_24px_60px_rgba(0,0,0,0.2)]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-accent/70 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-semibold text-primary dark:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground dark:text-white/68">
                    {service.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="vagas" className="border-y border-border/60 bg-background py-16 transition-colors duration-300 sm:py-20 dark:border-white/10">
        <div className={`flex flex-col items-start justify-between gap-8 ${shellPadding} lg:flex-row`}>
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-accent">Vagas</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-primary dark:text-white sm:text-5xl">
              Uma mesma plataforma para empresas e talentos.
            </h2>
            <p className="text-lg leading-8 text-muted-foreground dark:text-white/70">
              Empresas anunciam oportunidades com rapidez. Candidatos acompanham vagas, perfil e
              candidaturas em um fluxo simples e direto.
            </p>
          </div>

          <Link
            href="/vagas"
            className="inline-flex items-center gap-3 rounded-sm border border-accent/80 px-7 py-4 text-sm font-bold tracking-[0.08em] text-accent transition-colors hover:bg-accent/10"
          >
            EXPLORAR VAGAS
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section id="contato" className="bg-background py-16 transition-colors duration-300 sm:py-20">
        <div className={shellPadding}>
          <div className="max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-accent">Contato</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-primary dark:text-white sm:text-5xl">
              Vamos conversar sobre a próxima contratação?
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground dark:text-white/70">
              Se você quer anunciar uma vaga ou entender melhor como a D&amp;W pode apoiar seu
              processo seletivo, o próximo passo pode começar agora.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/anunciar-oportunidade"
                className="gold-gradient inline-flex items-center justify-center gap-3 rounded-sm px-8 py-4 text-sm font-bold tracking-[0.08em] text-black"
              >
                SOLICITAR ATENDIMENTO
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={DWSOLUTIONS_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-sm border border-accent/80 px-8 py-4 text-sm font-bold tracking-[0.08em] text-accent"
              >
                FALAR NO WHATSAPP
                <WhatsAppIcon className="h-5 w-5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

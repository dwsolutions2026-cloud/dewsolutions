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
  MessageSquare,
  ChevronDown,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { WhatsAppIcon } from '@/components/WhatsAppIcon'
import { DWSOLUTIONS_WHATSAPP_URL } from '@/lib/whatsapp'
import { getConfiguracoes } from '@/app/actions/oportunidades'
import { CountUp } from '@/components/CountUp'

export const metadata: Metadata = {
  title: 'D&W Solutions | Recrutamento e Seleção de Alta Performance',
  description:
    'Soluções inteligentes em recrutamento e seleção para empresas que precisam contratar com precisão.',
}

const shellPadding = 'px-5 sm:px-8 lg:px-10 xl:px-12'

const differentiators = [
  { title: 'Precisão', description: 'Processos assertivos e eficientes.', icon: Target },
  { title: 'Conexão', description: 'Conectamos pessoas a propósito.', icon: Users },
  { title: 'Resultados', description: 'Foco em resultados que geram impacto.', icon: TrendingUp },
]

const services = [
  { title: 'Recrutamento e Seleção', description: 'Identificamos e selecionamos os melhores talentos para impulsionar o crescimento da sua empresa.', icon: Search },
  { title: 'Headhunting', description: 'Busca especializada de executivos e profissionais de alta performance no mercado.', icon: BriefcaseBusiness },
  { title: 'Avaliação Psicológica', description: 'Análise profunda de competências e perfis comportamentais para garantir o fit cultural.', icon: ShieldCheck },
  { title: 'Consultoria de RH', description: 'Estruturação de processos internos, cargos e salários para otimizar sua gestão de pessoas.', icon: BrainCircuit },
  { title: 'Suporte Especializado', description: 'Atendimento dedicado para garantir agilidade em todas as etapas do processo seletivo.', icon: Users },
  { title: 'Treinamento e Desenvolvimento', description: 'Programas sob medida para elevar a performance das suas equipes.', icon: TrendingUp },
]

const steps = [
  { title: 'Diagnóstico', desc: 'Cultura e perfil técnico da vaga.', icon: Search },
  { title: 'Mapeamento', desc: 'Busca ativa e Headhunting.', icon: Target },
  { title: 'Avaliação', desc: 'Testes técnicos e psicológicos.', icon: ShieldCheck },
  { title: 'Entrega', desc: 'Apresentação do Shortlist final.', icon: Users }
]

const faqs = [
  { q: 'Quanto tempo leva o processo?', a: 'Em média 7 a 10 dias úteis para os primeiros candidatos.' },
  { q: 'Como é feita a cobrança?', a: 'Modelo de success fee ou retainer conforme a vaga.' },
  { q: 'Oferecem garantia?', a: 'Sim, realizamos nova busca sem custo caso não haja adaptação.' },
  { q: 'Atendem todo o Brasil?', a: 'Sim, recrutamento remoto e presencial em todo o país.' }
]

export default async function LandingPage() {
  const configs = await getConfiguracoes()

  const parseJson = (val: string, fallback: any[]) => {
    try {
      return val ? JSON.parse(val) : fallback
    } catch (e) {
      return fallback
    }
  }

  const fallbackLogos = [
    'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  ]

  const fallbackStats = [
    { valor: '+500', label: 'Profissionais Contratados' },
    { valor: '98%', label: 'Taxa de Retenção' },
    { valor: '15+', label: 'Anos de Experiência' },
    { valor: '48h', label: 'Tempo Médio de Shortlist' }
  ]

  let clientLogos = parseJson(configs.landing_logos, fallbackLogos)
  if (!clientLogos || clientLogos.length === 0) clientLogos = fallbackLogos

  let stats = parseJson(configs.landing_stats, fallbackStats)
  if (!stats || stats.length === 0) stats = fallbackStats

  const testimonials = parseJson(configs.landing_depoimentos, [])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      {/* SEÇÃO HOME (RESTORED & ADJUSTED) */}
      <section id="home" className="relative isolate min-h-[95svh] bg-background pt-28 sm:pt-40">
        <div className="absolute bottom-0 right-0 z-0 top-0 w-full lg:w-[60%] pointer-events-none [mask-image:linear-gradient(to_right,transparent_5%,black_70%),linear-gradient(to_top,transparent,black_20%)] [mask-composite:intersect]">
          <Image
            src="/images/hero-team.png"
            alt="Equipe D&W Solutions"
            fill
            priority
            className="object-contain object-right opacity-10 transition-opacity duration-700 lg:opacity-100"
          />
        </div>

        <div className="relative z-10 flex min-h-[calc(95svh-112px)] sm:min-h-[calc(95svh-160px)] w-full items-center">
          <div className="w-full lg:max-w-[45%]">
            <div className={`${shellPadding} pb-6 pt-2`}>
              <div className="relative mb-4 h-[50px] w-[120px] sm:mb-6 sm:h-[90px] sm:w-[240px]">
                <Logo width={240} height={90} variant="auto" />
              </div>

              <div className="max-w-176 space-y-4">
                <h1 className="text-[1.6rem] font-semibold leading-[1.1] tracking-tight text-primary dark:text-white sm:text-[3.2rem] lg:text-[3.8rem] lg:leading-[0.98] lg:tracking-[-0.055em]">
                  <span className="block whitespace-nowrap">Soluções inteligentes em</span>
                  <span className="block whitespace-nowrap">
                    <span className="text-accent italic">recrutamento</span> e{' '}
                    <span className="text-accent italic">seleção.</span>
                  </span>
                </h1>

                <div className="space-y-1 text-sm leading-relaxed text-muted-foreground dark:text-white/78 sm:text-[0.95rem]">
                  <p>Conectamos talentos às oportunidades certas.</p>
                  <p>Inteligência. Estratégia. Resultados.</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/anunciar-oportunidade" className="gold-gradient group relative flex min-w-[200px] flex-col items-center justify-center gap-0.5 rounded-sm px-6 py-2.5 text-center shadow-[0_10px_35px_rgba(197,160,89,0.22)] transition-transform hover:scale-[1.01]">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-black/60">Para Empresas</span>
                  <span className="flex items-center gap-2 text-sm font-bold tracking-wider text-black">
                    ANUNCIAR VAGA
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link href="/vagas" className="group relative flex min-w-[200px] flex-col items-center justify-center gap-0.5 rounded-sm border border-accent/80 bg-background/35 px-6 py-2.5 text-center backdrop-blur-[2px] transition-colors hover:bg-accent/10 dark:bg-black/20">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-accent/70">Para Talentos</span>
                  <span className="flex items-center gap-2 text-sm font-bold tracking-wider text-accent">
                    EXPLORAR VAGAS
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </div>

            <div className={shellPadding}>
              <div className="grid sm:grid-cols-3 gap-2">
                {differentiators.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex gap-3 py-2 sm:pr-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/70 text-accent">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <h2 className="text-sm font-semibold text-primary dark:text-white">{item.title}</h2>
                        <p className="text-[11px] leading-relaxed text-muted-foreground dark:text-white/68">{item.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL (LOGOS) */}
      {clientLogos.length > 0 && (
        <section className="bg-[#050505] py-10 border-b border-white/5 relative z-20">
          <div className={shellPadding}>
            <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground dark:text-white/40 mb-8 opacity-60">Empresas que confiam em nós</p>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {clientLogos.map((logo: string, i: number) => (
                <div key={i} className="relative h-10 w-32">
                  <Image src={logo} alt="Cliente" fill className="object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEÇÃO SOBRE (RESTORED) */}
      <section id="sobre" className="py-16 transition-colors duration-300 sm:py-20 relative z-10">
        <div className={`grid gap-10 ${shellPadding} lg:grid-cols-[0.9fr_1.1fr]`}>
          <div className="space-y-5">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-accent">Sobre nós</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-primary dark:text-white sm:text-5xl">
              Recrutamento com leitura de negócio, clareza e método.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-muted-foreground sm:text-lg dark:text-white/72">
            <p>
              A D&W Solutions atua para tornar a contratação mais segura, humana e eficiente.
              Nosso trabalho une visão consultiva, curadoria de talentos e processos bem definidos.
            </p>
            <p>
              Priorizamos aderência real entre candidato, vaga e cultura organizacional. Isso reduz
              ruído, acelera decisões e melhora a qualidade das contratações.
            </p>
          </div>
        </div>

        {/* NÚMEROS (RESTORED) */}
        {stats.length > 0 && (
          <div className={`${shellPadding} mt-16`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat: any, i: number) => (
                <div key={i} className="surface-card p-6 rounded-sm text-center border border-border/50">
                  <p className="text-3xl sm:text-4xl font-black text-accent mb-1">
                    <CountUp value={stat.valor} />
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* COMO FUNCIONA (NEW SECTION) */}
      <section className="py-16 bg-muted/10 border-y border-border/30">
        <div className={shellPadding}>
          <div className="mb-10 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Método</p>
            <h2 className="text-3xl font-black text-primary dark:text-white">Como Funciona</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="surface-card p-6 rounded-sm relative overflow-hidden group hover:border-accent/40 border border-transparent">
                <div className="h-10 w-10 rounded-sm bg-accent text-black flex items-center justify-center mb-4">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm mb-1 dark:text-white">{step.title}</h3>
                <p className="text-[11px] text-muted-foreground dark:text-white/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVIÇOS (RESTORED) */}
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
                <div key={service.title} className="rounded-sm border border-border bg-card p-6 shadow-[0_24px_60px_rgba(0,0,0,0.08)] transition-colors duration-300 dark:border-white/10 dark:bg-white/3">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-accent/70 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-semibold text-primary dark:text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground dark:text-white/68">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS E FAQ (SIDE BY SIDE) */}
      <section className="py-16 bg-background border-t border-border/30">
        <div className={shellPadding}>
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <h2 className="text-2xl font-black text-primary dark:text-white">O que dizem</h2>
              <div className="grid gap-4">
                {testimonials.map((t: any, i: number) => (
                  <div key={i} className="surface-card p-6 rounded-sm border-none shadow-sm">
                    <p className="text-sm italic text-muted-foreground dark:text-white/80 mb-4 leading-relaxed">"{t.texto}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-[10px] text-accent uppercase">{t.nome[0]}</div>
                      <div>
                        <p className="font-black text-xs text-primary dark:text-white">{t.nome}</p>
                        <p className="text-[9px] font-bold text-accent uppercase tracking-wider">{t.cargo}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-2xl font-black text-primary dark:text-white">Dúvidas</h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details key={i} className="group border-b border-border pb-3 cursor-pointer">
                    <summary className="flex justify-between items-center font-bold text-xs uppercase tracking-wider text-primary dark:text-white list-none">
                      {faq.q}
                      <ChevronDown className="h-4 w-4 text-accent transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-[11px] text-muted-foreground dark:text-white/60 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VAGAS (RESTORED) */}
      <section id="vagas" className="border-y border-border/60 bg-background py-16 transition-colors duration-300 sm:py-20 dark:border-white/10">
        <div className={`flex flex-col items-start justify-between gap-8 ${shellPadding} lg:flex-row`}>
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-accent">Vagas</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-primary dark:text-white sm:text-5xl">Uma mesma plataforma para empresas e talentos.</h2>
            <p className="text-lg leading-8 text-muted-foreground dark:text-white/70">Empresas anunciam oportunidades com rapidez. Candidatos acompanham vagas, perfil e candidaturas em um fluxo simples e direto.</p>
          </div>
          <Link href="/vagas" className="inline-flex items-center gap-3 rounded-sm border border-accent/80 px-7 py-4 text-sm font-bold tracking-[0.08em] text-accent transition-colors hover:bg-accent/10">
            EXPLORAR VAGAS
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* CONTATO (RESTORED) */}
      <section id="contato" className="bg-background py-16 transition-colors duration-300 sm:py-20">
        <div className={shellPadding}>
          <div className="max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-accent">Contato</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-primary dark:text-white sm:text-5xl">Vamos conversar sobre a próxima contratação?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground dark:text-white/70">Se você quer anunciar uma vaga ou entender melhor como a D&W pode apoiar seu processo seletivo, o próximo passo pode começar agora.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/anunciar-oportunidade" className="gold-gradient inline-flex items-center justify-center gap-3 rounded-sm px-8 py-4 text-sm font-bold tracking-[0.08em] text-black">
                SOLICITAR ATENDIMENTO
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href={DWSOLUTIONS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 rounded-sm border border-accent/80 px-8 py-4 text-sm font-bold tracking-[0.08em] text-accent">
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

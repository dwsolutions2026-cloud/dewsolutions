import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
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

const differentiators = [
  {
    title: 'Precisão',
    description:
      'Processos seletivos mais assertivos, rápidos e alinhados com a cultura da empresa.',
    icon: Target,
  },
  {
    title: 'Conexão',
    description:
      'Aproximamos talentos qualificados de oportunidades com real potencial de crescimento.',
    icon: Users,
  },
  {
    title: 'Resultados',
    description:
      'Atuação orientada por performance, experiência do candidato e impacto no negócio.',
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
    icon: Target,
  },
  {
    title: 'Avaliação Psicológica',
    description:
      'Análise profunda de competências e perfis comportamentais para garantir o fit cultural.',
    icon: CheckCircle2,
  },
  {
    title: 'Consultoria de RH',
    description:
      'Estruturação de processos internos, cargos e salários para otimizar sua gestão de pessoas.',
    icon: Building2,
  },
  {
    title: 'Suporte Especializado',
    description:
      'Atendimento dedicado para garantir agilidade em todas as etapas do processo seletivo.',
    icon: ShieldCheck,
  },
  {
    title: 'Treinamento e Desenvolvimento',
    description: 'Programas sob medida para elevar a performance das suas equipes.',
    icon: TrendingUp,
  },
]

const faqItems = [
  {
    question: 'Para quais tipos de vaga a D&W atende?',
    answer:
      'Atendemos posições operacionais, administrativas, técnicas e estratégicas, sempre adaptando o processo à realidade da empresa.',
  },
  {
    question: 'Em quanto tempo vocês retornam um lead?',
    answer:
      'Nosso fluxo comercial foi pensado para responder rapidamente e alinhar o escopo da vaga com objetividade.',
  },
  {
    question: 'A plataforma também serve para candidatos?',
    answer:
      'Sim. O candidato pode criar perfil, acompanhar candidaturas e se conectar com vagas compatíveis com seu momento profissional.',
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background text-foreground transition-colors duration-300">
      <section
        id="home"
        className="relative flex min-h-[100svh] items-center pb-14 pt-24 sm:pb-16 sm:pt-28 md:pb-24 lg:pb-28"
      >
        <div className="pointer-events-none absolute inset-y-0 -right-[8%] z-0 flex items-end justify-end overflow-hidden md:-right-[10%] lg:-right-[12%]">
          <Image
            src="/images/hero-team.png?v=2"
            alt="Equipe D&W Solutions"
            width={4086}
            height={2491}
            priority
            unoptimized
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 82vw, 72vw"
            className="h-[56vh] w-auto max-w-none object-contain object-right-bottom sm:h-[62vh] md:h-[74vh] lg:h-[96vh]"
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 sm:px-6">
          <div className="max-w-4xl space-y-8 sm:space-y-10">
            <div className="relative h-[52px] w-[172px] sm:h-[64px] sm:w-[210px] md:h-[88px] md:w-[290px]">
              <Logo width={290} height={88} variant="auto" />
            </div>

            <div className="max-w-[18rem] space-y-4 sm:max-w-[28rem] sm:space-y-5 lg:max-w-3xl">
              <h1 className="text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-primary sm:text-5xl lg:text-6xl">
                Soluções inteligentes em
                <span className="mt-2 block gold-text-gradient">recrutamento e seleção.</span>
              </h1>
              <p className="max-w-xs text-sm font-medium leading-relaxed text-muted-foreground sm:max-w-xl sm:text-base md:text-xl">
                Conectamos talentos às oportunidades certas com estratégia, precisão e visão de
                longo prazo.
              </p>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent sm:text-xs md:text-sm">
                Inteligência. Estratégia. Resultados.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/anunciar-oportunidade"
                className="gold-gradient inline-flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-black shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] sm:w-auto sm:px-6 sm:text-xs md:px-8 md:py-4"
              >
                Solicitar orçamento
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
              <Link
                href="/vagas"
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border-2 border-accent px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-accent transition-all hover:bg-accent/8 sm:w-auto sm:px-6 sm:text-xs md:px-8 md:py-4"
              >
                Ver vagas
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </div>

            <div className="grid gap-3 pt-2 sm:gap-4 sm:pt-4 md:grid-cols-3">
              {differentiators.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/70 bg-card/85 p-4 backdrop-blur-md sm:p-5"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-accent/35 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-extrabold text-primary sm:text-xl">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="border-t border-border/70 bg-secondary/45 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-accent">Sobre nós</p>
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-primary md:text-5xl">
              Recrutamento com método, clareza e leitura de negócio.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-muted-foreground md:text-lg">
            <p>
              A D&amp;W Solutions atua para tornar a contratação mais segura, humana e eficiente.
              Nosso trabalho une visão consultiva, curadoria de talentos e processos bem definidos.
            </p>
            <p>
              Em vez de volume sem direção, priorizamos aderência real entre candidato, vaga e
              cultura organizacional. Isso reduz ruído, acelera decisões e melhora a qualidade das
              contratações.
            </p>
            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-card p-5">
                <p className="text-3xl font-extrabold text-accent">+ precisão</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Processos mais alinhados ao perfil e ao momento da empresa.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card p-5">
                <p className="text-3xl font-extrabold text-accent">+ agilidade</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Fluxo objetivo para reduzir tempo de resposta e retrabalho.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 max-w-3xl space-y-4">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-accent">Serviços</p>
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-primary md:text-5xl">
              Soluções completas para fortalecer sua estratégia de pessoas.
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Atuamos da atração ao desenvolvimento de talentos, com processos pensados para dar
              mais segurança, agilidade e qualidade às contratações.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.title}
                  className="rounded-3xl border border-border/70 bg-card p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-7"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-primary sm:text-2xl">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="vagas" className="border-y border-border/70 bg-secondary/45 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-accent">
              Vagas e empresas
            </p>
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-primary md:text-5xl">
              A mesma plataforma atende quem contrata e quem busca a próxima oportunidade.
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Empresas podem anunciar oportunidades com rapidez. Candidatos encontram vagas,
              acompanham candidaturas e mantêm o perfil pronto para novas conexões.
            </p>
          </div>

          <div className="rounded-3xl border border-accent/20 bg-card p-6 shadow-[0_24px_80px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="space-y-4 text-sm leading-7 text-muted-foreground">
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <p>Fluxo comercial mais direto para empresas que precisam abrir vagas com qualidade.</p>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <p>Experiência simples para candidatos se cadastrarem e visualizarem oportunidades.</p>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <p>Painel administrativo preparado para acompanhar leads, vagas e perfis.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="/vagas"
                className="gold-gradient inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-black transition-transform hover:scale-[1.01]"
              >
                Explorar vagas
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/anunciar-oportunidade"
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-accent/50 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-accent hover:bg-accent/8"
              >
                Anunciar oportunidade
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 max-w-3xl space-y-4">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-accent">FAQ</p>
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-primary md:text-5xl">
              Informações rápidas para quem está avaliando a plataforma.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-2xl border border-border/70 bg-card p-6">
                <h3 className="text-lg font-extrabold text-primary">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="border-t border-border/70 bg-secondary/45 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-accent">Contato</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-primary md:text-5xl">
            Vamos conversar sobre a próxima contratação?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Se você quer anunciar uma vaga ou entender melhor como a D&amp;W pode apoiar seu
            processo seletivo, o próximo passo pode começar agora.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/anunciar-oportunidade"
              className="gold-gradient inline-flex items-center justify-center gap-3 rounded-xl px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-black"
            >
              Solicitar atendimento
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href={DWSOLUTIONS_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-xl border border-accent px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-accent"
            >
              Falar no WhatsApp
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      <Link
        href={DWSOLUTIONS_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="group fixed bottom-4 right-4 z-50 block h-14 w-14 transition-transform hover:scale-[1.04] active:scale-[0.98] sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
      >
        <span
          aria-hidden="true"
          className="animate-whatsapp-pulse absolute inset-0 rounded-full bg-[#25D366] opacity-30 blur-md"
        />
        <span
          aria-hidden="true"
          className="animate-whatsapp-ring absolute inset-[-6px] rounded-full border border-[#25D366]/35"
        />
        <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_28px_rgba(37,211,102,0.35)] sm:h-16 sm:w-16">
          <WhatsAppIcon variant="mono" className="h-7 w-7 sm:h-8 sm:w-8" />
        </span>
      </Link>
    </div>
  )
}

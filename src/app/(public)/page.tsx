import Link from 'next/link'
import { Briefcase, Users, ShieldCheck, Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 bg-background border-b border-border/50">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-muted border border-border text-accent text-sm font-semibold px-4 py-2 rounded-full mb-8">
          <Briefcase className="w-4 h-4" />
          Plataforma de Recrutamento
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight mb-4 max-w-3xl tracking-tight">
          Encontre a vaga
          <br />
          <span className="text-accent">ideal para você</span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          Conectamos candidatos qualificados às melhores oportunidades do mercado. Cadastre-se e encontre sua próxima carreira.
        </p>

        {/* Search bar */}
        <div className="flex w-full max-w-lg gap-0 shadow-xl rounded-xl overflow-hidden border border-border">
          <div className="flex items-center gap-3 flex-1 bg-muted/50 px-4">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Buscar vagas..."
              className="flex-1 bg-transparent text-foreground placeholder-muted-foreground py-3.5 outline-none text-sm"
            />
          </div>
          <Link
            href="/vagas"
            className="bg-accent text-accent-foreground font-bold px-6 py-3.5 text-sm hover:opacity-90 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            Buscar →
          </Link>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-3 mt-6 text-muted-foreground text-sm font-medium">
          <span>CLT</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Remoto</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Estágio</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>PJ</span>
        </div>
      </section>

      {/* ── POR QUE USAR ─────────────────────────────────── */}
      <section className="bg-background py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              Por que usar nossa plataforma?
            </h2>
            <p className="text-muted-foreground text-base">Segurança, agilidade e oportunidades reais.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <Briefcase className="w-6 h-6 text-accent" />,
                title: 'Vagas Verificadas',
                desc: 'Todas as vagas são publicadas por empresas aprovadas pelo nosso RH.',
              },
              {
                icon: <Users className="w-6 h-6 text-accent" />,
                title: 'Candidatura Rápida',
                desc: 'Cadastre-se uma vez e candidate-se a qualquer vaga com um clique.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-accent" />,
                title: 'Dados Protegidos',
                desc: 'Seus dados são tratados conforme a LGPD com total segurança.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-muted/30 border border-border rounded-2xl p-8 flex flex-col items-center text-center hover:border-accent/30 transition-all hover:shadow-lg"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-foreground font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-background px-4 pb-24">
        <div className="max-w-3xl mx-auto bg-accent rounded-2xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black text-accent-foreground mb-3">
            Pronto para começar?
          </h2>
          <p className="text-accent-foreground/80 text-base mb-8">
            Crie sua conta gratuita e candidate-se às melhores vagas do mercado.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-colors text-sm"
            >
              Criar Conta Grátis
            </Link>
            <Link
              href="/vagas"
              className="border border-accent-foreground/30 text-accent-foreground font-bold px-8 py-3 rounded-lg hover:bg-black/5 transition-colors text-sm"
            >
              Ver Vagas
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="bg-background border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} D&W Solutions. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacidade" className="text-muted-foreground hover:text-accent transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/vagas" className="text-muted-foreground hover:text-accent transition-colors">
              Vagas
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

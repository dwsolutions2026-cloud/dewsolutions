import { Header } from '@/components/layout/Header'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DW Solutions | Plataforma de Recrutamento',
  description: 'Conectando talentos às melhores empresas.',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {children}
      </main>
      <footer className="bg-card border-t border-border pt-20 pb-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <HeaderLogo />
            <p className="text-muted-foreground text-sm font-medium max-w-sm leading-relaxed">
              A <span className="text-primary font-bold">DW Solutions</span> é focada em conectar talentos de alta performance às melhores empresas do mercado, através de processos ágeis e humanizados.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Plataforma</h4>
            <ul className="space-y-4">
              <li><Link href="/vagas" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">Vagas Abertas</Link></li>
              <li><Link href="/cadastro" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">Cadastrar Currículo</Link></li>
              <li><Link href="/anunciar-oportunidade" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">Para Empresas</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Institucional</h4>
            <ul className="space-y-4">
              <li><Link href="/sobre" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">Sobre Nós</Link></li>
              <li><Link href="/planos" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">Planos e Preços</Link></li>
              <li><Link href="/privacidade" className="text-sm text-muted-foreground hover:text-accent transition-colors font-medium">Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} DW Solutions. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">Feito com foco em resultados</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeaderLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <div className="w-4 h-4 bg-accent rounded-sm rotate-45" />
      </div>
      <span className="text-xl font-black text-primary tracking-tighter uppercase">DW Solutions</span>
    </div>
  )
}

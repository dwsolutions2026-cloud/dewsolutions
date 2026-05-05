import Link from 'next/link'
import { Metadata } from 'next'
import { Logo } from '@/components/Logo'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'D&W Solutions | Gestão e Soluções',
  description: 'Conectando excelência, recrutamento estratégico e oportunidades com clareza.',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col transition-colors duration-300">
      <Header />
      <main className="grow">{children}</main>
      <footer className="mt-20 border-t border-border/70 bg-card/70 pb-10 pt-20">
        <div className="mx-auto mb-16 grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4">
          <div className="space-y-6 md:col-span-2">
            <div className="flex justify-start">
              <Logo width={180} height={50} variant="auto" />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A <span className="font-bold text-primary">D&amp;W Solutions</span> conecta talentos
              de alta performance às melhores empresas do mercado, com processos ágeis,
              organizados e humanizados.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">
              Institucional
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/#sobre" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/#servicos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
                  Nossos serviços
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
                  Dúvidas frequentes
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">
              Acesso e suporte
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
                  Área do candidato
                </Link>
              </li>
              <li>
                <Link href="/#contato" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
                  Fale conosco
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border px-6 pt-8 md:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            &copy; {new Date().getFullYear()} D&amp;W Solutions. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
              Feito com foco em resultados
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

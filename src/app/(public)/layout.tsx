import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Header } from '@/components/layout/Header'
import { WhatsAppIcon } from '@/components/WhatsAppIcon'
import { DWSOLUTIONS_WHATSAPP_URL } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'D&W Solutions | Gestão e Soluções',
  description: 'Conectando excelência, recrutamento estratégico e oportunidades com clareza.',
}

const shellPadding = 'px-5 sm:px-8 lg:px-10 xl:px-12'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col transition-colors duration-300">
      <Header />
      <main className="grow">{children}</main>

      <Link
        href={DWSOLUTIONS_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
        className="fixed bottom-5 right-5 z-[70] rounded-full transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366]/20 blur-xl animate-whatsapp-pulse" />
        <span className="absolute inset-0 rounded-full border border-[#25D366]/25 animate-whatsapp-ring" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_16px_40px_rgba(37,211,102,0.38)] sm:h-16 sm:w-16">
          <WhatsAppIcon className="h-14 w-14 sm:h-16 sm:w-16" />
        </span>
      </Link>

      <footer className="mt-16 border-t border-border/70 bg-card/70 pb-8 pt-14 sm:mt-20 sm:pb-10 sm:pt-20">
        <div
          className={`mb-12 grid grid-cols-1 gap-10 md:mb-16 md:grid-cols-4 md:gap-12 ${shellPadding}`}
        >
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
                <Link
                  href="/#sobre"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href="/#servicos"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                >
                  Nossos serviços
                </Link>
              </li>
              <li>
                <Link
                  href="/vagas"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                >
                  Vagas abertas
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
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                >
                  Área do candidato
                </Link>
              </li>
              <li>
                <Link
                  href="/#contato"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                >
                  Fale conosco
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-center md:flex-row md:text-left ${shellPadding}`}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            &copy; {new Date().getFullYear()} D&amp;W Solutions. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground opacity-40">
              Feito com foco em resultados
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

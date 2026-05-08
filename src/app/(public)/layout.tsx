import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppIcon } from '@/components/WhatsAppIcon'
import { DWSOLUTIONS_WHATSAPP_URL } from '@/lib/whatsapp'
import { getConfiguracoes } from '@/app/actions/oportunidades'

export const metadata: Metadata = {
  title: 'D&W Solutions | Gestão e Soluções',
  description: 'Conectando excelência, recrutamento estratégico e oportunidades com clareza.',
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const configs = await getConfiguracoes()

  return (
    <div className="flex min-h-screen flex-col transition-colors duration-300">
      <Header />
      <main className="grow">{children}</main>

      <Link
        href={DWSOLUTIONS_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
        className="fixed bottom-5 right-5 z-70 rounded-full transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366]/20 blur-xl animate-whatsapp-pulse" />
        <span className="absolute inset-0 rounded-full border border-[#25D366]/25 animate-whatsapp-ring" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_16px_40px_rgba(37,211,102,0.38)] sm:h-16 sm:w-16">
          <WhatsAppIcon className="h-14 w-14 sm:h-16 sm:w-16" />
        </span>
      </Link>

      <Footer configs={configs} />
    </div>
  )
}

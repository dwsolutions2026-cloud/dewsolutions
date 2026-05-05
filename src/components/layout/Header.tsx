'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { WhatsAppIcon } from '@/components/WhatsAppIcon'
import { DWSOLUTIONS_WHATSAPP_URL } from '@/lib/whatsapp'

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isHome = pathname === '/'
  const showLogo = !isHome || scrolled

  const navLinks = [
    { href: '/#home', label: 'HOME' },
    { href: '/#sobre', label: 'SOBRE NÓS' },
    { href: '/#servicos', label: 'SERVIÇOS' },
    { href: '/#vagas', label: 'VAGAS' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#contato', label: 'CONTATO' },
  ]

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-border/70 bg-background/92 py-3 backdrop-blur-md'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-4 px-6">
        <div className="w-[128px] shrink-0">
          <Link
            href="/"
            aria-hidden={!showLogo}
            className={`block transition-all duration-300 ${
              showLogo ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <Logo width={128} height={40} variant="auto" />
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-5 xl:flex xl:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-[10px] font-black tracking-[0.22em] transition-all hover:text-accent xl:text-[11px] xl:tracking-[0.24em] ${
                pathname === '/' && link.href === '/#home'
                  ? 'text-accent'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <ThemeToggle className="border-border/70 bg-card/70 text-muted-foreground shadow-none backdrop-blur-md hover:bg-card hover:text-primary" />
          <Link
            href="/login"
            className="whitespace-nowrap rounded-lg border border-border/70 bg-card/70 px-4 py-2.5 text-[9px] font-black tracking-[0.16em] text-primary transition-all hover:border-accent/40 hover:text-accent"
          >
            ÁREA DO CANDIDATO
          </Link>
          <Link
            href={DWSOLUTIONS_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 whitespace-nowrap rounded-lg border border-accent/40 px-4 py-2.5 text-[9px] font-black tracking-[0.18em] text-accent transition-all hover:bg-accent hover:text-black"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0" />
            FALE CONOSCO
          </Link>
        </div>

        <div className="flex items-center gap-3 xl:hidden">
          <ThemeToggle className="border-border/70 bg-card/70 text-muted-foreground shadow-none backdrop-blur-md hover:bg-card hover:text-primary" />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-primary transition-colors hover:text-accent"
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="animate-in slide-in-from-top-4 border-t border-border/70 bg-background duration-300 xl:hidden">
          <div className="container mx-auto flex flex-col gap-6 px-6 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-black tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="flex items-center justify-center rounded-xl border border-border/70 bg-card/70 py-4 text-xs font-black tracking-[0.18em] text-primary transition-all hover:border-accent/40 hover:text-accent"
            >
              ÁREA DO CANDIDATO
            </Link>
            <Link
              href={DWSOLUTIONS_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-accent py-4 text-xs font-black tracking-[0.18em] text-accent"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" />
              FALE CONOSCO
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

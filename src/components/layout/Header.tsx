'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, UserCircle2, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/utils/supabase/client'

const navLinks = [
  { href: '/#home', label: 'HOME' },
  { href: '/#sobre', label: 'SOBRE NÓS' },
  { href: '/#servicos', label: 'SERVIÇOS' },
  { href: '/vagas', label: 'VAGAS' },
  { href: '/#contato', label: 'CONTATO' },
]

const shellPadding = 'px-5 sm:px-8 lg:px-10 xl:px-12'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, role } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const hideHeaderLogo = isHome && !scrolled
  const candidateAreaHref = user
    ? role === 'admin'
      ? '/admin/dashboard'
      : role === 'empresa'
        ? '/empresa/dashboard'
        : '/candidato/minha-area'
    : '/login'

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/72 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] dark:bg-black/62'
          : 'bg-background/18 backdrop-blur-md dark:bg-black/12'
      }`}
    >
      <div className={`flex items-center justify-between gap-4 py-4 ${shellPadding}`}>
        <Link
          href="/"
          className={`shrink-0 transition-all duration-300 ${
            hideHeaderLogo ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          aria-hidden={hideHeaderLogo}
          tabIndex={hideHeaderLogo ? -1 : 0}
        >
          <Logo width={182} height={58} variant="auto" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-bold tracking-[0.12em] transition-colors ${
                link.href === '/#home'
                  ? 'text-accent'
                  : 'text-primary hover:text-accent dark:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle className="border-border/60 bg-background/35 text-foreground/80 hover:bg-background/55 hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white" />
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={candidateAreaHref}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-accent/70 bg-background/22 px-4 py-3 text-sm font-bold tracking-[0.08em] text-accent backdrop-blur-sm transition-colors hover:bg-accent/12 hover:text-accent dark:bg-black/12 dark:hover:bg-accent/10 dark:hover:text-accent"
                title="Meu Perfil"
              >
                <UserCircle2 className="h-5 w-5" />
                <span className="hidden xl:inline">PERFIL</span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-sm border border-red-500/50 bg-red-500/10 p-3 text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-sm border border-accent/70 bg-background/22 px-5 py-3 text-sm font-bold tracking-[0.08em] text-accent backdrop-blur-sm transition-colors hover:bg-accent/12 hover:text-accent dark:bg-black/12 dark:hover:bg-accent/10 dark:hover:text-accent"
            >
              ÁREA DO CANDIDATO
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle className="border-border/60 bg-background/35 text-foreground/80 hover:bg-background/55 hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white" />
          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-md border border-border/60 bg-background/35 p-2 text-foreground/90 dark:border-white/10 dark:bg-white/5 dark:text-white/90"
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border/60 bg-background/92 backdrop-blur-xl dark:border-accent/20 dark:bg-black/96 lg:hidden">
          <div className={`flex flex-col gap-3 py-5 ${shellPadding}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-border bg-card/70 px-4 py-3 text-sm font-bold tracking-widest text-foreground dark:border-white/10 dark:bg-white/3 dark:text-white/88"
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={candidateAreaHref}
                  className="flex items-center justify-center gap-2 rounded-lg border border-accent/70 bg-background/30 px-4 py-3 text-sm font-bold tracking-widest text-accent dark:bg-white/3"
                >
                  <UserCircle2 className="h-5 w-5" />
                  PERFIL
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm font-bold tracking-widest text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
                >
                  <LogOut className="h-5 w-5" />
                  SAIR
                </button>
              </div>
            ) : (
                <Link
                  href="/login"
                  className="rounded-lg border border-accent/70 bg-background/30 px-4 py-3 text-sm font-bold tracking-widest text-accent dark:bg-white/3"
                >
                ÁREA DO CANDIDATO
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

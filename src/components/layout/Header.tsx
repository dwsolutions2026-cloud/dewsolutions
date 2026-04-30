'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, User, Menu, X } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/vagas', label: 'Vagas', external: false },
    { href: '/anunciar-oportunidade', label: 'Anunciar Oportunidade', external: false },
    { href: '/privacidade', label: 'Privacidade', external: false },
  ]

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex-1">
          <Logo width={120} height={40} />
        </Link>

        {/* Nav center - Desktop only */}
        <nav className="hidden lg:flex items-center gap-6 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs sm:text-sm font-bold transition-colors ${
                pathname.startsWith(link.href) ? 'text-accent' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions right */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
          <ThemeToggle />
          
          <div className="h-6 w-px bg-border hidden md:block" />

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href={
                  user.user_metadata?.role === 'admin' 
                    ? '/admin/dashboard' 
                    : user.user_metadata?.role === 'empresa' 
                      ? '/empresa/dashboard' 
                      : '/candidato/minha-area'
                }
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {user.user_metadata?.role === 'admin' ? 'Painel Admin' : 'Minha Área'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/cadastro"
                className="text-xs sm:text-sm font-bold text-muted-foreground hover:text-primary transition-colors hidden sm:block"
              >
                Criar Conta
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1 sm:gap-2 bg-accent text-accent-foreground text-xs sm:text-sm font-black px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:scale-105 transition-all shadow-lg shadow-accent/20"
              >
                <User className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span className="hidden sm:inline">Entrar</span>
                <span className="sm:hidden">Log in</span>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  pathname.startsWith(link.href)
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <div className="h-[1px] bg-border my-3" />
                <Link
                  href={
                    user.user_metadata?.role === 'admin' 
                      ? '/admin/dashboard' 
                      : user.user_metadata?.role === 'empresa' 
                        ? '/empresa/dashboard' 
                        : '/candidato/minha-area'
                  }
                  className="block px-4 py-2 rounded-lg text-sm font-bold text-muted-foreground hover:bg-muted transition-colors"
                >
                  {user.user_metadata?.role === 'admin' ? 'Painel Admin' : 'Minha Área'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  Sair
                </button>
              </>
            )}
            {!user && (
              <Link
                href="/cadastro"
                className="block px-4 py-2 rounded-lg text-sm font-bold text-muted-foreground hover:bg-muted transition-colors"
              >
                Criar Conta
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/components/AuthProvider'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo width={140} height={44} />
        </Link>

        {/* Nav center */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/vagas"
            className={`text-sm font-bold transition-colors ${
              pathname.startsWith('/vagas') ? 'text-accent' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Vagas
          </Link>
          <Link
            href="/privacidade"
            className={`text-sm font-bold transition-colors ${
              pathname === '/privacidade' ? 'text-accent' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Privacidade
          </Link>
        </nav>

        {/* Actions right */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={
                  user.user_metadata?.role === 'admin' 
                    ? '/admin/dashboard' 
                    : user.user_metadata?.role === 'empresa' 
                      ? '/empresa/dashboard' 
                      : '/candidato/minha-area'
                }
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {user.user_metadata?.role === 'admin' ? 'Painel Admin' : 'Minha Área'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-red-500 transition-colors ml-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/cadastro"
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors hidden sm:block"
              >
                Criar Conta
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 bg-accent text-accent-foreground text-sm font-black px-4 py-2 rounded-lg hover:scale-105 transition-all shadow-lg shadow-accent/20"
              >
                <User className="w-4 h-4" />
                Entrar
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Logo width={140} height={44} />
        </Link>

        {/* Nav center */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/vagas"
            className={`text-sm font-medium transition-colors ${
              pathname.startsWith('/vagas') ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Vagas
          </Link>
          <Link
            href="/privacidade"
            className={`text-sm font-medium transition-colors ${
              pathname === '/privacidade' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
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
                href="/candidato/candidaturas"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="w-4 h-4" />
                Minha Área
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors ml-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/cadastro"
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Criar Conta
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 bg-accent text-accent-foreground text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
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

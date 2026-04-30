'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, FileText, Briefcase, ChevronRight, LayoutDashboard } from 'lucide-react'

export default function CandidatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Minha Área',
      href: '/candidato/minha-area',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: 'Minhas Candidaturas',
      href: '/candidato/candidaturas',
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      title: 'Meu Currículo',
      href: '/candidato/curriculo/editar',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: 'Minhas Informações',
      href: '/candidato/perfil/editar',
      icon: <User className="w-5 h-5" />,
    },
  ]

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:block shrink-0">
        <div className="p-6">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
            Área do Candidato
          </h2>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-accent text-white shadow-md shadow-accent/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-semibold">{item.title}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-8 left-6 right-6">
          <div className="bg-muted/50 rounded-2xl p-4 border border-border">
            <p className="text-xs text-muted-foreground font-medium mb-2">Suporte D&W</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Dúvidas sobre o seu processo? Entre em contato com nosso RH.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

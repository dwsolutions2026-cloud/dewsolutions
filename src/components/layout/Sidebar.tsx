'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Send,
  Settings,
  UserCircle2,
  UserSquare2,
  Users,
  X,
  LogOut,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSidebar } from './SidebarProvider'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/utils/supabase/client'
import { ThemeToggle } from '@/components/ThemeToggle'
import { logoutAction } from '@/app/actions/auth'

type MenuItem = {
  title: string
  href: string
  icon: typeof LayoutDashboard
  badge?: boolean
}

const ADMIN_MENU: MenuItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Empresas', href: '/admin/empresas', icon: Building2 },
  { title: 'Banco de Talentos', href: '/admin/talentos', icon: UserSquare2 },
  { title: 'Vagas Publicadas', href: '/admin/vagas', icon: Briefcase },
  { title: 'Candidatos e Status', href: '/admin/candidatos', icon: Users },
  { title: 'Leads de Empresas', href: '/admin/oportunidades', icon: Send, badge: true },
]

const CANDIDATO_MENU: MenuItem[] = [
  { title: 'Minha Área', href: '/candidato/minha-area', icon: LayoutDashboard },
  { title: 'Currículo', href: '/candidato/curriculo', icon: FileText },
  { title: 'Minhas Candidaturas', href: '/candidato/candidaturas', icon: Send },
  { title: 'Meu Perfil', href: '/candidato/perfil', icon: UserCircle2 },
]

const EMPRESA_MENU: MenuItem[] = [
  { title: 'Dashboard', href: '/empresa/dashboard', icon: LayoutDashboard },
  { title: 'Minhas Vagas', href: '/empresa/vagas', icon: Briefcase },
  { title: 'Publicar Vaga', href: '/empresa/vagas/nova', icon: PlusCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { role } = useAuth()
  const [newLeadsCount, setNewLeadsCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await logoutAction()
  }

  const menuItems =
    role === 'admin' ? ADMIN_MENU : role === 'empresa' ? EMPRESA_MENU : CANDIDATO_MENU
  const title = role === 'admin' ? 'Administração' : role === 'empresa' ? 'Empresa' : 'Candidato'

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (role !== 'admin') return
    if (!supabase) return

    const fetchCount = async () => {
      const { count } = await supabase
        .from('oportunidade_leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'novo')
      setNewLeadsCount(count || 0)
    }

    fetchCount()

    const channel = supabase
      .channel('leads-badge')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'oportunidade_leads' },
        () => {
          fetchCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [role, supabase])

  const renderMenuItems = () => (
    <>
      {!isCollapsed && (
        <div className="mb-4 px-3">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px]">
            {title}
          </p>
        </div>
      )}

      {menuItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/admin/dashboard' &&
            item.href !== '/candidato/minha-area' &&
            item.href !== '/empresa/dashboard' &&
            pathname.startsWith(item.href))
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            title={isCollapsed ? item.title : ''}
            className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 transition-all sm:rounded-xl sm:px-3 ${isActive
              ? 'bg-accent/15 text-accent font-bold'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 transition-colors sm:h-5 sm:w-5 ${isActive
                ? 'text-accent'
                : 'text-muted-foreground group-hover:text-foreground'
                }`}
            />

            {!isCollapsed && (
              <span className="truncate text-xs font-bold tracking-tight">{item.title}</span>
            )}

            {role === 'admin' && item.badge && newLeadsCount > 0 && (
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white sm:text-[9px] ${isCollapsed ? 'absolute right-1 top-1' : 'ml-auto'
                  }`}
              >
                {newLeadsCount}
              </span>
            )}

            {isActive && !isCollapsed && !item.badge && (
              <ChevronRight className="ml-auto h-3 w-3 opacity-50 sm:h-3.5 sm:w-3.5" />
            )}

            {isCollapsed && (
              <div className="pointer-events-none absolute left-full z-100 ml-4 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[9px] font-bold text-background opacity-0 transition-opacity group-hover:opacity-100">
                {item.title}
              </div>
            )}
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      <aside
        className={`sticky top-0 hidden h-screen flex-col border-r border-border bg-accent/5 transition-all duration-300 ease-in-out lg:flex ${isCollapsed ? 'w-16 sm:w-20' : 'w-56 sm:w-64'
          }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-primary-foreground shadow-none transition-transform hover:scale-110 lg:top-6"
          aria-label="Alternar sidebar"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className="flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto p-2 pt-6 sm:space-y-1 sm:p-3">
          {renderMenuItems()}
        </div>

        <div className="mt-auto border-t border-border p-2 sm:p-3 space-y-2">
          {role === 'admin' && (
            <Link
              href="/admin/configuracoes"
              title={isCollapsed ? 'Configurações' : ''}
              className="group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground sm:rounded-xl sm:px-3"
            >
              <Settings className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              {!isCollapsed && <span className="text-xs font-bold">Configurações</span>}

              {isCollapsed && (
                <div className="pointer-events-none absolute left-full z-100 ml-4 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[9px] font-bold text-background opacity-0 transition-opacity group-hover:opacity-100">
                  Configurações
                </div>
              )}
            </Link>
          )}
          
          <div className={`flex ${isCollapsed ? 'justify-center' : 'px-1'}`}>
            <ThemeToggle className={isCollapsed ? 'w-10 h-10' : 'w-full flex justify-center'} />
          </div>

          <div className={`flex ${isCollapsed ? 'justify-center' : 'px-1'}`}>
            <button
              onClick={handleSignOut}
              title={isCollapsed ? 'Sair da conta' : ''}
              className={`group relative flex items-center justify-center gap-3 rounded-lg py-2 text-red-500/80 transition-all hover:bg-red-500/10 hover:text-red-500 sm:rounded-xl ${isCollapsed ? 'w-10 h-10 px-0' : 'w-full px-3'}`}
            >
              <LogOut className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              {!isCollapsed && <span className="text-xs font-bold">Sair da conta</span>}

              {isCollapsed && (
                <div className="pointer-events-none absolute left-full z-100 ml-4 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[9px] font-bold text-background opacity-0 transition-opacity group-hover:opacity-100">
                  Sair
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-none transition-transform hover:scale-110"
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 animate-in fade-in duration-200 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />

          <div className="absolute bottom-24 left-4 right-4 max-w-xs animate-in slide-in-from-bottom-4 rounded-2xl border border-border bg-card shadow-lg duration-200">
            <div className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
              {renderMenuItems()}

              <div className="my-3 h-px bg-border" />
              {role === 'admin' && (
                <Link
                  href="/admin/configuracoes"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground mb-2"
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-bold">Configurações</span>
                </Link>
              )}
              <div className="px-1">
                <ThemeToggle className="w-full flex justify-center" />
              </div>

              <div className="px-1 mt-2 border-t border-border pt-2">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-3 rounded-lg py-2 text-red-500/80 transition-all hover:bg-red-500/10 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-bold">Sair da conta</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

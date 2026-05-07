'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSidebar } from './SidebarProvider'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/utils/supabase/client'

type MenuItem = {
  title: string
  href: string
  icon: typeof LayoutDashboard
  badge?: boolean
}

const ADMIN_MENU: MenuItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Vagas Publicadas', href: '/admin/vagas', icon: Briefcase },
  { title: 'Empresas', href: '/admin/empresas', icon: Building2 },
  { title: 'Leads de Empresas', href: '/admin/oportunidades', icon: Send, badge: true },
  { title: 'Banco de Talentos', href: '/admin/talentos', icon: UserSquare2 },
  { title: 'Candidatos e Status', href: '/admin/candidatos', icon: Users },
]

const CANDIDATO_MENU: MenuItem[] = [
  { title: 'Minha Área', href: '/candidato/minha-area', icon: LayoutDashboard },
  { title: 'Meu Perfil', href: '/candidato/perfil', icon: UserCircle2 },
  { title: 'Currículo', href: '/candidato/curriculo', icon: FileText },
  { title: 'Minhas Candidaturas', href: '/candidato/candidaturas', icon: Send },
]

const EMPRESA_MENU: MenuItem[] = [
  { title: 'Dashboard', href: '/empresa/dashboard', icon: LayoutDashboard },
  { title: 'Minhas Vagas', href: '/empresa/vagas', icon: Briefcase },
  { title: 'Publicar Vaga', href: '/empresa/vagas/nova', icon: PlusCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { role } = useAuth()
  const [newLeadsCount, setNewLeadsCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClient()

  const menuItems =
    role === 'admin' ? ADMIN_MENU : role === 'empresa' ? EMPRESA_MENU : CANDIDATO_MENU
  const title = role === 'admin' ? 'Administração' : role === 'empresa' ? 'Empresa' : 'Candidato'

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (role !== 'admin') return

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
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/75 sm:text-[10px]">
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
            className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 transition-all sm:rounded-xl sm:px-3 ${
              isActive
                ? 'bg-black text-white shadow-none dark:bg-black dark:text-white'
                : 'text-black/85 hover:bg-black/10 hover:text-black dark:text-black/85 dark:hover:bg-black/10 dark:hover:text-black'
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 transition-colors sm:h-5 sm:w-5 ${
                isActive
                  ? 'text-white dark:text-white'
                  : 'text-black/72 group-hover:text-black dark:text-black/72 dark:group-hover:text-black'
              }`}
            />

            {!isCollapsed && (
              <span className="truncate text-xs font-bold tracking-tight">{item.title}</span>
            )}

            {role === 'admin' && item.badge && newLeadsCount > 0 && (
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white sm:text-[9px] ${
                  isCollapsed ? 'absolute right-1 top-1' : 'ml-auto'
                }`}
              >
                {newLeadsCount}
              </span>
            )}

            {isActive && !isCollapsed && !item.badge && (
              <ChevronRight className="ml-auto h-3 w-3 opacity-50 sm:h-3.5 sm:w-3.5" />
            )}

            {isCollapsed && (
              <div className="pointer-events-none absolute left-full z-[100] ml-4 whitespace-nowrap rounded bg-black px-2 py-1 text-[9px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
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
        className={`sticky top-0 hidden h-screen flex-col border-r border-[#b89040] bg-[#d8b56a] pt-28 text-black transition-all duration-300 ease-in-out dark:border-[#b89040] dark:bg-[#c9a44e] lg:flex lg:pt-32 ${
          isCollapsed ? 'w-16 sm:w-20' : 'w-56 sm:w-64'
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-32 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white shadow-none transition-transform hover:scale-110 lg:top-36"
          aria-label="Alternar sidebar"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className="flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto p-2 pt-6 sm:space-y-1 sm:p-3">
          {renderMenuItems()}
        </div>

        {role === 'admin' && (
          <div className="mt-auto border-t border-black/10 p-2 sm:p-3">
            <Link
              href="/admin/configuracoes"
              title={isCollapsed ? 'Configurações' : ''}
              className="group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-black/78 transition-all hover:bg-black/8 hover:text-black sm:rounded-xl sm:px-3"
            >
              <Settings className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              {!isCollapsed && <span className="text-xs font-bold">Configurações</span>}

              {isCollapsed && (
                <div className="pointer-events-none absolute left-full z-[100] ml-4 whitespace-nowrap rounded bg-black px-2 py-1 text-[9px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Configurações
                </div>
              )}
            </Link>
          </div>
        )}
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

          <div className="absolute bottom-24 left-4 right-4 max-w-xs animate-in slide-in-from-bottom-4 rounded-2xl border border-[#c8a65a] bg-[#d8b56a] shadow-none duration-200">
            <div className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
              {renderMenuItems()}

              {role === 'admin' && (
                <>
                  <div className="my-3 h-[1px] bg-black/10" />
                  <Link
                    href="/admin/configuracoes"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-black/78 transition-all hover:bg-black/8 hover:text-black"
                  >
                    <Settings className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-bold">Configurações</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

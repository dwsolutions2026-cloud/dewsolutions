'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  Building2, 
  Users, 
  UserSquare2,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCircle2,
  FileText,
  Send,
  PlusCircle,
  X
} from 'lucide-react'
import { useSidebar } from './SidebarProvider'
import { useAuth } from '@/components/AuthProvider'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'

const ADMIN_MENU = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Vagas', href: '/admin/vagas', icon: Briefcase },
  { title: 'Empresas', href: '/admin/empresas', icon: Building2 },
  { title: 'Empresas Interessadas', href: '/admin/oportunidades', icon: Send, badge: true },
  { title: 'Banco de Talentos', href: '/admin/talentos', icon: UserSquare2 },
  { title: 'Candidaturas', href: '/admin/candidatos', icon: Users },
]

const CANDIDATO_MENU = [
  { title: 'Minha Área', href: '/candidato/minha-area', icon: LayoutDashboard },
  { title: 'Meu Perfil', href: '/candidato/perfil', icon: UserCircle2 },
  { title: 'Currículo', href: '/candidato/curriculo', icon: FileText },
  { title: 'Candidaturas', href: '/candidato/candidaturas', icon: Send },
]

const EMPRESA_MENU = [
  { title: 'Dashboard', href: '/empresa/dashboard', icon: LayoutDashboard },
  { title: 'Minhas Vagas', href: '/empresa/vagas', icon: Briefcase },
  { title: 'Publicar Vaga', href: '/empresa/vagas/nova', icon: PlusCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { user } = useAuth()
  const [newLeadsCount, setNewLeadsCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClient()

  const role = user?.user_metadata?.role || 'candidato'
  const menuItems = role === 'admin' ? ADMIN_MENU : role === 'empresa' ? EMPRESA_MENU : CANDIDATO_MENU
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'oportunidade_leads' }, () => {
        fetchCount()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [role, supabase])

  const renderMenuItems = () => (
    <>
      {!isCollapsed && (
        <div className="mb-4 px-3">
          <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground opacity-50">{title}</p>
        </div>
      )}
      
      {menuItems.map((item) => {
        const isActive = pathname === item.href || (
          item.href !== '/admin/dashboard' && 
          item.href !== '/candidato/minha-area' && 
          item.href !== '/empresa/dashboard' && 
          pathname.startsWith(item.href)
        )
        const Icon = item.icon
        
        return (
          <Link
            key={item.href}
            href={item.href}
            title={isCollapsed ? item.title : ''}
            className={`
              flex items-center gap-3 px-2.5 sm:px-3 py-2 rounded-lg sm:rounded-xl transition-all group relative
              ${isActive 
                ? 'bg-accent text-accent-foreground shadow-md shadow-accent/10' 
                : 'text-muted-foreground hover:bg-muted hover:text-primary'
              }
            `}
          >
            <Icon className={`w-4 sm:w-5 h-4 sm:h-5 shrink-0 ${isActive ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-accent'} transition-colors`} />
            {!isCollapsed && (
              <span className="font-bold text-xs tracking-tight truncate">{item.title}</span>
            )}
            
            {/* Badge for new leads */}
            {role === 'admin' && (item as any).badge && newLeadsCount > 0 && (
              <span className={`
                ${isCollapsed ? 'absolute top-1 right-1' : 'ml-auto'}
                bg-red-500 text-white text-[8px] sm:text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg
              `}>
                {newLeadsCount}
              </span>
            )}

            {isActive && !isCollapsed && !(item as any).badge && <ChevronRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 ml-auto opacity-50" />}
            
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-primary text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-100">
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
      {/* Desktop Sidebar */}
      <aside 
        className={`
          ${isCollapsed ? 'w-16 sm:w-20' : 'w-56 sm:w-64'} 
          bg-card border-r border-border h-[calc(100vh-64px)] sticky top-16 
          hidden lg:flex flex-col transition-all duration-300 ease-in-out z-40
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-4 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className="flex-1 p-2 sm:p-3 space-y-0.5 sm:space-y-1 overflow-y-auto overflow-x-hidden pt-6">
          {renderMenuItems()}
        </div>

        {role === 'admin' && (
          <div className="p-2 sm:p-3 border-t border-border mt-auto">
            <Link
              href="/admin/configuracoes"
              title={isCollapsed ? 'Configurações' : ''}
              className="flex items-center gap-3 px-2.5 sm:px-3 py-2 rounded-lg sm:rounded-xl text-muted-foreground hover:bg-muted hover:text-primary transition-all group relative"
            >
              <Settings className="w-4 sm:w-5 h-4 sm:h-5 shrink-0" />
              {!isCollapsed && <span className="font-bold text-xs">Configurações</span>}
              
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-primary text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-100">
                  Configurações
                </div>
              )}
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar Menu Button and Drawer */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Open menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <LayoutDashboard className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 animate-in fade-in duration-200">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute bottom-24 right-4 left-4 max-w-xs bg-card rounded-2xl border border-border shadow-xl animate-in slide-in-from-bottom-4 duration-200">
            <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
              {renderMenuItems()}

              {role === 'admin' && (
                <>
                  <div className="h-[1px] bg-border my-3" />
                  <Link
                    href="/admin/configuracoes"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-primary transition-all"
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    <span className="font-bold text-xs">Configurações</span>
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

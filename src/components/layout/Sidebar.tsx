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
  Send
} from 'lucide-react'
import { useSidebar } from './SidebarProvider'
import { useAuth } from '@/components/AuthProvider'

const ADMIN_MENU = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Vagas', href: '/admin/vagas', icon: Briefcase },
  { title: 'Empresas', href: '/admin/empresas', icon: Building2 },
  { title: 'Banco de Talentos', href: '/admin/talentos', icon: UserSquare2 },
  { title: 'Candidaturas', href: '/admin/candidatos', icon: Users },
]

const CANDIDATO_MENU = [
  { title: 'Minha Área', href: '/candidato/minha-area', icon: LayoutDashboard },
  { title: 'Meu Perfil', href: '/candidato/perfil', icon: UserCircle2 },
  { title: 'Currículo', href: '/candidato/curriculo', icon: FileText },
  { title: 'Candidaturas', href: '/candidato/candidaturas', icon: Send },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { user } = useAuth()

  const role = user?.user_metadata?.role || 'candidato'
  const menuItems = role === 'admin' ? ADMIN_MENU : CANDIDATO_MENU
  const title = role === 'admin' ? 'Administração' : 'Candidato'

  return (
    <aside 
      className={`
        ${isCollapsed ? 'w-20' : 'w-64'} 
        bg-card border-r border-border h-[calc(100vh-64px)] sticky top-16 
        hidden lg:flex flex-col transition-all duration-300 ease-in-out z-40
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden pt-6">
        {!isCollapsed && (
          <div className="mb-4 px-3">
            <p className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground opacity-50">{title}</p>
          </div>
        )}
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && item.href !== '/candidato/minha-area' && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.title : ''}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-xl transition-all group relative
                ${isActive 
                  ? 'bg-accent text-accent-foreground shadow-md shadow-accent/10' 
                  : 'text-muted-foreground hover:bg-muted hover:text-primary'
                }
              `}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-accent'} transition-colors`} />
              {!isCollapsed && (
                <span className="font-bold text-xs tracking-tight truncate">{item.title}</span>
              )}
              {isActive && !isCollapsed && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
              
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-primary text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                  {item.title}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {role === 'admin' && (
        <div className="p-3 border-t border-border mt-auto">
          <Link
            href="/admin/configuracoes"
            title={isCollapsed ? 'Configurações' : ''}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-primary transition-all group relative"
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-bold text-xs">Configurações</span>}
            
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-primary text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                Configurações
              </div>
            )}
          </Link>
        </div>
      )}
    </aside>
  )
}

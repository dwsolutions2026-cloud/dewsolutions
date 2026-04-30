'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  Building2, 
  Users, 
  LogOut,
  LucideIcon,
  MapPin
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Logo } from '@/components/Logo'

// Mapeamento de ícones para evitar passar componentes via props (erro do Next.js)
const iconMap: Record<string, LucideIcon> = {
  'LayoutDashboard': LayoutDashboard,
  'Briefcase': Briefcase,
  'Building2': Building2,
  'Building': Building2, // alias
  'Users': Users,
  'MapPin': MapPin,
}

export interface SidebarItem {
  label: string
  href: string
  iconName: string // Agora passamos apenas o nome
}

interface SidebarProps {
  title: string
  items: SidebarItem[]
}

export function Sidebar({ title, items }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/" className="block mb-4">
          <Logo width={140} height={45} />
        </Link>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h2>
          <ThemeToggle />
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = iconMap[item.iconName] || Briefcase
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-muted-foreground hover:bg-muted hover:text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}

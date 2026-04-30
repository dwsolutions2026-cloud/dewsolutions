import { Sidebar, SidebarItem } from '@/components/layout/Sidebar'

const adminNavItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', iconName: 'LayoutDashboard' },
  { label: 'Empresas', href: '/admin/empresas', iconName: 'Building2' },
  { label: 'Banco de Talentos', href: '/admin/talentos', iconName: 'Users' },
  { label: 'Vagas', href: '/admin/vagas', iconName: 'Briefcase' },
  { label: 'Candidatos', href: '/admin/candidatos', iconName: 'Users' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar title="Admin RH" items={adminNavItems} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

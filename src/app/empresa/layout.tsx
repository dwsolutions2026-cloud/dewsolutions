import { Sidebar, SidebarItem } from '@/components/layout/Sidebar'

const empresaNavItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/empresa/dashboard', iconName: 'LayoutDashboard' },
  { label: 'Minhas Vagas', href: '/empresa/vagas', iconName: 'Briefcase' },
  { label: 'Meu Perfil', href: '/empresa/perfil', iconName: 'Building' },
]

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar title="Portal da Empresa" items={empresaNavItems} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

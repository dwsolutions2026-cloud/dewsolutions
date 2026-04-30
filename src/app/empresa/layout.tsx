import { Header } from '@/components/layout/Header'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  ChevronRight
} from 'lucide-react'

const EMPRESA_MENU = [
  { title: 'Dashboard', href: '/empresa/dashboard', icon: LayoutDashboard },
  { title: 'Minhas Vagas', href: '/empresa/vagas', icon: Briefcase },
  { title: 'Publicar Vaga', href: '/empresa/vagas/nova', icon: PlusCircle },
]

export default async function EmpresaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'empresa') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Empresa */}
        <aside className="w-72 bg-card border-r border-border h-[calc(100vh-64px)] sticky top-16 hidden lg:flex flex-col p-6 space-y-2">
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4 mb-4">Painel da Empresa</p>
          </div>
          
          {EMPRESA_MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group text-muted-foreground hover:bg-muted hover:text-primary"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                <span className="font-bold text-sm tracking-tight">{item.title}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
            </Link>
          ))}
        </aside>

        <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

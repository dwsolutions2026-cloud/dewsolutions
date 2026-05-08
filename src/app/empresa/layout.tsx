import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { SidebarProvider } from '@/components/layout/SidebarProvider'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

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
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        {/* Header removed */}
        <div className="flex w-full pt-0">
          <Sidebar />
          <main className="min-h-[calc(100vh-112px)] flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-10">
            <div className="w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

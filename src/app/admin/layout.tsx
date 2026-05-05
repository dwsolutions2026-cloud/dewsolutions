import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { SidebarProvider } from '@/components/layout/SidebarProvider'
import { checkAdmin } from '@/app/actions/admin'
import { redirect } from 'next/navigation'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAdmin = await checkAdmin()
  
  if (!isAdmin) {
    redirect('/login')
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex w-full">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-10 overflow-x-hidden min-h-[calc(100vh-64px)]">
            <div className="w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

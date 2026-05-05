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
        <div className="flex w-full pt-28 lg:pt-32">
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

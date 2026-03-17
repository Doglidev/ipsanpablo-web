import { Suspense } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import SessionProvider from '@/components/admin/SessionProvider'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Suspense fallback={<div className="w-64 bg-gray-900 min-h-screen" />}>
          <Sidebar />
        </Suspense>
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  )
}

export default AdminLayout

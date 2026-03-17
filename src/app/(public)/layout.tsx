import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { prisma } from '@/lib/prisma'

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout = async ({ children }: PublicLayoutProps) => {
  const config = await prisma.siteConfig.findFirst()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar logoUrl={config?.logoUrl ?? null} schoolName={config?.schoolName ?? 'Instituto San Pablo'} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default PublicLayout

import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { prisma } from '@/lib/prisma'
import { getNavTree } from '@/lib/nav'

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout = async ({ children }: PublicLayoutProps) => {
  const [config, navTree] = await Promise.all([
    prisma.siteConfig.findFirst(),
    getNavTree(),
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar logoUrl={config?.logoUrl ?? null} schoolName={config?.schoolName ?? 'Instituto San Pablo'} groups={navTree} />
      <main className="flex-1">{children}</main>
      <Footer
        schoolName={config?.schoolName}
        address={config?.address}
        email={config?.email}
        phone={config?.phone}
        facebookUrl={config?.facebookUrl}
        instagramUrl={config?.instagramUrl}
        whatsappNumber={config?.whatsappNumber}
      />
    </div>
  )
}

export default PublicLayout

import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { prisma } from '@/lib/prisma'

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout = async ({ children }: PublicLayoutProps) => {
  const [config, sections] = await Promise.all([
    prisma.siteConfig.findFirst(),
    prisma.section.findMany({
      where: { isVisible: true },
      orderBy: [{ pageGroup: 'asc' }, { sortOrder: 'asc' }],
      select: { slug: true, title: true, pageGroup: true },
    }),
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar logoUrl={config?.logoUrl ?? null} schoolName={config?.schoolName ?? 'Instituto San Pablo'} sections={sections} />
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

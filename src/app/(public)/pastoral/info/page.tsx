import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'
import NivelesCarousel from '@/components/public/NivelesCarousel'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Pastoral | Instituto San Pablo Apóstol',
  description: 'Información sobre la pastoral del Instituto Parroquial San Pablo Apóstol.',
}

const PastoralPage = async () => {
  const [section, images] = await Promise.all([
    prisma.section.findUnique({ where: { slug: 'pastoral-info' } }),
    prisma.galleryImage.findMany({
      where: { category: 'pastoral-info-general' },
      orderBy: [{ sortOrder: 'asc' }, { uploadedAt: 'desc' }],
      select: { id: true, url: true, caption: true },
    }),
  ])

  if (!section || !section.isVisible) notFound()

  return (
    <div>
      <SectionHero
        title={section.title}
        heroImage={section.heroImage}
        breadcrumbs={[
          { label: 'Pastoral', href: '/pastoral/info' },
          { label: 'Información', href: '/pastoral/info' },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BlockRenderer content={section.content} />
        <NivelesCarousel images={images} title="Galería Pastoral" />
      </div>
    </div>
  )
}

export default PastoralPage

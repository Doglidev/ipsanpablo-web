import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'
import NivelesNav from '@/components/public/NivelesNav'
import NivelesCarousel from '@/components/public/NivelesCarousel'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Nivel Secundario | Instituto San Pablo Apóstol',
  description: 'Información sobre el Nivel Secundario del Instituto Parroquial San Pablo Apóstol.',
}

const NivelSecundarioPage = async () => {
  const [section, images] = await Promise.all([
    prisma.section.findUnique({ where: { slug: 'nivel-secundario' } }),
    prisma.galleryImage.findMany({
      where: { album: 'niveles-secundario' },
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
          { label: 'Niveles', href: '/niveles/inicial' },
          { label: 'Secundario', href: '/niveles/secundario' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <NivelesNav active="secundario" />
        <div className="max-w-4xl mt-8">
          <BlockRenderer content={section.content} />
          <NivelesCarousel images={images} title="Galería" />
        </div>
      </div>
    </div>
  )
}

export default NivelSecundarioPage

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'
import NivelesCarousel from '@/components/public/NivelesCarousel'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Nuestra Escuela | Instituto San Pablo Apóstol',
  description: 'Conocé la historia y misión del Instituto Parroquial San Pablo Apóstol.',
}

const NuestraEscuelaPage = async () => {
  const [section, images] = await Promise.all([
    prisma.section.findUnique({ where: { slug: 'nuestra-escuela' } }),
    prisma.galleryImage.findMany({
      where: { album: 'institucional-nuestra-escuela' },
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
          { label: 'Institucional', href: '/institucional/nuestra-escuela' },
          { label: 'Nuestra Escuela', href: '/institucional/nuestra-escuela' },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BlockRenderer content={section.content} />
        <NivelesCarousel images={images} title="Galería" />
      </div>
    </div>
  )
}

export default NuestraEscuelaPage

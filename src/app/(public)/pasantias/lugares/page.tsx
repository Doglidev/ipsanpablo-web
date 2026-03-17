import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'
import NivelesCarousel from '@/components/public/NivelesCarousel'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Lugares de Pasantías | Instituto San Pablo Apóstol',
  description: 'Lugares donde los alumnos realizan sus pasantías educativas en el Instituto Parroquial San Pablo Apóstol.',
}

const LugaresPasantiasPage = async () => {
  const [section, images] = await Promise.all([
    prisma.section.findUnique({ where: { slug: 'pasantias-lugares' } }),
    prisma.galleryImage.findMany({
      where: { category: 'pasantias-lugares' },
      orderBy: [{ sortOrder: 'asc' }, { uploadedAt: 'desc' }],
      select: { id: true, url: true, caption: true },
    }),
  ])

  if (!section || !section.isVisible) notFound()

  return (
    <div>
      <SectionHero title={section.title} heroImage={section.heroImage ?? undefined} breadcrumbs={[
        { label: 'Pasantías', href: '/pasantias/objetivo' },
        { label: 'Lugares', href: '/pasantias/lugares' },
      ]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BlockRenderer content={section.content} />
        {images.length > 0 && (
          <div className="mt-12">
            <NivelesCarousel images={images} title="Fotos de los lugares" />
          </div>
        )}
      </div>
    </div>
  )
}

export default LugaresPasantiasPage

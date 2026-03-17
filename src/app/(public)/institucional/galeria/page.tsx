import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import SectionHero from '@/components/public/SectionHero'
import GalleryGrid from '@/components/public/GalleryGrid'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Galería | Instituto San Pablo Apóstol',
  description: 'Galería de fotos del Instituto Parroquial San Pablo Apóstol.',
}

const GaleriaPublicaPage = async () => {
  const images = await prisma.galleryImage.findMany({
    where: { album: 'institucional-galeria' },
    orderBy: [{ album: 'asc' }, { sortOrder: 'asc' }, { uploadedAt: 'desc' }],
    select: { id: true, url: true, caption: true, album: true },
  })

  return (
    <div>
      <SectionHero
        title="Galería"
        breadcrumbs={[
          { label: 'Institucional', href: '/institucional/nuestra-escuela' },
          { label: 'Galería', href: '/institucional/galeria' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {images.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            Todavía no hay fotos en la galería.
          </p>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>
    </div>
  )
}

export default GaleriaPublicaPage

import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import SectionHero from '@/components/public/SectionHero'
import GalleryGrid from '@/components/public/GalleryGrid'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Galería Pastoral | Instituto San Pablo Apóstol',
  description: 'Galería fotográfica de las actividades pastorales del Instituto Parroquial San Pablo Apóstol.',
}

const GaleriaPastoralPage = async () => {
  const images = await prisma.galleryImage.findMany({
    where: { album: 'pastoral-galeria' },
    orderBy: [{ album: 'asc' }, { sortOrder: 'asc' }, { uploadedAt: 'desc' }],
    select: { id: true, url: true, caption: true, album: true },
  })

  return (
    <div>
      <SectionHero
        title="Galería Pastoral"
        breadcrumbs={[
          { label: 'Pastoral', href: '/pastoral/info' },
          { label: 'Galería', href: '/pastoral/galeria' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {images.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            Todavía no hay fotos en la galería pastoral.
          </p>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>
    </div>
  )
}

export default GaleriaPastoralPage

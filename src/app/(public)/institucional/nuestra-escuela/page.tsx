import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'
import NivelesCarousel from '@/components/public/NivelesCarousel'
import type { BlockContent, ImageData } from '@/types'

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

  // Si hay imágenes de galería, la primera va al bloque ne12b (Nuestro Patrono)
  // Las demás van al carrusel al final
  let resolvedContent = section.content
  const patronoImage = images[0]

  if (patronoImage?.url) {
    try {
      const parsed: BlockContent = JSON.parse(section.content)
      const block = parsed.blocks.find((b) => b.id === 'ne12b')
      if (block && block.type === 'image') {
        const imgData = block.data as ImageData
        imgData.url = patronoImage.url
        if (patronoImage.caption) imgData.caption = patronoImage.caption
      }
      resolvedContent = JSON.stringify(parsed)
    } catch {
      // si falla el parse, usa el contenido original
    }
  }

  const carouselImages = images.slice(1)

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
        <BlockRenderer content={resolvedContent} />
        {carouselImages.length > 0 && (
          <NivelesCarousel images={carouselImages} title="Más fotos" />
        )}
      </div>
    </div>
  )
}

export default NuestraEscuelaPage

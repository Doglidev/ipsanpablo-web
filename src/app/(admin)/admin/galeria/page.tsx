import { prisma } from '@/lib/prisma'
import { GALLERY_SECTIONS } from '@/lib/gallery-sections'
import SectionImageGroup from '@/components/admin/SectionImageGroup'

const GaleriaPage = async () => {
  const allImages = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: 'asc' }, { uploadedAt: 'desc' }],
    select: { id: true, url: true, caption: true, album: true },
  })

  const grouped = allImages.reduce<Record<string, typeof allImages>>((acc, img) => {
    if (!acc[img.album]) acc[img.album] = []
    acc[img.album].push(img)
    return acc
  }, {})

  const totalImages = allImages.length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Imágenes</h1>
        <p className="text-gray-500 text-sm mt-1">
          {totalImages} imagen{totalImages !== 1 ? 'es' : ''} · {GALLERY_SECTIONS.length} secciones ·{' '}
          <span className="text-gray-400">Hacé click en una sección para expandirla y subir imágenes</span>
        </p>
      </div>

      <div className="space-y-3">
        {GALLERY_SECTIONS.map((section) => (
          <SectionImageGroup
            key={section.album}
            album={section.album}
            label={section.label}
            images={grouped[section.album] ?? []}
          />
        ))}
      </div>
    </div>
  )
}

export default GaleriaPage

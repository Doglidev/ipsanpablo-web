import { prisma } from '@/lib/prisma'
import GalleryUploadForm from '@/components/admin/GalleryUploadForm'
import GalleryImageCard from '@/components/admin/GalleryImageCard'

const GaleriaPage = async () => {
  const images = await prisma.galleryImage.findMany({
    orderBy: { uploadedAt: 'desc' },
  })

  // Unique albums for the datalist
  const albums = [...new Set(images.map((i) => i.album))].sort()

  // Group by album for display
  const grouped = images.reduce<Record<string, typeof images>>((acc, img) => {
    if (!acc[img.album]) acc[img.album] = []
    acc[img.album].push(img)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Galería</h1>
        <p className="text-gray-500 text-sm mt-1">
          {images.length} imagen{images.length !== 1 ? 'es' : ''} en {albums.length} álbum{albums.length !== 1 ? 'es' : ''}
        </p>
      </div>

      <div className="mb-8">
        <GalleryUploadForm albums={albums} />
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed rounded-xl">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">No hay imágenes todavía</p>
          <p className="text-sm mt-1">Subí la primera usando el formulario de arriba.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([albumName, albumImages]) => (
            <div key={albumName}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-sm font-semibold text-gray-700">{albumName}</h2>
                <span className="text-xs text-gray-400">{albumImages.length} imagen{albumImages.length !== 1 ? 'es' : ''}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {albumImages.map((img) => (
                  <GalleryImageCard
                    key={img.id}
                    id={img.id}
                    url={img.url}
                    caption={img.caption}
                    album={img.album}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GaleriaPage

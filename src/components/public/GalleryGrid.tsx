'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface GalleryImage {
  id: string
  url: string
  caption: string | null
  album: string
}

interface GalleryGridProps {
  images: GalleryImage[]
}

const GalleryGrid = ({ images }: GalleryGridProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null)

  const albums = [...new Set(images.map((i) => i.album))].sort()
  const filtered = activeAlbum ? images.filter((i) => i.album === activeAlbum) : images

  const close = useCallback(() => setActiveIndex(null), [])

  const prev = useCallback(
    () => setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    []
  )

  const next = useCallback(
    () => setActiveIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i)),
    [filtered.length]
  )

  useEffect(() => {
    if (activeIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeIndex, close, prev, next])

  // Lock scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeIndex])

  return (
    <>
      {/* Album filter tabs */}
      {albums.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => { setActiveAlbum(null); setActiveIndex(null) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeAlbum === null
                ? 'bg-school-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos ({images.length})
          </button>
          {albums.map((a) => (
            <button
              key={a}
              onClick={() => { setActiveAlbum(a); setActiveIndex(null) }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeAlbum === a
                  ? 'bg-school-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {a} ({images.filter((i) => i.album === a).length})
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No hay imágenes en este álbum.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-school-blue"
            >
              <Image
                src={img.url}
                alt={img.caption ?? ''}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs line-clamp-2">{img.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {activeIndex !== null && filtered[activeIndex] && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
            aria-label="Cerrar"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {activeIndex + 1} / {filtered.length}
          </div>

          {/* Prev */}
          {activeIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 md:left-6 text-white/70 hover:text-white p-2"
              aria-label="Anterior"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-16 md:mx-24"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[activeIndex].url}
              alt={filtered[activeIndex].caption ?? ''}
              width={1200}
              height={900}
              className="object-contain max-h-[80vh] w-auto mx-auto rounded"
              priority
            />
            {filtered[activeIndex].caption && (
              <p className="text-center text-white/70 text-sm mt-3 px-4">
                {filtered[activeIndex].caption}
              </p>
            )}
          </div>

          {/* Next */}
          {activeIndex < filtered.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 md:right-6 text-white/70 hover:text-white p-2"
              aria-label="Siguiente"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default GalleryGrid

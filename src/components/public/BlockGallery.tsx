'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface BlockGalleryProps {
  images: { url: string; caption?: string }[]
  columns: 2 | 3 | 4
}

const COL_CLASS: Record<2 | 3 | 4, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

const BlockGallery = ({ images, columns }: BlockGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const close = useCallback(() => setActiveIndex(null), [])

  const prev = useCallback(
    () => setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    []
  )

  const next = useCallback(
    () => setActiveIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i)),
    [images.length]
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
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeIndex])

  if (!images.length) return null

  return (
    <>
      {/* Grid */}
      <div className={`grid grid-cols-2 ${COL_CLASS[columns] ?? 'md:grid-cols-3'} gap-3`}>
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-school-blue text-left"
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

      {/* Lightbox */}
      {activeIndex !== null && images[activeIndex] && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
            aria-label="Cerrar"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm select-none">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          {activeIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
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
              src={images[activeIndex].url}
              alt={images[activeIndex].caption ?? ''}
              width={1200}
              height={900}
              className="object-contain max-h-[80vh] w-auto mx-auto rounded"
              priority
            />
            {images[activeIndex].caption && (
              <p className="text-center text-white/70 text-sm mt-3 px-4">
                {images[activeIndex].caption}
              </p>
            )}
          </div>

          {/* Next */}
          {activeIndex < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
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

export default BlockGallery

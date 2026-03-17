'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

interface CarouselImage {
  id: string
  url: string
  caption: string | null
}

interface NivelesCarouselProps {
  images: CarouselImage[]
  title?: string
}

const NivelesCarousel = ({ images, title }: NivelesCarouselProps) => {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length)
  }, [images.length])

  const prev = () => {
    setCurrent((c) => (c - 1 + images.length) % images.length)
  }

  useEffect(() => {
    if (paused || images.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next, images.length])

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((l) => l !== null ? (l + 1) % images.length : 0)
      if (e.key === 'ArrowLeft') setLightbox((l) => l !== null ? (l - 1 + images.length) % images.length : 0)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, images.length])

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  if (images.length === 0) return null

  return (
    <div className="mt-12">
      {title && (
        <h2 className="text-xl font-bold text-school-blue mb-5">{title}</h2>
      )}

      {/* Main carousel */}
      <div
        className="relative rounded-2xl overflow-hidden bg-gray-200"
        style={{ height: '420px' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides */}
        {images.map((img, i) => (
          <div
            key={img.id}
            className={`absolute inset-0 transition-opacity duration-700 cursor-zoom-in group ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            onClick={() => setLightbox(i)}
          >
            <Image
              src={img.url}
              alt={img.caption ?? ''}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 800px"
              priority={i === 0}
            />
            {/* Caption */}
            {img.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-4">
                <p className="text-white text-sm">{img.caption}</p>
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        ))}

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-school-blue/80 hover:bg-school-blue text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all hover:scale-110"
              aria-label="Anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-school-blue/80 hover:bg-school-blue text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all hover:scale-110"
              aria-label="Siguiente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute top-3 right-3 z-20 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-school-blue w-6 h-2'
                  : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
              }`}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrent(i)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all ${
                i === current
                  ? 'ring-2 ring-school-blue ring-offset-1 opacity-100'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <Image
                src={img.url}
                alt={img.caption ?? ''}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/50 text-xs text-center mb-3">
              {lightbox + 1} / {images.length} · Esc para cerrar
            </p>

            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <Image
                src={images[lightbox].url}
                alt={images[lightbox].caption ?? ''}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {images[lightbox].caption && (
              <p className="text-white/80 text-center mt-3 text-sm">
                {images[lightbox].caption}
              </p>
            )}

            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setLightbox((l) => l !== null ? (l - 1 + images.length) % images.length : 0)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white rounded-full w-11 h-11 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setLightbox((l) => l !== null ? (l + 1) % images.length : 0)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white rounded-full w-11 h-11 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NivelesCarousel

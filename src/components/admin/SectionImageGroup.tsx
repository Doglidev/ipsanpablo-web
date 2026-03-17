'use client'

import { useState } from 'react'
import GalleryImageCard from './GalleryImageCard'
import GalleryUploadForm from './GalleryUploadForm'

interface GalleryImage {
  id: string
  url: string
  caption: string | null
  album: string
}

interface SectionImageGroupProps {
  album: string
  label: string
  images: GalleryImage[]
}

const SectionImageGroup = ({ album, label, images }: SectionImageGroupProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-gray-800 text-sm">{label}</span>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
          images.length === 0
            ? 'bg-gray-100 text-gray-400'
            : 'bg-blue-100 text-school-blue'
        }`}>
          {images.length === 0 ? 'Sin imágenes' : `${images.length} imagen${images.length !== 1 ? 'es' : ''}`}
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="border-t px-5 py-5 space-y-5">
          {/* Image grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((img) => (
                <GalleryImageCard
                  key={img.id}
                  id={img.id}
                  url={img.url}
                  caption={img.caption}
                  album={img.album}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">
              Todavía no hay imágenes en esta sección.
            </p>
          )}

          {/* Upload form */}
          <GalleryUploadForm album={album} />
        </div>
      )}
    </div>
  )
}

export default SectionImageGroup

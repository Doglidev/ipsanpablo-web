'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { updateGalleryImage, deleteGalleryImage } from '@/lib/actions/gallery'
import { GALLERY_SECTIONS } from '@/lib/gallery-sections'

interface GalleryImageCardProps {
  id: string
  url: string
  caption: string | null
  album: string
}

const GalleryImageCard = ({ id, url, caption, album }: GalleryImageCardProps) => {
  const [isPendingDelete, startDeleteTransition] = useTransition()
  const [isPendingSave, startSaveTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [editCaption, setEditCaption] = useState(caption ?? '')
  const [editAlbum, setEditAlbum] = useState(album)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = () => {
    if (!window.confirm('¿Eliminar esta imagen? Se borrará de Cloudinary también.')) return
    startDeleteTransition(async () => {
      await deleteGalleryImage(id)
    })
  }

  const handleSave = () => {
    setError(null)
    startSaveTransition(async () => {
      const res = await updateGalleryImage(id, { caption: editCaption, album: editAlbum })
      if (res.success) {
        setEditing(false)
      } else {
        setError(res.error ?? 'Error desconocido')
      }
    })
  }

  return (
    <div className={`group relative bg-white rounded-xl border overflow-hidden transition-opacity ${isPendingDelete ? 'opacity-40' : ''}`}>
      {/* Thumbnail */}
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={url}
          alt={caption ?? ''}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => setEditing(true)}
            className="bg-white text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
            title="Editar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isPendingDelete}
            className="bg-white text-red-500 p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50"
            title="Eliminar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Caption preview */}
      {caption && (
        <div className="px-2 py-1.5">
          <p className="text-xs text-gray-500 truncate">{caption}</p>
        </div>
      )}

      {/* Edit overlay */}
      {editing && (
        <div className="absolute inset-0 bg-white p-3 flex flex-col gap-2 z-10 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-700">Editar imagen</p>
          <div>
            <label className="text-xs text-gray-500 mb-0.5 block">Mover a sección</label>
            <select
              className="w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-school-blue"
              value={editAlbum}
              onChange={(e) => setEditAlbum(e.target.value)}
            >
              {GALLERY_SECTIONS.map((s) => (
                <option key={s.album} value={s.album}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-0.5 block">Descripción</label>
            <input
              className="w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-school-blue"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="Descripción (opcional)"
              maxLength={200}
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleSave}
              disabled={isPendingSave}
              className="flex-1 bg-school-blue text-white text-xs py-1.5 rounded-lg disabled:opacity-50"
            >
              {isPendingSave ? '...' : 'Guardar'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 border text-xs py-1.5 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GalleryImageCard

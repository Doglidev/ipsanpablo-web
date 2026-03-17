'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { uploadGalleryImage } from '@/lib/actions/gallery'

interface GalleryUploadFormProps {
  albums: string[]
}

const GalleryUploadForm = ({ albums }: GalleryUploadFormProps) => {
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setResult(null)
    startTransition(async () => {
      const res = await uploadGalleryImage(formData)
      setResult(res)
      if (res.success) {
        formRef.current?.reset()
        setPreview(null)
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Subir imagen</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* File drop zone */}
          <label className="relative flex-shrink-0 w-full sm:w-40 h-32 rounded-xl border-2 border-dashed border-gray-200 hover:border-school-blue cursor-pointer overflow-hidden transition-colors">
            {preview ? (
              <Image src={preview} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Seleccionar</span>
              </div>
            )}
            <input
              name="file"
              type="file"
              accept="image/*"
              required
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </label>

          {/* Metadata */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Álbum <span className="text-red-500">*</span>
              </label>
              <input
                name="album"
                required
                list="albums-list"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
                placeholder="ej: actos-2026, pastoral, egresados"
              />
              <datalist id="albums-list">
                {albums.map((a) => <option key={a} value={a} />)}
              </datalist>
              <p className="text-xs text-gray-400 mt-1">Escribí un álbum existente o uno nuevo.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
              >
                <option value="institucional">Institucional</option>
                <option value="pastoral-info-general">Pastoral — Info General</option>
                <option value="pastoral-galeria">Pastoral — Galería</option>
                <option value="nivel-inicial">Nivel Inicial</option>
                <option value="nivel-primario">Nivel Primario</option>
                <option value="nivel-secundario">Nivel Secundario</option>
                <option value="pasantias-lugares">Pasantías — Lugares</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Descripción (opcional)
              </label>
              <input
                name="caption"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
                placeholder="Ej: Acto de cierre 2026"
                maxLength={200}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="bg-school-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 disabled:opacity-50 transition-colors"
              >
                {isPending ? 'Subiendo...' : 'Subir imagen'}
              </button>
              {result && (
                <span className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.success ? '✓ Imagen subida' : `✗ ${result.error}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default GalleryUploadForm

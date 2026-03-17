'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { uploadGalleryImage } from '@/lib/actions/gallery'

interface GalleryUploadFormProps {
  album: string
}

const GalleryUploadForm = ({ album }: GalleryUploadFormProps) => {
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const setFile = (file: File) => {
    if (!inputRef.current) return
    const dt = new DataTransfer()
    dt.items.add(file)
    inputRef.current.files = dt.files
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) setFile(file)
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
    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Subir imagen</p>
      <form ref={formRef} onSubmit={handleSubmit}>
        <input type="hidden" name="album" value={album} />
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Drop zone */}
          <label
            className={`relative flex-shrink-0 w-full sm:w-36 h-28 rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${
              isDragging
                ? 'border-school-blue bg-blue-50'
                : 'border-gray-300 hover:border-school-blue'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <Image src={preview} alt="Preview" fill className="object-cover rounded-xl" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-1 pointer-events-none">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-center leading-tight px-2">
                  Arrastrá o<br />hacé click
                </span>
              </div>
            )}
            <input
              ref={inputRef}
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </label>

          {/* Caption + actions */}
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <input
              name="caption"
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-school-blue"
              placeholder="Descripción (opcional)"
              maxLength={200}
            />
            <p className="text-xs text-gray-400">JPG, PNG, WEBP · Máx. 5 MB</p>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="bg-school-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 disabled:opacity-50 transition-colors"
              >
                {isPending ? 'Subiendo...' : 'Subir imagen'}
              </button>
              {result && (
                <span className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.success ? '✓ Subida correctamente' : `✗ ${result.error}`}
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

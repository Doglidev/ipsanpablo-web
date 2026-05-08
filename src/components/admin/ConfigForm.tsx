'use client'

import { useState, useTransition, useRef } from 'react'
import Image from 'next/image'
import { updateConfig } from '@/lib/actions/config'
import { uploadBlockImage } from '@/lib/actions/upload-block-image'

interface SiteConfig {
  schoolName: string
  phone: string
  email: string
  address: string
  logoUrl: string | null
  heroTitle: string
  heroSubtitle: string
  heroImageUrl: string | null
  facebookUrl: string | null
  instagramUrl: string | null
  whatsappNumber: string | null
  inscripcionOpen: boolean
  inscripcionText: string
}

interface ConfigFormProps {
  config: SiteConfig
}

const inputClass = 'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue'
const labelClass = 'block text-xs font-medium text-gray-500 mb-1'

const ConfigForm = ({ config }: ConfigFormProps) => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)
  const [inscripcionOpen, setInscripcionOpen] = useState(config.inscripcionOpen)

  // Hero image drop
  const [heroImageUrl, setHeroImageUrl] = useState(config.heroImageUrl ?? '')
  const [heroPreview, setHeroPreview] = useState(config.heroImageUrl ?? '')
  const [heroDragging, setHeroDragging] = useState(false)
  const [heroUploading, setHeroUploading] = useState(false)
  const heroInputRef = useRef<HTMLInputElement>(null)

  const uploadHeroImage = async (file: File) => {
    setHeroUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await uploadBlockImage(fd)
    setHeroUploading(false)
    if (res.success) {
      setHeroImageUrl(res.url)
      setHeroPreview(res.url)
    }
  }

  const handleHeroFile = (file: File) => {
    setHeroPreview(URL.createObjectURL(file))
    uploadHeroImage(file)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    // The toggle is managed by state, not a checkbox
    formData.set('inscripcionOpen', String(inscripcionOpen))
    setResult(null)
    startTransition(async () => {
      const res = await updateConfig(formData)
      setResult(res)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Identidad */}
      <div className="bg-white rounded-xl border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Identidad institucional</h2>
        <div>
          <label className={labelClass}>Nombre del colegio</label>
          <input name="schoolName" className={inputClass} defaultValue={config.schoolName} required />
        </div>
        <div>
          <label className={labelClass}>URL del logo</label>
          <input name="logoUrl" className={inputClass} defaultValue={config.logoUrl ?? ''} placeholder="https://res.cloudinary.com/..." />
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-xl border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Hero (portada del sitio)</h2>
        <div>
          <label className={labelClass}>Título principal</label>
          <input name="heroTitle" className={inputClass} defaultValue={config.heroTitle} placeholder="Instituto Parroquial San Pablo Apóstol" />
        </div>
        <div>
          <label className={labelClass}>Subtítulo</label>
          <input name="heroSubtitle" className={inputClass} defaultValue={config.heroSubtitle} placeholder="Educación con valores desde 1959" />
        </div>
        <div>
          <label className={labelClass}>Imagen de fondo</label>
          <input type="hidden" name="heroImageUrl" value={heroImageUrl} />
          <label
            className={`relative flex w-full h-36 rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${
              heroDragging ? 'border-school-blue bg-blue-50' : 'border-gray-300 hover:border-school-blue'
            }`}
            onDragOver={(e) => { e.preventDefault(); setHeroDragging(true) }}
            onDragLeave={() => setHeroDragging(false)}
            onDrop={(e) => { e.preventDefault(); setHeroDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleHeroFile(f) }}
          >
            {heroPreview ? (
              <Image src={heroPreview} alt="Hero preview" fill className="object-cover" unoptimized={heroPreview.startsWith('blob:')} />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 gap-1 pointer-events-none">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Arrastrá o hacé click para seleccionar</span>
              </div>
            )}
            {heroUploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="text-xs text-school-blue font-medium">Subiendo...</span>
              </div>
            )}
            <input
              ref={heroInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleHeroFile(f) }}
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · Máx. 5 MB</p>
        </div>
      </div>

      {/* Inscripciones */}
      <div className="bg-white rounded-xl border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Inscripciones</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setInscripcionOpen((v) => !v)}
            className={`relative w-10 h-6 rounded-full transition-colors ${inscripcionOpen ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${inscripcionOpen ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm text-gray-700 font-medium">
            {inscripcionOpen ? 'Inscripciones abiertas' : 'Inscripciones cerradas'}
          </span>
        </label>
        <div>
          <label className={labelClass}>Texto del banner de inscripciones</label>
          <input name="inscripcionText" className={inputClass} defaultValue={config.inscripcionText} placeholder="Las inscripciones para el ciclo lectivo están abiertas." />
        </div>
      </div>

      {/* Contacto */}
      <div className="bg-white rounded-xl border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Datos de contacto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Teléfono</label>
            <input name="phone" className={inputClass} defaultValue={config.phone} placeholder="(0351) 000-0000" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input name="email" type="email" className={inputClass} defaultValue={config.email} placeholder="secretaria@ipsanpablo.com" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Dirección</label>
          <input name="address" className={inputClass} defaultValue={config.address} placeholder="Asturias 1935, Barrio Colón, Córdoba" />
        </div>
      </div>

      {/* Redes sociales */}
      <div className="bg-white rounded-xl border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Redes sociales</h2>
        <div>
          <label className={labelClass}>Facebook (URL)</label>
          <input name="facebookUrl" className={inputClass} defaultValue={config.facebookUrl ?? ''} placeholder="https://facebook.com/..." />
        </div>
        <div>
          <label className={labelClass}>Instagram (URL)</label>
          <input name="instagramUrl" className={inputClass} defaultValue={config.instagramUrl ?? ''} placeholder="https://instagram.com/..." />
        </div>
        <div>
          <label className={labelClass}>WhatsApp (número con código de país)</label>
          <input name="whatsappNumber" className={inputClass} defaultValue={config.whatsappNumber ?? ''} placeholder="549351000000" />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4 pb-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-school-blue text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-900 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Guardando...' : 'Guardar configuración'}
        </button>
        {result && (
          <span className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.success ? '✓ Configuración guardada' : `✗ ${result.error}`}
          </span>
        )}
      </div>

    </form>
  )
}

export default ConfigForm

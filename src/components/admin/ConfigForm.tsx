'use client'

import { useState, useTransition } from 'react'
import { updateConfig } from '@/lib/actions/config'

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
          <label className={labelClass}>Imagen de fondo (URL)</label>
          <input name="heroImageUrl" className={inputClass} defaultValue={config.heroImageUrl ?? ''} placeholder="https://res.cloudinary.com/..." />
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

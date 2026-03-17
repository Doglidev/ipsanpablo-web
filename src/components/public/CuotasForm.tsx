'use client'

import { useState, useTransition } from 'react'
import { submitActualizacionCuotas } from '@/lib/actions/cuotas'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue focus:border-transparent transition-colors'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const CuotasForm = () => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)
  const [selectedMeses, setSelectedMeses] = useState<string[]>([])

  const toggleMes = (mes: string) => {
    setSelectedMeses((prev) =>
      prev.includes(mes) ? prev.filter((m) => m !== mes) : [...prev, mes]
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    // Append each selected month as a separate 'cuotas' field
    selectedMeses.forEach((mes) => formData.append('cuotas', mes))
    setResult(null)
    startTransition(async () => {
      const res = await submitActualizacionCuotas(formData)
      setResult(res)
      if (res.success) {
        ;(e.target as HTMLFormElement).reset()
        setSelectedMeses([])
      }
    })
  }

  return (
    <div className="mt-14 pt-10 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-school-blue mb-2">
        Actualización de Cuotas
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Completá el formulario para notificar un pago y solicitar la actualización de tu estado de cuenta.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre y Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              Nombre y Apellido del Alumno <span className="text-red-500">*</span>
            </label>
            <input
              name="alumnoNombre"
              required
              className={inputClass}
              placeholder="Ej: García, Juan"
            />
          </div>
          <div>
            <label className={labelClass}>
              Email de contacto <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              className={inputClass}
              placeholder="tucorreo@email.com"
            />
          </div>
        </div>

        {/* Cuotas */}
        <div>
          <label className={labelClass}>
            Cuota/s a actualizar <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-3">Seleccioná uno o más meses</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {MESES.map((mes) => {
              const selected = selectedMeses.includes(mes)
              return (
                <button
                  key={mes}
                  type="button"
                  onClick={() => toggleMes(mes)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    selected
                      ? 'bg-school-blue border-school-blue text-white shadow-sm'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-school-blue hover:text-school-blue'
                  }`}
                >
                  {mes}
                </button>
              )
            })}
          </div>
          {selectedMeses.length > 0 && (
            <p className="text-xs text-school-blue mt-2 font-medium">
              Seleccionadas: {selectedMeses.join(', ')}
            </p>
          )}
          {result && !result.success && result.error?.includes('cuota') && (
            <p className="text-xs text-red-500 mt-1">{result.error}</p>
          )}
        </div>

        {/* Fecha de pago */}
        <div className="sm:w-1/2">
          <label className={labelClass}>
            Fecha de pago <span className="text-red-500">*</span>
          </label>
          <input
            name="fechaPago"
            type="date"
            required
            className={inputClass}
          />
        </div>

        {/* Comentarios */}
        <div>
          <label className={labelClass}>Comentarios (opcional)</label>
          <textarea
            name="comentarios"
            rows={3}
            maxLength={500}
            className={inputClass}
            placeholder="Ej: Abono con transferencia el día 10/08, comprobante enviado por WhatsApp."
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isPending || selectedMeses.length === 0}
            className="bg-school-blue hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white px-7 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            {isPending ? 'Enviando...' : 'Enviar solicitud'}
          </button>

          {result && (
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                result.success ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {result.success ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Solicitud enviada. Nos comunicaremos a la brevedad.
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {result.error}
                </>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default CuotasForm

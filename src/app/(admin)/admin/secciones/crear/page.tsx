'use client'

import { useActionState } from 'react'
import { createSection } from '@/lib/actions/sections'
import Link from 'next/link'
import type { ActionResult } from '@/types'

const PAGE_GROUPS = [
  'institucional',
  'niveles',
  'becas',
  'pasantias',
  'secretarias',
  'pastoral',
]

const initialState: ActionResult | null = null

const CrearSeccionPage = () => {
  const [state, formAction, isPending] = useActionState(
    createSection,
    initialState,
  )

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link href="/admin/secciones" className="text-sm text-gray-500 hover:text-school-blue">
          ← Volver a secciones
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Nueva sección</h1>
      </div>

      <form action={formAction} className="bg-white rounded-xl border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
            placeholder="Nuestra Escuela"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-school-blue"
            placeholder="nuestra-escuela"
          />
          <p className="text-xs text-gray-400 mt-1">Solo letras minúsculas, números y guiones.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grupo de página <span className="text-red-500">*</span>
          </label>
          <select
            name="pageGroup"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
          >
            <option value="">Seleccioná un grupo</option>
            {PAGE_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={0}
            min={0}
            className="w-32 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
          />
        </div>

        {state && !state.success && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-school-blue text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-900 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Creando...' : 'Crear sección'}
          </button>
          <Link
            href="/admin/secciones"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 border hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

export default CrearSeccionPage

'use client'

import { useActionState } from 'react'
import { createNews } from '@/lib/actions/news'
import Link from 'next/link'
import type { ActionResult } from '@/types'

const initialState: ActionResult | null = null

const NuevaNoticiaPage = () => {
  const [state, formAction, isPending] = useActionState(
    createNews,
    initialState,
  )

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link href="/admin/noticias" className="text-sm text-gray-500 hover:text-school-blue">
          ← Volver a noticias
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Nueva noticia</h1>
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
            placeholder="Título de la noticia"
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
            placeholder="titulo-de-la-noticia"
          />
          <p className="text-xs text-gray-400 mt-1">Solo minúsculas, números y guiones.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resumen <span className="text-red-500">*</span>
          </label>
          <textarea
            name="excerpt"
            required
            maxLength={300}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue resize-none"
            placeholder="Breve descripción que aparece en las tarjetas..."
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
            {isPending ? 'Creando...' : 'Crear noticia'}
          </button>
          <Link
            href="/admin/noticias"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 border hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

export default NuevaNoticiaPage

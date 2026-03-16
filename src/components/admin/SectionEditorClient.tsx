'use client'

import { useState } from 'react'
import BlockEditor from '@/components/admin/BlockEditor'
import { updateSection } from '@/lib/actions/sections'

interface Section {
  slug: string
  title: string
  content: string
  pageGroup: string
  sortOrder: number
  isVisible: boolean
  heroImage: string | null
}

interface SectionEditorClientProps {
  section: Section
}

const PAGE_GROUPS = ['institucional', 'niveles', 'becas', 'pasantias', 'secretarias', 'pastoral']

const SectionEditorClient = ({ section }: SectionEditorClientProps) => {
  const [meta, setMeta] = useState({
    title: section.title,
    pageGroup: section.pageGroup,
    sortOrder: section.sortOrder,
    isVisible: section.isVisible,
    heroImage: section.heroImage ?? '',
  })

  const handleSave = async (content: string) => {
    return updateSection(section.slug, {
      title: meta.title,
      content,
      pageGroup: meta.pageGroup,
      sortOrder: meta.sortOrder,
      isVisible: meta.isVisible,
      heroImage: meta.heroImage || null,
    })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main: block editor */}
      <div className="xl:col-span-2">
        <div className="bg-gray-50 rounded-xl border p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Contenido</h2>
          <BlockEditor
            initialContent={section.content}
            onSave={handleSave}
          />
        </div>
      </div>

      {/* Sidebar: metadata */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Configuración</h2>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
              value={meta.title}
              onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Grupo</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
              value={meta.pageGroup}
              onChange={(e) => setMeta((m) => ({ ...m, pageGroup: e.target.value }))}
            >
              {PAGE_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Orden</label>
            <input
              type="number"
              min={0}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
              value={meta.sortOrder}
              onChange={(e) => setMeta((m) => ({ ...m, sortOrder: Number(e.target.value) }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Imagen de cabecera (URL)
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
              value={meta.heroImage}
              onChange={(e) => setMeta((m) => ({ ...m, heroImage: e.target.value }))}
              placeholder="https://res.cloudinary.com/..."
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setMeta((m) => ({ ...m, isVisible: !m.isVisible }))}
              className={`relative w-10 h-6 rounded-full transition-colors ${meta.isVisible ? 'bg-school-blue' : 'bg-gray-300'}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${meta.isVisible ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </div>
            <span className="text-sm text-gray-700">
              {meta.isVisible ? 'Visible en el sitio' : 'Oculta'}
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default SectionEditorClient

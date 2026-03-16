'use client'

import { useState } from 'react'
import BlockEditor from '@/components/admin/BlockEditor'
import { updateNews } from '@/lib/actions/news'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  isPublished: boolean
}

interface NewsEditorClientProps {
  article: Article
}

const NewsEditorClient = ({ article }: NewsEditorClientProps) => {
  const [meta, setMeta] = useState({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    coverImage: article.coverImage ?? '',
    isPublished: article.isPublished,
  })

  const handleSave = async (content: string) => {
    return updateNews(article.id, {
      title: meta.title,
      slug: meta.slug,
      excerpt: meta.excerpt,
      content,
      coverImage: meta.coverImage || null,
      isPublished: meta.isPublished,
    })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main: block editor */}
      <div className="xl:col-span-2">
        <div className="bg-gray-50 rounded-xl border p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Contenido</h2>
          <BlockEditor
            initialContent={article.content}
            onSave={handleSave}
            saveLabel={meta.isPublished ? 'Guardar' : 'Guardar borrador'}
          />
        </div>
      </div>

      {/* Sidebar: metadata */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Detalles</h2>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
              value={meta.title}
              onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-school-blue"
              value={meta.slug}
              onChange={(e) => setMeta((m) => ({ ...m, slug: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Resumen (máx. 300 caracteres)
            </label>
            <textarea
              rows={3}
              maxLength={300}
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-school-blue"
              value={meta.excerpt}
              onChange={(e) => setMeta((m) => ({ ...m, excerpt: e.target.value }))}
            />
            <p className="text-xs text-gray-400 text-right">{meta.excerpt.length}/300</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Imagen destacada (URL)
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
              value={meta.coverImage}
              onChange={(e) => setMeta((m) => ({ ...m, coverImage: e.target.value }))}
              placeholder="https://res.cloudinary.com/..."
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setMeta((m) => ({ ...m, isPublished: !m.isPublished }))}
              className={`relative w-10 h-6 rounded-full transition-colors ${meta.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${meta.isPublished ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </div>
            <span className="text-sm text-gray-700">
              {meta.isPublished ? 'Publicada' : 'Borrador'}
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default NewsEditorClient

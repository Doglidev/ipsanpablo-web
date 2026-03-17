'use client'

import { useState, useTransition, useCallback, useRef } from 'react'
import type { ContentBlock, HeadingData, ParagraphData, ImageData, ListData, VideoData, PartnersData } from '@/types'
import { uploadBlockImage } from '@/lib/actions/upload-block-image'

interface BlockEditorProps {
  initialContent: string
  onSave: (content: string) => Promise<{ success: boolean; error?: string } | undefined>
  saveLabel?: string
}

const genId = () => `block_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`

const EMPTY_BLOCK_DATA: Record<ContentBlock['type'], ContentBlock['data']> = {
  heading: { text: '', level: 2 } as HeadingData,
  paragraph: { text: '' } as ParagraphData,
  image: { url: '', alt: '', caption: '' } as ImageData,
  list: { style: 'unordered', items: [''] } as ListData,
  divider: {} as Record<string, never>,
  video: { url: '', caption: '' } as VideoData,
  partners: { heading: 'Instituciones', items: [{ name: '', imageUrl: '' }] } as PartnersData,
}

const BLOCK_LABELS: Record<ContentBlock['type'], string> = {
  heading: 'Título',
  paragraph: 'Párrafo',
  image: 'Imagen',
  list: 'Lista',
  divider: 'Separador',
  video: 'Video',
  partners: 'Grid de Partners',
}

const BlockEditor = ({ initialContent, onSave, saveLabel = 'Guardar' }: BlockEditorProps) => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)

  const parseBlocks = (raw: string): ContentBlock[] => {
    try {
      const parsed = JSON.parse(raw) as { blocks: ContentBlock[] }
      return parsed.blocks ?? []
    } catch {
      return []
    }
  }

  const [blocks, setBlocks] = useState<ContentBlock[]>(() => parseBlocks(initialContent))

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: genId(),
      type,
      data: { ...EMPTY_BLOCK_DATA[type] } as ContentBlock['data'],
    }
    setBlocks((prev) => [...prev, newBlock])
    setShowAddMenu(false)
  }

  const updateBlock = useCallback((id: string, data: ContentBlock['data']) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, data } : b)))
  }, [])

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    setBlocks((prev) => {
      const next = [...prev]
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= next.length) return next
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const handleSave = () => {
    const content = JSON.stringify({ blocks })
    setResult(null)
    startTransition(async () => {
      const res = await onSave(content)
      setResult(res ?? { success: true })
    })
  }

  return (
    <div>
      {/* Blocks */}
      <div className="space-y-3 mb-4">
        {blocks.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm">
            No hay bloques. Añadí el primero.
          </div>
        )}
        {blocks.map((block, index) => (
          <div key={block.id} className="flex gap-2">
            <div className="flex-1 bg-white border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {BLOCK_LABELS[block.type]}
                </span>
              </div>
              <BlockFields block={block} onChange={(data) => updateBlock(block.id, data)} />
            </div>
            {/* Controls */}
            <div className="flex flex-col gap-1 pt-1">
              <button
                onClick={() => moveBlock(index, 'up')}
                disabled={index === 0}
                className="p-1.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20"
                title="Subir"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => moveBlock(index, 'down')}
                disabled={index === blocks.length - 1}
                className="p-1.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20"
                title="Bajar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={() => removeBlock(block.id)}
                className="p-1.5 rounded text-gray-400 hover:text-red-600"
                title="Eliminar bloque"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add block menu */}
      <div className="relative mb-6">
        <button
          onClick={() => setShowAddMenu((v) => !v)}
          className="flex items-center gap-2 text-sm text-school-blue font-medium hover:text-school-gold border border-dashed border-school-blue hover:border-school-gold rounded-lg px-4 py-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir bloque
        </button>
        {showAddMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white border rounded-xl shadow-lg py-1 z-10 min-w-40">
            {(Object.keys(BLOCK_LABELS) as ContentBlock['type'][]).map((type) => (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {BLOCK_LABELS[type]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="bg-school-blue text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-900 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Guardando...' : saveLabel}
        </button>
        {result && (
          <span
            className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}
          >
            {result.success ? '✓ Guardado correctamente' : `✗ ${result.error}`}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Block field editors ────────────────────────────────────────────────────

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue'
const labelClass = 'block text-xs font-medium text-gray-500 mb-1'

interface BlockFieldsProps {
  block: ContentBlock
  onChange: (data: ContentBlock['data']) => void
}

const BlockFields = ({ block, onChange }: BlockFieldsProps) => {
  switch (block.type) {
    case 'heading': {
      const data = block.data as HeadingData
      return (
        <div className="space-y-2">
          <div>
            <label className={labelClass}>Texto</label>
            <input
              className={inputClass}
              value={data.text}
              onChange={(e) => onChange({ ...data, text: e.target.value })}
              placeholder="Título..."
            />
          </div>
          <div>
            <label className={labelClass}>Nivel</label>
            <select
              className={inputClass}
              value={data.level}
              onChange={(e) => onChange({ ...data, level: Number(e.target.value) as 2 | 3 })}
            >
              <option value={2}>H2 — Título principal</option>
              <option value={3}>H3 — Subtítulo</option>
            </select>
          </div>
        </div>
      )
    }

    case 'paragraph': {
      const data = block.data as ParagraphData
      return (
        <div>
          <label className={labelClass}>Texto</label>
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            value={data.text}
            onChange={(e) => onChange({ ...data, text: e.target.value })}
            placeholder="Escribí el párrafo..."
          />
        </div>
      )
    }

    case 'image': {
      const data = block.data as ImageData
      return <ImageBlockFields data={data} onChange={onChange} />
    }

    case 'list': {
      const data = block.data as ListData
      return (
        <div className="space-y-2">
          <div>
            <label className={labelClass}>Tipo de lista</label>
            <select
              className={inputClass}
              value={data.style}
              onChange={(e) =>
                onChange({ ...data, style: e.target.value as 'ordered' | 'unordered' })
              }
            >
              <option value="unordered">Con viñetas</option>
              <option value="ordered">Numerada</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Ítems</label>
            <div className="space-y-1.5">
              {data.items.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputClass}
                    value={item}
                    onChange={(e) => {
                      const newItems = [...data.items]
                      newItems[i] = e.target.value
                      onChange({ ...data, items: newItems })
                    }}
                    placeholder={`Ítem ${i + 1}`}
                  />
                  <button
                    onClick={() => {
                      const newItems = data.items.filter((_, idx) => idx !== i)
                      onChange({ ...data, items: newItems.length ? newItems : [''] })
                    }}
                    className="text-gray-400 hover:text-red-500 shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => onChange({ ...data, items: [...data.items, ''] })}
              className="mt-2 text-sm text-school-blue hover:text-school-gold font-medium"
            >
              + Añadir ítem
            </button>
          </div>
        </div>
      )
    }

    case 'divider':
      return (
        <div className="text-center text-gray-400 text-sm py-2">
          — Separador horizontal —
        </div>
      )

    case 'video': {
      const data = block.data as VideoData
      return (
        <div className="space-y-2">
          <div>
            <label className={labelClass}>URL del video (YouTube)</label>
            <input
              className={inputClass}
              value={data.url}
              onChange={(e) => onChange({ ...data, url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div>
            <label className={labelClass}>Descripción (opcional)</label>
            <input
              className={inputClass}
              value={data.caption ?? ''}
              onChange={(e) => onChange({ ...data, caption: e.target.value })}
              placeholder="Descripción del video..."
            />
          </div>
        </div>
      )
    }

    case 'partners': {
      const data = block.data as PartnersData
      return <PartnersBlockFields data={data} onChange={onChange} />
    }

    default:
      return null
  }
}

// ── Image block with direct upload ─────────────────────────────────────────

interface ImageBlockFieldsProps {
  data: ImageData
  onChange: (data: ContentBlock['data']) => void
}

const ImageBlockFields = ({ data, onChange }: ImageBlockFieldsProps) => {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    const formData = new FormData()
    formData.append('file', file)
    const result = await uploadBlockImage(formData)
    setUploading(false)
    if (result.success) {
      onChange({ ...data, url: result.url })
    } else {
      setUploadError(result.error)
    }
    // reset input so same file can be re-selected if needed
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <div>
        <label className={labelClass}>Imagen</label>
        <div className="flex gap-2 items-center">
          <input
            className={`${inputClass} flex-1`}
            value={data.url}
            onChange={(e) => onChange({ ...data, url: e.target.value })}
            placeholder="URL de la imagen..."
            readOnly={uploading}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="shrink-0 px-3 py-2 text-sm rounded-lg border border-school-blue text-school-blue hover:bg-school-blue hover:text-white disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Subiendo...' : 'Subir imagen'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
        {data.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.url} alt="preview" className="mt-2 rounded-lg max-h-40 object-contain border" />
        )}
      </div>
      <div>
        <label className={labelClass}>Tamaño</label>
        <select
          className={inputClass}
          value={data.size ?? 'full'}
          onChange={(e) => onChange({ ...data, size: e.target.value as ImageData['size'] })}
        >
          <option value="full">Ancho completo</option>
          <option value="medium">Mediano (centrado)</option>
          <option value="small">Pequeño (flota a la derecha)</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Texto alternativo (alt)</label>
        <input
          className={inputClass}
          value={data.alt}
          onChange={(e) => onChange({ ...data, alt: e.target.value })}
          placeholder="Descripción de la imagen..."
        />
      </div>
      <div>
        <label className={labelClass}>Pie de foto (opcional)</label>
        <input
          className={inputClass}
          value={data.caption ?? ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="Pie de foto..."
        />
      </div>
    </div>
  )
}

// ── Partners block editor ───────────────────────────────────────────────────

interface PartnersBlockFieldsProps {
  data: PartnersData
  onChange: (data: ContentBlock['data']) => void
}

const PartnersBlockFields = ({ data, onChange }: PartnersBlockFieldsProps) => {
  const updateItem = (index: number, patch: Partial<PartnersData['items'][number]>) => {
    const newItems = data.items.map((item, i) => (i === index ? { ...item, ...patch } : item))
    onChange({ ...data, items: newItems })
  }

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index)
    onChange({ ...data, items: newItems.length ? newItems : [{ name: '', imageUrl: '' }] })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className={labelClass}>Título del grupo (opcional)</label>
        <input
          className={inputClass}
          value={data.heading ?? ''}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
          placeholder="Instituciones"
        />
      </div>
      <div>
        <label className={labelClass}>Instituciones</label>
        <div className="space-y-2">
          {data.items.map((item, i) => (
            <PartnerItemRow
              key={i}
              item={item}
              index={i}
              onUpdate={(patch) => updateItem(i, patch)}
              onRemove={() => removeItem(i)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...data, items: [...data.items, { name: '', imageUrl: '' }] })}
          className="mt-2 text-sm text-school-blue hover:text-school-gold font-medium"
        >
          + Añadir institución
        </button>
      </div>
    </div>
  )
}

interface PartnerItemRowProps {
  item: PartnersData['items'][number]
  index: number
  onUpdate: (patch: Partial<PartnersData['items'][number]>) => void
  onRemove: () => void
}

const PartnerItemRow = ({ item, index, onUpdate, onRemove }: PartnerItemRowProps) => {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    const formData = new FormData()
    formData.append('file', file)
    const result = await uploadBlockImage(formData)
    setUploading(false)
    if (result.success) {
      onUpdate({ imageUrl: result.url })
    } else {
      setUploadError(result.error)
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="flex gap-3 items-start bg-gray-50 rounded-lg p-3">
      {/* Logo preview */}
      <div
        className="shrink-0 w-16 h-16 border rounded-lg bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:border-school-blue transition-colors"
        onClick={() => fileRef.current?.click()}
        title="Clic para subir logo"
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
        ) : (
          <div className="text-center text-gray-300">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] mt-0.5 block">{uploading ? '...' : 'Logo'}</span>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Name + controls */}
      <div className="flex-1 min-w-0">
        <input
          className={inputClass}
          value={item.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder={`Institución ${index + 1}`}
        />
        {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="mt-1.5 text-xs text-school-blue hover:text-school-gold disabled:opacity-50 font-medium"
        >
          {uploading ? 'Subiendo...' : item.imageUrl ? 'Cambiar logo' : 'Subir logo'}
        </button>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 text-gray-300 hover:text-red-500 pt-1 transition-colors"
        title="Eliminar"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default BlockEditor

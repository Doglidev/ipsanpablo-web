'use client'

import { useState, useTransition, useRef } from 'react'
import { saveHomeButtons, type HomeButtonInput } from '@/lib/actions/home-buttons'
import { uploadPdf } from '@/lib/actions/upload-pdf'

const COLORS = [
  { value: 'sky',     label: 'Azul claro',     swatch: 'bg-sky-500' },
  { value: 'teal',    label: 'Verde agua',      swatch: 'bg-teal-500' },
  { value: 'rose',    label: 'Rojo',            swatch: 'bg-rose-500' },
  { value: 'amber',   label: 'Naranja',         swatch: 'bg-amber-500' },
  { value: 'purple',  label: 'Violeta',         swatch: 'bg-purple-500' },
  { value: 'emerald', label: 'Verde',           swatch: 'bg-emerald-600' },
  { value: 'blue',    label: 'Azul oscuro',     swatch: 'bg-blue-600' },
  { value: 'orange',  label: 'Naranja oscuro',  swatch: 'bg-orange-500' },
]

interface ButtonRow extends HomeButtonInput {
  _key: string
  _uploading: boolean
  _uploadError: string
}

const DEFAULTS: HomeButtonInput[] = [
  { label: 'Aspirantes Nivel Inicial 2027 – Salas 3, 4 y 5', fileUrl: '/formulario-inicial-2027.pdf',  downloadName: 'Formulario-Aspirantes-Inicial-2027.pdf',  color: 'sky',  sortOrder: 0, isVisible: true },
  { label: 'Aspirantes Nivel Primario 2027',                  fileUrl: '/formulario-primario-2027.pdf', downloadName: 'Formulario-Aspirantes-Primario-2027.pdf', color: 'teal', sortOrder: 1, isVisible: true },
  { label: 'Formulario C.U.S.',                               fileUrl: '/formulario-cus.pdf',           downloadName: 'Formulario-CUS.pdf',                     color: 'rose', sortOrder: 2, isVisible: true },
  { label: 'Informe de Salud Anual',                          fileUrl: '/Informe de Salud Anual - ISA-DDJJ.pdf', downloadName: 'Informe de Salud Anual - ISA-DDJJ.pdf', color: 'teal', sortOrder: 3, isVisible: true },
]

const toRows = (buttons: HomeButtonInput[]): ButtonRow[] =>
  buttons.map((b) => ({ ...b, _key: Math.random().toString(36).slice(2), _uploading: false, _uploadError: '' }))

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue'
const labelClass = 'block text-xs font-medium text-gray-500 mb-1'

interface HomeButtonsEditorProps {
  initialButtons: HomeButtonInput[]
}

export const HomeButtonsEditor = ({ initialButtons }: HomeButtonsEditorProps) => {
  const [rows, setRows] = useState<ButtonRow[]>(() =>
    toRows(initialButtons.length > 0 ? initialButtons : DEFAULTS)
  )
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  const update = (key: string, patch: Partial<ButtonRow>) =>
    setRows((prev) => prev.map((r) => (r._key === key ? { ...r, ...patch } : r)))

  const move = (index: number, dir: 'up' | 'down') =>
    setRows((prev) => {
      const next = [...prev]
      const target = dir === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= next.length) return next
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })

  const remove = (key: string) =>
    setRows((prev) => prev.filter((r) => r._key !== key))

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      { label: '', fileUrl: '', downloadName: '', color: 'sky', sortOrder: prev.length, isVisible: true, _key: Math.random().toString(36).slice(2), _uploading: false, _uploadError: '' },
    ])

  const handleSave = () => {
    setResult(null)
    const payload: HomeButtonInput[] = rows.map((r, i) => ({
      label: r.label,
      fileUrl: r.fileUrl,
      downloadName: r.downloadName,
      color: r.color,
      sortOrder: i,
      isVisible: r.isVisible,
    }))
    startTransition(async () => {
      const res = await saveHomeButtons(payload)
      setResult(res)
    })
  }

  return (
    <div>
      <div className="space-y-3 mb-4">
        {rows.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm">
            No hay botones. Añadí el primero.
          </div>
        )}
        {rows.map((row, index) => (
          <ButtonRowCard
            key={row._key}
            row={row}
            index={index}
            total={rows.length}
            onUpdate={(patch) => update(row._key, patch)}
            onMove={(dir) => move(index, dir)}
            onRemove={() => remove(row._key)}
          />
        ))}
      </div>

      <button
        onClick={addRow}
        className="mb-6 flex items-center gap-2 text-sm text-school-blue font-medium hover:text-school-gold border border-dashed border-school-blue hover:border-school-gold rounded-lg px-4 py-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Añadir botón
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="bg-school-blue text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-900 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Guardando...' : 'Guardar botones'}
        </button>
        {result && (
          <span className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.success ? '✓ Guardado correctamente' : `✗ ${result.error}`}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Row card ────────────────────────────────────────────────────────────────

interface RowProps {
  row: ButtonRow
  index: number
  total: number
  onUpdate: (patch: Partial<ButtonRow>) => void
  onMove: (dir: 'up' | 'down') => void
  onRemove: () => void
}

const ButtonRowCard = ({ row, index, total, onUpdate, onMove, onRemove }: RowProps) => {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUpdate({ _uploading: true, _uploadError: '' })
    const fd = new FormData()
    fd.append('file', file)
    const res = await uploadPdf(fd)
    if (res.success) {
      onUpdate({ fileUrl: res.url, downloadName: row.downloadName || file.name, _uploading: false })
    } else {
      onUpdate({ _uploading: false, _uploadError: res.error })
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const swatchClass = COLORS.find((c) => c.value === row.color)?.swatch ?? 'bg-gray-400'

  return (
    <div className="flex gap-2">
      <div className="flex-1 bg-white border rounded-xl p-4 space-y-3">
        {/* Row header: color dot + "Botón N" */}
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${swatchClass} shrink-0`} />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Botón {index + 1}</span>
          {!row.isVisible && (
            <span className="ml-auto text-xs text-gray-400 italic">oculto</span>
          )}
        </div>

        {/* Label */}
        <div>
          <label className={labelClass}>Nombre del botón</label>
          <input
            className={inputClass}
            value={row.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Ej: Aspirantes Nivel Inicial 2027"
          />
        </div>

        {/* File URL + upload */}
        <div>
          <label className={labelClass}>Archivo (URL o ruta)</label>
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              value={row.fileUrl}
              onChange={(e) => onUpdate({ fileUrl: e.target.value })}
              placeholder="/formulario.pdf  o  https://..."
              readOnly={row._uploading}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={row._uploading}
              className="shrink-0 px-3 py-2 text-sm rounded-lg border border-school-blue text-school-blue hover:bg-school-blue hover:text-white disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {row._uploading ? 'Subiendo...' : 'Subir PDF'}
            </button>
            <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
          </div>
          {row._uploadError && <p className="text-xs text-red-500 mt-1">{row._uploadError}</p>}
        </div>

        {/* Download name + color + visibility in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className={labelClass}>Nombre de descarga</label>
            <input
              className={inputClass}
              value={row.downloadName}
              onChange={(e) => onUpdate({ downloadName: e.target.value })}
              placeholder="Formulario-2027.pdf"
            />
          </div>
          <div>
            <label className={labelClass}>Color</label>
            <div className="relative">
              <select
                className={inputClass}
                value={row.color}
                onChange={(e) => onUpdate({ color: e.target.value })}
              >
                {COLORS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <label className={labelClass}>Visibilidad</label>
            <label className="flex items-center gap-2 cursor-pointer h-9">
              <div
                onClick={() => onUpdate({ isVisible: !row.isVisible })}
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${row.isVisible ? 'bg-school-blue' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${row.isVisible ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-gray-600">{row.isVisible ? 'Visible' : 'Oculto'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-1 pt-1">
        <button onClick={() => onMove('up')} disabled={index === 0} className="p-1.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20" title="Subir">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button onClick={() => onMove('down')} disabled={index === total - 1} className="p-1.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20" title="Bajar">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button onClick={onRemove} className="p-1.5 rounded text-gray-400 hover:text-red-600" title="Eliminar">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default HomeButtonsEditor

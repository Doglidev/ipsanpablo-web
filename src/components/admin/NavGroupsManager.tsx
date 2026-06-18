'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  createNavGroup,
  updateNavGroup,
  toggleNavGroupVisibility,
  deleteNavGroup,
  moveNavGroup,
} from '@/lib/actions/nav-groups'

interface GroupData {
  id: string
  slug: string
  label: string
  href: string | null
  isVisible: boolean
  totalSections: number
  visibleSections: number
}

interface Props {
  initialGroups: GroupData[]
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue'

const NavGroupsManager = ({ initialGroups }: Props) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // alta
  const [showNew, setShowNew] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newHref, setNewHref] = useState('')

  // edición inline
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editHref, setEditHref] = useState('')

  const run = (fn: () => Promise<{ success: boolean; error?: string }>, after?: () => void) => {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (!res.success) {
        setError(res.error ?? 'Ocurrió un error')
        return
      }
      after?.()
      router.refresh()
    })
  }

  const handleCreate = () => {
    const fd = new FormData()
    fd.set('label', newLabel)
    fd.set('href', newHref)
    run(() => createNavGroup(fd), () => {
      setNewLabel('')
      setNewHref('')
      setShowNew(false)
    })
  }

  const startEdit = (g: GroupData) => {
    setEditingId(g.id)
    setEditLabel(g.label)
    setEditHref(g.href ?? '')
    setError(null)
  }

  const saveEdit = (id: string) => {
    run(() => updateNavGroup(id, { label: editLabel, href: editHref }), () => setEditingId(null))
  }

  const handleDelete = (g: GroupData) => {
    if (!confirm(`¿Eliminar el grupo "${g.label}"? Esta acción no se puede deshacer.`)) return
    run(() => deleteNavGroup(g.id))
  }

  return (
    <div className="space-y-5">
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Alta de grupo */}
      <div className="bg-white rounded-xl border p-4">
        {showNew ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre del grupo</label>
                <input
                  className={inputClass}
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Ej: Convivencia"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Enlace directo <span className="text-gray-300">(opcional)</span>
                </label>
                <input
                  className={inputClass}
                  value={newHref}
                  onChange={(e) => setNewHref(e.target.value)}
                  placeholder="/noticias"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Dejá el enlace vacío para un grupo normal (sus secciones forman el desplegable). Usalo
              solo si el grupo apunta a una página fija como <code>/noticias</code>.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={isPending || !newLabel.trim()}
                className="bg-school-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 disabled:opacity-50"
              >
                Crear grupo
              </button>
              <button
                onClick={() => { setShowNew(false); setError(null) }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 text-sm font-medium text-school-blue hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo grupo
          </button>
        )}
      </div>

      {/* Lista de grupos */}
      <div className="bg-white rounded-xl border divide-y">
        {initialGroups.length === 0 && (
          <p className="text-center text-gray-400 py-10 text-sm">No hay grupos todavía.</p>
        )}

        {initialGroups.map((g, index) => {
          const isEditing = editingId === g.id
          const willHide = g.visibleSections === 0 && !g.href
          return (
            <div key={g.id} className="px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Reordenar */}
                <div className="flex flex-col">
                  <button
                    onClick={() => run(() => moveNavGroup(g.id, 'up'))}
                    disabled={isPending || index === 0}
                    className="text-gray-400 hover:text-school-blue disabled:opacity-30"
                    aria-label="Subir"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => run(() => moveNavGroup(g.id, 'down'))}
                    disabled={isPending || index === initialGroups.length - 1}
                    className="text-gray-400 hover:text-school-blue disabled:opacity-30"
                    aria-label="Bajar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Estado */}
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${g.isVisible ? 'bg-green-500' : 'bg-gray-300'}`}
                  title={g.isVisible ? 'Visible' : 'Oculto'}
                />

                {/* Datos / edición */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input className={inputClass} value={editLabel} onChange={(e) => setEditLabel(e.target.value)} />
                      <input className={inputClass} value={editHref} onChange={(e) => setEditHref(e.target.value)} placeholder="Enlace directo (opcional)" />
                    </div>
                  ) : (
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{g.label}</p>
                      <p className="text-xs text-gray-400 font-mono">
                        {g.slug}
                        {g.href ? ` · ${g.href}` : ''}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contador de secciones */}
                {!isEditing && (
                  <Link
                    href={`/admin/secciones?grupo=${g.slug}`}
                    className="text-xs text-gray-500 hover:text-school-blue shrink-0 whitespace-nowrap"
                    title="Ver secciones de este grupo"
                  >
                    {g.visibleSections}/{g.totalSections} secc.
                  </Link>
                )}

                {/* Acciones */}
                <div className="flex items-center gap-1 shrink-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(g.id)}
                        disabled={isPending || !editLabel.trim()}
                        className="text-xs bg-school-blue text-white px-3 py-1.5 rounded-md font-medium disabled:opacity-50"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-gray-500 px-2 py-1.5 rounded-md hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => run(() => toggleNavGroupVisibility(g.id, !g.isVisible))}
                        disabled={isPending}
                        className="text-xs text-gray-600 px-2 py-1.5 rounded-md hover:bg-gray-50"
                      >
                        {g.isVisible ? 'Ocultar' : 'Mostrar'}
                      </button>
                      <button
                        onClick={() => startEdit(g)}
                        className="text-xs text-school-blue font-medium px-2 py-1.5 rounded-md hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(g)}
                        disabled={isPending}
                        className="text-xs text-red-600 px-2 py-1.5 rounded-md hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Aviso de grupo que no se mostrará */}
              {willHide && g.isVisible && (
                <p className="text-xs text-amber-600 mt-2 ml-9">
                  Este grupo no aparece en el sitio porque no tiene secciones visibles ni enlace directo.
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NavGroupsManager

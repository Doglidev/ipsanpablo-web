'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { createUser, updateUser } from '@/lib/actions/users'

interface UserData {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
}

interface CreateProps {
  mode: 'create'
  user?: never
  currentUserId?: never
}

interface EditProps {
  mode: 'edit'
  user: UserData
  currentUserId: string
}

type Props = CreateProps | EditProps

const ROLES = [
  { value: 'ADMIN', label: 'Admin', description: 'Acceso total, incluida gestión de usuarios' },
  { value: 'EDITOR', label: 'Editor', description: 'Puede editar secciones, noticias y galería' },
  { value: 'VIEWER', label: 'Visor', description: 'Solo puede ver el panel, sin editar' },
]

const UserForm = (props: Props) => {
  const { mode } = props
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isCurrentUser = mode === 'edit' && props.user.id === props.currentUserId

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createUser(formData)
          : await updateUser(props.user.id, formData)

      if (!result.success) {
        setError(result.error)
      } else {
        router.push('/admin/usuarios')
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Nombre completo
        </label>
        <input
          name="name"
          defaultValue={mode === 'edit' ? props.user.name : ''}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue focus:border-transparent transition-colors"
          placeholder="Juan García"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <input
          name="email"
          type="email"
          defaultValue={mode === 'edit' ? props.user.email : ''}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue focus:border-transparent transition-colors"
          placeholder="usuario@ipsanpablo.com"
        />
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Contraseña{' '}
          {mode === 'edit' && (
            <span className="text-gray-400 font-normal">(dejá en blanco para no cambiar)</span>
          )}
        </label>
        <input
          name="password"
          type="password"
          required={mode === 'create'}
          autoComplete="new-password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue focus:border-transparent transition-colors"
          placeholder={mode === 'create' ? 'Mínimo 8 caracteres' : '••••••••'}
        />
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Confirmar contraseña
        </label>
        <input
          name="confirmPassword"
          type="password"
          required={mode === 'create'}
          autoComplete="new-password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue focus:border-transparent transition-colors"
          placeholder="••••••••"
        />
      </div>

      {/* Rol */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rol
          {isCurrentUser && (
            <span className="ml-2 text-xs text-amber-600 font-normal">
              No podés cambiar tu propio rol
            </span>
          )}
        </label>
        <div className="space-y-2">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                isCurrentUser
                  ? 'opacity-60 cursor-not-allowed bg-gray-50'
                  : 'cursor-pointer hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                defaultChecked={
                  mode === 'edit' ? props.user.role === r.value : r.value === 'EDITOR'
                }
                disabled={isCurrentUser}
                className="mt-0.5"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">{r.label}</span>
                <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
              </div>
            </label>
          ))}
        </div>
        {isCurrentUser && (
          <input type="hidden" name="role" value={(props as EditProps).user.role} />
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-school-blue hover:bg-blue-900 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
        >
          {isPending
            ? mode === 'create'
              ? 'Creando...'
              : 'Guardando...'
            : mode === 'create'
            ? 'Crear usuario'
            : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

export default UserForm

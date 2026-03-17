import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import UserDeleteButton from '@/components/admin/UserDeleteButton'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Visor',
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-amber-100 text-amber-800',
  EDITOR: 'bg-blue-100 text-blue-800',
  VIEWER: 'bg-gray-100 text-gray-600',
}

const UsuariosPage = async () => {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'ADMIN') redirect('/admin')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  const currentUserId = (session!.user as { id: string }).id

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestioná los usuarios del panel de administración
          </p>
        </div>
        <Link
          href="/admin/usuarios/nuevo"
          className="flex items-center gap-2 bg-school-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear nuevo usuario
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Creado
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-school-blue/10 flex items-center justify-center text-sm font-semibold text-school-blue flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    {user.id === currentUserId && (
                      <span className="text-xs text-gray-400">(vos)</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/usuarios/${user.id}/editar`}
                      className="p-1.5 text-gray-400 hover:text-school-blue hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Link>
                    <UserDeleteButton
                      userId={user.id}
                      userName={user.name}
                      isCurrentUser={user.id === currentUserId}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsuariosPage

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import UserForm from '@/components/admin/UserForm'

const NuevoUsuarioPage = async () => {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'ADMIN') redirect('/admin')

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/usuarios"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear usuario</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Completá los datos para agregar un nuevo usuario
          </p>
        </div>
      </div>

      <UserForm mode="create" />
    </div>
  )
}

export default NuevoUsuarioPage

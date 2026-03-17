import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import UserForm from '@/components/admin/UserForm'

interface EditarUsuarioPageProps {
  params: Promise<{ id: string }>
}

const EditarUsuarioPage = async ({ params }: EditarUsuarioPageProps) => {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  if (role !== 'ADMIN') redirect('/admin')

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!user) notFound()

  const currentUserId = (session!.user as { id: string }).id

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
          <h1 className="text-2xl font-bold text-gray-900">Editar usuario</h1>
          <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
        </div>
      </div>

      <UserForm mode="edit" user={user} currentUserId={currentUserId} />
    </div>
  )
}

export default EditarUsuarioPage

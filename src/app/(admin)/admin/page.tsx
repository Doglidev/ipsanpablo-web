import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const AdminPage = async () => {
  const session = await getServerSession(authOptions)
  const [newsCount, sectionsCount, siteConfig] = await Promise.all([
    prisma.newsArticle.count(),
    prisma.section.count(),
    prisma.siteConfig.findUnique({ where: { id: 'main' } }),
  ])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {session?.user?.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Panel de administración del Instituto San Pablo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <div className="text-3xl font-bold text-school-blue">{newsCount}</div>
          <div className="text-sm text-gray-500 mt-1">Noticias</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-3xl font-bold text-school-blue">{sectionsCount}</div>
          <div className="text-sm text-gray-500 mt-1">Secciones</div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className={`text-3xl font-bold ${siteConfig?.inscripcionOpen ? 'text-green-600' : 'text-gray-400'}`}>
            {siteConfig?.inscripcionOpen ? 'Abiertas' : 'Cerradas'}
          </div>
          <div className="text-sm text-gray-500 mt-1">Inscripciones</div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/admin/secciones" className="bg-white rounded-xl border p-4 hover:border-school-blue hover:shadow-sm transition-all text-sm font-medium text-gray-700">
            Editar secciones del sitio →
          </Link>
          <Link href="/admin/noticias" className="bg-white rounded-xl border p-4 hover:border-school-blue hover:shadow-sm transition-all text-sm font-medium text-gray-700">
            Crear noticia →
          </Link>
          <Link href="/admin/galeria" className="bg-white rounded-xl border p-4 hover:border-school-blue hover:shadow-sm transition-all text-sm font-medium text-gray-700">
            Subir fotos →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminPage

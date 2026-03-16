import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const StatCard = ({
  value,
  label,
  color = 'text-school-blue',
  href,
}: {
  value: string | number
  label: string
  color?: string
  href: string
}) => (
  <Link
    href={href}
    className="bg-white rounded-xl border p-5 hover:border-school-blue hover:shadow-sm transition-all"
  >
    <div className={`text-3xl font-bold ${color}`}>{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </Link>
)

const AdminPage = async () => {
  const session = await getServerSession(authOptions)

  const [publishedNewsCount, totalSections, galleryCount, siteConfig] =
    await Promise.all([
      prisma.newsArticle.count({ where: { isPublished: true } }),
      prisma.section.count(),
      prisma.galleryImage.count(),
      prisma.siteConfig.findUnique({ where: { id: 'main' } }),
    ])

  const recentNews = await prisma.newsArticle.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
    select: { id: true, title: true, isPublished: true, updatedAt: true },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {session?.user?.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Panel de administración del Instituto San Pablo
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          value={publishedNewsCount}
          label="Noticias publicadas"
          href="/admin/noticias"
        />
        <StatCard
          value={totalSections}
          label="Secciones"
          href="/admin/secciones"
        />
        <StatCard
          value={galleryCount}
          label="Imágenes en galería"
          href="/admin/galeria"
        />
        <StatCard
          value={siteConfig?.inscripcionOpen ? 'Abiertas' : 'Cerradas'}
          label="Inscripciones"
          color={siteConfig?.inscripcionOpen ? 'text-green-600' : 'text-gray-400'}
          href="/admin/configuracion"
        />
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/secciones"
            className="bg-white rounded-xl border p-4 hover:border-school-blue hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          >
            Editar secciones del sitio →
          </Link>
          <Link
            href="/admin/noticias/nueva"
            className="bg-white rounded-xl border p-4 hover:border-school-blue hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          >
            Nueva noticia →
          </Link>
          <Link
            href="/admin/galeria"
            className="bg-white rounded-xl border p-4 hover:border-school-blue hover:shadow-sm transition-all text-sm font-medium text-gray-700"
          >
            Subir fotos →
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      {recentNews.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Últimas noticias editadas
          </h2>
          <div className="bg-white rounded-xl border divide-y">
            {recentNews.map((article) => (
              <Link
                key={article.id}
                href={`/admin/noticias/${article.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-800 font-medium truncate">{article.title}</span>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      article.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {article.isPublished ? 'Publicada' : 'Borrador'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(article.updatedAt).toLocaleDateString('es-AR')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage

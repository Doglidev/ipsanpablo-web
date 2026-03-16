import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import NewsDeleteButton from '@/components/admin/NewsDeleteButton'

const PAGE_SIZE = 20

interface NoticiasPageProps {
  searchParams: Promise<{ estado?: string; pagina?: string }>
}

const NoticiasPage = async ({ searchParams }: NoticiasPageProps) => {
  const { estado, pagina } = await searchParams
  const page = Number(pagina ?? 1)
  const isPublished = estado === 'publicadas' ? true : estado === 'borradores' ? false : undefined

  const [articles, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where: isPublished !== undefined ? { isPublished } : undefined,
      orderBy: { updatedAt: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        publishedAt: true,
        updatedAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.newsArticle.count({
      where: isPublished !== undefined ? { isPublished } : undefined,
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const filterHref = (e: string) =>
    e ? `/admin/noticias?estado=${e}` : '/admin/noticias'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Noticias</h1>
          <p className="text-gray-500 text-sm mt-1">{total} artículo{total !== 1 ? 's' : ''} en total</p>
        </div>
        <Link
          href="/admin/noticias/nueva"
          className="bg-school-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva noticia
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {[
          { value: '', label: 'Todas' },
          { value: 'publicadas', label: 'Publicadas' },
          { value: 'borradores', label: 'Borradores' },
        ].map((f) => (
          <Link
            key={f.value}
            href={filterHref(f.value)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
              (estado ?? '') === f.value
                ? 'border-school-blue text-school-blue bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No hay noticias</p>
          <p className="text-sm mt-1">Creá la primera desde el botón de arriba.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border divide-y">
            {articles.map((article) => (
              <div key={article.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {article.author.name} ·{' '}
                    {new Date(article.updatedAt).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      article.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {article.isPublished ? 'Publicada' : 'Borrador'}
                  </span>
                  <Link
                    href={`/admin/noticias/${article.id}`}
                    className="text-xs text-school-blue font-medium hover:underline px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Editar
                  </Link>
                  <NewsDeleteButton id={article.id} title={article.title} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/noticias?${estado ? `estado=${estado}&` : ''}pagina=${p}`}
                  className={`w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                    p === page
                      ? 'bg-school-blue text-white'
                      : 'bg-white border text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default NoticiasPage

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import SectionHero from '@/components/public/SectionHero'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Noticias | Instituto San Pablo Apóstol',
  description: 'Últimas noticias del Instituto Parroquial San Pablo Apóstol.',
}

const PAGE_SIZE = 9

interface NoticiasPageProps {
  searchParams: Promise<{ page?: string }>
}

const NoticiasPage = async ({ searchParams }: NoticiasPageProps) => {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  const [total, articles] = await Promise.all([
    prisma.newsArticle.count({ where: { isPublished: true } }),
    prisma.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        author: { select: { name: true } },
      },
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <div>
      <SectionHero
        title="Noticias"
        breadcrumbs={[{ label: 'Noticias', href: '/noticias' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {articles.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-lg">
            Todavía no hay noticias publicadas.
          </p>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <Link href={`/noticias/${featured.slug}`} className="group block mb-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <div className="relative h-64 md:h-auto bg-school-blue">
                    {featured.coverImage ? (
                      <Image
                        src={featured.coverImage}
                        alt={featured.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/30 text-6xl font-bold">SP</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-white p-8 flex flex-col justify-center">
                    <span className="text-xs font-semibold text-school-gold uppercase tracking-wide mb-3">
                      Destacada
                    </span>
                    <h2 className="text-2xl font-bold text-school-blue group-hover:underline mb-3 leading-snug">
                      {featured.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                      {featured.publishedAt
                        ? new Date(featured.publishedAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
                        : ''}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <span className="text-school-blue text-sm font-semibold group-hover:underline">
                      Leer más →
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {rest.map((article) => (
                  <Link
                    key={article.id}
                    href={`/noticias/${article.slug}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-48 bg-school-blue">
                      {article.coverImage ? (
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/30 text-4xl font-bold">SP</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-gray-400 mb-2">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
                          : ''}
                      </p>
                      <h3 className="font-bold text-gray-900 group-hover:text-school-blue transition-colors mb-2 line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <span className="text-school-blue text-xs font-semibold group-hover:underline">
                        Leer más →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/noticias?page=${page - 1}`}
                    className="px-4 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ← Anterior
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/noticias?page=${p}`}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      p === page
                        ? 'bg-school-blue text-white border-school-blue'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={`/noticias?page=${page + 1}`}
                    className="px-4 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Siguiente →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NoticiasPage

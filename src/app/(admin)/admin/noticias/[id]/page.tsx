import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import NewsEditorClient from '@/components/admin/NewsEditorClient'

interface NewsEditorPageProps {
  params: Promise<{ id: string }>
}

const NewsEditorPage = async ({ params }: NewsEditorPageProps) => {
  const { id } = await params
  const article = await prisma.newsArticle.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  })

  if (!article) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/noticias" className="text-sm text-gray-500 hover:text-school-blue">
            ← Noticias
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 line-clamp-1">{article.title}</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Por {article.author.name} ·{' '}
            {article.isPublished ? (
              <span className="text-green-600">Publicada</span>
            ) : (
              <span className="text-gray-400">Borrador</span>
            )}
          </p>
        </div>
        {article.isPublished && (
          <a
            href={`/noticias/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-school-blue flex items-center gap-1"
          >
            Ver en el sitio
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

      <NewsEditorClient article={article} />
    </div>
  )
}

export default NewsEditorPage

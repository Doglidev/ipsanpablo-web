import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'

export const revalidate = 60

interface NoticiaPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: NoticiaPageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.newsArticle.findUnique({
    where: { slug, isPublished: true },
    select: { title: true, excerpt: true },
  })
  if (!article) return {}
  return {
    title: `${article.title} | Instituto San Pablo Apóstol`,
    description: article.excerpt,
  }
}

const NoticiaPage = async ({ params }: NoticiaPageProps) => {
  const { slug } = await params

  const article = await prisma.newsArticle.findUnique({
    where: { slug, isPublished: true },
    include: { author: { select: { name: true } } },
  })

  if (!article) notFound()

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div>
      <SectionHero
        title={article.title}
        heroImage={article.coverImage ?? undefined}
        breadcrumbs={[
          { label: 'Noticias', href: '/noticias' },
          { label: article.title, href: `/noticias/${article.slug}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b border-gray-200">
          {publishedDate && (
            <span className="text-sm text-gray-500">
              {publishedDate}
            </span>
          )}
          <span className="text-sm text-gray-400">·</span>
          <span className="text-sm text-gray-500">
            Por {article.author.name}
          </span>
        </div>

        {/* Content */}
        <BlockRenderer content={article.content} />

        {/* Back link */}
        <div className="mt-14 pt-8 border-t border-gray-200">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-school-blue text-sm font-medium hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a noticias
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NoticiaPage

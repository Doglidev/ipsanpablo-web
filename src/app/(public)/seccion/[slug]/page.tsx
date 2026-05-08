import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const section = await prisma.section.findUnique({ where: { slug } })
  if (!section) return {}
  return {
    title: `${section.title} | Instituto San Pablo Apóstol`,
  }
}

const SeccionPage = async ({ params }: Props) => {
  const { slug } = await params
  const section = await prisma.section.findUnique({ where: { slug } })

  if (!section || !section.isVisible) notFound()

  return (
    <div>
      <SectionHero
        title={section.title}
        heroImage={section.heroImage}
        breadcrumbs={[
          { label: section.pageGroup.charAt(0).toUpperCase() + section.pageGroup.slice(1), href: '#' },
          { label: section.title, href: `/seccion/${section.slug}` },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BlockRenderer content={section.content} />
      </div>
    </div>
  )
}

export default SeccionPage

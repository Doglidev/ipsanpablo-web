import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Autoridades | Instituto San Pablo Apóstol',
  description: 'Equipo directivo y autoridades del Instituto Parroquial San Pablo Apóstol.',
}

const AutoridadesPage = async () => {
  const section = await prisma.section.findUnique({
    where: { slug: 'autoridades' },
  })

  if (!section || !section.isVisible) notFound()

  return (
    <div>
      <SectionHero
        title={section.title}
        heroImage={section.heroImage}
        breadcrumbs={[
          { label: 'Institucional', href: '/institucional/nuestra-escuela' },
          { label: 'Autoridades', href: '/institucional/autoridades' },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BlockRenderer content={section.content} />
      </div>
    </div>
  )
}

export default AutoridadesPage

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Pasantías | Instituto San Pablo Apóstol',
  description: 'Información sobre pasantías del Instituto Parroquial San Pablo Apóstol.',
}

const PasantiasPage = async () => {
  const section = await prisma.section.findUnique({
    where: { slug: 'pasantias-objetivo' },
  })

  if (!section || !section.isVisible) notFound()

  return (
    <div>
      <SectionHero
        title={section.title}
        heroImage={section.heroImage}
        breadcrumbs={[
          { label: 'Pasantías', href: '/pasantias/objetivo' },
          { label: 'Objetivo', href: '/pasantias/objetivo' },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BlockRenderer content={section.content} />
      </div>
    </div>
  )
}

export default PasantiasPage

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Lugares de Pasantías | Instituto San Pablo Apóstol',
  description: 'Lugares donde los alumnos realizan sus pasantías educativas en el Instituto Parroquial San Pablo Apóstol.',
}

const LugaresPasantiasPage = async () => {
  const section = await prisma.section.findUnique({ where: { slug: 'pasantias-lugares' } })
  if (!section || !section.isVisible) notFound()

  return (
    <div>
      <SectionHero
        title={section.title}
        heroImage={section.heroImage ?? undefined}
        breadcrumbs={[
          { label: 'Pasantías', href: '/pasantias/objetivo' },
          { label: 'Lugares', href: '/pasantias/lugares' },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BlockRenderer content={section.content} />
      </div>
    </div>
  )
}

export default LugaresPasantiasPage

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'
import NivelesNav from '@/components/public/NivelesNav'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Nivel Inicial | Instituto San Pablo Apóstol',
  description: 'Información sobre el Nivel Inicial del Instituto Parroquial San Pablo Apóstol.',
}

const NivelInicialPage = async () => {
  const section = await prisma.section.findUnique({
    where: { slug: 'nivel-inicial' },
  })

  if (!section || !section.isVisible) notFound()

  return (
    <div>
      <SectionHero
        title={section.title}
        heroImage={section.heroImage}
        breadcrumbs={[
          { label: 'Niveles', href: '/niveles/inicial' },
          { label: 'Inicial', href: '/niveles/inicial' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <NivelesNav active="inicial" />
        <div className="max-w-4xl mt-8">
          <BlockRenderer content={section.content} />
        </div>
      </div>
    </div>
  )
}

export default NivelInicialPage

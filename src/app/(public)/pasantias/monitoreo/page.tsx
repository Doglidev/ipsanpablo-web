import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Monitoreo y Evaluación | Instituto San Pablo Apóstol',
  description: 'Monitoreo y evaluación de las pasantías del Instituto Parroquial San Pablo Apóstol.',
}

const MonitoreoPage = async () => {
  const section = await prisma.section.findUnique({ where: { slug: 'pasantias-monitoreo' } })
  if (!section || !section.isVisible) notFound()
  return (
    <div>
      <SectionHero title={section.title} heroImage={section.heroImage ?? undefined} breadcrumbs={[
        { label: 'Pasantías', href: '/pasantias/objetivo' },
        { label: 'Monitoreo', href: '/pasantias/monitoreo' },
      ]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BlockRenderer content={section.content} />
      </div>
    </div>
  )
}

export default MonitoreoPage

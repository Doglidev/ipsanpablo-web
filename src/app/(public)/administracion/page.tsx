import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'
import CuotasForm from '@/components/public/CuotasForm'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Administración | Instituto San Pablo Apóstol',
  description: 'Información sobre aranceles, pagos y administración del Instituto Parroquial San Pablo Apóstol.',
}

const AdministracionPage = async () => {
  const section = await prisma.section.findUnique({ where: { slug: 'administracion' } })
  if (!section || !section.isVisible) notFound()
  return (
    <div>
      <SectionHero title={section.title} heroImage={section.heroImage ?? undefined} breadcrumbs={[
        { label: 'Administración', href: '/administracion' },
      ]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BlockRenderer content={section.content} />
        <CuotasForm />
      </div>
    </div>
  )
}

export default AdministracionPage

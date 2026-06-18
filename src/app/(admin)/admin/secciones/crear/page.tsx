import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SectionCreateForm from '@/components/admin/SectionCreateForm'

const CrearSeccionPage = async () => {
  const navGroups = await prisma.navGroup.findMany({ orderBy: { sortOrder: 'asc' } })
  const groups = navGroups.map((g) => ({ slug: g.slug, label: g.label }))

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link href="/admin/secciones" className="text-sm text-gray-500 hover:text-school-blue">
          ← Volver a secciones
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Nueva sección</h1>
      </div>

      <SectionCreateForm groups={groups} />
    </div>
  )
}

export default CrearSeccionPage

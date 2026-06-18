import { prisma } from '@/lib/prisma'
import NavGroupsManager from '@/components/admin/NavGroupsManager'

export const dynamic = 'force-dynamic'

const GruposPage = async () => {
  const [groups, totalByGroup, visibleByGroup] = await Promise.all([
    prisma.navGroup.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.section.groupBy({ by: ['pageGroup'], _count: { _all: true } }),
    prisma.section.groupBy({ by: ['pageGroup'], where: { isVisible: true }, _count: { _all: true } }),
  ])

  const totalMap = new Map(totalByGroup.map((g) => [g.pageGroup, g._count._all]))
  const visibleMap = new Map(visibleByGroup.map((g) => [g.pageGroup, g._count._all]))

  const data = groups.map((g) => ({
    id: g.id,
    slug: g.slug,
    label: g.label,
    href: g.href,
    isVisible: g.isVisible,
    totalSections: totalMap.get(g.slug) ?? 0,
    visibleSections: visibleMap.get(g.slug) ?? 0,
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Grupos del menú</h1>
        <p className="text-gray-500 text-sm mt-1">
          Controlá los grupos del menú principal: orden, visibilidad y nombre. Un grupo sin
          secciones visibles no aparece en el sitio.
        </p>
      </div>

      <NavGroupsManager initialGroups={data} />
    </div>
  )
}

export default GruposPage

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SectionDeleteButton from '@/components/admin/SectionDeleteButton'
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle'

const PAGE_GROUPS = [
  { value: '', label: 'Todos' },
  { value: 'institucional', label: 'Institucional' },
  { value: 'niveles', label: 'Niveles' },
  { value: 'becas', label: 'Becas' },
  { value: 'pasantias', label: 'Pasantías' },
  { value: 'secretarias', label: 'Secretarías' },
  { value: 'pastoral', label: 'Pastoral' },
]

interface SeccionesPageProps {
  searchParams: Promise<{ grupo?: string }>
}

const SeccionesPage = async ({ searchParams }: SeccionesPageProps) => {
  const { grupo } = await searchParams

  const sections = await prisma.section.findMany({
    where: grupo ? { pageGroup: grupo } : undefined,
    orderBy: [{ pageGroup: 'asc' }, { sortOrder: 'asc' }],
  })

  // Group by pageGroup for display
  const grouped = sections.reduce<Record<string, typeof sections>>((acc, s) => {
    if (!acc[s.pageGroup]) acc[s.pageGroup] = []
    acc[s.pageGroup].push(s)
    return acc
  }, {})

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Secciones</h1>
          <p className="text-gray-500 text-sm mt-1">Contenido de las páginas del sitio</p>
        </div>
        <Link
          href="/admin/secciones/crear"
          className="bg-school-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva sección
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {PAGE_GROUPS.map((g) => (
          <Link
            key={g.value}
            href={g.value ? `/admin/secciones?grupo=${g.value}` : '/admin/secciones'}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
              (grupo ?? '') === g.value
                ? 'border-school-blue text-school-blue bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {g.label}
          </Link>
        ))}
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No hay secciones</p>
          <p className="text-sm mt-1">Creá la primera desde el botón de arriba.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                {group}
              </h2>
              <div className="bg-white rounded-xl border divide-y">
                {items.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          section.isVisible ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {section.title}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">{section.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <SectionVisibilityToggle
                        slug={section.slug}
                        isVisible={section.isVisible}
                      />
                      <Link
                        href={`/admin/secciones/${section.slug}`}
                        className="text-xs text-school-blue font-medium hover:underline px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Editar
                      </Link>
                      <SectionDeleteButton slug={section.slug} title={section.title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SeccionesPage

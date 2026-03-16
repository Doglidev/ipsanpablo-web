import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SectionEditorClient from '@/components/admin/SectionEditorClient'

interface SectionEditorPageProps {
  params: Promise<{ slug: string }>
}

const SectionEditorPage = async ({ params }: SectionEditorPageProps) => {
  const { slug } = await params
  const section = await prisma.section.findUnique({ where: { slug } })

  if (!section) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/secciones" className="text-sm text-gray-500 hover:text-school-blue">
            ← Secciones
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{section.title}</h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">slug: {section.slug}</p>
        </div>
        <a
          href={`/${section.pageGroup}/${section.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-school-blue flex items-center gap-1"
        >
          Ver en el sitio
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <SectionEditorClient section={section} />
    </div>
  )
}

export default SectionEditorPage

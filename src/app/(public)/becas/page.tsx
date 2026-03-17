import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlockRenderer from '@/components/public/BlockRenderer'
import SectionHero from '@/components/public/SectionHero'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Becas | Instituto San Pablo Apóstol',
  description: 'Información sobre becas del Instituto Parroquial San Pablo Apóstol.',
}

const BecasPage = async () => {
  const section = await prisma.section.findUnique({
    where: { slug: 'becas' },
  })

  if (!section || !section.isVisible) notFound()

  return (
    <div>
      <SectionHero
        title={section.title}
        heroImage={section.heroImage}
        breadcrumbs={[{ label: 'Becas', href: '/becas' }]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <BlockRenderer content={section.content} />

        {/* Documentos para descargar */}
        <div className="mt-14 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-school-blue mb-8">Documentos para descargar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <a
              href="/formulario-solicitud-sp.pdf"
              download="Formulario-Solicitud-Bonificaciones.pdf"
              className="group flex items-center gap-4 bg-school-gold hover:bg-amber-600 text-white rounded-xl px-6 py-5 font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-5m3 5v-3m3 3v-7" />
                </svg>
              </span>
              <span className="leading-snug">Formulario de Solicitud de Bonificaciones</span>
              <svg className="w-4 h-4 ml-auto flex-shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>

            <a
              href="/DDJJ-SOLICITUD.docx"
              download="Declaracion-Jurada-Becas.docx"
              className="group flex items-center gap-4 bg-school-gold hover:bg-amber-600 text-white rounded-xl px-6 py-5 font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              <span className="leading-snug">Declaración Jurada de Solicitud de Becas</span>
              <svg className="w-4 h-4 ml-auto flex-shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>

          </div>
        </div>
      </div>
    </div>
  )
}

export default BecasPage

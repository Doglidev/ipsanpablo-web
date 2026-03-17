import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import HomeContactForm from '@/components/public/HomeContactForm'

export const revalidate = 60

const NIVELES = [
  {
    slug: 'inicial',
    href: '/niveles/inicial',
    label: 'Nivel Inicial',
    description: 'Sala de 3, 4 y 5 años. Una primera experiencia escolar cálida y estimulante.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    slug: 'primario',
    href: '/niveles/primario',
    label: 'Nivel Primario',
    description: '1° a 6° grado. Formación integral con énfasis en valores y excelencia académica.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    slug: 'secundario',
    href: '/niveles/secundario',
    label: 'Nivel Secundario',
    description: '1° a 6° año. Preparación sólida para la universidad y la vida adulta.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
]

const HomePage = async () => {
  const [siteConfig, latestNews] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: 'main' } }),
    prisma.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, publishedAt: true },
    }),
  ])

  const heroTitle = siteConfig?.heroTitle || 'Instituto Parroquial San Pablo Apóstol'
  const heroSubtitle = siteConfig?.heroSubtitle || 'Educación con valores desde 1959'

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-school-blue text-white overflow-hidden">
        {siteConfig?.heroImageUrl && (
          <Image
            src={siteConfig.heroImageUrl}
            alt="Frente del colegio"
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 text-center">
          <p className="text-school-gold text-sm font-semibold uppercase tracking-widest mb-4">
            Barrio Colón · Córdoba · Desde 1959
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/institucional/nuestra-escuela"
              className="inline-block bg-school-gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Conocé el colegio
            </Link>
            <Link
              href="/contacto"
              className="inline-block bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Contactanos
            </Link>
          </div>

          {/* Banner inscripciones */}
          {siteConfig?.inscripcionOpen && (
            <div className="mt-8 inline-flex items-center gap-2 bg-school-gold/20 border border-school-gold/50 text-school-gold rounded-full px-5 py-2 text-sm font-medium">
              <span className="w-2 h-2 bg-school-gold rounded-full animate-pulse" />
              {siteConfig.inscripcionText || 'Inscripciones abiertas'}
            </div>
          )}
        </div>
      </section>

      {/* ── NIVELES ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-school-blue mb-3">Niveles Educativos</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Acompañamos el crecimiento de cada alumno desde los primeros años hasta la finalización del secundario.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NIVELES.map((nivel) => (
              <Link
                key={nivel.slug}
                href={nivel.href}
                className="group bg-white rounded-2xl border border-gray-100 p-8 hover:border-school-blue hover:shadow-lg transition-all"
              >
                <div className="text-school-blue mb-4 group-hover:text-school-gold transition-colors">
                  {nivel.icon}
                </div>
                <h3 className="text-xl font-bold text-school-blue mb-2">{nivel.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{nivel.description}</p>
                <span className="text-school-blue text-sm font-medium group-hover:text-school-gold transition-colors">
                  Ver más →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 3 COLUMNAS ── */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

            {/* ── COL IZQUIERDA: Últimas noticias ── */}
            <div className="bg-school-blue rounded-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-white">
                  <svg className="w-5 h-5 text-school-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-white font-bold text-lg">Últimas noticias!</h2>
                </div>
              </div>

              {/* News cards */}
              <div className="flex-1 px-5 py-4 space-y-3 overflow-hidden">
                {latestNews.length === 0 ? (
                  <p className="text-white/50 text-sm py-8 text-center">No hay noticias publicadas aún.</p>
                ) : (
                  latestNews.map((article) => (
                    <Link
                      key={article.id}
                      href={`/noticias/${article.slug}`}
                      className="group flex gap-3 bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                        {article.coverImage ? (
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-school-gold transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-white/60 text-xs mt-1 line-clamp-2 leading-snug">
                          {article.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Footer link */}
              <div className="px-6 py-4 border-t border-white/10">
                <Link
                  href="/noticias"
                  className="text-school-gold hover:text-amber-400 text-sm font-medium transition-colors"
                >
                  Ver todas las noticias →
                </Link>
              </div>
            </div>

            {/* ── COL CENTRAL: Áulica + Formularios ── */}
            <div className="flex flex-col gap-4">
              {/* Banner Áulica */}
              <a
                href="https://app.aulica.com.ar/login.html?idCompany=215"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden bg-emerald-700 hover:bg-emerald-600 transition-colors flex items-center justify-center py-10 px-6 text-center shadow-md"
              >
                <div className="relative z-10">
                  <p className="text-white text-3xl font-black tracking-wide leading-none">
                    INGRESO A
                  </p>
                  <p className="text-white text-4xl font-black tracking-wide leading-none mt-1">
                    ÁULICA
                  </p>
                  <p className="text-emerald-200 text-sm font-bold mt-3 group-hover:text-white transition-colors">
                    CLICK AQUÍ !!
                  </p>
                </div>
                {/* Decorative */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white" />
                  <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white" />
                </div>
              </a>

              {/* Botones descarga */}
              <a
                href="/formulario-inicial-2026.pdf"
                download="Formulario-Aspirantes-Inicial-2026.pdf"
                className="group flex items-center gap-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-5 py-4 font-semibold text-sm transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 flex-shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="flex-1 leading-snug">Aspirantes Nivel Inicial 2026 – Salas 3, 4 y 5</span>
              </a>

              <a
                href="/formulario-primario-2026.pdf"
                download="Formulario-Aspirantes-Primario-2026.pdf"
                className="group flex items-center gap-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-5 py-4 font-semibold text-sm transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 flex-shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="flex-1 leading-snug">Aspirantes Nivel Primario 2026</span>
              </a>

              <a
                href="/formulario-cus.pdf"
                download="Formulario-CUS.pdf"
                className="group flex items-center gap-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-5 py-4 font-semibold text-sm transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 flex-shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="flex-1 leading-snug">Formulario C.U.S.</span>
              </a>
            </div>

            {/* ── COL DERECHA: Formulario de contacto ── */}
            <div className="bg-school-blue rounded-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-white">
                  <svg className="w-5 h-5 text-school-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h2 className="text-white font-bold text-lg">Contáctanos!</h2>
                </div>
              </div>

              <div className="flex-1 px-6 py-5">
                <HomeContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CONTACTO RÁPIDO ── */}
      <section className="py-20 bg-school-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">¿Cómo llegar?</h2>
              <ul className="space-y-4 text-blue-100">
                {siteConfig?.address && (
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 shrink-0 text-school-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{siteConfig.address}</span>
                  </li>
                )}
                {siteConfig?.phone && (
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0 text-school-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${siteConfig.phone}`} className="hover:text-white">{siteConfig.phone}</a>
                  </li>
                )}
                {siteConfig?.email && (
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0 text-school-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${siteConfig.email}`} className="hover:text-white">{siteConfig.email}</a>
                  </li>
                )}
              </ul>
              <Link
                href="/contacto"
                className="mt-8 inline-block bg-school-gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Envianos un mensaje
              </Link>
            </div>

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden h-64 lg:h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.6!2d-64.1833!3d-31.3833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAsturias%201935%2C%20Barrio%20Col%C3%B3n%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del colegio"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

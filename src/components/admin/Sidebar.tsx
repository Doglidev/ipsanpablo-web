'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const GALLERY_CATEGORIES = [
  { label: 'Institucional', value: 'institucional' },
  { label: 'Pastoral', value: 'pastoral' },
  { label: 'Nivel Inicial', value: 'nivel-inicial' },
  { label: 'Nivel Primario', value: 'nivel-primario' },
  { label: 'Nivel Secundario', value: 'nivel-secundario' },
]

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Secciones',
    href: '/admin/secciones',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Noticias',
    href: '/admin/noticias',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    label: 'Configuración',
    href: '/admin/configuracion',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Usuarios',
    href: '/admin/usuarios',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
]

const GalleryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const Sidebar = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const userRole = (session?.user as { role?: string })?.role
  const isGalleryActive = pathname.startsWith('/admin/galeria')
  const [galleryOpen, setGalleryOpen] = useState(isGalleryActive)

  useEffect(() => {
    if (isGalleryActive) setGalleryOpen(true)
  }, [isGalleryActive])

  const activeCategory = searchParams.get('categoria') ?? 'all'

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-white font-bold text-sm leading-tight">
          Instituto San Pablo
          <span className="block text-gray-400 font-normal text-xs mt-0.5">Panel de Administración</span>
        </h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {/* Regular nav items */}
        {NAV_ITEMS.slice(0, 3).map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-school-blue text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}

        {/* Galería expandable */}
        <div>
          <button
            onClick={() => setGalleryOpen((v) => !v)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isGalleryActive
                ? 'bg-school-blue text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <GalleryIcon />
            <span className="flex-1 text-left">Galería</span>
            <svg
              className={`w-4 h-4 transition-transform ${galleryOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {galleryOpen && (
            <div className="mt-0.5 ml-3 pl-5 border-l border-gray-700 space-y-0.5">
              <Link
                href="/admin/galeria"
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isGalleryActive && activeCategory === 'all'
                    ? 'text-white bg-gray-700'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0" />
                Todas
              </Link>
              {GALLERY_CATEGORIES.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/admin/galeria?categoria=${cat.value}`}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isGalleryActive && activeCategory === cat.value
                      ? 'text-white bg-gray-700'
                      : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-school-gold flex-shrink-0" />
                  {cat.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Rest of nav items (Configuración + Usuarios) */}
        {NAV_ITEMS.slice(3)
          .filter((item) => item.href !== '/admin/usuarios' || userRole === 'ADMIN')
          .map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-school-blue text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white"
          target="_blank"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Ver sitio
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar

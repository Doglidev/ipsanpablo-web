import Image from 'next/image'
import Link from 'next/link'

interface Breadcrumb {
  label: string
  href: string
}

interface SectionHeroProps {
  title: string
  heroImage?: string | null
  breadcrumbs?: Breadcrumb[]
}

const SectionHero = ({ title, heroImage, breadcrumbs }: SectionHeroProps) => {
  return (
    <div className="relative bg-school-blue text-white">
      {heroImage && (
        <Image
          src={heroImage}
          alt={title}
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {breadcrumbs && (
          <nav className="flex items-center gap-2 text-sm text-blue-300 mb-4">
            <Link href="/" className="hover:text-white">Inicio</Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <span>/</span>
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-white">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-white">{crumb.label}</Link>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      </div>
    </div>
  )
}

export default SectionHero

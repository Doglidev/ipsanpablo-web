import Link from 'next/link'

const TABS = [
  { label: 'Inicial', href: '/niveles/inicial', key: 'inicial' },
  { label: 'Primario', href: '/niveles/primario', key: 'primario' },
  { label: 'Secundario', href: '/niveles/secundario', key: 'secundario' },
]

interface NivelesNavProps {
  active: 'inicial' | 'primario' | 'secundario'
}

const NivelesNav = ({ active }: NivelesNavProps) => {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`px-5 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
            active === tab.key
              ? 'border-school-blue text-school-blue bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-school-blue hover:bg-gray-50'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}

export default NivelesNav

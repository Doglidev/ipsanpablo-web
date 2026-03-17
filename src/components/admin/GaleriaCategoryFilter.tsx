'use client'

import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: 'all', label: 'Todas' },
  { value: 'institucional', label: 'Institucional' },
  { value: 'pastoral-info-general', label: 'Pastoral — Info General' },
  { value: 'pastoral-galeria', label: 'Pastoral — Galería' },
  { value: 'nivel-inicial', label: 'Nivel Inicial' },
  { value: 'nivel-primario', label: 'Nivel Primario' },
  { value: 'nivel-secundario', label: 'Nivel Secundario' },
  { value: 'pasantias-lugares', label: 'Pasantías — Lugares' },
]

interface GaleriaCategoryFilterProps {
  active: string
  counts: Record<string, number>
}

const GaleriaCategoryFilter = ({ active, counts }: GaleriaCategoryFilterProps) => {
  const router = useRouter()

  const total = Object.values(counts).reduce((s, n) => s + n, 0)

  const handleChange = (value: string) => {
    const params = new URLSearchParams()
    if (value !== 'all') params.set('categoria', value)
    router.push(`/admin/galeria${params.size ? `?${params}` : ''}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const count = cat.value === 'all' ? total : (counts[cat.value] ?? 0)
        const isActive = active === cat.value
        return (
          <button
            key={cat.value}
            onClick={() => handleChange(cat.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isActive
                ? 'bg-school-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
            <span className={`ml-1.5 ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default GaleriaCategoryFilter

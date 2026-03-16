'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleSectionVisibility } from '@/lib/actions/sections'

interface SectionVisibilityToggleProps {
  slug: string
  isVisible: boolean
}

const SectionVisibilityToggle = ({ slug, isVisible }: SectionVisibilityToggleProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = () => {
    startTransition(async () => {
      await toggleSectionVisibility(slug, !isVisible)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={isVisible ? 'Ocultar sección' : 'Mostrar sección'}
      className={`text-xs font-medium px-2 py-1 rounded border transition-colors disabled:opacity-50 ${
        isVisible
          ? 'border-green-200 text-green-600 bg-green-50 hover:bg-green-100'
          : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'
      }`}
    >
      {isVisible ? 'Visible' : 'Oculta'}
    </button>
  )
}

export default SectionVisibilityToggle

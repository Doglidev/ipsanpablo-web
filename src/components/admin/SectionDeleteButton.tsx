'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteSection } from '@/lib/actions/sections'

interface SectionDeleteButtonProps {
  slug: string
  title: string
}

const SectionDeleteButton = ({ slug, title }: SectionDeleteButtonProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (!window.confirm(`¿Eliminár la sección "${title}"? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      await deleteSection(slug)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-red-500 font-medium hover:underline px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? '...' : 'Eliminar'}
    </button>
  )
}

export default SectionDeleteButton

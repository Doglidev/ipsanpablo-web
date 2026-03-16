'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteNews } from '@/lib/actions/news'

interface NewsDeleteButtonProps {
  id: string
  title: string
}

const NewsDeleteButton = ({ id, title }: NewsDeleteButtonProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (!window.confirm(`¿Eliminar la noticia "${title}"? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      await deleteNews(id)
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

export default NewsDeleteButton

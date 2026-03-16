'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResult } from '@/types'

const createNewsSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  excerpt: z.string().min(1, 'El resumen es requerido').max(300),
})

const updateNewsSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(1).max(300),
  content: z.string().min(1),
  coverImage: z.string().url().optional().nullable(),
  isPublished: z.boolean(),
})

async function requireSession() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('No autorizado')
  return session
}

export async function createNews(_prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  let newId: string

  try {
    const session = await requireSession()

    const raw = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt') ?? '',
    }

    const parsed = createNewsSchema.safeParse(raw)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const exists = await prisma.newsArticle.findUnique({ where: { slug: parsed.data.slug } })
    if (exists) return { success: false, error: 'Ya existe una noticia con ese slug' }

    const article = await prisma.newsArticle.create({
      data: {
        ...parsed.data,
        content: JSON.stringify({ blocks: [] }),
        authorId: (session.user as { id: string }).id,
      },
    })

    newId = article.id
    revalidatePath('/admin/noticias')
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al crear la noticia' }
  }

  redirect(`/admin/noticias/${newId}`)
}

export async function updateNews(
  id: string,
  data: {
    title: string
    slug: string
    excerpt: string
    content: string
    coverImage?: string | null
    isPublished: boolean
  }
): Promise<ActionResult> {
  try {
    await requireSession()

    const parsed = updateNewsSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const existing = await prisma.newsArticle.findUnique({ where: { id } })
    if (!existing) return { success: false, error: 'Noticia no encontrada' }

    // If slug changed, check it's not taken by another article
    if (parsed.data.slug !== existing.slug) {
      const slugTaken = await prisma.newsArticle.findUnique({ where: { slug: parsed.data.slug } })
      if (slugTaken) return { success: false, error: 'Ya existe una noticia con ese slug' }
    }

    const publishedAt =
      parsed.data.isPublished && !existing.publishedAt ? new Date() : existing.publishedAt

    await prisma.newsArticle.update({
      where: { id },
      data: { ...parsed.data, publishedAt },
    })

    revalidatePath('/admin/noticias')
    revalidatePath(`/admin/noticias/${id}`)
    revalidatePath('/noticias')
    revalidatePath(`/noticias/${parsed.data.slug}`)

    return { success: true }
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al guardar la noticia' }
  }
}

export async function deleteNews(id: string): Promise<ActionResult> {
  try {
    await requireSession()
    await prisma.newsArticle.delete({ where: { id } })
    revalidatePath('/admin/noticias')
    return { success: true }
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al eliminar la noticia' }
  }
}

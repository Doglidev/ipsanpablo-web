'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResult } from '@/types'

const createSectionSchema = z.object({
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  title: z.string().min(1, 'El título es requerido'),
  pageGroup: z.string().min(1, 'El grupo es requerido'),
  sortOrder: z.coerce.number().int().default(0),
})

const updateSectionSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  content: z.string().min(1, 'El contenido es requerido'),
  pageGroup: z.string().min(1, 'El grupo es requerido'),
  sortOrder: z.coerce.number().int().default(0),
  isVisible: z.boolean().default(true),
  heroImage: z.string().url().optional().nullable(),
})

async function requireSession() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('No autorizado')
  return session
}

export async function createSection(_prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    await requireSession()

    const raw = {
      slug: formData.get('slug'),
      title: formData.get('title'),
      pageGroup: formData.get('pageGroup'),
      sortOrder: formData.get('sortOrder') ?? '0',
    }

    const parsed = createSectionSchema.safeParse(raw)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const exists = await prisma.section.findUnique({ where: { slug: parsed.data.slug } })
    if (exists) return { success: false, error: 'Ya existe una sección con ese slug' }

    await prisma.section.create({
      data: {
        ...parsed.data,
        content: JSON.stringify({ blocks: [] }),
      },
    })

    revalidatePath('/admin/secciones')
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al crear la sección' }
  }

  redirect(`/admin/secciones/${(formData.get('slug') as string)}`)
}

export async function updateSection(
  slug: string,
  data: {
    title: string
    content: string
    pageGroup: string
    sortOrder: number
    isVisible: boolean
    heroImage?: string | null
  }
): Promise<ActionResult> {
  try {
    await requireSession()

    const parsed = updateSectionSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    await prisma.section.update({
      where: { slug },
      data: parsed.data,
    })

    revalidatePath('/admin/secciones')
    revalidatePath(`/admin/secciones/${slug}`)
    revalidatePath(`/institucional/${slug}`)
    revalidatePath(`/niveles/${slug.replace('nivel-', '')}`)

    return { success: true }
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al guardar la sección' }
  }
}

export async function deleteSection(slug: string): Promise<ActionResult> {
  try {
    await requireSession()
    await prisma.section.delete({ where: { slug } })
    revalidatePath('/admin/secciones')
    return { success: true }
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al eliminar la sección' }
  }
}

export async function toggleSectionVisibility(slug: string, isVisible: boolean): Promise<ActionResult> {
  try {
    await requireSession()
    await prisma.section.update({ where: { slug }, data: { isVisible } })
    revalidatePath('/admin/secciones')
    return { success: true }
  } catch {
    return { success: false, error: 'Error al actualizar la visibilidad' }
  }
}

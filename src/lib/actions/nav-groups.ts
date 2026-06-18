'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireEditor, authErrorResult } from '@/lib/auth-guards'
import type { ActionResult } from '@/types'

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // saca acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}

const createSchema = z.object({
  label: z.string().min(1, 'El nombre es requerido').max(60),
  href: z.string().trim().max(200).optional().or(z.literal('')),
})

const updateSchema = z.object({
  label: z.string().min(1, 'El nombre es requerido').max(60),
  href: z.string().trim().max(200).optional().or(z.literal('')),
})

function revalidate() {
  revalidatePath('/', 'layout')
  revalidatePath('/admin/grupos')
}

export async function createNavGroup(formData: FormData): Promise<ActionResult> {
  try {
    await requireEditor()

    const parsed = createSchema.safeParse({
      label: formData.get('label'),
      href: formData.get('href') ?? '',
    })
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const slug = slugify(parsed.data.label)
    if (!slug) return { success: false, error: 'El nombre no es válido' }

    const exists = await prisma.navGroup.findUnique({ where: { slug } })
    if (exists) return { success: false, error: 'Ya existe un grupo con un nombre similar' }

    const last = await prisma.navGroup.findFirst({ orderBy: { sortOrder: 'desc' } })

    await prisma.navGroup.create({
      data: {
        slug,
        label: parsed.data.label.trim(),
        href: parsed.data.href ? parsed.data.href : null,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    })

    revalidate()
    return { success: true }
  } catch (e) {
    return authErrorResult(e) ?? { success: false, error: 'Error al crear el grupo' }
  }
}

export async function updateNavGroup(id: string, data: { label: string; href: string }): Promise<ActionResult> {
  try {
    await requireEditor()

    const parsed = updateSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    await prisma.navGroup.update({
      where: { id },
      data: {
        label: parsed.data.label.trim(),
        href: parsed.data.href ? parsed.data.href : null,
      },
    })

    revalidate()
    return { success: true }
  } catch (e) {
    return authErrorResult(e) ?? { success: false, error: 'Error al actualizar el grupo' }
  }
}

export async function toggleNavGroupVisibility(id: string, isVisible: boolean): Promise<ActionResult> {
  try {
    await requireEditor()
    await prisma.navGroup.update({ where: { id }, data: { isVisible } })
    revalidate()
    return { success: true }
  } catch (e) {
    return authErrorResult(e) ?? { success: false, error: 'Error al cambiar la visibilidad' }
  }
}

export async function deleteNavGroup(id: string): Promise<ActionResult> {
  try {
    await requireEditor()

    const group = await prisma.navGroup.findUnique({ where: { id } })
    if (!group) return { success: false, error: 'Grupo no encontrado' }

    const sectionCount = await prisma.section.count({ where: { pageGroup: group.slug } })
    if (sectionCount > 0) {
      return {
        success: false,
        error: `El grupo tiene ${sectionCount} sección(es) asociada(s). Reasignalas o eliminalas antes de borrar el grupo.`,
      }
    }

    await prisma.navGroup.delete({ where: { id } })
    revalidate()
    return { success: true }
  } catch (e) {
    return authErrorResult(e) ?? { success: false, error: 'Error al eliminar el grupo' }
  }
}

/** Mueve un grupo una posición arriba/abajo intercambiando el sortOrder con su vecino. */
export async function moveNavGroup(id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  try {
    await requireEditor()

    const current = await prisma.navGroup.findUnique({ where: { id } })
    if (!current) return { success: false, error: 'Grupo no encontrado' }

    const neighbor = await prisma.navGroup.findFirst({
      where:
        direction === 'up'
          ? { sortOrder: { lt: current.sortOrder } }
          : { sortOrder: { gt: current.sortOrder } },
      orderBy: { sortOrder: direction === 'up' ? 'desc' : 'asc' },
    })
    if (!neighbor) return { success: true } // ya está en el extremo

    await prisma.$transaction([
      prisma.navGroup.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
      prisma.navGroup.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
    ])

    revalidate()
    return { success: true }
  } catch (e) {
    return authErrorResult(e) ?? { success: false, error: 'Error al reordenar' }
  }
}

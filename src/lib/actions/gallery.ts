'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'
import { VALID_ALBUMS } from '@/lib/gallery-sections'
import type { ActionResult } from '@/types'

const uploadSchema = z.object({
  caption: z.string().max(200).optional(),
  album: z.enum(VALID_ALBUMS),
})

const updateSchema = z.object({
  caption: z.string().max(200).optional(),
  album: z.enum(VALID_ALBUMS),
})

async function requireSession() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('No autorizado')
  return session
}

function revalidateAll() {
  revalidatePath('/admin/galeria')
  revalidatePath('/institucional/nuestra-escuela')
  revalidatePath('/institucional/galeria')
  revalidatePath('/niveles/inicial')
  revalidatePath('/niveles/primario')
  revalidatePath('/niveles/secundario')
  revalidatePath('/pastoral/info')
  revalidatePath('/pastoral/galeria')
  revalidatePath('/pasantias/lugares')
}

export async function uploadGalleryImage(formData: FormData): Promise<ActionResult> {
  try {
    await requireSession()

    const file = formData.get('file') as File | null
    if (!file || file.size === 0) {
      return { success: false, error: 'No se seleccionó ningún archivo' }
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'El archivo debe ser una imagen' }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'La imagen no puede superar los 5 MB' }
    }

    const meta = uploadSchema.safeParse({
      caption: formData.get('caption') || undefined,
      album: formData.get('album') ?? '',
    })
    if (!meta.success) {
      return { success: false, error: meta.error.issues[0].message }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const { url, publicId } = await uploadToCloudinary(buffer, 'ipsanpablo/galeria')

    await prisma.galleryImage.create({
      data: {
        url,
        publicId,
        caption: meta.data.caption ?? null,
        album: meta.data.album,
        category: meta.data.album,
      },
    })

    revalidateAll()
    return { success: true }
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    console.error('uploadGalleryImage error:', e)
    return { success: false, error: 'Error al subir la imagen' }
  }
}

export async function updateGalleryImage(
  id: string,
  data: { caption?: string; album: string }
): Promise<ActionResult> {
  try {
    await requireSession()

    const parsed = updateSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    await prisma.galleryImage.update({
      where: { id },
      data: {
        caption: parsed.data.caption ?? null,
        album: parsed.data.album,
        category: parsed.data.album,
      },
    })

    revalidateAll()
    return { success: true }
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al actualizar la imagen' }
  }
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  try {
    await requireSession()

    const image = await prisma.galleryImage.findUnique({ where: { id } })
    if (!image) return { success: false, error: 'Imagen no encontrada' }

    await deleteFromCloudinary(image.publicId)
    await prisma.galleryImage.delete({ where: { id } })

    revalidateAll()
    return { success: true }
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al eliminar la imagen' }
  }
}

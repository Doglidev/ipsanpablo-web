'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'
import type { ActionResult } from '@/types'

const VALID_CATEGORIES = [
  'institucional',
  'pastoral-info-general',
  'pastoral-galeria',
  'nivel-inicial',
  'nivel-primario',
  'nivel-secundario',
  'pasantias-lugares',
] as const

const imageMetaSchema = z.object({
  caption: z.string().max(200).optional(),
  album: z.string().min(1, 'El álbum es requerido').max(80),
  category: z.enum(VALID_CATEGORIES).default('institucional'),
})

async function requireSession() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('No autorizado')
  return session
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

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'La imagen no puede superar los 10 MB' }
    }

    const meta = imageMetaSchema.safeParse({
      caption: formData.get('caption') ?? undefined,
      album: formData.get('album') ?? '',
      category: formData.get('category') ?? 'institucional',
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
        category: meta.data.category,
      },
    })

    revalidatePath('/admin/galeria')
    revalidatePath('/institucional/galeria')
    revalidatePath('/niveles/inicial')
    revalidatePath('/niveles/primario')
    revalidatePath('/niveles/secundario')
    revalidatePath('/pastoral/info')
    revalidatePath('/pastoral/galeria')
    revalidatePath('/pasantias/lugares')
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
  data: { caption?: string; album: string; category: string }
): Promise<ActionResult> {
  try {
    await requireSession()

    const parsed = imageMetaSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    await prisma.galleryImage.update({
      where: { id },
      data: {
        caption: parsed.data.caption ?? null,
        album: parsed.data.album,
        category: parsed.data.category,
      },
    })

    revalidatePath('/admin/galeria')
    revalidatePath('/institucional/galeria')
    revalidatePath('/niveles/inicial')
    revalidatePath('/niveles/primario')
    revalidatePath('/niveles/secundario')
    revalidatePath('/pastoral/info')
    revalidatePath('/pastoral/galeria')
    revalidatePath('/pasantias/lugares')
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

    revalidatePath('/admin/galeria')
    revalidatePath('/institucional/galeria')
    return { success: true }
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al eliminar la imagen' }
  }
}

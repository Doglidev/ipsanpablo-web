'use server'

import { uploadToCloudinary } from '@/lib/cloudinary'
import { requireEditor, authErrorResult } from '@/lib/auth-guards'

export async function uploadBlockImage(
  formData: FormData
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    await requireEditor()

    const file = formData.get('file') as File | null
    if (!file || file.size === 0) return { success: false, error: 'No se seleccionó ningún archivo' }
    if (!file.type.startsWith('image/')) return { success: false, error: 'El archivo debe ser una imagen' }
    if (file.size > 5 * 1024 * 1024) return { success: false, error: 'La imagen no puede superar los 5 MB' }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const { url } = await uploadToCloudinary(buffer, 'ipsanpablo/contenido')

    return { success: true, url }
  } catch (e) {
    return authErrorResult(e) ?? { success: false, error: 'Error al subir la imagen' }
  }
}

'use server'

import { uploadRawToCloudinary } from '@/lib/cloudinary'
import { requireEditor, authErrorResult } from '@/lib/auth-guards'

export async function uploadPdf(
  formData: FormData
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    await requireEditor()

    const file = formData.get('file') as File | null
    if (!file || file.size === 0) return { success: false, error: 'No se seleccionó ningún archivo' }
    if (file.type !== 'application/pdf') return { success: false, error: 'El archivo debe ser un PDF' }
    if (file.size > 10 * 1024 * 1024) return { success: false, error: 'El PDF no puede superar los 10 MB' }

    const bytes = await file.arrayBuffer()
    const { url } = await uploadRawToCloudinary(Buffer.from(bytes), 'ipsanpablo/documentos')

    return { success: true, url }
  } catch (e) {
    return authErrorResult(e) ?? { success: false, error: 'Error al guardar el archivo' }
  }
}

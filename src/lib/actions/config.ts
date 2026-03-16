'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { siteConfigSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types'

export async function updateConfig(formData: FormData): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return { success: false, error: 'No autorizado' }

    const raw = {
      schoolName: formData.get('schoolName') ?? '',
      phone: formData.get('phone') ?? '',
      email: formData.get('email') ?? '',
      address: formData.get('address') ?? '',
      logoUrl: formData.get('logoUrl') || null,
      heroTitle: formData.get('heroTitle') ?? '',
      heroSubtitle: formData.get('heroSubtitle') ?? '',
      heroImageUrl: formData.get('heroImageUrl') || null,
      facebookUrl: formData.get('facebookUrl') || null,
      instagramUrl: formData.get('instagramUrl') || null,
      whatsappNumber: formData.get('whatsappNumber') || null,
      inscripcionOpen: formData.get('inscripcionOpen') === 'true',
      inscripcionText: formData.get('inscripcionText') ?? '',
    }

    const parsed = siteConfigSchema.safeParse(raw)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    await prisma.siteConfig.upsert({
      where: { id: 'main' },
      update: parsed.data,
      create: { id: 'main', ...parsed.data },
    })

    revalidatePath('/')
    revalidatePath('/admin/configuracion')
    return { success: true }
  } catch {
    return { success: false, error: 'Error al guardar la configuración' }
  }
}

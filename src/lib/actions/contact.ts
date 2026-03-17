'use server'

import { z } from 'zod'
import type { ActionResult } from '@/types'

const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

export async function sendContactForm(formData: FormData): Promise<ActionResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') ?? undefined,
    subject: formData.get('subject') ?? undefined,
    message: formData.get('message'),
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }
  // Log for now — replace with email service later
  console.log('[Contacto]', parsed.data)
  return { success: true }
}

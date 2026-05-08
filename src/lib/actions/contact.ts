'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import type { ActionResult } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

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

  const { name, email, phone, subject, message } = parsed.data
  const destinatario = process.env.CONTACT_EMAIL ?? 'secretaria@ipsanpablo.com'

  const { error } = await resend.emails.send({
    from: 'Instituto San Pablo <onboarding@resend.dev>',
    to: destinatario,
    replyTo: email,
    subject: subject ? `Contacto: ${subject}` : `Nuevo mensaje de contacto de ${name}`,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
      ${subject ? `<p><strong>Asunto:</strong> ${subject}</p>` : ''}
      <p><strong>Mensaje:</strong></p>
      <p style="white-space: pre-wrap;">${message}</p>
    `,
  })

  if (error) {
    console.error('[Contacto] Error al enviar email:', error)
    return { success: false, error: 'No se pudo enviar el mensaje. Intentá de nuevo más tarde.' }
  }

  return { success: true }
}

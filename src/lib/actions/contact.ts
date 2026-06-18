'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { escapeHtml } from '@/lib/escape-html'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
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
  // Honeypot: campo oculto que solo completan los bots. Se usa un nombre neutro
  // (no "website"/"url"/"email") para que el autocompletado del navegador no lo
  // complete por error y descarte un mensaje legítimo.
  if (formData.get('hp_field')) {
    console.warn('[contacto] descartado por honeypot')
    return { success: true } // fingimos éxito para no dar pistas al bot
  }

  // Rate limit: máx. 5 envíos cada 10 minutos por IP.
  const ip = await getClientIp()
  const { allowed } = await rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 })
  if (!allowed) {
    return { success: false, error: 'Demasiados envíos. Esperá unos minutos e intentá de nuevo.' }
  }

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
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>` : ''}
      ${subject ? `<p><strong>Asunto:</strong> ${escapeHtml(subject)}</p>` : ''}
      <p><strong>Mensaje:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    `,
  })

  if (error) {
    console.error('[Contacto] Error al enviar email:', error)
    return { success: false, error: 'No se pudo enviar el mensaje. Intentá de nuevo más tarde.' }
  }

  return { success: true }
}

'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import type { ActionResult } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

const cuotasSchema = z.object({
  alumnoNombre: z.string().min(2, 'El nombre y apellido es requerido'),
  email: z.string().email('Ingresá un email válido'),
  cuotas: z.array(z.string()).min(1, 'Seleccioná al menos una cuota'),
  fechaPago: z.string().min(1, 'La fecha de pago es requerida'),
  comentarios: z.string().max(500).optional(),
})

export async function submitActualizacionCuotas(formData: FormData): Promise<ActionResult> {
  const cuotas = formData.getAll('cuotas').map(String)

  const parsed = cuotasSchema.safeParse({
    alumnoNombre: formData.get('alumnoNombre'),
    email: formData.get('email'),
    cuotas,
    fechaPago: formData.get('fechaPago'),
    comentarios: formData.get('comentarios') ?? undefined,
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { alumnoNombre, email, fechaPago, comentarios } = parsed.data
  const destinatario = process.env.CONTACT_EMAIL ?? 'secretaria@ipsanpablo.com'

  const { error } = await resend.emails.send({
    from: 'Instituto San Pablo <onboarding@resend.dev>',
    to: destinatario,
    replyTo: email,
    subject: `Actualización de cuotas - ${alumnoNombre}`,
    html: `
      <h2>Solicitud de actualización de cuotas</h2>
      <p><strong>Alumno:</strong> ${alumnoNombre}</p>
      <p><strong>Email de contacto:</strong> ${email}</p>
      <p><strong>Cuota/s a actualizar:</strong> ${cuotas.join(', ')}</p>
      <p><strong>Fecha de pago:</strong> ${fechaPago}</p>
      ${comentarios ? `<p><strong>Comentarios:</strong></p><p style="white-space: pre-wrap;">${comentarios}</p>` : ''}
    `,
  })

  if (error) {
    console.error('[Cuotas] Error al enviar email:', error)
    return { success: false, error: 'No se pudo enviar la solicitud. Intentá de nuevo más tarde.' }
  }

  return { success: true }
}

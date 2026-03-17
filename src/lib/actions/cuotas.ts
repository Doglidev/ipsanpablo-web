'use server'

import { z } from 'zod'
import type { ActionResult } from '@/types'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

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

  // Log — reemplazar por envío de email cuando esté disponible
  console.log('[Actualización de Cuotas]', {
    alumno: parsed.data.alumnoNombre,
    email: parsed.data.email,
    cuotas: parsed.data.cuotas.join(', '),
    fechaPago: parsed.data.fechaPago,
    comentarios: parsed.data.comentarios ?? '—',
  })

  return { success: true }
}

export { MESES }

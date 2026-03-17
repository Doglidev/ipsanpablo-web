'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResult } from '@/types'

// ── Helpers ──────────────────────────────────────────────

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== 'ADMIN') {
    throw new Error('No autorizado')
  }
  return session
}

// ── Schemas ───────────────────────────────────────────────

const createUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
}).refine((d) => {
  if (d.password && d.password !== d.confirmPassword) return false
  return true
}, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// ── Actions ───────────────────────────────────────────────

export async function createUser(formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const currentUserId = (session.user as { id: string }).id

    const parsed = createUserSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      role: formData.get('role'),
    })

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (existing) {
      return { success: false, error: 'Ya existe un usuario con ese email' }
    }

    const hashed = await bcrypt.hash(parsed.data.password, 12)
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashed,
        role: parsed.data.role,
      },
    })

    revalidatePath('/admin/usuarios')
    return { success: true }
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al crear el usuario' }
  }
}

export async function updateUser(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const currentUserId = (session.user as { id: string }).id

    const parsed = updateUserSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password') || undefined,
      confirmPassword: formData.get('confirmPassword') || undefined,
      role: formData.get('role'),
    })

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const target = await prisma.user.findUnique({ where: { id } })
    if (!target) return { success: false, error: 'Usuario no encontrado' }

    // No permitir degradar el único ADMIN
    if (target.role === 'ADMIN' && parsed.data.role !== 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
      if (adminCount <= 1) {
        return { success: false, error: 'No podés degradar al único administrador del sistema' }
      }
    }

    // No permitir que el usuario actual cambie su propio rol
    if (id === currentUserId && parsed.data.role !== target.role) {
      return { success: false, error: 'No podés cambiar tu propio rol' }
    }

    // Verificar email único si cambia
    if (parsed.data.email !== target.email) {
      const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
      if (existing) return { success: false, error: 'Ya existe un usuario con ese email' }
    }

    const updateData: { name: string; email: string; role: 'ADMIN' | 'EDITOR' | 'VIEWER'; password?: string } = {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
    }

    if (parsed.data.password) {
      updateData.password = await bcrypt.hash(parsed.data.password, 12)
    }

    await prisma.user.update({ where: { id }, data: updateData })

    revalidatePath('/admin/usuarios')
    return { success: true }
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al actualizar el usuario' }
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    const session = await requireAdmin()
    const currentUserId = (session.user as { id: string }).id

    if (id === currentUserId) {
      return { success: false, error: 'No podés eliminar tu propio usuario' }
    }

    const target = await prisma.user.findUnique({ where: { id } })
    if (!target) return { success: false, error: 'Usuario no encontrado' }

    if (target.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
      if (adminCount <= 1) {
        return { success: false, error: 'No podés eliminar al único administrador del sistema' }
      }
    }

    await prisma.user.delete({ where: { id } })
    revalidatePath('/admin/usuarios')
    return { success: true }
  } catch (e) {
    if (e instanceof Error && e.message === 'No autorizado') {
      return { success: false, error: 'No autorizado' }
    }
    return { success: false, error: 'Error al eliminar el usuario' }
  }
}

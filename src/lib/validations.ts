import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const sectionSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  content: z.string().min(1, 'El contenido es requerido'),
  pageGroup: z.string().min(1, 'El grupo de página es requerido'),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  heroImage: z.string().url().optional().nullable(),
})

export const newsArticleSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  slug: z.string().min(1, 'El slug es requerido').regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  excerpt: z.string().min(1, 'El resumen es requerido').max(300, 'El resumen no puede superar los 300 caracteres'),
  content: z.string().min(1, 'El contenido es requerido'),
  coverImage: z.string().url().optional().nullable(),
  isPublished: z.boolean().default(false),
})

export const siteConfigSchema = z.object({
  schoolName: z.string().min(1, 'El nombre del colegio es requerido'),
  phone: z.string().default(''),
  email: z.string().email('Email inválido').or(z.literal('')),
  address: z.string().default(''),
  logoUrl: z.string().url().optional().nullable(),
  heroTitle: z.string().default(''),
  heroSubtitle: z.string().default(''),
  heroImageUrl: z.string().url().optional().nullable(),
  facebookUrl: z.string().url().optional().nullable(),
  instagramUrl: z.string().url().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  inscripcionOpen: z.boolean().default(false),
  inscripcionText: z.string().default(''),
})

export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  name: z.string().min(1, 'El nombre es requerido'),
  role: z.enum(['ADMIN', 'EDITOR']).default('EDITOR'),
})

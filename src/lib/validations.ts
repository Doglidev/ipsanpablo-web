import { z } from 'zod'

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

# CLAUDE.md — Instituto Parroquial San Pablo Apóstol

## Proyecto
Sitio web institucional + dashboard de administración para un colegio privado en Córdoba, Argentina.

## Tech Stack
- **Framework**: Next.js 14+ con App Router (NO Pages Router)
- **Lenguaje**: TypeScript (strict mode)
- **Estilos**: Tailwind CSS
- **Base de datos**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js (Auth.js) con Credentials provider
- **Imágenes**: Cloudinary
- **Validación**: Zod
- **Deploy**: VPS con Nginx + PM2

## Estructura del proyecto
```
src/
├── app/
│   ├── (public)/      → Rutas del sitio público
│   ├── (admin)/admin/ → Rutas del dashboard
│   ├── api/           → Route handlers
│   └── layout.tsx
├── components/
│   ├── public/        → Componentes del sitio público
│   ├── admin/         → Componentes del dashboard
│   └── ui/            → Componentes genéricos
├── lib/
│   ├── prisma.ts      → Instancia de Prisma (singleton)
│   ├── auth.ts        → Configuración de NextAuth
│   ├── cloudinary.ts  → Helper de Cloudinary
│   └── validations.ts → Schemas de Zod
├── types/
│   └── index.ts       → Tipos compartidos
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

## Convenciones

### General
- Idioma del código: inglés (variables, funciones, componentes)
- Idioma del contenido/UI: español
- Usar Server Components por defecto, "use client" solo cuando hace falta interactividad
- Imports absolutos con alias `@/` → `src/`
- NO usar `any` — definir tipos explícitos

### Componentes
- Funcionales con arrow functions y export default
- Props tipadas con interface (no type)
- Nombre en PascalCase
- Un componente por archivo

### API Routes
- Siempre validar input con Zod antes de procesar
- Siempre verificar sesión de NextAuth en rutas protegidas
- Respuestas de error: `NextResponse.json({ error: "mensaje" }, { status: 4xx })`
- Respuestas exitosas: `NextResponse.json(data)` o `NextResponse.json({ success: true })`

### Base de datos
- Usar Prisma Client singleton (`lib/prisma.ts`)
- Migraciones con `npx prisma migrate dev --name descripcion`
- Seed con `npx prisma db seed`
- NO usar raw queries salvo que sea estrictamente necesario

### Estilos
- Tailwind utility classes, NO CSS custom salvo excepciones justificadas
- Mobile first: arrancar sin prefijos, agregar md: lg: xl: para desktop
- Colores del tema definidos en `tailwind.config.ts` bajo `extend.colors`
- NO usar !important

## Patrones obligatorios

### Instancia de Prisma (lib/prisma.ts)
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Protección de API routes
```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  // ... resto de la lógica
}
```

### Validación con Zod
```typescript
import { z } from "zod"

const schema = z.object({
  title: z.string().min(1, "El título es requerido"),
  content: z.string(),
})

const body = await req.json()
const result = schema.safeParse(body)
if (!result.success) {
  return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
}
// Usar result.data (tipado automáticamente)
```

## Lo que NO debes hacer
- NO generar páginas estáticas con getStaticProps/getStaticPaths (eso es Pages Router)
- NO usar `fetch` para llamar a tus propias API routes desde Server Components — acceder a Prisma directamente
- NO guardar imágenes en el filesystem del servidor — siempre Cloudinary
- NO crear endpoints de API sin validación de input
- NO hardcodear textos del sitio — todo viene de la base de datos

## Specs
Las especificaciones por feature están en `/specs/`. Leer la spec COMPLETA antes de implementar cualquier feature.

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ipsanpablo.com' },
    update: {},
    create: {
      email: 'admin@ipsanpablo.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', admin.email)

  // Site config
  await prisma.siteConfig.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      schoolName: 'Instituto Parroquial San Pablo Apóstol',
      phone: '(0351) 000-0000',
      email: 'secretaria@ipsanpablo.com',
      address: 'Asturias 1935, Barrio Colón, Córdoba',
      heroTitle: 'Instituto Parroquial San Pablo Apóstol',
      heroSubtitle: 'Educación con valores desde 1959',
      inscripcionOpen: false,
      inscripcionText: 'Las inscripciones para el ciclo lectivo están abiertas.',
    },
  })
  console.log('Created site config')

  // Base sections
  const sections = [
    {
      slug: 'nuestra-escuela',
      title: 'Nuestra Escuela',
      pageGroup: 'institucional',
      sortOrder: 0,
      content: JSON.stringify({
        blocks: [
          {
            id: 'block_1',
            type: 'heading',
            data: { text: 'Nuestra Historia', level: 2 },
          },
          {
            id: 'block_2',
            type: 'paragraph',
            data: {
              text: 'El Instituto Parroquial San Pablo Apóstol fue fundado en 1959 con el objetivo de brindar educación de calidad con valores cristianos en el corazón del Barrio Colón, Córdoba.',
            },
          },
        ],
      }),
    },
    {
      slug: 'autoridades',
      title: 'Autoridades',
      pageGroup: 'institucional',
      sortOrder: 1,
      content: JSON.stringify({
        blocks: [
          {
            id: 'block_1',
            type: 'heading',
            data: { text: 'Equipo Directivo', level: 2 },
          },
          {
            id: 'block_2',
            type: 'paragraph',
            data: { text: 'Contenido a completar.' },
          },
        ],
      }),
    },
    {
      slug: 'nivel-inicial',
      title: 'Nivel Inicial',
      pageGroup: 'niveles',
      sortOrder: 0,
      content: JSON.stringify({
        blocks: [
          {
            id: 'block_1',
            type: 'heading',
            data: { text: 'Nivel Inicial', level: 2 },
          },
          {
            id: 'block_2',
            type: 'paragraph',
            data: { text: 'Contenido a completar.' },
          },
        ],
      }),
    },
    {
      slug: 'nivel-primario',
      title: 'Nivel Primario',
      pageGroup: 'niveles',
      sortOrder: 1,
      content: JSON.stringify({
        blocks: [
          {
            id: 'block_1',
            type: 'heading',
            data: { text: 'Nivel Primario', level: 2 },
          },
          {
            id: 'block_2',
            type: 'paragraph',
            data: { text: 'Contenido a completar.' },
          },
        ],
      }),
    },
    {
      slug: 'nivel-secundario',
      title: 'Nivel Secundario',
      pageGroup: 'niveles',
      sortOrder: 2,
      content: JSON.stringify({
        blocks: [
          {
            id: 'block_1',
            type: 'heading',
            data: { text: 'Nivel Secundario', level: 2 },
          },
          {
            id: 'block_2',
            type: 'paragraph',
            data: { text: 'Contenido a completar.' },
          },
        ],
      }),
    },
    {
      slug: 'becas',
      title: 'Becas',
      pageGroup: 'becas',
      sortOrder: 0,
      content: JSON.stringify({
        blocks: [
          {
            id: 'block_1',
            type: 'heading',
            data: { text: 'Becas', level: 2 },
          },
          {
            id: 'block_2',
            type: 'paragraph',
            data: { text: 'Contenido a completar.' },
          },
        ],
      }),
    },
    {
      slug: 'pasantias-objetivo',
      title: 'Pasantías — Objetivo',
      pageGroup: 'pasantias',
      sortOrder: 0,
      content: JSON.stringify({
        blocks: [
          {
            id: 'block_1',
            type: 'heading',
            data: { text: 'Objetivo de las Pasantías', level: 2 },
          },
          {
            id: 'block_2',
            type: 'paragraph',
            data: { text: 'Contenido a completar.' },
          },
        ],
      }),
    },
    {
      slug: 'pastoral-info',
      title: 'Pastoral',
      pageGroup: 'pastoral',
      sortOrder: 0,
      content: JSON.stringify({
        blocks: [
          {
            id: 'block_1',
            type: 'heading',
            data: { text: 'Pastoral', level: 2 },
          },
          {
            id: 'block_2',
            type: 'paragraph',
            data: { text: 'Contenido a completar.' },
          },
        ],
      }),
    },
  ]

  for (const section of sections) {
    await prisma.section.upsert({
      where: { slug: section.slug },
      update: {},
      create: section,
    })
  }
  console.log('Created base sections')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

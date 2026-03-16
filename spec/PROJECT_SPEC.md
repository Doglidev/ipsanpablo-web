# SPEC: Instituto Parroquial San Pablo Apóstol — Sitio Web + Dashboard

> Versión: 1.0
> Fecha: 16/03/2026
> Autor: Mateo Dogliani — Desarrollador Full Stack
> Estado: Borrador para revisión

---

## 1. Resumen del Proyecto

### Contexto
El Instituto Parroquial San Pablo Apóstol es un colegio privado fundado en 1959, ubicado en Asturias 1935, Barrio Colón, Córdoba Capital. Ofrece los niveles Inicial, Primario y Secundario.

Actualmente cuenta con un sitio web estático (SPA con hash routing) que presenta información institucional pero carece de un sistema de administración para que el personal del colegio actualice el contenido.

### Objetivo
Desarrollar un sitio web moderno y responsivo, acompañado de un dashboard de administración que permita al personal del colegio gestionar el contenido sin necesidad de conocimientos técnicos.

### Alcance
- Sitio web público (lo que ven padres, alumnos y visitantes)
- Dashboard de administración (lo que usa el personal del colegio)
- Sistema de autenticación para el dashboard
- Base de datos para almacenar contenido dinámico

---

## 2. Tech Stack

| Capa               | Tecnología                | Justificación                                                                 |
|---------------------|--------------------------|-------------------------------------------------------------------------------|
| Frontend            | Next.js 14+ (App Router) | SSR/SSG para SEO, React para UI reactiva, familiaridad del desarrollador      |
| Estilos             | Tailwind CSS             | Utilidad-first, responsive rápido, consistencia visual                        |
| Base de datos       | PostgreSQL               | Relacional, robusto, gratuito, familiaridad del desarrollador                 |
| ORM                 | Prisma                   | Type-safe, migraciones automáticas, familiaridad del desarrollador            |
| Autenticación       | NextAuth.js (Auth.js)    | Integración nativa con Next.js, providers configurables                       |
| Almacenamiento imgs | Cloudinary (free tier)   | CDN global, transformaciones on-the-fly, 25GB gratis                          |
| Despliegue          | VPS (Linux)              | Control total, experiencia previa del desarrollador con Nginx + PM2           |

### Nota sobre decisiones técnicas
- **¿Por qué no un CMS headless?** Se busca máximo aprendizaje y control total del código. Un CMS headless resuelve el dashboard "gratis" pero es una caja negra. Construirlo enseña autenticación, CRUD, manejo de archivos, roles — todo aplicable a futuros proyectos.
- **¿Por qué no Vercel para deploy?** El colegio probablemente necesite un costo mensual predecible y bajo. Un VPS de ~$5-10 USD/mes es más económico a largo plazo que Vercel Pro si el tráfico crece.

---

## 3. Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│                    NEXT.JS APP                       │
│                                                     │
│  ┌──────────────────┐    ┌───────────────────────┐  │
│  │   Sitio Público   │    │   Dashboard (/admin)  │  │
│  │                   │    │                       │  │
│  │  / (home)         │    │  /admin/dashboard     │  │
│  │  /institucional   │    │  /admin/paginas       │  │
│  │  /niveles         │    │  /admin/secciones     │  │
│  │  /becas           │    │  /admin/galeria       │  │
│  │  /pasantias       │    │  /admin/noticias      │  │
│  │  /secretarias     │    │  /admin/configuracion │  │
│  │  /pastoral        │    │  /admin/usuarios      │  │
│  │  /noticias        │    │                       │  │
│  │  /contacto        │    │                       │  │
│  └──────────────────┘    └───────────────────────┘  │
│                                                     │
│              ┌─────────────────────┐                │
│              │    API Routes       │                │
│              │  /api/auth          │                │
│              │  /api/pages         │                │
│              │  /api/sections      │                │
│              │  /api/gallery       │                │
│              │  /api/news          │                │
│              │  /api/upload        │                │
│              └─────────┬───────────┘                │
│                        │                            │
│              ┌─────────▼───────────┐                │
│              │  Prisma ORM         │                │
│              └─────────┬───────────┘                │
│                        │                            │
└────────────────────────┼────────────────────────────┘
                         │
              ┌──────────▼──────────┐    ┌────────────────┐
              │    PostgreSQL       │    │   Cloudinary   │
              │    (Base de datos)  │    │   (Imágenes)   │
              └─────────────────────┘    └────────────────┘
```

### Principio clave de la arquitectura
Todo vive dentro de UN solo proyecto Next.js. El sitio público y el dashboard son solo rutas distintas dentro de la misma app. Esto simplifica el deploy, el desarrollo y el mantenimiento. No son dos proyectos separados.

---

## 4. Base de Datos — Modelos Prisma

### 4.1 Usuario (para el dashboard)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hash con bcrypt
  name      String
  role      Role     @default(EDITOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  newsArticles NewsArticle[]
}

enum Role {
  ADMIN    // Puede gestionar usuarios y todo el contenido
  EDITOR   // Puede editar contenido pero no gestionar usuarios
}
```

**Decisión de diseño — ¿Por qué solo 2 roles?**
En un colegio chico, la realidad es que 1-3 personas van a usar el dashboard. No necesitás un sistema de permisos granular tipo SIGI. ADMIN para el que maneja todo (probablemente el responsable de comunicación) y EDITOR para quien solo carga contenido. Si algún día necesitan más, se puede ampliar sin romper nada.

### 4.2 Sección (contenido de las páginas)

```prisma
model Section {
  id        String   @id @default(cuid())
  slug      String   @unique  // ej: "nuestra-escuela", "nivel-inicial"
  title     String
  content   String   @db.Text  // Contenido en formato JSON (bloques editables)
  pageGroup String   // ej: "institucional", "niveles", "pasantias"
  sortOrder Int      @default(0)
  isVisible Boolean  @default(true)
  heroImage String?  // URL de Cloudinary
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**¿Por qué `content` es JSON y no HTML plano?**
Porque vamos a usar un editor de bloques en el dashboard (tipo Notion/WordPress Gutenberg). Cada "bloque" es un objeto JSON: un párrafo, una imagen, un título, una lista. Esto permite:
- Renderizar el contenido de forma segura (sin inyección de HTML malicioso)
- Reordenar bloques con drag & drop en el dashboard
- Aplicar estilos consistentes desde el frontend

### 4.3 Imagen de galería

```prisma
model GalleryImage {
  id          String   @id @default(cuid())
  url         String   // URL de Cloudinary
  publicId    String   // ID de Cloudinary (para poder eliminar)
  caption     String?
  album       String   // ej: "actos-2026", "pastoral", "egresados-2025"
  sortOrder   Int      @default(0)
  uploadedAt  DateTime @default(now())
}
```

### 4.4 Noticia / Evento

```prisma
model NewsArticle {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String    // Resumen corto para la tarjeta
  content     String    @db.Text  // JSON de bloques (mismo formato que Section)
  coverImage  String?   // URL de Cloudinary
  isPublished Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relación
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
}
```

### 4.5 Configuración global del sitio

```prisma
model SiteConfig {
  id              String  @id @default("main") // Siempre hay un solo registro
  schoolName      String  @default("Instituto Parroquial San Pablo Apóstol")
  phone           String  @default("")
  email           String  @default("")
  address         String  @default("")
  logoUrl         String?
  heroTitle       String  @default("")
  heroSubtitle    String  @default("")
  heroImageUrl    String?
  facebookUrl     String?
  instagramUrl    String?
  whatsappNumber  String?
  inscripcionOpen Boolean @default(false)
  inscripcionText String  @default("")
}
```

**¿Por qué un modelo para config?**
Porque el colegio va a querer cambiar cosas como el teléfono, el texto del hero, o abrir/cerrar inscripciones sin llamarte. Con esto, lo hacen desde el dashboard.

---

## 5. Sitio Público — Páginas y Rutas

### 5.1 Estructura de rutas

```
app/
├── (public)/              ← Layout público (navbar + footer)
│   ├── page.tsx           ← Home (/)
│   ├── institucional/
│   │   ├── nuestra-escuela/page.tsx
│   │   ├── autoridades/page.tsx
│   │   └── galeria/page.tsx
│   ├── niveles/
│   │   ├── inicial/page.tsx
│   │   ├── primario/page.tsx
│   │   └── secundario/page.tsx
│   ├── becas/page.tsx
│   ├── pasantias/
│   │   ├── objetivo/page.tsx
│   │   ├── espacios-curriculares/page.tsx
│   │   ├── lugares/page.tsx
│   │   └── monitoreo/page.tsx
│   ├── secretarias/
│   │   ├── inicial-primario/page.tsx
│   │   └── secundario/page.tsx
│   ├── pastoral/
│   │   ├── info/page.tsx
│   │   └── galeria/page.tsx
│   ├── noticias/
│   │   ├── page.tsx           ← Listado de noticias
│   │   └── [slug]/page.tsx    ← Detalle de noticia
│   └── contacto/page.tsx     ← NUEVO: formulario de contacto
│
├── (admin)/               ← Layout del dashboard (sidebar + topbar)
│   └── admin/
│       ├── page.tsx           ← Dashboard principal
│       ├── secciones/
│       │   ├── page.tsx       ← Lista de secciones editables
│       │   └── [slug]/page.tsx ← Editor de sección
│       ├── galeria/page.tsx   ← Gestión de álbumes e imágenes
│       ├── noticias/
│       │   ├── page.tsx       ← Lista de noticias
│       │   └── [id]/page.tsx  ← Editor de noticia
│       ├── configuracion/page.tsx  ← Config global del sitio
│       └── usuarios/page.tsx      ← Gestión de usuarios (solo ADMIN)
│
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── sections/route.ts
│   ├── sections/[slug]/route.ts
│   ├── gallery/route.ts
│   ├── gallery/[id]/route.ts
│   ├── news/route.ts
│   ├── news/[id]/route.ts
│   ├── upload/route.ts
│   ├── config/route.ts
│   └── users/route.ts
│
└── layout.tsx             ← Root layout
```

### 5.2 Home Page (/)

**Secciones:**
1. **Hero**: Imagen de fondo del colegio, título + subtítulo (editables desde dashboard), botón CTA a inscripciones si están abiertas
2. **Sobre nosotros**: Resumen breve con link a "Nuestra Escuela"
3. **Niveles**: 3 tarjetas (Inicial, Primario, Secundario) con imagen y link
4. **Noticias recientes**: Últimas 3 noticias publicadas
5. **Banner inscripciones**: Condicional — solo si `inscripcionOpen === true`
6. **Contacto rápido**: Mapa embebido + datos de contacto
7. **Footer**: Logo, links de navegación, redes sociales, dirección

**Datos dinámicos que consume:**
- `SiteConfig` (hero, contacto, inscripciones)
- `NewsArticle` (últimas 3 publicadas)
- `Section` (resúmenes de niveles)

### 5.3 Páginas de sección (institucional, niveles, etc.)

Todas siguen el mismo patrón:
1. Buscar la `Section` por `slug`
2. Renderizar el `content` (JSON de bloques) con un componente `<BlockRenderer />`
3. Mostrar `heroImage` si existe

**Esto es clave:** al tener un formato unificado de contenido, todas las páginas de sección usan el MISMO componente. No hay una página custom para cada sección. Esto reduce drásticamente el código y facilita el mantenimiento.

### 5.4 Galería

- Vista pública: grilla de álbumes → click en álbum → grilla de fotos con lightbox
- Datos: `GalleryImage` agrupadas por campo `album`

### 5.5 Noticias

- `/noticias`: Listado paginado de `NewsArticle` donde `isPublished === true`, ordenado por `publishedAt` descendente
- `/noticias/[slug]`: Detalle de noticia, renderiza `content` con el mismo `<BlockRenderer />`

### 5.6 Contacto (NUEVO — no existe en el sitio actual)

- Formulario: nombre, email, teléfono (opcional), mensaje, motivo (inscripción/consulta/otro)
- Envío por email al colegio (usando Resend o Nodemailer)
- Google Maps embebido con ubicación del colegio

---

## 6. Dashboard de Administración

### 6.1 Acceso y autenticación

- Login con email + contraseña (NO login social — no tiene sentido para un colegio)
- Sesión manejada por NextAuth.js con strategy: "jwt"
- Middleware de Next.js protege todas las rutas `/admin/*`
- Primer usuario ADMIN se crea por seed de base de datos (vos lo creás al hacer deploy)

### 6.2 Pantallas del dashboard

#### Dashboard principal (`/admin`)
- Estadísticas rápidas: total de noticias, última actualización, secciones editadas
- Accesos directos: "Editar home", "Crear noticia", "Subir fotos"

#### Editor de secciones (`/admin/secciones/[slug]`)
- Editor de bloques visual (similar a Notion simplificado)
- Bloques disponibles: Título (H2, H3), Párrafo, Imagen, Lista, Separador, Video embebido
- Cada bloque se puede reordenar con drag & drop
- Preview en tiempo real
- Botón "Guardar" y "Guardar y publicar"
- Subida de imágenes integrada (drag & drop → Cloudinary)

**Estructura JSON de un bloque:**
```json
{
  "blocks": [
    {
      "id": "block_1",
      "type": "heading",
      "data": { "text": "Nuestra Historia", "level": 2 }
    },
    {
      "id": "block_2",
      "type": "paragraph",
      "data": { "text": "El Instituto Parroquial San Pablo Apóstol fue fundado en 1959..." }
    },
    {
      "id": "block_3",
      "type": "image",
      "data": { "url": "https://res.cloudinary.com/...", "caption": "Frente del colegio", "alt": "Fachada del Instituto San Pablo" }
    },
    {
      "id": "block_4",
      "type": "list",
      "data": { "style": "unordered", "items": ["Item 1", "Item 2", "Item 3"] }
    }
  ]
}
```

#### Gestión de galería (`/admin/galeria`)
- Vista por álbumes (crear, renombrar, eliminar álbum)
- Dentro de cada álbum: subir múltiples imágenes (drag & drop), reordenar, agregar caption, eliminar
- Las imágenes se suben a Cloudinary vía API route

#### Gestión de noticias (`/admin/noticias`)
- Listado con filtros: publicadas / borradores
- Crear noticia nueva
- Editor igual al de secciones (mismos bloques)
- Campos adicionales: título, excerpt, imagen de portada, estado (borrador/publicado)

#### Configuración del sitio (`/admin/configuracion`)
- Formulario para editar campos de `SiteConfig`
- Preview del hero
- Toggle de inscripciones abierta/cerrada
- Links a redes sociales

#### Gestión de usuarios (`/admin/usuarios`) — Solo ADMIN
- Lista de usuarios con rol
- Crear nuevo usuario (email + contraseña temporal)
- Cambiar rol
- Desactivar usuario

### 6.3 UX del dashboard

- Sidebar fija a la izquierda con navegación
- Topbar con nombre del usuario logueado + botón logout
- Responsive: en mobile el sidebar se convierte en hamburger menu
- Feedback visual: toast notifications para guardar/error/éxito
- Confirmación antes de eliminar (modal)
- Autosave cada 30 segundos en editores de contenido (guardado en localStorage como backup)

---

## 7. Diseño Visual — Sitio Público

### 7.1 Identidad visual

- **Paleta de colores**: Basada en los colores institucionales del colegio (azul y blanco, con acento dorado por lo religioso). Colores exactos a definir con el cliente.
- **Tipografía**: Font moderna y legible. Sugerencia: Inter o Poppins para cuerpo, Playfair Display para títulos institucionales.
- **Estilo general**: Limpio, profesional, acogedor. No minimalista frío — es un colegio, necesita calidez. Fotos grandes, espacios blancos generosos, bordes redondeados suaves.

### 7.2 Responsive

- Mobile first (la mayoría de los padres van a acceder desde el celular)
- Breakpoints estándar de Tailwind: sm (640px), md (768px), lg (1024px), xl (1280px)
- Navbar: hamburger en mobile, completa en desktop
- Galería: 1 columna mobile, 2 tablet, 3-4 desktop

### 7.3 Performance

- Imágenes optimizadas con `next/image` + Cloudinary transformations
- Páginas de sección generadas con ISR (Incremental Static Regeneration) — se regeneran cada 60 segundos
- Lazy loading para galería e imágenes debajo del fold

---

## 8. Seguridad

- Contraseñas hasheadas con bcrypt (nunca plaintext)
- API routes protegidas: verificar sesión de NextAuth antes de procesar
- Validación de inputs con Zod en todas las API routes
- Sanitización de contenido: el JSON de bloques se valida antes de guardar
- Rate limiting en formulario de contacto (evitar spam)
- CORS configurado para aceptar solo el dominio del sitio
- Variables de entorno para secrets (DB_URL, NEXTAUTH_SECRET, CLOUDINARY_KEY)

---

## 9. Plan de Implementación (Fases)

### Fase 1 — Fundación (Semana 1-2)
- [ ] Setup proyecto Next.js + Tailwind + Prisma + PostgreSQL
- [ ] Configurar CLAUDE.md y estructura de specs por feature
- [ ] Modelos Prisma + migraciones
- [ ] Seed inicial (usuario admin + secciones base + config)
- [ ] Autenticación con NextAuth.js
- [ ] Layout público (navbar + footer)
- [ ] Layout admin (sidebar + topbar + protección de rutas)

### Fase 2 — Dashboard Core (Semana 3-4)
- [ ] CRUD de SiteConfig (configuración global)
- [ ] CRUD de Sections (secciones editables)
- [ ] Editor de bloques básico (párrafo, título, imagen, lista)
- [ ] Integración Cloudinary (upload de imágenes)
- [ ] CRUD de usuarios

### Fase 3 — Sitio Público (Semana 5-6)
- [ ] Home page con datos dinámicos
- [ ] Componente BlockRenderer (renderiza JSON → HTML)
- [ ] Todas las páginas de sección
- [ ] Galería con lightbox
- [ ] Página de contacto con formulario
- [ ] Noticias (listado + detalle)

### Fase 4 — Polish y Deploy (Semana 7-8)
- [ ] Responsive testing en todos los breakpoints
- [ ] SEO: meta tags, Open Graph, sitemap.xml
- [ ] Performance: lighthouse audit, optimización de imágenes
- [ ] Deploy a VPS (Nginx + PM2 + PostgreSQL)
- [ ] Dominio y SSL (Let's Encrypt)
- [ ] Migración de contenido del sitio viejo
- [ ] Capacitación al personal del colegio (cómo usar el dashboard)
- [ ] Documentación básica de uso

---

## 10. Estimación y Entregables

### Entregables
1. Sitio web público en producción con dominio configurado
2. Dashboard de administración funcional
3. Manual de uso del dashboard (documento simple con capturas)
4. Código fuente en repositorio Git
5. Sesión de capacitación presencial o por Meet

### Timeline estimado
8 semanas de desarrollo desde aprobación.

### Post-entrega
- 30 días de soporte incluido (bugs y ajustes menores)
- Mantenimiento mensual opcional (actualizaciones, backups, soporte)

---

## 11. Para Claude Code — Notas Técnicas

> Esta sección es técnica y está pensada para ser consumida por Claude Code durante el desarrollo.

### Convenciones de código
- TypeScript estricto en todo el proyecto
- Componentes funcionales con hooks
- Server Components por defecto, "use client" solo cuando es necesario
- Nombres de archivos: kebab-case para rutas, PascalCase para componentes
- API routes usan Route Handlers de Next.js (app/api/...)
- Validación con Zod en toda API route
- Errores devueltos como `{ error: string }` con status code apropiado

### Estructura de componentes
```
components/
├── public/        ← Componentes del sitio público
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── BlockRenderer.tsx
│   └── ...
├── admin/         ← Componentes del dashboard
│   ├── Sidebar.tsx
│   ├── BlockEditor.tsx
│   ├── ImageUploader.tsx
│   └── ...
└── ui/            ← Componentes genéricos reutilizables
    ├── Button.tsx
    ├── Input.tsx
    ├── Modal.tsx
    ├── Toast.tsx
    └── ...
```

### Variables de entorno requeridas
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/sanpablo"
NEXTAUTH_SECRET="..." 
NEXTAUTH_URL="https://ipsanpablo.com"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
CONTACT_EMAIL="secretaria@ipsanpablo.com"
```

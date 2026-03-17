# SPEC: Gestión de imágenes por sección en el Dashboard Admin

## Contexto

El dashboard de administración necesita una forma clara y organizada de subir y gestionar imágenes para secciones específicas del sitio. Actualmente no hay una separación visual ni funcional que permita al administrador saber dónde subir cada imagen.

## Objetivo

Crear en el panel de administración una página de gestión de imágenes organizada por sección, donde el administrador pueda ver claramente a qué parte del sitio pertenece cada grupo de imágenes, subir nuevas, reordenar y eliminar.

---

## Secciones que requieren imágenes

Cada sección debe aparecer como un grupo independiente en el panel admin, con su propio uploader y su propia grilla de imágenes.

| Sección | Album (valor en DB) | Tipo de imágenes | Cantidad esperada |
|---------|-------------------|------------------|-------------------|
| Institucional → Nuestra Escuela | `institucional-nuestra-escuela` | Fotos del colegio, frente, aulas, historia | 5-15 |
| Institucional → Galería | `institucional-galeria` | Fotos de actos, eventos institucionales | 10-50 |
| Niveles → Inicial | `niveles-inicial` | Fotos de actividades del nivel inicial | 5-20 |
| Niveles → Primario | `niveles-primario` | Fotos de actividades del nivel primario | 5-20 |
| Niveles → Secundario | `niveles-secundario` | Fotos de actividades del nivel secundario | 5-20 |
| Pasantías → Lugares | `pasantias-lugares` | Fotos de los lugares de pasantía | 3-10 |
| Pastoral → Info General | `pastoral-info` | Fotos de actividades pastorales, convivencias | 5-15 |
| Pastoral → Galería | `pastoral-galeria` | Galería general de pastoral | 10-50 |

---

## Diseño de la página admin

### Ruta: `/admin/galeria`

La página debe mostrar todas las secciones organizadas como un acordeón o tarjetas colapsables. Cada sección tiene:

1. **Header clickeable** con el nombre de la sección (ej: "Institucional → Nuestra Escuela") y la cantidad de imágenes actuales (ej: "12 imágenes")
2. **Al expandir/abrir**: muestra la grilla de imágenes existentes + zona de upload

### Estructura visual:

```
┌─────────────────────────────────────────────────────┐
│  Gestión de Imágenes                                │
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │ ▼ Institucional → Nuestra Escuela  (8 imgs)    ││
│  │                                                 ││
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              ││
│  │  │ img │ │ img │ │ img │ │ img │  ...          ││
│  │  └─────┘ └─────┘ └─────┘ └─────┘              ││
│  │                                                 ││
│  │  [📎 Arrastrá imágenes aquí o hacé click]       ││
│  │                                                 ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │ ▶ Institucional → Galería  (23 imgs)           ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │ ▶ Niveles → Inicial  (5 imgs)                  ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │ ▶ Niveles → Primario  (0 imgs)                 ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ... (resto de secciones)                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Funcionalidad de cada sección expandida

### Subida de imágenes
- Zona de drag & drop para subir múltiples imágenes a la vez
- También un botón "Seleccionar archivos" por si prefieren no arrastrar
- Al subir, la imagen va a Cloudinary (o al sistema de almacenamiento configurado) con el album correspondiente a esa sección
- Mostrar barra de progreso durante la subida
- Mostrar preview de la imagen antes de confirmar la subida
- Formatos aceptados: JPG, PNG, WEBP. Tamaño máximo: 5MB por imagen

### Grilla de imágenes existentes
- Mostrar thumbnails en grilla responsive (2 cols mobile, 3 tablet, 4 desktop)
- Cada imagen muestra:
  - Thumbnail de la imagen
  - Caption (editable inline — click para editar, Enter para guardar)
  - Botón de eliminar (con confirmación modal: "¿Estás seguro de eliminar esta imagen?")
- Reordenar imágenes con drag & drop (actualizar sortOrder en la DB)

### Indicadores visuales
- Secciones sin imágenes: mostrar badge "Sin imágenes" en color gris
- Secciones con imágenes: mostrar la cantidad en un badge azul
- Toast de éxito al subir/eliminar correctamente
- Toast de error si falla algo

---

## Implementación técnica

### Modelo de datos
Usar el modelo `GalleryImage` existente. El campo `album` es el que diferencia a qué sección pertenece cada imagen. Usar los valores de album definidos en la tabla de arriba.

### API Routes necesarias

**GET /api/gallery?album=institucional-nuestra-escuela**
- Devuelve todas las imágenes de un album específico, ordenadas por sortOrder
- Si no se pasa album, devuelve todas las imágenes agrupadas por album

**POST /api/gallery**
- Body: `{ url, publicId, caption?, album, sortOrder }`
- Crea un nuevo registro de GalleryImage
- Validar con Zod que album sea uno de los valores permitidos

**PUT /api/gallery/[id]**
- Body: `{ caption?, sortOrder? }`
- Actualiza caption o sortOrder de una imagen existente

**DELETE /api/gallery/[id]**
- Elimina el registro de la DB Y la imagen de Cloudinary (usando publicId)
- Requiere confirmación desde el frontend

**POST /api/upload**
- Recibe la imagen como FormData
- La sube a Cloudinary
- Devuelve `{ url, publicId }`
- Esta ruta ya puede existir — verificar y reutilizar si es así

### Componentes a crear/modificar

```
components/admin/
├── ImageGalleryManager.tsx    ← Componente principal de la página
├── SectionImageGroup.tsx      ← Acordeón/card de una sección individual
├── ImageUploader.tsx          ← Zona de drag & drop (puede ya existir)
├── ImageGrid.tsx              ← Grilla de thumbnails con acciones
└── ImageCard.tsx              ← Card individual de imagen (thumbnail + caption + delete)
```

### Configuración de secciones

Definir las secciones como una constante para no hardcodear en múltiples lugares:

```typescript
// lib/gallery-sections.ts
export const GALLERY_SECTIONS = [
  { album: 'institucional-nuestra-escuela', label: 'Institucional → Nuestra Escuela' },
  { album: 'institucional-galeria', label: 'Institucional → Galería' },
  { album: 'niveles-inicial', label: 'Niveles → Inicial' },
  { album: 'niveles-primario', label: 'Niveles → Primario' },
  { album: 'niveles-secundario', label: 'Niveles → Secundario' },
  { album: 'pasantias-lugares', label: 'Pasantías → Lugares' },
  { album: 'pastoral-info', label: 'Pastoral → Info General' },
  { album: 'pastoral-galeria', label: 'Pastoral → Galería' },
] as const
```

---

## Integración con el sitio público

Las páginas públicas que muestran imágenes deben consultar las imágenes por album. Por ejemplo:

- `/institucional/nuestra-escuela` → muestra imágenes con album `institucional-nuestra-escuela` intercaladas o debajo del contenido de bloques
- `/institucional/galeria` → muestra SOLO la grilla de imágenes con album `institucional-galeria` con lightbox
- `/niveles/inicial` → muestra imágenes con album `niveles-inicial` debajo del contenido
- `/pastoral/galeria` → muestra SOLO la grilla de imágenes con album `pastoral-galeria` con lightbox

Las páginas que son específicamente "Galería" (institucional y pastoral) deben mostrar la grilla de imágenes como contenido principal con lightbox fullscreen.

Las demás páginas (nuestra escuela, niveles, pasantías, pastoral info) deben mostrar las imágenes como complemento visual debajo o intercalado con el contenido de texto.

---

## Orden de ejecución

1. Crear `lib/gallery-sections.ts` con la constante de secciones
2. Crear/verificar las API routes de gallery (GET, POST, PUT, DELETE)
3. Crear los componentes admin (ImageGalleryManager, SectionImageGroup, ImageGrid, ImageCard)
4. Modificar `/admin/galeria/page.tsx` para usar el nuevo layout por secciones
5. Actualizar las páginas públicas para que consulten y muestren las imágenes por album
6. Verificar que subir una imagen en el admin se refleje en la página pública correspondiente

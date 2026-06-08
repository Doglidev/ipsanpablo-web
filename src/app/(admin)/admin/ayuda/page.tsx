'use client'

import { useState } from 'react'

const VIDEOS = [
  {
    id: 'intro',
    title: 'Bienvenida al panel',
    description: 'Cómo acceder al panel y recorrido de bienvenida.',
    youtubeId: 'numPjnwcd-A',
  },
  {
    id: 'secciones',
    title: 'Cómo editar una sección',
    description: 'Modificar el contenido de las páginas del sitio.',
    youtubeId: 'l7o7uEE1Jh4',
  },
  {
    id: 'noticias',
    title: 'Cómo publicar una noticia',
    description: 'Crear, editar y publicar noticias con el editor de bloques.',
    youtubeId: 'Adj0jb1x3uQ',
  },
  {
    id: 'galeria',
    title: 'Gestión de la galería',
    description: 'Subir, organizar y eliminar imágenes de la galería.',
    youtubeId: '8GPcSEQvJtA',
  },
  {
    id: 'configuracion',
    title: 'Configuración y usuarios',
    description: 'Ajustes generales del sitio y gestión de cuentas de usuario.',
    youtubeId: 'olen03hAaxU',
  },
]

const BLOCKS = [
  {
    type: 'Título',
    icon: 'H',
    description:
      'Inserta un encabezado dentro del contenido. Podés elegir entre H2 (título principal, más grande y azul) o H3 (subtítulo, más pequeño y gris). Usalo para organizar el texto en secciones.',
  },
  {
    type: 'Párrafo',
    icon: '¶',
    description:
      'Bloque de texto libre. Ideal para el cuerpo de la nota o descripción de una sección. Permite escribir varias oraciones o párrafos completos.',
  },
  {
    type: 'Imagen',
    icon: '🖼',
    description:
      'Sube una foto desde tu dispositivo (máx. 5 MB). Podés elegir tres tamaños: ancho completo, mediana centrada o pequeña flotante a la derecha. También admite pie de foto y texto alternativo.',
  },
  {
    type: 'Lista',
    icon: '≡',
    description:
      'Crea una lista con viñetas (puntos) o numerada. Agregá o eliminá ítems con los botones del editor. Útil para enumeraciones, pasos o requisitos.',
  },
  {
    type: 'Separador',
    icon: '—',
    description:
      'Dibuja una línea horizontal fina para separar visualmente dos partes del contenido. No requiere ninguna configuración, solo añadirlo.',
  },
  {
    type: 'Video',
    icon: '▶',
    description:
      'Incrusta un video de YouTube. Pegá la URL normal (youtube.com/watch?v=...) o el link corto (youtu.be/...) y el sistema lo convierte automáticamente en un reproductor. Opcionalmente podés añadir una descripción debajo.',
  },
  {
    type: 'Grid de Partners',
    icon: '⊞',
    description:
      'Muestra una grilla de logos de instituciones o empresas aliadas. Podés subir el logo de cada una y escribir su nombre. En pantallas grandes se muestran 5 columnas; en celular, 2. Ideal para secciones de "instituciones que nos acompañan".',
  },
]

const FAQS = [
  {
    q: '¿Qué es el slug de una noticia?',
    a: 'El slug es la parte de la URL que identifica a la noticia. Por ejemplo, si el slug es "acto-del-25-de-mayo", la dirección pública será /noticias/acto-del-25-de-mayo. Debe usar solo letras minúsculas, números y guiones, sin espacios ni tildes. Tiene que ser único.',
  },
  {
    q: '¿Cuánto puede pesar una imagen?',
    a: 'El máximo es 5 MB por imagen. Si la foto pesa más, el sistema la rechazará. Podés reducir el tamaño antes de subirla con herramientas como TinyPNG (tinypng.com) o el propio compresor del celular.',
  },
  {
    q: '¿Qué formatos de imagen se aceptan?',
    a: 'Se aceptan todos los formatos de imagen estándar: JPG, PNG, WEBP, GIF, etc. No se aceptan archivos PDF ni documentos.',
  },
  {
    q: '¿Los cambios se publican inmediatamente?',
    a: 'Sí. Al guardar cualquier cambio (noticia, sección o configuración), los cambios se reflejan en el sitio de forma inmediata.',
  },
  {
    q: '¿Qué diferencia hay entre un usuario Editor y un Admin?',
    a: 'El Editor puede gestionar noticias, secciones y galería. El Admin tiene acceso a todo eso más la configuración general del sitio y la gestión de usuarios (crear, editar y eliminar cuentas).',
  },
  {
    q: '¿Cómo se incrusta un video de YouTube?',
    a: 'Añadí un bloque de tipo "Video", pegá la URL del video de YouTube (la dirección normal del navegador) y guardá. El sistema convierte automáticamente la URL en un reproductor. No necesitás buscar el código de incrustación.',
  },
  {
    q: '¿Puedo reordenar los bloques del contenido?',
    a: 'Sí. Cada bloque tiene flechas (↑ ↓) en su esquina superior para subirlo o bajarlo dentro del contenido.',
  },
]

const GLOSSARY = [
  {
    term: 'Slug',
    def: 'Identificador de texto que aparece en la URL de una página o noticia. Ejemplo: /noticias/mi-nota → el slug es "mi-nota".',
  },
  {
    term: 'Bloque',
    def: 'Unidad básica de contenido dentro del editor. Cada párrafo, imagen, video o lista es un bloque independiente que se puede mover, editar o eliminar.',
  },
  {
    term: 'Sección',
    def: 'Página del sitio gestionada desde el panel. Por ejemplo: "Nivel Inicial", "Pastoral", "Secretaría". Su contenido se edita con bloques.',
  },
  {
    term: 'Cloudinary',
    def: 'Servicio externo donde se almacenan las imágenes y logos subidos desde el panel. Las URLs de las imágenes apuntan a ese servicio.',
  },
  {
    term: 'Rol',
    def: 'Nivel de permisos de un usuario. Los roles disponibles son Editor (acceso parcial) y Admin (acceso completo).',
  },
  {
    term: 'Caption / Pie de foto',
    def: 'Texto descriptivo que aparece debajo de una imagen o video en el sitio público.',
  },
  {
    term: 'Alt / Texto alternativo',
    def: 'Descripción de una imagen para personas con lectores de pantalla y para el SEO. No se muestra visualmente, pero es importante completarlo.',
  },
]

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
      >
        {q}
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
      )}
    </div>
  )
}

const VideoCard = ({ title, description, youtubeId }: { title: string; description: string; youtubeId: string }) => {
  if (!youtubeId) {
    return (
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="bg-gray-100 aspect-video flex flex-col items-center justify-center gap-2">
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-gray-400">Próximamente</span>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  )
}

const AyudaPage = () => {
  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centro de ayuda</h1>
        <p className="text-gray-500 text-sm mt-1">
          Guías, videos y respuestas frecuentes para usar el panel.
        </p>
      </div>

      {/* Videos */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4">Videos tutoriales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VIDEOS.map((v) => (
            <VideoCard key={v.id} title={v.title} description={v.description} youtubeId={v.youtubeId} />
          ))}
        </div>
      </section>

      {/* Bloques */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4">¿Para qué sirve cada bloque?</h2>
        <div className="bg-white rounded-xl border divide-y">
          {BLOCKS.map((b) => (
            <div key={b.type} className="flex gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                {b.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{b.type}</p>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4">Preguntas frecuentes</h2>
        <div className="bg-white rounded-xl border">
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Glosario */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4">Glosario</h2>
        <div className="bg-white rounded-xl border divide-y">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="px-5 py-4 flex gap-4">
              <span className="text-sm font-semibold text-school-blue w-40 flex-shrink-0">{g.term}</span>
              <span className="text-sm text-gray-600 leading-relaxed">{g.def}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AyudaPage

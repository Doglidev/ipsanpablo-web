import Image from 'next/image'
import type {
  BlockContent,
  ContentBlock,
  HeadingData,
  ParagraphData,
  ImageData,
  ListData,
  VideoData,
} from '@/types'

interface BlockRendererProps {
  content: string // JSON string
}

const BlockRenderer = ({ content }: BlockRendererProps) => {
  let parsed: BlockContent

  try {
    parsed = JSON.parse(content) as BlockContent
  } catch {
    return <p className="text-gray-500 italic">Contenido no disponible.</p>
  }

  if (!parsed.blocks?.length) {
    return <p className="text-gray-500 italic">Sin contenido.</p>
  }

  return (
    <div className="prose prose-lg max-w-none">
      {parsed.blocks.map((block) => (
        <BlockItem key={block.id} block={block} />
      ))}
    </div>
  )
}

const BlockItem = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'heading': {
      const data = block.data as HeadingData
      if (data.level === 2) {
        return (
          <h2 className="text-2xl font-bold text-school-blue mt-8 mb-4 pb-2 border-b border-gray-100">
            {data.text}
          </h2>
        )
      }
      return (
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          {data.text}
        </h3>
      )
    }

    case 'paragraph': {
      const data = block.data as ParagraphData
      return (
        <p className="text-gray-700 leading-relaxed mb-4">
          {data.text}
        </p>
      )
    }

    case 'image': {
      const data = block.data as ImageData
      return (
        <figure className="my-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <Image
              src={data.url}
              alt={data.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {data.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {data.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'list': {
      const data = block.data as ListData
      if (data.style === 'ordered') {
        return (
          <ol className="list-decimal list-inside space-y-1.5 mb-4 text-gray-700">
            {data.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        )
      }
      return (
        <ul className="list-disc list-inside space-y-1.5 mb-4 text-gray-700">
          {data.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
    }

    case 'divider':
      return <hr className="my-8 border-gray-200" />

    case 'video': {
      const data = block.data as VideoData
      // Soporta URLs de YouTube e iframe embeds
      const embedUrl = toEmbedUrl(data.url)
      if (!embedUrl) return null
      return (
        <figure className="my-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src={embedUrl}
              title={data.caption ?? 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {data.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {data.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    default:
      return null
  }
}

const toEmbedUrl = (url: string): string | null => {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const id =
        u.searchParams.get('v') ?? u.pathname.split('/').pop() ?? ''
      return `https://www.youtube.com/embed/${id}`
    }
    return url
  } catch {
    return null
  }
}

export default BlockRenderer

import Image from 'next/image'
import type {
  BlockContent,
  ContentBlock,
  HeadingData,
  ParagraphData,
  ImageData,
  ListData,
  VideoData,
  PartnersData,
  PartnerItem,
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
      <div className="clear-both" />
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
      if (!data.url) return null

      if (data.size === 'small') {
        return (
          <figure className="float-right ml-6 mb-4 max-w-[300px] w-full">
            <Image
              src={data.url}
              alt={data.alt ?? ''}
              width={300}
              height={420}
              className="rounded-xl object-cover w-full h-auto"
              sizes="300px"
            />
            {data.caption && (
              <figcaption className="text-center text-sm text-gray-500 mt-2">
                {data.caption}
              </figcaption>
            )}
          </figure>
        )
      }

      const maxW = data.size === 'medium' ? 'max-w-sm mx-auto' : 'w-full'
      return (
        <figure className="my-6">
          <div className={`relative ${maxW} aspect-video rounded-xl overflow-hidden`}>
            <Image
              src={data.url}
              alt={data.alt ?? ''}
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

    case 'partners': {
      const data = block.data as PartnersData
      if (!data.items?.length) return null
      return (
        <div className="not-prose my-10">
          {data.heading && (
            <h2 className="text-2xl font-bold text-school-blue mb-6 pb-2 border-b border-gray-100">
              {data.heading}
            </h2>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {data.items.map((item: PartnerItem, i: number) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center gap-3 h-40"
              >
                <div className="relative flex-1 w-full">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-200">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-gray-500 text-center leading-tight line-clamp-2">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
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

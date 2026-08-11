import Link from 'next/link'
import type { ReactNode } from 'react'

// Convierte texto plano en nodos React, transformando enlaces en <a> clickeables.
// Nunca se usa dangerouslySetInnerHTML: el contenido viene del panel de
// administración y debe seguir escapándose. Solo se generan elementos <a> con
// href validado contra una allowlist de protocolos.
//
// Formatos soportados dentro del texto:
//   [texto visible](https://ejemplo.com)  → enlace con etiqueta propia
//   [texto visible](www.facebook.com)     → ídem, sin exigir el https://
//   [Escribinos](info@ejemplo.com)        → ídem, se convierte en mailto
//   https://ejemplo.com                   → autoenlace
//   www.ejemplo.com                       → autoenlace
//   facebook.com/ipsanpablo               → autoenlace (dominio suelto)
//   contacto@ejemplo.com                  → mailto

// Terminaciones aceptadas para autoenlazar un dominio escrito sin http ni www.
// La lista es acotada a propósito: si aceptáramos cualquier ".algo", un punto
// sin espacio ("la propuesta.Nuestra escuela...") se volvería un enlace.
const TLD =
  'com|net|org|edu|gob|gov|info|app|io|me|tv|ar|es|uy|br|cl|mx|pe|co'

const PATTERN = new RegExp(
  [
    /\[([^\]\n]+)\]\(([^\s)]+)\)/, //                          [texto](destino)
    /((?:https?:\/\/|www\.)[^\s<]+)/, //                        https://... o www...
    /([^\s<@]+@[^\s<@]+\.[a-zA-Z]{2,})/, //                     correo electrónico
    new RegExp(`(?<![\\w@./])((?:[a-zA-Z0-9-]+\\.)+(?:${TLD})(?:/[^\\s<]*)?)`), // dominio suelto
  ]
    .map((r) => r.source)
    .join('|'),
  'g'
)

// Puntuación que suele quedar pegada al final de una URL suelta dentro de una
// oración ("visitá https://ejemplo.com.") y que no forma parte del enlace.
const TRAILING = /[.,;:!?)\]}'"»]+$/

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:']

const HAS_PROTOCOL = /^[a-zA-Z][a-zA-Z0-9+.-]*:/
const LOOKS_LIKE_EMAIL = /^[^\s@/]+@[^\s@/]+\.[a-zA-Z]{2,}$/
const LOOKS_LIKE_DOMAIN = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+/

// Completa lo que quien escribe suele omitir: sin esto, "www.facebook.com"
// dentro de [texto](...) no es una URL válida y el enlace no se generaba.
const withProtocol = (raw: string): string => {
  const href = raw.trim()
  if (!href || HAS_PROTOCOL.test(href)) return href
  if (href.startsWith('/') || href.startsWith('#')) return href
  if (LOOKS_LIKE_EMAIL.test(href)) return `mailto:${href}`
  if (LOOKS_LIKE_DOMAIN.test(href)) return `https://${href}`
  return href
}

const safeHref = (raw: string): string | null => {
  const href = withProtocol(raw)
  if (!href) return null
  // Rutas internas y anclas
  if (href.startsWith('/') || href.startsWith('#')) return href
  try {
    const url = new URL(href)
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) return null
    return url.toString()
  } catch {
    return null
  }
}

const linkClass =
  'text-school-blue font-medium underline underline-offset-2 decoration-school-gold/60 hover:text-school-gold transition-colors break-words'

const Anchor = ({ href, children }: { href: string; children: ReactNode }) => {
  // Rutas internas: navegación cliente con next/link. El resto (http, mailto,
  // tel, anclas) va con <a> nativo; los externos se abren en pestaña aparte.
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={linkClass}>
        {children}
      </Link>
    )
  }

  const isExternal = href.startsWith('http')
  return (
    <a
      href={href}
      className={linkClass}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

export const renderRichText = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0

  // El regex es global: se reinicia en cada llamada para evitar arrastrar
  // lastIndex entre invocaciones.
  PATTERN.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = PATTERN.exec(text)) !== null) {
    const [full, mdLabel, mdUrl, protocolUrl, email, domain] = match

    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    lastIndex = match.index + full.length

    // 1. [texto](destino)
    if (mdLabel !== undefined && mdUrl !== undefined) {
      const href = safeHref(mdUrl)
      nodes.push(
        href ? (
          <Anchor key={key++} href={href}>
            {mdLabel}
          </Anchor>
        ) : (
          full
        )
      )
      continue
    }

    // 2. Enlace suelto: https://..., www..., correo o dominio a secas.
    //    safeHref completa el protocolo faltante (https:// o mailto:).
    const bare = protocolUrl ?? email ?? domain
    if (bare !== undefined) {
      const trailing = bare.match(TRAILING)?.[0] ?? ''
      const clean = trailing ? bare.slice(0, -trailing.length) : bare
      const href = safeHref(clean)
      nodes.push(
        href ? (
          <Anchor key={key++} href={href}>
            {clean}
          </Anchor>
        ) : (
          clean
        )
      )
      if (trailing) nodes.push(trailing)
      continue
    }
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

const RichText = ({ text }: { text: string }) => <>{renderRichText(text)}</>

export default RichText

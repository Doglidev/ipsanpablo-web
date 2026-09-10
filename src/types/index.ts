export interface ContentBlock {
  id: string
  type: 'heading' | 'paragraph' | 'image' | 'list' | 'divider' | 'video' | 'partners' | 'gallery'
  data: HeadingData | ParagraphData | ImageData | ListData | DividerData | VideoData | PartnersData | GalleryData
}

export interface HeadingData {
  text: string
  level: 2 | 3
}

export interface ParagraphData {
  text: string
}

export interface ImageData {
  url: string
  caption?: string
  alt: string
  size?: 'small' | 'medium' | 'full'
}

export interface ListData {
  style: 'ordered' | 'unordered'
  items: string[]
}

export type DividerData = Record<string, never>

export interface VideoData {
  url: string
  caption?: string
}

export interface PartnerItem {
  name: string
  imageUrl?: string
}

export interface PartnersData {
  heading?: string
  items: PartnerItem[]
}

export interface GalleryImageItem {
  url: string
  caption?: string
}

export interface GalleryData {
  images: GalleryImageItem[]
  /** Columnas en desktop. Mobile siempre 2. Default 3. */
  columns?: 2 | 3 | 4
}

export interface BlockContent {
  blocks: ContentBlock[]
}

export type ActionResult = { success: true } | { success: false; error: string }

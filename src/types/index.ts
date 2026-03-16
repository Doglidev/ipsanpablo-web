export interface ContentBlock {
  id: string
  type: 'heading' | 'paragraph' | 'image' | 'list' | 'divider' | 'video'
  data: HeadingData | ParagraphData | ImageData | ListData | DividerData | VideoData
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
}

export interface ListData {
  style: 'ordered' | 'unordered'
  items: string[]
}

export interface DividerData {
  // empty
}

export interface VideoData {
  url: string
  caption?: string
}

export interface BlockContent {
  blocks: ContentBlock[]
}

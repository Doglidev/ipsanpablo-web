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

export type GalleryAlbum = (typeof GALLERY_SECTIONS)[number]['album']

export const VALID_ALBUMS = GALLERY_SECTIONS.map((s) => s.album) as [string, ...string[]]

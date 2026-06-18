/**
 * Devuelve la URL de descarga apropiada para un archivo de botón del home.
 *
 * Para archivos servidos desde Cloudinary (`res.cloudinary.com`), el atributo
 * HTML `download` se ignora por ser cross-origin. Para forzar la descarga con
 * un nombre amigable se inserta el flag `fl_attachment:<nombre>` en la URL, que
 * hace que Cloudinary responda con `Content-Disposition: attachment`.
 *
 * Para URLs locales o de la ruta legacy `/api/pdf/...` (mismo origen) se
 * devuelve la URL tal cual: ahí el atributo `download` ya funciona.
 */
export function toDownloadUrl(fileUrl: string, downloadName?: string): string {
  if (!fileUrl.includes('res.cloudinary.com') || !fileUrl.includes('/upload/')) {
    return fileUrl
  }

  const base = (downloadName || 'documento').replace(/\.[^./\\]+$/, '') // sin extensión
  const safeName = base
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100) || 'documento'

  return fileUrl.replace('/upload/', `/upload/fl_attachment:${encodeURIComponent(safeName)}/`)
}

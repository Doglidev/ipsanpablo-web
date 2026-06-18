/**
 * Escapa caracteres especiales de HTML para evitar inyección de markup
 * en los cuerpos de email construidos con datos provistos por el usuario.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

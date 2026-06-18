import { prisma } from '@/lib/prisma'

export interface NavChild {
  key: string
  label: string
  href: string
}

export interface NavTopItem {
  /** Identificador estable (slug del grupo) para usar como React key. */
  key: string
  label: string
  /** Link directo (cuando no hay dropdown) o landing del grupo (primer hijo). */
  href: string
  /** Si está vacío, el item se renderiza como link directo (sin dropdown). */
  children: NavChild[]
}

/**
 * Arma el árbol del navbar a partir de la DB.
 *
 * Reglas por grupo (en orden de `sortOrder`):
 *   - Grupo con `href` (página funcional, ej. Noticias/Contacto) → link directo
 *     a ese href SIEMPRE (sus secciones, si las hubiera, se ignoran en el menú).
 *   - 0 hijos visibles → se omite.
 *   - 1 hijo visible   → link directo a ese hijo.
 *   - 2+ hijos visibles → dropdown.
 *
 * Un "hijo" es una Section visible cuyo `pageGroup` coincide con el slug del
 * grupo. Su URL es `navPath` o, por defecto, `/seccion/{slug}`.
 */
export async function getNavTree(): Promise<NavTopItem[]> {
  const [groups, sections] = await Promise.all([
    prisma.navGroup.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.section.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
      select: { slug: true, title: true, navLabel: true, pageGroup: true, navPath: true },
    }),
  ])

  const childrenByGroup = new Map<string, NavChild[]>()
  for (const s of sections) {
    const list = childrenByGroup.get(s.pageGroup) ?? []
    list.push({ key: s.slug, label: s.navLabel ?? s.title, href: s.navPath ?? `/seccion/${s.slug}` })
    childrenByGroup.set(s.pageGroup, list)
  }

  const tree: NavTopItem[] = []
  for (const group of groups) {
    // Grupo "página funcional": href fijo, sin desplegable.
    if (group.href) {
      tree.push({ key: group.slug, label: group.label, href: group.href, children: [] })
      continue
    }

    const children = childrenByGroup.get(group.slug) ?? []
    if (children.length === 0) continue // grupo vacío → no aparece
    if (children.length === 1) {
      tree.push({ key: group.slug, label: group.label, href: children[0].href, children: [] })
      continue
    }
    tree.push({ key: group.slug, label: group.label, href: children[0].href, children })
  }

  return tree
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export class AuthError extends Error {
  constructor(message = 'No autorizado') {
    super(message)
    this.name = 'AuthError'
  }
}

type SessionRole = 'ADMIN' | 'EDITOR' | 'VIEWER'

export interface AuthSession {
  user: { id: string; email?: string | null; name?: string | null; role: SessionRole }
}

async function getAuthSession(): Promise<AuthSession> {
  const session = (await getServerSession(authOptions)) as AuthSession | null
  if (!session?.user) throw new AuthError()
  return session
}

/** Cualquier usuario autenticado. */
export async function requireSession(): Promise<AuthSession> {
  return getAuthSession()
}

/** ADMIN o EDITOR (no VIEWER). Para mutaciones de contenido. */
export async function requireEditor(): Promise<AuthSession> {
  const session = await getAuthSession()
  if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') throw new AuthError()
  return session
}

/** Solo ADMIN. Para gestión de usuarios. */
export async function requireAdmin(): Promise<AuthSession> {
  const session = await getAuthSession()
  if (session.user.role !== 'ADMIN') throw new AuthError()
  return session
}

/** Devuelve un ActionResult de error si `e` es un AuthError; si no, `null`. */
export function authErrorResult(e: unknown): { success: false; error: string } | null {
  if (e instanceof AuthError || (e instanceof Error && e.message === 'No autorizado')) {
    return { success: false, error: 'No autorizado' }
  }
  return null
}

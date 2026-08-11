'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

interface SessionProviderProps {
  children: React.ReactNode
  // La sesión se resuelve en el servidor y se pasa como estado inicial. Sin
  // esto, useSession() devuelve null durante el SSR pero ya trae la sesión en
  // el primer render del cliente, y todo lo que dependa del rol (por ejemplo
  // el ítem "Usuarios" del sidebar) provoca un error de hidratación.
  session: Session | null
}

const SessionProvider = ({ children, session }: SessionProviderProps) => {
  return <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>
}

export default SessionProvider

'use client'

import { signOut, useSession } from 'next-auth/react'

const Topbar = () => {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {session?.user?.name}
          <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {(session?.user as { role?: string })?.role === 'ADMIN'
            ? 'Admin'
            : (session?.user as { role?: string })?.role === 'VIEWER'
            ? 'Visor'
            : 'Editor'}
          </span>
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Salir
        </button>
      </div>
    </header>
  )
}

export default Topbar

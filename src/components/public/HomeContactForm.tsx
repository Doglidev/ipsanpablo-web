'use client'

import { useState, useTransition } from 'react'
import { sendContactForm } from '@/lib/actions/contact'

const HomeContactForm = () => {
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      const res = await sendContactForm(formData)
      if (res.success) {
        setSent(true)
        ;(e.target as HTMLFormElement).reset()
      } else {
        setError(res.error)
      }
    })
  }

  const inputClass =
    'w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-school-gold focus:border-transparent transition-colors'

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-school-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-semibold text-lg">¡Mensaje enviado!</p>
        <p className="text-white/70 text-sm">Nos pondremos en contacto a la brevedad.</p>
        <button
          onClick={() => setSent(false)}
          className="mt-2 text-school-gold text-sm underline hover:text-amber-400"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="name"
        required
        className={inputClass}
        placeholder="Nombre y Apellido *"
      />
      <input
        name="email"
        type="email"
        required
        className={inputClass}
        placeholder="Email *"
      />
      <input
        name="subject"
        className={inputClass}
        placeholder="Asunto"
      />
      <textarea
        name="message"
        required
        rows={4}
        className={inputClass}
        placeholder="Consulta *"
      />
      {error && (
        <p className="text-red-300 text-xs">{error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-school-gold hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg text-sm tracking-wide transition-colors"
      >
        {isPending ? 'ENVIANDO...' : 'ENVIAR'}
      </button>
    </form>
  )
}

export default HomeContactForm

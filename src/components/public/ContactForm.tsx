'use client'

import { useTransition, useState, useRef } from 'react'
import { sendContactForm } from '@/lib/actions/contact'

const ContactForm = () => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setResult(null)
    startTransition(async () => {
      const res = await sendContactForm(formData)
      setResult(res)
      if (res.success) {
        formRef.current?.reset()
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
            placeholder="Tu nombre completo"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
            placeholder="351 000-0000"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Asunto
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue"
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue resize-none"
          placeholder="Escribí tu mensaje aquí..."
        />
      </div>

      {result && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            result.success
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {result.success
            ? 'Mensaje enviado correctamente. Nos comunicaremos pronto.'
            : result.error ?? 'Error al enviar el mensaje. Intentá nuevamente.'}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-school-blue text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-blue-900 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}

export default ContactForm

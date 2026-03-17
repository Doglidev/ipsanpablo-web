import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import SectionHero from '@/components/public/SectionHero'
import ContactForm from '@/components/public/ContactForm'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contacto | Instituto San Pablo Apóstol',
  description: 'Ponete en contacto con el Instituto Parroquial San Pablo Apóstol.',
}

const ContactoPage = async () => {
  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } })

  return (
    <div>
      <SectionHero
        title="Contacto"
        breadcrumbs={[{ label: 'Contacto', href: '/contacto' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info + mapa */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-school-blue mb-6">Información de contacto</h2>
              <div className="space-y-4">
                {config?.address && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-school-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dirección</p>
                      <p className="text-sm text-gray-600">{config.address}</p>
                    </div>
                  </div>
                )}
                {config?.phone && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-school-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Teléfono</p>
                      <a href={`tel:${config.phone}`} className="text-sm text-gray-600 hover:text-school-blue">
                        {config.phone}
                      </a>
                    </div>
                  </div>
                )}
                {config?.email && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-school-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <a href={`mailto:${config.email}`} className="text-sm text-gray-600 hover:text-school-blue">
                        {config.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Google Maps embed — Asturias 1935, Barrio Colón, Córdoba */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                title="Ubicación Instituto San Pablo Apóstol"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.8!2d-64.1988!3d-31.3901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zAsturias+1935%2C+Barrio+Col%C3%B3n%2C+C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Formulario */}
          <div>
            <h2 className="text-2xl font-bold text-school-blue mb-6">Envianos un mensaje</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactoPage

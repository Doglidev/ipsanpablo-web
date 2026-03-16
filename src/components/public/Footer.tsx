import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-school-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Identidad */}
          <div>
            <h3 className="font-bold text-lg mb-3">Instituto San Pablo Apóstol</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Educación con valores desde 1959. Nivel Inicial, Primario y Secundario.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-blue-200">
              Accesos rápidos
            </h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><Link href="/institucional/nuestra-escuela" className="hover:text-white">Nuestra Escuela</Link></li>
              <li><Link href="/niveles/inicial" className="hover:text-white">Nivel Inicial</Link></li>
              <li><Link href="/niveles/primario" className="hover:text-white">Nivel Primario</Link></li>
              <li><Link href="/niveles/secundario" className="hover:text-white">Nivel Secundario</Link></li>
              <li><Link href="/noticias" className="hover:text-white">Noticias</Link></li>
              <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-blue-200">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Asturias 1935, Barrio Colón, Córdoba
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                secretaria@ipsanpablo.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-blue-700 text-center text-xs text-blue-300">
          © {new Date().getFullYear()} Instituto Parroquial San Pablo Apóstol. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

export default Footer

import { prisma } from '@/lib/prisma'
import ConfigForm from '@/components/admin/ConfigForm'

const ConfiguracionPage = async () => {
  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } })

  const defaults = {
    schoolName: config?.schoolName ?? 'Instituto Parroquial San Pablo Apóstol',
    phone: config?.phone ?? '',
    email: config?.email ?? '',
    address: config?.address ?? '',
    logoUrl: config?.logoUrl ?? null,
    heroTitle: config?.heroTitle ?? '',
    heroSubtitle: config?.heroSubtitle ?? '',
    heroImageUrl: config?.heroImageUrl ?? null,
    facebookUrl: config?.facebookUrl ?? null,
    instagramUrl: config?.instagramUrl ?? null,
    whatsappNumber: config?.whatsappNumber ?? null,
    inscripcionOpen: config?.inscripcionOpen ?? false,
    inscripcionText: config?.inscripcionText ?? '',
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración del sitio</h1>
        <p className="text-gray-500 text-sm mt-1">
          Estos datos se muestran en todo el sitio público.
        </p>
      </div>
      <ConfigForm config={defaults} />
    </div>
  )
}

export default ConfiguracionPage

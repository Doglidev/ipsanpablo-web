import { prisma } from '@/lib/prisma'
import HomeButtonsEditor from '@/components/admin/HomeButtonsEditor'

const BotonesHomePage = async () => {
  const buttons = await prisma.homeButton.findMany({
    orderBy: { sortOrder: 'asc' },
  }).catch(() => [])

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Botones del home</h1>
        <p className="text-gray-500 text-sm mt-1">
          Administrá los botones de descarga que aparecen en la página principal.
          Podés cambiar el nombre, el archivo adjunto, el color y el orden.
        </p>
      </div>
      <HomeButtonsEditor initialButtons={buttons} />
    </div>
  )
}

export default BotonesHomePage

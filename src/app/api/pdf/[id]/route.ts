// LEGACY: sirve PDFs que quedaron guardados en la base (modelo StoredPdf).
// Las subidas nuevas van a Cloudinary (ver src/lib/actions/upload-pdf.ts).
// Se mantiene esta ruta para no romper los botones del home que todavía
// apuntan a /api/pdf/<id>.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pdf = await prisma.storedPdf.findUnique({ where: { id } })
  if (!pdf) return new NextResponse('Not found', { status: 404 })

  const safeName = pdf.fileName.replace(/[^a-zA-Z0-9.\-_ ]/g, '').trim() || 'documento.pdf'

  return new NextResponse(pdf.data as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${safeName}"`,
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

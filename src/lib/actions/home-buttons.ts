'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types'

export interface HomeButtonInput {
  label: string
  fileUrl: string
  downloadName: string
  color: string
  sortOrder: number
  isVisible: boolean
}

export async function saveHomeButtons(buttons: HomeButtonInput[]): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return { success: false, error: 'No autorizado' }

    await prisma.$transaction(async (tx) => {
      await tx.homeButton.deleteMany()
      if (buttons.length > 0) {
        await tx.homeButton.createMany({
          data: buttons.map((b, i) => ({
            label: b.label.trim(),
            fileUrl: b.fileUrl.trim(),
            downloadName: b.downloadName.trim(),
            color: b.color,
            sortOrder: i,
            isVisible: b.isVisible,
          })),
        })
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/botones-home')
    return { success: true }
  } catch {
    return { success: false, error: 'Error al guardar los botones' }
  }
}

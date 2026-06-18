'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireEditor, authErrorResult } from '@/lib/auth-guards'
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
    await requireEditor()

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
  } catch (e) {
    return authErrorResult(e) ?? { success: false, error: 'Error al guardar los botones' }
  }
}

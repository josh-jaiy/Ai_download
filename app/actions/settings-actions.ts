"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { z } from "zod"

const settingsSchema = z.object({
  downloadPath: z.string(),
  maxConcurrentDownloads: z.number().min(1).max(20),
  maxThreadsPerDownload: z.number().min(1).max(16),
  maxBandwidth: z.number().nullable(),
  autoStartDownloads: z.boolean(),
  autoExtractArchives: z.boolean(),
  notifyOnComplete: z.boolean(),
  defaultVideoQuality: z.string(),
  encryptionEnabled: z.boolean(),
  encryptionMethod: z.string().optional(),
  cloudSyncEnabled: z.boolean(),
  cloudProvider: z.string().optional(),
  cloudAutoUpload: z.boolean(),
  adaptiveBandwidth: z.boolean(),
})

export async function getSettings() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  try {
    const settings = await prisma.settings.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!settings) {
      // Create default settings if they don't exist
      const defaultSettings = await prisma.settings.create({
        data: {
          userId: session.user.id,
        },
      })

      return { settings: defaultSettings }
    }

    return { settings }
  } catch (error) {
    console.error("Error fetching settings:", error)
    return { error: "Failed to fetch settings" }
  }
}

export async function updateSettings(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  try {
    const data = {
      downloadPath: formData.get("downloadPath") as string,
      maxConcurrentDownloads: Number(formData.get("maxConcurrentDownloads")),
      maxThreadsPerDownload: Number(formData.get("maxThreadsPerDownload")),
      maxBandwidth: formData.get("maxBandwidth") ? Number(formData.get("maxBandwidth")) : null,
      autoStartDownloads: formData.get("autoStartDownloads") === "true",
      autoExtractArchives: formData.get("autoExtractArchives") === "true",
      notifyOnComplete: formData.get("notifyOnComplete") === "true",
      defaultVideoQuality: formData.get("defaultVideoQuality") as string,
      encryptionEnabled: formData.get("encryptionEnabled") === "true",
      encryptionMethod: formData.get("encryptionMethod") as string,
      cloudSyncEnabled: formData.get("cloudSyncEnabled") === "true",
      cloudProvider: formData.get("cloudProvider") as string,
      cloudAutoUpload: formData.get("cloudAutoUpload") === "true",
      adaptiveBandwidth: formData.get("adaptiveBandwidth") === "true",
    }

    const validatedData = settingsSchema.parse(data)

    // Check if settings exist
    const existingSettings = await prisma.settings.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (existingSettings) {
      // Update existing settings
      await prisma.settings.update({
        where: {
          userId: session.user.id,
        },
        data: validatedData,
      })
    } else {
      // Create new settings
      await prisma.settings.create({
        data: {
          userId: session.user.id,
          ...validatedData,
        },
      })
    }

    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Error updating settings:", error)
    return { error: "Failed to update settings" }
  }
}

"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { z } from "zod"

const cloudCredentialSchema = z.object({
  provider: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresAt: z.string().optional(),
})

export async function connectCloudProvider(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  try {
    const data = {
      provider: formData.get("provider") as string,
      accessToken: formData.get("accessToken") as string,
      refreshToken: (formData.get("refreshToken") as string) || undefined,
      expiresAt: (formData.get("expiresAt") as string) || undefined,
    }

    const validatedData = cloudCredentialSchema.parse(data)

    // Check if credentials exist
    const existingCredentials = await prisma.cloudCredential.findFirst({
      where: {
        userId: session.user.id,
        provider: validatedData.provider,
      },
    })

    if (existingCredentials) {
      // Update existing credentials
      await prisma.cloudCredential.update({
        where: {
          id: existingCredentials.id,
        },
        data: {
          accessToken: validatedData.accessToken,
          refreshToken: validatedData.refreshToken,
          expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        },
      })
    } else {
      // Create new credentials
      await prisma.cloudCredential.create({
        data: {
          userId: session.user.id,
          provider: validatedData.provider,
          accessToken: validatedData.accessToken,
          refreshToken: validatedData.refreshToken,
          expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        },
      })
    }

    // Update user settings to enable cloud sync
    const userSettings = await prisma.settings.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (userSettings) {
      await prisma.settings.update({
        where: {
          userId: session.user.id,
        },
        data: {
          cloudSyncEnabled: true,
          cloudProvider: validatedData.provider,
        },
      })
    } else {
      await prisma.settings.create({
        data: {
          userId: session.user.id,
          cloudSyncEnabled: true,
          cloudProvider: validatedData.provider,
        },
      })
    }

    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Error connecting cloud provider:", error)
    return { error: "Failed to connect cloud provider" }
  }
}

export async function disconnectCloudProvider(provider: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  try {
    // Delete credentials
    await prisma.cloudCredential.deleteMany({
      where: {
        userId: session.user.id,
        provider,
      },
    })

    // Update user settings
    const userSettings = await prisma.settings.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (userSettings && userSettings.cloudProvider === provider) {
      await prisma.settings.update({
        where: {
          userId: session.user.id,
        },
        data: {
          cloudSyncEnabled: false,
          cloudProvider: null,
        },
      })
    }

    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Error disconnecting cloud provider:", error)
    return { error: "Failed to disconnect cloud provider" }
  }
}

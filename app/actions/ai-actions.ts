"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { startDownload } from "@/lib/download-engine"
import { processUserMessage } from "@/lib/ai"

export async function processAIRequest(message: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  try {
    // Use our AI utility to process the message
    const aiResponse = await processUserMessage(message)

    if (aiResponse.isDownloadRequest && aiResponse.downloadInfo) {
      // Create a download
      const download = await prisma.download.create({
        data: {
          url: aiResponse.downloadInfo.url,
          name: aiResponse.downloadInfo.name,
          size: 0, // Will be updated when download starts
          status: "queued",
          source: aiResponse.downloadInfo.source,
          type: aiResponse.downloadInfo.type,
          userId: session.user.id,
        },
      })

      // Get user settings
      const userSettings = await prisma.settings.findUnique({
        where: {
          userId: session.user.id,
        },
      })

      // Start download if auto-start is enabled
      if (userSettings?.autoStartDownloads) {
        startDownload(download.id)
      }

      revalidatePath("/downloads")

      return {
        success: true,
        isDownloadRequest: true,
        download,
        response: aiResponse.response,
        suggestedActions: aiResponse.suggestedActions,
      }
    }

    return {
      success: true,
      isDownloadRequest: false,
      response: aiResponse.response,
      suggestedActions: aiResponse.suggestedActions,
    }
  } catch (error) {
    console.error("Error processing AI request:", error)
    return {
      error: "Failed to process request",
      response: "I'm sorry, I couldn't process your request. Please try again.",
    }
  }
}

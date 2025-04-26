import fs from "fs"
import path from "path"
import { pipeline } from "stream/promises"
import fetch from "node-fetch"
import prisma from "./prisma"
import { getFileTypeFromUrl, getSourceFromUrl } from "./utils"
import { encryptFile } from "./encryption"
import { uploadToCloud } from "./cloud-storage"
import { Transform } from "stream"

// Map to track active downloads
const activeDownloads = new Map()

export async function startDownload(downloadId: string) {
  try {
    // Get download from database
    const download = await prisma.download.findUnique({
      where: { id: downloadId },
      include: {
        user: {
          include: {
            settings: true,
          },
        },
      },
    })

    if (!download) {
      throw new Error("Download not found")
    }

    if (download.status !== "queued") {
      throw new Error(`Download is already ${download.status}`)
    }

    // Update download status to downloading
    await prisma.download.update({
      where: { id: downloadId },
      data: {
        status: "downloading",
        startedAt: new Date(),
      },
    })

    // Get file info
    const response = await fetch(download.url, { method: "HEAD" })
    const contentLength = Number.parseInt(response.headers.get("content-length") || "0", 10)
    const contentType = response.headers.get("content-type") || ""

    // Update download with file size and type
    await prisma.download.update({
      where: { id: downloadId },
      data: {
        size: contentLength,
        type: getFileTypeFromUrl(download.url, contentType),
        source: getSourceFromUrl(download.url),
      },
    })

    // Determine number of threads to use
    const maxThreads = download.user.settings?.maxThreadsPerDownload || 4
    const useThreads = contentLength > 1024 * 1024 && maxThreads > 1 // Only use threads for files > 1MB

    if (useThreads) {
      await startMultiThreadedDownload(downloadId, contentLength, maxThreads)
    } else {
      await startSingleThreadedDownload(downloadId)
    }

    return true
  } catch (error) {
    console.error("Error starting download:", error)

    // Update download status to failed
    await prisma.download.update({
      where: { id: downloadId },
      data: {
        status: "failed",
        progress: 0,
      },
    })

    return false
  }
}

async function startSingleThreadedDownload(downloadId: string) {
  try {
    const download = await prisma.download.findUnique({
      where: { id: downloadId },
      include: { user: { include: { settings: true } } },
    })

    if (!download) {
      throw new Error("Download not found")
    }

    // Create download directory if it doesn't exist
    const downloadPath = download.user.settings?.downloadPath || "~/Downloads"
    const expandedPath = downloadPath.replace("~", process.env.HOME || process.env.USERPROFILE || "")
    const filePath = path.join(expandedPath, download.name)

    if (!fs.existsSync(expandedPath)) {
      fs.mkdirSync(expandedPath, { recursive: true })
    }

    // Start download
    const response = await fetch(download.url)
    const fileStream = fs.createWriteStream(filePath)
    const contentLength = Number.parseInt(response.headers.get("content-length") || "0", 10)

    let downloadedBytes = 0
    let lastUpdateTime = Date.now()
    let lastDownloadedBytes = 0

    // Create download controller
    const controller = {
      paused: false,
      cancelled: false,
    }

    // Add to active downloads
    activeDownloads.set(downloadId, controller)

    // Set up progress tracking
    const progressTracker = new Transform({
      transform(chunk, encoding, callback) {
        if (controller.cancelled) {
          return callback(new Error("Download cancelled"))
        }

        if (controller.paused) {
          return // Don't process chunks when paused
        }

        downloadedBytes += chunk.length

        // Update progress every second
        const now = Date.now()
        if (now - lastUpdateTime > 1000) {
          const progress = contentLength ? (downloadedBytes / contentLength) * 100 : 0
          const speed = (downloadedBytes - lastDownloadedBytes) / ((now - lastUpdateTime) / 1000)

          // Update download in database
          prisma.download
            .update({
              where: { id: downloadId },
              data: {
                progress,
                speed,
                filePath,
              },
            })
            .catch(console.error)

          lastUpdateTime = now
          lastDownloadedBytes = downloadedBytes
        }

        this.push(chunk)
        callback()
      },
    })

    // Start the download
    await pipeline(response.body, progressTracker, fileStream)

    // Download completed
    await prisma.download.update({
      where: { id: downloadId },
      data: {
        status: "completed",
        progress: 100,
        completedAt: new Date(),
        filePath,
      },
    })

    // Remove from active downloads
    activeDownloads.delete(downloadId)

    // Handle post-download actions
    await handlePostDownload(downloadId)

    return true
  } catch (error) {
    console.error("Error in single-threaded download:", error)

    // Update download status based on error
    const status = error.message === "Download cancelled" ? "cancelled" : "failed"

    await prisma.download.update({
      where: { id: downloadId },
      data: { status },
    })

    // Remove from active downloads
    activeDownloads.delete(downloadId)

    return false
  }
}

async function startMultiThreadedDownload(downloadId: string, contentLength: number, maxThreads: number) {
  try {
    const download = await prisma.download.findUnique({
      where: { id: downloadId },
      include: { user: { include: { settings: true } } },
    })

    if (!download) {
      throw new Error("Download not found")
    }

    // Create download directory if it doesn't exist
    const downloadPath = download.user.settings?.downloadPath || "~/Downloads"
    const expandedPath = downloadPath.replace("~", process.env.HOME || process.env.USERPROFILE || "")
    const tempDir = path.join(expandedPath, ".temp", downloadId)
    const filePath = path.join(expandedPath, download.name)

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Calculate chunk size for each thread
    const chunkSize = Math.ceil(contentLength / maxThreads)

    // Create download controller
    const controller = {
      paused: false,
      cancelled: false,
      completedThreads: 0,
    }

    // Add to active downloads
    activeDownloads.set(downloadId, controller)

    // Create threads in database
    const threads = []
    for (let i = 0; i < maxThreads; i++) {
      const startByte = i * chunkSize
      const endByte = Math.min((i + 1) * chunkSize - 1, contentLength - 1)

      const thread = await prisma.downloadThread.create({
        data: {
          downloadId,
          startByte,
          endByte,
          status: "active",
        },
      })

      threads.push(thread)
    }

    // Start all threads
    const threadPromises = threads.map((thread) =>
      downloadThread(downloadId, thread.id, download.url, tempDir, controller),
    )

    // Wait for all threads to complete
    await Promise.all(threadPromises)

    // If download was cancelled, don't proceed
    if (controller.cancelled) {
      return false
    }

    // Merge all chunks into final file
    await mergeChunks(downloadId, tempDir, filePath, threads.length)

    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true })

    // Update download status
    await prisma.download.update({
      where: { id: downloadId },
      data: {
        status: "completed",
        progress: 100,
        completedAt: new Date(),
        filePath,
      },
    })

    // Remove from active downloads
    activeDownloads.delete(downloadId)

    // Handle post-download actions
    await handlePostDownload(downloadId)

    return true
  } catch (error) {
    console.error("Error in multi-threaded download:", error)

    // Update download status based on error
    const status = error.message === "Download cancelled" ? "cancelled" : "failed"

    await prisma.download.update({
      where: { id: downloadId },
      data: { status },
    })

    // Remove from active downloads
    activeDownloads.delete(downloadId)

    return false
  }
}

async function downloadThread(downloadId: string, threadId: string, url: string, tempDir: string, controller: any) {
  try {
    const thread = await prisma.downloadThread.findUnique({
      where: { id: threadId },
    })

    if (!thread) {
      throw new Error("Thread not found")
    }

    const chunkPath = path.join(tempDir, `chunk-${thread.id}`)
    const fileStream = fs.createWriteStream(chunkPath)

    // Request specific byte range
    const response = await fetch(url, {
      headers: {
        Range: `bytes=${thread.startByte}-${thread.endByte}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to download chunk: ${response.status} ${response.statusText}`)
    }

    const contentLength = thread.endByte - thread.startByte + 1
    let downloadedBytes = 0
    let lastUpdateTime = Date.now()
    let lastDownloadedBytes = 0

    // Set up progress tracking
    const progressTracker = new Transform({
      transform(chunk, encoding, callback) {
        if (controller.cancelled) {
          return callback(new Error("Download cancelled"))
        }

        if (controller.paused) {
          return // Don't process chunks when paused
        }

        downloadedBytes += chunk.length

        // Update progress every second
        const now = Date.now()
        if (now - lastUpdateTime > 1000) {
          const progress = contentLength ? (downloadedBytes / contentLength) * 100 : 0
          const speed = (downloadedBytes - lastDownloadedBytes) / ((now - lastUpdateTime) / 1000)

          // Update thread in database
          prisma.downloadThread
            .update({
              where: { id: threadId },
              data: {
                progress,
                speed,
              },
            })
            .catch(console.error)

          // Update overall download progress
          updateDownloadProgress(downloadId).catch(console.error)

          lastUpdateTime = now
          lastDownloadedBytes = downloadedBytes
        }

        this.push(chunk)
        callback()
      },
    })

    // Start the download
    await pipeline(response.body, progressTracker, fileStream)

    // Thread completed
    await prisma.downloadThread.update({
      where: { id: threadId },
      data: {
        status: "completed",
        progress: 100,
      },
    })

    controller.completedThreads++

    return true
  } catch (error) {
    console.error(`Error in thread ${threadId}:`, error)

    // Update thread status based on error
    const status = error.message === "Download cancelled" ? "cancelled" : "error"

    await prisma.downloadThread.update({
      where: { id: threadId },
      data: { status },
    })

    return false
  }
}

async function mergeChunks(downloadId: string, tempDir: string, outputPath: string, numChunks: number) {
  const outputStream = fs.createWriteStream(outputPath)

  for (let i = 0; i < numChunks; i++) {
    const thread = await prisma.downloadThread.findFirst({
      where: {
        downloadId,
        status: "completed",
      },
      orderBy: {
        startByte: "asc",
      },
      skip: i,
    })

    if (!thread) {
      throw new Error(`Missing chunk ${i}`)
    }

    const chunkPath = path.join(tempDir, `chunk-${thread.id}`)
    const chunkStream = fs.createReadStream(chunkPath)

    await pipeline(chunkStream, outputStream, { end: false })
  }

  outputStream.end()
}

async function updateDownloadProgress(downloadId: string) {
  const threads = await prisma.downloadThread.findMany({
    where: { downloadId },
  })

  if (threads.length === 0) return

  // Calculate overall progress and speed
  const totalProgress = threads.reduce((sum, thread) => sum + thread.progress, 0) / threads.length
  const totalSpeed = threads.reduce((sum, thread) => sum + (thread.speed || 0), 0)

  // Update download
  await prisma.download.update({
    where: { id: downloadId },
    data: {
      progress: totalProgress,
      speed: totalSpeed,
    },
  })
}

export async function pauseDownload(downloadId: string) {
  const controller = activeDownloads.get(downloadId)

  if (!controller) {
    throw new Error("Download not active")
  }

  controller.paused = true

  // Update download status
  await prisma.download.update({
    where: { id: downloadId },
    data: { status: "paused" },
  })

  // Update thread statuses
  await prisma.downloadThread.updateMany({
    where: {
      downloadId,
      status: "active",
    },
    data: { status: "paused" },
  })

  return true
}

export async function resumeDownload(downloadId: string) {
  const controller = activeDownloads.get(downloadId)

  if (controller) {
    // Download is still in memory, just unpause it
    controller.paused = false

    // Update download status
    await prisma.download.update({
      where: { id: downloadId },
      data: { status: "downloading" },
    })

    // Update thread statuses
    await prisma.downloadThread.updateMany({
      where: {
        downloadId,
        status: "paused",
      },
      data: { status: "active" },
    })

    return true
  } else {
    // Download needs to be restarted
    const download = await prisma.download.findUnique({
      where: { id: downloadId },
    })

    if (!download) {
      throw new Error("Download not found")
    }

    if (download.status !== "paused") {
      throw new Error(`Download is not paused (${download.status})`)
    }

    // Restart the download
    return startDownload(downloadId)
  }
}

export async function cancelDownload(downloadId: string) {
  const controller = activeDownloads.get(downloadId)

  if (controller) {
    controller.cancelled = true

    // Update download status
    await prisma.download.update({
      where: { id: downloadId },
      data: { status: "cancelled" },
    })

    // Update thread statuses
    await prisma.downloadThread.updateMany({
      where: {
        downloadId,
        status: { in: ["active", "paused"] },
      },
      data: { status: "cancelled" },
    })

    // Remove from active downloads
    activeDownloads.delete(downloadId)
  } else {
    // Download is not active, just update the status
    await prisma.download.update({
      where: { id: downloadId },
      data: { status: "cancelled" },
    })
  }

  return true
}

async function handlePostDownload(downloadId: string) {
  const download = await prisma.download.findUnique({
    where: { id: downloadId },
    include: { user: { include: { settings: true } } },
  })

  if (!download || !download.filePath) return

  // Handle encryption if enabled
  if (download.user.settings?.encryptionEnabled) {
    try {
      const encryptionMethod = download.user.settings.encryptionMethod || "password"
      const encryptionKey = download.user.settings.encryptionKey || ""

      await encryptFile(download.filePath, encryptionMethod, encryptionKey)

      await prisma.download.update({
        where: { id: downloadId },
        data: { encryptionMethod, encryptionKey },
      })

      await prisma.download.update({
        where: { id: downloadId },
        data: { encrypted: true },
      })
    } catch (error) {
      console.error("Error encrypting file:", error)
    }
  }

  // Handle cloud sync if enabled
  if (download.user.settings?.cloudSyncEnabled && download.user.settings?.cloudProvider) {
    try {
      const cloudProvider = download.user.settings.cloudProvider
      const cloudPath = await uploadToCloud(download.filePath, cloudProvider, download.user.id)

      if (cloudPath) {
        await prisma.download.update({
          where: { id: downloadId },
          data: {
            cloudSynced: true,
            cloudPath,
          },
        })
      }
    } catch (error) {
      console.error("Error uploading to cloud:", error)
    }
  }
}

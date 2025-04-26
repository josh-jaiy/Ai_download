import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { pauseDownload, resumeDownload, cancelDownload } from "@/lib/download-engine"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const download = await prisma.download.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      threads: true,
    },
  })

  if (!download) {
    return NextResponse.json({ error: "Download not found" }, { status: 404 })
  }

  return NextResponse.json(download)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const download = await prisma.download.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!download) {
    return NextResponse.json({ error: "Download not found" }, { status: 404 })
  }

  const body = await req.json()
  const { action } = body

  try {
    switch (action) {
      case "pause":
        await pauseDownload(download.id)
        break
      case "resume":
        await resumeDownload(download.id)
        break
      case "cancel":
        await cancelDownload(download.id)
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const updatedDownload = await prisma.download.findUnique({
      where: {
        id: params.id,
      },
      include: {
        threads: true,
      },
    })

    return NextResponse.json(updatedDownload)
  } catch (error) {
    console.error(`Error performing ${action} on download:`, error)
    return NextResponse.json({ error: `Failed to ${action} download` }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const download = await prisma.download.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!download) {
    return NextResponse.json({ error: "Download not found" }, { status: 404 })
  }

  try {
    // Cancel download if it's active
    if (["queued", "downloading", "paused"].includes(download.status)) {
      await cancelDownload(download.id)
    }

    // Delete the file if it exists
    if (download.filePath) {
      // In a real implementation, you would delete the file from the filesystem
      console.log(`Deleting file: ${download.filePath}`)
    }

    // Delete the download record
    await prisma.download.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting download:", error)
    return NextResponse.json({ error: "Failed to delete download" }, { status: 500 })
  }
}

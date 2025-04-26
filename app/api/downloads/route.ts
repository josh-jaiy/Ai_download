import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { startDownload } from "@/lib/download-engine"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const source = searchParams.get("source")
  const search = searchParams.get("search")

  const where: any = {
    userId: session.user.id,
  }

  if (status && status !== "all") {
    where.status = status
  }

  if (source && source !== "all") {
    where.source = source
  }

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    }
  }

  const downloads = await prisma.download.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      threads: true,
    },
  })

  return NextResponse.json(downloads)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { url, name, source, type } = body

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    // Get user settings
    const userSettings = await prisma.settings.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    // Create download record
    const download = await prisma.download.create({
      data: {
        url,
        name: name || url.split("/").pop() || "Unknown",
        size: 0, // Will be updated when download starts
        status: "queued",
        source: source || "other",
        type: type || "other",
        userId: session.user.id,
      },
    })

    // Start download if auto-start is enabled
    if (userSettings?.autoStartDownloads) {
      startDownload(download.id)
    }

    return NextResponse.json(download)
  } catch (error) {
    console.error("Error creating download:", error)
    return NextResponse.json({ error: "Failed to create download" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { extractInfoFromUrl } from "@/lib/ai"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const downloadInfo = await extractInfoFromUrl(url)

    if (!downloadInfo) {
      return NextResponse.json({ error: "Could not analyze URL" }, { status: 400 })
    }

    return NextResponse.json({ downloadInfo })
  } catch (error) {
    console.error("Error analyzing URL:", error)
    return NextResponse.json({ error: "Failed to analyze URL" }, { status: 500 })
  }
}

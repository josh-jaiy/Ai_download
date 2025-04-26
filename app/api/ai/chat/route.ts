import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { streamAIResponse } from "@/lib/ai"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { message, conversationId } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get or create conversation
    let conversation
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId, userId: session.user.id },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      })

      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }
    } else {
      conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
        },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      })
    }

    // Add user message to database
    const userMessage = await prisma.message.create({
      data: {
        content: message,
        role: "user",
        conversationId: conversation.id,
      },
    })

    // Prepare history for AI
    const history = conversation.messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      role: msg.role as "user" | "assistant",
      timestamp: msg.createdAt,
    }))

    // Create a stream response
    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    // Start streaming AI response
    streamAIResponse(message, history, async (chunk) => {
      await writer.write(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
    })
      .then(async (fullResponse) => {
        // Save AI response to database
        await prisma.message.create({
          data: {
            content: fullResponse,
            role: "assistant",
            conversationId: conversation.id,
          },
        })

        await writer.write(encoder.encode("data: [DONE]\n\n"))
        await writer.close()
      })
      .catch(async (error) => {
        console.error("Error in AI stream:", error)
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`))
        await writer.close()
      })

    return new NextResponse(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error in AI chat route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

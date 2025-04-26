import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name } = profileSchema.parse(body)

    // Update user
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    })

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Profile update error:", error)
    return NextResponse.json({ error: "An error occurred while updating profile" }, { status: 500 })
  }
}

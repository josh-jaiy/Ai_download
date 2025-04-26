import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashToken } from "@/lib/token"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 })
    }

    const hashedToken = hashToken(token)

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: hashedToken,
        verificationTokenExpires: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    })

    return NextResponse.json({ message: "Email verified successfully" })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "An error occurred during verification" }, { status: 500 })
  }
}

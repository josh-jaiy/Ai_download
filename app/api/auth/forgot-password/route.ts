import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { createResetToken } from "@/lib/token"
import { sendPasswordResetEmail } from "@/lib/email"

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = emailSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json({ message: "If your email is registered, you will receive a password reset link" })
    }

    // Create reset token
    const { token, hashedToken, expires } = createResetToken(email)

    // Update user with reset token
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpires: expires,
      },
    })

    // Send password reset email
    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ message: "If your email is registered, you will receive a password reset link" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "An error occurred during password reset request" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createVerificationToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/email"
import { z } from "zod"

const resendSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = resendSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json({ message: "If your email exists, a verification link has been sent" })
    }

    // If user is already verified, no need to resend
    if (user.emailVerified) {
      return NextResponse.json({ message: "Your email is already verified" })
    }

    // Create new verification token
    const { token, hashedToken, expires } = createVerificationToken(email)

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: hashedToken,
        verificationTokenExpires: expires,
      },
    })

    // Send verification email
    await sendVerificationEmail(email, token)

    return NextResponse.json({ message: "Verification email has been resent" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "An error occurred while resending verification email" }, { status: 500 })
  }
}

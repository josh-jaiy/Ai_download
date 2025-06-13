import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { verifyResetToken } from "@/lib/token"

const resetSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = resetSchema.parse(body)

    // Verify token
    const result = await verifyResetToken(token)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await hash(password, 10)

    // Update user password
    await prisma.user.update({
      where: { email: result.email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    })

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Password reset error:", error)
    return NextResponse.json({ error: "An error occurred during password reset" }, { status: 500 })
  }
}

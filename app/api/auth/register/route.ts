import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { createVerificationToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/email"

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = userSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create verification token
    const { token, hashedToken, expires } = createVerificationToken(email)

    // Create user with emailVerified set to null (unverified)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
        verificationToken: hashedToken,
        verificationTokenExpires: expires,
      },
    })

    // Create default settings for the user
    await prisma.settings.create({
      data: {
        userId: user.id,
      },
    })

    // Send verification email
    await sendVerificationEmail(email, token)

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email to verify your account.",
        verified: false,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}

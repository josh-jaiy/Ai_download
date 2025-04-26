import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: "AI Download Manager <verification@aidownloadmanager.com>",
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Verify your email address</h2>
          <p>Thank you for registering with AI Download Manager. Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
          <p>Or copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create an account, you can safely ignore this email.</p>
        </div>
      `,
    })

    if (error) {
      console.error("Error sending verification email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending verification email:", error)
    return { success: false, error }
  }
}

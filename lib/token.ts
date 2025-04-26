import { randomBytes, createHash } from "crypto"

// Generate a random token
export function generateToken(): string {
  return randomBytes(32).toString("hex")
}

// Hash a token for storage
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

// Create a verification token with expiry
export function createVerificationToken(email: string): {
  token: string
  hashedToken: string
  expires: Date
} {
  const token = generateToken()
  const hashedToken = hashToken(token)

  // Token expires in 24 hours
  const expires = new Date()
  expires.setHours(expires.getHours() + 24)

  return {
    token,
    hashedToken,
    expires,
  }
}

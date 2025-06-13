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

// Create a password reset token with expiry
export function createResetToken(email: string): {
  token: string
  hashedToken: string
  expires: Date
} {
  const token = generateToken()
  const hashedToken = hashToken(token)

  // Reset token expires in 1 hour
  const expires = new Date()
  expires.setHours(expires.getHours() + 1)

  return {
    token,
    hashedToken,
    expires,
  }
}

// Verify if a reset token is valid and not expired
export function verifyResetToken(token: string, hashedToken: string, expires: Date): boolean {
  // Check if token is valid
  const isValid = hashToken(token) === hashedToken

  // Check if token is expired
  const isExpired = new Date() > expires

  return isValid && !isExpired
}

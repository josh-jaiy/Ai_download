import { hash, compare } from "bcryptjs"
import prisma from "./prisma"

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  const hashedPassword = await hashPassword(newPassword)
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  })
}

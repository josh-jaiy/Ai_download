import fs from "fs"
import crypto from "crypto"
import { promisify } from "util"

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

// Encrypt a file using AES-256-GCM
export async function encryptFile(filePath: string, method: string, encryptionKey: string): Promise<string> {
  try {
    // Read the file
    const fileData = await readFile(filePath)

    // Generate a random initialization vector
    const iv = crypto.randomBytes(16)

    // Derive encryption key from the provided key/password
    const key = crypto.scryptSync(encryptionKey, "salt", 32)

    // Create cipher
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)

    // Encrypt the file
    const encryptedData = Buffer.concat([cipher.update(fileData), cipher.final()])

    // Get the auth tag
    const authTag = cipher.getAuthTag()

    // Create the final encrypted file format
    // Format: IV (16 bytes) + Auth Tag (16 bytes) + Encrypted Data
    const encryptedFile = Buffer.concat([iv, authTag, encryptedData])

    // Write the encrypted file
    const encryptedFilePath = `${filePath}.enc`
    await writeFile(encryptedFilePath, encryptedFile)

    // Delete the original file
    fs.unlinkSync(filePath)

    return encryptedFilePath
  } catch (error) {
    console.error("Error encrypting file:", error)
    throw error
  }
}

// Decrypt a file
export async function decryptFile(filePath: string, method: string, encryptionKey: string): Promise<string> {
  try {
    // Check if file is encrypted
    if (!filePath.endsWith(".enc")) {
      throw new Error("File is not encrypted")
    }

    // Read the encrypted file
    const encryptedFile = await readFile(filePath)

    // Extract IV, auth tag, and encrypted data
    const iv = encryptedFile.subarray(0, 16)
    const authTag = encryptedFile.subarray(16, 32)
    const encryptedData = encryptedFile.subarray(32)

    // Derive decryption key
    const key = crypto.scryptSync(encryptionKey, "salt", 32)

    // Create decipher
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(authTag)

    // Decrypt the file
    const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()])

    // Write the decrypted file
    const decryptedFilePath = filePath.slice(0, -4) // Remove .enc extension
    await writeFile(decryptedFilePath, decryptedData)

    return decryptedFilePath
  } catch (error) {
    console.error("Error decrypting file:", error)
    throw error
  }
}

import fs from "fs"
import path from "path"
import { google } from "googleapis"
import { Dropbox } from "dropbox"
import fetch from "node-fetch"
import prisma from "./prisma"

// Upload file to cloud storage
export async function uploadToCloud(filePath: string, provider: string, userId: string): Promise<string | null> {
  try {
    // Get cloud credentials
    const credentials = await prisma.cloudCredential.findFirst({
      where: {
        userId,
        provider,
      },
    })

    if (!credentials) {
      throw new Error(`No credentials found for ${provider}`)
    }

    // Get file name and read file
    const fileName = path.basename(filePath)
    const fileData = fs.readFileSync(filePath)

    switch (provider) {
      case "google-drive":
        return uploadToGoogleDrive(fileName, fileData, credentials)
      case "dropbox":
        return uploadToDropbox(fileName, fileData, credentials)
      case "onedrive":
        return uploadToOneDrive(fileName, fileData, credentials)
      default:
        throw new Error(`Unsupported cloud provider: ${provider}`)
    }
  } catch (error) {
    console.error("Error uploading to cloud:", error)
    return null
  }
}

async function uploadToGoogleDrive(fileName: string, fileData: Buffer, credentials: any): Promise<string | null> {
  try {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
    })

    const drive = google.drive({ version: "v3", auth })

    // Upload file
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: "application/octet-stream",
      },
      media: {
        mimeType: "application/octet-stream",
        body: fileData,
      },
    })

    if (response.data.id) {
      return `https://drive.google.com/file/d/${response.data.id}/view`
    }

    return null
  } catch (error) {
    console.error("Error uploading to Google Drive:", error)
    return null
  }
}

async function uploadToDropbox(fileName: string, fileData: Buffer, credentials: any): Promise<string | null> {
  try {
    const dbx = new Dropbox({ accessToken: credentials.accessToken })

    // Upload file
    const response = await dbx.filesUpload({
      path: `/${fileName}`,
      contents: fileData,
    })

    if (response.result.path_display) {
      return response.result.path_display
    }

    return null
  } catch (error) {
    console.error("Error uploading to Dropbox:", error)
    return null
  }
}

async function uploadToOneDrive(fileName: string, fileData: Buffer, credentials: any): Promise<string | null> {
  try {
    // OneDrive API endpoint
    const endpoint = "https://graph.microsoft.com/v1.0/me/drive/root:/"

    // Upload file
    const response = await fetch(`${endpoint}${fileName}:/content`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/octet-stream",
      },
      body: fileData,
    })

    if (response.ok) {
      const data = await response.json()
      return data.webUrl
    }

    return null
  } catch (error) {
    console.error("Error uploading to OneDrive:", error)
    return null
  }
}

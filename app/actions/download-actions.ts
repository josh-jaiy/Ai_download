"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function getDownloads() {
  try {
    const downloads = await sql`
      SELECT d.*, 
        json_agg(dt.*) as threads
      FROM "Download" d
      LEFT JOIN "DownloadThread" dt ON d.id = dt.downloadId
      GROUP BY d.id
      ORDER BY d.createdAt DESC
    `

    return { downloads }
  } catch (error) {
    console.error("Error fetching downloads:", error)
    return { error: "Failed to fetch downloads" }
  }
}

export async function updateDownloadStatus(id: string, action: string) {
  try {
    let status
    const updatedAt = new Date()
    let completedAt = null

    switch (action) {
      case "pause":
        status = "paused"
        break
      case "resume":
        status = "downloading"
        break
      case "cancel":
        status = "cancelled"
        break
      case "complete":
        status = "completed"
        completedAt = updatedAt
        break
      default:
        throw new Error("Invalid action")
    }

    await sql`
      UPDATE "Download"
      SET status = ${status}, updatedAt = ${updatedAt}, completedAt = ${completedAt}
      WHERE id = ${id}
    `

    if (action === "pause" || action === "cancel") {
      await sql`
        UPDATE "DownloadThread"
        SET status = ${status === "paused" ? "paused" : "cancelled"}, updatedAt = ${updatedAt}
        WHERE downloadId = ${id} AND status = 'active'
      `
    } else if (action === "resume") {
      await sql`
        UPDATE "DownloadThread"
        SET status = 'active', updatedAt = ${updatedAt}
        WHERE downloadId = ${id} AND status = 'paused'
      `
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating download status:", error)
    return { error: "Failed to update download status" }
  }
}

export async function deleteDownload(id: string) {
  try {
    // First delete related threads
    await sql`
      DELETE FROM "DownloadThread"
      WHERE downloadId = ${id}
    `

    // Then delete the download
    await sql`
      DELETE FROM "Download"
      WHERE id = ${id}
    `

    return { success: true }
  } catch (error) {
    console.error("Error deleting download:", error)
    return { error: "Failed to delete download" }
  }
}

export async function addDownload(url: string, name: string, size: number, type: string) {
  try {
    const id = `dl_${Date.now()}`
    const now = new Date()

    const download = await sql`
      INSERT INTO "Download" (
        id, url, name, size, progress, status, source, type, speed, 
        createdAt, updatedAt, userId
      )
      VALUES (
        ${id}, ${url}, ${name}, ${size}, 0, 'queued', ${type}, ${type}, 0,
        ${now}, ${now}, 'usr_demo123'
      )
      RETURNING *
    `

    return { download: download[0] }
  } catch (error) {
    console.error("Error adding download:", error)
    return { error: "Failed to add download" }
  }
}

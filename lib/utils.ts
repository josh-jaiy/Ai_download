import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"

  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)} sec`
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)} min`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours} hr ${minutes} min`
  }
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, "MMM d, yyyy")
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + "..."
}

export function getFileTypeFromUrl(url: string, contentType: string): string {
  // Determine file type based on URL and content type
  const urlLower = url.toLowerCase()

  // Check for video files
  if (
    urlLower.includes("youtube.com") ||
    urlLower.includes("youtu.be") ||
    urlLower.includes("vimeo.com") ||
    urlLower.includes("tiktok.com") ||
    contentType.includes("video/")
  ) {
    return "video"
  }

  // Check for audio files
  if (
    urlLower.endsWith(".mp3") ||
    urlLower.endsWith(".wav") ||
    urlLower.endsWith(".ogg") ||
    contentType.includes("audio/")
  ) {
    return "audio"
  }

  // Check for document files
  if (
    urlLower.endsWith(".pdf") ||
    urlLower.endsWith(".doc") ||
    urlLower.endsWith(".docx") ||
    urlLower.endsWith(".txt") ||
    contentType.includes("application/pdf") ||
    contentType.includes("text/")
  ) {
    return "document"
  }

  // Check for image files
  if (
    urlLower.endsWith(".jpg") ||
    urlLower.endsWith(".jpeg") ||
    urlLower.endsWith(".png") ||
    urlLower.endsWith(".gif") ||
    contentType.includes("image/")
  ) {
    return "image"
  }

  // Check for archive files
  if (
    urlLower.endsWith(".zip") ||
    urlLower.endsWith(".rar") ||
    urlLower.endsWith(".7z") ||
    contentType.includes("application/zip") ||
    contentType.includes("application/x-rar-compressed")
  ) {
    return "archive"
  }

  // Check for application files
  if (
    urlLower.endsWith(".exe") ||
    urlLower.endsWith(".dmg") ||
    urlLower.endsWith(".apk") ||
    contentType.includes("application/octet-stream") ||
    contentType.includes("application/x-msdownload")
  ) {
    return "application"
  }

  // Default to other
  return "other"
}

export function getSourceFromUrl(url: string): string {
  // Determine source based on URL
  const urlLower = url.toLowerCase()

  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
    return "youtube"
  }

  if (urlLower.includes("tiktok.com")) {
    return "tiktok"
  }

  if (urlLower.includes("netflix.com") || urlLower.includes("hulu.com") || urlLower.includes("amazon.com/video")) {
    return "moviebox"
  }

  if (urlLower.includes("books.google.com") || urlLower.endsWith(".pdf") || urlLower.endsWith(".epub")) {
    return "book"
  }

  if (urlLower.endsWith(".exe") || urlLower.endsWith(".dmg") || urlLower.endsWith(".apk")) {
    return "app"
  }

  return "other"
}

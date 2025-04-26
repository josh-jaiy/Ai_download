export type DownloadSource = "youtube" | "tiktok" | "moviebox" | "book" | "apps" | "pdf" | "youtube-playlist" | "other"

export interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  duration: number
  views: string
  size: number
  quality: string
}

export interface YouTubePlaylist {
  id: string
  title: string
  channelName: string
  thumbnail: string
  videoCount: number
  videos: YouTubeVideo[]
}

export interface Download {
  id: string
  url: string
  name: string
  progress: number
  size: number
  status: "queued" | "downloading" | "paused" | "completed" | "cancelled" | "error"
  createdAt: Date
  completedAt?: Date
  source: DownloadSource
  type: string
  speed: number
  icon: string
  category: string
  thumbnail?: string
  duration?: number
  metadata?: {
    author?: string
    pageCount?: number
    resolution?: string
    publisher?: string
    views?: string
    playlistId?: string
    playlistTitle?: string
    currentVideo?: number
    totalVideos?: number
  }
  filePath?: string
  encrypted?: boolean
  encryptionMethod?: string
  encryptionKey?: string
  cloudSynced?: boolean
  cloudPath?: string
  threads?: any[]
}

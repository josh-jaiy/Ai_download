"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { DownloadPanel } from "@/components/download-panel"
import type { Download, DownloadSource } from "@/types/download"
import { generateSampleDownloads } from "@/lib/sample-data"

export default function Home() {
  const [downloads, setDownloads] = useState<Download[]>(generateSampleDownloads())
  const [activeSource, setActiveSource] = useState<DownloadSource | "all">("all")

  const handleCreateDownload = (url: string, name: string, source: DownloadSource) => {
    const newDownload: Download = {
      id: Date.now().toString(),
      url,
      name,
      progress: 0,
      size: Math.floor(Math.random() * 1000) + 10, // Random size between 10-1010 MB
      status: "downloading",
      createdAt: new Date(),
      source,
      speed: Math.floor(Math.random() * 10) + 1, // Random speed between 1-11 MB/s
      type: getTypeFromSource(source),
      icon: getIconFromSource(source),
      category: getCategoryFromSource(source),
    }

    setDownloads((prev) => [newDownload, ...prev])

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloads((prev) =>
        prev.map((download) => {
          if (download.id === newDownload.id) {
            const newProgress = download.progress + Math.random() * 10

            if (newProgress >= 100) {
              clearInterval(interval)
              return { ...download, progress: 100, status: "completed", speed: 0 }
            }

            return { ...download, progress: newProgress }
          }
          return download
        }),
      )
    }, 1000)
  }

  const handleFilterBySource = (source: DownloadSource | "all") => {
    setActiveSource(source)
  }

  const filteredDownloads =
    activeSource === "all" ? downloads : downloads.filter((download) => download.source === activeSource)

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 lg:w-2/5">
          <ChatInterface onCreateDownload={handleCreateDownload} />
        </div>

        <div className="w-full md:w-1/2 lg:w-3/5">
          <DownloadPanel
            downloads={filteredDownloads}
            onFilterBySource={handleFilterBySource}
            activeSource={activeSource}
          />
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getTypeFromSource(source: DownloadSource): Download["type"] {
  switch (source) {
    case "youtube":
    case "moviebox":
      return "video"
    case "tiktok":
      return "video"
    case "book":
      return "book"
    case "app":
      return "application"
    default:
      return "other"
  }
}

function getIconFromSource(source: DownloadSource): string {
  switch (source) {
    case "youtube":
    case "moviebox":
      return "video"
    case "tiktok":
      return "video"
    case "book":
      return "file-text"
    case "app":
      return "app"
    default:
      return "file"
  }
}

function getCategoryFromSource(source: DownloadSource): string {
  switch (source) {
    case "youtube":
    case "moviebox":
    case "tiktok":
      return "video"
    case "book":
      return "document"
    case "app":
      return "application"
    default:
      return "other"
  }
}

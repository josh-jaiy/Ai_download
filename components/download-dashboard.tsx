"use client"

import { useState } from "react"
import { ChatInterface } from "./chat-interface"
import { DownloadList } from "./download-list"
import { FilePreview } from "./file-preview"
import type { Download } from "@/types/download"
import { Header } from "./header"

export default function DownloadDashboard() {
  const [downloads, setDownloads] = useState<Download[]>([])
  const [selectedDownload, setSelectedDownload] = useState<Download | null>(null)

  const addDownload = (download: Download) => {
    setDownloads((prev) => [download, ...prev])
  }

  const updateDownloadProgress = (id: string, progress: number) => {
    setDownloads((prev) => prev.map((download) => (download.id === id ? { ...download, progress } : download)))
  }

  const completeDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((download) => (download.id === id ? { ...download, status: "completed", progress: 100 } : download)),
    )
  }

  const cancelDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((download) => (download.id === id ? { ...download, status: "cancelled" } : download)),
    )
  }

  const pauseDownload = (id: string) => {
    setDownloads((prev) => prev.map((download) => (download.id === id ? { ...download, status: "paused" } : download)))
  }

  const resumeDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((download) => (download.id === id ? { ...download, status: "downloading" } : download)),
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-full md:w-2/3 p-4">
          <ChatInterface onDownloadRequest={addDownload} />
          <DownloadList
            downloads={downloads}
            onSelect={setSelectedDownload}
            onPause={pauseDownload}
            onResume={resumeDownload}
            onCancel={cancelDownload}
          />
        </div>
        <div className="hidden md:block md:w-1/3 border-l border-slate-800">
          {selectedDownload ? (
            <FilePreview download={selectedDownload} />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <p>Select a download to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

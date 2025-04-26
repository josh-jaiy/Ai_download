"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { DownloadPanel } from "@/components/download-panel"
import { Header } from "@/components/header"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import type { Download } from "@/types/download"
import type { Message } from "@/types/chat"
import { MobileNavbar } from "@/components/mobile-navbar"
import { getSampleDownloads } from "@/components/sample-downloads"

export function DownloadManagerLayout() {
  const [view, setView] = useState<"chat" | "downloads" | "history">("chat")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content:
        "Hello! I'm your AI download assistant. What would you like to download today? I can help you download content from YouTube, TikTok, Moviebox, and more.",
      timestamp: new Date(),
    },
  ])
  const [downloads, setDownloads] = useState<Download[]>([])
  const [downloadHistory, setDownloadHistory] = useState<Download[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Load sample downloads on initial render
  useEffect(() => {
    const sampleDownloads = getSampleDownloads()
    const activeDownloads = sampleDownloads.filter((d) => d.status !== "completed")
    const completedDownloads = sampleDownloads.filter((d) => d.status === "completed")

    setDownloads(activeDownloads)
    setDownloadHistory(completedDownloads)
  }, [])

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  const addDownload = (download: Download) => {
    setDownloads((prev) => [download, ...prev])
  }

  const updateDownload = (id: string, updates: Partial<Download>) => {
    setDownloads((prev) => prev.map((download) => (download.id === id ? { ...download, ...updates } : download)))

    // If download is completed, move to history
    if (updates.status === "completed") {
      const completedDownload = downloads.find((d) => d.id === id)
      if (completedDownload) {
        const updatedDownload = { ...completedDownload, ...updates }
        setDownloadHistory((prev) => [updatedDownload, ...prev])
        setDownloads((prev) => prev.filter((d) => d.id !== id))
      }
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50">
      {isDesktop && (
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          downloadCount={downloads.length}
          historyCount={downloadHistory.length}
          onViewChange={setView}
          currentView={view}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} isDesktop={isDesktop} />

        {!isDesktop && (
          <MobileNavbar
            onViewChange={setView}
            currentView={view}
            downloadCount={downloads.length}
            historyCount={downloadHistory.length}
          />
        )}

        <main
          className={cn(
            "flex flex-1 transition-all duration-300 ease-in-out",
            isDesktop && sidebarOpen ? "ml-0" : "ml-0",
          )}
        >
          {view === "chat" && (
            <ChatInterface
              messages={messages}
              onSendMessage={addMessage}
              onDownloadRequest={addDownload}
              className="flex-1"
            />
          )}

          {(view === "downloads" || view === "history") && (
            <DownloadPanel
              downloads={view === "downloads" ? downloads : downloadHistory}
              onUpdateDownload={updateDownload}
              isHistory={view === "history"}
              className="flex-1"
            />
          )}
        </main>
      </div>
    </div>
  )
}

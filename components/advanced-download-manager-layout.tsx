"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { EnhancedChatInterface } from "@/components/enhanced-chat-interface"
import { AdvancedDownloadItem } from "@/components/advanced-download-item"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Download } from "@/types/download"
import type { Message } from "@/types/chat"
import { MobileNavbar } from "@/components/mobile-navbar"
import { getSampleDownloads } from "@/components/sample-downloads"
import { DownloadIcon, CheckCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SourceToolbar, type SourceType } from "@/components/source-toolbar"
import { Input } from "@/components/ui/input"
import { MediaPlayer } from "@/components/media-player"
import { SettingsPanel } from "@/components/settings-panel"
import { DownloadEngine, type ThreadInfo } from "@/components/download-engine"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function AdvancedDownloadManagerLayout() {
  const [view, setView] = useState<"chat" | "downloads" | "history">("chat")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content:
        "Hello! I'm your AI download assistant with advanced features. I can help you download content from various sources using multi-threaded downloads, encrypt your files for security, and automatically upload them to cloud storage. What would you like to download today?",
      timestamp: new Date(),
    },
  ])
  const [downloads, setDownloads] = useState<Download[]>([])
  const [downloadHistory, setDownloadHistory] = useState<Download[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedSource, setSelectedSource] = useState<SourceType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMediaPlayer, setShowMediaPlayer] = useState(false)
  const [currentMedia, setCurrentMedia] = useState<{
    src: string
    type: "video" | "audio"
    title: string
    poster?: string
  } | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [encryptionEnabled, setEncryptionEnabled] = useState(false)
  const [cloudProvider, setCloudProvider] = useState<string | null>(null)
  const [downloadThreads, setDownloadThreads] = useState<Record<string, ThreadInfo[]>>({})
  const [downloadSpeeds, setDownloadSpeeds] = useState<Record<string, number>>({})

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

  const handleThreadsUpdate = (downloadId: string, threads: ThreadInfo[]) => {
    setDownloadThreads((prev) => ({
      ...prev,
      [downloadId]: threads,
    }))
  }

  const handleSpeedUpdate = (downloadId: string, speed: number) => {
    setDownloadSpeeds((prev) => ({
      ...prev,
      [downloadId]: speed,
    }))
  }

  const handlePlayMedia = (download: Download) => {
    if (download.category === "video" || download.category === "audio") {
      setCurrentMedia({
        src: `/placeholder.mp4`, // In a real app, this would be the actual file path
        type: download.category === "video" ? "video" : "audio",
        title: download.name,
        poster: download.category === "video" ? "/placeholder.svg?height=720&width=1280" : undefined,
      })
      setShowMediaPlayer(true)
    }
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  const filteredDownloads = (view === "downloads" ? downloads : downloadHistory).filter((download) => {
    const matchesSearch = download.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = selectedSource === "all" || download.source === selectedSource
    return matchesSearch && matchesSource
  })

  // Calculate download counts by source
  const downloadCountsBySource = [...downloads, ...downloadHistory].reduce(
    (acc, download) => {
      const source = download.source || "other"
      acc[source] = (acc[source] || 0) + 1
      return acc
    },
    {} as Record<SourceType, number>,
  )

  // Add total count
  downloadCountsBySource.all = downloads.length + downloadHistory.length

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50">
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          isDesktop={isDesktop}
          onOpenSettings={handleOpenSettings}
        />

        {!isDesktop && (
          <MobileNavbar
            onViewChange={setView}
            currentView={view}
            downloadCount={downloads.length}
            historyCount={downloadHistory.length}
          />
        )}

        <main className="flex flex-1 transition-all duration-300 ease-in-out">
          {view === "chat" && (
            <EnhancedChatInterface
              messages={messages}
              onSendMessage={addMessage}
              onDownloadRequest={addDownload}
              className="flex-1"
            />
          )}

          {(view === "downloads" || view === "history") && (
            <div className="flex flex-1 flex-col">
              <div className="border-b border-zinc-800 bg-zinc-900 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    {view === "downloads" ? (
                      <DownloadIcon className="mr-2 h-5 w-5 text-emerald-500" />
                    ) : (
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500" />
                    )}
                    <h2 className="text-lg font-medium">
                      {view === "downloads" ? "Active Downloads" : "Download History"}
                    </h2>
                  </div>
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search downloads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-800 pl-4 text-sm text-zinc-200 placeholder:text-zinc-400 focus-visible:ring-emerald-500 sm:w-64"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-zinc-800">
                <SourceToolbar
                  activeSource={selectedSource}
                  onSourceChange={setSelectedSource}
                  downloadCounts={downloadCountsBySource}
                />
              </div>

              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
                {filteredDownloads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                    {view === "downloads" ? (
                      <>
                        <DownloadIcon className="h-16 w-16 text-zinc-700" />
                        <h3 className="mt-4 text-lg font-medium">No active downloads</h3>
                        <p className="mt-2 text-center text-sm text-zinc-500">
                          Ask the AI assistant to download something for you
                        </p>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-16 w-16 text-zinc-700" />
                        <h3 className="mt-4 text-lg font-medium">No download history</h3>
                        <p className="mt-2 text-center text-sm text-zinc-500">
                          Your completed downloads will appear here
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDownloads.map((download) => (
                      <div key={download.id} className="relative">
                        {download.status === "downloading" && (
                          <DownloadEngine
                            download={download}
                            onProgressUpdate={(progress) => updateDownload(download.id, { progress })}
                            onStatusChange={(status) => updateDownload(download.id, { status })}
                            onSpeedUpdate={(speed) => handleSpeedUpdate(download.id, speed)}
                            onThreadsUpdate={(threads) => handleThreadsUpdate(download.id, threads)}
                          />
                        )}
                        <AdvancedDownloadItem
                          download={download}
                          onUpdateDownload={updateDownload}
                          isHistory={view === "history"}
                          isEncrypted={encryptionEnabled}
                          cloudProvider={cloudProvider}
                        />
                        {(download.category === "video" || download.category === "audio") &&
                          download.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-4 top-4 bg-zinc-800/80 hover:bg-zinc-700"
                              onClick={() => handlePlayMedia(download)}
                            >
                              <Play className="mr-2 h-3.5 w-3.5" />
                              Play
                            </Button>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Media Player Dialog */}
      <Dialog open={showMediaPlayer} onOpenChange={setShowMediaPlayer}>
        <DialogContent className="max-w-4xl border-zinc-800 bg-zinc-900 p-4 shadow-xl">
          {currentMedia && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{currentMedia.title}</h3>
              <MediaPlayer
                src={currentMedia.src}
                type={currentMedia.type}
                title={currentMedia.title}
                poster={currentMedia.poster}
                autoPlay
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl border-zinc-800 bg-transparent p-0 shadow-xl">
          <SettingsPanel onClose={handleCloseSettings} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

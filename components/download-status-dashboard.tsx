"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { AdvancedDownloadItem } from "@/components/advanced-download-item"
import { SourceToolbar } from "@/components/source-toolbar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, Download, HardDrive, RefreshCw, Search, Wifi } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import type { Download as DownloadType } from "@/types/download"
import type { SourceType } from "@/components/source-toolbar"
import { getDownloads, updateDownloadStatus, deleteDownload } from "@/app/actions/download-actions"

export function DownloadStatusDashboard() {
  const [activeDownloads, setActiveDownloads] = useState<DownloadType[]>([])
  const [completedDownloads, setCompletedDownloads] = useState<DownloadType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSource, setSelectedSource] = useState<SourceType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshInterval, setRefreshInterval] = useState(5000) // 5 seconds
  const [systemStats, setSystemStats] = useState({
    totalDownloaded: 0,
    averageSpeed: 0,
    activeThreads: 0,
    diskSpace: { used: 0, total: 1000 * 1024 * 1024 * 1024 }, // 1TB total space
  })

  // Fetch downloads on component mount and when refresh interval changes
  useEffect(() => {
    fetchDownloads()

    const intervalId = setInterval(fetchDownloads, refreshInterval)

    return () => clearInterval(intervalId)
  }, [refreshInterval, selectedSource, searchQuery])

  const fetchDownloads = async () => {
    try {
      setIsLoading(true)
      const result = await getDownloads()

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.downloads) {
        const active = result.downloads.filter(
          (d: DownloadType) => d.status === "downloading" || d.status === "paused" || d.status === "queued",
        )
        const completed = result.downloads.filter(
          (d: DownloadType) => d.status === "completed" || d.status === "cancelled" || d.status === "error",
        )

        setActiveDownloads(active)
        setCompletedDownloads(completed)

        // Calculate system stats
        const totalDownloaded = completed.reduce((sum, d) => sum + d.size, 0)
        const activeThreadsCount = active.reduce((sum, d) => sum + (d.threads?.length || 0), 0)
        const activeDownloadsWithSpeed = active.filter((d) => d.speed > 0)
        const averageSpeed =
          activeDownloadsWithSpeed.length > 0
            ? activeDownloadsWithSpeed.reduce((sum, d) => sum + d.speed, 0) / activeDownloadsWithSpeed.length
            : 0

        setSystemStats({
          totalDownloaded,
          averageSpeed,
          activeThreads: activeThreadsCount,
          diskSpace: { ...systemStats.diskSpace, used: totalDownloaded },
        })
      }
    } catch (err) {
      setError("Failed to fetch downloads")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateDownload = async (id: string, updates: Partial<DownloadType>) => {
    try {
      if (updates.status === "paused") {
        await updateDownloadStatus(id, "pause")
      } else if (updates.status === "downloading") {
        await updateDownloadStatus(id, "resume")
      } else if (updates.status === "cancelled") {
        await updateDownloadStatus(id, "cancel")
      }

      await fetchDownloads()
    } catch (err) {
      setError("Failed to update download")
      console.error(err)
    }
  }

  const handleDeleteDownload = async (id: string) => {
    try {
      await deleteDownload(id)
      await fetchDownloads()
    } catch (err) {
      setError("Failed to delete download")
      console.error(err)
    }
  }

  // Filter downloads based on search query and selected source
  const filteredActiveDownloads = activeDownloads.filter((download) => {
    const matchesSearch = download.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = selectedSource === "all" || download.source === selectedSource
    return matchesSearch && matchesSource
  })

  const filteredCompletedDownloads = completedDownloads.filter((download) => {
    const matchesSearch = download.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = selectedSource === "all" || download.source === selectedSource
    return matchesSearch && matchesSource
  })

  // Calculate download counts by source
  const downloadCountsBySource = [...activeDownloads, ...completedDownloads].reduce(
    (acc, download) => {
      const source = download.source || "other"
      acc[source] = (acc[source] || 0) + 1
      return acc
    },
    { all: activeDownloads.length + completedDownloads.length } as Record<SourceType, number>,
  )

  return (
    <div className="container py-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Downloaded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(systemStats.totalDownloaded)}</div>
            <p className="text-xs text-zinc-500 mt-1">{completedDownloads.length} files completed</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStats.averageSpeed > 0 ? `${formatFileSize(systemStats.averageSpeed)}/s` : "0 B/s"}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              <span className="flex items-center">
                <Wifi className="mr-1 h-3 w-3" />
                {activeDownloads.filter((d) => d.status === "downloading").length} active downloads
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Threads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeThreads}</div>
            <p className="text-xs text-zinc-500 mt-1">
              <span className="flex items-center">
                <RefreshCw className="mr-1 h-3 w-3" />
                {activeDownloads.filter((d) => d.status === "downloading").length} downloads
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disk Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(systemStats.diskSpace.used)} / {formatFileSize(systemStats.diskSpace.total)}
            </div>
            <Progress
              value={(systemStats.diskSpace.used / systemStats.diskSpace.total) * 100}
              className="h-1.5 mt-2 bg-zinc-800"
              indicatorClassName="bg-emerald-500"
            />
            <p className="text-xs text-zinc-500 mt-1">
              <span className="flex items-center">
                <HardDrive className="mr-1 h-3 w-3" />
                {Math.round((systemStats.diskSpace.used / systemStats.diskSpace.total) * 100)}% used
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="active" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="active" className="relative">
                Active Downloads
                {activeDownloads.length > 0 && (
                  <Badge className="ml-2 bg-emerald-600 hover:bg-emerald-600">{activeDownloads.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="relative">
                Completed
                {completedDownloads.length > 0 && (
                  <Badge className="ml-2 bg-zinc-700 hover:bg-zinc-700">{completedDownloads.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  type="search"
                  placeholder="Search downloads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800 pl-9 text-sm text-zinc-200 placeholder:text-zinc-400 focus-visible:ring-emerald-500 sm:w-64"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                onClick={fetchDownloads}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-b border-zinc-800">
            <SourceToolbar
              activeSource={selectedSource}
              onSourceChange={setSelectedSource}
              downloadCounts={downloadCountsBySource}
            />
          </div>

          <TabsContent value="active" className="mt-4">
            <ScrollArea className="h-[calc(100vh-400px)]">
              {isLoading && activeDownloads.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-zinc-500" />
                </div>
              ) : filteredActiveDownloads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                  <Download className="h-16 w-16 text-zinc-700" />
                  <h3 className="mt-4 text-lg font-medium">No active downloads</h3>
                  <p className="mt-2 text-center text-sm text-zinc-500">
                    Start a new download or check your completed downloads
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActiveDownloads.map((download) => (
                    <AdvancedDownloadItem
                      key={download.id}
                      download={download}
                      onUpdateDownload={handleUpdateDownload}
                      isHistory={false}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <ScrollArea className="h-[calc(100vh-400px)]">
              {isLoading && completedDownloads.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-zinc-500" />
                </div>
              ) : filteredCompletedDownloads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                  <CheckCircle className="h-16 w-16 text-zinc-700" />
                  <h3 className="mt-4 text-lg font-medium">No completed downloads</h3>
                  <p className="mt-2 text-center text-sm text-zinc-500">Your completed downloads will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCompletedDownloads.map((download) => (
                    <AdvancedDownloadItem
                      key={download.id}
                      download={download}
                      onUpdateDownload={handleUpdateDownload}
                      isHistory={true}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

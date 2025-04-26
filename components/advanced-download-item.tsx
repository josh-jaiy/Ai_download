"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronUp,
  FileText,
  FileVideo,
  Package,
  Pause,
  Play,
  Trash,
  X,
  Music,
  FileArchive,
} from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import type { Download } from "@/types/download"

interface AdvancedDownloadItemProps {
  download: Download
  onUpdateDownload: (id: string, updates: Partial<Download>) => void
  isHistory: boolean
}

export function AdvancedDownloadItem({ download, onUpdateDownload, isHistory }: AdvancedDownloadItemProps) {
  const [expanded, setExpanded] = useState(false)

  const getFileIcon = () => {
    switch (download.type) {
      case "video":
        return <FileVideo className="h-5 w-5 text-blue-500" />
      case "document":
      case "book":
        return <FileText className="h-5 w-5 text-amber-500" />
      case "application":
        return <Package className="h-5 w-5 text-green-500" />
      case "audio":
        return <Music className="h-5 w-5 text-purple-500" />
      default:
        return <FileArchive className="h-5 w-5 text-zinc-400" />
    }
  }

  const getStatusBadge = () => {
    switch (download.status) {
      case "downloading":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Downloading</Badge>
      case "paused":
        return <Badge className="bg-amber-600 hover:bg-amber-700">Paused</Badge>
      case "queued":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Queued</Badge>
      case "completed":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-zinc-600 hover:bg-zinc-700">Cancelled</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge className="bg-zinc-600 hover:bg-zinc-700">{download.status}</Badge>
    }
  }

  const getTimeRemaining = () => {
    if (download.status !== "downloading" || download.speed === 0) return "Unknown"

    const remainingBytes = download.size * (1 - download.progress / 100)
    const remainingSeconds = remainingBytes / download.speed

    if (remainingSeconds < 60) {
      return `${Math.ceil(remainingSeconds)} sec`
    } else if (remainingSeconds < 3600) {
      return `${Math.ceil(remainingSeconds / 60)} min`
    } else {
      const hours = Math.floor(remainingSeconds / 3600)
      const minutes = Math.ceil((remainingSeconds % 3600) / 60)
      return `${hours} hr ${minutes} min`
    }
  }

  const handleTogglePause = () => {
    const newStatus = download.status === "downloading" ? "paused" : "downloading"
    onUpdateDownload(download.id, { status: newStatus })
  }

  const handleCancel = () => {
    onUpdateDownload(download.id, { status: "cancelled" })
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getFileIcon()}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="truncate font-medium text-zinc-100">{download.name}</p>
                {getStatusBadge()}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <span>{formatFileSize(download.size)}</span>
                <span>•</span>
                <span>{download.source || "Unknown source"}</span>
                {download.status === "downloading" && (
                  <>
                    <span>•</span>
                    <span>{formatFileSize(download.speed)}/s</span>
                    <span>•</span>
                    <span>{getTimeRemaining()} remaining</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {!isHistory && download.status !== "completed" && download.status !== "cancelled" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
                  onClick={handleTogglePause}
                >
                  {download.status === "downloading" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {download.status === "downloading" && (
          <Progress value={download.progress} className="h-1.5 mt-2 bg-zinc-800" indicatorClassName="bg-emerald-500" />
        )}

        {expanded && (
          <div className="mt-4 border-t border-zinc-800 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Download Details</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-zinc-400">URL:</dt>
                    <dd className="text-zinc-300 truncate max-w-[250px]">{download.url}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-400">Progress:</dt>
                    <dd className="text-zinc-300">{download.progress.toFixed(1)}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-400">Size:</dt>
                    <dd className="text-zinc-300">{formatFileSize(download.size)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-400">Type:</dt>
                    <dd className="text-zinc-300">{download.type || "Unknown"}</dd>
                  </div>
                  {download.startedAt && (
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">Started:</dt>
                      <dd className="text-zinc-300">{new Date(download.startedAt).toLocaleString()}</dd>
                    </div>
                  )}
                  {download.completedAt && (
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">Completed:</dt>
                      <dd className="text-zinc-300">{new Date(download.completedAt).toLocaleString()}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {download.threads && download.threads.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Download Threads</h4>
                  <div className="space-y-2">
                    {download.threads.map((thread, index) => (
                      <div key={thread.id} className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Thread {index + 1}:</span>
                          <span className="text-zinc-300">{thread.status}</span>
                        </div>
                        <Progress
                          value={thread.progress}
                          className="h-1 mt-1 bg-zinc-800"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {download.metadata && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Metadata</h4>
                <pre className="text-xs bg-zinc-800 p-2 rounded overflow-auto max-h-[100px]">
                  {JSON.stringify(download.metadata, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                onClick={() => onUpdateDownload(download.id, { status: "deleted" })}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

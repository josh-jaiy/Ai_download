"use client"

import type React from "react"

import { useState } from "react"
import {
  FileText,
  FileVideo,
  FileAudio,
  Package,
  File,
  Database,
  Clock,
  Pause,
  Play,
  CheckCircle,
  AlertCircle,
  X,
  MoreVertical,
  DownloadIcon,
  FolderOpen,
  Copy,
  Share2,
  Trash,
  Gamepad2,
  Youtube,
  Music,
  Film,
  BookOpen,
  List,
} from "lucide-react"
import type { Download } from "@/types/download"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, formatFileSize, formatDate, formatDuration } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface DownloadItemProps {
  download: Download
  onUpdateDownload: (id: string, updates: Partial<Download>) => void
  isHistory: boolean
}

export function DownloadItem({ download, onUpdateDownload, isHistory }: DownloadItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getFileIcon = () => {
    switch (download.icon) {
      case "file-text":
        return <FileText className="h-8 w-8 text-amber-500" />
      case "video":
        return <FileVideo className="h-8 w-8 text-blue-500" />
      case "music":
        return <FileAudio className="h-8 w-8 text-purple-500" />
      case "package":
        return <Package className="h-8 w-8 text-orange-500" />
      case "database":
        return <Database className="h-8 w-8 text-emerald-500" />
      case "gamepad-2":
        return <Gamepad2 className="h-8 w-8 text-pink-500" />
      default:
        return <File className="h-8 w-8 text-zinc-400" />
    }
  }

  const getSourceIcon = () => {
    switch (download.source) {
      case "youtube":
        return <Youtube className="h-3 w-3 text-red-500" />
      case "youtube-playlist":
        return <List className="h-3 w-3 text-red-400" />
      case "tiktok":
        return <Music className="h-3 w-3 text-cyan-400" />
      case "moviebox":
        return <Film className="h-3 w-3 text-purple-400" />
      case "apps":
        return <Package className="h-3 w-3 text-emerald-400" />
      case "books":
        return <BookOpen className="h-3 w-3 text-amber-400" />
      case "pdf":
        return <FileText className="h-3 w-3 text-orange-400" />
      default:
        return <File className="h-3 w-3 text-zinc-400" />
    }
  }

  const getSourceColor = () => {
    switch (download.source) {
      case "youtube":
        return "bg-red-950/30 text-red-500 border-red-900/50"
      case "youtube-playlist":
        return "bg-red-950/30 text-red-400 border-red-900/50"
      case "tiktok":
        return "bg-cyan-950/30 text-cyan-400 border-cyan-900/50"
      case "moviebox":
        return "bg-purple-950/30 text-purple-400 border-purple-900/50"
      case "apps":
        return "bg-emerald-950/30 text-emerald-400 border-emerald-900/50"
      case "books":
        return "bg-amber-950/30 text-amber-400 border-amber-900/50"
      case "pdf":
        return "bg-orange-950/30 text-orange-400 border-orange-900/50"
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700"
    }
  }

  const getStatusIcon = () => {
    switch (download.status) {
      case "queued":
        return <Clock className="h-4 w-4 text-zinc-400" />
      case "downloading":
        return <DownloadIcon className="h-4 w-4 text-emerald-500 animate-pulse" />
      case "paused":
        return <Pause className="h-4 w-4 text-amber-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "cancelled":
        return <X className="h-4 w-4 text-red-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-zinc-400" />
    }
  }

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdateDownload(download.id, { status: "paused" })
  }

  const handleResume = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdateDownload(download.id, { status: "downloading" })
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdateDownload(download.id, { status: "cancelled" })
  }

  const renderExtraInfo = () => {
    if (download.metadata) {
      if (download.source === "youtube" && download.metadata.playlistId) {
        return (
          <div className="mt-1 flex items-center text-xs text-zinc-400">
            <List className="mr-1 h-3 w-3" />
            <span className="truncate">
              {download.metadata.currentVideo} of {download.metadata.totalVideos} from playlist
            </span>
          </div>
        )
      } else if (download.source === "youtube" && download.metadata.duration) {
        return (
          <div className="mt-1 flex items-center text-xs text-zinc-400">
            <Clock className="mr-1 h-3 w-3" />
            <span>{formatDuration(download.metadata.duration)}</span>
          </div>
        )
      } else if ((download.source === "books" || download.source === "pdf") && download.metadata.pageCount) {
        return (
          <div className="mt-1 flex items-center text-xs text-zinc-400">
            <FileText className="mr-1 h-3 w-3" />
            <span>
              {download.metadata.pageCount} pages
              {download.metadata.author && ` • By ${download.metadata.author}`}
            </span>
          </div>
        )
      }
    }
    return null
  }

  return (
    <div
      className={cn(
        "border-l-4 bg-zinc-900 transition-colors hover:bg-zinc-800/80",
        download.status === "completed"
          ? "border-emerald-500"
          : download.status === "paused"
            ? "border-amber-500"
            : download.status === "error" || download.status === "cancelled"
              ? "border-red-500"
              : "border-zinc-600",
      )}
    >
      <div className="flex cursor-pointer items-start gap-4 p-4" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="mt-1 flex-shrink-0">{getFileIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="max-w-sm">
              <div className="flex items-center gap-2">
                <h3 className="font-medium leading-tight text-zinc-100">{download.name}</h3>
                <Badge className={cn("h-5 border px-1.5 text-[10px]", getSourceColor())}>
                  <span className="flex items-center gap-1">
                    {getSourceIcon()}
                    <span className="capitalize">{download.source.replace("-", " ")}</span>
                  </span>
                </Badge>
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                {formatFileSize(download.size)}
                <span className="mx-2 inline-block">•</span>
                {formatDate(download.createdAt)}
              </p>
              {renderExtraInfo()}
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              {!isHistory && download.status !== "completed" && download.status !== "cancelled" && (
                <div className="flex items-center gap-1">
                  {download.status === "downloading" ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePause}>
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleResume}>
                      <Play className="h-4 w-4" />
                    </Button>
                  )}

                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-zinc-800 bg-zinc-900">
                  <DropdownMenuItem className="text-zinc-100">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Open folder
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-zinc-100">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-zinc-100">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share file
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem className="text-red-500">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {!isHistory && (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-zinc-400">
                  {getStatusIcon()}
                  <span className="ml-1.5 capitalize">{download.status}</span>
                  {download.status === "downloading" && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{Math.round(download.progress)}%</span>
                    </>
                  )}
                </div>
                {download.status === "downloading" && (
                  <span className="text-xs text-zinc-400">
                    {formatFileSize(download.size * (download.progress / 100))} of {formatFileSize(download.size)}
                  </span>
                )}
              </div>

              {(download.status === "downloading" || download.status === "paused") && (
                <Progress
                  value={download.progress}
                  className="mt-1.5 h-1.5 bg-zinc-800"
                  indicatorClassName={download.status === "paused" ? "bg-amber-500" : "bg-emerald-500"}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-zinc-800 bg-zinc-950/50 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-medium text-zinc-300">File Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-zinc-400">File name:</div>
                <div className="truncate text-zinc-200">{download.name}</div>
                <div className="text-zinc-400">File size:</div>
                <div className="text-zinc-200">{formatFileSize(download.size)}</div>
                <div className="text-zinc-400">File type:</div>
                <div className="capitalize text-zinc-200">{download.category}</div>
                <div className="text-zinc-400">Source:</div>
                <div className="capitalize text-zinc-200">{download.source.replace("-", " ")}</div>
                {download.metadata?.author && (
                  <>
                    <div className="text-zinc-400">Author:</div>
                    <div className="text-zinc-200">{download.metadata.author}</div>
                  </>
                )}
                {download.metadata?.pageCount && (
                  <>
                    <div className="text-zinc-400">Pages:</div>
                    <div className="text-zinc-200">{download.metadata.pageCount}</div>
                  </>
                )}
                {download.metadata?.duration && (
                  <>
                    <div className="text-zinc-400">Duration:</div>
                    <div className="text-zinc-200">{formatDuration(download.metadata.duration)}</div>
                  </>
                )}
                {download.metadata?.playlistTitle && (
                  <>
                    <div className="text-zinc-400">Playlist:</div>
                    <div className="text-zinc-200">{download.metadata.playlistTitle}</div>
                  </>
                )}
                <div className="text-zinc-400">Date added:</div>
                <div className="text-zinc-200">{formatDate(download.createdAt)}</div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-zinc-300">Download Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-zinc-400">Status:</div>
                <div className="capitalize text-zinc-200">{download.status}</div>
                <div className="text-zinc-400">URL:</div>
                <div className="truncate text-zinc-200">{download.url}</div>
                {download.status === "completed" && (
                  <>
                    <div className="text-zinc-400">Location:</div>
                    <div className="truncate text-zinc-200">~/Downloads/{download.name}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700">
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
            <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <FolderOpen className="mr-2 h-4 w-4" />
              Open Location
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { Progress } from "@/components/ui/progress"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  DownloadIcon,
  Pause,
  Play,
  X,
  MoreVertical,
  FileText,
  FileVideo,
  FileAudio,
  Package,
  File,
  CheckCircle,
} from "lucide-react"
import { formatFileSize, formatDate } from "@/lib/utils"
import type { Download, DownloadSource } from "@/types/download"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DownloadPanelProps {
  downloads: Download[]
  activeSource: DownloadSource | "all"
  onFilterBySource: (source: DownloadSource | "all") => void
}

export function DownloadPanel({ downloads, activeSource, onFilterBySource }: DownloadPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDownloads = downloads.filter((download) =>
    download.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getFileIcon = (type?: string) => {
    switch (type) {
      case "document":
      case "book":
        return <FileText className="h-5 w-5 text-amber-500" />
      case "video":
        return <FileVideo className="h-5 w-5 text-blue-500" />
      case "audio":
        return <FileAudio className="h-5 w-5 text-purple-500" />
      case "application":
        return <Package className="h-5 w-5 text-orange-500" />
      default:
        return <File className="h-5 w-5 text-slate-400" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "downloading":
        return <DownloadIcon className="h-4 w-4 text-emerald-500 animate-pulse" />
      case "paused":
        return <Pause className="h-4 w-4 text-amber-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "failed":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <DownloadIcon className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Downloads</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search downloads..."
              className="w-[200px] pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onFilterBySource("all")}>All Sources</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onFilterBySource("youtube")}>YouTube</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterBySource("tiktok")}>TikTok</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterBySource("moviebox")}>MovieBox</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterBySource("book")}>Books</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterBySource("app")}>Applications</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterBySource("other")}>Other</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {filteredDownloads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <DownloadIcon className="h-12 w-12 mb-2 opacity-20" />
            <p>No downloads found</p>
            <p className="text-sm">Ask the AI to download something for you</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDownloads.map((download) => (
              <div
                key={download.id}
                className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getFileIcon(download.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">{download.name}</h3>
                        <Badge variant="outline" className="capitalize">
                          {download.source}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                        {formatFileSize(download.size)}
                      </span>
                    </div>

                    {download.status !== "completed" && (
                      <div className="mt-2">
                        <Progress
                          value={download.progress}
                          className="h-1.5 bg-slate-700"
                          indicatorClassName={
                            download.status === "completed"
                              ? "bg-emerald-500"
                              : download.status === "paused"
                                ? "bg-amber-500"
                                : "bg-emerald-600"
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-slate-400">
                        {getStatusIcon(download.status)}
                        <span className="ml-1 capitalize">{download.status}</span>
                        {download.status === "downloading" && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{Math.round(download.progress)}%</span>
                            <span className="mx-2">•</span>
                            <span>{formatFileSize(download.speed)}/s</span>
                          </>
                        )}
                        <span className="mx-2">•</span>
                        <span>{formatDate(download.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {download.status === "downloading" && (
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pause className="h-3.5 w-3.5" />
                            <span className="sr-only">Pause</span>
                          </Button>
                        )}

                        {download.status === "paused" && (
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Play className="h-3.5 w-3.5" />
                            <span className="sr-only">Resume</span>
                          </Button>
                        )}

                        {["downloading", "paused"].includes(download.status) && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                            <X className="h-3.5 w-3.5" />
                            <span className="sr-only">Cancel</span>
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Open Folder</DropdownMenuItem>
                            <DropdownMenuItem>Copy Link</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

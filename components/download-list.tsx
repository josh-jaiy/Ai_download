"use client"

import { useState } from "react"
import type { Download } from "@/types/download"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Play,
  Pause,
  X,
  FileText,
  FileVideo,
  FileAudio,
  Package,
  DownloadIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
} from "lucide-react"
import { formatFileSize, formatDate } from "@/lib/utils"

interface DownloadListProps {
  downloads: Download[]
  onSelect: (download: Download) => void
  onPause: (id: string) => void
  onResume: (id: string) => void
  onCancel: (id: string) => void
}

export function DownloadList({ downloads, onSelect, onPause, onResume, onCancel }: DownloadListProps) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredDownloads = downloads.filter((download) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return ["queued", "downloading"].includes(download.status)
    if (activeTab === "completed") return download.status === "completed"
    if (activeTab === "paused") return download.status === "paused"
    return true
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "video":
        return <FileVideo className="h-5 w-5 text-blue-500" />
      case "audio":
        return <FileAudio className="h-5 w-5 text-purple-500" />
      case "application":
        return <Package className="h-5 w-5 text-orange-500" />
      default:
        return <DownloadIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "queued":
        return <Clock className="h-4 w-4 text-slate-400" />
      case "downloading":
        return <DownloadIcon className="h-4 w-4 text-emerald-500 animate-pulse" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-amber-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <Card className="mt-4 bg-slate-900 border-slate-800 shadow-lg rounded-lg overflow-hidden h-1/2">
      <CardHeader className="bg-slate-950 border-b border-slate-800 py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center">
            <DownloadIcon className="h-5 w-5 mr-2 text-emerald-500" />
            Downloads
          </CardTitle>
          <Button variant="outline" size="sm" className="h-8 bg-slate-800 border-slate-700 hover:bg-slate-700">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2 bg-slate-950 border-b border-slate-800">
          <TabsList className="bg-slate-800 grid grid-cols-4 h-9">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs">
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              Completed
            </TabsTrigger>
            <TabsTrigger value="paused" className="text-xs">
              Paused
            </TabsTrigger>
          </TabsList>
        </div>
        <CardContent className="p-0">
          <TabsContent value={activeTab} className="m-0">
            <div className="overflow-y-auto max-h-[calc(50vh-10rem)]">
              {filteredDownloads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <DownloadIcon className="h-12 w-12 mb-2 opacity-20" />
                  <p>No downloads found</p>
                  <p className="text-sm">Ask the AI to download something for you</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-800">
                  {filteredDownloads.map((download) => (
                    <li
                      key={download.id}
                      className="p-4 hover:bg-slate-800/50 cursor-pointer transition-colors"
                      onClick={() => onSelect(download)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getFileIcon(download.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{download.name}</h3>
                            <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                              {formatFileSize(download.size)}
                            </span>
                          </div>

                          <div className="mt-1">
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

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-xs text-slate-400">
                              {getStatusIcon(download.status)}
                              <span className="ml-1 capitalize">{download.status}</span>
                              <span className="mx-2">•</span>
                              <span>{formatDate(download.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              {download.status === "downloading" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onPause(download.id)
                                  }}
                                >
                                  <Pause className="h-3.5 w-3.5" />
                                  <span className="sr-only">Pause</span>
                                </Button>
                              )}

                              {download.status === "paused" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onResume(download.id)
                                  }}
                                >
                                  <Play className="h-3.5 w-3.5" />
                                  <span className="sr-only">Resume</span>
                                </Button>
                              )}

                              {["queued", "downloading", "paused"].includes(download.status) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onCancel(download.id)
                                  }}
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span className="sr-only">Cancel</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronUp, Download, Play, X, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDuration, formatFileSize } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  duration: number
  views: string
  size: number
  quality: string
}

interface YouTubePlaylist {
  id: string
  title: string
  channelName: string
  thumbnail: string
  videoCount: number
  videos: YouTubeVideo[]
}

interface YouTubePlaylistViewerProps {
  playlist: YouTubePlaylist
  onClose: () => void
  onDownload: (selectedVideos: YouTubeVideo[]) => void
}

export function YouTubePlaylistViewer({ playlist, onClose, onDownload }: YouTubePlaylistViewerProps) {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [selectedQuality, setSelectedQuality] = useState<string>("720p")

  const toggleSelectAll = () => {
    if (selectedVideos.length === playlist.videos.length) {
      setSelectedVideos([])
    } else {
      setSelectedVideos(playlist.videos.map((video) => video.id))
    }
  }

  const toggleVideoSelection = (videoId: string) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter((id) => id !== videoId))
    } else {
      setSelectedVideos([...selectedVideos, videoId])
    }
  }

  const handleDownload = () => {
    const videosToDownload = playlist.videos.filter((video) => selectedVideos.includes(video.id))
    onDownload(videosToDownload)
  }

  const totalSize = playlist.videos
    .filter((video) => selectedVideos.includes(video.id))
    .reduce((total, video) => total + video.size, 0)

  return (
    <Card className="border-zinc-800 bg-zinc-900 shadow-lg">
      <CardHeader className="border-b border-zinc-800 bg-zinc-950 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-950/30 border-red-900/50 text-red-500 px-1.5 h-5 text-[10px]">
                <Youtube className="h-3 w-3 mr-1" />
                <span>YouTube Playlist</span>
              </Badge>
              <CardTitle className="text-lg font-medium">{playlist.title}</CardTitle>
            </div>
            <CardDescription className="mt-1 text-zinc-400">
              {playlist.channelName} • {playlist.videoCount} videos
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-zinc-400">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <div className="flex cursor-pointer items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7" onClick={toggleSelectAll}>
                <Check className="mr-1 h-3.5 w-3.5" />
                <span>{selectedVideos.length === playlist.videos.length ? "Deselect All" : "Select All"}</span>
              </Button>
              <span className="text-sm text-zinc-400">
                {selectedVideos.length} of {playlist.videos.length} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-zinc-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-400">Quality:</span>
              {["1080p", "720p", "480p", "360p"].map((quality) => (
                <Button
                  key={quality}
                  variant={selectedQuality === quality ? "secondary" : "outline"}
                  size="sm"
                  className="h-7"
                  onClick={() => setSelectedQuality(quality)}
                >
                  {quality}
                </Button>
              ))}
              <div className="ml-auto text-sm text-zinc-400">Total size: {formatFileSize(totalSize)}</div>
            </div>
          </div>

          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="divide-y divide-zinc-800">
                {playlist.videos.map((video) => (
                  <div key={video.id} className="flex items-center gap-3 p-3 hover:bg-zinc-800/50">
                    <Checkbox
                      id={`video-${video.id}`}
                      checked={selectedVideos.includes(video.id)}
                      onCheckedChange={() => toggleVideoSelection(video.id)}
                    />
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="h-20 w-36 rounded object-cover"
                      />
                      <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-xs text-white">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium leading-tight text-zinc-100 line-clamp-2">{video.title}</h4>
                      <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                        <span>{video.views} views</span>
                        <span>•</span>
                        <span>{formatFileSize(video.size)}</span>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleVideoSelection(video.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950 p-4">
        <div className="text-sm text-zinc-400">
          {selectedVideos.length} videos selected • {formatFileSize(totalSize)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleDownload}
            disabled={selectedVideos.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Download {selectedVideos.length > 0 ? selectedVideos.length : ""} Videos
          </Button>
        </div>
      </div>
    </Card>
  )
}

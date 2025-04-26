"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { FileText, FileVideo, Package, Music, Youtube, FileArchive } from "lucide-react"

export type SourceType = "all" | "youtube" | "video" | "document" | "application" | "audio" | "other"

interface SourceToolbarProps {
  activeSource: SourceType
  onSourceChange: (source: SourceType) => void
  downloadCounts: Record<SourceType, number>
}

export function SourceToolbar({ activeSource, onSourceChange, downloadCounts }: SourceToolbarProps) {
  const sources: { id: SourceType; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All", icon: <FileText className="h-4 w-4" /> },
    { id: "youtube", label: "YouTube", icon: <Youtube className="h-4 w-4" /> },
    { id: "video", label: "Videos", icon: <FileVideo className="h-4 w-4" /> },
    { id: "document", label: "Documents", icon: <FileText className="h-4 w-4" /> },
    { id: "application", label: "Apps", icon: <Package className="h-4 w-4" /> },
    { id: "audio", label: "Audio", icon: <Music className="h-4 w-4" /> },
    { id: "other", label: "Other", icon: <FileArchive className="h-4 w-4" /> },
  ]

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2 px-1">
      {sources.map((source) => (
        <Button
          key={source.id}
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm ${
            activeSource === source.id
              ? "bg-zinc-800 text-zinc-50"
              : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50"
          }`}
          onClick={() => onSourceChange(source.id)}
        >
          {source.icon}
          <span>{source.label}</span>
          {downloadCounts[source.id] > 0 && (
            <span className="ml-1 rounded-full bg-zinc-700 px-1.5 py-0.5 text-xs">{downloadCounts[source.id]}</span>
          )}
        </Button>
      ))}
    </div>
  )
}

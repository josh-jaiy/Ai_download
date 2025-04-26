"use client"

import { Button } from "@/components/ui/button"
import {
  Download,
  ChevronLeft,
  MessageSquare,
  History,
  Settings,
  InfoIcon,
  FolderOpen,
  UploadCloud,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
  downloadCount: number
  historyCount: number
  onViewChange: (view: "chat" | "downloads" | "history") => void
  currentView: "chat" | "downloads" | "history"
}

export function Sidebar({
  isOpen,
  toggleSidebar,
  downloadCount,
  historyCount,
  onViewChange,
  currentView,
}: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-900 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">AI Downloader</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-zinc-400 hover:text-zinc-100">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
        <Button
          variant={currentView === "chat" ? "secondary" : "ghost"}
          className={cn("justify-start", currentView === "chat" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400")}
          onClick={() => onViewChange("chat")}
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Chat Assistant
        </Button>

        <Button
          variant={currentView === "downloads" ? "secondary" : "ghost"}
          className={cn("justify-start", currentView === "downloads" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400")}
          onClick={() => onViewChange("downloads")}
        >
          <Download className="mr-2 h-5 w-5" />
          Active Downloads
          {downloadCount > 0 && <Badge className="ml-auto bg-emerald-500 text-xs">{downloadCount}</Badge>}
        </Button>

        <Button
          variant={currentView === "history" ? "secondary" : "ghost"}
          className={cn("justify-start", currentView === "history" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400")}
          onClick={() => onViewChange("history")}
        >
          <History className="mr-2 h-5 w-5" />
          Download History
          {historyCount > 0 && <Badge className="ml-auto bg-zinc-600 text-xs">{historyCount}</Badge>}
        </Button>

        <div className="mt-2 px-3 py-2">
          <h3 className="mb-2 text-xs font-medium uppercase text-zinc-500">File Management</h3>
          <Button variant="ghost" className="w-full justify-start text-zinc-400">
            <FolderOpen className="mr-2 h-5 w-5" />
            My Downloads
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400">
            <UploadCloud className="mr-2 h-5 w-5" />
            Upload Files
          </Button>
        </div>
      </div>

      <div className="border-t border-zinc-800 p-4">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start text-zinc-400">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-400">
            <InfoIcon className="mr-2 h-5 w-5" />
            Help & Support
          </Button>
        </div>
      </div>
    </div>
  )
}

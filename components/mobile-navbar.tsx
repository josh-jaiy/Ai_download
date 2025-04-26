"use client"

import { Button } from "@/components/ui/button"
import { Download, BarChart3, Cloud, Calendar } from "lucide-react"

interface MobileNavbarProps {
  onViewChange: (view: string) => void
  currentView: string
  downloadCount: number
  historyCount: number
}

export function MobileNavbar({ onViewChange, currentView, downloadCount, historyCount }: MobileNavbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-zinc-800 bg-zinc-950 px-4 lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        className={`flex flex-col items-center justify-center ${
          currentView === "downloads" ? "text-emerald-500" : "text-zinc-400"
        }`}
        onClick={() => onViewChange("downloads")}
      >
        <Download className="h-5 w-5" />
        <span className="mt-1 text-xs">Status</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`flex flex-col items-center justify-center ${
          currentView === "analytics" ? "text-emerald-500" : "text-zinc-400"
        }`}
        onClick={() => onViewChange("analytics")}
      >
        <BarChart3 className="h-5 w-5" />
        <span className="mt-1 text-xs">Analytics</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`flex flex-col items-center justify-center ${
          currentView === "cloud" ? "text-emerald-500" : "text-zinc-400"
        }`}
        onClick={() => onViewChange("cloud")}
      >
        <Cloud className="h-5 w-5" />
        <span className="mt-1 text-xs">Cloud</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`flex flex-col items-center justify-center ${
          currentView === "scheduler" ? "text-emerald-500" : "text-zinc-400"
        }`}
        onClick={() => onViewChange("scheduler")}
      >
        <Calendar className="h-5 w-5" />
        <span className="mt-1 text-xs">Schedule</span>
      </Button>
    </div>
  )
}

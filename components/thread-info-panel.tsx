"use client"

import { ArrowDownToLine, Pause, Play } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { formatFileSize } from "@/lib/utils"
import type { ThreadInfo } from "./download-engine"

interface ThreadInfoPanelProps {
  threads: ThreadInfo[]
  fileSize: number
  onThreadAction?: (threadId: number, action: "pause" | "resume") => void
}

export function ThreadInfoPanel({ threads, fileSize, onThreadAction }: ThreadInfoPanelProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-zinc-300">Download Threads</h4>
      <div className="space-y-2">
        {threads.map((thread) => {
          const chunkSize = thread.endByte - thread.startByte + 1
          const downloadedSize = Math.floor((chunkSize * thread.progress) / 100)

          return (
            <div key={thread.id} className="rounded-md border border-zinc-800 bg-zinc-900/50 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium">
                    {thread.id}
                  </div>
                  <div className="text-sm font-medium">Thread {thread.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-zinc-400">
                    {formatFileSize(downloadedSize)} / {formatFileSize(chunkSize)}
                  </div>
                  {thread.status === "active" && onThreadAction && (
                    <button
                      onClick={() => onThreadAction(thread.id, "pause")}
                      className="rounded-full p-1 hover:bg-zinc-800"
                    >
                      <Pause className="h-3 w-3 text-zinc-400" />
                    </button>
                  )}
                  {thread.status === "paused" && onThreadAction && (
                    <button
                      onClick={() => onThreadAction(thread.id, "resume")}
                      className="rounded-full p-1 hover:bg-zinc-800"
                    >
                      <Play className="h-3 w-3 text-zinc-400" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <Progress
                  value={thread.progress}
                  className="h-1.5 flex-1 bg-zinc-800"
                  indicatorClassName={
                    thread.status === "completed"
                      ? "bg-emerald-500"
                      : thread.status === "paused"
                        ? "bg-amber-500"
                        : "bg-emerald-600"
                  }
                />
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <ArrowDownToLine className="h-3 w-3" />
                  <span>{formatFileSize(thread.speed)}/s</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Cpu, ArrowDownToLine, Pause, Play, Settings, RefreshCw } from "lucide-react"
import { formatFileSize } from "@/lib/utils"

interface ThreadInfo {
  id: number
  progress: number
  speed: number
  startByte: number
  endByte: number
  status: "active" | "paused" | "completed" | "error"
}

export function MultiThreadManager() {
  const [isDownloading, setIsDownloading] = useState(true)
  const [threads, setThreads] = useState<ThreadInfo[]>([
    {
      id: 1,
      progress: 65,
      speed: 1.2 * 1024 * 1024, // 1.2 MB/s
      startByte: 0,
      endByte: 25 * 1024 * 1024, // 25 MB
      status: "active",
    },
    {
      id: 2,
      progress: 72,
      speed: 1.5 * 1024 * 1024, // 1.5 MB/s
      startByte: 25 * 1024 * 1024,
      endByte: 50 * 1024 * 1024,
      status: "active",
    },
    {
      id: 3,
      progress: 58,
      speed: 1.1 * 1024 * 1024, // 1.1 MB/s
      startByte: 50 * 1024 * 1024,
      endByte: 75 * 1024 * 1024,
      status: "active",
    },
    {
      id: 4,
      progress: 80,
      speed: 1.8 * 1024 * 1024, // 1.8 MB/s
      startByte: 75 * 1024 * 1024,
      endByte: 100 * 1024 * 1024,
      status: "active",
    },
  ])
  const [maxThreads, setMaxThreads] = useState(4)
  const [adaptiveBandwidth, setAdaptiveBandwidth] = useState(true)

  const totalProgress = threads.reduce((sum, thread) => sum + thread.progress, 0) / threads.length
  const totalSpeed = threads.reduce((sum, thread) => sum + thread.speed, 0)
  const totalSize = 100 * 1024 * 1024 // 100 MB
  const downloadedSize = totalSize * (totalProgress / 100)

  const toggleDownload = () => {
    setIsDownloading(!isDownloading)
    setThreads(
      threads.map((thread) => ({
        ...thread,
        status: isDownloading ? "paused" : "active",
      })),
    )
  }

  const handleThreadAction = (threadId: number, action: "pause" | "resume") => {
    setThreads(
      threads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              status: action === "pause" ? "paused" : "active",
            }
          : thread,
      ),
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-emerald-500" />
            <CardTitle>Multi-Thread Manager</CardTitle>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Optimize download speed with parallel connections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Sample Download</span>
              <span className="text-slate-400">
                {formatFileSize(downloadedSize)} of {formatFileSize(totalSize)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-500">
              <ArrowDownToLine className="h-4 w-4" />
              <span>{formatFileSize(totalSpeed)}/s</span>
            </div>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="max-threads" className="text-sm">
              Active threads: {maxThreads}
            </Label>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => setMaxThreads(Math.min(8, maxThreads + 1))}
              disabled={maxThreads >= 8}
            >
              <RefreshCw className="h-3 w-3" />
              <span>Add Thread</span>
            </Button>
          </div>
          <Slider
            id="max-threads"
            min={1}
            max={8}
            step={1}
            value={[maxThreads]}
            onValueChange={(value) => setMaxThreads(value[0])}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="adaptive-bandwidth" className="text-sm">
              Adaptive bandwidth management
            </Label>
          </div>
          <Switch id="adaptive-bandwidth" checked={adaptiveBandwidth} onCheckedChange={setAdaptiveBandwidth} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Thread Status</h4>
            <Button variant={isDownloading ? "outline" : "default"} size="sm" onClick={toggleDownload}>
              {isDownloading ? (
                <>
                  <Pause className="mr-1 h-3 w-3" /> Pause All
                </>
              ) : (
                <>
                  <Play className="mr-1 h-3 w-3" /> Resume All
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            {threads.map((thread) => (
              <div key={thread.id} className="rounded-md border border-slate-800 bg-slate-900/50 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-medium">
                      {thread.id}
                    </div>
                    <div className="text-sm font-medium">Thread {thread.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-400">
                      {formatFileSize((thread.endByte - thread.startByte) * (thread.progress / 100))} /{" "}
                      {formatFileSize(thread.endByte - thread.startByte)}
                    </div>
                    {thread.status === "active" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleThreadAction(thread.id, "pause")}
                      >
                        <Pause className="h-3 w-3 text-slate-400" />
                      </Button>
                    )}
                    {thread.status === "paused" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleThreadAction(thread.id, "resume")}
                      >
                        <Play className="h-3 w-3 text-slate-400" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <Progress
                    value={thread.progress}
                    className="h-1.5 flex-1 bg-slate-800"
                    indicatorClassName={
                      thread.status === "completed"
                        ? "bg-emerald-500"
                        : thread.status === "paused"
                          ? "bg-amber-500"
                          : "bg-emerald-600"
                    }
                  />
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <ArrowDownToLine className="h-3 w-3" />
                    <span>{formatFileSize(thread.speed)}/s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import type { Download } from "@/types/download"

interface DownloadEngineProps {
  download: Download
  onProgressUpdate: (progress: number) => void
  onStatusChange: (status: Download["status"]) => void
  onSpeedUpdate: (speed: number) => void
  onThreadsUpdate: (threads: ThreadInfo[]) => void
}

export interface ThreadInfo {
  id: number
  progress: number
  speed: number
  startByte: number
  endByte: number
  status: "active" | "paused" | "completed" | "error"
}

export function DownloadEngine({
  download,
  onProgressUpdate,
  onStatusChange,
  onSpeedUpdate,
  onThreadsUpdate,
}: DownloadEngineProps) {
  const [threads, setThreads] = useState<ThreadInfo[]>([])
  const [overallSpeed, setOverallSpeed] = useState(0)
  const [adaptiveMode, setAdaptiveMode] = useState(true)
  const [networkQuality, setNetworkQuality] = useState<"excellent" | "good" | "fair" | "poor">("good")

  // Simulate network conditions monitoring
  useEffect(() => {
    const monitorNetwork = () => {
      // In a real implementation, this would measure actual network conditions
      const qualities = ["excellent", "good", "fair", "poor"] as const
      const randomQuality = qualities[Math.floor(Math.random() * 4)]
      setNetworkQuality(randomQuality)
    }

    const intervalId = setInterval(monitorNetwork, 5000)
    return () => clearInterval(intervalId)
  }, [])

  // Initialize threads based on file size and network conditions
  useEffect(() => {
    if (download.status !== "downloading") return

    const determineOptimalThreadCount = () => {
      // In a real implementation, this would be more sophisticated
      switch (networkQuality) {
        case "excellent":
          return 8
        case "good":
          return 6
        case "fair":
          return 4
        case "poor":
          return 2
        default:
          return 4
      }
    }

    const threadCount = adaptiveMode ? determineOptimalThreadCount() : 4
    const chunkSize = download.size / threadCount

    const newThreads: ThreadInfo[] = Array.from({ length: threadCount }, (_, i) => ({
      id: i + 1,
      progress: 0,
      speed: 0,
      startByte: Math.floor(i * chunkSize),
      endByte: Math.floor((i + 1) * chunkSize) - 1,
      status: "active",
    }))

    setThreads(newThreads)
    onThreadsUpdate(newThreads)
  }, [download.status, download.size, networkQuality, adaptiveMode, onThreadsUpdate])

  // Simulate download progress for each thread
  useEffect(() => {
    if (download.status !== "downloading" || threads.length === 0) return

    const simulateThreadProgress = () => {
      let totalProgress = 0
      let totalSpeed = 0

      const updatedThreads = threads.map((thread) => {
        if (thread.status !== "active") return thread

        // Simulate different speeds based on network quality
        let speedFactor = 1
        switch (networkQuality) {
          case "excellent":
            speedFactor = 2 + Math.random()
            break
          case "good":
            speedFactor = 1 + Math.random()
            break
          case "fair":
            speedFactor = 0.5 + Math.random() * 0.5
            break
          case "poor":
            speedFactor = 0.1 + Math.random() * 0.4
            break
        }

        // Calculate progress increment (0-2% per interval)
        const progressIncrement = Math.random() * 2 * speedFactor
        const newProgress = Math.min(100, thread.progress + progressIncrement)

        // Calculate speed in KB/s (100-500 KB/s per thread, adjusted by network quality)
        const speed = Math.floor((100 + Math.random() * 400) * speedFactor)

        totalProgress += newProgress
        totalSpeed += speed

        return {
          ...thread,
          progress: newProgress,
          speed,
          status: newProgress >= 100 ? "completed" : "active",
        }
      })

      // Calculate overall progress as average of all threads
      const overallProgress = totalProgress / threads.length

      setThreads(updatedThreads)
      setOverallSpeed(totalSpeed)
      onThreadsUpdate(updatedThreads)
      onProgressUpdate(overallProgress)
      onSpeedUpdate(totalSpeed)

      // Check if all threads are completed
      if (updatedThreads.every((thread) => thread.status === "completed")) {
        onStatusChange("completed")
      }
    }

    const intervalId = setInterval(simulateThreadProgress, 1000)
    return () => clearInterval(intervalId)
  }, [download.status, threads, networkQuality, onProgressUpdate, onStatusChange, onSpeedUpdate, onThreadsUpdate])

  // Handle pause/resume
  useEffect(() => {
    if (download.status === "paused") {
      const pausedThreads = threads.map((thread) => ({
        ...thread,
        status: thread.status === "active" ? ("paused" as const) : thread.status,
      }))
      setThreads(pausedThreads)
      onThreadsUpdate(pausedThreads)
    } else if (download.status === "downloading") {
      const resumedThreads = threads.map((thread) => ({
        ...thread,
        status: thread.status === "paused" ? ("active" as const) : thread.status,
      }))
      setThreads(resumedThreads)
      onThreadsUpdate(resumedThreads)
    }
  }, [download.status, threads, onThreadsUpdate])

  return null // This is a logic component, no UI
}

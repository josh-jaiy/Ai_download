"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Maximize2, Minimize2, Settings } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MediaPlayerProps {
  src: string
  type: "video" | "audio"
  title: string
  poster?: string
  autoPlay?: boolean
  onClose?: () => void
}

export function MediaPlayer({ src, type, title, poster, autoPlay = false, onClose }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [quality, setQuality] = useState<"auto" | "1080p" | "720p" | "480p" | "360p">("auto")
  const [playbackRate, setPlaybackRate] = useState(1)

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    const handleTimeUpdate = () => {
      setCurrentTime(media.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(media.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    media.addEventListener("timeupdate", handleTimeUpdate)
    media.addEventListener("durationchange", handleDurationChange)
    media.addEventListener("ended", handleEnded)

    return () => {
      media.removeEventListener("timeupdate", handleTimeUpdate)
      media.removeEventListener("durationchange", handleDurationChange)
      media.removeEventListener("ended", handleEnded)
    }
  }, [])

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    if (isPlaying) {
      media.play().catch(() => setIsPlaying(false))
    } else {
      media.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    media.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    media.playbackRate = playbackRate
  }, [playbackRate])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const media = mediaRef.current
    if (!media) return

    media.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(value[0] === 0)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreenToggle = () => {
    if (!playerRef.current) return

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleSkipBackward = () => {
    const media = mediaRef.current
    if (!media) return

    media.currentTime = Math.max(0, media.currentTime - 10)
  }

  const handleSkipForward = () => {
    const media = mediaRef.current
    if (!media) return

    media.currentTime = Math.min(media.duration, media.currentTime + 10)
  }

  return (
    <div
      ref={playerRef}
      className={`relative overflow-hidden rounded-lg bg-black ${
        type === "video" ? "aspect-video w-full" : "h-20 w-full"
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {type === "video" ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={src}
          poster={poster}
          className="h-full w-full"
          playsInline
          onClick={handlePlayPause}
        />
      ) : (
        <div className="flex h-full w-full items-center bg-zinc-900">
          <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={src} className="hidden" />
          <div className="flex w-full items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-zinc-800 text-zinc-100"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <div className="ml-4 flex-1">
              <div className="text-sm font-medium text-zinc-100">{title}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-zinc-400">{formatDuration(Math.floor(currentTime))}</span>
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  className="flex-1"
                  onValueChange={handleSeek}
                />
                <span className="text-xs text-zinc-400">{formatDuration(Math.floor(duration))}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === "video" && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            !isPlaying || showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-black/50 text-white"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
        </div>
      )}

      {type === "video" && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${
            !isPlaying || showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-2">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              className="flex-1"
              onValueChange={handleSeek}
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={handleSkipBackward}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={handleSkipForward}>
                <SkipForward className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={handleMuteToggle}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-24"
                  onValueChange={handleVolumeChange}
                />
              </div>
              <div className="text-xs text-white">
                {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-zinc-800 bg-zinc-900">
                  <div className="p-2">
                    <p className="mb-2 text-xs font-medium text-zinc-400">Playback Speed</p>
                    <div className="flex flex-wrap gap-1">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <Button
                          key={rate}
                          variant={playbackRate === rate ? "secondary" : "outline"}
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setPlaybackRate(rate)}
                        >
                          {rate}x
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="mb-2 text-xs font-medium text-zinc-400">Quality</p>
                    <div className="flex flex-wrap gap-1">
                      {["auto", "1080p", "720p", "480p", "360p"].map((q) => (
                        <Button
                          key={q}
                          variant={quality === q ? "secondary" : "outline"}
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setQuality(q as any)}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={handleFullscreenToggle}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

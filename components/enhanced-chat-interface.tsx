"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, Paperclip, Bot, ArrowDown, Sparkles, StopCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Message } from "@/types/chat"
import type { Download } from "@/types/download"
import { v4 as uuidv4 } from "uuid"
import { MessageBubble } from "@/components/message-bubble"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface EnhancedChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: Message) => void
  onDownloadRequest: (download: Download) => void
  className?: string
}

export function EnhancedChatInterface({
  messages,
  onSendMessage,
  onDownloadRequest,
  className,
}: EnhancedChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100
      setShowScrollButton(isScrolledUp)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Generate suggestions based on input
    if (input.length > 2) {
      const newSuggestions = generateSuggestions(input)
      setSuggestions(newSuggestions)
      setShowSuggestions(newSuggestions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [input])

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
      setRecordingTime(0)
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [isRecording])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !voiceTranscript) return
    if (isProcessing) return

    const messageContent = voiceTranscript || input
    setVoiceTranscript("")

    const userMessage: Message = {
      id: uuidv4(),
      content: messageContent,
      role: "user",
      timestamp: new Date(),
    }

    onSendMessage(userMessage)
    setInput("")
    setIsProcessing(true)
    setShowSuggestions(false)

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)

      // Simulate download creation for demo purposes
      if (messageContent.toLowerCase().includes("download")) {
        const download: Download = {
          id: uuidv4(),
          url: "https://example.com/sample-file",
          name: "Sample Download",
          progress: 0,
          size: 1024 * 1024 * 100, // 100 MB
          status: "downloading",
          createdAt: new Date(),
          source: "youtube",
          speed: 1.5 * 1024 * 1024, // 1.5 MB/s
          type: "video",
        }

        onDownloadRequest(download)
      }
    }, 1500)
  }

  const generateSuggestions = (input: string): string[] => {
    // Simple suggestion generation based on input
    const suggestions: string[] = []

    if (input.toLowerCase().includes("download")) {
      suggestions.push("Download the latest YouTube video from MrBeast")
      suggestions.push("Download a PDF of JavaScript: The Definitive Guide")
      suggestions.push("Download the playlist 'Best of 2023'")
    }

    if (input.toLowerCase().includes("youtube")) {
      suggestions.push("Download YouTube video in 4K quality")
      suggestions.push("Get the YouTube playlist 'Learn Python Programming'")
      suggestions.push("Download audio only from this YouTube video")
    }

    if (input.toLowerCase().includes("pdf") || input.toLowerCase().includes("book")) {
      suggestions.push("Download Clean Code by Robert C. Martin")
      suggestions.push("Get the PDF of The Pragmatic Programmer")
      suggestions.push("Find and download books about machine learning")
    }

    // Limit to 3 suggestions
    return suggestions.slice(0, 3)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setShowSuggestions(false)
  }

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)

      // Simulate voice recognition result
      setTimeout(() => {
        const sampleTranscripts = [
          "Download the latest video from TED Talks YouTube channel",
          "Get me a PDF book about artificial intelligence",
          "Download the playlist Best Workout Music 2023",
          "Find and download a documentary about space exploration",
        ]
        const transcript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)]
        setVoiceTranscript(transcript)

        // Auto-submit after a short delay
        setTimeout(() => {
          const userMessage: Message = {
            id: uuidv4(),
            content: transcript,
            role: "user",
            timestamp: new Date(),
          }
          onSendMessage(userMessage)
          setVoiceTranscript("")
          setIsProcessing(true)

          // Simulate processing
          setTimeout(() => {
            setIsProcessing(false)
          }, 1500)
        }, 1000)
      }, 500)
    } else {
      setIsRecording(true)
    }
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
      >
        <div className="mx-auto max-w-3xl space-y-4 pb-20">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {showScrollButton && (
          <div className="pointer-events-none fixed inset-x-0 bottom-24 flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={scrollToBottom}
                    className="pointer-events-auto h-10 w-10 rounded-full bg-emerald-600 p-2 text-white shadow-lg hover:bg-emerald-700"
                    size="icon"
                  >
                    <ArrowDown className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Scroll to bottom</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      <Card className="mx-4 mb-4 border-slate-800 bg-slate-900 p-2 shadow-lg">
        {isProcessing && (
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-1.5 text-sm text-slate-300">
              <div className="flex gap-1">
                <span
                  className="inline-block h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="inline-block h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="inline-block h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
              <span>AI is thinking...</span>
            </div>
          </div>
        )}

        {voiceTranscript && (
          <div className="mb-2 rounded-lg bg-slate-800 p-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600">Voice Input</Badge>
              <span className="text-sm text-slate-300">{voiceTranscript}</span>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="mb-2 rounded-lg bg-red-950/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-red-400">Recording...</span>
                <span className="text-xs text-slate-400">{formatRecordingTime(recordingTime)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-red-400 hover:bg-red-950/50 hover:text-red-300"
                onClick={toggleRecording}
              >
                <StopCircle className="mr-1 h-3.5 w-3.5" />
                Stop
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
              isRecording && "bg-red-950/30 text-red-400",
            )}
            onClick={toggleRecording}
          >
            <Mic className={cn("h-5 w-5", isRecording && "text-red-500")} />
            <span className="sr-only">Use voice input</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>

          <div className="relative flex-1">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to download anything with advanced features..."
              className="border-0 bg-slate-800 pl-4 pr-10 text-slate-100 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-emerald-500"
              disabled={isProcessing || isRecording}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Bot className="h-4 w-4" />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 mb-1 w-full rounded-md border border-slate-700 bg-slate-800 shadow-lg">
                <div className="p-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-slate-700"
                      onClick={() => handleSuggestionClick(suggestion)}
                      type="button"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="line-clamp-1">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700"
            size="icon"
            disabled={(!input.trim() && !voiceTranscript) || isProcessing || isRecording}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </Card>
    </div>
  )
}

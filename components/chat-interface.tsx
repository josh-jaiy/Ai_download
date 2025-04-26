"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Mic, Bot, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { PromptEnhancer } from "./prompt-enhancer"
import type { DownloadSource } from "@/types/download"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  enhanced?: boolean
}

interface ChatInterfaceProps {
  onCreateDownload: (url: string, name: string, source: DownloadSource) => void
}

export function ChatInterface({ onCreateDownload }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I can help you download files, videos, music, and more. What would you like to download today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [showEnhancer, setShowEnhancer] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSendMessage = (content: string, enhanced = false) => {
    if (!content.trim()) return

    // Add user message
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      enhanced,
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue("")
    setShowEnhancer(false)

    // Simulate AI response and download creation
    setTimeout(() => {
      // Determine if this is a download request
      const isDownloadRequest =
        content.toLowerCase().includes("download") ||
        content.toLowerCase().includes("get") ||
        content.toLowerCase().includes("save")

      if (isDownloadRequest) {
        // Determine source type based on content
        let source: DownloadSource = "other"

        if (content.toLowerCase().includes("youtube")) {
          source = "youtube"
        } else if (content.toLowerCase().includes("tiktok")) {
          source = "tiktok"
        } else if (content.toLowerCase().includes("movie") || content.toLowerCase().includes("film")) {
          source = "moviebox"
        } else if (content.toLowerCase().includes("book") || content.toLowerCase().includes("pdf")) {
          source = "book"
        } else if (content.toLowerCase().includes("app") || content.toLowerCase().includes("software")) {
          source = "app"
        }

        // Create a download name based on the request
        const downloadName = content
          .replace(/download|get|save|please|could you|from youtube|from tiktok|from|the/gi, "")
          .trim()
          .split(" ")
          .filter((word) => word.length > 0)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        // Generate a fake URL
        const url = `https://example.com/${downloadName.toLowerCase().replace(/\s+/g, "-")}`

        // Create the download
        onCreateDownload(url, downloadName, source)

        // Add AI response
        const newAiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `I've started downloading "${downloadName}" for you. You can track the progress in the downloads panel.`,
          sender: "ai",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, newAiMessage])
      } else {
        // Regular conversation response
        const newAiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `I understand you want to "${content}". To download something, please ask me to download a specific file, video, or content.`,
          sender: "ai",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, newAiMessage])
      }
    }, 1000)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()

      if (showEnhancer) {
        setShowEnhancer(false)
        handleSendMessage(inputValue)
      } else {
        setCurrentPrompt(inputValue)
        setShowEnhancer(true)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (showEnhancer) {
      setShowEnhancer(false)
      handleSendMessage(inputValue)
    } else {
      setCurrentPrompt(inputValue)
      setShowEnhancer(true)
    }
  }

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  const handleApplyEnhancement = (enhancedPrompt: string) => {
    setInputValue(enhancedPrompt)
    handleSendMessage(enhancedPrompt, true)
  }

  const handleDismissEnhancer = () => {
    setShowEnhancer(false)
    handleSendMessage(inputValue)
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg border border-slate-800">
      <div className="p-3 border-b border-slate-800 flex items-center">
        <Bot className="h-5 w-5 text-emerald-500 mr-2" />
        <h2 className="text-sm font-medium text-slate-200">AI Download Assistant</h2>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex items-start gap-3 max-w-[85%]", message.sender === "user" ? "ml-auto" : "")}
            >
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8 border border-slate-700">
                  <AvatarFallback className="bg-emerald-900 text-emerald-200">AI</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "rounded-lg p-3",
                  message.sender === "user"
                    ? message.enhanced
                      ? "bg-emerald-900/30 border border-emerald-700/50 text-slate-200"
                      : "bg-slate-800 text-slate-200"
                    : "bg-slate-900 border border-slate-800 text-slate-200",
                )}
              >
                {message.enhanced && (
                  <div className="flex items-center gap-1 mb-1 text-xs text-emerald-400">
                    <Sparkles size={12} />
                    <span>Enhanced prompt</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <span className="text-xs text-slate-500 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {message.sender === "user" && (
                <Avatar className="h-8 w-8 border border-slate-700">
                  <AvatarFallback className="bg-slate-700 text-slate-200">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-slate-800 relative">
        {showEnhancer && (
          <div className="absolute bottom-full left-0 right-0 mb-2 px-3">
            <PromptEnhancer
              originalPrompt={currentPrompt}
              onApplyEnhancement={handleApplyEnhancement}
              onDismiss={handleDismissEnhancer}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              "rounded-full h-8 w-8 flex-shrink-0",
              isRecording ? "text-red-500 bg-red-500/20" : "text-slate-400 hover:text-slate-300",
            )}
            onClick={handleVoiceInput}
          >
            <Mic size={18} />
          </Button>

          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask me to download something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500 pr-10"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-emerald-500 hover:text-emerald-400 hover:bg-slate-800"
              onClick={() => {
                setCurrentPrompt(inputValue)
                setShowEnhancer(true)
              }}
              disabled={!inputValue.trim()}
            >
              <Sparkles size={16} />
            </Button>
          </div>

          <Button
            type="submit"
            size="icon"
            className="rounded-full h-8 w-8 flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={!inputValue.trim()}
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MultiThreadManager } from "@/components/multi-thread-manager"
import { MediaPlayer } from "@/components/media-player"
import { CloudStorageIntegration } from "@/components/cloud-storage-integration"
import { EnhancedChatInterface } from "@/components/enhanced-chat-interface"
import { EncryptionManager } from "@/components/encryption-manager"
import { Shield, Play, Cloud, Cpu, MessageSquare, ArrowLeft, Lock, Key, DownloadCloud } from "lucide-react"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"
import type { Message } from "@/types/chat"
import type { Download } from "@/types/download"

export default function AdvancedFeaturesPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      content:
        "Hello! I'm your AI download assistant with advanced features. How can I help you with your downloads today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: uuidv4(),
        content: `I understand you want to "${message.content}". I can help you with that using our advanced features.`,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleDownloadRequest = (download: Download) => {
    console.log("Download requested:", download)
    // In a real app, this would add the download to the download manager
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Features</h1>
          <p className="text-muted-foreground">Powerful enhancements for your AI-powered Internet Download Manager</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Downloads
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MultiThreadManager />
          <CloudStorageIntegration />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Built-in Media Player</CardTitle>
              <CardDescription>Preview your media files directly in the application</CardDescription>
            </CardHeader>
            <CardContent>
              <MediaPlayer
                src="/placeholder.mp4"
                type="video"
                title="Sample Video"
                poster="/placeholder.svg?height=360&width=640"
              />
            </CardContent>
          </Card>
          <EncryptionManager />
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle>Enhanced AI Assistant</CardTitle>
          <CardDescription>
            Interact with our advanced AI assistant to manage downloads and perform complex tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <EnhancedChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              onDownloadRequest={handleDownloadRequest}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Feature Overview</CardTitle>
          <CardDescription>Explore the advanced capabilities of your AI-powered download manager</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="download">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="download" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" /> Multi-Threading
              </TabsTrigger>
              <TabsTrigger value="player" className="flex items-center gap-2">
                <Play className="h-4 w-4" /> Media Player
              </TabsTrigger>
              <TabsTrigger value="cloud" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" /> Cloud Storage
              </TabsTrigger>
              <TabsTrigger value="nlp" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> NLP Interface
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="download" className="space-y-4">
              <h3 className="text-lg font-medium">Multi-Threaded Downloads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-2">
                    Our advanced multi-threading technology significantly increases download speeds by splitting files
                    into multiple parts and downloading them simultaneously.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Split downloads into multiple parallel threads</li>
                    <li>Adaptive bandwidth management for optimal speed</li>
                    <li>Automatic thread adjustment based on network conditions</li>
                    <li>Resume broken downloads from the exact point of interruption</li>
                    <li>Prioritize downloads based on importance</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-900">
                  <h4 className="font-medium mb-2">Performance Improvements</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Single Thread</span>
                        <span>1.5 MB/s</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
                        <div className="h-full bg-gray-500 rounded-full" style={{ width: "25%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Multi-Thread (4)</span>
                        <span>6.2 MB/s</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "75%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Adaptive Multi-Thread</span>
                        <span>8.5 MB/s</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: "95%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="player" className="space-y-4">
              <h3 className="text-lg font-medium">Built-in Media Player</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-2">
                    Preview and play your downloaded media directly in the application, with support for a wide range of
                    formats and codecs.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Preview videos and audio without leaving the app</li>
                    <li>Support for various formats including MP4, MKV, MP3, FLAC</li>
                    <li>Adjustable playback speed and quality</li>
                    <li>Subtitle support for videos</li>
                    <li>Picture-in-picture mode for multitasking</li>
                    <li>Optimized streaming for partial downloads</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-900">
                  <h4 className="font-medium mb-2">Supported Formats</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center bg-white dark:bg-gray-800 rounded p-2">
                      <div className="text-2xl font-bold">MP4</div>
                      <div className="text-xs text-muted-foreground">Video</div>
                    </div>
                    <div className="text-center bg-white dark:bg-gray-800 rounded p-2">
                      <div className="text-2xl font-bold">MKV</div>
                      <div className="text-xs text-muted-foreground">Video</div>
                    </div>
                    <div className="text-center bg-white dark:bg-gray-800 rounded p-2">
                      <div className="text-2xl font-bold">AVI</div>
                      <div className="text-xs text-muted-foreground">Video</div>
                    </div>
                    <div className="text-center bg-white dark:bg-gray-800 rounded p-2">
                      <div className="text-2xl font-bold">MP3</div>
                      <div className="text-xs text-muted-foreground">Audio</div>
                    </div>
                    <div className="text-center bg-white dark:bg-gray-800 rounded p-2">
                      <div className="text-2xl font-bold">FLAC</div>
                      <div className="text-xs text-muted-foreground">Audio</div>
                    </div>
                    <div className="text-center bg-white dark:bg-gray-800 rounded p-2">
                      <div className="text-2xl font-bold">WAV</div>
                      <div className="text-xs text-muted-foreground">Audio</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cloud" className="space-y-4">
              <h3 className="text-lg font-medium">Cloud Storage Integration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-2">
                    Automatically backup and sync your downloads to popular cloud storage services for access anywhere,
                    anytime.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Seamless integration with Google Drive, Dropbox, and OneDrive</li>
                    <li>Automatic upload of completed downloads</li>
                    <li>Selective sync for specific file types</li>
                    <li>End-to-end encryption for cloud storage</li>
                    <li>Cross-device access to your downloads</li>
                    <li>Bandwidth-efficient background synchronization</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-900">
                  <h4 className="font-medium mb-2">Supported Services</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="text-2xl">
                        <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4.433 22l4.935-8.538H22l-4.935 8.538H4.433zm14.037-9.954l-4.935-8.54h3.687l4.935 8.54h-3.687zm-6.308 0L7.226 3.506h8.457l4.935 8.54H12.162z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Google Drive</div>
                        <div className="text-xs text-muted-foreground">15 GB free storage</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="text-2xl">
                        <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 2l6 3.75L6 9.5 0 5.75 6 2zm12 0l6 3.75-6 3.75-6-3.75L18 2zM0 13.25L6 9.5l6 3.75L6 17l-6-3.75zM18 9.5l6 3.75L18 17l-6-3.75 6-3.75zM6 17.5l6-3.75 6 3.75L12 21.25 6 17.5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Dropbox</div>
                        <div className="text-xs text-muted-foreground">2 GB free storage</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="text-2xl">
                        <svg className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10.5 18.5h7.75a3.25 3.25 0 0 0 0-6.5h-.77a5.25 5.25 0 0 0-10.13-2A4.25 4.25 0 0 0 5.75 18.5h4.75z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">OneDrive</div>
                        <div className="text-xs text-muted-foreground">5 GB free storage</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nlp" className="space-y-4">
              <h3 className="text-lg font-medium">Natural Language Processing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-2">
                    Our AI-powered assistant understands natural language commands, making it easier than ever to manage
                    your downloads.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Conversational interface for complex download requests</li>
                    <li>Voice command support for hands-free operation</li>
                    <li>Understanding of context and user preferences</li>
                    <li>Learning from your usage patterns to improve over time</li>
                    <li>Support for multiple languages</li>
                    <li>Smart suggestions based on download history</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-900">
                  <h4 className="font-medium mb-2">Example Commands</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded">
                      "Download the latest episode of [podcast name]"
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded">
                      "Get all videos from this YouTube playlist and save them in 4K quality"
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded">
                      "Download this PDF and convert it to EPUB format"
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded">
                      "Schedule downloads for off-peak hours and notify me when complete"
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded">
                      "Upload my recent downloads to Dropbox and share with Alex"
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <h3 className="text-lg font-medium">End-to-End Encryption</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-2">
                    Keep your downloads secure with military-grade encryption, ensuring your data remains private and
                    protected.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>AES-256 encryption for all downloads</li>
                    <li>Password protection for sensitive files</li>
                    <li>Secure storage with encrypted containers</li>
                    <li>Encrypted transfers to cloud storage</li>
                    <li>Automatic encryption for specified file types</li>
                    <li>Security audit log for tracking access</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-900">
                  <h4 className="font-medium mb-2">Security Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        <span>End-to-End Encryption</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-500">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-emerald-500" />
                        <span>Password Protection</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-500">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-emerald-500" />
                        <span>Access Control</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-500">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        <DownloadCloud className="h-4 w-4 text-emerald-500" />
                        <span>Secure Transfer</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-500">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

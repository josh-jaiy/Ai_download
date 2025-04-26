"use client"

import type React from "react"

import { useState } from "react"
import { Check, Cloud, Database, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { formatFileSize } from "@/lib/utils"

interface CloudStorageProvider {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  connected: boolean
  usedSpace: number
  totalSpace: number
}

interface CloudStoragePanelProps {
  onConnect: (providerId: string) => void
  onDisconnect: (providerId: string) => void
  onUpload: (providerId: string, fileName: string) => void
  className?: string
}

export function CloudStoragePanel({ onConnect, onDisconnect, onUpload, className }: CloudStoragePanelProps) {
  const [providers, setProviders] = useState<CloudStorageProvider[]>([
    {
      id: "google-drive",
      name: "Google Drive",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.433 22l4.935-8.538H22l-4.935 8.538H4.433zm14.037-9.954l-4.935-8.54h3.687l4.935 8.54h-3.687zm-6.308 0L7.226 3.506h8.457l4.935 8.54H12.162z" />
        </svg>
      ),
      color: "text-blue-500",
      connected: true,
      usedSpace: 5.7 * 1024 * 1024 * 1024,
      totalSpace: 15 * 1024 * 1024 * 1024,
    },
    {
      id: "dropbox",
      name: "Dropbox",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2l6 3.75L6 9.5 0 5.75 6 2zm12 0l6 3.75-6 3.75-6-3.75L18 2zM0 13.25L6 9.5l6 3.75L6 17l-6-3.75zM18 9.5l6 3.75L18 17l-6-3.75 6-3.75zM6 17.5l6-3.75 6 3.75L12 21.25 6 17.5z" />
        </svg>
      ),
      color: "text-blue-600",
      connected: false,
      usedSpace: 0,
      totalSpace: 2 * 1024 * 1024 * 1024,
    },
    {
      id: "onedrive",
      name: "OneDrive",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.5 18.5h7.75a3.25 3.25 0 0 0 0-6.5h-.77a5.25 5.25 0 0 0-10.13-2A4.25 4.25 0 0 0 5.75 18.5h4.75z" />
        </svg>
      ),
      color: "text-blue-400",
      connected: false,
      usedSpace: 0,
      totalSpace: 5 * 1024 * 1024 * 1024,
    },
  ])

  const [autoUploadEnabled, setAutoUploadEnabled] = useState(false)
  const [defaultProvider, setDefaultProvider] = useState<string | null>("google-drive")

  const handleConnect = (providerId: string) => {
    setProviders(
      providers.map((provider) => (provider.id === providerId ? { ...provider, connected: true } : provider)),
    )
    onConnect(providerId)
  }

  const handleDisconnect = (providerId: string) => {
    setProviders(
      providers.map((provider) => (provider.id === providerId ? { ...provider, connected: false } : provider)),
    )
    onDisconnect(providerId)
    if (defaultProvider === providerId) {
      setDefaultProvider(null)
    }
  }

  const handleSetDefault = (providerId: string) => {
    setDefaultProvider(providerId)
  }

  const handleAutoUploadToggle = () => {
    setAutoUploadEnabled(!autoUploadEnabled)
  }

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Cloud Storage</h3>
        <div className="flex items-center gap-2">
          <Switch id="auto-upload" checked={autoUploadEnabled} onCheckedChange={handleAutoUploadToggle} />
          <Label htmlFor="auto-upload" className="text-sm">
            Auto-upload
          </Label>
        </div>
      </div>

      <div className="space-y-3">
        {providers.map((provider) => (
          <div key={provider.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 ${provider.color}`}>
                  {provider.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{provider.name}</h4>
                    {defaultProvider === provider.id && (
                      <Badge className="bg-zinc-800 text-zinc-300 text-xs">Default</Badge>
                    )}
                  </div>
                  {provider.connected && (
                    <div className="mt-1 text-xs text-zinc-400">
                      {formatFileSize(provider.usedSpace)} of {formatFileSize(provider.totalSpace)} used
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {provider.connected ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 border-zinc-800 bg-zinc-900">
                      {defaultProvider !== provider.id && (
                        <DropdownMenuItem onClick={() => handleSetDefault(provider.id)}>
                          <Check className="mr-2 h-4 w-4" />
                          Set as default
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDisconnect(provider.id)}>
                        <Cloud className="mr-2 h-4 w-4" />
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                    onClick={() => handleConnect(provider.id)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>

            {provider.connected && (
              <div className="mt-2">
                <Progress
                  value={(provider.usedSpace / provider.totalSpace) * 100}
                  className="h-1.5 bg-zinc-800"
                  indicatorClassName="bg-blue-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {autoUploadEnabled && (
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-zinc-400" />
            <span className="text-sm">Auto-upload settings</span>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="default-provider" className="text-sm text-zinc-400">
                Default provider
              </Label>
              <select
                id="default-provider"
                className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm"
                value={defaultProvider || ""}
                onChange={(e) => setDefaultProvider(e.target.value || null)}
              >
                <option value="">Select provider</option>
                {providers
                  .filter((p) => p.connected)
                  .map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="upload-folder" className="text-sm text-zinc-400">
                Upload folder
              </Label>
              <input
                id="upload-folder"
                className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm"
                defaultValue="/Downloads"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

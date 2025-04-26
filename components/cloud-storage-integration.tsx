"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Cloud, Check, MoreHorizontal, Upload, RefreshCw, Settings } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CloudProvider {
  id: string
  name: string
  connected: boolean
  usedSpace: number
  totalSpace: number
  icon: string
  color: string
}

export function CloudStorageIntegration() {
  const [providers, setProviders] = useState<CloudProvider[]>([
    {
      id: "google-drive",
      name: "Google Drive",
      connected: true,
      usedSpace: 5.7 * 1024 * 1024 * 1024, // 5.7 GB
      totalSpace: 15 * 1024 * 1024 * 1024, // 15 GB
      icon: "google-drive",
      color: "text-blue-500",
    },
    {
      id: "dropbox",
      name: "Dropbox",
      connected: false,
      usedSpace: 0,
      totalSpace: 2 * 1024 * 1024 * 1024, // 2 GB
      icon: "dropbox",
      color: "text-blue-600",
    },
    {
      id: "onedrive",
      name: "OneDrive",
      connected: false,
      usedSpace: 0,
      totalSpace: 5 * 1024 * 1024 * 1024, // 5 GB
      icon: "onedrive",
      color: "text-blue-400",
    },
  ])
  const [autoUploadEnabled, setAutoUploadEnabled] = useState(true)
  const [defaultProvider, setDefaultProvider] = useState<string>("google-drive")
  const [syncInProgress, setSyncInProgress] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)

  const handleConnect = (providerId: string) => {
    setProviders(
      providers.map((provider) => (provider.id === providerId ? { ...provider, connected: true } : provider)),
    )
    if (!defaultProvider) {
      setDefaultProvider(providerId)
    }
  }

  const handleDisconnect = (providerId: string) => {
    setProviders(
      providers.map((provider) => (provider.id === providerId ? { ...provider, connected: false } : provider)),
    )
    if (defaultProvider === providerId) {
      const connectedProviders = providers.filter((p) => p.connected && p.id !== providerId)
      setDefaultProvider(connectedProviders.length > 0 ? connectedProviders[0].id : "")
    }
  }

  const handleSetDefault = (providerId: string) => {
    setDefaultProvider(providerId)
  }

  const startSync = () => {
    setSyncInProgress(true)
    setSyncProgress(0)

    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => setSyncInProgress(false), 500)
          return 100
        }
        return newProgress
      })
    }, 500)
  }

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case "google-drive":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.433 22l4.935-8.538H22l-4.935 8.538H4.433zm14.037-9.954l-4.935-8.54h3.687l4.935 8.54h-3.687zm-6.308 0L7.226 3.506h8.457l4.935 8.54H12.162z" />
          </svg>
        )
      case "dropbox":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2l6 3.75L6 9.5 0 5.75 6 2zm12 0l6 3.75-6 3.75-6-3.75L18 2zM0 13.25L6 9.5l6 3.75L6 17l-6-3.75zM18 9.5l6 3.75L18 17l-6-3.75 6-3.75zM6 17.5l6-3.75 6 3.75L12 21.25 6 17.5z" />
          </svg>
        )
      case "onedrive":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.5 18.5h7.75a3.25 3.25 0 0 0 0-6.5h-.77a5.25 5.25 0 0 0-10.13-2A4.25 4.25 0 0 0 5.75 18.5h4.75z" />
          </svg>
        )
      default:
        return <Cloud className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-emerald-500" />
            <CardTitle>Cloud Storage</CardTitle>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Sync your downloads to cloud storage services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-upload" className="text-sm">
              Auto-upload completed downloads
            </Label>
          </div>
          <Switch id="auto-upload" checked={autoUploadEnabled} onCheckedChange={setAutoUploadEnabled} />
        </div>

        {syncInProgress && (
          <div className="space-y-2 rounded-md border border-emerald-900/50 bg-emerald-950/20 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-400">Syncing to cloud...</span>
              <span className="text-emerald-400">{Math.round(syncProgress)}%</span>
            </div>
            <Progress value={syncProgress} className="h-1.5" indicatorClassName="bg-emerald-500" />
          </div>
        )}

        <div className="space-y-3">
          {providers.map((provider) => (
            <div key={provider.id} className="rounded-md border border-slate-800 bg-slate-900/50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 ${provider.color}`}
                  >
                    {getProviderIcon(provider.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{provider.name}</h4>
                      {defaultProvider === provider.id && provider.connected && (
                        <Badge className="bg-slate-800 text-slate-300 text-xs">Default</Badge>
                      )}
                    </div>
                    {provider.connected && (
                      <div className="mt-1 text-xs text-slate-400">
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
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => startSync()} className="cursor-pointer">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync now
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSetDefault(provider.id)} className="cursor-pointer">
                          <Check className="mr-2 h-4 w-4" />
                          Set as default
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDisconnect(provider.id)} className="cursor-pointer">
                          <Cloud className="mr-2 h-4 w-4" />
                          Disconnect
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-slate-700 bg-slate-800 hover:bg-slate-700"
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
                    className="h-1.5 bg-slate-800"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {autoUploadEnabled && providers.some((p) => p.connected) && (
          <Button className="w-full gap-2" onClick={startSync} disabled={syncInProgress}>
            <Upload className="h-4 w-4" />
            <span>Sync All Downloads</span>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

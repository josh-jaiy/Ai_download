"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudStoragePanel } from "./cloud-storage-panel"
import { EncryptionSettings } from "./encryption-settings"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Download, Shield, Cloud, Zap, Wifi, Save, Mic, VolumeX, Volume2, Gauge, Folder } from "lucide-react"

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [maxThreads, setMaxThreads] = useState(6)
  const [adaptiveBandwidth, setAdaptiveBandwidth] = useState(true)
  const [maxBandwidth, setMaxBandwidth] = useState(0) // 0 means unlimited
  const [downloadLocation, setDownloadLocation] = useState("~/Downloads")
  const [autoOrganize, setAutoOrganize] = useState(true)
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [notificationSound, setNotificationSound] = useState(true)
  const [notificationVolume, setNotificationVolume] = useState(70)
  const [encryptionEnabled, setEncryptionEnabled] = useState(false)
  const [encryptionKey, setEncryptionKey] = useState("")

  return (
    <Card className="border-zinc-800 bg-zinc-900 shadow-lg">
      <CardHeader className="border-b border-zinc-800 bg-zinc-950 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-medium">Settings</CardTitle>
            <CardDescription className="mt-1 text-zinc-400">
              Configure your download manager preferences
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="download" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-zinc-800 bg-zinc-950">
            <TabsTrigger
              value="download"
              className="rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Downloads</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
            >
              <Shield className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="cloud"
              className="rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
            >
              <Cloud className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Cloud</span>
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="rounded-none py-3 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="download" className="p-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-emerald-500" />
                  Download Performance
                </h3>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-threads" className="text-sm">
                        Maximum download threads
                      </Label>
                      <span className="text-sm text-zinc-400">{maxThreads}</span>
                    </div>
                    <Slider
                      id="max-threads"
                      min={1}
                      max={16}
                      step={1}
                      value={[maxThreads]}
                      onValueChange={(value) => setMaxThreads(value[0])}
                    />
                    <p className="text-xs text-zinc-500">
                      Higher values may increase download speed but can impact system performance.
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-zinc-400" />
                      <Label htmlFor="adaptive-bandwidth" className="text-sm">
                        Adaptive bandwidth management
                      </Label>
                    </div>
                    <Switch
                      id="adaptive-bandwidth"
                      checked={adaptiveBandwidth}
                      onCheckedChange={setAdaptiveBandwidth}
                    />
                  </div>

                  {!adaptiveBandwidth && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="max-bandwidth" className="text-sm">
                          Maximum bandwidth (MB/s)
                        </Label>
                        <span className="text-sm text-zinc-400">{maxBandwidth === 0 ? "Unlimited" : maxBandwidth}</span>
                      </div>
                      <Slider
                        id="max-bandwidth"
                        min={0}
                        max={100}
                        step={1}
                        value={[maxBandwidth]}
                        onValueChange={(value) => setMaxBandwidth(value[0])}
                      />
                      <p className="text-xs text-zinc-500">Set to 0 for unlimited bandwidth.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-lg font-medium flex items-center">
                  <Folder className="mr-2 h-5 w-5 text-emerald-500" />
                  File Management
                </h3>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="download-location" className="text-sm">
                      Download location
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="download-location"
                        value={downloadLocation}
                        onChange={(e) => setDownloadLocation(e.target.value)}
                        className="border-zinc-700 bg-zinc-800"
                      />
                      <Button variant="outline" className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700">
                        Browse
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4 text-zinc-400" />
                      <Label htmlFor="auto-organize" className="text-sm">
                        Automatically organize downloads by type
                      </Label>
                    </div>
                    <Switch id="auto-organize" checked={autoOrganize} onCheckedChange={setAutoOrganize} />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="p-4">
            <EncryptionSettings onToggleEncryption={setEncryptionEnabled} onKeyChange={setEncryptionKey} />
          </TabsContent>

          <TabsContent value="cloud" className="p-4">
            <CloudStoragePanel
              onConnect={(providerId) => console.log(`Connected to ${providerId}`)}
              onDisconnect={(providerId) => console.log(`Disconnected from ${providerId}`)}
              onUpload={(providerId, fileName) => console.log(`Uploading ${fileName} to ${providerId}`)}
            />
          </TabsContent>

          <TabsContent value="advanced" className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <Mic className="mr-2 h-5 w-5 text-emerald-500" />
                Voice Commands
              </h3>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-commands" className="text-sm">
                    Enable voice commands
                  </Label>
                  <Switch
                    id="voice-commands"
                    checked={voiceCommandsEnabled}
                    onCheckedChange={setVoiceCommandsEnabled}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium flex items-center">
                <Gauge className="mr-2 h-5 w-5 text-emerald-500" />
                Performance Monitoring
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="text-sm">
                    Enable notifications
                  </Label>
                  <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                </div>

                {notificationsEnabled && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {notificationSound ? (
                          <Volume2 className="h-4 w-4 text-zinc-400" />
                        ) : (
                          <VolumeX className="h-4 w-4 text-zinc-400" />
                        )}
                        <Label htmlFor="notification-sound" className="text-sm">
                          Notification sound
                        </Label>
                      </div>
                      <Switch
                        id="notification-sound"
                        checked={notificationSound}
                        onCheckedChange={setNotificationSound}
                      />
                    </div>

                    {notificationSound && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notification-volume" className="text-sm">
                            Notification volume
                          </Label>
                          <span className="text-sm text-zinc-400">{notificationVolume}%</span>
                        </div>
                        <Slider
                          id="notification-volume"
                          min={0}
                          max={100}
                          step={1}
                          value={[notificationVolume]}
                          onValueChange={(value) => setNotificationVolume(value[0])}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

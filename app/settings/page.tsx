"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Trash2, RefreshCw, Shield, Cpu, Cloud, Bot, Folder } from "lucide-react"

export default function SettingsPage() {
  const [downloadPath, setDownloadPath] = useState("/Users/username/Downloads")
  const [maxDownloads, setMaxDownloads] = useState(5)
  const [maxSpeed, setMaxSpeed] = useState(0) // 0 means unlimited
  const [autoStart, setAutoStart] = useState(true)
  const [autoExtract, setAutoExtract] = useState(true)
  const [notifyOnComplete, setNotifyOnComplete] = useState(true)
  const [defaultQuality, setDefaultQuality] = useState("1080p")
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(true)
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true)
  const [multiThreadingEnabled, setMultiThreadingEnabled] = useState(true)
  const [maxThreads, setMaxThreads] = useState(4)
  const [adaptiveBandwidth, setAdaptiveBandwidth] = useState(true)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure your AI Download Manager preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>Reset to Default</span>
          </Button>
          <Button className="gap-1">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="download-path">Default Download Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="download-path"
                    value={downloadPath}
                    onChange={(e) => setDownloadPath(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" className="gap-1">
                    <Folder className="h-4 w-4" />
                    <span>Browse</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-start">Start downloads automatically</Label>
                <Switch id="auto-start" checked={autoStart} onCheckedChange={setAutoStart} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-extract">Extract archives automatically</Label>
                <Switch id="auto-extract" checked={autoExtract} onCheckedChange={setAutoExtract} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notify-complete">Notify when downloads complete</Label>
                <Switch id="notify-complete" checked={notifyOnComplete} onCheckedChange={setNotifyOnComplete} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-quality">Default Video Quality</Label>
                <Select value={defaultQuality} onValueChange={setDefaultQuality}>
                  <SelectTrigger id="default-quality">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4k">4K</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="480p">480p</SelectItem>
                    <SelectItem value="360p">360p</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Light
                  </Button>
                  <Button variant="default" className="flex-1">
                    Dark
                  </Button>
                  <Button variant="outline" className="flex-1">
                    System
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">Emerald</Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Blue</Button>
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Purple</Button>
                  <Button className="flex-1 bg-amber-600 hover:bg-amber-700">Amber</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Download Settings</CardTitle>
              <CardDescription>Configure how downloads are handled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-downloads">Maximum concurrent downloads: {maxDownloads}</Label>
                </div>
                <Slider
                  id="max-downloads"
                  min={1}
                  max={10}
                  step={1}
                  value={[maxDownloads]}
                  onValueChange={(value) => setMaxDownloads(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-speed">
                    Maximum download speed: {maxSpeed === 0 ? "Unlimited" : `${maxSpeed} MB/s`}
                  </Label>
                </div>
                <Slider
                  id="max-speed"
                  min={0}
                  max={100}
                  step={1}
                  value={[maxSpeed]}
                  onValueChange={(value) => setMaxSpeed(value[0])}
                />
                <p className="text-xs text-slate-400">Set to 0 for unlimited speed</p>
              </div>

              <div className="space-y-2">
                <Label>File Handling</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">When file exists:</span>
                    <Select defaultValue="ask">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ask">Ask what to do</SelectItem>
                        <SelectItem value="overwrite">Overwrite</SelectItem>
                        <SelectItem value="rename">Rename automatically</SelectItem>
                        <SelectItem value="skip">Skip download</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Default download category:</span>
                    <Select defaultValue="auto">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-detect</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="application">Application</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-1">
                <Trash2 className="h-4 w-4" />
                <span>Clear Download History</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-emerald-500" />
                <span>Multi-Threading</span>
              </CardTitle>
              <CardDescription>Configure multi-threaded download settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="multi-threading">Enable multi-threaded downloads</Label>
                <Switch
                  id="multi-threading"
                  checked={multiThreadingEnabled}
                  onCheckedChange={setMultiThreadingEnabled}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-threads">Maximum threads per download: {maxThreads}</Label>
                </div>
                <Slider
                  id="max-threads"
                  min={1}
                  max={8}
                  step={1}
                  value={[maxThreads]}
                  onValueChange={(value) => setMaxThreads(value[0])}
                  disabled={!multiThreadingEnabled}
                  className={!multiThreadingEnabled ? "opacity-50" : ""}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="adaptive-bandwidth">Adaptive bandwidth management</Label>
                <Switch
                  id="adaptive-bandwidth"
                  checked={adaptiveBandwidth}
                  onCheckedChange={setAdaptiveBandwidth}
                  disabled={!multiThreadingEnabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-emerald-500" />
                <span>AI Assistant</span>
              </CardTitle>
              <CardDescription>Configure AI assistant behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-assistant">Enable AI download assistant</Label>
                <Switch id="ai-assistant" checked={aiAssistantEnabled} onCheckedChange={setAiAssistantEnabled} />
              </div>

              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select defaultValue="gpt-4" disabled={!aiAssistantEnabled}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5 (Faster)</SelectItem>
                    <SelectItem value="local">Local Model (Privacy-focused)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="voice-commands">Enable voice commands</Label>
                <Switch id="voice-commands" defaultChecked={true} disabled={!aiAssistantEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="prompt-enhancer">Enable prompt enhancer</Label>
                <Switch id="prompt-enhancer" defaultChecked={true} disabled={!aiAssistantEnabled} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Configure security and privacy options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="encryption">Enable end-to-end encryption</Label>
                <Switch id="encryption" checked={encryptionEnabled} onCheckedChange={setEncryptionEnabled} />
              </div>

              <div className="space-y-2">
                <Label>Encryption Type</Label>
                <Select defaultValue="aes-256" disabled={!encryptionEnabled}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select encryption type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aes-256">AES-256 (Recommended)</SelectItem>
                    <SelectItem value="aes-128">AES-128 (Faster)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-encrypt">Automatically encrypt sensitive files</Label>
                <Switch id="auto-encrypt" defaultChecked={true} disabled={!encryptionEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="secure-delete">Secure file deletion</Label>
                <Switch id="secure-delete" defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="scan-malware">Scan downloads for malware</Label>
                <Switch id="scan-malware" defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-emerald-500" />
                <span>Cloud Storage</span>
              </CardTitle>
              <CardDescription>Configure cloud storage integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="cloud-sync">Enable cloud storage sync</Label>
                <Switch id="cloud-sync" checked={cloudSyncEnabled} onCheckedChange={setCloudSyncEnabled} />
              </div>

              <div className="space-y-2">
                <Label>Default Cloud Service</Label>
                <Select defaultValue="google-drive" disabled={!cloudSyncEnabled}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cloud service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google-drive">Google Drive</SelectItem>
                    <SelectItem value="dropbox">Dropbox</SelectItem>
                    <SelectItem value="onedrive">OneDrive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-upload">Automatically upload completed downloads</Label>
                <Switch id="auto-upload" defaultChecked={true} disabled={!cloudSyncEnabled} />
              </div>

              <div className="space-y-2">
                <Label>Connected Accounts</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-md border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                        <div className="i-logos-google-drive text-xl"></div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Google Drive</div>
                        <div className="text-xs text-slate-500">user@example.com</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Disconnect
                    </Button>
                  </div>

                  <Button variant="outline" className="w-full gap-1">
                    <Cloud className="h-4 w-4" />
                    <span>Connect Another Account</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Integrations</CardTitle>
              <CardDescription>Configure additional service integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Browser Extension</div>
                  <div className="text-sm text-slate-500">Capture downloads from your browser</div>
                </div>
                <Button variant="outline" size="sm">
                  Install
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Media Player</div>
                  <div className="text-sm text-slate-500">Preview media files directly</div>
                </div>
                <Switch defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notification Service</div>
                  <div className="text-sm text-slate-500">Get notified on mobile devices</div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

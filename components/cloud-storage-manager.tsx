"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Cloud, Download, FileText, Trash, Upload } from "lucide-react"
import { useState } from "react"

interface CloudStorageManagerProps {
  providers: {
    id: string
    name: string
    connected: boolean
  }[]
  downloads: {
    id: string
    name: string
    size: number
    type: string
    status: "completed" | "pending" | "error"
    createdAt: Date
  }[]
  cloudFiles: {
    id: string
    name: string
    size: number
    type: string
    providerId: string
    downloadId: string
  }[]
  uploadProgress: {
    [downloadId: string]: number
  }
  handleUploadFile: (downloadId: string) => void
  handleDeleteFile: (fileId: string) => void
  formatFileSize: (bytes: number) => string
}

export function CloudStorageManager({
  providers,
  downloads,
  cloudFiles,
  uploadProgress,
  handleUploadFile,
  handleDeleteFile,
  formatFileSize,
}: CloudStorageManagerProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [globalSyncEnabled, setGlobalSyncEnabled] = useState(false)
  const [defaultProvider, setDefaultProvider] = useState("")

  const renderProviderCard = (provider: { id: string; name: string; connected: boolean }) => {
    return (
      <Card key={provider.id} className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>{provider.name}</CardTitle>
          <CardDescription>{provider.connected ? "Connected" : "Not Connected"}</CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            variant="outline"
            className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
            onClick={() => setSelectedProvider(provider.id)}
          >
            {provider.connected ? "Disconnect" : "Connect"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <Tabs defaultValue="files" className="space-y-4">
        <TabsList>
          <TabsTrigger value="files">Cloud Files</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Cloud Files</CardTitle>
              <CardDescription>
                Manage your files stored in {providers.find((p) => p.id === selectedProvider)?.name || "cloud storage"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-[300px]">
                {cloudFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                    <FileText className="h-12 w-12 text-zinc-700" />
                    <h3 className="mt-4 text-base font-medium">No files in cloud</h3>
                    <p className="mt-2 text-center text-sm text-zinc-500">
                      Upload downloads to cloud storage to see them here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cloudFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-800/50 p-3"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {file.type === "video" ? (
                            <FileText className="h-5 w-5 text-blue-500" />
                          ) : file.type === "document" || file.type === "book" ? (
                            <FileText className="h-5 w-5 text-amber-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-zinc-400" />
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{file.name}</p>
                            <p className="text-xs text-zinc-400">{formatFileSize(file.size)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {file.type !== "folder" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}

                          {file.type !== "folder" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Upload to Cloud</CardTitle>
              <CardDescription>
                Select downloads to upload to{" "}
                {providers.find((p) => p.id === selectedProvider)?.name || "cloud storage"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-[300px]">
                {downloads.filter((d) => d.status === "completed").length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                    <Upload className="h-12 w-12 text-zinc-700" />
                    <h3 className="mt-4 text-base font-medium">No completed downloads</h3>
                    <p className="mt-2 text-center text-sm text-zinc-500">
                      Complete downloads to upload them to cloud storage
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {downloads
                      .filter((d) => d.status === "completed")
                      .map((download) => {
                        const isUploaded = cloudFiles.some((file) => file.downloadId === download.id)
                        const isUploading =
                          uploadProgress[download.id] !== undefined && uploadProgress[download.id] < 100

                        return (
                          <div
                            key={download.id}
                            className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-800/50 p-3"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {download.type === "video" ? (
                                <FileText className="h-5 w-5 text-blue-500" />
                              ) : download.type === "document" || download.type === "book" ? (
                                <FileText className="h-5 w-5 text-amber-500" />
                              ) : (
                                <FileText className="h-5 w-5 text-zinc-400" />
                              )}

                              <div className="flex-1 min-w-0">
                                <p className="truncate font-medium">{download.name}</p>
                                <p className="text-xs text-zinc-400">
                                  {formatFileSize(download.size)} • {new Date(download.createdAt).toLocaleDateString()}
                                </p>

                                {isUploading && (
                                  <div className="mt-2">
                                    <Progress
                                      value={uploadProgress[download.id]}
                                      className="h-1.5 bg-zinc-800"
                                      indicatorClassName="bg-blue-500"
                                    />
                                    <p className="text-xs text-zinc-400 mt-1">
                                      Uploading: {Math.round(uploadProgress[download.id])}%
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              {isUploaded ? (
                                <Badge className="bg-emerald-600 hover:bg-emerald-700">Uploaded</Badge>
                              ) : isUploading ? (
                                <Badge className="bg-blue-600 hover:bg-blue-700">Uploading</Badge>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                                  onClick={() => handleUploadFile(download.id)}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">{providers.map(renderProviderCard)}</div>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Add New Storage Provider</CardTitle>
              <CardDescription>Connect to additional cloud storage services</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-6 border-dashed border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Cloud className="h-8 w-8 text-zinc-400" />
                    <span>Add New Provider</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Cloud Sync Settings</CardTitle>
              <CardDescription>Configure how your downloads sync to cloud storage</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Auto-sync completed downloads</h3>
                    <p className="text-xs text-zinc-400">
                      Automatically upload completed downloads to your default cloud provider
                    </p>
                  </div>
                  <Switch id="auto-sync" checked={globalSyncEnabled} onCheckedChange={setGlobalSyncEnabled} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-provider">Default cloud provider</Label>
                  <select
                    id="default-provider"
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
                    value={defaultProvider}
                    onChange={(e) => setDefaultProvider(e.target.value)}
                    disabled={!globalSyncEnabled}
                  >
                    <option value="">Select a provider</option>
                    {providers
                      .filter((p) => p.connected)
                      .map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-path">Default upload path</Label>
                  <Input
                    id="upload-path"
                    value="/Downloads"
                    className="bg-zinc-800 border-zinc-700"
                    disabled={!globalSyncEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Encrypt files before upload</h3>
                    <p className="text-xs text-zinc-400">
                      Add an extra layer of security by encrypting files before uploading to cloud
                    </p>
                  </div>
                  <Switch id="encrypt-files" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Preserve folder structure</h3>
                    <p className="text-xs text-zinc-400">
                      Maintain the same folder structure in cloud as in local storage
                    </p>
                  </div>
                  <Switch id="preserve-structure" defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <h3 className="text-sm font-medium mb-4">File Type Sync Rules</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sync-videos" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      Videos
                    </Label>
                    <Switch id="sync-videos" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sync-documents" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-500" />
                      Documents
                    </Label>
                    <Switch id="sync-documents" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sync-audio" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-500" />
                      Audio
                    </Label>
                    <Switch id="sync-audio" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sync-applications" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      Applications
                    </Label>
                    <Switch id="sync-applications" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced cloud storage options</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chunk-size">Upload chunk size</Label>
                <select
                  id="chunk-size"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
                  defaultValue="5"
                >
                  <option value="1">1 MB</option>
                  <option value="5">5 MB</option>
                  <option value="10">10 MB</option>
                  <option value="20">20 MB</option>
                </select>
                <p className="text-xs text-zinc-400">
                  Larger chunks upload faster but are more prone to failure on unstable connections
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Retry failed uploads</h3>
                  <p className="text-xs text-zinc-400">
                    Automatically retry uploads that fail due to connection issues
                  </p>
                </div>
                <Switch id="retry-uploads" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Background uploads</h3>
                  <p className="text-xs text-zinc-400">
                    Continue uploading files even when the application is minimized
                  </p>
                </div>
                <Switch id="background-uploads" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-concurrent">Maximum concurrent uploads</Label>
                <Input
                  id="max-concurrent"
                  type="number"
                  defaultValue="3"
                  min="1"
                  max="10"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

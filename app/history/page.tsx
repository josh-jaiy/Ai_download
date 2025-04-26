import { Suspense } from "react"
import { getDownloads } from "../actions/download-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Download } from "@prisma/client"

export default async function HistoryPage() {
  const { downloads, error } = await getDownloads("completed")

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Download History</h1>
      <Suspense fallback={<div>Loading history...</div>}>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Tabs defaultValue="list">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Downloads</CardTitle>
                  <CardDescription>View all your completed downloads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {downloads && downloads.length > 0 ? (
                      downloads.map((download: Download) => (
                        <div key={download.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{download.name}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(download.completedAt || "").toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{Math.round(download.size / (1024 * 1024))} MB</span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              {download.source}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">No completed downloads found</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grid">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Downloads</CardTitle>
                  <CardDescription>View all your completed downloads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {downloads && downloads.length > 0 ? (
                      downloads.map((download: Download) => (
                        <div key={download.id} className="p-4 border rounded-lg">
                          <div className="h-32 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                            {download.thumbnail ? (
                              <img
                                src={download.thumbnail || "/placeholder.svg"}
                                alt={download.name}
                                className="h-full w-full object-cover rounded-md"
                              />
                            ) : (
                              <div className="text-gray-400">No Preview</div>
                            )}
                          </div>
                          <h3 className="font-medium truncate">{download.name}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-500">
                              {Math.round(download.size / (1024 * 1024))} MB
                            </span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              {download.source}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-4">No completed downloads found</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </Suspense>
    </div>
  )
}

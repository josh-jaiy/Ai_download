"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DownloadStatusDashboard } from "@/components/download-status-dashboard"
import { DownloadAnalytics } from "@/components/download-analytics"
import { CloudStorageManager } from "@/components/cloud-storage-manager"
import { DownloadScheduler } from "@/components/download-scheduler"
import { Header } from "@/components/header"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MobileNavbar } from "@/components/mobile-navbar"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("status")
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50">
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} isDesktop={isDesktop} />

        {!isDesktop && (
          <MobileNavbar
            onViewChange={(view) => setActiveTab(view === "downloads" ? "status" : view)}
            currentView={activeTab === "status" ? "downloads" : activeTab}
            downloadCount={0}
            historyCount={0}
          />
        )}

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-zinc-800 bg-zinc-900">
            <div className="container py-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="status">Status Dashboard</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="cloud">Cloud Storage</TabsTrigger>
                  <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent value="status" className="h-full">
              <DownloadStatusDashboard />
            </TabsContent>
            <TabsContent value="analytics" className="h-full">
              <DownloadAnalytics />
            </TabsContent>
            <TabsContent value="cloud" className="h-full">
              <CloudStorageManager />
            </TabsContent>
            <TabsContent value="scheduler" className="h-full">
              <DownloadScheduler />
            </TabsContent>
          </div>
        </main>
      </div>
    </div>
  )
}

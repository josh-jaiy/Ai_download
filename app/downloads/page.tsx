import { Suspense } from "react"
import { getDownloads } from "../actions/download-actions"
import DownloadDashboard from "@/components/download-dashboard"

export default async function DownloadsPage({
  searchParams,
}: {
  searchParams: { status?: string; source?: string; search?: string }
}) {
  const { status, source, search } = searchParams
  const { downloads, error } = await getDownloads(status, source, search)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Downloads</h1>
      <Suspense fallback={<div>Loading downloads...</div>}>
        {error ? <div className="text-red-500">{error}</div> : <DownloadDashboard initialDownloads={downloads || []} />}
      </Suspense>
    </div>
  )
}

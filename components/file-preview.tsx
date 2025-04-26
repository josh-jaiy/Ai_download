import type { Download } from "@/types/download"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FileVideo, FileAudio, Package, DownloadIcon, ExternalLink, Folder, Share2 } from "lucide-react"
import { formatFileSize, formatDate } from "@/lib/utils"

interface FilePreviewProps {
  download: Download
}

export function FilePreview({ download }: FilePreviewProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-16 w-16 text-red-500" />
      case "video":
        return <FileVideo className="h-16 w-16 text-blue-500" />
      case "audio":
        return <FileAudio className="h-16 w-16 text-purple-500" />
      case "application":
        return <Package className="h-16 w-16 text-orange-500" />
      default:
        return <DownloadIcon className="h-16 w-16 text-gray-500" />
    }
  }

  const getPreviewContent = (type: string) => {
    switch (type) {
      case "pdf":
        return (
          <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-center h-48">
            <div className="text-center">
              <FileText className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-slate-300">PDF Preview</p>
              <p className="text-xs text-slate-400 mt-1">Preview not available</p>
            </div>
          </div>
        )
      case "video":
        return (
          <div className="bg-slate-800 rounded-lg overflow-hidden h-48">
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <div className="text-center">
                <FileVideo className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-slate-300">Video Preview</p>
                <p className="text-xs text-slate-400 mt-1">Preview not available</p>
              </div>
            </div>
          </div>
        )
      case "audio":
        return (
          <div className="bg-slate-800 rounded-lg p-4 h-48">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <FileAudio className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-slate-300">Audio Preview</p>
                <p className="text-xs text-slate-400 mt-1">Preview not available</p>
              </div>
            </div>
          </div>
        )
      case "application":
        return (
          <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-center h-48">
            <div className="text-center">
              <Package className="h-12 w-12 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-slate-300">Application Preview</p>
              <p className="text-xs text-slate-400 mt-1">Preview not available</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-center h-48">
            <div className="text-center">
              <DownloadIcon className="h-12 w-12 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-slate-300">File Preview</p>
              <p className="text-xs text-slate-400 mt-1">Preview not available</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="bg-slate-950 border-b border-slate-800 py-3 px-4">
        <CardTitle className="text-base font-medium">File Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center mb-6">
          {getFileIcon(download.type)}
          <h3 className="mt-2 font-medium text-lg">{download.name}</h3>
          <p className="text-sm text-slate-400">{formatFileSize(download.size)}</p>
        </div>

        {getPreviewContent(download.type)}

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800 p-3 rounded-lg">
              <p className="text-xs text-slate-400">Status</p>
              <p className="text-sm font-medium capitalize">{download.status}</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
              <p className="text-xs text-slate-400">Added on</p>
              <p className="text-sm font-medium">{formatDate(download.createdAt)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <Folder className="h-4 w-4 mr-2" />
              Open Folder
            </Button>
            <Button variant="outline" className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <Button variant="outline" className="w-full bg-slate-800 border-slate-700 hover:bg-slate-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Source URL
          </Button>
        </div>
      </CardContent>
    </div>
  )
}

"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Download, FileText, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatFileSize } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

interface PDFPreviewProps {
  title: string
  author: string
  coverImage: string
  pageCount: number
  fileSize: number
  source: string
  onClose: () => void
  onDownload: () => void
}

export function PDFPreview({
  title,
  author,
  coverImage,
  pageCount,
  fileSize,
  source,
  onClose,
  onDownload,
}: PDFPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 50))
  }

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, pageCount))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900 shadow-lg">
      <CardHeader className="border-b border-zinc-800 bg-zinc-950 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-950/30 border-amber-900/50 text-amber-500 px-1.5 h-5 text-[10px]">
                <FileText className="h-3 w-3 mr-1" />
                <span>PDF Document</span>
              </Badge>
              <CardTitle className="text-lg font-medium">{title}</CardTitle>
            </div>
            <div className="mt-1 text-sm text-zinc-400">
              By {author} • {pageCount} pages • {formatFileSize(fileSize)}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-zinc-400">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col items-center md:w-1/3">
            <div className="relative">
              <img
                src={coverImage || "/placeholder.svg"}
                alt={title}
                className="h-auto max-h-[300px] w-auto rounded-md border border-zinc-700 shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            <div className="mt-4 w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">Source</span>
                <span className="text-sm text-zinc-400">{source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">File Size</span>
                <span className="text-sm text-zinc-400">{formatFileSize(fileSize)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">Pages</span>
                <span className="text-sm text-zinc-400">{pageCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">Format</span>
                <span className="text-sm text-zinc-400">PDF</span>
              </div>

              <Button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700" onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Slider
                  value={[zoom]}
                  min={50}
                  max={200}
                  step={25}
                  className="w-24"
                  onValueChange={(value) => setZoom(value[0])}
                />
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <span className="ml-2 text-xs text-zinc-400">{zoom}%</span>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div
              className={`relative flex flex-1 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 ${
                isFullscreen ? "h-[calc(100vh-300px)]" : "h-[400px]"
              }`}
            >
              <div className="flex items-center justify-center" style={{ transform: `scale(${zoom / 100})` }}>
                <div className="relative h-[350px] w-[250px] rounded-md bg-white shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center text-black">
                    <div className="text-center">
                      <div className="text-lg font-bold">{title}</div>
                      <div className="text-sm">
                        Page {currentPage} of {pageCount}
                      </div>
                      <div className="mt-4 text-sm text-gray-500">Preview not available</div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/50"
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/50"
                onClick={handleNextPage}
                disabled={currentPage >= pageCount}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage <= 1}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-zinc-400">
                Page {currentPage} of {pageCount}
              </span>
              <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage >= pageCount}>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

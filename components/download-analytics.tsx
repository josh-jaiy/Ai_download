"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, FileText, FileVideo, Package, RefreshCw } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import { getDownloads } from "@/app/actions/download-actions"
import type { Download as DownloadType } from "@/types/download"

export function DownloadAnalytics() {
  const [downloads, setDownloads] = useState<DownloadType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("7d") // 7d, 30d, 90d, all
  const [chartType, setChartType] = useState("daily") // daily, source, fileType

  useEffect(() => {
    fetchDownloads()
  }, [timeRange])

  const fetchDownloads = async () => {
    try {
      setIsLoading(true)
      const result = await getDownloads()

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.downloads) {
        // Filter downloads based on time range
        const now = new Date()
        const filtered = result.downloads.filter((download: DownloadType) => {
          const downloadDate = new Date(download.createdAt)
          if (timeRange === "7d") {
            return now.getTime() - downloadDate.getTime() <= 7 * 24 * 60 * 60 * 1000
          } else if (timeRange === "30d") {
            return now.getTime() - downloadDate.getTime() <= 30 * 24 * 60 * 60 * 1000
          } else if (timeRange === "90d") {
            return now.getTime() - downloadDate.getTime() <= 90 * 24 * 60 * 60 * 1000
          }
          return true // "all" time range
        })

        setDownloads(filtered)
      }
    } catch (err) {
      setError("Failed to fetch downloads")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Prepare data for charts
  const prepareChartData = () => {
    if (chartType === "daily") {
      // Group downloads by day
      const groupedByDay = downloads.reduce(
        (acc, download) => {
          const date = new Date(download.createdAt).toISOString().split("T")[0]
          if (!acc[date]) {
            acc[date] = {
              date,
              count: 0,
              size: 0,
            }
          }
          acc[date].count += 1
          acc[date].size += download.size
          return acc
        },
        {} as Record<string, { date: string; count: number; size: number }>,
      )

      // Convert to array and sort by date
      return Object.values(groupedByDay).sort((a, b) => a.date.localeCompare(b.date))
    } else if (chartType === "source") {
      // Group downloads by source
      const groupedBySource = downloads.reduce(
        (acc, download) => {
          const source = download.source || "other"
          if (!acc[source]) {
            acc[source] = {
              source,
              count: 0,
              size: 0,
            }
          }
          acc[source].count += 1
          acc[source].size += download.size
          return acc
        },
        {} as Record<string, { source: string; count: number; size: number }>,
      )

      // Convert to array
      return Object.values(groupedBySource)
    } else if (chartType === "fileType") {
      // Group downloads by file type
      const groupedByType = downloads.reduce(
        (acc, download) => {
          const type = download.type || "other"
          if (!acc[type]) {
            acc[type] = {
              type,
              count: 0,
              size: 0,
            }
          }
          acc[type].count += 1
          acc[type].size += download.size
          return acc
        },
        {} as Record<string, { type: string; count: number; size: number }>,
      )

      // Convert to array
      return Object.values(groupedByType)
    }

    return []
  }

  const chartData = prepareChartData()

  // Calculate summary statistics
  const totalDownloads = downloads.length
  const totalSize = downloads.reduce((sum, download) => sum + download.size, 0)
  const averageSize = totalDownloads > 0 ? totalSize / totalDownloads : 0
  const completedDownloads = downloads.filter((d) => d.status === "completed").length
  const completionRate = totalDownloads > 0 ? (completedDownloads / totalDownloads) * 100 : 0

  // Colors for charts
  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444"]

  // Render the appropriate chart based on chartType
  const renderChart = () => {
    if (chartType === "daily") {
      return (
        <ChartContainer
          config={{
            count: {
              label: "Download Count",
              color: "hsl(var(--chart-1))",
            },
            size: {
              label: "Download Size",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis yAxisId="left" stroke="#888" />
              <YAxis yAxisId="right" orientation="right" stroke="#888" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="count"
                stroke="var(--color-count)"
                name="Download Count"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="size"
                stroke="var(--color-size)"
                name="Download Size (bytes)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )
    } else if (chartType === "source") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Downloads by Source</CardTitle>
              <CardDescription>Number of downloads per source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="source"
                      label={({ source, count }) => `${source}: ${count}`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.source]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Download Size by Source</CardTitle>
              <CardDescription>Total size of downloads per source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="source" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip formatter={(value) => formatFileSize(Number(value))} />
                    <Bar dataKey="size" fill="#10b981" name="Size">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    } else if (chartType === "fileType") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Downloads by File Type</CardTitle>
              <CardDescription>Number of downloads per file type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                      label={({ type, count }) => `${type}: ${count}`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.type]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Download Size by File Type</CardTitle>
              <CardDescription>Total size of downloads per file type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="type" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip formatter={(value) => formatFileSize(Number(value))} />
                    <Bar dataKey="size" fill="#10b981" name="Size">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return null
  }

  return (
    <div className="container py-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold">Download Analytics</h2>
          <Button
            variant="outline"
            size="icon"
            className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
            onClick={fetchDownloads}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="daily">Daily Downloads</SelectItem>
              <SelectItem value="source">By Source</SelectItem>
              <SelectItem value="fileType">By File Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-zinc-500 mt-1">
              <span className="flex items-center">
                <Download className="mr-1 h-3 w-3" />
                {timeRange === "all" ? "All time" : `Last ${timeRange}`}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
            <p className="text-xs text-zinc-500 mt-1">
              <span className="flex items-center">
                <FileText className="mr-1 h-3 w-3" />
                {downloads.filter((d) => d.status === "completed").length} completed downloads
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(averageSize)}</div>
            <p className="text-xs text-zinc-500 mt-1">
              <span className="flex items-center">
                <Package className="mr-1 h-3 w-3" />
                Per download
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-zinc-500 mt-1">
              <span className="flex items-center">
                <FileVideo className="mr-1 h-3 w-3" />
                {completedDownloads} of {totalDownloads} downloads
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : downloads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <BarChart className="h-16 w-16 text-zinc-700" />
          <h3 className="mt-4 text-lg font-medium">No download data available</h3>
          <p className="mt-2 text-center text-sm text-zinc-500">Start downloading files to see analytics</p>
        </div>
      ) : (
        <div className="space-y-6">{renderChart()}</div>
      )}
    </div>
  )
}

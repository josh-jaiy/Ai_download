"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Calendar, Clock, Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import { getDownloads } from "@/app/actions/download-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Download as DownloadType } from "@/types/download"

interface ScheduledDownload {
  id: string
  name: string
  url: string
  scheduleType: "once" | "daily" | "weekly" | "monthly"
  scheduledTime: Date
  status: "pending" | "completed" | "failed"
  size?: number
  type?: string
  recurrence?: {
    days?: number[]
    time?: string
    endDate?: Date
  }
}

export function DownloadScheduler() {
  const [scheduledDownloads, setScheduledDownloads] = useState<ScheduledDownload[]>([
    {
      id: "sched-1",
      name: "Weekly Podcast",
      url: "https://example.com/podcast.mp3",
      scheduleType: "weekly",
      scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: "pending",
      type: "audio",
      recurrence: {
        days: [1, 4], // Monday and Thursday
        time: "08:00",
      },
    },
    {
      id: "sched-2",
      name: "Monthly Report",
      url: "https://example.com/report.pdf",
      scheduleType: "monthly",
      scheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: "pending",
      type: "document",
      recurrence: {
        days: [1], // 1st of each month
        time: "09:00",
      },
    },
    {
      id: "sched-3",
      name: "Software Update",
      url: "https://example.com/update.exe",
      scheduleType: "once",
      scheduledTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      status: "pending",
      type: "application",
      size: 250 * 1024 * 1024,
    },
  ])

  const [downloads, setDownloads] = useState<DownloadType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showNewScheduleForm, setShowNewScheduleForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ScheduledDownload | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    scheduleType: "once",
    date: "",
    time: "",
    recurrence: {
      days: [] as number[],
      endDate: "",
    },
  })

  useEffect(() => {
    fetchDownloads()
  }, [])

  const fetchDownloads = async () => {
    try {
      setIsLoading(true)
      const result = await getDownloads()

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.downloads) {
        setDownloads(result.downloads)
      }
    } catch (err) {
      setError("Failed to fetch downloads")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSchedule = () => {
    const scheduledTime = new Date(`${formData.date}T${formData.time}`)

    const newSchedule: ScheduledDownload = {
      id: `sched-${Date.now()}`,
      name: formData.name,
      url: formData.url,
      scheduleType: formData.scheduleType as "once" | "daily" | "weekly" | "monthly",
      scheduledTime,
      status: "pending",
      recurrence:
        formData.scheduleType !== "once"
          ? {
              days: formData.recurrence.days,
              time: formData.time,
              endDate: formData.recurrence.endDate ? new Date(formData.recurrence.endDate) : undefined,
            }
          : undefined,
    }

    setScheduledDownloads([...scheduledDownloads, newSchedule])
    resetForm()
    setShowNewScheduleForm(false)
  }

  const handleUpdateSchedule = () => {
    if (!editingSchedule) return

    const scheduledTime = new Date(`${formData.date}T${formData.time}`)

    const updatedSchedule: ScheduledDownload = {
      ...editingSchedule,
      name: formData.name,
      url: formData.url,
      scheduleType: formData.scheduleType as "once" | "daily" | "weekly" | "monthly",
      scheduledTime,
      recurrence:
        formData.scheduleType !== "once"
          ? {
              days: formData.recurrence.days,
              time: formData.time,
              endDate: formData.recurrence.endDate ? new Date(formData.recurrence.endDate) : undefined,
            }
          : undefined,
    }

    setScheduledDownloads(scheduledDownloads.map((s) => (s.id === editingSchedule.id ? updatedSchedule : s)))
    resetForm()
    setEditingSchedule(null)
  }

  const handleDeleteSchedule = (id: string) => {
    setScheduledDownloads(scheduledDownloads.filter((s) => s.id !== id))
  }

  const handleEditSchedule = (schedule: ScheduledDownload) => {
    const date = schedule.scheduledTime.toISOString().split("T")[0]
    const time = schedule.scheduledTime.toTimeString().slice(0, 5)

    setFormData({
      name: schedule.name,
      url: schedule.url,
      scheduleType: schedule.scheduleType,
      date,
      time,
      recurrence: {
        days: schedule.recurrence?.days || [],
        endDate: schedule.recurrence?.endDate ? schedule.recurrence.endDate.toISOString().split("T")[0] : "",
      },
    })

    setEditingSchedule(schedule)
    setShowNewScheduleForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      scheduleType: "once",
      date: "",
      time: "",
      recurrence: {
        days: [],
        endDate: "",
      },
    })
  }

  const handleCancelEdit = () => {
    resetForm()
    setEditingSchedule(null)
    setShowNewScheduleForm(false)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name.startsWith("recurrence.")) {
      const field = name.split(".")[1]
      setFormData({
        ...formData,
        recurrence: {
          ...formData.recurrence,
          [field]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleDayToggle = (day: number) => {
    const days = formData.recurrence.days.includes(day)
      ? formData.recurrence.days.filter((d) => d !== day)
      : [...formData.recurrence.days, day]

    setFormData({
      ...formData,
      recurrence: {
        ...formData.recurrence,
        days,
      },
    })
  }

  const getScheduleTypeLabel = (type: string) => {
    switch (type) {
      case "once":
        return "One-time"
      case "daily":
        return "Daily"
      case "weekly":
        return "Weekly"
      case "monthly":
        return "Monthly"
      default:
        return type
    }
  }

  const getScheduleDescription = (schedule: ScheduledDownload) => {
    const time = schedule.scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const date = schedule.scheduledTime.toLocaleDateString()

    if (schedule.scheduleType === "once") {
      return `${date} at ${time}`
    } else if (schedule.scheduleType === "daily") {
      return `Every day at ${time}`
    } else if (schedule.scheduleType === "weekly") {
      const days = schedule.recurrence?.days
        ?.map((day) => {
          const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          return dayNames[day]
        })
        .join(", ")
      return `Every ${days} at ${time}`
    } else if (schedule.scheduleType === "monthly") {
      const day = schedule.scheduledTime.getDate()
      return `Every ${day}${getDaySuffix(day)} of the month at ${time}`
    }

    return ""
  }

  const getDaySuffix = (day: number) => {
    if (day > 3 && day < 21) return "th"
    switch (day % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  const getTimeUntilSchedule = (schedule: ScheduledDownload) => {
    const now = new Date()
    const scheduledTime = schedule.scheduledTime

    if (scheduledTime < now) {
      if (schedule.scheduleType === "once") {
        return "Overdue"
      } else {
        // For recurring schedules, calculate next occurrence
        return "Upcoming"
      }
    }

    const diffMs = scheduledTime.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ${diffHours} hr`
    } else if (diffHours > 0) {
      return `${diffHours} hr ${diffMinutes} min`
    } else {
      return `${diffMinutes} min`
    }
  }

  const getFileIcon = (type?: string) => {
    switch (type) {
      case "video":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "document":
        return <FileText className="h-5 w-5 text-amber-500" />
      case "audio":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "application":
        return <FileText className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-zinc-400" />
    }
  }

  const renderScheduleForm = () => (
    <Card className="bg-zinc-900 border-zinc-800 mb-6">
      <CardHeader>
        <CardTitle>{editingSchedule ? "Edit Schedule" : "New Download Schedule"}</CardTitle>
        <CardDescription>
          {editingSchedule ? "Update your scheduled download" : "Schedule a download for a specific time"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Download Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            placeholder="Enter a name for this download"
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            name="url"
            value={formData.url}
            onChange={handleFormChange}
            placeholder="https://example.com/file.mp4"
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduleType">Schedule Type</Label>
          <select
            id="scheduleType"
            name="scheduleType"
            value={formData.scheduleType}
            onChange={handleFormChange}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2"
          >
            <option value="once">One-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {formData.scheduleType === "once" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleFormChange}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleFormChange}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>
        )}

        {formData.scheduleType === "daily" && (
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleFormChange}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        )}

        {formData.scheduleType === "weekly" && (
          <>
            <div className="space-y-2">
              <Label>Days of Week</Label>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                  const isSelected = formData.recurrence.days.includes(day)

                  return (
                    <Button
                      key={day}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className={
                        isSelected
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                      }
                      onClick={() => handleDayToggle(day)}
                    >
                      {dayNames[day]}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleFormChange}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </>
        )}

        {formData.scheduleType === "monthly" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Start Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleFormChange}
                className="bg-zinc-800 border-zinc-700"
              />
              <p className="text-xs text-zinc-400">The day of the month will be used for scheduling</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleFormChange}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>
        )}

        {formData.scheduleType !== "once" && (
          <div className="space-y-2">
            <Label htmlFor="recurrence.endDate">End Date (Optional)</Label>
            <Input
              id="recurrence.endDate"
              name="recurrence.endDate"
              type="date"
              value={formData.recurrence.endDate}
              onChange={handleFormChange}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
            onClick={handleCancelEdit}
          >
            Cancel
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}
            disabled={!formData.name || !formData.url || !formData.date || !formData.time}
          >
            {editingSchedule ? "Update Schedule" : "Create Schedule"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Filter schedules based on active tab
  const filteredSchedules = scheduledDownloads.filter((schedule) => {
    if (activeTab === "upcoming") {
      return schedule.status === "pending"
    } else if (activeTab === "past") {
      return schedule.status === "completed" || schedule.status === "failed"
    }
    return true
  })

  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold">Download Scheduler</h2>
        <Button
          className="mt-4 sm:mt-0 bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setShowNewScheduleForm(!showNewScheduleForm)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {showNewScheduleForm ? "Cancel" : "New Schedule"}
        </Button>
      </div>

      {showNewScheduleForm && renderScheduleForm()}

      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filteredSchedules.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <Calendar className="h-16 w-16 text-zinc-700" />
                <h3 className="mt-4 text-lg font-medium">No scheduled downloads</h3>
                <p className="mt-2 text-center text-sm text-zinc-500">Schedule downloads to run at specific times</p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-4">
                {filteredSchedules.map((schedule) => (
                  <Card key={schedule.id} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getFileIcon(schedule.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="truncate font-medium text-zinc-100">{schedule.name}</p>
                              <Badge className="bg-emerald-600 hover:bg-emerald-700">
                                {getScheduleTypeLabel(schedule.scheduleType)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                              <span className="truncate">{schedule.url}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{getScheduleDescription(schedule)}</span>
                              <span>•</span>
                              <Clock className="h-3.5 w-3.5" />
                              <span>{getTimeUntilSchedule(schedule)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
                            onClick={() => handleEditSchedule(schedule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {filteredSchedules.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <AlertCircle className="h-16 w-16 text-zinc-700" />
                <h3 className="mt-4 text-lg font-medium">No past scheduled downloads</h3>
                <p className="mt-2 text-center text-sm text-zinc-500">
                  Completed and failed scheduled downloads will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-4">
                {filteredSchedules.map((schedule) => (
                  <Card key={schedule.id} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getFileIcon(schedule.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="truncate font-medium text-zinc-100">{schedule.name}</p>
                              <Badge className={schedule.status === "completed" ? "bg-emerald-600" : "bg-red-600"}>
                                {schedule.status === "completed" ? "Completed" : "Failed"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                              <span className="truncate">{schedule.url}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{getScheduleDescription(schedule)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

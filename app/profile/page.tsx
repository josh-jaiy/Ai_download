"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name || "")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name,
        },
      })

      setMessage("Profile updated successfully")
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An error occurred while updating profile")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Profile</h1>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                <AvatarFallback className="text-lg">
                  {session.user.name ? getInitials(session.user.name) : <User />}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{session.user.name || "User"}</CardTitle>
                <CardDescription>{session.user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert className="mb-4 bg-emerald-900/50 border-emerald-800">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-900/50 border-red-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-slate-800 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={session.user.email || ""}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-700 bg-slate-800 text-white shadow-sm opacity-70"
                  />
                  <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex w-full justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

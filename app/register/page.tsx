"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setIsRegistered(true)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An error occurred during registration")
      }
      setIsLoading(false)
    }
  }

  if (isRegistered) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center justify-center">
            <Shield className="h-12 w-12 text-emerald-500" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Registration Successful</h2>
          </div>

          <div className="rounded-lg bg-slate-900 p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
            <h3 className="mt-4 text-xl font-medium text-white">Verify your email</h3>
            <p className="mt-2 text-gray-400">
              We've sent a verification link to <span className="font-medium text-emerald-400">{email}</span>.
            </p>
            <p className="mt-1 text-gray-400">Please check your inbox and click the link to verify your account.</p>

            <div className="mt-6">
              <Button onClick={() => router.push("/login")} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Shield className="h-12 w-12 text-emerald-500" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Create an account</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{" "}
            <Link href="/login" className="font-medium text-emerald-500 hover:text-emerald-400">
              sign in to your account
            </Link>
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-900/50 border-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <Label htmlFor="name" className="text-white">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-700 bg-slate-800 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-700 bg-slate-800 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-700 bg-slate-800 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              <p className="mt-1 text-xs text-gray-400">Password must be at least 8 characters long</p>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const error = searchParams.get("error")
  const verificationSuccess = searchParams.get("verified") === "true"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [verificationError, setVerificationError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")
    setVerificationError(false)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        // Check if the error is due to unverified email
        if (result.error === "EmailNotVerified") {
          setVerificationError(true)
        } else {
          setLoginError("Invalid email or password")
        }
        setIsLoading(false)
      } else {
        router.push(callbackUrl)
      }
    } catch (error) {
      setLoginError("An error occurred during login")
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setLoginError("")
        setVerificationError(false)
        alert("Verification email has been resent. Please check your inbox.")
      } else {
        setLoginError(data.error || "Failed to resend verification email")
      }
    } catch (error) {
      setLoginError("An error occurred while resending verification email")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Shield className="h-12 w-12 text-emerald-500" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{" "}
            <Link href="/register" className="font-medium text-emerald-500 hover:text-emerald-400">
              create a new account
            </Link>
          </p>
        </div>

        {verificationSuccess && (
          <Alert className="bg-emerald-900/50 border-emerald-800">
            <AlertDescription>Your email has been verified successfully! You can now log in.</AlertDescription>
          </Alert>
        )}

        {(error || loginError) && !verificationError && (
          <Alert variant="destructive" className="bg-red-900/50 border-red-800">
            <AlertDescription>
              {error === "CredentialsSignin" ? "Invalid email or password" : loginError || "An error occurred"}
            </AlertDescription>
          </Alert>
        )}

        {verificationError && (
          <Alert variant="destructive" className="bg-amber-900/50 border-amber-800">
            <AlertDescription className="flex flex-col space-y-2">
              <span>Your email has not been verified. Please check your inbox for the verification link.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendVerification}
                className="self-start border-amber-600 text-amber-100 hover:bg-amber-800 hover:text-amber-50"
              >
                Resend verification email
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-700 bg-slate-800 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
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
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Shield, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error")
      setMessage("Missing verification token")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setVerificationStatus("success")
          setMessage(data.message || "Your email has been verified successfully!")
        } else {
          setVerificationStatus("error")
          setMessage(data.error || "Failed to verify email")
        }
      } catch (error) {
        setVerificationStatus("error")
        setMessage("An error occurred during verification")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <Shield className="h-12 w-12 text-emerald-500" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Email Verification</h2>
        </div>

        <div className="mt-8 rounded-lg bg-slate-900 p-8 shadow-md">
          {verificationStatus === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-emerald-500" />
              <p className="text-lg text-gray-300">Verifying your email...</p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-emerald-500" />
              <p className="text-lg text-gray-300">{message}</p>
              <Button asChild className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700">
                <Link href="/login">Continue to Login</Link>
              </Button>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-lg text-gray-300">{message}</p>
              <Button asChild className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

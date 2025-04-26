"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
        <h1 className="mt-4 text-xl font-semibold">Logging out...</h1>
      </div>
    </div>
  )
}

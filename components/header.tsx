"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface HeaderProps {
  toggleSidebar: () => void
  sidebarOpen: boolean
  isDesktop: boolean
}

export function Header({ toggleSidebar, sidebarOpen, isDesktop }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-800 bg-zinc-950 px-4 sm:px-6">
      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100" onClick={toggleSidebar}>
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 items-center gap-2">
        <h1 className="text-lg font-semibold">AI Download Manager</h1>
      </div>
    </header>
  )
}

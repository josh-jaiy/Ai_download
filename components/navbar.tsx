"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Download, Settings, Shield, Sparkles, History, Home, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Downloads",
      href: "/downloads",
      icon: Download,
    },
    {
      name: "History",
      href: "/history",
      icon: History,
    },
    {
      name: "Advanced Features",
      href: "/advanced-features",
      icon: Sparkles,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center space-x-2">
          <Shield className="h-6 w-6 text-emerald-500" />
          <span className="hidden font-bold sm:inline-block">AI Download Manager</span>
        </div>
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex-1 md:flex-initial">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 justify-start",
                      pathname === item.href ? "bg-slate-800 text-slate-100" : "text-slate-400 hover:text-slate-100",
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline-block">{item.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback>{session.user.name ? getInitials(session.user.name) : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  )
}

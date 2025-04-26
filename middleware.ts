import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/register"]

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If the path is public and there's a token, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/downloads/:path*",
    "/history/:path*",
    "/settings/:path*",
    "/advanced-features/:path*",
    "/login",
    "/register",
    "/admin/:path*",
  ],
}

"use client"

import { Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { getHubPages } from "@/lib/hubs"

function ShellContent({
  children,
  pathname,
}: {
  children: React.ReactNode
  pathname: string | null
}) {
  const searchParams = useSearchParams()
  const isBlogRoute = !!pathname && (pathname === "/blog" || pathname.startsWith("/blog/"))
  const isToolEmbedRoute = !!pathname && pathname.startsWith("/tools/") && pathname.endsWith("/embed")
  const isEmbedPreview = searchParams.get("embed") === "1"
  const hideGlobalChrome = isBlogRoute || isToolEmbedRoute || isEmbedPreview
  // Only hide ads for embed routes — maximize everywhere else
  const hideGlobalAds = isToolEmbedRoute || isEmbedPreview

  return (
    <div className="flex min-h-screen flex-col">
      {hideGlobalChrome ? null : <Navbar />}

      {/* Top Banner Ad directly below Navbar */}
      {/* Top leaderboard */}

      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Native ad and double rectangles before footer */}

      {hideGlobalChrome ? null : <Footer />}

      {/* Sticky edge ads (mobile bottom, desktop left/right) */}
    </div>
  )
}

export function BlogAwareShell({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>
      }
    >
      <ShellContent pathname={pathname}>{children}</ShellContent>
    </Suspense>
  )
}

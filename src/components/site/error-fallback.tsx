"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ErrorFallback({
  error,
  reset,
  title,
  description,
}: {
  error: Error & { digest?: string }
  reset: () => void
  title: string
  description: string
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const reportHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    `${siteConfig.name} issue report`
  )}&body=${encodeURIComponent(
    `Page: ${typeof window !== "undefined" ? window.location.href : "unknown"}\nError: ${error.message}\nDigest: ${error.digest ?? "n/a"}`
  )}`

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-base">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Crash details</p>
            <p className="mt-2 break-words">{error.message || "Unexpected runtime error."}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Report Issue</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={reportHref}>Email details</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

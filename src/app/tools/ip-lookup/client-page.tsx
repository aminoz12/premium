"use client"

import React, { useEffect, useState, useTransition, useId } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import {
  Copy, Loader2, MapPin, RefreshCw, Globe, CheckCircle2,
  Shield, HelpCircle, Network, Link2, Info, Server, Lock
} from "lucide-react"

interface IPInfo {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
  source: string
}

const fallbackInfo: IPInfo = {
  ip: "Unavailable",
  city: "Unknown",
  region: "Unknown",
  country: "Unknown",
  loc: "0, 0",
  org: "Offline fallback",
  postal: "N/A",
  timezone: "UTC",
  source: "Fallback data",
}

export default function IPLookupPage() {
  const [ipInfo, setIPInfo] = useState<IPInfo | null>(null)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const { copy } = useClipboard()
  const id = useId()

  const fetchIPInfo = () => {
    startTransition(async () => {
      setError("")

      const cached = localStorage.getItem("toolkit-ip-info")
      if (cached) {
        setIPInfo(JSON.parse(cached))
      }

      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()

        if (data?.error) {
          throw new Error("The IP service returned an error.")
        }

        const nextValue: IPInfo = {
          ip: data.ip || "Unavailable",
          city: data.city || "Unknown",
          region: data.region || "Unknown",
          country: data.country_name || "Unknown",
          loc: `${data.latitude || 0}, ${data.longitude || 0}`,
          org: data.org || "Unknown",
          postal: data.postal || "N/A",
          timezone: data.timezone || "UTC",
          source: "Live API",
        }

        setIPInfo(nextValue)
        localStorage.setItem("toolkit-ip-info", JSON.stringify(nextValue))
      } catch {
        setError("Live IP lookup is unavailable right now, so we’re showing fallback information.")
        setIPInfo(cached ? JSON.parse(cached) : fallbackInfo)
      }
    })
  }

  useEffect(() => {
    fetchIPInfo()
  }, [])

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is my IP address?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your IP address is a unique string of numbers that identifies your device on the internet. Our tool displays your current public IPv4 or IPv6 address at the top of the page."
        }
      },
      {
        "@type": "Question",
        "name": "Can an IP address reveal my exact physical location?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. An IP address only reveals your general geographic location, such as your city, state, or postal code. It cannot show your precise street address or home location to the public."
        }
      },
      {
        "@type": "Question",
        "name": "Why is my IP address showing a different city?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "IP geolocation is based on where your Internet Service Provider (ISP) registers the IP block, or where their nearest server hub is located. It is common for this to be a neighboring city rather than your exact town."
        }
      },
      {
        "@type": "Question",
        "name": "How do I hide my IP address?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To hide your IP address, you can use a Virtual Private Network (VPN) or a secure proxy server. These services route your internet traffic through their servers, masking your true IP from websites."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between IPv4 and IPv6?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "IPv4 is the older standard using a 32-bit format (e.g., 192.168.1.1). IPv6 is the newer standard using a 128-bit format to allow for vastly more addresses. Our tool detects both types."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Advanced IP Lookup Tool",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": "Instantly check your public IP address, ISP, location, and network details with this free online IP scanner tool."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-12 max-w-6xl mx-auto w-full">

        {/* Header Section */}
        <header className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <Globe className="h-4 w-4" aria-hidden="true" /> Live Network Scanner
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            What is My IP Address? Free IP & Location Lookup
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Instantly discover your public IPv4 or IPv6 address, internet service provider (ISP), network timezone, and estimated geographic location with our secure, real-time IP tracker.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="IP Lookup Results Board" className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Your Public IP Details">
            <div className="space-y-4" aria-live="polite" aria-atomic="true">
              {isPending && !ipInfo ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium text-muted-foreground">Scanning network connection...</span>
                </div>
              ) : ipInfo ? (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border-2 border-primary/20 bg-primary/5 p-6 mb-6 gap-4 shadow-sm">
                    <div>
                      <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-1" id={`${id}-ip-label`}>
                        Your Current IP Address
                      </h2>
                      <span className="font-mono text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight break-all" aria-labelledby={`${id}-ip-label`}>
                        {ipInfo.ip}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="default"
                        className="gap-2 shadow-sm"
                        onClick={() => copy(ipInfo.ip)}
                        aria-label="Copy IP address to clipboard"
                      >
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        Copy IP
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchIPInfo}
                        disabled={isPending}
                        aria-label="Refresh IP and network information"
                        title="Ping server again"
                      >
                        <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="mb-6 shadow-sm border-destructive/50">
                      <AlertDescription className="font-medium">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4 rounded-xl border border-border/50 p-6 bg-card/50 backdrop-blur-sm shadow-sm">
                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-border/50 pb-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      Geolocation Summary
                    </h3>
                    <ul className="grid gap-3.5 pt-1">
                      <li className="flex justify-between items-center text-sm group">
                        <span className="text-muted-foreground font-medium">City</span>
                        <span className="font-semibold group-hover:text-primary transition-colors">{ipInfo.city}</span>
                      </li>
                      <li className="flex justify-between items-center text-sm group">
                        <span className="text-muted-foreground font-medium">Region / State</span>
                        <span className="font-semibold group-hover:text-primary transition-colors">{ipInfo.region}</span>
                      </li>
                      <li className="flex justify-between items-center text-sm group">
                        <span className="text-muted-foreground font-medium">Country</span>
                        <span className="font-semibold group-hover:text-primary transition-colors">{ipInfo.country}</span>
                      </li>
                      <li className="flex justify-between items-center text-sm group">
                        <span className="text-muted-foreground font-medium">Postal / ZIP Code</span>
                        <span className="font-semibold group-hover:text-primary transition-colors">{ipInfo.postal}</span>
                      </li>
                      <li className="flex justify-between items-center text-sm group">
                        <span className="text-muted-foreground font-medium">Timezone</span>
                        <span className="font-semibold group-hover:text-primary transition-colors">{ipInfo.timezone}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </ToolCard>

          <ToolCard title="Network & Provider Info">
            <div className="space-y-4" aria-live="polite">
              {isPending && !ipInfo ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium text-muted-foreground">Fetching ISP data...</span>
                </div>
              ) : ipInfo ? (
                <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
                  <div className="space-y-4 rounded-xl border border-border/50 p-6 bg-card/50 backdrop-blur-sm shadow-sm">
                    <h3 className="font-semibold text-lg flex items-center gap-2 border-b border-border/50 pb-3">
                      <Network className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      Technical Details
                    </h3>
                    <ul className="grid gap-4 pt-1">
                      <li className="flex flex-col gap-1.5">
                        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Internet Service Provider (ISP)</span>
                        <span className="font-medium break-words bg-muted/50 p-2 rounded-md">{ipInfo.org}</span>
                      </li>
                      <li className="flex justify-between items-center text-sm border-t border-border/30 pt-3">
                        <span className="text-muted-foreground font-medium">GPS Coordinates</span>
                        <span className="font-mono text-xs font-semibold bg-muted px-2 py-1 rounded">{ipInfo.loc}</span>
                      </li>
                      <li className="flex justify-between items-center text-sm border-t border-border/30 pt-3">
                        <span className="text-muted-foreground font-medium">Connection Type</span>
                        <span className="font-semibold text-primary">Public Network</span>
                      </li>
                      <li className="flex justify-between items-center text-sm border-t border-border/30 pt-3">
                        <span className="text-muted-foreground font-medium">Data Source</span>
                        <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-600 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> {ipInfo.source}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-1">
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 p-8 text-center transition-colors hover:border-primary/30 hover:bg-muted/20">
                      <div className="relative mb-5">
                        <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                        <div className="relative bg-background rounded-full p-3 shadow-md border border-border">
                          <Globe className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                      </div>
                      <h4 className="font-bold text-xl mb-2 text-foreground">
                        {ipInfo.city}, {ipInfo.country}
                      </h4>
                      <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
                        This is the estimated physical origin of your current internet connection based on IP registry databases.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </ToolCard>
        </section>

      </div>
    </>
  )
}
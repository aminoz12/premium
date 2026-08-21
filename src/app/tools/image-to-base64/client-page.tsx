"use client"

import React, { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import { Copy, Loader2, MapPin, RefreshCw, Globe, CheckCircle2, Shield, HelpCircle, Network, Link2 } from "lucide-react"

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

  return (
    <>
      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            What is My IP Address? Free IP Lookup Tool
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Instantly discover your public IP address, ISP, network details, and geographic location with our fast and secure IP tracker.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="IP Lookup Details" className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Your IP Address Details">
            <div className="space-y-4" aria-live="polite">
              {isPending && !ipInfo ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
                  <span className="sr-only">Loading IP Information...</span>
                </div>
              ) : ipInfo ? (
                <div className="animate-in fade-in duration-300">
                  <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-5 mb-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">IPv4 / IPv6 Address</p>
                      <span className="font-mono text-3xl font-bold text-primary tracking-tight">
                        {ipInfo.ip}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        onClick={() => copy(ipInfo.ip)}
                        aria-label="Copy IP address to clipboard"
                        title="Copy IP Address"
                      >
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        onClick={fetchIPInfo}
                        disabled={isPending}
                        aria-label="Refresh IP information"
                        title="Refresh"
                      >
                        <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4 rounded-xl border p-5 bg-card">
                    <h3 className="font-semibold text-lg mb-2 border-b pb-2">Location Summary</h3>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Globe className="h-4 w-4" aria-hidden="true" /> City
                        </span>
                        <span className="font-medium text-right">{ipInfo.city}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Region / State</span>
                        <span className="font-medium text-right">{ipInfo.region}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Country</span>
                        <span className="font-medium text-right">{ipInfo.country}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Postal Code</span>
                        <span className="font-medium text-right">{ipInfo.postal}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Timezone</span>
                        <span className="font-medium text-right">{ipInfo.timezone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </ToolCard>

          <ToolCard title="Network & ISP Information">
            <div className="space-y-4" aria-live="polite">
              {isPending && !ipInfo ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
                  <span className="sr-only">Loading Network Information...</span>
                </div>
              ) : ipInfo ? (
                <div className="animate-in fade-in duration-300 space-y-6">
                  <div className="space-y-4 rounded-xl border p-5 bg-card">
                    <h3 className="font-semibold text-lg mb-2 border-b pb-2">Provider Details</h3>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Network className="h-4 w-4" aria-hidden="true" /> ISP / Organization
                        </span>
                        <span className="font-medium text-right max-w-[60%] truncate" title={ipInfo.org}>
                          {ipInfo.org}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Coordinates (Lat, Long)</span>
                        <span className="font-medium text-right font-mono text-xs">{ipInfo.loc}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Data Source</span>
                        <span className="font-medium text-right inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {ipInfo.source}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/30 p-6 min-h-[160px] text-center">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                        <MapPin className="relative h-10 w-10 text-primary" aria-hidden="true" />
                      </div>
                      <h4 className="font-semibold text-lg mb-1">
                        {ipInfo.city}, {ipInfo.country}
                      </h4>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Estimated geographic origin of your network connection based on your IP address.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </ToolCard>
        </section>

        {/* SEO Content Section */}
        <article className="mt-12 space-y-12 divide-y divide-border">
          
          <section className="pt-8">
            <h2 className="text-3xl font-bold mb-4">About Our Free IP Lookup Tool</h2>
            <p className="text-muted-foreground leading-relaxed">
              Whenever you connect to the internet, your device is assigned a unique identifier known as an IP (Internet Protocol) address. Our <strong>What is My IP Address</strong> tool instantly scans your network connection to display your public IP. Alongside your address, we provide detailed insights including your Internet Service Provider (ISP), geographic location, timezone, and coordinates. This is a vital utility for troubleshooting network issues, verifying VPN connectivity, or configuring firewalls and whitelists.
            </p>
          </section>

          <section className="pt-8 grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden="true" />
                How to Check Your IP
              </h2>
              <ol className="space-y-4 text-muted-foreground list-decimal list-inside marker:text-primary marker:font-bold">
                <li><strong>Open the tool:</strong> Simply loading this page automatically detects your public IP address.</li>
                <li><strong>View your details:</strong> Read your IPv4 or IPv6 address displayed prominently in the results panel.</li>
                <li><strong>Verify location:</strong> Check the Network Information section to see the city, state, and country associated with your internet connection.</li>
                <li><strong>Copy to clipboard:</strong> Click the copy icon next to your IP address to easily paste it into terminal configurations or support tickets.</li>
                <li><strong>Refresh to update:</strong> Click the refresh icon to ping the server again if you suspect your IP has changed (e.g., after switching Wi-Fi networks or toggling a VPN).</li>
              </ol>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                Key Features
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">1</span>
                  <span><strong>Instant Detection:</strong> Automatically fetches and displays your data without requiring any button clicks or form submissions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">2</span>
                  <span><strong>Comprehensive Data:</strong> Displays not just the IP, but also the associated ISP organization, exact coordinates, and timezone.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">3</span>
                  <span><strong>VPN Verification:</strong> Perfect for checking if your Virtual Private Network or proxy is successfully masking your real location.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">4</span>
                  <span><strong>Privacy First:</strong> Your connection data is loaded on-demand and is never permanently stored on our servers.</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <HelpCircle className="h-7 w-7 text-primary" aria-hidden="true" />
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">What is an IP address?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  An Internet Protocol (IP) address is a unique string of numbers separated by periods (IPv4) or colons (IPv6) that identifies a device on the internet or a local network. It allows devices, routers, and websites to communicate back and forth with each other.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Can someone find my exact physical address from my IP?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  No. While an IP address can reveal your general geographic location (like your city, state, or zip code) and your Internet Service Provider (ISP), it cannot pinpoint your exact street address or your identity. Only your ISP possesses the records that link your IP to your physical home.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Why does my IP address change?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Most home internet connections use "Dynamic IP addresses" assigned by your ISP via DHCP. This means your router may receive a new IP address when it reboots, after a power outage, or simply when your ISP rotates their available addresses. Using cellular data or switching Wi-Fi networks will also change your IP.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">What is the difference between a public and private IP?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your public IP is what the outside internet sees (which is what this tool shows). Your private IP (often starting with 192.168.x.x or 10.x.x.x) is assigned by your local router to the specific devices inside your home network.
                </p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <h3 className="font-semibold text-lg">How can I hide my real IP address?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The most effective way to hide your true IP address is by using a Virtual Private Network (VPN) or a secure proxy. A VPN routes your internet traffic through a remote server, making it appear as though you are browsing from the VPN server's IP address and location rather than your own.
                </p>
              </div>
            </div>
          </section>

          <section className="pt-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Link2 className="h-6 w-6 text-primary" aria-hidden="true" />
              Related Network Tools
            </h2>
            <div className="flex flex-wrap gap-4">
              <a href="/tools/dns-lookup" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium">
                DNS Lookup
              </a>
              <a href="/tools/mac-address-generator" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium">
                MAC Address Generator
              </a>
              <a href="/tools/base64-encode-decode" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium">
                Base64 Converter
              </a>
            </div>
          </section>

        </article>
      </div>
    </>
  )
}
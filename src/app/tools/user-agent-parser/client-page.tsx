"use client"

import React, { useState, useEffect, useId } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import { 
  Monitor, Copy, Smartphone, Tablet, Globe, 
  Cpu, HardDrive, Search, Trash2, CheckCircle2, 
  Zap, Shield, HelpCircle, Link2, Info, Check, ScanFace
} from "lucide-react"

interface ParsedUA {
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown"
  engine: string
}

const parseUserAgent = (ua: string): ParsedUA => {
  let browser = "Unknown"
  let browserVersion = "Unknown"
  let os = "Unknown"
  let osVersion = "Unknown"
  let deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown" = "Desktop"
  let engine = "Unknown"

  if (!ua) return { browser, browserVersion, os, osVersion, deviceType, engine }

  // 1. OS Detection
  if (/windows nt 10.0/i.test(ua)) { os = "Windows"; osVersion = "10 / 11" }
  else if (/windows nt 6.3/i.test(ua)) { os = "Windows"; osVersion = "8.1" }
  else if (/windows nt 6.2/i.test(ua)) { os = "Windows"; osVersion = "8" }
  else if (/windows nt 6.1/i.test(ua)) { os = "Windows"; osVersion = "7" }
  else if (/mac os x (\d+[._]\d+)/i.test(ua)) { 
    os = "macOS"
    osVersion = ua.match(/mac os x (\d+[._]\d+)/i)?.[1].replace(/_/g, '.') || "Unknown"
  }
  else if (/android (\d+(\.\d+)?)/i.test(ua)) { 
    os = "Android"
    osVersion = ua.match(/android (\d+(\.\d+)?)/i)?.[1] || "Unknown"
  }
  else if (/os (\d+_[0-9_]+) like mac os x/i.test(ua)) { 
    os = "iOS"
    osVersion = ua.match(/os (\d+_[0-9_]+) like mac os x/i)?.[1].replace(/_/g, '.') || "Unknown"
  }
  else if (/cros/i.test(ua)) { os = "Chrome OS" }
  else if (/linux/i.test(ua)) { os = "Linux" }

  // 2. Device Type Detection
  if (/mobi/i.test(ua) || /android/i.test(ua) || /iphone/i.test(ua)) {
    if (/tablet/i.test(ua) || /ipad/i.test(ua) || (!/mobi/i.test(ua) && /android/i.test(ua))) {
      deviceType = "Tablet"
    } else {
      deviceType = "Mobile"
    }
  } else if (/ipad/i.test(ua)) {
    deviceType = "Tablet"
  } else if (/bot|crawler|spider|crawling/i.test(ua)) {
    deviceType = "Unknown"
    os = "Bot/Crawler"
  }

  // 3. Browser Detection (Order matters)
  if (/edg\//i.test(ua)) { 
    browser = "Microsoft Edge"
    browserVersion = ua.match(/edg\/(\d+\.\d+)/i)?.[1] || "Unknown"
  }
  else if (/opr\//i.test(ua) || /opera/i.test(ua)) { 
    browser = "Opera"
    browserVersion = ua.match(/(opr|version)\/(\d+\.\d+)/i)?.[2] || "Unknown"
  }
  else if (/chrome\//i.test(ua) && !/chromium/i.test(ua)) { 
    browser = "Chrome"
    browserVersion = ua.match(/chrome\/(\d+\.\d+)/i)?.[1] || "Unknown"
  }
  else if (/safari\//i.test(ua) && !/chrome/i.test(ua)) { 
    browser = "Safari"
    browserVersion = ua.match(/version\/(\d+\.\d+)/i)?.[1] || "Unknown"
  }
  else if (/firefox\//i.test(ua)) { 
    browser = "Firefox"
    browserVersion = ua.match(/firefox\/(\d+\.\d+)/i)?.[1] || "Unknown"
  }
  else if (/trident\//i.test(ua) || /msie/i.test(ua)) { 
    browser = "Internet Explorer"
    browserVersion = ua.match(/(rv:|msie )(\d+\.\d+)/i)?.[2] || "Unknown"
  }

  // 4. Engine Detection
  if (/applewebkit/i.test(ua)) { engine = /chrome/i.test(ua) ? "Blink (WebKit)" : "WebKit" }
  else if (/gecko\//i.test(ua) && !/like gecko/i.test(ua)) { engine = "Gecko" }
  else if (/trident/i.test(ua)) { engine = "Trident" }

  return { browser, browserVersion, os, osVersion, deviceType, engine }
}

export default function UserAgentParserPage() {
  const [userAgent, setUserAgent] = useState("")
  const [parsed, setParsed] = useState<ParsedUA | null>(null)
  const [copied, setCopied] = useState(false)
  
  const { copy } = useClipboard()
  const id = useId()

  useEffect(() => {
    if (userAgent.trim()) {
      setParsed(parseUserAgent(userAgent))
    } else {
      setParsed(null)
    }
  }, [userAgent])

  const detectMyBrowser = () => {
    if (typeof window !== "undefined") {
      setUserAgent(navigator.userAgent)
    }
  }

  const clearInput = () => {
    setUserAgent("")
  }

  const handleCopy = async () => {
    if (!parsed) return
    const jsonStr = JSON.stringify(parsed, null, 2)
    await copy(jsonStr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Mobile": return <Smartphone className="h-10 w-10 text-primary" />
      case "Tablet": return <Tablet className="h-10 w-10 text-primary" />
      default: return <Monitor className="h-10 w-10 text-primary" />
    }
  }

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a User Agent (UA) string?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A User Agent string is a line of text that your web browser sends to every website you visit. It acts like an ID card, telling the web server what browser, operating system, and device type you are using so the server can send back the appropriate version of the website."
        }
      },
      {
        "@type": "Question",
        "name": "Why are User Agent strings so messy and confusing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Historically, browsers spoofed their user agents to trick servers into serving them modern web pages. For example, almost all modern browsers start their UA string with 'Mozilla/5.0' to claim compatibility with ancient Mozilla standards. This history of spoofing makes parsing UAs difficult without a dedicated tool."
        }
      },
      {
        "@type": "Question",
        "name": "Can a User Agent string be faked?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. It is trivial to spoof or fake a User Agent string. Developers often use browser extensions or DevTools to change their UA to test how their website responds to different mobile devices or bots."
        }
      },
      {
        "@type": "Question",
        "name": "Is my User Agent sent to your server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Our User Agent Parser processes the text string entirely in your browser using local JavaScript. We do not log or track the strings you parse."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free User Agent Parser",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Decode and analyze User Agent strings instantly. Detect browsers, operating systems, device types, and rendering engines in your browser."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <ScanFace className="h-4 w-4" aria-hidden="true" /> Developer Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free User Agent Parser
          </h2>
          <img src="/images/user-agent-parser.webp" alt="user agent parser" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly decode messy User Agent strings to identify the web browser, operating system, rendering engine, and device type.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="User Agent Parser Tool" className="grid gap-6 lg:grid-cols-2 items-start">
          
          {/* Input Panel */}
          <ToolCard title="1. User Agent String">
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${id}-ua`} className="text-sm font-semibold">
                  Raw Text String
                </Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearInput}
                  disabled={!userAgent}
                  className="h-8 text-muted-foreground hover:text-destructive"
                  aria-label="Clear user agent input"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  Clear
                </Button>
              </div>

              <Textarea
                id={`${id}-ua`}
                placeholder="e.g. Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                className="min-h-[160px] flex-grow font-mono text-sm bg-muted/30 resize-y focus-visible:ring-1"
                aria-label="User agent string input area"
                spellCheck={false}
              />

              <Button 
                variant="secondary" 
                onClick={detectMyBrowser} 
                className="w-full gap-2 border border-dashed"
                aria-label="Detect my current browser's user agent"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Detect My Current Browser
              </Button>
            </div>
          </ToolCard>

          {/* Parsed Output Panel */}
          <ToolCard title="2. Parsed Analytics" className="lg:sticky lg:top-6">
            <div className="flex flex-col h-full min-h-[300px]">
              {parsed ? (
                <div className="space-y-6 animate-in fade-in duration-500 flex-grow">
                  
                  {/* Primary Browser Banner */}
                  <div className="flex items-center gap-4 p-5 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="bg-background p-3 rounded-full border shadow-sm">
                      {getDeviceIcon(parsed.deviceType)}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-foreground">
                        {parsed.browser} {parsed.browserVersion !== "Unknown" ? `v${parsed.browserVersion}` : ""}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Globe className="h-3.5 w-3.5" /> Web Browser
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-muted/40 border border-border/50 rounded-xl space-y-1">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <HardDrive className="h-3.5 w-3.5" /> Operating System
                      </p>
                      <p className="font-semibold text-base truncate" title={`${parsed.os} ${parsed.osVersion}`}>
                        {parsed.os} {parsed.osVersion !== "Unknown" ? parsed.osVersion : ""}
                      </p>
                    </div>

                    <div className="p-4 bg-muted/40 border border-border/50 rounded-xl space-y-1">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Monitor className="h-3.5 w-3.5" /> Device Class
                      </p>
                      <p className="font-semibold text-base">
                        {parsed.deviceType}
                      </p>
                    </div>

                    <div className="p-4 bg-muted/40 border border-border/50 rounded-xl space-y-1 col-span-2">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu className="h-3.5 w-3.5" /> Rendering Engine
                      </p>
                      <p className="font-semibold text-base">
                        {parsed.engine}
                      </p>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={handleCopy} 
                    className="w-full gap-2 mt-4"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">Copied JSON!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy as JSON
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 px-4 h-full border-2 border-dashed border-muted rounded-xl bg-muted/10">
                  <ScanFace className="h-12 w-12 text-muted-foreground/30 mb-3" aria-hidden="true" />
                  <p className="text-sm font-medium text-muted-foreground max-w-[250px]">
                    Enter a raw user agent string on the left to extract its analytics here.
                  </p>
                </div>
              )}
            </div>
          </ToolCard>
        </section>

      </div>
    </>
  )
}
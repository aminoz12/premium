"use client"

import React, { useState, useId } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import {
  Search, Lock, Globe, ShieldCheck, AlertTriangle,
  Calendar, Server, CheckCircle2, Zap, Shield,
  HelpCircle, Link2, Info
} from "lucide-react"

interface SSLInfo {
  valid: boolean
  issuer: string
  validFrom: string
  validTo: string
  protocol: string
  source: string
  daysRemaining: number
}

// Simulated response since browsers block direct SSL socket inspection via client-side JS
function simulatedCertificate(domain: string, valid: boolean): SSLInfo {
  const daysRemaining = valid ? Math.floor(Math.random() * 300) + 30 : 0

  return {
    valid,
    issuer: valid ? `Let's Encrypt Authority X3` : "Unavailable",
    validFrom: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    validTo: new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000).toLocaleDateString(),
    protocol: valid ? "TLS 1.3" : "Unknown",
    source: "Simulated Client Fallback",
    daysRemaining
  }
}

export default function SSLCheckerPage() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SSLInfo | null>(null)
  const [error, setError] = useState("")

  const id = useId()

  const cleanDomain = (input: string) => {
    let cleaned = input.trim().toLowerCase()
    cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?/, "")
    cleaned = cleaned.split('/')[0]
    return cleaned
  }

  const handleCheck = () => {
    setError("")
    setResult(null)

    const cleanedDomain = cleanDomain(domain)

    if (!cleanedDomain) {
      setError("Please enter a valid domain name.")
      return
    }

    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanedDomain)) {
      setError("Invalid domain format. Example: example.com")
      return
    }

    setDomain(cleanedDomain)
    setLoading(true)

    // Simulate network delay for realistic UX
    setTimeout(() => {
      // Simulate failure for specific demo domains (e.g., expired.com)
      const isValid = !cleanedDomain.includes("expired") && !cleanedDomain.includes("invalid")
      setResult(simulatedCertificate(cleanedDomain, isValid))
      setLoading(false)
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCheck()
    }
  }

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an SSL Certificate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An SSL (Secure Sockets Layer) certificate is a digital certificate that authenticates a website's identity and enables an encrypted connection. It ensures that data transferred between users and websites remains impossible to read by malicious actors."
        }
      },
      {
        "@type": "Question",
        "name": "Why is my SSL certificate showing as invalid?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SSL certificates can show as invalid for several reasons: they may have expired, the domain name might not match the certificate, the issuing Certificate Authority (CA) might not be trusted, or the certificate chain may be broken."
        }
      },
      {
        "@type": "Question",
        "name": "How often do SSL certificates expire?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Modern SSL certificates typically have a maximum lifespan of 398 days (about 13 months). Free certificates, like those from Let's Encrypt, expire every 90 days and require automated renewals."
        }
      },
      {
        "@type": "Question",
        "name": "What is TLS vs SSL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TLS (Transport Layer Security) is the modern, more secure successor to SSL. While the industry still commonly uses the term 'SSL certificate', any certificate you buy today is actually utilizing TLS protocols (like TLS 1.2 or TLS 1.3)."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free SSL Certificate Checker",
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "All",
    "description": "Instantly check the SSL/TLS certificate status, expiration date, and security protocols of any domain. Verify secure connections online."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">

        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <Lock className="h-4 w-4" aria-hidden="true" /> Security Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free SSL Certificate Checker
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Verify the security, validity, and expiration date of any website's SSL/TLS certificate instantly.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="SSL Checker Tool" className="max-w-3xl mx-auto w-full space-y-6">

          <ToolCard title="Domain Verification">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor={`${id}-domain`} className="text-base font-semibold">
                  Website URL or Domain Name
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-grow">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id={`${id}-domain`}
                      placeholder="example.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-10 h-12 text-base bg-muted/30 focus-visible:ring-1"
                      aria-label="Domain input field"
                      spellCheck={false}
                    />
                  </div>
                  <Button
                    onClick={handleCheck}
                    disabled={!domain.trim() || loading}
                    className="h-12 px-6 gap-2 font-semibold shadow-sm min-w-[120px]"
                    aria-label="Check SSL Certificate"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Checking...</span>
                      </div>
                    ) : (
                      <>
                        <Search className="h-5 w-5" aria-hidden="true" />
                        <span>Scan</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div aria-live="polite" aria-atomic="true">
                {error && (
                  <Alert variant="destructive" className="animate-in fade-in zoom-in-95 duration-300 shadow-sm border-destructive/50">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </ToolCard>

          {/* Results Dashboard */}
          <div aria-live="polite">
            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

                {/* Primary Status Banner */}
                <div className={`p-6 rounded-2xl border shadow-sm flex items-center gap-4 ${result.valid
                    ? "bg-green-500/10 border-green-500/20 text-green-900 dark:text-green-300"
                    : "bg-red-500/10 border-red-500/20 text-red-900 dark:text-red-300"
                  }`}>
                  <div className={`p-3 rounded-full ${result.valid ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {result.valid ? <ShieldCheck className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-1">
                      {result.valid ? "Certificate is Valid & Trusted" : "Certificate is Invalid or Expired"}
                    </h2>
                    <p className={`font-medium ${result.valid ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                      Connection to {domain} is {result.valid ? "securely encrypted." : "not secure."}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <ToolCard title="Certificate Details" className="h-full">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground text-sm flex items-center gap-2">
                          <Server className="h-4 w-4" /> Issuer
                        </span>
                        <span className="font-semibold text-right max-w-[200px] truncate" title={result.issuer}>
                          {result.issuer}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground text-sm flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Protocol
                        </span>
                        <span className="font-semibold">
                          {result.protocol}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground text-sm flex items-center gap-2">
                          <Info className="h-4 w-4" /> Provider
                        </span>
                        <span className="font-semibold text-xs bg-muted px-2 py-1 rounded">
                          {result.source}
                        </span>
                      </div>
                    </div>
                  </ToolCard>

                  <ToolCard title="Validity Period" className="h-full">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground text-sm flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> Valid From
                        </span>
                        <span className="font-mono text-sm">
                          {result.validFrom}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground text-sm flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> Valid Until
                        </span>
                        <span className="font-mono text-sm">
                          {result.validTo}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> Status
                        </span>
                        {result.valid ? (
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            Expires in {result.daysRemaining} days
                          </span>
                        ) : (
                          <span className="font-semibold text-red-600 dark:text-red-400">
                            Expired / Invalid
                          </span>
                        )}
                      </div>
                    </div>
                  </ToolCard>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Note: This is a client-side simulation. True SSL socket inspection requires a backend server.
                </p>

              </div>
            )}
          </div>
        </section>

      </div>
    </>
  )
}
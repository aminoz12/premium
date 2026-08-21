"use client"

import React, { useState, useEffect, useCallback, useId } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import { v4 as uuidv4, v1 as uuidv1 } from "uuid"
import {
  Copy, Fingerprint, RefreshCw, Check, Hash,
  Settings2, Shield, Zap, CheckCircle2, HelpCircle,
  Link2, Database, Download, FileText
} from "lucide-react"

export default function UUIDGeneratorPage() {
  const [version, setVersion] = useState<"v4" | "v1">("v4")
  const [count, setCount] = useState(5)
  const [textCase, setTextCase] = useState<"lowercase" | "uppercase">("lowercase")
  const [hyphens, setHyphens] = useState<"yes" | "no">("yes")
  const [uuids, setUUIDs] = useState<string[]>([])
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const { copy } = useClipboard()
  const id = useId()

  const generateUUIDs = useCallback(() => {
    const results: string[] = []
    const safeCount = Math.max(1, Math.min(1000, count || 1)) // Clamp between 1 and 1000

    for (let i = 0; i < safeCount; i++) {
      let currentUuid = version === "v4" ? uuidv4() : uuidv1()

      if (hyphens === "no") {
        currentUuid = currentUuid.replace(/-/g, "")
      }

      if (textCase === "uppercase") {
        currentUuid = currentUuid.toUpperCase()
      }

      results.push(currentUuid)
    }
    setUUIDs(results)
  }, [version, count, textCase, hyphens])

  // Initial generation on mount and when settings change
  useEffect(() => {
    generateUUIDs()
  }, [generateUUIDs])

  const handleCopyAll = async () => {
    if (!uuids.length) return
    await copy(uuids.join("\n"))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  const handleCopySingle = async (uuid: string, index: number) => {
    await copy(uuid)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleDownload = () => {
    if (!uuids.length) return
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `uuids-${version}-${new Date().getTime()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a UUID or GUID?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A UUID (Universally Unique Identifier), also known in the Microsoft ecosystem as a GUID (Globally Unique Identifier), is a 128-bit number used to uniquely identify information in computer systems. They are standard in software development for database keys, session IDs, and transaction references."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between UUID v4 and v1?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "UUID Version 4 is generated using purely random numbers, making it highly secure and unpredictable. UUID Version 1 is generated using your computer's MAC address and the current timestamp, which guarantees uniqueness but can expose your network identity and generation time."
        }
      },
      {
        "@type": "Question",
        "name": "Can two generated UUIDs ever be exactly the same?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While technically possible, the mathematical probability of a UUID v4 collision is practically zero. You would need to generate 1 billion UUIDs per second for 85 years to reach just a 50% chance of a single duplicate."
        }
      },
      {
        "@type": "Question",
        "name": "Are the UUIDs generated securely?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. This tool uses standard, cryptographically secure random number generators running locally in your web browser. The generated UUIDs are never sent to a server, ensuring 100% privacy."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Bulk UUID / GUID Generator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Instantly generate cryptographically secure UUIDs (v4) and GUIDs in bulk. Customize formats, cases, and copy instantly securely in your browser."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">

        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <Fingerprint className="h-4 w-4" aria-hidden="true" /> Developer Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free UUID / GUID Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly generate thousands of cryptographically secure Universally Unique Identifiers (v1 & v4). Customize formats and copy them directly to your clipboard.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="UUID Generator Configuration" className="grid gap-6 lg:grid-cols-[350px_1fr] items-start">

          {/* Configuration Panel */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <ToolCard title="Configuration">
              <div className="space-y-5">

                <div className="space-y-2">
                  <Label htmlFor={`${id}-version`} className="text-sm font-semibold flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" /> UUID Version
                  </Label>
                  <Select value={version} onValueChange={(v) => setVersion(v as "v4" | "v1")}>
                    <SelectTrigger id={`${id}-version`} className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v4">Version 4 (Random & Secure)</SelectItem>
                      <SelectItem value="v1">Version 1 (Timestamp + MAC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-count`} className="text-sm font-semibold flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" /> Quantity (Max 1000)
                  </Label>
                  <Input
                    id={`${id}-count`}
                    type="number"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    min={1}
                    max={1000}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-hyphens`} className="text-sm font-semibold flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-muted-foreground" /> Format Hyphens
                  </Label>
                  <Select value={hyphens} onValueChange={(v) => setHyphens(v as "yes" | "no")}>
                    <SelectTrigger id={`${id}-hyphens`} className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Include Hyphens</SelectItem>
                      <SelectItem value="no">Remove Hyphens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-case`} className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" /> Letter Case
                  </Label>
                  <Select value={textCase} onValueChange={(v) => setTextCase(v as "lowercase" | "uppercase")}>
                    <SelectTrigger id={`${id}-case`} className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lowercase">lowercase</SelectItem>
                      <SelectItem value="uppercase">UPPERCASE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateUUIDs}
                  className="w-full gap-2 font-bold shadow-sm pt-2"
                  aria-label="Generate new UUIDs"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" /> Generate New UUIDs
                </Button>

              </div>
            </ToolCard>
          </div>

          {/* Output Panel */}
          <ToolCard title="Generated Identifiers">
            <div className="space-y-4 flex flex-col h-full">

              {/* Output Actions Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {uuids.length} Generated
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={uuids.length === 0}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" /> Save .txt
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCopyAll}
                    disabled={uuids.length === 0}
                    className="gap-2"
                  >
                    {copiedAll ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" /> <span className="text-green-500">Copied All</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy All
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* View Modes based on count */}
              {uuids.length <= 20 ? (
                // Individual List View for smaller sets
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {uuids.map((uuid, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 border rounded-lg group hover:bg-muted/50 transition-colors"
                    >
                      <code className="font-mono text-sm sm:text-base break-all pr-4">{uuid}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        onClick={() => handleCopySingle(uuid, index)}
                        title="Copy to clipboard"
                        aria-label={`Copy UUID ${uuid}`}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                // Bulk Textarea View for large sets
                <Textarea
                  value={uuids.join("\n")}
                  readOnly
                  className="min-h-[500px] font-mono text-sm bg-muted/30 resize-y focus-visible:ring-1 whitespace-pre"
                  aria-label="Bulk generated UUIDs"
                />
              )}

            </div>
          </ToolCard>

        </section>

      </div>
    </>
  )
}
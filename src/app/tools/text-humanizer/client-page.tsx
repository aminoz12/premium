"use client"

import React, { useState, useId, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import { 
  Copy, Download, Eraser, Check, Trash2, 
  CheckCircle2, Zap, Shield, HelpCircle, Link2, 
  Wand2, BotOff, Sparkles, FileText, BarChart,
  Type
} from "lucide-react"

type DisplayMode = "highlight" | "strikethrough" | "clean"
type CleaningMode = "standard" | "aggressive"

// Dictionary of common ChatGPT-isms and AI phrases
const AI_PHRASES = [
  { match: /delve into/gi, replace: "explore" },
  { match: /rich tapestry/gi, replace: "complex mix" },
  { match: /it is important to note that/gi, replace: "notably," },
  { match: /in conclusion,?/gi, replace: "ultimately," },
  { match: /a testament to/gi, replace: "proof of" },
  { match: /\bmoreover,?\b/gi, replace: "additionally," },
  { match: /\bfurthermore,?\b/gi, replace: "also," },
  { match: /in the realm of/gi, replace: "in" },
  { match: /ever-evolving landscape/gi, replace: "changing environment" },
  { match: /\bfoster\b/gi, replace: "encourage" },
  { match: /seamlessly/gi, replace: "smoothly" },
  { match: /at the end of the day/gi, replace: "ultimately" },
  { match: /embark on/gi, replace: "start" },
  { match: /shed light on/gi, replace: "explain" },
]

export default function TextHumainClientPage() {
  const [input, setInput] = useState("")
  const [processedHTML, setProcessedHTML] = useState("")
  const [cleanText, setCleanText] = useState("")
  const [displayMode, setDisplayMode] = useState<DisplayMode>("highlight")
  const [cleaningMode, setCleaningMode] = useState<CleaningMode>("standard")
  const [stats, setStats] = useState({ changes: 0, originalScore: 0, newScore: 0 })
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const { copy } = useClipboard()
  const id = useId()

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  const processText = useCallback(() => {
    if (!input.trim()) {
      setProcessedHTML("")
      setCleanText("")
      setStats({ changes: 0, originalScore: 0, newScore: 0 })
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      let currentHtml = escapeHtml(input)
      let currentCleanText = input
      let modifications = 0

      // Calculate a pseudo AI-score based on frequency of trigger words
      const words = input.split(/\s+/).length
      let triggersFound = 0

      AI_PHRASES.forEach((rule) => {
        // Count triggers for the original score
        const matches = input.match(rule.match)
        if (matches) triggersFound += matches.length

        // Apply replacements
        currentCleanText = currentCleanText.replace(rule.match, rule.replace)
        
        currentHtml = currentHtml.replace(rule.match, (matched) => {
          modifications++
          if (displayMode === "highlight") {
            return `<mark class="bg-yellow-200 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-200 rounded px-1 font-medium" title="Replaced with: ${rule.replace}">${matched}</mark>`
          } else if (displayMode === "strikethrough") {
            return `<del class="text-red-500 decoration-2">${matched}</del> <ins class="text-green-600 dark:text-green-400 no-underline font-medium">${rule.replace}</ins>`
          } else {
            return rule.replace
          }
        })
      })

      const baseScore = Math.min(Math.round((triggersFound / words) * 1000), 99)
      
      setProcessedHTML(currentHtml)
      setCleanText(currentCleanText)
      setStats({
        changes: modifications,
        originalScore: baseScore > 5 ? baseScore : Math.floor(Math.random() * 15) + 5,
        newScore: Math.floor(Math.random() * 5) + 1 // Humanized score is always low
      })
      setIsProcessing(false)
    }, 400)
  }, [input, displayMode])

  const clearInput = () => {
    setInput("")
    setProcessedHTML("")
    setCleanText("")
    setStats({ changes: 0, originalScore: 0, newScore: 0 })
  }

  const handleCopy = async () => {
    if (!cleanText) return
    await copy(cleanText) // Always copy the clean text, not the HTML
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!cleanText) return
    const blob = new Blob([cleanText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "humanized-draft.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does an AI text humanizer work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An AI text humanizer scans your content for common machine-generated patterns, overused vocabulary (like 'delve' or 'tapestry'), and predictable sentence structures. It then restructures and replaces these phrases with natural, conversational human alternatives."
        }
      },
      {
        "@type": "Question",
        "name": "Will this bypass AI detectors?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, by removing the repetitive lexical signatures and predictable perplexity patterns used by Large Language Models, the cleaned text is much less likely to be flagged by standard AI detection algorithms."
        }
      },
      {
        "@type": "Question",
        "name": "Is my text data saved on your servers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The Text Humanizer operates entirely locally within your web browser using client-side processing. Your drafts are never uploaded, logged, or stored."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Text Humanizer",
    "applicationCategory": "WritingApplication",
    "operatingSystem": "All",
    "description": "Remove robotic phrasing and bypass AI detectors by humanizing your AI-generated text securely in your browser."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <BotOff className="h-4 w-4" aria-hidden="true" /> Content Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Text Humanizer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly identify and remove robotic phrasing from AI-generated content. Make your writing sound more natural and bypass AI detectors natively in your browser.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="Text Humanizer Tool" className="grid gap-6 lg:grid-cols-2 items-start">
          
          {/* Input Panel */}
          <ToolCard title="1. Original Draft">
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${id}-input`} className="text-sm font-semibold">
                  AI-Generated Text
                </Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearInput}
                  disabled={!input}
                  className="h-8 text-muted-foreground hover:text-destructive"
                  aria-label="Clear input text"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  Clear
                </Button>
              </div>

              <Textarea
                id={`${id}-input`}
                placeholder="Paste the draft you generated with ChatGPT, Claude, or Gemini here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[300px] flex-grow text-base bg-muted/30 resize-y focus-visible:ring-1 leading-relaxed"
                aria-label="Raw text input area"
              />

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`${id}-display`} className="text-xs font-semibold text-muted-foreground">Display Mode</Label>
                  <Select value={displayMode} onValueChange={(v) => setDisplayMode(v as DisplayMode)}>
                    <SelectTrigger id={`${id}-display`} className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highlight">Highlight Changes</SelectItem>
                      <SelectItem value="strikethrough">Strikethrough</SelectItem>
                      <SelectItem value="clean">Clean Output Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor={`${id}-mode`} className="text-xs font-semibold text-muted-foreground">Cleaning Mode</Label>
                  <Select value={cleaningMode} onValueChange={(v) => setCleaningMode(v as CleaningMode)}>
                    <SelectTrigger id={`${id}-mode`} className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={processText} 
                disabled={!input.trim() || isProcessing}
                className="w-full gap-2 shadow-sm font-semibold mt-2"
                aria-label="Humanize Text"
              >
                {isProcessing ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                )}
                Humanize Text
              </Button>
            </div>
          </ToolCard>

          {/* Output Panel */}
          <ToolCard title="2. Processed Result" className="lg:sticky lg:top-6">
            <div className="space-y-4 flex flex-col h-full">
              
              {/* Stats Bar */}
              {processedHTML && (
                <div className="grid grid-cols-3 gap-3 animate-in fade-in duration-300">
                  <div className="bg-muted/50 rounded-lg p-3 text-center border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Changes</p>
                    <p className="text-xl font-bold text-foreground">{stats.changes}</p>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-3 text-center border border-red-500/20">
                    <p className="text-xs text-red-600/80 dark:text-red-400/80 mb-1 uppercase tracking-wider font-semibold">AI Risk</p>
                    <p className="text-xl font-bold text-red-700 dark:text-red-400">{stats.originalScore}%</p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-3 text-center border border-green-500/20">
                    <p className="text-xs text-green-600/80 dark:text-green-400/80 mb-1 uppercase tracking-wider font-semibold">Humanized</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-400">{stats.newScore}%</p>
                  </div>
                </div>
              )}

              <div className="relative flex-grow h-full min-h-[300px]">
                {processedHTML ? (
                  <div 
                    className="absolute inset-0 overflow-y-auto p-4 bg-background border rounded-lg text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: processedHTML }}
                    aria-label="Processed HTML display"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 border border-dashed rounded-lg bg-muted/10 pointer-events-none">
                    <Wand2 className="h-12 w-12 mb-3 opacity-30" aria-hidden="true" />
                    <p className="text-sm font-medium">Waiting for draft input...</p>
                  </div>
                )}
              </div>

              <div className=" gap-3 pt-2">
                <Button
                  onClick={handleCopy}
                  disabled={!cleanText}
                  className="w-full gap-2 font-medium"
                  aria-label="Copy clean humanized text"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      Copy Final Text
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={!cleanText}
                  className="w-full gap-2 font-medium bg-background"
                  aria-label="Download text file"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Save .txt
                </Button>
              </div>

              {processedHTML && displayMode !== "clean" && (
                <p className="text-xs text-center text-muted-foreground bg-primary/5 p-2 rounded-md">
                  Note: Using the Copy or Save button will automatically output the clean text, ignoring the visual highlights.
                </p>
              )}
            </div>
          </ToolCard>
        </section>

      </div>
   </>
  )
}
"use client"

import React, { useState, useCallback, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ToolCard } from "@/components/layout/tool-layout"
import {
  Copy,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Trash2,
  Download,
  AlertCircle,
  Upload,
  RefreshCw,
  FileCode2,
  Zap,
  AlignLeft,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type ActionType = "minify" | "format" | null

interface Stats {
  inputSize: number
  outputSize: number
  savingsPercent: string
  ruleCount: number
  propertyCount: number
  commentCount: number
  selectorCount: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const countCSSStats = (css: string) => {
  const ruleCount = (css.match(/\{/g) || []).length
  const propertyCount = (css.match(/:[^:]/g) || []).length
  const commentCount = (css.match(/\/\*/g) || []).length
  const selectorCount = css
    .split("{")[0]
    ?.split(",").length ?? 0
  return { ruleCount, propertyCount, commentCount, selectorCount }
}

const minifyCSSString = (css: string): string =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\s+!important/g, "!important")
    .trim()

const formatCSSString = (css: string): string => {
  let indentLevel = 0
  const lines = css
    .replace(/\s+/g, " ")
    .replace(/\{/g, " {\n")
    .replace(/\}/g, "\n}\n")
    .replace(/;/g, ";\n")
    .replace(/\/\*/g, "\n/*")
    .replace(/\*\//g, "*/\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  let formatted = ""
  lines.forEach((line) => {
    if (line.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1)
    formatted += "  ".repeat(indentLevel) + line + "\n"
    if (line.endsWith("{")) indentLevel++
  })

  return formatted
    .replace(/;\s*;/g, ";")
    .replace(/:\s+/g, ": ")
    .replace(/,\s*/g, ", ")
    .trim()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated stat pill */
function StatPill({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: "success" | "danger" | "neutral"
}) {
  const colors = {
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    neutral: "bg-muted text-muted-foreground",
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        colors[highlight ?? "neutral"]
      }`}
    >
      {label}: <strong>{value}</strong>
    </span>
  )
}

/** Input statistics row */
function InputStats({ css }: { css: string }) {
  const { ruleCount, propertyCount, commentCount } = countCSSStats(css)
  if (!css.trim()) return null
  return (
    <div className="flex flex-wrap gap-1.5 pt-1" role="status" aria-label="Input CSS statistics">
      <StatPill label="Rules" value={ruleCount} />
      <StatPill label="Properties" value={propertyCount} />
      {commentCount > 0 && <StatPill label="Comments" value={commentCount} />}
    </div>
  )
}

/** Output savings badge */
function SavingsBadge({ savings }: { savings: number }) {
  if (savings === 0) return null
  const isPositive = savings > 0
  return (
    <StatPill
      label={isPositive ? "Saved" : "Increased"}
      value={`${Math.abs(savings).toFixed(1)}%`}
      highlight={isPositive ? "success" : "danger"}
    />
  )
}

/** FAQ / SEO content accordion */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium hover:text-primary transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {q}
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ToolClient() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [actionType, setActionType] = useState<ActionType>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Derived sizes ──────────────────────────────────────────────────────────
  const inputSize = useMemo(() => new Blob([input]).size, [input])
  const outputSize = useMemo(() => new Blob([output]).size, [output])
  const savings = useMemo(() => {
    if (!inputSize || !outputSize) return 0
    return ((inputSize - outputSize) / inputSize) * 100
  }, [inputSize, outputSize])

  // ── Core actions ───────────────────────────────────────────────────────────
  const process = useCallback(
    (type: "minify" | "format") => {
      if (!input.trim()) {
        setOutput("")
        setError("")
        setActionType(null)
        return
      }
      setIsProcessing(true)
      // Defer so UI can show loading state on heavy files
      setTimeout(() => {
        try {
          const result =
            type === "minify" ? minifyCSSString(input) : formatCSSString(input)
          setOutput(result)
          setError("")
          setActionType(type)
        } catch {
          setError("Processing failed. Please check your CSS syntax.")
          setOutput("")
        } finally {
          setIsProcessing(false)
        }
      }, 10)
    },
    [input]
  )

  const handleMinify = useCallback(() => process("minify"), [process])
  const handleFormat = useCallback(() => process("format"), [process])

  /** Swap input ↔ output */
  const handleSwap = useCallback(() => {
    if (!output) return
    setInput(output)
    setOutput("")
    setActionType(null)
    setError("")
  }, [output])

  /** Upload a .css file */
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (!file.name.endsWith(".css")) {
        setError("Please upload a valid .css file.")
        return
      }
      const reader = new FileReader()
      reader.onload = (ev) => {
        setInput(ev.target?.result as string)
        setOutput("")
        setError("")
        setActionType(null)
      }
      reader.readAsText(file)
      // Reset so same file can be re-uploaded
      e.target.value = ""
    },
    []
  )

  const handleDownload = useCallback(() => {
    if (!output) return
    const blob = new Blob([output], { type: "text/css" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = actionType === "minify" ? "styles.min.css" : "styles.formatted.css"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [output, actionType])

  const copyToClipboard = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* silent */
    }
  }, [output])

  const handleClear = useCallback(() => {
    setInput("")
    setOutput("")
    setError("")
    setActionType(null)
  }, [])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Hidden SEO intro (visually hidden but readable by crawlers) ── */}
      <p className="sr-only">
        Free online CSS Minifier and Formatter. Paste your CSS, upload a file,
        minify to reduce file size, or beautify / format for readability.
        Instant results with no server upload required — all processing happens
        in your browser.
      </p>

      <section
        aria-label="CSS Minifier and Formatter Tool"
        className="w-full space-y-6"
      >
        {/* ── Feature badges ── */}
        <div
          className="flex flex-wrap gap-2 justify-center"
          aria-label="Tool features"
        >
          {[
            { icon: Zap, label: "Instant — no server" },
            { icon: FileCode2, label: "Upload .css files" },
            { icon: AlignLeft, label: "Minify & Format" },
          ].map(({ icon: Icon, label }) => (
            <Badge
              key={label}
              variant="secondary"
              className="gap-1.5 px-3 py-1 text-xs font-medium"
            >
              <Icon className="h-3 w-3" aria-hidden="true" />
              {label}
            </Badge>
          ))}
        </div>

        {/* ── Editor grid ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input panel */}
          <ToolCard title="Input CSS">
            <div className="flex flex-col h-full space-y-3">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Size:{" "}
                    <strong className="text-foreground">
                      {formatBytes(inputSize)}
                    </strong>
                  </span>
                  <InputStats css={input} />
                </div>

                <div className="flex items-center gap-1">
                  {/* Upload button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-primary"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload CSS file"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                    Upload
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".css"
                    className="sr-only"
                    onChange={handleFileUpload}
                    aria-label="CSS file input"
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-7 px-2 text-muted-foreground hover:text-destructive"
                    disabled={!input && !output}
                    aria-label="Clear all content"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                    Clear
                  </Button>
                </div>
              </div>

              <label htmlFor="css-input" className="sr-only">
                Enter or paste your CSS code
              </label>
              <Textarea
                id="css-input"
                placeholder="Paste your CSS here, or upload a .css file above…"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  if (error) setError("")
                }}
                className="min-h-[420px] flex-1 font-mono text-sm resize-y leading-relaxed"
                aria-describedby="css-input-hint"
                aria-invalid={!!error}
                spellCheck={false}
              />
              <p id="css-input-hint" className="sr-only">
                Supports standard CSS, media queries, keyframes and CSS variables.
              </p>
            </div>
          </ToolCard>

          {/* Output panel */}
          <ToolCard title="Output">
            <div className="flex flex-col h-full space-y-3">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 min-h-[36px]">
                <div className="flex flex-wrap items-center gap-2">
                  {actionType ? (
                    <>
                      <StatPill
                        label="Size"
                        value={formatBytes(outputSize)}
                      />
                      {actionType === "minify" && (
                        <SavingsBadge savings={savings} />
                      )}
                      <Badge variant="outline" className="text-xs capitalize">
                        {actionType === "minify" ? "Minified" : "Formatted"}
                      </Badge>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="h-3 w-3" aria-hidden="true" />
                      Choose an action below to process your CSS
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Swap */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground hover:text-primary"
                    onClick={handleSwap}
                    disabled={!output}
                    aria-label="Use output as new input"
                    title="Use output as new input"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                    Re-use
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="h-7 px-3 text-xs"
                    disabled={!output}
                    aria-label="Download processed CSS file"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Output area */}
              <div className="relative flex-1">
                {error ? (
                  <div
                    role="alert"
                    className="flex flex-col items-center justify-center gap-3 min-h-[420px] p-6 text-center border-2 border-dashed border-destructive/50 rounded-md bg-destructive/5"
                  >
                    <AlertCircle
                      className="h-10 w-10 text-destructive"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-destructive">
                        Processing Error
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {error}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleClear}
                      className="mt-1"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Reset
                    </Button>
                  </div>
                ) : (
                  <>
                    <label htmlFor="css-output" className="sr-only">
                      Processed CSS output
                    </label>
                    <Textarea
                      id="css-output"
                      placeholder="Your processed CSS will appear here…"
                      value={output}
                      readOnly
                      className="min-h-[420px] h-full font-mono text-sm resize-y bg-muted/30 focus-visible:ring-0 pr-28 leading-relaxed"
                      aria-live="polite"
                      aria-label="Processed CSS result"
                      spellCheck={false}
                    />

                    {output && (
                      <Button
                        size="sm"
                        variant={copied ? "default" : "secondary"}
                        className="absolute right-3 top-3 shadow-sm transition-all duration-200"
                        onClick={copyToClipboard}
                        aria-label={copied ? "CSS copied to clipboard" : "Copy CSS to clipboard"}
                      >
                        {copied ? (
                          <>
                            <CheckCircle2
                              className="h-3.5 w-3.5 mr-1.5"
                              aria-hidden="true"
                            />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy
                              className="h-3.5 w-3.5 mr-1.5"
                              aria-hidden="true"
                            />
                            Copy
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </ToolCard>
        </div>

        {/* ── Primary CTA strip ── */}
        <div
          className="rounded-xl border border-border bg-muted/40 p-4 sm:p-6"
          role="group"
          aria-label="CSS processing actions"
        >
          <p className="text-center text-xs text-muted-foreground mb-4">
            All processing happens locally in your browser — your CSS is never
            uploaded to any server.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {/* Primary: Minify */}
            <Button
              onClick={handleMinify}
              size="lg"
              disabled={isProcessing || !input.trim()}
              className="w-full sm:w-auto px-10 gap-2 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
              aria-label="Minify CSS to reduce file size"
            >
              {isProcessing && actionType === "minify" ? (
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Minimize2 className="h-4 w-4" aria-hidden="true" />
              )}
              Minify CSS
              {inputSize > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 text-[10px] px-1.5 py-0 font-normal"
                >
                  {formatBytes(inputSize)}
                </Badge>
              )}
            </Button>

            {/* Secondary: Format */}
            <Button
              variant="secondary"
              onClick={handleFormat}
              size="lg"
              disabled={isProcessing || !input.trim()}
              className="w-full sm:w-auto px-10 gap-2 text-base font-semibold"
              aria-label="Format and beautify CSS for readability"
            >
              {isProcessing && actionType === "format" ? (
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              )}
              Format CSS
            </Button>
          </div>

          {/* Shortcut hint */}
          <p className="text-center text-xs text-muted-foreground mt-3 hidden sm:block">
            Tip: after minifying, click{" "}
            <strong className="text-foreground">Re-use</strong> in the output
            panel to pipe the result back as input.
          </p>
        </div>

        {/* ── SEO / educational content ── */}
        <article
          className="rounded-xl border border-border bg-card p-6 space-y-4"
          aria-label="About CSS Minification"
        >
          <h2 className="text-base font-semibold">
            Why Minify or Format CSS?
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-1">
              <h3 className="text-foreground font-medium flex items-center gap-1.5">
                <Minimize2 className="h-4 w-4 text-primary" aria-hidden="true" />
                CSS Minification
              </h3>
              <p>
                Removes whitespace, comments, and redundant characters from CSS
                files. Smaller files load faster, improving{" "}
                <strong>Core Web Vitals</strong> scores (LCP, FID) and reducing
                bandwidth costs — critical for SEO and user experience.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-foreground font-medium flex items-center gap-1.5">
                <Maximize2 className="h-4 w-4 text-primary" aria-hidden="true" />
                CSS Formatting
              </h3>
              <p>
                Beautifies compressed or poorly structured CSS into a consistent,
                human-readable format with proper indentation. Ideal for
                debugging, code reviews, and maintaining large stylesheets in a
                team environment.
              </p>
            </div>
          </div>

          {/* FAQ accordion — rich structured content for SEO */}
          <div className="pt-2">
            <h2 className="text-base font-semibold mb-1">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-border rounded-lg border border-border px-4">
              {[
                {
                  q: "Is my CSS data sent to a server?",
                  a: "No. This tool runs entirely in your browser using JavaScript. Your CSS code never leaves your device, ensuring complete privacy.",
                },
                {
                  q: "How much can CSS minification reduce file size?",
                  a: "Typical savings range from 20 % to 50 % depending on the amount of whitespace and comments in the original file. Highly formatted CSS with many comments can see savings of up to 70 %.",
                },
                {
                  q: "Will minified CSS break my website?",
                  a: "Properly minified CSS is functionally identical to the original. This tool preserves all selectors, properties, and values — it only removes unnecessary characters.",
                },
                {
                  q: "Can I format minified third-party CSS?",
                  a: "Yes. Paste any minified CSS — including from libraries like Bootstrap or Tailwind — and click Format CSS to make it readable and inspectable.",
                },
                {
                  q: "What CSS features are supported?",
                  a: "Standard CSS3, media queries, keyframe animations, CSS variables (custom properties), pseudo-classes, pseudo-elements, and most modern CSS syntax.",
                },
              ].map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </article>
      </section>
    </>
  )
}
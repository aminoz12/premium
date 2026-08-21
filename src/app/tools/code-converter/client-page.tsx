"use client"

import React, { useId, useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import {
  Copy, Check, AlertCircle, Loader2, ChevronDown, ChevronUp,
  ArrowRight, RefreshCw,
} from "lucide-react"

interface ClientPageProps {
  faqs: { q: string; a: string }[]
}

const RATE_LIMIT_KEY = "cconv_usage"
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 60 * 60 * 1000

function getRateLimit(): { count: number; windowStart: number } {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    if (!raw) return { count: 0, windowStart: Date.now() }
    return JSON.parse(raw)
  } catch {
    return { count: 0, windowStart: Date.now() }
  }
}

function incrementRateLimit() {
  const now = Date.now()
  const data = getRateLimit()
  const inWindow = now - data.windowStart < RATE_LIMIT_WINDOW
  const next = inWindow
    ? { count: data.count + 1, windowStart: data.windowStart }
    : { count: 1, windowStart: now }
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(next))
}

function getRemainingTries(): number {
  const now = Date.now()
  const data = getRateLimit()
  if (now - data.windowStart >= RATE_LIMIT_WINDOW) return RATE_LIMIT_MAX
  return Math.max(0, RATE_LIMIT_MAX - data.count)
}

const LANGUAGES = [
  "Python", "JavaScript", "TypeScript", "Java", "Kotlin", "C", "C++", "C#",
  "Go", "Rust", "Ruby", "PHP", "Swift", "Bash", "SQL (MySQL)", "SQL (PostgreSQL)",
  "SQL (SQLite)", "SQL (T-SQL)", "JSON", "YAML", "TOML", "Other",
]

const FREE_MODELS = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "minimax/minimax-m2.5:free",
  "deepseek/deepseek-r1:free",
  "openai/gpt-oss-120b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemini-2.0-flash-lite-preview-02-05:free",
]

const POPULAR_PAIRS = [
  { from: "Python", to: "JavaScript" },
  { from: "JavaScript", to: "TypeScript" },
  { from: "Python", to: "TypeScript" },
  { from: "Java", to: "Kotlin" },
  { from: "Java", to: "C#" },
  { from: "Python", to: "Go" },
  { from: "SQL (MySQL)", to: "SQL (PostgreSQL)" },
]

export default function ClientPage({ faqs }: ClientPageProps) {
  const [code, setCode] = useState("")
  const [fromLang, setFromLang] = useState("Python")
  const [toLang, setToLang] = useState("JavaScript")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [appState, setAppState] = useState<"idle" | "processing" | "complete">("idle")
  const [progress, setProgress] = useState(0)
  const [progressMsg, setProgressMsg] = useState("")
  const [remainingTries, setRemainingTries] = useState(RATE_LIMIT_MAX)
  const [copied, setCopied] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const { copy } = useClipboard()
  const id = useId()
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setRemainingTries(getRemainingTries()) }, [])

  const apiKeys = [
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY1,
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY2,
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY3,
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY4,
  ].filter(Boolean) as string[]

  const callOpenRouter = useCallback(
    async (systemPrompt: string, userContent: string): Promise<string> => {
      let lastError = ""
      for (const key of apiKeys) {
        for (const model of FREE_MODELS) {
          try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://thefreeaitools.com",
                "X-Title": "Code Converter",
              },
              body: JSON.stringify({
                model,
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: userContent },
                ],
              }),
            })
            if (res.ok) {
              const data = await res.json()
              return data.choices[0].message.content as string
            } else if (res.status === 401 || res.status === 402) {
              break
            }
          } catch (err: unknown) {
            lastError = err instanceof Error ? err.message : "Unknown error"
          }
        }
      }
      throw new Error(lastError || "All API attempts failed.")
    },
    [apiKeys]
  )

  const handleSwapLanguages = () => {
    setFromLang(toLang)
    setToLang(fromLang)
  }

  const handleConvert = async () => {
    if (!code.trim()) return
    if (fromLang === toLang) {
      setError("Source and target languages must be different.")
      return
    }
    if (remainingTries <= 0) {
      setError("Rate limit reached. Please try again in an hour.")
      return
    }

    setError("")
    setAppState("processing")
    setProgress(0)
    setProgressMsg("Parsing your code...")

    const messages = [
      "Mapping language differences...",
      "Translating logic and patterns...",
      "Applying idiomatic conventions...",
      "Finalizing output...",
    ]
    let msgIdx = 0
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 13, 88))
      setProgressMsg(messages[Math.min(msgIdx++, messages.length - 1)])
    }, 900)

    const systemPrompt = `You are an expert polyglot programmer. Convert the provided ${fromLang} code to ${toLang}.

Rules:
- Preserve the exact same logic and functionality
- Write idiomatic ${toLang} — use the language's natural patterns, not a literal translation
- Use the standard library and conventions of ${toLang} (e.g., list comprehension → .map(), Option instead of null checks, etc.)
- Add brief inline comments ONLY for non-obvious language differences or conversions
- Handle language-specific differences: null/None/nil, error handling, imports, types, etc.

Response format:
1. Output the converted code in a single code block
2. After the code block, add a short section "## Conversion Notes" listing up to 5 key differences or decisions made during conversion. Keep notes concise.

Do not add explanations outside these two sections.`

    try {
      const output = await callOpenRouter(systemPrompt, code)
      clearInterval(interval)
      setProgress(100)
      setProgressMsg("Conversion complete!")
      setResult(output)
      setAppState("complete")
      incrementRateLimit()
      setRemainingTries(getRemainingTries())
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
    } catch (err: unknown) {
      clearInterval(interval)
      setAppState("idle")
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    }
  }

  const handleCopy = () => {
    copy(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setAppState("idle")
    setResult("")
    setError("")
  }

  return (
    <>
      <ToolCard title="Code Converter">
        <div className="space-y-5">

          <div className="flex items-center justify-between text-xs rounded-md px-3 py-2 border bg-blue-50 text-blue-800 border-blue-200">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              AI Language-to-Language Converter
            </span>
            <span className="font-semibold">{remainingTries}/{RATE_LIMIT_MAX} uses left this hour</span>
          </div>

          {appState === "idle" && (
            <div className="space-y-5 animate-in fade-in duration-200">

              {/* Popular pairs quick-select */}
              <div className="space-y-2">
                <Label>Popular Conversions</Label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_PAIRS.map((pair) => (
                    <button
                      key={`${pair.from}-${pair.to}`}
                      onClick={() => { setFromLang(pair.from); setToLang(pair.to) }}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${fromLang === pair.from && toLang === pair.to
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted"
                        }`}
                    >
                      {pair.from} → {pair.to}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language selectors */}
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`from-${id}`}>From</Label>
                  <select
                    id={`from-${id}`}
                    value={fromLang}
                    onChange={(e) => setFromLang(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="mb-0.5"
                  onClick={handleSwapLanguages}
                  title="Swap languages"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <div className="flex-1 space-y-2">
                  <Label htmlFor={`to-${id}`}>To</Label>
                  <select
                    id={`to-${id}`}
                    value={toLang}
                    onChange={(e) => setToLang(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`code-${id}`}>Paste Your {fromLang} Code</Label>
                <Textarea
                  id={`code-${id}`}
                  placeholder={`# Paste your ${fromLang} code here...`}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[200px] resize-y font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground text-right">{code.length} characters</p>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleConvert}
                disabled={!code.trim() || fromLang === toLang || remainingTries <= 0}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Convert {fromLang} → {toLang}
              </Button>
            </div>
          )}

          {appState === "processing" && (
            <div className="space-y-4 py-6 animate-in fade-in duration-200">
              <div className="flex flex-col items-center gap-3 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-black  dark:text-white" />
                <p className="text-sm font-medium">{progressMsg}</p>
                <p className="text-xs text-muted-foreground">
                  Converting {fromLang} → {toLang}...
                </p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {appState === "complete" && (
            <div className="space-y-4 animate-in fade-in duration-200" ref={resultsRef}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Conversion complete
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Convert Another
                  </Button>
                </div>
              </div>
              <div className="rounded-md border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {result}
              </div>
            </div>
          )}
        </div>
      </ToolCard>

      {/* FAQ */}
      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
        {faqs.map((item, i) => (
          <div key={i} className="border rounded-md overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left hover:bg-muted/50 transition-colors"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              {item.q}
              {openFaq === i ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
            </button>
            {openFaq === i && (
              <div className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</div>
            )}
          </div>
        ))}
      </section>
    </>
  )
}

"use client"

import React, { useId, useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import {
  Copy, Check, AlertCircle, Loader2, ChevronDown, ChevronUp,
  Code, Sparkles, BookOpen, Zap,
} from "lucide-react"

interface ClientPageProps {
  faqs: { q: string; a: string }[]
}

const RATE_LIMIT_KEY = "cexp_usage"
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
  "Auto-detect", "Python", "JavaScript", "TypeScript", "Java", "C", "C++", "C#",
  "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "SQL", "Bash", "HTML", "CSS",
  "Dockerfile", "YAML", "JSON", "Other",
]

const LEVELS = [
  { id: "beginner", label: "Beginner", icon: <BookOpen className="w-3.5 h-3.5" />, desc: "Plain English, no jargon" },
  { id: "intermediate", label: "Intermediate", icon: <Code className="w-3.5 h-3.5" />, desc: "Patterns & concepts" },
  { id: "expert", label: "Expert", icon: <Zap className="w-3.5 h-3.5" />, desc: "Architecture & edge cases" },
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

export default function ClientPage({ faqs }: ClientPageProps) {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("Auto-detect")
  const [level, setLevel] = useState("intermediate")
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
                "X-Title": "Code Explainer",
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

  const handleExplain = async () => {
    if (!code.trim()) return
    if (remainingTries <= 0) {
      setError("Rate limit reached. Please try again in an hour.")
      return
    }

    setError("")
    setAppState("processing")
    setProgress(0)
    setProgressMsg("Reading your code...")

    const messages = [
      "Identifying language and patterns...",
      "Analyzing logic flow...",
      "Building your explanation...",
      "Polishing the output...",
    ]
    let msgIdx = 0
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 12, 88))
      setProgressMsg(messages[Math.min(msgIdx++, messages.length - 1)])
    }, 900)

    const langHint = language === "Auto-detect" ? "Detect the language automatically." : `The code is written in ${language}.`
    const levelMap: Record<string, string> = {
      beginner: "Use plain English, avoid jargon, and relate concepts to everyday ideas. Assume no prior coding knowledge.",
      intermediate: "Assume the reader knows programming basics. Focus on patterns, data structures, and the overall design.",
      expert: "Focus on architectural decisions, performance trade-offs, edge cases, and potential improvements. Skip basics.",
    }

    const systemPrompt = `You are an expert software engineer and educator. Explain the provided code snippet clearly.

${langHint}
Explanation level: ${level} — ${levelMap[level]}

Structure your response with these sections (use ## headers):
## What It Does
One or two sentences summarizing the code's purpose.

## Key Concepts
Bullet list of the main programming concepts, patterns, or APIs used.

## Step-by-Step Breakdown
Walk through the logic sequentially. Number each step.

## Potential Issues or Notes
Any edge cases, bugs, performance concerns, or important caveats. If none, write "No significant issues."

Be concise. Do not repeat the code. Do not add unnecessary padding.`

    try {
      const output = await callOpenRouter(systemPrompt, code)
      clearInterval(interval)
      setProgress(100)
      setProgressMsg("Done!")
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
      <ToolCard title="Code Explainer">
        <div className="space-y-5">

          <div className="flex items-center justify-between text-xs rounded-md px-3 py-2 border bg-violet-50 text-violet-800 border-violet-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Code Analysis
            </span>
            <span className="font-semibold">{remainingTries}/{RATE_LIMIT_MAX} uses left this hour</span>
          </div>

          {appState === "idle" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-2">
                <Label>Explanation Level</Label>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLevel(l.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-md border text-xs font-medium transition-all ${level === l.id
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background hover:bg-muted"
                        }`}
                    >
                      {l.icon}
                      <span>{l.label}</span>
                      <span className="text-[10px] opacity-70 font-normal">{l.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`lang-${id}`}>Language (optional)</Label>
                <select
                  id={`lang-${id}`}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`code-${id}`}>Paste Your Code</Label>
                <Textarea
                  id={`code-${id}`}
                  placeholder="// Paste any code snippet here...&#10;function example(arr) {&#10;  return arr.filter(x => x > 0).reduce((a, b) => a + b, 0)&#10;}"
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
                onClick={handleExplain}
                disabled={!code.trim() || remainingTries <= 0}
                className="w-full"
              >
                <Code className="w-4 h-4 mr-2" />
                Explain This Code
              </Button>
            </div>
          )}

          {appState === "processing" && (
            <div className="space-y-4 py-6 animate-in fade-in duration-200">
              <div className="flex flex-col items-center gap-3 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-medium">{progressMsg}</p>
                <p className="text-xs text-muted-foreground">Analyzing your code with AI...</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {appState === "complete" && (
            <div className="space-y-4 animate-in fade-in duration-200" ref={resultsRef}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Explanation ready
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Explain Another
                  </Button>
                </div>
              </div>
              <div className="rounded-md border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
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

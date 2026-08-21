"use client"

import React, { useId, useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import {
  Copy, Check, AlertCircle, Loader2, ChevronDown, ChevronUp,
  Zap, Bug,
} from "lucide-react"

interface ClientPageProps {
  faqs: { q: string; a: string }[]
}

const RATE_LIMIT_KEY = "errslv_usage"
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

const FRAMEWORKS = [
  "Auto-detect", "Python", "JavaScript", "TypeScript", "Node.js", "React", "Next.js",
  "Vue", "Java", "Spring", "C#", ".NET", "C++", "Go", "Rust", "PHP", "Laravel",
  "Ruby", "Rails", "Bash / Shell", "Docker", "Other",
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
  const [errorLog, setErrorLog] = useState("")
  const [framework, setFramework] = useState("Auto-detect")
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
                "X-Title": "Error Message Solver",
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

  const handleSolve = async () => {
    if (!errorLog.trim()) return
    if (remainingTries <= 0) {
      setError("Rate limit reached. Please try again in an hour.")
      return
    }

    setError("")
    setAppState("processing")
    setProgress(0)
    setProgressMsg("Reading the error...")

    const messages = [
      "Identifying error type and origin...",
      "Diagnosing root cause...",
      "Building fix instructions...",
      "Finalizing solution...",
    ]
    let msgIdx = 0
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 13, 88))
      setProgressMsg(messages[Math.min(msgIdx++, messages.length - 1)])
    }, 900)

    const stackHint = framework === "Auto-detect"
      ? "Detect the language and framework automatically from the error."
      : `The error is from a ${framework} project.`

    const systemPrompt = `You are an expert software engineer and debugger. Analyze the provided error message or stack trace and provide a clear diagnosis and fix.

${stackHint}

Structure your response with these sections (use ## headers):

## Root Cause
One or two sentences identifying exactly what is causing this error.

## Why This Happens
Brief explanation of the underlying reason (misconfiguration, type mismatch, missing dependency, etc.).

## Step-by-Step Fix
Numbered steps to resolve the error. Be specific — include exact commands, file paths, or config changes.

## Code Fix (if applicable)
If the fix involves changing code, show a corrected snippet. Use a code block. If no code change is needed, skip this section.

## Prevention
One or two sentences on how to avoid this error in the future.

Be direct and actionable. Avoid vague advice. Do not repeat the error back to the user.`

    try {
      const output = await callOpenRouter(systemPrompt, errorLog)
      clearInterval(interval)
      setProgress(100)
      setProgressMsg("Solution ready!")
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
      <ToolCard title="Error Message Solver">
        <div className="space-y-5">

          <div className="flex items-center justify-between text-xs rounded-md px-3 py-2 border bg-red-50 text-red-800 border-red-200">
            <span className="flex items-center gap-1.5">
              <Bug className="w-3.5 h-3.5" />
              AI-Powered Error Diagnosis
            </span>
            <span className="font-semibold">{remainingTries}/{RATE_LIMIT_MAX} uses left this hour</span>
          </div>

          {appState === "idle" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-2">
                <Label htmlFor={`fw-${id}`}>Language / Framework (optional)</Label>
                <select
                  id={`fw-${id}`}
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {FRAMEWORKS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`err-${id}`}>Paste Your Error or Stack Trace</Label>
                <Textarea
                  id={`err-${id}`}
                  placeholder={"TypeError: Cannot read properties of undefined (reading 'map')\n    at ProductList (ProductList.jsx:12:25)\n    at renderWithHooks (react-dom.development.js:14985:18)\n    ..."}
                  value={errorLog}
                  onChange={(e) => setErrorLog(e.target.value)}
                  className="min-h-[200px] resize-y font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Include the full stack trace for the most accurate diagnosis.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleSolve}
                disabled={!errorLog.trim() || remainingTries <= 0}
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" />
                Solve This Error
              </Button>
            </div>
          )}

          {appState === "processing" && (
            <div className="space-y-4 py-6 animate-in fade-in duration-200">
              <div className="flex flex-col items-center gap-3 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <p className="text-sm font-medium">{progressMsg}</p>
                <p className="text-xs text-muted-foreground">AI is diagnosing your error...</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {appState === "complete" && (
            <div className="space-y-4 animate-in fade-in duration-200" ref={resultsRef}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Solution ready
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Solve Another
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

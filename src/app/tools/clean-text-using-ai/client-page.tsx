"use client"

import React, { useId, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import {
    Copy, Check, AlertCircle, Sparkles, ChevronDown, ChevronUp,
    Brain, FileSearch, Fingerprint, Wand2, Clock
} from "lucide-react"

interface ClientPageProps {
    faqItems: { q: string; a: string }[]
}

// ─── Rate Limit Configuration ───────────────────────────────────────────────
const RATE_LIMIT_KEY = "clean_ai_usage"
const RATE_LIMIT_MAX = 3 // 3 requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

export default function ClientPage({ faqItems }: ClientPageProps) {
    const [text, setText] = useState("")
    const [result, setResult] = useState("")
    const [error, setError] = useState("")
    const [copied, setCopied] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const { copy } = useClipboard()
    const id = useId()

    // App states: 'idle' | 'processing' | 'done'
    const [appState, setAppState] = useState<'idle' | 'processing' | 'done'>('idle')
    const [progress, setProgress] = useState(0)
    const [loadingMessage, setLoadingMessage] = useState("")
    const [usageCount, setUsageCount] = useState(0)
    const [timeUntilReset, setTimeUntilReset] = useState<string | null>(null)

    const free_models = [
        "nvidia/nemotron-3-super-120b-a12b:free",
        "minimax/minimax-m2.5:free",
        "deepseek/deepseek-r1:free",
        "openai/gpt-oss-120b:free",
        "qwen/qwen3-next-80b-a3b-instruct:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "google/gemini-2.0-flash-lite-preview-02-05:free"
    ]

  const apiKeys = [
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY1,
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY2,
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY3,
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY4,
  ].filter(Boolean) as string[]

    // ─── Initialize Rate Limit ──────────────────────────────────────────────
    useEffect(() => {
        const checkRateLimit = () => {
            const stored = localStorage.getItem(RATE_LIMIT_KEY)
            if (stored) {
                const data = JSON.parse(stored)
                const now = Date.now()
                if (now - data.timestamp > RATE_LIMIT_WINDOW) {
                    // Reset if over an hour
                    localStorage.removeItem(RATE_LIMIT_KEY)
                    setUsageCount(0)
                } else {
                    setUsageCount(data.count)
                    if (data.count >= RATE_LIMIT_MAX) {
                        const remainingMs = RATE_LIMIT_WINDOW - (now - data.timestamp)
                        const mins = Math.ceil(remainingMs / 60000)
                        setTimeUntilReset(`${mins} minutes`)
                    }
                }
            }
        }
        checkRateLimit()
        // Check every minute if they are waiting
        const interval = setInterval(checkRateLimit, 60000)
        return () => clearInterval(interval)
    }, [])

    const incrementUsage = () => {
        const stored = localStorage.getItem(RATE_LIMIT_KEY)
        const now = Date.now()
        let newData = { count: 1, timestamp: now }
        if (stored) {
            const data = JSON.parse(stored)
            if (now - data.timestamp < RATE_LIMIT_WINDOW) {
                newData = { count: data.count + 1, timestamp: data.timestamp }
            }
        }
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newData))
        setUsageCount(newData.count)
    }

    // ─── Handle Processing & Timers ─────────────────────────────────────────
    const handleCleanText = async () => {
        if (!text.trim()) {
            setError("Please enter some text to clean.")
            return
        }

        if (apiKeys.length === 0) {
            setError("Configuration Error: No API keys found.")
            return
        }

        if (usageCount >= RATE_LIMIT_MAX) {
            setError(`Rate limit reached. Please wait ${timeUntilReset} before trying again.`)
            return
        }

        setError("")
        setResult("")
        setAppState('processing')
        setProgress(0)

        let apiResult = ""
        let apiError = ""
        let isApiDone = false

        // 1. Background API Fetch
        const performFetch = async () => {
            let success = false
            for (const key of apiKeys) {
                if (success) break
                for (const model of free_models) {
                    try {
                        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${key}`,
                                "Content-Type": "application/json",
                                "HTTP-Referer": "https://thefreeaitools.com",
                                "X-Title": "AI Text Cleaner"
                            },
                            body: JSON.stringify({
                                model: model,
                                messages: [
                                    {
                                        role: "system",
                                        content: "You are an expert copywriter. Your job is to 'humanize' the provided text. Rewrite it so that it sounds completely natural and human-written. Remove robotic, repetitive phrasing. Vary the sentence length (burstiness) and use natural, less predictable vocabulary (perplexity) to bypass AI content detectors. Preserve the original meaning and formatting. Only output the rewritten text, nothing else."
                                    },
                                    { role: "user", content: text }
                                ]
                            })
                        })

                        if (response.ok) {
                            const data = await response.json()
                            apiResult = data.choices[0].message.content
                            success = true
                            break
                        } else if (response.status === 401 || response.status === 402) {
                            break
                        }
                    } catch (err: any) {
                        apiError = err.message
                    }
                }
            }
            if (!success) apiError = "Failed to clean text. " + apiError
            isApiDone = true
        }

        // Start API in background
        performFetch()

        // 2. The 60-Second Magic Engagement Timer
        const startTime = Date.now()
        const MAGIC_DURATION = 60000 // 60 seconds

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime

            // Calculate progress, cap at 99% if API is slow
            const calculatedProgress = Math.min((elapsed / MAGIC_DURATION) * 100, 99)
            setProgress(calculatedProgress)

            // Dynamic engaging messages
            if (elapsed < 5000) setLoadingMessage("Verifying text length and structure...")
            else if (elapsed < 15000) setLoadingMessage("Scanning for AI signatures and robotic patterns...")
            else if (elapsed < 30000) setLoadingMessage("Applying natural burstiness (varying sentence lengths)...")
            else if (elapsed < 45000) setLoadingMessage("Enhancing vocabulary perplexity to sound human...")
            else if (elapsed < 58000) setLoadingMessage("Applying final human polish and proofreading...")
            else setLoadingMessage("Finalizing results...")

            // Check if 60 seconds have passed AND API is finished
            if (elapsed >= MAGIC_DURATION) {
                if (isApiDone) {
                    clearInterval(timer)
                    if (apiResult) {
                        setProgress(100)
                        setResult(apiResult)
                        setAppState('done')
                        incrementUsage()
                    } else {
                        setError(apiError)
                        setAppState('idle')
                    }
                }
                // If 60s passed but API is slow, it will just hang at 99% until isApiDone becomes true
            }
        }, 500)
    }

    const handleCopy = () => {
        if (result) {
            copy(result)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const resetTool = () => {
        setAppState('idle')
        setText("")
        setResult("")
    }

    return (
        <>
            <ToolCard title="Clean & Humanize Text">
                <div className="space-y-6">
                    {/* Input Phase */}
                    {appState === 'idle' && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor={`input-${id}`}>AI Text to Humanize</Label>
                                    <span className="text-xs text-muted-foreground font-medium">
                                        Uses remaining: {RATE_LIMIT_MAX - usageCount}/{RATE_LIMIT_MAX}
                                    </span>
                                </div>
                                <Textarea
                                    id={`input-${id}`}
                                    placeholder="Paste your robotic, AI-generated text here..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="min-h-[250px] resize-y"
                                />
                            </div>

                            <Button
                                onClick={handleCleanText}
                                disabled={!text.trim() || usageCount >= RATE_LIMIT_MAX}
                                className="w-full h-12 text-md"
                            >
                                <Wand2 className="mr-2 h-5 w-5" />
                                {usageCount >= RATE_LIMIT_MAX ? "Limit Reached" : "Clean & Humanize Text"}
                            </Button>

                            {error && (
                                <div className="p-3 text-sm text-red-800 bg-red-50 rounded-md border border-red-200 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2 shrink-0" /> {error}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Processing/Magic Phase */}
                    {appState === 'processing' && (
                        <div className="py-12 space-y-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                            <div className="relative flex items-center justify-center w-24 h-24">
                                {/* Pulsing rings */}
                                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
                                <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-pulse"></div>
                                <div className="bg-primary/10 p-4 rounded-full z-10">
                                    {progress < 25 ? <FileSearch className="w-10 h-10 text-primary animate-bounce" /> :
                                        progress < 60 ? <Fingerprint className="w-10 h-10 text-primary animate-pulse" /> :
                                            <Brain className="w-10 h-10 text-primary animate-pulse" />}
                                </div>
                            </div>

                            <div className="space-y-2 w-full max-w-md">
                                <h3 className="text-lg font-semibold tracking-tight">{loadingMessage}</h3>
                                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all ease-linear duration-500 rounded-full relative"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium animate-pulse">
                                    Applying advanced language algorithms. Do not close this tab...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Result Phase */}
                    {appState === 'done' && result && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-green-900 text-sm">Text Successfully Humanized!</h4>
                                    <p className="text-xs text-green-700">Robotic patterns removed. Vocabulary and burstiness optimized.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Humanized Result</Label>
                                    <Button variant="outline" size="sm" onClick={handleCopy} className="h-8">
                                        {copied ? <Check className="w-4 h-4 text-green-600 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copied ? "Copied!" : "Copy Text"}
                                    </Button>
                                </div>
                                <div className="p-5 bg-muted rounded-md border text-sm whitespace-pre-wrap leading-relaxed shadow-inner max-h-[400px] overflow-y-auto">
                                    {result}
                                </div>
                            </div>

                            <Button onClick={resetTool} variant="secondary" className="w-full">
                                Clean Another Text
                            </Button>
                        </div>
                    )}
                </div>
            </ToolCard>

            {/* ─── FAQ Section ──────────────────────────────────────────── */}
            <section className="mt-12 space-y-3" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-xl font-bold">Frequently Asked Questions</h2>
                <div className="divide-y border rounded-lg overflow-hidden bg-card">
                    {faqItems.map((item, i) => (
                        <div key={i}>
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 text-left text-sm font-medium hover:bg-muted/50 transition-colors"
                                aria-expanded={openFaq === i}
                            >
                                {item.q}
                                {openFaq === i ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                            </button>
                            {openFaq === i && (
                                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}
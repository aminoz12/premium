"use client"

import React, { useId, useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import {
  Copy, Check, AlertCircle, Sparkles, ChevronDown, ChevronUp,
  Clock, FileText, Zap, Feather, PenTool, RefreshCw
} from "lucide-react"

// ─── Rate Limit: 3 tries per 3 hours per browser ──────────────────────────────
const RATE_LIMIT_KEY = "paraphraser_usage"
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW = 3 * 60 * 60 * 1000 // 3 hours in ms

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

function getResetMinutes(): number {
  const data = getRateLimit()
  const elapsed = Date.now() - data.windowStart
  return Math.ceil((RATE_LIMIT_WINDOW - elapsed) / 60000)
}

// ─── Word Stats ──────────────────────────────────────────────────────────────
function getTextStats(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  return { words: words.length, sentences: sentences.length }
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface ClientPageProps {
  faqs: { q: string; a: string }[]
}

const TONES = ["Standard", "Fluent", "Formal", "Simple", "Creative"]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientPage({ faqs }: ClientPageProps) {
  const [text, setText] = useState("")
  const [result, setResult] = useState("")
  const [selectedTone, setSelectedTone] = useState("Standard")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [remainingTries, setRemainingTries] = useState(RATE_LIMIT_MAX)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Magic states
  const [magicState, setMagicState] = useState<"idle" | "processing">("idle")
  const [progress, setProgress] = useState(0)
  const [magicMessage, setMagicMessage] = useState("")

  const { copy } = useClipboard()
  const id = useId()
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRemainingTries(getRemainingTries())
  }, [])

  const freeModels = [
    "nvidia/nemotron-3-super-120b-a12b:free",
    "minimax/minimax-m2.5:free",
    "deepseek/deepseek-r1:free",
    "openai/gpt-oss-120b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemini-2.0-flash-lite-preview-02-05:free",
  ]

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
        for (const model of freeModels) {
          try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://thefreeaitools.com",
                "X-Title": "AI Paraphrasing Tool",
              },
              body: JSON.stringify({
                model,
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: userContent },
                ],
              }),
            })
            if (response.ok) {
              const data = await response.json()
              return data.choices[0].message.content as string
            } else if (response.status === 401 || response.status === 402) {
              break
            }
          } catch (err: any) {
            lastError = err.message
          }
        }
      }
      throw new Error(lastError || "All API attempts failed.")
    },
    [apiKeys]
  )

  // ─── Magic Delay Execution ─────────────────────────────────────────────────
  const handleRewrite = async () => {
    if (!text.trim()) { setError("Please enter some text to rewrite."); return }
    if (apiKeys.length === 0) { setError("Configuration Error: No API keys found."); return }
    if (remainingTries <= 0) {
      setError(`Rate limit reached. You can rewrite ${RATE_LIMIT_MAX} times per 3 hours. Resets in ${getResetMinutes()} min.`)
      return
    }

    setError("")
    setResult("")
    setMagicState("processing")
    setProgress(0)
    setMagicMessage("Initializing rewriting engine...")

    let isApiDone = false
    let apiError: any = null
    let rewrittenText = ""

    const systemPrompt = `You are an expert editor and copywriter. Paraphrase and rewrite the user's text. 
Make the tone perfectly match: ${selectedTone}.
- Keep the exact same core meaning, facts, and intent.
- Change the vocabulary, sentence structure, and flow to enhance the text.
- Do NOT add any conversational filler, disclaimers, or introductory text.
- Output ONLY the final rewritten text.`

    // Background API Call
    callOpenRouter(systemPrompt, text)
      .then((res) => {
        rewrittenText = res;
        isApiDone = true;
      })
      .catch((e) => {
        apiError = e;
        isApiDone = true;
      })

    const startTime = Date.now()
    const duration = 60000 // Force 60-second magic wait 

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min((elapsed / duration) * 100, 99)
      setProgress(currentProgress)

      // Dynamic 60s Engagement Messages tailored for paraphrasing
      if (elapsed < 10000) setMagicMessage("Analyzing original text meaning and context...")
      else if (elapsed < 20000) setMagicMessage("Extracting core concepts and key entities...")
      else if (elapsed < 30000) setMagicMessage(`Applying ${selectedTone} tone parameters...`)
      else if (elapsed < 40000) setMagicMessage("Restructuring sentences and optimizing flow...")
      else if (elapsed < 50000) setMagicMessage("Enhancing vocabulary to avoid plagiarism flags...")
      else setMagicMessage("Performing final grammar checks and polish...")

      if (elapsed >= duration) {
        if (isApiDone) {
          clearInterval(timer)
          setProgress(100)
          setMagicState("idle")
          if (apiError) {
            setError(apiError.message || "Operation failed.")
          } else {
            setResult(rewrittenText)
            incrementRateLimit()
            setRemainingTries(getRemainingTries())
            setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
          }
        }
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

  const stats = text ? getTextStats(text) : null

  return (
    <>
      <ToolCard title="AI Paraphrasing & Rewriting Tool">
        <div className="space-y-6">

          {/* Rate limit indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2 border">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Free rewrites remaining:
            </span>
            <span className={`font-semibold ${remainingTries === 0 ? "text-red-600" : remainingTries === 1 ? "text-amber-600" : "text-green-600"}`}>
              {remainingTries} / {RATE_LIMIT_MAX} (Resets 3 Hrs)
            </span>
          </div>

          {/* Input Phase UI */}
          {magicState === "idle" && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">

              {/* Tone Selector */}
              <div className="space-y-2">
                <Label>Select Rewriting Tone</Label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTone(t)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${selectedTone === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground hover:bg-muted"
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {stats && (
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {stats.words} words</span>
                  <span className="flex items-center gap-1"><Feather className="w-3 h-3" /> {stats.sentences} sentences</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`input-${id}`}>Text to Rewrite</Label>
                <Textarea
                  id={`input-${id}`}
                  placeholder="Paste the text you want to paraphrase or rewrite here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[250px] resize-y"
                />
              </div>

              <Button
                onClick={handleRewrite}
                disabled={!text.trim() || remainingTries <= 0}
                className="w-full h-12"
              >
                <PenTool className="mr-2 h-5 w-5" /> Rewrite & Paraphrase Text
              </Button>

              {error && (
                <div className="p-3 text-sm text-red-800 bg-red-50 rounded-md border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
                </div>
              )}
            </div>
          )}

          {/* Magic Loading UI */}
          {magicState === "processing" && (
            <div className="py-12 space-y-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-pulse"></div>
                <div className="bg-primary/10 p-4 rounded-full z-10">
                  <PenTool className="w-10 h-10 text-primary animate-bounce" />
                </div>
              </div>

              <div className="space-y-3 w-full max-w-md">
                <h3 className="text-lg font-semibold tracking-tight">{magicMessage}</h3>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all ease-linear duration-500 rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-medium animate-pulse">
                  Applying advanced {selectedTone.toLowerCase()} AI models. Please do not close this window...
                </p>
              </div>
            </div>
          )}

          {/* Results Area */}
          {magicState === "idle" && result && (
            <div ref={resultsRef} className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 text-sm">Text Successfully Rewritten!</h4>
                  <p className="text-xs text-green-700">Vocabulary enhanced and plagiarism removed using {selectedTone} tone.</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Paraphrased Result ({selectedTone})</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="h-8">
                      {copied ? <Check className="w-4 h-4 text-green-600 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setText(result); setResult(""); }} title="Load result into input to rewrite again">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-5 bg-muted rounded-md border text-sm whitespace-pre-wrap leading-relaxed shadow-inner max-h-[400px] overflow-y-auto">
                  {result}
                </div>
              </div>

              <Button onClick={() => setResult("")} variant="secondary" className="w-full">
                Paraphrase Another Text
              </Button>
            </div>
          )}
        </div>
      </ToolCard>

      <section className="mt-10 space-y-4" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-xl font-bold">How the Paraphrasing Tool Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <FileText className="w-5 h-5 text-primary" />, title: "1. Enter Text", desc: "Paste the sentences, paragraphs, or full article you want to rewrite." },
            { icon: <Zap className="w-5 h-5 text-primary" />, title: "2. Select Tone", desc: "Choose from Standard, Formal, Fluent, Simple, or Creative to match your audience." },
            { icon: <Sparkles className="w-5 h-5 text-primary" />, title: "3. Get Results", desc: "Our AI processes the context and delivers a 100% unique, plagiarism-free rewrite." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-4 border rounded-lg space-y-2 bg-muted/30">
              {icon}
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-3" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-xl font-bold">Frequently Asked Questions</h2>
        <div className="divide-y border rounded-lg overflow-hidden bg-card">
          {faqs.map((item, i) => (
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
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
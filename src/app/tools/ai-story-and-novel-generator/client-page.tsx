"use client"

import React, { useId, useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import {
  Copy, Check, AlertCircle, Sparkles,
  ChevronDown, ChevronUp, BookOpen, Clock,
  Wand2, Feather, RefreshCw, PenTool
} from "lucide-react"

interface ClientPageProps {
  faqs: { q: string; a: string }[]
}

// ─── Rate Limit config ──────────────────────────────────────────────────
const RATE_LIMIT_KEY = "aistory_usage"
const RATE_LIMIT_MAX = 5 // 5 stories per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in ms

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

const GENRES = ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Horror", "Thriller", "Adventure", "Fanfiction"]

export default function ClientPage({ faqs }: ClientPageProps) {
  const [text, setText] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("Fantasy")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [remainingTries, setRemainingTries] = useState(RATE_LIMIT_MAX)

  // App States: idle -> processing -> complete
  const [appState, setAppState] = useState<"idle" | "processing" | "complete">("idle")
  const [progress, setProgress] = useState(0)
  const [magicMessage, setMagicMessage] = useState("")

  const { copy } = useClipboard()
  const [copied, setCopied] = useState(false)

  const id = useId()
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRemainingTries(getRemainingTries())
  }, [])

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

  const callOpenRouter = useCallback(
    async (systemPrompt: string, userContent: string): Promise<string> => {
      let lastError = ""
      for (const key of apiKeys) {
        for (const model of free_models) {
          try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://thefreeaitools.com",
                "X-Title": "AI Story Generator",
              },
              body: JSON.stringify({
                model,
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: userContent },
                ],
                temperature: 0.8, // Slightly higher temperature for creative writing
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
      throw new Error(lastError || "All AI attempts failed.")
    },
    [apiKeys]
  )

  const handleCopy = () => {
    copy(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateStory = async () => {
    if (!text.trim()) { setError("Please enter a prompt or idea."); return }
    if (apiKeys.length === 0) { setError("Configuration Error: No API keys found."); return }
    if (remainingTries <= 0) {
      setError(`Rate limit reached. You can write ${RATE_LIMIT_MAX} stories per hour. Resets in ${getResetMinutes()} min.`)
      return
    }

    setError("")
    setAppState("processing")
    setProgress(0)
    setMagicMessage("Brainstorming plot points...")

    let isApiDone = false
    let apiError: any = null
    let generatedStory = ""

    const systemPrompt = `You are a best-selling, award-winning author. Write a highly captivating, incredibly descriptive story based on the user's prompt.
The genre of this story MUST be: ${selectedGenre}.
- Focus on "show, don't tell". Use vivid imagery, emotional depth, and natural dialogue.
- Ensure excellent pacing.
- Do NOT include any intro or outro text like "Here is your story:" or "Hope you enjoyed it!". Output ONLY the story itself.
- Make it a substantial length, well-formatted with paragraphs.`

    // Background API Call
    callOpenRouter(systemPrompt, text)
      .then((res) => {
        generatedStory = res;
        isApiDone = true;
      })
      .catch((e) => {
        apiError = e;
        isApiDone = true;
      })

    const startTime = Date.now()
    const duration = 60000 // Force 60-second magic wait for dramatic effect

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min((elapsed / duration) * 100, 99)
      setProgress(currentProgress)

      // Dynamic 60s Engagement Messages for Story Writing
      if (elapsed < 10000) setMagicMessage(`Establishing ${selectedGenre} setting and world-building...`)
      else if (elapsed < 20000) setMagicMessage("Fleshing out character details and motivations...")
      else if (elapsed < 30000) setMagicMessage("Writing compelling narrative and descriptive prose...")
      else if (elapsed < 40000) setMagicMessage("Crafting natural dialogue and emotional arcs...")
      else if (elapsed < 50000) setMagicMessage("Building tension and refining pacing...")
      else setMagicMessage("Polishing the final draft...")

      if (elapsed >= duration) {
        if (isApiDone) {
          clearInterval(timer)
          setProgress(100)
          setAppState("complete")
          if (apiError) {
            setError(apiError.message || "Failed to generate story.")
            setAppState("idle")
          } else {
            setResult(generatedStory)
            incrementRateLimit()
            setRemainingTries(getRemainingTries())
            setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
          }
        }
      }
    }, 500)
  }

  const handleReset = () => {
    setAppState("idle")
    setResult("")
  }

  return (
    <>
      <ToolCard title="AI Story & Novel Generator">
        <div className="space-y-6">

          <div className="flex items-center justify-between text-xs text-muted-foreground bg-purple-50 text-purple-800 rounded-md px-3 py-2 border border-purple-200">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Creative Generations Remaining:
            </span>
            <span className={`font-semibold ${remainingTries === 0 ? "text-red-600" : "text-purple-600"}`}>
              {remainingTries} / {RATE_LIMIT_MAX} (Resets hourly)
            </span>
          </div>

          {appState === "idle" && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">

              <div className="space-y-2">
                <Label>Select Genre</Label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${selectedGenre === g
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground hover:bg-muted"
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`input-${id}`}>Story Prompt or Idea</Label>
                <Textarea
                  id={`input-${id}`}
                  placeholder="Describe your idea... (e.g., A detective in a cyberpunk city discovers a pocket watch that can freeze time for exactly 10 seconds...)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px] resize-y leading-relaxed"
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-red-800 bg-red-50 rounded-md border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                onClick={generateStory}
                disabled={!text.trim() || remainingTries <= 0}
                className="w-full h-12 text-md"
              >
                <PenTool className="mr-2 h-5 w-5" /> Write My Story
              </Button>
            </div>
          )}

          {/* Magic Loading UI */}
          {appState === "processing" && (
            <div className="py-12 space-y-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-pulse"></div>
                <div className="bg-primary/10 p-4 rounded-full z-10">
                  <Feather className="w-10 h-10 text-primary animate-bounce" />
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
                  Our AI authors are weaving your narrative. Please do not close this window...
                </p>
              </div>
            </div>
          )}

          {/* Result UI */}
          {appState === "complete" && (
            <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

              <div className="p-4 bg-muted/30 rounded-lg border space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <Label className="text-primary flex items-center gap-2 text-base">
                    <BookOpen className="w-5 h-5" /> {selectedGenre} Story Generated
                  </Label>
                  <Button variant="outline" size="sm" onClick={handleCopy} className="h-8">
                    {copied ? <Check className="w-4 h-4 text-green-600 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Story"}
                  </Button>
                </div>

                <div className="p-4 bg-background border rounded-md text-sm leading-8 whitespace-pre-wrap font-serif shadow-inner max-h-[500px] overflow-y-auto">
                  {result}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleReset} variant="default" className="w-full">
                  <Wand2 className="w-4 h-4 mr-2" /> Write Another Story
                </Button>
              </div>

            </div>
          )}
        </div>
      </ToolCard>

      <section className="mt-10 space-y-4" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-xl font-bold">How to Get the Best Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">1. Provide Context</h3>
            <p className="text-sm text-muted-foreground">Instead of "a boy finds a sword," try "A farm boy discovers a cursed glowing sword in his barn that speaks to him in riddles."</p>
          </div>
          <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
            <Wand2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">2. Mix Genres</h3>
            <p className="text-sm text-muted-foreground">Select a main genre (like Sci-Fi), but add extra flavors in your prompt like "Make it a comedic sci-fi story about a depressed robot."</p>
          </div>
          <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">3. Fanfiction Mode</h3>
            <p className="text-sm text-muted-foreground">Select 'Fanfiction' and explicitly name the characters and universes you want to mash together or explore.</p>
          </div>
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
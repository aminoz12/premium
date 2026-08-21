"use client"

import React, { useId, useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import {
  Copy, Check, AlertCircle, Sparkles, Loader2,
  ChevronDown, ChevronUp, Image as ImageIcon, MessageSquare,
  Settings, Wand2, ArrowRight
} from "lucide-react"

interface ClientPageProps {
  faqs: { q: string; a: string }[]
}

// ─── Rate Limit config ──────────────────────────────────────────────────
const RATE_LIMIT_KEY = "aiprompt_usage"
const RATE_LIMIT_MAX = 5 // Allow 5 prompts per hour for testing

function checkRateLimit() {
  if (typeof window === "undefined") return { allowed: true }
  const recordStr = localStorage.getItem(RATE_LIMIT_KEY)
  const now = Date.now()
  if (!recordStr) return { allowed: true, count: 0 }

  try {
    const record = JSON.parse(recordStr)
    const oneHour = 60 * 60 * 1000
    if (now - record.timestamp > oneHour) {
      return { allowed: true, count: 0 }
    }
    if (record.count >= RATE_LIMIT_MAX) {
      const minutesLeft = Math.ceil((oneHour - (now - record.timestamp)) / 60000)
      return { allowed: false, minutesLeft }
    }
    return { allowed: true, count: record.count }
  } catch {
    return { allowed: true, count: 0 }
  }
}

function incrementRateLimit() {
  if (typeof window === "undefined") return
  const recordStr = localStorage.getItem(RATE_LIMIT_KEY)
  const now = Date.now()
  let count = 1
  let timestamp = now
  if (recordStr) {
    try {
      const record = JSON.parse(recordStr)
      const oneHour = 60 * 60 * 1000
      if (now - record.timestamp < oneHour) {
        count = record.count + 1
        timestamp = record.timestamp
      }
    } catch { }
  }
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count, timestamp }))
}

export default function ClientPage({ faqs }: ClientPageProps) {
  const [text, setText] = useState("")
  const [targetAi, setTargetAi] = useState("midjourney")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // App States: idle -> processing -> complete
  const [appState, setAppState] = useState<"idle" | "processing" | "complete">("idle")
  const [progress, setProgress] = useState(0)
  const [magicMessage, setMagicMessage] = useState("")

  const { copy } = useClipboard()
  const [copied, setCopied] = useState(false)

  const id = useId()
  const resultsRef = useRef<HTMLDivElement>(null)

  const free_models = [
     "nvidia/nemotron-3-super-120b-a12b:free",
    "minimax/minimax-m2.5:free",
    "openai/gpt-oss-120b:free",
    "google/gemini-2.0-flash-lite-preview-02-05:free"
  ]

  const handleCopy = () => {
    copy(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generatePrompt = async () => {
    if (!text.trim()) return

    const { allowed, minutesLeft } = checkRateLimit()
    if (!allowed) {
      setError(`Rate limit reached. Please try again in ${minutesLeft} minutes.`)
      return
    }

    setError("")
    setAppState("processing")
    setProgress(0)
    setMagicMessage("Analyzing your idea...")

    // Fake progress animation for UX while the API loads
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      })
    }, 400)

    try {
      setTimeout(() => setMagicMessage("Applying prompt engineering techniques..."), 1500)
      setTimeout(() => setMagicMessage("Optimizing for target AI model..."), 3000)

      // Get a random model to ensure fallback
      const randomModel = free_models[Math.floor(Math.random() * free_models.length)]

      let systemPrompt = ""
      if (targetAi === "midjourney" || targetAi === "stablediffusion") {
        systemPrompt = `You are an expert AI image prompt engineer. The user will give you a basic idea. Your job is to expand it into a highly detailed, comma-separated prompt for an image generator like ${targetAi}. Include subject details, background, lighting (e.g., cinematic lighting, volumetric), camera specs (e.g., 35mm lens, f/1.8), style (e.g., photorealistic, concept art, cyberpunk), and color palette. Output ONLY the finalized prompt text. No explanations.`
      } else {
        systemPrompt = `You are an expert AI text prompt engineer. The user will give you a basic task. Your job is to expand it into a professional, highly structured prompt for ${targetAi}. Include a Persona/Role, Task Description, Context, Constraints, and Output Format. Output ONLY the finalized prompt text. No explanations.`
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Ensure you have OPENROUTER_API_KEY in your .env.local
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY1}`,
        },
        body: JSON.stringify({
          model: randomModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
          ],
          temperature: 0.7,
        }),
      })

      clearInterval(interval)
      setProgress(100)
      setMagicMessage("Prompt Ready!")

      if (!response.ok) {
        throw new Error("Failed to connect to the AI model. Please try again.")
      }

      const data = await response.json()
      const generatedText = data.choices?.[0]?.message?.content?.trim() || ""

      if (generatedText) {
        setResult(generatedText)
        setAppState("complete")
        incrementRateLimit()
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
      } else {
        throw new Error("The AI returned an empty response.")
      }
    } catch (err: any) {
      clearInterval(interval)
      setAppState("idle")
      setError(err.message || "An unexpected error occurred.")
    }
  }

  const handleReset = () => {
    setAppState("idle")
    setResult("")
    setText("")
  }

  return (
    <>
      <ToolCard title="Prompt Engineer AI">
        <div className="space-y-6">

          <div className="flex items-center justify-between text-xs text-muted-foreground bg-blue-50 text-blue-800 rounded-md px-3 py-2 border border-blue-200">
            <span className="flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5" />
              AI Prompt Optimization Engine
            </span>
            <span className="font-semibold">
              Free Tier Model
            </span>
          </div>

          {appState === "idle" && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">

              <div className="space-y-2">
                <Label>Target AI Model</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "midjourney", name: "Midjourney", icon: <ImageIcon className="w-4 h-4" /> },
                    { id: "stablediffusion", name: "Stable Diffusion", icon: <ImageIcon className="w-4 h-4" /> },
                    { id: "chatgpt", name: "ChatGPT", icon: <MessageSquare className="w-4 h-4" /> },
                    { id: "claude", name: "Claude AI", icon: <MessageSquare className="w-4 h-4" /> },
                  ].map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setTargetAi(model.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-md border text-sm font-medium transition-all ${targetAi === model.id
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-background hover:bg-muted"
                        }`}
                    >
                      {model.icon}
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`input-${id}`}>Your Basic Idea</Label>
                <Textarea
                  id={`input-${id}`}
                  placeholder={targetAi === "midjourney" || targetAi === "stablediffusion"
                    ? "e.g., A dog wearing a spacesuit on the moon..."
                    : "e.g., Write a blog post about healthy eating..."}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px] resize-y"
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-red-800 bg-red-50 rounded-md border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                onClick={generatePrompt}
                disabled={!text.trim()}
                className="w-full h-12 text-md"
              >
                <Sparkles className="mr-2 h-5 w-5" /> Generate Expert Prompt
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
                  <Settings className="w-10 h-10 text-primary animate-spin" style={{ animationDuration: '3s' }} />
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
              </div>
            </div>
          )}

          {/* Result UI */}
          {appState === "complete" && (
            <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

              <div className="p-4 bg-muted/50 rounded-lg border space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-primary flex items-center gap-2">
                    <Check className="w-4 h-4" /> Optimized {targetAi.charAt(0).toUpperCase() + targetAi.slice(1)} Prompt
                  </Label>
                  <Button variant="outline" size="sm" onClick={handleCopy} className="h-8">
                    {copied ? <Check className="w-4 h-4 text-green-600 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Prompt"}
                  </Button>
                </div>

                <div className="p-4 bg-background border rounded-md text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  {result}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleReset} variant="outline" className="w-full">
                  Create Another
                </Button>
                <Button onClick={() => window.open(`https://${targetAi === 'chatgpt' ? 'chat.openai.com' : targetAi === 'claude' ? 'claude.ai' : targetAi === 'midjourney' ? 'midjourney.com' : 'clipdrop.co'}`, '_blank')} className="w-full">
                  Open {targetAi.charAt(0).toUpperCase() + targetAi.slice(1)} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

            </div>
          )}
        </div>
      </ToolCard>

      <section className="mt-10 space-y-4" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-xl font-bold">How to Write Better AI Prompts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">For Image Models (Midjourney, DALL-E)</h3>
            <p className="text-sm text-muted-foreground">Image AIs don't understand conversational sentences. They need comma-separated keywords detailing the subject, environment, lighting (e.g., volumetric lighting), camera parameters (e.g., 8k, f/1.8), and art style.</p>
          </div>
          <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">For Text Models (ChatGPT, Claude)</h3>
            <p className="text-sm text-muted-foreground">Text models need a "Persona" (Act as an expert...), clear "Task" instructions, necessary "Context" (Target audience, tone), and strict "Formatting constraints" (Output in markdown, max 500 words).</p>
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
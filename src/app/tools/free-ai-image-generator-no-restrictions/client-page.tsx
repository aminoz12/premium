"use client"

import React, { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Wand2, Loader2, Copy, Check, AlertCircle, Sparkles, Download,
  ImageIcon, Shield, Cpu, RefreshCw,
} from "lucide-react"

// ─── Constants ──────────────────────────────────────────────────────────────
const MODEL_ID = "google/gemma-4-31b-it:free"
const RATE_KEY = "aiimage_norestr_rl_v1"
const RATE_MAX = 20

type AppState = "idle" | "enhancing" | "rendering" | "complete" | "error"
type AspectRatio = "1:1" | "16:9" | "9:16" | "3:4" | "4:3"
type StylePreset = "photoreal" | "anime" | "digital-art" | "oil-painting" | "3d-render" | "cinematic" | "none"

interface ImageResult {
  enhancedPrompt: string
  imageUrl: string
  seed: number
  width: number
  height: number
}

const ASPECT_DIMS: Record<AspectRatio, { w: number; h: number }> = {
  "1:1": { w: 1024, h: 1024 },
  "16:9": { w: 1280, h: 720 },
  "9:16": { w: 720, h: 1280 },
  "3:4": { w: 768, h: 1024 },
  "4:3": { w: 1024, h: 768 },
}

const STYLE_PRESETS: Array<{ value: StylePreset; label: string; suffix: string }> = [
  { value: "none", label: "No preset", suffix: "" },
  { value: "photoreal", label: "📷 Photoreal", suffix: ", photorealistic, dslr, 50mm lens, natural lighting, ultra detailed, 8k" },
  { value: "anime", label: "🌸 Anime", suffix: ", anime style, cel-shaded, studio ghibli inspired, vibrant colors, detailed line art" },
  { value: "digital-art", label: "🎨 Digital Art", suffix: ", digital painting, artstation trending, concept art, intricate detail, vibrant" },
  { value: "oil-painting", label: "🖼️ Oil Painting", suffix: ", oil painting, thick impasto brushstrokes, classical composition, museum quality" },
  { value: "3d-render", label: "🧊 3D Render", suffix: ", octane render, 3d, subsurface scattering, cinematic lighting, ultra detailed" },
  { value: "cinematic", label: "🎬 Cinematic", suffix: ", cinematic still, 35mm film, anamorphic lens, shallow depth of field, moody lighting" },
]

// ─── Rate limit ─────────────────────────────────────────────────────────────
function getRateData(): { count: number; ts: number } {
  if (typeof window === "undefined") return { count: 0, ts: Date.now() }
  try {
    const d = JSON.parse(localStorage.getItem(RATE_KEY) || "{}")
    if (d.ts && Date.now() - d.ts > 3_600_000) return { count: 0, ts: Date.now() }
    return { count: d.count || 0, ts: d.ts || Date.now() }
  } catch {
    return { count: 0, ts: Date.now() }
  }
}
function incrementRate() {
  if (typeof window === "undefined") return
  const d = getRateData()
  localStorage.setItem(RATE_KEY, JSON.stringify({ count: d.count + 1, ts: d.ts || Date.now() }))
}
function checkRateLimit(): { allowed: boolean; minutesLeft?: number } {
  const d = getRateData()
  if (d.count >= RATE_MAX) {
    const minutesLeft = Math.ceil((3_600_000 - (Date.now() - d.ts)) / 60_000)
    return { allowed: false, minutesLeft }
  }
  return { allowed: true }
}

// ─── Gemma prompt enhancer ──────────────────────────────────────────────────
async function enhancePromptWithGemma(rawPrompt: string, stylePreset: StylePreset): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY3
  if (!apiKey) {
    // No API key — just return the raw prompt with the style suffix
    return rawPrompt + (STYLE_PRESETS.find((s) => s.value === stylePreset)?.suffix || "")
  }

  const systemPrompt = `You are an expert text-to-image prompt engineer. Take the user's short idea and rewrite it as a single, vivid, production-quality image prompt for an open-source diffusion model.

OUTPUT RULES (ABSOLUTE):
- Return ONLY the rewritten prompt as plain text.
- NO markdown, NO quotes, NO labels, NO "Here is", NO explanation, NO commentary.
- 30–80 words. Concrete sensory detail. Strong nouns and verbs.
- Include: subject, action, setting, lighting, mood, composition, key color palette.
- The first character of your reply is a normal letter — not a quote, not a hyphen, not a backtick.`

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
        "X-Title": "Free AI Image Generator (No Restrictions)",
      },
      body: JSON.stringify({
        model: MODEL_ID,
        max_tokens: 300,
        temperature: 0.8,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: rawPrompt.trim() },
        ],
      }),
    })

    if (!response.ok) throw new Error(`Enhancer ${response.status}`)
    const data = await response.json()
    let enhanced = (data.choices?.[0]?.message?.content || "").trim()
    // Strip surrounding quotes if Gemma added them
    enhanced = enhanced.replace(/^["'`]+|["'`]+$/g, "").trim()
    if (!enhanced) enhanced = rawPrompt
    return enhanced + (STYLE_PRESETS.find((s) => s.value === stylePreset)?.suffix || "")
  } catch {
    // Fallback to raw prompt
    return rawPrompt + (STYLE_PRESETS.find((s) => s.value === stylePreset)?.suffix || "")
  }
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function ClientPage() {
  const [prompt, setPrompt] = useState("")
  const [stylePreset, setStylePreset] = useState<StylePreset>("photoreal")
  const [aspect, setAspect] = useState<AspectRatio>("1:1")
  const [useEnhancer, setUseEnhancer] = useState(true)
  const [appState, setAppState] = useState<AppState>("idle")
  const [error, setError] = useState("")
  const [result, setResult] = useState<ImageResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [rateData, setRateData] = useState(getRateData)
  const updateRate = useCallback(() => setRateData(getRateData()), [])

  async function copyPrompt() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.enhancedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {/* ignore */ }
  }

  function downloadImage() {
    if (!result) return
    const link = document.createElement("a")
    link.href = result.imageUrl
    link.download = `ai-image-${result.seed}.png`
    link.target = "_blank"
    link.rel = "noopener"
    link.click()
  }

  async function generate(regenerate = false) {
    if (!prompt.trim()) {
      setError("Describe the image you want to generate.")
      return
    }
    const { allowed, minutesLeft } = checkRateLimit()
    if (!allowed) {
      setError(`Rate limit reached (${RATE_MAX}/hour). Try again in ${minutesLeft} minutes.`)
      return
    }
    setError("")

    try {
      let finalPrompt = prompt.trim()
      if (useEnhancer) {
        setAppState("enhancing")
        finalPrompt = await enhancePromptWithGemma(prompt.trim(), stylePreset)
      } else {
        finalPrompt = prompt.trim() + (STYLE_PRESETS.find((s) => s.value === stylePreset)?.suffix || "")
      }

      setAppState("rendering")
      const { w, h } = ASPECT_DIMS[aspect]
      const seed = regenerate || result ? Math.floor(Math.random() * 1_000_000) : Math.floor(Math.random() * 1_000_000)
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${w}&height=${h}&seed=${seed}&nologo=true&enhance=false`

      // Pre-load to verify the URL renders
      await new Promise<void>((resolve, reject) => {
        const img = new window.Image()
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("Pollinations image failed to load"))
        img.src = url
      })

      setResult({ enhancedPrompt: finalPrompt, imageUrl: url, seed, width: w, height: h })
      setAppState("complete")
      incrementRate()
      updateRate()
    } catch (err: unknown) {
      setAppState("error")
      setError(err instanceof Error ? err.message : "Generation failed. Please try again.")
    }
  }

  const rateCount = rateData.count
  const busy = appState === "enhancing" || appState === "rendering"

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-5 py-4">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-900">Free AI Image Generator</div>
              <div className="text-xs text-emerald-700/80">Gemma rewrites your prompt → Pollinations.ai renders the image</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 font-medium text-emerald-700 ring-1 ring-emerald-200">
              <Cpu className="h-3 w-3" />
              Gemma + Pollinations
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
              <Shield className="h-3 w-3" />
              {rateCount}/{RATE_MAX} this hour
            </span>
          </div>
        </div>
      </div>

      {/* Idea input */}
      <div className="space-y-2">
        <Label htmlFor="img-prompt" className="text-sm font-semibold">
          Describe the image
        </Label>
        <Textarea
          id="img-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A samurai cat warrior in a misty bamboo forest at dawn, cherry blossoms falling, cinematic"
          className="min-h-[110px] resize-y"
          maxLength={500}
        />
        <div className="text-right text-xs text-muted-foreground">{prompt.length}/500</div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Style</Label>
          <div className="grid grid-cols-2 gap-2">
            {STYLE_PRESETS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStylePreset(s.value)}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition-all ${stylePreset === s.value
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500/20"
                  : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Aspect Ratio</Label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(ASPECT_DIMS) as AspectRatio[]).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAspect(a)}
                className={`rounded-lg border px-3 py-2 text-center text-sm font-medium transition-all ${aspect === a
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-700"
                  : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                  }`}
              >
                {a}
              </button>
            ))}
          </div>

          <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={useEnhancer}
              onChange={(e) => setUseEnhancer(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-emerald-600"
            />
            <span>
              <strong className="text-foreground">Enhance prompt with Gemma</strong> (rewrites your idea for better results)
            </span>
          </label>
        </div>
      </div>

      {/* Generate button */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => generate(false)}
          disabled={busy || !prompt.trim()}
          className="flex-1 gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700"
        >
          {appState === "enhancing" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enhancing prompt with Gemma…
            </>
          ) : appState === "rendering" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Rendering image…
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Generate Image
            </>
          )}
        </Button>
        {result && !busy && (
          <Button
            type="button"
            variant="outline"
            onClick={() => generate(true)}
            className="gap-2"
            title="Generate a new variation with the same prompt"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="relative bg-checkered" style={{ aspectRatio: `${result.width}/${result.height}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.imageUrl}
                alt={result.enhancedPrompt}
                width={result.width}
                height={result.height}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
              <span>
                {result.width}×{result.height} · seed {result.seed}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium hover:bg-muted hover:text-foreground"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-600">Prompt copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy enhanced prompt
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={downloadImage}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium hover:bg-muted hover:text-foreground"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              Enhanced prompt
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{result.enhancedPrompt}</p>
          </div>
        </div>
      )}

      {/* Honest note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <strong>How &quot;no restrictions&quot; works:</strong> images are rendered by{" "}
            <a href="https://pollinations.ai/" target="_blank" rel="noopener noreferrer" className="font-medium underline">
              Pollinations.ai
            </a>{" "}
            (free, no signup). Pollinations is permissive but still applies its own safety filter — extreme content may be blocked at their end. Gemma rewrites your prompt for higher visual quality before rendering.
          </p>
        </div>
      </div>
    </div>
  )
}

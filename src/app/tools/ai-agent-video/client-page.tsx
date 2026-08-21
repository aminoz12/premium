"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Wand2, Loader2, Copy, Check, AlertCircle, Sparkles, Film,
  Camera, Sun, Palette, Clock, Shield, Cpu, ExternalLink,
} from "lucide-react"

// ─── Constants ──────────────────────────────────────────────────────────────
const MODEL_ID = "google/gemma-4-31b-it:free"
const RATE_KEY = "aivideo_rl_v1"
const RATE_MAX = 15

type AppState = "idle" | "processing" | "complete" | "error"
type VideoStyle = "cinematic" | "anime" | "documentary" | "commercial" | "vintage" | "sci-fi"
type Duration = "5s" | "10s" | "15s" | "30s"
type AspectRatio = "16:9" | "9:16" | "1:1"

interface VideoPromptResult {
  mainPrompt: string
  negativePrompt: string
  cameraDirection: string
  lighting: string
  styleNotes: string
  audioCues: string
  exportTargets: { name: string; url: string; promptToUse: string }[]
}

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

const STYLE_OPTIONS: Array<{ value: VideoStyle; label: string; desc: string }> = [
  { value: "cinematic", label: "🎬 Cinematic", desc: "Film-grade composition" },
  { value: "anime", label: "🌸 Anime", desc: "Stylized 2D animation" },
  { value: "documentary", label: "📺 Documentary", desc: "Natural, observational" },
  { value: "commercial", label: "💼 Commercial", desc: "Clean product/brand" },
  { value: "vintage", label: "📼 Vintage", desc: "VHS / 80s film grain" },
  { value: "sci-fi", label: "🚀 Sci-Fi", desc: "Futuristic neon" },
]

const DURATION_OPTIONS: Duration[] = ["5s", "10s", "15s", "30s"]
const ASPECT_OPTIONS: AspectRatio[] = ["16:9", "9:16", "1:1"]

// ─── System Prompt for Gemma ────────────────────────────────────────────────
function buildVideoSystemPrompt(opts: { style: VideoStyle; duration: Duration; aspect: AspectRatio }): string {
  return `You are an expert video prompt engineer who writes production-quality text-to-video prompts for AI video models (Sora, Runway Gen-3, Pika, Kling, Luma Dream Machine).

OUTPUT FORMAT (ABSOLUTE — VIOLATION = FAILURE):
Return ONLY a single valid JSON object. No prose, no markdown, no \`\`\`json fences, no commentary. The first character of your response is "{", the last is "}". The JSON must match this exact schema:

{
  "mainPrompt": "string — 60–120 words, vivid sensory detail, present tense, packed with concrete visual nouns",
  "negativePrompt": "string — comma-separated list of artifacts to avoid (blurry, distorted hands, watermark, low quality, jittery motion, etc.)",
  "cameraDirection": "string — explicit shot, movement, lens, framing (e.g. 'Slow dolly-in, 35mm wide-angle, eye-level')",
  "lighting": "string — light source, color temperature, mood (e.g. 'Golden hour rim-light from camera-right, warm 4200K, soft falloff')",
  "styleNotes": "string — color palette + visual references + grading notes",
  "audioCues": "string — sound effects, music style, ambient (for models that support audio)"
}

DIRECTOR'S BRIEF:
- Style: ${opts.style}
- Duration target: ${opts.duration}
- Aspect ratio: ${opts.aspect}

QUALITY BAR:
- Main prompt MUST start with a clear subject + action, then setting, then atmosphere.
- Avoid abstract adjectives like "beautiful" or "amazing" — use concrete sensory detail.
- For ${opts.aspect === "9:16" ? "vertical 9:16 (TikTok/Reels/Shorts)" : opts.aspect === "1:1" ? "square 1:1 (feed posts)" : "widescreen 16:9 (YouTube/Sora)"}, structure the framing accordingly.
- Output exactly one JSON object. No extra keys. No comments. Start with "{" end with "}".`
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function ClientPage() {
  const [idea, setIdea] = useState("")
  const [style, setStyle] = useState<VideoStyle>("cinematic")
  const [duration, setDuration] = useState<Duration>("10s")
  const [aspect, setAspect] = useState<AspectRatio>("16:9")
  const [appState, setAppState] = useState<AppState>("idle")
  const [error, setError] = useState("")
  const [result, setResult] = useState<VideoPromptResult | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [rateData, setRateData] = useState(getRateData)
  const updateRate = useCallback(() => setRateData(getRateData()), [])

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1800)
    } catch {/* ignore */ }
  }

  async function generate() {
    if (!idea.trim()) {
      setError("Describe the video you want to generate.")
      return
    }
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY3
    if (!apiKey) {
      setError("OpenRouter API key missing. Add NEXT_PUBLIC_OPENROUTER_API_KEY3 to your .env.local.")
      return
    }
    const { allowed, minutesLeft } = checkRateLimit()
    if (!allowed) {
      setError(`Rate limit reached (${RATE_MAX}/hour). Try again in ${minutesLeft} minutes.`)
      return
    }

    setError("")
    setAppState("processing")
    setResult(null)

    try {
      const systemPrompt = buildVideoSystemPrompt({ style, duration, aspect })
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
          "X-Title": "AI Video Prompt Agent",
        },
        body: JSON.stringify({
          model: MODEL_ID,
          max_tokens: 1500,
          temperature: 0.85,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Video idea: ${idea.trim()}\n\nReturn the JSON now.` },
          ],
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData?.error?.message || `API error ${response.status}`)
      }

      const data = await response.json()
      const raw = (data.choices?.[0]?.message?.content || "").trim()
      const parsed = parseJsonResponse(raw)

      const exportTargets = [
        { name: "Sora (OpenAI)", url: "https://sora.com/", promptToUse: parsed.mainPrompt },
        { name: "Runway Gen-3", url: "https://runwayml.com/", promptToUse: parsed.mainPrompt },
        { name: "Pika Labs", url: "https://pika.art/", promptToUse: parsed.mainPrompt },
        { name: "Kling AI", url: "https://klingai.com/", promptToUse: parsed.mainPrompt },
        { name: "Luma Dream Machine", url: "https://lumalabs.ai/dream-machine", promptToUse: parsed.mainPrompt },
      ]

      setResult({ ...parsed, exportTargets })
      setAppState("complete")
      incrementRate()
      updateRate()
    } catch (err: unknown) {
      setAppState("error")
      setError(err instanceof Error ? err.message : "Generation failed. Please try again.")
    }
  }

  const rateCount = rateData.count

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 via-violet-50 to-indigo-50 px-5 py-4">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-fuchsia-200/40 blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow-md shadow-fuchsia-500/30">
              <Film className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-fuchsia-900">AI Video Prompt Agent</div>
              <div className="text-xs text-fuchsia-700/80">Powered by Gemma — pastes into Sora, Runway, Pika, Kling, Luma</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 font-medium text-fuchsia-700 ring-1 ring-fuchsia-200">
              <Cpu className="h-3 w-3" />
              {MODEL_ID.replace(":free", "")}
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-fuchsia-700">
              <Shield className="h-3 w-3" />
              {rateCount}/{RATE_MAX} this hour
            </span>
          </div>
        </div>
      </div>

      {/* Honest note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <strong>How this works:</strong> Gemma is a text model — it cannot render video pixels.
            This tool uses Gemma to write you a <em>director-grade prompt pack</em> that you paste
            into a real video model (Sora, Runway, Pika, Kling, Luma) to render the actual video.
            No free API renders video pixels today.
          </p>
        </div>
      </div>

      {/* Idea input */}
      <div className="space-y-2">
        <Label htmlFor="video-idea" className="text-sm font-semibold">Describe the video you want</Label>
        <Textarea
          id="video-idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="A vintage red Porsche driving through a neon-lit Tokyo street at midnight, rain reflecting on wet asphalt, slow tracking shot from the side"
          className="min-h-[110px] resize-y"
          maxLength={600}
        />
        <div className="text-right text-xs text-muted-foreground">{idea.length}/600</div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Style</Label>
          <div className="grid grid-cols-2 gap-2">
            {STYLE_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStyle(s.value)}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition-all ${style === s.value
                  ? "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-700 ring-1 ring-fuchsia-500/20"
                  : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                  }`}
              >
                <div className="font-medium">{s.label}</div>
                <div className="text-[10px] text-muted-foreground">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Duration</Label>
          <div className="grid grid-cols-2 gap-2">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`rounded-lg border px-3 py-2 text-center text-sm font-medium transition-all ${duration === d
                  ? "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-700"
                  : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Clock className="mr-1 inline h-3 w-3" />
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Aspect Ratio</Label>
          <div className="grid grid-cols-3 gap-2">
            {ASPECT_OPTIONS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAspect(a)}
                className={`rounded-lg border px-3 py-2 text-center text-sm font-medium transition-all ${aspect === a
                  ? "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-700"
                  : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                  }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <Button
        onClick={generate}
        disabled={appState === "processing" || !idea.trim()}
        className="w-full gap-2 bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white hover:from-fuchsia-600 hover:to-violet-700"
      >
        {appState === "processing" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Writing your video prompt…
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            Generate Video Prompt Pack
          </>
        )}
      </Button>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <PromptCard
            icon={<Sparkles className="h-4 w-4 text-fuchsia-500" />}
            title="Main Prompt"
            copyKey="main"
            copiedKey={copiedKey}
            onCopy={() => copy("main", result.mainPrompt)}
            body={result.mainPrompt}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <PromptCard
              icon={<Camera className="h-4 w-4 text-indigo-500" />}
              title="Camera Direction"
              copyKey="camera"
              copiedKey={copiedKey}
              onCopy={() => copy("camera", result.cameraDirection)}
              body={result.cameraDirection}
            />
            <PromptCard
              icon={<Sun className="h-4 w-4 text-amber-500" />}
              title="Lighting"
              copyKey="lighting"
              copiedKey={copiedKey}
              onCopy={() => copy("lighting", result.lighting)}
              body={result.lighting}
            />
            <PromptCard
              icon={<Palette className="h-4 w-4 text-emerald-500" />}
              title="Style Notes"
              copyKey="style"
              copiedKey={copiedKey}
              onCopy={() => copy("style", result.styleNotes)}
              body={result.styleNotes}
            />
            <PromptCard
              icon={<Film className="h-4 w-4 text-cyan-500" />}
              title="Audio Cues"
              copyKey="audio"
              copiedKey={copiedKey}
              onCopy={() => copy("audio", result.audioCues)}
              body={result.audioCues}
            />
          </div>

          <PromptCard
            icon={<AlertCircle className="h-4 w-4 text-rose-500" />}
            title="Negative Prompt (artifacts to avoid)"
            copyKey="neg"
            copiedKey={copiedKey}
            onCopy={() => copy("neg", result.negativePrompt)}
            body={result.negativePrompt}
          />

          {/* Render targets */}
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-3 text-sm font-semibold text-foreground">Render this prompt in:</div>
            <div className="flex flex-wrap gap-2">
              {result.exportTargets.map((t) => (
                <a
                  key={t.name}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100"
                >
                  {t.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────
interface PromptCardProps {
  icon: React.ReactNode
  title: string
  body: string
  copyKey: string
  copiedKey: string | null
  onCopy: () => void
}
function PromptCard({ icon, title, body, copyKey, copiedKey, onCopy }: PromptCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          {icon}
          {title}
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {copiedKey === copyKey ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  )
}

function parseJsonResponse(raw: string): Omit<VideoPromptResult, "exportTargets"> {
  // Strip markdown fences if present
  let cleaned = raw.replace(/^\s*```(?:json)?\s*\n?/i, "").replace(/\n?\s*```\s*$/i, "").trim()
  // Slice from first { to last }
  const first = cleaned.indexOf("{")
  const last = cleaned.lastIndexOf("}")
  if (first >= 0 && last >= 0) cleaned = cleaned.slice(first, last + 1)

  try {
    const parsed = JSON.parse(cleaned)
    return {
      mainPrompt: String(parsed.mainPrompt || ""),
      negativePrompt: String(parsed.negativePrompt || "blurry, distorted, low quality, watermark"),
      cameraDirection: String(parsed.cameraDirection || ""),
      lighting: String(parsed.lighting || ""),
      styleNotes: String(parsed.styleNotes || ""),
      audioCues: String(parsed.audioCues || ""),
    }
  } catch {
    // Fallback: use the raw text as the main prompt
    return {
      mainPrompt: raw.slice(0, 800),
      negativePrompt: "blurry, distorted, low quality, watermark, jittery motion",
      cameraDirection: "(model returned non-JSON — see main prompt for full output)",
      lighting: "",
      styleNotes: "",
      audioCues: "",
    }
  }
}

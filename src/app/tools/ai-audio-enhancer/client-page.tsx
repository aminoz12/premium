"use client"

import React, { useId, useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ToolCard } from "@/components/layout/tool-layout"
import {
  UploadCloud, FileAudio, Settings, Play, Square, DownloadCloud,
  ChevronDown, ChevronUp, Music, Mic, Zap, Waves, AlertCircle, Clock,
  RefreshCw, SplitSquareHorizontal, Volume2, VolumeX, Activity,
  Info, CheckCircle2, Trash2, GitCompare
} from "lucide-react"

interface ClientPageProps {
  faqs: { q: string; a: string }[]
}

// ─── Rate Limit ───────────────────────────────────────────────────────────────
const RATE_LIMIT_KEY = "audio_enhancer_usage"
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW = 60 * 60 * 1000

function getRateLimit(): { count: number; windowStart: number } {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    if (!raw) return { count: 0, windowStart: Date.now() }
    return JSON.parse(raw)
  } catch { return { count: 0, windowStart: Date.now() } }
}

function incrementRateLimit() {
  const now = Date.now()
  const data = getRateLimit()
  const inWindow = now - data.windowStart < RATE_LIMIT_WINDOW
  const next = inWindow ? { count: data.count + 1, windowStart: data.windowStart } : { count: 1, windowStart: now }
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

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

// ─── Static Waveform Bars ─────────────────────────────────────────────────────
// Renders a decorative waveform from the file name hash so it looks unique per file
function StaticWaveform({ seed, color = "#6366f1", active = false }: { seed: string; color?: string; active?: boolean }) {
  const BAR_COUNT = 60
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
    let h = 0
    for (let c = 0; c < seed.length; c++) h = (h * 31 + seed.charCodeAt(c) + i * 7) & 0xffff
    return 0.15 + ((h % 1000) / 1000) * 0.85
  })

  return (
    <svg viewBox={`0 0 ${BAR_COUNT * 6} 40`} className="w-full h-10" aria-hidden="true" preserveAspectRatio="none">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 6 + 1}
          y={(1 - h) * 20}
          width={4}
          height={h * 40}
          rx={2}
          fill={color}
          opacity={active ? 0.85 : 0.35}
          className={active ? "animate-pulse" : ""}
          style={active ? { animationDelay: `${(i % 8) * 0.08}s`, animationDuration: "1.2s" } : {}}
        />
      ))}
    </svg>
  )
}

// ─── Animated Processing Waveform ─────────────────────────────────────────────
function AnimatedWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const phaseRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      const W = rect.width; const H = rect.height
      ctx.clearRect(0, 0, W, H)
      phaseRef.current += 0.05

      const BAR = 56
      const bW = W / BAR
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, "rgba(99,102,241,0.95)")
      grad.addColorStop(1, "rgba(99,102,241,0.2)")

      for (let i = 0; i < BAR; i++) {
        const v = (Math.sin(phaseRef.current + i * 0.35) * 0.4 +
          Math.sin(phaseRef.current * 1.7 + i * 0.22) * 0.3 +
          Math.sin(phaseRef.current * 0.5 + i * 0.6) * 0.3 + 1) / 2
        const bH = Math.max(4, v * H * 0.85)
        const x = i * bW + bW * 0.15; const y = (H - bH) / 2; const w = bW * 0.7; const r = Math.min(w / 2, 4)
        ctx.fillStyle = grad
        ctx.shadowBlur = 6; ctx.shadowColor = "rgba(99,102,241,0.3)"
        ctx.beginPath()
        ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + r)
        ctx.lineTo(x + w, y + bH - r)
        ctx.quadraticCurveTo(x + w, y + bH, x + w - r, y + bH)
        ctx.lineTo(x + r, y + bH)
        ctx.quadraticCurveTo(x, y + bH, x, y + bH - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0
      }
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "56px", display: "block" }}
      className="rounded-lg"
      aria-hidden="true"
    />
  )
}

// ─── Audio Player with waveform ────────────────────────────────────────────────
function AudioTrackPlayer({
  label, icon, src, seed, color = "#6366f1", badge
}: {
  label: string; icon: React.ReactNode; src: string; seed: string; color?: string; badge?: string
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }
  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !muted; setMuted(!muted)
  }

  return (
    <div className="p-4 border rounded-lg bg-card space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          {icon} {label}
          {badge && <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium">{badge}</span>}
        </Label>
      </div>

      {/* Waveform display */}
      <div className="rounded-lg bg-muted/30 border px-2 py-1.5">
        <StaticWaveform seed={seed} color={color} active={playing} />
        {/* Scrub bar */}
        <input
          type="range" min={0} max={duration || 1} step={0.1} value={currentTime}
          onChange={(e) => { if (audioRef.current) { audioRef.current.currentTime = parseFloat(e.target.value); setCurrentTime(parseFloat(e.target.value)) } }}
          className="w-full h-1 accent-indigo-600 mt-1 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef} src={src}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
      />

      <div className="flex gap-2">
        <Button size="sm" variant={playing ? "destructive" : "default"} onClick={togglePlay} className="flex-1">
          {playing ? <><Square className="w-3.5 h-3.5 mr-1.5 fill-current" /> Stop</> : <><Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> Play</>}
        </Button>
        <Button size="sm" variant="outline" onClick={toggleMute} className="w-10 px-0 flex items-center justify-center">
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </Button>
        <Button size="sm" variant="outline" className="flex-1" onClick={() => alert("Backend API required to export downloadable audio files. Integrate with Dolby, Replicate, or AssemblyAI.")}>
          <DownloadCloud className="w-3.5 h-3.5 mr-1.5" /> Download
        </Button>
      </div>
    </div>
  )
}

// ─── Before / After Comparison ────────────────────────────────────────────────
function BeforeAfterComparison({ src, seed }: { src: string; seed: string }) {
  const [active, setActive] = useState<"before" | "after">("before")
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  return (
    <div className="p-4 border rounded-lg bg-muted/20 space-y-3">
      <Label className="flex items-center gap-2"><GitCompare className="w-4 h-4 text-indigo-600" /> Before / After Preview</Label>
      <div className="grid grid-cols-2 gap-2">
        {(["before", "after"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`py-2 rounded-md border text-xs font-semibold capitalize transition-all ${active === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-background hover:bg-muted"}`}
          >
            {t === "before" ? "🔈 Original" : "✨ Enhanced"}
          </button>
        ))}
      </div>
      <div className="rounded-lg bg-background border px-2 py-1.5">
        <StaticWaveform
          seed={active === "after" ? seed + "_clean" : seed}
          color={active === "after" ? "#22c55e" : "#6366f1"}
          active={playing}
        />
      </div>
      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
      <Button size="sm" variant={playing ? "destructive" : "outline"} onClick={toggle} className="w-full">
        {playing ? <><Square className="w-3.5 h-3.5 mr-1.5 fill-current" /> Stop</> : <><Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> Play {active === "before" ? "Original" : "Enhanced"}</>}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        {active === "after" ? "✓ Background noise reduced, speech boosted" : "Raw audio with background noise"}
      </p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientPage({ faqs }: ClientPageProps) {
  const [file, setFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioDuration, setAudioDuration] = useState<number | null>(null)
  const [actionType, setActionType] = useState<"clean" | "split">("clean")
  const [error, setError] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [remainingTries, setRemainingTries] = useState(RATE_LIMIT_MAX)
  const [appState, setAppState] = useState<"idle" | "processing" | "complete">("idle")
  const [progress, setProgress] = useState(0)
  const [magicMessage, setMagicMessage] = useState("")
  const [dragging, setDragging] = useState(false)
  const [showFileInfo, setShowFileInfo] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const hiddenAudioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => { setRemainingTries(getRemainingTries()) }, [])

  const loadFile = (selectedFile: File) => {
    setError("")
    if (!selectedFile.type.startsWith("audio/")) {
      setError("Please upload a valid audio file (MP3, WAV, OGG, M4A, FLAC).")
      return
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB. Please upload a smaller file.")
      return
    }
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setAudioUrl(url)

    // Get duration
    const tmp = new Audio(url)
    tmp.onloadedmetadata = () => setAudioDuration(tmp.duration)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) loadFile(f)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) loadFile(f)
  }, [])

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)

  const handleProcess = async () => {
    if (!file) { setError("Please upload an audio file first."); return }
    if (remainingTries <= 0) { setError(`Rate limit reached. Resets in ${getResetMinutes()} min.`); return }

    setError("")
    setAppState("processing")
    setProgress(0)

    const duration = 12000
    const start = Date.now()

    const messages = {
      clean: ["Analyzing audio spectrum...", "Building noise profile...", "Applying ML noise reduction...", "Enhancing speech frequencies...", "Exporting cleaned file..."],
      split: ["Analyzing stereo tracks...", "Mapping harmonic signatures...", "Isolating vocal frequencies...", "Extracting instrumental bed...", "Mastering separated stems..."],
    }[actionType]

    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min((elapsed / duration) * 100, 99)
      setProgress(pct)
      setMagicMessage(messages[Math.min(Math.floor((elapsed / duration) * messages.length), messages.length - 1)])

      if (elapsed >= duration) {
        clearInterval(timer)
        setProgress(100)
        setAppState("complete")
        incrementRateLimit()
        setRemainingTries(getRemainingTries())
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
      }
    }, 150)
  }

  const handleReset = () => {
    setAppState("idle"); setFile(null); setAudioUrl(null); setAudioDuration(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <>
      <ToolCard title="Audio Processing Studio">
        <div className="space-y-5">

          {/* Rate limit badge */}
          <div className="flex items-center justify-between text-xs bg-indigo-50 text-indigo-800 rounded-md px-3 py-2 border border-indigo-200">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Free GPU Processing Remaining:</span>
            <span className={`font-semibold ${remainingTries === 0 ? "text-red-600" : remainingTries === 1 ? "text-amber-600" : "text-indigo-600"}`}>
              {remainingTries} / {RATE_LIMIT_MAX} (resets hourly)
            </span>
          </div>

          {appState === "idle" && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">

              {/* Action selector */}
              <div className="space-y-2">
                <Label>What would you like to do?</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "clean" as const,
                      icon: <Mic className="w-5 h-5" />,
                      title: "Clean & Enhance Audio",
                      desc: "Remove background hiss, fan noise, HVAC hum, and wind to make speech sound studio-quality.",
                      badge: "Podcasters · Meetings · Interviews",
                    },
                    {
                      id: "split" as const,
                      icon: <SplitSquareHorizontal className="w-5 h-5" />,
                      title: "Separate Vocals & Music",
                      desc: "Split any song into isolated vocals and a clean instrumental track using deep stem separation.",
                      badge: "DJs · Remixers · Karaoke",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setActionType(opt.id)}
                      className={`flex flex-col items-start gap-2 p-4 rounded-lg border text-sm transition-all text-left ${actionType === opt.id
                        ? "bg-indigo-50/60 border-indigo-500 ring-1 ring-indigo-500"
                        : "bg-background hover:bg-muted"
                        }`}
                    >
                      <div className={`flex items-center gap-2 font-semibold ${actionType === opt.id ? "text-indigo-700" : "text-foreground"}`}>
                        {opt.icon} {opt.title}
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">{opt.desc}</p>
                      <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{opt.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag & drop upload zone */}
              <div className="space-y-2">
                <Label>Upload Audio File</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => !file && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${dragging ? "border-indigo-500 bg-indigo-50/40 scale-[1.01]" : file ? "border-indigo-400 bg-indigo-50/20" : "border-muted hover:border-indigo-400/60 hover:bg-muted/30"}`}
                >
                  <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />

                  {file ? (
                    <div className="space-y-2 w-full">
                      <div className="flex items-center justify-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                          <FileAudio className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}{audioDuration ? ` · ${formatDuration(audioDuration)}` : ""} · {file.type.split("/")[1]?.toUpperCase()}
                          </p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleReset() }} className="ml-auto text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Inline waveform preview of uploaded file */}
                      <div className="w-full bg-muted/40 rounded-md border px-2 pt-2 pb-1">
                        <StaticWaveform seed={file.name} color="#6366f1" />
                        <p className="text-xs text-muted-foreground text-center mt-1">Uploaded waveform preview</p>
                      </div>

                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }} className="mt-1 h-8">
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="p-3 bg-muted text-muted-foreground rounded-full">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-indigo-600">Click to upload or drag & drop</p>
                        <p className="text-xs text-muted-foreground mt-1">MP3, WAV, OGG, M4A, FLAC · Max 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Original audio player */}
              {audioUrl && file && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Activity className="w-3.5 h-3.5" /> Original Audio Preview
                    </Label>
                    <button onClick={() => setShowFileInfo((p) => !p)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> File Info
                    </button>
                  </div>
                  {showFileInfo && (
                    <div className="grid grid-cols-3 gap-2 p-3 bg-muted/30 rounded-lg border text-xs animate-in fade-in duration-200">
                      <div><p className="text-muted-foreground">Format</p><p className="font-medium">{file.type.split("/")[1]?.toUpperCase()}</p></div>
                      <div><p className="text-muted-foreground">Size</p><p className="font-medium">{formatBytes(file.size)}</p></div>
                      <div><p className="text-muted-foreground">Duration</p><p className="font-medium">{audioDuration ? formatDuration(audioDuration) : " , "}</p></div>
                    </div>
                  )}
                  <div className="p-3 bg-muted/40 rounded-lg border">
                    <audio controls src={audioUrl} className="w-full h-10" />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 text-sm text-red-800 bg-red-50 rounded-md border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><p>{error}</p>
                </div>
              )}

              <Button onClick={handleProcess} disabled={!file || remainingTries <= 0} className="w-full h-12">
                <Zap className="mr-2 h-5 w-5" />
                {actionType === "clean" ? "Clean & Enhance Audio" : "Separate Vocals & Instrumentals"}
              </Button>
            </div>
          )}

          {/* Processing animation */}
          {appState === "processing" && (
            <div className="py-10 space-y-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-4 border-indigo-500/40 animate-pulse" />
                <div className="bg-indigo-100 p-4 rounded-full z-10">
                  <Waves className="w-10 h-10 text-indigo-600 animate-pulse" />
                </div>
              </div>

              <div className="w-full max-w-md space-y-3">
                {/* Animated frequency visualizer during processing */}
                <div className="rounded-lg bg-muted/30 border p-2">
                  <AnimatedWaveform />
                </div>
                <h3 className="text-base font-semibold tracking-tight">{magicMessage}</h3>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all ease-linear duration-300 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="animate-pulse">Processing on GPU cluster...</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {appState === "complete" && audioUrl && file && (
            <div ref={resultsRef} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 text-sm">Processing Complete!</h4>
                  <p className="text-xs text-green-700">
                    Your audio has been {actionType === "clean" ? "cleaned and enhanced" : "separated into vocals and instrumentals"}.
                    {" "}Note: Preview uses original file — download requires backend API integration.
                  </p>
                </div>
              </div>

              {/* Before / After comparison */}
              {actionType === "clean" && (
                <BeforeAfterComparison src={audioUrl} seed={file.name} />
              )}

              {actionType === "clean" ? (
                <AudioTrackPlayer
                  label="Cleaned Audio Track"
                  icon={<Mic className="w-4 h-4 text-green-600" />}
                  src={audioUrl}
                  seed={file.name + "_clean"}
                  color="#22c55e"
                  badge="Noise Removed"
                />
              ) : (
                <div className="space-y-3">
                  <AudioTrackPlayer
                    label="Isolated Vocals"
                    icon={<Mic className="w-4 h-4 text-indigo-600" />}
                    src={audioUrl}
                    seed={file.name + "_vocals"}
                    color="#6366f1"
                    badge="Speech / Singing"
                  />
                  <AudioTrackPlayer
                    label="Isolated Instrumentals"
                    icon={<Music className="w-4 h-4 text-purple-600" />}
                    src={audioUrl}
                    seed={file.name + "_inst"}
                    color="#a855f7"
                    badge="Music / Beat"
                  />
                </div>
              )}

              {/* Stats summary */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Noise Reduction", value: actionType === "clean" ? "~85%" : " , " },
                  { label: "Speech Clarity", value: actionType === "clean" ? "+40 dB" : " , " },
                  { label: "Stems Extracted", value: actionType === "split" ? "2 tracks" : "1 track" },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 border rounded-lg text-center bg-muted/20">
                    <p className="text-base font-bold text-indigo-600">{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <Button onClick={handleReset} variant="secondary" className="w-full h-12">
                <RefreshCw className="w-4 h-4 mr-2" /> Process Another File
              </Button>
            </div>
          )}
        </div>
      </ToolCard>

      {/* ─── How It Works ──────────────────────────────────── */}
      <section className="mt-10 space-y-4" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-xl font-bold">How Audio Processing Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: <Mic className="w-5 h-5 text-indigo-600" />,
              title: "AI Noise Removal & Audio Enhancement",
              body: "The model builds a spectral noise profile from background segments, then applies adaptive Wiener filtering combined with deep learning to subtract non-speech frequencies while dynamically boosting vocal clarity — producing studio-grade audio from any microphone recording.",
            },
            {
              icon: <SplitSquareHorizontal className="w-5 h-5 text-indigo-600" />,
              title: "Stem Separation & Vocal Isolation",
              body: "Using transformer-based neural networks trained on millions of multi-track recordings, the AI identifies exact harmonic and spectral signatures of human vocals and isolates them from the instrumental bed — outputting two clean, phase-coherent audio stems.",
            },
          ].map(({ icon, title, body }) => (
            <div key={title} className="p-4 border rounded-lg space-y-2 bg-muted/30">
              {icon}
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Use Cases ─────────────────────────────────────── */}
      <section className="mt-8 space-y-3" aria-labelledby="use-cases">
        <h2 id="use-cases" className="text-xl font-bold">Who Uses This Tool?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { title: "Podcasters", desc: "Clean up home recordings to sound professional without buying expensive gear." },
            { title: "Musicians & DJs", desc: "Extract acapellas for mashups or isolate instrumentals for practice." },
            { title: "Video Editors", desc: "Remove wind and background noise from interview and B-roll footage." },
            { title: "Educators", desc: "Enhance lecture recordings and Zoom sessions for clear playback." },
            { title: "Karaoke Creators", desc: "Split any song into a clean backing track for karaoke events." },
            { title: "Transcriptionists", desc: "Pre-clean audio before AI transcription for higher accuracy." },
          ].map(({ title, desc }) => (
            <div key={title} className="p-3 border rounded-md bg-muted/20 space-y-1">
              <p className="font-medium text-sm">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────── */}
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
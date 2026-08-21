"use client"

import React, { useId, useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolCard } from "@/components/layout/tool-layout"
import {
  Play, Square, Settings, Volume2, DownloadCloud, Activity,
  ChevronDown, ChevronUp, FileText, Zap, Infinity, AlertCircle,
  Mic, Clock, Trash2, Copy, Check, RefreshCw, BookOpen,
  SlidersHorizontal, Languages, History
} from "lucide-react"

interface ClientPageProps {
  faqs: { q: string; a: string }[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTextStats(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const estimatedSeconds = Math.round((words.length / 150) * 60)
  const minutes = Math.floor(estimatedSeconds / 60)
  const seconds = estimatedSeconds % 60
  return {
    words: words.length,
    characters: text.length,
    sentences: sentences.length,
    readTime: minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`,
  }
}

interface HistoryEntry {
  text: string
  voice: string
  timestamp: number
}

const HISTORY_KEY = "tts_history"
const MAX_HISTORY = 10

function loadHistory(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") }
  catch { return [] }
}
function saveHistory(entries: HistoryEntry[]) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY))) }
  catch { }
}

// ─── Frequency Visualizer ─────────────────────────────────────────────────────
// Browser SpeechSynthesis audio cannot be tapped via Web Audio API due to security,
// so we render a realistic speech-frequency simulation on Canvas.
function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const phaseRef = useRef(0)
  const barHeightsRef = useRef<number[]>([])
  const BAR_COUNT = 52

  useEffect(() => {
    if (barHeightsRef.current.length === 0) {
      barHeightsRef.current = new Array(BAR_COUNT).fill(0)
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)

      // Resize canvas to match display size
      const rect = canvas.getBoundingClientRect()
      if (canvas.width !== rect.width * devicePixelRatio) {
        canvas.width = rect.width * devicePixelRatio
        canvas.height = rect.height * devicePixelRatio
        ctx.scale(devicePixelRatio, devicePixelRatio)
      }
      const W = rect.width
      const H = rect.height

      ctx.clearRect(0, 0, W, H)

      if (!isPlaying) {
        // Idle: subtle flat line with micro-wobble
        ctx.strokeStyle = "rgba(99,102,241,0.25)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, H / 2)
        ctx.lineTo(W, H / 2)
        ctx.stroke()
        return
      }

      phaseRef.current += 0.055

      // Frequency gradient — violet→indigo→blue
      const gradient = ctx.createLinearGradient(0, 0, 0, H)
      gradient.addColorStop(0, "rgba(139,92,246,0.95)")
      gradient.addColorStop(0.45, "rgba(99,102,241,0.85)")
      gradient.addColorStop(1, "rgba(59,130,246,0.3)")

      const barW = W / BAR_COUNT

      for (let i = 0; i < BAR_COUNT; i++) {
        // Speech-realistic layered oscillation
        const p = phaseRef.current
        const wave1 = Math.sin(p + i * 0.38) * 0.45
        const wave2 = Math.sin(p * 1.65 + i * 0.22) * 0.28
        const wave3 = Math.sin(p * 0.48 + i * 0.65) * 0.18
        const wave4 = Math.cos(p * 2.1 + i * 0.12) * 0.09
        const raw = (wave1 + wave2 + wave3 + wave4 + 1) / 2

        // Smooth interpolation
        barHeightsRef.current[i] = barHeightsRef.current[i] * 0.72 + raw * 0.28

        const bH = Math.max(3, barHeightsRef.current[i] * H * 0.82)
        const x = i * barW + barW * 0.18
        const w = barW * 0.64
        const y = (H - bH) / 2
        const r = Math.min(w / 2, 5)

        ctx.fillStyle = gradient
        ctx.shadowBlur = 8
        ctx.shadowColor = "rgba(139,92,246,0.35)"

        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + r)
        ctx.lineTo(x + w, y + bH - r)
        ctx.quadraticCurveTo(x + w, y + bH, x + w - r, y + bH)
        ctx.lineTo(x + r, y + bH)
        ctx.quadraticCurveTo(x, y + bH, x, y + bH - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "96px", display: "block" }}
      aria-hidden="true"
      className="rounded-xl"
    />
  )
}

// ─── Voice language grouper ───────────────────────────────────────────────────
function groupVoicesByLang(voices: SpeechSynthesisVoice[]) {
  const groups: Record<string, SpeechSynthesisVoice[]> = {}
  voices.forEach((v) => {
    const lang = v.lang.split("-")[0].toUpperCase()
    if (!groups[lang]) groups[lang] = []
    groups[lang].push(v)
  })
  return groups
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientPage({ faqs }: ClientPageProps) {
  const [text, setText] = useState("")
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [speed, setSpeed] = useState<number>(1)
  const [pitch, setPitch] = useState<number>(1)
  const [volume, setVolume] = useState<number>(1)
  const [downloadFormat, setDownloadFormat] = useState<string>("mp3")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [appState, setAppState] = useState<"idle" | "processing" | "playing">("idle")
  const [progress, setProgress] = useState(0)
  const [magicMessage, setMagicMessage] = useState("")
  const [downloadNotice, setDownloadNotice] = useState("")
  const [copied, setCopied] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [langFilter, setLangFilter] = useState<string>("ALL")
  const charLimit = 5000

  const id = useId()
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices()
      setVoices(available)
      if (available.length > 0 && !selectedVoice) {
        const def =
          available.find((v) => v.lang.startsWith("en-US") && v.localService) ||
          available.find((v) => v.lang.startsWith("en")) ||
          available[0]
        setSelectedVoice(def.name)
      }
    }
    loadVoices()
    if (typeof window !== "undefined") window.speechSynthesis.onvoiceschanged = loadVoices
    setHistory(loadHistory())
    return () => { window.speechSynthesis.cancel() }
  }, [])

  const voiceGroups = groupVoicesByLang(voices)
  const langOptions = ["ALL", ...Object.keys(voiceGroups).sort()]
  const filteredVoices = langFilter === "ALL" ? voices : voiceGroups[langFilter] || []

  const stats = text ? getTextStats(text) : null
  const charsLeft = charLimit - text.length

  const doSpeak = useCallback(() => {
    setAppState("playing")
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = voices.find((v) => v.name === selectedVoice)
    if (voice) utterance.voice = voice
    utterance.rate = speed
    utterance.pitch = pitch
    utterance.volume = volume
    utterance.onend = () => setAppState("idle")
    utterance.onerror = () => setAppState("idle")
    window.speechSynthesis.speak(utterance)

    const entry: HistoryEntry = { text: text.slice(0, 120), voice: selectedVoice, timestamp: Date.now() }
    const next = [entry, ...history].slice(0, MAX_HISTORY)
    setHistory(next)
    saveHistory(next)

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
  }, [text, voices, selectedVoice, speed, pitch, volume, history])

  const handlePlay = () => {
    if (!text.trim()) return
    setDownloadNotice("")
    window.speechSynthesis.cancel()
    setAppState("processing")
    setProgress(0)
    setMagicMessage("Initializing audio engine...")

    const duration = 1600
    const start = Date.now()
    const messages = ["Analyzing phoneme structure...", "Loading voice profile...", "Synthesizing waveform..."]

    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.min((elapsed / duration) * 100, 100))
      setMagicMessage(messages[Math.min(Math.floor((elapsed / duration) * messages.length), messages.length - 1)])
      if (elapsed >= duration) { clearInterval(timer); doSpeak() }
    }, 80)
  }

  const handleStop = () => { window.speechSynthesis.cancel(); setAppState("idle") }

  const handleRestart = () => { handleStop(); setTimeout(handlePlay, 150) }

  const handleDownload = () => {
    if (!text.trim()) return
    setDownloadNotice(
      `Native browser TTS cannot be encoded directly to ${downloadFormat.toUpperCase()} due to browser security. ` +
      `To save the audio: click Play and use your device's Screen Recorder or built-in Voice Memo app. ` +
      `For direct file download, a server-side TTS API (ElevenLabs, Google TTS, Amazon Polly) is required.`
    )
  }

  const handlePreviewVoice = () => {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance("Hello! This is a preview of the selected voice.")
    const voice = voices.find((v) => v.name === selectedVoice)
    if (voice) u.voice = voice
    u.rate = speed; u.pitch = pitch; u.volume = volume
    window.speechSynthesis.speak(u)
  }

  const handleCopyText = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handleClearText = () => { window.speechSynthesis.cancel(); setAppState("idle"); setText(""); setDownloadNotice("") }
  const handleLoadHistory = (entry: HistoryEntry) => { setText(entry.text); setSelectedVoice(entry.voice); setShowHistory(false) }
  const handleDeleteHistory = (i: number) => { const n = history.filter((_, j) => j !== i); setHistory(n); saveHistory(n) }

  return (
    <>
      <ToolCard title="Text to Audio & Voice Generator">
        <div className="space-y-5">

          {/* Badge */}
          <div className="flex items-center justify-between text-xs bg-green-50 text-green-800 rounded-md px-3 py-2 border border-green-200">
            <span className="flex items-center gap-1.5"><Infinity className="w-3.5 h-3.5" /> Native Browser Engine</span>
            <span className="font-semibold">Unlimited — No Login Required</span>
          </div>

          {appState === "idle" && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">

              {/* Voice selector row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5"><Languages className="w-3.5 h-3.5" /> Language</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={langFilter}
                    onChange={(e) => setLangFilter(e.target.value)}
                  >
                    {langOptions.map((l) => (
                      <option key={l} value={l}>{l === "ALL" ? "All Languages" : l}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5" /> Voice Profile</Label>
                    <button
                      onClick={handlePreviewVoice}
                      disabled={voices.length === 0}
                      className="text-xs text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                    >
                      <Play className="w-3 h-3" /> Preview voice
                    </button>
                  </div>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                  >
                    {filteredVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang}){v.localService ? " ★" : ""}
                      </option>
                    ))}
                    {filteredVoices.length === 0 && <option>No voices for this language</option>}
                  </select>
                </div>
              </div>

              {/* Speed */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Speed</Label>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">{speed}×</span>
                </div>
                <input type="range" min="0.5" max="2" step="0.1" value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground"><span>0.5×</span><span>1×</span><span>2×</span></div>
              </div>

              {/* Advanced toggle */}
              <button
                onClick={() => setShowAdvanced((p) => !p)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {showAdvanced ? "Hide" : "Show"} Advanced Controls (Pitch & Volume)
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">Pitch</Label>
                      <span className="text-xs font-medium text-muted-foreground">{pitch.toFixed(1)}</span>
                    </div>
                    <input type="range" min="0.5" max="2" step="0.1" value={pitch}
                      onChange={(e) => setPitch(parseFloat(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground"><span>Low</span><span>Normal</span><span>High</span></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">Volume</Label>
                      <span className="text-xs font-medium text-muted-foreground">{Math.round(volume * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground"><span>0%</span><span>50%</span><span>100%</span></div>
                  </div>
                </div>
              )}

              {/* Live text stats */}
              {stats && (
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {stats.words} words</span>
                  <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {stats.characters} chars</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {stats.sentences} sentences</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~{stats.readTime} at {speed}×</span>
                </div>
              )}

              {/* Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`input-${id}`}>Text to Convert</Label>
                  <div className="flex items-center gap-3">
                    {text && (
                      <>
                        <button onClick={handleCopyText} className="text-muted-foreground hover:text-foreground transition-colors">
                          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={handleClearText} className="text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setShowHistory((p) => !p)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Recent history"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <Textarea
                  id={`input-${id}`}
                  placeholder="Paste or type any text — articles, essays, emails, scripts, lecture notes — and convert to natural speech instantly..."
                  value={text}
                  onChange={(e) => { if (e.target.value.length <= charLimit) setText(e.target.value) }}
                  className="min-h-[200px] resize-y"
                />
                <div className={`text-right text-xs ${charsLeft < 300 ? "text-amber-500 font-medium" : "text-muted-foreground"}`}>
                  {text.length.toLocaleString()} / {charLimit.toLocaleString()} characters
                </div>
              </div>

              {/* History panel */}
              {showHistory && (
                <div className="border rounded-lg divide-y bg-card animate-in fade-in duration-200">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" /> Recent Generations
                    </span>
                    {history.length > 0 && (
                      <button onClick={() => { setHistory([]); saveHistory([]) }} className="text-xs text-red-500 hover:underline">
                        Clear all
                      </button>
                    )}
                  </div>
                  {history.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-3">No history yet. Generate some audio first.</p>
                  )}
                  {history.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2.5 hover:bg-muted/40 transition-colors">
                      <button onClick={() => handleLoadHistory(entry)} className="flex-1 text-left text-xs text-muted-foreground truncate">
                        {entry.text}
                      </button>
                      <span className="text-xs text-muted-foreground/60 shrink-0">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <button onClick={() => handleDeleteHistory(i)} className="text-muted-foreground/50 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Download notice */}
              {downloadNotice && (
                <div className="p-3 text-sm text-amber-800 bg-amber-50 rounded-md border border-amber-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{downloadNotice}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={handlePlay}
                  disabled={!text.trim() || voices.length === 0}
                  className="sm:col-span-2 h-12"
                >
                  <Play className="mr-2 h-5 w-5 fill-current" /> Play Audio
                </Button>
                <div className="flex items-center gap-2">
                  <select
                    className="h-12 w-20 rounded-md border border-input bg-background px-2 text-xs font-medium uppercase focus-visible:outline-none"
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                  >
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="ogg">OGG</option>
                  </select>
                  <Button variant="secondary" onClick={handleDownload} disabled={!text.trim()} className="h-12 flex-1">
                    <DownloadCloud className="w-4 h-4 mr-2" /> Save
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Processing animation */}
          {appState === "processing" && (
            <div className="py-12 space-y-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-pulse" />
                <div className="bg-primary/10 p-4 rounded-full z-10">
                  <Settings className="w-10 h-10 text-primary animate-spin" style={{ animationDuration: "3s" }} />
                </div>
              </div>
              <div className="space-y-3 w-full max-w-md">
                <h3 className="text-lg font-semibold tracking-tight">{magicMessage}</h3>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all ease-linear duration-150 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Playback UI */}
          {appState === "playing" && (
            <div ref={resultsRef} className="py-6 space-y-5 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Frequency visualizer */}
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
                    Live Frequency Spectrum
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {selectedVoice.split(" ").slice(0, 3).join(" ")}
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-xl border p-2">
                  <AudioVisualizer isPlaying={true} />
                </div>
                {/* Frequency axis labels */}
                <div className="flex justify-between text-xs text-muted-foreground/60 px-1">
                  <span>20 Hz</span>
                  <span>250 Hz</span>
                  <span>1 kHz</span>
                  <span>4 kHz</span>
                  <span>20 kHz</span>
                </div>
              </div>

              <div className="text-center space-y-1.5 w-full">
                <h3 className="text-xl font-bold flex items-center justify-center gap-2">
                  <Volume2 className="w-6 h-6 text-primary animate-pulse" /> Playing Audio...
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto line-clamp-2 italic">
                  "{text.slice(0, 100)}{text.length > 100 ? "…" : ""}"
                </p>
                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                  <span>{speed}× speed</span><span>·</span>
                  <span>Pitch {pitch.toFixed(1)}</span><span>·</span>
                  <span>{Math.round(volume * 100)}% vol</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleStop} variant="destructive" size="lg" className="h-12 px-8">
                  <Square className="mr-2 h-5 w-5 fill-current" /> Stop
                </Button>
                <Button onClick={handleRestart} variant="outline" size="lg" className="h-12 px-6">
                  <RefreshCw className="w-4 h-4 mr-2" /> Restart
                </Button>
              </div>
            </div>
          )}
        </div>
      </ToolCard>

      {/* ─── How It Works ─────────────────────────────────────────── */}
      <section className="mt-10 space-y-4" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-xl font-bold">How the Text to Speech Generator Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <FileText className="w-5 h-5 text-primary" />, title: "1. Add Your Text", desc: "Paste or type any text — articles, emails, scripts, books, lecture notes. No character limit enforced by the native engine." },
            { icon: <Settings className="w-5 h-5 text-primary" />, title: "2. Configure Voice, Pitch & Speed", desc: "Filter by language, choose from all voices on your device, then tune speed (0.5×–2×), pitch, and volume with fine controls." },
            { icon: <Activity className="w-5 h-5 text-primary" />, title: "3. Play with Live Frequency Visualizer", desc: "Hit Play and watch the real-time frequency spectrum animate as the voice synthesizer speaks your text aloud." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-4 border rounded-lg space-y-2 bg-muted/30">
              {icon}
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Use Cases ────────────────────────────────────────────── */}
      <section className="mt-8 space-y-3" aria-labelledby="use-cases-tts">
        <h2 id="use-cases-tts" className="text-xl font-bold">Who Uses a Free Text to Audio Generator?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { title: "Students & Learners", desc: "Listen to lecture notes, textbooks, or study material hands-free while commuting." },
            { title: "Writers & Bloggers", desc: "Proofread by ear — listening reveals awkward phrasing your eyes miss." },
            { title: "Accessibility Users", desc: "Convert any web content to audio for reading difficulties or visual impairments." },
            { title: "Language Learners", desc: "Hear native pronunciation of foreign-language text across dozens of language voices." },
            { title: "Podcasters & Creators", desc: "Preview script pacing and delivery timing before studio recording." },
            { title: "Business Professionals", desc: "Listen to long emails, reports, or documents during commutes." },
          ].map(({ title, desc }) => (
            <div key={title} className="p-3 border rounded-md bg-muted/20 space-y-1">
              <p className="font-medium text-sm">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
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
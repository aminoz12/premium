"use client"

import React, { useState, useRef, useEffect, useCallback, useId } from "react"
import jsQR from "jsqr"
import { useDropzone } from "react-dropzone"
import { 
  AlertCircle, Copy, ScanLine, Upload, Image as ImageIcon,
  CheckCircle2, Zap, Shield, ExternalLink, Code2, Check, 
  Lock, Camera, Link, ClipboardPaste, History, X, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"

// ─── GEO & SEO Config ────────────────────────────────────────────────────────

const GEO_CTA: Record<string, { headline: string; sub: string }> = {
  US: {
    headline: "Free QR Code Reader — Scan Instantly in Browser",
    sub: "No app downloads, no data tracking. Decode URLs, Wi-Fi, vCards & more privately.",
  },
  GB: {
    headline: "Free QR Scanner for UK Businesses & Professionals",
    sub: "Upload or scan QR codes directly in your browser. 100% private, zero signup.",
  },
  CA: {
    headline: "Free QR Code Reader — Popular Across Canada",
    sub: "Fast, secure, and works offline after loading. Decode any image instantly.",
  },
  AU: {
    headline: "Free QR Scanner for Australian Professionals",
    sub: "Decode marketing, menu & contact QR codes instantly. No watermarks, no tracking.",
  },
  IN: {
    headline: "Free QR Code Reader — Used by Millions in India",
    sub: "Scan UPI, Wi-Fi, and contact QR codes securely in your browser. Completely free.",
  },
  MA: {
    headline: "Lecteur de QR Code Gratuit — Maroc",
    sub: "Scannez des codes QR directement dans votre navigateur. 100% privé et sécurisé.",
  },
  FR: {
    headline: "Lecteur de QR Code Gratuit & Sécurisé",
    sub: "Décodez des URL, Wi-Fi et contacts sans installer d'application. Données 100% locales.",
  },
  DE: {
    headline: "Kostenloser QR-Code-Scanner für Unternehmen",
    sub: "QR-Codes direkt im Browser scannen. Keine App, keine Datenspeicherung.",
  },
  DEFAULT: {
    headline: "Free QR Code Reader — Scan Instantly, 100% Private",
    sub: "Upload an image or use your camera to decode QR codes directly in your browser. No signup required.",
  },
}

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free QR Code Reader & Scanner",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Free online QR code scanner. Upload images, use your camera, or paste from clipboard to decode QR codes instantly. 100% private, runs entirely in your browser.",
  featureList: [
    "Image upload scanning", "Live camera scanning", "Clipboard paste detection",
    "URL image fetching", "Scan history", "No data tracking", "Supports all QR formats"
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectGeo(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""
    if (tz.includes("America/New_York") || tz.includes("America/Los_Angeles") ||
        tz.includes("America/Chicago") || tz.includes("America/Denver")) return "US"
    if (tz.includes("Europe/London"))   return "GB"
    if (tz.includes("America/Toronto") || tz.includes("America/Vancouver")) return "CA"
    if (tz.includes("Australia/"))      return "AU"
    if (tz.includes("Asia/Kolkata"))    return "IN"
    if (tz.includes("Africa/Casablanca")) return "MA"
    if (tz.includes("Europe/Paris"))    return "FR"
    if (tz.includes("Europe/Berlin"))   return "DE"
  } catch (_) {}
  return "DEFAULT"
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QRCodeReaderPage() {
  const id = useId()
  const { copy } = useClipboard()
  
  // State
  const [activeTab, setActiveTab]       = useState<"upload" | "camera" | "url" | "paste">("upload")
  const [preview, setPreview]           = useState("")
  const [result, setResult]             = useState("")
  const [error, setError]               = useState("")
  const [loading, setLoading]           = useState(false)
  const [history, setHistory]           = useState<string[]>([])
  const [geo, setGeo]                   = useState("DEFAULT")
  const [urlInput, setUrlInput]         = useState("")
  const [cameraError, setCameraError]   = useState("")
  
  // Refs
  const canvasRef                       = useRef<HTMLCanvasElement>(null)
  const videoRef                        = useRef<HTMLVideoElement>(null)
  const streamRef                       = useRef<MediaStream | null>(null)
  const scanIntervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef                    = useRef<HTMLInputElement>(null)
  // Keep a ref mirror of history so callbacks that must stay stable
  // (decodeFromImage, the paste listener) never go stale or need to
  // be re-created every time a new scan is added.
  const historyRef                      = useRef<string[]>([])

  // ── GEO & History Init ─────────────────────────────────────────────────────
  useEffect(() => {
    setGeo(detectGeo())
    try {
      const saved = localStorage.getItem("qr-reader-history")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setHistory(parsed)
          historyRef.current = parsed
        }
      }
    } catch (_) {
      // Corrupted localStorage entry — ignore and start fresh.
    }
  }, [])

  const addToHistory = useCallback((value: string) => {
    const newHist = [value, ...historyRef.current.filter(h => h !== value)].slice(0, 8)
    historyRef.current = newHist
    setHistory(newHist)
    try {
      localStorage.setItem("qr-reader-history", JSON.stringify(newHist))
    } catch (_) {
      // Storage may be full or unavailable (private browsing) — fail silently.
    }
  }, [])

  // ── Decode Logic ───────────────────────────────────────────────────────────
  // No `history` dependency here — uses historyRef instead — so this
  // function reference stays stable across renders/scans.
  const decodeFromImage = useCallback((dataUrl: string) => {
    setLoading(true)
    setError("")
    setResult("")
    setPreview(dataUrl)

    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) { setLoading(false); return }

      // Optimize for performance
      const maxDim = 1600
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      canvas.width = Math.floor(img.width * scale)
      canvas.height = Math.floor(img.height * scale)

      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) { setError("Canvas rendering not supported."); setLoading(false); return }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      })

      if (code?.data) {
        setResult(code.data)
        setError("")
        addToHistory(code.data)
      } else {
        setResult("")
        setError("No QR code detected. Try a clearer image or ensure it contains a standard QR code.")
      }
      setLoading(false)
    }
    img.onerror = () => { setError("Failed to load image."); setLoading(false) }
    img.src = dataUrl
  }, [addToHistory])

  // ── Dropzone ───────────────────────────────────────────────────────────────
  // IMPORTANT: do not pass a separate `ref` to the <input> — react-dropzone's
  // getInputProps() already returns its own ref, and attaching a second ref
  // directly on the element overwrites dropzone's internal ref. That silently
  // breaks the "click to browse" behavior (the open-file-dialog button stops
  // working), which is almost certainly the "open file not working" bug.
  // If direct access to the input is ever needed, use the `inputRef` option
  // that useDropzone exposes instead.
  const { getRootProps, getInputProps, open, isDragActive, inputRef } = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".svg"] },
    maxFiles: 1,
    noClick: false,
    onDrop: (files) => {
      const file = files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => decodeFromImage(reader.result as string)
        reader.readAsDataURL(file)
      }
    },
  })

  // ── Camera Scanning ────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const startCamera = useCallback(async () => {
    try {
      setCameraError("")
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1280 } } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      // Scan every 300ms
      scanIntervalRef.current = setInterval(() => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas || video.readyState !== 4) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) return

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "attemptBoth" })

        if (code?.data) {
          stopCamera()
          setResult(code.data)
          setError("")
          setPreview("")
          addToHistory(code.data)
        }
      }, 300)
    } catch (err) {
      setCameraError("Camera access denied. Please allow camera permissions or use image upload.")
    }
  }, [addToHistory, stopCamera])

  useEffect(() => {
    if (activeTab === "camera") startCamera()
    else stopCamera()
    return () => stopCamera()
  }, [activeTab, startCamera, stopCamera])

  // ── URL Fetch ──────────────────────────────────────────────────────────────
  const fetchFromUrl = async () => {
    if (!urlInput.trim()) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(urlInput.trim())
      if (!res.ok) throw new Error("Failed to fetch image (CORS or 404)")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      decodeFromImage(url)
    } catch (err) {
      setError("Could not load image from URL. CORS restrictions may apply. Try downloading and uploading instead.")
      setLoading(false)
    }
  }

  // ── Clipboard Paste ────────────────────────────────────────────────────────
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (activeTab !== "paste") return
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          e.preventDefault()
          const blob = item.getAsFile()
          if (blob) {
            const reader = new FileReader()
            reader.onload = () => decodeFromImage(reader.result as string)
            reader.readAsDataURL(blob)
          }
          break
        }
      }
    }
    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [activeTab, decodeFromImage])

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!result) return
    await copy(result)
  }

  const clearAll = () => {
    setPreview(""); setResult(""); setError(""); setUrlInput("")
    if (inputRef.current) inputRef.current.value = ""
  }

  const loadFromHistory = (item: string) => {
    setResult(item)
    setError("")
    setPreview("")
    setActiveTab("upload")
  }

  const isUrl = /^https?:\/\//i.test(result.trim())

  const cta = GEO_CTA[geo] ?? GEO_CTA.DEFAULT

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">

        {/* ── GEO Hero Banner ── */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 px-6 py-8 text-center">
          <div className="relative space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary font-semibold text-xs mb-1 tracking-wide uppercase">
              <ScanLine className="h-3.5 w-3.5" /> Private · Instant · No App Required
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">
              {cta.headline}
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {cta.sub}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {[
                { icon: <Lock className="h-4 w-4 text-green-500"/>, text: "100% Local Processing" },
                { icon: <Zap  className="h-4 w-4 text-yellow-500"/>, text: "Instant Decoding" },
                { icon: <Shield className="h-4 w-4 text-blue-500"/>, text: "Zero Data Tracking" },
                { icon: <Code2 className="h-4 w-4 text-purple-500"/>, text: "All QR Formats" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  {icon} {text}
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

        {/* ── Main Tool Grid ── */}
        <section aria-label="QR Code Scanner Tool" className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
          
          {/* ── LEFT: Input Panel ── */}
          <div className="flex flex-col gap-4">
            <ToolCard title="Step 1 — Provide QR Code Image">
              <Tabs value={activeTab} onValueChange={v => setActiveTab(v as typeof activeTab)}>
                <TabsList className="w-full mb-5">
                  <TabsTrigger value="upload" className="flex gap-2"><Upload className="h-3.5 w-3.5"/>Upload</TabsTrigger>
                  <TabsTrigger value="camera" className="flex gap-2"><Camera className="h-3.5 w-3.5"/>Camera</TabsTrigger>
                  <TabsTrigger value="url" className="flex gap-2"><Link className="h-3.5 w-3.5"/>URL</TabsTrigger>
                  <TabsTrigger value="paste" className="flex gap-2"><ClipboardPaste className="h-3.5 w-3.5"/>Paste</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-0">
                  <div
                    {...getRootProps()}
                    onClick={open}
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                      isDragActive ? "border-primary bg-primary/10 scale-[0.99]" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
                    }`}
                    role="button" tabIndex={0}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="font-semibold text-lg mb-1">Drag & drop image here</h3>
                    <p className="text-sm text-muted-foreground">or click to browse files</p>
                    <p className="text-xs text-muted-foreground mt-3">PNG, JPG, WEBP, BMP, SVG</p>
                  </div>
                </TabsContent>

                <TabsContent value="camera" className="mt-0">
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-border">
                      {cameraError ? (
                        <div className="text-center p-6 text-muted-foreground">
                          <Camera className="h-10 w-10 mx-auto mb-2 opacity-50"/>
                          <p className="text-sm">{cameraError}</p>
                        </div>
                      ) : (
                        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
                      )}
                      {!cameraError && (
                        <div className="absolute inset-0 pointer-events-none border-2 border-primary/40 rounded-xl flex items-center justify-center">
                          <div className="w-40 h-40 border-2 border-primary rounded-lg opacity-70 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Point your camera at a QR code. Scans automatically every 300ms.</p>
                  </div>
                </TabsContent>

                <TabsContent value="url" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-img-url`}>Direct Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`${id}-img-url`}
                        placeholder="https://example.com/qr.png"
                        value={urlInput}
                        onChange={e => setUrlInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && fetchFromUrl()}
                        className="h-11"
                      />
                      <Button onClick={fetchFromUrl} disabled={loading || !urlInput.trim()} className="shrink-0">
                        {loading ? "Loading…" : "Fetch"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Note: Some websites block cross-origin image fetching. If it fails, download and upload instead.</p>
                  </div>
                </TabsContent>

                <TabsContent value="paste" className="mt-0">
                  <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-10 text-center bg-muted/20">
                    <ClipboardPaste className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-1">Press Ctrl+V (or Cmd+V)</h3>
                    <p className="text-sm text-muted-foreground">Paste any copied image directly from your clipboard, screenshot, or another app.</p>
                  </div>
                </TabsContent>
              </Tabs>

              {preview && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border rounded-lg p-2 bg-background/50 flex items-center justify-center min-h-[200px] relative">
                    <img src={preview} alt="Preview" className="max-h-[300px] w-auto object-contain rounded" />
                    <button onClick={clearAll} className="absolute top-3 right-3 p-1.5 bg-background/80 hover:bg-background rounded-full shadow-sm border border-border">
                      <X className="h-4 w-4"/>
                    </button>
                  </div>
                </div>
              )}
            </ToolCard>

            {/* History */}
            {history.length > 0 && (
              <ToolCard title="Recent Scans">
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {history.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left px-3 py-2 rounded-lg border border-border/50 hover:bg-muted/50 text-sm font-mono truncate transition-colors"
                    >
                      {item.length > 60 ? item.slice(0, 60) + "…" : item}
                    </button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setHistory([])
                      historyRef.current = []
                      try { localStorage.removeItem("qr-reader-history") } catch (_) {}
                    }}
                    className="w-full text-xs text-muted-foreground"
                  >
                    <RefreshCw className="h-3 w-3 mr-1"/> Clear History
                  </Button>
                </div>
              </ToolCard>
            )}
          </div>

          {/* ── RIGHT: Result Panel ── */}
          <div className="lg:sticky lg:top-6 flex flex-col gap-4">
            <ToolCard title="Step 2 — Decoded Result" className="h-full">
              <div aria-live="polite" className="space-y-5 min-h-[280px] flex flex-col">
                {error ? (
                  <Alert variant="destructive" className="animate-in fade-in duration-300 shadow-sm border-destructive/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                ) : result ? (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/20 p-4">
                      <div className="bg-green-500 p-2 rounded-full text-white shadow-sm"><Check className="h-5 w-5"/></div>
                      <div>
                        <span className="font-bold text-green-700 dark:text-green-400 block text-sm uppercase tracking-wider mb-0.5">Success</span>
                        <span className="font-medium text-green-800 dark:text-green-300">QR Code decoded successfully</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-2 flex-1">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Extracted Content</Label>
                      <div className="p-3 bg-background border rounded-lg font-mono text-sm break-all max-h-[220px] overflow-y-auto shadow-inner">
                        {result}
                      </div>
                    </div>

                    <div className="grid gap-2 pt-1">
                      <Button onClick={handleCopy} className="w-full gap-2 font-semibold shadow-sm">
                        <Copy className="h-4 w-4"/> Copy to Clipboard
                      </Button>
                      {isUrl && (
                        <Button variant="outline" className="w-full gap-2 font-semibold bg-background" onClick={() => window.open(result, "_blank", "noopener,noreferrer")}>
                          <ExternalLink className="h-4 w-4"/> Open Link Safely
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-12 px-4 h-full border-2 border-dashed border-muted rounded-xl bg-muted/10">
                    <ImageIcon className="h-14 w-14 text-muted-foreground/40 mb-3" />
                    <h3 className="text-lg font-medium text-foreground mb-1">Waiting for Input</h3>
                    <p className="text-sm text-muted-foreground max-w-[260px]">
                      Upload an image, use your camera, or paste a screenshot to decode instantly.
                    </p>
                  </div>
                )}
              </div>
            </ToolCard>

            {/* Tips */}
            <ToolCard title="💡 Pro Tips">
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  "📷 Use the Camera tab for quick live scanning",
                  "🖱️ Drag & drop works from desktop folders",
                  "📋 Ctrl+V pastes screenshots directly",
                  "🔒 All processing happens locally in your browser",
                  "📐 Higher contrast images decode faster",
                ].map(t => <li key={t} className="flex items-start gap-2 leading-snug">{t}</li>)}
              </ul>
            </ToolCard>
          </div>
        </section>

        {/* ── FAQ / SEO Content ── */}
        <section aria-label="Frequently Asked Questions" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[
            { q: "Is my data safe and private?", a: "Yes. This tool runs entirely in your browser using JavaScript. No images or decoded data are ever uploaded to a server or stored externally." },
            { q: "What QR code formats are supported?", a: "We support all standard QR code formats including URLs, plain text, Wi-Fi credentials, vCard contacts, email, phone numbers, and SMS." },
            { q: "Why can't it read my QR code?", a: "Ensure the image is clear, well-lit, and not heavily blurred. The QR code should take up at least 10% of the image. Try cropping closer to the code." },
            { q: "Can I scan multiple QR codes in one image?", a: "Currently, the scanner detects the most prominent QR code. For multiple codes, crop the image to isolate each one before uploading." },
            { q: "Does it work offline?", a: "After the initial page load, yes. All scanning logic is client-side, so you can scan images without an internet connection." },
            { q: "Is this tool free for commercial use?", a: "Absolutely. There are no watermarks, usage limits, or hidden fees. Use it freely for personal or business purposes." },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-border bg-muted/30 p-5 space-y-2">
              <h3 className="font-semibold text-sm text-foreground">{q}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}
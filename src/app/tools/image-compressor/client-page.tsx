"use client"

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ToolCard } from "@/components/layout/tool-layout"
import {
  Upload, Download, Image as ImageIcon, Minimize2, AlertCircle,
  Trash2, ZoomIn, RotateCcw, FileImage, ChevronDown, Info,
  Layers, SlidersHorizontal, ArrowLeftRight
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Alert, AlertDescription } from "@/components/ui/alert"

// ─── JSON-LD Schemas ─────────────────────────────────────────────────────────

const WebApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Free Online Image Compressor",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "description":
    "Compress JPG, PNG, and WebP images online for free. Reduce image file size by up to 90% without losing visible quality. No upload required — 100% client-side processing.",
  "url": "https://yourdomain.com/tools/image-compressor",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "featureList": [
    "Lossless and lossy JPEG compression",
    "PNG image optimization",
    "WebP image compression",
    "Real-time before/after preview",
    "Batch image compression",
    "Client-side processing — no data uploaded",
    "Free image size reducer",
    "Download optimized images instantly",
  ],
  "keywords":
    "image compressor, compress image online, reduce image size, jpg compressor, png optimizer, webp converter, free image optimizer, compress photos online, image size reducer, optimize images for web",
}

const FAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I compress an image without losing quality?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use a quality setting between 75–85% for the best balance between file size reduction and visual fidelity. Our compressor uses canvas-based processing to apply near-lossless compression that retains sharpness while significantly reducing file size.",
      },
    },
    {
      "@type": "Question",
      "name": "Is my image data uploaded to any server?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. All compression happens 100% in your browser using the HTML5 Canvas API. Your images never leave your device, ensuring complete privacy.",
      },
    },
    {
      "@type": "Question",
      "name": "What image formats does this compressor support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This tool supports JPEG (.jpg, .jpeg), PNG (.png), and WebP (.webp) images up to 20MB each.",
      },
    },
    {
      "@type": "Question",
      "name": "How much can I reduce an image's file size?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Typical reductions range from 30% to 90% depending on the original image, format, and quality setting. JPEG images usually see the largest reductions.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I compress multiple images at once?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. You can upload up to 10 images simultaneously for batch compression. Each image is processed individually in your browser.",
      },
    },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

function calcSavings(original: number, compressed: number) {
  if (!original || !compressed) return 0
  return parseFloat((((original - compressed) / original) * 100).toFixed(1))
}

function getBase64Size(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1]
  if (!base64) return 0
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0
  return (base64.length * 3) / 4 - padding
}

type OutputFormat = "original" | "image/jpeg" | "image/png" | "image/webp"

interface ImageEntry {
  id: string
  file: File
  preview: string
  compressed: string
  compressedSize: number
  dims: { w: number; h: number }
}

// ─── Single-image compressor ──────────────────────────────────────────────────

function compressDataUrl(
  src: string,
  file: File,
  quality: number,
  format: OutputFormat,
  maxWidth: number
): Promise<{ dataUrl: string; size: number; dims: { w: number; h: number } }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      let w = img.width
      let h = img.height
      if (maxWidth > 0 && w > maxWidth) {
        h = Math.round((h * maxWidth) / w)
        w = maxWidth
      }
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Canvas context failed"))
      const outType =
        format === "original"
          ? file.type === "image/png"
            ? "image/png"
            : file.type
          : format
      if (outType === "image/jpeg" || (format === "original" && file.type === "image/jpeg")) {
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, w, h)
      }
      ctx.drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL(outType, quality / 100)
      resolve({ dataUrl, size: getBase64Size(dataUrl), dims: { w, h } })
    }
    img.onerror = () => reject(new Error("Image load failed"))
    img.src = src
  })
}

// ─── Animated stat badge ──────────────────────────────────────────────────────

function StatBadge({
  label,
  value,
  variant = "neutral",
}: {
  label: string
  value: string
  variant?: "neutral" | "success" | "danger"
}) {
  const colors = {
    neutral: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300",
    success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
    danger: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
  }
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border px-4 py-3 transition-all duration-500 ${colors[variant]}`}
      style={{ animation: "fadeSlideUp 0.35s ease both" }}
    >
      <span className="text-[10px] uppercase tracking-widest font-semibold opacity-70 mb-1">{label}</span>
      <span className="text-lg font-black tabular-nums">{value}</span>
    </div>
  )
}

// ─── Slider compare ───────────────────────────────────────────────────────────

function SliderCompare({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const move = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setPos(pct)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return
      const x = "touches" in e ? e.touches[0].clientX : e.clientX
      move(x)
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("touchmove", onMove)
    window.addEventListener("mouseup", onUp)
    window.addEventListener("touchend", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("touchmove", onMove)
      window.removeEventListener("mouseup", onUp)
      window.removeEventListener("touchend", onUp)
    }
  }, [move])

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-xl border bg-black cursor-col-resize"
      style={{ minHeight: 260 }}
      onMouseDown={(e) => { dragging.current = true; move(e.clientX) }}
      onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX) }}
      aria-label="Before/after image comparison slider"
      role="slider"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* After (full) */}
      <img src={after} alt="Compressed output" className="absolute inset-0 w-full h-full object-contain" />
      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="Original image" className="absolute inset-0 w-full h-full object-contain" style={{ width: `${10000 / pos}%`, maxWidth: "none" }} />
      </div>
      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center border border-slate-200">
          <ArrowLeftRight className="w-4 h-4 text-slate-700" />
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-2 py-1 rounded-md backdrop-blur-sm font-semibold tracking-wider">BEFORE</span>
      <span className="absolute top-2 right-2 text-[10px] bg-emerald-600/80 text-white px-2 py-1 rounded-md backdrop-blur-sm font-semibold tracking-wider">AFTER</span>
    </div>
  )
}

// ─── Batch row ────────────────────────────────────────────────────────────────

function BatchRow({
  entry,
  onRemove,
  onDownload,
}: {
  entry: ImageEntry
  onRemove: (id: string) => void
  onDownload: (entry: ImageEntry) => void
}) {
  const savings = calcSavings(entry.file.size, entry.compressedSize)
  return (
    <li
      className="flex items-center gap-3 p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors duration-200"
      style={{ animation: "fadeSlideUp 0.3s ease both" }}
    >
      <img src={entry.preview} alt={entry.file.name} className="w-12 h-12 object-cover rounded-lg border shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" title={entry.file.name}>{entry.file.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatBytes(entry.file.size)} → <strong className="text-foreground">{formatBytes(entry.compressedSize)}</strong>
          {savings > 0 && <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-semibold">−{savings}%</span>}
        </p>
      </div>
      <div className="flex gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => onDownload(entry)} aria-label={`Download ${entry.file.name}`}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onRemove(entry.id)} className="text-destructive hover:text-destructive" aria-label={`Remove ${entry.file.name}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ToolClient() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [compressed, setCompressed] = useState("")
  const [compressedSize, setCompressedSize] = useState(0)
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const [quality, setQuality] = useState(80)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("original")
  const [maxWidth, setMaxWidth] = useState(0) // 0 = no resize
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"split" | "compare">("split")
  const [batchEntries, setBatchEntries] = useState<ImageEntry[]>([])
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  // Dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: isBatchMode ? 10 : 1,
    maxSize: 20971520,
    onDrop: async (accepted, rejected) => {
      setError("")
      if (rejected.length > 0) {
        setError("Some files were rejected. Ensure each file is a JPG, PNG, or WebP under 20MB.")
        return
      }
      if (isBatchMode) {
        // Batch: process all
        const entries: ImageEntry[] = []
        for (const f of accepted) {
          const preview = await new Promise<string>((res) => {
            const r = new FileReader()
            r.onload = () => res(r.result as string)
            r.readAsDataURL(f)
          })
          const { dataUrl, size, dims } = await compressDataUrl(preview, f, quality, outputFormat, maxWidth)
          entries.push({ id: crypto.randomUUID(), file: f, preview, compressed: dataUrl, compressedSize: size, dims })
        }
        setBatchEntries((prev) => [...prev, ...entries])
      } else {
        const f = accepted[0]
        if (!f) return
        const r = new FileReader()
        r.onload = () => setPreview(r.result as string)
        r.onerror = () => setError("Failed to read the file.")
        r.readAsDataURL(f)
        setFile(f)
        setCompressed("")
        setCompressedSize(0)
      }
    },
  })

  // Re-compress on quality/format/maxWidth change
  useEffect(() => {
    if (!preview || !file) return
    const id = setTimeout(async () => {
      setLoading(true)
      try {
        const result = await compressDataUrl(preview, file, quality, outputFormat, maxWidth)
        setCompressed(result.dataUrl)
        setCompressedSize(result.size)
        setDims(result.dims)
      } catch {
        setError("Failed to compress image.")
      }
      setLoading(false)
    }, 150)
    return () => clearTimeout(id)
  }, [preview, quality, outputFormat, maxWidth, file])

  // Re-compress batch when settings change
  useEffect(() => {
    if (batchEntries.length === 0) return
    const id = setTimeout(async () => {
      const updated = await Promise.all(
        batchEntries.map(async (entry) => {
          const { dataUrl, size, dims } = await compressDataUrl(entry.preview, entry.file, quality, outputFormat, maxWidth)
          return { ...entry, compressed: dataUrl, compressedSize: size, dims }
        })
      )
      setBatchEntries(updated)
    }, 300)
    return () => clearTimeout(id)
  }, [quality, outputFormat, maxWidth]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = useCallback((entry?: ImageEntry) => {
    const src = entry?.compressed ?? compressed
    const f = entry?.file ?? file
    if (!src || !f) return
    const ext = outputFormat === "original" ? f.name.split(".").pop() : outputFormat.split("/")[1]
    const base = f.name.substring(0, f.name.lastIndexOf(".")) || f.name
    const a = document.createElement("a")
    a.href = src
    a.download = `${base}-optimized.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [compressed, file, outputFormat])

  const handleDownloadAll = useCallback(() => {
    batchEntries.forEach((e, i) => {
      setTimeout(() => handleDownload(e), i * 200)
    })
  }, [batchEntries, handleDownload])

  const handleClear = useCallback(() => {
    setFile(null)
    setPreview("")
    setCompressed("")
    setCompressedSize(0)
    setDims(null)
    setError("")
    setQuality(80)
    setOutputFormat("original")
    setMaxWidth(0)
  }, [])

  const savings = useMemo(() => file ? calcSavings(file.size, compressedSize) : 0, [file, compressedSize])
  const batchTotalOriginal = useMemo(() => batchEntries.reduce((s, e) => s + e.file.size, 0), [batchEntries])
  const batchTotalCompressed = useMemo(() => batchEntries.reduce((s, e) => s + e.compressedSize, 0), [batchEntries])

  // Determine output extension label
  const outExt = outputFormat === "original"
    ? file?.name.split(".").pop()?.toUpperCase() ?? " , "
    : outputFormat.split("/")[1].toUpperCase()

  const faqs = FAQSchema.mainEntity

  return (
    <>
      {/* JSON-LD */}

      {/* Keyframes */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSoft {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        .loading-pulse { animation: pulseSoft 1.2s ease-in-out infinite; }
        .fade-in { animation: fadeSlideUp 0.4s ease both; }
      `}</style>

      <article aria-label="Image Compressor Tool" className="w-full space-y-8">
        {/* Hero heading for SEO */}
        <header className="space-y-1 fade-in">
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Free Online Image Compressor
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Compress JPG, PNG, and WebP images directly in your browser — no uploads, no servers, 100% private.
            Reduce image file size by up to 90% while preserving visual quality.
          </p>
          {/* Mode toggle */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setIsBatchMode(false)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${!isBatchMode ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              aria-pressed={!isBatchMode}
            >
              <FileImage className="inline h-3.5 w-3.5 mr-1.5" aria-hidden />
              Single Image
            </button>
            <button
              onClick={() => setIsBatchMode(true)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isBatchMode ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              aria-pressed={isBatchMode}
            >
              <Layers className="inline h-3.5 w-3.5 mr-1.5" aria-hidden />
              Batch Mode
            </button>
          </div>
        </header>

        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" aria-hidden />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* ── Settings panel ── */}
        <section aria-label="Compression settings" className="bg-muted/20 border rounded-2xl p-5 space-y-5 fade-in">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Compression Settings
          </h2>

          <div className="grid gap-5 sm:grid-cols-3">
            {/* Quality */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="quality-slider" className="text-sm font-semibold">Quality</Label>
                <span className="text-sm font-black px-2 py-0.5 bg-primary/10 text-primary rounded-md tabular-nums">{quality}%</span>
              </div>
              <Slider
                id="quality-slider"
                value={[quality]}
                onValueChange={([v]) => setQuality(v)}
                min={10} max={100} step={5}
                className="py-1"
                aria-label="Image compression quality"
              />
              <p className="text-[11px] text-muted-foreground">80% = best web balance</p>
            </div>

            {/* Output format */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Output Format</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {(["original", "image/jpeg", "image/png", "image/webp"] as OutputFormat[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setOutputFormat(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 ${outputFormat === f
                        ? "bg-primary text-primary-foreground border-primary shadow"
                        : "bg-background border-border hover:border-primary/50"
                      }`}
                    aria-pressed={outputFormat === f}
                  >
                    {f === "original" ? "Auto" : f.split("/")[1].toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">WebP = smallest files</p>
            </div>

            {/* Max width */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Max Width</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {[0, 1920, 1280, 800].map((w) => (
                  <button
                    key={w}
                    onClick={() => setMaxWidth(w)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 ${maxWidth === w
                        ? "bg-primary text-primary-foreground border-primary shadow"
                        : "bg-background border-border hover:border-primary/50"
                      }`}
                    aria-pressed={maxWidth === w}
                  >
                    {w === 0 ? "Original" : `${w}px`}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">Resize on compress</p>
            </div>
          </div>
        </section>

        {/* ── SINGLE MODE ── */}
        {!isBatchMode && (
          <section aria-label="Single image compression" className="space-y-4">
            {/* View toggle */}
            {file && compressed && (
              <div className="flex items-center gap-2 fade-in">
                <button
                  onClick={() => setViewMode("split")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${viewMode === "split" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  Side-by-side
                </button>
                <button
                  onClick={() => setViewMode("compare")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${viewMode === "compare" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  <ArrowLeftRight className="inline h-3 w-3 mr-1" />
                  Slider Compare
                </button>
              </div>
            )}

            {viewMode === "compare" && file && compressed ? (
              <div className="fade-in space-y-4">
                <SliderCompare before={preview} after={compressed} />
                <div className="grid grid-cols-3 gap-3">
                  <StatBadge label="Original" value={formatBytes(file.size)} />
                  <StatBadge label="Compressed" value={formatBytes(compressedSize)} />
                  <StatBadge
                    label="Saved"
                    value={`${savings > 0 ? "-" : "+"}${Math.abs(savings)}%`}
                    variant={savings > 0 ? "success" : savings < 0 ? "danger" : "neutral"}
                  />
                </div>
                <Button className="w-full h-12 text-base" onClick={() => handleDownload()} disabled={!compressed || loading} size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Download as {outExt}
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Original */}
                <ToolCard title="Original Image">
                  <div className="flex flex-col h-full space-y-4">
                    {!file ? (
                      <div
                        {...getRootProps()}
                        className={`flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 min-h-[300px] ${isDragActive
                            ? "border-primary bg-primary/5 scale-[0.98]"
                            : "border-muted-foreground/25 hover:border-primary/60 hover:bg-muted/20"
                          } ${isDragReject ? "border-destructive bg-destructive/5" : ""}`}
                        aria-label="Upload dropzone for image compression"
                        role="button"
                      >
                        <input {...getInputProps()} aria-label="Image file input" />
                        <Upload
                          className={`h-12 w-12 mb-4 transition-transform duration-300 ${isDragActive ? "text-primary scale-110" : "text-muted-foreground"}`}
                          aria-hidden
                        />
                        <p className="font-bold text-foreground text-center text-lg">Drop image to compress</p>
                        <p className="text-sm text-muted-foreground mt-1 text-center">or click to browse</p>
                        <div className="text-xs text-muted-foreground mt-5 text-center px-4 py-2 bg-muted/50 rounded-lg">
                          JPG · PNG · WebP &nbsp;|&nbsp; Max 20MB
                        </div>
                        {/* SEO keyword context */}
                        <p className="sr-only">
                          Free image compressor. Compress JPEG, PNG and WebP images online for web optimization, reduce image size, optimize photos without quality loss.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border">
                          <div className="truncate pr-3 flex-1">
                            <p className="text-sm font-semibold truncate" title={file.name}>{file.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatBytes(file.size)}
                              {dims && <span className="ml-2 opacity-60">{dims.w}×{dims.h}px</span>}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive shrink-0">
                            <Trash2 className="h-4 w-4 mr-1" /> Clear
                          </Button>
                        </div>
                        <div className="flex-1 border rounded-xl bg-muted/10 flex items-center justify-center min-h-[250px] overflow-hidden relative">
                          <img
                            src={preview}
                            alt={`Original ${file.name} before compression`}
                            className="max-h-[300px] w-auto max-w-full rounded object-contain shadow-sm"
                          />
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md font-semibold tracking-widest">BEFORE</span>
                        </div>
                      </>
                    )}
                  </div>
                </ToolCard>

                {/* Output */}
                <ToolCard title="Compressed Output">
                  <div className="flex flex-col h-full space-y-4">
                    {file && compressed ? (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          <StatBadge label="New size" value={formatBytes(compressedSize)} />
                          <StatBadge
                            label="Saved"
                            value={`${savings > 0 ? "-" : "+"}${Math.abs(savings)}%`}
                            variant={savings > 0 ? "success" : savings < 0 ? "danger" : "neutral"}
                          />
                          <StatBadge label="Format" value={outExt} />
                        </div>

                        <div className="flex-1 border rounded-xl bg-muted/10 flex items-center justify-center min-h-[250px] overflow-hidden relative">
                          <img
                            src={compressed}
                            alt={`Compressed version of ${file.name} — reduced file size`}
                            className={`max-h-[300px] w-auto max-w-full rounded object-contain shadow-sm transition-opacity duration-300 ${loading ? "loading-pulse" : ""}`}
                          />
                          {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm rounded-xl">
                              <div className="text-xs font-semibold text-muted-foreground animate-pulse">Compressing…</div>
                            </div>
                          )}
                          <span className="absolute bottom-2 right-2 bg-emerald-600/80 text-white text-[10px] px-2 py-1 rounded-md font-semibold tracking-widest">AFTER</span>
                        </div>

                        <Button
                          className="w-full h-12 text-base"
                          onClick={() => handleDownload()}
                          disabled={!compressed || loading}
                          size="lg"
                          aria-label={`Download optimized image as ${outExt}`}
                        >
                          <Download className="mr-2 h-5 w-5" />
                          Download as {outExt}
                        </Button>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-muted/10 text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mb-4 opacity-25" aria-hidden />
                        <p className="font-semibold text-foreground/60">Awaiting image…</p>
                        <p className="text-xs mt-1 max-w-[220px] text-center">Upload and adjust settings to see compressed output.</p>
                      </div>
                    )}
                  </div>
                </ToolCard>
              </div>
            )}
          </section>
        )}

        {/* ── BATCH MODE ── */}
        {isBatchMode && (
          <section aria-label="Batch image compression" className="space-y-4 fade-in">
            {/* Drop zone */}
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-muted-foreground/25 hover:border-primary/60 hover:bg-muted/10"
                }`}
              aria-label="Batch upload dropzone — up to 10 images"
              role="button"
            >
              <input {...getInputProps()} />
              <Upload className={`h-10 w-10 mb-3 transition-transform duration-200 ${isDragActive ? "text-primary scale-110" : "text-muted-foreground"}`} aria-hidden />
              <p className="font-bold text-foreground">Drop up to 10 images</p>
              <p className="text-sm text-muted-foreground mt-1">JPG · PNG · WebP · Max 20MB each</p>
            </div>

            {batchEntries.length > 0 && (
              <>
                {/* Batch summary */}
                <div className="grid grid-cols-3 gap-3">
                  <StatBadge label="Files" value={String(batchEntries.length)} />
                  <StatBadge label="Total original" value={formatBytes(batchTotalOriginal)} />
                  <StatBadge
                    label="Total saved"
                    value={`-${calcSavings(batchTotalOriginal, batchTotalCompressed)}%`}
                    variant="success"
                  />
                </div>

                <ul className="space-y-2" aria-label="Batch compression results">
                  {batchEntries.map((entry) => (
                    <BatchRow
                      key={entry.id}
                      entry={entry}
                      onRemove={(id) => setBatchEntries((p) => p.filter((e) => e.id !== id))}
                      onDownload={handleDownload}
                    />
                  ))}
                </ul>

                <div className="flex gap-3">
                  <Button className="flex-1 h-11" onClick={handleDownloadAll} aria-label="Download all compressed images">
                    <Download className="mr-2 h-4 w-4" /> Download All
                  </Button>
                  <Button variant="outline" onClick={() => setBatchEntries([])} className="text-destructive hover:text-destructive" aria-label="Clear all batch images">
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All
                  </Button>
                </div>
              </>
            )}
          </section>
        )}

        {/* ── Features strip ── */}
        <section aria-label="Tool features and benefits" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <ZoomIn className="h-4 w-4" />, title: "Lossless Preview", body: "See results before downloading" },
            { icon: <RotateCcw className="h-4 w-4" />, title: "Privacy First", body: "Files never leave your device" },
            { icon: <Layers className="h-4 w-4" />, title: "Batch Compress", body: "Up to 10 images at once" },
            { icon: <Info className="h-4 w-4" />, title: "WebP Export", body: "Convert to next-gen format" },
          ].map(({ icon, title, body }) => (
            <div key={title} className="flex flex-col gap-1.5 p-4 rounded-xl border bg-muted/10 hover:bg-muted/20 transition-colors duration-200">
              <div className="text-primary">{icon}</div>
              <p className="text-sm font-bold">{title}</p>
              <p className="text-xs text-muted-foreground leading-snug">{body}</p>
            </div>
          ))}
        </section>

        {/* ── FAQ accordion ── */}
        <section aria-labelledby="faq-heading" className="space-y-3">
          <h2 id="faq-heading" className="text-lg font-black tracking-tight">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-2">
            {faqs.map((item, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <dt>
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-muted/30 transition-colors duration-150"
                    aria-expanded={faqOpen === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    {item.name}
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-300 shrink-0 ml-3 ${faqOpen === i ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                </dt>
                <dd
                  id={`faq-answer-${i}`}
                  className="text-sm text-muted-foreground overflow-hidden transition-all duration-300"
                  style={{ maxHeight: faqOpen === i ? "200px" : "0", padding: faqOpen === i ? "0 1rem 1rem" : "0 1rem" }}
                >
                  {item.acceptedAnswer.text}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── SEO paragraph ── */}
        <section aria-label="About this image compression tool" className="prose prose-sm max-w-none text-muted-foreground space-y-2 text-[13px] leading-relaxed border-t pt-6">
          <h2 className="text-base font-bold text-foreground">About This Free Image Compressor</h2>
          <p>
            This <strong>free online image compressor</strong> lets you reduce JPEG, PNG, and WebP file sizes instantly  ,
            with no sign-up, no watermarks, and no data ever uploaded to any server. All processing happens in your
            browser using the HTML5 Canvas API, making it the most private image optimizer available.
          </p>
          <p>
            Whether you need to <strong>compress images for web</strong>, <strong>reduce photo size for email</strong>,
            or <strong>optimize images for SEO</strong>, this tool covers it all. Adjust the quality slider to control
            the trade-off between file size and visual clarity, or switch output to WebP — Google's recommended
            next-generation image format — for the smallest possible files without visible quality loss.
          </p>
          <p>
            <strong>Use cases:</strong> web performance optimization · Core Web Vitals improvement · email attachments ·
            social media uploads · WordPress image optimization · eCommerce product photos · blog post images.
          </p>
        </section>
      </article>
    </>
  )
}
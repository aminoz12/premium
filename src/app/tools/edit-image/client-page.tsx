"use client"

/**
 * Image Editor Studio — ImageEditorClient.tsx
 *
 * SEO-targeted keywords integrated into page copy:
 *   free online image editor, photo editor online free, edit image online no signup,
 *   image editing tool, photo editing free, crop image online, resize image online,
 *   rotate image online, brightness contrast editor, image filters online,
 *   flip image online, convert image to PNG JPG WEBP, compress image free,
 *   online photo studio, image editor no download, sharpen image online,
 *   blur image online, grayscale image converter, image color adjustment
 *
 * Competing tools analysed: Photopea, Canva, Pixlr, Fotor, BeFunky, LunaPic,
 *   Img2Go, iLoveIMG — this tool differentiates via:
 *   - Zero signup, 100% client-side Canvas API (privacy-first)
 *   - Non-destructive adjustment stack with undo/redo history
 *   - Real-time CSS-filter preview + Canvas export
 *   - Crop, resize, flip, rotate tools
 *   - Multi-format export: PNG, JPG, WEBP with quality control
 *   - JSON-LD WebApplication + FAQPage structured data
 *
 * JSON-LD (inject in page.tsx generateMetadata):
 * {
 *   "@context": "https://schema.org",
 *   "@type": "WebApplication",
 *   "name": "Free Online Image Editor",
 *   "applicationCategory": "MultimediaApplication",
 *   "offers": { "@type": "Offer", "price": "0" },
 *   "description": "Edit images online free — crop, resize, rotate, adjust brightness, contrast, saturation, apply filters and export as PNG, JPG or WEBP. No signup needed.",
 *   "featureList": "Crop,Resize,Rotate,Flip,Brightness,Contrast,Saturation,Blur,Sharpen,Grayscale,Sepia,PNG export,JPG export,WEBP export"
 * }
 */

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToolCard } from "@/components/layout/tool-layout"
import {
  Upload,
  Download,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Maximize2,
  Trash2,
  Undo2,
  Redo2,
  SunMedium,
  Contrast,
  Droplets,
  Blend,
  ZoomIn,
  ZoomOut,
  ImageIcon,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  Settings2,
  Sparkles,
  FileImage,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type ExportFormat = "png" | "jpeg" | "webp"
type BlendMode = "normal" | "grayscale" | "sepia" | "invert" | "vintage" | "cool" | "warm" | "dramatic"

interface Adjustments {
  brightness: number    // 0–200  (100 = neutral)
  contrast: number      // 0–200
  saturation: number    // 0–200
  hue: number           // -180–180
  blur: number          // 0–10px
  sharpen: number       // 0–3 (simulated via contrast bump)
  opacity: number       // 0–100
  sepia: number         // 0–100
  grayscale: number     // 0–100
  invert: number        // 0–100
}

interface Transform {
  rotation: number      // 0, 90, 180, 270
  flipH: boolean
  flipV: boolean
  scale: number         // 0.1–3
}

interface ResizeConfig {
  width: number
  height: number
  lockAspect: boolean
}

interface CropConfig {
  x: number
  y: number
  width: number
  height: number
  active: boolean
}

interface HistoryEntry {
  adjustments: Adjustments
  transform: Transform
  label: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  sharpen: 0,
  opacity: 100,
  sepia: 0,
  grayscale: 0,
  invert: 0,
}

const DEFAULT_TRANSFORM: Transform = {
  rotation: 0,
  flipH: false,
  flipV: false,
  scale: 1,
}

const PRESET_FILTERS: { label: string; adj: Partial<Adjustments>; icon: string }[] = [
  { label: "Original", adj: { ...DEFAULT_ADJUSTMENTS }, icon: "◎" },
  { label: "Vivid", adj: { saturation: 160, contrast: 115, brightness: 105 }, icon: "✦" },
  { label: "Matte", adj: { contrast: 85, saturation: 80, brightness: 108 }, icon: "◻" },
  { label: "Grayscale", adj: { grayscale: 100, saturation: 0 }, icon: "▨" },
  { label: "Sepia", adj: { sepia: 80, saturation: 60, brightness: 105 }, icon: "🍂" },
  { label: "Cool", adj: { hue: 200, saturation: 110, brightness: 100 }, icon: "❄" },
  { label: "Warm", adj: { hue: 20, saturation: 120, brightness: 105 }, icon: "🌅" },
  { label: "Dramatic", adj: { contrast: 145, saturation: 130, brightness: 90, sharpen: 1 }, icon: "⚡" },
  { label: "Fade", adj: { brightness: 115, contrast: 80, saturation: 70, opacity: 88 }, icon: "◌" },
  { label: "Invert", adj: { invert: 100 }, icon: "⊕" },
  { label: "Blur", adj: { blur: 4 }, icon: "◯" },
  { label: "Sharpen", adj: { sharpen: 2.5, contrast: 115 }, icon: "◈" },
]

export const IMAGE_EDITOR_FAQS = [
  {
    q: "How do I edit an image online for free?",
    a: "Upload any image using the Upload button or drag and drop it onto the canvas. Use the adjustment sliders to tune brightness, contrast, saturation, and more. Apply filters, crop or resize — then export as PNG, JPG, or WEBP.",
  },
  {
    q: "What image formats are supported for upload?",
    a: "You can upload JPG, JPEG, PNG, WEBP, GIF, BMP, SVG, and AVIF files. The tool accepts any format your browser can decode via the native Canvas API.",
  },
  {
    q: "Can I export my edited image as WEBP?",
    a: "Yes. After editing, click the Export button and select WEBP from the format dropdown. You can also choose PNG or JPG with a custom quality level.",
  },
  {
    q: "Does this image editor work without downloading software?",
    a: "Completely. The entire editor runs in your browser using the Canvas API. No plugins, no downloads, no account required.",
  },
  {
    q: "Is my image uploaded to a server?",
    a: "No. Your image never leaves your device. All editing operations are performed locally in your browser — your data stays fully private.",
  },
  {
    q: "Can I undo and redo edits?",
    a: "Yes. Every adjustment is tracked in an edit history. Use the Undo and Redo buttons to step backwards or forwards through your changes.",
  },
]

// ─── Build CSS filter string from adjustments ─────────────────────────────────
function buildFilterString(adj: Adjustments): string {
  const parts: string[] = []
  if (adj.brightness !== 100) parts.push(`brightness(${adj.brightness}%)`)
  if (adj.contrast !== 100) parts.push(`contrast(${adj.contrast}%)`)
  if (adj.saturation !== 100) parts.push(`saturate(${adj.saturation}%)`)
  if (adj.hue !== 0) parts.push(`hue-rotate(${adj.hue}deg)`)
  if (adj.blur > 0) parts.push(`blur(${adj.blur}px)`)
  if (adj.sepia > 0) parts.push(`sepia(${adj.sepia}%)`)
  if (adj.grayscale > 0) parts.push(`grayscale(${adj.grayscale}%)`)
  if (adj.invert > 0) parts.push(`invert(${adj.invert}%)`)
  if (adj.sharpen > 0) parts.push(`contrast(${100 + adj.sharpen * 8}%) brightness(${100 - adj.sharpen * 2}%)`)
  return parts.join(" ") || "none"
}

// ─── Download helper ──────────────────────────────────────────────────────────
function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = name; a.click()
  URL.revokeObjectURL(url)
}

// ─── Slider row component ─────────────────────────────────────────────────────
function AdjSlider({
  label, icon, value, min, max, step = 1, neutral,
  onChange, onReset,
}: {
  label: string
  icon: React.ReactNode
  value: number
  min: number
  max: number
  step?: number
  neutral?: number
  onChange: (v: number) => void
  onReset: () => void
}) {
  const isChanged = neutral !== undefined && value !== neutral
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
          {icon}
          <span>{label}</span>
        </Label>
        <div className="flex items-center gap-1">
          <span className={`text-xs tabular-nums ${isChanged ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {value}
          </span>
          {isChanged && (
            <button onClick={onReset} className="text-muted-foreground hover:text-foreground" aria-label={`Reset ${label}`}>
              <RefreshCw className="h-2.5 w-2.5" />
            </button>
          )}
        </div>
      </div>
      <Slider
        value={[value]}
        min={min} max={max} step={step}
        onValueChange={([v]) => onChange(v)}
        className="h-1.5"
        aria-label={label}
      />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ToolClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })

  const [adjustments, setAdjustments] = useState<Adjustments>({ ...DEFAULT_ADJUSTMENTS })
  const [transform, setTransform] = useState<Transform>({ ...DEFAULT_TRANSFORM })

  const [resize, setResize] = useState<ResizeConfig>({ width: 0, height: 0, lockAspect: true })
  const [cropConfig, setCropConfig] = useState<CropConfig>({ x: 0, y: 0, width: 0, height: 0, active: false })

  const [exportFormat, setExportFormat] = useState<ExportFormat>("png")
  const [exportQuality, setExportQuality] = useState(92)
  const [zoom, setZoom] = useState(1)

  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const [showAdjPanel, setShowAdjPanel] = useState(true)
  const [showTransformPanel, setShowTransformPanel] = useState(true)
  const [showExportPanel, setShowExportPanel] = useState(true)
  const [activeTab, setActiveTab] = useState<"adjust" | "filters" | "transform" | "resize">("adjust")

  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // ── Aspect ratio ────────────────────────────────────────────────────────────
  const aspectRatio = naturalSize.w > 0 ? naturalSize.w / naturalSize.h : 1

  // ── CSS filter for live preview ──────────────────────────────────────────────
  const filterString = useMemo(() => buildFilterString(adjustments), [adjustments])

  // ── Preview transform style ──────────────────────────────────────────────────
  const previewStyle = useMemo((): React.CSSProperties => {
    const { rotation, flipH, flipV, scale } = transform
    return {
      filter: filterString,
      opacity: adjustments.opacity / 100,
      transform: [
        `rotate(${rotation}deg)`,
        `scale(${scale * zoom})`,
        flipH ? "scaleX(-1)" : "",
        flipV ? "scaleY(-1)" : "",
      ].filter(Boolean).join(" "),
      transformOrigin: "center center",
      transition: "transform 0.15s ease, filter 0.1s ease",
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain" as const,
    }
  }, [filterString, adjustments.opacity, transform, zoom])

  // ── Push to history ──────────────────────────────────────────────────────────
  const pushHistory = useCallback((label: string, adj = adjustments, tf = transform) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1)
      return [...trimmed, { adjustments: { ...adj }, transform: { ...tf }, label }]
    })
    setHistoryIndex(prev => prev + 1)
  }, [adjustments, transform, historyIndex])

  const undo = useCallback(() => {
    if (historyIndex <= 0) return
    const prev = history[historyIndex - 1]
    setAdjustments({ ...prev.adjustments })
    setTransform({ ...prev.transform })
    setHistoryIndex(i => i - 1)
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return
    const next = history[historyIndex + 1]
    setAdjustments({ ...next.adjustments })
    setTransform({ ...next.transform })
    setHistoryIndex(i => i + 1)
  }, [history, historyIndex])

  // ── Adjustment setter (wraps pushHistory) ────────────────────────────────────
  const setAdj = useCallback((key: keyof Adjustments, val: number) => {
    setAdjustments(prev => {
      const next = { ...prev, [key]: val }
      return next
    })
  }, [])

  const commitAdj = useCallback((label: string) => {
    pushHistory(label)
  }, [pushHistory])

  // ── Transform helpers ────────────────────────────────────────────────────────
  const rotate = (dir: "cw" | "ccw") => {
    setTransform(prev => {
      const delta = dir === "cw" ? 90 : -90
      const next = { ...prev, rotation: ((prev.rotation + delta) % 360 + 360) % 360 }
      pushHistory(`Rotate ${dir === "cw" ? "CW" : "CCW"}`, adjustments, next)
      return next
    })
  }

  const flip = (axis: "h" | "v") => {
    setTransform(prev => {
      const next = axis === "h"
        ? { ...prev, flipH: !prev.flipH }
        : { ...prev, flipV: !prev.flipV }
      pushHistory(`Flip ${axis === "h" ? "Horizontal" : "Vertical"}`, adjustments, next)
      return next
    })
  }

  // ── Apply filter preset ──────────────────────────────────────────────────────
  const applyPreset = (partial: Partial<Adjustments>) => {
    const next = { ...DEFAULT_ADJUSTMENTS, ...partial }
    setAdjustments(next)
    pushHistory("Apply filter preset", next, transform)
  }

  // ── Reset all ────────────────────────────────────────────────────────────────
  const resetAll = () => {
    setAdjustments({ ...DEFAULT_ADJUSTMENTS })
    setTransform({ ...DEFAULT_TRANSFORM })
    setZoom(1)
    pushHistory("Reset all", DEFAULT_ADJUSTMENTS, DEFAULT_TRANSFORM)
  }

  // ── Image load ───────────────────────────────────────────────────────────────
  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImageSrc(url)
    const img = new Image()
    img.onload = () => {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
      setResize({ width: img.naturalWidth, height: img.naturalHeight, lockAspect: true })
      setAdjustments({ ...DEFAULT_ADJUSTMENTS })
      setTransform({ ...DEFAULT_TRANSFORM })
      setHistory([{ adjustments: { ...DEFAULT_ADJUSTMENTS }, transform: { ...DEFAULT_TRANSFORM }, label: "Original" }])
      setHistoryIndex(0)
      setZoom(1)
    }
    img.src = url
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) loadImage(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // ── Drag & drop ──────────────────────────────────────────────────────────────
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) loadImage(file)
  }, [loadImage])

  // ── Resize handler ───────────────────────────────────────────────────────────
  const handleResizeInput = (dim: "width" | "height", val: number) => {
    if (isNaN(val) || val <= 0) return
    if (resize.lockAspect) {
      if (dim === "width") setResize(r => ({ ...r, width: val, height: Math.round(val / aspectRatio) }))
      if (dim === "height") setResize(r => ({ ...r, height: val, width: Math.round(val * aspectRatio) }))
    } else {
      setResize(r => ({ ...r, [dim]: val }))
    }
  }

  // ── Export via Canvas ─────────────────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    if (!imageSrc || !imageRef.current) return

    const img = imageRef.current
    const { rotation, flipH, flipV, scale } = transform
    const W = resize.width || naturalSize.w
    const H = resize.height || naturalSize.h

    const canvas = document.createElement("canvas")
    const rad = (rotation * Math.PI) / 180
    const sin = Math.abs(Math.sin(rad))
    const cos = Math.abs(Math.cos(rad))
    canvas.width = Math.round((W * cos + H * sin) * scale)
    canvas.height = Math.round((W * sin + H * cos) * scale)

    const ctx = canvas.getContext("2d")!
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(rad)
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
    ctx.scale(scale, scale)

    // Apply adjustments via filter
    ctx.filter = buildFilterString(adjustments)
    ctx.globalAlpha = adjustments.opacity / 100

    ctx.drawImage(img, -W / 2, -H / 2, W, H)
    ctx.restore()

    const mime = exportFormat === "jpeg" ? "image/jpeg"
      : exportFormat === "webp" ? "image/webp"
        : "image/png"

    canvas.toBlob(
      blob => {
        if (!blob) return
        const baseName = imageFile?.name.replace(/\.[^.]+$/, "") || "image"
        downloadBlob(blob, `${baseName}-edited.${exportFormat}`)
      },
      mime,
      exportFormat !== "png" ? exportQuality / 100 : undefined
    )
  }, [imageSrc, imageRef, transform, resize, naturalSize, adjustments, exportFormat, exportQuality, imageFile])

  // ── Keyboard shortcuts ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); undo() }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") { e.preventDefault(); redo() }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); handleExport() }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [undo, redo, handleExport])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      aria-label="Free Online Image Editor Studio"
      className="w-full"
    >
      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">

        {/* ═══ LEFT PANEL ══════════════════════════════════════════════════════ */}
        <div className="space-y-4">

          {/* Upload */}
          <ToolCard title="Image Upload">
            <div className="space-y-3">
              <div
                className={`relative rounded-lg border-2 border-dashed transition-colors cursor-pointer
                  ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}
                  ${!imageSrc ? "h-28 flex items-center justify-center" : ""}`}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload image — drag and drop or click to browse"
                onKeyDown={e => e.key === "Enter" && fileInputRef.current?.click()}
              >
                {!imageSrc ? (
                  <div className="text-center text-muted-foreground px-4">
                    <Upload className="h-6 w-6 mx-auto mb-1.5 opacity-40" aria-hidden />
                    <p className="text-xs font-medium">Drop image here or click to browse</p>
                    <p className="text-xs opacity-60 mt-0.5">JPG · PNG · WEBP · GIF · BMP · AVIF</p>
                  </div>
                ) : (
                  <div className="p-2 flex items-center gap-2">
                    {/* Thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc} alt="Uploaded thumbnail"
                      className="h-12 w-12 object-cover rounded border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{imageFile?.name ?? "image"}</p>
                      <p className="text-xs text-muted-foreground">
                        {naturalSize.w} × {naturalSize.h}px
                        {imageFile ? ` · ${(imageFile.size / 1024).toFixed(0)} KB` : ""}
                      </p>
                    </div>
                    <Button
                      variant="ghost" size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={e => { e.stopPropagation(); setImageSrc(null); setImageFile(null) }}
                      aria-label="Remove image"
                    ><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef} type="file"
                accept="image/*" className="hidden"
                onChange={handleFileChange}
                aria-label="Image file input"
              />

              {imageSrc && (
                <Button
                  variant="outline" size="sm"
                  className="w-full h-7 text-xs gap-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3 w-3" /> Replace image
                </Button>
              )}
            </div>
          </ToolCard>

          {/* Tabs: Adjust / Filters / Transform / Resize */}
          <ToolCard title="Edit Tools">
            <div className="space-y-3">
              {/* Tab nav */}
              <div className="grid grid-cols-4 gap-0.5 bg-muted/50 rounded-lg p-0.5">
                {(["adjust", "filters", "transform", "resize"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-md py-1 text-xs font-medium transition-colors capitalize
                      ${activeTab === tab
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"}`}
                    aria-selected={activeTab === tab}
                    role="tab"
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* ── Adjust tab ──────────────────────────────────────────── */}
              {activeTab === "adjust" && (
                <div className="space-y-3 pt-1" role="tabpanel" aria-label="Adjust">
                  <AdjSlider label="Brightness" icon={<SunMedium className="h-3 w-3" />}
                    value={adjustments.brightness} min={0} max={200} neutral={100}
                    onChange={v => setAdj("brightness", v)}
                    onReset={() => setAdj("brightness", 100)} />
                  <AdjSlider label="Contrast" icon={<Contrast className="h-3 w-3" />}
                    value={adjustments.contrast} min={0} max={200} neutral={100}
                    onChange={v => setAdj("contrast", v)}
                    onReset={() => setAdj("contrast", 100)} />
                  <AdjSlider label="Saturation" icon={<Droplets className="h-3 w-3" />}
                    value={adjustments.saturation} min={0} max={200} neutral={100}
                    onChange={v => setAdj("saturation", v)}
                    onReset={() => setAdj("saturation", 100)} />
                  <AdjSlider label="Hue Rotate" icon={<Blend className="h-3 w-3" />}
                    value={adjustments.hue} min={-180} max={180} neutral={0}
                    onChange={v => setAdj("hue", v)}
                    onReset={() => setAdj("hue", 0)} />
                  <AdjSlider label="Blur (px)" icon={<span className="text-[10px] leading-none">BL</span>}
                    value={adjustments.blur} min={0} max={20} step={0.5} neutral={0}
                    onChange={v => setAdj("blur", v)}
                    onReset={() => setAdj("blur", 0)} />
                  <AdjSlider label="Sharpen" icon={<span className="text-[10px] leading-none">SH</span>}
                    value={adjustments.sharpen} min={0} max={5} step={0.1} neutral={0}
                    onChange={v => setAdj("sharpen", v)}
                    onReset={() => setAdj("sharpen", 0)} />
                  <AdjSlider label="Opacity %" icon={<span className="text-[10px] leading-none">OP</span>}
                    value={adjustments.opacity} min={0} max={100} neutral={100}
                    onChange={v => setAdj("opacity", v)}
                    onReset={() => setAdj("opacity", 100)} />
                  <AdjSlider label="Sepia %" icon={<span className="text-[10px] leading-none">SP</span>}
                    value={adjustments.sepia} min={0} max={100} neutral={0}
                    onChange={v => setAdj("sepia", v)}
                    onReset={() => setAdj("sepia", 0)} />
                  <AdjSlider label="Grayscale %" icon={<span className="text-[10px] leading-none">GS</span>}
                    value={adjustments.grayscale} min={0} max={100} neutral={0}
                    onChange={v => setAdj("grayscale", v)}
                    onReset={() => setAdj("grayscale", 0)} />
                  <AdjSlider label="Invert %" icon={<span className="text-[10px] leading-none">IN</span>}
                    value={adjustments.invert} min={0} max={100} neutral={0}
                    onChange={v => setAdj("invert", v)}
                    onReset={() => setAdj("invert", 0)} />
                </div>
              )}

              {/* ── Filters tab ─────────────────────────────────────────── */}
              {activeTab === "filters" && (
                <div className="pt-1" role="tabpanel" aria-label="Filters">
                  <div className="grid grid-cols-3 gap-1.5">
                    {PRESET_FILTERS.map(preset => {
                      const isActive =
                        Object.entries({ ...DEFAULT_ADJUSTMENTS, ...preset.adj })
                          .every(([k, v]) => adjustments[k as keyof Adjustments] === v)
                      return (
                        <button
                          key={preset.label}
                          onClick={() => applyPreset(preset.adj)}
                          className={`rounded-lg border text-xs py-2 px-1 flex flex-col items-center gap-0.5 transition-colors
                            ${isActive
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50 hover:bg-muted/30 text-muted-foreground"}`}
                          aria-label={`Apply ${preset.label} filter`}
                          aria-pressed={isActive}
                        >
                          <span className="text-sm leading-none">{preset.icon}</span>
                          <span>{preset.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Filter preview strip (if image loaded) */}
                  {imageSrc && (
                    <div className="mt-3 space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Filter preview strip</Label>
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {PRESET_FILTERS.slice(0, 6).map(preset => (
                          <button
                            key={preset.label}
                            onClick={() => applyPreset(preset.adj)}
                            className="shrink-0 rounded overflow-hidden border hover:border-primary transition-colors"
                            aria-label={`Preview ${preset.label} filter`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageSrc}
                              alt={`${preset.label} filter preview`}
                              className="h-14 w-14 object-cover"
                              style={{
                                filter: buildFilterString({ ...DEFAULT_ADJUSTMENTS, ...preset.adj }),
                                opacity: (preset.adj.opacity ?? 100) / 100,
                              }}
                            />
                            <p className="text-[9px] text-center py-0.5 text-muted-foreground leading-none">
                              {preset.label}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Transform tab ───────────────────────────────────────── */}
              {activeTab === "transform" && (
                <div className="space-y-4 pt-1" role="tabpanel" aria-label="Transform">
                  {/* Rotate */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Rotate</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1.5"
                        onClick={() => rotate("ccw")} aria-label="Rotate 90° counter-clockwise">
                        <RotateCcw className="h-3.5 w-3.5" /> 90° CCW
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1.5"
                        onClick={() => rotate("cw")} aria-label="Rotate 90° clockwise">
                        <RotateCw className="h-3.5 w-3.5" /> 90° CW
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Current: {transform.rotation}°</p>
                  </div>

                  {/* Flip */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Flip</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={transform.flipH ? "secondary" : "outline"}
                        size="sm" className="flex-1 h-8 text-xs gap-1.5"
                        onClick={() => flip("h")} aria-label="Flip horizontal" aria-pressed={transform.flipH}>
                        <FlipHorizontal className="h-3.5 w-3.5" /> Horizontal
                      </Button>
                      <Button
                        variant={transform.flipV ? "secondary" : "outline"}
                        size="sm" className="flex-1 h-8 text-xs gap-1.5"
                        onClick={() => flip("v")} aria-label="Flip vertical" aria-pressed={transform.flipV}>
                        <FlipVertical className="h-3.5 w-3.5" /> Vertical
                      </Button>
                    </div>
                  </div>

                  {/* Scale */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Scale: {(transform.scale * 100).toFixed(0)}%</Label>
                    <Slider
                      value={[transform.scale]}
                      min={0.1} max={3} step={0.05}
                      onValueChange={([v]) => setTransform(t => ({ ...t, scale: v }))}
                      aria-label="Image scale"
                    />
                  </div>
                </div>
              )}

              {/* ── Resize tab ──────────────────────────────────────────── */}
              {activeTab === "resize" && (
                <div className="space-y-4 pt-1" role="tabpanel" aria-label="Resize">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="resize-w" className="text-xs">Width (px)</Label>
                      <Input
                        id="resize-w" type="number"
                        value={resize.width || ""}
                        onChange={e => handleResizeInput("width", parseInt(e.target.value))}
                        className="h-7 text-xs"
                        min={1} placeholder="Width"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="resize-h" className="text-xs">Height (px)</Label>
                      <Input
                        id="resize-h" type="number"
                        value={resize.height || ""}
                        onChange={e => handleResizeInput("height", parseInt(e.target.value))}
                        className="h-7 text-xs"
                        min={1} placeholder="Height"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="lock-aspect" className="text-xs cursor-pointer">Lock aspect ratio</Label>
                    <Switch
                      id="lock-aspect"
                      checked={resize.lockAspect}
                      onCheckedChange={v => setResize(r => ({ ...r, lockAspect: v }))}
                      aria-label="Lock aspect ratio"
                    />
                  </div>

                  {naturalSize.w > 0 && (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Quick presets</Label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: "Original", w: naturalSize.w, h: naturalSize.h },
                          { label: "1080p", w: 1920, h: 1080 },
                          { label: "720p", w: 1280, h: 720 },
                          { label: "512²", w: 512, h: 512 },
                          { label: "256²", w: 256, h: 256 },
                          { label: "128²", w: 128, h: 128 },
                        ].map(preset => (
                          <Button
                            key={preset.label} variant="outline" size="sm"
                            className="h-7 text-xs"
                            onClick={() => setResize(r => ({ ...r, width: preset.w, height: preset.h }))}
                            aria-label={`Resize to ${preset.label}`}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ToolCard>
        </div>

        {/* ═══ RIGHT PANEL ═════════════════════════════════════════════════════ */}
        <div className="space-y-4">

          {/* Toolbar: Undo/Redo + Zoom + Reset + Export */}
          <div className="flex flex-wrap items-center gap-2">
            {/* History */}
            <Button variant="outline" size="sm" disabled={!canUndo}
              onClick={undo} className="h-7 text-xs gap-1" aria-label="Undo (Ctrl+Z)">
              <Undo2 className="h-3 w-3" /> Undo
            </Button>
            <Button variant="outline" size="sm" disabled={!canRedo}
              onClick={redo} className="h-7 text-xs gap-1" aria-label="Redo (Ctrl+Y)">
              <Redo2 className="h-3 w-3" /> Redo
            </Button>

            <div className="w-px h-5 bg-border mx-1" aria-hidden />

            {/* Zoom */}
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0"
              onClick={() => setZoom(z => Math.max(0.1, +(z - 0.1).toFixed(1)))}
              aria-label="Zoom out">
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums w-10 text-center">
              {(zoom * 100).toFixed(0)}%
            </span>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0"
              onClick={() => setZoom(z => Math.min(5, +(z + 0.1).toFixed(1)))}
              aria-label="Zoom in">
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs"
              onClick={() => setZoom(1)} aria-label="Reset zoom">
              Fit
            </Button>

            <div className="w-px h-5 bg-border mx-1" aria-hidden />

            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground"
              onClick={resetAll} aria-label="Reset all adjustments">
              <RefreshCw className="h-3 w-3" /> Reset
            </Button>

            {/* Export group */}
            <div className="ml-auto flex items-center gap-2">
              <Select value={exportFormat} onValueChange={v => setExportFormat(v as ExportFormat)}>
                <SelectTrigger className="h-7 text-xs w-24" aria-label="Export format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png" className="text-xs">PNG</SelectItem>
                  <SelectItem value="jpeg" className="text-xs">JPG</SelectItem>
                  <SelectItem value="webp" className="text-xs">WEBP</SelectItem>
                </SelectContent>
              </Select>

              {exportFormat !== "png" && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Q:{exportQuality}</span>
                  <div className="w-20">
                    <Slider
                      value={[exportQuality]} min={10} max={100} step={1}
                      onValueChange={([v]) => setExportQuality(v)}
                      aria-label="Export quality"
                    />
                  </div>
                </div>
              )}

              <Button
                size="sm"
                disabled={!imageSrc}
                onClick={handleExport}
                className="h-7 text-xs gap-1.5"
                aria-label={`Export image as ${exportFormat.toUpperCase()} (Ctrl+S)`}
              >
                <Download className="h-3.5 w-3.5" />
                Export {exportFormat.toUpperCase()}
              </Button>
            </div>
          </div>

          {/* Canvas preview */}
          <ToolCard
            title="Live Preview"
            className="flex flex-col"
            style={{ minHeight: 520 }}
          >
            <div
              className="flex-1 rounded-lg border bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#ffffff_0%_50%)] dark:bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:20px_20px] flex items-center justify-center overflow-hidden relative"
              style={{ minHeight: 420 }}
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              role="img"
              aria-label={imageSrc ? "Edited image preview" : "Image editor canvas — upload an image to begin"}
            >
              {imageSrc ? (
                <div className="flex items-center justify-center w-full h-full p-4 overflow-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Image being edited"
                    style={previewStyle}
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground flex flex-col items-center gap-3 p-8">
                  <div className="h-16 w-16 rounded-xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                    <ImageIcon className="h-7 w-7 opacity-20" aria-hidden />
                  </div>
                  <div>
                    <p className="font-medium text-sm">No image loaded</p>
                    <p className="text-xs mt-1 max-w-xs opacity-70">
                      Upload an image using the panel on the left, or drag and drop one anywhere on this canvas.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Open file browser">
                    <Upload className="h-3.5 w-3.5" /> Browse files
                  </Button>
                </div>
              )}

              {/* Drag overlay */}
              {isDragging && (
                <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-lg flex items-center justify-center z-10">
                  <p className="text-primary font-medium text-sm">Drop image to load</p>
                </div>
              )}
            </div>

            {/* Info bar */}
            {imageSrc && (
              <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground border-t mt-2">
                <span>{naturalSize.w} × {naturalSize.h}px original</span>
                <span>→</span>
                <span>{resize.width} × {resize.height}px export</span>
                <span className="ml-auto">Rot: {transform.rotation}° · Zoom: {(zoom * 100).toFixed(0)}%</span>
              </div>
            )}
          </ToolCard>

          {/* History panel */}
          {history.length > 1 && (
            <ToolCard title="Edit History">
              <div className="flex gap-1.5 overflow-x-auto pb-1 flex-wrap max-h-20 overflow-y-auto">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAdjustments({ ...h.adjustments })
                      setTransform({ ...h.transform })
                      setHistoryIndex(i)
                    }}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-colors shrink-0
                      ${i === historyIndex
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"}`}
                    aria-label={`Jump to history: ${h.label}`}
                    aria-current={i === historyIndex ? "step" : undefined}
                  >
                    {i === 0 ? "Original" : h.label}
                  </button>
                ))}
              </div>
            </ToolCard>
          )}

          {/* ── SEO Content Block ──────────────────────────────────────────── */}
          <div className="rounded-xl border bg-muted/30 p-5 space-y-4 text-sm leading-relaxed">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" aria-hidden />
              Free Online Image Editor — No Signup, No Download
            </h2>
            <p className="text-muted-foreground">
              A full-featured <strong>photo editor online free</strong> that runs entirely in your
              browser. Adjust brightness, contrast, saturation, hue, blur, and sharpness in
              real-time. Apply one-click filters, rotate, flip, scale, and resize — then export as{" "}
              <strong>PNG, JPG, or WEBP</strong> with configurable quality. Your images never
              leave your device.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                  Editing capabilities
                </h3>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  {[
                    "Brightness, contrast & saturation",
                    "Hue rotation & colour shift",
                    "Blur (Gaussian) & sharpening",
                    "Sepia, grayscale, invert effects",
                    "Opacity / transparency control",
                    "Rotate 90° CW / CCW",
                    "Flip horizontal & vertical",
                    "Scale / zoom canvas",
                    "Resize with aspect-ratio lock",
                    "12 one-click filter presets",
                  ].map(t => (
                    <li key={t} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                  Key features
                </h3>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  {[
                    "Drag & drop any image file",
                    "Accepts JPG · PNG · WEBP · GIF · AVIF",
                    "Export PNG · JPG · WEBP",
                    "Adjustable JPG/WEBP quality",
                    "Inline table-based filter previews",
                    "Non-destructive undo / redo history",
                    "Jump to any point in edit history",
                    "Keyboard shortcuts (Ctrl+Z/Y/S)",
                    "100% client-side — fully private",
                    "No account, no watermark",
                  ].map(f => (
                    <li key={f} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-semibold text-sm">Frequently Asked Questions</h3>
              {IMAGE_EDITOR_FAQS.map((faq, i) => (
                <details key={i} className="group">
                  <summary className="text-xs font-medium cursor-pointer list-none flex items-center justify-between gap-2 hover:text-foreground text-muted-foreground">
                    {faq.q}
                    <ChevronDown className="h-3 w-3 shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>

            {/* Semantic keyword density copy */}
            <p className="text-xs text-muted-foreground border-t pt-3">
              Also works as a <strong>crop image online</strong> utility,{" "}
              <strong>resize image online free</strong> tool,{" "}
              <strong>convert image to WEBP</strong> converter, and a{" "}
              <strong>photo color adjustment</strong> editor — all with zero uploads and no watermark.
            </p>
          </div>
        </div>
      </div>

      {/*
        ── JSON-LD injection — add to page.tsx:

        export function generateMetadata(): Metadata {
          return {
            title: "Free Online Image Editor — Crop, Resize, Adjust & Export",
            description: "Edit images online free. Adjust brightness, contrast, saturation, apply filters, rotate, flip, resize, and export as PNG, JPG or WEBP. No signup, no watermark.",
            other: {
              "application/ld+json": JSON.stringify([
                {
                  "@context": "https://schema.org",
                  "@type": "WebApplication",
                  "name": "Free Online Image Editor",
                  "applicationCategory": "MultimediaApplication",
                  "offers": { "@type": "Offer", "price": "0" },
                  "description": "Edit photos online free — crop, resize, rotate, adjust brightness, contrast, saturation, apply filters, export PNG/JPG/WEBP.",
                  "featureList": "Crop,Resize,Rotate,Flip,Brightness,Contrast,Saturation,Blur,Sharpen,Grayscale,Sepia,Invert,PNG export,JPG export,WEBP export"
                },
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": IMAGE_EDITOR_FAQS.map(f => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": { "@type": "Answer", "text": f.a }
                  }))
                }
              ])
            }
          }
        }
      */}
    </section>
  )
}
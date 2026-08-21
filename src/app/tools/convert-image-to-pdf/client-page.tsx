"use client"

import React, { useState, useCallback, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ToolCard } from "@/components/layout/tool-layout"
import {
  Upload,
  Trash2,
  Download,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  FileText,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageItem {
  id: string
  file: File
  name: string
  url: string
  dataUrl: string
  pdfFormat: "JPEG" | "PNG"
  width: number
  height: number
  size: number
}

type PageSize = "a3" | "a4" | "a5" | "letter" | "legal"
type Orientation = "portrait" | "landscape"
type FitMode = "contain" | "cover" | "stretch" | "original"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateId = () => Math.random().toString(36).substring(2, 9)

const PAGE_SIZES: Record<PageSize, { width: number; height: number; label: string }> = {
  a3: { width: 297, height: 420, label: "A3 — 297 × 420 mm" },
  a4: { width: 210, height: 297, label: "A4 — 210 × 297 mm" },
  a5: { width: 148, height: 210, label: "A5 — 148 × 210 mm" },
  letter: { width: 215.9, height: 279.4, label: "Letter — 8.5 × 11 in" },
  legal: { width: 215.9, height: 355.6, label: "Legal — 8.5 × 14 in" },
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function isSupportedImageFile(file: File): boolean {
  return (
    file.type.startsWith("image/") ||
    /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(file.name)
  )
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("This image format could not be decoded."))
    img.src = src
  })
}

function normalizeImageForPdf(
  image: HTMLImageElement,
  file: File
): { dataUrl: string; pdfFormat: "JPEG" | "PNG"; width: number; height: number } {
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height
  if (!width || !height) throw new Error("Image has invalid dimensions.")

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas rendering is not supported in this browser.")

  const isJpeg = file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name)
  if (isJpeg) {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)
  }
  ctx.drawImage(image, 0, 0, width, height)

  if (isJpeg) {
    return {
      dataUrl: canvas.toDataURL("image/jpeg", 0.92),
      pdfFormat: "JPEG",
      width,
      height,
    }
  }

  return {
    dataUrl: canvas.toDataURL("image/png"),
    pdfFormat: "PNG",
    width,
    height,
  }
}

function computeImageRect(
  imgW: number,
  imgH: number,
  availW: number,
  availH: number,
  fitMode: FitMode
): { x: number; y: number; w: number; h: number } {
  const ratio = imgW / imgH

  if (fitMode === "stretch") {
    return { x: 0, y: 0, w: availW, h: availH }
  }

  if (fitMode === "cover") {
    const scaleW = availW / imgW
    const scaleH = availH / imgH
    const scale = Math.max(scaleW, scaleH)
    const w = imgW * scale
    const h = imgH * scale
    return { x: (availW - w) / 2, y: (availH - h) / 2, w, h }
  }

  if (fitMode === "original") {
    const pxToMm = 0.264583
    const w = Math.min(imgW * pxToMm, availW)
    const h = Math.min(imgH * pxToMm, availH)
    return { x: (availW - w) / 2, y: (availH - h) / 2, w, h }
  }

  // contain (default)
  const scaleW = availW / imgW
  const scaleH = availH / imgH
  const scale = Math.min(scaleW, scaleH)
  const w = imgW * scale
  const h = imgH * scale
  return { x: (availW - w) / 2, y: (availH - h) / 2, w, h }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ToolClient() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [pageSize, setPageSize] = useState<PageSize>("a4")
  const [orientation, setOrientation] = useState<Orientation>("portrait")
  const [margin, setMargin] = useState(10)
  const [fitMode, setFitMode] = useState<FitMode>("contain")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [converting, setConverting] = useState(false)
  const [previewIdx, setPreviewIdx] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Derived page dimensions (mm) ──
  const pageDims = useMemo(() => {
    const s = PAGE_SIZES[pageSize]
    return orientation === "landscape"
      ? { width: s.height, height: s.width }
      : { width: s.width, height: s.height }
  }, [pageSize, orientation])

  // ── File handling ──
  const addFiles = useCallback(async (files: FileList | File[]) => {
    const newItems: ImageItem[] = []
    const failed: string[] = []

    for (const file of Array.from(files)) {
      if (!isSupportedImageFile(file)) {
        failed.push(file.name)
        continue
      }

      let url: string | null = null
      try {
        url = URL.createObjectURL(file)
        const loadedImage = await loadImage(url)
        const pdfImage = normalizeImageForPdf(loadedImage, file)

        newItems.push({
          id: generateId(),
          file,
          name: file.name,
          url,
          dataUrl: pdfImage.dataUrl,
          pdfFormat: pdfImage.pdfFormat,
          width: pdfImage.width,
          height: pdfImage.height,
          size: file.size,
        })
      } catch (err) {
        if (url) URL.revokeObjectURL(url)
        console.error("Failed to add image:", err)
        failed.push(file.name)
      }
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems])
      setError(null)
    }
    if (failed.length > 0) {
      setError(`Could not add ${failed.length} file(s): ${failed.slice(0, 3).join(", ")}`)
    }
  }, [])

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id)
      if (img) URL.revokeObjectURL(img.url)
      return prev.filter((i) => i.id !== id)
    })
  }, [])

  const moveImage = useCallback((id: string, dir: "up" | "down") => {
    setImages((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      if (idx === -1) return prev
      if (dir === "up" && idx === 0) return prev
      if (dir === "down" && idx === prev.length - 1) return prev
      const next = [...prev]
      const swapIdx = dir === "up" ? idx - 1 : idx + 1
        ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.url))
    setImages([])
    setPreviewIdx(0)
    setError(null)
  }, [images])

  // ── Keep preview index in bounds ──
  const safePreviewIdx = Math.min(previewIdx, Math.max(images.length - 1, 0))

  // ── Convert to PDF ──
  const convertToPdf = useCallback(async () => {
    if (images.length === 0) return
    setConverting(true)
    setError(null)
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF({
        orientation: orientation === "portrait" ? "p" : "l",
        unit: "mm",
        format:
          pageSize === "letter"
            ? "letter"
            : pageSize === "legal"
              ? "legal"
              : pageSize,
      })

      const pageW = doc.internal.pageSize.getWidth()
      const pageH = doc.internal.pageSize.getHeight()
      const m = margin
      const availW = pageW - m * 2
      const availH = pageH - m * 2

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage()

        // background fill
        const r = parseInt(bgColor.slice(1, 3), 16)
        const g = parseInt(bgColor.slice(3, 5), 16)
        const b = parseInt(bgColor.slice(5, 7), 16)
        doc.setFillColor(r, g, b)
        doc.rect(0, 0, pageW, pageH, "F")

        const img = images[i]
        const rect = computeImageRect(img.width, img.height, availW, availH, fitMode)

        doc.addImage(img.dataUrl, img.pdfFormat, m + rect.x, m + rect.y, rect.w, rect.h)
      }

      doc.save("images-converted.pdf")
    } catch (err) {
      console.error("PDF conversion error:", err)
      setError("Failed to create the PDF. Try a smaller image or a different image format.")
    } finally {
      setConverting(false)
    }
  }, [images, pageSize, orientation, margin, fitMode, bgColor])

  // ── Preview computations ──
  const previewScale = useMemo(() => {
    const maxW = 400
    const maxH = 520
    const scaleW = maxW / pageDims.width
    const scaleH = maxH / pageDims.height
    return Math.min(scaleW, scaleH)
  }, [pageDims])

  const currentImage = images[safePreviewIdx]

  const previewImageRect = useMemo(() => {
    if (!currentImage) return null
    const m = margin
    const availW = pageDims.width - m * 2
    const availH = pageDims.height - m * 2
    return computeImageRect(currentImage.width, currentImage.height, availW, availH, fitMode)
  }, [currentImage, pageDims, margin, fitMode])

  // ── Drag & drop handlers ──
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles]
  )

  return (
    <section aria-label="Image to PDF Converter" className="w-full">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Settings Panel ── */}
        <ToolCard title="Image Settings">
          <div className="space-y-6">
            {/* Upload area */}
            <div
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/20"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              aria-label="Upload images by clicking or dragging files here"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click()
              }}
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-3" aria-hidden="true" />
              <p className="text-sm font-medium">
                Drop images here or <span className="text-primary underline">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, WebP, GIF, BMP, SVG
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files)
                  e.target.value = ""
                }}
                aria-label="Select image files"
              />
            </div>

            {error && (
              <div
                className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            {/* Image list */}
            {images.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>
                    <ImageIcon className="h-3.5 w-3.5 inline mr-1" aria-hidden="true" />
                    Images ({images.length})
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="h-7 text-xs text-muted-foreground hover:text-destructive"
                    aria-label="Remove all images"
                  >
                    <Trash2 className="h-3 w-3 mr-1" aria-hidden="true" /> Clear All
                  </Button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`flex items-center gap-2.5 rounded-lg border p-2 transition-colors ${idx === safePreviewIdx
                          ? "border-primary/50 bg-primary/5"
                          : "bg-muted/20 hover:bg-muted/30"
                        }`}
                    >
                      {/* Thumbnail */}
                      <div className="h-10 w-10 rounded-md overflow-hidden border bg-muted shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{img.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {img.width}×{img.height} · {formatBytes(img.size)}
                        </p>
                      </div>

                      {/* Reorder */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          disabled={idx === 0}
                          onClick={() => moveImage(img.id, "up")}
                          aria-label={`Move ${img.name} up`}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          disabled={idx === images.length - 1}
                          onClick={() => moveImage(img.id, "down")}
                          aria-label={`Move ${img.name} down`}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Preview & Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground shrink-0"
                        onClick={() => setPreviewIdx(idx)}
                        aria-label={`Preview ${img.name}`}
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => removeImage(img.id)}
                        aria-label={`Remove ${img.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Page Size */}
            <div className="space-y-2">
              <Label htmlFor="page-size">Page Size</Label>
              <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
                <SelectTrigger id="page-size" aria-label="Select page size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAGE_SIZES).map(([key, val]) => (
                    <SelectItem key={key} value={key}>
                      {val.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Orientation */}
            <div className="space-y-2">
              <Label>Orientation</Label>
              <div className="flex rounded-md border overflow-hidden text-xs font-medium" role="radiogroup" aria-label="Page orientation">
                {(["portrait", "landscape"] as Orientation[]).map((o) => (
                  <button
                    key={o}
                    role="radio"
                    aria-checked={orientation === o}
                    onClick={() => setOrientation(o)}
                    className={`flex-1 px-4 py-2 capitalize transition-colors ${orientation === o
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Margin */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Margin</Label>
                <span className="text-xs font-mono text-muted-foreground">{margin} mm</span>
              </div>
              <Slider
                value={[margin]}
                onValueChange={([v]) => setMargin(v)}
                min={0}
                max={40}
                step={1}
                aria-label="Page margin in mm"
              />
            </div>

            {/* Fit Mode */}
            <div className="space-y-2">
              <Label htmlFor="fit-mode">Image Fit</Label>
              <Select value={fitMode} onValueChange={(v) => setFitMode(v as FitMode)}>
                <SelectTrigger id="fit-mode" aria-label="Select image fit mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contain">Contain — fit inside, preserve ratio</SelectItem>
                  <SelectItem value="cover">Cover — fill area, preserve ratio</SelectItem>
                  <SelectItem value="stretch">Stretch — fill area, ignore ratio</SelectItem>
                  <SelectItem value="original">Original — native size, centered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label>Page Background</Label>
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 rounded-md overflow-hidden border shadow-sm shrink-0">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="absolute -top-2 -left-2 h-14 w-14 cursor-pointer opacity-0"
                    aria-label="Page background color picker"
                  />
                  <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
                </div>
                <Input
                  value={bgColor.toUpperCase()}
                  onChange={(e) => {
                    const v = e.target.value
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setBgColor(v)
                  }}
                  className="font-mono h-9 w-28 text-xs uppercase"
                  maxLength={7}
                  aria-label="Page background hex color"
                />
              </div>
            </div>
          </div>
        </ToolCard>

        {/* ── Preview & Export Panel ── */}
        <ToolCard title="Preview & Export">
          <div className="space-y-5 flex flex-col h-full">
            {/* PDF Preview */}
            <div className="flex items-center justify-center">
              <div
                className="relative rounded-lg border shadow-inner overflow-hidden"
                style={{
                  width: pageDims.width * previewScale,
                  height: pageDims.height * previewScale,
                  backgroundColor: bgColor,
                }}
                aria-label="PDF page preview"
              >
                {/* Margin indicator */}
                <div
                  className="absolute border border-dashed border-primary/20"
                  style={{
                    left: margin * previewScale,
                    top: margin * previewScale,
                    right: margin * previewScale,
                    bottom: margin * previewScale,
                  }}
                  aria-hidden="true"
                />

                {/* Image placement */}
                {currentImage && previewImageRect && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentImage.url}
                    alt={`Preview of ${currentImage.name}`}
                    className="absolute object-none"
                    style={{
                      left: (margin + previewImageRect.x) * previewScale,
                      top: (margin + previewImageRect.y) * previewScale,
                      width: previewImageRect.w * previewScale,
                      height: previewImageRect.h * previewScale,
                    }}
                  />
                )}

                {/* Empty state */}
                {!currentImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <FileText className="h-10 w-10 mb-2 opacity-40" aria-hidden="true" />
                    <p className="text-xs">Upload images to preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Page navigation */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={safePreviewIdx === 0}
                  onClick={() => setPreviewIdx((p) => Math.max(0, p - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium text-muted-foreground">
                  Page {safePreviewIdx + 1} of {images.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={safePreviewIdx >= images.length - 1}
                  onClick={() => setPreviewIdx((p) => Math.min(images.length - 1, p + 1))}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Page info */}
            <div className="rounded-lg border bg-muted/20 p-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Page Size</span>
                <span className="font-mono">
                  {pageDims.width.toFixed(1)} × {pageDims.height.toFixed(1)} mm
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Orientation</span>
                <span className="capitalize">{orientation}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Margin</span>
                <span className="font-mono">{margin} mm</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Image Fit</span>
                <span className="capitalize">{fitMode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Pages</span>
                <span>{images.length}</span>
              </div>
            </div>

            {/* Convert button */}
            <Button
              size="lg"
              className="w-full"
              disabled={images.length === 0 || converting}
              onClick={convertToPdf}
              aria-label="Convert images to PDF and download"
            >
              {converting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                  Converting…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  Convert to PDF ({images.length} {images.length === 1 ? "page" : "pages"})
                </>
              )}
            </Button>
          </div>
        </ToolCard>
      </div>
    </section>
  )
}

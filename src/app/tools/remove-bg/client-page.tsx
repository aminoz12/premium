"use client"

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useId,
  MouseEvent as ReactMouseEvent,
} from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useDropzone } from "react-dropzone"
import {
  Upload,
  Download,
  Image as ImageIcon,
  Zap,
  Eraser,
  Droplet,
  MousePointer2,
  Copy,
  Check,
  Sparkles,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface RgbColor {
  r: number
  g: number
  b: number
}

type RemovalMode = "color" | "flood" | "edge"

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 50 * 1024 * 1024
const DISPLAY_MAX_HEIGHT = 500
const PROCESS_DELAY_MS = 50
const COPIED_RESET_MS = 2000
const TOLERANCE_SCALE = 2.5

// ─── Utilities ────────────────────────────────────────────────────────────────

function colorDistance(c1: RgbColor, c2: RgbColor): number {
  return Math.sqrt(
    (c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RemoveBgClientPage() {
  const workCanvasRef = useRef<HTMLCanvasElement>(null)
  const resultCanvasRef = useRef<HTMLCanvasElement>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement>(null)

  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [hasResult, setHasResult] = useState(false)
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mode, setMode] = useState<RemovalMode>("color")
  const [tolerance, setTolerance] = useState(30)
  const [targetColor, setTargetColor] = useState<RgbColor | null>(null)
  const [copied, setCopied] = useState(false)

  const id = useId()

  // ── Dropzone ───────────────────────────────────────────────────────────────

  const drawOriginalToDisplay = useCallback((img: HTMLImageElement) => {
    const canvas = displayCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    const maxWidth = canvas.parentElement?.clientWidth ?? 800
    const scale = Math.min(1, maxWidth / img.width, DISPLAY_MAX_HEIGHT / img.height)
    canvas.width = img.width * scale
    canvas.height = img.height * scale
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      const img = new window.Image()
      img.onload = () => {
        setOriginalImage(img)
        setHasResult(false)
        setResultDataUrl(null)
        setTargetColor(null)
        drawOriginalToDisplay(img)
        URL.revokeObjectURL(url)
      }
      img.src = url
    },
  })

  // ── Canvas interaction ─────────────────────────────────────────────────────

  const handleCanvasClick = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!originalImage || !displayCanvasRef.current) return
    const canvas = displayCanvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return
    const pixel = ctx.getImageData(x, y, 1, 1).data
    const color: RgbColor = { r: pixel[0], g: pixel[1], b: pixel[2] }
    setTargetColor(color)
    processImage(color)
  }

  // ── Image processing ───────────────────────────────────────────────────────

  const processImage = useCallback(
    (colorToMatch: RgbColor | null = targetColor) => {
      if (!originalImage || !colorToMatch) return
      setIsProcessing(true)

      setTimeout(() => {
        const workCanvas = workCanvasRef.current
        if (!workCanvas) return

        workCanvas.width = originalImage.width
        workCanvas.height = originalImage.height
        const ctx = workCanvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) return

        ctx.drawImage(originalImage, 0, 0)
        const imageData = ctx.getImageData(0, 0, workCanvas.width, workCanvas.height)
        const data = imageData.data

        if (mode === "color" || mode === "flood") {
          const threshold = tolerance * TOLERANCE_SCALE
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] === 0) continue
            const dist = colorDistance(
              { r: data[i], g: data[i + 1], b: data[i + 2] },
              colorToMatch
            )
            if (dist < threshold) data[i + 3] = 0
          }
        }

        ctx.putImageData(imageData, 0, 0)

        const resultCanvas = resultCanvasRef.current
        if (resultCanvas) {
          resultCanvas.width = workCanvas.width
          resultCanvas.height = workCanvas.height
          const resultCtx = resultCanvas.getContext("2d")
          resultCtx?.putImageData(imageData, 0, 0)
        }

        setResultDataUrl(workCanvas.toDataURL("image/png"))
        setHasResult(true)
        setIsProcessing(false)
      }, PROCESS_DELAY_MS)
    },
    [originalImage, targetColor, tolerance, mode]
  )

  useEffect(() => {
    if (targetColor) processImage()
  }, [tolerance, mode, targetColor, processImage])

  // ── Export handlers ────────────────────────────────────────────────────────

  const handleDownload = () => {
    if (!resultDataUrl) return
    const link = document.createElement("a")
    link.download = "background-removed.png"
    link.href = resultDataUrl
    link.click()
  }

  const handleCopy = async () => {
    if (!resultCanvasRef.current) return
    try {
      resultCanvasRef.current.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), COPIED_RESET_MS)
      })
    } catch (err) {
      console.error("Failed to copy image:", err)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        <section
          aria-label="Background removal workspace"
          className="grid gap-6 lg:grid-cols-[300px_1fr] items-start"
        >
          <div className="space-y-6 lg:sticky lg:top-6">
            <ToolCard title="1. Upload Image">
              <div
                {...getRootProps()}
                role="button"
                tabIndex={0}
                aria-label="Drag and drop or click to upload an image"
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${isDragActive
                    ? "border-primary bg-primary/10 scale-[0.99]"
                    : "border-muted-foreground/25 hover:border-primary hover:bg-accent/50"
                  }`}
              >
                <input
                  {...getInputProps()}
                  id={`${id}-file-upload`}
                  aria-label="File upload"
                />
                <Upload
                  className="h-10 w-10 text-muted-foreground mb-3"
                  aria-hidden="true"
                />
                <p className="font-semibold text-sm mb-1">Click or drag image here</p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP · Max 50 MB
                </p>
              </div>
            </ToolCard>

            <ToolCard title="2. Removal Tools">
              <div className="space-y-6">
                <Tabs
                  value={mode}
                  onValueChange={(v) => setMode(v as RemovalMode)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="color" className="flex gap-2">
                      <Droplet className="h-4 w-4" aria-hidden="true" /> Magic Color
                    </TabsTrigger>
                    <TabsTrigger value="flood" className="flex gap-2">
                      <Eraser className="h-4 w-4" aria-hidden="true" /> Strict Edge
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="color"
                    className="text-sm text-muted-foreground mt-0"
                  >
                    Click any area on the image to erase all pixels that share a similar
                    color globally.
                  </TabsContent>
                  <TabsContent
                    value="flood"
                    className="text-sm text-muted-foreground mt-0"
                  >
                    Stricter mode ideal for solid-color backdrops such as green screens
                    or white studio backgrounds.
                  </TabsContent>
                </Tabs>

                <div className="space-y-4 pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`${id}-tolerance`} className="text-sm font-semibold">
                      Color Tolerance
                    </Label>
                    <span
                      className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded"
                      aria-live="polite"
                    >
                      {tolerance}%
                    </span>
                  </div>
                  <Slider
                    id={`${id}-tolerance`}
                    value={[tolerance]}
                    onValueChange={([val]) => setTolerance(val)}
                    min={1}
                    max={100}
                    step={1}
                    disabled={!originalImage}
                    aria-label="Adjust color removal tolerance"
                    aria-valuemin={1}
                    aria-valuemax={100}
                    aria-valuenow={tolerance}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher tolerance removes more shades of the selected color.
                  </p>
                </div>
              </div>
            </ToolCard>

            <ToolCard title="3. Export">
              <div className="grid gap-3">
                <Button
                  onClick={handleDownload}
                  disabled={!hasResult || isProcessing}
                  className="w-full gap-2 font-semibold shadow-sm"
                  aria-label="Download transparent PNG image"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!hasResult || isProcessing}
                  className="w-full gap-2 font-semibold bg-background"
                  aria-label="Copy transparent image to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                {hasResult && (
                  <a
                    href="/tools/remove-background-change-ai"
                    className="mt-2 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-foreground hover:bg-primary/10 transition-colors"
                  >
                    <Sparkles
                      className="h-4 w-4 text-primary shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="block">Result looks rough on hair or fur?</strong>
                      <span className="text-muted-foreground">
                        Try the AI Background Remover →
                      </span>
                    </span>
                  </a>
                )}
              </div>
            </ToolCard>
          </div>

          <ToolCard
            title="Workspace"
            className="min-h-[500px] flex flex-col relative overflow-hidden bg-[url('/checkered-bg.png')] bg-repeat bg-muted/20"
          >
            {isProcessing && (
              <div
                role="status"
                aria-label="Processing image"
                className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <Zap
                    className="h-8 w-8 animate-pulse text-primary"
                    aria-hidden="true"
                  />
                  <p className="font-semibold text-sm">Processing pixels…</p>
                </div>
              </div>
            )}

            {!originalImage ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 opacity-60">
                <ImageIcon
                  className="h-16 w-16 mb-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-lg font-medium text-foreground mb-2">
                  Workspace empty
                </p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Upload an image on the left to start removing its background.
                </p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col relative items-center justify-center overflow-hidden p-4 group">
                <canvas
                  ref={displayCanvasRef}
                  onClick={handleCanvasClick}
                  className={`max-w-full max-h-full object-contain cursor-crosshair rounded-lg shadow-sm border ${hasResult ? "hidden" : "block"
                    }`}
                  title="Click a color to remove it"
                  aria-label="Image canvas — click to select a color for removal"
                  role="img"
                />

                {hasResult && resultDataUrl && (
                  <img
                    src={resultDataUrl}
                    alt="Processed image with background removed"
                    className="max-w-full max-h-full object-contain drop-shadow-lg"
                  />
                )}

                {!hasResult && (
                  <div
                    aria-hidden="true"
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm border shadow-lg px-4 py-2 rounded-full flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 pointer-events-none group-hover:opacity-10 transition-opacity"
                  >
                    <MousePointer2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">
                      Click any color on the image to erase it
                    </span>
                  </div>
                )}
              </div>
            )}
          </ToolCard>
        </section>

        <canvas ref={workCanvasRef} className="hidden" aria-hidden="true" />
        <canvas ref={resultCanvasRef} className="hidden" aria-hidden="true" />
      </div>
    </>
  )
}

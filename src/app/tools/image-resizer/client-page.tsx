"use client"

import React, { useState, useRef, useCallback, useId } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { Upload, Download, Image as ImageIcon, Maximize2, Settings, HelpCircle, CheckCircle2 } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface SizePreset {
  name: string
  width: number
  height: number
}

const presets: SizePreset[] = [
  { name: "Original Size", width: 0, height: 0 },
  { name: "Social Media (1200×630)", width: 1200, height: 630 },
  { name: "HD (1920×1080)", width: 1920, height: 1080 },
  { name: "Thumbnail (150×150)", width: 150, height: 150 },
  { name: "Avatar (64×64)", width: 64, height: 64 },
  { name: "Custom", width: 0, height: 0 },
]

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [resized, setResized] = useState<string>("")
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 })
  const [newWidth, setNewWidth] = useState(800)
  const [newHeight, setNewHeight] = useState(600)
  const [maintainAspect, setMaintainAspect] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState("Custom")
  const [loading, setLoading] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const id = useId()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0]
    if (droppedFile) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = () => {
        const img = new window.Image()
        img.onload = () => {
          setOriginalSize({ width: img.width, height: img.height })
          setNewWidth(img.width)
          setNewHeight(img.height)
          setPreview(reader.result as string)
          setResized("")
          setSelectedPreset("Custom")
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(droppedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    maxFiles: 1,
    onDrop,
  })

  const resizeImage = useCallback(() => {
    if (!preview) return

    setLoading(true)
    const img = new window.Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const targetWidth = selectedPreset === "Original Size" ? img.width : newWidth
      const targetHeight = selectedPreset === "Original Size" ? img.height : newHeight

      canvas.width = targetWidth
      canvas.height = targetHeight

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Use better smoothing for resizing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
      
      // Keep original format if possible, fallback to png
      const format = file?.type || "image/png"
      setResized(canvas.toDataURL(format, 0.9))
      setLoading(false)
    }
    img.src = preview
  }, [preview, selectedPreset, newWidth, newHeight, file])

  const handleWidthChange = (value: string) => {
    const width = parseInt(value, 10) || 0
    setNewWidth(width)
    setSelectedPreset("Custom")
    if (maintainAspect && originalSize.width > 0) {
      setNewHeight(Math.max(1, Math.round((width / originalSize.width) * originalSize.height)))
    }
  }

  const handleHeightChange = (value: string) => {
    const height = parseInt(value, 10) || 0
    setNewHeight(height)
    setSelectedPreset("Custom")
    if (maintainAspect && originalSize.height > 0) {
      setNewWidth(Math.max(1, Math.round((height / originalSize.height) * originalSize.width)))
    }
  }

  const handlePresetChange = (name: string) => {
    setSelectedPreset(name)
    const preset = presets.find((p) => p.name === name)
    if (preset && preset.width > 0) {
      setNewWidth(preset.width)
      setNewHeight(preset.height)
    } else if (name === "Original Size") {
      setNewWidth(originalSize.width)
      setNewHeight(originalSize.height)
    }
  }

  const download = useCallback(() => {
    if (!resized || !file) return

    const link = document.createElement("a")
    const extension = file.name.split('.').pop() || "png"
    link.download = `${file.name.replace(/\.[^/.]+$/, "")}_resized.${extension}`
    link.href = resized
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [resized, file])

  return (
    <>
      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Free Online Image Resizer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quickly and securely resize your photos for social media, websites, or personal projects. Adjust dimensions accurately while preserving aspect ratios.
          </p>
        </header>

        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

        {/* Interactive Tool Section */}
        <section aria-label="Image Resizer Tool" className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="1. Upload Image">
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  isDragActive 
                    ? "border-primary bg-primary/10 scale-[0.99]" 
                    : "border-muted-foreground/25 hover:border-primary hover:bg-accent/50"
                }`}
                role="button"
                aria-label="Drag and drop area for image upload"
                tabIndex={0}
              >
                <input {...getInputProps()} id={`${id}-file-upload`} aria-label="File upload input" />
                <Upload className="h-14 w-14 text-muted-foreground mb-4" aria-hidden="true" />
                <h3 className="font-semibold text-lg mb-1">Drag & drop an image here</h3>
                <p className="text-sm text-muted-foreground">or click to browse from your device</p>
                <p className="text-xs text-muted-foreground mt-4">Supports JPG, PNG, WEBP, GIF</p>
              </div>

              {preview && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="p-4 bg-muted/50 rounded-lg border mb-4">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-6 w-6 text-primary shrink-0" aria-hidden="true" />
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate" title={file?.name}>{file?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Original: <span className="font-semibold">{originalSize.width} × {originalSize.height}px</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-2 bg-background/50 flex items-center justify-center min-h-[200px]">
                    <img
                      src={preview}
                      alt="Original uploaded image preview"
                      className="max-h-[250px] w-auto object-contain rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          </ToolCard>

          <ToolCard title="2. Resize Options">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor={`${id}-preset`}>Preset Sizes</Label>
                <Select value={selectedPreset} onValueChange={handlePresetChange}>
                  <SelectTrigger id={`${id}-preset`} aria-label="Select dimension preset">
                    <SelectValue placeholder="Select a size preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-width`}>Width (px)</Label>
                  <Input
                    id={`${id}-width`}
                    type="number"
                    min="1"
                    value={newWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    disabled={!preview || selectedPreset === "Original Size"}
                    aria-label="New image width in pixels"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${id}-height`}>Height (px)</Label>
                  <Input
                    id={`${id}-height`}
                    type="number"
                    min="1"
                    value={newHeight}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    disabled={!preview || selectedPreset === "Original Size"}
                    aria-label="New image height in pixels"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg border">
                <Checkbox
                  id={`${id}-aspect`}
                  checked={maintainAspect}
                  onCheckedChange={(checked) => setMaintainAspect(checked === true)}
                  disabled={!preview || selectedPreset === "Original Size"}
                />
                <Label htmlFor={`${id}-aspect`} className="text-sm cursor-pointer font-medium leading-none">
                  Maintain aspect ratio
                </Label>
              </div>

              {resized && (
                <div className="border rounded-lg p-2 bg-background/50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <img
                    src={resized}
                    alt="Resized image preview"
                    className="max-h-[200px] w-auto object-contain rounded"
                  />
                  <p className="text-center text-xs font-medium text-primary mt-3 bg-primary/10 py-1 px-3 rounded-full">
                    Output Size: {newWidth} × {newHeight}px
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  onClick={resizeImage} 
                  disabled={!preview || loading}
                  className="w-full"
                  aria-label="Process and resize the image"
                >
                  <Settings className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
                  {loading ? "Resizing..." : "Resize Image"}
                </Button>
                <Button 
                  variant="default" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={download} 
                  disabled={!resized}
                  aria-label="Download resized image"
                >
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Download
                </Button>
              </div>
            </div>
          </ToolCard>
        </section>

        {/* SEO Content Section */}
        <article className="mt-12 space-y-12 divide-y divide-border">
          
          <section className="pt-8">
            <h2 className="text-3xl font-bold mb-4">About Our Image Resizer</h2>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are preparing a profile picture, optimizing images for your website to improve loading times, or formatting a graphic for a specific social media platform, our <strong>Image Resizer</strong> is the perfect tool for the job. Everything processes directly in your browser, meaning your files are never uploaded to our servers, guaranteeing 100% privacy and lightning-fast speeds.
            </p>
          </section>

          <section className="pt-8 grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                How to Use the Tool
              </h2>
              <ol className="space-y-4 text-muted-foreground list-decimal list-inside marker:text-primary marker:font-bold">
                <li><strong>Upload your image:</strong> Drag and drop your file or click to select a JPG, PNG, WEBP, or GIF.</li>
                <li><strong>Choose a preset:</strong> Select a standard size from the dropdown, such as Social Media or Avatar.</li>
                <li><strong>Or set custom dimensions:</strong> Enter your exact target width and height in pixels.</li>
                <li><strong>Maintain Aspect Ratio:</strong> Keep the box checked to avoid stretching or distorting your image.</li>
                <li><strong>Resize and Download:</strong> Click "Resize Image" to preview, then hit "Download" to save your new file.</li>
              </ol>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Maximize2 className="h-6 w-6 text-primary" />
                Key Features
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>High-Quality Rendering:</strong> Uses advanced HTML5 Canvas smoothing to ensure crisp, clear results.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>100% Browser-Based:</strong> Secure client-side processing keeps your data completely private.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Instant Previews:</strong> See exact dimension changes and a visual preview before you download.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Format Retention:</strong> Automatically saves in the same extension you uploaded (e.g., keeps PNG transparency).</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <HelpCircle className="h-7 w-7 text-primary" />
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Does resizing an image reduce its quality?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Making an image smaller usually retains excellent quality while reducing the file size. However, enlarging an image past its original dimensions can cause it to become blurry or pixelated. We use high-quality canvas smoothing to minimize quality loss.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Are my images saved on your servers?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  No. This Image Resizer is built with modern browser technologies. All processing happens locally on your device. Your photos are never uploaded, stored, or viewed by anyone else.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">What does "Maintain aspect ratio" mean?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The aspect ratio is the proportional relationship between the width and height of your image. Keeping this checked ensures that when you change the width, the height automatically adjusts so your picture doesn't look stretched or squished.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">What file formats are supported?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our tool supports all standard web image formats, including JPEG (.jpg), PNG (.png), WebP (.webp), and GIF (.gif). The tool attempts to export your resized photo in the same format you uploaded.
                </p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <h3 className="font-semibold text-lg">Is this tool free to use?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Yes! Our Image Resizer is 100% free with no hidden fees, watermarks, or usage limits. You can resize as many images as you need.
                </p>
              </div>
            </div>
          </section>

        </article>
      </div>
    </>
  )
}
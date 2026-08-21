"use client"

import React, { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ToolCard } from "@/components/layout/tool-layout"
import { Upload, Package, Image as ImageIcon, Download, Copy, CheckCircle2, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FaviconResult {
  size: number
  url: string
}

export default function ToolClient() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [favicons, setFavicons] = useState<FaviconResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const sizes = [16, 32, 48, 64, 180, 192, 512]

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { 
      "image/png": [".png"], 
      "image/jpeg": [".jpg", ".jpeg"], 
      "image/webp": [".webp"], 
      "image/svg+xml": [".svg"] 
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles, fileRejections) => {
      setError("")
      if (fileRejections.length > 0) {
        setError("Invalid file. Please upload an image under 5MB.")
        return
      }

      const uploadedFile = acceptedFiles[0]
      if (uploadedFile) {
        setFile(uploadedFile)
        const reader = new FileReader()
        reader.onload = () => {
          setPreview(reader.result as string)
          generateFavicons(reader.result as string)
        }
        reader.onerror = () => {
          setError("Failed to read the file.")
        }
        reader.readAsDataURL(uploadedFile)
      }
    },
  })

  const generateFavicons = useCallback((src: string) => {
    setLoading(true)
    const img = new window.Image()
    
    img.onload = () => {
      const results: FaviconResult[] = []

      sizes.forEach((size) => {
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Optional: Ensure transparent background for PNGs
        ctx.clearRect(0, 0, size, size)
        
        // Draw and scale image
        ctx.drawImage(img, 0, 0, size, size)
        
        results.push({ 
          size, 
          url: canvas.toDataURL("image/png") 
        })
      })

      setFavicons(results)
      setLoading(false)
    }

    img.onerror = () => {
      setError("Failed to process the image. Ensure it is a valid image file.")
      setLoading(false)
    }

    img.src = src
  }, [])

  const downloadSingle = useCallback((size: number) => {
    const favicon = favicons.find((f) => f.size === size)
    if (!favicon) return

    const link = document.createElement("a")
    link.download = `favicon-${size}x${size}.png`
    link.href = favicon.url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [favicons])

  const downloadAll = async () => {
    if (favicons.length === 0) return
    
    // Using consecutive clicks with a slight delay to allow the browser to process multiple downloads
    for (const favicon of favicons) {
      downloadSingle(favicon.size)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  }

  const copyHtmlCode = async () => {
    const code = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">\n<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">`
    
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code", err)
    }
  }

  return (
    <section aria-label="Favicon Generator Tool" className="w-full space-y-6">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {error && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Upload Master Image">
          <div className="space-y-6 flex flex-col h-full">
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 min-h-[200px] ${
                isDragActive ? "border-primary bg-primary/5 scale-[0.98]" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
              } ${isDragReject ? "border-destructive bg-destructive/5" : ""}`}
            >
              <input {...getInputProps()} />
              <Upload className={`h-10 w-10 mb-4 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
              <p className="font-medium text-foreground text-center">Drag & drop your logo here</p>
              <p className="text-sm text-muted-foreground mt-1 text-center">or click to browse files</p>
              <div className="text-xs text-muted-foreground mt-4 text-center max-w-[250px]">
                Supports PNG, JPG, SVG. Recommended: Square image, transparent background, at least 512×512px.
              </div>
            </div>

            {preview && (
              <div className="mt-auto space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Original Preview</Label>
                <div className="border rounded-lg p-6 bg-[url('https://api.iconify.design/lucide/grid.svg?color=%23888888&width=20')] bg-muted/20 flex items-center justify-center">
                  <img
                    src={preview}
                    alt="Original Upload"
                    className="max-h-[120px] max-w-full rounded shadow-sm object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </ToolCard>

        <ToolCard title="Generated Favicons">
          <div className="space-y-6 flex flex-col h-full">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p>Generating standard sizes...</p>
              </div>
            ) : favicons.length > 0 ? (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 flex-1">
                  {favicons.map((favicon) => (
                    <div
                      key={favicon.size}
                      className="flex flex-col items-center justify-between p-3 border rounded-xl bg-card hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex-1 flex items-center justify-center p-2 bg-[url('https://api.iconify.design/lucide/grid.svg?color=%23888888&width=20')] bg-muted/20 rounded w-full mb-2">
                        <img
                          src={favicon.url}
                          alt={`Favicon ${favicon.size}x${favicon.size}`}
                          style={{ 
                            width: Math.min(favicon.size, 48), 
                            height: Math.min(favicon.size, 48) 
                          }}
                          className="rounded object-contain"
                        />
                      </div>
                      <div className="flex flex-col items-center w-full gap-2">
                        <span className="text-xs font-medium text-foreground">
                          {favicon.size}x{favicon.size}
                        </span>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                          onClick={() => downloadSingle(favicon.size)}
                          aria-label={`Download ${favicon.size}px favicon`}
                        >
                          <Download className="h-3 w-3 mr-1" aria-hidden="true" /> Get
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t mt-auto">
                  <Button onClick={downloadAll} className="w-full" size="lg">
                    <Package className="mr-2 h-4 w-4" aria-hidden="true" />
                    Download All Sizes (.png)
                  </Button>
                  <p className="text-[11px] text-muted-foreground text-center mt-2">
                    Note: Your browser might ask for permission to download multiple files.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-30" aria-hidden="true" />
                <p className="font-medium">No Image Uploaded</p>
                <p className="text-sm">Upload a master image to preview generated icons.</p>
              </div>
            )}
          </div>
        </ToolCard>
      </div>

      {favicons.length > 0 && (
        <ToolCard title="Implementation Code" className="animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">HTML Meta Tags</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyHtmlCode}
                className="h-8 text-xs"
                aria-label="Copy HTML tags"
              >
                {copied ? (
                  <><CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-green-500" aria-hidden="true" /> Copied!</>
                ) : (
                  <><Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Copy Code</>
                )}
              </Button>
            </div>
            <div className="relative rounded-lg overflow-hidden border bg-muted/50 p-4">
              <pre className="text-xs font-mono text-foreground/80 leading-relaxed overflow-x-auto">
{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">`}
              </pre>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Place your generated images in the root directory of your website and insert this code inside the <code>&lt;head&gt;</code> section of your HTML document.
            </p>
          </div>
        </ToolCard>
      )}
    </section>
  )
}
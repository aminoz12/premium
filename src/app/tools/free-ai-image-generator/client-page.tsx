"use client"

import React, { useId, useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolCard } from "@/components/layout/tool-layout"
import {
  DownloadCloud, AlertCircle, Sparkles, Image as ImageIcon,
  ChevronDown, ChevronUp, Clock, Wand2, Brush, Layout, RefreshCw, Cpu, ExternalLink
} from "lucide-react"

// Import Puter securely (dynamically later)

// Make faqs completely optional to prevent Next.js SSR crashes
interface ClientPageProps {
  faqs?: { q: string; a: string }[]
}

// ─── Rate Limit config ──────────────────────────────────────────────────
const RATE_LIMIT_KEY = "ai_image_usage"
const RATE_LIMIT_MAX = 20
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in ms

function getRateLimit() {
  // SSR Safe check for localStorage
  if (typeof window === "undefined") {
    return { count: 0, windowStart: Date.now() }
  }
  
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    if (!raw) return { count: 0, windowStart: Date.now() }
    return JSON.parse(raw)
  } catch {
    return { count: 0, windowStart: Date.now() }
  }
}

function incrementRateLimit() {
  if (typeof window === "undefined") return
  
  const now = Date.now()
  const data = getRateLimit()
  const inWindow = now - data.windowStart < RATE_LIMIT_WINDOW
  const next = inWindow
    ? { count: data.count + 1, windowStart: data.windowStart }
    : { count: 1, windowStart: now }
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(next))
}

function getRemainingTries() {
  if (typeof window === "undefined") return RATE_LIMIT_MAX
  
  const now = Date.now()
  const data = getRateLimit()
  if (now - data.windowStart >= RATE_LIMIT_WINDOW) return RATE_LIMIT_MAX
  return Math.max(0, RATE_LIMIT_MAX - data.count)
}

function getResetMinutes() {
  if (typeof window === "undefined") return 60
  
  const data = getRateLimit()
  const elapsed = Date.now() - data.windowStart
  return Math.ceil((RATE_LIMIT_WINDOW - elapsed) / 60000)
}

export default function ClientPage({ faqs }: ClientPageProps) {
  // BULLETPROOF CHECK: Guarantees safeFaqs is always an array, never undefined
  const safeFaqs = Array.isArray(faqs) ? faqs : []

  const [prompt, setPrompt] = useState("")
  const [aspectRatio, setAspectRatio] = useState<"square" | "landscape" | "portrait">("landscape")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  // Initialize with max, update in useEffect to prevent hydration mismatch
  const [remainingTries, setRemainingTries] = useState(RATE_LIMIT_MAX)
  
  const [appState, setAppState] = useState<"idle" | "processing" | "complete">("idle")
  const [progress, setProgress] = useState(0)
  const [magicMessage, setMagicMessage] = useState("")

  const id = useId()
  const resultsRef = useRef<HTMLDivElement>(null)

  // This runs only on the client, completely bypassing SSR errors
  useEffect(() => {
    setRemainingTries(getRemainingTries())
  }, [])

  const generateImage = async () => {
    if (!prompt.trim()) { 
      setError("Please enter an image description.")
      return 
    }
    if (remainingTries <= 0) {
      setError(`Rate limit reached. Resets in ${getResetMinutes()} min.`)
      return
    }

    setError("")
    setAppState("processing")
    setProgress(0)
    setImageUrl(null)
    setMagicMessage("Translating text prompt into visual concepts...")

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) setMagicMessage("Generating initial noise patterns...")
        else if (prev < 70) setMagicMessage("Refining details, lighting, and textures...")
        else if (prev < 90) setMagicMessage("Finalizing with Puter AI...")
        
        return prev >= 95 ? 95 : prev + 2;
      })
    }, 400)

    try {
      const finalPrompt = `${prompt.trim()}, ${aspectRatio} aspect ratio`
      
      const puter = (await import("@heyputer/puter.js")).default
      const imageElement = await puter.ai.txt2img(finalPrompt)

      clearInterval(timer)

      if (imageElement && imageElement.src) {
        setProgress(100)
        setImageUrl(imageElement.src)
        setAppState("complete")
        incrementRateLimit()
        setRemainingTries(getRemainingTries())
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
      } else {
        throw new Error("Invalid response from Puter.")
      }

    } catch (err) {
      console.error("Image generation failed:", err)
      clearInterval(timer)
      setError("Error generating image. Please ensure you are logged into Puter.com and try again.")
      setAppState("idle")
    }
  }

  const handleDownload = () => {
    if (!imageUrl) return
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `ai-art-${Date.now()}.png` 
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setAppState("idle")
    setImageUrl(null)
  }

  return (
    <article itemScope itemType="https://schema.org/SoftwareApplication">
      <meta itemProp="applicationCategory" content="DesignApplication" />
      <meta itemProp="operatingSystem" content="Web" />
      
      <ToolCard title="Free AI Image Generator">
        <div className="space-y-6">
          
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-blue-50 text-blue-800 rounded-md px-3 py-2 border border-blue-200">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Free Generations Remaining:
            </span>
            <span className={`font-semibold ${remainingTries === 0 ? "text-red-600" : "text-black  dark:text-white"}`}>
              {remainingTries} / {RATE_LIMIT_MAX} (Resets hourly)
            </span>
          </div>

          {appState === "idle" && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
              
              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "landscape", label: "Wide", icon: <Layout className="w-3 h-3 rotate-90" /> },
                    { id: "square", label: "Square", icon: <Layout className="w-3 h-3" /> },
                    { id: "portrait", label: "Tall", icon: <Layout className="w-3 h-3 -rotate-90" /> },
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setAspectRatio(ratio.id as any)}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-md border text-xs font-medium transition-all ${
                        aspectRatio === ratio.id 
                          ? "bg-primary/10 border-primary text-primary" 
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      {ratio.icon}
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`input-${id}`}>Image Description</Label>
                <Textarea
                  id={`input-${id}`}
                  placeholder="Describe the image you want to see... (e.g., A photorealistic portrait of a cyberpunk hacker in neon lighting, 8k resolution, cinematic)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px] resize-y leading-relaxed"
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-red-800 bg-red-50 rounded-md border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> 
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  onClick={generateImage}
                  disabled={!prompt.trim() || remainingTries <= 0}
                  className="w-full h-12 text-md"
                >
                  <Wand2 className="mr-2 h-5 w-5" /> Generate Image
                </Button>
                <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
                  * Note: You must be logged into 
                  <a href="https://puter.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline inline-flex items-center">
                    Puter.com <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                  </a> 
                  to use this free service.
                </p>
              </div>
            </div>
          )}

          {/* Magic Loading UI */}
          {appState === "processing" && (
            <div className="py-12 space-y-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-pulse"></div>
                <div className="bg-primary/10 p-4 rounded-full z-10">
                  <Brush className="w-10 h-10 text-primary animate-bounce" />
                </div>
              </div>

              <div className="space-y-3 w-full max-w-md">
                <h3 className="text-lg font-semibold tracking-tight">{magicMessage}</h3>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all ease-linear duration-300 rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1.5 animate-pulse">
                  <Cpu className="w-3.5 h-3.5" /> Rendering securely via Puter AI...
                </p>
              </div>
            </div>
          )}

          {/* Result UI */}
          {appState === "complete" && imageUrl && (
            <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="rounded-lg border overflow-hidden bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b p-3 bg-background gap-3">
                  <Label className="text-primary flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4" /> Generated successfully
                  </Label>
                  <Button variant="default" size="sm" onClick={handleDownload} className="h-8">
                    <DownloadCloud className="w-4 h-4 mr-2" /> Download High-Res Image
                  </Button>
                </div>
                
                <div className="p-4 flex justify-center bg-zinc-50/50 min-h-[300px] items-center">
                  <img 
                    src={imageUrl} 
                    alt={`AI Generated: ${prompt}`} 
                    className="rounded-md shadow-md object-contain max-h-[600px] w-auto max-w-full"
                    itemProp="image"
                  />
                </div>
                <div className="p-3 bg-background border-t text-xs text-muted-foreground italic text-center">
                  "{prompt}"
                </div>
              </div>

              <Button onClick={handleReset} variant="outline" className="w-full h-12">
                <RefreshCw className="w-4 h-4 mr-2" /> Create Another Masterpiece
              </Button>

            </div>
          )}
        </div>
      </ToolCard>

      <section className="mt-10 space-y-4" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-xl font-bold">How to Write Great AI Image Prompts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">1. Be Specific</h3>
            <p className="text-sm text-muted-foreground">Instead of "a dog", type "A golden retriever playing in a sunny park catching a red frisbee."</p>
          </div>
          <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
            <Brush className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">2. Add Art Styles</h3>
            <p className="text-sm text-muted-foreground">Include words like "Photorealistic", "Cyberpunk", "Watercolor", "3D Render", or "Anime style" to control the vibe.</p>
          </div>
          <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
            <Wand2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">3. Describe Lighting</h3>
            <p className="text-sm text-muted-foreground">Lighting makes a huge difference. Try adding "Cinematic lighting", "Golden hour", "Neon lights", or "Volumetric fog".</p>
          </div>
        </div>
      </section>

      {/* Renders safely only if safeFaqs has items */}
      {safeFaqs.length > 0 && (
        <section className="mt-8 space-y-3" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-bold">Frequently Asked Questions</h2>
          <div className="divide-y border rounded-lg overflow-hidden bg-card" itemScope itemType="https://schema.org/FAQPage">
            {safeFaqs.map((item, i) => (
              <div key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-medium hover:bg-muted/50 transition-colors"
                  aria-expanded={openFaq === i}
                >
                  <span itemProp="name">{item.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div 
                    className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed"
                    itemScope 
                    itemProp="acceptedAnswer" 
                    itemType="https://schema.org/Answer"
                  >
                    <span itemProp="text">{item.a}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SEO Optimized Context Section */}
      <section className="mt-12 p-6 bg-muted/30 border rounded-lg" aria-labelledby="seo-about-heading">
        <h2 id="seo-about-heading" className="text-lg font-bold mb-3">About Our Free AI Text-to-Image Generator</h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Welcome to our powerful <strong>free AI image generator</strong>. Powered by the advanced Puter.js AI ecosystem, this tool allows anyone to effortlessly convert text descriptions into stunning visual content. Whether you are a digital artist looking to create <strong>AI art</strong>, a marketer in need of <strong>custom graphics</strong>, or simply exploring the possibilities of <strong>artificial intelligence drawing tools</strong>, our generator provides high-quality results in seconds.
          </p>
          <p>
            Unlike complicated design software, our <strong>text-to-image AI</strong> is designed for ease of use. Simply enter your prompt, choose between landscape, square, or portrait aspect ratios, and watch as the machine learning algorithms create <strong>photorealistic portraits</strong>, <strong>cyberpunk landscapes</strong>, <strong>anime illustrations</strong>, or <strong>3D renders</strong> based entirely on your words. 
          </p>
          <p className="text-xs border-t pt-3 mt-4">
            <strong>Popular Keywords & Uses:</strong> AI image creator, free AI art generator online, text to image AI, make pictures with AI, Puter AI integration, digital painting generator, AI photo maker, free online AI graphic design, generate realistic images from text.
          </p>
        </div>
      </section>

    </article>
  )
}
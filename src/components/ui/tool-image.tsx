"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CATEGORY_FALLBACKS: Record<string, string> = {
  accessibility: "accessibility",
  astronomy: "astronomy",
  audio: "audio",
  calculator: "calculator",
  data: "data",
  design: "design",
  developer: "developer",
  education: "education",
  engineering: "developer",
  file: "file",
  finance: "finance",
  image: "image",
  random: "random",
  security: "security",
  seo: "seo",
  text: "text",
}

// ─── Multi-image gallery (used on tool pages) ────────────────────────────────

interface ToolImageGalleryProps {
  images: string[]   // ordered list produced by getToolImages()
  toolName: string
}

export function ToolImageGallery({ images, toolName }: ToolImageGalleryProps) {
  const [active, setActive] = useState(0)
  const [errored, setErrored] = useState<Set<number>>(new Set())

  const visible = images.filter((_, i) => !errored.has(i))
  if (!visible.length) return null

  const activeIdx = Math.min(active, visible.length - 1)
  const src = visible[activeIdx]

  const prev = () => setActive((i) => (i - 1 + visible.length) % visible.length)
  const next = () => setActive((i) => (i + 1) % visible.length)

  const handleError = (originalIdx: number) =>
    setErrored((prev) => new Set(prev).add(originalIdx))

  return (
    <div className="mb-6">
      {/* Main image */}
      <div className="group relative overflow-hidden rounded-2xl border bg-muted/30">
        <Image
          key={src}
          src={src}
          alt={
            activeIdx === 0
              ? `${toolName} — free online tool interface`
              : `${toolName} interface, screenshot ${activeIdx + 1}`
          }
          width={1200}
          height={675}
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-full w-full object-contain object-cover"
          onError={() => handleError(images.indexOf(src))}
          unoptimized
          priority={false}
        />

        {/* Prev / Next arrows — only when multiple images */}
        {visible.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous screenshot"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next screenshot"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {visible.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {visible.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`View screenshot ${i + 1}`}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === activeIdx
                  ? "border-primary shadow-sm scale-105"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover object-top"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface ToolMediaShowcaseProps {
  images: string[]
  toolName: string
  categoryId?: string // Added to determine the fallback
  video?: {
    mp4: string
  } | null
}

export function ToolMediaShowcase({
  images,
  toolName,
  categoryId = "developer", // Default to developer if none provided
  video,
}: ToolMediaShowcaseProps) {
  // Gate check: if no video and no images, return null
  if (!video && images.length === 0) return null

  const poster = images[0]
  const scrollerRef = useRef<HTMLDivElement>(null)
  
  // Resolve the fallback image based on category
  const fallbackKey = CATEGORY_FALLBACKS[categoryId.toLowerCase()] || "developer"
  const fallbackSrc = `/images/categories/${fallbackKey}.webp` // Adjust this path to match your public directory structure

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border bg-card/70 shadow-sm">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto p-4 scroll-smooth md:p-6"
      >
        {video ? (
          <article className="w-full shrink-0 snap-start overflow-hidden rounded-xl border bg-muted/30">
            <div className="border-b bg-card px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Video demo
              </p>
            </div>
            <video
              autoPlay
              loop
              muted
              preload="metadata"
              poster={poster}
              className="aspect-video w-full bg-black/5 object-contain"
              playsInline
            >
              <source src={video.mp4} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </article>
        ) : (
          <article className="w-full shrink-0 snap-start overflow-hidden rounded-xl border bg-muted/30">
            <div className="border-b bg-card px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {categoryId} Overview
              </p>
            </div>
            <div className="relative aspect-video w-full bg-muted/10">
              <Image
                src={fallbackSrc}
                alt={`${toolName} category overview`}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center opacity-90 transition-opacity hover:opacity-100"
                unoptimized
              />
            </div>
          </article>
        )}
      </div>
    </section>
  )
}

// ─── Single thumb used in category / tool-listing cards ──────────────────────

interface ToolThumbProps {
  /** Primary image path — e.g. "/images/json-formatter.webp" */
  src: string | null
  toolName: string
  className?: string
}

export function ToolThumb({ src, toolName, className }: ToolThumbProps) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return null

  return (
    <div className={`relative overflow-hidden ${className ?? "h-36 w-full"}`}>
      <Image
        src={src}
        alt={`${toolName} — free online tool`}
        fill
        sizes="(max-width: 640px) 100vw, 300px"
        className="object-cover object-top"
        onError={() => setFailed(true)}
        unoptimized
      />
    </div>
  )
}

// ─── Category banner ─────────────────────────────────────────────────────────

interface CategoryImageProps {
  src: string | null
  categoryName: string
  className?: string
}

export function CategoryImage({ src, categoryName, className }: CategoryImageProps) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return null

  return (
    <div className={`relative overflow-hidden rounded-xl ${className ?? "h-40 w-full"}`}>
      <Image
        src={src}
        alt={`Free ${categoryName} tools — browser-based, no sign-up`}
        fill
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover object-center"
        onError={() => setFailed(true)}
        unoptimized
        priority={false}
      />
    </div>
  )
}
"use client"

import Link from "next/link"
import { ArrowRight, CalendarClock, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

import { Breadcrumb } from "@/components/seo/Breadcrumb"
import { FAQSection } from "@/components/seo/FAQSection"
import { RelatedTools } from "@/components/tool/RelatedTools"
import { TrackToolVisit } from "@/components/tool/TrackToolVisit"
import { ToolFeedback } from "@/components/seo/tool-feedback"
import { AffiliateCTA } from "@/components/seo/affiliate-cta"
import { getToolSeoContent } from "@/lib/seo/tool-content"
import type { Tool } from "@/lib/tools/tools-config"
import { getToolById } from "@/lib/tools/tools-config"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRef } from "react"

interface ToolLayoutProps {
  toolId: string
  title?: string
  description?: string
  children: React.ReactNode
  images?: string[]
  videos?: { mp4: string } | null
}

// ─── Hero Media Block ────────────────────────────────────────────────────────

function HeroMediaBlock({
  images,
  videos,
  toolName,
}: {
  images: string[]
  videos: { mp4: string } | null
  toolName: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  const hasImages = images.length > 0
  const hasVideo = videos !== null

  if (!hasImages && !hasVideo) return null

  return (
    <div className="mb-8 space-y-4">
      {hasImages && (
        <div className="relative">
          {images.length > 1 && (
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll gallery left"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background/90 p-2 shadow-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((src, i) => (
              <div
                key={src}
                className="relative aspect-video w-full max-w-full shrink-0 snap-start overflow-hidden rounded-2xl border bg-muted sm:max-w-[calc(100%-2rem)]"
              >
                <img
                  src={src}
                  alt={`${toolName} screenshot ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll gallery right"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background/90 p-2 shadow-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          {images.length > 1 && (
            <div aria-hidden className="mt-3 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              ))}
            </div>
          )}
        </div>
      )}

      {hasVideo && (
        <div className="overflow-hidden rounded-2xl border bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={`${toolName} demo video`}
            className="w-full"
          >
            <source src={videos!.mp4} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="px-4 py-2 text-center text-xs text-muted-foreground">
            Live demo · {toolName}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── ToolLayout ──────────────────────────────────────────────────────────────

export function ToolLayout({
  toolId,
  title,
  description,
  children,
  images = [],
  videos = null,
}: ToolLayoutProps) {
  const tool = getToolById(toolId)
  const seo = getToolSeoContent(toolId)

  if (!tool || !seo) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p>Tool not found.</p>
      </div>
    )
  }

  const heading = title ?? seo.h1
  const summary = description ?? seo.introText
  const howToTitle =
    seo.howToSteps.length === 3
      ? `How to use ${tool.name} in 3 steps`
      : `How to use ${tool.name}`
  const contextualLinks = seo.relatedTools
    .filter((relatedTool) => relatedTool.id !== tool.id)
    .slice(0, 6)

  const showHeroMedia = images.length > 0 || videos !== null

  return (
    <>
      <TrackToolVisit toolId={toolId} />
      <div className="container mx-auto px-4 py-10">
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-10">
          {/* ── Main column ── */}
          <div className="min-w-0">
            <Breadcrumb items={seo.breadcrumbs} />

            {/* Intro header */}
            <header className="mb-8 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{seo.categoryName}</Badge>
                <Badge variant="default">★ Free forever</Badge>
                <Badge variant="outline">✓ No account</Badge>
                <Badge variant="outline">🔒 No upload</Badge>
                <Badge variant="outline">📴 Works offline</Badge>
                <Badge variant="outline" className="gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Updated {seo.updatedAtFormatted}
                </Badge>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <tool.icon className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                    {heading}
                  </h1>
                  <p className="tool-intro-text mt-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                    {summary}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <Link href="/tools" className="font-medium text-primary hover:underline">
                      Browse all tools
                    </Link>
                    <Link
                      href={`/categories/${seo.categoryId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      Browse more {seo.categoryName.toLowerCase()} tools
                    </Link>
                    <span className="text-muted-foreground/60 hidden sm:inline">·</span>
                    <span className="text-muted-foreground text-xs">
                      Built by{" "}
                      <Link href="/about" className="font-medium text-primary hover:underline">
                        Achraf A.
                      </Link>
                      , Full-Stack Developer · Morocco
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Hero media */}
            {showHeroMedia && (
              <HeroMediaBlock images={images} videos={videos} toolName={tool.name} />
            )}

            {/* Ad between hero and tool UI */}
           

            {/* Tool UI */}
            <section className="space-y-6">{children}</section>

          

            <ToolFeedback toolName={tool.name} />

            {/* Ad between feedback and content sections */}
          
            <section className="mt-4 space-y-10">
              {seo.whatIsContent.length > 0 ? (
                <>
                  <section className="rounded-3xl border bg-card/60 p-6 md:p-8">
                    <h2 className="text-2xl font-semibold tracking-tight">What is {tool.name}?</h2>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
                      {seo.whatIsContent.map((paragraph, index) => (
                        <p key={`${tool.id}-what-is-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                  {/* Ad after "What is" section */}
                </>
              ) : null}

              {seo.howToSteps.length > 0 || seo.benefits.length > 0 ? (
                <>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {seo.howToSteps.length > 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">{howToTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ol className="space-y-4">
                            {seo.howToSteps.map((step, index) => (
                              <li key={`${tool.id}-how-to-${index}`} className="flex gap-3">
                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                  {index + 1}
                                </span>
                                <div>
                                  <p className="font-medium">{step.title}</p>
                                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    {step.description}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </CardContent>
                      </Card>
                    ) : null}

                    {seo.benefits.length > 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Key features and benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                            {seo.benefits.map((benefit, index) => (
                              <li key={`${tool.id}-benefit-${index}`} className="flex gap-3">
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ) : null}
                  </div>
                  {/* Ad after How-To & Benefits */}
              
                </>
              ) : null}

              {seo.useCases.length > 0 || seo.differentiator.length > 0 ? (
                <>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {seo.useCases.length > 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Common use cases</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
                          {seo.useCases.map((paragraph, index) => (
                            <p key={`${tool.id}-use-case-${index}`}>{paragraph}</p>
                          ))}
                        </CardContent>
                      </Card>
                    ) : null}

                    {seo.differentiator.length > 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Why browser-based works better</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
                          {seo.differentiator.map((paragraph, index) => (
                            <p key={`${tool.id}-differentiator-${index}`}>{paragraph}</p>
                          ))}
                        </CardContent>
                      </Card>
                    ) : null}
                  </div>
                  {/* Ad after use-cases section */}
                </>
              ) : null}

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">You might also need</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Continue this workflow with nearby browser-based tools so you can validate,
                    convert, and ship output without context switching.
                  </p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    <li>
                      <Link
                        href={`/categories/${seo.categoryId}`}
                        className="block rounded-xl border p-3 text-sm transition-colors hover:border-primary/50 hover:bg-muted/20"
                      >
                        <span className="font-medium">
                          Free {seo.categoryName.toLowerCase()} tools category page
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          See every browser-based {seo.categoryName.toLowerCase()} workflow in one index.
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        className="block rounded-xl border p-3 text-sm transition-colors hover:border-primary/50 hover:bg-muted/20"
                      >
                        <span className="font-medium">About this site</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          Who built these tools and why everything runs in your browser.
                        </span>
                      </Link>
                    </li>
                    {contextualLinks.map((relatedTool) => (
                      <li key={`${tool.id}-contextual-${relatedTool.id}`}>
                        <Link
                          href={relatedTool.path}
                          prefetch={false}
                          className="block rounded-xl border p-3 text-sm transition-colors hover:border-primary/50 hover:bg-muted/20"
                        >
                          <span className="font-medium">
                            Browser-based {relatedTool.name.toLowerCase()}
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {relatedTool.description}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">References and standards</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {seo.references.map((reference, index) => (
                      <li key={`${tool.id}-reference-${index}-${reference.url}`}>
                        <a
                          href={reference.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-full items-start justify-between gap-3 rounded-2xl border p-4 text-sm transition-colors hover:border-primary/50 hover:bg-muted/20"
                        >
                          <span>{reference.label}</span>
                          <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>


            <FAQSection faqs={seo.faqs} title={`${tool.name} FAQs`} />

         

            <RelatedTools tools={seo.relatedTools} currentSlug={tool.id} />

            {/* Ad after related tools */}
            
            <AffiliateCTA categoryId={seo.categoryId} />

            <section
              className="mt-10 rounded-3xl border bg-card/60 p-6 md:p-8"
              itemScope
              itemType="https://schema.org/Person"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Built and maintained by</p>
                  <Link
                    href="/about"
                    className="text-lg font-semibold hover:underline"
                    itemProp="name"
                  >
                    {seo.reviewedBy}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground" itemProp="description">
                    {seo.reviewerRole}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Last updated: <time dateTime={seo.updatedAt}>{seo.updatedAtFormatted}</time>
                  </p>
                  <p className="mt-1">Tested in Chrome, Firefox, and Safari on desktop and mobile.</p>
                </div>
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="hidden xl:block">
            <div className="space-y-6">
             
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Workflow shortcuts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <Link
                    href="/tools"
                    className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:border-primary/50 hover:bg-muted/20"
                  >
                    <span>Browse all tools</span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </Link>
                  <Link
                    href={`/categories/${seo.categoryId}`}
                    className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:border-primary/50 hover:bg-muted/20"
                  >
                    <span>Explore {seo.categoryName.toLowerCase()} tools</span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {seo.relatedTools.map((relatedTool) => (
                    <Link
                      key={relatedTool.id}
                      href={relatedTool.path}
                      prefetch={false}
                      className="block rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/30"
                    >
                      <p className="text-sm font-medium">{relatedTool.name}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {relatedTool.description}
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

// ─── ToolCard / ToolEmptyState ────────────────────────────────────────────────

export function ToolCard({
  title,
  children,
  className,
  style,
}: {
  title?: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Card className={className} style={style}>
      {title ? (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function ToolEmptyState({
  tool,
  title,
  description,
}: {
  tool: Tool
  title: string
  description: string
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/25 p-6 text-center">
      <tool.icon className="mb-3 h-8 w-8 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

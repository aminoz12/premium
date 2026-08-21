import React from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Search, ShieldCheck, Sparkles, Star, Zap, Globe, Lock } from "lucide-react"
import { JsonLd } from "@/components/seo/json-ld"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { Badge } from "@/components/ui/badge"
import { FAQSection } from "@/components/seo/FAQSection"
import { LazyCategories } from "@/components/tool/LazyCategories"
import { ToolThumb } from "@/components/ui/tool-image"
import { getHubPages } from "@/lib/hubs"
import { buildPageMetadata } from "@/lib/page-metadata"
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqSchema,
} from "@/lib/seo/schema"
import { siteConfig } from "@/lib/site-config"
import {
  getToolById,
  getToolsByCategory,
  liveTools,
  toolCategories,
} from "@/lib/tools/tools-config"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"

export const revalidate = 3600

const directoryFaqs = [
  {
    question: "Are all tools on this page completely free?",
    answer:
      "Yes — every tool listed here is 100% free, no account required, and runs directly in your browser. No subscription, no download, no hidden fees.",
  },
  {
    question: "Do these tools store my data?",
    answer:
      "No. All processing happens client-side in your browser. Files you upload and text you enter are never sent to our servers.",
  },
  {
    question: "Where should I start if I don't know the exact tool name?",
    answer:
      "Browse by category below or use the Search button above. Each category page explains the tools and recommends the best one for your use case.",
  },
  {
    question: "How do I find the right tool when I don't know its exact name?",
    answer:
      "Use the search bar at the top to describe what you want to do (e.g. 'compress image' or 'format JSON'). You can also browse by category — each category page lists tools with a short description of what they do and when to use them.",
  },
]

const priorityToolIds = [
  "json-formatter",
  "password-generator",
  "meta-tags",
  "image-compressor",
  "image-converter",
  "qr-code-generator",
  "word-counter",
  "base64-encoder",
  "sql-formatter",
  "dns-lookup",
  "ssl-checker",
  "uuid-generator",
]

const currentYear = new Date().getUTCFullYear()

export const metadata: Metadata = buildPageMetadata({
  title: `All Free Online Tools (${currentYear}) — ${liveTools.length}+ Browser Tools, No Signup`,
  description: `${liveTools.length}+ free online tools for ${currentYear}: developer, SEO, image, AI, and text utilities. No account, no install — open any tool and start instantly.`,
  path: "/tools",
  keywords: [
    "free online tools",
    "free online tools directory",
    "free tools online",
    "all free tools",
    "free browser tools",
    "free developer tools",
    "free seo tools",
    "free image tools",
    "free ai tools",
    "text tools online",
    "online calculators free",
    "no signup tools",
    `free online tools ${currentYear}`,
    `best free tools ${currentYear}`,
  ],
})

const TRUST_BADGES = [
  { icon: Zap, label: "Instant results" },
  { icon: Lock, label: "No data stored" },
  { icon: Globe, label: "Works everywhere" },
  { icon: ShieldCheck, label: "No account needed" },
]

export default function ToolsDirectoryPage() {
  const featuredTools = priorityToolIds
    .map((toolId) => {
      const tool = getToolById(toolId)
      if (!tool) return null
      return { ...tool, image: getPrimaryToolImage(toolId) }
    })
    .filter(Boolean) as (NonNullable<ReturnType<typeof getToolById>> & { image: string | null })[]

  const featuredHubs = getHubPages().slice(0, 6)
  const categoriesWithTools = toolCategories
    .map((category) => ({
      category,
      items: getToolsByCategory(category.id)
        .filter((tool) => tool.status !== "preview")
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter(({ items }) => items.length > 0)

  const schema = [
    {
      ...buildCollectionPageSchema({
        name: `${siteConfig.name} tools directory`,
        path: "/tools",
        description: `Browse ${liveTools.length}+ live browser-based tools across ${categoriesWithTools.length} categories.`,
        items: featuredTools.map((tool) => ({
          name: tool.name,
          path: tool.path,
          description: tool.description,
        })),
      }),
      dateModified: new Date().toISOString().slice(0, 10),
    },
    buildFaqSchema(directoryFaqs),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Tools", path: "/tools" },
    ]),
  ]

  return (
    <>
      <JsonLd id="tools-directory-schema" data={schema} />

      {/* Hero */}
      <div
        className="relative overflow-hidden border-b"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)" }}
      >
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="border-blue-400/40 bg-blue-800/40 text-blue-200">
              Updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </Badge>
            <Badge className="border-blue-400/40 bg-blue-800/40 text-blue-200">
              {liveTools.length}+ live tools
            </Badge>
            <Badge className="border-blue-400/40 bg-blue-800/40 text-blue-200">
              {categoriesWithTools.length} categories
            </Badge>
            <Badge className="border-blue-400/40 bg-blue-800/40 text-blue-200">
              Free forever
            </Badge>
          </div>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            All Free Online Tools ({currentYear})
          </h1>
          <p className="mb-6 max-w-2xl text-lg leading-7" style={{ color: "#bfdbfe" }}>
            Complete A-Z directory of {liveTools.length}+ free browser-based tools for developers, designers, writers, and marketers.
            No account. No download. Open any tool and get instant results.
          </p>

          {/* Trust badges */}
          <div className="mb-8 flex flex-wrap gap-4">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#93c5fd" }}>
                <Icon className="h-4 w-4" />
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/categories"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-blue-700 shadow-sm transition-opacity hover:opacity-90"
            >
              Browse all categories <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/search"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-blue-300/40 bg-blue-800/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-800/50"
            >
              <Search className="mr-2 h-4 w-4" />
              Search tools
            </Link>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-8"
          style={{
            background: "hsl(var(--background))",
            clipPath: "ellipse(55% 100% at 50% 100%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">Tools</li>
          </ol>
        </nav>

        <QuickAnswer
          question="What is TheFreeAITools?"
          answer={`TheFreeAITools is a free directory of ${liveTools.length}+ browser-based online tools across ${categoriesWithTools.length} categories — including image, PDF, developer, AI, text, SEO, and security tools. Every tool runs entirely in your browser with no account, no upload, and no cost.`}
        />

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_200px]">
          <section className="min-w-0 space-y-8">

            {/* Featured tools with images */}
            <div className="rounded-3xl border bg-card/60 p-6 md:p-8">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Most popular tools</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The highest-traffic tools across all categories — start here.
                  </p>
                </div>
                <Badge variant="outline">{featuredTools.length} top picks</Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featuredTools.map((tool, idx) => (
                  <React.Fragment key={tool.id}>
                    
                    <Link
                      href={tool.path}
                      prefetch={false}
                      className="group overflow-hidden rounded-2xl border bg-background transition-shadow hover:shadow-md"
                    >
                      {tool.image && (
                        <ToolThumb
                          src={tool.image}
                          toolName={tool.name}
                          className="h-36 w-full"
                        />
                      )}
                      {!tool.image && (
                        <div
                          className="flex h-28 w-full items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)" }}
                        >
                          <tool.icon className="h-10 w-10 text-blue-400" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground line-clamp-2">
                          {tool.description}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                          Open tool <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </div>
            

            {/* Category jump links */}
            <div className="rounded-3xl border bg-card/60 p-6 md:p-8">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Jump to a category</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Each category links to its full landing page and all tools underneath it.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoriesWithTools.map(({ category }) => (
                  <Link
                    key={category.id}
                    href={`#category-${category.id}`}
                    className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-muted/30"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Hub pages */}
            <div className="rounded-3xl border bg-card/60 p-6 md:p-8">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Topic guides & hub pages</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Curated pages that group tools by use case to help you find the right one fast.
                  </p>
                </div>
                <Badge variant="outline">{featuredHubs.length} hubs</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredHubs.map((page) => (
                  <article
                    key={page.slug}
                    className="rounded-2xl border bg-background p-5 transition-colors hover:border-primary/50 hover:bg-muted/20"
                  >
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                      <Star className="h-4 w-4" />
                      Editorial hub
                    </div>
                    <h3 className="text-lg font-semibold">
                      <Link href={`/${page.slug}`} prefetch={false} className="hover:text-primary">
                        {page.h1}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{page.description}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* Why section */}
            <div className="rounded-3xl border bg-card/60 p-6 md:p-8">
              <div className="mb-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border bg-background p-5">
                  <div className="mb-3 flex items-center gap-2 font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" />
                    No account required
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Every tool opens instantly. No signup, no email verification, no paywall.
                  </p>
                </div>
                <div className="rounded-2xl border bg-background p-5">
                  <div className="mb-3 flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Private by design
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    All processing runs in your browser. Your files and text never leave your device.
                  </p>
                </div>
                <div className="rounded-2xl border bg-background p-5">
                  <div className="mb-3 flex items-center gap-2 font-semibold">
                    <Search className="h-4 w-4 text-primary" />
                    {liveTools.length}+ tools, one place
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Bookmark this page as your go-to resource for any browser-based utility task.
                  </p>
                </div>
              </div>
            </div>

            {/* All categories lazy loaded */}
            <LazyCategories
              categoriesWithTools={categoriesWithTools.map(({ category, items }) => ({
                category: {
                  id: category.id,
                  name: category.name,
                  description: category.description,
                },
                items: items.map((tool) => ({
                  id: tool.id,
                  name: tool.name,
                  description: tool.description,
                  path: tool.path,
                })),
              }))}
            />

            <FAQSection faqs={directoryFaqs} title="Frequently asked questions" />

            {/* Bottom CTA */}
            <div
              className="rounded-2xl p-8 text-center"
              style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" }}
            >
              <h2 className="mb-2 text-xl font-bold text-slate-800">
                Can&apos;t find what you need?
              </h2>
              <p className="mb-5 text-sm text-slate-600">
                Use the search to find any tool by name or task — or browse the full categories page.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Search className="h-4 w-4" /> Search all tools
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-300 bg-white px-6 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  Browse categories <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </section>

          {/* Sidebar */}
          <aside className="hidden xl:block">
            <div className="sticky top-20 space-y-6">
              <section className="rounded-3xl border bg-card/60 p-5">
                <h2 className="text-lg font-semibold">Quick links</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <Link href="/categories" className="block text-primary hover:underline">
                    Browse all categories
                  </Link>
                  <Link href="/search" className="block text-primary hover:underline">
                    Search by keyword
                  </Link>
                </div>
              </section>

              <section
                className="rounded-3xl p-5 text-center"
                style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)" }}
              >
                <p className="mb-3 text-sm font-semibold text-white">Try our top AI tool</p>
                <Link
                  href="/tools/detect-text-ai"
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  AI Text Detector <ArrowRight className="h-3 w-3" />
                </Link>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

/**
 * Homepage — store/shop layout
 * SEO-first · simple for all users · no technical jargon
 * Visual: ultra-modern dark SaaS marketplace aesthetic with glassmorphism + neon glow
 */
import type { Metadata } from "next"

import React from "react"
import Link from "next/link"
import {
  Search,
  Shield,
  Star,
  Zap,
  ArrowRight,
  Image,
  FileText,
  Lock,
  Palette,
  Calculator,
  QrCode,
  KeyRound,
  Sparkles,
} from "lucide-react"
import { RecentTools } from "@/components/tool/RecentTools"
import { JsonLd } from "@/components/seo/json-ld"
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup"
import FAQSection from "@/components/ui/FaQ"
import { ToolThumb } from "@/components/ui/tool-image"
import { buildHomeMetadata } from "@/lib/seo/metadata"
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqSchema,
} from "@/lib/seo/schema"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import {
  getToolsByCategory,
  liveTools,
  toolCategories,
  tools,
} from "@/lib/tools/tools-config"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const base = buildHomeMetadata()
  return {
    ...base,
    alternates: {
      ...(typeof base.alternates === "object" ? base.alternates : {}),
      canonical: buildAbsoluteUrl("/"),
      languages: { "en-US": buildAbsoluteUrl("/"), "x-default": buildAbsoluteUrl("/") },
    },
  }
}

// ─── Featured tool order: everyday-friendly first ─────────────────────────────
// Curated from Google Search Console impression data: lead with the pages that
// already earn the most impressions (so the homepage — the site's strongest internal
// link source — passes equity to the tools closest to ranking on page 1), then keep a
// few evergreen-popular utilities for balance and user value.
const HOMEPAGE_FEATURED_IDS = [
  "text-to-word",
  "pdf-to-word",
  "word-to-pdf",
  "remove-bg",
  "change-background",
  "svg-editor",
  "ai-story-and-novel-generator",
  "favicon-generator",
  "audio-convertir-ai",
  "ai-audio-enhancer",
  "css-gradient",
  "zip-file-compressor",
  "random-phone-generator",
  "screenshot-capture",
  "ai-paraphrasing-tool-and-rewriter",
  "image-compressor",
  "word-counter",
  "base64-encoder",
  "hash-generator",
  "convert-pdf-to-image",
]

// ─── Tools by profession — one card per category, no duplicate destinations ──
const TOOLS_BY_PROFESSION = [
  {
    profession: "Free tools for developers",
    href: "/categories/developer",
    description: "JSON formatter, regex tester, JWT decoder, SQL formatter, hash generator, Base64 encoder, UUID generator, code converter.",
  },
  {
    profession: "Free tools for SEO & marketing",
    href: "/categories/seo",
    description: "Meta tags generator, robots.txt generator, sitemap generator, SSL checker, DNS lookup, QR codes, Open Graph generator, URL shortener.",
  },
  {
    profession: "Free tools for designers",
    href: "/categories/design",
    description: "Color picker, CSS gradient, box shadow, border radius, favicon generator, contrast checker, grid generator.",
  },
  {
    profession: "Free tools for writers, students & content teams",
    href: "/categories/text",
    description: "Word counter, AI paraphraser, lorem ipsum, case converter, AI text detector, story generator, text humanizer.",
  },
  {
    profession: "Free tools for image & video work",
    href: "/categories/image",
    description: "Image compressor, background remover, image converter, image resizer, AI image generator, video to audio.",
  },
  {
    profession: "Free tools for security & IT",
    href: "/categories/security",
    description: "Password generator, hash generator, bcrypt, JWT decoder, SSL checker, IP lookup, encoder/decoder.",
  },
]

// ─── Quick-action shortcuts shown below hero ───────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Text to Word", href: "/tools/text-to-word", Icon: FileText },
  { label: "Convert PDF to Word", href: "/tools/pdf-to-word", Icon: FileText },
  { label: "Remove background", href: "/tools/remove-bg", Icon: Image },
  { label: "Make a QR code", href: "/tools/qr-code-generator", Icon: QrCode },
  { label: "Generate a password", href: "/tools/password-generator", Icon: KeyRound },
  { label: "Pick a color", href: "/tools/color-picker", Icon: Palette },
]

// ─── Category tile accents (cycles by index) — neon gradient palette ──────────
const TILE_COLORS = [
  { ring: "from-blue-500/40 to-cyan-500/20", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500 dark:bg-blue-400", iconBg: "from-blue-500/30 to-blue-500/0" },
  { ring: "from-violet-500/40 to-fuchsia-500/20", text: "text-violet-700 dark:text-violet-300", dot: "bg-violet-500 dark:bg-violet-400", iconBg: "from-violet-500/30 to-violet-500/0" },
  { ring: "from-emerald-500/40 to-teal-500/20", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500 dark:bg-emerald-400", iconBg: "from-emerald-500/30 to-emerald-500/0" },
  { ring: "from-orange-500/40 to-rose-500/20", text: "text-orange-700 dark:text-orange-300", dot: "bg-orange-500 dark:bg-orange-400", iconBg: "from-orange-500/30 to-orange-500/0" },
  { ring: "from-pink-500/40 to-rose-500/20", text: "text-pink-700 dark:text-pink-300", dot: "bg-pink-500 dark:bg-pink-400", iconBg: "from-pink-500/30 to-pink-500/0" },
  { ring: "from-teal-500/40 to-cyan-500/20", text: "text-teal-700 dark:text-teal-300", dot: "bg-teal-500 dark:bg-teal-400", iconBg: "from-teal-500/30 to-teal-500/0" },
  { ring: "from-amber-500/40 to-yellow-500/20", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500 dark:bg-amber-400", iconBg: "from-amber-500/30 to-amber-500/0" },
  { ring: "from-rose-500/40 to-pink-500/20", text: "text-rose-700 dark:text-rose-300", dot: "bg-rose-500 dark:bg-rose-400", iconBg: "from-rose-500/30 to-rose-500/0" },
  { ring: "from-cyan-500/40 to-sky-500/20", text: "text-cyan-700 dark:text-cyan-300", dot: "bg-cyan-500 dark:bg-cyan-400", iconBg: "from-cyan-500/30 to-cyan-500/0" },
  { ring: "from-indigo-500/40 to-blue-500/20", text: "text-indigo-700 dark:text-indigo-300", dot: "bg-indigo-500 dark:bg-indigo-400", iconBg: "from-indigo-500/30 to-indigo-500/0" },
  { ring: "from-lime-500/40 to-emerald-500/20", text: "text-lime-700 dark:text-lime-300", dot: "bg-lime-500 dark:bg-lime-400", iconBg: "from-lime-500/30 to-lime-500/0" },
  { ring: "from-sky-500/40 to-blue-500/20", text: "text-sky-700 dark:text-sky-300", dot: "bg-sky-500 dark:bg-sky-400", iconBg: "from-sky-500/30 to-sky-500/0" },
]

// ─── What you can do — use-case rows for SEO text ─────────────────────────────
const USE_CASES = [
  {
    Icon: Image,
    color: "from-violet-500/20 to-fuchsia-500/0 dark:from-violet-500/30 dark:to-fuchsia-500/0 text-violet-700 dark:text-violet-300",
    heading: "Work with images",
    body: "Compress photos before sending them by email, resize pictures for social media, remove backgrounds, or pick the perfect color for a design project — all without installing any app.",
  },
  {
    Icon: FileText,
    color: "from-blue-500/20 to-cyan-500/0 dark:from-blue-500/30 dark:to-cyan-500/0 text-blue-700 dark:text-blue-300",
    heading: "Edit and format text",
    body: "Count words and characters in an essay, compare two documents side by side, convert text to different formats, or generate placeholder text for a presentation.",
  },
  {
    Icon: Lock,
    color: "from-emerald-500/20 to-teal-500/0 dark:from-emerald-500/30 dark:to-teal-500/0 text-emerald-700 dark:text-emerald-300",
    heading: "Stay safe online",
    body: "Create a strong unique password in one click, check how secure a password is, encode or decode data, and generate secure tokens — your data never leaves your device.",
  },
  {
    Icon: Calculator,
    color: "from-orange-500/20 to-rose-500/0 dark:from-orange-500/30 dark:to-rose-500/0 text-orange-700 dark:text-orange-300",
    heading: "Calculate anything",
    body: "BMI, loan repayments, unit conversions, date differences, and dozens of other everyday calculations — no spreadsheet or formula knowledge required.",
  },
]

// ─── How-it-works steps (featured-snippet eligible) ───────────────────────────
const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Pick a tool",
    body: "Browse by category or type what you need into the search bar. Every tool is labeled clearly — no jargon.",
  },
  {
    step: 2,
    title: "Use it instantly",
    body: "Open the tool and start right away. No account, no download, no waiting. Your data stays in your browser.",
  },
  {
    step: 3,
    title: "Get your result",
    body: "Copy, download, or share the output. That's it — fast, free, and private every single time.",
  },
]

// ─── FAQ ──────────────────────────────────────────────────────────────────────
// Each question is keyword-targeted to capture featured snippets ("People also ask").
const homepageFaqs = [
  {
    question: "What is the best free online tools website?",
    answer: `${siteConfig.name} is a free online tools directory with ${liveTools.length}+ browser-based utilities for SEO, developers, image editing, AI, text processing, calculators, and security. Every tool is 100% free, requires no signup, runs in your browser, and protects your privacy.`,
  },
  {
    question: "Are these online tools really 100% free?",
    answer: `Yes — every single tool on ${siteConfig.name} is 100% free forever. No subscription, no trial limit, no credit card, no hidden upgrade. The site is supported by non-intrusive ads, which is why we can keep all ${liveTools.length}+ tools free for everyone.`,
  },
  {
    question: "Do I need to create an account to use the tools?",
    answer: "No account, no email, no password — ever. Open any tool page and start using it instantly. We never ask for personal information to use any of the free tools on this site.",
  },
  {
    question: "Is my data safe? Are my files uploaded to a server?",
    answer: "Your data is completely safe. Almost every tool runs entirely inside your browser using JavaScript. Your photos, PDFs, passwords, and any text you paste never leave your device. The few AI-powered tools that need a server only send the minimum data required and never store it.",
  },
  {
    question: "Do these free tools work on iPhone, Android, and tablets?",
    answer: "Yes — every tool is fully responsive and works on iPhone, Android, iPad, and other tablets. Layouts automatically adapt to any screen size, and tools load fast even on slow mobile connections.",
  },
  {
    question: "Do I need to download or install anything?",
    answer: "Nothing to download, no apps to install, no browser extensions required. Open any page in Chrome, Safari, Firefox, Edge, or Brave and the tool works immediately. The whole site is a Progressive Web App — you can even add it to your home screen.",
  },
  {
    question: `How many free tools are available on ${siteConfig.name}?`,
    answer: `${liveTools.length}+ free tools across ${toolCategories.length} categories: text & writing, image editing, AI tools, password & security, developer utilities, SEO tools, file converters, calculators, colors & design, and accessibility checkers — all in one place, all free.`,
  },
  {
    question: "Can I use these tools offline without internet?",
    answer: "Most tools work fully offline after the first page load. This is useful on a plane, train, or anywhere with a slow or no connection. Look for the offline indicator on each tool page.",
  },
  {
    question: "Who can use these free online tools?",
    answer: "Everyone — students writing essays, developers debugging code, designers picking colors, SEO specialists optimizing pages, marketers creating QR codes, content writers counting words, small business owners generating invoices, and anyone who needs a quick, reliable utility without paying for expensive software.",
  },
  {
    question: "What is the best free image compressor online?",
    answer: "Our free Image Compressor works on JPG, PNG, and WebP, runs entirely in your browser (your files are not uploaded), and lets you trade off file size against quality with a live preview. Typical lossy savings at quality 80 are in the 60–80% range with no perceptible difference at normal screen resolutions.",
  },
  {
    question: "Is there a free PDF to Word converter without signup?",
    answer: "Yes — our PDF to Word converter is free with no signup. It handles standard text-based PDFs well. Heavily scanned PDFs, complex multi-column layouts, and embedded tables often need manual cleanup after conversion; that is a limitation of any PDF-to-Word pipeline, not just ours.",
  },
  {
    question: "How do I generate a strong password for free?",
    answer: "Use our free Password Generator — pick a length (16+ characters is a good baseline), choose which character classes to include, and click Generate. The password is created in your browser using the Web Crypto API's cryptographically secure randomness and is never sent to any server.",
  },
  {
    question: "How do these free tools compare to paid alternatives?",
    answer: "For everyday tasks (compressing an image, formatting JSON, generating a QR code, counting words), these free tools cover the same ground as paid alternatives with the added benefit that everything runs in your browser — your files are not uploaded. Paid tools tend to add value only for advanced or enterprise-specific features (OCR on scanned PDFs, team collaboration, bulk APIs).",
  },
  {
    question: "Why are these online tools completely free?",
    answer: `${siteConfig.name} is free because the tools run client-side in your browser, which means we don't pay for expensive servers to process your files. We cover the small cost of hosting through non-intrusive display ads, allowing us to keep ${liveTools.length}+ tools free forever.`,
  },
]


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const liveToolCount = tools.filter((t) => t.status !== "preview").length

  const featuredTwenty = HOMEPAGE_FEATURED_IDS
    .map((id) => {
      const tool = tools.find((t) => t.id === id && t.status !== "preview")
      if (!tool) return null
      return { ...tool, image: getPrimaryToolImage(id) }
    })
    .filter(Boolean) as (typeof tools[number] & { image: string | null })[]

  const categoriesWithTools = toolCategories
    .map((category) => ({
      category,
      items: getToolsByCategory(category.id).filter((t) => t.status !== "preview"),
    }))
    .filter(({ items }) => items.length > 0)

  // ── JSON-LD (WebSite schema already in layout — do NOT duplicate) ────────
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use free online tools on ${siteConfig.name}`,
    description: `Open any of ${liveToolCount}+ free browser-based tools — no account, no download.`,
    totalTime: "PT1M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    step: HOW_IT_WORKS.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.body,
    })),
  }

  return (
    <>
      {/* FAQPage schema — enables FAQ rich results */}
      <JsonLd id="schema-faq" data={buildFaqSchema(homepageFaqs)} />
      {/* CollectionPage schema — tells Google this is a curated directory */}
      <JsonLd
        id="schema-collection"
        data={buildCollectionPageSchema({
          name: `${siteConfig.name} — Free Online Tools`,
          path: "/",
          description: `${liveToolCount}+ free tools for images, text, passwords, calculators, and more. No sign-up required.`,
          items: featuredTwenty.map((t) => ({ name: t.name, path: t.path, description: t.description })),
        })}
      />
      {/* BreadcrumbList — clean breadcrumb trail in SERPs */}
      <JsonLd
        id="schema-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
        ])}
      />
      {/* HowTo — eligible for featured snippet / how-to rich result */}
      <JsonLd id="schema-howto" data={howToSchema} />

      <main
        id="main-content"
        className="relative overflow-hidden bg-background text-foreground"
      >
        {/* ════════════════════════════════════════════════
            Global ambient background — soft neon orbs + grid (dark only)
            ════════════════════════════════════════════════ */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 dark:opacity-100" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.12),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(34,211,238,0.10),_transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse at center, black 35%, transparent 75%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* ════════════════════════════════════════════════
              HERO
              ════════════════════════════════════════════════ */}
          <header className="relative pb-12 pt-16 text-center sm:pt-24">
            {/* Floating blur orbs behind hero — dark mode only */}
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 dark:opacity-100" aria-hidden="true">
              <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/30 blur-[120px]" />
              <div className="absolute right-10 top-32 h-64 w-64 rounded-full bg-purple-500/25 blur-[110px]" />
              <div className="absolute left-10 top-40 h-56 w-56 rounded-full bg-cyan-500/20 blur-[110px]" />
            </div>

            {/* Pill badge with year freshness signal */}
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:border-white/15 dark:bg-white/[0.04] dark:text-emerald-300 dark:shadow-[0_0_30px_rgba(16,185,129,0.15)] dark:backdrop-blur-xl">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 dark:bg-emerald-400" aria-hidden="true" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" aria-hidden="true" />
              </span>
              Updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} · {liveToolCount}+ tools · always free
            </span>

            {/* Brand overline */}
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-black  dark:text-white dark:text-blue-400" aria-hidden="true" />
              TheFreeAITools — For Everyday Tasks
              <Sparkles className="h-3 w-3 text-violet-600 dark:text-purple-400" aria-hidden="true" />
            </p>

            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:via-slate-100 dark:to-slate-300">
                {liveToolCount}+ Free Online Tools ({new Date().getFullYear()}) —{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-violet-400 dark:to-cyan-400 dark:drop-shadow-[0_0_30px_rgba(96,165,250,0.45)]">
                No Signup, No Download
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Compress images, generate passwords, create QR codes, format JSON, count words, and{" "}
              {liveToolCount - 5}+ more — all free, with no sign-up. Everything runs in your browser,
              so your files and data never leave your device.
            </p>

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 backdrop-blur-sm">
                <span aria-hidden="true">🔒</span> No file upload
              </span>
              <span className="flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 backdrop-blur-sm">
                <span aria-hidden="true">⚡</span> No signup ever
              </span>
              <span className="flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 backdrop-blur-sm">
                <span aria-hidden="true">📴</span> Works offline
              </span>
              <span className="flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 backdrop-blur-sm">
                <span aria-hidden="true">🌍</span> Used in 50+ countries
              </span>
            </div>

            {/* Primary CTAs above the fold */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/tools"
                className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 px-8 text-sm font-bold text-white shadow-lg transition-all hover:shadow-[0_0_40px_rgba(96,165,250,0.4)] dark:from-blue-500 dark:via-violet-500 dark:to-cyan-500 dark:shadow-[0_0_40px_rgba(96,165,250,0.45)] dark:hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-base"
              >
                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 opacity-0 blur-xl transition-opacity group-hover:opacity-70" aria-hidden="true" />
                Browse all {liveToolCount} free tools <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-7 text-sm font-semibold text-foreground transition-all hover:border-blue-400 hover:bg-muted/50 hover:text-black  dark:text-white dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-blue-400/60 dark:hover:bg-white/[0.08] dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 sm:text-base"
              >
                Browse by category
              </Link>
            </div>

            {/* Search bar — large, with glow in dark mode */}
            <div className="relative mx-auto mt-10 w-full max-w-2xl">
              <div className="pointer-events-none absolute -inset-1 -z-10 hidden rounded-3xl bg-gradient-to-r from-blue-500/40 via-violet-500/40 to-cyan-500/40 opacity-60 blur-2xl dark:block" aria-hidden="true" />
              <Link
                href="/search"
                className="group relative flex w-full items-center gap-3 rounded-2xl border border-border bg-background px-5 py-5 text-left text-muted-foreground shadow-sm transition-all hover:border-blue-400 hover:bg-muted/30 hover:shadow-md dark:border-white/15 dark:bg-slate-950/60 dark:shadow-[0_0_60px_rgba(59,130,246,0.25)] dark:hover:border-blue-400/60 dark:hover:bg-slate-950/80 dark:hover:shadow-[0_0_80px_rgba(139,92,246,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                aria-label="Search for a free tool by keyword"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-black  dark:text-white ring-1 ring-border dark:bg-gradient-to-br dark:from-blue-500/30 dark:to-violet-500/20 dark:text-blue-300 dark:ring-white/10">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex-1 text-base text-muted-foreground group-hover:text-foreground sm:text-lg">
                  What do you need help with?
                </span>
                <kbd className="hidden shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground dark:border-white/15 dark:bg-white/[0.06] sm:block">
                  ⌘ K
                </kbd>
              </Link>
            </div>
            

            {/* Quick actions */}
            <div
              className="mt-6 flex flex-wrap justify-center gap-2"
              aria-label="Popular tools quick links"
            >
              {QUICK_ACTIONS.map(({ label, href, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-blue-400/50 dark:hover:bg-white/[0.08] dark:hover:text-white dark:hover:shadow-[0_0_20px_rgba(96,165,250,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                  aria-label={label}
                >
                  <Icon className="h-3.5 w-3.5 text-black  dark:text-white transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-cyan-300" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Trust strip */}
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="text-emerald-600 dark:text-emerald-400">✓</span> Always free</span>
              <span className="inline-flex items-center gap-1.5"><span className="text-emerald-600 dark:text-emerald-400">✓</span> No account needed</span>
              <span className="inline-flex items-center gap-1.5"><span className="text-emerald-600 dark:text-emerald-400">✓</span> Your files stay private</span>
              <span className="inline-flex items-center gap-1.5"><span className="text-emerald-600 dark:text-emerald-400">✓</span> Works on any device</span>
            </div>

            <div className="relative mx-auto mt-10 w-full max-w-2xl text-left">
              <div className="rounded-2xl border border-border bg-muted/20 p-1 dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl">
                <NewsletterSignup
                  source="homepage_hero"
                  title="Get 1 free tool tip per week"
                  description="No spam. One actionable tip each week for SEO, content workflows, and browser-based productivity."
                />
              </div>
            </div>
          </header>


          {/* ════════════════════════════════════════════════
              POPULAR TOOLS — product card grid
              ════════════════════════════════════════════════ */}
          <section className="py-12" aria-labelledby="popular-heading">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 id="popular-heading" className="text-2xl font-bold sm:text-3xl">
                  <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">Most popular tools</span>
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Open any tool and start right away — no sign-up required.
                </p>
              </div>
              <Link
                href="/tools"
                className="shrink-0 text-sm font-semibold text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                aria-label={`View all ${liveToolCount}+ free tools`}
              >
                View all →
              </Link>
            </div>
            

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTwenty.map((tool, idx) => (
                <React.Fragment key={tool.id}>
                  {idx > 0 && idx % 4 === 0 && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center py-2">
                      
                    </div>
                  )}
                  <Link
                    href={tool.path}
                    prefetch={false}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-blue-400/50 dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_40px_rgba(96,165,250,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                    aria-label={`${tool.name}: ${tool.description}`}
                  >
                    {/* Hover glow gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:bg-blue-50/50 group-hover:opacity-100 dark:group-hover:bg-gradient-to-br dark:group-hover:from-blue-500/10 dark:group-hover:via-violet-500/5 dark:group-hover:to-cyan-500/10" aria-hidden="true" />


                    {/* Thumbnail or icon fallback */}
                    {tool.image ? (
                      <div className="relative h-32 w-full overflow-hidden border-b border-border">
                        <ToolThumb src={tool.image} toolName={tool.name} className="h-32 w-full transition-transform duration-500 group-hover:scale-[1.04]" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent dark:from-slate-950/60" aria-hidden="true" />
                      </div>
                    ) : (
                      <div
                        className="relative flex h-32 w-full items-center justify-center border-b border-border"
                        aria-hidden="true"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-violet-50 to-cyan-100 dark:from-blue-500/20 dark:via-violet-500/10 dark:to-cyan-500/20" />
                        <tool.icon className="relative h-12 w-12 text-blue-500 dark:text-blue-300 dark:drop-shadow-[0_0_20px_rgba(96,165,250,0.5)]" />
                      </div>
                    )}

                    <div className="relative p-4">
                      {/* FREE badge */}
                      <span className="absolute right-3 top-3 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 dark:shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                        FREE
                      </span>
                      {/* Icon + name */}
                      <div className="flex items-center gap-3 pr-10">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-black  dark:text-white ring-1 ring-border transition-all group-hover:bg-blue-600 group-hover:text-white dark:bg-gradient-to-br dark:from-blue-500/30 dark:to-violet-500/10 dark:text-blue-300 dark:ring-white/10 dark:group-hover:from-blue-500/60 dark:group-hover:to-violet-500/40 dark:group-hover:ring-blue-400/40"
                          aria-hidden="true"
                        >
                          <tool.icon className="h-4 w-4" />
                        </div>
                        <p className="font-semibold text-foreground transition-colors group-hover:text-black  dark:text-white dark:group-hover:text-white">
                          {tool.name}
                        </p>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
                        {tool.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-black  dark:text-white opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
                        Open tool <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </React.Fragment>
              ))}
            </div>
            

            {/* See all CTA */}
            <div className="relative mt-10 overflow-hidden rounded-2xl border border-border bg-muted/20 py-10 text-center dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/[0.04] via-violet-500/[0.04] to-cyan-500/[0.04]" aria-hidden="true" />
              <p className="mb-4 text-sm text-muted-foreground">
                Showing {featuredTwenty.length} of <strong className="text-foreground">{liveToolCount}+</strong> free tools
              </p>
              <Link
                href="/tools"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-[0_0_40px_rgba(96,165,250,0.3)] dark:from-blue-500 dark:via-violet-500 dark:to-cyan-500 dark:shadow-[0_0_40px_rgba(96,165,250,0.35)] dark:hover:shadow-[0_0_60px_rgba(139,92,246,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                aria-label={`Browse all ${liveToolCount}+ free tools`}
              >
                Browse all {liveToolCount}+ tools
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </section>

          {/* ════════════════════════════════════════════════
              HOW IT WORKS — featured-snippet eligible steps
              ════════════════════════════════════════════════ */}
          <section className="border-t border-border py-12" aria-labelledby="howto-heading">
            <div className="mb-10 text-center">
              <h2 id="howto-heading" className="text-2xl font-bold sm:text-3xl">
                <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">How it works</span>
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Three steps — that's all it takes to finish any task for free.
              </p>
            </div>

            <ol className="grid gap-5 sm:grid-cols-3">
              {HOW_IT_WORKS.map(({ step, title, body }) => (
                <li
                  key={step}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-blue-300 hover:bg-muted/30 dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-blue-400/40 dark:hover:bg-white/[0.06]"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100 dark:opacity-100 dark:group-hover:bg-violet-500/15" aria-hidden="true" />
                  <span className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white shadow-md dark:shadow-[0_0_25px_rgba(96,165,250,0.45)]" aria-hidden="true">
                    {step}
                  </span>
                  <h3 className="font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Recently used — below the fold, client component, zero CLS impact */}
          <RecentTools />

          {/* ════════════════════════════════════════════════
              TOOLS BY PROFESSION — captures "tools for [job]" queries
              ════════════════════════════════════════════════ */}
          <section className="border-t border-border py-12" aria-labelledby="profession-heading">
            <div className="mb-8 text-center">
              <h2 id="profession-heading" className="text-2xl font-bold sm:text-3xl">
                <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">Free online tools for every profession</span>
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
                Whether you&apos;re a developer, designer, student, marketer, writer, or content creator — find the right free tools for your work.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TOOLS_BY_PROFESSION.map(({ profession, description, href }) => (
                <Link
                  key={profession}
                  href={href}
                  prefetch={false}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-muted/30 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-blue-400/50 dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(96,165,250,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-black  dark:text-white dark:group-hover:text-white">
                    {profession}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-black  dark:text-white opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
                    Browse tools <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
            

          {/* ════════════════════════════════════════════════
              TRUST PROOF — concrete numbers + freshness signals
              ════════════════════════════════════════════════ */}
          <section className="border-t border-border py-12" aria-labelledby="proof-heading">
            <h2 id="proof-heading" className="sr-only">
              {siteConfig.name} — proof and trust signals
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: `${liveToolCount}+`, label: "Free tools" },
                { value: `${toolCategories.length}`, label: "Tool categories" },
                { value: "100%", label: "Free forever" },
                { value: "$0", label: "No subscription" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-blue-300 hover:bg-muted/30 dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-blue-400/40 dark:hover:bg-white/[0.06]"
                >
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/[0.04] to-violet-500/[0.04]" aria-hidden="true" />
                  <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-3xl font-extrabold text-transparent dark:from-blue-300 dark:via-violet-300 dark:to-cyan-300 sm:text-4xl">
                    {value}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </section>

            

          {/* ════════════════════════════════════════════════
              BROWSE BY CATEGORY — store shelves
              ════════════════════════════════════════════════ */}
          <section className="border-t border-border py-12" aria-labelledby="categories-heading">
            <div className="mb-8">
              <h2 id="categories-heading" className="text-2xl font-bold sm:text-3xl">
                <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">Browse by category</span>
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Not sure which tool you need? Start with a category.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categoriesWithTools.map(({ category, items }, i) => {
                const color = TILE_COLORS[i % TILE_COLORS.length]
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-white/25 dark:hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                    aria-label={`${category.name} — ${items.length} free tools`}
                  >
                    <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${color.ring} opacity-15 transition-opacity group-hover:opacity-30 dark:opacity-30 dark:group-hover:opacity-60`} aria-hidden="true" />
                    <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${color.iconBg} blur-2xl`} aria-hidden="true" />
                    <div className="relative flex items-center justify-between">
                      <span className={`text-sm font-semibold ${color.text}`}>
                        {category.name}
                      </span>
                      <ArrowRight className={`h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 ${color.text}`} aria-hidden="true" />
                    </div>
                    <div className="relative mt-4 flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${color.dot}`} aria-hidden="true" />
                      <span className="text-xs text-muted-foreground">{items.length} tools</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
            

          {/* ════════════════════════════════════════════════
              WHAT YOU CAN DO — SEO use-case section
              ════════════════════════════════════════════════ */}
          <section className="border-t border-border py-12" aria-labelledby="usecases-heading">
            <div className="mb-10 text-center">
              <h2 id="usecases-heading" className="text-2xl font-bold sm:text-3xl">
                <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">Everything you can do — for free</span>
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                No software to buy. No account to create. Just open a tool and get it done.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {USE_CASES.map(({ Icon, color, heading, body }) => (
                <div
                  key={heading}
                  className="group relative flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-blue-300 hover:bg-muted/30 dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-blue-400/40 dark:hover:bg-white/[0.06]"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  <div
                    className={`relative mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} ring-1 ring-border dark:ring-white/10`}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="relative">
                    <h3 className="font-bold text-foreground">{heading}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            

            {/* Extra SEO paragraph */}
            <div className="mx-auto mt-10 max-w-3xl space-y-4 text-center text-sm leading-7 text-muted-foreground">
              <p>
                <strong className="text-foreground">{siteConfig.name}</strong> is a free collection of{" "}
                <strong className="text-foreground">{liveToolCount}+ online tools</strong> that work directly in your web
                browser — no download, no installation, no account required. Whether you need to
                compress an image for email, count words in an essay, generate a strong password,
                create a QR code for your business, or format JSON for development — you will find
                a simple, free tool here.
              </p>
              <p>
                Every tool is <strong className="text-foreground">privacy-first</strong>: your files, text, and data never
                leave your device. Tools cover{" "}
                <Link href="/categories/image" className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300">image editing</Link>,{" "}
                <Link href="/categories/text" className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300">text processing</Link>,{" "}
                <Link href="/categories/developer" className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300">developer utilities</Link>,{" "}
                <Link href="/categories/security" className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300">security &amp; encoding</Link>,{" "}
                <Link href="/categories/seo" className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300">SEO &amp; web</Link>,{" "}
                <Link href="/categories/design" className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300">design &amp; CSS</Link>,
                and more.
              </p>
            </div>
          </section>
            

          {/* ════════════════════════════════════════════════
              WHY FREE — 3 simple trust cards
              ════════════════════════════════════════════════ */}
          <section className="border-t border-border py-12" aria-labelledby="why-heading">
            <h2 id="why-heading" className="mb-8 text-center text-2xl font-bold sm:text-3xl">
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">Why use {siteConfig.name}?</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  Icon: Shield,
                  glow: "from-blue-500 to-cyan-500",
                  shadow: "shadow-md dark:shadow-[0_0_25px_rgba(59,130,246,0.45)]",
                  title: "Your files stay private",
                  body: "Everything runs inside your browser. Nothing is uploaded to any server — ever.",
                },
                {
                  Icon: Star,
                  glow: "from-amber-400 to-orange-500",
                  shadow: "shadow-md dark:shadow-[0_0_25px_rgba(251,191,36,0.45)]",
                  title: "Always 100% free",
                  body: "No hidden plan, no trial, no credit card. Every tool is free, today and forever.",
                },
                {
                  Icon: Zap,
                  glow: "from-emerald-400 to-teal-500",
                  shadow: "shadow-md dark:shadow-[0_0_25px_rgba(16,185,129,0.45)]",
                  title: "Nothing to install",
                  body: "Open any browser on any device and start immediately. No app, no plugin, no setup.",
                },
              ].map(({ Icon, glow, shadow, title, body }) => (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-muted/30 dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-blue-400/40 dark:hover:bg-white/[0.06]"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  <div
                    className={`relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${glow} text-white ${shadow}`}
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="relative mb-2 font-bold text-foreground">{title}</h3>
                  <p className="relative text-sm leading-6 text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </section>
            

          {/* ════════════════════════════════════════════════
              POPULAR COLLECTIONS — pass homepage authority to cornerstone hubs + blog
              ════════════════════════════════════════════════ */}
          <section className="border-t border-border py-12" aria-labelledby="collections-heading">
            <div className="mb-8 text-center">
              <h2 id="collections-heading" className="text-2xl font-bold sm:text-3xl">
                <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">Popular free tool collections</span>
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
                Curated, hand-picked sets of free tools for common jobs — plus in-depth guides on how to use them.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Best Free SEO Tools", href: "/best-free-seo-tools", desc: "Meta tags, sitemaps, robots.txt, SSL & DNS checkers" },
                { label: "Free Developer Tools", href: "/free-developer-tools", desc: "JSON, SQL, JWT, regex, Base64 & more" },
                { label: "Free Image Tools", href: "/free-image-tools-online", desc: "Compress, convert, resize & remove backgrounds" },
                { label: "Free AI Writing Tools", href: "/free-ai-writing-tools", desc: "Paraphrase, humanize, detect & generate text" },
                { label: "Free JSON Tools", href: "/free-json-tools", desc: "Format, validate, convert & query JSON" },
                { label: "Privacy-First Tools", href: "/privacy-first-online-tools", desc: "Process data in your browser — never uploaded" },
                { label: "Tool guides & tutorials", href: "/blog", desc: "Hands-on guides for every tool, written by the founder" },
              ].map(({ label, href, desc }) => (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-muted/30 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-blue-400/50 dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_30px_rgba(96,165,250,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-black  dark:text-white dark:group-hover:text-white">
                    {label}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-black  dark:text-white opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
                    Explore <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
            

          {/* ════════════════════════════════════════════════
              INTERNAL LINKS — boost crawl depth & topical authority
              ════════════════════════════════════════════════ */}
          <section className="border-t border-border py-12" aria-labelledby="explore-heading">
            <h2 id="explore-heading" className="mb-8 text-center text-2xl font-bold sm:text-3xl">
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">Explore more</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "All tools", href: "/tools", desc: `Browse all ${liveToolCount}+ free tools` },
                { label: "Categories", href: "/categories", desc: "Find tools by topic" },
                { label: "Contact", href: "/contact", desc: "Get in touch with us" },
                { label: "About us", href: "/about", desc: "Our mission & privacy promise" },
              ].map(({ label, href, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="group rounded-2xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-muted/30 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-blue-400/50 dark:hover:bg-white/[0.06] dark:hover:shadow-[0_0_25px_rgba(96,165,250,0.2)]"
                >
                  <span className="block font-semibold text-foreground transition-colors group-hover:text-black  dark:text-white dark:group-hover:text-white">{label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{desc}</span>
                </Link>
              ))}
            </div>
          </section>

            

          {/* ════════════════════════════════════════════════
              CLOSING CTA — final conversion push before FAQ
              ════════════════════════════════════════════════ */}
          <section className="py-12" aria-labelledby="cta-heading">
            <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 p-10 text-center shadow-xl dark:shadow-[0_0_80px_rgba(96,165,250,0.35)] sm:p-14">
              {/* Decorative glow orbs */}
              <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
                <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl" />
              </div>
              <h2 id="cta-heading" className="mx-auto max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                Start using {liveToolCount}+ free online tools right now
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-blue-50 sm:text-base">
                No signup. No download. No credit card. Open any tool and get it done in seconds —
                free forever, private by design, and fast on every device.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/tools"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-bold text-blue-700 shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
                >
                  Browse all {liveToolCount}+ free tools
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search for a tool
                </Link>
              </div>
              <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-medium text-blue-50">
                <span className="inline-flex items-center gap-1.5">✓ 100% free</span>
                <span className="inline-flex items-center gap-1.5">✓ No account</span>
                <span className="inline-flex items-center gap-1.5">✓ Files stay private</span>
                <span className="inline-flex items-center gap-1.5">✓ Works offline</span>
              </p>
            </div>
          </section>
            

          {/* ════════════════════════════════════════════════
              FAQ
              ════════════════════════════════════════════════ */}
          <div className="border-t border-border">
            <FAQSection
              faqs={homepageFaqs}
              title="Frequently asked questions"
              description="Everything you need to know before getting started."
            />
          </div>
            


        </div>
      </main>
    </>
  )
}
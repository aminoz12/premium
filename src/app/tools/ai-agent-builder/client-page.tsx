"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Copy, Check, AlertCircle, Wand2,
  Eye, Code2, History, Download, RefreshCw,
  LayoutTemplate, Briefcase, BarChart2, Rocket,
  FileText, ShoppingBag, Box, TrendingUp, Sparkles,
  ChevronDown, ChevronUp, Zap, Shield, Globe,
  Cpu, Clock, CheckCircle2,
  Moon, Sun, Layers, AlignLeft, LayoutGrid, Gem,
  Smartphone, Tablet, Laptop, Monitor, Maximize2, X,
  Send, Plus, Lightbulb, Star,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
type AppState = "idle" | "processing" | "complete" | "error"
type TabType = "preview" | "code" | "history"
type StyleTheme = "modern" | "light" | "glassmorphism" | "minimal" | "brutalist" | "luxury"
type CssFramework = "tailwind" | "vanilla" | "bootstrap"
type ViewportSize = "mobile" | "tablet" | "laptop" | "desktop"
type PageTemplate =
  | "landing" | "portfolio" | "dashboard" | "saas"
  | "blog" | "ecommerce" | "3d" | "charts" | "animation"

interface GenerationRecord {
  id: string
  prompt: string
  template: PageTemplate
  style: StyleTheme
  model: string
  timestamp: Date
  html: string
  duration: number
}

// ─── Thinking Dots ────────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1 ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.9s" }}
        />
      ))}
    </span>
  )
}

// ─── Rate Limit ───────────────────────────────────────────────────────────────
const RATE_KEY = "aibuilder_rl_v3"
const RATE_MAX = 15

function getRateData(): { count: number; ts: number } {
  if (typeof window === "undefined") return { count: 0, ts: Date.now() }
  try {
    const d = JSON.parse(localStorage.getItem(RATE_KEY) || "{}")
    if (d.ts && Date.now() - d.ts > 3_600_000) return { count: 0, ts: Date.now() }
    return { count: d.count || 0, ts: d.ts || Date.now() }
  } catch {
    return { count: 0, ts: Date.now() }
  }
}
function incrementRate() {
  if (typeof window === "undefined") return
  const d = getRateData()
  localStorage.setItem(RATE_KEY, JSON.stringify({ count: d.count + 1, ts: d.ts || Date.now() }))
}
function checkRateLimit(): { allowed: boolean; minutesLeft?: number } {
  const d = getRateData()
  if (d.count >= RATE_MAX) {
    const minutesLeft = Math.ceil((3_600_000 - (Date.now() - d.ts)) / 60_000)
    return { allowed: false, minutesLeft }
  }
  return { allowed: true }
}

// ─── Constants ────────────────────────────────────────────────────────────────
const VIEWPORT_SIZES: Array<{ id: ViewportSize; label: string; icon: React.ReactNode; width: string; hint: string }> = [
  { id: "mobile",  label: "Mobile",  icon: <Smartphone className="w-3.5 h-3.5" />, width: "390px",  hint: "390px" },
  { id: "tablet",  label: "Tablet",  icon: <Tablet     className="w-3.5 h-3.5" />, width: "768px",  hint: "768px" },
  { id: "laptop",  label: "Laptop",  icon: <Laptop     className="w-3.5 h-3.5" />, width: "1024px", hint: "1024px" },
  { id: "desktop", label: "Desktop", icon: <Monitor    className="w-3.5 h-3.5" />, width: "100%",   hint: "Full" },
]

const FREE_MODELS: Array<{ id: string; label: string; provider: string; strength: string }> = [
  { id: "nvidia/nemotron-253b:free",    label: "Nemotron 253B",    provider: "NVIDIA",  strength: "Power" },
  { id: "openai/gpt-4o-mini:free",      label: "Llama 3.3 70B",    provider: "Meta",    strength: "General" },
  { id: "google/gemini-2.0-flash-free", label: "Gemini Flash 2.0", provider: "Google",  strength: "Speed" },
  { id: "alibaba/qwen3-coder-30b:free", label: "Qwen3 Coder 30B",  provider: "Alibaba", strength: "Code" },
  { id: "z-ai/glm-4.5-air:free",        label: "GLM 4.5 Air",      provider: "ZhipuAI", strength: "Efficient" },
  { id: "minimax/minimax-m2.5:free",    label: "MiniMax M2.5",     provider: "MiniMax", strength: "Creative" },
]

const TEMPLATES: Array<{
  id: PageTemplate; label: string; icon: React.ReactNode; description: string; examplePrompt: string
}> = [
  { id: "landing",   label: "Landing",   icon: <LayoutTemplate className="w-4 h-4" />, description: "Hero + CTA sections",   examplePrompt: "A modern SaaS landing page for a project management tool" },
  { id: "portfolio", label: "Portfolio", icon: <Briefcase      className="w-4 h-4" />, description: "Personal showcase",     examplePrompt: "A creative portfolio for a full-stack developer" },
  { id: "dashboard", label: "Dashboard", icon: <BarChart2      className="w-4 h-4" />, description: "Analytics & metrics",   examplePrompt: "An admin analytics dashboard with revenue charts" },
  { id: "saas",      label: "SaaS",      icon: <Rocket         className="w-4 h-4" />, description: "Product sales page",    examplePrompt: "An AI writing tool SaaS page with pricing" },
  { id: "blog",      label: "Blog",      icon: <FileText       className="w-4 h-4" />, description: "Editorial layout",      examplePrompt: "A tech blog homepage with article grid" },
  { id: "ecommerce", label: "Store",     icon: <ShoppingBag    className="w-4 h-4" />, description: "E-commerce storefront", examplePrompt: "A luxury fashion e-commerce homepage" },
  { id: "3d",        label: "3D Scene",  icon: <Box            className="w-4 h-4" />, description: "Three.js interactive",  examplePrompt: "An immersive page with Three.js particle background" },
  { id: "charts",    label: "Charts",    icon: <TrendingUp     className="w-4 h-4" />, description: "Data visualization",    examplePrompt: "A financial analytics dashboard with Chart.js charts" },
  { id: "animation", label: "Animated",  icon: <Sparkles       className="w-4 h-4" />, description: "GSAP scroll effects",   examplePrompt: "A creative agency landing page with GSAP animations" },
]

const STYLE_OPTIONS: Array<{ value: StyleTheme; label: string; desc: string; icon: React.ReactNode }> = [
  { value: "modern",        label: "Modern Dark",  desc: "Dark + neon accents",  icon: <Moon       className="w-3.5 h-3.5" /> },
  { value: "light",         label: "Clean Light",  desc: "White + professional", icon: <Sun        className="w-3.5 h-3.5" /> },
  { value: "glassmorphism", label: "Glass",        desc: "Frosted glass cards",  icon: <Layers     className="w-3.5 h-3.5" /> },
  { value: "minimal",       label: "Minimal",      desc: "Maximum whitespace",   icon: <AlignLeft  className="w-3.5 h-3.5" /> },
  { value: "brutalist",     label: "Brutalist",    desc: "Bold raw typography",  icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { value: "luxury",        label: "Luxury",       desc: "Dark gold serif",      icon: <Gem        className="w-3.5 h-3.5" /> },
]

const CSS_FRAMEWORKS: Array<{ value: CssFramework; label: string; badge: string }> = [
  { value: "tailwind",  label: "Tailwind CSS", badge: "Popular" },
  { value: "vanilla",   label: "Vanilla CSS",  badge: "Pure"    },
  { value: "bootstrap", label: "Bootstrap 5",  badge: "Classic" },
]

const QUICK_PROMPTS = [
  "SaaS landing page for a productivity app",
  "Developer portfolio with dark theme",
  "E-commerce store for skincare products",
  "Analytics dashboard with charts",
  "Agency homepage with animations",
  "Blog with newsletter signup",
]

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
function buildSystemPrompt(opts: {
  style: StyleTheme
  cssFramework: CssFramework
  useThreeJs: boolean
  useChartJs: boolean
  useGsap: boolean
  useAos: boolean
}): string {
  const styleGuides: Record<StyleTheme, string> = {
    modern: `THEME: Modern Dark
- Background: #09090b, surface: #18181b, borders: #27272a
- Primary: #6366f1 (indigo), secondary: #22d3ee (cyan)
- Text: #fafafa primary, #a1a1aa muted
- Cards: backdrop-filter:blur(16px), background:rgba(255,255,255,0.05), border:1px solid rgba(255,255,255,0.1)
- Glows: box-shadow with primary at 20% opacity on hover
- Gradient headings: background:linear-gradient(135deg,#6366f1,#22d3ee), -webkit-background-clip:text, color:transparent
- Buttons: background:linear-gradient(135deg,#6366f1,#8b5cf6), border-radius:12px`,
    light: `THEME: Clean Light Professional
- Background: #ffffff, alternate sections: #f8fafc, #f1f5f9
- Primary: #2563eb, secondary: #7c3aed
- Text: #0f172a primary, #475569 muted
- Cards: white, border:#e2e8f0, box-shadow:0 1px 3px rgba(0,0,0,0.08)
- Buttons: background:#2563eb, color:white, border-radius:8px
- Fonts: DM Sans or Plus Jakarta Sans from Google Fonts`,
    glassmorphism: `THEME: Glassmorphism Aurora
- Background: radial gradient mesh of #7c3aed, #2563eb, #db2777 on #050510
- Cards: background:rgba(255,255,255,0.07), backdrop-filter:blur(24px) saturate(180%), border:1px solid rgba(255,255,255,0.12)
- Text: white primary, rgba(255,255,255,0.7) muted
- Decorative: large blurred glow orbs (purple/blue/pink) absolutely positioned
- Buttons: background:rgba(255,255,255,0.1), border:1px solid rgba(255,255,255,0.2), hover:rgba(255,255,255,0.2)`,
    minimal: `THEME: Pure Minimal Editorial
- Background: #ffffff, zero visual decoration
- Typography first: massive type scales, generous line-height:1.7
- Single accent: #111111, used sparingly
- Zero gradients, zero box-shadows, thin 1px #e5e7eb borders only
- Font: Playfair Display for headings, system-ui for body
- Layout: centered single-column, extreme negative space`,
    brutalist: `THEME: Neo-Brutalist
- Background: #ffffff or #fffbf0
- ALL elements: border:2-3px solid #000000, border-radius:0 globally
- Font: Bebas Neue or Black Han Sans (Google Fonts), very large sizes
- Accent blocks: #ff0000, #ffff00, #0000ff as solid background patches
- Shadows: hard offset — box-shadow:4px 4px 0 #000
- Layout: intentionally broken grid, overlapping, raw power`,
    luxury: `THEME: High-End Luxury
- Background: #08080a, sections: #0d0d10
- Gold: #c9a96e primary, #e8d5a3 light, #8b6914 dark
- Font: Cormorant Garamond or Playfair Display (Google Fonts), letter-spacing:0.05em
- Text: #f5f0e8 primary, #a89070 muted
- Cards: border:1px solid rgba(201,169,110,0.2), subtle glow
- Buttons: gold gradient, uppercase, letter-spacing:0.15em, no border-radius`,
  }

  const cssGuides: Record<CssFramework, string> = {
    tailwind: `FRAMEWORK: Tailwind CSS
MANDATORY: include <script src="https://cdn.tailwindcss.com"></script> in <head>.
Use Tailwind utility classes for all styling. For values outside Tailwind, use inline style="".`,
    vanilla: `FRAMEWORK: Vanilla CSS
Write all styles inside a single <style> block in <head>.
Use :root CSS variables for the design system. Organize with section comments.
Use CSS Grid and Flexbox. No framework dependencies.`,
    bootstrap: `FRAMEWORK: Bootstrap 5
MANDATORY in <head>:
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
Use Bootstrap grid, components, and utilities. Extend with a custom <style> block.`,
  }

  const libs: string[] = []
  if (opts.useThreeJs) libs.push(`THREE.JS: Load from https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
Create a full-viewport WebGL canvas (position:fixed, z-index:-1) with 2000+ particle system, mouse-reactive rotation.`)
  if (opts.useChartJs) libs.push(`CHART.JS: Load from https://cdn.jsdelivr.net/npm/chart.js
Include 2-3 chart types (line, bar, doughnut) with realistic data matching the page theme.`)
  if (opts.useGsap) libs.push(`GSAP: Load from https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js
Stagger hero elements on load. Add scroll-triggered reveal animations via IntersectionObserver + GSAP.`)
  if (opts.useAos) libs.push(`AOS: Load CSS from https://unpkg.com/aos@2.3.1/dist/aos.css and JS from https://unpkg.com/aos@2.3.1/dist/aos.js
Init: AOS.init({duration:700,once:true,easing:'ease-out-cubic'}). Add data-aos on every section and card.`)

  return `You are a world-class frontend engineer and award-winning UI/UX designer. Your code is always stunning, production-grade, and complete.

════════════════════════════════════
OUTPUT RULES — NEVER VIOLATE:
════════════════════════════════════
1. Begin with "<!DOCTYPE html>" — absolutely nothing before it.
2. End with "</html>" — absolutely nothing after it.
3. Output ONLY raw HTML. Zero markdown fences, zero prose, zero explanations.
4. The entire page (CSS, JS, fonts) must be inside one single HTML file. CDN links allowed.
5. Valid HTML5: <!DOCTYPE html>, <html lang="en">, <head>, <body> all required.
6. NEVER output placeholder text like "Lorem ipsum" or "[Image here]" — all content must be real and compelling.

════════════════════════════════════
PROMPT ENHANCEMENT (CRITICAL RULE):
════════════════════════════════════
If the user prompt is vague, short, or underspecified (e.g. "make a website", "portfolio", "dark page"),
DO NOT ask for clarification. Instead, autonomously:
- Invent a compelling brand name, slogan, and complete value proposition
- Create realistic copy, pricing tiers, team bios, testimonials, feature descriptions
- Choose the most visually impressive layout for the page type
- Treat vague prompts as creative freedom — always output MAXIMUM quality

════════════════════════════════════
DESIGN SYSTEM:
════════════════════════════════════
${styleGuides[opts.style]}

════════════════════════════════════
${cssGuides[opts.cssFramework]}

${libs.length > 0 ? `════════════════════════════════════
REQUIRED LIBRARIES (ALL MUST BE USED):
════════════════════════════════════
${libs.join("\n\n")}

` : ""}════════════════════════════════════
REQUIRED PAGE SECTIONS (BUILD ALL):
════════════════════════════════════

1. STICKY HEADER
   - Logo (SVG icon + brand name) + nav links (5-6) + CTA button
   - Mobile hamburger with smooth JS toggle
   - On scroll: add blur backdrop + border (JS scroll listener)

2. HERO — minimum 90vh
   - Large impactful headline with gradient text or animated reveal
   - 2-3 line value proposition subheadline
   - Two CTA buttons (primary solid + secondary ghost)
   - Visual: CSS illustration, device mockup frame, or SVG art
   - Decorative: gradient orbs, grid overlay, or geometric shapes

3. SOCIAL PROOF STRIP
   - Scrolling marquee with 6 fictional company names OR stats bar (10K+ users, 4.9★, etc.)

4. FEATURES — 6 cards in a grid
   - Each card: SVG icon, title, 2-sentence description
   - Hover: lift + glow or border reveal animation

5. HOW IT WORKS — 3-4 numbered steps with icons and connecting lines

6. SHOWCASE / GALLERY
   - Landing/SaaS: browser frame product mockup (CSS-drawn)
   - Portfolio: project cards grid with hover overlay
   - E-commerce: 4 product cards with price and add-to-cart

7. TESTIMONIALS — 3 cards
   - Avatar (CSS initials circle), full name, role + company, 3-4 sentence quote, ★★★★★

8. PRICING (3 tiers) or CTA BANNER
   - Starter / Pro (highlighted "Most Popular") / Enterprise
   - Feature checklist per tier with ✓ and ✗
   - Annual/monthly toggle (JS-driven price swap)

9. FAQ ACCORDION — 6-8 items
   - Click to expand with CSS height transition
   - Use <details>/<summary> or JS-powered accordion

10. FOOTER — 4 link columns + social icons + copyright

════════════════════════════════════
ANIMATIONS (ALL REQUIRED):
════════════════════════════════════
- Hero: fade-in + slide-up on page load (CSS keyframes)
- Sections: IntersectionObserver scroll reveal — add class "visible" on enter
- Stats: count-up animation when entering viewport
- Buttons: transform:translateY(-2px) + shadow on hover
- Cards: translateY(-4px) lift on hover
- Smooth scroll: scroll-behavior:smooth on html

════════════════════════════════════
TECHNICAL REQUIREMENTS:
════════════════════════════════════
- Google Fonts: 2 fonts via CDN (1 display + 1 body)
- Responsive: 375px, 768px, 1024px, 1440px breakpoints
- Semantic HTML5: header, nav, main, section, article, footer
- Accessibility: aria-labels, alt text, heading hierarchy h1→h2→h3
- Meta: charset, viewport, description, og:title, og:description in <head>
- CSP: <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:">
- No eval(), no document.write(), no inline event handlers — use addEventListener
- Minimum output: 600+ lines. Make it look like a $15,000 agency site.

Generate the complete HTML page now:`
}

// ─── Sanitizer ────────────────────────────────────────────────────────────────
function sanitizeHtmlResponse(raw: string): string {
  let html = (raw || "").trim()
  html = html.replace(/^\s*```(?:html|HTML)?\s*\n?/i, "")
  html = html.replace(/\n?\s*```\s*$/i, "")
  const docTypeIdx = html.search(/<!DOCTYPE\s+html/i)
  const htmlTagIdx = html.search(/<html[\s>]/i)
  const firstHtmlIdx =
    docTypeIdx >= 0 && htmlTagIdx >= 0
      ? Math.min(docTypeIdx, htmlTagIdx)
      : Math.max(docTypeIdx, htmlTagIdx)
  if (firstHtmlIdx > 0) html = html.slice(firstHtmlIdx)
  const closingIdx = html.search(/<\/html\s*>/i)
  if (closingIdx >= 0) {
    const endIdx = closingIdx + html.match(/<\/html\s*>/i)![0].length
    html = html.slice(0, endIdx)
  }
  html = html.trim()
  const lowered = html.toLowerCase()
  if (!lowered.startsWith("<!doctype") && !lowered.startsWith("<html")) {
    html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Generated Page</title></head><body>${html}</body></html>`
  }
  return html
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientPage() {
  const [prompt, setPrompt] = useState("")
  const [template, setTemplate] = useState<PageTemplate>("landing")
  const [style, setStyle] = useState<StyleTheme>("modern")
  const [cssFramework, setCssFramework] = useState<CssFramework>("tailwind")
  const [selectedModel] = useState<string>("auto")
  const [useThreeJs, setUseThreeJs] = useState(false)
  const [useChartJs, setUseChartJs] = useState(false)
  const [useGsap, setUseGsap] = useState(false)
  const [useAos, setUseAos] = useState(false)

  const [appState, setAppState] = useState<AppState>("idle")
  const [activeTab, setActiveTab] = useState<TabType>("preview")
  const [error, setError] = useState("")
  const [progressMsg, setProgressMsg] = useState("")
  const [progress, setProgress] = useState(0)
  const [activeModel, setActiveModel] = useState("")

  const [generatedHtml, setGeneratedHtml] = useState("")
  // iframeSrc is set via useEffect exactly ONCE after generation — prevents reflow loop
  const [iframeSrc, setIframeSrc] = useState("")
  const [history, setHistory] = useState<GenerationRecord[]>([])
  const [copiedCode, setCopiedCode] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [rateData, setRateData] = useState(getRateData)
  const [genDuration, setGenDuration] = useState(0)
  const [viewport, setViewport] = useState<ViewportSize>("desktop")
  const [isFullscreen, setIsFullscreen] = useState(false)

  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const updateRateDisplay = useCallback(() => setRateData(getRateData()), [])

  // KEY FIX: set iframeSrc exactly once when html changes, never in render
  useEffect(() => {
    if (generatedHtml) setIframeSrc(generatedHtml)
  }, [generatedHtml])

  // ── Helpers ───────────────────────────────────────────────────────────────
  const selectTemplate = (t: PageTemplate) => {
    setTemplate(t)
    const tpl = TEMPLATES.find((x) => x.id === t)
    if (tpl) setPrompt(tpl.examplePrompt)
  }

  const copyCode = async () => {
    if (!generatedHtml) return
    try { await navigator.clipboard.writeText(generatedHtml) } catch {
      const ta = document.createElement("textarea")
      ta.value = generatedHtml
      document.body.appendChild(ta); ta.select()
      document.execCommand("copy"); document.body.removeChild(ta)
    }
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const downloadCode = () => {
    if (!generatedHtml) return
    const blob = new Blob([generatedHtml], { type: "text/html" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `${template}-page.html`
    a.click(); URL.revokeObjectURL(a.href)
  }

  const resetAll = () => {
    setAppState("idle"); setGeneratedHtml(""); setIframeSrc("")
    setPrompt(""); setError(""); setActiveTab("preview")
    setActiveModel(""); setGenDuration(0); setShowOptions(false)
  }

  // ── Generate ──────────────────────────────────────────────────────────────
  const generate = async () => {
    const trimmed = prompt.trim()
    if (!trimmed) { setError("Please describe the page you want to build."); return }

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY3
    if (!apiKey) { setError("OpenRouter API key not found. Add NEXT_PUBLIC_OPENROUTER_API_KEY3 to .env.local"); return }

    const { allowed, minutesLeft } = checkRateLimit()
    if (!allowed) { setError(`Rate limit reached (${RATE_MAX}/hr). Retry in ${minutesLeft}m.`); return }

    setError(""); setAppState("processing"); setProgress(0)
    setActiveTab("preview"); setIframeSrc(""); setGeneratedHtml("")
    startTimeRef.current = Date.now()

    const modelToUse = selectedModel === "auto"
      ? FREE_MODELS[Math.floor(Math.random() * FREE_MODELS.length)].id
      : selectedModel
    setActiveModel(modelToUse)

    const steps = [
      { pct: 8,  msg: "Analysing your request…" },
      { pct: 22, msg: "Planning page structure…" },
      { pct: 38, msg: "Writing HTML & CSS…" },
      { pct: 54, msg: "Adding animations…" },
      { pct: 68, msg: "Integrating libraries…" },
      { pct: 82, msg: "Polishing design…" },
      { pct: 93, msg: "Running final checks…" },
    ]
    let si = 0
    progressRef.current = setInterval(() => {
      if (si < steps.length) { setProgress(steps[si].pct); setProgressMsg(steps[si].msg); si++ }
    }, 1100)

    try {
      const systemPrompt = buildSystemPrompt({ style, cssFramework, useThreeJs, useChartJs, useGsap, useAos })
      const userMessage = `Page Template: ${template.toUpperCase()}
Visual Style: ${style}
CSS Framework: ${cssFramework}
User Request: ${trimmed}

IMPORTANT: Even if this prompt is vague or very short, produce a stunning, fully populated, professional page. Invent brand name, copy, pricing, testimonials, and all content autonomously. Never produce thin or placeholder output.`

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
          "X-Title": "AI Page Builder",
        },
        body: JSON.stringify({
          model: "z-ai/glm-4.5-air:free",
          max_tokens: 8000,
          temperature: 0.6,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      })

      clearInterval(progressRef.current!)
      setProgress(100); setProgressMsg("Rendering your page…")

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData?.error?.message || `API error ${response.status}`)
      }

      const data = await response.json()
      const raw = (data.choices?.[0]?.message?.content || "").trim()
      let html = sanitizeHtmlResponse(raw)

      if (cssFramework === "tailwind" && !/cdn\.tailwindcss\.com/i.test(html)) {
        html = html.replace(/<head([^>]*)>/i, `<head$1>\n<script src="https://cdn.tailwindcss.com"><\/script>`)
      }

      const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
      setGenDuration(duration)
      setGeneratedHtml(html) // triggers useEffect → sets iframeSrc once
      setAppState("complete")
      incrementRate(); updateRateDisplay()

      const modelInfo = FREE_MODELS.find((m) => m.id === modelToUse)
      setHistory((prev) => [{
        id: Date.now().toString(), prompt: trimmed, template, style,
        model: modelInfo?.label ?? modelToUse,
        timestamp: new Date(), html, duration,
      }, ...prev.slice(0, 9)])
    } catch (err: unknown) {
      clearInterval(progressRef.current!)
      setAppState("error")
      setError(err instanceof Error ? err.message : "Generation failed. Please try again.")
    }
  }

  const loadFromHistory = (record: GenerationRecord) => {
    setGeneratedHtml(record.html); setIframeSrc(record.html)
    setTemplate(record.template); setStyle(record.style)
    setPrompt(record.prompt); setGenDuration(record.duration)
    setActiveModel(record.model); setAppState("complete"); setActiveTab("preview")
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const rateCount = rateData.count
  const currentVP = VIEWPORT_SIZES.find((v) => v.id === viewport)!
  const activeModelInfo = FREE_MODELS.find((m) => m.id === activeModel)
  const isProcessing = appState === "processing"
  const isDone = appState === "complete" || (appState === "error" && !!generatedHtml)

  // Stable iframe style — never causes reflow
  const iframeWrapStyle: React.CSSProperties = {
    height: 536,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: viewport !== "desktop" ? "center" : "stretch",
    padding: viewport !== "desktop" ? "12px" : "0",
    overflow: "auto",
    background: "transparent",
  }
  const iframeStyle: React.CSSProperties = {
    width: viewport === "desktop" ? "100%" : currentVP.width,
    minWidth: viewport === "desktop" ? "100%" : currentVP.width,
    height: viewport === "desktop" ? "100%" : "680px",
    minHeight: viewport === "desktop" ? "536px" : "auto",
    border: "none",
    display: "block",
    flexShrink: 0,
  }

  return (
    <>
      {/* SEO hidden content */}
      <div aria-hidden="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
        <h1>AI Page Builder — Free AI Website Generator & HTML Code Generator</h1>
        <p>Build stunning landing pages, SaaS pages, portfolios, dashboards, e-commerce stores and more with our free AI page builder. No coding required. Supports Tailwind CSS, Bootstrap 5, Vanilla CSS. Instant AI website generator online.</p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          IDLE
      ══════════════════════════════════════════════════════════════════ */}
      {appState === "idle" && (
        <div className="flex flex-col items-center justify-center min-h-[82vh] px-4 py-10 gap-7">

          {/* Brand */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl scale-150 animate-pulse" style={{ animationDuration: "3s" }} />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-xl">
                <Wand2 className="h-7 w-7" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What page shall I build?</h2>
              <p className="text-muted-foreground mt-1.5 text-sm max-w-md mx-auto leading-relaxed">
                Describe any web page — even a single word — and get a stunning, production-ready HTML page instantly.
              </p>
            </div>
          </div>

          {/* Quick prompt chips */}
          <div className="flex flex-wrap justify-center gap-2 max-w-xl">
            {QUICK_PROMPTS.map((s) => (
              <button
                key={s}
                onClick={() => { setPrompt(s); textareaRef.current?.focus() }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-all duration-150"
              >
                <Lightbulb className="w-3 h-3 shrink-0 opacity-40" />
                {s}
              </button>
            ))}
          </div>

          {/* Input box */}
          <div className="w-full max-w-2xl space-y-2.5">
            <div className="rounded-2xl border border-border bg-card shadow-sm focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all duration-200">
              <Textarea
                ref={textareaRef}
                id="page-prompt"
                placeholder={`e.g. "A SaaS landing page for a project management tool with dark theme and pricing…"`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate() }}
                className="min-h-[92px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm leading-relaxed pt-4 px-4 pb-2 rounded-2xl"
                aria-label="Describe your web page for AI generation"
              />
              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                <button
                  onClick={() => setShowOptions((v) => !v)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-muted"
                >
                  {showOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  Customize
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    <kbd className="px-1.5 py-0.5 rounded border text-[10px] font-mono bg-muted">Ctrl+Enter</kbd>
                  </span>
                  <button
                    onClick={generate}
                    disabled={!prompt.trim()}
                    aria-label="Build page"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Build
                  </button>
                </div>
              </div>
            </div>

            {/* Rate bar */}
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3 h-3" />{rateCount}/{RATE_MAX} generations this hour
              </span>
              <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(rateCount / RATE_MAX) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Customize panel */}
          {showOptions && (
            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-5">

                {/* Page Type */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Page Type</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => selectTemplate(tpl.id)}
                        title={tpl.description}
                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all duration-150 ${
                          template === tpl.id
                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                            : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tpl.icon}
                        <span className="text-center leading-tight">{tpl.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style + Framework */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Visual Style</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {STYLE_OPTIONS.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setStyle(s.value)}
                          title={s.desc}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all duration-150 ${
                            style === s.value
                              ? "bg-primary/10 border-primary text-primary shadow-sm"
                              : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {s.icon}<span className="truncate">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">CSS Framework</Label>
                    <div className="flex flex-col gap-1.5">
                      {CSS_FRAMEWORKS.map((f) => (
                        <button
                          key={f.value}
                          onClick={() => setCssFramework(f.value)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-150 ${
                            cssFramework === f.value
                              ? "bg-primary/10 border-primary text-primary shadow-sm"
                              : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {f.label}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${cssFramework === f.value ? "bg-primary/20 text-primary" : "bg-muted"}`}>{f.badge}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced */}
                <div>
                  <button
                    onClick={() => setShowAdvanced((v) => !v)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span className="font-medium">Advanced Libraries</span>
                  </button>
                  {showAdvanced && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { state: useThreeJs, setter: setUseThreeJs, label: "Three.js",  icon: <Box       className="w-3.5 h-3.5" />, desc: "3D scenes" },
                        { state: useChartJs, setter: setUseChartJs, label: "Chart.js",  icon: <BarChart2 className="w-3.5 h-3.5" />, desc: "Charts" },
                        { state: useGsap,    setter: setUseGsap,    label: "GSAP",      icon: <Zap       className="w-3.5 h-3.5" />, desc: "Animations" },
                        { state: useAos,     setter: setUseAos,     label: "AOS",       icon: <Globe     className="w-3.5 h-3.5" />, desc: "Scroll FX" },
                      ].map((lib) => (
                        <button
                          key={lib.label}
                          onClick={() => lib.setter(!lib.state)}
                          className={`flex flex-col gap-1 p-2.5 rounded-xl border text-left transition-all duration-150 ${
                            lib.state ? "bg-primary/10 border-primary text-primary" : "bg-background border-border hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-semibold">
                            {lib.icon}{lib.label}
                            {lib.state && <Check className="w-3 h-3 ml-auto text-green-500" />}
                          </div>
                          <span className="text-[10px] opacity-60">{lib.desc}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="w-full max-w-2xl flex items-start gap-2.5 p-4 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-2xl">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><p>{error}</p>
            </div>
          )}

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {([
              [<Star key="1" className="w-3 h-3" />, "Free to use"],
              [<Zap key="2" className="w-3 h-3" />, "Instant generation"],
              [<Shield key="3" className="w-3 h-3" />, "No login required"],
              [<Globe key="4" className="w-3 h-3" />, "Tailwind & Bootstrap"],
              [<Box key="5" className="w-3 h-3" />, "Three.js & GSAP"],
            ] as [React.ReactNode, string][]).map(([icon, text], i) => (
              <span key={i} className="flex items-center gap-1.5">{icon}{text}</span>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          PROCESSING
      ══════════════════════════════════════════════════════════════════ */}
      {isProcessing && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 gap-8 animate-in fade-in duration-300">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping opacity-60" style={{ animationDuration: "1.5s" }} />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-xl">
              <Wand2 className="h-7 w-7" />
            </div>
          </div>
          <div className="text-center space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              Building your page <ThinkingDots />
            </div>
            <p className="text-sm text-muted-foreground">{progressMsg}</p>
            {activeModel && (
              <p className="text-xs text-muted-foreground">
                Model: <span className="font-medium text-foreground">{FREE_MODELS.find((m) => m.id === activeModel)?.label ?? activeModel}</span>
              </p>
            )}
          </div>
          <div className="w-full max-w-sm space-y-2">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progressMsg}</span>
              <span className="font-medium tabular-nums">{progress}%</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-xs">
            {["HTML", "CSS", "JS", "Layout", "Animations", "Responsive", "Security"].map((step, i) => (
              <span key={step} className={`text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all duration-500 ${
                progress > i * 12 ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground opacity-40"
              }`}>{step}</span>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          RESULT — all heights fixed in px, no flex-grow on panels
      ══════════════════════════════════════════════════════════════════ */}
      {isDone && (
        <div className="flex flex-col animate-in fade-in duration-300">

          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b bg-card/80 backdrop-blur-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm shrink-0">
              <Wand2 className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground min-w-0">
              {appState === "complete" && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />Ready
                </span>
              )}
              {activeModelInfo && <span className="flex items-center gap-1"><Cpu className="w-3 h-3" />{activeModelInfo.label}</span>}
              {genDuration > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{genDuration}s</span>}
              <span className="hidden sm:block">{(generatedHtml.length / 1024).toFixed(1)} KB</span>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={copyCode} className="h-7 text-xs px-2.5 gap-1.5">
                {copiedCode ? <><Check className="w-3 h-3 text-green-500" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadCode} className="h-7 text-xs px-2.5 gap-1.5">
                <Download className="w-3 h-3" />Download
              </Button>
              <Button variant="ghost" size="sm" onClick={resetAll} className="h-7 text-xs px-2.5 gap-1.5">
                <Plus className="w-3 h-3" />New
              </Button>
            </div>
          </div>

          {/* Tabs row */}
          <div className="flex items-center border-b bg-background px-2">
            <div className="flex">
              {([
                { id: "preview" as TabType, label: "Preview",                    icon: <Eye     className="w-3.5 h-3.5" /> },
                { id: "code"    as TabType, label: "HTML Code",                  icon: <Code2   className="w-3.5 h-3.5" /> },
                { id: "history" as TabType, label: `History (${history.length})`,icon: <History className="w-3.5 h-3.5" /> },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>
            {activeTab === "preview" && (
              <div className="ml-auto flex items-center gap-0.5 py-1">
                {VIEWPORT_SIZES.map((vp) => (
                  <button
                    key={vp.id}
                    onClick={() => setViewport(vp.id)}
                    title={`${vp.label} — ${vp.hint}`}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all ${
                      viewport === vp.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {vp.icon}
                    <span className="hidden md:inline ml-1">{vp.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => setIsFullscreen(true)}
                  title="Fullscreen"
                  className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all ml-0.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* ── PREVIEW PANEL — strictly fixed height, no reflow ── */}
          {activeTab === "preview" && (
            <div style={{ height: 580, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Browser chrome */}
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(252,129,129,0.8)" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(252,205,100,0.8)" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(134,207,134,0.8)" }} />
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <div style={{ height: 24, maxWidth: 320, width: "100%", borderRadius: 6, background: "var(--background)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 6, padding: "0 10px" }}>
                    <Globe style={{ width: 11, height: 11, opacity: 0.4, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Generated — {currentVP.hint}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "monospace" }}>{currentVP.hint}</span>
              </div>

              {/* Iframe wrapper — fixed pixel height, overflow scroll, never grows */}
              <div style={{ ...iframeWrapStyle, flexShrink: 0 }}>
                <iframe
                  title="Generated page preview — AI Page Builder"
                  srcDoc={iframeSrc}
                  style={iframeStyle}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}

          {/* ── CODE PANEL — fixed height ── */}
          {activeTab === "code" && (
            <div style={{ position: "relative", height: 580, overflow: "hidden" }}>
              <pre style={{ height: "100%", overflow: "auto", padding: "20px", fontSize: 12, fontFamily: "monospace", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
                {generatedHtml}
              </pre>
              <Button variant="outline" size="sm" onClick={copyCode} className="absolute top-4 right-4 h-7 text-xs gap-1.5 shadow-sm">
                {copiedCode ? <><Check className="w-3 h-3 text-green-500" />Copied!</> : <><Copy className="w-3 h-3" />Copy HTML</>}
              </Button>
            </div>
          )}

          {/* ── HISTORY PANEL — fixed height ── */}
          {activeTab === "history" && (
            <div style={{ height: 580, overflowY: "auto" }}>
              <div className="max-w-2xl mx-auto p-4 space-y-2">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm gap-2">
                    <History className="w-8 h-8 opacity-30" />
                    No generations yet this session.
                  </div>
                ) : (
                  history.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => loadFromHistory(record)}
                      className="p-4 rounded-2xl border bg-card hover:bg-muted/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full">{record.template}</span>
                          <span className="text-xs text-muted-foreground capitalize">{record.style}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Cpu className="w-3 h-3" />{record.model}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{record.duration}s</span>
                          <span>{record.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">{record.prompt}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Follow-up input bar */}
          <div className="border-t bg-background/95 backdrop-blur px-4 py-3">
            <div className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Describe another page to build…"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && prompt.trim()) generate() }}
                  className="w-full h-10 rounded-xl border border-border bg-muted/50 px-4 pr-10 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 focus:bg-background transition-all"
                  aria-label="Build another page"
                />
                <button
                  onClick={() => { if (prompt.trim()) generate() }}
                  disabled={!prompt.trim() || isProcessing}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-30 hover:opacity-90 transition-all"
                  aria-label="Generate"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={resetAll} className="h-10 px-3 rounded-xl gap-1.5 shrink-0">
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          FULLSCREEN — fixed inset, no reflow possible
      ══════════════════════════════════════════════════════════════════ */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.92)" }}>
          <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0" style={{ background: "var(--background)" }}>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                <Wand2 className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold">Fullscreen Preview</span>
            </div>
            <div className="flex items-center gap-1 ml-6">
              {VIEWPORT_SIZES.map((vp) => (
                <button
                  key={vp.id}
                  onClick={() => setViewport(vp.id)}
                  title={vp.hint}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all ${
                    viewport === vp.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {vp.icon}
                  <span className="hidden sm:inline ml-1">{vp.label}</span>
                </button>
              ))}
            </div>
            <Button onClick={() => setIsFullscreen(false)} variant="ghost" size="sm" className="h-8 w-8 p-0 ml-auto" aria-label="Close fullscreen">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Fixed-height iframe — calc excludes the 56px header */}
          <div style={{ flex: 1, overflow: "auto", background: "#1a1a1a", display: "flex", alignItems: "flex-start", justifyContent: viewport !== "desktop" ? "center" : "stretch", padding: viewport !== "desktop" ? 16 : 0 }}>
            <iframe
              title="Fullscreen generated page preview"
              srcDoc={iframeSrc}
              style={{
                width: viewport === "desktop" ? "100%" : currentVP.width,
                height: "100%",
                minHeight: 600,
                border: "none",
                borderRadius: viewport !== "desktop" ? 12 : 0,
                background: "#fff",
                display: "block",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}
    </>
  )
}
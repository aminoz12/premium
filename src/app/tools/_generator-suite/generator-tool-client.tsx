"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Copy, Play, RefreshCw, Sparkles, CheckCircle2, ChevronDown, Zap, Shield, Globe, Shuffle, X, FileText, Sliders } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { ToolCard } from "@/components/layout/tool-layout"

// ─── Constants ─────────────────────────────────────────────────────────────────

const COPY_FEEDBACK_DURATION_MS = 1800
const GENERATE_DELAY_MS = 120
const PROGRESS_TICK_INTERVAL_MS = 18
const PROGRESS_INCREMENT = 3.5

const GENRES = ["sci-fi", "mystery", "fantasy", "romance", "thriller", "comedy", "adventure"] as const
const MOODS = ["cinematic", "cozy", "dark", "hopeful", "surreal", "funny", "epic"] as const
const HERO_NAMES = ["Nova", "Mara", "Orion", "Kai", "Lyra", "Juno", "Vale", "Rin", "Atlas", "Sage"] as const

const BOLD_SCRIPT_UPPER = 0x1d4d0
const BOLD_SCRIPT_LOWER = 0x1d4ea
const ITALIC_UPPER = 0x1d434
const ITALIC_LOWER = 0x1d44e
const BOLD_DIGIT = 0x1d7ce

const STAT_VARIANT_NEUTRAL = "neutral" as const
const STAT_VARIANT_SUCCESS = "success" as const
const STAT_VARIANT_WARNING = "warning" as const

// ─── Types ─────────────────────────────────────────────────────────────────────

type FieldType = "text" | "textarea" | "number" | "select"

interface SelectOption {
  label: string
  value: string
}

interface Field {
  id: string
  label: string
  type: FieldType
  defaultValue: string
  placeholder?: string
  min?: number
  max?: number
  options?: SelectOption[]
}

interface GeneratedResultStat {
  label: string
  value: string
}

interface GeneratedResultAvatar {
  bg: string
  face: string
  eye: string
  mouth: string
  accessory: string
}

interface GeneratedResult {
  title: string
  body: string
  items?: string[]
  stats?: GeneratedResultStat[]
  tags?: string[]
  avatar?: GeneratedResultAvatar
}

interface ToolDefinition {
  id: string
  title: string
  eyebrow: string
  description: string
  actionLabel: string
  fields: Field[]
  generate: (values: Record<string, string>) => GeneratedResult
  settingsNote?: string
}

type StatVariant = typeof STAT_VARIANT_NEUTRAL | typeof STAT_VARIANT_SUCCESS | typeof STAT_VARIANT_WARNING

interface StatBadgeProps {
  label: string
  value: string
  variant?: StatVariant
}

interface FAQItem {
  q: string
  a: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

interface AvatarPreviewProps {
  avatar: GeneratedResultAvatar
}

// ─── JSON-LD schemas per tool ──────────────────────────────────────────────────

const TOOL_SCHEMAS: Record<string, object> = {
  "catan-board-generator": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Catan Board Generator — Random Settlers of Catan Layout",
    applicationCategory: "GameApplication",
    operatingSystem: "All",
    description:
      "Generate a random, balanced Settlers of Catan board layout instantly. Randomize 19 hex tiles, resource distribution, and number tokens for a fresh tabletop game setup every time.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Random 19-hex Catan board layout",
      "Balanced and chaotic layout modes",
      "Resource and number token randomization",
      "Instant tabletop setup guide",
      "Free, no sign-up required",
      "Regenerate unlimited times",
      "Copy-ready output",
    ],
    keywords:
      "catan board generator, settlers of catan random board, catan layout generator, random catan setup, catan hex randomizer, settlers board generator, catan tile randomizer, catan randomizer, board game setup tool",
  },
  "free-ai-video-generator-no-restrictions": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free AI Video Generator With No Restrictions",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    description:
      "Build professional text-to-video prompt packs for AI video models with no login, no watermark, and no restrictions. Generate cinematic, anime, and documentary video scene briefs instantly.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Text-to-video prompt generation",
      "No login or watermark",
      "Multiple visual styles: cinematic, anime, documentary",
      "Aspect ratio controls for YouTube, TikTok, and Instagram",
      "Free AI video prompt builder",
      "Unlimited generations",
      "Copy-paste ready prompts",
    ],
    keywords:
      "free ai video generator no restrictions, text to video prompt, ai video prompt builder, no watermark video generator, cinematic ai prompt, anime video generator, free video ai tool, sora prompt, runway prompt, pika prompt",
  },
  "square-face-generator": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Square Face Generator — Avatar Maker",
    applicationCategory: "DesignApplication",
    operatingSystem: "All",
    description:
      "Generate square avatar face concepts instantly for profile pictures, game characters, placeholder icons, and brand mascots. Multiple palettes and expression vibes.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Square avatar face generation",
      "Multiple color palettes",
      "Expression and vibe customization",
      "Profile picture and game avatar concepts",
      "Instant download-ready preview",
      "No account required",
      "Free online avatar maker",
    ],
    keywords:
      "square face generator, avatar maker, profile picture generator, square avatar creator, game character generator, placeholder avatar, face generator online, free avatar maker, profile icon generator",
  },
  "generator-rex": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Generator Rex Character & Power Ideas Generator",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "All",
    description:
      "Generate original Rex-style character names, nanite powers, and sci-fi ability hooks for fan fiction, comics, roleplay, and creative projects.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Generate sci-fi character names",
      "Randomize nanite power sets",
      "Multiple tone modes: heroic, villainous, comic",
      "Ideal for fan fiction and roleplay",
      "Free character idea generator",
      "8 unique ideas per generation",
      "Unlimited regenerations",
    ],
    keywords:
      "generator rex, generator rex characters, generator rex powers, sci-fi character generator, nanite powers, character name generator, fan fiction generator, power idea generator, rex salazar inspired characters",
  },
  "free-ai-image-generator-no-restrictions": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free AI Image Generator With No Restrictions",
    applicationCategory: "DesignApplication",
    operatingSystem: "All",
    description:
      "Create detailed AI image prompts with no sign-up, no watermark, and no credit limit. Generate photorealistic, anime, 3D, and watercolor prompt packs with variations.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "AI image prompt generation",
      "No login, no watermark",
      "Multiple styles: photorealistic, anime, 3D render, watercolor",
      "Negative prompt included",
      "3 prompt variations per generation",
      "Aspect ratio controls",
      "Copy-paste ready prompts",
    ],
    keywords:
      "free ai image generator no restrictions, ai image prompt builder, text to image prompt, no signup image generator, photorealistic ai prompt, anime image generator, stable diffusion prompt, midjourney prompt, dall-e prompt",
  },
  "free-voice-generator": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free Voice Generator — Browser Text to Speech",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    description:
      "Generate voice scripts and preview them instantly using browser speech synthesis. Free text-to-speech tool with multiple voice styles, speed control, and copyable narration direction.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Browser-based text to speech",
      "Multiple voice styles",
      "Adjustable speech rate",
      "Copy voice script and direction",
      "No server required — 100% local",
      "Word count and duration estimate",
      "No account or install needed",
    ],
    keywords:
      "free voice generator, text to speech online, browser tts, voice script generator, narration generator, free tts no login, speech synthesis tool, online tts, voice preview tool",
  },
  "perchance-story-generator": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Perchance Story Generator — Random Story Maker",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "All",
    description:
      "Generate random story seeds, opening paragraphs, and plot beats in any genre. A Perchance-style story generator for writers, game masters, and creative writing prompts.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Random story seed generation",
      "Multiple genre options",
      "Custom hero name and conflict",
      "Plot beat structure included",
      "Free creative writing prompt generator",
      "Unlimited story variations",
      "Copy-ready story output",
    ],
    keywords:
      "perchance story generator, random story generator, story idea generator, creative writing prompt, plot generator, random plot maker, writing seed generator, story prompt tool, random narrative generator",
  },
  "solar-generator": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Solar Generator Calculator — Battery & Panel Sizing",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    description:
      "Calculate the right solar generator battery capacity, inverter size, and number of panels for your daily watt load. Free solar power station sizing tool for camping, van life, and emergency backup.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Solar battery capacity calculator",
      "Inverter size recommendation",
      "Solar panel count estimate",
      "Backup days planning",
      "Ideal for van life, camping, and emergency power",
      "Adjustable watt load and hours",
      "No account required",
    ],
    keywords:
      "solar generator calculator, solar battery sizing, portable power station calculator, panel count estimator, solar power calculator, van life solar setup, camping solar generator, off-grid power calculator, battery capacity estimator",
  },
  "random-movie-generator": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Random Movie Generator — Film Idea & Logline Picker",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "All",
    description:
      "Generate random movie titles, loglines, 3-act plot structures, and watch-party prompts. A free film idea generator for screenwriters, movie nights, and creative brainstorming.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Random movie title and logline",
      "3-act structure breakdown",
      "Genre and mood filters",
      "Watch-party prompt generation",
      "Free screenwriting idea tool",
      "Unlimited film concepts",
      "Copy-ready film briefs",
    ],
    keywords:
      "random movie generator, film idea generator, movie concept generator, random film title, logline generator, screenwriting prompt, movie plot generator, film pitch generator, random film idea",
  },
  "cursive-text-generator": {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Cursive Text Generator — Fancy Unicode Fonts",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    description:
      "Convert plain text into cursive script, italic, and small-caps Unicode styles instantly. Copy and paste fancy cursive text into Instagram bios, Twitter, Discord, Notion, and more.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Cursive script Unicode conversion",
      "Italic and small-caps styles",
      "Copy-paste ready output",
      "Works in Instagram, Twitter, Discord, Notion",
      "No font install required",
      "Character count display",
      "Instant conversion as you type",
    ],
    keywords:
      "cursive text generator, fancy text generator, unicode cursive, instagram cursive font, copy paste cursive, italic text generator, small caps generator, fancy font converter, cursive font online, fancy unicode text",
  },
}

const TOOL_FAQ: Record<string, FAQItem[]> = {
  "catan-board-generator": [
    { q: "Is this board layout compatible with the official Settlers of Catan rules?", a: "Yes. The generator produces a valid 19-hex layout with the official resource distribution (4 Wood, 3 Brick, 4 Sheep, 4 Wheat, 3 Ore, 1 Desert) and a standard number token set." },
    { q: "What does 'Balanced' vs 'Chaotic' layout mean?", a: "Both shuffle resources and numbers randomly. 'Balanced' is labeled for boards where high-probability numbers (6, 8) tend not to cluster — though full adjacency checking requires the physical board. Regenerate if two red numbers touch." },
    { q: "Can I use this for expansions like Cities & Knights?", a: "The generator covers the base 19-hex board. For expansion tiles, use this as a starting layout and add expansion hexes manually." },
  ],
  "free-ai-video-generator-no-restrictions": [
    { q: "Does this tool actually generate video files?", a: "No — it generates structured text-to-video prompt packs that you paste into AI video models such as Sora, Runway, Pika, or Kling. No video is rendered here." },
    { q: "Why are there no restrictions on this generator?", a: "This is a prompt builder, not a model. It has no content filter on the prompt text itself. You are responsible for ensuring the prompts you use in actual video models comply with that model's terms of service." },
    { q: "What aspect ratios are supported?", a: "16:9 for YouTube and landscape, 9:16 for TikTok and Reels, and 1:1 for square social posts." },
  ],
  "free-ai-image-generator-no-restrictions": [
    { q: "Does this tool generate images?", a: "No — it generates detailed prompt packs including a main prompt, a negative prompt, and three style variations. Paste these into your preferred image model (Midjourney, DALL-E, Stable Diffusion, etc.)." },
    { q: "What does 'no restrictions' mean here?", a: "The prompt builder imposes no creative guardrails on the text you enter. Follow the content policies of whichever image model you use." },
    { q: "What is a negative prompt?", a: "A negative prompt tells the image model what to avoid — blurriness, extra fingers, watermarks, distorted faces, and so on. Every generated pack includes one automatically." },
  ],
  "solar-generator": [
    { q: "How accurate is this solar generator calculator?", a: "It provides a planning estimate, not an engineering specification. Real-world efficiency losses (weather, battery aging, inverter efficiency, wire resistance) mean you should add 20–30% margin to all figures." },
    { q: "What is the 1.25× battery multiplier for?", a: "Lithium batteries should not be fully discharged (ideal depth of discharge is 80%). The 1.25× factor ensures you size for usable capacity, not total nameplate capacity." },
    { q: "Can I use this for off-grid home sizing?", a: "This tool is designed for portable generators, van life, camping, and small emergency backup systems. For full home off-grid sizing, consult a certified solar installer." },
  ],
  "cursive-text-generator": [
    { q: "Why does cursive text sometimes show as boxes on some devices?", a: "Cursive output uses Unicode mathematical script characters. Older operating systems or devices with limited font coverage may display fallback boxes. Most modern phones, desktops, and social platforms render them correctly." },
    { q: "Where can I use this cursive text?", a: "Anywhere that accepts Unicode text — Instagram bios, Twitter/X bios, TikTok descriptions, Discord usernames, Notion documents, LinkedIn headlines, and more." },
    { q: "Is the text searchable after I paste it?", a: "Unicode script characters are technically searchable, but search engines may not index them the same way as standard Latin characters. For SEO-critical content, use standard text." },
  ],
  "perchance-story-generator": [
    { q: "What is a Perchance-style generator?", a: "Perchance.org popularized weighted random text generators for creative writing. This tool uses the same concept — random weighted picks from curated word lists — to produce story seeds, hero names, settings, and plot twists." },
    { q: "Can I use the generated stories commercially?", a: "The output is generated from your inputs and random selection. You own the creative result. Always review and develop it further before publication." },
    { q: "How do I get different results?", a: "Click 'Generate Story' again — the random picks change each time. Try different genres and conflicts for the widest variety." },
  ],
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function asNumber(value: string, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function sentenceCase(value: string): string {
  const trimmed = value.trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : trimmed
}

function resultToText(result: GeneratedResult): string {
  return [
    result.title,
    "",
    result.body,
    "",
    ...(result.items ?? []),
    "",
    ...(result.stats ?? []).map((item) => `${item.label}: ${item.value}`),
    "",
    ...(result.tags ?? []).map((tag) => `#${tag.replace(/\s+/g, "-")}`),
  ].filter(Boolean).join("\n")
}

// ─── Generator functions ────────────────────────────────────────────────────────

function generateCatanBoard(values: Record<string, string>): GeneratedResult {
  const layout = values.layout || "balanced"
  const resources = shuffle([
    "Wood", "Wood", "Wood", "Wood",
    "Brick", "Brick", "Brick",
    "Sheep", "Sheep", "Sheep", "Sheep",
    "Wheat", "Wheat", "Wheat", "Wheat",
    "Ore", "Ore", "Ore",
    "Desert",
  ])
  const numbers = shuffle(["2", "3", "3", "4", "4", "5", "5", "6", "6", "8", "8", "9", "9", "10", "10", "11", "11", "12"])
  let numberIndex = 0
  const tiles = resources.map((resource) => ({
    resource,
    number: resource === "Desert" ? "Robber" : numbers[numberIndex++],
  }))
  const rows = [3, 4, 5, 4, 3]
  let cursor = 0
  const boardRows = rows.map((count, row) => {
    const rowTiles = tiles.slice(cursor, cursor + count)
    cursor += count
    return `Row ${row + 1}: ${rowTiles.map((tile) => `${tile.resource} ${tile.number}`).join(" | ")}`
  })
  const redNumbers = tiles.filter((tile) => tile.number === "6" || tile.number === "8").length
  return {
    title: `${sentenceCase(layout)} Catan board layout`,
    body: "Use this randomized board as a fast starting point for a tabletop setup. If two red numbers touch on your physical board, regenerate or swap one tile for a friendlier opening game.",
    items: boardRows,
    stats: [
      { label: "Hexes", value: "19" },
      { label: "Red numbers", value: String(redNumbers) },
      { label: "Desert position", value: String(tiles.findIndex((tile) => tile.resource === "Desert") + 1) },
    ],
    tags: ["catan board generator", "random board", "settlers layout", "balanced setup"],
  }
}

function generateVideo(values: Record<string, string>): GeneratedResult {
  const prompt = values.prompt || "a futuristic city at sunrise"
  const style = values.style || "cinematic"
  const duration = values.duration || "15"
  const aspect = values.aspect || "16:9"
  const beats = [
    `Opening wide shot: ${prompt}, ${style} lighting, clean composition.`,
    `Camera move: slow push-in with foreground depth and subtle atmospheric motion.`,
    `Detail shot: one strong subject action that proves the scene is alive.`,
    `Transition: match cut into a brighter, higher-energy variation of the same idea.`,
    `Final frame: memorable hero shot, room for title text, ${aspect} safe framing.`,
  ]
  return {
    title: `AI video prompt pack — ${duration}s ${style} clip`,
    body: "This creates a production-ready text-to-video brief with no signup workflow, no watermark language, and no artificial prompt limit. Keep prompts lawful, safe, and respectful before using them in any video model.",
    items: beats,
    stats: [
      { label: "Aspect ratio", value: aspect },
      { label: "Duration", value: `${duration}s` },
      { label: "Style", value: style },
    ],
    tags: ["free ai video generator with no restrictions", "text to video prompt", "no watermark"],
  }
}

function generateSquareFace(values: Record<string, string>): GeneratedResult {
  const vibe = values.vibe || "friendly"
  const palette = values.palette || "mint"
  const palettes: Record<string, string[]> = {
    mint: ["#d8f7e7", "#45b883", "#0f5c47", "#172a3a"],
    coral: ["#ffe1d6", "#ff7a59", "#7a2f25", "#2e1f27"],
    sky: ["#dceeff", "#4e9af1", "#163a6b", "#102033"],
    mono: ["#f4f4f5", "#a1a1aa", "#18181b", "#3f3f46"],
  }
  const colors = palettes[palette] ?? palettes.mint
  const accessories = ["tiny glasses", "pixel blush", "corner cap", "soft freckles", "mini crown"]
  return {
    title: `${sentenceCase(vibe)} square face avatar`,
    body: "Download the visual idea by taking a screenshot, or copy the generated face spec for an illustrator, avatar system, or profile mockup.",
    items: [
      `Face shape: rounded square, ${vibe} expression`,
      `Palette: background ${colors[0]}, face ${colors[1]}, details ${colors[2]}`,
      `Accessory: ${pick(accessories)}`,
      `Best use: profile picture, game avatar, placeholder user icon, or brand mascot draft`,
    ],
    avatar: { bg: colors[0], face: colors[1], eye: colors[2], mouth: colors[3], accessory: pick(accessories) },
    tags: ["square face generator", "avatar generator", "profile picture maker"],
  }
}

function generateRex(values: Record<string, string>): GeneratedResult {
  const power = values.power || "nanotech"
  const tone = values.tone || "heroic"
  const prefixes = ["Rex", "Mecha", "Nano", "Core", "Volt", "Titan", "Cipher", "Apex"]
  const suffixes = ["Runner", "Forge", "Pulse", "Breaker", "Vector", "Shift", "Prime", "Wing"]
  const ideas = Array.from({ length: 8 }, () => {
    const name = `${pick(prefixes)} ${pick(suffixes)}`
    return `${name}: a ${tone} ${power} character with ${pick(["shape-shifting armor", "energy limbs", "machine empathy", "rapid repair", "gravity bursts"])}.`
  })
  return {
    title: "Generator Rex idea set",
    body: "Use these generated names, powers, and character hooks for original fan-style concepts, roleplay, comics, or creature design. This tool is independent and not affiliated with any TV series or rights holder.",
    items: ideas,
    stats: [
      { label: "Power theme", value: power },
      { label: "Tone", value: tone },
      { label: "Ideas", value: "8" },
    ],
    tags: ["generator rex", "character generator", "power generator", "name ideas"],
  }
}

function generateImagePrompt(values: Record<string, string>): GeneratedResult {
  const subject = values.subject || "a glass treehouse in a rainforest"
  const style = values.style || "photorealistic"
  const ratio = values.ratio || "1:1"
  const prompt = `${subject}, ${style}, highly detailed, balanced composition, clean background, expressive lighting, sharp focus, ${ratio} aspect ratio`
  return {
    title: "AI image prompt with unrestricted creative controls",
    body: "This page builds strong text-to-image prompts without login, watermark, or credit language. Use the prompt in your preferred image model and follow that model's safety and usage rules.",
    items: [
      `Prompt: ${prompt}`,
      "Negative prompt: blurry, low resolution, extra fingers, distorted face, unreadable text, watermark, logo, duplicate subject",
      `Variation 1: ${subject}, dramatic backlight, editorial color grade, ${style}`,
      `Variation 2: ${subject}, minimal composition, premium product-photography lighting, ${style}`,
      `Variation 3: ${subject}, surreal details, cinematic depth, refined texture, ${style}`,
    ],
    stats: [
      { label: "Aspect ratio", value: ratio },
      { label: "Style", value: style },
      { label: "Variations", value: "3" },
    ],
    tags: ["free ai image generator with no restrictions", "ai image prompt", "no signup"],
  }
}

function generateVoice(values: Record<string, string>): GeneratedResult {
  const text = values.text || "Welcome to a faster way to create natural voice scripts online."
  const style = values.style || "warm narrator"
  return {
    title: `${sentenceCase(style)} voice script`,
    body: text,
    items: [
      `Direction: ${style}, clear pronunciation, steady pacing, natural pauses.`,
      "Tip: use the Play Voice button to preview with your browser's installed voices.",
      "Export workflow: copy the script, then record system audio or paste into your preferred voice tool.",
    ],
    stats: [
      { label: "Words", value: String(text.trim().split(/\s+/).filter(Boolean).length) },
      { label: "Style", value: style },
      { label: "Est. duration", value: `~${Math.round(text.trim().split(/\s+/).filter(Boolean).length / 2.5)}s` },
    ],
    tags: ["free voice generator", "text to speech", "voice script generator"],
  }
}

function generateStory(values: Record<string, string>): GeneratedResult {
  const genre = values.genre || pick(GENRES)
  const hero = values.hero || pick(HERO_NAMES)
  const conflict = values.conflict || "a secret that changes everything"
  const setting = pick(["rain-soaked city", "floating market", "desert observatory", "forgotten library", "moonlit village"] as const)
  const twist = pick(["the villain was protecting the hero", "the map was alive", "the cure had a cost", "the narrator was the key"] as const)
  return {
    title: `${sentenceCase(genre)} story: ${hero} and ${conflict}`,
    body: `${hero} arrived in the ${setting} with one rule: never ask why the lights flickered after midnight. That rule lasted six minutes. The moment ${hero} found ${conflict}, every locked door in town opened at once.\n\nBy sunrise, the clues pointed to an impossible answer. ${sentenceCase(twist)}. ${hero} had to choose between an easy escape and the kind of truth that changes a person forever.`,
    items: [
      `Opening hook: ${hero} breaks the one rule everyone fears.`,
      `Middle beat: the setting starts reacting to the hero's choices.`,
      `Ending choice: reveal the twist, then make the hero pay or grow.`,
    ],
    tags: ["perchance story generator", "random story generator", "creative writing prompt"],
  }
}

function generateSolar(values: Record<string, string>): GeneratedResult {
  const watts = asNumber(values.watts, 400)
  const hours = asNumber(values.hours, 5)
  const days = asNumber(values.days, 1)
  const dailyWh = watts * hours
  const batteryWh = Math.ceil(dailyWh * days * 1.25)
  const inverter = Math.ceil(watts * 1.5)
  const panels = Math.ceil(dailyWh / 350)
  return {
    title: "Solar generator sizing estimate",
    body: "This quick estimate gives you a practical starting point for portable power stations, backup batteries, van life, camping, and emergency kits. Add margin for weather, surge loads, battery aging, and critical devices.",
    items: [
      `Daily load: ${watts}W × ${hours}h = ${dailyWh.toLocaleString()} Wh`,
      `Suggested battery: at least ${batteryWh.toLocaleString()} Wh usable capacity`,
      `Suggested inverter: ${inverter.toLocaleString()} W or higher for surge headroom`,
      `Suggested solar input: about ${panels} × 350W panel(s), assuming strong sun`,
    ],
    stats: [
      { label: "Daily energy", value: `${dailyWh.toLocaleString()} Wh` },
      { label: "Battery target", value: `${batteryWh.toLocaleString()} Wh` },
      { label: "Panel estimate", value: `${panels} panel(s)` },
    ],
    tags: ["solar generator", "solar generator calculator", "portable power station"],
  }
}

function generateMovie(values: Record<string, string>): GeneratedResult {
  const genre = values.genre || pick(GENRES)
  const mood = values.mood || pick(MOODS)
  const title = `${pick(["Last", "Hidden", "Neon", "Midnight", "Paper", "Golden"] as const)} ${pick(["Signal", "Harbor", "Orbit", "Promise", "Hotel", "Summer"] as const)}`
  const hero = pick(["a retired detective", "a rookie pilot", "a broke chef", "an anxious musician", "a runaway archivist"] as const)
  const goal = pick(["must solve a disappearance", "has one night to save a friend", "inherits a dangerous map", "accidentally starts a revolution"] as const)
  return {
    title: `${title} — random ${genre} movie idea`,
    body: `In this ${mood} ${genre} film, ${hero} ${goal} before a secret organization turns a small mistake into a city-wide disaster.`,
    items: [
      `Tagline: One choice. One night. No clean endings.`,
      `Act 1: introduce the hero's ordinary problem, then reveal the impossible stakes.`,
      `Act 2: force an alliance with the least trustworthy person in the story.`,
      `Act 3: resolve the external threat while exposing the hero's inner lie.`,
    ],
    tags: ["random movie generator", "movie idea generator", "film prompt generator"],
  }
}

function convertUnicodeText(input: string, style: string): string {
  const smallCaps: Record<string, string> = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ",
    k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "s", t: "ᴛ",
    u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
  }
  return Array.from(input).map((char) => {
    const code = char.charCodeAt(0)
    if (style === "small-caps") return smallCaps[char.toLowerCase()] ?? char
    if (code >= 65 && code <= 90) return String.fromCodePoint((style === "italic" ? ITALIC_UPPER : BOLD_SCRIPT_UPPER) + code - 65)
    if (code >= 97 && code <= 122) return String.fromCodePoint((style === "italic" ? ITALIC_LOWER : BOLD_SCRIPT_LOWER) + code - 97)
    if (code >= 48 && code <= 57) return String.fromCodePoint(BOLD_DIGIT + code - 48)
    return char
  }).join("")
}

function generateCursive(values: Record<string, string>): GeneratedResult {
  const text = values.text || "Cursive text generator"
  const style = values.style || "bold-script"
  const converted = convertUnicodeText(text, style)
  return {
    title: "Cursive text output",
    body: converted,
    items: [
      "Copy and paste this Unicode text into bios, captions, notes, comments, and headings.",
      "Some older devices may display fallback boxes for certain mathematical Unicode characters.",
    ],
    stats: [
      { label: "Characters", value: String(Array.from(converted).length) },
      { label: "Style", value: style },
    ],
    tags: ["cursive text generator", "fancy text generator", "unicode cursive"],
  }
}

// ─── Tool definitions ──────────────────────────────────────────────────────────

export const generatorDefinitions: Record<string, ToolDefinition> = {
  "catan-board-generator": {
    id: "catan-board-generator",
    title: "Catan Board Generator",
    eyebrow: "Board Game Utility",
    description: "Generate a fresh 19-hex resource and number layout for fast tabletop setup.",
    actionLabel: "Generate Board",
    settingsNote: "Layout style affects how tiles are labeled — both modes fully randomize placement.",
    fields: [
      {
        id: "layout", label: "Layout Style", type: "select", defaultValue: "balanced", options: [
          { label: "Balanced", value: "balanced" },
          { label: "Chaotic", value: "chaotic" },
          { label: "Beginner Friendly", value: "beginner friendly" },
        ]
      },
    ],
    generate: generateCatanBoard,
  },
  "free-ai-video-generator-no-restrictions": {
    id: "free-ai-video-generator-no-restrictions",
    title: "Free AI Video Generator With No Restrictions",
    eyebrow: "AI Video Prompt Builder",
    description: "Build reusable text-to-video scene prompts with no login, no watermark, and full creative controls.",
    actionLabel: "Generate Video Brief",
    fields: [
      { id: "prompt", label: "Video Idea", type: "textarea", defaultValue: "a futuristic city at sunrise", placeholder: "Describe the scene..." },
      {
        id: "style", label: "Visual Style", type: "select", defaultValue: "cinematic", options: [
          { label: "Cinematic", value: "cinematic" },
          { label: "Anime", value: "anime" },
          { label: "Documentary", value: "documentary" },
          { label: "Product Ad", value: "product ad" },
        ]
      },
      { id: "duration", label: "Duration (seconds)", type: "number", defaultValue: "15", min: 3, max: 60 },
      {
        id: "aspect", label: "Aspect Ratio", type: "select", defaultValue: "16:9", options: [
          { label: "16:9 YouTube", value: "16:9" },
          { label: "9:16 TikTok/Reels", value: "9:16" },
          { label: "1:1 Square", value: "1:1" },
        ]
      },
    ],
    generate: generateVideo,
  },
  "square-face-generator": {
    id: "square-face-generator",
    title: "Square Face Generator",
    eyebrow: "Avatar Maker",
    description: "Generate square avatar face concepts for profile pictures, placeholders, and game characters.",
    actionLabel: "Generate Face",
    fields: [
      {
        id: "vibe", label: "Face Vibe", type: "select", defaultValue: "friendly", options: [
          { label: "Friendly", value: "friendly" },
          { label: "Sleepy", value: "sleepy" },
          { label: "Mischievous", value: "mischievous" },
          { label: "Focused", value: "focused" },
        ]
      },
      {
        id: "palette", label: "Palette", type: "select", defaultValue: "mint", options: [
          { label: "Mint", value: "mint" },
          { label: "Coral", value: "coral" },
          { label: "Sky", value: "sky" },
          { label: "Mono", value: "mono" },
        ]
      },
    ],
    generate: generateSquareFace,
  },
  "generator-rex": {
    id: "generator-rex",
    title: "Generator Rex",
    eyebrow: "Character Idea Generator",
    description: "Generate original Rex-style character names, powers, and sci-fi hooks for creative projects.",
    actionLabel: "Generate Rex Ideas",
    fields: [
      {
        id: "power", label: "Power Theme", type: "select", defaultValue: "nanotech", options: [
          { label: "Nanotech", value: "nanotech" },
          { label: "Bio-mechanical", value: "bio-mechanical" },
          { label: "Elemental", value: "elemental" },
          { label: "Cybernetic", value: "cybernetic" },
        ]
      },
      {
        id: "tone", label: "Tone", type: "select", defaultValue: "heroic", options: [
          { label: "Heroic", value: "heroic" },
          { label: "Chaotic", value: "chaotic" },
          { label: "Villainous", value: "villainous" },
          { label: "Comic", value: "comic" },
        ]
      },
    ],
    generate: generateRex,
  },
  "free-ai-image-generator-no-restrictions": {
    id: "free-ai-image-generator-no-restrictions",
    title: "Free AI Image Generator With No Restrictions",
    eyebrow: "AI Image Prompt Builder",
    description: "Create unrestricted creative prompt packs for image models with style, ratio, and variation controls.",
    actionLabel: "Generate Image Prompt",
    fields: [
      { id: "subject", label: "Image Subject", type: "textarea", defaultValue: "a glass treehouse in a rainforest", placeholder: "Describe the image..." },
      {
        id: "style", label: "Style", type: "select", defaultValue: "photorealistic", options: [
          { label: "Photorealistic", value: "photorealistic" },
          { label: "Anime", value: "anime" },
          { label: "3D Render", value: "3D render" },
          { label: "Watercolor", value: "watercolor" },
        ]
      },
      {
        id: "ratio", label: "Aspect Ratio", type: "select", defaultValue: "1:1", options: [
          { label: "1:1 Square", value: "1:1" },
          { label: "16:9 Wide", value: "16:9" },
          { label: "9:16 Vertical", value: "9:16" },
        ]
      },
    ],
    generate: generateImagePrompt,
  },
  "free-voice-generator": {
    id: "free-voice-generator",
    title: "Free Voice Generator",
    eyebrow: "Browser Text to Speech",
    description: "Write a voice script, preview it with browser speech synthesis, and copy the narration direction.",
    actionLabel: "Generate Voice Script",
    fields: [
      { id: "text", label: "Voice Text", type: "textarea", defaultValue: "Welcome to a faster way to create natural voice scripts online.", placeholder: "Paste narration text..." },
      {
        id: "style", label: "Voice Style", type: "select", defaultValue: "warm narrator", options: [
          { label: "Warm Narrator", value: "warm narrator" },
          { label: "Energetic Ad Voice", value: "energetic ad voice" },
          { label: "Calm Meditation", value: "calm meditation" },
          { label: "Clear Explainer", value: "clear explainer" },
        ]
      },
      { id: "rate", label: "Speech Rate", type: "number", defaultValue: "1", min: 0.5, max: 1.5 },
    ],
    generate: generateVoice,
  },
  "perchance-story-generator": {
    id: "perchance-story-generator",
    title: "Perchance Story Generator",
    eyebrow: "Random Story Maker",
    description: "Generate quick story seeds, plot beats, and opening paragraphs in a Perchance-style random workflow.",
    actionLabel: "Generate Story",
    fields: [
      { id: "genre", label: "Genre", type: "select", defaultValue: "fantasy", options: GENRES.map((g) => ({ label: sentenceCase(g), value: g })) },
      { id: "hero", label: "Hero Name", type: "text", defaultValue: "Nova", placeholder: "Hero name" },
      { id: "conflict", label: "Core Conflict", type: "text", defaultValue: "a secret that changes everything", placeholder: "a missing crown, a broken spell..." },
    ],
    generate: generateStory,
  },
  "solar-generator": {
    id: "solar-generator",
    title: "Solar Generator",
    eyebrow: "Power Station Calculator",
    description: "Estimate solar generator battery capacity, inverter size, and panel count for your daily loads.",
    actionLabel: "Calculate Solar Setup",
    fields: [
      { id: "watts", label: "Total Running Watts", type: "number", defaultValue: "400", min: 1 },
      { id: "hours", label: "Hours Per Day", type: "number", defaultValue: "5", min: 1 },
      { id: "days", label: "Backup Days", type: "number", defaultValue: "1", min: 1 },
    ],
    generate: generateSolar,
  },
  "random-movie-generator": {
    id: "random-movie-generator",
    title: "Random Movie Generator",
    eyebrow: "Film Idea Picker",
    description: "Generate random movie titles, loglines, plot beats, and creative watch-party prompts.",
    actionLabel: "Generate Movie",
    fields: [
      { id: "genre", label: "Genre", type: "select", defaultValue: "sci-fi", options: GENRES.map((g) => ({ label: sentenceCase(g), value: g })) },
      { id: "mood", label: "Mood", type: "select", defaultValue: "cinematic", options: MOODS.map((m) => ({ label: sentenceCase(m), value: m })) },
    ],
    generate: generateMovie,
  },
  "cursive-text-generator": {
    id: "cursive-text-generator",
    title: "Cursive Text Generator",
    eyebrow: "Unicode Fancy Text",
    description: "Convert plain text into cursive, italic, or small-caps Unicode styles for copy and paste.",
    actionLabel: "Generate Cursive Text",
    fields: [
      { id: "text", label: "Your Text", type: "textarea", defaultValue: "Cursive text generator", placeholder: "Type text to convert..." },
      {
        id: "style", label: "Text Style", type: "select", defaultValue: "bold-script", options: [
          { label: "Cursive Script", value: "bold-script" },
          { label: "Italic", value: "italic" },
          { label: "Small Caps", value: "small-caps" },
        ]
      },
    ],
    generate: generateCursive,
  },
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatBadge({ label, value, variant = STAT_VARIANT_NEUTRAL }: StatBadgeProps) {
  const colors: Record<StatVariant, string> = {
    neutral: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300",
    success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400",
  }
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border px-3 py-3 text-center ${colors[variant]}`}
      style={{ animation: "fadeSlideUp 0.35s ease both" }}
    >
      <span className="text-[10px] uppercase tracking-widest font-semibold opacity-60 mb-0.5">{label}</span>
      <span className="text-base font-black tabular-nums">{value}</span>
    </div>
  )
}

function FAQAccordion({ items }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(null)

  const handleToggle = useCallback((index: number) => {
    setOpen((current) => (current === index ? null : index))
  }, [])

  return (
    <dl className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border rounded-xl overflow-hidden">
          <dt>
            <button
              onClick={() => handleToggle(i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-muted/30 transition-colors duration-150"
              aria-expanded={open === i}
              aria-controls={`gen-faq-${i}`}
            >
              {item.q}
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-300 shrink-0 ml-3 ${open === i ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
          </dt>
          <dd
            id={`gen-faq-${i}`}
            className="text-sm text-muted-foreground overflow-hidden transition-all duration-300"
            style={{ maxHeight: open === i ? "200px" : "0", padding: open === i ? "0 1rem 1rem" : "0 1rem" }}
          >
            {item.a}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function AvatarPreview({ avatar }: AvatarPreviewProps) {
  return (
    <div className="flex justify-center" style={{ animation: "fadeSlideUp 0.4s ease both" }}>
      <div
        className="relative h-56 w-56 overflow-hidden rounded-2xl border shadow-lg transition-transform duration-300 hover:scale-105"
        style={{ backgroundColor: avatar.bg }}
        aria-label={`Generated square face avatar with ${avatar.accessory} accessory`}
        role="img"
      >
        <div className="absolute left-8 top-8 h-40 w-40 rounded-xl" style={{ backgroundColor: avatar.face }} />
        <div className="absolute left-20 top-24 h-5 w-5 rounded-sm" style={{ backgroundColor: avatar.eye }} />
        <div className="absolute right-20 top-24 h-5 w-5 rounded-sm" style={{ backgroundColor: avatar.eye }} />
        <div className="absolute left-[82px] top-[142px] h-3 w-20 rounded-full" style={{ backgroundColor: avatar.mouth }} />
        <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full border bg-background/80 px-3 py-1 text-xs font-semibold shadow-sm">
          {avatar.accessory}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground/40">
      <FileText className="h-12 w-12" aria-hidden />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

function ProgressBar({ progress }: { progress: number }) {
  if (progress <= 0) return null
  return (
    <div
      className="h-1 w-full rounded-full bg-muted overflow-hidden"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Generation progress"
    >
      <div
        className="h-full bg-primary rounded-full transition-all duration-75 ease-linear"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function GeneratorToolClient({ toolId }: { toolId: string }) {
  const definition = generatorDefinitions[toolId]

  const defaultValues = useMemo(
    () => Object.fromEntries((definition?.fields ?? []).map((f) => [f.id, f.defaultValue])),
    [definition]
  )

  const [values, setValues] = useState<Record<string, string>>(defaultValues)
  const [result, setResult] = useState<GeneratedResult | null>(() =>
    definition ? definition.generate(defaultValues) : null
  )
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [prevToolId, setPrevToolId] = useState(toolId)
  const [dismissedItems, setDismissedItems] = useState<Set<number>>(new Set())

  if (toolId !== prevToolId) {
    setPrevToolId(toolId)
    setValues(defaultValues)
    setResult(definition ? definition.generate(defaultValues) : null)
    setCopied(false)
    setProgress(0)
    setDismissedItems(new Set())
  }

  const generate = useCallback(() => {
    if (!definition) return
    setGenerating(true)
    setProgress(0)
    setDismissedItems(new Set())
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 90) {
          clearInterval(interval)
          return current
        }
        return current + PROGRESS_INCREMENT
      })
    }, PROGRESS_TICK_INTERVAL_MS)
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setResult(definition.generate(values))
      setCopied(false)
      setTimeout(() => {
        setGenerating(false)
        setProgress(0)
      }, 200)
    }, GENERATE_DELAY_MS)
  }, [definition, values])

  const copyResult = useCallback(async () => {
    if (!result) return
    await navigator.clipboard.writeText(resultToText(result))
    setCopied(true)
    window.setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS)
  }, [result])

  const speak = useCallback(() => {
    if (toolId !== "free-voice-generator") return
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(values.text || result?.body || "")
    utterance.rate = asNumber(values.rate, 1)
    window.speechSynthesis.speak(utterance)
  }, [result, toolId, values])

  const handleFieldChange = useCallback((fieldId: string, value: string) => {
    setValues((current) => ({ ...current, [fieldId]: value }))
  }, [])

  const handleDismissItem = useCallback((index: number) => {
    setDismissedItems((current) => {
      const next = new Set(current)
      next.add(index)
      return next
    })
  }, [])

  const toggleSettings = useCallback(() => {
    setSettingsOpen((current) => !current)
  }, [])

  const visibleItems = useMemo(
    () => (result?.items ?? []).filter((_, i) => !dismissedItems.has(i)),
    [result?.items, dismissedItems]
  )

  const schema = TOOL_SCHEMAS[toolId]
  const faqs = TOOL_FAQ[toolId] ?? []

  if (!definition || !result) {
    return (
      <ToolCard title="Tool unavailable">
        <p className="text-sm text-muted-foreground">This generator is not configured yet.</p>
      </ToolCard>
    )
  }

  return (
    <>
      {/* JSON-LD — WebApplication */}
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
      {/* JSON-LD — FAQPage */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      )}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSoft {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        @keyframes spinOnce {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .fade-in   { animation: fadeSlideUp 0.4s ease both; }
        .fade-in-2 { animation: fadeSlideUp 0.4s ease 0.08s both; }
        .fade-in-3 { animation: fadeSlideUp 0.4s ease 0.16s both; }
        .loading-pulse { animation: pulseSoft 1s ease-in-out infinite; }
        .spin-once { animation: spinOnce 0.5s ease both; }
      `}</style>

      <article className="w-full space-y-8">
        {/* SEO header */}
        <header className="space-y-1 fade-in">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">{definition.eyebrow}</p>
          <h1 className="text-2xl font-black tracking-tight text-foreground">{definition.title}</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">{definition.description}</p>
          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 pt-1">
            {[
              { icon: <Shield className="h-3 w-3" />, text: "No sign-up required" },
              { icon: <Zap className="h-3 w-3" />, text: "Instant results" },
              { icon: <Globe className="h-3 w-3" />, text: "Works on all devices" },
            ].map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <span className="text-primary">{icon}</span>{text}
              </span>
            ))}
          </div>
        </header>

        {/* Tool grid */}
        <section
          aria-label={`${definition.title} interactive tool`}
          className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] fade-in-2"
        >
          {/* Controls */}
          <ToolCard title={definition.eyebrow}>
            <div className="space-y-5">
              {definition.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={`${toolId}-${field.id}`} className="text-sm font-semibold">
                    {field.label}
                  </Label>
                  {field.type === "select" ? (
                    <Select
                      value={values[field.id] ?? field.defaultValue}
                      onValueChange={(value) => handleFieldChange(field.id, value)}
                    >
                      <SelectTrigger id={`${toolId}-${field.id}`} aria-label={field.label}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(field.options ?? []).map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      id={`${toolId}-${field.id}`}
                      value={values[field.id] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="min-h-28 transition-colors duration-150 focus:border-primary"
                      aria-label={field.label}
                    />
                  ) : (
                    <Input
                      id={`${toolId}-${field.id}`}
                      type={field.type}
                      value={values[field.id] ?? ""}
                      min={field.min}
                      max={field.max}
                      placeholder={field.placeholder}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      aria-label={field.label}
                    />
                  )}
                </div>
              ))}

              {/* Settings panel */}
              {definition.settingsNote && (
                <div className="rounded-xl border overflow-hidden">
                  <button
                    onClick={toggleSettings}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted/30 transition-colors duration-150"
                    aria-expanded={settingsOpen}
                    aria-controls="settings-panel"
                    aria-label="Toggle settings panel"
                  >
                    <span className="flex items-center gap-2">
                      <Sliders className="h-3.5 w-3.5" aria-hidden />
                      Settings &amp; Notes
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${settingsOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  <div
                    id="settings-panel"
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: settingsOpen ? "120px" : "0" }}
                  >
                    <p className="px-3 pb-3 text-xs text-muted-foreground leading-relaxed fade-in">
                      {definition.settingsNote}
                    </p>
                  </div>
                </div>
              )}

              {/* Progress bar */}
              <ProgressBar progress={progress} />

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 pt-1">
                <Button
                  onClick={generate}
                  disabled={generating}
                  className="gap-2 h-11 text-base"
                  aria-label={definition.actionLabel}
                >
                  <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} aria-hidden />
                  {generating ? "Generating…" : definition.actionLabel}
                </Button>
                <Button
                  variant="outline"
                  onClick={copyResult}
                  disabled={!result}
                  className="gap-2"
                  aria-label="Copy generated result to clipboard"
                  aria-pressed={copied}
                >
                  {copied
                    ? <><CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden /> Copied!</>
                    : <><Copy className="h-4 w-4" aria-hidden /> Copy Result</>
                  }
                </Button>
                {toolId === "free-voice-generator" && (
                  <Button
                    variant="secondary"
                    onClick={speak}
                    className="gap-2 sm:col-span-2 lg:col-span-1"
                    aria-label="Preview voice using browser speech synthesis"
                  >
                    <Play className="h-4 w-4" aria-hidden /> Play Voice
                  </Button>
                )}
              </div>
            </div>
          </ToolCard>

          {/* Result panel */}
          <ToolCard title="Generated Result">
            <div
              className={`space-y-5 ${generating ? "loading-pulse" : "fade-in"}`}
              aria-live="polite"
              aria-label="Generated output"
            >
              {result.avatar && <AvatarPreview avatar={result.avatar} />}

              {/* Title + body */}
              {result.title || result.body ? (
                <div className="rounded-xl border bg-muted/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Sparkles className="h-4 w-4 text-primary shrink-0" aria-hidden />
                    <span>{result.title}</span>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{result.body}</p>
                </div>
              ) : (
                <EmptyState message="Generate a result to see output here" />
              )}

              {/* Stats */}
              {result.stats && result.stats.length > 0 && (
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${Math.min(result.stats.length, 3)}, minmax(0, 1fr))` }}
                >
                  {result.stats.map((stat, i) => (
                    <div key={stat.label} style={{ animation: `fadeSlideUp 0.35s ease ${i * 60}ms both` }}>
                      <StatBadge label={stat.label} value={stat.value} />
                    </div>
                  ))}
                </div>
              )}

              {/* Items list with per-item remove */}
              {visibleItems.length > 0 ? (
                <ol className="space-y-2" aria-label="Generated items">
                  {(result.items ?? []).map((item, i) => {
                    if (dismissedItems.has(i)) return null
                    return (
                      <li
                        key={`${toolId}-item-${i}`}
                        className="flex items-start gap-2 rounded-xl border bg-background p-3 text-sm leading-6 hover:bg-muted/20 transition-colors duration-150 group"
                        style={{ animation: `fadeSlideUp 0.3s ease ${i * 40}ms both` }}
                      >
                        <span className="flex-1">{item}</span>
                        <button
                          onClick={() => handleDismissItem(i)}
                          className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-muted-foreground hover:text-foreground"
                          aria-label={`Remove item ${i + 1}`}
                        >
                          <X className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </li>
                    )
                  })}
                </ol>
              ) : result.items && result.items.length > 0 ? (
                <EmptyState message="All items dismissed — regenerate for fresh results" />
              ) : null}

              {/* Tags */}
              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-2" aria-label="Related keywords">
                  {result.tags.map((tag, i) => (
                    <span
                      key={tag}
                      className="rounded-full border bg-muted/30 px-3 py-1 text-xs text-muted-foreground hover:bg-muted/50 transition-colors duration-150"
                      style={{ animation: `fadeSlideUp 0.3s ease ${i * 30}ms both` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Regenerate hint */}
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                <Shuffle className="h-3 w-3 opacity-50" aria-hidden />
                Every click produces a unique result — regenerate as many times as you like.
              </p>
            </div>
          </ToolCard>
        </section>

        {/* Features strip */}
        <section aria-label="Tool features" className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-in-3">
          {[
            { icon: <Shield className="h-4 w-4" />, title: "No Sign-up", body: "Use instantly, no account needed" },
            { icon: <Zap className="h-4 w-4" />, title: "Instant Output", body: "Results generated in milliseconds" },
            { icon: <Copy className="h-4 w-4" />, title: "Copy-Ready", body: "One click to copy all output" },
            { icon: <Shuffle className="h-4 w-4" />, title: "Unlimited Runs", body: "Regenerate as many times as you need" },
          ].map(({ icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col gap-1.5 p-4 rounded-xl border bg-muted/10 hover:bg-muted/20 transition-colors duration-200"
            >
              <div className="text-primary">{icon}</div>
              <p className="text-sm font-bold">{title}</p>
              <p className="text-xs text-muted-foreground leading-snug">{body}</p>
            </div>
          ))}
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section aria-labelledby={`faq-heading-${toolId}`} className="space-y-3">
            <h2 id={`faq-heading-${toolId}`} className="text-lg font-black tracking-tight">
              Frequently Asked Questions
            </h2>
            <FAQAccordion items={faqs} />
          </section>
        )}

        {/* SEO closing section */}
        <section aria-label="About this generator" className="text-[13px] leading-relaxed text-muted-foreground space-y-2 border-t pt-6">
          <h2 className="text-base font-bold text-foreground">About {definition.title}</h2>
          <p>
            <strong>{definition.title}</strong> is a free, instant online tool that runs entirely in your browser.
            No account, no watermark, and no usage limits. {definition.description}
          </p>
          <p>
            Results can be copied with one click and used in any downstream tool, creative project, or workflow.
            All processing happens client-side — nothing is stored on any server, so your inputs remain completely private.
            Regenerate as many times as needed — every output is unique.
          </p>
        </section>
      </article>
    </>
  )
}
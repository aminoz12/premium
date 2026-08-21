"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import bcrypt from "bcryptjs"
import { diffLines } from "diff"
import DOMPurify from "dompurify"
import exifr from "exifr"
import html2canvas from "html2canvas"
import JSZip from "jszip"
import { marked } from "marked"
import { CronExpressionParser } from "cron-parser"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Play,
  RefreshCw,
  Square,
  Upload,
  Mic,
  Activity,
  HelpCircle,
  Zap,
  Shield,
  Volume2,
} from "lucide-react"
import { ToolCard, ToolEmptyState, ToolLayout } from "@/components/layout/tool-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useClipboard } from "@/hooks/use-clipboard"
import { formatBytes } from "@/lib/tools/utils"
import { getToolById } from "@/lib/tools/tools-config"

// ─── Shared utilities (unchanged from original) ───────────────────────────────

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const MORSE_MAP: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.",
  h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.",
  o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-", u: "..-",
  v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....",
  6: "-....", 7: "--...", 8: "---..", 9: "----.", " ": "/",
}

const MORSE_REVERSE = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([key, value]) => [value, key])
)

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "to", "of", "in", "on", "for",
  "with", "is", "are", "was", "were", "be", "this", "that", "it", "as", "at", "by", "from",
])

const SAMPLE_QUOTES = [
  { category: "motivation", text: "Small consistent steps build giant outcomes." },
  { category: "productivity", text: "Clarity beats intensity when the work is complex." },
  { category: "design", text: "Interfaces feel better when they remove one more decision." },
  { category: "engineering", text: "Reliable systems are built from boring, repeatable habits." },
  { category: "creativity", text: "Good ideas arrive faster when the first draft is allowed to be messy." },
]

const NAME_PARTS = {
  first: ["Ava", "Liam", "Noah", "Mia", "Zara", "Omar", "Ella", "Kai", "Nina", "Elias"],
  last: ["Stone", "Rivera", "Patel", "Baker", "Kim", "Santos", "Fisher", "Lopez", "Nguyen", "Wright"],
  streets: ["Maple Ave", "Ocean View Rd", "Cedar Street", "Sunset Blvd", "Forest Lane", "Birch Court"],
  cities: ["Austin", "Seattle", "Boston", "Denver", "Raleigh", "Phoenix"],
}

const COMMON_TIME_ZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "Europe/London", "Europe/Paris",
  "Asia/Dubai", "Asia/Tokyo", "Australia/Sydney",
]

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, CAD: 1.35,
  MAD: 9.89, AED: 3.67, INR: 83.1, JPY: 150.4,
}

function slugToWords(value: string) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")
}

function randomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

async function sha256(text: string) {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(text)))
}

function simulateMd5(text: string) {
  let hash = 0x67452301
  const textBytes = encoder.encode(text)
  for (let index = 0; index < textBytes.length; index += 1) {
    hash = ((hash << 5) - hash + textBytes[index]) | 0
    hash ^= (hash >> 16) & 0xff
  }
  const hash2 = (hash * 0x01000193) >>> 0
  const hash3 = (hash2 * 0x01000193 + textBytes.length) >>> 0
  const hash4 = (hash3 * 0x01000193) >>> 0
  return [hash, hash2, hash3, hash4]
    .map((value) => (value >>> 0).toString(16).padStart(8, "0"))
    .join("")
}

function crc32(bytes: Uint8Array) {
  let crc = -1
  for (let index = 0; index < bytes.length; index += 1) {
    crc ^= bytes[index]
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
    }
  }
  return ((crc ^ -1) >>> 0).toString(16).padStart(8, "0")
}

function base64UrlEncode(data: Uint8Array | string) {
  const raw =
    typeof data === "string"
      ? btoa(unescape(encodeURIComponent(data)))
      : btoa(String.fromCharCode(...data))
  return raw.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function base64UrlDecode(value: string) {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=")
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
}

function safeJsonParse(value: string) {
  try {
    return { data: JSON.parse(value), error: "" }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Invalid JSON" }
  }
}

function formatXml(value: string) {
  if (typeof window === "undefined") return value
  const parser = new DOMParser()
  const documentNode = parser.parseFromString(value, "application/xml")
  if (documentNode.querySelector("parsererror")) throw new Error("Invalid XML document.")
  const serializer = new XMLSerializer()
  const raw = serializer.serializeToString(documentNode)
  const formatted = raw.replace(/(>)(<)(\/*)/g, "$1\n$2$3")
  let indent = 0
  return formatted
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      if (line.match(/^<\//)) indent = Math.max(indent - 1, 0)
      const current = `${"  ".repeat(indent)}${line}`
      if (line.match(/^<[^!?/][^>]*[^/]>/)) indent += 1
      return current
    })
    .join("\n")
}

function jsonToXmlValue(value: any, nodeName = "item"): string {
  if (value === null || value === undefined) return `<${nodeName} />`
  if (Array.isArray(value)) return value.map((item) => jsonToXmlValue(item, nodeName)).join("")
  if (typeof value === "object") {
    const content = Object.entries(value).map(([key, entry]) => jsonToXmlValue(entry, key)).join("")
    return `<${nodeName}>${content}</${nodeName}>`
  }
  return `<${nodeName}>${String(value).replace(/[<>&]/g, "")}</${nodeName}>`
}

function htmlToMarkdown(html: string) {
  if (typeof window === "undefined") return html
  const parser = new DOMParser()
  const documentNode = parser.parseFromString(html, "text/html")
  const visit = (node: ChildNode): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || ""
    if (!(node instanceof HTMLElement)) return ""
    const content = Array.from(node.childNodes).map(visit).join("")
    switch (node.tagName.toLowerCase()) {
      case "h1": return `# ${content}\n\n`
      case "h2": return `## ${content}\n\n`
      case "h3": return `### ${content}\n\n`
      case "strong": case "b": return `**${content}**`
      case "em": case "i": return `*${content}*`
      case "code": return `\`${content}\``
      case "pre": return `\`\`\`\n${content.trim()}\n\`\`\`\n\n`
      case "a": return `[${content}](${node.getAttribute("href") || "#"})`
      case "li": return `- ${content}\n`
      case "p": return `${content}\n\n`
      case "br": return "\n"
      default: return content
    }
  }
  return Array.from(documentNode.body.childNodes).map(visit).join("").trim()
}

function parseSqlInsert(input: string) {
  const match = input.match(/insert\s+into\s+\w+\s*\(([^)]+)\)\s*values\s*([\s\S]+);?/i)
  if (!match) throw new Error("Expected an INSERT INTO ... VALUES statement.")
  const columns = match[1].split(",").map((value) => value.trim().replace(/[`"]/g, ""))
  const rows = match[2]
    .trim()
    .replace(/;$/, "")
    .split(/\),\s*\(/)
    .map((row) => row.replace(/^\(/, "").replace(/\)$/, ""))
  return rows.map((row) => {
    const values = row.split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map((value) => value.trim())
    return Object.fromEntries(
      columns.map((column, index) => [
        column,
        values[index]?.replace(/^'/, "").replace(/'$/, "").replace(/^null$/i, "") ?? "",
      ])
    )
  })
}

function parseEnv(input: string) {
  const parsed: Record<string, string> = {}
  input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .forEach((line) => {
      const equalsIndex = line.indexOf("=")
      if (equalsIndex > -1) {
        const key = line.slice(0, equalsIndex).trim()
        const value = line.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, "")
        parsed[key] = value
      }
    })
  return parsed
}

function prettifyLogs(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return ""
      const parsed = safeJsonParse(trimmed)
      if (parsed.data) return JSON.stringify(parsed.data, null, 2)
      return trimmed.replace(/\s+/g, " ").replace(/([A-Za-z0-9_]+)=/g, "\n$1=").trim()
    })
    .join("\n\n")
}

function textToBinary(input: string) {
  return Array.from(input)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ")
}

function binaryToText(input: string) {
  return input.trim().split(/\s+/).map((chunk) => String.fromCharCode(parseInt(chunk, 2))).join("")
}

function textToMorse(input: string) {
  return input.toLowerCase().split("").map((char) => MORSE_MAP[char] || "").join(" ").trim()
}

function morseToText(input: string) {
  return input.trim().split(/\s+/).map((chunk) => MORSE_REVERSE[chunk] || "").join("")
}

function toLeetSpeak(input: string, intensity = 1) {
  const map: Record<string, string[]> = {
    a: ["4", "@"], e: ["3"], i: ["1", "!"], o: ["0"], s: ["5", "$"], t: ["7"],
  }
  return input
    .split("")
    .map((char) => {
      const variants = map[char.toLowerCase()]
      if (!variants || Math.random() > intensity / 3) return char
      return randomFrom(variants)
    })
    .join("")
}

function encodeUnicode(input: string) {
  return Array.from(input)
    .map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`)
    .join("")
}

function decodeUnicode(input: string) {
  return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  )
}

function generateWordCloudData(input: string) {
  const frequency = new Map<string, number>()
  input
    .toLowerCase()
    .match(/[a-z0-9']+/g)
    ?.forEach((word) => {
      if (!STOP_WORDS.has(word)) frequency.set(word, (frequency.get(word) || 0) + 1)
    })
  return Array.from(frequency.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20)
}

function randomSyllable() {
  const consonants = ["b", "c", "d", "f", "g", "k", "l", "m", "n", "p", "r", "s", "t", "v"]
  const vowels = ["a", "e", "i", "o", "u", "ae", "ia", "ou"]
  return `${randomFrom(consonants)}${randomFrom(vowels)}`
}

function generateNonsenseWords(count: number, syllables: number) {
  return Array.from({ length: count }, () =>
    Array.from({ length: syllables }, randomSyllable)
      .join("")
      .replace(/^./, (char) => char.toUpperCase())
  )
}

function createAlias(style: string) {
  const first = randomFrom(NAME_PARTS.first).toLowerCase()
  const last = randomFrom(NAME_PARTS.last).toLowerCase()
  const suffix = Math.floor(Math.random() * 900 + 100)
  if (style === "pet") return `${first}-${randomFrom(["paws", "whiskers", "tail", "zoom"])}`
  if (style === "brand") return `${randomFrom(["nova", "pixel", "luma", "forge"])}-${last}`
  return `${first}_${last}_${suffix}`
}

function countSyllables(word: string) {
  const matches = word.toLowerCase().match(/[aeiouy]+/g)
  return Math.max(matches?.length || 1, 1)
}

function readabilityScore(text: string) {
  const words = text.match(/\b[\w']+\b/g) || []
  const sentences = text.split(/[.!?]+/).filter((entry) => entry.trim()).length || 1
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0) || 1
  const readingEase =
    206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length)
  return { words: words.length, sentences, syllables, readingEase: Number(readingEase.toFixed(2)) }
}

function extractColors(input: string) {
  const matches = input.match(/#(?:[0-9a-fA-F]{3}){1,2}\b|rgb\([^)]+\)|hsl\([^)]+\)/g) || []
  return Array.from(new Set(matches))
}

function keywordDensity(input: string) {
  const words = input.toLowerCase().match(/[a-z0-9']+/g) || []
  const frequency = new Map<string, number>()
  words.forEach((word) => {
    if (!STOP_WORDS.has(word)) frequency.set(word, (frequency.get(word) || 0) + 1)
  })
  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({
      word,
      count,
      density: `${((count / Math.max(words.length, 1)) * 100).toFixed(2)}%`,
    }))
}

function extractMetaTags(html: string) {
  if (typeof window === "undefined")
    return { title: "", description: "", canonical: "", ogTitle: "", ogDescription: "", ogImage: "", twitterCard: "" }
  const parser = new DOMParser()
  const documentNode = parser.parseFromString(html, "text/html")
  const grab = (selector: string, attribute = "content") =>
    documentNode.querySelector(selector)?.getAttribute(attribute) || ""
  return {
    title: documentNode.querySelector("title")?.textContent || "",
    description: grab('meta[name="description"]'),
    canonical: grab('link[rel="canonical"]', "href"),
    ogTitle: grab('meta[property="og:title"]'),
    ogDescription: grab('meta[property="og:description"]'),
    ogImage: grab('meta[property="og:image"]'),
    twitterCard: grab('meta[name="twitter:card"]'),
  }
}

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = () => reject(new Error("Failed to read file."))
    reader.readAsDataURL(file)
  })
}

async function readFileAsArrayBuffer(file: File) {
  return file.arrayBuffer()
}

function dataUrlToBlob(dataUrl: string) {
  const [header, base64] = dataUrl.split(",")
  const mime = header.match(/data:(.*?);base64/)?.[1] || "application/octet-stream"
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new Blob([bytes], { type: mime })
}

async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Image could not be loaded."))
    image.src = src
  })
}

async function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png", quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("Failed to create file output."))
    }, type, quality)
  })
}

function splitTextIntoChunks(text: string, chunkLines: number) {
  const lines = text.split(/\r?\n/)
  const chunks: string[] = []
  for (let index = 0; index < lines.length; index += chunkLines) {
    chunks.push(lines.slice(index, index + chunkLines).join("\n"))
  }
  return chunks
}

function toRoman(value: number) {
  const numerals: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"],
    [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ]
  let remaining = value
  let result = ""
  numerals.forEach(([amount, roman]) => {
    while (remaining >= amount) { result += roman; remaining -= amount }
  })
  return result
}

function fromRoman(value: string) {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  const text = value.toUpperCase()
  for (let index = 0; index < text.length; index += 1) {
    const current = map[text[index]]
    const next = map[text[index + 1]] || 0
    total += current < next ? -current : current
  }
  return total
}

function luhnCheckDigit(number: string) {
  const digits = number.split("").reverse().map((value) => parseInt(value, 10))
  const total = digits.reduce((sum, digit, index) => {
    if (index % 2 === 0) {
      const doubled = digit * 2
      return sum + (doubled > 9 ? doubled - 9 : doubled)
    }
    return sum + digit
  }, 0)
  return (10 - (total % 10)) % 10
}

function createIdenticonSvg(seed: string) {
  const hash = seed
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0)
    .toString(16)
  const color = `#${hash.padEnd(6, hash[0] || "7").slice(0, 6)}`
  const cells: string[] = []
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const on = ((hash.charCodeAt((row + col) % hash.length) || row + col) + row + col) % 2 === 0
      if (on) {
        cells.push(
          `<rect x="${col * 16}" y="${row * 16}" width="14" height="14" rx="3" fill="${color}" />`
        )
        if (col !== 2) {
          cells.push(
            `<rect x="${(4 - col) * 16}" y="${row * 16}" width="14" height="14" rx="3" fill="${color}" />`
          )
        }
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="20" fill="#f5f5f5"/>${cells.join("")}</svg>`
}

function timeoutFetch(url: string, timeoutMs = 5000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeout))
}

function nativeSelectClasses() {
  return "mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
}

function UploadDropzone({
  label,
  helper,
  multiple = false,
  accept,
  onFiles,
}: {
  label: string
  helper: string
  multiple?: boolean
  accept?: Record<string, string[]>
  onFiles: (files: File[]) => void
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    accept,
    onDrop: onFiles,
  })

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? "border-primary bg-primary/5" : "hover:border-primary"
        }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <p className="font-medium">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
    </div>
  )
}

function ResultBox({
  value,
  filename,
  copy,
}: {
  value: string
  filename?: string
  copy: (value: string) => Promise<boolean>
}) {
  return (
    <div className="space-y-3">
      <Textarea readOnly value={value} className="min-h-[220px] font-mono text-sm" />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => copy(value)} disabled={!value}>
          <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
          Copy
        </Button>
        {filename ? (
          <Button
            variant="outline"
            onClick={() => downloadBlob(new Blob([value], { type: "text/plain" }), filename)}
            disabled={!value}
          >
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Download
          </Button>
        ) : null}
      </div>
    </div>
  )
}

// ─── Per-tool SEO content ─────────────────────────────────────────────────────

const TOOL_SEO: Record<string, {
  h1: string
  description: string
  features: string[]
  faq: { q: string; a: string }[]
  schema: object
}> = {
  "audio-waveform-visualizer": {
    h1: "Free Online Audio Waveform Visualizer",
    description:
      "Instantly render the amplitude waveform of any MP3, WAV, OGG, or M4A file, directly in your browser. No upload, no account — completely private.",
    features: [
      "Client-side decoding with the Web Audio API — your file never leaves your device",
      "Supports MP3, WAV, M4A, and OGG formats",
      "Pixel-perfect amplitude waveform at full canvas resolution",
      "Custom waveform colour picker",
      "Download the rendered waveform as a PNG image",
    ],
    faq: [
      { q: "What audio formats are supported?", a: "MP3, WAV, M4A, and OGG via the browser's built-in Web Audio API decoder." },
      { q: "Is my audio uploaded to a server?", a: "No. All decoding and rendering happens inside your browser. Your file never leaves your device." },
      { q: "Why does only one channel appear?", a: "The visualizer plots the first (left) channel. For mono files this is the full signal; for stereo it represents the left channel." },
      { q: "Can I use the waveform image commercially?", a: "Yes. The image is generated from your own audio and belongs entirely to you." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Free Online Audio Waveform Visualizer",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "All",
      description: "Render audio waveforms in your browser. Supports MP3, WAV, OGG, M4A. No server upload required.",
    },
  },
  "audio-recorder": {
    h1: "Free Online Audio Recorder",
    description:
      "Record audio from your microphone right in the browser. Instant playback and one-click download as MP4 — no app or extension needed.",
    features: [
      "One-click microphone recording using the MediaRecorder API",
      "Live recording timer so you know your exact duration",
      "Instant in-browser playback after stopping",
      "Download as MP4 audio — compatible with all modern browsers",
      "No account, no server upload — 100% private",
    ],
    faq: [
      { q: "What format is the recording saved in?", a: "MP4 audio, supported natively by all modern browsers. Free tools like ffmpeg can convert it to MP3." },
      { q: "Does it work on mobile?", a: "Yes — the MediaRecorder API is supported on Safari 14.5+ and modern Android browsers." },
      { q: "Is my recording stored anywhere?", a: "No. It lives in your browser's memory only and is gone when you close the tab unless you download it." },
      { q: "Can I record multiple takes?", a: "Yes — start a new recording and the previous playback is replaced. Download each take before starting the next one." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Free Online Audio Recorder",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "All",
      description: "Record audio from your microphone in the browser and download it instantly. No sign-up required.",
    },
  },
  metronome: {
    h1: "Free Online Metronome",
    description:
      "A precise browser-based metronome for musicians, producers, and students. Set your BPM, tap the tempo, and practise in time — no download required.",
    features: [
      "Web Audio API scheduler — sample-accurate, no drift over time",
      "BPM range: 20–300, covering every practical musical tempo",
      "Tap-tempo detection averaged over up to 6 taps",
      "BPM slider for quick adjustments",
      "Volume control to balance the click with backing tracks",
    ],
    faq: [
      { q: "How accurate is the browser metronome?", a: "The Web Audio API scheduler is sample-accurate and far more precise than a plain JavaScript setInterval." },
      { q: "What BPM range is supported?", a: "20 BPM (very slow) up to 300 BPM (extremely fast), covering every practical musical tempo." },
      { q: "How does tap tempo work?", a: "Tap the button at least twice in rhythm. The tool averages the intervals of up to 6 recent taps to calculate your BPM." },
      { q: "Does it work offline?", a: "Once the page loads, the metronome itself runs without an internet connection since all processing is local." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Free Online Metronome",
      applicationCategory: "MusicApplication",
      operatingSystem: "All",
      description: "Precise browser metronome with tap tempo, BPM slider, and volume control. No download required.",
    },
  },
  "tone-generator": {
    h1: "Free Online Tone Generator",
    description:
      "Generate pure sine, square, sawtooth, or triangle tones at any frequency from 20 Hz to 20 000 Hz. Ideal for audio testing, ear training, and instrument tuning.",
    features: [
      "Sine, square, sawtooth, and triangle waveforms",
      "Full human-hearing range: 20 Hz – 20 000 Hz",
      "Quick-reference pitches: A4 440 Hz, C4 261 Hz, A3 220 Hz, 1 kHz",
      "Fine-grained volume control",
      "Frequency slider for fast sweeps across the spectrum",
    ],
    faq: [
      { q: "What waveforms are available?", a: "Sine (pure tone), square, sawtooth, and triangle. Each has different harmonic content and timbre." },
      { q: "Can I use it to tune instruments?", a: "Yes — set the frequency to the target pitch (e.g. 440 Hz for A4) and tune your instrument to match." },
      { q: "Is the frequency precise?", a: "Yes. The OscillatorNode runs at sample rate and frequency is set with floating-point precision." },
      { q: "Why be careful at high volumes with headphones?", a: "Pure tones at high levels can cause ear fatigue. Start low and increase gradually, especially above 2 000 Hz." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Free Online Tone Generator",
      applicationCategory: "MusicApplication",
      operatingSystem: "All",
      description: "Generate sine, square, sawtooth, and triangle tones at any frequency in your browser.",
    },
  },
  "white-noise-generator": {
    h1: "Free Online White Noise Generator",
    description:
      "Generate looping white noise directly in your browser for focus, sleep, tinnitus relief, or audio equipment testing. No ads, no streaming, no sign-up.",
    features: [
      "True white noise generated sample-by-sample with the Web Audio API",
      "Seamless looping — no audible repeats or clicks",
      "Volume slider to blend with other sounds",
      "Runs offline after the first page load",
      "Zero data sent to any server",
    ],
    faq: [
      { q: "What is white noise?", a: "A random audio signal with equal energy at every audible frequency, producing a consistent 'shush' sound." },
      { q: "How is it different from pink noise?", a: "Pink noise reduces energy as frequency increases, sounding warmer. White noise is flat across all frequencies, sounding brighter." },
      { q: "Can I use it overnight?", a: "Yes, but keep the volume comfortable (below ~65 dB) to avoid hearing fatigue." },
      { q: "Does it loop seamlessly?", a: "Yes. The audio buffer loops via the Web Audio API, so there are no audible gaps or clicks." },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Free Online White Noise Generator",
      applicationCategory: "HealthApplication",
      operatingSystem: "All",
      description: "Looping white noise in your browser for focus, sleep, or audio testing. Free and private.",
    },
  },
}

// ─── Reusable SEO block ───────────────────────────────────────────────────────

function AudioToolSeoContent({ toolId }: { toolId: string }) {
  const seo = TOOL_SEO[toolId]
  if (!seo) return null

  return (
    <article className="mt-12 space-y-12 divide-y divide-border/50" aria-label="Tool information">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema) }}
      />

      {/* Description */}
      <section className="pt-8" aria-labelledby={`${toolId}-about`}>
        <div className="max-w-3xl">
          <h2 id={`${toolId}-about`} className="text-2xl font-extrabold mb-4 tracking-tight">
            About This Tool
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">{seo.description}</p>
        </div>
      </section>

      {/* Features + FAQ grid */}
      <section className="pt-10 grid md:grid-cols-2 gap-8">
        <div className="bg-muted/20 p-7 rounded-2xl border border-border/50">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2" aria-label="Key features">
            <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
            Key Features
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            {seo.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm leading-relaxed">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-muted/20 p-7 rounded-2xl border border-border/50">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
            Frequently Asked Questions
          </h2>
          <dl className="space-y-5">
            {seo.faq.map(({ q, a }, i) => (
              <div key={i}>
                <dt className="font-semibold text-sm text-foreground mb-1">{q}</dt>
                <dd className="text-sm text-muted-foreground leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Privacy assurance */}
      <section className="pt-8 pb-2">
        <div className="flex items-start gap-3 text-sm text-muted-foreground max-w-xl">
          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            <strong className="text-foreground">100% private.</strong>{" "}
            All processing runs locally in your browser using the Web Audio API.
            No audio data is ever sent to a server, stored, or logged.
          </p>
        </div>
      </section>
    </article>
  )
}

// ─── Main AudioTools component (ALL original tools preserved + enhanced) ───────

function AudioTools({ toolId }: { toolId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [recording, setRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)  // NEW
  const [audioUrl, setAudioUrl] = useState("")
  const [bpm, setBpm] = useState(100)
  const [frequency, setFrequency] = useState(440)
  const [waveformType, setWaveformType] = useState<OscillatorType>("sine") // NEW
  const [volume, setVolume] = useState(0.5)                                // NEW
  const [isPlaying, setIsPlaying] = useState(false)                        // NEW
  const [tapTimes, setTapTimes] = useState<number[]>([])                  // NEW
  const [waveformColor, setWaveformColor] = useState("#2563eb")            // NEW
  const [waveformDownloadUrl, setWaveformDownloadUrl] = useState<string | null>(null) // NEW
  const [micError, setMicError] = useState<string | null>(null)           // NEW

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)    // NEW
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)                       // NEW
  const noiseSourceRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)                      // NEW

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
      noiseSourceRef.current?.stop?.()
      audioContextRef.current?.close?.()
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  // ── Audio Waveform Visualizer ────────────────────────────────────────────

  if (toolId === "audio-waveform-visualizer") {
    const renderWaveform = async (selected: File, color: string) => {
      setFile(selected)
      setWaveformDownloadUrl(null)
      const buffer = await selected.arrayBuffer()
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(buffer.slice(0))
      await audioContext.close()
      const canvas = canvasRef.current
      const context = canvas?.getContext("2d")
      if (!canvas || !context) return
      canvas.width = 800
      canvas.height = 240
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = color
      const data = audioBuffer.getChannelData(0)
      const step = Math.ceil(data.length / canvas.width)
      const amp = canvas.height / 2
      for (let index = 0; index < canvas.width; index += 1) {
        const slice = data.subarray(index * step, (index + 1) * step)
        let min = 0; let max = 0
        for (let j = 0; j < slice.length; j++) {
          if (slice[j] < min) min = slice[j]
          if (slice[j] > max) max = slice[j]
        }
        context.fillRect(index, (1 + min) * amp, 1, Math.max(1, (max - min) * amp))
      }
      setWaveformDownloadUrl(canvas.toDataURL("image/png"))
    }

    const handleFiles = (files: File[]) => {
      const selected = files[0]
      if (!selected) return
      renderWaveform(selected, waveformColor)
    }

    const handleColorChange = (color: string) => {
      setWaveformColor(color)
      if (file) renderWaveform(file, color)
    }

    return (
      <>
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {TOOL_SEO[toolId]?.h1 ?? "Audio Waveform Visualizer"}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Upload any audio file to render a pixel-perfect waveform, right in your browser.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Load Audio">
            <UploadDropzone
              label="Drop an audio file"
              helper="MP3, WAV, M4A, OGG supported. We'll decode the first channel and plot its waveform."
              accept={{ "audio/*": [".mp3", ".wav", ".m4a", ".ogg"] }}
              onFiles={handleFiles}
            />
            {/* NEW: colour picker */}
            <div className="mt-4 flex items-center gap-3">
              <Label htmlFor="waveform-color" className="text-sm font-medium shrink-0">
                Waveform colour
              </Label>
              <input
                id="waveform-color"
                type="color"
                value={waveformColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-8 w-12 cursor-pointer rounded border bg-background p-0.5"
                aria-label="Choose waveform colour"
              />
              <span className="text-xs text-muted-foreground font-mono">{waveformColor}</span>
            </div>
          </ToolCard>

          <ToolCard title="Waveform">
            <canvas
              ref={canvasRef}
              className="w-full rounded-xl border bg-background"
              aria-label="Audio waveform visualization"
            />
            {file && (
              <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm text-muted-foreground">
                  {file.name} — {formatBytes(file.size)}
                </p>
                {/* NEW: save waveform as PNG */}
                {waveformDownloadUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.download = "waveform.png"
                      link.href = waveformDownloadUrl
                      link.click()
                    }}
                    aria-label="Save waveform as PNG"
                  >
                    <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                    Save as PNG
                  </Button>
                )}
              </div>
            )}
          </ToolCard>
        </div>

        <AudioToolSeoContent toolId={toolId} />
      </>
    )
  }

  // ── Audio Recorder ───────────────────────────────────────────────────────

  if (toolId === "audio-recorder") {
    const formatTime = (secs: number) => {
      const m = Math.floor(secs / 60).toString().padStart(2, "0")
      const s = (secs % 60).toString().padStart(2, "0")
      return `${m}:${s}`
    }

    const toggleRecording = async () => {
      if (recording) {
        mediaRecorderRef.current?.stop()
        streamRef.current?.getTracks().forEach((t) => t.stop())
        if (timerRef.current) clearInterval(timerRef.current)
        setRecording(false)
        return
      }

      setMicError(null)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        const recorder = new MediaRecorder(stream)
        chunksRef.current = []
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) chunksRef.current.push(event.data)
        }
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/mp4" })
          if (audioUrl) URL.revokeObjectURL(audioUrl)
          setAudioUrl(URL.createObjectURL(blob))
          setRecordingSeconds(0)
        }
        recorder.start()
        mediaRecorderRef.current = recorder
        setRecording(true)
        setRecordingSeconds(0)
        // NEW: live timer
        timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000)
      } catch {
        setMicError(
          "Microphone access was denied. Please allow microphone access in your browser settings and try again."
        )
      }
    }

    return (
      <>
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {TOOL_SEO[toolId]?.h1 ?? "Audio Recorder"}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Record from your microphone, play it back instantly, and download — all inside your browser.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Recorder">
            <div className="space-y-4">
              <Button
                onClick={toggleRecording}
                variant={recording ? "destructive" : "default"}
                aria-pressed={recording}
                aria-label={recording ? "Stop recording" : "Start recording"}
                className="w-full"
              >
                {recording ? (
                  <><Square className="mr-2 h-4 w-4" aria-hidden="true" />Stop Recording</>
                ) : (
                  <><Mic className="mr-2 h-4 w-4" aria-hidden="true" />Start Recording</>
                )}
              </Button>

              {/* NEW: live timer */}
              {recording && (
                <div
                  className="flex items-center gap-2 text-sm font-medium text-destructive"
                  role="status"
                  aria-live="polite"
                >
                  <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" aria-hidden="true" />
                  Recording — {formatTime(recordingSeconds)}
                </div>
              )}

              {micError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  <AlertDescription>{micError}</AlertDescription>
                </Alert>
              )}
            </div>
          </ToolCard>

          <ToolCard title="Playback">
            {audioUrl ? (
              <div className="space-y-4">
                <audio controls src={audioUrl} className="w-full" aria-label="Recorded audio playback" />
                <Button
                  onClick={async () => {
                    const response = await fetch(audioUrl)
                    downloadBlob(await response.blob(), "recording.mp4")
                  }}
                >
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Download Recording
                </Button>
              </div>
            ) : (
              <ToolEmptyState
                tool={getToolById(toolId)!}
                title="No recording yet"
                description="Start and stop a microphone recording to review the captured audio."
              />
            )}
          </ToolCard>
        </div>

        <AudioToolSeoContent toolId={toolId} />
      </>
    )
  }

  // ── Metronome / Tone Generator / White Noise ─────────────────────────────

  const getOrCreateContext = () => {
    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      audioContextRef.current = new AudioContext()
    }
    return audioContextRef.current
  }

  const startAudio = async (type: "metronome" | "noise" | "tone") => {
    const ctx = getOrCreateContext()

    // Shared gain node — allows live volume changes without restart
    if (!gainNodeRef.current) {
      gainNodeRef.current = ctx.createGain()
      gainNodeRef.current.connect(ctx.destination)
    }
    gainNodeRef.current.gain.value = volume

    if (type === "metronome") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setIsPlaying(false)
        return
      }
      setIsPlaying(true)
      intervalRef.current = setInterval(() => {
        const oscillator = ctx.createOscillator()
        const gain = ctx.createGain()
        oscillator.frequency.value = 1000
        gain.gain.value = 0.06 * volume
        oscillator.connect(gain).connect(ctx.destination)
        oscillator.start()
        oscillator.stop(ctx.currentTime + 0.05)
      }, (60 / bpm) * 1000)
      return
    }

    noiseSourceRef.current?.stop?.()
    setIsPlaying(true)

    if (type === "tone") {
      const oscillator = ctx.createOscillator()
      oscillator.type = waveformType  // NEW: use selected waveform
      oscillator.frequency.value = frequency
      oscillator.connect(gainNodeRef.current)
      oscillator.start()
      noiseSourceRef.current = oscillator
      return
    }

    // White noise
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const channel = buffer.getChannelData(0)
    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(gainNodeRef.current)
    source.start()
    noiseSourceRef.current = source
  }

  const stopAudio = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    noiseSourceRef.current?.stop?.()
    noiseSourceRef.current = null
    setIsPlaying(false)
  }

  // NEW: tap tempo
  const handleTap = () => {
    const now = Date.now()
    const recent = [...tapTimes, now].filter((t) => now - t < 4000).slice(-6)
    setTapTimes(recent)
    if (recent.length >= 2) {
      const intervals = recent.slice(1).map((t, i) => t - recent[i])
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length
      setBpm(Math.max(20, Math.min(300, Math.round(60000 / avg))))
    }
  }

  // NEW: live volume update without audio restart
  const handleVolumeChange = (val: number) => {
    setVolume(val)
    if (gainNodeRef.current) gainNodeRef.current.gain.value = val
  }

  const audioType: "metronome" | "noise" | "tone" =
    toolId === "metronome" ? "metronome"
      : toolId === "white-noise-generator" ? "noise"
        : "tone"

  return (
    <>
      {TOOL_SEO[toolId] && (
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">{TOOL_SEO[toolId].h1}</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">{TOOL_SEO[toolId].description}</p>
        </header>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title={toolId === "metronome" ? "Tempo" : "Generator"}>
          <div className="space-y-5">

            {/* Metronome BPM */}
            {toolId === "metronome" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bpm-input">BPM</Label>
                  <span
                    className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded"
                    aria-live="polite"
                  >
                    {bpm} BPM
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="bpm-input"
                    type="number"
                    value={bpm}
                    min={20}
                    max={300}
                    onChange={(event) =>
                      setBpm(Math.max(20, Math.min(300, Number(event.target.value) || 60)))
                    }
                    className="flex-1"
                    aria-label="Beats per minute"
                  />
                  {/* NEW: tap tempo button */}
                  <Button variant="outline" onClick={handleTap} aria-label="Tap to detect tempo">
                    Tap
                  </Button>
                </div>
                {/* NEW: BPM range slider */}
                <input
                  type="range"
                  min={20}
                  max={300}
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-full accent-primary"
                  aria-label="BPM slider"
                />
              </div>
            )}

            {/* Tone generator frequency */}
            {toolId === "tone-generator" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="freq-input">Frequency (Hz)</Label>
                  <span
                    className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded"
                    aria-live="polite"
                  >
                    {frequency} Hz
                  </span>
                </div>
                <Input
                  id="freq-input"
                  type="number"
                  value={frequency}
                  min={20}
                  max={20000}
                  onChange={(event) =>
                    setFrequency(Math.max(20, Math.min(20000, Number(event.target.value) || 440)))
                  }
                  aria-label="Tone frequency in hertz"
                />
                {/* NEW: frequency range slider */}
                <input
                  type="range"
                  min={20}
                  max={20000}
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full accent-primary"
                  aria-label="Frequency slider"
                />
                {/* NEW: waveform type picker */}
                <div className="space-y-1">
                  <Label htmlFor="waveform-type">Waveform</Label>
                  <select
                    id="waveform-type"
                    value={waveformType}
                    onChange={(e) => setWaveformType(e.target.value as OscillatorType)}
                    className={nativeSelectClasses()}
                    aria-label="Select oscillator waveform type"
                  >
                    <option value="sine">Sine — pure tone</option>
                    <option value="square">Square</option>
                    <option value="sawtooth">Sawtooth</option>
                    <option value="triangle">Triangle</option>
                  </select>
                </div>
                {/* NEW: quick-reference pitch buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { label: "A4 · 440 Hz", hz: 440 },
                    { label: "C4 · 261 Hz", hz: 261 },
                    { label: "A3 · 220 Hz", hz: 220 },
                    { label: "1 kHz", hz: 1000 },
                  ].map(({ label, hz }) => (
                    <Button
                      key={hz}
                      variant="outline"
                      size="sm"
                      onClick={() => setFrequency(hz)}
                      aria-label={`Set frequency to ${hz} Hz`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* NEW: shared volume control for all generator tools */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="volume-slider" className="flex items-center gap-1.5">
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  Volume
                </Label>
                <span className="text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
              </div>
              <input
                id="volume-slider"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full accent-primary"
                aria-label="Volume control"
              />
            </div>

            {/* Start / Stop — original behaviour preserved */}
            <div className="flex gap-2">
              <Button
                onClick={() => startAudio(audioType)}
                aria-label="Start audio"
              >
                <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                Start
              </Button>
              <Button variant="outline" onClick={stopAudio} aria-label="Stop audio">
                Stop
              </Button>
            </div>

            {/* NEW: live playing status */}
            {isPlaying && (
              <div
                className="flex items-center gap-2 text-sm font-medium text-primary"
                role="status"
                aria-live="polite"
              >
                <Activity className="h-4 w-4 animate-pulse" aria-hidden="true" />
                {toolId === "metronome"
                  ? `Playing · ${bpm} BPM`
                  : toolId === "tone-generator"
                    ? `${frequency} Hz · ${waveformType}`
                    : "White noise running"}
              </div>
            )}
          </div>
        </ToolCard>

        <ToolCard title="Notes">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Browser audio tools require a user interaction before playback. Keep the tab active
              while tones or noise are running.
            </p>
            {toolId === "metronome" && (
              <p>
                Use the <strong className="text-foreground">Tap</strong> button to detect your tempo
                by tapping in rhythm — up to 6 recent taps are averaged automatically.
              </p>
            )}
            {toolId === "tone-generator" && (
              <p>
                Use the quick-reference buttons to jump to common musical pitches. Avoid prolonged
                exposure at high volumes, especially with headphones.
              </p>
            )}
            {toolId === "white-noise-generator" && (
              <p>
                White noise contains equal energy at all frequencies. Keep volume at a comfortable
                level for long or overnight sessions.
              </p>
            )}
          </div>
        </ToolCard>
      </div>

      <AudioToolSeoContent toolId={toolId} />
    </>
  )
}

export default AudioTools
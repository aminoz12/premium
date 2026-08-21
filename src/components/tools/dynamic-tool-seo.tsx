"use client"

/* eslint-disable react-hooks/rules-of-hooks */

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
} from "lucide-react"
import { ToolCard, ToolEmptyState, ToolLayout } from "@/components/layout/tool-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useClipboard } from "@/hooks/use-clipboard"
import { normalizePublicHttpUrl } from "@/lib/security"
import { formatBytes } from "@/lib/tools/utils"
import { getToolById } from "@/lib/tools/tools-config"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const MORSE_MAP: Record<string, string> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  " ": "/",
}

const MORSE_REVERSE = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([key, value]) => [value, key])
)

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "is",
  "are",
  "was",
  "were",
  "be",
  "this",
  "that",
  "it",
  "as",
  "at",
  "by",
  "from",
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
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Tokyo",
  "Australia/Sydney",
]

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.35,
  MAD: 9.89,
  AED: 3.67,
  INR: 83.1,
  JPY: 150.4,
}

function slugToWords(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
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
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=")
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
  if (documentNode.querySelector("parsererror")) {
    throw new Error("Invalid XML document.")
  }

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

function jsonToXmlValue(value: any, nodeName = "item") {
  if (value === null || value === undefined) {
    return `<${nodeName} />`
  }
  if (Array.isArray(value)) {
    return value.map((item) => jsonToXmlValue(item, nodeName)).join("")
  }
  if (typeof value === "object") {
    const content = Object.entries(value)
      .map(([key, entry]) => jsonToXmlValue(entry, key))
      .join("")
    return `<${nodeName}>${content}</${nodeName}>`
  }
  return `<${nodeName}>${String(value).replace(/[<>&]/g, "")}</${nodeName}>`
}

function htmlToMarkdown(html: string) {
  if (typeof window === "undefined") return html
  const parser = new DOMParser()
  const documentNode = parser.parseFromString(html, "text/html")

  const visit = (node: ChildNode): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || ""
    }

    if (!(node instanceof HTMLElement)) {
      return ""
    }

    const content = Array.from(node.childNodes)
      .map(visit)
      .join("")

    switch (node.tagName.toLowerCase()) {
      case "h1":
        return `# ${content}\n\n`
      case "h2":
        return `## ${content}\n\n`
      case "h3":
        return `### ${content}\n\n`
      case "strong":
      case "b":
        return `**${content}**`
      case "em":
      case "i":
        return `*${content}*`
      case "code":
        return `\`${content}\``
      case "pre":
        return `\`\`\`\n${content.trim()}\n\`\`\`\n\n`
      case "a":
        return `[${content}](${node.getAttribute("href") || "#"})`
      case "li":
        return `- ${content}\n`
      case "p":
        return `${content}\n\n`
      case "br":
        return "\n"
      default:
        return content
    }
  }

  return Array.from(documentNode.body.childNodes)
    .map(visit)
    .join("")
    .trim()
}

function parseSqlInsert(input: string) {
  const match = input.match(/insert\s+into\s+\w+\s*\(([^)]+)\)\s*values\s*([\s\S]+);?/i)
  if (!match) {
    throw new Error("Expected an INSERT INTO ... VALUES statement.")
  }

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
      if (parsed.data) {
        return JSON.stringify(parsed.data, null, 2)
      }
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
  return input
    .trim()
    .split(/\s+/)
    .map((chunk) => String.fromCharCode(parseInt(chunk, 2)))
    .join("")
}

function textToMorse(input: string) {
  return input
    .toLowerCase()
    .split("")
    .map((char) => MORSE_MAP[char] || "")
    .join(" ")
    .trim()
}

function morseToText(input: string) {
  return input
    .trim()
    .split(/\s+/)
    .map((chunk) => MORSE_REVERSE[chunk] || "")
    .join("")
}

function toLeetSpeak(input: string, intensity = 1) {
  const map: Record<string, string[]> = {
    a: ["4", "@"],
    e: ["3"],
    i: ["1", "!"],
    o: ["0"],
    s: ["5", "$"],
    t: ["7"],
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
      if (!STOP_WORDS.has(word)) {
        frequency.set(word, (frequency.get(word) || 0) + 1)
      }
    })

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
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
  const readingEase = 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length)

  return {
    words: words.length,
    sentences,
    syllables,
    readingEase: Number(readingEase.toFixed(2)),
  }
}

function extractColors(input: string) {
  const matches = input.match(/#(?:[0-9a-fA-F]{3}){1,2}\b|rgb\([^)]+\)|hsl\([^)]+\)/g) || []
  return Array.from(new Set(matches))
}

function keywordDensity(input: string) {
  const words = input.toLowerCase().match(/[a-z0-9']+/g) || []
  const frequency = new Map<string, number>()
  words.forEach((word) => {
    if (!STOP_WORDS.has(word)) {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    }
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
  if (typeof window === "undefined") return { title: "", description: "", canonical: "", ogTitle: "", ogDescription: "", ogImage: "", twitterCard: "" }
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
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ]
  let remaining = value
  let result = ""
  numerals.forEach(([amount, roman]) => {
    while (remaining >= amount) {
      result += roman
      remaining -= amount
    }
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
  const digits = number
    .split("")
    .reverse()
    .map((value) => parseInt(value, 10))
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
        cells.push(`<rect x="${col * 16}" y="${row * 16}" width="14" height="14" rx="3" fill="${color}" />`)
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
      <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
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
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        {filename ? (
          <Button
            variant="outline"
            onClick={() => downloadBlob(new Blob([value], { type: "text/plain" }), filename)}
            disabled={!value}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function SeoTools({ toolId }: { toolId: string }) {
  const { copy } = useClipboard()

  if (toolId === "broken-link-checker") {
    const [input, setInput] = useState("")
    const [results, setResults] = useState<Array<{ url: string; status: string }>>([])
    const [loading, setLoading] = useState(false)

    const checkLinks = async () => {
      const urls = input
        .split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean)
        .slice(0, 20)

      setLoading(true)
      try {
        const output = await Promise.all(
          urls.map(async (url) => {
            const normalized = normalizePublicHttpUrl(url)
            if (normalized.error) {
              return { url, status: normalized.error }
            }

            try {
              const response = await timeoutFetch(normalized.url, 4000)
              return {
                url: normalized.url,
                status: response.ok ? `Reachable (${response.status})` : `Error (${response.status})`,
              }
            } catch {
              return { url: normalized.url, status: "Blocked, timed out, or unreachable" }
            }
          })
        )
        setResults(output)
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="URL List">
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Checks are limited to 20 public HTTP or HTTPS URLs per run. Local, private, reserved,
                and credentialed URLs are rejected.
              </AlertDescription>
            </Alert>
            <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder={"https://example.com\nhttps://example.com/pricing"} className="min-h-[260px]" />
            <Button onClick={checkLinks} disabled={!input.trim() || loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Check Links
            </Button>
          </div>
        </ToolCard>
        <ToolCard title="Results">
          <div className="space-y-3">
            {results.map((entry) => (
              <div key={entry.url} className="rounded-lg border p-3">
                <div className="font-medium">{entry.url}</div>
                <div className="text-sm text-muted-foreground">{entry.status}</div>
              </div>
            ))}
          </div>
        </ToolCard>
      </div>
    )
  }

  const [title, setTitle] = useState("The Free AI Tools")
  const [description, setDescription] = useState("A privacy-first browser-based tools platform.")
  const [url, setUrl] = useState("https://thefreeaitools.com")
  const [htmlInput, setHtmlInput] = useState("")
  const [metricA, setMetricA] = useState(2.2)
  const [metricB, setMetricB] = useState(0.08)

  if (toolId === "seo-meta-extractor") {
    const extracted = extractMetaTags(htmlInput)
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Paste HTML">
          <Textarea value={htmlInput} onChange={(event) => setHtmlInput(event.target.value)} className="min-h-[280px] font-mono text-sm" />
        </ToolCard>
        <ToolCard title="Extracted Tags">
          <ResultBox value={JSON.stringify(extracted, null, 2)} filename="seo-meta.json" copy={copy} />
        </ToolCard>
      </div>
    )
  }

  if (toolId === "keyword-density-checker") {
    const rows = keywordDensity(htmlInput)
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Source Text">
          <Textarea value={htmlInput} onChange={(event) => setHtmlInput(event.target.value)} className="min-h-[280px]" />
        </ToolCard>
        <ToolCard title="Top Keywords">
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.word} className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium">{row.word}</span>
                <span className="text-sm text-muted-foreground">
                  {row.count} uses • {row.density}
                </span>
              </div>
            ))}
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "readability-score-calculator") {
    const score = readabilityScore(htmlInput)
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Analyze Text">
          <Textarea value={htmlInput} onChange={(event) => setHtmlInput(event.target.value)} className="min-h-[280px]" />
        </ToolCard>
        <ToolCard title="Readability Metrics">
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(score).map(([key, value]) => (
              <div key={key} className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">{slugToWords(key)}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "website-color-palette") {
    const colors = extractColors(htmlInput)
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Paste CSS or HTML">
          <Textarea value={htmlInput} onChange={(event) => setHtmlInput(event.target.value)} className="min-h-[280px] font-mono text-sm" />
        </ToolCard>
        <ToolCard title="Palette">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {colors.map((item) => (
              <button key={item} className="rounded-xl border p-3 text-left" onClick={() => copy(item)}>
                <div className="mb-2 h-16 rounded-lg border" style={{ background: item }} />
                <p className="text-xs font-medium">{item}</p>
              </button>
            ))}
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "page-speed-simulator") {
    const score = Math.max(0, 100 - metricA * 12 - metricB * 250)
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Core Metrics">
          <div className="space-y-4">
            <div>
              <Label>LCP (seconds)</Label>
              <Input type="number" step="0.1" value={metricA} onChange={(event) => setMetricA(Number(event.target.value) || 0)} className="mt-2" />
            </div>
            <div>
              <Label>CLS</Label>
              <Input type="number" step="0.01" value={metricB} onChange={(event) => setMetricB(Number(event.target.value) || 0)} className="mt-2" />
            </div>
          </div>
        </ToolCard>
        <ToolCard title="Estimated Score">
          <div className="rounded-xl border p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated performance score</p>
            <p className="text-5xl font-bold">{Math.round(score)}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Improve LCP image delivery and reduce layout shift to move closer to 90+.
            </p>
          </div>
        </ToolCard>
      </div>
    )
  }

  const tagOutput =
    toolId === "canonical-tag-generator"
      ? `<link rel="canonical" href="${url}" />`
      : toolId === "hreflang-tag-generator"
        ? [`<link rel="alternate" hrefLang="en" href="${url}" />`, `<link rel="alternate" hrefLang="x-default" href="${url}" />`].join("\n")
        : toolId === "open-graph-preview"
          ? [`<meta property="og:title" content="${title}" />`, `<meta property="og:description" content="${description}" />`, `<meta property="og:url" content="${url}" />`].join("\n")
          : `<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${description}" />`

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Inputs">
        <div className="space-y-4">
          <div>
            <Label>Title / Label</Label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 min-h-[140px]" />
          </div>
          <div>
            <Label>URL</Label>
            <Input value={url} onChange={(event) => setUrl(event.target.value)} className="mt-2" />
          </div>
        </div>
      </ToolCard>
      <ToolCard title="Generated Output">
        <div className="space-y-4">
          <ResultBox value={tagOutput} filename={`${toolId}.txt`} copy={copy} />
          {(toolId === "open-graph-preview" || toolId === "twitter-card-validator") ? (
            <div className="rounded-2xl border bg-background p-5 shadow-sm">
              <div className="mb-3 h-36 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{url}</p>
              <h3 className="mt-2 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          ) : null}
        </div>
      </ToolCard>
    </div>
  )
}


export default SeoTools

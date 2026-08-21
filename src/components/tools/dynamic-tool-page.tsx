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

function SecurityTools({ toolId }: { toolId: string }) {
  const { copy } = useClipboard()
  const [secret, setSecret] = useState("toolkit-secret")

  if (toolId === "bcrypt-compare") {
    const [password, setPassword] = useState("")
    const [hash, setHash] = useState("$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)

    const compareHash = async () => {
      try {
        setLoading(true)
        const matches = await bcrypt.compare(password, hash)
        setResult(matches ? "Password matches the supplied bcrypt hash." : "Password does not match the supplied bcrypt hash.")
      } catch {
        setResult("The provided hash could not be processed.")
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Compare Values">
          <div className="space-y-4">
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>Bcrypt Hash</Label>
              <Textarea value={hash} onChange={(event) => setHash(event.target.value)} className="mt-2 min-h-[160px] font-mono text-sm" />
            </div>
            <Button onClick={compareHash} disabled={!password || !hash || loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Compare
            </Button>
          </div>
        </ToolCard>
        <ToolCard title="Result">
          {result ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{result}</AlertDescription>
            </Alert>
          ) : (
            <ToolEmptyState
              tool={getToolById(toolId)!}
              title="Ready to compare"
              description="Paste a bcrypt hash and a plaintext value to see whether they match."
            />
          )}
        </ToolCard>
      </div>
    )
  }

  if (toolId === "jwt-signer") {
    const [header, setHeader] = useState('{"alg":"HS256","typ":"JWT"}')
    const [payload, setPayload] = useState('{"sub":"123","role":"admin","iat":1710000000}')
    const [token, setToken] = useState("")
    const [error, setError] = useState("")

    const signJwt = async () => {
      const parsedHeader = safeJsonParse(header)
      const parsedPayload = safeJsonParse(payload)
      if (parsedHeader.error || parsedPayload.error) {
        setError(parsedHeader.error || parsedPayload.error)
        return
      }

      setError("")
      const encodedHeader = base64UrlEncode(JSON.stringify(parsedHeader.data))
      const encodedPayload = base64UrlEncode(JSON.stringify(parsedPayload.data))
      const content = `${encodedHeader}.${encodedPayload}`
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      )
      const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(content))
      const signature = base64UrlEncode(new Uint8Array(signatureBuffer))
      setToken(`${content}.${signature}`)
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="JWT Inputs">
          <div className="space-y-4">
            <div>
              <Label>Header JSON</Label>
              <Textarea value={header} onChange={(event) => setHeader(event.target.value)} className="mt-2 min-h-[120px] font-mono text-sm" />
            </div>
            <div>
              <Label>Payload JSON</Label>
              <Textarea value={payload} onChange={(event) => setPayload(event.target.value)} className="mt-2 min-h-[160px] font-mono text-sm" />
            </div>
            <div>
              <Label>Secret</Label>
              <Input value={secret} onChange={(event) => setSecret(event.target.value)} className="mt-2" />
            </div>
            <Button onClick={signJwt}>Sign Token</Button>
          </div>
        </ToolCard>
        <ToolCard title="Signed Token">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <ResultBox value={token} filename="token.txt" copy={copy} />
          )}
        </ToolCard>
      </div>
    )
  }

  if (toolId === "aes-encrypt-decrypt") {
    const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt")
    const [input, setInput] = useState("Sensitive message")
    const [output, setOutput] = useState("")
    const [error, setError] = useState("")

    const runCrypto = async () => {
      try {
        setError("")
        const keyMaterial = await crypto.subtle.digest("SHA-256", encoder.encode(secret))
        const key = await crypto.subtle.importKey("raw", keyMaterial, "AES-GCM", false, [
          mode === "encrypt" ? "encrypt" : "decrypt",
        ])

        if (mode === "encrypt") {
          const iv = crypto.getRandomValues(new Uint8Array(12))
          const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(input))
          setOutput(`${base64UrlEncode(iv)}.${base64UrlEncode(new Uint8Array(encrypted))}`)
        } else {
          const [ivPart, dataPart] = input.split(".")
          if (!ivPart || !dataPart) throw new Error("Expected value in `iv.ciphertext` format.")
          const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: base64UrlDecode(ivPart) },
            key,
            base64UrlDecode(dataPart)
          )
          setOutput(decoder.decode(decrypted))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Crypto operation failed.")
      }
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="AES Workbench">
          <div className="space-y-4">
            <div>
              <Label>Mode</Label>
              <select value={mode} onChange={(event) => setMode(event.target.value as "encrypt" | "decrypt")} className={nativeSelectClasses()}>
                <option value="encrypt">Encrypt</option>
                <option value="decrypt">Decrypt</option>
              </select>
            </div>
            <div>
              <Label>{mode === "encrypt" ? "Plain Text" : "Encrypted Value"}</Label>
              <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="mt-2 min-h-[180px] font-mono text-sm" />
            </div>
            <div>
              <Label>Password / Secret</Label>
              <Input type="password" value={secret} onChange={(event) => setSecret(event.target.value)} className="mt-2" />
            </div>
            <Button onClick={runCrypto}>{mode === "encrypt" ? "Encrypt" : "Decrypt"}</Button>
          </div>
        </ToolCard>
        <ToolCard title="Result">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <ResultBox value={output} filename={mode === "encrypt" ? "encrypted.txt" : "decrypted.txt"} copy={copy} />
          )}
        </ToolCard>
      </div>
    )
  }

  if (toolId === "rsa-key-generator") {
    const [publicKey, setPublicKey] = useState("")
    const [privateKey, setPrivateKey] = useState("")
    const [modulusLength, setModulusLength] = useState("2048")
    const [loading, setLoading] = useState(false)

    const bufferToPem = (buffer: ArrayBuffer, label: string) => {
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      const body = base64.match(/.{1,64}/g)?.join("\n") || base64
      return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----`
    }

    const generateKeys = async () => {
      setLoading(true)
      try {
        const pair = await crypto.subtle.generateKey(
          {
            name: "RSA-OAEP",
            modulusLength: Number(modulusLength),
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
          },
          true,
          ["encrypt", "decrypt"]
        )
        const [spki, pkcs8] = await Promise.all([
          crypto.subtle.exportKey("spki", pair.publicKey),
          crypto.subtle.exportKey("pkcs8", pair.privateKey),
        ])
        setPublicKey(bufferToPem(spki, "PUBLIC KEY"))
        setPrivateKey(bufferToPem(pkcs8, "PRIVATE KEY"))
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="space-y-6">
        <ToolCard title="Generate Keys">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div>
              <Label>Key Size</Label>
              <select value={modulusLength} onChange={(event) => setModulusLength(event.target.value)} className={nativeSelectClasses()}>
                <option value="2048">2048-bit</option>
                <option value="4096">4096-bit</option>
              </select>
            </div>
            <Button onClick={generateKeys} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate RSA Keys
            </Button>
          </div>
        </ToolCard>
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Public Key">
            <ResultBox value={publicKey} filename="public-key.pem" copy={copy} />
          </ToolCard>
          <ToolCard title="Private Key">
            <ResultBox value={privateKey} filename="private-key.pem" copy={copy} />
          </ToolCard>
        </div>
      </div>
    )
  }

  const [plainText, setPlainText] = useState("")
  const [expectedHash, setExpectedHash] = useState("")
  const [matches, setMatches] = useState<string[]>([])

  const compareHashes = async () => {
    const sha = await sha256(plainText)
    const md5 = simulateMd5(plainText)
    const normalized = expectedHash.trim().toLowerCase()
    setMatches([sha === normalized ? "SHA-256" : "", md5 === normalized ? "Simulated MD5" : ""].filter(Boolean))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Source Text">
        <div className="space-y-4">
          <Textarea value={plainText} onChange={(event) => setPlainText(event.target.value)} className="min-h-[180px]" />
          <Input value={expectedHash} onChange={(event) => setExpectedHash(event.target.value)} placeholder="Paste a stored hash to compare" />
          <Button onClick={compareHashes}>Compare Hashes</Button>
        </div>
      </ToolCard>
      <ToolCard title="Comparison Result">
        {matches.length > 0 ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Matched algorithms: {matches.join(", ")}</AlertDescription>
          </Alert>
        ) : (
          <ToolEmptyState
            tool={getToolById(toolId)!}
            title="Awaiting comparison"
            description="We’ll compute common hashes from your text and compare them against the supplied value."
          />
        )}
      </ToolCard>
    </div>
  )
}

function DeveloperTools({ toolId }: { toolId: string }) {
  const { copy } = useClipboard()
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [previewHtml, setPreviewHtml] = useState("")
  const [error, setError] = useState("")
  const [fileOutput, setFileOutput] = useState("")
  const [mimeType, setMimeType] = useState("text/plain")
  const [schedulePreview, setSchedulePreview] = useState<string[]>([])

  useEffect(() => {
    const run = async () => {
      try {
        setError("")
        setPreviewHtml("")
        setSchedulePreview([])

        if (!input.trim() && !fileOutput) {
          setOutput("")
          return
        }

        if (toolId === "markdown-to-html") {
          const raw = await marked.parse(input)
          const safe = DOMPurify.sanitize(raw)
          setPreviewHtml(safe)
          setOutput(safe)
          return
        }

        if (toolId === "html-to-markdown") {
          setOutput(htmlToMarkdown(input))
          return
        }

        if (toolId === "xml-formatter") {
          setOutput(formatXml(input))
          return
        }

        if (toolId === "json-to-xml") {
          const parsed = safeJsonParse(input)
          if (parsed.error) throw new Error(parsed.error)
          setOutput(formatXml(`<?xml version="1.0"?>${jsonToXmlValue(parsed.data, "root")}`))
          return
        }

        if (toolId === "sql-to-json") {
          setOutput(JSON.stringify(parseSqlInsert(input), null, 2))
          return
        }

        if (toolId === "log-formatter") {
          setOutput(prettifyLogs(input))
          return
        }

        if (toolId === "env-parser") {
          setOutput(JSON.stringify(parseEnv(input), null, 2))
          return
        }

        if (toolId === "cron-parser") {
          const expression = CronExpressionParser.parse(input || "* * * * *")
          const upcoming = Array.from({ length: 5 }, () => expression.next().toString())
          setSchedulePreview(upcoming)
          setOutput(upcoming.join("\n"))
          return
        }

        setOutput("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to process the current input.")
      }
    }

    run()
  }, [fileOutput, input, toolId])

  if (toolId === "base64-image-encoder" || toolId === "data-uri-generator") {
    const title = toolId === "base64-image-encoder" ? "Encode Image" : "Generate Data URI"

    const handleFiles = async (files: File[]) => {
      const file = files[0]
      if (!file) return
      const dataUrl = await readFileAsDataUrl(file)
      if (toolId === "base64-image-encoder") {
        setFileOutput(dataUrl.split(",")[1] || "")
      } else {
        setFileOutput(dataUrl)
        setMimeType(file.type || mimeType)
      }
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title={title}>
          <div className="space-y-4">
            <UploadDropzone
              label="Drop a file here"
              helper="Images and small assets work best."
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".svg"] }}
              onFiles={handleFiles}
            />
            {toolId === "data-uri-generator" ? (
              <div>
                <Label>MIME Type Override</Label>
                <Input value={mimeType} onChange={(event) => setMimeType(event.target.value)} className="mt-2" />
              </div>
            ) : null}
          </div>
        </ToolCard>
        <ToolCard title="Encoded Output">
          <ResultBox
            value={fileOutput}
            filename={toolId === "base64-image-encoder" ? "image-base64.txt" : "data-uri.txt"}
            copy={copy}
          />
        </ToolCard>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Input">
        <div className="space-y-4">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={`Paste content for ${slugToWords(toolId).toLowerCase()}...`}
            className="min-h-[320px] font-mono text-sm"
          />
          {toolId === "cron-parser" ? (
            <p className="text-sm text-muted-foreground">
              Example: <code>*/15 * * * *</code>
            </p>
          ) : null}
        </div>
      </ToolCard>
      <ToolCard title="Output">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <ResultBox value={output} filename={`${toolId}.txt`} copy={copy} />
            {previewHtml ? (
              <div
                className="rounded-xl border bg-background p-4"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : null}
            {schedulePreview.length > 0 ? (
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="mb-2 text-sm font-medium">Upcoming runs</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {schedulePreview.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </ToolCard>
    </div>
  )
}

function TextTools({ toolId }: { toolId: string }) {
  const { copy } = useClipboard()

  if (toolId === "diff-checker") {
    const [left, setLeft] = useState("")
    const [right, setRight] = useState("")
    const parts = useMemo(() => diffLines(left, right), [left, right])

    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Original Text">
            <Textarea value={left} onChange={(event) => setLeft(event.target.value)} className="min-h-[260px] font-mono text-sm" />
          </ToolCard>
          <ToolCard title="Updated Text">
            <Textarea value={right} onChange={(event) => setRight(event.target.value)} className="min-h-[260px] font-mono text-sm" />
          </ToolCard>
        </div>
        <ToolCard title="Diff View">
          <div className="max-h-[320px] overflow-auto rounded-xl border bg-background p-4 font-mono text-sm">
            {parts.map((part, index) => (
              <span
                key={`${part.value}-${index}`}
                className={part.added ? "bg-emerald-100 dark:bg-emerald-900/40" : part.removed ? "bg-rose-100 dark:bg-rose-900/40 line-through" : ""}
              >
                {part.value}
              </span>
            ))}
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "random-text-generator") {
    const [count, setCount] = useState(3)
    const [tone, setTone] = useState("neutral")
    const [value, setValue] = useState("")

    const banks: Record<string, string[]> = {
      neutral: [
        "The Free AI Tools keeps routine browser work tidy and fast.",
        "Each utility is built to reduce friction instead of adding more tabs.",
        "Use these snippets as a starting point and customize as needed.",
      ],
      marketing: [
        "Launch polished copy faster with reusable message blocks and clear benefits.",
        "Turn rough ideas into concise value statements your audience can understand.",
        "Consistent messaging helps every page feel more confident and trustworthy.",
      ],
      technical: [
        "The system prioritizes deterministic output and defensive validation at every stage.",
        "Inputs are normalized before conversion to reduce parsing ambiguity.",
        "Browser-native APIs handle heavy work to keep the UI responsive.",
      ],
    }

    useEffect(() => {
      setValue(Array.from({ length: count }, (_, index) => banks[tone][index % banks[tone].length]).join("\n\n"))
    }, [count, tone])

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Generator Controls">
          <div className="space-y-4">
            <div>
              <Label>Paragraphs</Label>
              <Input type="number" min={1} max={8} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} className="mt-2" />
            </div>
            <div>
              <Label>Tone</Label>
              <select value={tone} onChange={(event) => setTone(event.target.value)} className={nativeSelectClasses()}>
                <option value="neutral">Neutral</option>
                <option value="marketing">Marketing</option>
                <option value="technical">Technical</option>
              </select>
            </div>
            <Button onClick={() => setValue((current) => `${current}\n\n${randomFrom(banks[tone])}`)}>
              Add Another Paragraph
            </Button>
          </div>
        </ToolCard>
        <ToolCard title="Generated Text">
          <ResultBox value={value} filename="random-text.txt" copy={copy} />
        </ToolCard>
      </div>
    )
  }

  if (toolId === "word-cloud-generator") {
    const [input, setInput] = useState("")
    const words = useMemo(() => generateWordCloudData(input), [input])

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Source Text">
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[280px]" />
        </ToolCard>
        <ToolCard title="Word Cloud">
          {words.length > 0 ? (
            <div className="flex min-h-[280px] flex-wrap content-start gap-3 rounded-xl border bg-background p-4">
              {words.map(([word, count], index) => (
                <span
                  key={word}
                  style={{
                    fontSize: `${14 + count * 6}px`,
                    transform: `rotate(${index % 2 === 0 ? -6 : 4}deg)`,
                    color: `hsl(${(index * 36) % 360} 70% 45%)`,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <ToolEmptyState
              tool={getToolById(toolId)!}
              title="Paste text to visualize it"
              description="We’ll highlight the most common non-trivial words with larger sizes."
            />
          )}
        </ToolCard>
      </div>
    )
  }

  if (toolId === "nonsense-word-generator" || toolId === "alias-generator") {
    const [count, setCount] = useState(6)
    const [mode, setMode] = useState(toolId === "alias-generator" ? "username" : "3")
    const [generated, setGenerated] = useState<string[]>([])

    const run = () => {
      if (toolId === "alias-generator") {
        setGenerated(Array.from({ length: count }, () => createAlias(mode)))
      } else {
        setGenerated(generateNonsenseWords(count, Number(mode)))
      }
    }

    useEffect(run, [count, mode])

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Controls">
          <div className="space-y-4">
            <div>
              <Label>Count</Label>
              <Input type="number" min={1} max={20} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} className="mt-2" />
            </div>
            <div>
              <Label>{toolId === "alias-generator" ? "Style" : "Syllables"}</Label>
              <select value={mode} onChange={(event) => setMode(event.target.value)} className={nativeSelectClasses()}>
                {toolId === "alias-generator" ? (
                  <>
                    <option value="username">Username</option>
                    <option value="brand">Brand</option>
                    <option value="pet">Pet Name</option>
                  </>
                ) : (
                  <>
                    <option value="2">2 syllables</option>
                    <option value="3">3 syllables</option>
                    <option value="4">4 syllables</option>
                  </>
                )}
              </select>
            </div>
            <Button onClick={run}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </ToolCard>
        <ToolCard title="Results">
          <div className="space-y-2">
            {generated.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium">{item}</span>
                <Button size="sm" variant="ghost" onClick={() => copy(item)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ToolCard>
      </div>
    )
  }

  const [mode, setMode] = useState("forward")
  const [input, setInput] = useState("")

  const transformed = useMemo(() => {
    try {
      if (!input) return ""

      switch (toolId) {
        case "text-reverser":
          if (mode === "words") return input.split(/\s+/).reverse().join(" ")
          if (mode === "lines") return input.split(/\r?\n/).reverse().join("\n")
          return input.split("").reverse().join("")
        case "binary-text-converter":
          return mode === "forward" ? textToBinary(input) : binaryToText(input)
        case "morse-code-converter":
          return mode === "forward" ? textToMorse(input) : morseToText(input)
        case "leet-speak-converter":
          return toLeetSpeak(input, mode === "forward" ? 2 : 1)
        case "unicode-converter":
          return mode === "forward" ? encodeUnicode(input) : decodeUnicode(input)
        default:
          return input
      }
    } catch {
      return ""
    }
  }, [input, mode, toolId])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Input">
        <div className="space-y-4">
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[280px]" />
          <div>
            <Label>Mode</Label>
            <select value={mode} onChange={(event) => setMode(event.target.value)} className={nativeSelectClasses()}>
              {toolId === "text-reverser" ? (
                <>
                  <option value="forward">Characters</option>
                  <option value="words">Words</option>
                  <option value="lines">Lines</option>
                </>
              ) : (
                <>
                  <option value="forward">Encode / Convert</option>
                  <option value="reverse">Decode / Reverse</option>
                </>
              )}
            </select>
          </div>
        </div>
      </ToolCard>
      <ToolCard title="Output">
        <ResultBox value={transformed} filename={`${toolId}.txt`} copy={copy} />
      </ToolCard>
    </div>
  )
}

function ImageTools({ toolId }: { toolId: string }) {
  const { copy } = useClipboard()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [aspect, setAspect] = useState("1")
  const [angle, setAngle] = useState(90)
  const [watermark, setWatermark] = useState("The Free AI Tools")
  const previewCardRef = useRef<HTMLDivElement>(null)

  const prepareFile = async (files: File[]) => {
    const selected = files[0]
    if (!selected) return
    if (!selected.type.startsWith("image/")) {
      toast.error("Please upload an image file.")
      return
    }
    setFile(selected)
    setPreview(await readFileAsDataUrl(selected))
  }

  if (toolId === "screenshot-capture") {
    const [title, setTitle] = useState("Launch faster")
    const [subtitle, setSubtitle] = useState("Capture a polished social-style card directly in your browser.")

    const capture = async () => {
      if (!previewCardRef.current) return
      const canvas = await html2canvas(previewCardRef.current, { backgroundColor: null, scale: 2 })
      const blob = await canvasToBlob(canvas)
      downloadBlob(blob, "screenshot.png")
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Card Content">
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Textarea value={subtitle} onChange={(event) => setSubtitle(event.target.value)} className="mt-2 min-h-[140px]" />
            </div>
            <Button onClick={capture}>
              <Download className="mr-2 h-4 w-4" />
              Capture PNG
            </Button>
          </div>
        </ToolCard>
        <ToolCard title="Preview">
          <div
            ref={previewCardRef}
            className="rounded-3xl bg-[linear-gradient(135deg,#0f172a,#2563eb,#10b981)] p-8 text-white shadow-xl"
          >
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/75">The Free AI Tools</p>
            <h3 className="mb-4 text-3xl font-bold">{title}</h3>
            <p className="max-w-md text-white/85">{subtitle}</p>
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "image-metadata-viewer") {
    const [metadata, setMetadata] = useState<Record<string, any> | null>(null)

    const handleFiles = async (files: File[]) => {
      const selected = files[0]
      if (!selected) return
      const result = (await exifr.parse(selected).catch(() => ({}))) || {}
      setMetadata({
        name: selected.name,
        type: selected.type,
        size: formatBytes(selected.size),
        ...(result || {}),
      })
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Upload Image">
          <UploadDropzone
            label="Drop an image to inspect"
            helper="JPEGs usually expose the most metadata."
            accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
            onFiles={handleFiles}
          />
        </ToolCard>
        <ToolCard title="Metadata">
          {metadata ? (
            <div className="max-h-[320px] space-y-2 overflow-auto rounded-xl border bg-background p-4 text-sm">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-4 border-b pb-2 last:border-0">
                  <span className="font-medium">{key}</span>
                  <span className="text-right text-muted-foreground">{String(value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <ToolEmptyState
              tool={getToolById(toolId)!}
              title="No metadata loaded"
              description="Upload an image to inspect file details and available EXIF values."
            />
          )}
        </ToolCard>
      </div>
    )
  }

  if (toolId === "svg-editor") {
    const [title, setTitle] = useState("Launch")
    const [background, setBackground] = useState("#0f172a")
    const [accent, setAccent] = useState("#22c55e")
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" fill="none"><rect width="640" height="320" rx="36" fill="${background}"/><circle cx="120" cy="80" r="42" fill="${accent}" fill-opacity="0.85"/><rect x="90" y="170" width="460" height="12" rx="6" fill="#ffffff" fill-opacity="0.18"/><rect x="90" y="200" width="320" height="12" rx="6" fill="#ffffff" fill-opacity="0.12"/><text x="90" y="132" fill="#ffffff" font-size="58" font-family="Arial, sans-serif" font-weight="700">${title}</text></svg>`

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="SVG Controls">
          <div className="space-y-4">
            <div>
              <Label>Headline</Label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>Background</Label>
              <Input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="mt-2 h-12" />
            </div>
            <div>
              <Label>Accent</Label>
              <Input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} className="mt-2 h-12" />
            </div>
            <Button onClick={() => downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "graphic.svg")}>
              <Download className="mr-2 h-4 w-4" />
              Download SVG
            </Button>
          </div>
        </ToolCard>
        <ToolCard title="Preview">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border" dangerouslySetInnerHTML={{ __html: svg }} />
            <ResultBox value={svg} filename="graphic.svg" copy={copy} />
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "image-batch-converter") {
    const [files, setFiles] = useState<File[]>([])
    const [format, setFormat] = useState("image/webp")
    const [loading, setLoading] = useState(false)

    const convertAll = async () => {
      if (!files.length) return
      setLoading(true)
      try {
        const zip = new JSZip()
        await Promise.all(
          files.map(async (item) => {
            const image = await loadImage(await readFileAsDataUrl(item))
            const canvas = document.createElement("canvas")
            canvas.width = image.width
            canvas.height = image.height
            const context = canvas.getContext("2d")
            if (!context) return
            context.drawImage(image, 0, 0)
            const blob = await canvasToBlob(canvas, format, 0.9)
            const extension = format.split("/")[1]
            zip.file(item.name.replace(/\.[^.]+$/, `.${extension}`), blob)
          })
        )
        downloadBlob(await zip.generateAsync({ type: "blob" }), "converted-images.zip")
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="space-y-6">
        <ToolCard title="Batch Input">
          <div className="space-y-4">
            <UploadDropzone
              label="Drop multiple images"
              helper="We’ll convert and bundle them into a ZIP file."
              multiple
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
              onFiles={setFiles}
            />
            <div>
              <Label>Target Format</Label>
              <select value={format} onChange={(event) => setFormat(event.target.value)} className={nativeSelectClasses()}>
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
            <Button onClick={convertAll} disabled={!files.length || loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Convert And Download ZIP
            </Button>
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "image-cropper" || toolId === "image-rotator" || toolId === "image-watermarker" || toolId === "image-flipper") {
    const process = async () => {
      if (!preview) return
      const image = await loadImage(preview)
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      if (!context) return

      let width = image.width
      let height = image.height

      if (toolId === "image-cropper") {
        const ratio = aspect === "free" ? image.width / image.height : Number(aspect)
        const cropWidth = Math.min(image.width, image.height * ratio)
        const cropHeight = cropWidth / ratio
        const sx = (image.width - cropWidth) / 2
        const sy = (image.height - cropHeight) / 2
        canvas.width = cropWidth
        canvas.height = cropHeight
        context.drawImage(image, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
      } else if (toolId === "image-rotator") {
        const radians = (angle * Math.PI) / 180
        const sin = Math.abs(Math.sin(radians))
        const cos = Math.abs(Math.cos(radians))
        canvas.width = Math.ceil(width * cos + height * sin)
        canvas.height = Math.ceil(width * sin + height * cos)
        context.translate(canvas.width / 2, canvas.height / 2)
        context.rotate(radians)
        context.drawImage(image, -width / 2, -height / 2)
      } else if (toolId === "image-flipper") {
        canvas.width = width
        canvas.height = height
        context.save()
        context.translate(width, 0)
        context.scale(-1, 1)
        context.drawImage(image, 0, 0)
        context.restore()
      } else {
        canvas.width = width
        canvas.height = height
        context.drawImage(image, 0, 0)
        context.globalAlpha = 0.55
        context.fillStyle = "#ffffff"
        context.font = `${Math.max(24, width / 18)}px sans-serif`
        context.fillText(watermark, width * 0.08, height * 0.9)
      }

      downloadBlob(await canvasToBlob(canvas, "image/png"), `${toolId}.png`)
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Upload Image">
          <div className="space-y-4">
            <UploadDropzone
              label="Drop an image"
              helper="PNG, JPG, and WebP are supported."
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
              onFiles={prepareFile}
            />
            {toolId === "image-cropper" ? (
              <div>
                <Label>Aspect Ratio</Label>
                <select value={aspect} onChange={(event) => setAspect(event.target.value)} className={nativeSelectClasses()}>
                  <option value="free">Free</option>
                  <option value="1">1:1</option>
                  <option value="1.7777777">16:9</option>
                  <option value="1.3333333">4:3</option>
                </select>
              </div>
            ) : null}
            {toolId === "image-rotator" ? (
              <div>
                <Label>Angle</Label>
                <Input type="number" value={angle} onChange={(event) => setAngle(Number(event.target.value) || 0)} className="mt-2" />
              </div>
            ) : null}
            {toolId === "image-watermarker" ? (
              <div>
                <Label>Watermark Text</Label>
                <Input value={watermark} onChange={(event) => setWatermark(event.target.value)} className="mt-2" />
              </div>
            ) : null}
            <Button onClick={process} disabled={!preview}>
              <Download className="mr-2 h-4 w-4" />
              Export Result
            </Button>
          </div>
        </ToolCard>
        <ToolCard title="Preview">
          {preview ? (
            <div className="rounded-xl border bg-muted/20 p-4">
              <img
                src={preview}
                alt="Uploaded preview"
                className="max-h-[420px] w-full rounded-xl object-contain"
                style={{
                  transform:
                    toolId === "image-rotator"
                      ? `rotate(${angle}deg)`
                      : toolId === "image-flipper"
                        ? "scaleX(-1)"
                        : undefined,
                }}
              />
            </div>
          ) : (
            <ToolEmptyState
              tool={getToolById(toolId)!}
              title="Upload an image to begin"
              description="We’ll show a safe preview before exporting your updated image."
            />
          )}
        </ToolCard>
      </div>
    )
  }

  return (
    <ToolEmptyState
      tool={getToolById(toolId)!}
      title="Image tool is ready"
      description="Upload an image to start processing. Drag and drop is supported on this page."
    />
  )
}

function DesignTools({ toolId }: { toolId: string }) {
  const { copy } = useClipboard()
  const [valueA, setValueA] = useState(8)
  const [valueB, setValueB] = useState(24)
  const [valueC, setValueC] = useState(0.5)
  const [color, setColor] = useState("#2563eb")

  const output = useMemo(() => {
    if (toolId === "css-filter-generator") {
      return `filter: blur(${valueA / 10}px) brightness(${100 + valueB}%) contrast(${100 + valueA}%);`
    }
    if (toolId === "text-shadow-generator") {
      return `text-shadow: ${valueA}px ${valueA}px ${valueB / 3}px ${color};`
    }
    if (toolId === "transform-generator") {
      return `transform: translate(${valueA}px, ${valueA / 2}px) scale(${valueC + 1}) rotate(${valueB}deg);`
    }
    if (toolId === "keyframes-animator") {
      return `@keyframes floatIn {\n  0% { transform: translateY(${valueB}px); opacity: 0; }\n  100% { transform: translateY(0); opacity: 1; }\n}`
    }
    return `M 20 140 Q ${80 + valueA} ${20 + valueB} 220 140`
  }, [color, toolId, valueA, valueB, valueC])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Controls">
        <div className="space-y-4">
          <div>
            <Label>Primary Value</Label>
            <Input type="number" value={valueA} onChange={(event) => setValueA(Number(event.target.value) || 0)} className="mt-2" />
          </div>
          <div>
            <Label>Secondary Value</Label>
            <Input type="number" value={valueB} onChange={(event) => setValueB(Number(event.target.value) || 0)} className="mt-2" />
          </div>
          <div>
            <Label>Scale / Strength</Label>
            <Input type="number" step="0.1" value={valueC} onChange={(event) => setValueC(Number(event.target.value) || 0)} className="mt-2" />
          </div>
          <div>
            <Label>Color</Label>
            <Input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="mt-2 h-12" />
          </div>
        </div>
      </ToolCard>
      <ToolCard title="Live Output">
        <div className="space-y-4">
          <div className="flex min-h-[200px] items-center justify-center rounded-xl border bg-muted/20 p-6">
            {toolId === "svg-path-editor" ? (
              <svg viewBox="0 0 260 180" className="h-44 w-full">
                <path d={output} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            ) : (
              <div
                className="rounded-2xl bg-background px-6 py-5 text-3xl font-bold"
                style={{
                  filter: toolId === "css-filter-generator" ? output.replace("filter: ", "").replace(";", "") : undefined,
                  textShadow: toolId === "text-shadow-generator" ? output.replace("text-shadow: ", "").replace(";", "") : undefined,
                  transform: toolId === "transform-generator" ? output.replace("transform: ", "").replace(";", "") : undefined,
                  animation: toolId === "keyframes-animator" ? "floatIn 2s ease-in-out infinite alternate" : undefined,
                }}
              >
                Preview
              </div>
            )}
          </div>
          <ResultBox value={output} filename={`${toolId}.css`} copy={copy} />
        </div>
      </ToolCard>
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
      const urls = input.split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean)
      setLoading(true)
      try {
        const output = await Promise.all(
          urls.map(async (url) => {
            try {
              const response = await timeoutFetch(url, 4000)
              return { url, status: response.ok ? `Reachable (${response.status})` : `Error (${response.status})` }
            } catch {
              return { url, status: "Blocked, timed out, or unreachable" }
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

function CalculatorTools({ toolId }: { toolId: string }) {
  const [a, setA] = useState(10)
  const [b, setB] = useState(100)
  const [c, setC] = useState(2)
  const [unitGroup, setUnitGroup] = useState("length")
  const [fromUnit, setFromUnit] = useState("m")
  const [toUnit, setToUnit] = useState("ft")
  const [currencyRates, setCurrencyRates] = useState(FALLBACK_RATES)
  const [zoneFrom, setZoneFrom] = useState(COMMON_TIME_ZONES[0])
  const [zoneTo, setZoneTo] = useState(COMMON_TIME_ZONES[1])
  const [dateValue, setDateValue] = useState("2026-03-24T09:00")
  const [dateOther, setDateOther] = useState("2026-03-28T18:00")
  const [romanInput, setRomanInput] = useState("42")

  useEffect(() => {
    if (toolId !== "currency-converter") return
    const cached = localStorage.getItem("toolkit-currency-rates")
    if (cached) {
      setCurrencyRates(JSON.parse(cached))
    }
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((response) => response.json())
      .then((data) => {
        if (data?.rates) {
          setCurrencyRates(data.rates)
          localStorage.setItem("toolkit-currency-rates", JSON.stringify(data.rates))
        }
      })
      .catch(() => undefined)
  }, [toolId])

  const result = useMemo(() => {
    if (toolId === "percentage-calculator") {
      return `${a}% of ${b} = ${((a / 100) * b).toFixed(2)}`
    }
    if (toolId === "gpa-calculator") {
      return `Estimated GPA: ${((a * 4 + b * 3 + c * 2) / Math.max(a + b + c, 1)).toFixed(2)}`
    }
    if (toolId === "age-calculator") {
      const birth = new Date(dateValue)
      const now = new Date(dateOther)
      const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000)
      return `${Math.max(Math.floor(totalDays / 365), 0)} years • ${Math.max(totalDays % 365, 0)} days`
    }
    if (toolId === "date-difference-calculator") {
      const start = new Date(dateValue)
      const end = new Date(dateOther)
      const diff = Math.abs(end.getTime() - start.getTime())
      return `${Math.floor(diff / 86400000)} days • ${Math.floor(diff / 3600000)} hours • ${Math.floor(diff / 60000)} minutes`
    }
    if (toolId === "loan-calculator") {
      const monthlyRate = b / 100 / 12
      const months = c * 12
      const emi = (a * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1 || 1)
      return `Monthly payment: $${emi.toFixed(2)}`
    }
    if (toolId === "bmi-calculator") {
      const heightM = b / 100
      const bmi = a / (heightM * heightM || 1)
      return `BMI: ${bmi.toFixed(2)}`
    }
    if (toolId === "unit-converter") {
      if (unitGroup === "temperature") {
        const celsius =
          fromUnit === "c" ? a : fromUnit === "f" ? (a - 32) * (5 / 9) : a - 273.15
        const value = toUnit === "c" ? celsius : toUnit === "f" ? celsius * (9 / 5) + 32 : celsius + 273.15
        return `${a} ${fromUnit.toUpperCase()} = ${value.toFixed(2)} ${toUnit.toUpperCase()}`
      }
      const groups: Record<string, Record<string, number>> = {
        length: { m: 1, ft: 3.28084, km: 0.001, mi: 0.000621371 },
        weight: { kg: 1, lb: 2.20462, g: 1000, oz: 35.274 },
        speed: { kph: 1, mph: 0.621371, ms: 0.277778 },
      }
      const base = a / groups[unitGroup][fromUnit]
      return `${a} ${fromUnit} = ${(base * groups[unitGroup][toUnit]).toFixed(2)} ${toUnit}`
    }
    if (toolId === "currency-converter") {
      const usd = a / (currencyRates[fromUnit.toUpperCase()] || 1)
      const converted = usd * (currencyRates[toUnit.toUpperCase()] || 1)
      return `${a.toFixed(2)} ${fromUnit.toUpperCase()} = ${converted.toFixed(2)} ${toUnit.toUpperCase()}`
    }
    if (toolId === "time-zone-converter") {
      const source = new Date(dateValue)
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: zoneTo,
      }).format(source)
    }
    if (toolId === "roman-numeral-converter") {
      return /^\d+$/.test(romanInput) ? toRoman(Number(romanInput)) : String(fromRoman(romanInput))
    }
    return ""
  }, [
    a,
    b,
    c,
    currencyRates,
    dateOther,
    dateValue,
    fromUnit,
    romanInput,
    toUnit,
    toolId,
    unitGroup,
    zoneTo,
  ])

  const unitOptions: Record<string, string[]> = {
    length: ["m", "ft", "km", "mi"],
    weight: ["kg", "lb", "g", "oz"],
    speed: ["kph", "mph", "ms"],
    temperature: ["c", "f", "k"],
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Inputs">
        <div className="space-y-4">
          {toolId === "time-zone-converter" || toolId === "age-calculator" || toolId === "date-difference-calculator" ? (
            <>
              <div>
                <Label>Start Date / Time</Label>
                <Input type="datetime-local" value={dateValue} onChange={(event) => setDateValue(event.target.value)} className="mt-2" />
              </div>
              <div>
                <Label>{toolId === "time-zone-converter" ? "Output Reference" : "End Date / Time"}</Label>
                <Input type="datetime-local" value={dateOther} onChange={(event) => setDateOther(event.target.value)} className="mt-2" />
              </div>
            </>
          ) : toolId === "roman-numeral-converter" ? (
            <div>
              <Label>Roman or Numeric Value</Label>
              <Input value={romanInput} onChange={(event) => setRomanInput(event.target.value)} className="mt-2" />
            </div>
          ) : (
            <>
              <div>
                <Label>Value A</Label>
                <Input type="number" value={a} onChange={(event) => setA(Number(event.target.value) || 0)} className="mt-2" />
              </div>
              <div>
                <Label>Value B</Label>
                <Input type="number" value={b} onChange={(event) => setB(Number(event.target.value) || 0)} className="mt-2" />
              </div>
              <div>
                <Label>Value C</Label>
                <Input type="number" value={c} onChange={(event) => setC(Number(event.target.value) || 0)} className="mt-2" />
              </div>
            </>
          )}

          {toolId === "unit-converter" ? (
            <>
              <div>
                <Label>Group</Label>
                <select value={unitGroup} onChange={(event) => {
                  const next = event.target.value
                  setUnitGroup(next)
                  setFromUnit(unitOptions[next][0])
                  setToUnit(unitOptions[next][1])
                }} className={nativeSelectClasses()}>
                  {Object.keys(unitOptions).map((item) => (
                    <option key={item} value={item}>{slugToWords(item)}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>From</Label>
                  <select value={fromUnit} onChange={(event) => setFromUnit(event.target.value)} className={nativeSelectClasses()}>
                    {unitOptions[unitGroup].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>To</Label>
                  <select value={toUnit} onChange={(event) => setToUnit(event.target.value)} className={nativeSelectClasses()}>
                    {unitOptions[unitGroup].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : null}

          {toolId === "currency-converter" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>From Currency</Label>
                <select value={fromUnit} onChange={(event) => setFromUnit(event.target.value)} className={nativeSelectClasses()}>
                  {Object.keys(currencyRates).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>To Currency</Label>
                <select value={toUnit} onChange={(event) => setToUnit(event.target.value)} className={nativeSelectClasses()}>
                  {Object.keys(currencyRates).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          {toolId === "time-zone-converter" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>From</Label>
                <select value={zoneFrom} onChange={(event) => setZoneFrom(event.target.value)} className={nativeSelectClasses()}>
                  {COMMON_TIME_ZONES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>To</Label>
                <select value={zoneTo} onChange={(event) => setZoneTo(event.target.value)} className={nativeSelectClasses()}>
                  {COMMON_TIME_ZONES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}
        </div>
      </ToolCard>
      <ToolCard title="Result">
        <div className="rounded-xl border bg-muted/15 p-6">
          <p className="text-sm text-muted-foreground">{slugToWords(toolId)}</p>
          <p className="mt-3 text-2xl font-bold">{result}</p>
        </div>
      </ToolCard>
    </div>
  )
}

function RandomTools({ toolId }: { toolId: string }) {
  const { copy } = useClipboard()
  const [count, setCount] = useState(5)
  const [seed, setSeed] = useState("toolkit")
  const [generated, setGenerated] = useState<string[]>([])

  const generate = () => {
    if (toolId === "random-number-generator") {
      setGenerated(Array.from({ length: count }, () => String(Math.floor(Math.random() * 1000))))
      return
    }
    if (toolId === "random-color-generator") {
      setGenerated(Array.from({ length: count }, () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`))
      return
    }
    if (toolId === "random-name-generator") {
      setGenerated(Array.from({ length: count }, () => `${randomFrom(NAME_PARTS.first)} ${randomFrom(NAME_PARTS.last)}`))
      return
    }
    if (toolId === "random-address-generator") {
      setGenerated(Array.from({ length: count }, () => `${Math.floor(Math.random() * 900 + 100)} ${randomFrom(NAME_PARTS.streets)}, ${randomFrom(NAME_PARTS.cities)}`))
      return
    }
    if (toolId === "random-phone-generator") {
      setGenerated(
        Array.from({ length: count }, () => `(${Math.floor(Math.random() * 800 + 200)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`)
      )
      return
    }
    if (toolId === "random-credit-card-generator") {
      setGenerated(
        Array.from({ length: count }, () => {
          const prefix = randomFrom(["411111111111111", "555555555555444", "37828224631000"])
          const checkDigit = luhnCheckDigit(prefix)
          return `${prefix}${checkDigit}`
        })
      )
      return
    }
    if (toolId === "random-avatar-generator") {
      setGenerated([createIdenticonSvg(seed)])
      return
    }
    if (toolId === "random-emoji-generator") {
      setGenerated(Array.from({ length: count }, () => randomFrom(["🚀", "✨", "🔥", "🎯", "🧠", "💡", "🎉", "🌈"])))
      return
    }
    if (toolId === "random-quote-generator") {
      setGenerated(Array.from({ length: count }, () => randomFrom(SAMPLE_QUOTES).text))
      return
    }
    setGenerated(
      Array.from({ length: count }, () =>
        `${randomSyllable()}${randomSyllable()}${Math.random() > 0.5 ? Math.floor(Math.random() * 90 + 10) : ""}${Math.random() > 0.65 ? "!" : ""}`
      )
    )
  }

  useEffect(generate, [count, seed, toolId])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Generator Controls">
        <div className="space-y-4">
          <div>
            <Label>Count</Label>
            <Input type="number" min={1} max={12} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} className="mt-2" />
          </div>
          {toolId === "random-avatar-generator" ? (
            <div>
              <Label>Seed</Label>
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} className="mt-2" />
            </div>
          ) : null}
          <Button onClick={generate}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </div>
      </ToolCard>
      <ToolCard title="Results">
        {toolId === "random-avatar-generator" ? (
          <div className="space-y-4">
            <div className="rounded-2xl border p-6" dangerouslySetInnerHTML={{ __html: generated[0] || "" }} />
            <ResultBox value={generated[0] || ""} filename="avatar.svg" copy={copy} />
          </div>
        ) : (
          <div className="space-y-2">
            {generated.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center justify-between rounded-lg border p-3">
                {toolId === "random-color-generator" ? (
                  <div className="flex items-center gap-3">
                    <span className="block h-8 w-8 rounded-full border" style={{ background: item }} />
                    <span className="font-medium">{item}</span>
                  </div>
                ) : (
                  <span className="font-medium">{item}</span>
                )}
                <Button size="sm" variant="ghost" onClick={() => copy(item)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ToolCard>
    </div>
  )
}

function AudioTools({ toolId }: { toolId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState("")
  const [bpm, setBpm] = useState(100)
  const [frequency, setFrequency] = useState(440)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const noiseSourceRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      noiseSourceRef.current?.stop?.()
      audioContextRef.current?.close?.()
    }
  }, [])

  if (toolId === "audio-waveform-visualizer") {
    const handleFiles = async (files: File[]) => {
      const selected = files[0]
      if (!selected) return
      setFile(selected)
      const buffer = await selected.arrayBuffer()
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(buffer.slice(0))
      const canvas = canvasRef.current
      const context = canvas?.getContext("2d")
      if (!canvas || !context) return
      canvas.width = 800
      canvas.height = 240
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = "#2563eb"
      const data = audioBuffer.getChannelData(0)
      const step = Math.ceil(data.length / canvas.width)
      const amp = canvas.height / 2
      for (let index = 0; index < canvas.width; index += 1) {
        const min = Math.min(...data.slice(index * step, (index + 1) * step))
        const max = Math.max(...data.slice(index * step, (index + 1) * step))
        context.fillRect(index, (1 + min) * amp, 1, Math.max(1, (max - min) * amp))
      }
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Load Audio">
          <UploadDropzone
            label="Drop an audio file"
            helper="We’ll decode the first channel and plot its waveform."
            accept={{ "audio/*": [".mp3", ".wav", ".m4a", ".ogg"] }}
            onFiles={handleFiles}
          />
        </ToolCard>
        <ToolCard title="Waveform">
          <canvas ref={canvasRef} className="w-full rounded-xl border bg-background" />
          {file ? <p className="mt-3 text-sm text-muted-foreground">{file.name}</p> : null}
        </ToolCard>
      </div>
    )
  }

  if (toolId === "audio-recorder") {
    const toggleRecording = async () => {
      if (recording) {
        mediaRecorderRef.current?.stop()
        setRecording(false)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/mp4" })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setRecording(true)
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Recorder">
          <Button onClick={toggleRecording}>
            {recording ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>
        </ToolCard>
        <ToolCard title="Playback">
          {audioUrl ? (
            <div className="space-y-4">
              <audio controls src={audioUrl} className="w-full" />
              <Button onClick={async () => {
                const response = await fetch(audioUrl)
                downloadBlob(await response.blob(), "recording.mp4")
              }}>
                <Download className="mr-2 h-4 w-4" />
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
    )
  }

  const startAudio = async (type: "metronome" | "noise" | "tone") => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    const ctx = audioContextRef.current

    if (type === "metronome") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        return
      }
      intervalRef.current = setInterval(() => {
        const oscillator = ctx.createOscillator()
        const gain = ctx.createGain()
        oscillator.frequency.value = 1000
        gain.gain.value = 0.06
        oscillator.connect(gain).connect(ctx.destination)
        oscillator.start()
        oscillator.stop(ctx.currentTime + 0.05)
      }, (60 / bpm) * 1000)
      return
    }

    noiseSourceRef.current?.stop?.()
    if (type === "tone") {
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.type = "sine"
      oscillator.frequency.value = frequency
      gain.gain.value = 0.05
      oscillator.connect(gain).connect(ctx.destination)
      oscillator.start()
      noiseSourceRef.current = oscillator
      return
    }

    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const channel = buffer.getChannelData(0)
    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    const gain = ctx.createGain()
    source.buffer = buffer
    source.loop = true
    gain.gain.value = 0.03
    source.connect(gain).connect(ctx.destination)
    source.start()
    noiseSourceRef.current = source
  }

  const stopAudio = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    noiseSourceRef.current?.stop?.()
    noiseSourceRef.current = null
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title={toolId === "metronome" ? "Tempo" : "Generator"}>
        <div className="space-y-4">
          {toolId === "metronome" ? (
            <div>
              <Label>BPM</Label>
              <Input type="number" value={bpm} onChange={(event) => setBpm(Number(event.target.value) || 60)} className="mt-2" />
            </div>
          ) : toolId === "tone-generator" ? (
            <div>
              <Label>Frequency (Hz)</Label>
              <Input type="number" value={frequency} onChange={(event) => setFrequency(Number(event.target.value) || 440)} className="mt-2" />
            </div>
          ) : null}
          <div className="flex gap-2">
            <Button onClick={() => startAudio(toolId === "metronome" ? "metronome" : toolId === "white-noise-generator" ? "noise" : "tone")}>
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
            <Button variant="outline" onClick={stopAudio}>Stop</Button>
          </div>
        </div>
      </ToolCard>
      <ToolCard title="Notes">
        <p className="text-sm text-muted-foreground">
          Browser audio tools require a user interaction before playback. Keep the tab active while tones or noise are running.
        </p>
      </ToolCard>
    </div>
  )
}

function FileTools({ toolId }: { toolId: string }) {
  const { copy } = useClipboard()

  if (toolId === "zip-file-compressor") {
    const [files, setFiles] = useState<File[]>([])

    const compress = async () => {
      const zip = new JSZip()
      files.forEach((file) => zip.file(file.name, file))
      downloadBlob(await zip.generateAsync({ type: "blob" }), "archive.zip")
    }

    return (
      <ToolCard title="ZIP Compressor">
        <div className="space-y-4">
          <UploadDropzone label="Drop files to archive" helper="We’ll zip them locally." multiple onFiles={setFiles} />
          <Button onClick={compress} disabled={!files.length}>
            <Download className="mr-2 h-4 w-4" />
            Download ZIP
          </Button>
        </div>
      </ToolCard>
    )
  }

  if (toolId === "mime-type-detector") {
    const [details, setDetails] = useState<Array<Record<string, string>>>([])

    const inspect = async (files: File[]) => {
      const output = await Promise.all(
        files.map(async (file) => {
          const bytes = new Uint8Array(await file.arrayBuffer()).slice(0, 8)
          const signature = Array.from(bytes).map((value) => value.toString(16).padStart(2, "0")).join(" ")
          return {
            name: file.name,
            type: file.type || "Unknown",
            size: formatBytes(file.size),
            signature,
          }
        })
      )
      setDetails(output)
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Inspect Files">
          <UploadDropzone label="Drop any files" helper="We’ll show MIME, size, and a signature hint." multiple onFiles={inspect} />
        </ToolCard>
        <ToolCard title="Detected Types">
          <div className="space-y-3">
            {details.map((item) => (
              <div key={item.name} className="rounded-lg border p-3 text-sm">
                <div className="font-medium">{item.name}</div>
                <div className="text-muted-foreground">{item.type}</div>
                <div className="text-muted-foreground">{item.size}</div>
                <div className="font-mono text-xs">{item.signature}</div>
              </div>
            ))}
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "checksum-calculator") {
    const [result, setResult] = useState("")

    const handleFiles = async (files: File[]) => {
      const file = files[0]
      if (!file) return
      const buffer = await readFileAsArrayBuffer(file)
      const bytes = new Uint8Array(buffer)
      const sha = toHex(await crypto.subtle.digest("SHA-256", buffer))
      const md5 = simulateMd5(String.fromCharCode(...bytes.slice(0, 4096)))
      const checksum = [`CRC32: ${crc32(bytes)}`, `Simulated MD5: ${md5}`, `SHA-256: ${sha}`].join("\n")
      setResult(checksum)
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Upload File">
          <UploadDropzone label="Drop a file" helper="We’ll hash it locally." onFiles={handleFiles} />
        </ToolCard>
        <ToolCard title="Checksums">
          <ResultBox value={result} filename="checksums.txt" copy={copy} />
        </ToolCard>
      </div>
    )
  }

  const [merged, setMerged] = useState("")

  const handleTextFiles = async (files: File[]) => {
    const values = await Promise.all(files.map((file) => file.text()))
    if (toolId === "file-merger") {
      setMerged(values.map((value, index) => `--- File ${index + 1} ---\n${value}`).join("\n\n"))
    } else {
      const chunks = splitTextIntoChunks(values[0] || "", 40)
      const zip = new JSZip()
      chunks.forEach((chunk, index) => zip.file(`chunk-${index + 1}.txt`, chunk))
      downloadBlob(await zip.generateAsync({ type: "blob" }), "split-files.zip")
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title={toolId === "file-merger" ? "Merge Files" : "Split Text File"}>
        <div className="space-y-4">
          <UploadDropzone
            label={toolId === "file-merger" ? "Drop text files" : "Drop one text file"}
            helper="Plain text files work best for merging and splitting."
            multiple={toolId === "file-merger"}
            accept={{ "text/plain": [".txt", ".md", ".csv", ".json"] }}
            onFiles={handleTextFiles}
          />
          {toolId === "file-merger" && merged ? (
            <Button onClick={() => downloadBlob(new Blob([merged], { type: "text/plain" }), "merged.txt")}>
              <Download className="mr-2 h-4 w-4" />
              Download Merged File
            </Button>
          ) : null}
        </div>
      </ToolCard>
      <ToolCard title={toolId === "file-merger" ? "Merged Output" : "Splitter Output"}>
        {toolId === "file-merger" ? (
          <ResultBox value={merged} filename="merged.txt" copy={copy} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Uploading a file will generate a ZIP archive with line-based chunks.
          </p>
        )}
      </ToolCard>
    </div>
  )
}

export function DynamicToolPage({ toolId }: { toolId: string }) {
  const tool = getToolById(toolId)

  if (!tool) {
    return null
  }

  return (
    <ToolLayout toolId={toolId}>
      {tool.category === "security" ? <SecurityTools toolId={toolId} /> : null}
      {tool.category === "developer" ? <DeveloperTools toolId={toolId} /> : null}
      {tool.category === "text" ? <TextTools toolId={toolId} /> : null}
      {tool.category === "image" ? <ImageTools toolId={toolId} /> : null}
      {tool.category === "design" ? <DesignTools toolId={toolId} /> : null}
      {tool.category === "seo" ? <SeoTools toolId={toolId} /> : null}
      {tool.category === "calculator" ? <CalculatorTools toolId={toolId} /> : null}
      {tool.category === "random" ? <RandomTools toolId={toolId} /> : null}
      {tool.category === "audio" ? <AudioTools toolId={toolId} /> : null}
      {tool.category === "file" ? <FileTools toolId={toolId} /> : null}
    </ToolLayout>
  )
}

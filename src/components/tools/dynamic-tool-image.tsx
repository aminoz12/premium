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
import { escapeHtml } from "@/lib/security"
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
      className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        isDragActive ? "border-primary bg-primary/5" : "hover:border-primary"
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

const SANITIZED_SVG_OPTIONS = {
  USE_PROFILES: { svg: true, svgFilters: true },
} as const

function normalizeHexColor(value: string, fallback: string) {
  return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value.trim()) ? value.trim() : fallback
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function rgbToHex(color: { r: number; g: number; b: number }) {
  return `#${[color.r, color.g, color.b]
    .map((value) => clampNumber(Math.round(value), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`
}

function sampleBackgroundColor(imageData: ImageData) {
  const { data, width, height } = imageData
  const sampleSize = Math.max(8, Math.floor(Math.min(width, height) * 0.08))
  const regions = [
    { startX: 0, startY: 0 },
    { startX: Math.max(width - sampleSize, 0), startY: 0 },
    { startX: 0, startY: Math.max(height - sampleSize, 0) },
    { startX: Math.max(width - sampleSize, 0), startY: Math.max(height - sampleSize, 0) },
  ]

  let red = 0
  let green = 0
  let blue = 0
  let samples = 0

  regions.forEach(({ startX, startY }) => {
    for (let y = startY; y < Math.min(startY + sampleSize, height); y += 1) {
      for (let x = startX; x < Math.min(startX + sampleSize, width); x += 1) {
        const index = (y * width + x) * 4
        red += data[index]
        green += data[index + 1]
        blue += data[index + 2]
        samples += 1
      }
    }
  })

  return {
    r: red / Math.max(samples, 1),
    g: green / Math.max(samples, 1),
    b: blue / Math.max(samples, 1),
  }
}

function removeBackgroundFromCanvas(canvas: HTMLCanvasElement, tolerance: number, feather: number) {
  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Image processing is unavailable in this browser.")
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const sampledBackground = sampleBackgroundColor(imageData)
  const threshold = clampNumber(tolerance, 10, 220)
  const featherRange = clampNumber(feather, 1, 120)
  const { data } = imageData

  for (let index = 0; index < data.length; index += 4) {
    const redDistance = data[index] - sampledBackground.r
    const greenDistance = data[index + 1] - sampledBackground.g
    const blueDistance = data[index + 2] - sampledBackground.b
    const distance = Math.sqrt(redDistance ** 2 + greenDistance ** 2 + blueDistance ** 2)

    let alphaMultiplier = 1

    if (distance <= threshold) {
      alphaMultiplier = 0
    } else if (distance < threshold + featherRange) {
      alphaMultiplier = (distance - threshold) / featherRange
    }

    data[index + 3] = Math.round(data[index + 3] * alphaMultiplier)
  }

  context.putImageData(imageData, 0, 0)

  return sampledBackground
}

async function createTransparentCutout(src: string, tolerance: number, feather: number) {
  const image = await loadImage(src)
  const canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height
  const context = canvas.getContext("2d")

  if (!context) {
    throw new Error("Canvas rendering is unavailable in this browser.")
  }

  context.drawImage(image, 0, 0)
  const sampledBackground = removeBackgroundFromCanvas(canvas, tolerance, feather)

  return { canvas, sampledBackground }
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number
) {
  const scale = Math.max(width / image.width, height / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const offsetX = (width - drawWidth) / 2
  const offsetY = (height - drawHeight) / 2

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
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
    const safeBackground = normalizeHexColor(background, "#0f172a")
    const safeAccent = normalizeHexColor(accent, "#22c55e")
    const safeTitle = escapeHtml(title.trim() || "Launch")
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" fill="none"><rect width="640" height="320" rx="36" fill="${safeBackground}"/><circle cx="120" cy="80" r="42" fill="${safeAccent}" fill-opacity="0.85"/><rect x="90" y="170" width="460" height="12" rx="6" fill="#ffffff" fill-opacity="0.18"/><rect x="90" y="200" width="320" height="12" rx="6" fill="#ffffff" fill-opacity="0.12"/><text x="90" y="132" fill="#ffffff" font-size="58" font-family="Arial, sans-serif" font-weight="700">${safeTitle}</text></svg>`
    const safePreviewSvg = DOMPurify.sanitize(svg, SANITIZED_SVG_OPTIONS)

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
            <div className="overflow-hidden rounded-xl border" dangerouslySetInnerHTML={{ __html: safePreviewSvg }} />
            <ResultBox value={safePreviewSvg} filename="graphic.svg" copy={copy} />
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

  if (toolId === "remove-background" || toolId === "change-background") {
    const [tolerance, setTolerance] = useState(42)
    const [feather, setFeather] = useState(28)
    const [processing, setProcessing] = useState(false)
    const [resultPreview, setResultPreview] = useState("")
    const [sampledBackground, setSampledBackground] = useState("#ffffff")
    const [backgroundMode, setBackgroundMode] = useState<"solid" | "gradient" | "image">("solid")
    const [backgroundPrimary, setBackgroundPrimary] = useState("#f8fafc")
    const [backgroundSecondary, setBackgroundSecondary] = useState("#cbd5e1")
    const [backgroundPreview, setBackgroundPreview] = useState("")

    const handleBackgroundImage = async (files: File[]) => {
      const selected = files[0]
      if (!selected || !selected.type.startsWith("image/")) {
        toast.error("Upload an image to use as a replacement background.")
        return
      }

      setBackgroundPreview(await readFileAsDataUrl(selected))
    }

    const processBackground = async () => {
      if (!preview) return

      setProcessing(true)

      try {
        const { canvas: subjectCanvas, sampledBackground: sampled } = await createTransparentCutout(
          preview,
          tolerance,
          feather
        )
        setSampledBackground(rgbToHex(sampled))

        if (toolId === "remove-background") {
          setResultPreview(subjectCanvas.toDataURL("image/png"))
          return
        }

        const compositeCanvas = document.createElement("canvas")
        compositeCanvas.width = subjectCanvas.width
        compositeCanvas.height = subjectCanvas.height
        const compositeContext = compositeCanvas.getContext("2d")

        if (!compositeContext) {
          throw new Error("Image compositing is unavailable in this browser.")
        }

        if (backgroundMode === "image" && backgroundPreview) {
          const backgroundImage = await loadImage(backgroundPreview)
          drawCoverImage(compositeContext, backgroundImage, compositeCanvas.width, compositeCanvas.height)
        } else if (backgroundMode === "gradient") {
          const gradient = compositeContext.createLinearGradient(0, 0, compositeCanvas.width, compositeCanvas.height)
          gradient.addColorStop(0, backgroundPrimary)
          gradient.addColorStop(1, backgroundSecondary)
          compositeContext.fillStyle = gradient
          compositeContext.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height)
        } else {
          compositeContext.fillStyle = backgroundPrimary
          compositeContext.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height)
        }

        compositeContext.drawImage(subjectCanvas, 0, 0)
        setResultPreview(compositeCanvas.toDataURL("image/png"))
      } catch (processingError) {
        toast.error(
          processingError instanceof Error
            ? processingError.message
            : "We could not process this image."
        )
      } finally {
        setProcessing(false)
      }
    }

    const downloadResult = () => {
      if (!resultPreview) return
      const baseName = file?.name.replace(/\.[^.]+$/, "") || toolId
      downloadBlob(dataUrlToBlob(resultPreview), `${baseName}-${toolId}.png`)
    }

    return (
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ToolCard title={toolId === "remove-background" ? "Remove Background" : "Change Background"}>
          <div className="space-y-4">
            <UploadDropzone
              label="Drop an image"
              helper="Best results come from flat or studio-style backgrounds."
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
              onFiles={prepareFile}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Tolerance</Label>
                <Input
                  type="number"
                  min={10}
                  max={220}
                  value={tolerance}
                  onChange={(event) => setTolerance(Number(event.target.value) || 42)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Edge Feather</Label>
                <Input
                  type="number"
                  min={1}
                  max={120}
                  value={feather}
                  onChange={(event) => setFeather(Number(event.target.value) || 28)}
                  className="mt-2"
                />
              </div>
            </div>

            {toolId === "change-background" ? (
              <>
                <div>
                  <Label>Replacement Background</Label>
                  <select
                    value={backgroundMode}
                    onChange={(event) => setBackgroundMode(event.target.value as "solid" | "gradient" | "image")}
                    className={nativeSelectClasses()}
                  >
                    <option value="solid">Solid color</option>
                    <option value="gradient">Gradient</option>
                    <option value="image">Uploaded image</option>
                  </select>
                </div>

                {backgroundMode === "image" ? (
                  <UploadDropzone
                    label="Drop a replacement background"
                    helper="We’ll cover the canvas with this image before placing the cutout."
                    accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                    onFiles={handleBackgroundImage}
                  />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Primary color</Label>
                      <Input
                        type="color"
                        value={backgroundPrimary}
                        onChange={(event) => setBackgroundPrimary(event.target.value)}
                        className="mt-2 h-12"
                      />
                    </div>
                    <div>
                      <Label>{backgroundMode === "gradient" ? "Secondary color" : "Sampled background"}</Label>
                      {backgroundMode === "gradient" ? (
                        <Input
                          type="color"
                          value={backgroundSecondary}
                          onChange={(event) => setBackgroundSecondary(event.target.value)}
                          className="mt-2 h-12"
                        />
                      ) : (
                        <div className="mt-2 flex h-12 items-center gap-3 rounded-md border px-3">
                          <span className="h-6 w-6 rounded-full border" style={{ backgroundColor: sampledBackground }} />
                          <span className="text-sm text-muted-foreground">{sampledBackground}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                The remover samples the corner colors of your image and fades similar pixels away.
                It works best when the subject is clearly separated from the background.
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button onClick={processBackground} disabled={!preview || processing}>
                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                {toolId === "remove-background" ? "Create Transparent PNG" : "Apply New Background"}
              </Button>
              <Button variant="outline" onClick={downloadResult} disabled={!resultPreview}>
                <Download className="mr-2 h-4 w-4" />
                Download Result
              </Button>
            </div>
          </div>
        </ToolCard>

        <ToolCard title="Preview">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-medium">Original</p>
              <div className="flex min-h-[280px] items-center justify-center rounded-2xl border bg-muted/20 p-4">
                {preview ? (
                  <img src={preview} alt="Original upload" className="max-h-[320px] w-full object-contain" />
                ) : (
                  <p className="text-sm text-muted-foreground">Upload an image to preview it here.</p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Processed</p>
              <div
                className="flex min-h-[280px] items-center justify-center rounded-2xl border p-4"
                style={{
                  backgroundImage:
                    toolId === "remove-background"
                      ? "linear-gradient(45deg,#e5e7eb 25%,transparent 25%), linear-gradient(-45deg,#e5e7eb 25%,transparent 25%), linear-gradient(45deg,transparent 75%,#e5e7eb 75%), linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)"
                      : undefined,
                  backgroundSize: toolId === "remove-background" ? "24px 24px" : undefined,
                  backgroundPosition: toolId === "remove-background" ? "0 0, 0 12px, 12px -12px, -12px 0px" : undefined,
                }}
              >
                {resultPreview ? (
                  <img src={resultPreview} alt="Processed preview" className="max-h-[320px] w-full object-contain" />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Run the tool to see the processed output.
                  </p>
                )}
              </div>
            </div>
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "resize-image") {
    const [resizeMode, setResizeMode] = useState<"pixels" | "percent" | "preset">("pixels")
    const [width, setWidth] = useState(1200)
    const [height, setHeight] = useState(630)
    const [percent, setPercent] = useState(100)
    const [keepAspect, setKeepAspect] = useState(true)
    const [format, setFormat] = useState("image/png")
    const [preset, setPreset] = useState("og-image")
    const [processing, setProcessing] = useState(false)
    const [resultPreview, setResultPreview] = useState("")
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
    const [resultDimensions, setResultDimensions] = useState({ width: 0, height: 0 })

    const presets = {
      "og-image": { label: "Open Graph 1200×630", width: 1200, height: 630 },
      "instagram-square": { label: "Instagram Square 1080×1080", width: 1080, height: 1080 },
      "twitter-header": { label: "Twitter Header 1500×500", width: 1500, height: 500 },
      "linkedin-cover": { label: "LinkedIn Cover 1584×396", width: 1584, height: 396 },
    } as const

    useEffect(() => {
      const syncImageDimensions = async () => {
        if (!preview) return
        const image = await loadImage(preview)
        setOriginalDimensions({ width: image.width, height: image.height })
        setWidth(image.width)
        setHeight(image.height)
        setResultPreview("")
        setResultDimensions({ width: image.width, height: image.height })
      }

      syncImageDimensions().catch(() => {
        setOriginalDimensions({ width: 0, height: 0 })
      })
    }, [preview])

    const handleWidthChange = (nextWidth: number) => {
      setWidth(nextWidth)
      if (keepAspect && originalDimensions.width > 0) {
        setHeight(Math.max(1, Math.round((nextWidth / originalDimensions.width) * originalDimensions.height)))
      }
    }

    const handleHeightChange = (nextHeight: number) => {
      setHeight(nextHeight)
      if (keepAspect && originalDimensions.height > 0) {
        setWidth(Math.max(1, Math.round((nextHeight / originalDimensions.height) * originalDimensions.width)))
      }
    }

    const applyResize = async () => {
      if (!preview) return

      setProcessing(true)

      try {
        const image = await loadImage(preview)
        let targetWidth = image.width
        let targetHeight = image.height

        if (resizeMode === "percent") {
          const multiplier = Math.max(percent, 1) / 100
          targetWidth = Math.max(1, Math.round(image.width * multiplier))
          targetHeight = Math.max(1, Math.round(image.height * multiplier))
        } else if (resizeMode === "preset") {
          const selectedPreset = presets[preset]
          targetWidth = selectedPreset.width
          targetHeight = selectedPreset.height
        } else {
          targetWidth = Math.max(1, width)
          targetHeight = Math.max(1, height)
        }

        const canvas = document.createElement("canvas")
        canvas.width = targetWidth
        canvas.height = targetHeight
        const context = canvas.getContext("2d")

        if (!context) {
          throw new Error("Canvas rendering is unavailable in this browser.")
        }

        context.drawImage(image, 0, 0, targetWidth, targetHeight)
        setResultPreview(canvas.toDataURL(format, 0.92))
        setResultDimensions({ width: targetWidth, height: targetHeight })
      } catch (resizeError) {
        toast.error(
          resizeError instanceof Error ? resizeError.message : "We could not resize this image."
        )
      } finally {
        setProcessing(false)
      }
    }

    const downloadResizedImage = () => {
      if (!resultPreview) return
      const baseName = file?.name.replace(/\.[^.]+$/, "") || "resized-image"
      const extension = format.split("/")[1] || "png"
      downloadBlob(dataUrlToBlob(resultPreview), `${baseName}.${extension}`)
    }

    return (
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ToolCard title="Resize Controls">
          <div className="space-y-4">
            <UploadDropzone
              label="Drop an image"
              helper="Resize for social media, product pages, thumbnails, or exact pixel targets."
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] }}
              onFiles={prepareFile}
            />

            <div>
              <Label>Resize mode</Label>
              <select
                value={resizeMode}
                onChange={(event) => setResizeMode(event.target.value as "pixels" | "percent" | "preset")}
                className={nativeSelectClasses()}
              >
                <option value="pixels">Exact pixels</option>
                <option value="percent">Percentage</option>
                <option value="preset">Social preset</option>
              </select>
            </div>

            {resizeMode === "pixels" ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Width</Label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(event) => handleWidthChange(Number(event.target.value) || 1)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Height</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(event) => handleHeightChange(Number(event.target.value) || 1)}
                      className="mt-2"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={keepAspect}
                    onChange={(event) => setKeepAspect(event.target.checked)}
                  />
                  Maintain aspect ratio when editing width or height
                </label>
              </>
            ) : null}

            {resizeMode === "percent" ? (
              <div>
                <Label>Scale percentage</Label>
                <Input
                  type="number"
                  min={1}
                  value={percent}
                  onChange={(event) => setPercent(Number(event.target.value) || 100)}
                  className="mt-2"
                />
              </div>
            ) : null}

            {resizeMode === "preset" ? (
              <div>
                <Label>Preset size</Label>
                <select
                  value={preset}
                  onChange={(event) => setPreset(event.target.value)}
                  className={nativeSelectClasses()}
                >
                  {Object.entries(presets).map(([value, item]) => (
                    <option key={value} value={value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div>
              <Label>Output format</Label>
              <select value={format} onChange={(event) => setFormat(event.target.value)} className={nativeSelectClasses()}>
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
              Original size: {originalDimensions.width || 0} × {originalDimensions.height || 0}px
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={applyResize} disabled={!preview || processing}>
                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Resize Image
              </Button>
              <Button variant="outline" onClick={downloadResizedImage} disabled={!resultPreview}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </ToolCard>

        <ToolCard title="Preview">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-medium">Original</p>
              <div className="flex min-h-[280px] items-center justify-center rounded-2xl border bg-muted/20 p-4">
                {preview ? (
                  <img src={preview} alt="Original image" className="max-h-[320px] w-full object-contain" />
                ) : (
                  <p className="text-sm text-muted-foreground">Upload an image to start resizing.</p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Resized</p>
              <div className="flex min-h-[280px] items-center justify-center rounded-2xl border bg-muted/20 p-4">
                {resultPreview ? (
                  <img src={resultPreview} alt="Resized output" className="max-h-[320px] w-full object-contain" />
                ) : (
                  <p className="text-sm text-muted-foreground">Run the resize action to preview the new output.</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Output size: {resultDimensions.width || 0} × {resultDimensions.height || 0}px
              </p>
            </div>
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


export default ImageTools

"use client"

import { useMemo, useRef, useState, type CSSProperties } from "react"
import exifr from "exifr"
import { PDFDocument } from "pdf-lib/cjs"
import { CheckCircle2, Copy, Download, Shuffle, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { ToolCard, ToolEmptyState } from "@/components/layout/tool-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getToolById } from "@/lib/tools/tools-config"
import { cn } from "@/lib/utils"

type InputField = {
  key: string
  label: string
  type?: "number" | "text" | "date"
  min?: string
  max?: string
  step?: string
  placeholder?: string
}

type ResultMetric = {
  label: string
  value: string
  hint?: string
}

type SimpleJsonSchema = {
  type?: "object" | "array" | "string" | "number" | "boolean" | "null" | Array<"object" | "array" | "string" | "number" | "boolean" | "null">
  properties?: Record<string, SimpleJsonSchema>
  items?: SimpleJsonSchema
  required?: string[]
}

type HarRequestSummary = {
  id: string
  method: string
  url: string
  label: string
  status: number
  startMs: number
  totalMs: number
  waitMs: number
  dnsMs: number
  connectMs: number
  receiveMs: number
  sizeBytes: number
}

type LinkEdge = {
  source: string
  target: string
}

type LinkNode = {
  url: string
  label: string
  incoming: number
  outgoing: number
}

type SpriteSymbolRecord = {
  symbolId: string
  fileName: string
  viewBox: string
  innerMarkup: string
}

type GridAreaStat = {
  name: string
  cells: number
  rows: number
  columns: number
  rectangular: boolean
}

type GridAnalysis = {
  rows: string[][]
  columnCount: number
  rowCount: number
  areaNames: string[]
  warnings: string[]
  isValid: boolean
  stats: GridAreaStat[]
}

type GridPreset = {
  id: string
  label: string
  description: string
  columns: string
  rows: string
  gap: string
  areas: string
  minHeight: string
  autoFlow: string
  justifyItems: string
  alignItems: string
}

const MAX_FILE_SIZE = 50 * 1024 * 1024
const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})
const NUMBER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
})
const PLANET_GRAVITY: Record<string, number> = {
  Mercury: 0.38,
  Venus: 0.9,
  Earth: 1,
  Mars: 0.38,
  Jupiter: 2.53,
  Saturn: 1.07,
  Uranus: 0.89,
  Neptune: 1.14,
  Moon: 0.165,
}
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const NOTE_DIVISIONS = [
  { label: "Whole", factor: 4 },
  { label: "Half", factor: 2 },
  { label: "Quarter", factor: 1 },
  { label: "Eighth", factor: 0.5 },
  { label: "Sixteenth", factor: 0.25 },
  { label: "Dotted eighth", factor: 0.75 },
  { label: "Triplet quarter", factor: 2 / 3 },
  { label: "Triplet eighth", factor: 1 / 3 },
]
const SAMPLE_MARKUP = `<main>
  <a href="#content" class="skip-link">Skip to content</a>
  <header>
    <h1>Product Overview</h1>
    <nav aria-label="Primary">
      <a href="/pricing">Pricing</a>
      <a href="/docs">Docs</a>
    </nav>
  </header>
  <section id="content">
    <h2>Features</h2>
    <button>Start free trial</button>
    <button aria-label="Open account menu"></button>
    <input id="email" type="email" />
    <label for="email">Email address</label>
  </section>
</main>`
const SAMPLE_HAR = JSON.stringify(
  {
    log: {
      entries: [
        {
          startedDateTime: "2026-04-02T12:00:00.000Z",
          time: 182,
          request: { method: "GET", url: "https://thefreeaitools.com/tools/generate-chart" },
          response: { status: 200, bodySize: 128430, content: { size: 128430 } },
          timings: { dns: 14, connect: 24, wait: 96, receive: 48 },
        },
        {
          startedDateTime: "2026-04-02T12:00:00.120Z",
          time: 74,
          request: { method: "GET", url: "https://thefreeaitools.com/_next/static/chunk.js" },
          response: { status: 200, bodySize: 42220, content: { size: 42220 } },
          timings: { dns: 0, connect: 0, wait: 31, receive: 43 },
        },
        {
          startedDateTime: "2026-04-02T12:00:00.180Z",
          time: 266,
          request: { method: "POST", url: "https://thefreeaitools.com/api/report-error" },
          response: { status: 500, bodySize: 1240, content: { size: 1240 } },
          timings: { dns: 0, connect: 0, wait: 208, receive: 58 },
        },
      ],
    },
  },
  null,
  2
)
const SAMPLE_LINK_GRAPH = `from,to
https://thefreeaitools.com/,https://thefreeaitools.com/tools/generate-chart
https://thefreeaitools.com/,https://thefreeaitools.com/tools/slug-optimizer
https://thefreeaitools.com/categories/seo,https://thefreeaitools.com/tools/slug-optimizer
https://thefreeaitools.com/categories/seo,https://thefreeaitools.com/tools/internal-link-graph-visualizer
https://thefreeaitools.com/tools/slug-optimizer,https://thefreeaitools.com/tools/meta-description-length-checker
https://thefreeaitools.com/tools/slug-optimizer,https://thefreeaitools.com/tools/schema-markup-builder-validator`
const GRID_EMPTY_CELL = "."
const GRID_ALIGNMENT_OPTIONS = ["stretch", "start", "center", "end"]
const GRID_AUTO_FLOW_OPTIONS = ["row", "column", "row dense", "column dense"]
const GRID_PRESETS: GridPreset[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Sidebar navigation with hero, insights, and KPI panels.",
    columns: "240px minmax(0, 1.2fr) minmax(220px, 0.9fr)",
    rows: "auto minmax(140px, auto) minmax(140px, auto) auto",
    gap: "18",
    areas: "nav nav nav\nsidebar hero insights\nsidebar metrics metrics\nfooter footer footer",
    minHeight: "96",
    autoFlow: "row",
    justifyItems: "stretch",
    alignItems: "stretch",
  },
  {
    id: "hero",
    label: "Hero Landing",
    description: "A bold landing page with supporting proof and signup blocks.",
    columns: "minmax(0, 1.4fr) minmax(240px, 0.8fr)",
    rows: "auto auto auto",
    gap: "20",
    areas: "hero signup\nhero proof\nfeature feature",
    minHeight: "112",
    autoFlow: "row",
    justifyItems: "stretch",
    alignItems: "stretch",
  },
  {
    id: "editorial",
    label: "Editorial",
    description: "Headline-led layout for guides, docs, or comparison pages.",
    columns: "180px minmax(0, 1.5fr) 220px",
    rows: "auto minmax(180px, auto) auto",
    gap: "16",
    areas: "eyebrow headline headline\nmeta feature aside\ncta feature aside",
    minHeight: "88",
    autoFlow: "row",
    justifyItems: "stretch",
    alignItems: "stretch",
  },
  {
    id: "bento",
    label: "Bento",
    description: "Multi-card product grid with an asymmetrical bento feel.",
    columns: "repeat(4, minmax(0, 1fr))",
    rows: "minmax(110px, auto) minmax(110px, auto) minmax(110px, auto)",
    gap: "14",
    areas: "hero hero stat signup\nhero hero chart chart\nsocial testimonial chart chart",
    minHeight: "84",
    autoFlow: "row",
    justifyItems: "stretch",
    alignItems: "stretch",
  },
]
const SEO_STOP_WORDS = new Set(["a", "an", "and", "for", "in", "of", "on", "or", "the", "to", "with"])
const FAQ_RICH_RESULT_NOTE =
  "FAQ markup still helps describe page content, but Google now limits FAQ rich results mostly to authoritative government and health sites."

const ACCESSIBILITY_TOOL_IDS = new Set([
  "accessibility-focus-order-visualizer",
  "alt-text-length-checker",
  "color-contrast-checker",
  "heading-structure-outline",
  "aria-label-reviewer",
  "focusable-elements-checker",
])

const FINANCE_TOOL_IDS = new Set([
  "break-even-calculator",
  "saas-pricing-margin-calculator",
  "invoice-late-fee-calculator",
  "profit-margin-calculator",
  "sales-tax-calculator",
  "pricing-markup-calculator",
  "subscription-revenue-forecast",
])

const ENGINEERING_TOOL_IDS = new Set([
  "ohms-law-power-triangle-calculator",
  "resistor-color-code-calculator",
  "voltage-divider-calculator",
  "led-series-resistor-calculator",
  "power-supply-runtime-calculator",
  "capacitor-charge-discharge-calculator",
])

const EDUCATION_TOOL_IDS = new Set([
  "unit-circle-visualizer",
  "fraction-simplifier-calculator",
  "scientific-notation-converter",
  "study-session-planner",
  "flashcard-randomizer",
])

const ASTRONOMY_TOOL_IDS = new Set([
  "telescope-field-of-view-calculator",
  "moon-phase-finder",
  "escape-velocity-calculator",
  "planet-weight-calculator",
  "telescope-magnification-comparator",
])

const SEO_TOOL_IDS = new Set([
  "utm-builder-validator",
  "redirect-chain-mapper",
  "serp-snippet-preview",
  "meta-description-length-checker",
  "slug-optimizer",
  "sitemap-priority-planner",
  "schema-markup-builder-validator",
  "internal-link-graph-visualizer",
])

const DEVELOPER_TOOL_IDS = new Set([
  "query-string-parser",
  "regex-escape-helper",
  "json-path-finder",
  "json-schema-builder-validator",
])

const DATA_TOOL_IDS = new Set([
  "csv-column-profiler",
  "data-size-estimator",
  "har-file-viewer-api-timeline",
])

const IMAGE_TOOL_IDS = new Set([
  "exif-gps-remover",
])

const FILE_TOOL_IDS = new Set([
  "pdf-metadata-privacy-checker",
  "filename-sanitizer",
  "base64-file-encoder",
  "line-ending-converter",
])

const AUDIO_TOOL_IDS = new Set([
  "bpm-delay-time-calculator",
  "frequency-to-note-converter",
  "beat-interval-calculator",
])

const DESIGN_TOOL_IDS = new Set([
  "aspect-ratio-layout-calculator",
  "spacing-scale-generator",
  "css-grid-template-generator",
  "svg-sprite-sheet-generator",
])

const SECURITY_TOOL_IDS = new Set([
  "password-strength-checker",
])

const RANDOM_TOOL_IDS = new Set([
  "coin-flip-simulator",
])

function toNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatNumber(value: number, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) {
    return "0"
  }
  if (maximumFractionDigits === 2) {
    return NUMBER.format(value)
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value)
}

function formatCurrency(value: number) {
  return CURRENCY.format(Number.isFinite(value) ? value : 0)
}

function formatPercent(value: number, maximumFractionDigits = 1) {
  return `${formatNumber(value, maximumFractionDigits)}%`
}

function gcd(first: number, second: number): number {
  return second === 0 ? Math.abs(first) : gcd(second, first % second)
}

function reduceRatio(width: number, height: number) {
  const divisor = gcd(Math.round(width), Math.round(height)) || 1
  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`
}

function copyText(value: string) {
  if (!value) {
    return
  }

  navigator.clipboard
    .writeText(value)
    .then(() => toast.success("Copied to clipboard."))
    .catch(() => toast.error("Clipboard copy failed in this browser."))
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

function downloadText(filename: string, contents: string, mime = "text/plain;charset=utf-8") {
  downloadBlob(new Blob([contents], { type: mime }), filename)
}

function withinFileLimit(file: File | null | undefined) {
  if (!file) {
    return false
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("Please keep uploads below 50MB for reliable browser-side processing.")
    return false
  }

  return true
}

function readFileAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Unable to read the selected file."))
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "")
    reader.readAsText(file)
  })
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Unable to read the selected file."))
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "")
    reader.readAsDataURL(file)
  })
}

function parseCsvLine(line: string) {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === "," && !inQuotes) {
      values.push(current)
      current = ""
      continue
    }

    current += char
  }

  values.push(current)
  return values.map((value) => value.trim())
}

function parseCsv(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return { headers: [] as string[], rows: [] as string[][] }
  }

  const headers = parseCsvLine(lines[0])
  const rows = lines.slice(1).map(parseCsvLine)
  return { headers, rows }
}

function schemaTypeList(schema: SimpleJsonSchema) {
  if (!schema.type) {
    return [] as string[]
  }

  return Array.isArray(schema.type) ? schema.type : [schema.type]
}

function schemaTypeOf(value: unknown) {
  if (value === null) {
    return "null"
  }

  if (Array.isArray(value)) {
    return "array"
  }

  switch (typeof value) {
    case "string":
      return "string"
    case "number":
      return "number"
    case "boolean":
      return "boolean"
    case "object":
      return "object"
    default:
      return "string"
  }
}

function mergeJsonSchemas(schemas: SimpleJsonSchema[]): SimpleJsonSchema {
  const validSchemas = schemas.filter((schema) => Object.keys(schema).length > 0)

  if (validSchemas.length === 0) {
    return {}
  }

  const types = Array.from(new Set(validSchemas.flatMap(schemaTypeList)))

  if (types.length === 1 && types[0] === "object") {
    const propertyNames = Array.from(
      new Set(validSchemas.flatMap((schema) => Object.keys(schema.properties ?? {})))
    ).sort()

    const properties = Object.fromEntries(
      propertyNames.map((propertyName) => [
        propertyName,
        mergeJsonSchemas(
          validSchemas
            .map((schema) => schema.properties?.[propertyName])
            .filter((value): value is SimpleJsonSchema => Boolean(value))
        ),
      ])
    )

    const required = propertyNames.filter((propertyName) =>
      validSchemas.every((schema) => schema.required?.includes(propertyName))
    )

    return {
      type: "object",
      properties,
      required,
    }
  }

  if (types.length === 1 && types[0] === "array") {
    return {
      type: "array",
      items: mergeJsonSchemas(
        validSchemas
          .map((schema) => schema.items)
          .filter((value): value is SimpleJsonSchema => Boolean(value))
      ),
    }
  }

  return {
    type: types.length === 1 ? (types[0] as NonNullable<SimpleJsonSchema["type"]>) : (types as NonNullable<SimpleJsonSchema["type"]>),
  }
}

function inferJsonSchema(value: unknown): SimpleJsonSchema {
  if (value === null) {
    return { type: "null" }
  }

  if (Array.isArray(value)) {
    return {
      type: "array",
      items: value.length > 0 ? mergeJsonSchemas(value.map((entry) => inferJsonSchema(entry))) : {},
    }
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
    return {
      type: "object",
      properties: Object.fromEntries(entries.map(([key, entry]) => [key, inferJsonSchema(entry)])),
      required: entries.map(([key]) => key).sort(),
    }
  }

  if (typeof value === "number") {
    return { type: "number" }
  }

  if (typeof value === "boolean") {
    return { type: "boolean" }
  }

  return { type: "string" }
}

function validateJsonAgainstSchema(value: unknown, schema: SimpleJsonSchema, path = "$"): string[] {
  if (!schema || Object.keys(schema).length === 0) {
    return []
  }

  const errors: string[] = []
  const actualType = schemaTypeOf(value)
  const allowedTypes = schemaTypeList(schema)

  if (allowedTypes.length > 0 && !allowedTypes.includes(actualType)) {
    errors.push(`${path} should be ${allowedTypes.join(" or ")}, received ${actualType}.`)
    return errors
  }

  if (actualType === "object" && schema.properties) {
    const objectValue = value as Record<string, unknown>

    for (const requiredKey of schema.required ?? []) {
      if (!(requiredKey in objectValue)) {
        errors.push(`${path}.${requiredKey} is required.`)
      }
    }

    for (const [key, propertySchema] of Object.entries(schema.properties)) {
      if (key in objectValue) {
        errors.push(...validateJsonAgainstSchema(objectValue[key], propertySchema, `${path}.${key}`))
      }
    }
  }

  if (actualType === "array" && schema.items) {
    ;(value as unknown[]).forEach((entry, index) => {
      errors.push(...validateJsonAgainstSchema(entry, schema.items as SimpleJsonSchema, `${path}[${index}]`))
    })
  }

  return errors
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B"
  }

  if (bytes < 1024) {
    return `${formatNumber(bytes, 0)} B`
  }

  if (bytes < 1024 * 1024) {
    return `${formatNumber(bytes / 1024, 1)} KB`
  }

  return `${formatNumber(bytes / (1024 * 1024), 2)} MB`
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function tokenizeSearchTerms(value: string) {
  return normalizeWhitespace(value).toLowerCase().match(/[a-z0-9]+/g) ?? []
}

function countKeywordCoverage(keyword: string, text: string) {
  const keywordTokens = Array.from(
    new Set(
      tokenizeSearchTerms(keyword).filter((token) => token.length > 2 && !SEO_STOP_WORDS.has(token))
    )
  )

  if (keywordTokens.length === 0) {
    return 0
  }

  const textTokens = new Set(tokenizeSearchTerms(text))
  const matched = keywordTokens.filter((token) => textTokens.has(token)).length
  return (matched / keywordTokens.length) * 100
}

function estimateSnippetPixels(value: string) {
  return Array.from(value).reduce((total, character) => {
    if ("W@#%&M".includes(character)) {
      return total + 12
    }
    if ("ilI.,|!'` ".includes(character)) {
      return total + 5
    }
    if (/[A-Z]/.test(character)) {
      return total + 9.5
    }
    return total + 8
  }, 0)
}

function truncatePreview(value: string, maxCharacters: number) {
  const normalized = normalizeWhitespace(value)
  if (normalized.length <= maxCharacters) {
    return normalized
  }
  return `${normalized.slice(0, Math.max(maxCharacters - 1, 1)).trimEnd()}…`
}

function hasCallToAction(text: string) {
  return /\b(build|compare|create|discover|download|explore|find|get|learn|optimize|plan|start|use)\b/i.test(text)
}

function isLikelyKeywordStuffed(text: string) {
  const tokens = tokenizeSearchTerms(text).filter((token) => token.length > 2 && !SEO_STOP_WORDS.has(token))
  if (tokens.length < 5) {
    return false
  }

  const counts = new Map<string, number>()
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }

  return Array.from(counts.values()).some((count) => count >= 3 && count / tokens.length > 0.35)
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

function toDisplayLabel(value: string) {
  return value
    .split(/[-_]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

function formatCssSizeValue(value: string, fallback: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return fallback
  }

  return /^-?\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed
}

function normalizeGridToken(value: string) {
  const trimmed = value.trim()

  if (!trimmed || trimmed === GRID_EMPTY_CELL || /^none$/i.test(trimmed)) {
    return GRID_EMPTY_CELL
  }

  const cleaned = trimmed
    .toLowerCase()
    .replace(/[^\w-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  if (!cleaned) {
    return GRID_EMPTY_CELL
  }

  const normalized = /^[a-z_]/.test(cleaned) ? cleaned : `area-${cleaned}`
  return ["auto", "inherit", "initial", "span", "unset"].includes(normalized)
    ? `area-${normalized}`
    : normalized
}

function parseGridMatrix(input: string) {
  const rows = input
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean)
    .map((line) => line.split(" ").map(normalizeGridToken))

  return rows.length > 0 ? rows : [[GRID_EMPTY_CELL]]
}

function stringifyGridMatrix(matrix: string[][]) {
  return matrix
    .map((row) => row.map((cell) => normalizeGridToken(cell || GRID_EMPTY_CELL)).join(" "))
    .join("\n")
}

function analyzeGridTemplate(input: string): GridAnalysis {
  const parsedRows = parseGridMatrix(input)
  const warnings: string[] = []
  const columnCount = Math.max(1, ...parsedRows.map((row) => row.length))
  const rows = parsedRows.map((row) => {
    if (row.length !== columnCount) {
      warnings.push("Rows with fewer cells were padded with empty grid slots to keep the preview valid.")
    }

    return [...row, ...Array.from({ length: columnCount - row.length }, () => GRID_EMPTY_CELL)]
  })

  const areaMap = new Map<string, Array<{ row: number; column: number }>>()
  rows.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === GRID_EMPTY_CELL) {
        return
      }

      const current = areaMap.get(cell) ?? []
      current.push({ row: rowIndex, column: columnIndex })
      areaMap.set(cell, current)
    })
  })

  const stats = Array.from(areaMap.entries()).map(([name, positions]) => {
    const rowIndexes = positions.map((position) => position.row)
    const columnIndexes = positions.map((position) => position.column)
    const minRow = Math.min(...rowIndexes)
    const maxRow = Math.max(...rowIndexes)
    const minColumn = Math.min(...columnIndexes)
    const maxColumn = Math.max(...columnIndexes)
    const rowSpan = maxRow - minRow + 1
    const columnSpan = maxColumn - minColumn + 1
    const cells = positions.length
    const rectangular =
      cells === rowSpan * columnSpan &&
      positions.every((position) => {
        for (let row = minRow; row <= maxRow; row += 1) {
          for (let column = minColumn; column <= maxColumn; column += 1) {
            if (rows[row]?.[column] !== name) {
              return false
            }
          }
        }
        return true
      })

    if (!rectangular) {
      warnings.push(`Area "${name}" is not rectangular, so ` + "`grid-template-areas`" + ` may fail in CSS.`)
    }

    return {
      name,
      cells,
      rows: rowSpan,
      columns: columnSpan,
      rectangular,
    } satisfies GridAreaStat
  })

  if (stats.length === 0) {
    warnings.push("Add at least one named area to generate a useful grid template.")
  }

  return {
    rows,
    columnCount,
    rowCount: rows.length,
    areaNames: stats.map((stat) => stat.name),
    warnings: Array.from(new Set(warnings)),
    isValid: stats.every((stat) => stat.rectangular),
    stats,
  }
}

function buildGridCssOutput(
  config: {
    columns: string
    rows: string
    gap: string
    minHeight: string
    autoFlow: string
    justifyItems: string
    alignItems: string
  },
  analysis: GridAnalysis
) {
  const templateAreaLines = analysis.rows.map((row) => `    "${row.join(" ")}"`).join("\n")
  const areaClasses = analysis.areaNames
    .map((area) => `.area-${toSlug(area)} {\n  grid-area: ${area};\n}`)
    .join("\n\n")

  return `.grid-layout {\n  display: grid;\n  grid-template-columns: ${config.columns};\n  grid-template-rows: ${config.rows};\n  gap: ${formatCssSizeValue(config.gap, "16px")};\n  grid-auto-flow: ${config.autoFlow};\n  justify-items: ${config.justifyItems};\n  align-items: ${config.alignItems};\n  grid-template-areas:\n${templateAreaLines};\n}\n\n.grid-layout > * {\n  min-height: ${formatCssSizeValue(config.minHeight, "88px")};\n}\n\n.grid-card {\n  border: 1px solid hsl(220 16% 90%);\n  border-radius: 1rem;\n  padding: 1rem;\n  background: hsl(0 0% 100% / 0.88);\n  box-shadow: 0 20px 45px hsl(222 84% 5% / 0.08);\n}\n\n${areaClasses}`
}

function buildGridHtmlOutput(analysis: GridAnalysis) {
  return `<section class="grid-layout">\n${analysis.areaNames
    .map((area) => `  <div class="grid-card area-${toSlug(area)}">${toDisplayLabel(area)}</div>`)
    .join("\n")}\n</section>`
}

function summarizeUrl(urlValue: string) {
  try {
    const parsed = new URL(urlValue)
    return `${parsed.hostname}${parsed.pathname}${parsed.search}`.replace(/\/$/, "") || parsed.hostname
  } catch {
    return urlValue
  }
}

function parseHarEntries(text: string) {
  const parsed = JSON.parse(text) as {
    log?: {
      entries?: Array<{
        startedDateTime?: string
        time?: number
        request?: { method?: string; url?: string }
        response?: { status?: number; bodySize?: number; content?: { size?: number } }
        timings?: Record<string, number>
      }>
    }
  }

  const rawEntries = parsed.log?.entries

  if (!Array.isArray(rawEntries)) {
    throw new Error("This file does not look like a HAR export with log.entries.")
  }

  const baseStart = rawEntries.reduce((earliest, entry) => {
    const timestamp = Date.parse(entry.startedDateTime ?? "")
    return Number.isFinite(timestamp) ? Math.min(earliest, timestamp) : earliest
  }, Number.POSITIVE_INFINITY)

  return rawEntries.map((entry, index) => {
    const startedAt = Date.parse(entry.startedDateTime ?? "")
    const timings = entry.timings ?? {}
    const sizeBytes = [entry.response?.bodySize, entry.response?.content?.size]
      .map((value) => Number(value))
      .find((value) => Number.isFinite(value) && value > 0)

    return {
      id: `${entry.request?.method ?? "GET"}-${index}-${entry.request?.url ?? "request"}`,
      method: entry.request?.method ?? "GET",
      url: entry.request?.url ?? "",
      label: summarizeUrl(entry.request?.url ?? `request-${index + 1}`),
      status: Number(entry.response?.status) || 0,
      startMs: Number.isFinite(startedAt) && Number.isFinite(baseStart) ? startedAt - baseStart : 0,
      totalMs: Number(entry.time) || 0,
      waitMs: Math.max(0, Number(timings.wait) || 0),
      dnsMs: Math.max(0, Number(timings.dns) || 0),
      connectMs: Math.max(0, Number(timings.connect) || 0),
      receiveMs: Math.max(0, Number(timings.receive) || 0),
      sizeBytes: sizeBytes ?? 0,
    } satisfies HarRequestSummary
  })
}

function parseLinkGraphInput(input: string) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return { edges: [] as LinkEdge[], nodes: [] as LinkNode[] }
  }

  let edges: LinkEdge[] = []

  if (lines[0].includes(",") && /from|source/i.test(lines[0]) && /to|target/i.test(lines[0])) {
    const { headers, rows } = parseCsv(input)
    const sourceIndex = headers.findIndex((header) => /from|source/i.test(header))
    const targetIndex = headers.findIndex((header) => /to|target/i.test(header))
    edges = rows
      .map((row) => ({
        source: row[sourceIndex]?.trim() ?? "",
        target: row[targetIndex]?.trim() ?? "",
      }))
      .filter((edge) => edge.source && edge.target)
  } else {
    edges = lines
      .map((line) => {
        const [source, target] = line.includes("->")
          ? line.split(/\s*->\s*/)
          : line.split(/\s*,\s*/)
        return {
          source: source?.trim() ?? "",
          target: target?.trim() ?? "",
        }
      })
      .filter((edge) => edge.source && edge.target)
  }

  const dedupedEdges = Array.from(
    new Map(edges.map((edge) => [`${edge.source}>>>${edge.target}`, edge])).values()
  )
  const nodeMap = new Map<string, LinkNode>()

  for (const edge of dedupedEdges) {
    if (!nodeMap.has(edge.source)) {
      nodeMap.set(edge.source, { url: edge.source, label: summarizeUrl(edge.source), incoming: 0, outgoing: 0 })
    }
    if (!nodeMap.has(edge.target)) {
      nodeMap.set(edge.target, { url: edge.target, label: summarizeUrl(edge.target), incoming: 0, outgoing: 0 })
    }

    nodeMap.get(edge.source)!.outgoing += 1
    nodeMap.get(edge.target)!.incoming += 1
  }

  return {
    edges: dedupedEdges,
    nodes: Array.from(nodeMap.values()).sort((first, second) => second.outgoing + second.incoming - (first.outgoing + first.incoming)),
  }
}

function createGraphLayout(nodes: LinkNode[], width = 760, height = 420) {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * 0.34

  return nodes.map((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(nodes.length, 1)
    return {
      ...node,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    }
  })
}

function cleanSvgSource(source: string) {
  return source
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!doctype[\s\S]*?>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .trim()
}

function extractSpriteSymbols(files: Array<{ name: string; contents: string }>) {
  const parser = new DOMParser()
  const warnings: string[] = []
  const internalIds = new Map<string, string>()
  const symbolCounts = new Map<string, number>()

  const symbols = files.flatMap((file, index) => {
    const documentNode = parser.parseFromString(cleanSvgSource(file.contents), "image/svg+xml")
    const svg = documentNode.querySelector("svg")

    if (!svg) {
      warnings.push(`${file.name} is missing a root <svg> element.`)
      return []
    }

    const baseSymbolId = sanitizeFilename(file.name.replace(/\.[^.]+$/, "")) || `icon-${index + 1}`
    const nextCount = (symbolCounts.get(baseSymbolId) ?? 0) + 1
    symbolCounts.set(baseSymbolId, nextCount)
    const symbolId = nextCount === 1 ? baseSymbolId : `${baseSymbolId}-${nextCount}`

    const innerMarkup = cleanSvgSource(svg.innerHTML)
    for (const match of innerMarkup.matchAll(/\sid="([^"]+)"/g)) {
      const rawId = match[1]
      if (internalIds.has(rawId)) {
        warnings.push(`Duplicate internal SVG id "${rawId}" found in ${file.name} and ${internalIds.get(rawId)}.`)
      } else {
        internalIds.set(rawId, file.name)
      }
    }

    return [
      {
        symbolId,
        fileName: file.name,
        viewBox: svg.getAttribute("viewBox") || "0 0 24 24",
        innerMarkup,
      } satisfies SpriteSymbolRecord,
    ]
  })

  const spriteMarkup = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">\n${symbols
    .map(
      (symbol) =>
        `  <symbol id="${symbol.symbolId}" viewBox="${symbol.viewBox}">\n${symbol.innerMarkup
          .split("\n")
          .map((line) => `    ${line}`)
          .join("\n")}\n  </symbol>`
    )
    .join("\n")}\n</svg>`

  return {
    symbols,
    spriteMarkup,
    warnings,
  }
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\b(a|an|and|at|for|in|of|on|or|the|to|with)\b/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function hexToRgb(hex: string) {
  const cleaned = hex.replace("#", "")
  const value = cleaned.length === 3
    ? cleaned
        .split("")
        .map((part) => `${part}${part}`)
        .join("")
    : cleaned

  const parsed = Number.parseInt(value, 16)

  return {
    red: (parsed >> 16) & 255,
    green: (parsed >> 8) & 255,
    blue: parsed & 255,
  }
}

function channelToLinear(channel: number) {
  const normalized = channel / 255
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4
}

function contrastRatio(foreground: string, background: string) {
  const fg = hexToRgb(foreground)
  const bg = hexToRgb(background)
  const fgLum =
    0.2126 * channelToLinear(fg.red) +
    0.7152 * channelToLinear(fg.green) +
    0.0722 * channelToLinear(fg.blue)
  const bgLum =
    0.2126 * channelToLinear(bg.red) +
    0.7152 * channelToLinear(bg.green) +
    0.0722 * channelToLinear(bg.blue)
  const lighter = Math.max(fgLum, bgLum)
  const darker = Math.min(fgLum, bgLum)

  return (lighter + 0.05) / (darker + 0.05)
}

function describeNode(element: Element) {
  const tagName = element.tagName.toLowerCase()
  const id = element.getAttribute("id")
  const className = element.getAttribute("class")?.trim().split(/\s+/).slice(0, 2).join(".")
  const label =
    element.getAttribute("aria-label") ||
    element.textContent?.trim() ||
    element.getAttribute("title") ||
    element.getAttribute("name") ||
    element.getAttribute("placeholder") ||
    "(no visible label)"

  return {
    selector: `${tagName}${id ? `#${id}` : ""}${className ? `.${className}` : ""}`,
    label,
  }
}

function parseMarkup(markup: string) {
  const parser = new DOMParser()
  return parser.parseFromString(markup || "<div />", "text/html")
}

function getFocusableElements(documentNode: Document) {
  const selector = [
    "a[href]",
    "button",
    "input:not([type='hidden'])",
    "textarea",
    "select",
    "summary",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",")

  const sorted = Array.from(documentNode.querySelectorAll<HTMLElement>(selector))
    .filter((element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true")
    .map((element, index) => ({
      domOrder: index + 1,
      tabIndex: element.tabIndex,
      ...describeNode(element),
    }))
    .sort((first, second) => {
      const firstPriority = first.tabIndex > 0 ? first.tabIndex : 9999
      const secondPriority = second.tabIndex > 0 ? second.tabIndex : 9999
      return firstPriority - secondPriority || first.domOrder - second.domOrder
    })

  return sorted.map((entry, index) => ({
    ...entry,
    order: index + 1,
  }))
}

function getHeadingOutline(documentNode: Document) {
  const headings = Array.from(documentNode.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((element, index) => ({
    order: index + 1,
    level: Number(element.tagName[1]),
    text: element.textContent?.trim() || "(empty heading)",
  }))

  const warnings: string[] = []

  if (headings.length === 0) {
    warnings.push("No heading elements were found.")
  }

  if (headings[0] && headings[0].level !== 1) {
    warnings.push("The first heading is not an H1.")
  }

  for (let index = 1; index < headings.length; index += 1) {
    if (headings[index].level - headings[index - 1].level > 1) {
      warnings.push(
        `Heading order jumps from H${headings[index - 1].level} to H${headings[index].level} near "${headings[index].text}".`
      )
    }
  }

  return { headings, warnings }
}

function getAccessibleName(element: Element, documentNode: Document) {
  const ariaLabel = element.getAttribute("aria-label")?.trim()
  if (ariaLabel) {
    return ariaLabel
  }

  const labelledBy = element.getAttribute("aria-labelledby")
  if (labelledBy) {
    return labelledBy
      .split(/\s+/)
      .map((id) => documentNode.getElementById(id)?.textContent?.trim() || "")
      .filter(Boolean)
      .join(" ")
  }

  const id = element.getAttribute("id")
  if (id) {
    const label = documentNode.querySelector(`label[for="${id}"]`)
    if (label?.textContent?.trim()) {
      return label.textContent.trim()
    }
  }

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return (
      element.placeholder?.trim() ||
      element.value?.trim() ||
      element.getAttribute("title")?.trim() ||
      ""
    )
  }

  if (element instanceof HTMLSelectElement) {
    return element.value?.trim() || element.getAttribute("title")?.trim() || ""
  }

  return (
    element.textContent?.trim() ||
    element.getAttribute("title")?.trim() ||
    element.getAttribute("alt")?.trim() ||
    ""
  )
}

function getAriaReview(documentNode: Document) {
  const selector = [
    "a[href]",
    "button",
    "input:not([type='hidden'])",
    "textarea",
    "select",
    "[role='button']",
    "[role='link']",
  ].join(",")

  return Array.from(documentNode.querySelectorAll(selector)).map((element) => {
    const label = getAccessibleName(element, documentNode)
    return {
      ...describeNode(element),
      accessibleName: label || "(missing accessible name)",
      missingName: !label,
    }
  })
}

function analyzeAltText(value: string) {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const records = lines.map((line, index) => {
    const segments = line.split(/\s*[|,]\s*/)
    const asset = segments.length > 1 ? segments[0] : `Image ${index + 1}`
    const alt = segments.length > 1 ? segments.slice(1).join(" ").trim() : line
    const warnings: string[] = []

    if (!alt) {
      warnings.push("Empty alt text. Leave empty only for decorative images.")
    }
    if (alt.length > 125) {
      warnings.push("Alt text is longer than 125 characters.")
    }
    if (alt.length > 0 && alt.length < 6) {
      warnings.push("Alt text is very short and may be too vague.")
    }
    if (/^(image|photo|picture) of /i.test(alt)) {
      warnings.push("Avoid opening with “image of” unless it adds useful context.")
    }
    if (asset && alt.toLowerCase().includes(asset.toLowerCase().replace(/\.[a-z0-9]+$/, ""))) {
      warnings.push("Alt text repeats the file name instead of describing the image.")
    }

    return {
      asset,
      alt,
      length: alt.length,
      warnings,
    }
  })

  const duplicateMap = new Map<string, number>()
  for (const record of records) {
    const normalized = record.alt.toLowerCase()
    if (normalized) {
      duplicateMap.set(normalized, (duplicateMap.get(normalized) ?? 0) + 1)
    }
  }

  return records.map((record) => ({
    ...record,
    duplicate: record.alt ? (duplicateMap.get(record.alt.toLowerCase()) ?? 0) > 1 : false,
  }))
}

function searchJsonPaths(value: unknown, query: string, currentPath = "$"): string[] {
  const matches: string[] = []
  const lowerQuery = query.toLowerCase()

  if (typeof value === "string" && value.toLowerCase().includes(lowerQuery)) {
    matches.push(currentPath)
  }

  if (typeof value === "number" && String(value).includes(query)) {
    matches.push(currentPath)
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      matches.push(...searchJsonPaths(entry, query, `${currentPath}[${index}]`))
    })
  }

  if (value && typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
      if (key.toLowerCase().includes(lowerQuery)) {
        matches.push(`${currentPath}.${key}`)
      }
      matches.push(...searchJsonPaths(entry, query, `${currentPath}.${key}`))
    })
  }

  return matches
}

function sanitizeFilename(value: string) {
  return value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
}

function convertLineEndings(value: string, lineEnding: "lf" | "crlf") {
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  return lineEnding === "crlf" ? normalized.replace(/\n/g, "\r\n") : normalized
}

function calculateMoonPhase(date: string) {
  const target = new Date(`${date}T12:00:00Z`)
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0)
  const synodicMonth = 29.53058867
  const daysSince = (target.getTime() - knownNewMoon) / 86400000
  const phase = ((daysSince % synodicMonth) + synodicMonth) % synodicMonth
  const fraction = phase / synodicMonth
  const illumination = Math.round(((1 - Math.cos(fraction * Math.PI * 2)) / 2) * 100)

  if (fraction < 0.03 || fraction > 0.97) return { label: "New Moon", illumination }
  if (fraction < 0.22) return { label: "Waxing Crescent", illumination }
  if (fraction < 0.28) return { label: "First Quarter", illumination }
  if (fraction < 0.47) return { label: "Waxing Gibbous", illumination }
  if (fraction < 0.53) return { label: "Full Moon", illumination }
  if (fraction < 0.72) return { label: "Waning Gibbous", illumination }
  if (fraction < 0.78) return { label: "Last Quarter", illumination }
  return { label: "Waning Crescent", illumination }
}

function nearestNote(frequency: number) {
  if (frequency <= 0) {
    return null
  }

  const midi = Math.round(69 + 12 * Math.log2(frequency / 440))
  const cents = Math.round((69 + 12 * Math.log2(frequency / 440) - midi) * 100)
  const note = NOTE_NAMES[((midi % 12) + 12) % 12]
  const octave = Math.floor(midi / 12) - 1

  return {
    note: `${note}${octave}`,
    cents,
    reference: 440 * 2 ** ((midi - 69) / 12),
  }
}

function analyzePassword(password: string) {
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    repeated: /(.)\1{2,}/.test(password),
  }

  const score =
    Number(checks.length) * 30 +
    Number(checks.uppercase) * 15 +
    Number(checks.lowercase) * 15 +
    Number(checks.number) * 15 +
    Number(checks.symbol) * 15 -
    Number(checks.repeated) * 15

  return {
    score: Math.max(0, Math.min(score, 100)),
    checks,
  }
}

function reduceFraction(numerator: number, denominator: number) {
  const divisor = gcd(numerator, denominator) || 1
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  }
}

function ToolFields({
  fields,
  values,
  onChange,
}: {
  fields: InputField[]
  values: Record<string, string>
  onChange: (key: string, nextValue: string) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.key}>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input
            id={field.key}
            type={field.type ?? "number"}
            min={field.min}
            max={field.max}
            step={field.step}
            placeholder={field.placeholder}
            value={values[field.key] ?? ""}
            onChange={(event) => onChange(field.key, event.target.value)}
            className="mt-2"
          />
        </div>
      ))}
    </div>
  )
}

function ResultGrid({ items }: { items: ResultMetric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-2 text-xl font-semibold">{item.value}</p>
          {item.hint ? <p className="mt-2 text-sm text-muted-foreground">{item.hint}</p> : null}
        </div>
      ))}
    </div>
  )
}

function DataTable({
  headings,
  rows,
}: {
  headings: string[]
  rows: Array<Array<string | number>>
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/30">
          <tr>
            {headings.map((heading) => (
              <th key={heading} className="px-4 py-3 text-left font-medium text-foreground">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row.join("-")}`}>
              {row.map((value, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 align-top text-muted-foreground">
                  {String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DynamicToolExpansion({ toolId }: { toolId: string }) {
  const tool = getToolById(toolId)

  if (!tool) {
    return null
  }

  if (ACCESSIBILITY_TOOL_IDS.has(toolId)) {
    return <AccessibilityTools toolId={toolId} />
  }

  if (FINANCE_TOOL_IDS.has(toolId)) {
    return <FinanceTools toolId={toolId} />
  }

  if (ENGINEERING_TOOL_IDS.has(toolId)) {
    return <EngineeringTools toolId={toolId} />
  }

  if (EDUCATION_TOOL_IDS.has(toolId)) {
    return <EducationTools toolId={toolId} />
  }

  if (ASTRONOMY_TOOL_IDS.has(toolId)) {
    return <AstronomyTools toolId={toolId} />
  }

  if (SEO_TOOL_IDS.has(toolId)) {
    return <SeoTools toolId={toolId} />
  }

  if (DEVELOPER_TOOL_IDS.has(toolId)) {
    return <DeveloperTools toolId={toolId} />
  }

  if (DATA_TOOL_IDS.has(toolId)) {
    return <DataTools toolId={toolId} />
  }

  if (IMAGE_TOOL_IDS.has(toolId)) {
    return <ImageTools toolId={toolId} />
  }

  if (FILE_TOOL_IDS.has(toolId)) {
    return <FileTools toolId={toolId} />
  }

  if (AUDIO_TOOL_IDS.has(toolId)) {
    return <AudioTools toolId={toolId} />
  }

  if (DESIGN_TOOL_IDS.has(toolId)) {
    return <DesignTools toolId={toolId} />
  }

  if (SECURITY_TOOL_IDS.has(toolId)) {
    return <SecurityTools toolId={toolId} />
  }

  if (RANDOM_TOOL_IDS.has(toolId)) {
    return <RandomTools toolId={toolId} />
  }

  return (
    <ToolEmptyState
      tool={tool}
      title="Tool implementation is still being wired up"
      description="This route is registered correctly, but the dynamic workspace has not been attached yet."
    />
  )
}

function AccessibilityTools({ toolId }: { toolId: string }) {
  const [markup, setMarkup] = useState(SAMPLE_MARKUP)
  const [altTextInput, setAltTextInput] = useState(
    "hero-banner.jpg | Team collaborating around a product roadmap on a whiteboard\nlogo-mark.svg | The Free AI Tools logo mark\npricing-graph.png | Line chart showing monthly recurring revenue growth\nempty-divider.png | "
  )
  const [foreground, setForeground] = useState("#111827")
  const [background, setBackground] = useState("#ffffff")
  const [largeText, setLargeText] = useState(false)

  const documentNode = useMemo(() => parseMarkup(markup), [markup])
  const focusables = useMemo(() => getFocusableElements(documentNode), [documentNode])
  const headingOutline = useMemo(() => getHeadingOutline(documentNode), [documentNode])
  const ariaReview = useMemo(() => getAriaReview(documentNode), [documentNode])
  const altTextRecords = useMemo(() => analyzeAltText(altTextInput), [altTextInput])
  const ratio = useMemo(() => contrastRatio(foreground, background), [foreground, background])

  if (toolId === "alt-text-length-checker") {
    const duplicateCount = altTextRecords.filter((record) => record.duplicate).length
    const warningCount = altTextRecords.reduce((total, record) => total + record.warnings.length, 0)

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Alt Text Review Queue">
          <div className="space-y-3">
            <Label htmlFor="alt-text-lines">One image per line: `filename | alt text`</Label>
            <Textarea
              id="alt-text-lines"
              value={altTextInput}
              onChange={(event) => setAltTextInput(event.target.value)}
              className="min-h-[260px]"
            />
          </div>
        </ToolCard>

        <ToolCard title="Accessibility Review">
          <ResultGrid
            items={[
              { label: "Images reviewed", value: String(altTextRecords.length) },
              { label: "Warnings", value: String(warningCount) },
              { label: "Duplicate alt text", value: String(duplicateCount) },
            ]}
          />
          <div className="mt-4">
            <DataTable
              headings={["Asset", "Alt text", "Length", "Notes"]}
              rows={altTextRecords.map((record) => [
                record.asset,
                record.alt || "(decorative / empty)",
                record.length,
                [
                  record.duplicate ? "Duplicate alt text." : "",
                  ...record.warnings,
                ]
                  .filter(Boolean)
                  .join(" "),
              ])}
            />
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "color-contrast-checker") {
    const targetRatio = largeText ? 3 : 4.5
    const passes = ratio >= targetRatio

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Contrast Inputs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="foreground-color">Foreground</Label>
              <div className="mt-2 flex items-center gap-3">
                <Input
                  id="foreground-color"
                  type="color"
                  value={foreground}
                  onChange={(event) => setForeground(event.target.value)}
                  className="h-12 w-20 p-1"
                />
                <Input value={foreground} onChange={(event) => setForeground(event.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="background-color">Background</Label>
              <div className="mt-2 flex items-center gap-3">
                <Input
                  id="background-color"
                  type="color"
                  value={background}
                  onChange={(event) => setBackground(event.target.value)}
                  className="h-12 w-20 p-1"
                />
                <Input value={background} onChange={(event) => setBackground(event.target.value)} />
              </div>
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={largeText}
              onChange={(event) => setLargeText(event.target.checked)}
            />
            Check against large-text contrast rules
          </label>
        </ToolCard>

        <ToolCard title="Result">
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: background, color: foreground }}
          >
            <p className={`font-semibold ${largeText ? "text-2xl" : "text-lg"}`}>
              Contrast preview for The Free AI Tools content
            </p>
            <p className="mt-3">
              Search-engine visibility starts with readable interfaces for every user, including
              keyboard and low-vision visitors.
            </p>
          </div>
          <div className="mt-4">
            <ResultGrid
              items={[
                { label: "Contrast ratio", value: `${formatNumber(ratio, 2)}:1` },
                { label: "Required ratio", value: `${targetRatio}:1` },
                { label: "Status", value: passes ? "Pass" : "Needs improvement" },
              ]}
            />
          </div>
        </ToolCard>
      </div>
    )
  }

  const skipLinkFound = documentNode.querySelector('a[href^="#"]') !== null
  const positiveTabIndexCount = focusables.filter((entry) => entry.tabIndex > 0).length

  return (
    <div className="space-y-6">
      <ToolCard title="Paste HTML or Component Markup">
        <Textarea
          value={markup}
          onChange={(event) => setMarkup(event.target.value)}
          className="min-h-[260px]"
        />
      </ToolCard>

      {toolId === "heading-structure-outline" ? (
        <ToolCard title="Heading Outline">
          <ResultGrid
            items={[
              { label: "Heading count", value: String(headingOutline.headings.length) },
              { label: "Warnings", value: String(headingOutline.warnings.length) },
              { label: "First heading", value: headingOutline.headings[0]?.text ?? "None" },
            ]}
          />
          <div className="mt-4 space-y-3">
            {headingOutline.headings.map((heading) => (
              <div key={`${heading.order}-${heading.text}`} className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">H{heading.level}</p>
                <p className="font-medium">{heading.text}</p>
              </div>
            ))}
          </div>
          {headingOutline.warnings.length > 0 ? (
            <Alert className="mt-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription>{headingOutline.warnings.join(" ")}</AlertDescription>
            </Alert>
          ) : null}
        </ToolCard>
      ) : null}

      {toolId === "aria-label-reviewer" ? (
        <ToolCard title="Interactive Element Naming">
          <ResultGrid
            items={[
              { label: "Interactive elements", value: String(ariaReview.length) },
              { label: "Missing names", value: String(ariaReview.filter((item) => item.missingName).length) },
              { label: "Named correctly", value: String(ariaReview.filter((item) => !item.missingName).length) },
            ]}
          />
          <div className="mt-4">
            <DataTable
              headings={["Element", "Visible label", "Accessible name", "Status"]}
              rows={ariaReview.map((item) => [
                item.selector,
                item.label,
                item.accessibleName,
                item.missingName ? "Needs label" : "Looks good",
              ])}
            />
          </div>
        </ToolCard>
      ) : null}

      {toolId === "focusable-elements-checker" || toolId === "accessibility-focus-order-visualizer" ? (
        <ToolCard title={toolId === "accessibility-focus-order-visualizer" ? "Keyboard Focus Order" : "Focusable Elements"}>
          <ResultGrid
            items={[
              { label: "Focusable elements", value: String(focusables.length) },
              { label: "Positive tabindex", value: String(positiveTabIndexCount) },
              { label: "Skip link found", value: skipLinkFound ? "Yes" : "No" },
            ]}
          />
          <div className="mt-4">
            <DataTable
              headings={["Keyboard order", "DOM order", "Element", "Label", "tabindex"]}
              rows={focusables.map((item) => [item.order, item.domOrder, item.selector, item.label, item.tabIndex])}
            />
          </div>
          {positiveTabIndexCount > 0 ? (
            <Alert className="mt-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription>
                Positive tabindex values were detected. They can create confusing keyboard order and
                maintenance risk.
              </AlertDescription>
            </Alert>
          ) : null}
        </ToolCard>
      ) : null}
    </div>
  )
}

function FinanceTools({ toolId }: { toolId: string }) {
  const financeConfigs: Record<string, { fields: InputField[]; defaults: Record<string, string> }> = {
    "break-even-calculator": {
      fields: [
        { key: "fixedCosts", label: "Fixed costs", step: "0.01" },
        { key: "pricePerUnit", label: "Price per unit", step: "0.01" },
        { key: "variableCost", label: "Variable cost per unit", step: "0.01" },
      ],
      defaults: { fixedCosts: "12000", pricePerUnit: "79", variableCost: "24" },
    },
    "saas-pricing-margin-calculator": {
      fields: [
        { key: "monthlyPrice", label: "Monthly price per account", step: "0.01" },
        { key: "customers", label: "Active customers", step: "1" },
        { key: "serviceCost", label: "Service cost per account", step: "0.01" },
        { key: "cac", label: "Customer acquisition cost", step: "0.01" },
        { key: "monthlyChurn", label: "Monthly churn %", step: "0.01" },
      ],
      defaults: { monthlyPrice: "49", customers: "240", serviceCost: "9", cac: "320", monthlyChurn: "2.4" },
    },
    "invoice-late-fee-calculator": {
      fields: [
        { key: "invoiceDate", label: "Invoice date", type: "date" },
        { key: "termsDays", label: "Payment terms (days)", step: "1" },
        { key: "graceDays", label: "Grace period (days)", step: "1" },
        { key: "invoiceAmount", label: "Invoice amount", step: "0.01" },
        { key: "lateFeeRate", label: "Late fee %", step: "0.01" },
      ],
      defaults: { invoiceDate: "2026-04-02", termsDays: "30", graceDays: "5", invoiceAmount: "1800", lateFeeRate: "3" },
    },
    "profit-margin-calculator": {
      fields: [
        { key: "revenue", label: "Revenue", step: "0.01" },
        { key: "cost", label: "Cost", step: "0.01" },
      ],
      defaults: { revenue: "12000", cost: "7300" },
    },
    "sales-tax-calculator": {
      fields: [
        { key: "subtotal", label: "Subtotal", step: "0.01" },
        { key: "taxRate", label: "Tax rate %", step: "0.01" },
      ],
      defaults: { subtotal: "240", taxRate: "8.25" },
    },
    "pricing-markup-calculator": {
      fields: [
        { key: "cost", label: "Unit cost", step: "0.01" },
        { key: "markupRate", label: "Markup %", step: "0.01" },
      ],
      defaults: { cost: "18", markupRate: "65" },
    },
    "subscription-revenue-forecast": {
      fields: [
        { key: "customers", label: "Starting customers", step: "1" },
        { key: "monthlyPrice", label: "Monthly price", step: "0.01" },
        { key: "growthRate", label: "Monthly growth %", step: "0.01" },
        { key: "churnRate", label: "Monthly churn %", step: "0.01" },
        { key: "months", label: "Months to project", step: "1" },
      ],
      defaults: { customers: "80", monthlyPrice: "39", growthRate: "12", churnRate: "4", months: "12" },
    },
  }

  const config = financeConfigs[toolId]
  const [values, setValues] = useState<Record<string, string>>(config.defaults)

  const result = useMemo(() => {
    if (toolId === "break-even-calculator") {
      const fixedCosts = toNumber(values.fixedCosts)
      const pricePerUnit = toNumber(values.pricePerUnit)
      const variableCost = toNumber(values.variableCost)
      const contributionMargin = pricePerUnit - variableCost
      const units = contributionMargin > 0 ? fixedCosts / contributionMargin : 0
      const revenue = units * pricePerUnit

      return {
        metrics: [
          { label: "Contribution margin", value: formatCurrency(contributionMargin) },
          { label: "Break-even units", value: formatNumber(units, 1) },
          { label: "Break-even revenue", value: formatCurrency(revenue) },
        ],
      }
    }

    if (toolId === "saas-pricing-margin-calculator") {
      const monthlyPrice = toNumber(values.monthlyPrice)
      const customers = toNumber(values.customers)
      const serviceCost = toNumber(values.serviceCost)
      const cac = toNumber(values.cac)
      const monthlyChurn = toNumber(values.monthlyChurn)
      const mrr = monthlyPrice * customers
      const grossMargin = monthlyPrice > 0 ? ((monthlyPrice - serviceCost) / monthlyPrice) * 100 : 0
      const monthlyGrossProfit = (monthlyPrice - serviceCost) * customers
      const payback = monthlyPrice - serviceCost > 0 ? cac / (monthlyPrice - serviceCost) : 0

      return {
        metrics: [
          { label: "MRR", value: formatCurrency(mrr) },
          { label: "ARR", value: formatCurrency(mrr * 12) },
          { label: "Gross margin", value: formatPercent(grossMargin) },
          { label: "CAC payback", value: `${formatNumber(payback, 1)} months` },
          { label: "Monthly gross profit", value: formatCurrency(monthlyGrossProfit) },
          { label: "Logo churn", value: formatPercent(monthlyChurn) },
        ],
      }
    }

    if (toolId === "invoice-late-fee-calculator") {
      const invoiceDate = new Date(`${values.invoiceDate}T12:00:00Z`)
      const dueDate = new Date(invoiceDate)
      dueDate.setUTCDate(dueDate.getUTCDate() + toNumber(values.termsDays))
      const lateDate = new Date(dueDate)
      lateDate.setUTCDate(lateDate.getUTCDate() + toNumber(values.graceDays))
      const invoiceAmount = toNumber(values.invoiceAmount)
      const feeRate = toNumber(values.lateFeeRate) / 100
      const lateFee = invoiceAmount * feeRate

      return {
        metrics: [
          { label: "Due date", value: dueDate.toISOString().slice(0, 10) },
          { label: "Late-fee start", value: lateDate.toISOString().slice(0, 10) },
          { label: "Late fee", value: formatCurrency(lateFee) },
          { label: "Amount after fee", value: formatCurrency(invoiceAmount + lateFee) },
        ],
      }
    }

    if (toolId === "profit-margin-calculator") {
      const revenue = toNumber(values.revenue)
      const cost = toNumber(values.cost)
      const profit = revenue - cost
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0
      const markup = cost > 0 ? (profit / cost) * 100 : 0

      return {
        metrics: [
          { label: "Profit", value: formatCurrency(profit) },
          { label: "Margin", value: formatPercent(margin) },
          { label: "Markup", value: formatPercent(markup) },
        ],
      }
    }

    if (toolId === "sales-tax-calculator") {
      const subtotal = toNumber(values.subtotal)
      const taxRate = toNumber(values.taxRate)
      const tax = subtotal * (taxRate / 100)

      return {
        metrics: [
          { label: "Tax amount", value: formatCurrency(tax) },
          { label: "Total with tax", value: formatCurrency(subtotal + tax) },
          { label: "Tax rate", value: formatPercent(taxRate) },
        ],
      }
    }

    if (toolId === "pricing-markup-calculator") {
      const cost = toNumber(values.cost)
      const markupRate = toNumber(values.markupRate)
      const price = cost * (1 + markupRate / 100)
      const margin = price > 0 ? ((price - cost) / price) * 100 : 0

      return {
        metrics: [
          { label: "Recommended price", value: formatCurrency(price) },
          { label: "Gross margin", value: formatPercent(margin) },
          { label: "Markup", value: formatPercent(markupRate) },
        ],
      }
    }

    const customers = toNumber(values.customers)
    const monthlyPrice = toNumber(values.monthlyPrice)
    const growthRate = toNumber(values.growthRate) / 100
    const churnRate = toNumber(values.churnRate) / 100
    const months = Math.max(1, Math.round(toNumber(values.months)))

    const rows: Array<Array<string | number>> = []
    let projectedCustomers = customers

    for (let month = 1; month <= months; month += 1) {
      const startingCustomers = projectedCustomers
      projectedCustomers = startingCustomers * (1 + growthRate - churnRate)
      const mrr = projectedCustomers * monthlyPrice
      rows.push([month, formatNumber(projectedCustomers, 1), formatCurrency(mrr)])
    }

    return {
      metrics: [
        { label: "Projected customers", value: formatNumber(projectedCustomers, 1) },
        { label: "Projected MRR", value: formatCurrency(projectedCustomers * monthlyPrice) },
        { label: "Projected ARR", value: formatCurrency(projectedCustomers * monthlyPrice * 12) },
      ],
      table: rows,
    }
  }, [toolId, values])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Business Inputs">
        <ToolFields
          fields={config.fields}
          values={values}
          onChange={(key, nextValue) => setValues((current) => ({ ...current, [key]: nextValue }))}
        />
      </ToolCard>

      <ToolCard title="Calculated Output">
        <ResultGrid items={result.metrics} />
        {result.table ? (
          <div className="mt-4">
            <DataTable headings={["Month", "Customers", "MRR"]} rows={result.table} />
          </div>
        ) : null}
      </ToolCard>
    </div>
  )
}

function EngineeringTools({ toolId }: { toolId: string }) {
  const resistorDigits: Record<string, number> = {
    black: 0,
    brown: 1,
    red: 2,
    orange: 3,
    yellow: 4,
    green: 5,
    blue: 6,
    violet: 7,
    gray: 8,
    white: 9,
  }
  const resistorMultipliers: Record<string, number> = {
    black: 1,
    brown: 10,
    red: 100,
    orange: 1000,
    yellow: 10000,
    green: 100000,
    blue: 1000000,
    gold: 0.1,
    silver: 0.01,
  }
  const resistorTolerance: Record<string, string> = {
    brown: "±1%",
    red: "±2%",
    green: "±0.5%",
    blue: "±0.25%",
    violet: "±0.1%",
    gray: "±0.05%",
    gold: "±5%",
    silver: "±10%",
  }

  const [values, setValues] = useState<Record<string, string>>({
    voltage: "12",
    current: "2",
    resistance: "6",
    inputVoltage: "12",
    r1: "1000",
    r2: "2200",
    supplyVoltage: "12",
    ledVoltage: "2.1",
    ledCurrent: "20",
    batteryCapacity: "5000",
    loadCurrent: "0.85",
    resistorOhms: "1000",
    capacitorUf: "470",
    sourceVoltage: "5",
  })
  const [bands, setBands] = useState({ first: "red", second: "violet", multiplier: "orange", tolerance: "gold" })

  if (toolId === "resistor-color-code-calculator") {
    const resistance =
      (resistorDigits[bands.first] * 10 + resistorDigits[bands.second]) * resistorMultipliers[bands.multiplier]

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Resistor Bands">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: "first", label: "1st band", palette: Object.keys(resistorDigits) },
              { key: "second", label: "2nd band", palette: Object.keys(resistorDigits) },
              { key: "multiplier", label: "Multiplier", palette: Object.keys(resistorMultipliers) },
              { key: "tolerance", label: "Tolerance", palette: Object.keys(resistorTolerance) },
            ].map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                <select
                  id={field.key}
                  className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={bands[field.key as keyof typeof bands]}
                  onChange={(event) =>
                    setBands((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                >
                  {field.palette.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </ToolCard>

        <ToolCard title="Decoded Value">
          <ResultGrid
            items={[
              { label: "Resistance", value: `${formatNumber(resistance, 2)} Ω` },
              { label: "Tolerance", value: resistorTolerance[bands.tolerance] },
              { label: "Readable value", value: resistance >= 1000 ? `${formatNumber(resistance / 1000, 2)} kΩ` : `${formatNumber(resistance, 2)} Ω` },
            ]}
          />
        </ToolCard>
      </div>
    )
  }

  const result = (() => {
    if (toolId === "ohms-law-power-triangle-calculator") {
      const voltage = toNumber(values.voltage)
      const current = toNumber(values.current)
      const resistance = toNumber(values.resistance)

      const solvedCurrent = current || (resistance ? voltage / resistance : 0)
      const solvedVoltage = voltage || solvedCurrent * resistance
      const solvedResistance = resistance || (solvedCurrent ? solvedVoltage / solvedCurrent : 0)
      const power = solvedVoltage * solvedCurrent

      return [
        { label: "Voltage", value: `${formatNumber(solvedVoltage, 2)} V` },
        { label: "Current", value: `${formatNumber(solvedCurrent, 2)} A` },
        { label: "Resistance", value: `${formatNumber(solvedResistance, 2)} Ω` },
        { label: "Power", value: `${formatNumber(power, 2)} W` },
      ]
    }

    if (toolId === "voltage-divider-calculator") {
      const inputVoltage = toNumber(values.inputVoltage)
      const r1 = toNumber(values.r1)
      const r2 = toNumber(values.r2)
      const outputVoltage = r1 + r2 > 0 ? inputVoltage * (r2 / (r1 + r2)) : 0

      return [
        { label: "Output voltage", value: `${formatNumber(outputVoltage, 2)} V` },
        { label: "Divider ratio", value: reduceRatio(r2, r1 + r2) },
      ]
    }

    if (toolId === "led-series-resistor-calculator") {
      const supplyVoltage = toNumber(values.supplyVoltage)
      const ledVoltage = toNumber(values.ledVoltage)
      const ledCurrent = toNumber(values.ledCurrent) / 1000
      const resistor = ledCurrent > 0 ? (supplyVoltage - ledVoltage) / ledCurrent : 0
      const power = ledCurrent ** 2 * resistor

      return [
        { label: "Required resistor", value: `${formatNumber(resistor, 0)} Ω` },
        { label: "Resistor power", value: `${formatNumber(power, 2)} W` },
        { label: "Suggested rating", value: power < 0.125 ? "1/8 W or higher" : power < 0.25 ? "1/4 W or higher" : "1/2 W or higher" },
      ]
    }

    if (toolId === "power-supply-runtime-calculator") {
      const batteryCapacity = toNumber(values.batteryCapacity)
      const loadCurrent = toNumber(values.loadCurrent)
      const runtimeHours = loadCurrent > 0 ? batteryCapacity / 1000 / loadCurrent : 0

      return [
        { label: "Estimated runtime", value: `${formatNumber(runtimeHours, 2)} hours` },
        { label: "Minutes", value: `${formatNumber(runtimeHours * 60, 0)} min` },
      ]
    }

    const resistorOhms = toNumber(values.resistorOhms)
    const capacitorUf = toNumber(values.capacitorUf)
    const timeConstant = resistorOhms * (capacitorUf / 1_000_000)

    return [
      { label: "Time constant", value: `${formatNumber(timeConstant, 4)} s` },
      { label: "63% charge", value: `${formatNumber(timeConstant, 4)} s` },
      { label: "95% charge", value: `${formatNumber(timeConstant * 3, 4)} s` },
      { label: "99% charge", value: `${formatNumber(timeConstant * 5, 4)} s` },
    ]
  })()

  const fieldMap: Record<string, InputField[]> = {
    "ohms-law-power-triangle-calculator": [
      { key: "voltage", label: "Voltage (V)", step: "0.01" },
      { key: "current", label: "Current (A)", step: "0.01" },
      { key: "resistance", label: "Resistance (Ω)", step: "0.01" },
    ],
    "voltage-divider-calculator": [
      { key: "inputVoltage", label: "Input voltage (V)", step: "0.01" },
      { key: "r1", label: "R1 (Ω)", step: "1" },
      { key: "r2", label: "R2 (Ω)", step: "1" },
    ],
    "led-series-resistor-calculator": [
      { key: "supplyVoltage", label: "Supply voltage (V)", step: "0.01" },
      { key: "ledVoltage", label: "LED forward voltage (V)", step: "0.01" },
      { key: "ledCurrent", label: "LED current (mA)", step: "0.1" },
    ],
    "power-supply-runtime-calculator": [
      { key: "batteryCapacity", label: "Battery capacity (mAh)", step: "1" },
      { key: "loadCurrent", label: "Load current (A)", step: "0.01" },
    ],
    "capacitor-charge-discharge-calculator": [
      { key: "resistorOhms", label: "Resistance (Ω)", step: "1" },
      { key: "capacitorUf", label: "Capacitance (μF)", step: "0.1" },
      { key: "sourceVoltage", label: "Source voltage (V)", step: "0.01" },
    ],
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Engineering Inputs">
        <ToolFields
          fields={fieldMap[toolId]}
          values={values}
          onChange={(key, nextValue) => setValues((current) => ({ ...current, [key]: nextValue }))}
        />
      </ToolCard>
      <ToolCard title="Calculated Results">
        <ResultGrid items={result} />
      </ToolCard>
    </div>
  )
}

function EducationTools({ toolId }: { toolId: string }) {
  const [angle, setAngle] = useState("45")
  const [numerator, setNumerator] = useState("42")
  const [denominator, setDenominator] = useState("56")
  const [scientificValue, setScientificValue] = useState("123456")
  const [studyValues, setStudyValues] = useState({
    totalMinutes: "180",
    focusMinutes: "25",
    breakMinutes: "5",
    longBreakEvery: "4",
  })
  const [flashcards, setFlashcards] = useState("Canonical tags\nStructured data\nCore Web Vitals\nIndex coverage\nInternal linking")
  const [currentFlashcard, setCurrentFlashcard] = useState("Canonical tags")

  if (toolId === "unit-circle-visualizer") {
    const degrees = toNumber(angle)
    const radians = (degrees * Math.PI) / 180
    const x = Math.cos(radians)
    const y = Math.sin(radians)
    const pointX = 90 + x * 70
    const pointY = 90 - y * 70

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Angle">
          <Label htmlFor="unit-circle-angle">Degrees</Label>
          <Input
            id="unit-circle-angle"
            type="range"
            min="0"
            max="360"
            step="1"
            value={angle}
            onChange={(event) => setAngle(event.target.value)}
            className="mt-4"
          />
          <ResultGrid
            items={[
              { label: "Degrees", value: `${formatNumber(degrees, 0)}°` },
              { label: "Radians", value: formatNumber(radians, 3) },
              { label: "sin θ", value: formatNumber(y, 3) },
              { label: "cos θ", value: formatNumber(x, 3) },
            ]}
          />
        </ToolCard>
        <ToolCard title="Visualization">
          <svg viewBox="0 0 180 180" className="mx-auto h-72 w-72">
            <circle cx="90" cy="90" r="70" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="90" x2="160" y2="90" stroke="currentColor" strokeOpacity="0.2" />
            <line x1="90" y1="20" x2="90" y2="160" stroke="currentColor" strokeOpacity="0.2" />
            <line x1="90" y1="90" x2={pointX} y2={pointY} stroke="currentColor" strokeWidth="2" />
            <circle cx={pointX} cy={pointY} r="5" fill="currentColor" />
          </svg>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "fraction-simplifier-calculator") {
    const reduced = reduceFraction(toNumber(numerator), toNumber(denominator) || 1)
    const decimal = toNumber(denominator) !== 0 ? toNumber(numerator) / toNumber(denominator) : 0

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Fraction">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fraction-numerator">Numerator</Label>
              <Input id="fraction-numerator" value={numerator} onChange={(event) => setNumerator(event.target.value)} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="fraction-denominator">Denominator</Label>
              <Input id="fraction-denominator" value={denominator} onChange={(event) => setDenominator(event.target.value)} className="mt-2" />
            </div>
          </div>
        </ToolCard>
        <ToolCard title="Simplified Result">
          <ResultGrid
            items={[
              { label: "Simplified", value: `${reduced.numerator}/${reduced.denominator}` },
              { label: "Decimal", value: formatNumber(decimal, 4) },
              { label: "Percent", value: formatPercent(decimal * 100, 2) },
            ]}
          />
        </ToolCard>
      </div>
    )
  }

  if (toolId === "scientific-notation-converter") {
    const parsed = Number(scientificValue)
    const scientific = Number.isFinite(parsed) ? parsed.toExponential(4) : "Invalid"

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Number Input">
          <Input value={scientificValue} onChange={(event) => setScientificValue(event.target.value)} />
        </ToolCard>
        <ToolCard title="Converted Output">
          <ResultGrid
            items={[
              { label: "Scientific notation", value: scientific },
              { label: "Expanded number", value: Number.isFinite(parsed) ? parsed.toLocaleString("en-US") : "Invalid" },
            ]}
          />
        </ToolCard>
      </div>
    )
  }

  if (toolId === "study-session-planner") {
    const totalMinutes = toNumber(studyValues.totalMinutes)
    const focusMinutes = Math.max(1, toNumber(studyValues.focusMinutes))
    const breakMinutes = Math.max(0, toNumber(studyValues.breakMinutes))
    const longBreakEvery = Math.max(1, Math.round(toNumber(studyValues.longBreakEvery)))
    const sessions: Array<Array<string | number>> = []
    let remaining = totalMinutes
    let sessionNumber = 1

    while (remaining > 0) {
      const focus = Math.min(focusMinutes, remaining)
      sessions.push([sessionNumber, `Focus`, `${focus} min`])
      remaining -= focus
      if (remaining <= 0) {
        break
      }
      const breakLength = sessionNumber % longBreakEvery === 0 ? breakMinutes * 3 : breakMinutes
      sessions.push([sessionNumber, `Break`, `${Math.min(breakLength, remaining)} min`])
      remaining -= Math.min(breakLength, remaining)
      sessionNumber += 1
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Session Settings">
          <ToolFields
            fields={[
              { key: "totalMinutes", label: "Total study time (minutes)", step: "1" },
              { key: "focusMinutes", label: "Focus block length", step: "1" },
              { key: "breakMinutes", label: "Break length", step: "1" },
              { key: "longBreakEvery", label: "Long break every N sessions", step: "1" },
            ]}
            values={studyValues}
            onChange={(key, nextValue) => setStudyValues((current) => ({ ...current, [key]: nextValue }))}
          />
        </ToolCard>
        <ToolCard title="Plan">
          <ResultGrid
            items={[
              { label: "Focus sessions", value: String(sessions.filter((row) => row[1] === "Focus").length) },
              { label: "Breaks", value: String(sessions.filter((row) => row[1] === "Break").length) },
            ]}
          />
          <div className="mt-4">
            <DataTable headings={["Session", "Type", "Duration"]} rows={sessions} />
          </div>
        </ToolCard>
      </div>
    )
  }

  const cards = flashcards
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Flashcards">
        <Textarea value={flashcards} onChange={(event) => setFlashcards(event.target.value)} className="min-h-[240px]" />
        <Button
          className="mt-4"
          onClick={() => setCurrentFlashcard(cards[Math.floor(Math.random() * cards.length)] || "Add more flashcards")}
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Pick a random card
        </Button>
      </ToolCard>
      <ToolCard title="Current Prompt">
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border bg-muted/20 p-6 text-center">
          <p className="text-2xl font-semibold">{currentFlashcard}</p>
        </div>
      </ToolCard>
    </div>
  )
}

function AstronomyTools({ toolId }: { toolId: string }) {
  const [values, setValues] = useState<Record<string, string>>({
    aperture: "120",
    telescopeFocal: "900",
    eyepieceFocal: "25",
    apparentField: "52",
    date: "2026-04-02",
    massEarths: "1",
    radiusEarths: "1",
    earthWeight: "180",
    eyepieceA: "25",
    eyepieceB: "10",
  })

  if (toolId === "moon-phase-finder") {
    const phase = calculateMoonPhase(values.date)

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Observation Date">
          <Label htmlFor="moon-date">Date</Label>
          <Input
            id="moon-date"
            type="date"
            value={values.date}
            onChange={(event) => setValues((current) => ({ ...current, date: event.target.value }))}
            className="mt-2"
          />
        </ToolCard>
        <ToolCard title="Moon Phase">
          <ResultGrid
            items={[
              { label: "Phase", value: phase.label },
              { label: "Approx. illumination", value: formatPercent(phase.illumination, 0) },
            ]}
          />
        </ToolCard>
      </div>
    )
  }

  if (toolId === "planet-weight-calculator") {
    const earthWeight = toNumber(values.earthWeight)

    return (
      <ToolCard title="Planetary Weight Comparison">
        <div className="max-w-sm">
          <Label htmlFor="earth-weight">Earth weight</Label>
          <Input
            id="earth-weight"
            value={values.earthWeight}
            onChange={(event) => setValues((current) => ({ ...current, earthWeight: event.target.value }))}
            className="mt-2"
          />
        </div>
        <div className="mt-4">
          <DataTable
            headings={["World", "Relative gravity", "Your weight"]}
            rows={Object.entries(PLANET_GRAVITY).map(([planet, factor]) => [
              planet,
              `${factor}g`,
              `${formatNumber(earthWeight * factor, 1)} lb`,
            ])}
          />
        </div>
      </ToolCard>
    )
  }

  const telescopeFocal = toNumber(values.telescopeFocal)
  const eyepieceFocal = toNumber(values.eyepieceFocal)
  const apparentField = toNumber(values.apparentField)
  const aperture = toNumber(values.aperture)
  const magnification = eyepieceFocal > 0 ? telescopeFocal / eyepieceFocal : 0
  const trueField = magnification > 0 ? apparentField / magnification : 0
  const exitPupil = magnification > 0 ? aperture / magnification : 0

  if (toolId === "telescope-field-of-view-calculator") {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Scope and Eyepiece">
          <ToolFields
            fields={[
              { key: "aperture", label: "Aperture (mm)", step: "1" },
              { key: "telescopeFocal", label: "Telescope focal length (mm)", step: "1" },
              { key: "eyepieceFocal", label: "Eyepiece focal length (mm)", step: "1" },
              { key: "apparentField", label: "Apparent field of view (°)", step: "0.1" },
            ]}
            values={values}
            onChange={(key, nextValue) => setValues((current) => ({ ...current, [key]: nextValue }))}
          />
        </ToolCard>
        <ToolCard title="View Estimate">
          <ResultGrid
            items={[
              { label: "Magnification", value: `${formatNumber(magnification, 1)}x` },
              { label: "True field of view", value: `${formatNumber(trueField, 2)}°` },
              { label: "Exit pupil", value: `${formatNumber(exitPupil, 2)} mm` },
            ]}
          />
        </ToolCard>
      </div>
    )
  }

  if (toolId === "escape-velocity-calculator") {
    const massEarths = toNumber(values.massEarths)
    const radiusEarths = toNumber(values.radiusEarths)
    const earthEscapeVelocity = 11.186
    const escapeVelocity = radiusEarths > 0 ? earthEscapeVelocity * Math.sqrt(massEarths / radiusEarths) : 0

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Planet Inputs">
          <ToolFields
            fields={[
              { key: "massEarths", label: "Mass (Earth masses)", step: "0.01" },
              { key: "radiusEarths", label: "Radius (Earth radii)", step: "0.01" },
            ]}
            values={values}
            onChange={(key, nextValue) => setValues((current) => ({ ...current, [key]: nextValue }))}
          />
        </ToolCard>
        <ToolCard title="Escape Velocity">
          <ResultGrid items={[{ label: "Escape velocity", value: `${formatNumber(escapeVelocity, 2)} km/s` }]} />
        </ToolCard>
      </div>
    )
  }

  const magnificationA = toNumber(values.eyepieceA) > 0 ? telescopeFocal / toNumber(values.eyepieceA) : 0
  const magnificationB = toNumber(values.eyepieceB) > 0 ? telescopeFocal / toNumber(values.eyepieceB) : 0

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Comparison Setup">
        <ToolFields
          fields={[
            { key: "telescopeFocal", label: "Telescope focal length (mm)", step: "1" },
            { key: "eyepieceA", label: "Eyepiece A (mm)", step: "1" },
            { key: "eyepieceB", label: "Eyepiece B (mm)", step: "1" },
            { key: "apparentField", label: "Apparent field of view (°)", step: "0.1" },
          ]}
          values={values}
          onChange={(key, nextValue) => setValues((current) => ({ ...current, [key]: nextValue }))}
        />
      </ToolCard>
      <ToolCard title="Comparison">
        <DataTable
          headings={["Eyepiece", "Magnification", "Approx. TFOV"]}
          rows={[
            ["Eyepiece A", `${formatNumber(magnificationA, 1)}x`, `${formatNumber(apparentField / Math.max(magnificationA, 1), 2)}°`],
            ["Eyepiece B", `${formatNumber(magnificationB, 1)}x`, `${formatNumber(apparentField / Math.max(magnificationB, 1), 2)}°`],
          ]}
        />
      </ToolCard>
    </div>
  )
}

function SeoTools({ toolId }: { toolId: string }) {
  const [values, setValues] = useState({
    baseUrl: "https://www.thefreeaitools.com/tools/generate-chart",
    source: "newsletter",
    medium: "email",
    campaign: "q2-launch",
    term: "developer tools",
    content: "hero-button",
    focusKeyword: "free chart generator",
    pageHeading: "Generate charts online for free",
    siteName: "The Free AI Tools",
    canonicalUrl: "https://www.thefreeaitools.com/tools/generate-chart",
    redirectChains:
      "https://example.com/old-blog -> https://example.com/blog -> https://example.com/blog/thefreeaitools\nhttps://example.com/pricing -> https://example.com/plans",
    title: "Generate Charts Online for Free | The Free AI Tools",
    description:
      "Build charts in the browser, customize datasets, and export polished visuals without uploading files.",
    previewUrl: "thefreeaitools.com/tools/generate-chart",
    metaDescriptions:
      "Free online chart maker for browser-based workflows and fast exports.\nThe Free AI Tools helps teams create charts without signups.\nUse a privacy-first chart generator with local processing and instant downloads.",
    slugSource: "Free Chart Generator for Marketing Teams",
    sitemapRows:
      "https://thefreeaitools.com/ | homepage | 2026-04-13\nhttps://thefreeaitools.com/tools/generate-chart | tool | 2026-04-13\nhttps://thefreeaitools.com/categories/seo | category | 2026-04-12\nhttps://thefreeaitools.com/about | info | 2026-03-29",
  })
  const [linkGraphInput, setLinkGraphInput] = useState(SAMPLE_LINK_GRAPH)
  const [schemaValues, setSchemaValues] = useState({
    schemaType: "FAQPage",
    name: "The Free AI Tools",
    headline: "The Free AI Tools frequently asked questions",
    description:
      "The Free AI Tools is a privacy-first collection of browser-based tools for developers, marketers, and designers.",
    url: "https://thefreeaitools.com/",
    image: "https://thefreeaitools.com/opengraph-image",
    author: "The Free AI Tools Team",
    publisher: "The Free AI Tools",
    brand: "The Free AI Tools",
    price: "29",
    currency: "USD",
    address: "123 Toolkit Lane, San Francisco, CA",
    telephone: "+1-555-0100",
    priceRange: "$$",
    datePublished: "2026-04-02",
    dateModified: "2026-04-13",
    faqPairs:
      "What is The Free AI Tools? | The Free AI Tools is a privacy-first website with browser-based tools.\nHow many tools are included? | The Free AI Tools includes 200 tools across developer, SEO, image, data, and productivity workflows.",
  })

  const builtUrl = useMemo(() => {
    try {
      const url = new URL(values.baseUrl)
      const params = [
        ["utm_source", values.source],
        ["utm_medium", values.medium],
        ["utm_campaign", values.campaign],
        ["utm_term", values.term],
        ["utm_content", values.content],
      ]

      for (const [key, value] of params) {
        if (value.trim()) {
          url.searchParams.set(key, value.trim())
        }
      }

      return url.toString()
    } catch {
      return ""
    }
  }, [values.baseUrl, values.campaign, values.content, values.medium, values.source, values.term])

  const graph = useMemo(() => parseLinkGraphInput(linkGraphInput), [linkGraphInput])
  const visibleNodes = useMemo(() => createGraphLayout(graph.nodes.slice(0, 12)), [graph.nodes])
  const visibleMap = useMemo(() => new Map(visibleNodes.map((node) => [node.url, node])), [visibleNodes])
  const orphanCount = graph.nodes.filter((node) => node.incoming === 0).length
  const hubNode = graph.nodes[0] ?? null
  const connectedCoverage = graph.nodes.length > 0 ? ((graph.nodes.length - orphanCount) / graph.nodes.length) * 100 : 0
  const suggestionSources = graph.nodes.filter((node) => node.outgoing > 0).slice(0, 4)
  const linkSuggestions = graph.nodes
    .filter((node) => node.incoming === 0)
    .slice(0, 5)
    .map((node) => [
      node.label,
      suggestionSources
        .filter((source) => source.url !== node.url)
        .slice(0, 3)
        .map((source) => source.label)
        .join(", ") || "Homepage / category pages",
      "Add contextual links from strong hub pages.",
    ])

  const faqEntities = useMemo(
    () =>
      schemaValues.faqPairs
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [question, answer] = line.split(/\s*\|\s*/)
          return {
            "@type": "Question",
            name: question?.trim() ?? "",
            acceptedAnswer: {
              "@type": "Answer",
              text: answer?.trim() ?? "",
            },
          }
        })
        .filter((entry) => entry.name && entry.acceptedAnswer.text),
    [schemaValues.faqPairs]
  )

  const schemaMarkup = useMemo(() => {
    const schemaId =
      isValidHttpUrl(schemaValues.url) && schemaValues.schemaType
        ? `${schemaValues.url.replace(/\/$/, "")}#${toSlug(schemaValues.schemaType)}`
        : undefined
    const base = {
      "@context": "https://schema.org",
      "@type": schemaValues.schemaType,
      ...(schemaId ? { "@id": schemaId } : {}),
    } as Record<string, unknown>

    if (schemaValues.schemaType === "Organization") {
      return {
        ...base,
        name: schemaValues.name,
        url: schemaValues.url,
        description: schemaValues.description,
        logo: schemaValues.image,
      }
    }

    if (schemaValues.schemaType === "Article") {
      return {
        ...base,
        headline: schemaValues.headline,
        description: schemaValues.description,
        image: schemaValues.image,
        mainEntityOfPage: schemaValues.url,
        datePublished: schemaValues.datePublished,
        dateModified: schemaValues.dateModified,
        author: { "@type": "Person", name: schemaValues.author },
        publisher: { "@type": "Organization", name: schemaValues.publisher },
      }
    }

    if (schemaValues.schemaType === "Product") {
      return {
        ...base,
        name: schemaValues.name,
        description: schemaValues.description,
        image: schemaValues.image,
        brand: { "@type": "Brand", name: schemaValues.brand },
        offers: {
          "@type": "Offer",
          price: schemaValues.price,
          priceCurrency: schemaValues.currency,
          availability: "https://schema.org/InStock",
          url: schemaValues.url,
        },
      }
    }

    if (schemaValues.schemaType === "LocalBusiness") {
      return {
        ...base,
        name: schemaValues.name,
        description: schemaValues.description,
        image: schemaValues.image,
        url: schemaValues.url,
        telephone: schemaValues.telephone,
        priceRange: schemaValues.priceRange,
        address: {
          "@type": "PostalAddress",
          streetAddress: schemaValues.address,
        },
      }
    }

    if (schemaValues.schemaType === "FAQPage") {
      return {
        ...base,
        mainEntity: faqEntities,
      }
    }

    if (schemaValues.schemaType === "WebSite") {
      return {
        ...base,
        name: schemaValues.name,
        url: schemaValues.url,
        description: schemaValues.description,
        potentialAction: isValidHttpUrl(schemaValues.url)
          ? {
              "@type": "SearchAction",
              target: `${schemaValues.url.replace(/\/$/, "")}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            }
          : undefined,
      }
    }

    return {
      ...base,
      name: schemaValues.name,
      url: schemaValues.url,
      description: schemaValues.description,
    }
  }, [faqEntities, schemaValues])

  const schemaScript = useMemo(
    () => `<script type="application/ld+json">\n${JSON.stringify(schemaMarkup, null, 2)}\n</script>`,
    [schemaMarkup]
  )

  const schemaWarnings = useMemo(
    () =>
      [
        !schemaValues.schemaType ? "Schema type is required." : "",
        !isValidHttpUrl(schemaValues.url) ? "Use a full canonical URL that starts with http or https." : "",
        schemaValues.image && !isValidHttpUrl(schemaValues.image) ? "Image URLs should be absolute." : "",
        schemaValues.schemaType !== "FAQPage" && schemaValues.schemaType !== "Article" && !schemaValues.name
          ? "Add a clear entity name for this schema."
          : "",
        schemaValues.schemaType === "Article" && !schemaValues.headline ? "Article schema needs a headline." : "",
        schemaValues.schemaType === "Article" && !schemaValues.author ? "Article schema should include an author." : "",
        schemaValues.schemaType === "Article" && !schemaValues.dateModified
          ? "Article schema should include a modified date."
          : "",
        schemaValues.schemaType === "Product" && !schemaValues.price ? "Product schema should include an offer price." : "",
        schemaValues.schemaType === "Product" && !schemaValues.currency
          ? "Product schema should include a currency code."
          : "",
        schemaValues.schemaType === "FAQPage" && faqEntities.length === 0 ? "Add at least one complete FAQ pair." : "",
        !schemaValues.description && schemaValues.schemaType !== "FAQPage"
          ? "Description helps search engines understand the entity."
          : "",
      ].filter(Boolean),
    [faqEntities.length, schemaValues]
  )

  if (toolId === "schema-markup-builder-validator") {
    return (
      <div className="grid gap-6 xl:grid-cols-3">
        <ToolCard title="Schema Inputs">
          <div className="space-y-4">
            <div>
              <Label htmlFor="schema-type">Schema type</Label>
              <select
                id="schema-type"
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={schemaValues.schemaType}
                onChange={(event) => setSchemaValues((current) => ({ ...current, schemaType: event.target.value }))}
              >
                <option value="FAQPage">FAQPage</option>
                <option value="Article">Article</option>
                <option value="Organization">Organization</option>
                <option value="Product">Product</option>
                <option value="LocalBusiness">LocalBusiness</option>
                <option value="WebSite">WebSite</option>
              </select>
            </div>
            <ToolFields
              fields={[
                { key: "name", label: "Name", type: "text" },
                { key: "headline", label: "Headline", type: "text" },
                { key: "url", label: "Canonical URL", type: "text" },
                { key: "image", label: "Image URL", type: "text" },
                { key: "author", label: "Author", type: "text" },
                { key: "publisher", label: "Publisher", type: "text" },
                { key: "brand", label: "Brand", type: "text" },
                { key: "price", label: "Price", type: "text" },
                { key: "currency", label: "Currency", type: "text" },
                { key: "telephone", label: "Telephone", type: "text" },
                { key: "priceRange", label: "Price range", type: "text" },
                { key: "datePublished", label: "Published date", type: "date" },
                { key: "dateModified", label: "Modified date", type: "date" },
              ]}
              values={schemaValues}
              onChange={(key, nextValue) => setSchemaValues((current) => ({ ...current, [key]: nextValue }))}
            />
            <div>
              <Label htmlFor="schema-description">Description</Label>
              <Textarea
                id="schema-description"
                value={schemaValues.description}
                onChange={(event) => setSchemaValues((current) => ({ ...current, description: event.target.value }))}
                className="mt-2 min-h-[120px]"
              />
            </div>
            <div>
              <Label htmlFor="schema-address">Address</Label>
              <Input
                id="schema-address"
                value={schemaValues.address}
                onChange={(event) => setSchemaValues((current) => ({ ...current, address: event.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="schema-faq">FAQ pairs: `question | answer`</Label>
              <Textarea
                id="schema-faq"
                value={schemaValues.faqPairs}
                onChange={(event) => setSchemaValues((current) => ({ ...current, faqPairs: event.target.value }))}
                className="mt-2 min-h-[140px]"
              />
            </div>
          </div>
        </ToolCard>

        <ToolCard title="Validation Checklist">
          <ResultGrid
            items={[
              { label: "Schema type", value: schemaValues.schemaType },
              { label: "Warnings", value: String(schemaWarnings.length) },
              { label: "JSON-LD keys", value: String(Object.keys(schemaMarkup).length) },
            ]}
          />
          <Alert className="mt-4">
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>
              {schemaValues.schemaType === "FAQPage"
                ? FAQ_RICH_RESULT_NOTE
                : "Structured data works best when the markup matches the visible page content and main intent."}
            </AlertDescription>
          </Alert>
          {schemaWarnings.length > 0 ? (
            <div className="mt-4">
              <DataTable headings={["Issue"]} rows={schemaWarnings.map((warning) => [warning])} />
            </div>
          ) : (
            <Alert className="mt-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                The current JSON-LD includes the key fields this schema type usually needs.
              </AlertDescription>
            </Alert>
          )}
        </ToolCard>

        <ToolCard title="Generated JSON-LD">
          <Textarea readOnly value={JSON.stringify(schemaMarkup, null, 2)} className="min-h-[260px]" />
          <Textarea readOnly value={schemaScript} className="mt-4 min-h-[180px]" />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => copyText(JSON.stringify(schemaMarkup, null, 2))}>
              <Copy className="mr-2 h-4 w-4" />
              Copy JSON-LD
            </Button>
            <Button variant="outline" onClick={() => copyText(schemaScript)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy script tag
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                downloadText(
                  `${toSlug(schemaValues.schemaType || "schema") || "schema"}-markup.json`,
                  JSON.stringify(schemaMarkup, null, 2),
                  "application/ld+json;charset=utf-8"
                )
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Download file
            </Button>
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "internal-link-graph-visualizer") {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Link Export Input">
            <Textarea
              value={linkGraphInput}
              onChange={(event) => setLinkGraphInput(event.target.value)}
              className="min-h-[280px]"
            />
          </ToolCard>

          <ToolCard title="Graph Summary">
            <ResultGrid
              items={[
                { label: "Pages", value: String(graph.nodes.length) },
                { label: "Links", value: String(graph.edges.length) },
                { label: "Connected coverage", value: formatPercent(connectedCoverage, 0) },
                { label: "Largest hub", value: hubNode ? hubNode.label : "n/a" },
              ]}
            />
            <div className="mt-4">
              <DataTable
                headings={["Page", "Inbound", "Outbound", "Status"]}
                rows={graph.nodes.slice(0, 10).map((node) => [
                  node.label,
                  node.incoming,
                  node.outgoing,
                  node.incoming === 0 ? "Needs links" : node.outgoing === 0 ? "Leaf page" : "Connected",
                ])}
              />
            </div>
            {orphanCount > 0 ? (
              <Alert className="mt-4">
                <TriangleAlert className="h-4 w-4" />
                <AlertDescription>
                  {orphanCount} page{orphanCount === 1 ? "" : "s"} have no inbound links in this export. Give them contextual links from hub, category, or comparison pages.
                </AlertDescription>
              </Alert>
            ) : null}
          </ToolCard>
        </div>

        {linkSuggestions.length > 0 ? (
          <ToolCard title="Link Opportunities">
            <DataTable
              headings={["Target page", "Suggested sources", "Why it helps"]}
              rows={linkSuggestions}
            />
          </ToolCard>
        ) : null}

        {visibleNodes.length > 0 ? (
          <ToolCard title="Graph View">
            <svg viewBox="0 0 760 420" className="w-full rounded-2xl border bg-muted/20 p-4">
              {graph.edges
                .filter((edge) => visibleMap.has(edge.source) && visibleMap.has(edge.target))
                .map((edge) => {
                  const source = visibleMap.get(edge.source)
                  const target = visibleMap.get(edge.target)

                  if (!source || !target) {
                    return null
                  }

                  return (
                    <line
                      key={`${edge.source}-${edge.target}`}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke="currentColor"
                      strokeOpacity="0.18"
                      strokeWidth="1.5"
                    />
                  )
                })}
              {visibleNodes.map((node) => (
                <g key={node.url}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.incoming === 0 ? 26 : 22}
                    fill={node.incoming === 0 ? "#f97316" : node.outgoing >= 2 ? "#0ea5e9" : "#22c55e"}
                    fillOpacity="0.9"
                  />
                  <text
                    x={node.x}
                    y={node.y - 34}
                    textAnchor="middle"
                    className="fill-foreground text-[11px] font-medium"
                  >
                    {node.label.slice(0, 26)}
                  </text>
                </g>
              ))}
            </svg>
          </ToolCard>
        ) : null}
      </div>
    )
  }

  if (toolId === "utm-builder-validator") {
    const warnings = [
      values.source !== values.source.toLowerCase() ? "Use lowercase UTM values for cleaner analytics." : "",
      /\s/.test(values.campaign) ? "Prefer hyphens instead of spaces in campaign names." : "",
      !values.medium ? "UTM medium is required." : "",
      !isValidHttpUrl(values.baseUrl) ? "Base URL should be a complete public URL." : "",
    ].filter(Boolean)

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Campaign Inputs">
          <ToolFields
            fields={[
              { key: "baseUrl", label: "Base URL", type: "text" },
              { key: "source", label: "Source", type: "text" },
              { key: "medium", label: "Medium", type: "text" },
              { key: "campaign", label: "Campaign", type: "text" },
              { key: "term", label: "Term", type: "text" },
              { key: "content", label: "Content", type: "text" },
            ]}
            values={values}
            onChange={(key, nextValue) => setValues((current) => ({ ...current, [key]: nextValue }))}
          />
        </ToolCard>
        <ToolCard title="Validated URL">
          <Textarea readOnly value={builtUrl} className="min-h-[180px]" />
          <ResultGrid
            items={[
              { label: "Parameters", value: String(Array.from(new URLSearchParams(builtUrl.split("?")[1] ?? "").keys()).length) },
              { label: "Status", value: warnings.length === 0 ? "Looks clean" : "Review warnings" },
            ]}
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => copyText(builtUrl)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
          </div>
          {warnings.length > 0 ? (
            <Alert className="mt-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription>{warnings.join(" ")}</AlertDescription>
            </Alert>
          ) : null}
        </ToolCard>
      </div>
    )
  }

  if (toolId === "redirect-chain-mapper") {
    const chains = values.redirectChains
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(/\s*->\s*/))

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Redirect Hops">
          <Textarea
            value={values.redirectChains}
            onChange={(event) => setValues((current) => ({ ...current, redirectChains: event.target.value }))}
            className="min-h-[240px]"
          />
        </ToolCard>
        <ToolCard title="Mapped Chains">
          <ResultGrid
            items={[
              { label: "Chains", value: String(chains.length) },
              { label: "Longest chain", value: String(Math.max(0, ...chains.map((chain) => chain.length - 1))) },
              { label: "Loops detected", value: String(chains.filter((chain) => new Set(chain).size !== chain.length).length) },
            ]}
          />
          <div className="mt-4">
            <DataTable
              headings={["Start URL", "Hop count", "Final URL", "Priority"]}
              rows={chains.map((chain) => [
                chain[0],
                chain.length - 1,
                chain[chain.length - 1],
                chain.length > 2 ? "Shorten" : "Okay",
              ])}
            />
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "serp-snippet-preview") {
    const normalizedTitle = normalizeWhitespace(values.title)
    const normalizedDescription = normalizeWhitespace(values.description)
    const titleLength = normalizedTitle.length
    const descriptionLength = normalizedDescription.length
    const titleWidth = estimateSnippetPixels(normalizedTitle)
    const titleKeywordCoverage = countKeywordCoverage(values.focusKeyword, normalizedTitle)
    const descriptionKeywordCoverage = countKeywordCoverage(values.focusKeyword, normalizedDescription)
    const headingAlignment = countKeywordCoverage(values.pageHeading, normalizedTitle)
    const normalizedSiteName = normalizeWhitespace(values.siteName)
    const metaTagBundle = `<title>${escapeXml(normalizedTitle)}</title>\n<meta name="description" content="${escapeXml(normalizedDescription)}" />\n<link rel="canonical" href="${escapeXml(values.canonicalUrl)}" />\n<meta property="og:site_name" content="${escapeXml(normalizedSiteName)}" />`
    const serpChecks = [
      [
        "Title clarity",
        titleLength >= 45 && titleLength <= 65 ? "Strong" : "Adjust",
        "Keep titles descriptive, specific, and compact enough that search engines are less likely to rewrite them.",
      ],
      [
        "Keyword alignment",
        titleKeywordCoverage >= 50 ? "Strong" : "Needs work",
        `Title covers ${formatPercent(titleKeywordCoverage, 0)} of the focus keyword terms.`,
      ],
      [
        "Heading alignment",
        headingAlignment >= 50 ? "Aligned" : "Review",
        "Your H1 and title tag should reinforce the same page intent.",
      ],
      [
        "Brand mention",
        normalizedSiteName && normalizedTitle.includes(normalizedSiteName) ? "Included" : "Optional",
        "Branding can help recognition, but keep it secondary to the page’s intent when space is tight.",
      ],
      [
        "Description intent",
        hasCallToAction(normalizedDescription) ? "Actionable" : "Could be stronger",
        "Descriptions don’t directly rank pages, but they can improve click-through when they explain value clearly.",
      ],
      [
        "Spam risk",
        isLikelyKeywordStuffed(`${normalizedTitle} ${normalizedDescription}`) ? "Too repetitive" : "Natural",
        "Avoid repeating the same phrase unnaturally across the title and description.",
      ],
    ]

    return (
      <div className="grid gap-6 xl:grid-cols-3">
        <ToolCard title="SERP Content">
          <div className="space-y-4">
            <div>
              <Label htmlFor="serp-keyword">Focus keyword</Label>
              <Input
                id="serp-keyword"
                value={values.focusKeyword}
                onChange={(event) => setValues((current) => ({ ...current, focusKeyword: event.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="serp-heading">Visible H1</Label>
              <Input
                id="serp-heading"
                value={values.pageHeading}
                onChange={(event) => setValues((current) => ({ ...current, pageHeading: event.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="serp-site-name">Site name</Label>
              <Input
                id="serp-site-name"
                value={values.siteName}
                onChange={(event) => setValues((current) => ({ ...current, siteName: event.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="serp-title">Title tag</Label>
              <Input
                id="serp-title"
                value={values.title}
                onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="serp-url">Display URL</Label>
              <Input
                id="serp-url"
                value={values.previewUrl}
                onChange={(event) => setValues((current) => ({ ...current, previewUrl: event.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="serp-canonical">Canonical URL</Label>
              <Input
                id="serp-canonical"
                value={values.canonicalUrl}
                onChange={(event) => setValues((current) => ({ ...current, canonicalUrl: event.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="serp-description">Meta description</Label>
              <Textarea
                id="serp-description"
                value={values.description}
                onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
                className="mt-2 min-h-[180px]"
              />
            </div>
          </div>
        </ToolCard>

        <ToolCard title="Search Preview">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-[22px] leading-7 text-[#1a0dab]">{truncatePreview(normalizedTitle, 62)}</p>
            <p className="mt-1 text-sm text-[#0b8043]">{normalizeWhitespace(values.previewUrl)}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {truncatePreview(normalizedDescription, 158)}
            </p>
          </div>
          <div className="mt-4">
            <ResultGrid
              items={[
                { label: "Title length", value: String(titleLength), hint: "Aim roughly for 45-65 characters." },
                { label: "Description length", value: String(descriptionLength), hint: "Aim roughly for 120-160 characters." },
                { label: "Title width", value: `${formatNumber(titleWidth, 0)} px`, hint: "Very wide titles are more likely to be rewritten." },
                { label: "Keyword coverage", value: formatPercent(titleKeywordCoverage, 0) },
                { label: "Description coverage", value: formatPercent(descriptionKeywordCoverage, 0) },
              ]}
            />
          </div>
          <Alert className="mt-4">
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>
              No tool can guarantee a #1 ranking. The goal here is a clearer result that better matches search intent and earns clicks.
            </AlertDescription>
          </Alert>
        </ToolCard>

        <ToolCard title="Optimization Checklist">
          <DataTable headings={["Check", "Status", "Notes"]} rows={serpChecks} />
          <Textarea readOnly value={metaTagBundle} className="mt-4 min-h-[180px]" />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => copyText(metaTagBundle)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy meta tags
            </Button>
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "meta-description-length-checker") {
    const descriptions = values.metaDescriptions
      .split(/\r?\n/)
      .map((line) => normalizeWhitespace(line))
      .filter(Boolean)
    const duplicates = new Map<string, number>()
    descriptions.forEach((description) => {
      duplicates.set(description.toLowerCase(), (duplicates.get(description.toLowerCase()) ?? 0) + 1)
    })

    const rows = descriptions.map((description) => {
      const length = description.length
      const coverage = countKeywordCoverage(values.focusKeyword, description)
      const duplicate = (duplicates.get(description.toLowerCase()) ?? 0) > 1
      const status =
        length < 120
          ? "Too short"
          : length > 160
            ? "Too long"
            : duplicate
              ? "Duplicate"
              : "Healthy"

      return [
        description,
        length,
        `${formatPercent(coverage, 0)}`,
        hasCallToAction(description) ? "Yes" : "No",
        status,
      ]
    })

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Descriptions">
          <Label htmlFor="meta-keyword">Focus keyword</Label>
          <Input
            id="meta-keyword"
            value={values.focusKeyword}
            onChange={(event) => setValues((current) => ({ ...current, focusKeyword: event.target.value }))}
            className="mt-2"
          />
          <Textarea
            value={values.metaDescriptions}
            onChange={(event) => setValues((current) => ({ ...current, metaDescriptions: event.target.value }))}
            className="mt-4 min-h-[260px]"
          />
        </ToolCard>
        <ToolCard title="Length Review">
          <ResultGrid
            items={[
              { label: "Descriptions", value: String(descriptions.length) },
              { label: "Healthy range", value: String(rows.filter((row) => row[4] === "Healthy").length) },
              { label: "Duplicates", value: String(rows.filter((row) => row[4] === "Duplicate").length) },
            ]}
          />
          <div className="mt-4">
            <DataTable
              headings={["Description", "Length", "Keyword", "CTA", "Status"]}
              rows={rows}
            />
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "slug-optimizer") {
    const slug = toSlug(values.slugSource)
    const sourceTerms = Array.from(
      new Set(
        tokenizeSearchTerms(values.slugSource).filter((term) => term.length > 2 && !SEO_STOP_WORDS.has(term))
      )
    )
    const slugTerms = slug.split("-").filter(Boolean)
    const removedTerms = sourceTerms.filter((term) => !slugTerms.includes(term))
    const slugWarnings = [
      slug.length > 60 ? "Shorter slugs are usually easier to scan and share." : "",
      slugTerms.length > 6 ? "Consider trimming filler words so the path stays focused." : "",
      /^\d/.test(slug) ? "Avoid starting the slug with a number unless it is semantically important." : "",
    ].filter(Boolean)

    return (
      <div className="grid gap-6 xl:grid-cols-3">
        <ToolCard title="Page Topic">
          <div className="space-y-4">
            <div>
              <Label htmlFor="slug-source">Page title</Label>
              <Input
                id="slug-source"
                value={values.slugSource}
                onChange={(event) => setValues((current) => ({ ...current, slugSource: event.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="slug-keyword">Focus keyword</Label>
              <Input
                id="slug-keyword"
                value={values.focusKeyword}
                onChange={(event) => setValues((current) => ({ ...current, focusKeyword: event.target.value }))}
                className="mt-2"
              />
            </div>
          </div>
        </ToolCard>

        <ToolCard title="Optimized Slug">
          <Textarea readOnly value={slug} className="min-h-[120px]" />
          <Textarea readOnly value={`/tools/${slug}`} className="mt-4 min-h-[96px]" />
          <ResultGrid
            items={[
              { label: "Slug length", value: String(slug.length) },
              { label: "Keyword coverage", value: formatPercent(countKeywordCoverage(values.focusKeyword, slug), 0) },
              { label: "Words kept", value: String(slugTerms.length) },
            ]}
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => copyText(slug)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy slug
            </Button>
          </div>
        </ToolCard>

        <ToolCard title="Slug Notes">
          <DataTable
            headings={["Signal", "Value"]}
            rows={[
              ["Kept terms", slugTerms.join(", ") || "None"],
              ["Dropped filler terms", removedTerms.join(", ") || "None"],
            ]}
          />
          {slugWarnings.length > 0 ? (
            <Alert className="mt-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription>{slugWarnings.join(" ")}</AlertDescription>
            </Alert>
          ) : (
            <Alert className="mt-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                The slug is short, lowercase, hyphenated, and easy to reuse in navigation or canonical tags.
              </AlertDescription>
            </Alert>
          )}
        </ToolCard>
      </div>
    )
  }

  const todayIso = new Date().toISOString().slice(0, 10)
  const sitemapRows = values.sitemapRows
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, type = "page", lastmod = todayIso] = line.split(/\s*\|\s*/)
      const rules: Record<string, { priority: string; changefreq: string }> = {
        homepage: { priority: "1.0", changefreq: "weekly" },
        tool: { priority: "0.8", changefreq: "weekly" },
        category: { priority: "0.8", changefreq: "weekly" },
        info: { priority: "0.5", changefreq: "monthly" },
        page: { priority: "0.6", changefreq: "monthly" },
      }
      const rule = rules[type] ?? rules.page
      return {
        url,
        type,
        lastmod,
        priority: rule.priority,
        changefreq: rule.changefreq,
        valid: isValidHttpUrl(url),
      }
    })

  const validSitemapRows = sitemapRows.filter((row) => row.valid)
  const xmlOutput = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${validSitemapRows
    .map(
      (row) =>
        `  <url>\n    <loc>${escapeXml(row.url)}</loc>\n    <lastmod>${escapeXml(row.lastmod)}</lastmod>\n    <changefreq>${row.changefreq}</changefreq>\n    <priority>${row.priority}</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>`

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <ToolCard title="URLs and Page Types">
        <p className="text-sm text-muted-foreground">Use `url | type | YYYY-MM-DD` on each line.</p>
        <Textarea
          value={values.sitemapRows}
          onChange={(event) => setValues((current) => ({ ...current, sitemapRows: event.target.value }))}
          className="mt-4 min-h-[240px]"
        />
      </ToolCard>

      <ToolCard title="Priority Plan">
        <ResultGrid
          items={[
            { label: "URLs", value: String(sitemapRows.length) },
            { label: "Valid URLs", value: String(validSitemapRows.length) },
            { label: "Invalid URLs", value: String(sitemapRows.length - validSitemapRows.length) },
          ]}
        />
        <div className="mt-4">
          <DataTable
            headings={["URL", "Type", "Priority", "Change frequency", "Lastmod", "Status"]}
            rows={sitemapRows.map((row) => [
              row.url,
              row.type,
              row.priority,
              row.changefreq,
              row.lastmod,
              row.valid ? "Ready" : "Invalid URL",
            ])}
          />
        </div>
      </ToolCard>

      <ToolCard title="Generated Sitemap XML">
        <Textarea readOnly value={xmlOutput} className="min-h-[320px]" />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => copyText(xmlOutput)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy sitemap
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadText("sitemap.xml", xmlOutput, "application/xml;charset=utf-8")}
          >
            <Download className="mr-2 h-4 w-4" />
            Download XML
          </Button>
        </div>
        <Alert className="mt-4">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>
            Sitemaps are discovery hints, not ranking guarantees. Pair this with strong internal links and fast page updates.
          </AlertDescription>
        </Alert>
      </ToolCard>
    </div>
  )
}

function DeveloperTools({ toolId }: { toolId: string }) {
  const [queryInput, setQueryInput] = useState("https://thefreeaitools.com/search?q=chart&category=seo")
  const [literalText, setLiteralText] = useState("price (usd) [q2]+")
  const [jsonInput, setJsonInput] = useState('{"site":{"name":"The Free AI Tools","tools":[{"id":"generate-chart","category":"data"},{"id":"slug-optimizer","category":"seo"}]}}')
  const [searchTerm, setSearchTerm] = useState("seo")
  const [schemaSource, setSchemaSource] = useState(
    '{\n  "tool": {\n    "id": "generate-chart",\n    "category": "data",\n    "keywords": ["chart", "csv", "visualization"],\n    "featured": true\n  },\n  "updatedAt": "2026-04-02"\n}'
  )
  const [schemaCandidate, setSchemaCandidate] = useState(
    '{\n  "tool": {\n    "id": "slug-optimizer",\n    "category": "seo",\n    "keywords": ["seo", "slug"],\n    "featured": false\n  },\n  "updatedAt": "2026-04-02"\n}'
  )

  if (toolId === "json-schema-builder-validator") {
    let parsedSource: unknown = null
    let parsedCandidate: unknown = null
    let sourceError = ""
    let candidateError = ""

    try {
      parsedSource = JSON.parse(schemaSource)
    } catch (error) {
      sourceError = error instanceof Error ? error.message : "Sample JSON is invalid."
    }

    try {
      parsedCandidate = JSON.parse(schemaCandidate)
    } catch (error) {
      candidateError = error instanceof Error ? error.message : "Validation JSON is invalid."
    }

    const generatedSchema = parsedSource ? inferJsonSchema(parsedSource) : null
    const validationErrors =
      generatedSchema && !candidateError ? validateJsonAgainstSchema(parsedCandidate, generatedSchema) : []
    const schemaOutput = generatedSchema ? JSON.stringify(generatedSchema, null, 2) : ""
    const rootProperties =
      generatedSchema?.type === "object" && generatedSchema.properties
        ? Object.keys(generatedSchema.properties).length
        : 0

    return (
      <div className="grid gap-6 xl:grid-cols-3">
        <ToolCard title="Sample JSON">
          <Textarea
            value={schemaSource}
            onChange={(event) => setSchemaSource(event.target.value)}
            className="min-h-[280px]"
          />
          {sourceError ? (
            <Alert className="mt-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription>{sourceError}</AlertDescription>
            </Alert>
          ) : null}
        </ToolCard>

        <ToolCard title="Generated Schema">
          <Textarea readOnly value={schemaOutput} className="min-h-[280px]" />
          <div className="mt-4">
            <ResultGrid
              items={[
                { label: "Root type", value: generatedSchema ? schemaTypeList(generatedSchema).join(", ") || "Any" : "Invalid" },
                { label: "Root properties", value: String(rootProperties) },
                { label: "Required fields", value: String(generatedSchema?.required?.length ?? 0) },
              ]}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => copyText(schemaOutput)} disabled={!schemaOutput}>
              <Copy className="mr-2 h-4 w-4" />
              Copy schema
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadText("generated-schema.json", schemaOutput, "application/json;charset=utf-8")}
              disabled={!schemaOutput}
            >
              <Download className="mr-2 h-4 w-4" />
              Download schema
            </Button>
          </div>
        </ToolCard>

        <ToolCard title="Validation Example">
          <Textarea
            value={schemaCandidate}
            onChange={(event) => setSchemaCandidate(event.target.value)}
            className="min-h-[280px]"
          />
          {candidateError ? (
            <Alert className="mt-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertDescription>{candidateError}</AlertDescription>
            </Alert>
          ) : null}
          {!candidateError && generatedSchema ? (
            <div className="mt-4 space-y-3">
              <ResultGrid
                items={[
                  { label: "Validation status", value: validationErrors.length === 0 ? "Schema match" : "Issues found" },
                  { label: "Errors", value: String(validationErrors.length) },
                  { label: "Array items checked", value: String(Array.isArray(parsedCandidate) ? parsedCandidate.length : 0) },
                ]}
              />
              {validationErrors.length > 0 ? (
                <DataTable headings={["Issue"]} rows={validationErrors.map((error) => [error])} />
              ) : (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    The validation example matches the generated schema shape.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : null}
        </ToolCard>
      </div>
    )
  }

  if (toolId === "query-string-parser") {
    let rows: Array<Array<string | number>> = []
    let normalizedUrl = ""
    try {
      const parsed = queryInput.startsWith("http") ? new URL(queryInput) : new URL(`https://example.com/?${queryInput}`)
      normalizedUrl = parsed.toString()
      rows = Array.from(parsed.searchParams.entries()).map(([key, value]) => [key, value])
    } catch {
      rows = [["Error", "Enter a valid URL or query string."]]
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="URL or Query String">
          <Input value={queryInput} onChange={(event) => setQueryInput(event.target.value)} />
        </ToolCard>
        <ToolCard title="Parsed Parameters">
          <Textarea readOnly value={normalizedUrl} className="min-h-[100px]" />
          <div className="mt-4">
            <DataTable headings={["Key", "Value"]} rows={rows} />
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "regex-escape-helper") {
    const escaped = literalText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Literal Text">
          <Textarea value={literalText} onChange={(event) => setLiteralText(event.target.value)} className="min-h-[180px]" />
        </ToolCard>
        <ToolCard title="Escaped Regex">
          <Textarea readOnly value={escaped} className="min-h-[180px]" />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => copyText(escaped)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy escaped pattern
            </Button>
          </div>
        </ToolCard>
      </div>
    )
  }

  const parsed = (() => {
    try {
      return JSON.parse(jsonInput)
    } catch {
      return null
    }
  })()
  const matches = parsed ? searchJsonPaths(parsed, searchTerm) : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="JSON Input">
        <Textarea value={jsonInput} onChange={(event) => setJsonInput(event.target.value)} className="min-h-[240px]" />
        <div className="mt-4">
          <Label htmlFor="json-search-term">Search term</Label>
          <Input id="json-search-term" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="mt-2" />
        </div>
      </ToolCard>
      <ToolCard title="Matching JSON Paths">
        {parsed ? (
          <DataTable headings={["Path"]} rows={matches.map((match) => [match])} />
        ) : (
          <Alert>
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>Enter valid JSON to search nested paths.</AlertDescription>
          </Alert>
        )}
      </ToolCard>
    </div>
  )
}

function DataTools({ toolId }: { toolId: string }) {
  const [csvInput, setCsvInput] = useState("name,visits,active\nChart Builder,1240,true\nSlug Optimizer,820,true\nRobots Tester,215,false")
  const [sizeValues, setSizeValues] = useState({
    rows: "50000",
    avgBytesPerRow: "420",
    monthlyGrowth: "12",
    months: "12",
  })
  const [harInput, setHarInput] = useState(SAMPLE_HAR)
  const [harFileName, setHarFileName] = useState("sample.har")

  if (toolId === "har-file-viewer-api-timeline") {
    let harError = ""
    let entries: HarRequestSummary[] = []

    try {
      entries = parseHarEntries(harInput)
    } catch (error) {
      harError = error instanceof Error ? error.message : "Unable to parse HAR content."
    }

    const totalBytes = entries.reduce((total, entry) => total + entry.sizeBytes, 0)
    const slowestEntry = entries.reduce<HarRequestSummary | null>(
      (currentSlowest, entry) =>
        !currentSlowest || entry.totalMs > currentSlowest.totalMs ? entry : currentSlowest,
      null
    )
    const longestWindow = Math.max(1, ...entries.map((entry) => entry.startMs + entry.totalMs))
    const statusFailures = entries.filter((entry) => entry.status >= 400).length

    const handleHarUpload = async (file: File | null) => {
      if (!file || !withinFileLimit(file)) {
        return
      }

      try {
        const text = await readFileAsText(file)
        setHarInput(text)
        setHarFileName(file.name)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to read that HAR file.")
      }
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="HAR Source">
            <Input
              type="file"
              accept=".har,application/json"
              onChange={(event) => void handleHarUpload(event.target.files?.[0] ?? null)}
            />
            <p className="mt-3 text-sm text-muted-foreground">Loaded file: {harFileName}</p>
            <Textarea
              value={harInput}
              onChange={(event) => setHarInput(event.target.value)}
              className="mt-4 min-h-[260px]"
            />
          </ToolCard>

          <ToolCard title="Request Summary">
            {harError ? (
              <Alert>
                <TriangleAlert className="h-4 w-4" />
                <AlertDescription>{harError}</AlertDescription>
              </Alert>
            ) : (
              <>
                <ResultGrid
                  items={[
                    { label: "Requests", value: String(entries.length) },
                    { label: "Transferred", value: formatBytes(totalBytes) },
                    { label: "Failed status codes", value: String(statusFailures) },
                    { label: "Slowest request", value: slowestEntry ? `${formatNumber(slowestEntry.totalMs, 0)} ms` : "n/a" },
                  ]}
                />
                <div className="mt-4">
                  <DataTable
                    headings={["Method", "Request", "Status", "Time", "Size"]}
                    rows={entries
                      .slice()
                      .sort((first, second) => second.totalMs - first.totalMs)
                      .slice(0, 10)
                      .map((entry) => [
                        entry.method,
                        entry.label,
                        entry.status,
                        `${formatNumber(entry.totalMs, 0)} ms`,
                        formatBytes(entry.sizeBytes),
                      ])}
                  />
                </div>
              </>
            )}
          </ToolCard>
        </div>

        {!harError && entries.length > 0 ? (
          <ToolCard title="Waterfall Timeline">
            <div className="space-y-4">
              {entries
                .slice()
                .sort((first, second) => first.startMs - second.startMs)
                .map((entry) => (
                  <div key={entry.id} className="grid gap-2 md:grid-cols-[minmax(0,260px)_1fr] md:items-center">
                    <div>
                      <p className="truncate font-medium">{entry.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.method} • {entry.status} • {formatBytes(entry.sizeBytes)}
                      </p>
                    </div>
                    <div className="relative h-10 rounded-full bg-muted/40">
                      <div
                        className={`absolute top-1/2 h-6 -translate-y-1/2 rounded-full ${
                          entry.status >= 400 ? "bg-red-500/80" : "bg-sky-500/80"
                        }`}
                        style={{
                          left: `${(entry.startMs / longestWindow) * 100}%`,
                          width: `${Math.max((entry.totalMs / longestWindow) * 100, 1.5)}%`,
                        }}
                      />
                      <p className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-foreground">
                        {formatNumber(entry.totalMs, 0)} ms
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </ToolCard>
        ) : null}
      </div>
    )
  }

  if (toolId === "csv-column-profiler") {
    const parsed = parseCsv(csvInput)
    const profileRows = parsed.headers.map((header, index) => {
      const values = parsed.rows.map((row) => row[index] ?? "")
      const filled = values.filter(Boolean)
      const numeric = filled.filter((value) => /^-?\d+(\.\d+)?$/.test(value)).length
      return [
        header,
        filled.length,
        values.length === 0 ? "n/a" : formatPercent((filled.length / values.length) * 100),
        numeric === filled.length ? "number" : filled.every((value) => /^(true|false)$/i.test(value)) ? "boolean" : "text",
      ]
    })

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="CSV Input">
          <Textarea value={csvInput} onChange={(event) => setCsvInput(event.target.value)} className="min-h-[240px]" />
        </ToolCard>
        <ToolCard title="Column Profile">
          <ResultGrid
            items={[
              { label: "Columns", value: String(parsed.headers.length) },
              { label: "Rows", value: String(parsed.rows.length) },
            ]}
          />
          <div className="mt-4">
            <DataTable headings={["Column", "Filled cells", "Fill rate", "Likely type"]} rows={profileRows} />
          </div>
        </ToolCard>
      </div>
    )
  }

  const rows = toNumber(sizeValues.rows)
  const avgBytesPerRow = toNumber(sizeValues.avgBytesPerRow)
  const monthlyGrowth = toNumber(sizeValues.monthlyGrowth) / 100
  const months = Math.max(1, Math.round(toNumber(sizeValues.months)))
  const projection: Array<Array<string | number>> = []
  let currentRows = rows

  for (let month = 1; month <= months; month += 1) {
    currentRows *= 1 + monthlyGrowth
    projection.push([
      month,
      formatNumber(currentRows, 0),
      `${formatNumber((currentRows * avgBytesPerRow) / (1024 * 1024), 2)} MB`,
    ])
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Dataset Estimate">
        <ToolFields
          fields={[
            { key: "rows", label: "Starting rows", step: "1" },
            { key: "avgBytesPerRow", label: "Average bytes per row", step: "1" },
            { key: "monthlyGrowth", label: "Monthly growth %", step: "0.1" },
            { key: "months", label: "Months", step: "1" },
          ]}
          values={sizeValues}
          onChange={(key, nextValue) => setSizeValues((current) => ({ ...current, [key]: nextValue }))}
        />
      </ToolCard>
      <ToolCard title="Projection">
        <ResultGrid
          items={[
            { label: "Current size", value: `${formatNumber((rows * avgBytesPerRow) / (1024 * 1024), 2)} MB` },
            { label: "Projected size", value: `${formatNumber((currentRows * avgBytesPerRow) / (1024 * 1024), 2)} MB` },
          ]}
        />
        <div className="mt-4">
          <DataTable headings={["Month", "Rows", "Approx. size"]} rows={projection} />
        </div>
      </ToolCard>
    </div>
  )
}

function ImageTools({ toolId: _toolId }: { toolId: string }) {
  const [metadataRows, setMetadataRows] = useState<Array<Array<string | number>>>([])

  const handleImage = async (file: File | null) => {
    if (!file || !withinFileLimit(file)) {
      return
    }

    try {
      const selectedFile = file
      const metadata = await exifr.parse(selectedFile, true)

      setMetadataRows(
        Object.entries(metadata ?? {})
          .slice(0, 16)
          .map(([key, value]) => [key, typeof value === "object" ? JSON.stringify(value) : String(value)])
      )

      const dataUrl = await readFileAsDataUrl(selectedFile)
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const instance = new Image()
        instance.onload = () => resolve(instance)
        instance.onerror = () => reject(new Error("Unable to decode the uploaded image."))
        instance.src = dataUrl
      })
      const canvas = document.createElement("canvas")
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext("2d")
      if (!context) {
        throw new Error("Canvas processing is not available in this browser.")
      }
      context.drawImage(image, 0, 0)

      const outputType = selectedFile.type === "image/png" ? "image/png" : "image/jpeg"
      const cleanedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
            return
          }
          reject(new Error("Unable to export the cleaned image."))
        }, outputType)
      })

      downloadBlob(
        cleanedBlob,
        `${selectedFile.name.replace(/\.[^.]+$/, "")}-clean.${outputType === "image/png" ? "png" : "jpg"}`
      )
      toast.success("Downloaded an image copy without original EXIF metadata.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to clean that image.")
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Upload Photo">
        <Input
          type="file"
          accept="image/*"
          onChange={(event) => void handleImage(event.target.files?.[0] ?? null)}
        />
      </ToolCard>
      <ToolCard title="Detected Metadata">
        {metadataRows.length > 0 ? (
          <DataTable headings={["Field", "Value"]} rows={metadataRows} />
        ) : (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Upload a photo to inspect GPS and device metadata before exporting a cleaned copy.
            </AlertDescription>
          </Alert>
        )}
      </ToolCard>
    </div>
  )
}

function FileTools({ toolId }: { toolId: string }) {
  const [pdfMetadata, setPdfMetadata] = useState<Array<Array<string | number>>>([])
  const [sanitizedNames, setSanitizedNames] = useState<Array<Array<string | number>>>([])
  const [encodedFile, setEncodedFile] = useState("")
  const [lineEndingText, setLineEndingText] = useState("line one\nline two\nline three")
  const [lineEndingMode, setLineEndingMode] = useState<"lf" | "crlf">("lf")

  if (toolId === "pdf-metadata-privacy-checker") {
    const handlePdf = async (file: File | null) => {
      if (!file || !withinFileLimit(file)) {
        return
      }

      try {
        const selectedFile = file
        const bytes = await selectedFile.arrayBuffer()
        const pdfDoc = await PDFDocument.load(bytes)
        const rawKeywords = pdfDoc.getKeywords()
        const rows = [
          ["Title", pdfDoc.getTitle() || ""],
          ["Author", pdfDoc.getAuthor() || ""],
          ["Subject", pdfDoc.getSubject() || ""],
          ["Keywords", Array.isArray(rawKeywords) ? rawKeywords.join(", ") : rawKeywords || ""],
          ["Producer", pdfDoc.getProducer() || ""],
          ["Creator", pdfDoc.getCreator() || ""],
        ]
        setPdfMetadata(rows)

        pdfDoc.setTitle("")
        pdfDoc.setAuthor("")
        pdfDoc.setSubject("")
        pdfDoc.setKeywords([])
        pdfDoc.setProducer("")
        pdfDoc.setCreator("")
        pdfDoc.setCreationDate(new Date(0))
        pdfDoc.setModificationDate(new Date(0))

        const cleanedBytes = await pdfDoc.save()
        const normalizedBytes = new Uint8Array(cleanedBytes)
        downloadBlob(
          new Blob([normalizedBytes], { type: "application/pdf" }),
          `${selectedFile.name.replace(/\.pdf$/i, "")}-clean.pdf`
        )
        toast.success("Sanitized PDF downloaded.")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to inspect that PDF.")
      }
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Upload PDF">
          <Input type="file" accept="application/pdf" onChange={(event) => void handlePdf(event.target.files?.[0] ?? null)} />
        </ToolCard>
        <ToolCard title="Detected Metadata">
          {pdfMetadata.length > 0 ? (
            <DataTable headings={["Field", "Value"]} rows={pdfMetadata} />
          ) : (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Upload a PDF to inspect and remove embedded metadata.</AlertDescription>
            </Alert>
          )}
        </ToolCard>
      </div>
    )
  }

  if (toolId === "filename-sanitizer") {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Paste or Upload File Names">
          <Textarea
            className="min-h-[220px]"
            onChange={(event) =>
              setSanitizedNames(
                event.target.value
                  .split(/\r?\n/)
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => [line, sanitizeFilename(line)])
              )
            }
          />
          <div className="mt-4">
            <Input
              type="file"
              multiple
              onChange={(event) =>
                setSanitizedNames(
                  Array.from(event.target.files ?? []).map((file) => [file.name, sanitizeFilename(file.name)])
                )
              }
            />
          </div>
        </ToolCard>
        <ToolCard title="Sanitized Output">
          <DataTable headings={["Original", "Sanitized"]} rows={sanitizedNames} />
        </ToolCard>
      </div>
    )
  }

  if (toolId === "base64-file-encoder") {
    const handleFile = async (file: File | null) => {
      if (!file || !withinFileLimit(file)) {
        return
      }

      try {
        const dataUrl = await readFileAsDataUrl(file)
        setEncodedFile(dataUrl.split(",")[1] ?? "")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to encode the file.")
      }
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Upload File">
          <Input type="file" onChange={(event) => void handleFile(event.target.files?.[0] ?? null)} />
        </ToolCard>
        <ToolCard title="Base64 Output">
          <Textarea readOnly value={encodedFile} className="min-h-[260px]" />
        </ToolCard>
      </div>
    )
  }

  const converted = convertLineEndings(lineEndingText, lineEndingMode)
  const lineCount = converted ? converted.split(/\r\n|\n/).length : 0

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Text Content">
        <Textarea value={lineEndingText} onChange={(event) => setLineEndingText(event.target.value)} className="min-h-[240px]" />
        <div className="mt-4">
          <Label htmlFor="line-ending-mode">Target line ending</Label>
          <select
            id="line-ending-mode"
            className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={lineEndingMode}
            onChange={(event) => setLineEndingMode(event.target.value as "lf" | "crlf")}
          >
            <option value="lf">LF</option>
            <option value="crlf">CRLF</option>
          </select>
        </div>
      </ToolCard>
      <ToolCard title="Converted Output">
        <Textarea readOnly value={converted} className="min-h-[240px]" />
        <div className="mt-4">
          <ResultGrid items={[{ label: "Lines", value: String(lineCount) }, { label: "Mode", value: lineEndingMode.toUpperCase() }]} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => downloadText("normalized.txt", converted)}>
            <Download className="mr-2 h-4 w-4" />
            Download text
          </Button>
        </div>
      </ToolCard>
    </div>
  )
}

function AudioTools({ toolId }: { toolId: string }) {
  const [bpm, setBpm] = useState("120")
  const [frequency, setFrequency] = useState("440")
  const [barLength, setBarLength] = useState("4")
  const tapHistory = useRef<number[]>([])

  if (toolId === "bpm-delay-time-calculator") {
    const currentBpm = toNumber(bpm)
    const divisionRows = NOTE_DIVISIONS.map((division) => {
      const milliseconds = currentBpm > 0 ? (60000 / currentBpm) * division.factor : 0
      return [division.label, `${formatNumber(milliseconds, 2)} ms`]
    })

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Tempo">
          <Label htmlFor="tempo-bpm">BPM</Label>
          <Input id="tempo-bpm" value={bpm} onChange={(event) => setBpm(event.target.value)} className="mt-2" />
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => {
              const now = performance.now()
              tapHistory.current = [...tapHistory.current.slice(-5), now]
              if (tapHistory.current.length >= 2) {
                const intervals = tapHistory.current.slice(1).map((value, index) => value - tapHistory.current[index])
                const average = intervals.reduce((total, value) => total + value, 0) / intervals.length
                setBpm(formatNumber(60000 / average, 1))
              }
            }}
          >
            Tap tempo
          </Button>
        </ToolCard>
        <ToolCard title="Delay Times">
          <DataTable headings={["Division", "Delay time"]} rows={divisionRows} />
        </ToolCard>
      </div>
    )
  }

  if (toolId === "frequency-to-note-converter") {
    const note = nearestNote(toNumber(frequency))

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Frequency Input">
          <Label htmlFor="frequency-hz">Frequency (Hz)</Label>
          <Input id="frequency-hz" value={frequency} onChange={(event) => setFrequency(event.target.value)} className="mt-2" />
        </ToolCard>
        <ToolCard title="Nearest Note">
          {note ? (
            <ResultGrid
              items={[
                { label: "Closest note", value: note.note },
                { label: "Reference frequency", value: `${formatNumber(note.reference, 2)} Hz` },
                { label: "Difference", value: `${note.cents} cents` },
              ]}
            />
          ) : null}
        </ToolCard>
      </div>
    )
  }

  const beatInterval = toNumber(bpm) > 0 ? 60000 / toNumber(bpm) : 0
  const barMs = beatInterval * toNumber(barLength)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Beat Settings">
        <ToolFields
          fields={[
            { key: "bpm", label: "BPM", step: "0.1" },
            { key: "barLength", label: "Beats per bar", step: "1" },
          ]}
          values={{ bpm, barLength }}
          onChange={(key, nextValue) => {
            if (key === "bpm") setBpm(nextValue)
            if (key === "barLength") setBarLength(nextValue)
          }}
        />
      </ToolCard>
      <ToolCard title="Intervals">
        <ResultGrid
          items={[
            { label: "Beat interval", value: `${formatNumber(beatInterval, 2)} ms` },
            { label: "Bar duration", value: `${formatNumber(barMs, 2)} ms` },
            { label: "Bars per minute", value: formatNumber(toNumber(bpm) / Math.max(toNumber(barLength), 1), 2) },
          ]}
        />
      </ToolCard>
    </div>
  )
}

function DesignTools({ toolId }: { toolId: string }) {
  const defaultGridPreset = GRID_PRESETS[0] ?? {
    id: "default",
    label: "Default",
    description: "",
    columns: "220px 1fr",
    rows: "auto 1fr auto",
    gap: "16",
    areas: "header header\nsidebar main\nfooter footer",
    minHeight: "88",
    autoFlow: "row",
    justifyItems: "stretch",
    alignItems: "stretch",
  }

  const [aspectValues, setAspectValues] = useState({ width: "1200", height: "630" })
  const [scaleValues, setScaleValues] = useState({ base: "4", ratio: "1.5", steps: "8" })
  const [gridValues, setGridValues] = useState({
    columns: defaultGridPreset.columns,
    rows: defaultGridPreset.rows,
    gap: defaultGridPreset.gap,
    areas: defaultGridPreset.areas,
    minHeight: defaultGridPreset.minHeight,
    autoFlow: defaultGridPreset.autoFlow,
    justifyItems: defaultGridPreset.justifyItems,
    alignItems: defaultGridPreset.alignItems,
  })
  const [gridBrush, setGridBrush] = useState("nav")
  const [newAreaName, setNewAreaName] = useState("")
  const [spriteSymbols, setSpriteSymbols] = useState<SpriteSymbolRecord[]>([])
  const [spriteMarkup, setSpriteMarkup] = useState("")
  const [spriteWarnings, setSpriteWarnings] = useState<string[]>([])

  const gridAnalysis = useMemo(() => analyzeGridTemplate(gridValues.areas), [gridValues.areas])
  const gridCssOutput = useMemo(
    () => buildGridCssOutput(gridValues, gridAnalysis),
    [gridAnalysis, gridValues]
  )
  const gridHtmlOutput = useMemo(() => buildGridHtmlOutput(gridAnalysis), [gridAnalysis])
  const activeGridBrush =
    gridBrush === GRID_EMPTY_CELL || gridAnalysis.areaNames.includes(gridBrush)
      ? gridBrush
      : gridAnalysis.areaNames[0] ?? GRID_EMPTY_CELL

  const updateGridMatrix = (updater: (matrix: string[][]) => string[][]) => {
    const nextMatrix = updater(gridAnalysis.rows.map((row) => [...row]))
    setGridValues((current) => ({
      ...current,
      areas: stringifyGridMatrix(nextMatrix),
    }))
  }

  const insertAreaIntoMatrix = (areaName: string) => {
    const normalizedArea = normalizeGridToken(areaName)
    if (normalizedArea === GRID_EMPTY_CELL) {
      return
    }

    let inserted = false
    const nextMatrix = gridAnalysis.rows.map((row) => [...row])

    for (let rowIndex = 0; rowIndex < nextMatrix.length && !inserted; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < nextMatrix[rowIndex].length; columnIndex += 1) {
        if (nextMatrix[rowIndex][columnIndex] === GRID_EMPTY_CELL) {
          nextMatrix[rowIndex][columnIndex] = normalizedArea
          inserted = true
          break
        }
      }
    }

    if (!inserted) {
      nextMatrix[0] = [...nextMatrix[0], normalizedArea]
      for (let rowIndex = 1; rowIndex < nextMatrix.length; rowIndex += 1) {
        nextMatrix[rowIndex] = [...nextMatrix[rowIndex], GRID_EMPTY_CELL]
      }
    }

    setGridBrush(normalizedArea)
    setGridValues((current) => ({
      ...current,
      areas: stringifyGridMatrix(nextMatrix),
    }))
  }

  if (toolId === "aspect-ratio-layout-calculator") {
    const width = Math.max(toNumber(aspectValues.width), 1)
    const height = Math.max(toNumber(aspectValues.height), 1)
    const ratio = reduceRatio(width, height)
    const paddingTop = (height / width) * 100
    const orientation = width === height ? "Square" : width > height ? "Landscape" : "Portrait"
    const aspectSnippet = `.media-frame {\n  aspect-ratio: ${ratio.replace(":", " / ")};\n  inline-size: min(100%, ${Math.round(width)}px);\n}`

    return (
      <div className="grid gap-6 xl:grid-cols-3">
        <ToolCard title="Frame Size">
          <ToolFields
            fields={[
              { key: "width", label: "Width", step: "1" },
              { key: "height", label: "Height", step: "1" },
            ]}
            values={aspectValues}
            onChange={(key, nextValue) => setAspectValues((current) => ({ ...current, [key]: nextValue }))}
          />
        </ToolCard>

        <ToolCard title="Preview">
          <div className="rounded-[28px] border bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.16),transparent_45%)] p-5">
            <div
              className="mx-auto flex w-full max-w-[320px] items-center justify-center rounded-[24px] border border-white/60 bg-white/80 text-center shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur"
              style={{ aspectRatio: `${width} / ${height}` }}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  {orientation}
                </p>
                <p className="mt-3 text-2xl font-semibold">{ratio}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatNumber(width, 0)} × {formatNumber(height, 0)}
                </p>
              </div>
            </div>
          </div>
        </ToolCard>

        <ToolCard title="Aspect Ratio Output">
          <ResultGrid
            items={[
              { label: "Reduced ratio", value: ratio },
              { label: "Orientation", value: orientation },
              { label: "Padding-top hack", value: `${formatNumber(paddingTop, 2)}%` },
            ]}
          />
          <Textarea readOnly value={aspectSnippet} className="mt-4 min-h-[180px]" />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => copyText(aspectSnippet)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy CSS
            </Button>
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "css-grid-template-generator") {
    const applyPreset = (preset: GridPreset) => {
      setGridValues({
        columns: preset.columns,
        rows: preset.rows,
        gap: preset.gap,
        areas: preset.areas,
        minHeight: preset.minHeight,
        autoFlow: preset.autoFlow,
        justifyItems: preset.justifyItems,
        alignItems: preset.alignItems,
      })
      setGridBrush(normalizeGridToken(preset.areas.split(/\s+/)[0] ?? GRID_EMPTY_CELL))
    }

    const handleAddArea = () => {
      const nextArea = normalizeGridToken(newAreaName)
      if (nextArea === GRID_EMPTY_CELL) {
        toast.error("Enter a valid area name like hero, sidebar, or stats.")
        return
      }

      if (gridAnalysis.areaNames.includes(nextArea)) {
        setGridBrush(nextArea)
        setNewAreaName("")
        toast.success(`Using "${nextArea}" as the active paint area.`)
        return
      }

      insertAreaIntoMatrix(nextArea)
      setNewAreaName("")
      toast.success(`Added "${nextArea}" to the grid.`)
    }

    const handleRemoveActiveArea = () => {
      if (activeGridBrush === GRID_EMPTY_CELL) {
        return
      }

      updateGridMatrix((matrix) =>
        matrix.map((row) => row.map((cell) => (cell === activeGridBrush ? GRID_EMPTY_CELL : cell)))
      )
      setGridBrush(GRID_EMPTY_CELL)
    }

    const areaSummaryRows = gridAnalysis.stats.map((area) => [
      area.name,
      area.cells,
      `${area.rows} × ${area.columns}`,
      area.rectangular ? "Clean rectangle" : "Needs cleanup",
    ])

    return (
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)_minmax(0,0.95fr)]">
        <ToolCard title="Grid Builder">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium">Presets</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {GRID_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={cn(
                      "rounded-2xl border p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted/30",
                      gridValues.areas === preset.areas ? "border-primary/60 bg-primary/5" : "border-border"
                    )}
                    onClick={() => applyPreset(preset)}
                  >
                    <p className="font-medium">{preset.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="grid-columns">Columns</Label>
                <Input
                  id="grid-columns"
                  value={gridValues.columns}
                  onChange={(event) => setGridValues((current) => ({ ...current, columns: event.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="grid-rows">Rows</Label>
                <Input
                  id="grid-rows"
                  value={gridValues.rows}
                  onChange={(event) => setGridValues((current) => ({ ...current, rows: event.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="grid-gap">Gap</Label>
                <Input
                  id="grid-gap"
                  value={gridValues.gap}
                  onChange={(event) => setGridValues((current) => ({ ...current, gap: event.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="grid-min-height">Minimum card height</Label>
                <Input
                  id="grid-min-height"
                  value={gridValues.minHeight}
                  onChange={(event) => setGridValues((current) => ({ ...current, minHeight: event.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="grid-auto-flow">Auto flow</Label>
                <select
                  id="grid-auto-flow"
                  className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={gridValues.autoFlow}
                  onChange={(event) => setGridValues((current) => ({ ...current, autoFlow: event.target.value }))}
                >
                  {GRID_AUTO_FLOW_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="grid-justify-items">Justify items</Label>
                <select
                  id="grid-justify-items"
                  className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={gridValues.justifyItems}
                  onChange={(event) => setGridValues((current) => ({ ...current, justifyItems: event.target.value }))}
                >
                  {GRID_ALIGNMENT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="grid-align-items">Align items</Label>
                <select
                  id="grid-align-items"
                  className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={gridValues.alignItems}
                  onChange={(event) => setGridValues((current) => ({ ...current, alignItems: event.target.value }))}
                >
                  {GRID_ALIGNMENT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/15 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Area palette</p>
                  <p className="text-xs text-muted-foreground">Choose a paint area, then click cells below.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateGridMatrix((matrix) => [...matrix, Array.from({ length: gridAnalysis.columnCount }, () => GRID_EMPTY_CELL)])}>
                    Add row
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateGridMatrix((matrix) => matrix.map((row) => [...row, GRID_EMPTY_CELL]))}>
                    Add column
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={gridAnalysis.rowCount <= 1}
                    onClick={() => updateGridMatrix((matrix) => matrix.slice(0, -1))}
                  >
                    Remove row
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={gridAnalysis.columnCount <= 1}
                    onClick={() => updateGridMatrix((matrix) => matrix.map((row) => row.slice(0, -1)))}
                  >
                    Remove column
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[GRID_EMPTY_CELL, ...gridAnalysis.areaNames].map((area) => (
                  <button
                    key={area}
                    type="button"
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      activeGridBrush === area
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/50 hover:bg-muted/40"
                    )}
                    onClick={() => setGridBrush(area)}
                  >
                    {area === GRID_EMPTY_CELL ? "Empty" : toDisplayLabel(area)}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Input
                  value={newAreaName}
                  onChange={(event) => setNewAreaName(event.target.value)}
                  placeholder="Add an area like hero or social-proof"
                />
                <Button type="button" onClick={handleAddArea}>
                  Add area
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={activeGridBrush === GRID_EMPTY_CELL}
                  onClick={handleRemoveActiveArea}
                >
                  Remove area
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {gridAnalysis.rows.map((row, rowIndex) => (
                <div key={`grid-row-${rowIndex}`} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridAnalysis.columnCount}, minmax(0, 1fr))` }}>
                  {row.map((cell, columnIndex) => (
                    <button
                      key={`grid-cell-${rowIndex}-${columnIndex}`}
                      type="button"
                      className={cn(
                        "min-h-[54px] rounded-2xl border px-3 py-2 text-left transition-colors",
                        cell === GRID_EMPTY_CELL
                          ? "border-dashed border-border bg-background text-muted-foreground"
                          : "border-primary/20 bg-primary/5 text-foreground hover:border-primary/40",
                        activeGridBrush === cell && cell !== GRID_EMPTY_CELL ? "ring-2 ring-primary/40" : ""
                      )}
                      onClick={() =>
                        updateGridMatrix((matrix) =>
                          matrix.map((currentRow, currentRowIndex) =>
                            currentRow.map((currentCell, currentColumnIndex) =>
                              currentRowIndex === rowIndex && currentColumnIndex === columnIndex
                                ? activeGridBrush
                                : currentCell
                            )
                          )
                        )
                      }
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {rowIndex + 1}:{columnIndex + 1}
                      </p>
                      <p className="mt-1 font-medium">
                        {cell === GRID_EMPTY_CELL ? "Empty" : toDisplayLabel(cell)}
                      </p>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="grid-areas">Template areas code</Label>
              <Textarea
                id="grid-areas"
                value={gridValues.areas}
                onChange={(event) => setGridValues((current) => ({ ...current, areas: event.target.value }))}
                className="mt-2 min-h-[160px]"
              />
            </div>
          </div>
        </ToolCard>

        <div className="space-y-6">
          <ToolCard title="Preview">
            <ResultGrid
              items={[
                { label: "Columns", value: String(gridAnalysis.columnCount) },
                { label: "Rows", value: String(gridAnalysis.rowCount) },
                { label: "Named areas", value: String(gridAnalysis.areaNames.length) },
                { label: "Template status", value: gridAnalysis.isValid ? "Ready for CSS" : "Fix invalid areas" },
              ]}
            />

            <div className="mt-5 rounded-[32px] border bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.18),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(248,250,252,0.82))] p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <div
                className="grid rounded-[26px] border border-white/70 bg-white/75 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur"
                style={{
                  gridTemplateColumns: gridValues.columns,
                  gridTemplateRows: gridValues.rows,
                  gap: formatCssSizeValue(gridValues.gap, "16px"),
                  gridAutoFlow: gridValues.autoFlow,
                  justifyItems: gridValues.justifyItems as CSSProperties["justifyItems"],
                  alignItems: gridValues.alignItems as CSSProperties["alignItems"],
                  gridTemplateAreas: gridAnalysis.rows.map((row) => `"${row.join(" ")}"`).join(" "),
                }}
              >
                {gridAnalysis.stats.map((area, index) => (
                  <div
                    key={area.name}
                    style={{
                      gridArea: area.name,
                      minHeight: formatCssSizeValue(gridValues.minHeight, "88px"),
                      background: `linear-gradient(135deg, hsl(${(index * 49) % 360} 88% 96%), hsl(${((index * 49) + 28) % 360} 82% 89%))`,
                    }}
                    className="relative overflow-hidden rounded-[22px] border border-black/5 p-4 text-slate-900 shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                          {area.rectangular ? "Grid area" : "Needs cleanup"}
                        </p>
                        <p className="mt-2 text-lg font-semibold">{toDisplayLabel(area.name)}</p>
                      </div>
                      <Badge variant="secondary">
                        {area.rows} × {area.columns}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      <code>{`grid-area: ${area.name};`}</code> spanning {area.cells} cell{area.cells === 1 ? "" : "s"}.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {gridAnalysis.warnings.length > 0 ? (
              <Alert className="mt-5">
                <TriangleAlert className="h-4 w-4" />
                <AlertDescription>{gridAnalysis.warnings.join(" ")}</AlertDescription>
              </Alert>
            ) : null}

            {areaSummaryRows.length > 0 ? (
              <div className="mt-5">
                <DataTable
                  headings={["Area", "Cells", "Span", "Quality"]}
                  rows={areaSummaryRows}
                />
              </div>
            ) : null}
          </ToolCard>
        </div>

        <ToolCard title="Generated Code">
          <div className="space-y-4">
            <div>
              <Label htmlFor="grid-css-output">CSS</Label>
              <Textarea id="grid-css-output" readOnly value={gridCssOutput} className="mt-2 min-h-[280px]" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => copyText(gridCssOutput)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy CSS
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadText("grid-template.css", gridCssOutput, "text/css;charset=utf-8")}
              >
                <Download className="mr-2 h-4 w-4" />
                Download CSS
              </Button>
            </div>

            <div>
              <Label htmlFor="grid-html-output">HTML scaffold</Label>
              <Textarea id="grid-html-output" readOnly value={gridHtmlOutput} className="mt-2 min-h-[220px]" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => copyText(gridHtmlOutput)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy HTML
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadText("grid-layout.html", gridHtmlOutput, "text/html;charset=utf-8")}
              >
                <Download className="mr-2 h-4 w-4" />
                Download HTML
              </Button>
            </div>
          </div>
        </ToolCard>
      </div>
    )
  }

  if (toolId === "svg-sprite-sheet-generator") {
    const handleSpriteUpload = async (files: FileList | null) => {
      const selectedFiles = Array.from(files ?? []).filter((file) => withinFileLimit(file))
      if (selectedFiles.length === 0) {
        return
      }

      try {
        const contents = await Promise.all(
          selectedFiles.map(async (file) => ({
            name: file.name,
            contents: await readFileAsText(file),
          }))
        )
        const spriteResult = extractSpriteSymbols(contents)
        setSpriteSymbols(spriteResult.symbols)
        setSpriteMarkup(spriteResult.spriteMarkup)
        setSpriteWarnings(spriteResult.warnings)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to read one of the SVG files.")
      }
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Upload SVG Icons">
            <Input type="file" accept=".svg,image/svg+xml" multiple onChange={(event) => void handleSpriteUpload(event.target.files)} />
            <p className="mt-3 text-sm text-muted-foreground">
              Upload multiple SVG icons to combine them into one sprite sheet with symbol IDs.
            </p>
            {spriteWarnings.length > 0 ? (
              <div className="mt-4">
                <DataTable headings={["Warning"]} rows={spriteWarnings.map((warning) => [warning])} />
              </div>
            ) : null}
          </ToolCard>

          <ToolCard title="Sprite Output">
            <Textarea readOnly value={spriteMarkup} className="min-h-[260px]" />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={() => copyText(spriteMarkup)} disabled={!spriteMarkup}>
                <Copy className="mr-2 h-4 w-4" />
                Copy sprite
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadText("icons-sprite.svg", spriteMarkup, "image/svg+xml;charset=utf-8")}
                disabled={!spriteMarkup}
              >
                <Download className="mr-2 h-4 w-4" />
                Download sprite
              </Button>
            </div>
          </ToolCard>
        </div>

        {spriteMarkup ? (
          <ToolCard title="Symbol Preview">
            <div dangerouslySetInnerHTML={{ __html: spriteMarkup }} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {spriteSymbols.map((symbol) => (
                <div key={symbol.symbolId} className="rounded-2xl border bg-muted/20 p-4">
                  <svg viewBox={symbol.viewBox} className="h-12 w-12 text-foreground">
                    <use href={`#${symbol.symbolId}`} />
                  </svg>
                  <p className="mt-3 text-sm font-medium">{symbol.symbolId}</p>
                  <p className="text-xs text-muted-foreground">{symbol.fileName}</p>
                  <Textarea
                    readOnly
                    value={`<svg aria-hidden="true"><use href="#${symbol.symbolId}" /></svg>`}
                    className="mt-3 min-h-[96px]"
                  />
                </div>
              ))}
            </div>
          </ToolCard>
        ) : null}
      </div>
    )
  }

  const base = Math.max(toNumber(scaleValues.base), 0.25)
  const ratio = Math.max(toNumber(scaleValues.ratio), 1)
  const steps = Math.max(1, Math.round(toNumber(scaleValues.steps)))
  const scaleRows = Array.from({ length: steps }, (_, index) => ({
    step: index,
    value: base * ratio ** index,
    token: `--space-${index}`,
  }))
  const scaleVariableOutput = `:root {\n${scaleRows
    .map((row) => `  ${row.token}: ${formatNumber(row.value, 2)}px;`)
    .join("\n")}\n}`

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <ToolCard title="Spacing Scale Inputs">
        <ToolFields
          fields={[
            { key: "base", label: "Base size (px)", step: "0.1" },
            { key: "ratio", label: "Scale ratio", step: "0.01" },
            { key: "steps", label: "Steps", step: "1" },
          ]}
          values={scaleValues}
          onChange={(key, nextValue) => setScaleValues((current) => ({ ...current, [key]: nextValue }))}
        />
      </ToolCard>

      <ToolCard title="Visual Scale">
        <div className="space-y-3">
          {scaleRows.map((row) => (
            <div key={row.token} className="rounded-2xl border bg-muted/15 p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="font-medium">{row.token}</p>
                <p className="text-muted-foreground">{formatNumber(row.value, 2)}px</p>
              </div>
              <div className="mt-3 h-3 rounded-full bg-muted/50">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400"
                  style={{ width: `${Math.min(Math.max(row.value * 2.2, 8), 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </ToolCard>

      <ToolCard title="Generated Tokens">
        <ResultGrid
          items={[
            { label: "Base", value: `${formatNumber(base, 2)}px` },
            { label: "Largest token", value: `${formatNumber(scaleRows[scaleRows.length - 1]?.value ?? base, 2)}px` },
            { label: "Steps", value: String(steps) },
          ]}
        />
        <Textarea readOnly value={scaleVariableOutput} className="mt-4 min-h-[260px]" />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => copyText(scaleVariableOutput)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy variables
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadText("spacing-scale.css", scaleVariableOutput, "text/css;charset=utf-8")}
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSS
          </Button>
        </div>
        <div className="mt-4">
          <DataTable
            headings={["Step", "Token", "Value"]}
            rows={scaleRows.map((row) => [row.step, row.token, `${formatNumber(row.value, 2)}px`])}
          />
        </div>
      </ToolCard>
    </div>
  )
}

function SecurityTools({ toolId: _toolId }: { toolId: string }) {
  const [password, setPassword] = useState("The Free AI Tools!2026")
  const strength = analyzePassword(password)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Password Input">
        <Input type="text" value={password} onChange={(event) => setPassword(event.target.value)} />
      </ToolCard>
      <ToolCard title="Strength Review">
        <ResultGrid
          items={[
            { label: "Score", value: `${strength.score}/100` },
            { label: "Length", value: strength.checks.length ? "12+ chars" : "Needs work" },
            { label: "Mixed character types", value: strength.checks.uppercase && strength.checks.lowercase && strength.checks.number && strength.checks.symbol ? "Yes" : "Add more variety" },
          ]}
        />
      </ToolCard>
    </div>
  )
}

function RandomTools({ toolId: _toolId }: { toolId: string }) {
  const [heads, setHeads] = useState(0)
  const [tails, setTails] = useState(0)
  const [lastFlip, setLastFlip] = useState("Heads")

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Coin Flip">
        <Button
          onClick={() => {
            const result = Math.random() > 0.5 ? "Heads" : "Tails"
            setLastFlip(result)
            if (result === "Heads") {
              setHeads((current) => current + 1)
            } else {
              setTails((current) => current + 1)
            }
          }}
        >
          Flip coin
        </Button>
      </ToolCard>
      <ToolCard title="Result">
        <ResultGrid
          items={[
            { label: "Last flip", value: lastFlip },
            { label: "Heads", value: String(heads) },
            { label: "Tails", value: String(tails) },
          ]}
        />
      </ToolCard>
    </div>
  )
}

export default DynamicToolExpansion

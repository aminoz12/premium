"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
  Copy,
  Download,
  ImageIcon,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  RefreshCw,
  Upload,
} from "lucide-react"
import { ToolCard } from "@/components/layout/tool-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useClipboard } from "@/hooks/use-clipboard"

/* =========================================================================
   GENERAL UTILITIES
   ========================================================================= */

const encoder = new TextEncoder()

const MORSE_MAP: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..",
  j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.",
  s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....",
  6: "-....", 7: "--...", 8: "---..", 9: "----.", " ": "/"
}
const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]))
const STOP_WORDS = new Set(["the", "a", "an", "and", "or", "but", "to", "of", "in", "on", "for", "with", "is", "are", "was", "were", "be", "this", "that", "it", "as", "at", "by", "from"])
const NAME_PARTS = {
  first: ["Ava", "Liam", "Noah", "Mia", "Zara", "Omar", "Ella", "Kai", "Nina", "Elias"],
  last: ["Stone", "Rivera", "Patel", "Baker", "Kim", "Santos", "Fisher", "Lopez", "Nguyen", "Wright"],
  streets: ["Maple Ave", "Ocean View Rd", "Cedar Street", "Sunset Blvd", "Forest Lane", "Birch Court"],
  cities: ["Austin", "Seattle", "Boston", "Denver", "Raleigh", "Phoenix"]
}
const FALLBACK_RATES: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, CAD: 1.35, MAD: 9.89, AED: 3.67, INR: 83.1, JPY: 150.4 }

function slugToWords(v: string) { return v.split("-").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ") }
function randomFrom<T>(items: T[]) { return items[Math.floor(Math.random() * items.length)] }
function downloadBlob(blob: Blob, filename: string) { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url) }
function toHex(buf: ArrayBuffer) { return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("") }
async function sha256(text: string) { return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(text))) }
function safeJsonParse(v: string) { try { return { data: JSON.parse(v), error: "" } } catch (e) { return { data: null, error: e instanceof Error ? e.message : "Invalid JSON" } } }
function formatXml(v: string) { if (typeof window === "undefined") return v; const p = new DOMParser(); const d = p.parseFromString(v, "application/xml"); if (d.querySelector("parseerror")) throw new Error("Invalid XML document."); const s = new XMLSerializer(); const raw = s.serializeToString(d); const fmt = raw.replace(/(>)(<)(\/*)/g, "$1\n$2$3"); let indent = 0; return fmt.split("\n").filter(Boolean).map(line => { if (line.match(/^<\//)) indent = Math.max(indent - 1, 0); const cur = `${"  ".repeat(indent)}${line}`; if (line.match(/^<[^!?/][^>]*[^/]>/)) indent += 1; return cur }).join("\n") }
function jsonToXmlValue(v: any, n = "item"): string { if (v === null || v === undefined) return `<${n} />`; if (Array.isArray(v)) return v.map(i => jsonToXmlValue(i, n)).join(""); if (typeof v === "object") { const c = Object.entries(v).map(([k, e]) => jsonToXmlValue(e, k)).join(""); return `<${n}>${c}</${n}>` } return `<${n}>${String(v).replace(/[<>&]/g, "")}</${n}>` }
function htmlToMarkdown(html: string) { if (typeof window === "undefined") return html; const p = new DOMParser(); const d = p.parseFromString(html, "text/html"); const visit = (node: ChildNode): string => { if (node.nodeType === Node.TEXT_NODE) return node.textContent || ""; if (!(node instanceof HTMLElement)) return ""; const c = Array.from(node.childNodes).map(visit).join(""); switch (node.tagName.toLowerCase()) { case "h1": return `# ${c}\n\n`; case "h2": return `## ${c}\n\n`; case "h3": return `### ${c}\n\n`; case "strong": case "b": return `**${c}**`; case "em": case "i": return `*${c}*`; case "code": return `\`${c}\``; case "pre": return `\`\`\`\n${c.trim()}\n\`\`\`\n\n`; case "a": return `[${c}](${node.getAttribute("href") || "#"})`; case "li": return `- ${c}\n`; case "p": return `${c}\n\n`; case "br": return "\n"; default: return c } }; return Array.from(d.body.childNodes).map(visit).join("").trim() }
function parseSqlInsert(input: string) { const m = input.match(/insert\s+into\s+\w+\s*\(([^)]+)\)\s*values\s*([\s\S]+);?/i); if (!m) throw new Error("Expected INSERT INTO ... VALUES statement."); const cols = m[1].split(",").map(v => v.trim().replace(/[`"]/g, "")); const rows = m[2].trim().replace(/;$/, "").split(/\),\s*\(/).map(r => r.replace(/^\(/, "").replace(/\)$/, "")); return rows.map(row => { const vals = row.split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map(v => v.trim()); return Object.fromEntries(cols.map((c, i) => [c, vals[i]?.replace(/^'/, "").replace(/'$/, "").replace(/^null$/i, "") ?? ""])) }) }
function parseEnv(input: string) { const parsed: Record<string, string> = {}; input.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#")).forEach(l => { const eq = l.indexOf("="); if (eq > -1) { const k = l.slice(0, eq).trim(); const v = l.slice(eq + 1).trim().replace(/^['"]|['"]$/g, ""); parsed[k] = v } }); return parsed }
function prettifyLogs(input: string) { return input.split(/\r?\n/).map(line => { const t = line.trim(); if (!t) return ""; const p = safeJsonParse(t); if (p.data) return JSON.stringify(p.data, null, 2); return t.replace(/\s+/g, " ").replace(/([A-Za-z0-9_]+)=/g, "\n$1=").trim() }).join("\n\n") }
async function readFileAsDataUrl(file: File) { return new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result || "")); r.onerror = () => rej(new Error("Failed to read file.")); r.readAsDataURL(file) }) }
async function loadImage(src: string) { return new Promise<HTMLImageElement>((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = () => rej(new Error("Image could not be loaded.")); img.src = src }) }
async function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png", quality?: number) { return new Promise<Blob>((res, rej) => { canvas.toBlob(blob => { if (blob) res(blob); else rej(new Error("Failed to create output.")) }, type, quality) }) }
function nativeSelectClasses() { return "mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" }

/* =========================================================================
   SHARED UI
   ========================================================================= */

function UploadDropzone({ label, helper, multiple = false, accept, onFiles }: { label: string; helper: string; multiple?: boolean; accept?: Record<string, string[]>; onFiles: (files: File[]) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ multiple, accept, onDrop: onFiles })
  return (
    <div {...getRootProps()} className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? "border-primary bg-primary/5" : "hover:border-primary"}`}>
      <input {...getInputProps()} />
      <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
      <p className="font-medium">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
    </div>
  )
}

function ResultBox({ value, filename, copy }: { value: string; filename?: string; copy: (v: string) => Promise<boolean> }) {
  return (
    <div className="space-y-3">
      <Textarea readOnly value={value} className="min-h-[220px] font-mono text-sm" />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => copy(value)} disabled={!value}><Copy className="mr-2 h-4 w-4" />Copy</Button>
        {filename && <Button variant="outline" onClick={() => downloadBlob(new Blob([value], { type: "text/plain" }), filename)} disabled={!value}><Download className="mr-2 h-4 w-4" />Download</Button>}
      </div>
    </div>
  )
}

/* =========================================================================
   DIAGRAM ENGINE — TYPES
   ========================================================================= */

/**
 * Canonical edge relationship types.
 * direction: "forward" means arrowhead at target, "back" means at source, "both", "none"
 */
type EdgeRelType =
  | "inheritance"   // hollow triangle at parent (source in Mermaid `A <|-- B` means B inherits A)
  | "composition"   // filled diamond at owner (source)
  | "aggregation"   // open diamond at owner (source)
  | "association"   // open arrow at target
  | "dependency"    // dashed open arrow at target
  | "realization"   // dashed hollow triangle
  | "undirected"    // plain line

type DiagramNode = {
  id: string
  label: string
  kind: "class" | "entity" | "process" | "decision" | "actor" | "participant" | "note"
  attrs: string[]
  methods: string[]
  noteText?: string
  noteTarget?: string          // id of node this note is attached to
  notePos?: "top" | "bottom" | "left" | "right"
}

type DiagramEdge = {
  /** In Mermaid `A <|-- B`: source=A (parent), target=B (child) */
  source: string
  target: string
  relType: EdgeRelType
  label: string
  sourceMult: string
  targetMult: string
  /** Which end gets the "primary" marker (triangle/diamond/arrow) */
  markerAtSource: boolean
}

type ParsedDiagram = { nodes: DiagramNode[]; edges: DiagramEdge[]; errors: string[] }

/* =========================================================================
   DIAGRAM ENGINE — CLASS DIAGRAM PARSER (tokenizer approach)
   ========================================================================= */

/**
 * Mermaid classDiagram arrow reference:
 *
 *  Syntax       | Meaning          | Marker location
 *  -------------|------------------|-------------------
 *  A <|-- B     | B inherits A     | hollow △ at A (source)
 *  A *-- B      | B composed in A  | filled ◆ at A (source)
 *  A o-- B      | B aggregated in A| open ◆ at A (source)
 *  A --> B      | A associates B   | open → at B (target)
 *  A ..> B      | A depends on B   | dashed → at B (target)
 *  A -- B       | undirected       | none
 *  A --|> B     | A realizes B     | hollow △ at B (target)
 */

const ARROW_TABLE: Array<{
  pattern: RegExp
  relType: EdgeRelType
  markerAtSource: boolean   // true = marker goes on source end
}> = [
    // inheritance:  A <|-- B  or  A <|.. B
    { pattern: /^<\|[-]+$|^<\|\.+$/, relType: "inheritance", markerAtSource: true },
    // reverse inheritance: A --|> B
    { pattern: /^[-]+\|>$|^\.+\|>$/, relType: "inheritance", markerAtSource: false },
    // composition:  A *-- B  or  B --* A
    { pattern: /^\*[-]+$|^[-]+\*$/, relType: "composition", markerAtSource: true },
    // aggregation:  A o-- B  or  B --o A
    { pattern: /^o[-]+$|^[-]+o$/, relType: "aggregation", markerAtSource: true },
    // dependency (dashed arrow): A ..> B
    { pattern: /^\.+>$/, relType: "dependency", markerAtSource: false },
    // association (solid arrow):  A --> B
    { pattern: /^[-]+>$/, relType: "association", markerAtSource: false },
    // undirected:  A -- B  or  A .. B
    { pattern: /^[-]+$|^\.+$/, relType: "undirected", markerAtSource: false },
  ]

function classifyArrow(arrowStr: string): { relType: EdgeRelType; markerAtSource: boolean } {
  for (const entry of ARROW_TABLE) {
    if (entry.pattern.test(arrowStr)) {
      return { relType: entry.relType, markerAtSource: entry.markerAtSource }
    }
  }
  return { relType: "association", markerAtSource: false }
}

/**
 * Parse a single relationship line.
 *
 * Handles:
 *   A --> B : label
 *   A "1" --> "*" B : label
 *   A <|-- B
 *   A *-- B
 *   A ..> B : label
 */
function parseRelationshipLine(line: string): DiagramEdge | null {
  // Strip comments
  const clean = line.replace(/%%.*$/, "").trim()
  if (!clean) return null

  /**
   * Tokenize the relationship line.
   * Groups:
   *  1: source class name
   *  2: optional source multiplicity (quoted)
   *  3: the full arrow token  (e.g. <|--, -->, *--, o--, ..>, --)
   *  4: optional target multiplicity (quoted)
   *  5: target class name
   *  6: optional label after ":"
   */
  const REL_RE = /^([A-Za-z_]\w*)\s*(?:"([^"]*)")?\s*(<\|[-]+|<\|\.+|[-]+\|>|\.+\|>|\*[-]+|[-]+\*|o[-]+|[-]+o|\.+>|[-]+>|[-]+|\.+)\s*(?:"([^"]*)")?\s*([A-Za-z_]\w*)\s*(?::\s*(.+))?$/

  const m = clean.match(REL_RE)
  if (!m) return null

  const source = m[1]
  const srcMult = m[2] || ""
  const arrowFull = m[3]
  const tgtMult = m[4] || ""
  const target = m[5]
  const label = m[6]?.trim() || ""

  const { relType, markerAtSource } = classifyArrow(arrowFull)

  return {
    source,
    target,
    relType,
    label,
    sourceMult: srcMult,
    targetMult: tgtMult,
    markerAtSource,
  }
}

function parseClassDiagram(source: string): ParsedDiagram {
  const nodeMap = new Map<string, DiagramNode>()
  const edges: DiagramEdge[] = []
  const errors: string[] = []

  function ensureClass(id: string) {
    if (!nodeMap.has(id)) {
      nodeMap.set(id, { id, label: id, kind: "class", attrs: [], methods: [] })
    }
  }

  // ── 1. Parse class blocks ─────────────────────────────────────────────
  const classBlockRE = /class\s+([A-Za-z_]\w*)\s*\{([^}]*)\}/g
  let m: RegExpExecArray | null
  while ((m = classBlockRE.exec(source)) !== null) {
    const id = m[1]
    const body = m[2]
    const members = body.split("\n").map(l => l.trim()).filter(Boolean)
    nodeMap.set(id, {
      id,
      label: id,
      kind: "class",
      attrs: members.filter(mem => !mem.includes("(")).slice(0, 12),
      methods: members.filter(mem => mem.includes("(")).slice(0, 12),
    })
  }

  // ── 2. Line-by-line: notes + relationships ────────────────────────────
  for (const rawLine of source.split("\n")) {
    const line = rawLine.replace(/%%.*$/, "").trim()
    if (!line) continue
    if (line.startsWith("classDiagram")) continue
    // Skip lines that are part of class blocks (handled above)
    if (/^class\s+\w+\s*\{/.test(line) || line === "}") continue

    // ── note for X "text" ──────────────────────────────────────────────
    const noteForRE = /^note\s+for\s+([A-Za-z_]\w*)\s+"([^"]+)"$/i
    const nf = line.match(noteForRE)
    if (nf) {
      const targetId = nf[1]
      const text = nf[2]
      ensureClass(targetId)
      // Assign positions round-robin to avoid overlap
      const existing = [...nodeMap.values()].filter(n => n.kind === "note" && n.noteTarget === targetId)
      const sides: Array<"top" | "right" | "bottom" | "left"> = ["top", "right", "bottom", "left"]
      const used = new Set(existing.map(n => n.notePos))
      const pos = sides.find(s => !used.has(s)) ?? "top"
      const nid = `__note_${targetId}_${pos}`
      nodeMap.set(nid, { id: nid, label: "", kind: "note", attrs: [], methods: [], noteText: text, noteTarget: targetId, notePos: pos })
      continue
    }

    // ── note left/right/top/bottom of X : text ─────────────────────────
    const notePosRE = /^note\s+(left|right|top|bottom)\s+of\s+([A-Za-z_]\w*)\s*:\s*(.+)$/i
    const np = line.match(notePosRE)
    if (np) {
      const pos = np[1].toLowerCase() as "left" | "right" | "top" | "bottom"
      const targetId = np[2]
      const text = np[3].trim()
      ensureClass(targetId)
      const nid = `__note_${targetId}_${pos}`
      nodeMap.set(nid, { id: nid, label: "", kind: "note", attrs: [], methods: [], noteText: text, noteTarget: targetId, notePos: pos })
      continue
    }

    // ── standalone class declaration (no body) ─────────────────────────
    const classOnlyRE = /^class\s+([A-Za-z_]\w*)\s*$/
    const co = line.match(classOnlyRE)
    if (co) { ensureClass(co[1]); continue }

    // ── relationship line ──────────────────────────────────────────────
    const edge = parseRelationshipLine(line)
    if (edge) {
      ensureClass(edge.source)
      ensureClass(edge.target)
      edges.push(edge)
      continue
    }

    // ── member assignment outside block:  ClassName : member ───────────
    const memberRE = /^([A-Za-z_]\w*)\s*:\s*(.+)$/
    const mem = line.match(memberRE)
    if (mem) {
      const cid = mem[1]
      const member = mem[2].trim()
      ensureClass(cid)
      const node = nodeMap.get(cid)!
      if (member.includes("(")) node.methods.push(member)
      else node.attrs.push(member)
    }
  }

  return { nodes: [...nodeMap.values()], edges, errors }
}

/* =========================================================================
   OTHER DIAGRAM PARSERS  (ER / Flowchart / Sequence)
   ========================================================================= */

function parseErDiagram(source: string): ParsedDiagram {
  const nodeMap = new Map<string, DiagramNode>()
  const edges: DiagramEdge[] = []
  const errors: string[] = []

  const entityRE = /([A-Za-z_]\w*)\s*\{([^}]*)\}/g
  let m: RegExpExecArray | null
  while ((m = entityRE.exec(source)) !== null) {
    const id = m[1]
    if (id === "erDiagram") continue
    nodeMap.set(id, { id, label: id, kind: "entity", attrs: m[2].split("\n").map(l => l.trim()).filter(Boolean).slice(0, 8), methods: [] })
  }

  for (const line of source.split("\n")) {
    const rel = line.trim().match(/^([A-Za-z_]\w*)\s+[|o{}-]+--[|o{}-]+\s+([A-Za-z_]\w*)\s*:\s*(.+)$/)
    if (rel) {
      const src = rel[1], tgt = rel[2], lbl = rel[3].trim()
      if (!nodeMap.has(src)) nodeMap.set(src, { id: src, label: src, kind: "entity", attrs: [], methods: [] })
      if (!nodeMap.has(tgt)) nodeMap.set(tgt, { id: tgt, label: tgt, kind: "entity", attrs: [], methods: [] })
      edges.push({ source: src, target: tgt, relType: "association", label: lbl, sourceMult: "", targetMult: "", markerAtSource: false })
    }
  }
  return { nodes: [...nodeMap.values()], edges, errors }
}

function parseFlowchart(source: string): ParsedDiagram {
  const nodeMap = new Map<string, DiagramNode>()
  const edges: DiagramEdge[] = []
  const errors: string[] = []

  // Extract node declarations
  const nodeRE = /([A-Za-z_]\w*)(\[([^\]]+)\]|\{([^}]+)\}|\(([^)]+)\))/g
  let m: RegExpExecArray | null
  while ((m = nodeRE.exec(source)) !== null) {
    const id = m[1]
    const raw = m[0]
    const label = m[3] || m[4] || m[5] || id
    const kind: DiagramNode["kind"] = raw.includes("{") ? "decision" : "process"
    if (!nodeMap.has(id)) nodeMap.set(id, { id, label, kind, attrs: [], methods: [] })
  }

  // Extract edges  A --> B or A -->|label| B
  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim()
    if (!line || line.startsWith("flowchart") || line.startsWith("graph")) continue
    // Split on -->  (may have |label|)
    const parts = line.split(/-->/)
    for (let i = 0; i < parts.length - 1; i++) {
      const srcId = (parts[i].match(/([A-Za-z_]\w*)\s*$/) || [])[1]
      if (!srcId) continue
      const rest = parts[i + 1]
      const lblM = rest.match(/^\|([^|]+)\|/)
      const lbl = lblM?.[1] || ""
      const tgtId = (rest.replace(/^\|[^|]*\|/, "").match(/^\s*([A-Za-z_]\w*)/) || [])[1]
      if (!tgtId || srcId === tgtId) continue
      if (!nodeMap.has(srcId)) nodeMap.set(srcId, { id: srcId, label: srcId, kind: "process", attrs: [], methods: [] })
      if (!nodeMap.has(tgtId)) nodeMap.set(tgtId, { id: tgtId, label: tgtId, kind: "process", attrs: [], methods: [] })
      edges.push({ source: srcId, target: tgtId, relType: "association", label: lbl, sourceMult: "", targetMult: "", markerAtSource: false })
    }
  }
  return { nodes: [...nodeMap.values()], edges, errors }
}

function parseSequenceDiagram(source: string): ParsedDiagram {
  const nodeMap = new Map<string, DiagramNode>()
  const edges: DiagramEdge[] = []
  const errors: string[] = []

  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim()
    if (!line || line.startsWith("sequenceDiagram")) continue

    const partRE = /^(?:participant|actor)\s+([A-Za-z_]\w*)/i
    const pm = line.match(partRE)
    if (pm) {
      const id = pm[1]
      const kind: DiagramNode["kind"] = line.toLowerCase().startsWith("actor") ? "actor" : "participant"
      nodeMap.set(id, { id, label: id, kind, attrs: [], methods: [] })
      continue
    }

    const msgRE = /^([A-Za-z_]\w*)\s*-[-]+>>?\s*([A-Za-z_]\w*)\s*:\s*(.+)$/
    const mm = line.match(msgRE)
    if (mm) {
      const src = mm[1], tgt = mm[2], lbl = mm[3].trim()
      if (!nodeMap.has(src)) nodeMap.set(src, { id: src, label: src, kind: "participant", attrs: [], methods: [] })
      if (!nodeMap.has(tgt)) nodeMap.set(tgt, { id: tgt, label: tgt, kind: "participant", attrs: [], methods: [] })
      edges.push({ source: src, target: tgt, relType: "dependency", label: lbl, sourceMult: "", targetMult: "", markerAtSource: false })
    }
  }
  return { nodes: [...nodeMap.values()], edges, errors }
}

function parseDiagramSource(toolId: string, source: string): ParsedDiagram {
  switch (toolId) {
    case "class-diagram-maker": return parseClassDiagram(source)
    case "er-diagram-maker": return parseErDiagram(source)
    case "flowchart-maker": return parseFlowchart(source)
    case "sequence-diagram-maker": return parseSequenceDiagram(source)
    default: return { nodes: [], edges: [], errors: [] }
  }
}

/* =========================================================================
   DIAGRAM ENGINE — LAYOUT
   ========================================================================= */

type Rect = { x: number; y: number; w: number; h: number }
type LayoutResult = { rects: Map<string, Rect>; canvasW: number; canvasH: number }

const LAYOUT = {
  CHAR_W: 7.2,
  PAD_H: 20,
  PAD_V: 10,
  LINE_H: 22,
  HEADER_H: 40,
  MIN_W: 160,
  H_GAP: 80,
  V_GAP: 90,
  CANVAS_PAD: 80,
  NOTE_H: 44,
  NOTE_MIN_W: 140,
}

function measureTextWidth(text: string): number {
  return text.length * LAYOUT.CHAR_W + LAYOUT.PAD_H * 2
}

function nodeWidth(node: DiagramNode): number {
  if (node.kind === "note") {
    return Math.max(LAYOUT.NOTE_MIN_W, measureTextWidth(node.noteText || ""))
  }
  const allTexts = [node.label, ...node.attrs, ...node.methods]
  return Math.max(LAYOUT.MIN_W, ...allTexts.map(measureTextWidth))
}

function nodeHeight(node: DiagramNode): number {
  if (node.kind === "note") return LAYOUT.NOTE_H
  const attrH = node.attrs.length > 0 ? node.attrs.length * LAYOUT.LINE_H + LAYOUT.PAD_V * 2 : LAYOUT.PAD_V
  const methH = node.methods.length > 0 ? node.methods.length * LAYOUT.LINE_H + LAYOUT.PAD_V * 2 : LAYOUT.PAD_V
  return LAYOUT.HEADER_H + attrH + methH
}

function layoutDiagram(parsed: ParsedDiagram): LayoutResult {
  const mainNodes = parsed.nodes.filter(n => n.kind !== "note")
  const noteNodes = parsed.nodes.filter(n => n.kind === "note")
  const rects = new Map<string, Rect>()

  if (mainNodes.length === 0) {
    return { rects, canvasW: 500, canvasH: 300 }
  }

  // ── Kahn's algorithm for topological layering ──────────────────────────
  const inDeg = new Map<string, number>()
  const outAdj = new Map<string, string[]>()
  mainNodes.forEach(n => { inDeg.set(n.id, 0); outAdj.set(n.id, []) })

  for (const edge of parsed.edges) {
    // For layout: parent should be above child.
    // In Mermaid `A <|-- B` (source=A parent, target=B child)
    //   → A should have lower layer → B depends on A
    // For composition/aggregation: owner (source) above owned (target)
    // For association/dependency: source above target
    const { source, target, relType } = edge
    if (!inDeg.has(source) || !inDeg.has(target)) continue

    inDeg.set(target, (inDeg.get(target) || 0) + 1)
    outAdj.get(source)!.push(target)
  }

  // BFS topological sort
  const layer = new Map<string, number>()
  const queue = mainNodes.filter(n => (inDeg.get(n.id) || 0) === 0).map(n => n.id)
  if (queue.length === 0 && mainNodes.length > 0) queue.push(mainNodes[0].id)
  queue.forEach(id => layer.set(id, 0))

  let head = 0
  while (head < queue.length) {
    const cur = queue[head++]
    const curL = layer.get(cur) ?? 0
    for (const next of outAdj.get(cur) || []) {
      const newL = curL + 1
      if ((layer.get(next) ?? 0) < newL) layer.set(next, newL)
      if (!queue.includes(next)) queue.push(next)
    }
  }
  mainNodes.forEach(n => { if (!layer.has(n.id)) layer.set(n.id, 0) })

  // Group nodes by layer
  const layerBuckets = new Map<number, DiagramNode[]>()
  for (const node of mainNodes) {
    const l = layer.get(node.id) ?? 0
    if (!layerBuckets.has(l)) layerBuckets.set(l, [])
    layerBuckets.get(l)!.push(node)
  }

  const sortedLayers = [...layerBuckets.keys()].sort((a, b) => a - b)

  // Compute per-layer total widths for centering
  const layerTotalW = new Map<number, number>()
  for (const l of sortedLayers) {
    const nodes = layerBuckets.get(l)!
    let total = 0
    nodes.forEach((n, i) => { total += nodeWidth(n); if (i < nodes.length - 1) total += LAYOUT.H_GAP })
    layerTotalW.set(l, total)
  }
  const maxLayerW = Math.max(...layerTotalW.values(), 400)

  // Assign Y per layer
  const layerY = new Map<number, number>()
  let curY = LAYOUT.CANVAS_PAD
  for (const l of sortedLayers) {
    layerY.set(l, curY)
    const maxH = Math.max(...layerBuckets.get(l)!.map(nodeHeight))
    curY += maxH + LAYOUT.V_GAP
  }

  // Assign X within each layer (centered)
  for (const l of sortedLayers) {
    const nodes = layerBuckets.get(l)!
    const totalW = layerTotalW.get(l)!
    let curX = LAYOUT.CANVAS_PAD + (maxLayerW - totalW) / 2
    const y = layerY.get(l)!
    for (const node of nodes) {
      const w = nodeWidth(node)
      const h = nodeHeight(node)
      rects.set(node.id, { x: curX, y, w, h })
      curX += w + LAYOUT.H_GAP
    }
  }

  // Place notes relative to their target
  for (const note of noteNodes) {
    const tid = note.noteTarget
    if (!tid || !rects.has(tid)) continue
    const pr = rects.get(tid)!
    const nw = nodeWidth(note)
    const nh = LAYOUT.NOTE_H
    const gap = 36
    let nx = pr.x, ny = pr.y

    switch (note.notePos) {
      case "top": nx = pr.x + (pr.w - nw) / 2; ny = pr.y - nh - gap; break
      case "bottom": nx = pr.x + (pr.w - nw) / 2; ny = pr.y + pr.h + gap; break
      case "left": nx = pr.x - nw - gap; ny = pr.y + (pr.h - nh) / 2; break
      case "right":
      default: nx = pr.x + pr.w + gap; ny = pr.y + (pr.h - nh) / 2; break
    }
    rects.set(note.id, { x: nx, y: ny, w: nw, h: nh })
  }

  // Canvas bounds
  let maxX = 0, maxY = 0
  rects.forEach(r => { maxX = Math.max(maxX, r.x + r.w); maxY = Math.max(maxY, r.y + r.h) })
  return {
    rects,
    canvasW: Math.max(maxX + LAYOUT.CANVAS_PAD, 500),
    canvasH: Math.max(maxY + LAYOUT.CANVAS_PAD, 300),
  }
}

/* =========================================================================
   DIAGRAM ENGINE — GEOMETRY
   ========================================================================= */

/** Returns the point on the border of rect `r` toward point `toward`. */
function borderPoint(r: Rect, toward: { x: number; y: number }): { x: number; y: number } {
  const cx = r.x + r.w / 2
  const cy = r.y + r.h / 2
  const dx = toward.x - cx
  const dy = toward.y - cy
  if (dx === 0 && dy === 0) return { x: cx, y: cy }

  const sx = r.w / 2
  const sy = r.h / 2
  // scale factor to reach border
  const scale = Math.min(Math.abs(sx / dx), Math.abs(sy / dy))
  return { x: cx + dx * scale, y: cy + dy * scale }
}

function rectCenter(r: Rect) { return { x: r.x + r.w / 2, y: r.y + r.h / 2 } }

/* =========================================================================
   DIAGRAM ENGINE — SVG RENDERING PRIMITIVES
   ========================================================================= */

const C = {
  canvasBg: "#0d1117",
  grid: "#161b22",
  nodeBg: "#161b27",
  nodeHeader: "#1e2235",
  nodeBorder: "#30364a",
  nodeDivider: "#252840",
  nameText: "#e2e8f0",
  memberText: "#8b95b0",
  noteBg: "#1e2235",
  noteBorder: "#3d4460",
  noteText: "#c8d0e8",
  edge: "#4a5470",
  edgeLabel: "#0f1420",
  edgeLabelBdr: "#3d4460",
  edgeLabelText: "#8b95b0",
  mult: "#6b7590",
}

function SvgClassNode({ node, rect, onMouseDown }: {
  node: DiagramNode
  rect: Rect
  onMouseDown: (id: string, e: React.MouseEvent) => void
}) {
  const { x, y, w, h } = rect
  const hasAttrs = node.attrs.length > 0
  const hasMethods = node.methods.length > 0
  const attrSectionH = hasAttrs
    ? node.attrs.length * LAYOUT.LINE_H + LAYOUT.PAD_V * 2
    : LAYOUT.PAD_V
  const methY = y + LAYOUT.HEADER_H + attrSectionH

  return (
    <g style={{ cursor: "grab" }} onMouseDown={e => onMouseDown(node.id, e)}>
      {/* shadow */}
      <rect x={x + 4} y={y + 5} width={w} height={h} rx={7} fill="rgba(0,0,0,0.35)" />
      {/* body */}
      <rect x={x} y={y} width={w} height={h} rx={7} fill={C.nodeBg} stroke={C.nodeBorder} strokeWidth="1.5" />
      {/* header bg */}
      <rect x={x} y={y} width={w} height={LAYOUT.HEADER_H} rx={7} fill={C.nodeHeader} />
      <rect x={x} y={y + LAYOUT.HEADER_H - 7} width={w} height={7} fill={C.nodeHeader} />
      {/* header divider */}
      <line x1={x} y1={y + LAYOUT.HEADER_H} x2={x + w} y2={y + LAYOUT.HEADER_H} stroke={C.nodeBorder} strokeWidth="1" />
      {/* class name */}
      <text x={x + w / 2} y={y + LAYOUT.HEADER_H / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill={C.nameText} fontWeight="700" fontSize="14"
        fontFamily="ui-sans-serif,system-ui,-apple-system,sans-serif">
        {node.label}
      </text>

      {/* attributes */}
      {hasAttrs && node.attrs.map((a, i) => (
        <text key={`a${i}`}
          x={x + LAYOUT.PAD_H}
          y={y + LAYOUT.HEADER_H + LAYOUT.PAD_V + i * LAYOUT.LINE_H + LAYOUT.LINE_H / 2}
          dominantBaseline="middle"
          fill={C.memberText} fontSize="11.5"
          fontFamily="'Cascadia Code','Fira Code','SF Mono',ui-monospace,monospace">
          {a}
        </text>
      ))}

      {/* divider attrs/methods */}
      {hasAttrs && hasMethods && (
        <line x1={x} y1={methY} x2={x + w} y2={methY} stroke={C.nodeDivider} strokeWidth="1" />
      )}

      {/* methods */}
      {hasMethods && node.methods.map((mth, i) => (
        <text key={`m${i}`}
          x={x + LAYOUT.PAD_H}
          y={methY + LAYOUT.PAD_V + i * LAYOUT.LINE_H + LAYOUT.LINE_H / 2}
          dominantBaseline="middle"
          fill={C.memberText} fontSize="11.5"
          fontFamily="'Cascadia Code','Fira Code','SF Mono',ui-monospace,monospace">
          {mth}
        </text>
      ))}
    </g>
  )
}

function SvgNoteNode({ node, rect, onMouseDown }: {
  node: DiagramNode
  rect: Rect
  onMouseDown: (id: string, e: React.MouseEvent) => void
}) {
  const { x, y, w, h } = rect
  return (
    <g style={{ cursor: "grab" }} onMouseDown={e => onMouseDown(node.id, e)}>
      <rect x={x + 3} y={y + 4} width={w} height={h} rx={8} fill="rgba(0,0,0,0.25)" />
      <rect x={x} y={y} width={w} height={h} rx={8} fill={C.noteBg} stroke={C.noteBorder} strokeWidth="1.2" />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle"
        fill={C.noteText} fontSize="12"
        fontFamily="ui-sans-serif,system-ui,sans-serif">
        {node.noteText}
      </text>
    </g>
  )
}

function SvgEdgeLabel({ cx, cy, label }: { cx: number; cy: number; label: string }) {
  const pw = label.length * 6.8 + 20
  const ph = 20
  return (
    <g>
      <rect x={cx - pw / 2} y={cy - ph / 2} width={pw} height={ph} rx={5}
        fill={C.edgeLabel} stroke={C.edgeLabelBdr} strokeWidth="1" />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fill={C.edgeLabelText} fontSize="11"
        fontFamily="ui-sans-serif,system-ui,sans-serif">
        {label}
      </text>
    </g>
  )
}

function SvgMult({ x, y, value }: { x: number; y: number; value: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
      fill={C.mult} fontSize="11"
      fontFamily="ui-monospace,monospace">
      {value}
    </text>
  )
}

/* =========================================================================
   DIAGRAM TOOL CONFIGS
   ========================================================================= */

type DiagramConfig = {
  title: string
  extension: string
  helper: string
  tips: string[]
  template: string
}

const DIAGRAM_CONFIGS: Record<string, DiagramConfig> = {
  "class-diagram-maker": {
    title: "Class Diagram Maker",
    extension: "mmd",
    helper: "Interactive UML Class Diagrams. Drag nodes to rearrange. Supports Inheritance, Composition, Aggregation, Association, Dependency.",
    tips: [
      "Inheritance:   `User <|-- Admin`  (triangle at User/parent)",
      "Composition:   `User *-- Address` (filled diamond at User/owner)",
      "Aggregation:   `User o-- Profile` (open diamond at User/owner)",
      "Association:   `User --> Order`   (arrow at Order/target)",
      "Dependency:    `Order ..> Address`(dashed arrow at Address)",
      "Multiplicity:  `User \"1\" --> \"*\" Order : places`",
      "Notes:         `note for User \"Base system entity\"`",
    ],
    template: `classDiagram

class User {
  +id: String
  +email: String
  -passwordHash: String
  +login(password: String): bool
  +getProfile(): Profile
}

class Admin {
  +manageUsers(): void
  +deleteUser(userId: String): void
}

class Order {
  +id: String
  -total: Number
  +calculateTotal(): Number
  +addItem(item: OrderItem): void
}

class Address {
  +city: String
  +country: String
}

class Profile {
  +name: String
  +phone: String
}

class OrderItem {
  +productId: String
  +quantity: Number
  +price: Number
}

note for User "Base system entity"
note for Admin "Has elevated permissions"

User <|-- Admin
User "1" --> "1" Profile : has
User "1" --> "*" Order : places
User "1" *-- "1" Address : lives at
Order "1" --> "*" OrderItem : contains
Order ..> Address : ships to`,
  },
  "er-diagram-maker": {
    title: "ER Diagram Maker",
    extension: "mmd",
    helper: "Entity-Relationship diagrams using Mermaid erDiagram syntax.",
    tips: ["Start with `erDiagram`.", "Add relationships: `users ||--o{ orders : places`"],
    template: `erDiagram\nusers {\n  uuid id PK\n  string email\n}\norders {\n  uuid id PK\n  uuid user_id FK\n}\nusers ||--o{ orders : places`,
  },
  "flowchart-maker": {
    title: "Flowchart Maker",
    extension: "mmd",
    helper: "Flowcharts using Mermaid syntax. Drag nodes to rearrange.",
    tips: ["Start with `flowchart TD`.", "Use `A[Label] --> B{Decision}` style links."],
    template: `flowchart TD\nA[Start] --> B{Valid input?}\nB -->|Yes| C[Process]\nB -->|No| D[Show error]\nC --> E[Save]\nD --> A\nE --> F[Done]`,
  },
  "sequence-diagram-maker": {
    title: "Sequence Diagram Maker",
    extension: "mmd",
    helper: "Sequence diagrams for actor/service interactions.",
    tips: ["Start with `sequenceDiagram`.", "Use `User->>API: message` for arrows."],
    template: `sequenceDiagram\nactor User\nparticipant API\nUser->>API: POST /orders\nAPI-->>User: 201 Created`,
  },
}

type DiagramToolId = keyof typeof DIAGRAM_CONFIGS

/* =========================================================================
   DIAGRAM WORKSPACE COMPONENT
   ========================================================================= */

function DiagramWorkspace({ toolId, config, copy }: {
  toolId: DiagramToolId
  config: DiagramConfig
  copy: (v: string) => Promise<boolean>
}) {
  const [source, setSource] = useState(config.template)
  const [zoom, setZoom] = useState(1)
  const [exporting, setExp] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Parse + layout ────────────────────────────────────────────────────
  const parsed = useMemo(() => parseDiagramSource(toolId, source), [toolId, source])
  const layout = useMemo(() => layoutDiagram(parsed), [parsed])

  // ── Draggable positions (clone from layout on change) ─────────────────
  const [rects, setRects] = useState<Map<string, Rect>>(new Map())
  useEffect(() => { setRects(new Map(layout.rects)) }, [layout])

  const dragging = useRef<string | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  // ── Zoom helpers ──────────────────────────────────────────────────────
  const zoomIn = useCallback(() => setZoom(z => Math.min(z + 0.2, 3)), [])
  const zoomOut = useCallback(() => setZoom(z => Math.max(z - 0.2, 0.2)), [])
  const fitView = useCallback(() => {
    if (!containerRef.current) return
    const cw = containerRef.current.clientWidth - 24
    const ch = containerRef.current.clientHeight - 24
    setZoom(Math.min(cw / layout.canvasW, ch / layout.canvasH, 2))
  }, [layout])
  useEffect(() => { fitView() }, [fitView])

  // ── Drag handlers ─────────────────────────────────────────────────────
  const onMouseDown = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    dragging.current = id
    const r = rects.get(id)
    if (!r || !svgRef.current) return
    const pt = svgRef.current.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const sp = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse())
    dragOffset.current = { x: sp.x - r.x, y: sp.y - r.y }
  }, [rects])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current || !svgRef.current) return
    const pt = svgRef.current.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const sp = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse())
    const id = dragging.current
    setRects(prev => {
      const next = new Map(prev)
      const r = next.get(id)
      if (r) next.set(id, { ...r, x: sp.x - dragOffset.current.x, y: sp.y - dragOffset.current.y })
      return next
    })
  }, [])

  const onMouseUp = useCallback(() => { dragging.current = null }, [])

  // ── Export PNG ────────────────────────────────────────────────────────
  const exportPng = useCallback(async () => {
    if (!svgRef.current || exporting) return
    setExp(true)
    try {
      const scale = 2
      const clone = svgRef.current.cloneNode(true) as SVGSVGElement
      clone.setAttribute("width", String(layout.canvasW * scale))
      clone.setAttribute("height", String(layout.canvasH * scale))
      const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const img = await loadImage(url)
      const cv = document.createElement("canvas")
      cv.width = layout.canvasW * scale; cv.height = layout.canvasH * scale
      const ctx = cv.getContext("2d")!
      ctx.fillStyle = C.canvasBg
      ctx.fillRect(0, 0, cv.width, cv.height)
      ctx.drawImage(img, 0, 0, cv.width, cv.height)
      const outBlob = await canvasToBlob(cv, "image/png")
      downloadBlob(outBlob, `${toolId}.png`)
      toast.success("Exported as PNG")
      URL.revokeObjectURL(url)
    } catch { toast.error("Export failed") }
    finally { setExp(false) }
  }, [layout, toolId, exporting])

  // ── Dynamic SVG size (accounts for dragged nodes) ─────────────────────
  let svgW = layout.canvasW, svgH = layout.canvasH
  rects.forEach(r => {
    svgW = Math.max(svgW, r.x + r.w + LAYOUT.CANVAS_PAD)
    svgH = Math.max(svgH, r.y + r.h + LAYOUT.CANVAS_PAD)
  })

  const hasContent = parsed.nodes.length > 0

  return (
    <div className="grid gap-6">
      {/* ── Editor ── */}
      <ToolCard title={config.title}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{config.helper}</p>
          <Textarea value={source} onChange={e => setSource(e.target.value)}
            className="min-h-[360px] font-mono text-sm" />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setSource(config.template)}>
              <RefreshCw className="mr-2 h-4 w-4" />Load Sample
            </Button>
            <Button variant="outline" onClick={() => copy(source)}>
              <Copy className="mr-2 h-4 w-4" />Copy
            </Button>
            <Button variant="outline"
              onClick={() => downloadBlob(new Blob([source], { type: "text/plain" }), `${toolId}.${config.extension}`)}>
              <Download className="mr-2 h-4 w-4" />Download
            </Button>
          </div>
          {/* Validation errors */}
          {parsed.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{parsed.errors.join(" · ")}</AlertDescription>
            </Alert>
          )}
        </div>
      </ToolCard>

      {/* ── Canvas ── */}
      <ToolCard title="Canvas Preview">
        {/* Toolbar */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={zoomOut}><Minus className="h-3.5 w-3.5" /></Button>
          <span className="min-w-[3.2rem] text-center text-xs font-medium tabular-nums">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={zoomIn}><Plus className="h-3.5 w-3.5" /></Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={fitView}>
            <Maximize2 className="h-3.5 w-3.5" />Fit
          </Button>
          <div className="ml-auto">
            <Button variant="default" size="sm" className="h-8 text-xs gap-1.5"
              onClick={exportPng} disabled={exporting || !hasContent}>
              {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
              Export PNG
            </Button>
          </div>
        </div>

        {/* Canvas container */}
        <div ref={containerRef} className="relative overflow-auto rounded-xl border shadow-inner"
          style={{ minHeight: 520, background: C.canvasBg }}>
          {hasContent ? (
            <svg ref={svgRef}
              width={svgW * zoom} height={svgH * zoom}
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="block select-none"
              onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>

              <defs>
                {/* Grid */}
                <pattern id="pg" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke={C.grid} strokeWidth="0.5" />
                </pattern>

                {/*
                  ── MARKERS ────────────────────────────────────────────
                  Naming convention:
                    mk-inh-e  = inheritance, end (triangle, open, at end of path)
                    mk-inh-s  = inheritance, start (triangle, open, at start of path)
                    mk-comp-s = composition, start (filled diamond)
                    mk-agg-s  = aggregation, start (open diamond)
                    mk-arr-e  = association arrow, end
                    mk-dep-e  = dependency arrow (open), end
                */}

                {/* Hollow triangle — end of path (inheritance markerAtSource=false) */}
                <marker id="mk-inh-e" markerWidth="14" markerHeight="12"
                  refX="13" refY="6" orient="auto">
                  <polygon points="0 0,13 6,0 12"
                    fill={C.canvasBg} stroke={C.edge} strokeWidth="1.8" />
                </marker>
                {/* Hollow triangle — start of path (inheritance markerAtSource=true) */}
                <marker id="mk-inh-s" markerWidth="14" markerHeight="12"
                  refX="1" refY="6" orient="auto-start-reverse">
                  <polygon points="0 0,13 6,0 12"
                    fill={C.canvasBg} stroke={C.edge} strokeWidth="1.8" />
                </marker>

                {/* Filled diamond — start of path (composition) */}
                <marker id="mk-comp-s" markerWidth="18" markerHeight="12"
                  refX="1" refY="6" orient="auto-start-reverse">
                  <polygon points="9 0,18 6,9 12,0 6" fill={C.edge} />
                </marker>
                {/* Filled diamond — end of path */}
                <marker id="mk-comp-e" markerWidth="18" markerHeight="12"
                  refX="17" refY="6" orient="auto">
                  <polygon points="9 0,18 6,9 12,0 6" fill={C.edge} />
                </marker>

                {/* Open diamond — start of path (aggregation) */}
                <marker id="mk-agg-s" markerWidth="18" markerHeight="12"
                  refX="1" refY="6" orient="auto-start-reverse">
                  <polygon points="9 0,18 6,9 12,0 6"
                    fill={C.canvasBg} stroke={C.edge} strokeWidth="1.5" />
                </marker>
                {/* Open diamond — end of path */}
                <marker id="mk-agg-e" markerWidth="18" markerHeight="12"
                  refX="17" refY="6" orient="auto">
                  <polygon points="9 0,18 6,9 12,0 6"
                    fill={C.canvasBg} stroke={C.edge} strokeWidth="1.5" />
                </marker>

                {/* Filled arrow — end (association) */}
                <marker id="mk-arr-e" markerWidth="10" markerHeight="8"
                  refX="9" refY="4" orient="auto">
                  <polygon points="0 0,10 4,0 8" fill={C.edge} />
                </marker>

                {/* Open arrow — end (dependency) */}
                <marker id="mk-dep-e" markerWidth="10" markerHeight="8"
                  refX="9" refY="4" orient="auto">
                  <polyline points="0 0,10 4,0 8"
                    fill="none" stroke={C.edge} strokeWidth="1.5" />
                </marker>
              </defs>

              {/* Background grid */}
              <rect width="100%" height="100%" fill="url(#pg)" />

              {/* ── Note connector lines (behind everything) ── */}
              {parsed.nodes.filter(n => n.kind === "note").map(note => {
                const nr = rects.get(note.id)
                const pr = rects.get(note.noteTarget || "")
                if (!nr || !pr) return null
                const nc = rectCenter(nr)
                const pc = rectCenter(pr)
                const p1 = borderPoint(nr, pc)
                const p2 = borderPoint(pr, nc)
                return (
                  <line key={`nc-${note.id}`}
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={C.noteBorder} strokeWidth="1.2" strokeDasharray="5,4" />
                )
              })}

              {/* ── Edges ── */}
              {parsed.edges.map((edge, idx) => {
                const sr = rects.get(edge.source)
                const tr = rects.get(edge.target)
                if (!sr || !tr) return null

                const sc = rectCenter(sr)
                const tc = rectCenter(tr)
                const p1 = borderPoint(sr, tc)
                const p2 = borderPoint(tr, sc)

                // Slight S-curve to avoid overlap on parallel edges
                const mx = (p1.x + p2.x) / 2
                const my = (p1.y + p2.y) / 2
                const dx = p2.x - p1.x
                const dy = p2.y - p1.y
                const len = Math.sqrt(dx * dx + dy * dy) || 1
                // Offset perpendicular — alternates sign by index for parallel edges
                const sign = idx % 2 === 0 ? 1 : -1
                const off = Math.min(len * 0.08, 18) * sign
                const cpx = mx - (dy / len) * off
                const cpy = my + (dx / len) * off

                // ── Marker selection ───────────────────────────────────
                let markerStart = ""
                let markerEnd = ""
                let dash = "none"

                switch (edge.relType) {
                  case "inheritance":
                    // markerAtSource=true means triangle at SOURCE (parent) end = start of path
                    if (edge.markerAtSource) markerStart = "url(#mk-inh-s)"
                    else markerEnd = "url(#mk-inh-e)"
                    break
                  case "composition":
                    if (edge.markerAtSource) markerStart = "url(#mk-comp-s)"
                    else markerEnd = "url(#mk-comp-e)"
                    break
                  case "aggregation":
                    if (edge.markerAtSource) markerStart = "url(#mk-agg-s)"
                    else markerEnd = "url(#mk-agg-e)"
                    break
                  case "dependency":
                    markerEnd = "url(#mk-dep-e)"; dash = "6,4"
                    break
                  case "realization":
                    if (edge.markerAtSource) markerStart = "url(#mk-inh-s)"
                    else markerEnd = "url(#mk-inh-e)"
                    dash = "6,4"
                    break
                  case "undirected":
                    break
                  default:
                    markerEnd = "url(#mk-arr-e)"
                }

                // Multiplicity offset — near source/target ends
                const mult_s_x = p1.x + (cpx - p1.x) * 0.22
                const mult_s_y = p1.y + (cpy - p1.y) * 0.22 - 11
                const mult_t_x = p2.x + (cpx - p2.x) * 0.22
                const mult_t_y = p2.y + (cpy - p2.y) * 0.22 - 11

                return (
                  <g key={`e${idx}`}>
                    <path
                      d={`M ${p1.x} ${p1.y} Q ${cpx} ${cpy} ${p2.x} ${p2.y}`}
                      fill="none" stroke={C.edge} strokeWidth="1.8"
                      strokeDasharray={dash}
                      markerStart={markerStart}
                      markerEnd={markerEnd}
                    />
                    {edge.sourceMult && <SvgMult x={mult_s_x} y={mult_s_y} value={edge.sourceMult} />}
                    {edge.targetMult && <SvgMult x={mult_t_x} y={mult_t_y} value={edge.targetMult} />}
                    {edge.label && <SvgEdgeLabel cx={cpx} cy={cpy} label={edge.label} />}
                  </g>
                )
              })}

              {/* ── Note nodes ── */}
              {parsed.nodes.filter(n => n.kind === "note").map(node => {
                const r = rects.get(node.id)
                if (!r) return null
                return <SvgNoteNode key={node.id} node={node} rect={r} onMouseDown={onMouseDown} />
              })}

              {/* ── Class/process/entity nodes (on top) ── */}
              {parsed.nodes.filter(n => n.kind !== "note").map(node => {
                const r = rects.get(node.id)
                if (!r) return null
                return <SvgClassNode key={node.id} node={node} rect={r} onMouseDown={onMouseDown} />
              })}
            </svg>
          ) : (
            <div className="flex h-full min-h-[520px] flex-col items-center justify-center">
              <div className="rounded-full bg-slate-800 p-4">
                <Maximize2 className="h-6 w-6 text-slate-500" />
              </div>
              <p className="mt-4 font-medium text-slate-400">No elements detected</p>
              <p className="mt-1 text-sm text-slate-500">Enter valid diagram syntax in the editor above.</p>
            </div>
          )}
        </div>
      </ToolCard>

      {/* ── Raw output ── */}
      <ToolCard title="Source Output">
        <ResultBox value={source} filename={`${toolId}.${config.extension}`} copy={copy} />
      </ToolCard>
    </div>
  )
}

/* =========================================================================
   DEVELOPER TOOLS — ROOT COMPONENT
   ========================================================================= */

function DeveloperTools({ toolId }: { toolId: string }) {
  const { copy } = useClipboard()
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [previewHtml, setPreviewHtml] = useState("")
  const [error, setError] = useState("")
  const [fileOutput, setFileOutput] = useState("")
  const [mimeType, setMimeType] = useState("text/plain")
  const [schedulePreview, setSchedulePreview] = useState<string[]>([])

  // ── Diagram tools ──────────────────────────────────────────────────────
  const diagramConfig = DIAGRAM_CONFIGS[toolId as DiagramToolId]
  if (diagramConfig) {
    return (
      <DiagramWorkspace
        toolId={toolId as DiagramToolId}
        config={diagramConfig}
        copy={copy}
      />
    )
  }

  // ── File-based tools ───────────────────────────────────────────────────
  if (toolId === "base64-image-encoder" || toolId === "data-uri-generator") {
    const title = toolId === "base64-image-encoder" ? "Encode Image" : "Generate Data URI"
    const handleFiles = async (files: File[]) => {
      const file = files[0]
      if (!file) return
      const dataUrl = await readFileAsDataUrl(file)
      if (toolId === "base64-image-encoder") setFileOutput(dataUrl.split(",")[1] || "")
      else { setFileOutput(dataUrl); setMimeType(file.type || mimeType) }
    }
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title={title}>
          <div className="space-y-4">
            <UploadDropzone label="Drop a file here" helper="Images and small assets work best."
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".svg"] }} onFiles={handleFiles} />
            {toolId === "data-uri-generator" && (
              <div><Label>MIME Type Override</Label>
                <Input value={mimeType} onChange={e => setMimeType(e.target.value)} className="mt-2" />
              </div>
            )}
          </div>
        </ToolCard>
        <ToolCard title="Encoded Output">
          <ResultBox value={fileOutput}
            filename={toolId === "base64-image-encoder" ? "image-base64.txt" : "data-uri.txt"}
            copy={copy} />
        </ToolCard>
      </div>
    )
  }

  // ── Text transform tools ───────────────────────────────────────────────
  useEffect(() => {
    const run = async () => {
      try {
        setError(""); setPreviewHtml(""); setSchedulePreview([])
        if (!input.trim() && !fileOutput) { setOutput(""); return }
        if (toolId === "markdown-to-html") { const raw = await marked.parse(input); const safe = DOMPurify.sanitize(raw); setPreviewHtml(safe); setOutput(safe); return }
        if (toolId === "html-to-markdown") { setOutput(htmlToMarkdown(input)); return }
        if (toolId === "xml-formatter") { setOutput(formatXml(input)); return }
        if (toolId === "json-to-xml") { const p = safeJsonParse(input); if (p.error) throw new Error(p.error); setOutput(formatXml(`<?xml version="1.0"?>${jsonToXmlValue(p.data, "root")}`)); return }
        if (toolId === "sql-to-json") { setOutput(JSON.stringify(parseSqlInsert(input), null, 2)); return }
        if (toolId === "log-formatter") { setOutput(prettifyLogs(input)); return }
        if (toolId === "env-parser") { setOutput(JSON.stringify(parseEnv(input), null, 2)); return }
        if (toolId === "cron-parser") {
          const expr = CronExpressionParser.parse(input || "* * * * *")
          const upcoming = Array.from({ length: 5 }, () => expr.next().toString())
          setSchedulePreview(upcoming); setOutput(upcoming.join("\n")); return
        }
        setOutput("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to process the input.")
      }
    }
    run()
  }, [input, fileOutput, toolId])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolCard title="Input">
        <div className="space-y-4">
          <Textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={`Paste content for ${slugToWords(toolId).toLowerCase()}...`}
            className="min-h-[320px] font-mono text-sm" />
          {toolId === "cron-parser" && (
            <p className="text-sm text-muted-foreground">Example: <code>*/15 * * * *</code></p>
          )}
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
            {previewHtml && (
              <div className="rounded-xl border bg-background p-4"
                dangerouslySetInnerHTML={{ __html: previewHtml }} />
            )}
            {schedulePreview.length > 0 && (
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="mb-2 text-sm font-medium">Upcoming runs</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {schedulePreview.map(e => <li key={e}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </ToolCard>
    </div>
  )
}

export default DeveloperTools
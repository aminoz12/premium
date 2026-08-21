"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, UnderlineType, Footer, PageNumber,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  VerticalAlign, LevelFormat
} from "docx"
import { Button } from "@/components/ui/button"
import { ToolLayout } from "@/components/layout/tool-layout"
import {
  Download, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Heading1, Heading2, Heading3, Type,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  CheckCircle2, Trash2, Undo, Redo, Indent, Outdent,
  Palette, Highlighter, Table as TableIcon, Search, Save,
  ZoomIn, ZoomOut, RotateCcw
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExportOptions {
  fontSize: number
  font: string
  pageSize: "a4" | "letter"
  includePageNumbers: boolean
  includeDate: boolean
}

const FONT_OPTIONS = [
  "Calibri", "Arial", "Times New Roman", "Georgia",
  "Cambria", "Verdana", "Courier New"
]
const FONT_SIZE_OPTIONS = [9, 10, 11, 12, 14, 16, 18, 24]

const PAGE_SIZES = {
  a4:     { width: 11906, height: 16838 },
  letter: { width: 12240, height: 15840 },
}

const TEXT_COLORS = [
  { hex: "000000", css: "#000000", label: "Black" },
  { hex: "1F4E79", css: "#1F4E79", label: "Dark Blue" },
  { hex: "2E75B6", css: "#2E75B6", label: "Blue" },
  { hex: "C00000", css: "#C00000", label: "Red" },
  { hex: "7030A0", css: "#7030A0", label: "Purple" },
  { hex: "375623", css: "#375623", label: "Dark Green" },
  { hex: "70AD47", css: "#70AD47", label: "Green" },
  { hex: "ED7D31", css: "#ED7D31", label: "Orange" },
  { hex: "FFC000", css: "#FFC000", label: "Gold" },
  { hex: "595959", css: "#595959", label: "Gray" },
]

const HIGHLIGHT_COLORS = [
  { hex: "FFFF00", css: "#FFFF00", label: "Yellow" },
  { hex: "00FF00", css: "#00FF00", label: "Green" },
  { hex: "00FFFF", css: "#00FFFF", label: "Cyan" },
  { hex: "FF69B4", css: "#FF69B4", label: "Pink" },
  { hex: "FFA500", css: "#FFA500", label: "Orange" },
  { hex: "ADD8E6", css: "#ADD8E6", label: "Light Blue" },
]

const GEO_CTA: Record<string, string> = {
  US: "Trusted by 50,000+ US professionals — create Word docs instantly, free.",
  GB: "Create polished Word documents in seconds — 100% private & free for UK users.",
  CA: "Instant .docx generation — no signup required for Canadian users.",
  AU: "Professional document formatting made simple for Australian professionals.",
  IN: "Fastest free text-to-Word converter — used by thousands in India daily.",
  MA: "Convertisseur texte en Word gratuit et sécurisé — Maroc.",
  FR: "Créez des documents Word formatés instantanément — 100% gratuit.",
  DEFAULT: "Generate professional .docx documents instantly — free, private, no account needed.",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cssColorToHex(css: string): string | undefined {
  if (!css || css === "inherit" || css === "initial" || css === "") return undefined
  if (css.startsWith("#")) {
    const h = css.replace("#", "").toUpperCase()
    return h === "000000" ? undefined : h
  }
  const m = css.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
  if (m) {
    const hex = [m[1], m[2], m[3]]
      .map(n => parseInt(n).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
    return hex === "000000" ? undefined : hex
  }
  return undefined
}

type DocChild = Paragraph | Table

interface RunStyle {
  bold: boolean
  italic: boolean
  underline: boolean
  strike: boolean
  color?: string
  fontSize: number
  font: string
}

function buildRuns(node: Node, style: RunStyle): TextRun[] {
  const runs: TextRun[] = []
  node.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? ""
      if (!text) return
      runs.push(new TextRun({
        text,
        bold: style.bold || undefined,
        italics: style.italic || undefined,
        underline: style.underline ? { type: UnderlineType.SINGLE } : undefined,
        strike: style.strike || undefined,
        font: style.font,
        size: style.fontSize * 2,
        color: style.color,
      }))
      return
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return
    const el = child as HTMLElement
    const tag = el.tagName.toLowerCase()
    const next: RunStyle = { ...style }
    if (tag === "b" || tag === "strong") next.bold = true
    if (tag === "i" || tag === "em") next.italic = true
    if (tag === "u") next.underline = true
    if (tag === "s" || tag === "del" || tag === "strike") next.strike = true
    const c = cssColorToHex(el.style?.color ?? "")
    if (c) next.color = c
    runs.push(...buildRuns(el, next))
  })
  return runs
}

function htmlToDocxChildren(html: string, opts: ExportOptions): DocChild[] {
  if (typeof window === "undefined") return []

  const container = document.createElement("div")
  container.innerHTML = html
  const results: DocChild[] = []
  const basePt = opts.fontSize
  const baseSize = basePt * 2

  const defaultStyle: RunStyle = {
    bold: false, italic: false, underline: false, strike: false,
    fontSize: basePt, font: opts.font,
  }

  const makeRun = (text: string, extra: Partial<{
    bold: boolean; italic: boolean; size: number; color: string
  }> = {}) => new TextRun({
    text,
    font: opts.font,
    size: extra.size ?? baseSize,
    bold: extra.bold,
    italics: extra.italic,
    color: extra.color,
  })

  const getAlign = (el: HTMLElement) => {
    const ta = el.style?.textAlign
    if (ta === "center")  return AlignmentType.CENTER
    if (ta === "right")   return AlignmentType.RIGHT
    if (ta === "justify") return AlignmentType.JUSTIFIED
    return AlignmentType.LEFT
  }

  // ── FIX 1: ITableWidthProperties uses `size` + `type`, NOT `value` ────────
  function buildTableCell(cell: Element): TableCell {
    const isHeader = cell.tagName.toLowerCase() === "th"
    const text = cell.textContent?.trim() || " "
    return new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({
            text,
            font: opts.font,
            size: baseSize,
            bold: isHeader || undefined,
          })],
        }),
      ],
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
        left:   { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
        right:  { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
      },
      verticalAlign: VerticalAlign.CENTER,
      ...(isHeader
        ? { shading: { fill: "F2F2F2", color: "auto", type: "clear" } }
        : {}
      ),
    })
  }

  function processElement(el: Element): void {
    const tag = el.tagName.toLowerCase()

    // ── TABLE ──────────────────────────────────────────────────────────────
    if (tag === "table") {
      const rowEls = Array.from(el.querySelectorAll("tr"))
      if (!rowEls.length) return

      let maxCols = 0
      rowEls.forEach(r => {
        const c = r.querySelectorAll("td,th").length
        if (c > maxCols) maxCols = c
      })
      if (!maxCols) return

      const colW = Math.floor(8640 / maxCols)

      const tableRows: TableRow[] = rowEls.map(row => {
        const cellEls = Array.from(row.querySelectorAll("td,th"))
        const cells: TableCell[] = cellEls.map(buildTableCell)

        // Pad to maxCols
        while (cells.length < maxCols) {
          cells.push(new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: " ", font: opts.font, size: baseSize })],
            })],
            borders: {
              top:    { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
              left:   { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
              right:  { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
            },
          }))
        }
        return new TableRow({ children: cells })
      })

      // Spacer before
      results.push(new Paragraph({ children: [new TextRun({ text: "" })] }))

      // ── FIX: use `size` not `value` for ITableWidthProperties ─────────
      results.push(new Table({
        rows: tableRows,
        width: { size: 8640, type: WidthType.DXA },   // ← was { value: 8640, type: ... }
        columnWidths: Array(maxCols).fill(colW),
      }))

      // Spacer after
      results.push(new Paragraph({ children: [new TextRun({ text: "" })] }))
      return
    }

    // ── HEADINGS ───────────────────────────────────────────────────────────
    if (tag === "h1") {
      const runs = buildRuns(el, { ...defaultStyle, bold: true })
      results.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: getAlign(el as HTMLElement),
        spacing: { before: 400, after: 200 },
        children: runs.length
          ? runs
          : [makeRun(el.textContent || " ", { bold: true, size: baseSize * 2 })],
      }))
      return
    }

    if (tag === "h2") {
      const runs = buildRuns(el, { ...defaultStyle, bold: true })
      results.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: getAlign(el as HTMLElement),
        spacing: { before: 320, after: 160 },
        children: runs.length
          ? runs
          : [makeRun(el.textContent || " ", { bold: true, size: Math.round(baseSize * 1.5) })],
      }))
      return
    }

    if (tag === "h3") {
      const runs = buildRuns(el, { ...defaultStyle, bold: true })
      results.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        alignment: getAlign(el as HTMLElement),
        spacing: { before: 240, after: 120 },
        children: runs.length
          ? runs
          : [makeRun(el.textContent || " ", { bold: true, size: Math.round(baseSize * 1.25) })],
      }))
      return
    }

    // ── LISTS ──────────────────────────────────────────────────────────────
    if (tag === "ul") {
      Array.from(el.children).forEach(li => {
        if (li.tagName.toLowerCase() !== "li") return
        const clone = li.cloneNode(true) as HTMLElement
        clone.querySelectorAll("ul,ol").forEach(n => n.remove())
        const runs = buildRuns(clone, defaultStyle)
        results.push(new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          children: runs.length ? runs : [makeRun(clone.textContent || " ")],
        }))
      })
      return
    }

    if (tag === "ol") {
      Array.from(el.children).forEach(li => {
        if (li.tagName.toLowerCase() !== "li") return
        const clone = li.cloneNode(true) as HTMLElement
        clone.querySelectorAll("ul,ol").forEach(n => n.remove())
        const runs = buildRuns(clone, defaultStyle)
        results.push(new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          children: runs.length ? runs : [makeRun(clone.textContent || " ")],
        }))
      })
      return
    }

    // ── PARAGRAPH / DIV ────────────────────────────────────────────────────
    if (tag === "p" || tag === "div") {
      const hasBlock = Array.from(el.children).some(c =>
        ["table","ul","ol","h1","h2","h3","div","p","blockquote"]
          .includes(c.tagName.toLowerCase())
      )
      if (hasBlock) {
        Array.from(el.childNodes).forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            processElement(child as Element)
          } else if (child.nodeType === Node.TEXT_NODE) {
            const t = child.textContent?.trim()
            if (t) results.push(new Paragraph({
              spacing: { after: 160 },
              children: [makeRun(t)],
            }))
          }
        })
        return
      }
      const runs = buildRuns(el, defaultStyle)
      results.push(new Paragraph({
        alignment: getAlign(el as HTMLElement),
        spacing: { after: 160 },
        children: runs.length ? runs : [makeRun(" ")],
      }))
      return
    }

    if (tag === "br") {
      results.push(new Paragraph({ children: [makeRun(" ")] }))
      return
    }

    if (tag === "blockquote") {
      const runs = buildRuns(el, { ...defaultStyle, italic: true })
      results.push(new Paragraph({
        indent: { left: 720 },
        spacing: { after: 160 },
        children: runs.length ? runs : [makeRun(el.textContent || " ", { italic: true })],
      }))
      return
    }

    Array.from(el.children).forEach(processElement)
  }

  Array.from(container.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      processElement(node as Element)
    } else if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim()
      if (t) results.push(new Paragraph({ children: [makeRun(t)] }))
    }
  })

  if (results.length === 0) {
    results.push(new Paragraph({
      children: [new TextRun({
        text: container.textContent || " ",
        font: opts.font,
        size: baseSize,
      })],
    }))
  }

  if (!(results[results.length - 1] instanceof Paragraph)) {
    results.push(new Paragraph({ children: [new TextRun({ text: "" })] }))
  }

  return results
}

// ─── UI Components ────────────────────────────────────────────────────────────

function TBtn({ title, onClick, children }: {
  title: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className="w-8 h-8 flex items-center justify-center rounded transition-all
        text-gray-700 dark:text-gray-200
        hover:bg-gray-200 dark:hover:bg-gray-600
        border border-transparent
        hover:border-gray-300 dark:hover:border-gray-500"
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1 self-center flex-shrink-0" />
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-2 border-r border-gray-200 dark:border-gray-600 last:border-0">
      <div className="flex items-center gap-0.5 flex-wrap">{children}</div>
      <span className="text-[8px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TextToWordPage() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading]             = useState(false)
  const [success, setSuccess]             = useState(false)
  const [wordCount, setWordCount]         = useState(0)
  const [charCount, setCharCount]         = useState(0)
  const [isEmpty, setIsEmpty]             = useState(true)
  const [geoCTA, setGeoCTA]               = useState(GEO_CTA.DEFAULT)
  const [zoom, setZoom]                   = useState(100)
  const [showColorMenu, setShowColorMenu] = useState(false)
  const [showHlMenu, setShowHlMenu]       = useState(false)
  const [showTableDlg, setShowTableDlg]   = useState(false)
  const [showFRDlg, setShowFRDlg]         = useState(false)
  const [tableRows, setTableRows]         = useState(3)
  const [tableCols, setTableCols]         = useState(3)
  const [findVal, setFindVal]             = useState("")
  const [replaceVal, setReplaceVal]       = useState("")
  const [lastSaved, setLastSaved]         = useState<Date | null>(null)

  const [opts, setOpts] = useState<ExportOptions>({
    fontSize: 12,
    font: "Calibri",
    pageSize: "a4",
    includePageNumbers: true,
    includeDate: false,
  })

  // ── stats ──────────────────────────────────────────────────────────────────
  const updateStats = useCallback(() => {
    const el = editorRef.current
    if (!el) return
    const text = el.innerText ?? ""
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
    setCharCount(text.length)
    setIsEmpty(!text.trim())
  }, [])

  // ── auto-save ──────────────────────────────────────────────────────────────
  const save = useCallback(() => {
    if (!editorRef.current) return
    try {
      localStorage.setItem("ttwDraft", editorRef.current.innerHTML)
      setLastSaved(new Date())
    } catch (_) {}
  }, [])

  useEffect(() => {
    try {
      const d = localStorage.getItem("ttwDraft")
      if (d && editorRef.current) {
        editorRef.current.innerHTML = d
        updateStats()
      }
    } catch (_) {}
  }, [updateStats])

  useEffect(() => {
    const id = setInterval(save, 5000)
    return () => clearInterval(id)
  }, [save])

  // ── GEO ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""
      const map: [string, string][] = [
        ["America/New_York", "US"], ["America/Los_Angeles", "US"],
        ["America/Chicago", "US"], ["Europe/London", "GB"],
        ["America/Toronto", "CA"], ["America/Vancouver", "CA"],
        ["Australia/Sydney", "AU"], ["Australia/Melbourne", "AU"],
        ["Asia/Kolkata", "IN"], ["Africa/Casablanca", "MA"],
        ["Europe/Paris", "FR"],
      ]
      for (const [k, v] of map) {
        if (tz.includes(k)) { setGeoCTA(GEO_CTA[v]); break }
      }
    } catch (_) {}
  }, [])

  // ── close pickers on outside click ─────────────────────────────────────────
  useEffect(() => {
    const h = () => { setShowColorMenu(false); setShowHlMenu(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  // ── execCommand wrapper ────────────────────────────────────────────────────
  const exec = useCallback((cmd: string, val?: string) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, val ?? undefined)
    updateStats()
  }, [updateStats])

  // ── insert table ───────────────────────────────────────────────────────────
  const doInsertTable = () => {
    const header = `<tr>${Array(tableCols).fill(0).map((_, i) =>
      `<th style="border:1px solid #ccc;padding:8px;background:#f2f2f2;font-weight:600;min-width:80px">Col ${i + 1}</th>`
    ).join("")}</tr>`
    const body = Array(Math.max(tableRows - 1, 0)).fill(0).map(() =>
      `<tr>${Array(tableCols).fill(0).map(() =>
        `<td style="border:1px solid #ccc;padding:8px;min-width:80px">&nbsp;</td>`
      ).join("")}</tr>`
    ).join("")
    exec("insertHTML", `<br><table style="border-collapse:collapse;width:100%;margin:12px 0">${header}${body}</table><br>`)
    setShowTableDlg(false)
  }

  // ── find & replace ─────────────────────────────────────────────────────────
  const doFindReplace = () => {
    if (!findVal || !editorRef.current) return
    const escaped = findVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    editorRef.current.innerHTML = editorRef.current.innerHTML.replace(
      new RegExp(escaped, "gi"), replaceVal
    )
    updateStats()
    setShowFRDlg(false)
    setFindVal(""); setReplaceVal("")
  }

  // ── clear ──────────────────────────────────────────────────────────────────
  const doClear = () => {
    if (!confirm("Clear the entire document?")) return
    if (editorRef.current) editorRef.current.innerHTML = ""
    localStorage.removeItem("ttwDraft")
    updateStats()
    editorRef.current?.focus()
  }

  // ── sample document ────────────────────────────────────────────────────────
  const doSample = () => {
    if (!editorRef.current) return
    editorRef.current.innerHTML = `
<h1>Business Report — Q3 2025</h1>
<h2>Executive Summary</h2>
<p>This report provides a <strong>comprehensive overview</strong> of our performance during Q3 2025, highlighting key achievements, challenges, and strategic recommendations for the coming quarter.</p>
<h2>Key Metrics</h2>
<ul>
  <li>Revenue increased by <strong>18%</strong> year-over-year</li>
  <li>Customer satisfaction score: <em>4.8 / 5.0</em></li>
  <li>New markets entered: <strong>3</strong> (APAC, LATAM, MEA)</li>
</ul>
<h2>Quarterly Performance</h2>
<table style="border-collapse:collapse;width:100%;margin:12px 0">
  <tr>
    <th style="border:1px solid #ccc;padding:8px;background:#f2f2f2">Quarter</th>
    <th style="border:1px solid #ccc;padding:8px;background:#f2f2f2">Revenue</th>
    <th style="border:1px solid #ccc;padding:8px;background:#f2f2f2">Growth</th>
    <th style="border:1px solid #ccc;padding:8px;background:#f2f2f2">Status</th>
  </tr>
  <tr>
    <td style="border:1px solid #ccc;padding:8px">Q1 2025</td>
    <td style="border:1px solid #ccc;padding:8px">$1.2M</td>
    <td style="border:1px solid #ccc;padding:8px">+12%</td>
    <td style="border:1px solid #ccc;padding:8px">On Track</td>
  </tr>
  <tr>
    <td style="border:1px solid #ccc;padding:8px">Q2 2025</td>
    <td style="border:1px solid #ccc;padding:8px">$1.5M</td>
    <td style="border:1px solid #ccc;padding:8px">+15%</td>
    <td style="border:1px solid #ccc;padding:8px">On Track</td>
  </tr>
  <tr>
    <td style="border:1px solid #ccc;padding:8px">Q3 2025</td>
    <td style="border:1px solid #ccc;padding:8px">$1.8M</td>
    <td style="border:1px solid #ccc;padding:8px">+18%</td>
    <td style="border:1px solid #ccc;padding:8px">Exceeded</td>
  </tr>
</table>
<h2>Next Steps</h2>
<ol>
  <li>Expand product line into APAC markets</li>
  <li>Hire 20 additional engineers by Q4</li>
  <li>Launch loyalty program for enterprise clients</li>
</ol>
<h2>Conclusion</h2>
<p>Q3 2025 demonstrated <strong>exceptional growth</strong>. We remain <em>confident</em> in achieving our annual targets.</p>`
    updateStats()
    save()
  }

  // ── generate Word ──────────────────────────────────────────────────────────
  const generateWord = async () => {
    const el = editorRef.current
    if (!el || !el.innerHTML.trim()) return

    setLoading(true)
    setSuccess(false)

    try {
      const pg = PAGE_SIZES[opts.pageSize]
      const margin = 1440
      const content: DocChild[] = []

      if (opts.includeDate) {
        content.push(new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 400 },
          children: [new TextRun({
            text: new Date().toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric"
            }),
            font: opts.font,
            size: (opts.fontSize - 2) * 2,
            color: "888888",
          })],
        }))
      }

      const parsed = htmlToDocxChildren(el.innerHTML, opts)
      content.push(...parsed)

      if (!content.length || !(content[content.length - 1] instanceof Paragraph)) {
        content.push(new Paragraph({ children: [new TextRun({ text: "" })] }))
      }

      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "bullets",
              levels: [{
                level: 0,
                format: LevelFormat.BULLET,
                text: "\u2022",
                alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 720, hanging: 360 } } },
              }],
            },
            {
              reference: "numbers",
              levels: [{
                level: 0,
                format: LevelFormat.DECIMAL,
                text: "%1.",
                alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 720, hanging: 360 } } },
              }],
            },
          ],
        },
        styles: {
          default: {
            document: { run: { font: opts.font, size: opts.fontSize * 2 } },
          },
          paragraphStyles: [
            {
              id: "Heading1", name: "Heading 1",
              basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: opts.fontSize * 4, bold: true, font: opts.font, color: "1F3864" },
              paragraph: { spacing: { before: 400, after: 200 } },
            },
            {
              id: "Heading2", name: "Heading 2",
              basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: Math.round(opts.fontSize * 3), bold: true, font: opts.font, color: "2E4057" },
              paragraph: { spacing: { before: 320, after: 160 } },
            },
            {
              id: "Heading3", name: "Heading 3",
              basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: Math.round(opts.fontSize * 2.5), bold: true, font: opts.font, color: "404040" },
              paragraph: { spacing: { before: 240, after: 120 } },
            },
          ],
        },
        sections: [{
          properties: {
            page: {
              size: { width: pg.width, height: pg.height },
              margin: { top: margin, right: margin, bottom: margin, left: margin },
            },
          },
          children: content as Paragraph[],
          ...(opts.includePageNumbers ? {
            footers: {
              default: new Footer({
                children: [new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Page ", font: opts.font, size: (opts.fontSize - 2) * 2 }),
                    new TextRun({ children: [PageNumber.CURRENT], font: opts.font, size: (opts.fontSize - 2) * 2 }),
                    new TextRun({ text: " of ", font: opts.font, size: (opts.fontSize - 2) * 2 }),
                    new TextRun({ children: [PageNumber.TOTAL_PAGES], font: opts.font, size: (opts.fontSize - 2) * 2 }),
                  ],
                })],
              }),
            },
          } : {}),
        }],
      })

      const blob = await Packer.toBlob(doc)
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement("a")
      a.href     = url
      a.download = `Document-${new Date().toISOString().slice(0, 10)}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error(err)
      alert(`Export failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>

      {/*
        ═══════════════════════════════════════════════════════════════
        FIX 2 & 3 — Dark mode text visibility + text color command

        KEY CHANGES in <style>:
        • .ttw-paper forces white bg + BLACK text always (it's a paper mock)
        • .ttw-editor color is forced to #111 so it never goes white in dark mode
        • Color picker uses execCommand("foreColor") which injects <font color>
          tags — we handle those in buildRuns via el.style.color
        ═══════════════════════════════════════════════════════════════
      */}
      <style>{`
        /* ── Paper always looks like real white paper regardless of OS theme ── */
        .ttw-paper {
          background: #ffffff !important;
          color: #111111 !important;
        }

        /* ── Editor text is always dark on white paper ── */
        .ttw-editor {
          outline: none;
          min-height: 700px;
          line-height: 1.75;
          padding-bottom: 80px;
          caret-color: #0078d4;
          color: #111111 !important;        /* FIX: force dark text on white bg */
          background: transparent;
        }

        .ttw-editor:empty::before {
          content: attr(data-ph);
          color: #aaaaaa;
          pointer-events: none;
          font-style: italic;
        }

        /* Headings */
        .ttw-editor h1 {
          font-size: 2em; font-weight: 700;
          margin: .6em 0 .3em; color: #1F3864;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: .2em;
        }
        .ttw-editor h2 { font-size: 1.5em; font-weight: 700; margin: .8em 0 .3em; color: #2E4057; }
        .ttw-editor h3 { font-size: 1.2em; font-weight: 600; margin: .8em 0 .25em; color: #404040; }
        .ttw-editor p  { margin: 0 0 .9em; }

        /* Lists */
        .ttw-editor ul,
        .ttw-editor ol { padding-left: 2em; margin: .4em 0 .9em; }
        .ttw-editor li { margin: .25em 0; }

        /* Tables */
        .ttw-editor table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        .ttw-editor td,
        .ttw-editor th   { border: 1px solid #ccc; padding: 8px 10px; min-width: 70px; color: #111111 !important; }
        .ttw-editor th   { background: #f2f2f2 !important; font-weight: 600; text-align: left; }

        /* Misc */
        .ttw-editor blockquote {
          border-left: 4px solid #0078d4; margin: 1em 0;
          padding: .5em 1em; color: #555555; font-style: italic;
        }
        .ttw-editor a { color: #0078d4; text-decoration: underline; }

        /* FIX: font color tags inserted by execCommand must remain visible */
        .ttw-editor font[color] { /* inherit color from attribute — browser handles this */ }

        /* Ribbon dark mode */
        .ttw-ribbon {
          background: linear-gradient(to bottom, #f9fafb, #ffffff);
          border-bottom: 1px solid #e5e7eb;
        }
        .dark .ttw-ribbon {
          background: linear-gradient(to bottom, #1f2937, #111827);
          border-bottom: 1px solid #374151;
        }

        /* Paper shadow */
        .ttw-shadow {
          box-shadow: 0 2px 20px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.05);
        }
      `}</style>

      <div className="max-w-7xl mx-auto flex flex-col gap-5">

        {/* ── Banner ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 rounded-xl
          bg-gradient-to-r from-blue-50 to-indigo-50
          dark:from-blue-950/40 dark:to-indigo-950/30
          border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2.5 text-sm font-medium text-blue-900 dark:text-blue-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
              <span className="relative rounded-full h-2.5 w-2.5 bg-blue-600" />
            </span>
            {geoCTA}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["🔒 Private","⚡ Instant","🆓 Free","📄 .docx","✅ No Login"].map(b => (
              <span key={b} className="text-xs px-2.5 py-1 rounded-full
                bg-white dark:bg-gray-800
                border border-blue-200 dark:border-blue-700
                text-blue-700 dark:text-blue-300
                font-medium shadow-sm">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">

          {/* ══ EDITOR PANEL ══════════════════════════════════════════════ */}
          <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 shadow-sm overflow-hidden">

            {/* ── RIBBON ─────────────────────────────────────────────── */}
            <div className="sticky top-0 z-20 ttw-ribbon px-3 py-2">
              <div className="flex flex-wrap items-center gap-y-1">

                <Group label="History">
                  <TBtn title="Undo" onClick={() => exec("undo")}><Undo className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Redo" onClick={() => exec("redo")}><Redo className="w-3.5 h-3.5"/></TBtn>
                </Group>

                <Group label="Format">
                  <TBtn title="Bold"          onClick={() => exec("bold")}        ><Bold          className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Italic"        onClick={() => exec("italic")}      ><Italic        className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Underline"     onClick={() => exec("underline")}   ><Underline     className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Strikethrough" onClick={() => exec("strikeThrough")}><Strikethrough className="w-3.5 h-3.5"/></TBtn>

                  {/* ── FIX 3: Text color picker ── */}
                  <div className="relative" onMouseDown={e => e.stopPropagation()}>
                    <TBtn title="Text Color" onClick={() => {
                      setShowColorMenu(v => !v)
                      setShowHlMenu(false)
                    }}>
                      <Palette className="w-3.5 h-3.5"/>
                    </TBtn>
                    {showColorMenu && (
                      <div className="absolute top-full left-0 mt-1 z-50
                        bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-600
                        rounded-lg shadow-xl p-2 grid grid-cols-5 gap-1.5"
                        style={{ width: 148 }}
                      >
                        {TEXT_COLORS.map(c => (
                          <button
                            key={c.hex}
                            title={c.label}
                            style={{ background: c.css }}
                            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                            onMouseDown={e => {
                              e.preventDefault()
                              e.stopPropagation()
                              // Focus editor first so execCommand applies correctly
                              editorRef.current?.focus()
                              // Use foreColor — browser wraps selection in <font color="...">
                              document.execCommand("foreColor", false, c.css)
                              setShowColorMenu(false)
                              updateStats()
                            }}
                          />
                        ))}
                        {/* Extra: black option to reset */}
                        <button
                          title="Reset to Black"
                          style={{ background: "#111111" }}
                          className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform col-span-5"
                          onMouseDown={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            editorRef.current?.focus()
                            document.execCommand("foreColor", false, "#111111")
                            setShowColorMenu(false)
                            updateStats()
                          }}
                        >
                          <span className="text-[9px] text-white font-medium">Reset</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ── Highlight color picker ── */}
                  <div className="relative" onMouseDown={e => e.stopPropagation()}>
                    <TBtn title="Highlight" onClick={() => {
                      setShowHlMenu(v => !v)
                      setShowColorMenu(false)
                    }}>
                      <Highlighter className="w-3.5 h-3.5"/>
                    </TBtn>
                    {showHlMenu && (
                      <div className="absolute top-full left-0 mt-1 z-50
                        bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-600
                        rounded-lg shadow-xl p-2 grid grid-cols-3 gap-1.5"
                        style={{ width: 104 }}
                      >
                        {HIGHLIGHT_COLORS.map(c => (
                          <button
                            key={c.hex}
                            title={c.label}
                            style={{ background: c.css }}
                            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                            onMouseDown={e => {
                              e.preventDefault()
                              e.stopPropagation()
                              editorRef.current?.focus()
                              document.execCommand("hiliteColor", false, c.css)
                              setShowHlMenu(false)
                              updateStats()
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Group>

                <Group label="Align">
                  <TBtn title="Left"    onClick={() => exec("justifyLeft")}   ><AlignLeft    className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Center"  onClick={() => exec("justifyCenter")} ><AlignCenter  className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Right"   onClick={() => exec("justifyRight")}  ><AlignRight   className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Justify" onClick={() => exec("justifyFull")}   ><AlignJustify className="w-3.5 h-3.5"/></TBtn>
                </Group>

                <Group label="Lists">
                  <TBtn title="Bullets"  onClick={() => exec("insertUnorderedList")}><List        className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Numbers"  onClick={() => exec("insertOrderedList")}  ><ListOrdered className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Outdent"  onClick={() => exec("outdent")}            ><Outdent     className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Indent"   onClick={() => exec("indent")}             ><Indent      className="w-3.5 h-3.5"/></TBtn>
                </Group>

                <Group label="Styles">
                  <TBtn title="Normal"    onClick={() => exec("formatBlock","p")} ><Type     className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Heading 1" onClick={() => exec("formatBlock","h1")}><Heading1 className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Heading 2" onClick={() => exec("formatBlock","h2")}><Heading2 className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Heading 3" onClick={() => exec("formatBlock","h3")}><Heading3 className="w-3.5 h-3.5"/></TBtn>
                </Group>

                <Group label="Insert">
                  <TBtn title="Table"         onClick={() => setShowTableDlg(true)}><TableIcon className="w-3.5 h-3.5"/></TBtn>
                  <TBtn title="Find+Replace"  onClick={() => setShowFRDlg(true)}   ><Search    className="w-3.5 h-3.5"/></TBtn>
                </Group>

                {/* Right controls */}
                <div className="ml-auto flex items-center gap-1.5 pl-3 border-l border-gray-200 dark:border-gray-600">
                  <TBtn title="Zoom Out" onClick={() => setZoom(z => Math.max(60, z - 10))}>
                    <ZoomOut className="w-3.5 h-3.5"/>
                  </TBtn>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono w-8 text-center">
                    {zoom}%
                  </span>
                  <TBtn title="Zoom In" onClick={() => setZoom(z => Math.min(160, z + 10))}>
                    <ZoomIn className="w-3.5 h-3.5"/>
                  </TBtn>
                  <Divider/>
                  <button onClick={save} className="text-xs px-2 py-1 rounded
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    text-gray-600 dark:text-gray-300
                    flex items-center gap-1">
                    <Save className="w-3 h-3"/>Save
                  </button>
                  <button onClick={doSample} className="text-xs px-2 py-1 rounded
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    text-gray-600 dark:text-gray-300
                    flex items-center gap-1">
                    <RotateCcw className="w-3 h-3"/>Sample
                  </button>
                  <button onClick={doClear} className="text-xs px-2 py-1 rounded
                    hover:bg-red-50 dark:hover:bg-red-950
                    text-red-600 dark:text-red-400
                    border border-red-200 dark:border-red-800
                    flex items-center gap-1">
                    <Trash2 className="w-3 h-3"/>Clear
                  </button>
                </div>
              </div>
            </div>

            {/* ── PAPER AREA ─────────────────────────────────────────── */}
            <div className="bg-gray-100 dark:bg-gray-950 p-6 sm:p-10 overflow-y-auto"
              style={{ minHeight: 780 }}>
              <div
                className="ttw-paper ttw-shadow mx-auto rounded-sm"
                style={{
                  width: "100%",
                  maxWidth: 794,
                  padding: "72px 80px",
                  minHeight: 1122,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                  marginBottom: zoom < 100 ? `${(zoom - 100) * 8}px` : 0,
                }}
              >
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={updateStats}
                  onPaste={() => setTimeout(updateStats, 50)}
                  data-ph="Start typing here — or click 'Sample' to load a demo document…"
                  className="ttw-editor"
                  style={{ fontFamily: opts.font, fontSize: opts.fontSize + "pt" }}
                  spellCheck
                />
              </div>
            </div>

            {/* ── STATUS BAR ─────────────────────────────────────────── */}
            <div className="bg-[#0078d4] text-white text-xs px-4 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span><b>{wordCount}</b> words</span>
                <span><b>{charCount}</b> chars</span>
              </div>
              <div className="flex items-center gap-3 opacity-90">
                <span>{opts.font} {opts.fontSize}pt</span>
                <span>{opts.pageSize.toUpperCase()}</span>
                {lastSaved && (
                  <span className="text-green-300">
                    ✓ Saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ══ SIDEBAR ═══════════════════════════════════════════════════ */}
          <div className="space-y-4 lg:sticky lg:top-4">

            {/* Font settings */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900 p-5 space-y-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Font Settings
              </p>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                  Font Family
                </label>
                <select
                  value={opts.font}
                  onChange={e => setOpts(o => ({ ...o, font: e.target.value }))}
                  className="w-full text-sm border border-gray-200 dark:border-gray-600
                    rounded-lg px-3 h-9
                    bg-white dark:bg-gray-800
                    text-gray-800 dark:text-gray-200
                    focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">
                  Font Size
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {FONT_SIZE_OPTIONS.map(s => (
                    <button key={s}
                      onClick={() => setOpts(o => ({ ...o, fontSize: s }))}
                      className={`py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                        opts.fontSize === s
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Page setup */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900 p-5 space-y-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Page Setup
              </p>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">
                  Page Size
                </label>
                <div className="flex flex-col gap-2">
                  {([
                    ["a4",     "A4  (210 × 297 mm)"],
                    ["letter", "US Letter (8.5 × 11 in)"],
                  ] as const).map(([v, l]) => (
                    <button key={v}
                      onClick={() => setOpts(o => ({ ...o, pageSize: v }))}
                      className={`text-left text-sm px-3 py-2.5 rounded-lg border transition-colors ${
                        opts.pageSize === v
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {([
                  ["includePageNumbers", "Include page numbers"],
                  ["includeDate",        "Include date header"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer select-none">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    <button
                      role="switch"
                      aria-checked={opts[key]}
                      onClick={() => setOpts(o => ({ ...o, [key]: !o[key] }))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        opts[key] ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        opts[key] ? "translate-x-5" : "translate-x-0.5"
                      }`}/>
                    </button>
                  </label>
                ))}
              </div>
            </div>

            {/* Download */}
            <div className="rounded-xl border border-blue-200 dark:border-blue-800
              bg-blue-50 dark:bg-blue-950/40 p-5">
              {success ? (
                <div className="text-center py-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2"/>
                  <p className="font-bold text-gray-800 dark:text-gray-100">Downloaded!</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Your .docx file is ready
                  </p>
                </div>
              ) : (
                <>
                  <Button
                    onClick={generateWord}
                    disabled={isEmpty || loading}
                    className="w-full h-12 text-sm font-bold bg-[#0078d4] hover:bg-[#106ebe] disabled:opacity-40 gap-2"
                  >
                    <Download className={`h-4 w-4 ${loading ? "animate-bounce" : ""}`}/>
                    {loading ? "Generating…" : "Download .docx"}
                  </Button>
                  <p className="text-center text-[11px] text-gray-500 dark:text-gray-400 mt-3">
                    Works with Word · Google Docs · LibreOffice
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABLE DIALOG ──────────────────────────────────────────────── */}
      {showTableDlg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTableDlg(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-7 w-80"
            onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <TableIcon className="w-5 h-5 text-blue-600"/>Insert Table
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">ROWS</label>
                <input type="number" min={1} max={20} value={tableRows}
                  onChange={e => setTableRows(Math.max(1, +e.target.value))}
                  className="w-full border border-gray-200 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                    rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">COLUMNS</label>
                <input type="number" min={1} max={10} value={tableCols}
                  onChange={e => setTableCols(Math.max(1, +e.target.value))}
                  className="w-full border border-gray-200 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                    rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
              {tableRows} × {tableCols} · first row = header
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowTableDlg(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-[#0078d4] hover:bg-[#106ebe]" onClick={doInsertTable}>
                Insert
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── FIND & REPLACE DIALOG ─────────────────────────────────────── */}
      {showFRDlg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFRDlg(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-7 w-96"
            onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <Search className="w-5 h-5 text-blue-600"/>Find &amp; Replace
            </h3>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">
                  FIND
                </label>
                <input autoFocus type="text" value={findVal}
                  onChange={e => setFindVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && doFindReplace()}
                  placeholder="Text to find…"
                  className="w-full border border-gray-200 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                    rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">
                  REPLACE WITH
                </label>
                <input type="text" value={replaceVal}
                  onChange={e => setReplaceVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && doFindReplace()}
                  placeholder="Leave blank to delete…"
                  className="w-full border border-gray-200 dark:border-gray-600
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                    rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowFRDlg(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-[#0078d4] hover:bg-[#106ebe]"
                disabled={!findVal} onClick={doFindReplace}>
                Replace All
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
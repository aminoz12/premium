"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Copy, Download, RotateCcw, Plus, Trash2, ZoomIn, ZoomOut,
  Move, Crosshair, Layers, Code, Sliders, ChevronDown, ChevronUp,
  RefreshCw, Eye, Heart, Star, Infinity, Activity, Triangle,
  Pentagon, GitBranch, Share2, FileCode, Image, Keyboard,
  ChevronRight, X, Check, AlertCircle, Info
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type Point = { x: number; y: number }
type PathType = "L" | "Q" | "C" | "A" | "S" | "M"
type Tool = "select" | "pan" | "addPoint" | "delete"
type ExportFormat = "svg" | "png" | "css" | "react" | "json"

// ─── Constants ────────────────────────────────────────────────────────────────
const CANVAS_W = 600
const CANVAS_H = 420
const MAX_HISTORY = 80

const POINT_COLORS = [
  "#22c55e","#ef4444","#3b82f6","#f59e0b","#a855f7",
  "#ec4899","#14b8a6","#f97316","#6366f1","#84cc16",
  "#06b6d4","#e11d48","#7c3aed","#0891b2","#16a34a",
]

// ─── Presets ──────────────────────────────────────────────────────────────────
const PRESETS: Record<string, { points: Point[]; pathType: PathType; closed?: boolean; label: string; icon: string }> = {
  Arch: {
    label: "Arch", icon: "⌒",
    points: [{ x: 80, y: 340 }, { x: 300, y: 60 }, { x: 520, y: 340 }],
    pathType: "Q",
  },
  "S-Curve": {
    label: "S-Curve", icon: "~",
    points: [{ x: 80, y: 340 }, { x: 150, y: 80 }, { x: 450, y: 340 }, { x: 520, y: 80 }],
    pathType: "C",
  },
  Wave: {
    label: "Wave", icon: "≈",
    points: [{ x: 40, y: 210 }, { x: 150, y: 80 }, { x: 300, y: 210 }, { x: 450, y: 340 }, { x: 560, y: 210 }],
    pathType: "Q",
  },
  Triangle: {
    label: "Triangle", icon: "△",
    points: [{ x: 300, y: 50 }, { x: 530, y: 370 }, { x: 70, y: 370 }],
    pathType: "L", closed: true,
  },
  Pentagon: {
    label: "Pentagon", icon: "⬠",
    points: [
      { x: 300, y: 50 }, { x: 520, y: 200 }, { x: 440, y: 390 },
      { x: 160, y: 390 }, { x: 80, y: 200 },
    ],
    pathType: "L", closed: true,
  },
  Heart: {
    label: "Heart", icon: "♥",
    points: [
      { x: 300, y: 360 }, { x: 80, y: 180 }, { x: 80, y: 80 },
      { x: 180, y: 40 }, { x: 300, y: 120 }, { x: 420, y: 40 },
      { x: 520, y: 80 }, { x: 520, y: 180 },
    ],
    pathType: "C", closed: true,
  },
  Star: {
    label: "Star", icon: "★",
    points: (() => {
      const pts: Point[] = []
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2
        const r = i % 2 === 0 ? 180 : 80
        pts.push({ x: Math.round(300 + r * Math.cos(angle)), y: Math.round(210 + r * Math.sin(angle)) })
      }
      return pts
    })(),
    pathType: "L", closed: true,
  },
  Infinity: {
    label: "Infinity", icon: "∞",
    points: [
      { x: 300, y: 210 }, { x: 180, y: 100 }, { x: 60, y: 210 },
      { x: 180, y: 320 }, { x: 300, y: 210 }, { x: 420, y: 100 },
      { x: 540, y: 210 }, { x: 420, y: 320 },
    ],
    pathType: "C", closed: true,
  },
  Spiral: {
    label: "Spiral", icon: "🌀",
    points: (() => {
      const pts: Point[] = []
      for (let i = 0; i < 24; i++) {
        const angle = (i * Math.PI) / 4
        const r = 20 + i * 10
        pts.push({ x: Math.round(300 + r * Math.cos(angle)), y: Math.round(210 + r * Math.sin(angle)) })
      }
      return pts
    })(),
    pathType: "L",
  },
  Arrow: {
    label: "Arrow", icon: "→",
    points: [
      { x: 60, y: 210 }, { x: 400, y: 210 }, { x: 400, y: 130 },
      { x: 540, y: 210 }, { x: 400, y: 290 }, { x: 400, y: 210 },
    ],
    pathType: "L", closed: true,
  },
  Zigzag: {
    label: "Zigzag", icon: "⚡",
    points: [
      { x: 40, y: 340 }, { x: 140, y: 80 }, { x: 240, y: 340 },
      { x: 340, y: 80 }, { x: 440, y: 340 }, { x: 540, y: 80 },
    ],
    pathType: "L",
  },
}

// ─── Path Builder ─────────────────────────────────────────────────────────────
function buildPath(points: Point[], pathType: PathType, closed: boolean): string {
  if (points.length < 2) return ""
  const [start, ...rest] = points
  let d = `M ${fmt(start.x)} ${fmt(start.y)}`

  if (pathType === "L") {
    rest.forEach((p) => { d += ` L ${fmt(p.x)} ${fmt(p.y)}` })
  } else if (pathType === "Q") {
    let i = 0
    while (i < rest.length) {
      if (i + 1 < rest.length) {
        d += ` Q ${fmt(rest[i].x)} ${fmt(rest[i].y)} ${fmt(rest[i+1].x)} ${fmt(rest[i+1].y)}`
        i += 2
      } else { d += ` L ${fmt(rest[i].x)} ${fmt(rest[i].y)}`; i++ }
    }
  } else if (pathType === "C") {
    let i = 0
    while (i < rest.length) {
      if (i + 2 < rest.length) {
        d += ` C ${fmt(rest[i].x)} ${fmt(rest[i].y)} ${fmt(rest[i+1].x)} ${fmt(rest[i+1].y)} ${fmt(rest[i+2].x)} ${fmt(rest[i+2].y)}`
        i += 3
      } else if (i + 1 < rest.length) {
        d += ` Q ${fmt(rest[i].x)} ${fmt(rest[i].y)} ${fmt(rest[i+1].x)} ${fmt(rest[i+1].y)}`
        i += 2
      } else { d += ` L ${fmt(rest[i].x)} ${fmt(rest[i].y)}`; i++ }
    }
  } else if (pathType === "A") {
    rest.forEach((p, idx) => {
      d += ` A 80 60 0 ${idx % 2 === 0 ? 1 : 0} 1 ${fmt(p.x)} ${fmt(p.y)}`
    })
  } else if (pathType === "S") {
    let i = 0
    while (i < rest.length) {
      if (i + 1 < rest.length) {
        d += ` S ${fmt(rest[i].x)} ${fmt(rest[i].y)} ${fmt(rest[i+1].x)} ${fmt(rest[i+1].y)}`
        i += 2
      } else { d += ` L ${fmt(rest[i].x)} ${fmt(rest[i].y)}`; i++ }
    }
  }

  if (closed) d += " Z"
  return d
}

function fmt(n: number) { return n.toFixed(1) }

function getSvgCoords(
  e: { clientX: number; clientY: number },
  rect: DOMRect,
  zoom: number,
  pan: Point
): Point {
  const scaleX = CANVAS_W / zoom / rect.width
  const scaleY = CANVAS_H / zoom / rect.height
  return {
    x: (e.clientX - rect.left) * (CANVAS_W / rect.width) / zoom + (-pan.x / zoom),
    y: (e.clientY - rect.top) * (CANVAS_H / rect.height) / zoom + (-pan.y / zoom),
  }
}

// ─── Export Generators ────────────────────────────────────────────────────────
function generateCSS(pathData: string, stroke: string, strokeWidth: number) {
  return `.svg-path {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${CANVAS_W} ${CANVAS_H}'%3E%3Cpath d='${encodeURIComponent(pathData)}' stroke='${encodeURIComponent(stroke)}' stroke-width='${strokeWidth}' fill='none'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}`
}

function generateReact(pathData: string, stroke: string, strokeWidth: number, fill: string, fillOpacity: number, lineCap: string, lineJoin: string) {
  return `import React from 'react'

export function SvgPath({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${CANVAS_W} ${CANVAS_H}"
      className={className}
    >
      <path
        d="${pathData}"
        stroke="${stroke}"
        strokeWidth={${strokeWidth}}
        strokeLinecap="${lineCap}"
        strokeLinejoin="${lineJoin}"
        fill="${fill}"
        ${fill !== "none" ? `fillOpacity={${fillOpacity}}` : ""}
      />
    </svg>
  )
}`
}

function generateJSON(points: Point[], pathType: PathType, closed: boolean, stroke: string, strokeWidth: number, fill: string) {
  return JSON.stringify({ points, pathType, closed, style: { stroke, strokeWidth, fill } }, null, 2)
}

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info"
function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null)
  const show = useCallback((msg: string, type: ToastType = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2200)
  }, [])
  return { toast, show }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SvgPathEditor() {
  // State
  const [points, setPoints] = useState<Point[]>(PRESETS["Arch"].points)
  const [pathType, setPathType] = useState<PathType>("Q")
  const [closed, setClosed] = useState(false)
  const [stroke, setStroke] = useState("#6366f1")
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [strokeOpacity, setStrokeOpacity] = useState(1)
  const [fill, setFill] = useState("none")
  const [fillOpacity, setFillOpacity] = useState(0.15)
  const [showGrid, setShowGrid] = useState(true)
  const [gridType, setGridType] = useState<"lines" | "dots" | "cross">("lines")
  const [showRuler, setShowRuler] = useState(true)
  const [snap, setSnap] = useState(false)
  const [snapSize, setSnapSize] = useState(10)
  const [showHandles, setShowHandles] = useState(true)
  const [showCoords, setShowCoords] = useState(true)
  const [showBbox, setShowBbox] = useState(false)
  const [showMidpoints, setShowMidpoints] = useState(false)
  const [history, setHistory] = useState<{ points: Point[]; pathType: PathType; closed: boolean }[]>([])
  const [future, setFuture] = useState<{ points: Point[]; pathType: PathType; closed: boolean }[]>([])
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })
  const [tool, setTool] = useState<Tool>("select")
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)
  const [hoverPoint, setHoverPoint] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState<Point | null>(null)
  const [activeTab, setActiveTab] = useState<"style" | "path" | "export" | "shortcuts">("style")
  const [strokeDash, setStrokeDash] = useState("none")
  const [lineCap, setLineCap] = useState<"round" | "butt" | "square">("round")
  const [lineJoin, setLineJoin] = useState<"round" | "miter" | "bevel">("round")
  const [showPresets, setShowPresets] = useState(false)
  const [animatePath, setAnimatePath] = useState(false)
  const [animDuration, setAnimDuration] = useState(2)
  const [showFullSVG, setShowFullSVG] = useState(false)
  const [bgColor, setBgColor] = useState("#0f172a")
  const [bgTransparent, setBgTransparent] = useState(false)
  const [pointRadius, setPointRadius] = useState(6)
  const [exportFormat, setExportFormat] = useState<ExportFormat>("svg")
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [pointLabelMode, setPointLabelMode] = useState<"index" | "coords" | "none">("index")
  const [pathGlow, setPathGlow] = useState(true)
  const [multiSelect, setMultiSelect] = useState<number[]>([])
  const [canvasTheme, setCanvasTheme] = useState<"dark" | "light" | "blueprint">("dark")

  const svgRef = useRef<SVGSVGElement>(null)
  const isPanning = useRef(false)
  const panStart = useRef<Point>({ x: 0, y: 0 })
  const panOrigin = useRef<Point>({ x: 0, y: 0 })
  const dragging = useRef<number | null>(null)
  const { toast, show: showToast } = useToast()

  // ── Derived ────────────────────────────────────────────────────────────────
  const pathData = useMemo(() => buildPath(points, pathType, closed), [points, pathType, closed])

  const strokeDashArray = useMemo(() => {
    if (strokeDash === "none") return undefined
    if (strokeDash === "dashed") return `${strokeWidth * 4},${strokeWidth * 2}`
    if (strokeDash === "dotted") return `${strokeWidth},${strokeWidth * 2.5}`
    if (strokeDash === "dash-dot") return `${strokeWidth * 5},${strokeWidth * 2},${strokeWidth},${strokeWidth * 2}`
    if (strokeDash === "long-dash") return `${strokeWidth * 8},${strokeWidth * 3}`
    return undefined
  }, [strokeDash, strokeWidth])

  const pathLength = useMemo(() => {
    if (typeof document === "undefined") return 0
    try {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path")
      p.setAttribute("d", pathData)
      return Math.round(p.getTotalLength())
    } catch { return 0 }
  }, [pathData])

  const bbox = useMemo(() => {
    if (points.length === 0) return null
    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y)
    return {
      x: Math.min(...xs), y: Math.min(...ys),
      w: Math.max(...xs) - Math.min(...xs),
      h: Math.max(...ys) - Math.min(...ys),
    }
  }, [points])

  const fullSVGCode = useMemo(() => {
    const bg = bgTransparent ? "" : `\n  <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="${bgColor}"/>`
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}">${bg}
  <path
    d="${pathData}"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
    stroke-opacity="${strokeOpacity}"
    stroke-linecap="${lineCap}"
    stroke-linejoin="${lineJoin}"${strokeDashArray ? `\n    stroke-dasharray="${strokeDashArray}"` : ""}
    fill="${fill}"${fill !== "none" ? `\n    fill-opacity="${fillOpacity}"` : ""}
  />
</svg>`
  }, [pathData, stroke, strokeWidth, strokeOpacity, lineCap, lineJoin, strokeDashArray, fill, fillOpacity, bgColor, bgTransparent])

  const exportCode = useMemo(() => {
    if (exportFormat === "svg") return fullSVGCode
    if (exportFormat === "css") return generateCSS(pathData, stroke, strokeWidth)
    if (exportFormat === "react") return generateReact(pathData, stroke, strokeWidth, fill, fillOpacity, lineCap, lineJoin)
    if (exportFormat === "json") return generateJSON(points, pathType, closed, stroke, strokeWidth, fill)
    return pathData
  }, [exportFormat, fullSVGCode, pathData, stroke, strokeWidth, fill, fillOpacity, lineCap, lineJoin, points, pathType, closed])

  // ── Canvas theme ───────────────────────────────────────────────────────────
  const canvasBg = canvasTheme === "dark" ? "#0f172a" : canvasTheme === "light" ? "#f8fafc" : "#0a1628"
  const gridColor = canvasTheme === "dark" ? "#1e293b" : canvasTheme === "light" ? "#e2e8f0" : "#1a3a5c"
  const gridMajor = canvasTheme === "dark" ? "#334155" : canvasTheme === "light" ? "#cbd5e1" : "#1e4976"
  const rulerColor = canvasTheme === "blueprint" ? "#3b82f6" : "#64748b"

  // ── History ────────────────────────────────────────────────────────────────
  const snapshot = useCallback(() => ({ points: [...points], pathType, closed }), [points, pathType, closed])

  const saveHistory = useCallback(() => {
    setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), snapshot()])
    setFuture([])
  }, [snapshot])

  const undo = useCallback(() => {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setFuture((f) => [snapshot(), ...f])
    setPoints(last.points)
    setPathType(last.pathType)
    setClosed(last.closed)
    setHistory((h) => h.slice(0, -1))
    showToast("Undo", "info")
  }, [history, snapshot, showToast])

  const redo = useCallback(() => {
    if (future.length === 0) return
    const next = future[0]
    setHistory((h) => [...h, snapshot()])
    setPoints(next.points)
    setPathType(next.pathType)
    setClosed(next.closed)
    setFuture((f) => f.slice(1))
    showToast("Redo", "info")
  }, [future, snapshot, showToast])

  // ── Point operations ───────────────────────────────────────────────────────
  const updatePoint = useCallback((index: number, x: number, y: number) => {
    const cx = Math.max(0, Math.min(CANVAS_W, x))
    const cy = Math.max(0, Math.min(CANVAS_H, y))
    const nx = snap ? Math.round(cx / snapSize) * snapSize : parseFloat(cx.toFixed(1))
    const ny = snap ? Math.round(cy / snapSize) * snapSize : parseFloat(cy.toFixed(1))
    setPoints((prev) => prev.map((p, i) => i === index ? { x: nx, y: ny } : p))
  }, [snap, snapSize])

  const addPoint = useCallback((at?: Point) => {
    saveHistory()
    if (at) { setPoints((prev) => [...prev, at]); return }
    const last = points[points.length - 1]
    const prev2 = points[points.length - 2]
    setPoints((prev) => [...prev, {
      x: parseFloat(((last.x + prev2.x) / 2 + 20).toFixed(1)),
      y: parseFloat(((last.y + prev2.y) / 2 - 20).toFixed(1)),
    }])
  }, [points, saveHistory])

  const removePoint = useCallback((index: number) => {
    if (points.length <= 2) { showToast("Need at least 2 points", "error"); return }
    saveHistory()
    setPoints((prev) => prev.filter((_, i) => i !== index))
    setSelectedPoint(null)
    showToast("Point deleted")
  }, [points, saveHistory, showToast])

  const duplicatePoint = useCallback((index: number) => {
    saveHistory()
    const p = points[index]
    setPoints((prev) => [...prev.slice(0, index + 1), { x: p.x + 15, y: p.y + 15 }, ...prev.slice(index + 1)])
    showToast("Point duplicated")
  }, [points, saveHistory, showToast])

  const flipHorizontal = useCallback(() => {
    saveHistory()
    const xs = points.map((p) => p.x)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    setPoints((prev) => prev.map((p) => ({ ...p, x: minX + maxX - p.x })))
    showToast("Flipped horizontal")
  }, [points, saveHistory, showToast])

  const flipVertical = useCallback(() => {
    saveHistory()
    const ys = points.map((p) => p.y)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    setPoints((prev) => prev.map((p) => ({ ...p, y: minY + maxY - p.y })))
    showToast("Flipped vertical")
  }, [points, saveHistory, showToast])

  const centerPath = useCallback(() => {
    saveHistory()
    if (!bbox) return
    const dx = CANVAS_W / 2 - (bbox.x + bbox.w / 2)
    const dy = CANVAS_H / 2 - (bbox.y + bbox.h / 2)
    setPoints((prev) => prev.map((p) => ({ x: p.x + dx, y: p.y + dy })))
    showToast("Centered")
  }, [points, bbox, saveHistory, showToast])

  const scalePath = useCallback((factor: number) => {
    saveHistory()
    if (!bbox) return
    const cx = bbox.x + bbox.w / 2, cy = bbox.y + bbox.h / 2
    setPoints((prev) => prev.map((p) => ({
      x: cx + (p.x - cx) * factor,
      y: cy + (p.y - cy) * factor,
    })))
    showToast(`Scaled ${factor > 1 ? "up" : "down"}`)
  }, [points, bbox, saveHistory, showToast])

  const rotatePath = useCallback((deg: number) => {
    saveHistory()
    if (!bbox) return
    const cx = bbox.x + bbox.w / 2, cy = bbox.y + bbox.h / 2
    const rad = (deg * Math.PI) / 180
    setPoints((prev) => prev.map((p) => ({
      x: cx + (p.x - cx) * Math.cos(rad) - (p.y - cy) * Math.sin(rad),
      y: cy + (p.x - cx) * Math.sin(rad) + (p.y - cy) * Math.cos(rad),
    })))
    showToast(`Rotated ${deg}°`)
  }, [points, bbox, saveHistory, showToast])

  const applyPreset = useCallback((name: string) => {
    saveHistory()
    const preset = PRESETS[name]
    setPoints(preset.points)
    setPathType(preset.pathType)
    setClosed(preset.closed ?? false)
    setShowPresets(false)
    showToast(`Preset: ${name}`)
  }, [saveHistory, showToast])

  const reset = useCallback(() => {
    saveHistory()
    setPoints(PRESETS["Arch"].points)
    setPathType("Q")
    setClosed(false)
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelectedPoint(null)
    showToast("Reset")
  }, [saveHistory, showToast])

  // ── Zoom & Pan ─────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY > 0 ? 0.85 : 1.18
      setZoom((z) => Math.min(8, Math.max(0.2, z * delta)))
    } else {
      setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }))
    }
  }, [])

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [handleWheel])

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); return }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); return }
      if ((e.ctrlKey || e.metaKey) && e.key === "c") { navigator.clipboard.writeText(pathData); showToast("Copied!"); return }

      switch (e.key) {
        case "v": case "V": setTool("select"); break
        case "p": case "P": setTool("addPoint"); break
        case "h": case "H": setTool("pan"); break
        case "d": case "D": setTool("delete"); break
        case "g": case "G": setShowGrid((v) => !v); break
        case "s": case "S": setSnap((v) => !v); break
        case "c": case "C": setShowCoords((v) => !v); break
        case "k": case "K": setShowHandles((v) => !v); break
        case "r": case "R": setShowRuler((v) => !v); break
        case "b": case "B": setShowBbox((v) => !v); break
        case "+": case "=": setZoom((z) => Math.min(8, z * 1.2)); break
        case "-": case "_": setZoom((z) => Math.max(0.2, z / 1.2)); break
        case "0": setZoom(1); setPan({ x: 0, y: 0 }); break
        case "f": case "F": centerPath(); break
        case "Escape": setSelectedPoint(null); setMultiSelect([]); break
        case "Delete": case "Backspace":
          if (selectedPoint !== null) removePoint(selectedPoint)
          break
        case "?": setActiveTab("shortcuts"); break
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [undo, redo, selectedPoint, removePoint, pathData, centerPath, showToast])

  // ── Grid rendering ─────────────────────────────────────────────────────────
  const gridEl = useMemo(() => {
    if (!showGrid) return null
    const step = snap ? snapSize : 20
    const els: React.ReactNode[] = []

    if (gridType === "lines") {
      for (let x = 0; x <= CANVAS_W; x += step) {
        els.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={CANVAS_H}
          stroke={x % 100 === 0 ? gridMajor : gridColor}
          strokeWidth={x % 100 === 0 ? 0.8 : 0.4} />)
      }
      for (let y = 0; y <= CANVAS_H; y += step) {
        els.push(<line key={`h${y}`} x1={0} y1={y} x2={CANVAS_W} y2={y}
          stroke={y % 100 === 0 ? gridMajor : gridColor}
          strokeWidth={y % 100 === 0 ? 0.8 : 0.4} />)
      }
    } else if (gridType === "dots") {
      for (let x = 0; x <= CANVAS_W; x += step) {
        for (let y = 0; y <= CANVAS_H; y += step) {
          els.push(<circle key={`d${x}${y}`} cx={x} cy={y} r={x % 100 === 0 && y % 100 === 0 ? 1.2 : 0.7}
            fill={x % 100 === 0 && y % 100 === 0 ? gridMajor : gridColor} />)
        }
      }
    } else {
      for (let x = 0; x <= CANVAS_W; x += step) {
        for (let y = 0; y <= CANVAS_H; y += step) {
          const s = x % 100 === 0 && y % 100 === 0 ? 3 : 1.5
          els.push(<path key={`cr${x}${y}`} d={`M ${x - s} ${y} H ${x + s} M ${x} ${y - s} V ${y + s}`}
            stroke={x % 100 === 0 && y % 100 === 0 ? gridMajor : gridColor} strokeWidth={0.5} />)
        }
      }
    }
    return <g opacity={0.9}>{els}</g>
  }, [showGrid, snap, snapSize, gridType, gridColor, gridMajor])

  const rulerEl = useMemo(() => {
    if (!showRuler) return null
    const marks: React.ReactNode[] = []
    for (let x = 0; x <= CANVAS_W; x += 50) {
      marks.push(
        <g key={`rx${x}`}>
          <line x1={x} y1={0} x2={x} y2={7} stroke={rulerColor} strokeWidth={x % 100 === 0 ? 1 : 0.6} />
          <text x={x} y={15} fontSize={8} fill={rulerColor} textAnchor="middle" fontFamily="monospace">{x}</text>
        </g>
      )
    }
    for (let y = 0; y <= CANVAS_H; y += 50) {
      marks.push(
        <g key={`ry${y}`}>
          <line x1={0} y1={y} x2={7} y2={y} stroke={rulerColor} strokeWidth={y % 100 === 0 ? 1 : 0.6} />
          <text x={16} y={y + 4} fontSize={8} fill={rulerColor} textAnchor="middle" fontFamily="monospace">{y}</text>
        </g>
      )
    }
    return <g opacity={0.8}>{marks}</g>
  }, [showRuler, rulerColor])

  // ── SVG mouse coords ───────────────────────────────────────────────────────
  function getCoords(e: React.MouseEvent): Point {
    const rect = svgRef.current!.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (CANVAS_W / zoom) / rect.width + (-pan.x / zoom)
    const my = (e.clientY - rect.top) * (CANVAS_H / zoom) / rect.height + (-pan.y / zoom)
    return { x: parseFloat(mx.toFixed(1)), y: parseFloat(my.toFixed(1)) }
  }

  // ── Downloads ──────────────────────────────────────────────────────────────
  const downloadSVG = () => {
    const blob = new Blob([fullSVGCode], { type: "image/svg+xml" })
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "path.svg"; a.click()
    showToast("SVG downloaded!")
  }

  const downloadPNG = (scale = 2) => {
    const svgBlob = new Blob([fullSVGCode], { type: "image/svg+xml" })
    const url = URL.createObjectURL(svgBlob)
    const img = new window.Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = CANVAS_W * scale; canvas.height = CANVAS_H * scale
      const ctx = canvas.getContext("2d")!
      ctx.scale(scale, scale); ctx.drawImage(img, 0, 0)
      const a = document.createElement("a"); a.href = canvas.toDataURL("image/png"); a.download = `path@${scale}x.png`; a.click()
      URL.revokeObjectURL(url)
      showToast(`PNG ${scale}x downloaded!`)
    }
    img.src = url
  }

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime })
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click()
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const canvasCursor = tool === "pan" ? "grab" : tool === "addPoint" ? "crosshair" : tool === "delete" ? "not-allowed" : "default"

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans select-none">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[999] flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-2xl text-sm font-medium transition-all border ${
          toast.type === "success" ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-200" :
          toast.type === "error" ? "bg-red-900/90 border-red-500/40 text-red-200" :
          "bg-slate-800/90 border-slate-600/40 text-slate-200"
        }`}>
          {toast.type === "success" && <Check size={14} />}
          {toast.type === "error" && <AlertCircle size={14} />}
          {toast.type === "info" && <Info size={14} />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-[1500px] mx-auto p-4 space-y-4">
        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              SVG Path Editor
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Line · Quadratic · Cubic · Smooth · Arc · Pan & Zoom · Export to SVG / PNG / CSS / React
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "V Select", key: "V" },
              { label: "P Add", key: "P" },
              { label: "H Pan", key: "H" },
              { label: "G Grid", key: "G" },
              { label: "? Help", key: "?" },
            ].map(({ label, key }) => (
              <kbd key={key} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-400 font-mono">
                {label}
              </kbd>
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          {/* ── Left: Canvas Area ── */}
          <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-xl">
              {/* Tool group */}
              <ToolGroup>
                {([
                  { id: "select", icon: <Crosshair size={14} />, label: "Select (V)" },
                  { id: "addPoint", icon: <Plus size={14} />, label: "Add Point (P)" },
                  { id: "pan", icon: <Move size={14} />, label: "Pan (H)" },
                  { id: "delete", icon: <Trash2 size={14} />, label: "Delete (D)" },
                ] as { id: Tool; icon: React.ReactNode; label: string }[]).map((t) => (
                  <ToolBtn key={t.id} active={tool === t.id} onClick={() => setTool(t.id)} title={t.label}>
                    {t.icon}
                    <span className="hidden sm:inline text-xs">{t.id === "addPoint" ? "Add" : t.id.charAt(0).toUpperCase() + t.id.slice(1)}</span>
                  </ToolBtn>
                ))}
              </ToolGroup>

              {/* Path type */}
              <ToolGroup>
                {(["L", "Q", "C", "S", "A"] as PathType[]).map((type) => (
                  <ToolBtn
                    key={type}
                    active={pathType === type}
                    onClick={() => { saveHistory(); setPathType(type) }}
                    title={{ L: "Line", Q: "Quadratic Bézier", C: "Cubic Bézier", S: "Smooth Cubic", A: "Arc" }[type]}
                    accent="violet"
                  >
                    <span className="font-mono font-bold text-xs">{type}</span>
                  </ToolBtn>
                ))}
              </ToolGroup>

              {/* Zoom */}
              <ToolGroup>
                <ToolBtn onClick={() => setZoom((z) => Math.min(8, z * 1.2))} title="Zoom In (+)"><ZoomIn size={14} /></ToolBtn>
                <span className="text-xs text-slate-400 w-12 text-center font-mono tabular-nums">{Math.round(zoom * 100)}%</span>
                <ToolBtn onClick={() => setZoom((z) => Math.max(0.2, z / 1.2))} title="Zoom Out (-)"><ZoomOut size={14} /></ToolBtn>
                <ToolBtn onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }} title="Reset View (0)"><RefreshCw size={12} /></ToolBtn>
              </ToolGroup>

              {/* Toggles */}
              <ToolGroup>
                <ToggleBtn active={showGrid} onToggle={() => setShowGrid((v) => !v)} label="Grid" shortcut="G" />
                <ToggleBtn active={showHandles} onToggle={() => setShowHandles((v) => !v)} label="Handles" shortcut="K" />
                <ToggleBtn active={snap} onToggle={() => setSnap((v) => !v)} label="Snap" shortcut="S" />
                <ToggleBtn active={showBbox} onToggle={() => setShowBbox((v) => !v)} label="BBox" shortcut="B" />
              </ToolGroup>

              {/* Canvas theme */}
              <ToolGroup>
                {(["dark", "light", "blueprint"] as const).map((t) => (
                  <ToolBtn key={t} active={canvasTheme === t} onClick={() => setCanvasTheme(t)} title={`${t} theme`}>
                    <span className="text-xs capitalize">{t.slice(0, 2).toUpperCase()}</span>
                  </ToolBtn>
                ))}
              </ToolGroup>

              {/* Presets dropdown */}
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowPresets((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all border border-slate-700"
                >
                  <Star size={12} /> Presets {showPresets ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {showPresets && (
                  <div className="absolute right-0 top-full mt-1.5 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 py-2 min-w-[200px] max-h-[340px] overflow-y-auto">
                    <div className="px-3 py-1 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Presets</div>
                    {Object.entries(PRESETS).map(([name, preset]) => (
                      <button
                        key={name}
                        onClick={() => applyPreset(name)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-3"
                      >
                        <span className="text-base w-6 text-center">{preset.icon}</span>
                        <span>{preset.label}</span>
                        <span className="ml-auto text-xs text-slate-600 font-mono">{preset.pathType}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/60">
              <svg
                ref={svgRef}
                viewBox={`${-pan.x / zoom} ${-pan.y / zoom} ${CANVAS_W / zoom} ${CANVAS_H / zoom}`}
                className="w-full block"
                style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}`, cursor: canvasCursor, background: canvasBg }}
                onMouseMove={(e) => {
                  const c = getCoords(e)
                  setMousePos(c)
                  if (isPanning.current) {
                    setPan({
                      x: panOrigin.current.x + (e.clientX - panStart.current.x),
                      y: panOrigin.current.y + (e.clientY - panStart.current.y),
                    })
                  }
                }}
                onMouseLeave={() => setMousePos(null)}
                onMouseDown={(e) => {
                  if (tool === "pan") {
                    isPanning.current = true
                    panStart.current = { x: e.clientX, y: e.clientY }
                    panOrigin.current = { ...pan }
                    return
                  }
                  if (tool === "addPoint" && mousePos) {
                    addPoint({ ...mousePos })
                  }
                }}
                onMouseUp={() => { isPanning.current = false }}
              >
                {/* Canvas bg */}
                <rect
                  x={-pan.x / zoom} y={-pan.y / zoom}
                  width={CANVAS_W / zoom} height={CANVAS_H / zoom}
                  fill={canvasBg}
                />

                {/* Blueprint watermark */}
                {canvasTheme === "blueprint" && (
                  <text x={CANVAS_W / 2} y={CANVAS_H / 2} fontSize={60} fill="#1e3a5f" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace" opacity={0.3}>SVG</text>
                )}

                {gridEl}
                {rulerEl}

                {/* Bounding box */}
                {showBbox && bbox && (
                  <rect x={bbox.x} y={bbox.y} width={bbox.w} height={bbox.h}
                    fill="none" stroke="#f59e0b" strokeWidth={1 / zoom}
                    strokeDasharray={`${6 / zoom},${4 / zoom}`} opacity={0.6} />
                )}

                {/* Handle lines */}
                {showHandles && (pathType === "Q" || pathType === "C" || pathType === "S") && points.map((pt, i) => {
                  const isCtrl = pathType === "Q" ? i % 2 === 1 :
                    pathType === "C" ? (i % 3 !== 0 && i > 0) :
                    pathType === "S" ? i % 2 === 1 : false
                  if (!isCtrl) return null
                  const prev = points[i - 1], next = points[i + 1]
                  return (
                    <g key={`hl-${i}`}>
                      {prev && <line x1={prev.x} y1={prev.y} x2={pt.x} y2={pt.y}
                        stroke="#6366f1" strokeWidth={0.8 / zoom}
                        strokeDasharray={`${5 / zoom},${3 / zoom}`} opacity={0.5} />}
                      {next && <line x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
                        stroke="#6366f1" strokeWidth={0.8 / zoom}
                        strokeDasharray={`${5 / zoom},${3 / zoom}`} opacity={0.5} />}
                    </g>
                  )
                })}

                {/* Midpoints */}
                {showMidpoints && points.slice(0, -1).map((pt, i) => {
                  const next = points[i + 1]
                  const mx = (pt.x + next.x) / 2, my = (pt.y + next.y) / 2
                  return <circle key={`mp-${i}`} cx={mx} cy={my} r={3 / zoom} fill="#f59e0b" opacity={0.5} />
                })}

                {/* Path glow */}
                {pathGlow && (
                  <path d={pathData} stroke={stroke} strokeWidth={(strokeWidth + 10) / zoom}
                    fill="none" opacity={0.08} strokeLinecap={lineCap} strokeLinejoin={lineJoin} />
                )}

                {/* Main path */}
                <path
                  d={pathData}
                  stroke={stroke}
                  strokeWidth={strokeWidth / zoom}
                  strokeOpacity={strokeOpacity}
                  fill={fill === "none" ? "none" : fill}
                  fillOpacity={fill === "none" ? 0 : fillOpacity}
                  strokeLinecap={lineCap}
                  strokeLinejoin={lineJoin}
                  strokeDasharray={strokeDashArray}
                  style={animatePath ? {
                    strokeDasharray: pathLength / zoom,
                    strokeDashoffset: pathLength / zoom,
                    animation: `dash ${animDuration}s linear infinite`,
                  } : {}}
                />

                {/* Points */}
                {showHandles && points.map((point, i) => {
                  const isCtrl = pathType === "Q" ? i % 2 === 1 :
                    pathType === "C" ? (i % 3 !== 0 && i > 0) :
                    pathType === "S" ? i % 2 === 1 : false
                  const r = (isCtrl ? pointRadius * 0.7 : pointRadius) / zoom
                  const color = POINT_COLORS[i % POINT_COLORS.length]
                  const isSelected = selectedPoint === i
                  const isHov = hoverPoint === i
                  const isMulti = multiSelect.includes(i)

                  return (
                    <g key={i}>
                      {/* Outer glow for selected */}
                      {isSelected && (
                        <circle cx={point.x} cy={point.y} r={r + 6 / zoom} fill={color} opacity={0.15} />
                      )}
                      {(isSelected || isMulti) && (
                        <circle cx={point.x} cy={point.y} r={r + 3.5 / zoom}
                          fill="none" stroke={color} strokeWidth={1.5 / zoom} opacity={0.7} />
                      )}
                      {isHov && !isSelected && (
                        <circle cx={point.x} cy={point.y} r={r + 2 / zoom} fill={color} opacity={0.15} />
                      )}
                      {/* Point shape */}
                      {isCtrl ? (
                        <rect
                          x={point.x - r} y={point.y - r}
                          width={r * 2} height={r * 2}
                          fill="#0f172a" stroke={color} strokeWidth={1.8 / zoom}
                          style={{ cursor: tool === "select" ? "move" : tool === "delete" ? "not-allowed" : "default" }}
                          onMouseEnter={() => setHoverPoint(i)}
                          onMouseLeave={() => setHoverPoint(null)}
                          onMouseDown={(e) => handlePointMouseDown(e, i)}
                          onDoubleClick={() => removePoint(i)}
                        />
                      ) : (
                        <circle
                          cx={point.x} cy={point.y} r={r}
                          fill={color} stroke="#0f172a" strokeWidth={1.5 / zoom}
                          style={{ cursor: tool === "select" ? "move" : tool === "delete" ? "not-allowed" : "default" }}
                          onMouseEnter={() => setHoverPoint(i)}
                          onMouseLeave={() => setHoverPoint(null)}
                          onMouseDown={(e) => handlePointMouseDown(e, i)}
                          onDoubleClick={() => tool === "delete" ? removePoint(i) : duplicatePoint(i)}
                        />
                      )}
                      {/* Label */}
                      {pointLabelMode !== "none" && (
                        <text
                          x={point.x} y={point.y - r - 4 / zoom}
                          fontSize={8 / zoom} fill={color} textAnchor="middle"
                          fontFamily="monospace" style={{ pointerEvents: "none", userSelect: "none" }}
                        >
                          {pointLabelMode === "index" ? (isCtrl ? `C${i}` : `P${i}`) :
                            `${Math.round(point.x)},${Math.round(point.y)}`}
                        </text>
                      )}
                      {/* Coord on hover/select */}
                      {showCoords && (isSelected || isHov) && pointLabelMode !== "coords" && (
                        <text
                          x={point.x + r + 5 / zoom} y={point.y + 4 / zoom}
                          fontSize={8 / zoom} fill="#94a3b8" fontFamily="monospace"
                          style={{ pointerEvents: "none", userSelect: "none" }}
                        >
                          ({Math.round(point.x)}, {Math.round(point.y)})
                        </text>
                      )}
                    </g>
                  )
                })}

                {/* Crosshair for add tool */}
                {mousePos && tool === "addPoint" && (
                  <g opacity={0.4} style={{ pointerEvents: "none" }}>
                    <line x1={mousePos.x} y1={-9999} x2={mousePos.x} y2={9999}
                      stroke="#6366f1" strokeWidth={0.8 / zoom} strokeDasharray={`${5 / zoom},${4 / zoom}`} />
                    <line x1={-9999} y1={mousePos.y} x2={9999} y2={mousePos.y}
                      stroke="#6366f1" strokeWidth={0.8 / zoom} strokeDasharray={`${5 / zoom},${4 / zoom}`} />
                    <circle cx={mousePos.x} cy={mousePos.y} r={4 / zoom} fill="#6366f1" opacity={0.7} />
                  </g>
                )}
              </svg>

              {/* Status bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-1.5 bg-slate-950/85 backdrop-blur border-t border-slate-800/60 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  {mousePos && <span className="font-mono text-slate-400">x: {mousePos.x}  y: {mousePos.y}</span>}
                  <span className="text-slate-600">|</span>
                  <span>{points.length} pts</span>
                  <span>~{pathLength}px</span>
                  {bbox && <span>{Math.round(bbox.w)}×{Math.round(bbox.h)}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="capitalize text-slate-400">
                    {{ Q: "Quadratic", C: "Cubic", L: "Linear", A: "Arc", S: "Smooth", M: "Move" }[pathType]}
                  </span>
                  {closed && <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Closed</span>}
                  <span className="font-mono">{Math.round(zoom * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Point list */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Points ({points.length})</span>
                <div className="flex gap-1.5">
                  <SmallBtn onClick={() => flipHorizontal()} title="Flip H">⇄</SmallBtn>
                  <SmallBtn onClick={() => flipVertical()} title="Flip V">⇅</SmallBtn>
                  <SmallBtn onClick={() => centerPath()} title="Center (F)">⊕</SmallBtn>
                  <SmallBtn onClick={() => rotatePath(45)} title="Rotate 45°">↻</SmallBtn>
                  <SmallBtn onClick={() => scalePath(1.1)} title="Scale Up">+</SmallBtn>
                  <SmallBtn onClick={() => scalePath(0.9)} title="Scale Down">−</SmallBtn>
                  <button
                    onClick={() => addPoint()}
                    className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-lg text-xs transition-all border border-indigo-500/20"
                  >
                    <Plus size={11} /> Add
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {points.map((pt, i) => {
                  const color = POINT_COLORS[i % POINT_COLORS.length]
                  const isCtrl = pathType === "Q" ? i % 2 === 1 : pathType === "C" ? (i % 3 !== 0 && i > 0) : false
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedPoint(i === selectedPoint ? null : i)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs cursor-pointer transition-all ${
                        selectedPoint === i
                          ? "border-indigo-500/60 bg-indigo-600/10 text-indigo-300"
                          : "border-slate-700/60 hover:border-slate-600 bg-slate-800/40 text-slate-400"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      {isCtrl && <span className="text-slate-600 text-xs">C</span>}
                      <span className="font-mono">{Math.round(pt.x)},{Math.round(pt.y)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removePoint(i) }}
                        className="text-slate-700 hover:text-red-400 transition-colors"
                      ><X size={9} /></button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="space-y-3">
            {/* Tabs */}
            <div className="grid grid-cols-4 bg-slate-900 border border-slate-800 rounded-2xl p-1 gap-1">
              {([
                { id: "style", label: "Style", icon: <Sliders size={13} /> },
                { id: "path", label: "Path", icon: <Code size={13} /> },
                { id: "export", label: "Export", icon: <Download size={13} /> },
                { id: "shortcuts", label: "Keys", icon: <Keyboard size={13} /> },
              ] as { id: typeof activeTab; label: string; icon: React.ReactNode }[]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-slate-700 text-white shadow"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* ── Style Tab ── */}
            {activeTab === "style" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-5">
                <PanelSection title="Stroke">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <PanelLabel>Color</PanelLabel>
                      <div className="flex items-center gap-2 mt-1.5">
                        <input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)}
                          className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent flex-shrink-0" />
                        <input type="text" value={stroke} onChange={(e) => setStroke(e.target.value)}
                          className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                    <div>
                      <PanelLabel>Width: {strokeWidth}px</PanelLabel>
                      <input type="range" min={0.5} max={40} step={0.5} value={strokeWidth}
                        onChange={(e) => setStrokeWidth(Number(e.target.value))}
                        className="w-full mt-3 accent-indigo-500" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <PanelLabel>Opacity: {Math.round(strokeOpacity * 100)}%</PanelLabel>
                    <input type="range" min={0} max={1} step={0.01} value={strokeOpacity}
                      onChange={(e) => setStrokeOpacity(Number(e.target.value))}
                      className="w-full mt-1 accent-indigo-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <PanelLabel>Dash</PanelLabel>
                      <PanelSelect value={strokeDash} onChange={setStrokeDash}>
                        <option value="none">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="dash-dot">Dash-Dot</option>
                        <option value="long-dash">Long Dash</option>
                      </PanelSelect>
                    </div>
                    <div>
                      <PanelLabel>Cap</PanelLabel>
                      <PanelSelect value={lineCap} onChange={(v) => setLineCap(v as typeof lineCap)}>
                        <option value="round">Round</option>
                        <option value="butt">Butt</option>
                        <option value="square">Square</option>
                      </PanelSelect>
                    </div>
                    <div>
                      <PanelLabel>Join</PanelLabel>
                      <PanelSelect value={lineJoin} onChange={(v) => setLineJoin(v as typeof lineJoin)}>
                        <option value="round">Round</option>
                        <option value="miter">Miter</option>
                        <option value="bevel">Bevel</option>
                      </PanelSelect>
                    </div>
                  </div>
                </PanelSection>

                <PanelSection title="Fill">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <button
                      onClick={() => setFill("none")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${fill === "none" ? "bg-slate-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
                    >None</button>
                    <div className="flex items-center gap-2">
                      <input type="color" value={fill === "none" ? "#6366f1" : fill}
                        onChange={(e) => setFill(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent flex-shrink-0" />
                      <input type="text" value={fill === "none" ? "none" : fill}
                        onChange={(e) => setFill(e.target.value)}
                        className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                  {fill !== "none" && (
                    <div>
                      <PanelLabel>Fill Opacity: {Math.round(fillOpacity * 100)}%</PanelLabel>
                      <input type="range" min={0} max={1} step={0.01} value={fillOpacity}
                        onChange={(e) => setFillOpacity(Number(e.target.value))}
                        className="w-full mt-1 accent-indigo-500" />
                    </div>
                  )}
                </PanelSection>

                <PanelSection title="Canvas">
                  <div className="flex items-center gap-3 mb-2">
                    <PanelLabel>BG Color</PanelLabel>
                    <input type="color" value={bgTransparent ? "#000000" : bgColor}
                      onChange={(e) => { setBgColor(e.target.value); setBgTransparent(false) }}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
                    <input type="text" value={bgTransparent ? "transparent" : bgColor}
                      onChange={(e) => { setBgColor(e.target.value); setBgTransparent(false) }}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500" />
                    <button onClick={() => setBgTransparent((v) => !v)}
                      className={`px-2 py-1 rounded-lg text-xs transition-all ${bgTransparent ? "bg-slate-600 text-white" : "text-slate-500 hover:bg-slate-800"}`}>
                      α
                    </button>
                  </div>
                  <div className="mb-2">
                    <PanelLabel>Point Radius: {pointRadius}px</PanelLabel>
                    <input type="range" min={3} max={16} step={1} value={pointRadius}
                      onChange={(e) => setPointRadius(Number(e.target.value))}
                      className="w-full mt-1 accent-indigo-500" />
                  </div>
                  {snap && (
                    <div className="mb-2">
                      <PanelLabel>Snap Grid: {snapSize}px</PanelLabel>
                      <input type="range" min={5} max={60} step={5} value={snapSize}
                        onChange={(e) => setSnapSize(Number(e.target.value))}
                        className="w-full mt-1 accent-indigo-500" />
                    </div>
                  )}
                  <div>
                    <PanelLabel>Grid Type</PanelLabel>
                    <div className="flex gap-1.5 mt-1.5">
                      {(["lines", "dots", "cross"] as const).map((g) => (
                        <button key={g} onClick={() => setGridType(g)}
                          className={`flex-1 py-1 rounded-lg text-xs capitalize transition-all ${gridType === g ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </PanelSection>

                <PanelSection title="Options">
                  <div className="flex flex-wrap gap-2">
                    <PillBtn active={closed} onClick={() => setClosed((v) => !v)} label="Closed" />
                    <PillBtn active={pathGlow} onClick={() => setPathGlow((v) => !v)} label="Glow" />
                    <PillBtn active={showMidpoints} onClick={() => setShowMidpoints((v) => !v)} label="Midpoints" />
                    <PillBtn active={animatePath} onClick={() => setAnimatePath((v) => !v)} label="Animate" />
                  </div>
                  {animatePath && (
                    <div className="mt-2">
                      <PanelLabel>Duration: {animDuration}s</PanelLabel>
                      <input type="range" min={0.3} max={10} step={0.1} value={animDuration}
                        onChange={(e) => setAnimDuration(Number(e.target.value))}
                        className="w-full mt-1 accent-indigo-500" />
                    </div>
                  )}
                  <div className="mt-2">
                    <PanelLabel>Point Labels</PanelLabel>
                    <div className="flex gap-1.5 mt-1.5">
                      {(["index", "coords", "none"] as const).map((m) => (
                        <button key={m} onClick={() => setPointLabelMode(m)}
                          className={`flex-1 py-1 rounded-lg text-xs capitalize transition-all ${pointLabelMode === m ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </PanelSection>
              </div>
            )}

            {/* ── Path Tab ── */}
            {activeTab === "path" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <PanelSection title="Path Output">
                  <div className="flex items-center gap-2 mb-2.5">
                    <button onClick={() => setShowFullSVG(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${!showFullSVG ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}>
                      d= only
                    </button>
                    <button onClick={() => setShowFullSVG(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${showFullSVG ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}>
                      Full SVG
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={showFullSVG ? fullSVGCode : pathData}
                    className="w-full min-h-[120px] p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed"
                  />
                  <button
                    onClick={() => { navigator.clipboard.writeText(showFullSVG ? fullSVGCode : pathData); showToast("Copied!") }}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-all"
                  >
                    <Copy size={12} /> Copy
                  </button>
                </PanelSection>

                {/* Point editor */}
                <PanelSection title="Selected Point">
                  {selectedPoint !== null && selectedPoint < points.length ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: POINT_COLORS[selectedPoint % POINT_COLORS.length] }} />
                        <span className="text-sm font-bold text-slate-200">Point {selectedPoint}</span>
                        <span className="ml-auto text-xs text-slate-500">
                          {pathType === "Q" && selectedPoint % 2 === 1 ? "Control" :
                           pathType === "C" && selectedPoint % 3 !== 0 ? "Control" : "Anchor"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <PanelLabel>X</PanelLabel>
                          <input type="number" value={Math.round(points[selectedPoint].x)}
                            onChange={(e) => updatePoint(selectedPoint, Number(e.target.value), points[selectedPoint].y)}
                            className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                          <PanelLabel>Y</PanelLabel>
                          <input type="number" value={Math.round(points[selectedPoint].y)}
                            onChange={(e) => updatePoint(selectedPoint, points[selectedPoint].x, Number(e.target.value))}
                            className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => duplicatePoint(selectedPoint)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-all">
                          <Copy size={11} /> Duplicate
                        </button>
                        <button onClick={() => removePoint(selectedPoint)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-all">
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 text-xs">Click a point on the canvas to select and edit it.</p>
                  )}
                </PanelSection>

                {/* Stats */}
                <PanelSection title="Stats">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["Points", points.length],
                      ["Length", `~${pathLength}px`],
                      ["Type", { Q: "Quadratic", C: "Cubic", L: "Linear", A: "Arc", S: "Smooth", M: "Move" }[pathType]],
                      ["Closed", closed ? "Yes" : "No"],
                      ["Zoom", `${Math.round(zoom * 100)}%`],
                      ["History", `${history.length}/${MAX_HISTORY}`],
                      ...(bbox ? [
                        ["BBox W", `${Math.round(bbox.w)}px`],
                        ["BBox H", `${Math.round(bbox.h)}px`],
                      ] : []),
                    ].map(([k, v]) => (
                      <div key={String(k)} className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2">
                        <div className="text-slate-600 text-xs">{k}</div>
                        <div className="text-slate-200 text-sm font-bold mt-0.5">{v}</div>
                      </div>
                    ))}
                  </div>
                </PanelSection>
              </div>
            )}

            {/* ── Export Tab ── */}
            {activeTab === "export" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <PanelSection title="Format">
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { id: "svg", label: "SVG", icon: "⬡" },
                      { id: "png", label: "PNG", icon: "🖼" },
                      { id: "css", label: "CSS", icon: "#" },
                      { id: "react", label: "React", icon: "⚛" },
                      { id: "json", label: "JSON", icon: "{}" },
                    ] as { id: ExportFormat; label: string; icon: string }[]).map(({ id, label, icon }) => (
                      <button key={id} onClick={() => setExportFormat(id)}
                        className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                          exportFormat === id
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                        }`}>
                        <span>{icon}</span> {label}
                      </button>
                    ))}
                  </div>
                </PanelSection>

                <PanelSection title="Preview">
                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-400 overflow-auto max-h-48 whitespace-pre-wrap leading-relaxed">
                    {exportCode}
                  </pre>
                </PanelSection>

                <PanelSection title="Copy">
                  <button
                    onClick={() => { navigator.clipboard.writeText(exportCode); showToast("Copied to clipboard!") }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Copy size={15} /> Copy {exportFormat.toUpperCase()}
                  </button>
                </PanelSection>

                <PanelSection title="Download">
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={downloadSVG}
                      className="flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20">
                      <Download size={14} /> SVG
                    </button>
                    <button onClick={() => downloadPNG(2)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/20 rounded-xl text-sm font-semibold transition-all">
                      <Download size={14} /> PNG 2×
                    </button>
                    <button onClick={() => downloadPNG(4)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all">
                      <Download size={14} /> PNG 4×
                    </button>
                    <button onClick={() => downloadFile(exportCode, `path.${exportFormat === "react" ? "tsx" : exportFormat === "json" ? "json" : exportFormat}`, "text/plain")}
                      className="flex items-center justify-center gap-2 py-2.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/20 rounded-xl text-sm font-medium transition-all">
                      <FileCode size={14} /> {exportFormat.toUpperCase()}
                    </button>
                  </div>
                </PanelSection>
              </div>
            )}

            {/* ── Shortcuts Tab ── */}
            {activeTab === "shortcuts" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <PanelSection title="Keyboard Shortcuts">
                  <div className="space-y-1">
                    {[
                      ["Tools", ""],
                      ["V", "Select tool"],
                      ["P", "Add point tool"],
                      ["H", "Pan tool"],
                      ["D", "Delete tool"],
                      ["─", ""],
                      ["Toggles", ""],
                      ["G", "Toggle grid"],
                      ["S", "Toggle snap"],
                      ["K", "Toggle handles"],
                      ["C", "Toggle coords"],
                      ["R", "Toggle ruler"],
                      ["B", "Toggle bounding box"],
                      ["─", ""],
                      ["View", ""],
                      ["+/=", "Zoom in"],
                      ["-/_", "Zoom out"],
                      ["0", "Reset view"],
                      ["F", "Center path"],
                      ["─", ""],
                      ["Edit", ""],
                      ["Ctrl+Z", "Undo"],
                      ["Ctrl+Y", "Redo"],
                      ["Ctrl+C", "Copy path"],
                      ["Del/Bksp", "Delete selected point"],
                      ["Esc", "Deselect"],
                      ["Double-click point", "Duplicate (select) / Remove (delete tool)"],
                      ["Scroll", "Pan canvas"],
                      ["Ctrl+Scroll", "Zoom canvas"],
                    ].map(([key, desc], idx) => (
                      key === "─" ? (
                        <div key={idx} className="border-t border-slate-800 my-2" />
                      ) : desc === "" ? (
                        <div key={idx} className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-3 mb-1">{key}</div>
                      ) : (
                        <div key={idx} className="flex items-center justify-between py-1">
                          <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono whitespace-nowrap">{key}</kbd>
                          <span className="text-xs text-slate-500 text-right ml-3">{desc}</span>
                        </div>
                      )
                    ))}
                  </div>
                </PanelSection>
              </div>
            )}

            {/* Action bar */}
            <div className="flex gap-2">
              <ActionBtn onClick={undo} disabled={history.length === 0} icon={<RotateCcw size={13} />} label="Undo" />
              <ActionBtn onClick={redo} disabled={future.length === 0} icon={<RotateCcw size={13} className="scale-x-[-1]" />} label="Redo" />
              <button
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/8 hover:bg-red-500/15 border border-red-500/15 text-red-400 rounded-xl text-xs font-semibold transition-all"
              >
                <Trash2 size={13} /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animate style */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )

  // Point drag handler (extracted for readability)
  function handlePointMouseDown(e: React.MouseEvent, i: number) {
    if (tool === "delete") { removePoint(i); return }
    if (tool !== "select") return
    e.stopPropagation()
    setSelectedPoint(i)
    dragging.current = i
    const onMove = (ev: MouseEvent) => {
      const rect = svgRef.current!.getBoundingClientRect()
      const mx = (ev.clientX - rect.left) * (CANVAS_W / zoom) / rect.width + (-pan.x / zoom)
      const my = (ev.clientY - rect.top) * (CANVAS_H / zoom) / rect.height + (-pan.y / zoom)
      updatePoint(i, mx, my)
    }
    const onUp = () => {
      saveHistory()
      dragging.current = null
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function ToolGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 border-r border-slate-800 pr-3 mr-1 last:border-0">
      {children}
    </div>
  )
}

function ToolBtn({
  children, active = false, onClick, title, accent = "blue"
}: {
  children: React.ReactNode; active?: boolean; onClick?: () => void; title?: string; accent?: "blue" | "violet"
}) {
  return (
    <button
      onClick={onClick} title={title}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
        active
          ? accent === "violet"
            ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
            : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  )
}

function ToggleBtn({ active, onToggle, label, shortcut }: { active: boolean; onToggle: () => void; label: string; shortcut?: string }) {
  return (
    <button
      onClick={onToggle}
      title={`${label}${shortcut ? ` (${shortcut})` : ""}`}
      className={`px-2 py-1.5 rounded-xl text-xs font-medium transition-all ${
        active ? "bg-slate-700 text-white" : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
      }`}
    >
      <span className="hidden md:inline">{label}</span>
      <span className="md:hidden font-mono">{shortcut}</span>
    </button>
  )
}

function SmallBtn({ onClick, title, children }: { onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title}
      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-all border border-slate-700/60">
      {children}
    </button>
  )
}

function ActionBtn({ onClick, disabled, icon, label }: { onClick: () => void; disabled?: boolean; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 disabled:opacity-25 disabled:cursor-not-allowed text-slate-300 rounded-xl text-xs font-semibold transition-all"
    >
      {icon} {label}
    </button>
  )
}

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{title}</h3>
      {children}
    </div>
  )
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-slate-500 font-medium">{children}</span>
}

function PanelSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500">
      {children}
    </select>
  )
}

function PillBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        active
          ? "bg-indigo-600 text-white shadow shadow-indigo-500/20"
          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
      }`}>
      {label}
    </button>
  )
}
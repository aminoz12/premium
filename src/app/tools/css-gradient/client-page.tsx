"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ToolLayout } from "@/components/layout/tool-layout"
import {
  Copy, Check, Shuffle, Plus, Trash2, RotateCw,
  Code2, Palette, Sparkles, ChevronDown, X,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type GradientType = "linear" | "radial" | "conic"
type RadialShape = "circle" | "ellipse"
type RadialPos =
  | "center" | "top" | "bottom" | "left" | "right"
  | "top left" | "top right" | "bottom left" | "bottom right"
type ExportFormat = "css" | "tailwind" | "scss"

interface ColorStop {
  id: string
  color: string
  position: number // 0-100
  alpha: number // 0-1
}

interface GradientState {
  type: GradientType
  angle: number // for linear (deg)
  shape: RadialShape // for radial
  position: RadialPos // for radial / conic center
  stops: ColorStop[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9)

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

function rgbaString(stop: ColorStop): string {
  if (stop.alpha >= 1) return stop.color
  const [r, g, b] = hexToRgb(stop.color)
  return `rgba(${r}, ${g}, ${b}, ${stop.alpha.toFixed(2)})`
}

function buildStopsCss(stops: ColorStop[]): string {
  return [...stops]
    .sort((a, b) => a.position - b.position)
    .map((s) => `${rgbaString(s)} ${s.position}%`)
    .join(", ")
}

function buildGradientCss(state: GradientState): string {
  const stopsCss = buildStopsCss(state.stops)
  if (state.type === "linear") {
    return `linear-gradient(${state.angle}deg, ${stopsCss})`
  }
  if (state.type === "radial") {
    return `radial-gradient(${state.shape} at ${state.position}, ${stopsCss})`
  }
  return `conic-gradient(from ${state.angle}deg at ${state.position}, ${stopsCss})`
}

// Closest Tailwind direction class for linear angle (Tailwind v3 only supports 8 directions)
function angleToTailwindDirection(angle: number): string {
  const a = ((angle % 360) + 360) % 360
  const dirs: [number, string][] = [
    [0, "to-t"], [45, "to-tr"], [90, "to-r"], [135, "to-br"],
    [180, "to-b"], [225, "to-bl"], [270, "to-l"], [315, "to-tl"],
  ]
  let closest = dirs[0]
  let min = 360
  for (const d of dirs) {
    const diff = Math.min(Math.abs(a - d[0]), 360 - Math.abs(a - d[0]))
    if (diff < min) { min = diff; closest = d }
  }
  return closest[1]
}

function buildTailwind(state: GradientState): string {
  const sorted = [...state.stops].sort((a, b) => a.position - b.position)
  if (state.type !== "linear") {
    return `/* Tailwind v3 utilities only support linear directions.\n   Use an arbitrary value for ${state.type} gradients: */\nbg-[${buildGradientCss(state)}]`
  }
  const dir = angleToTailwindDirection(state.angle)
  if (sorted.length <= 3) {
    const parts = [`bg-gradient-${dir}`]
    const labels = ["from", "via", "to"]
    sorted.forEach((s, i) => {
      const label = sorted.length === 2 ? (i === 0 ? "from" : "to") : labels[i]
      parts.push(`${label}-[${rgbaString(s)}]`)
    })
    return parts.join(" ")
  }
  return `bg-[${buildGradientCss(state)}]`
}

function buildScss(state: GradientState): string {
  const sorted = [...state.stops].sort((a, b) => a.position - b.position)
  const varLines = sorted.map((s, i) => `$gradient-color-${i + 1}: ${rgbaString(s)};`).join("\n")
  return `${varLines}\n\n.gradient-element {\n  background: ${buildGradientCss(state)};\n}`
}

// ─── Presets ──────────────────────────────────────────────────────────────────

interface Preset {
  name: string
  type: GradientType
  angle: number
  shape: RadialShape
  position: RadialPos
  colors: [string, string, ...string[]]
}

const PRESETS: Preset[] = [
  { name: "Sunset", type: "linear", angle: 135, shape: "circle", position: "center", colors: ["#f093fb", "#f5576c"] },
  { name: "Ocean", type: "linear", angle: 135, shape: "circle", position: "center", colors: ["#667eea", "#764ba2"] },
  { name: "Forest", type: "linear", angle: 135, shape: "circle", position: "center", colors: ["#11998e", "#38ef7d"] },
  { name: "Fire", type: "linear", angle: 135, shape: "circle", position: "center", colors: ["#f7971e", "#ffd200"] },
  { name: "Midnight", type: "linear", angle: 135, shape: "circle", position: "center", colors: ["#2c3e50", "#4ca1af"] },
  { name: "Rose Gold", type: "linear", angle: 135, shape: "circle", position: "center", colors: ["#f6d365", "#fda085"] },
  { name: "Candy", type: "linear", angle: 90, shape: "circle", position: "center", colors: ["#ff9a9e", "#fecfef"] },
  { name: "Mint", type: "linear", angle: 120, shape: "circle", position: "center", colors: ["#43e97b", "#38f9d7"] },
  { name: "Grape", type: "linear", angle: 160, shape: "circle", position: "center", colors: ["#7f00ff", "#e100ff"] },
  { name: "Peach", type: "linear", angle: 135, shape: "circle", position: "center", colors: ["#ffecd2", "#fcb69f"] },
  { name: "Radial Glow", type: "radial", angle: 0, shape: "circle", position: "center", colors: ["#6a11cb", "#2575fc"] },
  { name: "Spotlight", type: "radial", angle: 0, shape: "ellipse", position: "top", colors: ["#ffffff", "#1f2937"] },
  { name: "Color Wheel", type: "conic", angle: 0, shape: "circle", position: "center", colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6b6b"] },
  { name: "Aurora", type: "conic", angle: 30, shape: "circle", position: "center", colors: ["#00c6ff", "#0072ff", "#ff00cc", "#00c6ff"] },
  { name: "Steel", type: "linear", angle: 110, shape: "circle", position: "center", colors: ["#71b7e6", "#9b59b6"] },
  { name: "Lava", type: "linear", angle: 45, shape: "circle", position: "center", colors: ["#dd2476", "#ff512f"] },
]

function presetToStops(colors: string[]): ColorStop[] {
  if (colors.length === 1) {
    return [
      { id: uid(), color: colors[0], position: 0, alpha: 1 },
      { id: uid(), color: colors[0], position: 100, alpha: 1 },
    ]
  }
  const step = 100 / (colors.length - 1)
  return colors.map((c, i) => ({ id: uid(), color: c, position: Math.round(i * step), alpha: 1 }))
}

function randomHex(): string {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")
}

// ─── GEO CTA ──────────────────────────────────────────────────────────────────

const GEO_CTA: Record<string, string> = {
  MA: "Generateur de degrade CSS gratuit — utilise par les developpeurs au Maroc.",
  FR: "Generateur de degrade CSS gratuit et illimite, sans inscription.",
  DZ: "Outil gratuit de creation de degrades CSS pour developpeurs en Algerie.",
  TN: "Creez des degrades CSS professionnels gratuitement, sans compte.",
  US: "Trusted by frontend developers across the US — build gradients free.",
  GB: "Create pixel-perfect CSS gradients instantly — free, no signup, UK-friendly.",
  IN: "The fastest free CSS gradient generator for developers — no account needed.",
  DEFAULT: "Build unlimited CSS gradients free — live preview, instant code export.",
}

// ─── Small UI atoms ───────────────────────────────────────────────────────────

function SegBtn({
  active, onClick, children,
}: React.PropsWithChildren<{ active: boolean; onClick: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3.5 py-2 rounded-lg text-sm font-semibold transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function PositionGrid({
  value, onChange,
}: { value: RadialPos; onChange: (v: RadialPos) => void }) {
  const grid: RadialPos[] = [
    "top left", "top", "top right",
    "left", "center", "right",
    "bottom left", "bottom", "bottom right",
  ]
  return (
    <div className="grid grid-cols-3 gap-1.5 w-[120px]">
      {grid.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          title={p}
          className={[
            "h-8 w-8 rounded-md border transition-all flex items-center justify-center",
            value === p
              ? "bg-primary border-primary"
              : "bg-background border-border/60 hover:border-border",
          ].join(" ")}
        >
          <span className={["h-1.5 w-1.5 rounded-full", value === p ? "bg-primary-foreground" : "bg-muted-foreground/50"].join(" ")} />
        </button>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ToolClient() {
  const [state, setState] = useState<GradientState>({
    type: "linear",
    angle: 135,
    shape: "circle",
    position: "center",
    stops: presetToStops(["#667eea", "#764ba2"]),
  })
  const [format, setFormat] = useState<ExportFormat>("css")
  const [selectedStopId, setSelectedStopId] = useState<string>(state.stops[0].id)
  const [copied, setCopied] = useState(false)
  const [geoCTA, setGeoCTA] = useState(GEO_CTA.DEFAULT)
  const [presetsOpen, setPresetsOpen] = useState(true)
  const barRef = useRef<HTMLDivElement>(null)
  const draggingId = useRef<string | null>(null)

  // GEO detection for localized CTA (Morocco / France / Algeria / Tunisia focus)
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""
      if (tz.includes("Africa/Casablanca")) setGeoCTA(GEO_CTA.MA)
      else if (tz.includes("Europe/Paris")) setGeoCTA(GEO_CTA.FR)
      else if (tz.includes("Africa/Algiers")) setGeoCTA(GEO_CTA.DZ)
      else if (tz.includes("Africa/Tunis")) setGeoCTA(GEO_CTA.TN)
      else if (tz.includes("America/New_York") || tz.includes("America/Los_Angeles") || tz.includes("America/Chicago")) setGeoCTA(GEO_CTA.US)
      else if (tz.includes("Europe/London")) setGeoCTA(GEO_CTA.GB)
      else if (tz.includes("Asia/Kolkata")) setGeoCTA(GEO_CTA.IN)
    } catch (_) {}
  }, [])

  const sortedStops = useMemo(
    () => [...state.stops].sort((a, b) => a.position - b.position),
    [state.stops]
  )

  const gradientCss = useMemo(() => buildGradientCss(state), [state])

  const codeOutput = useMemo(() => {
    if (format === "tailwind") return buildTailwind(state)
    if (format === "scss") return buildScss(state)
    return `background: ${gradientCss};`
  }, [format, state, gradientCss])

  // ── Stop management ──
  const addStop = useCallback(() => {
    setState((s) => {
      if (s.stops.length >= 12) return s
      const positions = s.stops.map((st) => st.position)
      const mid = Math.round(
        positions.length >= 2
          ? (Math.min(...positions) + Math.max(...positions)) / 2
          : 50
      )
      const newStop: ColorStop = { id: uid(), color: randomHex(), position: mid, alpha: 1 }
      setSelectedStopId(newStop.id)
      return { ...s, stops: [...s.stops, newStop] }
    })
  }, [])

  const removeStop = useCallback((id: string) => {
    setState((s) => {
      if (s.stops.length <= 2) return s
      const next = s.stops.filter((st) => st.id !== id)
      if (selectedStopId === id) setSelectedStopId(next[0].id)
      return { ...s, stops: next }
    })
  }, [selectedStopId])

  const updateStop = useCallback((id: string, patch: Partial<ColorStop>) => {
    setState((s) => ({
      ...s,
      stops: s.stops.map((st) => (st.id === id ? { ...st, ...patch } : st)),
    }))
  }, [])

  // ── Drag to reposition stop on the gradient bar ──
  const handlePointerMove = useCallback((clientX: number) => {
    if (!draggingId.current || !barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    let pct = ((clientX - rect.left) / rect.width) * 100
    pct = Math.max(0, Math.min(100, Math.round(pct)))
    updateStop(draggingId.current, { position: pct })
  }, [updateStop])

  useEffect(() => {
    const onMove = (e: MouseEvent) => handlePointerMove(e.clientX)
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) handlePointerMove(e.touches[0].clientX)
    }
    const onUp = () => { draggingId.current = null }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("touchmove", onTouch)
    window.addEventListener("mouseup", onUp)
    window.addEventListener("touchend", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("touchmove", onTouch)
      window.removeEventListener("mouseup", onUp)
      window.removeEventListener("touchend", onUp)
    }
  }, [handlePointerMove])

  // ── Actions ──
  const applyPreset = (p: Preset) => {
    const stops = presetToStops(p.colors)
    setState({ type: p.type, angle: p.angle, shape: p.shape, position: p.position, stops })
    setSelectedStopId(stops[0].id)
  }

  const randomize = () => {
    const count = 2 + Math.floor(Math.random() * 2)
    const colors = Array.from({ length: count }, randomHex)
    const types: GradientType[] = ["linear", "radial", "conic"]
    const type = types[Math.floor(Math.random() * types.length)]
    const stops = presetToStops(colors)
    setState({
      type,
      angle: Math.floor(Math.random() * 360),
      shape: Math.random() > 0.5 ? "circle" : "ellipse",
      position: "center",
      stops,
    })
    setSelectedStopId(stops[0].id)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (_) {}
  }

  const selectedStop = state.stops.find((s) => s.id === selectedStopId) ?? state.stops[0]

  return (
    <>
      <style>{`
        @keyframes slideIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes popIn { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .stop-handle { touch-action: none; }
        .checker-bg {
          background-image:
            linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%),
            linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%),
            linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 animate-slide-in">

        {/* ── GEO CTA strip ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-primary/5 border border-primary/10 text-sm gap-4 flex-wrap transition-all">
          <span className="text-foreground font-medium flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
            {geoCTA}
          </span>
          <div className="flex gap-2 flex-wrap">
            {["🔒 No Signup", "⚡ Live Preview", "🆓 Free Forever", "🎨 Unlimited Stops"].map((b) => (
              <span key={b} className="text-xs px-3 py-1 rounded-full bg-background shadow-sm border border-border/50 text-muted-foreground font-medium">{b}</span>
            ))}
          </div>
        </div>

        {/* ── Main layout: Preview/Controls + Code Sidebar ────────────────── */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ── Left: Live Preview + Editor ──────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Live preview canvas */}
            <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm checker-bg">
              <div
                className="w-full h-64 sm:h-80 transition-all duration-150"
                style={{ background: gradientCss }}
                role="img"
                aria-label={`Live preview of ${state.type} gradient`}
              />
            </div>

            {/* Type selector + actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border/40">
                {(["linear", "radial", "conic"] as GradientType[]).map((t) => (
                  <SegBtn key={t} active={state.type === t} onClick={() => setState((s) => ({ ...s, type: t }))}>
                    {t === "linear" ? "Linear" : t === "radial" ? "Radial" : "Conic"}
                  </SegBtn>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={randomize}>
                <Shuffle className="h-4 w-4" />
                Randomize
              </Button>
            </div>

            {/* Color stops bar */}
            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  Color Stops
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-8"
                  onClick={addStop}
                  disabled={state.stops.length >= 12}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Stop
                </Button>
              </div>

              {/* Gradient position bar with draggable handles */}
              <div
                ref={barRef}
                className="relative h-10 rounded-lg checker-bg select-none"
                style={{ touchAction: "none" }}
              >
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{ background: `linear-gradient(90deg, ${buildStopsCss(state.stops)})` }}
                />
                {state.stops.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onMouseDown={() => { draggingId.current = s.id; setSelectedStopId(s.id) }}
                    onTouchStart={() => { draggingId.current = s.id; setSelectedStopId(s.id) }}
                    className={[
                      "stop-handle absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full border-2 shadow-md cursor-grab active:cursor-grabbing transition-transform",
                      selectedStopId === s.id ? "border-primary scale-110 z-10" : "border-white",
                    ].join(" ")}
                    style={{ left: `${s.position}%`, background: s.color }}
                    title={`${s.color} @ ${s.position}%`}
                  />
                ))}
              </div>

              {/* Selected stop editor */}
              {selectedStop && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="relative h-10 w-10 rounded-lg border border-border/60 overflow-hidden shrink-0">
                    <input
                      type="color"
                      value={selectedStop.color}
                      onChange={(e) => updateStop(selectedStop.id, { color: e.target.value })}
                      className="absolute inset-0 h-[150%] w-[150%] -left-2 -top-2 cursor-pointer border-0 p-0"
                      aria-label="Pick stop color"
                    />
                  </div>
                  <input
                    type="text"
                    value={selectedStop.color}
                    onChange={(e) => {
                      const v = e.target.value
                      if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v)) updateStop(selectedStop.id, { color: v })
                      else if (/^#([0-9A-Fa-f]{0,6})$/.test(v)) updateStop(selectedStop.id, { color: v })
                    }}
                    className="w-24 text-sm font-mono bg-background border border-border/60 rounded-md px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="#000000"
                  />

                  <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                    <span className="text-xs text-muted-foreground font-medium shrink-0">Pos</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selectedStop.position}
                      onChange={(e) => updateStop(selectedStop.id, { position: Number(e.target.value) })}
                      className="flex-1 accent-primary"
                    />
                    <span className="text-xs font-mono text-muted-foreground w-10 text-right shrink-0">{selectedStop.position}%</span>
                  </div>

                  <div className="flex items-center gap-2 min-w-[120px]">
                    <span className="text-xs text-muted-foreground font-medium shrink-0">Alpha</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={selectedStop.alpha}
                      onChange={(e) => updateStop(selectedStop.id, { alpha: Number(e.target.value) })}
                      className="flex-1 accent-primary"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeStop(selectedStop.id)}
                    disabled={state.stops.length <= 2}
                    title="Remove stop"
                    className="h-9 w-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-30 disabled:hover:bg-transparent transition-colors shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* All stops list (quick access for many stops) */}
              {sortedStops.length > 2 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sortedStops.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedStopId(s.id)}
                      className={[
                        "flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-md border transition-all",
                        selectedStopId === s.id ? "border-primary bg-primary/5" : "border-border/50 hover:border-border",
                      ].join(" ")}
                    >
                      <span className="h-3 w-3 rounded-full border border-border/40" style={{ background: s.color }} />
                      {s.position}%
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Angle / Shape / Position controls */}
            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground">
                {state.type === "radial" ? "Shape & Position" : "Direction"}
              </h3>

              {state.type !== "radial" && (
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 rounded-full border-2 border-border/60 flex items-center justify-center">
                    <RotateCw
                      className="h-5 w-5 text-primary transition-transform"
                      style={{ transform: `rotate(${state.angle}deg)` }}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {state.type === "conic" ? "Start Angle" : "Angle"}
                      </label>
                      <span className="text-sm font-mono text-foreground">{state.angle}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={state.angle}
                      onChange={(e) => setState((s) => ({ ...s, angle: Number(e.target.value) }))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              )}

              {state.type === "radial" && (
                <div className="flex flex-wrap items-start gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Shape</label>
                    <div className="inline-flex p-1 rounded-lg bg-muted/60 border border-border/40">
                      {(["circle", "ellipse"] as RadialShape[]).map((sh) => (
                        <SegBtn key={sh} active={state.shape === sh} onClick={() => setState((s) => ({ ...s, shape: sh }))}>
                          {sh === "circle" ? "Circle" : "Ellipse"}
                        </SegBtn>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Center Position</label>
                    <PositionGrid value={state.position} onChange={(p) => setState((s) => ({ ...s, position: p }))} />
                  </div>
                </div>
              )}

              {state.type === "conic" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Center Position</label>
                  <PositionGrid value={state.position} onChange={(p) => setState((s) => ({ ...s, position: p }))} />
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4 shadow-sm">
              <button
                type="button"
                onClick={() => setPresetsOpen((v) => !v)}
                className="w-full flex items-center justify-between"
              >
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Gradient Presets
                </h3>
                <ChevronDown className={["h-4 w-4 text-muted-foreground transition-transform", presetsOpen ? "rotate-180" : ""].join(" ")} />
              </button>
              {presetsOpen && (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 animate-pop-in">
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      title={p.name}
                      onClick={() => applyPreset(p)}
                      className="group flex flex-col items-center gap-1.5"
                    >
                      <span
                        className="h-12 w-full rounded-lg border border-border/50 shadow-sm transition-transform group-hover:scale-105 group-hover:shadow-md"
                        style={{
                          background: buildGradientCss({
                            type: p.type, angle: p.angle, shape: p.shape, position: p.position,
                            stops: presetToStops(p.colors),
                          }),
                        }}
                      />
                      <span className="text-[10px] text-muted-foreground font-medium truncate w-full text-center">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Code Export Sidebar ──────────────────────────────────── */}
          <div className="space-y-5 lg:sticky lg:top-4">

            <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  Export Code
                </h3>
                <div className="inline-flex p-0.5 rounded-md bg-muted/60 border border-border/40">
                  {(["css", "tailwind", "scss"] as ExportFormat[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      className={[
                        "px-2.5 py-1 rounded text-xs font-semibold transition-all",
                        format === f ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      {f === "css" ? "CSS" : f === "tailwind" ? "Tailwind" : "SCSS"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <pre className="text-xs font-mono p-4 overflow-x-auto bg-muted/30 text-foreground whitespace-pre-wrap break-all max-h-64">
                  {codeOutput}
                </pre>
              </div>

              <div className="p-3 border-t border-border/50">
                <Button
                  className="w-full gap-2 font-semibold"
                  onClick={copyCode}
                  variant={copied ? "outline" : "default"}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy {format === "css" ? "CSS" : format === "tailwind" ? "Tailwind" : "SCSS"} Code
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick stop count / clear */}
            <div className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between shadow-sm">
              <span className="text-xs text-muted-foreground font-medium">
                {state.stops.length} color stop{state.stops.length !== 1 ? "s" : ""} · {state.type}
              </span>
              <button
                type="button"
                onClick={() => {
                  const stops = presetToStops(["#667eea", "#764ba2"])
                  setState({ type: "linear", angle: 135, shape: "circle", position: "center", stops })
                  setSelectedStopId(stops[0].id)
                }}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors px-2.5 py-1.5 rounded-md font-medium"
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>

            <p className="text-center text-[11px] text-muted-foreground leading-relaxed font-medium px-2">
              Works in <strong className="text-foreground">all modern browsers</strong> ·{" "}
              No watermark · No account · Free forever
            </p>
          </div>
        </div>
      </div>
   </>
  )
}
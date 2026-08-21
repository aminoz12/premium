"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ToolCard } from "@/components/layout/tool-layout"
import { Copy, CheckCircle2, Plus, Trash2 } from "lucide-react"
import { useClipboard } from "@/hooks/use-clipboard"
import { cn } from "@/lib/utils"

interface ShadowLayer {
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

function defaultLayer(): ShadowLayer {
  return { offsetX: 4, offsetY: 4, blur: 8, spread: 0, color: "#000000", opacity: 25, inset: false }
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "")
  const valid = /^[0-9a-fA-F]{6}$/.test(clean) ? clean : "000000"
  const r = parseInt(valid.slice(0, 2), 16)
  const g = parseInt(valid.slice(2, 4), 16)
  const b = parseInt(valid.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`
}

function layerToCSS(layer: ShadowLayer): string {
  const rgba = hexToRgba(layer.color, layer.opacity)
  return `${layer.inset ? "inset " : ""}${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${rgba}`
}

const BG_THEMES = {
  white: { label: "White", bg: "#ffffff" },
  gray: { label: "Gray", bg: "#f3f4f6" },
  dark: { label: "Dark", bg: "#1f2937" },
  indigo: { label: "Indigo", bg: "#eef2ff" },
} as const

type BgTheme = keyof typeof BG_THEMES

const PRESETS: { name: string; category: string; layers: ShadowLayer[] }[] = [
  // Material Design
  {
    name: "MD Elevation 2", category: "Material Design", layers: [
      { offsetX: 0, offsetY: 1, blur: 5, spread: 0, color: "#000000", opacity: 20, inset: false },
      { offsetX: 0, offsetY: 2, blur: 2, spread: 0, color: "#000000", opacity: 14, inset: false },
      { offsetX: 0, offsetY: 3, blur: 1, spread: -2, color: "#000000", opacity: 12, inset: false },
    ],
  },
  {
    name: "MD Elevation 6", category: "Material Design", layers: [
      { offsetX: 0, offsetY: 3, blur: 5, spread: -1, color: "#000000", opacity: 20, inset: false },
      { offsetX: 0, offsetY: 6, blur: 10, spread: 0, color: "#000000", opacity: 14, inset: false },
      { offsetX: 0, offsetY: 1, blur: 18, spread: 0, color: "#000000", opacity: 12, inset: false },
    ],
  },
  {
    name: "MD Elevation 16", category: "Material Design", layers: [
      { offsetX: 0, offsetY: 8, blur: 10, spread: -5, color: "#000000", opacity: 20, inset: false },
      { offsetX: 0, offsetY: 16, blur: 24, spread: 2, color: "#000000", opacity: 14, inset: false },
      { offsetX: 0, offsetY: 6, blur: 30, spread: 5, color: "#000000", opacity: 12, inset: false },
    ],
  },
  // Neumorphism
  {
    name: "Neumorphic Light", category: "Neumorphism", layers: [
      { offsetX: -6, offsetY: -6, blur: 12, spread: 0, color: "#ffffff", opacity: 100, inset: false },
      { offsetX: 6, offsetY: 6, blur: 12, spread: 0, color: "#000000", opacity: 15, inset: false },
    ],
  },
  {
    name: "Neumorphic Inset", category: "Neumorphism", layers: [
      { offsetX: -3, offsetY: -3, blur: 6, spread: 0, color: "#ffffff", opacity: 100, inset: true },
      { offsetX: 3, offsetY: 3, blur: 6, spread: 0, color: "#000000", opacity: 15, inset: true },
    ],
  },
  // Brutalism
  {
    name: "Brutalist Hard", category: "Brutalism", layers: [
      { offsetX: 6, offsetY: 6, blur: 0, spread: 0, color: "#000000", opacity: 100, inset: false },
    ],
  },
  {
    name: "Brutalist Double", category: "Brutalism", layers: [
      { offsetX: 8, offsetY: 8, blur: 0, spread: 0, color: "#000000", opacity: 100, inset: false },
      { offsetX: 4, offsetY: 4, blur: 0, spread: 0, color: "#555555", opacity: 60, inset: false },
    ],
  },
  // Soft UI
  {
    name: "Soft Raised", category: "Soft UI", layers: [
      { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: "#000000", opacity: 10, inset: false },
      { offsetX: 0, offsetY: 2, blur: 4, spread: -1, color: "#000000", opacity: 6, inset: false },
    ],
  },
  {
    name: "Soft Float", category: "Soft UI", layers: [
      { offsetX: 0, offsetY: 20, blur: 40, spread: 0, color: "#000000", opacity: 12, inset: false },
      { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: "#000000", opacity: 6, inset: false },
    ],
  },
  // Flat
  {
    name: "Flat Subtle", category: "Flat", layers: [
      { offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: "#000000", opacity: 10, inset: false },
    ],
  },
  {
    name: "Flat Card", category: "Flat", layers: [
      { offsetX: 0, offsetY: 2, blur: 8, spread: 0, color: "#000000", opacity: 8, inset: false },
    ],
  },
  {
    name: "Flat Border", category: "Flat", layers: [
      { offsetX: 0, offsetY: 0, blur: 0, spread: 1, color: "#000000", opacity: 12, inset: false },
      { offsetX: 0, offsetY: 2, blur: 6, spread: 0, color: "#000000", opacity: 6, inset: false },
    ],
  },
]

const TAILWIND_SHADOWS = [
  { cls: "shadow-sm", css: "0 1px 2px 0 rgba(0,0,0,0.05)" },
  { cls: "shadow", css: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)" },
  { cls: "shadow-md", css: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)" },
  { cls: "shadow-lg", css: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)" },
  { cls: "shadow-xl", css: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" },
  { cls: "shadow-2xl", css: "0 25px 50px -12px rgba(0,0,0,0.25)" },
  { cls: "shadow-inner", css: "inset 0 2px 4px 0 rgba(0,0,0,0.05)" },
  { cls: "shadow-none", css: "none" },
]

const PRESET_CATEGORIES = [...new Set(PRESETS.map((p) => p.category))]

export default function ToolClient() {
  const [layers, setLayers] = useState<ShadowLayer[]>([defaultLayer()])
  const [activeIdx, setActiveIdx] = useState(0)
  const [bgTheme, setBgTheme] = useState<BgTheme>("gray")
  const [twCopied, setTwCopied] = useState<string | null>(null)
  const { copy, copied } = useClipboard()

  const activeLayer = layers[Math.min(activeIdx, layers.length - 1)]

  const cssValue = useMemo(
    () => layers.map(layerToCSS).join(",\n            "),
    [layers]
  )
  const cssCode = `box-shadow: ${cssValue};`
  const previewShadow = useMemo(() => layers.map(layerToCSS).join(", "), [layers])

  const updateLayer = useCallback(
    (partial: Partial<ShadowLayer>) =>
      setLayers((prev) =>
        prev.map((l, i) => (i === activeIdx ? { ...l, ...partial } : l))
      ),
    [activeIdx]
  )

  function addLayer() {
    if (layers.length >= 5) return
    setLayers((prev) => [...prev, defaultLayer()])
    setActiveIdx(layers.length)
  }

  function removeLayer(idx: number) {
    if (layers.length === 1) return
    setLayers((prev) => prev.filter((_, i) => i !== idx))
    setActiveIdx((prev) => Math.min(prev, layers.length - 2))
  }

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setLayers(preset.layers.map((l) => ({ ...l })))
    setActiveIdx(0)
  }

  function copyTailwind(cls: string, css: string) {
    navigator.clipboard.writeText(cls).catch(() => { })
    setTwCopied(cls)
    setTimeout(() => setTwCopied(null), 2000)
  }

  return (
    <section aria-label="CSS Box Shadow Generator" className="w-full space-y-6">
      {/* Editor + Preview row */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Layer editor */}
        <ToolCard title="Shadow Layers">
          <div className="space-y-5">
            {/* Layer tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {layers.map((layer, idx) => (
                <div key={idx} className="flex items-center gap-0.5">
                  <button
                    onClick={() => setActiveIdx(idx)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      idx === activeIdx
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    {layer.inset ? "Inset " : ""}Layer {idx + 1}
                  </button>
                  {layers.length > 1 && (
                    <button
                      onClick={() => removeLayer(idx)}
                      className="ml-0.5 rounded p-1 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Remove layer ${idx + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {layers.length < 5 && (
                <Button variant="outline" size="sm" onClick={addLayer} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add Layer
                </Button>
              )}
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <SliderRow
                  label="Offset X" value={activeLayer.offsetX}
                  min={-100} max={100} unit="px"
                  onChange={(v) => updateLayer({ offsetX: v })}
                />
                <SliderRow
                  label="Offset Y" value={activeLayer.offsetY}
                  min={-100} max={100} unit="px"
                  onChange={(v) => updateLayer({ offsetY: v })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SliderRow
                  label="Blur" value={activeLayer.blur}
                  min={0} max={150} unit="px"
                  onChange={(v) => updateLayer({ blur: v })}
                />
                <SliderRow
                  label="Spread" value={activeLayer.spread}
                  min={-50} max={100} unit="px"
                  onChange={(v) => updateLayer({ spread: v })}
                />
              </div>
              <SliderRow
                label="Opacity" value={activeLayer.opacity}
                min={0} max={100} unit="%"
                onChange={(v) => updateLayer({ opacity: v })}
              />

              {/* Color + Inset */}
              <div className="flex flex-wrap items-end gap-4 pt-1">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Label>Shadow Color</Label>
                  <div className="flex gap-2">
                    <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-md border">
                      <input
                        type="color"
                        value={activeLayer.color}
                        onChange={(e) => updateLayer({ color: e.target.value })}
                        className="absolute -left-2 -top-2 h-16 w-16 cursor-pointer"
                        aria-label="Shadow color picker"
                      />
                    </div>
                    <Input
                      value={activeLayer.color}
                      onChange={(e) => updateLayer({ color: e.target.value })}
                      className="font-mono uppercase"
                      maxLength={7}
                      aria-label="Hex color code"
                    />
                  </div>
                </div>
                <Button
                  variant={activeLayer.inset ? "default" : "outline"}
                  onClick={() => updateLayer({ inset: !activeLayer.inset })}
                  className="h-10 shrink-0 px-4"
                  aria-pressed={activeLayer.inset}
                >
                  {activeLayer.inset ? "Inset ✓" : "Inset"}
                </Button>
              </div>
            </div>
          </div>
        </ToolCard>

        {/* Preview + Output */}
        <div className="space-y-4">
          <ToolCard title="Preview">
            {/* Background picker */}
            <div className="mb-4 flex items-center gap-2">
              {(Object.keys(BG_THEMES) as BgTheme[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setBgTheme(key)}
                  title={BG_THEMES[key].label}
                  className={cn(
                    "h-7 w-7 rounded-full border-2 transition-all",
                    bgTheme === key
                      ? "border-primary scale-110 ring-2 ring-primary/30"
                      : "border-border hover:border-muted-foreground/40"
                  )}
                  style={{ backgroundColor: BG_THEMES[key].bg }}
                />
              ))}
              <span className="ml-1 text-xs text-muted-foreground">
                {BG_THEMES[bgTheme].label}
              </span>
            </div>

            <div
              className="flex min-h-[200px] items-center justify-center rounded-xl transition-colors duration-200"
              style={{ backgroundColor: BG_THEMES[bgTheme].bg }}
            >
              <div
                className="h-24 w-24 rounded-xl bg-white transition-all duration-200"
                style={{ boxShadow: previewShadow }}
              />
            </div>
          </ToolCard>

          <ToolCard>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">CSS Output</Label>
                <Button
                  size="sm"
                  variant={copied ? "default" : "secondary"}
                  onClick={() => copy(cssCode)}
                  className="gap-1.5 text-xs"
                >
                  {copied ? (
                    <><CheckCircle2 className="h-3.5 w-3.5" /> Copied</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy CSS</>
                  )}
                </Button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-muted/60 p-3 text-xs leading-6 text-foreground">
                <code>{cssCode}</code>
              </pre>
            </div>
          </ToolCard>
        </div>
      </div>

      {/* Tailwind equivalents */}
      <ToolCard title="Tailwind CSS Equivalents">
        <p className="mb-4 text-sm text-muted-foreground">
          Click any class to copy it to your clipboard. For custom values, use{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            shadow-[0_4px_6px_rgba(0,0,0,0.1)]
          </code>{" "}
          arbitrary value syntax.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TAILWIND_SHADOWS.map(({ cls, css }) => (
            <button
              key={cls}
              onClick={() => copyTailwind(cls, css)}
              className="group flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <code className="text-sm font-semibold text-primary">{cls}</code>
                {twCopied === cls ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </div>
              <div
                className="h-10 w-full rounded-lg bg-background"
                style={{ boxShadow: css === "none" ? "none" : css }}
              />
              <p className="truncate font-mono text-[10px] leading-4 text-muted-foreground">
                {css.split(",")[0]}
              </p>
            </button>
          ))}
        </div>
      </ToolCard>

      {/* Preset library */}
      <ToolCard title="Preset Library">
        <p className="mb-5 text-sm text-muted-foreground">
          Click any preset to load it into the editor. Presets may use multiple layers — you can
          edit each layer individually after loading.
        </p>
        <div className="space-y-7">
          {PRESET_CATEGORIES.map((cat) => (
            <div key={cat}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {cat}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PRESETS.filter((p) => p.category === cat).map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="group flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{preset.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {preset.layers.length} layer{preset.layers.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex h-14 items-center justify-center rounded-lg bg-gray-100">
                      <div
                        className="h-9 w-9 rounded-xl bg-white"
                        style={{
                          boxShadow: preset.layers.map(layerToCSS).join(", "),
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ToolCard>
    </section>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <span className="tabular-nums text-sm text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        aria-label={label}
      />
    </div>
  )
}

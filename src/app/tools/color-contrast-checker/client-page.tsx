"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { CheckCircle2, XCircle, Info, Wand2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Color math ────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "")
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
}

function srgbLinear(c: number): number {
  const x = c / 255
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * srgbLinear(r) + 0.7152 * srgbLinear(g) + 0.0722 * srgbLinear(b)
}

function wcagRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// APCA-W3 0.0.98G simplified — output is Lc (0-108 range, higher = more contrast)
function apcaLc(textLum: number, bgLum: number): number {
  const blkThrs = 0.022
  const blkClmp = 1.414

  const scTxt = textLum > blkThrs ? textLum : textLum + Math.pow(blkThrs - textLum, blkClmp)
  const scBg = bgLum > blkThrs ? bgLum : bgLum + Math.pow(blkThrs - bgLum, blkClmp)

  let contrast: number
  if (scBg >= scTxt) {
    contrast = (Math.pow(scBg, 0.56) - Math.pow(scTxt, 0.57)) * 1.14
  } else {
    contrast = (Math.pow(scBg, 0.65) - Math.pow(scTxt, 0.62)) * 1.14
  }

  if (Math.abs(contrast) < 0.1) return 0
  return Math.round(Math.abs(contrast * 100) * 10) / 10
}

function apcaLabel(lc: number): { label: string; ok: boolean } {
  if (lc >= 75) return { label: "Passes — body text", ok: true }
  if (lc >= 60) return { label: "Passes — fluent text 18px+", ok: true }
  if (lc >= 45) return { label: "Passes — large text 24px+", ok: true }
  if (lc >= 30) return { label: "Decorative / non-essential only", ok: false }
  return { label: "Fails — insufficient contrast", ok: false }
}

// Parse hex OR rgb(r,g,b) input
function parseColorInput(input: string): { r: number; g: number; b: number } | null {
  const trimmed = input.trim()
  // Hex
  const hexCandidate = trimmed.startsWith("#") ? trimmed : "#" + trimmed
  const fromHex = hexToRgb(hexCandidate)
  if (fromHex) return fromHex
  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = trimmed.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgbMatch) {
    return { r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) }
  }
  return null
}

// HSL helpers for suggestion
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return { h, s, l }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v } }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  }
}

// Binary-search foreground lightness to achieve target contrast ratio
function suggestForeground(
  fgRgb: { r: number; g: number; b: number },
  bgLum: number,
  targetRatio: number
): string {
  const { h, s } = rgbToHsl(fgRgb.r, fgRgb.g, fgRgb.b)
  let lo = 0, hi = 1
  // Decide direction: if bg is light, darken fg; if bg is dark, lighten fg
  const bgIsLight = bgLum > 0.18
  lo = bgIsLight ? 0 : 0.5
  hi = bgIsLight ? 0.5 : 1
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2
    const { r, g, b } = hslToRgb(h, s, mid)
    const lum = relativeLuminance(r, g, b)
    const ratio = wcagRatio(lum, bgLum)
    if (ratio < targetRatio) bgIsLight ? (hi = mid) : (lo = mid)
    else bgIsLight ? (lo = mid) : (hi = mid)
  }
  const mid = (lo + hi) / 2
  const { r, g, b } = hslToRgb(h, s, mid)
  return rgbToHex(r, g, b)
}

// ── Preview sizes ─────────────────────────────────────────────────────────────

const PREVIEW_SIZES = [
  { label: "Small (12px)", size: "12px", weight: "400", note: "Caption / label text" },
  { label: "Normal (16px)", size: "16px", weight: "400", note: "Body text" },
  { label: "Large (24px)", size: "24px", weight: "400", note: "Subheading" },
  { label: "Bold (18px)", size: "18px", weight: "700", note: "Bold / heading" },
]

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog"

// ── Component ─────────────────────────────────────────────────────────────────

export default function ToolClient() {
  const [fgInput, setFgInput] = useState("#1a1a1a")
  const [bgInput, setBgInput] = useState("#ffffff")
  const [suggestion, setSuggestion] = useState<string | null>(null)

  const fgRgb = useMemo(() => parseColorInput(fgInput), [fgInput])
  const bgRgb = useMemo(() => parseColorInput(bgInput), [bgInput])

  const fgHex = fgRgb ? rgbToHex(fgRgb.r, fgRgb.g, fgRgb.b) : "#000000"
  const bgHex = bgRgb ? rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b) : "#ffffff"

  const analysis = useMemo(() => {
    if (!fgRgb || !bgRgb) return null
    const fgLum = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
    const bgLum = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b)
    const ratio = wcagRatio(fgLum, bgLum)
    const lc = apcaLc(fgLum, bgLum)
    return {
      ratio,
      lc,
      fgLum,
      bgLum,
      // WCAG 2.x (also valid for 2.2 — thresholds unchanged)
      aa_normal: ratio >= 4.5,
      aa_large: ratio >= 3.0,
      aaa_normal: ratio >= 7.0,
      aaa_large: ratio >= 4.5,
    }
  }, [fgRgb, bgRgb])

  const apca = analysis ? apcaLabel(analysis.lc) : null

  const handleSuggest = useCallback(() => {
    if (!fgRgb || !analysis) return
    const suggested = suggestForeground(fgRgb, analysis.bgLum, 4.5)
    setSuggestion(suggested)
  }, [fgRgb, analysis])

  function applySuggestion() {
    if (suggestion) {
      setFgInput(suggestion)
      setSuggestion(null)
    }
  }

  const hasValidColors = fgRgb && bgRgb && analysis

  return (
    <>
      <div className="space-y-6">
        {/* Color inputs + live preview */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto]">
          {/* Foreground */}
          <ToolCard title="Foreground (text)">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg border">
                  <input
                    type="color"
                    value={fgHex}
                    onChange={(e) => { setFgInput(e.target.value); setSuggestion(null) }}
                    className="absolute -left-2 -top-2 h-16 w-20 cursor-pointer"
                    aria-label="Foreground color picker"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">Hex or rgb()</Label>
                  <Input
                    value={fgInput}
                    onChange={(e) => { setFgInput(e.target.value); setSuggestion(null) }}
                    className="font-mono"
                    placeholder="#1a1a1a or rgb(26,26,26)"
                  />
                </div>
              </div>
              {!fgRgb && fgInput.trim() && (
                <p className="text-xs text-destructive">Invalid color format</p>
              )}
              {fgRgb && (
                <p className="text-xs text-muted-foreground">
                  rgb({fgRgb.r}, {fgRgb.g}, {fgRgb.b})
                  {analysis && ` · Luminance: ${analysis.fgLum.toFixed(4)}`}
                </p>
              )}
            </div>
          </ToolCard>

          {/* Background */}
          <ToolCard title="Background">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg border">
                  <input
                    type="color"
                    value={bgHex}
                    onChange={(e) => { setBgInput(e.target.value); setSuggestion(null) }}
                    className="absolute -left-2 -top-2 h-16 w-20 cursor-pointer"
                    aria-label="Background color picker"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">Hex or rgb()</Label>
                  <Input
                    value={bgInput}
                    onChange={(e) => { setBgInput(e.target.value); setSuggestion(null) }}
                    className="font-mono"
                    placeholder="#ffffff or rgb(255,255,255)"
                  />
                </div>
              </div>
              {!bgRgb && bgInput.trim() && (
                <p className="text-xs text-destructive">Invalid color format</p>
              )}
              {bgRgb && (
                <p className="text-xs text-muted-foreground">
                  rgb({bgRgb.r}, {bgRgb.g}, {bgRgb.b})
                  {analysis && ` · Luminance: ${analysis.bgLum.toFixed(4)}`}
                </p>
              )}
            </div>
          </ToolCard>

          {/* Swap button */}
          <div className="flex items-center justify-center lg:pt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => { setFgInput(bgInput); setBgInput(fgInput); setSuggestion(null) }}
              aria-label="Swap foreground and background"
              className="h-10 w-10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {hasValidColors && (
          <>
            {/* Contrast ratio + WCAG grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Ratio */}
              <ToolCard>
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Contrast Ratio
                  </p>
                  <p className="mt-1 text-4xl font-bold tabular-nums">
                    {analysis.ratio.toFixed(2)}
                    <span className="text-lg font-normal text-muted-foreground">:1</span>
                  </p>
                </div>
              </ToolCard>

              {/* WCAG 2.x AA normal */}
              <WcagBadge
                label="WCAG AA"
                sublabel="Normal text (< 18px)"
                passes={analysis.aa_normal}
                threshold="4.5:1"
              />
              {/* WCAG 2.x AA large */}
              <WcagBadge
                label="WCAG AA"
                sublabel="Large text (≥ 18px or 14px bold)"
                passes={analysis.aa_large}
                threshold="3.0:1"
              />
              {/* WCAG AAA normal */}
              <WcagBadge
                label="WCAG AAA"
                sublabel="Enhanced (7:1 normal / 4.5:1 large)"
                passes={analysis.aaa_normal}
                threshold="7.0:1"
              />
            </div>

            {/* APCA panel */}
            <ToolCard title="APCA — Accessible Perceptual Contrast Algorithm">
              <div className="flex flex-wrap items-center gap-6">
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Lc Value
                  </p>
                  <p className="mt-1 text-4xl font-bold tabular-nums text-primary">
                    {analysis.lc}
                  </p>
                </div>
                <div className="flex-1">
                  <div className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium",
                    apca?.ok
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {apca?.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {apca?.label}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                    {[
                      { lc: 90, label: "Lc 90 — Enhanced (body)" },
                      { lc: 75, label: "Lc 75 — Body text" },
                      { lc: 60, label: "Lc 60 — Fluent 18px+" },
                      { lc: 45, label: "Lc 45 — Large 24px+" },
                    ].map(({ lc, label }) => (
                      <div
                        key={lc}
                        className={cn(
                          "rounded-md px-2 py-1 text-center",
                          analysis.lc >= lc
                            ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                            : "bg-muted/50"
                        )}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    APCA is the perceptual contrast model proposed for WCAG 3.0. It accounts for
                    spatial frequency, adaptation, and human visual system non-linearity — providing
                    more accurate predictions than the WCAG 2.x formula for modern displays.
                  </p>
                </div>
              </div>
            </ToolCard>

            {/* Suggest accessible alternative */}
            {!analysis.aa_normal && (
              <ToolCard title="Accessibility Fix">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      This combination fails WCAG AA for normal text. Click to find the closest
                      foreground color that passes 4.5:1 while keeping the same hue and saturation.
                    </p>
                    {suggestion && (
                      <div className="mt-3 flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-full border"
                          style={{ backgroundColor: suggestion }}
                        />
                        <code className="font-mono text-sm">{suggestion}</code>
                        <Button size="sm" onClick={applySuggestion} className="gap-1.5">
                          <Wand2 className="h-3.5 w-3.5" /> Apply
                        </Button>
                      </div>
                    )}
                  </div>
                  {!suggestion && (
                    <Button onClick={handleSuggest} variant="outline" className="gap-1.5 shrink-0">
                      <Wand2 className="h-4 w-4" /> Suggest accessible color
                    </Button>
                  )}
                </div>
              </ToolCard>
            )}

            {/* Preview at multiple sizes */}
            <ToolCard title="Text Preview">
              <div
                className="rounded-xl border p-6 space-y-4 transition-colors duration-200"
                style={{ backgroundColor: bgHex }}
              >
                {PREVIEW_SIZES.map(({ label, size, weight, note }) => (
                  <div key={label} className="space-y-1">
                    <p className="text-[10px] font-medium uppercase tracking-wider"
                      style={{ color: fgHex, opacity: 0.5 }}>
                      {label} — {note}
                    </p>
                    <p
                      style={{ color: fgHex, fontSize: size, fontWeight: weight, lineHeight: 1.5 }}
                    >
                      {SAMPLE_TEXT}
                    </p>
                  </div>
                ))}
              </div>
            </ToolCard>

            {/* WCAG 2.2 note */}
            <ToolCard title="WCAG 2.2 — What Changed for Color Contrast">
              <div className="flex gap-3 text-sm text-muted-foreground">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="space-y-2">
                  <p>
                    <strong className="text-foreground">WCAG 2.2</strong> (published October 2023)
                    did not change the color contrast thresholds — AA (4.5:1 normal, 3:1 large) and
                    AAA (7:1 normal, 4.5:1 large) remain identical to WCAG 2.1.
                  </p>
                  <p>
                    The main additions in WCAG 2.2 related to contrast are:{" "}
                    <strong className="text-foreground">SC 1.4.11 Non-text Contrast</strong> (AA,
                    3:1 for UI components and graphical objects) and the removal of SC 4.1.1 Parsing.
                    Focus indicators (SC 1.4.13 Focus Appearance) now require a minimum 3:1 contrast
                    between focused and unfocused states.
                  </p>
                  <p>
                    <strong className="text-foreground">APCA</strong> (Accessible Perceptual Contrast
                    Algorithm) is expected to replace the current formula in the upcoming WCAG 3.0
                    draft, but it is not yet normative. Use this tool to check both standards during
                    the transition period.
                  </p>
                </div>
              </div>
            </ToolCard>
          </>
        )}
      </div>
   </>
  )
}

function WcagBadge({
  label, sublabel, passes, threshold,
}: {
  label: string; sublabel: string; passes: boolean; threshold: string
}) {
  return (
    <ToolCard>
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{sublabel}</p>
        <div className={cn(
          "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
          passes
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        )}>
          {passes ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
          {passes ? "Pass" : "Fail"}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Requires {threshold}</p>
      </div>
    </ToolCard>
  )
}

"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolCard } from "@/components/layout/tool-layout"
import { Copy, CheckCircle2, Shuffle } from "lucide-react"
import { HexColorPicker, RgbColorPicker, HslColorPicker } from "react-colorful"

interface RGB {
  r: number
  g: number
  b: number
}

interface HSL {
  h: number
  s: number
  l: number
}

// Custom localized copy hook to manage multiple copy buttons gracefully
function useLocalCopy() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [])

  return { copy, copiedId }
}

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
  "#06b6d4", "#3b82f6", "#6366f1", "#a855f7", "#ec4899",
  "#0f172a", "#64748b", "#94a3b8", "#f8fafc", "#ffffff"
]

export default function ToolClient() {
  const [hex, setHex] = useState("#6366f1")
  const [rgb, setRgb] = useState<RGB>({ r: 99, g: 102, b: 241 })
  const [hsl, setHsl] = useState<HSL>({ h: 239, s: 84, l: 67 })
  const [alpha, setAlpha] = useState(100) // 0 to 100
  const [mode, setMode] = useState<"hex" | "rgb" | "hsl">("hex")
  
  const { copy, copiedId } = useLocalCopy()

  const hexToRgb = useCallback((hexValue: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }, [])

  const rgbToHex = useCallback((rgbValue: RGB): string => {
    return (
      "#" +
      [rgbValue.r, rgbValue.g, rgbValue.b]
        .map((x) => {
          const hexStr = x.toString(16)
          return hexStr.length === 1 ? "0" + hexStr : hexStr
        })
        .join("")
    )
  }, [])

  const rgbToHsl = useCallback((rgbValue: RGB): HSL => {
    const r = rgbValue.r / 255
    const g = rgbValue.g / 255
    const b = rgbValue.b / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }, [])

  const hslToRgb = useCallback((hslValue: HSL): RGB => {
    const h = hslValue.h / 360
    const s = hslValue.s / 100
    const l = hslValue.l / 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }, [])

  const handleHexChange = useCallback((newHex: string) => {
    setHex(newHex)
    if (/^#?([a-f\d]{6})$/i.test(newHex)) {
      const newRgb = hexToRgb(newHex)
      setRgb(newRgb)
      setHsl(rgbToHsl(newRgb))
    }
  }, [hexToRgb, rgbToHsl])

  const handleRgbChange = useCallback((newRgb: RGB) => {
    setRgb(newRgb)
    setHex(rgbToHex(newRgb))
    setHsl(rgbToHsl(newRgb))
  }, [rgbToHex, rgbToHsl])

  const handleHslChange = useCallback((newHsl: HSL) => {
    setHsl(newHsl)
    const newRgb = hslToRgb(newHsl)
    setRgb(newRgb)
    setHex(rgbToHex(newRgb))
  }, [hslToRgb, rgbToHex])

  const generateRandomColor = useCallback(() => {
    const randomHex = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    handleHexChange(randomHex)
  }, [handleHexChange])

  const colorFormats = useMemo(() => {
    const a = alpha / 100
    // Alpha Hex calculation (e.g. 50% -> 80)
    const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase()
    const fullHex = alpha === 100 ? hex.toUpperCase() : `${hex.toUpperCase()}${alphaHex}`

    return [
      { id: "hex", label: "HEX", value: fullHex },
      { id: "rgb", label: alpha === 100 ? "RGB" : "RGBA", value: alpha === 100 ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})` },
      { id: "hsl", label: alpha === 100 ? "HSL" : "HSLA", value: alpha === 100 ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})` },
    ]
  }, [hex, rgb, hsl, alpha])

  // Calculate relative luminance to determine optimal text color
  const isLight = useMemo(() => {
    const luminance = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return luminance > 128
  }, [rgb])

  const textColor = isLight ? "#0f172a" : "#ffffff"
  const a = alpha / 100
  const cssPreview = `.element {\n  background-color: ${alpha === 100 ? hex : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`};\n  color: ${textColor};\n}`

  return (
    <section aria-label="Interactive Color Picker" className="w-full">
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Color Palette & Controls">
          <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-full max-w-[240px] grid-cols-3">
                <TabsTrigger value="hex">HEX</TabsTrigger>
                <TabsTrigger value="rgb">RGB</TabsTrigger>
                <TabsTrigger value="hsl">HSL</TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" onClick={generateRandomColor} className="text-muted-foreground" aria-label="Generate Random Color">
                <Shuffle className="h-4 w-4 mr-2" aria-hidden="true" /> Random
              </Button>
            </div>

            <TabsContent value="hex" className="space-y-6 focus-visible:outline-none">
              <div className="flex justify-center [&_.react-colorful]:w-full [&_.react-colorful]:h-56">
                <HexColorPicker color={hex} onChange={handleHexChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hex-input">HEX Value</Label>
                <Input
                  id="hex-input"
                  value={hex.toUpperCase()}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="font-mono"
                  maxLength={7}
                />
              </div>
            </TabsContent>

            <TabsContent value="rgb" className="space-y-6 focus-visible:outline-none">
              <div className="flex justify-center [&_.react-colorful]:w-full [&_.react-colorful]:h-56">
                <RgbColorPicker color={rgb} onChange={handleRgbChange} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rgb-r">Red (R)</Label>
                  <Input
                    id="rgb-r"
                    type="number"
                    value={rgb.r}
                    onChange={(e) => handleRgbChange({ ...rgb, r: Math.min(255, Math.max(0, parseInt(e.target.value) || 0)) })}
                    min={0}
                    max={255}
                    className="font-mono text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rgb-g">Green (G)</Label>
                  <Input
                    id="rgb-g"
                    type="number"
                    value={rgb.g}
                    onChange={(e) => handleRgbChange({ ...rgb, g: Math.min(255, Math.max(0, parseInt(e.target.value) || 0)) })}
                    min={0}
                    max={255}
                    className="font-mono text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rgb-b">Blue (B)</Label>
                  <Input
                    id="rgb-b"
                    type="number"
                    value={rgb.b}
                    onChange={(e) => handleRgbChange({ ...rgb, b: Math.min(255, Math.max(0, parseInt(e.target.value) || 0)) })}
                    min={0}
                    max={255}
                    className="font-mono text-center"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hsl" className="space-y-6 focus-visible:outline-none">
              <div className="flex justify-center [&_.react-colorful]:w-full [&_.react-colorful]:h-56">
                <HslColorPicker color={hsl} onChange={handleHslChange} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hsl-h">Hue (H)</Label>
                  <Input
                    id="hsl-h"
                    type="number"
                    value={hsl.h}
                    onChange={(e) => handleHslChange({ ...hsl, h: Math.min(360, Math.max(0, parseInt(e.target.value) || 0)) })}
                    min={0}
                    max={360}
                    className="font-mono text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hsl-s">Sat. (S%)</Label>
                  <Input
                    id="hsl-s"
                    type="number"
                    value={hsl.s}
                    onChange={(e) => handleHslChange({ ...hsl, s: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                    min={0}
                    max={100}
                    className="font-mono text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hsl-l">Light. (L%)</Label>
                  <Input
                    id="hsl-l"
                    type="number"
                    value={hsl.l}
                    onChange={(e) => handleHslChange({ ...hsl, l: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                    min={0}
                    max={100}
                    className="font-mono text-center"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="opacity-slider">Opacity (Alpha)</Label>
              <span className="text-sm font-medium text-muted-foreground">{alpha}%</span>
            </div>
            <Slider
              id="opacity-slider"
              value={[alpha]}
              onValueChange={([v]) => setAlpha(v)}
              min={0}
              max={100}
              aria-label="Color Opacity"
            />
          </div>

          <div className="mt-8 pt-6 border-t">
            <Label className="mb-3 block text-muted-foreground">Quick Swatches</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className="w-8 h-8 rounded-md border shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handleHexChange(presetColor)}
                  aria-label={`Select color ${presetColor}`}
                  title={presetColor}
                />
              ))}
            </div>
          </div>
        </ToolCard>

        <ToolCard title="Preview & Output">
          <div className="space-y-8 flex flex-col h-full">
            {/* Live Color Preview */}
            <div
              className="h-40 rounded-xl border shadow-inner flex items-center justify-center transition-colors duration-200 bg-[url('https://api.iconify.design/lucide/grid.svg?color=%23888888&width=20')]"
              aria-label={`Preview of selected color`}
            >
              <div 
                className="w-full h-full rounded-xl flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: alpha === 100 ? hex : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha / 100})` }}
              >
                <span 
                  className="font-semibold text-lg tracking-wide px-4 py-2 rounded-md"
                  style={{ color: textColor }}
                >
                  Accessible Text
                </span>
              </div>
            </div>

            {/* Formatted Values */}
            <div className="space-y-3">
              <Label className="text-muted-foreground">Color Formats</Label>
              {colorFormats.map((format) => (
                <div key={format.id} className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 p-2.5 bg-muted/50 border rounded-lg overflow-hidden">
                    <span className="text-xs font-bold text-muted-foreground w-10 shrink-0">
                      {format.label}
                    </span>
                    <code className="flex-1 font-mono text-sm truncate">{format.value}</code>
                  </div>
                  <Button
                    variant={copiedId === format.id ? "default" : "outline"}
                    size="icon"
                    className="shrink-0 h-[42px] w-[42px] transition-all"
                    onClick={() => copy(format.value, format.id)}
                    aria-label={`Copy ${format.label} value`}
                  >
                    {copiedId === format.id ? (
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              ))}
            </div>

            {/* Generated CSS */}
            <div className="space-y-3 mt-auto">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground">CSS Usage</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copy(cssPreview, "css")}
                  className="h-8 text-xs"
                >
                  {copiedId === "css" ? (
                    <><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="mr-1.5 h-3.5 w-3.5" /> Copy CSS</>
                  )}
                </Button>
              </div>
              <div className="p-4 bg-muted/50 border rounded-lg">
                <pre className="text-sm font-mono overflow-x-auto text-foreground/80 leading-relaxed">
                  {cssPreview}
                </pre>
              </div>
            </div>
          </div>
        </ToolCard>
      </div>
    </section>
  )
}
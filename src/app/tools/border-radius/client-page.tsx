"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToolCard } from "@/components/layout/tool-layout"
import { Copy, Link, Unlink, CheckCircle2 } from "lucide-react"
import { useClipboard } from "@/hooks/use-clipboard"

export default function ToolClient() {
  const [topLeft, setTopLeft] = useState(16)
  const [topRight, setTopRight] = useState(16)
  const [bottomRight, setBottomRight] = useState(16)
  const [bottomLeft, setBottomLeft] = useState(16)
  const [unit, setUnit] = useState<"px" | "%">("px")
  const [linked, setLinked] = useState(true)
  
  const { copy, copied } = useClipboard()

  const handleChange = useCallback((corner: string, value: number) => {
    if (linked) {
      setTopLeft(value)
      setTopRight(value)
      setBottomRight(value)
      setBottomLeft(value)
    } else {
      switch (corner) {
        case "topLeft": setTopLeft(value); break;
        case "topRight": setTopRight(value); break;
        case "bottomRight": setBottomRight(value); break;
        case "bottomLeft": setBottomLeft(value); break;
      }
    }
  }, [linked])

  const getBorderRadiusCSS = useCallback(() => {
    if (topLeft === topRight && topLeft === bottomRight && topLeft === bottomLeft) {
      return `border-radius: ${topLeft}${unit};`
    }
    return `border-radius: ${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit};`
  }, [topLeft, topRight, bottomRight, bottomLeft, unit])

  const borderRadiusCSS = getBorderRadiusCSS()

  const presets = [
    { name: "None", values: [0, 0, 0, 0], presetUnit: "px" },
    { name: "Small", values: [4, 4, 4, 4], presetUnit: "px" },
    { name: "Medium", values: [8, 8, 8, 8], presetUnit: "px" },
    { name: "Large", values: [16, 16, 16, 16], presetUnit: "px" },
    { name: "XL", values: [24, 24, 24, 24], presetUnit: "px" },
    { name: "Full", values: [9999, 9999, 9999, 9999], presetUnit: "px" },
    { name: "Circle", values: [50, 50, 50, 50], presetUnit: "%" },
  ] as const

  const handlePreset = (values: readonly number[], presetUnit: "px" | "%") => {
    setTopLeft(values[0])
    setTopRight(values[1])
    setBottomRight(values[2])
    setBottomLeft(values[3])
    setUnit(presetUnit)
  }

  return (
    <section aria-label="Interactive Border Radius Generator" className="w-full">
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Border Radius Settings">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant={linked ? "default" : "outline"}
                size="sm"
                onClick={() => setLinked(!linked)}
                className="w-[120px]"
                aria-label={linked ? "Unlink corners" : "Link corners"}
              >
                {linked ? (
                  <><Link className="mr-2 h-4 w-4" aria-hidden="true" /> Linked</>
                ) : (
                  <><Unlink className="mr-2 h-4 w-4" aria-hidden="true" /> Unlinked</>
                )}
              </Button>
              <Tabs 
                value={unit} 
                onValueChange={(v) => setUnit(v as "px" | "%")}
                aria-label="Unit selection"
              >
                <TabsList>
                  <TabsTrigger value="px" aria-label="Pixels">px</TabsTrigger>
                  <TabsTrigger value="%" aria-label="Percentages">%</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="top-left">Top Left</Label>
                  <span className="text-sm font-medium text-muted-foreground min-w-[3ch] text-right">
                    {topLeft}{unit}
                  </span>
                </div>
                <Input
                  id="top-left"
                  type="range"
                  value={topLeft}
                  onChange={(e) => handleChange("topLeft", parseInt(e.target.value))}
                  min={0}
                  max={unit === "%" ? 100 : 200}
                  className="cursor-pointer"
                  aria-label="Top Left Border Radius"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="top-right" className={linked ? "opacity-50" : ""}>Top Right</Label>
                  <span className={`text-sm font-medium text-muted-foreground min-w-[3ch] text-right ${linked ? "opacity-50" : ""}`}>
                    {topRight}{unit}
                  </span>
                </div>
                <Input
                  id="top-right"
                  type="range"
                  value={topRight}
                  onChange={(e) => handleChange("topRight", parseInt(e.target.value))}
                  min={0}
                  max={unit === "%" ? 100 : 200}
                  className={`cursor-pointer ${linked ? "opacity-50 pointer-events-none" : ""}`}
                  disabled={linked}
                  aria-label="Top Right Border Radius"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="bottom-left" className={linked ? "opacity-50" : ""}>Bottom Left</Label>
                  <span className={`text-sm font-medium text-muted-foreground min-w-[3ch] text-right ${linked ? "opacity-50" : ""}`}>
                    {bottomLeft}{unit}
                  </span>
                </div>
                <Input
                  id="bottom-left"
                  type="range"
                  value={bottomLeft}
                  onChange={(e) => handleChange("bottomLeft", parseInt(e.target.value))}
                  min={0}
                  max={unit === "%" ? 100 : 200}
                  className={`cursor-pointer ${linked ? "opacity-50 pointer-events-none" : ""}`}
                  disabled={linked}
                  aria-label="Bottom Left Border Radius"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="bottom-right" className={linked ? "opacity-50" : ""}>Bottom Right</Label>
                  <span className={`text-sm font-medium text-muted-foreground min-w-[3ch] text-right ${linked ? "opacity-50" : ""}`}>
                    {bottomRight}{unit}
                  </span>
                </div>
                <Input
                  id="bottom-right"
                  type="range"
                  value={bottomRight}
                  onChange={(e) => handleChange("bottomRight", parseInt(e.target.value))}
                  min={0}
                  max={unit === "%" ? 100 : 200}
                  className={`cursor-pointer ${linked ? "opacity-50 pointer-events-none" : ""}`}
                  disabled={linked}
                  aria-label="Bottom Right Border Radius"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <Label className="mb-3 block text-muted-foreground">Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreset(preset.values, preset.presetUnit)}
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ToolCard>

        <ToolCard title="Preview & Code">
          <div className="space-y-6 h-full flex flex-col">
            <div 
              className="flex-1 min-h-[250px] bg-[url('https://api.iconify.design/lucide/grid.svg?color=%23888888&width=20')] rounded-xl border flex items-center justify-center p-8 bg-muted/20 overflow-hidden"
              aria-label="Visual preview of the border radius shape"
            >
              <div
                className="w-40 h-40 bg-primary shadow-lg transition-all duration-150 ease-out flex items-center justify-center text-primary-foreground/50 font-medium"
                style={{
                  borderRadius: `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`,
                }}
              >
                Preview
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <div className="flex justify-between items-center">
                <Label htmlFor="css-output">Generated CSS</Label>
              </div>
              <div className="relative">
                <Textarea
                  id="css-output"
                  value={borderRadiusCSS}
                  readOnly
                  className="font-mono text-sm min-h-[80px] bg-muted/50 focus-visible:ring-0 pr-24 resize-none"
                  aria-live="polite"
                />
                <Button
                  size="sm"
                  variant={copied ? "default" : "secondary"}
                  className="absolute right-3 top-3 shadow-sm transition-all"
                  onClick={() => copy(borderRadiusCSS)}
                  aria-label="Copy CSS code"
                >
                  {copied ? (
                    <><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="mr-1.5 h-3.5 w-3.5" /> Copy CSS</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </ToolCard>
      </div>
    </section>
  )
}
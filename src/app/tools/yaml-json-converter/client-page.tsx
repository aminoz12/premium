"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { Copy, AlertCircle } from "lucide-react"

export default class YAMLJSONConverterPage extends React.Component {
  state = {
    input: "",
    output: "",
    error: "",
    mode: "yaml-to-json" as "yaml-to-json" | "json-to-yaml",
  }

  yamlToJson = (yaml: string): unknown => {
    const result: Record<string, unknown> = {}
    const lines = yaml.split("\n")
    let currentKey = ""
    let currentIndent = -1
    const stack: Array<{ obj: Record<string, unknown>; indent: number }> = [{ obj: result, indent: -1 }]

    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith("#")) continue

      const indent = line.search(/\S/)
      const content = line.trim()

      if (content.includes(":")) {
        const colonIndex = content.indexOf(":")
        const key = content.slice(0, colonIndex).trim()
        let value: string | undefined = content.slice(colonIndex + 1).trim()

        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
          stack.pop()
        }

        const currentObj = stack[stack.length - 1].obj

        if (value) {
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1)
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1)
          } else if (value === "true") {
            (currentObj as Record<string, unknown>)[key] = true
            continue
          } else if (value === "false") {
            (currentObj as Record<string, unknown>)[key] = false
            continue
          } else if (value === "null") {
            (currentObj as Record<string, unknown>)[key] = null
            continue
          } else if (!isNaN(Number(value))) {
            (currentObj as Record<string, unknown>)[key] = Number(value)
            continue
          }
          (currentObj as Record<string, unknown>)[key] = value
        } else {
          const newObj: Record<string, unknown> = {}
          ;(currentObj as Record<string, unknown>)[key] = newObj
          stack.push({ obj: newObj, indent })
        }
      }
    }

    return result
  }

  jsonToYaml = (obj: unknown, indent: number = 0): string => {
    const spaces = "  ".repeat(indent)
    let result = ""

    if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          result += `${spaces}${key}:\n${this.jsonToYaml(value, indent + 1)}`
        } else if (Array.isArray(value)) {
          result += `${spaces}${key}:\n`
          for (const item of value) {
            if (typeof item === "object" && item !== null) {
              result += `${spaces}- ${JSON.stringify(item)}\n`
            } else {
              result += `${spaces}- ${item}\n`
            }
          }
        } else if (typeof value === "string") {
          if (value.includes("\n") || value.includes(":") || value.includes("#")) {
            result += `${spaces}${key}: "${value}"\n`
          } else {
            result += `${spaces}${key}: ${value}\n`
          }
        } else {
          result += `${spaces}${key}: ${value}\n`
        }
      }
    }

    return result
  }

  convert = () => {
    this.setState({ error: "" })
    if (!this.state.input.trim()) {
      this.setState({ output: "" })
      return
    }

    try {
      if (this.state.mode === "yaml-to-json") {
        const result = this.yamlToJson(this.state.input)
        this.setState({ output: JSON.stringify(result, null, 2) })
      } else {
        const parsed = JSON.parse(this.state.input)
        this.setState({ output: this.jsonToYaml(parsed) })
      }
    } catch (e) {
      this.setState({ error: "Conversion error: " + (e as Error).message })
    }
  }

  render() {
    return (
      <>
        <Tabs
          value={this.state.mode}
          onValueChange={(v) => this.setState({ mode: v as "yaml-to-json" | "json-to-yaml", output: "", error: "" })}
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="yaml-to-json">YAML → JSON</TabsTrigger>
            <TabsTrigger value="json-to-yaml">JSON → YAML</TabsTrigger>
          </TabsList>

          <TabsContent value="yaml-to-json" className="space-y-4 mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ToolCard title="YAML Input">
                <Textarea
                  placeholder="Paste YAML here..."
                  value={this.state.input}
                  onChange={(e) => this.setState({ input: e.target.value })}
                  className="min-h-[300px] font-mono text-sm"
                />
              </ToolCard>

              <ToolCard title="JSON Output">
                <div className="relative">
                  <Textarea
                    placeholder="JSON output will appear here..."
                    value={this.state.output}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                  {this.state.output && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => navigator.clipboard.writeText(this.state.output)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </ToolCard>
            </div>

            <div className="flex justify-center">
              <Button onClick={this.convert} size="lg">
                Convert to JSON
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="json-to-yaml" className="space-y-4 mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ToolCard title="JSON Input">
                <Textarea
                  placeholder="Paste JSON here..."
                  value={this.state.input}
                  onChange={(e) => this.setState({ input: e.target.value })}
                  className="min-h-[300px] font-mono text-sm"
                />
              </ToolCard>

              <ToolCard title="YAML Output">
                <div className="relative">
                  <Textarea
                    placeholder="YAML output will appear here..."
                    value={this.state.output}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                  {this.state.output && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => navigator.clipboard.writeText(this.state.output)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </ToolCard>
            </div>

            <div className="flex justify-center">
              <Button onClick={this.convert} size="lg">
                Convert to YAML
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {this.state.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{this.state.error}</AlertDescription>
          </Alert>
        )}
      </>
    )
  }
}

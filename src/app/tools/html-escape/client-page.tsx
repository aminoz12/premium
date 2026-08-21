"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolCard } from "@/components/layout/tool-layout"
import { Copy, CheckCircle2, ArrowRightLeft, FileCode2 } from "lucide-react"
import he from "he"
import { useClipboard } from "@/hooks/use-clipboard"

export default function ToolClient() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const { copy, copied } = useClipboard()

  const handleEscape = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      return
    }
    try {
      setOutput(he.escape(input))
    } catch (error) {
      console.error("Escape failed:", error)
      setOutput("An error occurred during escaping.")
    }
  }, [input])

  const handleUnescape = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      return
    }
    try {
      setOutput(he.decode(input))
    } catch (error) {
      console.error("Unescape failed:", error)
      setOutput("An error occurred during unescaping.")
    }
  }, [input])

  const handleTabChange = useCallback(() => {
    setInput("")
    setOutput("")
  }, [])

  return (
    <section aria-label="Interactive HTML Escape Tool" className="w-full">
      <Tabs defaultValue="escape" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="escape" aria-controls="escape-panel">Escape HTML</TabsTrigger>
          <TabsTrigger value="unescape" aria-controls="unescape-panel">Unescape HTML</TabsTrigger>
        </TabsList>

        {/* Escape Panel */}
        <TabsContent value="escape" id="escape-panel" className="space-y-6 focus-visible:outline-none">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] items-center">
            <ToolCard title="Input Text (Raw HTML)">
              <label htmlFor="escape-input" className="sr-only">Enter raw HTML to escape</label>
              <Textarea
                id="escape-input"
                placeholder='e.g., <script>alert("XSS");</script>'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[280px] resize-y font-mono text-sm"
                aria-invalid={false}
              />
            </ToolCard>

            <div className="hidden lg:flex justify-center">
              <Button onClick={handleEscape} size="icon" variant="secondary" className="rounded-full h-12 w-12" aria-label="Process Escape">
                <FileCode2 className="h-5 w-5" />
              </Button>
            </div>

            <ToolCard title="Escaped Output">
              <div className="relative h-full">
                <label htmlFor="escape-output" className="sr-only">Escaped HTML entities result</label>
                <Textarea
                  id="escape-output"
                  placeholder="Escaped HTML entities will appear here..."
                  value={output}
                  readOnly
                  className="min-h-[280px] resize-y font-mono text-sm bg-muted/30 focus-visible:ring-0 pr-24"
                  aria-live="polite"
                />
                {output && (
                  <Button
                    size="sm"
                    variant={copied ? "default" : "secondary"}
                    className="absolute right-3 top-3 shadow-sm transition-all"
                    onClick={() => copy(output)}
                    aria-label="Copy escaped output"
                  >
                    {copied ? (
                      <><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Copied!</>
                    ) : (
                      <><Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Copy</>
                    )}
                  </Button>
                )}
              </div>
            </ToolCard>
          </div>

          <div className="flex justify-center lg:hidden">
            <Button onClick={handleEscape} size="lg" className="w-full sm:w-auto px-8">
              Escape HTML
            </Button>
          </div>
        </TabsContent>

        {/* Unescape Panel */}
        <TabsContent value="unescape" id="unescape-panel" className="space-y-6 focus-visible:outline-none">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] items-center">
            <ToolCard title="Input Text (HTML Entities)">
              <label htmlFor="unescape-input" className="sr-only">Enter HTML entities to decode</label>
              <Textarea
                id="unescape-input"
                placeholder="e.g., &lt;script&gt;alert(&quot;XSS&quot;);&lt;/script&gt;"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[280px] resize-y font-mono text-sm"
                aria-invalid={false}
              />
            </ToolCard>

            <div className="hidden lg:flex justify-center">
              <Button onClick={handleUnescape} size="icon" variant="secondary" className="rounded-full h-12 w-12" aria-label="Process Unescape">
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </div>

            <ToolCard title="Unescaped Output">
              <div className="relative h-full">
                <label htmlFor="unescape-output" className="sr-only">Unescaped raw text result</label>
                <Textarea
                  id="unescape-output"
                  placeholder="Unescaped raw HTML will appear here..."
                  value={output}
                  readOnly
                  className="min-h-[280px] resize-y font-mono text-sm bg-muted/30 focus-visible:ring-0 pr-24"
                  aria-live="polite"
                />
                {output && (
                  <Button
                    size="sm"
                    variant={copied ? "default" : "secondary"}
                    className="absolute right-3 top-3 shadow-sm transition-all"
                    onClick={() => copy(output)}
                    aria-label="Copy unescaped output"
                  >
                    {copied ? (
                      <><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Copied!</>
                    ) : (
                      <><Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Copy</>
                    )}
                  </Button>
                )}
              </div>
            </ToolCard>
          </div>

          <div className="flex justify-center lg:hidden">
            <Button onClick={handleUnescape} size="lg" className="w-full sm:w-auto px-8">
              Unescape HTML
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
"use client"

import React, { useState, useId } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import {
  Copy, Check, AlertCircle, Minimize2, Maximize2,
  Trash2, FileJson, CheckCircle2, Zap, Shield, HelpCircle,
  Code2, Link2, Braces
} from "lucide-react"

export default function JSONFormatterPage({ embedMode = false }: { embedMode?: boolean }) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const id = useId()

  const formatJSON = (indent: number = 2) => {
    setError("")
    if (!input.trim()) {
      setOutput("")
      return
    }

    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message)
      setOutput("")
    }
  }

  const minifyJSON = () => {
    setError("")
    if (!input.trim()) {
      setOutput("")
      return
    }

    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message)
      setOutput("")
    }
  }

  const clearInput = () => {
    setInput("")
    setOutput("")
    setError("")
  }

  const copyToClipboard = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a JSON Formatter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A JSON Formatter is a developer tool that takes raw, minified, or unreadable JSON data and formats it with proper indentation and line breaks, making it easy for humans to read and debug."
        }
      },
      {
        "@type": "Question",
        "name": "Does this tool validate my JSON?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. While attempting to format or minify your input, the tool parses the JSON. If there are syntax errors, missing quotes, or trailing commas, it will alert you with an 'Invalid JSON' error message detailing the issue."
        }
      },
      {
        "@type": "Question",
        "name": "Is my JSON data secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. This JSON Formatter operates 100% locally in your web browser using client-side JavaScript. Your sensitive data is never uploaded, stored, or processed on our servers."
        }
      },
      {
        "@type": "Question",
        "name": "What is JSON minification?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "JSON minification is the process of removing all unnecessary whitespace, newlines, and indentation from a JSON string. This reduces the overall payload size, making it faster to transmit over networks."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Online JSON Formatter & Validator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Format, beautify, validate, and minify your JSON data instantly directly in your browser securely."
  }

  const content = (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">

      {/* Header Section */}
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
          <Braces className="h-4 w-4" aria-hidden="true" /> Developer Utility
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
          Free JSON Formatter & Validator
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Instantly format, beautify, parse, and validate your JSON data. Process everything securely within your browser with no server uploads.
        </p>
      </header>

      {/* Interactive Tool Section */}
      <section aria-label="JSON Formatter Tool" className="grid gap-6 lg:grid-cols-2">

        {/* Input Panel */}
        <ToolCard title="1. Input Raw JSON">
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${id}-input`} className="text-sm font-semibold">
                Source Data
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearInput}
                disabled={!input}
                className="h-8 text-muted-foreground hover:text-destructive"
                aria-label="Clear input text"
              >
                <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Clear
              </Button>
            </div>

            <Textarea
              id={`${id}-input`}
              placeholder='Paste your JSON payload here...&#10;&#10;{&#10;  "example": "data",&#10;  "array": [1, 2, 3]&#10;}'
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                if (error) setError("")
              }}
              className="min-h-[350px] flex-grow font-mono text-sm bg-muted/30 resize-y focus-visible:ring-1"
              aria-label="JSON input area"
              spellCheck={false}
            />

            {error && (
              <Alert variant="destructive" className="animate-in fade-in duration-300">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription className="font-mono text-xs break-all">{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                onClick={() => formatJSON(2)}
                disabled={!input.trim()}
                className="w-full gap-2 text-xs sm:text-sm"
                aria-label="Format JSON with 2 spaces"
              >
                <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                Format (2)
              </Button>
              <Button
                onClick={() => formatJSON(4)}
                disabled={!input.trim()}
                variant="secondary"
                className="w-full gap-2 text-xs sm:text-sm"
                aria-label="Format JSON with 4 spaces"
              >
                <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                Format (4)
              </Button>
              <Button
                variant="outline"
                onClick={minifyJSON}
                disabled={!input.trim()}
                className="w-full gap-2 text-xs sm:text-sm bg-background"
                aria-label="Minify JSON payload"
              >
                <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                Minify
              </Button>
            </div>
          </div>
        </ToolCard>

        {/* Output Panel */}
        <ToolCard title="2. Formatted Output">
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${id}-output`} className="text-sm font-semibold">
                Processed JSON
              </Label>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 shadow-sm gap-1.5"
                onClick={copyToClipboard}
                disabled={!output}
                aria-label="Copy result to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                    <span className="text-green-500 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    Copy Output
                  </>
                )}
              </Button>
            </div>

            <div className="relative flex-grow h-full">
              <Textarea
                id={`${id}-output`}
                placeholder="Your beautified or minified JSON will appear here..."
                value={output}
                readOnly
                className="h-full min-h-[350px] font-mono text-sm bg-muted/10 resize-none border-dashed focus-visible:ring-0"
                aria-label="JSON output area"
                spellCheck={false}
              />
              {!output && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 pointer-events-none">
                  <FileJson className="h-12 w-12 mb-3 opacity-20" aria-hidden="true" />
                  <p className="text-sm font-medium">Waiting for input...</p>
                </div>
              )}
            </div>
          </div>
        </ToolCard>
      </section>

    </div>
  )

  if (embedMode) {
    return content
  }

  return (
    <ToolLayout toolId="json-formatter">
      {/* Inject SEO Schemas */}
      {content}
    </ToolLayout>
  )
}

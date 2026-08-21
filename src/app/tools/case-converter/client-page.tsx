"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ToolCard } from "@/components/layout/tool-layout"
import { Copy, CheckCircle2, Trash2, Download } from "lucide-react"
import { useClipboard } from "@/hooks/use-clipboard"

type CaseType = 
  | "upper" 
  | "lower" 
  | "title" 
  | "sentence" 
  | "camel" 
  | "pascal" 
  | "snake" 
  | "kebab" 
  | "constant" 
  | "toggle" 
  | "alternating"

export default function ToolClient() {
  const [input, setInput] = useState("")
  const [caseType, setCaseType] = useState<CaseType>("upper")
  const { copy, copied } = useClipboard()

  const convertCase = useCallback((text: string, type: CaseType): string => {
    if (!text) return ""
    
    switch (type) {
      case "upper":
        return text.toUpperCase()
      case "lower":
        return text.toLowerCase()
      case "title":
        return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
      case "sentence":
        return text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
      case "camel":
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
          .replace(/^[A-Z]/, (c) => c.toLowerCase())
      case "pascal":
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
          .replace(/^\w/, (c) => c.toUpperCase())
      case "snake":
        return text
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "")
      case "kebab":
        return text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9-]/g, "")
      case "constant":
        return text
          .toUpperCase()
          .replace(/\s+/g, "_")
          .replace(/[^A-Z0-9_]/g, "")
      case "toggle":
        return text.split('').map(c => {
          if (/[a-z]/.test(c)) return c.toUpperCase();
          if (/[A-Z]/.test(c)) return c.toLowerCase();
          return c;
        }).join('')
      case "alternating":
        let alt = false;
        return text.split('').map(c => {
          if (/[a-zA-Z]/.test(c)) {
            alt = !alt;
            return alt ? c.toLowerCase() : c.toUpperCase();
          }
          return c;
        }).join('')
      default:
        return text
    }
  }, [])

  const output = useMemo(() => convertCase(input, caseType), [input, caseType, convertCase])

  // Metrics calculation
  const charCount = input.length
  const wordCount = useMemo(() => input.trim() ? input.trim().split(/\s+/).length : 0, [input])
  const lineCount = useMemo(() => input ? input.split(/\r\n|\r|\n/).length : 0, [input])

  const handleClear = useCallback(() => {
    setInput("")
  }, [])

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-${caseType}-case.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output, caseType])

  const caseOptions: { value: CaseType; label: string; example: string }[] = [
    { value: "upper", label: "UPPER CASE", example: "HELLO WORLD" },
    { value: "lower", label: "lower case", example: "hello world" },
    { value: "title", label: "Title Case", example: "Hello World" },
    { value: "sentence", label: "Sentence case", example: "Hello world" },
    { value: "alternating", label: "aLtErNaTiNg", example: "hElLo wOrLd" },
    { value: "toggle", label: "tOGGLE cASE", example: "hELLO wORLD" },
    { value: "camel", label: "camelCase", example: "helloWorld" },
    { value: "pascal", label: "PascalCase", example: "HelloWorld" },
    { value: "snake", label: "snake_case", example: "hello_world" },
    { value: "kebab", label: "kebab-case", example: "hello-world" },
    { value: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
  ]

  return (
    <section aria-label="Interactive Text Case Converter" className="w-full">
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Plain Text Input">
          <div className="flex flex-col h-full space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
              <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                <span>Words: <strong className="text-foreground">{wordCount}</strong></span>
                <span>Chars: <strong className="text-foreground">{charCount}</strong></span>
                <span>Lines: <strong className="text-foreground">{lineCount}</strong></span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClear} 
                className="h-7 px-2 text-muted-foreground hover:text-destructive"
                aria-label="Clear input text"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" /> Clear
              </Button>
            </div>
            <label htmlFor="text-input" className="sr-only">Enter text to format</label>
            <Textarea
              id="text-input"
              placeholder="Type or paste text to convert case..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[320px] font-mono text-sm resize-y"
              aria-invalid={false}
            />
          </div>
        </ToolCard>

        <ToolCard title="Converted Output">
          <div className="flex flex-col h-full space-y-3">
            <div className="flex justify-end items-center border-b pb-3 h-[41px]">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload} 
                className="h-7 px-3 text-xs"
                disabled={!output}
                aria-label="Download as text file"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" /> Download .txt
              </Button>
            </div>
            <div className="relative flex-1">
              <label htmlFor="text-output" className="sr-only">Converted text result</label>
              <Textarea
                id="text-output"
                placeholder="Your formatted text will appear here..."
                value={output}
                readOnly
                className="min-h-[320px] h-full font-mono text-sm resize-y bg-muted/30 focus-visible:ring-0 pr-24"
                aria-live="polite"
              />
              {output && (
                <Button
                  size="sm"
                  variant={copied ? "default" : "secondary"}
                  className="absolute right-3 top-3 shadow-sm transition-all"
                  onClick={() => copy(output)}
                  aria-label="Copy formatted text"
                >
                  {copied ? (
                    <><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Copied!</>
                  ) : (
                    <><Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Copy</>
                  )}
                </Button>
              )}
            </div>
          </div>
        </ToolCard>
      </div>

      <ToolCard title="Select Formatting Options" className="mt-6">
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3" 
          role="group" 
          aria-label="Case conversion options"
        >
          {caseOptions.map((option) => (
            <Button
              key={option.value}
              variant={caseType === option.value ? "default" : "outline"}
              className={`flex flex-col h-auto py-3 px-2 w-full transition-colors ${caseType === option.value ? "ring-2 ring-primary ring-offset-1" : ""}`}
              onClick={() => setCaseType(option.value)}
              aria-pressed={caseType === option.value}
            >
              <span className="text-sm font-semibold whitespace-nowrap">{option.label}</span>
              <span className="text-[10px] text-muted-foreground mt-1.5 font-mono opacity-80 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                {option.example}
              </span>
            </Button>
          ))}
        </div>
      </ToolCard>
    </section>
  )
}
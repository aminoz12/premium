"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolCard } from "@/components/layout/tool-layout"
import { Copy, AlertCircle, Upload, CheckCircle2, Download, Trash2, ArrowRightLeft } from "lucide-react"
import { useFileReader } from "@/hooks/use-file-reader"

type Mode = "csv-to-json" | "json-to-csv"

export default function ToolClient() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [mode, setMode] = useState<Mode>("csv-to-json")
  const [copied, setCopied] = useState(false)
  
  const { readAsText, content, reset } = useFileReader()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // CSV to JSON logic
  const parseCSVLine = useCallback((line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }, [])

  const parseCSV = useCallback((csv: string): Record<string, string>[] => {
    const lines = csv.trim().split(/\r?\n/)
    if (lines.length === 0 || !lines[0]) return []

    const headers = parseCSVLine(lines[0])
    const result: Record<string, string>[] = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue
      const values = parseCSVLine(lines[i])
      const obj: Record<string, string> = {}
      headers.forEach((header, index) => {
        obj[header] = values[index] || ""
      })
      result.push(obj)
    }
    return result
  }, [parseCSVLine])

  // JSON to CSV logic
  const jsonToCSV = useCallback((data: Record<string, unknown>[]): string => {
    if (!data || !Array.isArray(data) || data.length === 0) return ""

    // Extract all unique headers from all objects to handle missing keys
    const headerSet = new Set<string>()
    data.forEach(item => {
      if (item && typeof item === 'object') {
        Object.keys(item).forEach(key => headerSet.add(key))
      }
    })
    const headers = Array.from(headerSet)
    
    const lines: string[] = [headers.join(",")]

    for (const item of data) {
      if (!item || typeof item !== 'object') continue;
      
      const values = headers.map((header) => {
        const rawValue = (item as Record<string, unknown>)[header]
        
        // Handle nested objects/arrays gracefully
        let stringValue = ""
        if (rawValue === null || rawValue === undefined) {
          stringValue = ""
        } else if (typeof rawValue === 'object') {
          stringValue = JSON.stringify(rawValue)
        } else {
          stringValue = String(rawValue)
        }

        // Escape quotes, commas, and newlines
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      lines.push(values.join(","))
    }

    return lines.join("\n")
  }, [])

  const convert = useCallback(() => {
    setError("")
    if (!input.trim()) {
      setOutput("")
      return
    }

    try {
      if (mode === "csv-to-json") {
        const result = parseCSV(input)
        if (result.length === 0) throw new Error("No valid CSV data found to parse.")
        setOutput(JSON.stringify(result, null, 2))
      } else {
        const parsed = JSON.parse(input)
        if (!Array.isArray(parsed)) {
          throw new Error("Invalid format: JSON input must be an array of objects.")
        }
        setOutput(jsonToCSV(parsed))
      }
    } catch (e) {
      setError("Conversion error: " + (e as Error).message)
      setOutput("")
    }
  }, [input, mode, parseCSV, jsonToCSV])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      readAsText(file)
    }
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setError("")
    reset()
  }

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy", err)
    }
  }

  const handleDownload = () => {
    if (!output) return
    const fileExtension = mode === "csv-to-json" ? "json" : "csv"
    const mimeType = mode === "csv-to-json" ? "application/json" : "text/csv"
    
    const blob = new Blob([output], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `converted-data.${fileExtension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleModeChange = (newMode: string) => {
    setMode(newMode as Mode)
    setError("")
    // Swap input/output if output exists, otherwise clear
    if (output) {
      setInput(output)
      setOutput("")
    } else {
      setInput("")
      setOutput("")
    }
  }

  useEffect(() => {
    if (content && typeof content === "string") {
      setInput(content)
      setError("")
      reset()
    }
  }, [content, reset])

  return (
    <section aria-label="Interactive Data Converter Tool" className="w-full">
      <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="csv-to-json" aria-controls="csv-to-json-panel">CSV to JSON</TabsTrigger>
          <TabsTrigger value="json-to-csv" aria-controls="json-to-csv-panel">JSON to CSV</TabsTrigger>
        </TabsList>

        <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] items-center">
          <ToolCard title={mode === "csv-to-json" ? "CSV Input" : "JSON Input"}>
            <div className="flex flex-col h-full space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="h-8 text-xs font-normal"
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" /> 
                  Upload {mode === "csv-to-json" ? ".csv" : ".json"} File
                </Button>
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  accept={mode === "csv-to-json" ? ".csv" : ".json"}
                  className="hidden"
                  onChange={handleFileUpload}
                  aria-label="Upload file"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClear} 
                  className="h-8 px-2 text-muted-foreground hover:text-destructive"
                  aria-label="Clear input"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" /> Clear
                </Button>
              </div>
              
              <Textarea
                placeholder={mode === "csv-to-json" ? "name,age,city\nJohn,30,New York\nJane,25,Los Angeles" : '[\n  {\n    "name": "John",\n    "age": 30,\n    "city": "New York"\n  }\n]'}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  if (error) setError("")
                }}
                className={`min-h-[350px] font-mono text-sm resize-y ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                aria-invalid={!!error}
              />
              
              {error && (
                <Alert variant="destructive" className="mt-2 py-2 px-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </ToolCard>

          <div className="hidden lg:flex flex-col gap-4 justify-center items-center">
            <Button onClick={convert} size="icon" variant="default" className="rounded-full h-14 w-14 shadow-md" aria-label="Convert Data">
              <ArrowRightLeft className="h-6 w-6" />
            </Button>
          </div>

          <ToolCard title={mode === "csv-to-json" ? "JSON Output" : "CSV Output"}>
            <div className="flex flex-col h-full space-y-4">
              <div className="flex flex-wrap items-center justify-end gap-2 border-b pb-3 h-[45px]">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload} 
                  className="h-8 px-3 text-xs font-normal"
                  disabled={!output}
                  aria-label="Download output file"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" /> 
                  Download {mode === "csv-to-json" ? ".json" : ".csv"}
                </Button>
              </div>

              <div className="relative flex-1">
                <Textarea
                  placeholder="Converted output will appear here..."
                  value={output}
                  readOnly
                  className="min-h-[350px] h-full font-mono text-sm resize-y bg-muted/30 focus-visible:ring-0 pr-24"
                  aria-live="polite"
                />
                {output && (
                  <Button
                    size="sm"
                    variant={copied ? "default" : "secondary"}
                    className="absolute right-3 top-3 shadow-sm transition-all"
                    onClick={handleCopy}
                    aria-label="Copy output"
                  >
                    {copied ? (
                      <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" /> Copied</>
                    ) : (
                      <><Copy className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" /> Copy</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </ToolCard>
        </div>

        <div className="flex justify-center mt-6 lg:hidden">
          <Button onClick={convert} size="lg" className="w-full sm:w-auto px-12">
            Convert Data
          </Button>
        </div>
      </Tabs>
    </section>
  )
}
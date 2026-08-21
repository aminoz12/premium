"use client"

import React, { useState, useId } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import {
  Copy, Download, Trash2, Check, AlertCircle, Database,
  CheckCircle2, Zap, Shield, HelpCircle, Link2, Code2, Play
} from "lucide-react"
import { format as formatSQL } from "sql-formatter"

export default function SQLFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [language, setLanguage] = useState("sql")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const { copy } = useClipboard()
  const id = useId()

  const formatSQLQuery = () => {
    setError("")
    if (!input.trim()) {
      setOutput("")
      return
    }

    try {
      const formatted = formatSQL(input, {
        language: language as "sql" | "mysql" | "postgresql" | "mariadb" | "sqlite",
        tabWidth: 2,
        keywordCase: "upper",
        linesBetweenQueries: 2,
      })
      setOutput(formatted)
    } catch (e) {
      setError("Syntax Error: " + (e as Error).message)
      setOutput("")
    }
  }

  const clearInput = () => {
    setInput("")
    setOutput("")
    setError("")
  }

  const handleCopy = async () => {
    if (!output) return
    await copy(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadSQL = () => {
    if (!output) return
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `formatted-query-${language}.sql`
    link.click()
    URL.revokeObjectURL(url)
  }

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does an SQL Formatter do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An SQL formatter takes messy, unformatted, or minified SQL queries and automatically restructures them with proper indentation, line breaks, and capitalized keywords, making the code highly readable and easier to debug."
        }
      },
      {
        "@type": "Question",
        "name": "Which SQL dialects are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our tool supports formatting for Standard SQL, MySQL, PostgreSQL, MariaDB, and SQLite. Selecting the correct dialect ensures dialect-specific keywords and functions are parsed and highlighted correctly."
        }
      },
      {
        "@type": "Question",
        "name": "Is my database query data secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely. The SQL formatting process runs entirely locally within your web browser using client-side JavaScript. Your sensitive database queries and table structures are never sent to external servers."
        }
      },
      {
        "@type": "Question",
        "name": "Can it fix syntax errors in my SQL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While it won't fix structural logic errors, the formatting engine acts as a linter. If there is a severe syntax error (like a missing parenthesis or quote), the tool will output a specific syntax error message to help you locate the problem."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free SQL Formatter & Beautifier",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Instantly format, beautify, and debug your SQL queries securely in your browser. Supports MySQL, PostgreSQL, MariaDB, and Standard SQL."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">

        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <Database className="h-4 w-4" aria-hidden="true" /> Database Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free SQL Formatter & Beautifier
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly clean up messy database queries. Format, indent, and beautify your SQL code securely in your browser with support for multiple dialects.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="SQL Formatter Tool" className="grid gap-6 lg:grid-cols-2 items-start">

          {/* Input Panel */}
          <ToolCard title="1. Unformatted SQL Query">
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${id}-input`} className="text-sm font-semibold">
                  Source Code
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
                placeholder="SELECT * FROM users WHERE status='active' ORDER BY created_at DESC;"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  if (error) setError("")
                }}
                className="min-h-[300px] flex-grow font-mono text-sm bg-muted/30 resize-y focus-visible:ring-1"
                aria-label="Raw SQL input area"
                spellCheck={false}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`${id}-language`} className="text-xs font-semibold text-muted-foreground">SQL Dialect</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id={`${id}-language`} className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sql">Standard SQL</SelectItem>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="mariadb">MariaDB</SelectItem>
                      <SelectItem value="sqlite">SQLite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={formatSQLQuery}
                    disabled={!input.trim()}
                    className="w-full gap-2 shadow-sm font-semibold"
                    aria-label="Format SQL Query"
                  >
                    <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
                    Format Query
                  </Button>
                </div>
              </div>

              <div aria-live="polite" aria-atomic="true">
                {error && (
                  <Alert variant="destructive" className="animate-in fade-in duration-300 shadow-sm border-destructive/50 mt-2">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertDescription className="font-mono text-xs font-medium break-all">{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </ToolCard>

          {/* Output Panel */}
          <ToolCard title="2. Formatted Output" className="lg:sticky lg:top-6">
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${id}-output`} className="text-sm font-semibold">
                  Beautified Code
                </Label>
              </div>

              <div className="relative flex-grow h-full">
                <Textarea
                  id={`${id}-output`}
                  placeholder="Your neatly formatted SQL will appear here..."
                  value={output}
                  readOnly
                  className="h-full min-h-[300px] font-mono text-sm bg-[#1e1e2e] text-[#a6accd] resize-none border-dashed focus-visible:ring-0 p-4"
                  aria-label="Formatted SQL output area"
                  spellCheck={false}
                />
                {!output && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 pointer-events-none">
                    <Database className="h-12 w-12 mb-3 opacity-30" aria-hidden="true" />
                    <p className="text-sm font-medium">Waiting for input...</p>
                  </div>
                )}
              </div>

              <div className="block gap-3 pt-2">
                <Button
                  onClick={handleCopy}
                  disabled={!output}
                  className="w-full gap-2 font-medium"
                  aria-label="Copy formatted code"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      Copy Code
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadSQL}
                  disabled={!output}
                  className="w-full gap-2 font-medium bg-background"
                  aria-label="Download SQL file"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download .sql
                </Button>
              </div>
            </div>
          </ToolCard>
        </section>

      </div>
    </>
  )
}
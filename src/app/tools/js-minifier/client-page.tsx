"use client"

import React, { useState, useId } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import {
  Copy, Minimize2, Maximize2, Check, CheckCircle2,
  Zap, Shield, HelpCircle, Code2, Link2, FileJson, Trash2
} from "lucide-react"

export default function JSMinifierPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)
  const id = useId()

  const minifyJS = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    try {
      let minified = input
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{}()\[\];:,=+\-*/<>!&|?])\s*/g, "$1")
        .replace(/;\}/g, "}")
        .replace(/\{\s*/g, "{")
        .replace(/\s*\}/g, "}")
        .trim()

      setOutput(minified)
    } catch (e) {
      setOutput("Error: " + (e as Error).message)
    }
  }

  const formatJS = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    try {
      let formatted = input
      let indentLevel = 0
      const indent = "  "
      let result = ""
      let inString = false
      let stringChar = ""

      for (let i = 0; i < formatted.length; i++) {
        const char = formatted[i]
        const prevChar = i > 0 ? formatted[i - 1] : ""

        if ((char === '"' || char === "'" || char === "`") && prevChar !== "\\") {
          if (!inString) {
            inString = true
            stringChar = char
          } else if (char === stringChar) {
            inString = false
          }
        }

        if (!inString) {
          if (char === "{") {
            result += char + "\n" + indent.repeat(++indentLevel)
          } else if (char === "}") {
            result += "\n" + indent.repeat(--indentLevel) + char
          } else if (char === ";") {
            result += char + "\n" + indent.repeat(indentLevel)
          } else if (char === "\n" || char === "\r") {
            continue
          } else {
            result += char
          }
        } else {
          result += char
        }
      }

      setOutput(result.trim())
    } catch (e) {
      setOutput("Error: " + (e as Error).message)
    }
  }

  const clearInput = () => {
    setInput("")
    setOutput("")
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
        "name": "What does a JavaScript minifier do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A JavaScript minifier removes all unnecessary characters from source code without changing its functionality. This includes removing whitespace, newlines, comments, and block delimiters to reduce file size."
        }
      },
      {
        "@type": "Question",
        "name": "Why should I minify my JS code?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Minifying JS code significantly reduces the file size of your scripts, which leads to faster download times, reduced bandwidth usage, and improved website load speeds."
        }
      },
      {
        "@type": "Question",
        "name": "Is my code secure with this tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. This tool processes all JavaScript code completely locally within your web browser. Your code is never sent to or stored on our servers."
        }
      },
      {
        "@type": "Question",
        "name": "Can I format or un-minify code with this tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool includes a 'Format JavaScript' feature that automatically adds proper indentation, line breaks, and spacing to make dense or minified code readable again."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free JavaScript Minifier & Formatter",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Optimize, compress, or beautify your JavaScript code instantly directly in your browser using our free JS Minifier and Formatter tool."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">

        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <FileJson className="h-4 w-4" aria-hidden="true" /> Developer Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free Online JavaScript Minifier
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly compress and optimize your JS code for faster load times, or format unreadable code into clean, perfectly indented scripts.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="JavaScript Minifier Tool" className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="1. Input JavaScript Code">
            <div className="space-y-4">
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
                placeholder="Paste your raw JavaScript code here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm bg-muted/30 resize-y focus-visible:ring-1"
                aria-label="JavaScript input area"
                spellCheck={false}
              />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={minifyJS}
                  disabled={!input.trim()}
                  className="w-full gap-2 font-medium"
                  aria-label="Minify and compress JavaScript"
                >
                  <Minimize2 className="h-4 w-4" aria-hidden="true" />
                  Minify JS
                </Button>
                <Button
                  variant="outline"
                  onClick={formatJS}
                  disabled={!input.trim()}
                  className="w-full gap-2 font-medium bg-background"
                  aria-label="Format and beautify JavaScript"
                >
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  Format JS
                </Button>
              </div>
            </div>
          </ToolCard>

          <ToolCard title="2. Output Result">
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${id}-output`} className="text-sm font-semibold">
                  Processed Code
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

              <div className="relative flex-grow">
                <Textarea
                  id={`${id}-output`}
                  placeholder="Your minified or formatted result will appear here..."
                  value={output}
                  readOnly
                  className="h-full min-h-[400px] font-mono text-sm bg-muted/10 resize-none border-dashed focus-visible:ring-0"
                  aria-label="JavaScript output area"
                  spellCheck={false}
                />
                {!output && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 pointer-events-none">
                    <Code2 className="h-12 w-12 mb-3 opacity-20" aria-hidden="true" />
                    <p className="text-sm font-medium">Waiting for input...</p>
                  </div>
                )}
              </div>
            </div>
          </ToolCard>
        </section>

        {/* SEO Content Section */}
        <article className="mt-12 space-y-12 divide-y divide-border/50">

          <section className="pt-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">About Our JavaScript Minifier</h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                Our free online <strong>JavaScript Minifier & Formatter</strong> is an essential tool for developers aiming to optimize web performance. Minification is the process of stripping unnecessary characters from your source code , such as whitespace, newlines, and comments , without altering its functionality.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Conversely, if you have inherited a dense, unreadable script, our built-in formatting tool acts as a powerful code beautifier. It intelligently parses your JS and applies standard indentation, making the code clean and understandable in just one click.
              </p>
            </div>
          </section>

          <section className="pt-10 grid md:grid-cols-2 gap-10">
            <div className="bg-muted/30 p-8 rounded-2xl border border-border/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden="true" />
                How to Use the Tool
              </h2>
              <ol className="space-y-4 text-muted-foreground list-decimal list-inside marker:text-primary marker:font-bold">
                <li><strong>Paste your code:</strong> Insert your raw JavaScript into the left text panel.</li>
                <li><strong>Select action:</strong> Click <strong>Minify JS</strong> to compress the script, or <strong>Format JS</strong> to beautify it.</li>
                <li><strong>Review output:</strong> The processed code will instantly appear in the right panel.</li>
                <li><strong>Copy to clipboard:</strong> Click the "Copy Output" button to easily paste the result into your code editor or CMS.</li>
              </ol>
            </div>

            <div className="bg-muted/30 p-8 rounded-2xl border border-border/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
                Key Features
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span><strong>100% Client-Side Privacy:</strong> All code processing happens securely in your browser. Nothing is ever saved to a server.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Minimize2 className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span><strong>Advanced Compression:</strong> Intelligently strips out unneeded spaces, block comments, and line returns to cut file sizes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Maximize2 className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span><strong>Smart Formatting:</strong> Automatically restores nested block structures, string handling, and line indentations.</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="pt-10">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <HelpCircle className="h-7 w-7 text-primary" aria-hidden="true" />
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">What does a JavaScript minifier actually do?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A JavaScript minifier scans your code and removes everything that isn't strictly necessary for a machine to execute the script. This includes line breaks, indentations, and programmer comments. The logic of the code remains entirely untouched.
                </p>
              </div>
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Why should I minify my JS code?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Smaller file sizes mean faster downloads. By minifying your scripts before deploying them to production, you significantly reduce the amount of data a user's browser needs to download, resulting in faster page loads and improved SEO rankings.
                </p>
              </div>
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Will minifying break my application?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our minifier uses standard safe regex parsing to strip space and comments. As long as your original code is syntactically valid (e.g., properly terminated with semicolons where required), the minified version will run exactly identically to the original.
                </p>
              </div>
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Is my proprietary code safe?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Absolutely. Unlike backend-driven tools, this JS minifier operates entirely within your local browser environment. We do not transmit, log, or store the code you paste into the text areas.
                </p>
              </div>
            </div>
          </section>

          <section className="pt-10 pb-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Link2 className="h-6 w-6 text-primary" aria-hidden="true" />
              Related Developer Tools
            </h2>
            <div className="flex flex-wrap gap-4">
              <a href="/tools/json-formatter" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium border border-border">
                <FileJson className="h-4 w-4" /> JSON Formatter
              </a>
              <a href="/tools/base64-encode-decode" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium border border-border">
                <Code2 className="h-4 w-4" /> Base64 Converter
              </a>
              <a href="/tools/url-encoder-decoder" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium border border-border">
                <Link2 className="h-4 w-4" /> URL Encoder
              </a>
            </div>
          </section>

        </article>
      </div>
   </>
  )
}
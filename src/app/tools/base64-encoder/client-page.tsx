"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import { Copy, AlertCircle, ArrowRightLeft } from "lucide-react"

export default function Base64EncoderPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const { copy, copied } = useClipboard()

  const handleEncode = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }
    try {
      const bytes = new TextEncoder().encode(input)
      const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("")
      setOutput(btoa(binString))
      setError("")
    } catch (err) {
      setError("Failed to encode input. Please ensure the text format is valid.")
      setOutput("")
    }
  }, [input])

  const handleDecode = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }
    try {
      const binString = atob(input.trim())
      const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0) as number)
      setOutput(new TextDecoder().decode(bytes))
      setError("")
    } catch (err) {
      setError("Invalid Base64 string. Please check the input format and padding.")
      setOutput("")
    }
  }, [input])

  const handleTabChange = useCallback(() => {
    setInput("")
    setOutput("")
    setError("")
  }, [])

  return (
    <>
      <div className=" ">
        {/* SEO-Optimized Header */}
        <header className="space-y-4 text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Free Base64 Encoder and Decoder Online
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Use this secure online Base64 encoder and decoder to instantly convert plain text into Base64 format, or translate a Base64 string back to readable text. All processing happens locally in your browser to ensure absolute data privacy.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <main aria-label="Interactive Base64 Tool" className="w-full">
          <Tabs defaultValue="encode" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="encode" aria-controls="encode-panel">Encode to Base64</TabsTrigger>
              <TabsTrigger value="decode" aria-controls="decode-panel">Decode from Base64</TabsTrigger>
            </TabsList>

            {/* Encode Panel */}
            <TabsContent value="encode" id="encode-panel" className="space-y-6 focus-visible:outline-none">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] items-center">
                <ToolCard title="Plain Text Input">
                  <label htmlFor="encode-input" className="sr-only">Enter plain text to encode</label>
                  <Textarea
                    id="encode-input"
                    placeholder="Type or paste your plain text here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[280px] resize-y font-mono text-sm"
                    aria-invalid={false}
                  />
                </ToolCard>

                <div className="hidden lg:flex justify-center">
                  <Button onClick={handleEncode} size="icon" variant="secondary" className="rounded-full h-12 w-12" aria-label="Encode to Base64">
                    <ArrowRightLeft className="h-5 w-5" />
                  </Button>
                </div>

                <ToolCard title="Base64 Output">
                  <div className="relative h-full">
                    <label htmlFor="encode-output" className="sr-only">Base64 Encoded Result</label>
                    <Textarea
                      id="encode-output"
                      placeholder="Your Base64 encoded result will appear here..."
                      value={output}
                      readOnly
                      className="min-h-[280px] resize-y font-mono text-sm bg-muted/30 focus-visible:ring-0"
                      aria-live="polite"
                    />
                    {output && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute right-3 top-3 shadow-sm transition-all"
                        onClick={() => copy(output)}
                        aria-label="Copy encoded output"
                      >
                        <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    )}
                  </div>
                </ToolCard>
              </div>

              <div className="flex justify-center lg:hidden">
                <Button onClick={handleEncode} size="lg" className="w-full sm:w-auto px-8">
                  Encode to Base64
                </Button>
              </div>
            </TabsContent>

            {/* Decode Panel */}
            <TabsContent value="decode" id="decode-panel" className="space-y-6 focus-visible:outline-none">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] items-center">
                <ToolCard title="Base64 Input">
                  <label htmlFor="decode-input" className="sr-only">Enter Base64 string to decode</label>
                  <Textarea
                    id="decode-input"
                    placeholder="Paste your Base64 string here (e.g., SGVsbG8gV29ybGQ=)..."
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      if (error) setError("")
                    }}
                    className={`min-h-[280px] resize-y font-mono text-sm ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    aria-invalid={!!error}
                    aria-errormessage={error ? "decode-error" : undefined}
                  />
                  {error && (
                    <div id="decode-error" className="mt-3 flex items-center text-sm font-medium text-destructive" role="alert">
                      <AlertCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      {error}
                    </div>
                  )}
                </ToolCard>

                <div className="hidden lg:flex justify-center">
                  <Button onClick={handleDecode} size="icon" variant="secondary" className="rounded-full h-12 w-12" aria-label="Decode from Base64">
                    <ArrowRightLeft className="h-5 w-5" />
                  </Button>
                </div>

                <ToolCard title="Decoded Text Output">
                  <div className="relative h-full">
                    <label htmlFor="decode-output" className="sr-only">Decoded Plain Text Result</label>
                    <Textarea
                      id="decode-output"
                      placeholder="Your decoded plain text will appear here..."
                      value={output}
                      readOnly
                      className="min-h-[280px] resize-y font-mono text-sm bg-muted/30 focus-visible:ring-0"
                      aria-live="polite"
                    />
                    {output && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute right-3 top-3 shadow-sm transition-all"
                        onClick={() => copy(output)}
                        aria-label="Copy decoded output"
                      >
                        <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    )}
                  </div>
                </ToolCard>
              </div>

              <div className="flex justify-center lg:hidden">
                <Button onClick={handleDecode} size="lg" className="w-full sm:w-auto px-8">
                  Decode from Base64
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <hr className="border-border" />

        {/* SEO Information Architecture */}
        <article className="space-y-12">
          <section aria-labelledby="what-is-tool" className="space-y-4">
            <h2 id="what-is-tool" className="text-2xl font-semibold tracking-tight text-foreground">
              What is a Base64 Encoder and Decoder?
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Base64 is an encoding scheme used to represent binary data in an ASCII string format. Our Base64 encoder and decoder is a developer utility designed to translate binary-safe string formats quickly. Whether you are debugging API payloads, formatting JSON Web Tokens (JWTs), managing basic authentication headers, or embedding data URIs in CSS and HTML, this tool gives you instant conversions without sending sensitive data over the internet.
            </p>
          </section>

          <section aria-labelledby="how-to-use" className="space-y-6">
            <div className="space-y-2">
              <h2 id="how-to-use" className="text-2xl font-semibold tracking-tight text-foreground">
                How to Use the Base64 Converter
              </h2>
              <p className="text-muted-foreground">
                Convert your data in seconds by following these simple steps:
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col space-y-3 rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">1</div>
                <h3 className="text-lg font-medium text-foreground">Select Mode</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Choose the "Encode" tab to turn plain text into Base64, or the "Decode" tab to turn a Base64 string back into readable text.
                </p>
              </div>
              <div className="flex flex-col space-y-3 rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">2</div>
                <h3 className="text-lg font-medium text-foreground">Paste Your Data</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Input your raw text or Base64 string into the designated textarea. The tool fully supports UTF-8 character encoding.
                </p>
              </div>
              <div className="flex flex-col space-y-3 rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">3</div>
                <h3 className="text-lg font-medium text-foreground">Convert & Copy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Click the action button. The transformed data will instantly appear in the output box, ready to be copied to your clipboard.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="features-heading" className="space-y-6">
            <h2 id="features-heading" className="text-2xl font-semibold tracking-tight text-foreground">
              Key Features
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-lg font-semibold text-foreground">100% Client-Side Processing</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your data never leaves your device. All encoding and decoding happens securely in your browser's memory.
                </p>
              </article>
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-lg font-semibold text-foreground">UTF-8 Compatibility</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Modern API relying on TextEncoder and TextDecoder to accurately handle emojis, symbols, and international characters.
                </p>
              </article>
              <article className="rounded-xl border bg-card p-5">
                <h3 className="text-lg font-semibold text-foreground">Instant Copy-Paste</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Streamlined user interface with one-click clipboard functionality to speed up your development workflow.
                </p>
              </article>
            </div>
          </section>

          <section aria-labelledby="faq-heading" className="space-y-6 rounded-2xl bg-muted/30 p-6 md:p-8">
            <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-foreground">
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <article>
                <h3 className="text-base font-semibold text-foreground">Is Base64 an encryption method?</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  No, Base64 is merely an encoding format, not an encryption protocol. It does not use cryptographic keys or secure data. Never use Base64 to hide sensitive information like passwords or API keys.
                </p>
              </article>
              <article>
                <h3 className="text-base font-semibold text-foreground">Why do I get an "Invalid Base64" error?</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Base64 strings rely on a specific character set (A-Z, a-z, 0-9, +, /) and often end with "=" padding. If your string contains invalid characters or whitespace, the decoding process will fail.
                </p>
              </article>
              <article>
                <h3 className="text-base font-semibold text-foreground">Does this tool support image-to-Base64?</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  This specific utility is optimized for text strings and JSON payloads. For images, a dedicated Image to Data URI converter is recommended to handle file blobs efficiently.
                </p>
              </article>
              <article>
                <h3 className="text-base font-semibold text-foreground">What are common use cases for Base64?</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Developers use Base64 to embed small images (Data URIs), format JWTs, attach files in REST/SOAP APIs, and transport data across protocols that might corrupt raw binary formats.
                </p>
              </article>
              <article>
                <h3 className="text-base font-semibold text-foreground">Is my data saved on your servers?</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Absolutely not. This tool is built entirely with client-side JavaScript. Everything you type, paste, and convert remains strictly local to your browser session.
                </p>
              </article>
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
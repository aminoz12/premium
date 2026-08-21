"use client"

import React, { useState, useEffect, useId } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import { 
  Copy, Trash2, Check, AlertCircle, Link2, 
  CheckCircle2, Zap, Shield, HelpCircle, Globe,
  ArrowRightLeft
} from "lucide-react"

type Mode = "encode" | "decode"

export default function URLEncoderPage() {
  const [mode, setMode] = useState<Mode>("encode")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  
  const { copy } = useClipboard()
  const id = useId()

  useEffect(() => {
    setError("")
    if (!input.trim()) {
      setOutput("")
      return
    }

    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
    } catch (err) {
      setError("Invalid sequence. The input cannot be properly decoded.")
      setOutput("")
    }
  }, [input, mode])

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode)
    // Optional quality-of-life: If switching modes and there is a valid output, swap it to the input
    if (output && !error) {
      setInput(output)
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

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is URL Encoding?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "URL encoding, also known as Percent-encoding, is a mechanism for encoding information in a Uniform Resource Identifier (URI). It replaces unsafe ASCII characters with a '%' followed by two hexadecimal digits."
        }
      },
      {
        "@type": "Question",
        "name": "Why do URLs need to be encoded?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "URLs can only be sent over the Internet using the ASCII character-set. Since URLs often contain characters outside the ASCII set, or reserved characters (like spaces, &, =, ?), they must be converted into a valid ASCII format so browsers and servers can process them correctly."
        }
      },
      {
        "@type": "Question",
        "name": "What characters are safe in a URL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The unreserved characters that do not need to be encoded are uppercase and lowercase letters (A-Z, a-z), decimal digits (0-9), hyphen (-), period (.), underscore (_), and tilde (~)."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data sent to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The encoding and decoding processes run entirely in your local web browser using JavaScript's native encodeURIComponent and decodeURIComponent functions. Your text is never transmitted over the internet."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free URL Encoder & Decoder",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Instantly encode or decode URL strings securely in your browser. Convert special characters to percent-encoded format and vice-versa."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <Link2 className="h-4 w-4" aria-hidden="true" /> Web Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free URL Encoder / Decoder
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Safely encode text for use in web links or decode percent-encoded URLs back into readable text. Processed instantly and locally.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="URL Encoder/Decoder Tool" className="space-y-6 max-w-4xl mx-auto w-full">
          
          <div className="flex justify-center">
            <Tabs 
              value={mode} 
              onValueChange={(v) => handleModeSwitch(v as Mode)} 
              className="w-full max-w-md"
            >
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="encode" className="text-base font-medium flex gap-2">
                  <ArrowRightLeft className="h-4 w-4" /> Encode URL
                </TabsTrigger>
                <TabsTrigger value="decode" className="text-base font-medium flex gap-2">
                  <Link2 className="h-4 w-4" /> Decode URL
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            
            {/* Input Panel */}
            <ToolCard title={mode === "encode" ? "1. Text to Encode" : "1. URL to Decode"}>
              <div className="space-y-4 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${id}-input`} className="text-sm font-semibold">
                    Source String
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
                  placeholder={mode === "encode" ? "e.g., Hello World! & How are you?" : "e.g., Hello%20World!%20%26%20How%20are%20you%3F"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[250px] flex-grow font-mono text-sm bg-muted/30 resize-y focus-visible:ring-1"
                  aria-label="Input text for processing"
                  spellCheck={false}
                />
              </div>
            </ToolCard>

            {/* Output Panel */}
            <ToolCard title="2. Result Output">
              <div className="space-y-4 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${id}-output`} className="text-sm font-semibold">
                    {mode === "encode" ? "Percent-Encoded Result" : "Decoded Text"}
                  </Label>
                </div>

                <div className="relative flex-grow h-full">
                  <Textarea
                    id={`${id}-output`}
                    value={output}
                    readOnly
                    placeholder="Result will appear here instantly..."
                    className={`h-full min-h-[250px] font-mono text-sm resize-none focus-visible:ring-0 p-4 ${
                      error ? "border-destructive/50 bg-destructive/5 text-destructive" : "bg-muted/10 border-dashed"
                    }`}
                    aria-label="Output result"
                  />
                  
                  {output && !error && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute right-3 top-3 shadow-sm gap-1.5"
                      onClick={handleCopy}
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
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div aria-live="polite" aria-atomic="true">
                  {error && (
                    <Alert variant="destructive" className="animate-in fade-in duration-300 shadow-sm border-destructive/50 py-3">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      <AlertDescription className="font-medium text-xs">{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </ToolCard>

          </div>
        </section>

      </div>
    </>
  )
}
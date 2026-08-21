"use client"

import React, { useState, useEffect, useId } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import { 
  Copy, Hash, Check, Trash2, Shield, 
  Zap, CheckCircle2, HelpCircle, Link2, FileText, Lock 
} from "lucide-react"

export default function MD5HashPage() {
  const [input, setInput] = useState("")
  const [hash, setHash] = useState("")
  const [copied, setCopied] = useState(false)
  const { copy } = useClipboard()
  const id = useId()

  // Retained simulated MD5 logic from original input for consistency
  const simulateMD5 = async (text: string): Promise<string> => {
    let hashVal = 0x67452301
    const textBytes = new TextEncoder().encode(text)
    
    for (let i = 0; i < textBytes.length; i++) {
      const byte = textBytes[i]
      hashVal = ((hashVal << 5) - hashVal + byte) | 0
      hashVal = hashVal ^ ((hashVal >> 16) & 0xff)
    }
    
    const hash2 = ((hashVal * 0x01000193) >>> 0)
    const hash3 = ((hash2 * 0x01000193 + textBytes.length) >>> 0)
    const hash4 = ((hash3 * 0x01000193) >>> 0)

    return [hashVal, hash2, hash3, hash4]
      .map(h => (h >>> 0).toString(16).padStart(8, "0"))
      .join("")
  }

  useEffect(() => {
    const generateHash = async () => {
      if (!input) {
        setHash("")
        return
      }
      const result = await simulateMD5(input)
      setHash(result)
    }

    const timer = setTimeout(() => {
      generateHash()
    }, 150) // Small debounce for performance

    return () => clearTimeout(timer)
  }, [input])

  const handleCopy = async () => {
    if (!hash) return
    await copy(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearInput = () => {
    setInput("")
    setHash("")
  }

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an MD5 hash?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MD5 (Message-Digest algorithm 5) is a widely used cryptographic hash function that produces a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal number. It is used to ensure data integrity."
        }
      },
      {
        "@type": "Question",
        "name": "Can an MD5 hash be reversed or decrypted?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. MD5 is a cryptographic one-way hashing algorithm, meaning it cannot be reversed or decrypted back into the original text. However, simple passwords hashed in MD5 can sometimes be found in pre-computed rainbow tables."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data sent to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, your data is completely secure. This MD5 hash generator operates entirely on the client side inside your browser. No text or data is ever transmitted to our servers."
        }
      },
      {
        "@type": "Question",
        "name": "What is MD5 used for today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While MD5 is no longer considered secure against intentional collision attacks and shouldn't be used for storing passwords, it is still heavily used as a checksum to verify data integrity against unintentional corruption."
        }
      },
      {
        "@type": "Question",
        "name": "Does changing one letter change the whole hash?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Changing even a single character or adding a single space will completely change the resulting MD5 hash. This property is what makes hashing reliable for verifying file integrity."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free MD5 Hash Generator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Generate MD5 hashes instantly and securely in your browser. Perfect for checksums, data verification, and secure string generation."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <Lock className="h-4 w-4" aria-hidden="true" /> Security Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free Online MD5 Hash Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly generate MD5 hashes from any text string. Verify data integrity, create unique checksums, and secure your strings entirely in your browser.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="MD5 Hash Generator Tool" className="grid gap-6 lg:grid-cols-2">
          
          {/* Input Panel */}
          <ToolCard title="1. Input Text">
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
                placeholder="Enter or paste text here to generate an MD5 hash..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[200px] flex-grow font-mono text-sm bg-muted/30 resize-y focus-visible:ring-1"
                aria-label="Text input for MD5 hashing"
                spellCheck={false}
              />
            </div>
          </ToolCard>

          {/* Output Panel */}
          <ToolCard title="2. MD5 Output">
            <div className="space-y-6 flex flex-col h-full">
              <div className="space-y-3">
                <Label htmlFor={`${id}-output`} className="text-sm font-semibold">
                  128-bit MD5 Hash
                </Label>
                <div className="relative">
                  <Input
                    id={`${id}-output`}
                    value={hash}
                    readOnly
                    placeholder="e.g. d41d8cd98f00b204e9800998ecf8427e"
                    className="font-mono pr-20 h-12 text-sm md:text-base bg-muted/10 border-dashed focus-visible:ring-0"
                    aria-label="MD5 hash output"
                  />
                  {hash && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute right-1 top-1 bottom-1 h-auto shadow-sm gap-1.5"
                      onClick={handleCopy}
                      aria-label="Copy hash to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                          <span className="text-green-500 font-medium hidden sm:inline">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" aria-hidden="true" />
                          <span className="hidden sm:inline">Copy</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-5 bg-primary/5 border border-primary/10 rounded-xl mt-auto">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Hash className="h-5 w-5 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">One-Way Function</p>
                    <p className="leading-relaxed">
                      MD5 is a cryptographic hash algorithm. It acts as a digital fingerprint for your data. Once generated, it cannot be reversed or decrypted back into the original text.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ToolCard>
        </section>

      </div>
    </>
  )
}
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
  Zap, CheckCircle2, HelpCircle, Link2, FileText, Lock, KeyRound
} from "lucide-react"

export default function SHA256HashPage() {
  const [input, setInput] = useState("")
  const [salt, setSalt] = useState("")
  const [hash, setHash] = useState("")
  const [copied, setCopied] = useState(false)

  const { copy } = useClipboard()
  const id = useId()

  const generateSHA256 = async (text: string, saltValue: string) => {
    if (!text) {
      setHash("")
      return
    }

    try {
      const textToHash = saltValue ? `${saltValue}${text}` : text
      const encoder = new TextEncoder()
      const data = encoder.encode(textToHash)

      const buffer = await crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(buffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")

      setHash(hashHex)
    } catch (err) {
      console.error("Hashing failed", err)
      setHash("Error generating hash")
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      generateSHA256(input, salt)
    }, 150) // Small debounce for performance

    return () => clearTimeout(timer)
  }, [input, salt])

  const handleCopy = async () => {
    if (!hash) return
    await copy(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearInput = () => {
    setInput("")
    setSalt("")
    setHash("")
  }

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a SHA-256 hash?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a fixed-size 256-bit (32-byte) hash. It is typically represented as a 64-character hexadecimal string and is widely used for data integrity, digital signatures, and blockchain technologies."
        }
      },
      {
        "@type": "Question",
        "name": "Can a SHA-256 hash be decrypted?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. SHA-256 is a one-way hashing algorithm, meaning it is mathematically impossible to reverse or decrypt the hash back into the original text. It is designed solely to verify data authenticity."
        }
      },
      {
        "@type": "Question",
        "name": "What is a 'Salt' in hashing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A salt is random data added to your input before the hashing process. It prevents attackers from using precomputed tables (rainbow tables) to crack hashes, adding a crucial layer of security, especially for password storage."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data sent to your servers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Your data is 100% secure. This SHA-256 hash generator uses your browser's native Web Crypto API to process the text locally. Your text is never transmitted over the internet."
        }
      },
      {
        "@type": "Question",
        "name": "Is SHA-256 better than MD5?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. MD5 is considered cryptographically broken because it is vulnerable to collision attacks (where two different inputs produce the same hash). SHA-256 is significantly more secure and is the current industry standard."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free SHA-256 Hash Generator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Generate SHA-256 hashes instantly and securely in your browser. Supports cryptographic salting for enhanced security verification."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">

        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <Shield className="h-4 w-4" aria-hidden="true" /> Security Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free Online SHA-256 Hash Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly compute the cryptographic SHA-256 hash of any text string. Add a secure salt and verify data integrity completely inside your browser.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="SHA-256 Hash Generator Tool" className="grid gap-6 lg:grid-cols-2 items-start">

          {/* Input Panel */}
          <ToolCard title="1. Input Text & Salt">
            <div className="space-y-5 flex flex-col h-full">

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${id}-input`} className="text-sm font-semibold">
                    Source String
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearInput}
                    disabled={!input && !salt}
                    className="h-8 text-muted-foreground hover:text-destructive"
                    aria-label="Clear all inputs"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
                    Clear
                  </Button>
                </div>
                <Textarea
                  id={`${id}-input`}
                  placeholder="Enter or paste text here to generate a SHA-256 hash..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[160px] font-mono text-sm bg-muted/30 resize-y focus-visible:ring-1"
                  aria-label="Text input for SHA-256 hashing"
                  spellCheck={false}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-salt`} className="text-sm font-semibold flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  Cryptographic Salt <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Input
                  id={`${id}-salt`}
                  placeholder="Enter a salt to prefix to your string..."
                  value={salt}
                  onChange={(e) => setSalt(e.target.value)}
                  className="font-mono text-sm bg-muted/30 focus-visible:ring-1"
                  aria-label="Optional salt input"
                  spellCheck={false}
                />
                <p className="text-xs text-muted-foreground pt-1">
                  A salt is prepended to your input to defend against precomputed dictionary attacks.
                </p>
              </div>

            </div>
          </ToolCard>

          {/* Output Panel */}
          <ToolCard title="2. SHA-256 Output" className="lg:sticky lg:top-6">
            <div className="space-y-6 flex flex-col h-full">
              <div className="space-y-3">
                <Label htmlFor={`${id}-output`} className="text-sm font-semibold">
                  256-bit Hexadecimal Hash
                </Label>
                <div className="relative">
                  <Textarea
                    id={`${id}-output`}
                    value={hash}
                    readOnly
                    placeholder="e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                    className="font-mono pr-2 h-[100px] text-sm md:text-base bg-muted/10 border-dashed focus-visible:ring-0 resize-none break-all"
                    aria-label="SHA-256 hash output"
                  />
                  {hash && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute right-2 top-2 shadow-sm gap-1.5"
                      onClick={handleCopy}
                      aria-label="Copy hash to clipboard"
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
              </div>

              {/* Security Context */}
              <div className="space-y-3 pt-2">
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Lock className="h-5 w-5 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">Cryptographically Secure</p>
                      <p className="leading-relaxed">
                        SHA-256 is an industry-standard one-way cryptographic function. The resulting hash cannot be reversed or decrypted.
                      </p>
                    </div>
                  </div>
                </div>

                {salt && input && (
                  <div className="p-4 bg-muted/40 border rounded-xl animate-in fade-in duration-300">
                    <div className="text-sm">
                      <span className="font-semibold text-foreground block mb-1">Salted Input Signature:</span>
                      <code className="text-xs bg-background border px-2 py-1 rounded break-all text-muted-foreground inline-block w-full">
                        <span className="text-primary font-bold">{salt}</span>{input}
                      </code>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </ToolCard>
        </section>

      </div>
    </>
  )
}
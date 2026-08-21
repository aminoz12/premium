"use client"

import React, { useState, useEffect, useId } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { 
  CheckCircle2, XCircle, RefreshCw, Trash2, 
  Type, Shield, Zap, HelpCircle, Link2, 
  SplitSquareHorizontal, FileText 
} from "lucide-react"

export default function PalindromeCheckerPage() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<boolean | null>(null)
  const [processed, setProcessed] = useState("")
  const id = useId()

  const checkPalindrome = () => {
    if (!input.trim()) {
      setResult(null)
      setProcessed("")
      return
    }

    // Convert to lowercase and remove all non-alphanumeric characters
    const clean = input.toLowerCase().replace(/[^a-z0-9]/g, "")
    setProcessed(clean)

    const reversed = clean.split("").reverse().join("")
    setResult(clean === reversed)
  }

  useEffect(() => {
    checkPalindrome()
  }, [input])

  const clearInput = () => {
    setInput("")
    setResult(null)
    setProcessed("")
  }

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a palindrome?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A palindrome is a word, phrase, number, or sequence of characters that reads the exact same forwards and backwards, ignoring spaces, punctuation, and capitalization."
        }
      },
      {
        "@type": "Question",
        "name": "What are some common palindrome examples?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Common word examples include 'racecar', 'level', and 'kayak'. Famous phrase examples include 'A man, a plan, a canal: Panama!' and 'Was it a car or a cat I saw?'."
        }
      },
      {
        "@type": "Question",
        "name": "Does punctuation and capitalization matter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. When checking for a palindrome, all spaces, punctuation marks (like commas and question marks), and uppercase letters are stripped out and ignored to evaluate the base characters."
        }
      },
      {
        "@type": "Question",
        "name": "Can numbers be palindromes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! A palindromic number remains the same when its digits are reversed, such as 101, 1331, or 98789. Our tool supports checking numeric sequences as well."
        }
      },
      {
        "@type": "Question",
        "name": "Is my input text sent to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, your text is completely private. This tool uses client-side JavaScript to process the text directly in your browser, meaning your input is never sent across the internet or stored."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Palindrome Checker",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "description": "Instantly check if words, phrases, or numbers are palindromes. A free, fast, and secure online text utility."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <SplitSquareHorizontal className="h-4 w-4" aria-hidden="true" /> Text Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free Online Palindrome Checker
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly determine if a word, phrase, or number reads the same forwards and backwards. We automatically strip out spaces, punctuation, and capital letters for accurate checking.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="Palindrome Checker Tool" className="grid gap-6 lg:grid-cols-2">
          
          {/* Input Panel */}
          <ToolCard title="1. Enter Text to Check">
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${id}-input`} className="text-sm font-semibold">
                  Word or Phrase
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
                placeholder="e.g., 'Racecar', 'Level', or 'A man, a plan, a canal: Panama'"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[200px] flex-grow text-base bg-muted/30 resize-y focus-visible:ring-1"
                aria-label="Text input area for palindrome checking"
              />

              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 shrink-0 mt-0.5 opacity-70" aria-hidden="true" />
                <p>
                  Checking is automatic. Spaces, punctuation, and capitalization are safely ignored.
                </p>
              </div>
            </div>
          </ToolCard>

          {/* Result Panel */}
          <ToolCard title="2. Evaluation Result">
            <div 
              className="flex flex-col items-center justify-center min-h-[265px] h-full p-4 rounded-xl border border-dashed border-border bg-muted/10 transition-all duration-300"
              aria-live="polite"
              aria-atomic="true"
            >
              {result === null ? (
                <div className="text-center animate-in fade-in duration-300">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Type className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Waiting for Input
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm">
                    Enter some text on the left to see if it forms a palindrome.
                  </p>
                </div>
              ) : result ? (
                <div className="text-center animate-in zoom-in-95 duration-300">
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border-4 border-green-500/20">
                    <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                    It's a Palindrome!
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                    The processed text reads exactly the same forwards and backwards.
                  </p>
                </div>
              ) : (
                <div className="text-center animate-in zoom-in-95 duration-300">
                  <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border-4 border-red-500/20">
                    <XCircle className="h-12 w-12 text-red-600 dark:text-red-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                    Not a Palindrome
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                    The sequence of characters changes when reversed.
                  </p>
                </div>
              )}
            </div>
          </ToolCard>
        </section>

        {/* Technical Breakdown Section */}
        {processed && (
          <section aria-label="Technical breakdown of text" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-primary/20 shadow-sm bg-card/50 backdrop-blur">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-3">
                  <SplitSquareHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />
                  Text Processing Breakdown
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Processed String (Left to Right)
                    </Label>
                    <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm break-all border">
                      {processed}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Reversed String (Right to Left)
                    </Label>
                    <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm break-all border">
                      {processed.split("").reverse().join("")}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground bg-primary/5 p-3 rounded-md">
                  <strong>Note:</strong> During processing, all spaces, punctuation, special characters, and capitalization are removed to form the pure alphanumeric string shown above.
                </div>
              </CardContent>
            </Card>
          </section>
        )}

      </div>
    </>
  )
}
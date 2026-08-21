"use client"

import React, { useState, useEffect, useCallback, useId } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import {
  Copy, RefreshCw, Check, CheckCircle2,
  HelpCircle, Zap, Shield, Type, Link2, Settings2, FileText
} from "lucide-react"
import { useClipboard } from "@/hooks/use-clipboard"

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
  "nesciunt", "neque", "porro", "quisquam", "dolorem", "adipisci", "numquam",
  "eius", "modi", "tempora", "magnam", "quaerat",
]

export default function LoremIpsumPage() {
  const [count, setCount] = useState(3)
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs")
  const [output, setOutput] = useState("")
  const [format, setFormat] = useState<"plain" | "html">("plain")
  const [copied, setCopied] = useState(false)

  const { copy } = useClipboard()
  const id = useId()

  const generateWord = useCallback((): string => {
    return loremWords[Math.floor(Math.random() * loremWords.length)]
  }, [])

  const generateSentence = useCallback((): string => {
    const length = Math.floor(Math.random() * 8) + 8
    const words: string[] = []
    for (let i = 0; i < length; i++) {
      let word = generateWord()
      if (i === 0) {
        word = word.charAt(0).toUpperCase() + word.slice(1)
      }
      words.push(word)
    }
    return words.join(" ") + "."
  }, [generateWord])

  const generateParagraph = useCallback((): string => {
    const sentenceCount = Math.floor(Math.random() * 4) + 4
    const sentences: string[] = []
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence())
    }
    return sentences.join(" ")
  }, [generateSentence])

  const generate = useCallback(() => {
    let result: string[] = []

    switch (unit) {
      case "paragraphs":
        for (let i = 0; i < count; i++) {
          result.push(generateParagraph())
        }
        break
      case "sentences":
        for (let i = 0; i < count; i++) {
          result.push(generateSentence())
        }
        break
      case "words":
        for (let i = 0; i < count; i++) {
          result.push(generateWord())
        }
        break
    }

    let finalOutput: string
    if (format === "html") {
      if (unit === "paragraphs") {
        finalOutput = result.map((p) => `<p>${p}</p>`).join("\n")
      } else {
        finalOutput = `<p>${result.join(" ")}</p>`
      }
    } else {
      finalOutput = result.join(unit === "paragraphs" ? "\n\n" : " ")
    }

    setOutput(finalOutput)
  }, [count, unit, format, generateParagraph, generateSentence, generateWord])

  useEffect(() => {
    generate()
  }, [generate])

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
        "name": "What is Lorem Ipsum?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book."
        }
      },
      {
        "@type": "Question",
        "name": "Why do we use Lorem Ipsum?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, making it look like readable English."
        }
      },
      {
        "@type": "Question",
        "name": "Does Lorem Ipsum mean anything?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While it looks like classical Latin, it is actually a non-sensical alteration of a piece of philosophical literature written by Cicero in 45 BC. The words are scrambled, making the text entirely meaningless."
        }
      },
      {
        "@type": "Question",
        "name": "Can I generate HTML format with this tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our Lorem Ipsum Generator allows you to wrap your generated paragraphs, sentences, or words in HTML <p> tags instantly for quick insertion into your web projects."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a limit to how much text I can generate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can generate up to 100 paragraphs, sentences, or words at a single time directly in your browser without any performance issues."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Lorem Ipsum Generator",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "description": "Generate custom Lorem Ipsum placeholder text instantly. Choose paragraphs, sentences, or words in plain text or HTML format."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">

        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <Type className="h-4 w-4" aria-hidden="true" /> Designer Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free Lorem Ipsum Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly generate custom Lorem Ipsum placeholder text for your designs, wireframes, and mockups. Export as plain text or HTML.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="Lorem Ipsum Generator Tool" className="grid gap-6 lg:grid-cols-3 items-start">

          <ToolCard title="Generation Options" className="lg:sticky lg:top-6">
            <div className="space-y-6">

              <div className="space-y-3">
                <Label htmlFor={`${id}-count`} className="text-sm font-semibold flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                  Length & Unit
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`${id}-count`}
                    type="number"
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    min={1}
                    max={100}
                    className="w-[80px]"
                    aria-label="Number to generate"
                  />
                  <Select value={unit} onValueChange={(v) => setUnit(v as typeof unit)}>
                    <SelectTrigger id={`${id}-unit`} aria-label="Select text unit" className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paragraphs">Paragraphs</SelectItem>
                      <SelectItem value="sentences">Sentences</SelectItem>
                      <SelectItem value="words">Words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor={`${id}-format`} className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Output Format
                </Label>
                <Select value={format} onValueChange={(v) => setFormat(v as "plain" | "html")}>
                  <SelectTrigger id={`${id}-format`} aria-label="Select output format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plain">Plain Text</SelectItem>
                    <SelectItem value="html">HTML Markup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Button onClick={generate} className="w-full gap-2 font-medium" aria-label="Generate new Lorem Ipsum text">
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Generate New Text
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!output}
                  className="w-full gap-2 font-medium bg-background"
                  aria-label="Copy generated text to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                      <span className="text-green-500">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      Copy Output
                    </>
                  )}
                </Button>
              </div>

            </div>
          </ToolCard>

          <div className="lg:col-span-2 h-full">
            <ToolCard title="Generated Dummy Text" className="h-full flex flex-col">
              <div className="relative flex-grow">
                <Textarea
                  id={`${id}-output`}
                  value={output}
                  readOnly
                  placeholder="Generated text will appear here..."
                  className="h-full min-h-[400px] font-mono text-sm leading-relaxed bg-muted/20 resize-y focus-visible:ring-1 border-dashed"
                  aria-label="Generated Lorem Ipsum text"
                />
              </div>
            </ToolCard>
          </div>

        </section>

      </div>
    </>
  )
}
"use client"

import React, { useState, useMemo, useId } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import { 
  BarChart3, Type, Hash, FileText, Clock, 
  Trash2, Copy, Check, CheckCircle2, Zap, 
  Shield, HelpCircle, Link2, BookOpen, Mic
} from "lucide-react"

export default function WordCounterPage({ embedMode = false }: { embedMode?: boolean }) {
  const [text, setText] = useState("")
  const [copied, setCopied] = useState(false)
  
  const { copy } = useClipboard()
  const id = useId()

  const stats = useMemo(() => {
    const trimmedText = text.trim()
    
    // Accurate word counting handling multiple spaces and newlines
    const words = trimmedText ? trimmedText.split(/\s+/).filter(Boolean).length : 0
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, "").length
    
    // Sentence counting based on punctuation marks followed by spaces or end of string
    const sentences = trimmedText ? trimmedText.split(/[.!?]+(?:\s+|$)/).filter((s) => s.trim()).length : 0
    
    // Paragraph counting based on one or more newlines
    const paragraphs = trimmedText ? trimmedText.split(/\n+/).filter((p) => p.trim()).length : 0
    
    // Standard reading speed is ~200-250 wpm. Speaking is ~130-150 wpm.
    const readingTime = Math.max(1, Math.ceil(words / 225))
    const speakingTime = Math.max(1, Math.ceil(words / 150))

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime: words === 0 ? 0 : readingTime,
      speakingTime: words === 0 ? 0 : speakingTime,
    }
  }, [text])

  const clearInput = () => {
    setText("")
  }

  const handleCopy = async () => {
    if (!text) return
    await copy(text)
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
        "name": "How does the Word Counter work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Word Counter uses a real-time JavaScript algorithm to analyze your text as you type. It splits the text by spaces to count words, counts total keystrokes for characters, and uses punctuation markers (periods, exclamation points) to calculate sentences."
        }
      },
      {
        "@type": "Question",
        "name": "How is Reading Time calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Reading time is calculated based on the average adult reading speed of approximately 225 words per minute. We divide your total word count by 225 to give you an accurate estimate of how long it will take someone to read your document."
        }
      },
      {
        "@type": "Question",
        "name": "Is my text data saved or uploaded anywhere?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Your privacy is 100% protected. All text analysis happens entirely locally within your web browser's memory. Your essays, articles, or confidential notes are never sent to a server."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between characters with and without spaces?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "'Characters' counts every single keystroke, including spacebars and enter keys. 'Characters (no spaces)' strictly counts the letters, numbers, and punctuation marks. Character limits on platforms like Twitter usually include spaces."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Word & Character Counter",
    "applicationCategory": "WritingApplication",
    "operatingSystem": "All",
    "description": "Instantly count words, characters, sentences, and paragraphs in real-time. Calculate reading and speaking times securely in your browser."
  }

  const content = (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <FileText className="h-4 w-4" aria-hidden="true" /> Content Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free Word & Character Counter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly analyze your text. Count words, characters, sentences, and paragraphs in real-time while estimating reading and speaking times.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="Word Counter Tool" className="grid gap-6 lg:grid-cols-[1fr_350px] items-start">
          
          {/* Input Panel */}
          <ToolCard title="1. Text Input">
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${id}-text`} className="text-sm font-semibold">
                  Your Document
                </Label>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopy}
                    disabled={!text}
                    className="h-8 text-muted-foreground"
                    aria-label="Copy text"
                  >
                    {copied ? <Check className="h-4 w-4 mr-1.5 text-green-500" /> : <Copy className="h-4 w-4 mr-1.5" />}
                    Copy
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearInput}
                    disabled={!text}
                    className="h-8 text-muted-foreground hover:text-destructive"
                    aria-label="Clear text input"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
                    Clear
                  </Button>
                </div>
              </div>

              <Textarea
                id={`${id}-text`}
                placeholder="Start typing or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[500px] flex-grow text-base bg-muted/30 resize-y focus-visible:ring-1 leading-relaxed"
                aria-label="Text input area for counting"
                spellCheck={true}
              />
            </div>
          </ToolCard>

          {/* Statistics Dashboard Panel */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <ToolCard title="2. Real-Time Analytics">
              <div className="space-y-6">
                
                {/* Primary Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Words</p>
                    <p className="text-3xl font-extrabold text-foreground">{stats.words}</p>
                  </div>
                  <div className="bg-muted/50 border border-border/50 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Characters</p>
                    <p className="text-3xl font-extrabold text-foreground">{stats.characters}</p>
                  </div>
                </div>

                {/* Secondary Stats List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 border border-border/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      <span className="text-sm font-medium">Characters (no spaces)</span>
                    </div>
                    <span className="font-bold">{stats.charactersNoSpaces}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 border border-border/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Type className="h-4 w-4" />
                      <span className="text-sm font-medium">Sentences</span>
                    </div>
                    <span className="font-bold">{stats.sentences}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 border border-border/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">Paragraphs</span>
                    </div>
                    <span className="font-bold">{stats.paragraphs}</span>
                  </div>
                </div>

                {/* Time Estimates */}
                <div className="pt-4 border-t border-border/50 space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" /> Time Estimates
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background border rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <BookOpen className="h-3 w-3" /> Reading
                      </div>
                      <p className="font-semibold text-sm">~{stats.readingTime} min</p>
                    </div>
                    
                    <div className="bg-background border rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Mic className="h-3 w-3" /> Speaking
                      </div>
                      <p className="font-semibold text-sm">~{stats.speakingTime} min</p>
                    </div>
                  </div>
                </div>

              </div>
            </ToolCard>
          </div>

        </section>

      </div>
  )

  if (embedMode) {
    return content
  }

  return (
    <ToolLayout toolId="word-counter">
      {/* Inject SEO Schemas */}
      {content}
    </ToolLayout>
  )
}

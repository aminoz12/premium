"use client"

import React, { useState, useId } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { 
  Download, FileText, Trash2, CheckCircle2, 
  Zap, Shield, HelpCircle, Link2, Settings2, FileOutput
} from "lucide-react"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

export default function TextToPDFPage() {
  const [text, setText] = useState("")
  const [pageSize, setPageSize] = useState("A4")
  const [fontSize, setFontSize] = useState([12])
  const [loading, setLoading] = useState(false)
  const id = useId()

  const generatePDF = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

      // Helvetica uses WinAnsi encoding and cannot render characters outside that set
      // (emoji, Arabic, Cyrillic, CJK, etc.). Replace unsupported chars with '?'.
      const encodableCache = new Map<string, boolean>()
      const sanitize = (input: string) => {
        let out = ""
        for (const ch of input) {
          if (ch === "\n" || ch === "\r" || ch === "\t") { out += ch; continue }
          let ok = encodableCache.get(ch)
          if (ok === undefined) {
            try { font.encodeText(ch); ok = true } catch { ok = false }
            encodableCache.set(ch, ok)
          }
          out += ok ? ch : "?"
        }
        return out
      }
      const safeText = sanitize(text)

      const pageSizes: Record<string, { width: number; height: number }> = {
        A4: { width: 595.28, height: 841.89 },
        Letter: { width: 612, height: 792 },
        Legal: { width: 612, height: 1008 },
      }

      const size = pageSizes[pageSize] || pageSizes.A4
      const currentFontSize = fontSize[0]
      const margin = 50
      const lineHeight = currentFontSize * 1.5

      let page = pdfDoc.addPage([size.width, size.height])
      let { width, height } = page.getSize()
      let y = height - margin

      // Split text by newlines to respect manual paragraphs
      const paragraphs = safeText.split('\n')

      for (const paragraph of paragraphs) {
        if (paragraph.trim() === "") {
          y -= lineHeight
          continue
        }

        const words = paragraph.split(' ')
        let currentLine = ''

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          const textWidth = font.widthOfTextAtSize(testLine, currentFontSize)

          if (textWidth > width - 2 * margin) {
            // Draw current line and move down
            page.drawText(currentLine, { x: margin, y, size: currentFontSize, font, color: rgb(0, 0, 0) })
            y -= lineHeight
            currentLine = word

            // Add new page if we hit the bottom margin
            if (y < margin) {
              page = pdfDoc.addPage([size.width, size.height])
              y = height - margin
            }
          } else {
            currentLine = testLine
          }
        }
        
        // Draw any remaining text in the paragraph
        if (currentLine) {
          page.drawText(currentLine, { x: margin, y, size: currentFontSize, font, color: rgb(0, 0, 0) })
          y -= lineHeight
          
          if (y < margin) {
            page = pdfDoc.addPage([size.width, size.height])
            y = height - margin
          }
        }
        
        // Add extra space after paragraphs
        y -= currentFontSize * 0.5 
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `document-${new Date().getTime()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const clearInput = () => {
    setText("")
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length
  const charCount = text.length

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the Text to PDF converter work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The tool uses a client-side JavaScript library to dynamically generate a PDF document from your plain text. It automatically calculates line widths, wraps your words, and adds new pages as needed based on your chosen paper size."
        }
      },
      {
        "@type": "Question",
        "name": "Is my text data sent to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Your privacy is completely protected. The PDF is generated entirely in your web browser's memory using local JavaScript. Your text is never uploaded or saved to any external servers."
        }
      },
      {
        "@type": "Question",
        "name": "What page sizes are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Currently, you can export your PDF in A4 (standard international size), US Letter (standard North American size), and Legal paper dimensions."
        }
      },
      {
        "@type": "Question",
        "name": "Does it support formatting like bold or italics?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This specific utility is designed for plain text conversion. It outputs clean, standard Helvetica text without rich text formatting, making it perfect for logs, raw drafts, and simple notes."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Text to PDF Converter",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "All",
    "description": "Convert plain text documents into professionally formatted PDF files instantly in your browser. Supports automatic word wrapping and multi-page generation."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <FileOutput className="h-4 w-4" aria-hidden="true" /> Document Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free Text to PDF Converter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly turn your plain text, notes, or code logs into a clean, downloadable PDF document. Fully private and processed directly in your browser.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="Text to PDF Configuration" className="grid gap-6 lg:grid-cols-[1fr_350px] items-start">
          
          {/* Editor Panel */}
          <ToolCard title="1. Enter Your Text">
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${id}-text`} className="text-sm font-semibold">
                  Document Content
                </Label>
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

              <Textarea
                id={`${id}-text`}
                placeholder="Type or paste the text you want to convert into a PDF document here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[400px] flex-grow text-base bg-muted/30 resize-y focus-visible:ring-1 leading-relaxed"
                aria-label="Text input area for PDF conversion"
              />

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground font-medium border border-border/50">
                <div className="flex gap-4">
                  <span>{wordCount} {wordCount === 1 ? 'Word' : 'Words'}</span>
                  <span className="w-px h-4 bg-border"></span>
                  <span>{charCount} Characters</span>
                </div>
              </div>
            </div>
          </ToolCard>

          {/* Configuration Panel */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <ToolCard title="2. PDF Settings">
              <div className="space-y-6">
                
                <div className="space-y-3">
                  <Label htmlFor={`${id}-pagesize`} className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Page Size
                  </Label>
                  <Select value={pageSize} onValueChange={setPageSize}>
                    <SelectTrigger id={`${id}-pagesize`} className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                      <SelectItem value="Letter">US Letter (8.5 × 11 in)</SelectItem>
                      <SelectItem value="Legal">Legal (8.5 × 14 in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-2 border-t border-border/50">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`${id}-fontsize`} className="text-sm font-semibold flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                      Font Size
                    </Label>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                      {fontSize[0]}pt
                    </span>
                  </div>
                  <Slider
                    id={`${id}-fontsize`}
                    value={fontSize}
                    onValueChange={setFontSize}
                    min={8}
                    max={36}
                    step={1}
                    className="py-2"
                    aria-label="Adjust font size"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Adjusts the text size. Words will automatically wrap to fit the page margins.
                  </p>
                </div>

              </div>
            </ToolCard>

            <ToolCard title="3. Export Document">
              <Button 
                className="w-full py-6 text-base font-semibold shadow-sm gap-2" 
                onClick={generatePDF}
                disabled={!text.trim() || loading}
                aria-label="Generate and Download PDF"
              >
                <Download className={`h-5 w-5 ${loading ? "animate-bounce" : ""}`} aria-hidden="true" />
                {loading ? "Generating File..." : "Download PDF"}
              </Button>
            </ToolCard>
          </div>

        </section>

      </div>
   </>
  )
}
"use client"

import React, { useState, useTransition, useEffect, useId, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import {
  Upload, Download, FileText, AlertCircle, Trash2,
  CheckCircle2, Zap, Shield, HelpCircle, Link2, Settings2, FileOutput,
  Globe, Lock, Clock, BookOpen, Sparkles, AlertTriangle
} from "lucide-react"
import mammoth from "mammoth"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

// ─── PDF Character Sanitization ───────────────────────────────────────────
// pdf-lib StandardFonts use WinAnsiEncoding which only covers ~250 glyphs.
// Characters outside this set cause drawText() to throw an error.
// This utility sanitizes text by replacing unsupported characters with
// closest ASCII equivalents, preserving as much readability as possible.

// Extended Unicode code points supported by WinAnsiEncoding beyond basic Latin-1
const WIN_ANSI_EXTENDED = new Set([
  0x0152, 0x0153, 0x0160, 0x0161, 0x0178, 0x017D, 0x017E, 0x0192,
  0x02C6, 0x02DC,
  0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E,
  0x2020, 0x2021, 0x2022, 0x2026,
  0x2030, 0x2039, 0x203A,
  0x20AC, 0x2122, 0x2013, 0x2014,
])

// Replacement map for common Word/document characters NOT in WinAnsiEncoding
const PDF_CHAR_REPLACEMENTS: Record<string, string> = {
  // Quote variants (WinAnsi supports 0x2018/9/C/D/E but NOT these)
  '\u201B': "'", '\u201F': '"',
  // Dash variants (WinAnsi supports 0x2013/14 but NOT these)
  '\u2015': '--', '\u2212': '-', '\uFE58': '-', '\uFE63': '-',
  // Arrows
  '\u2190': '<-', '\u2192': '->', '\u2191': '^', '\u2193': 'v', '\u2194': '<->',
  // Math symbols
  '\u2264': '<=', '\u2265': '>=', '\u2260': '!=', '\u2248': '~',
  // Fractions (0xBC/BD/BE ARE in Latin-1; these are NOT)
  '\u2153': '1/3', '\u2154': '2/3',
  '\u215B': '1/8', '\u215C': '3/8', '\u215D': '5/8', '\u215E': '7/8',
  // Shapes/bullets (0x2022 IS supported; these are NOT)
  '\u25CF': '*', '\u25CB': 'o', '\u25AA': '-', '\u25AB': '-',
  '\u25A0': '#', '\u25A1': '#',
  // Tab → spaces
  '\t': '    ',
  // Other common characters
  '\u2027': '.', '\u2219': '.',
  // Zero-width characters → remove entirely
  '\u200B': '', '\u200C': '', '\u200D': '', '\uFEFF': '',
  '\u200E': '', '\u200F': '',
}

function sanitizeForPdfLib(text: string): { sanitized: string; unsupportedCount: number } {
  let unsupportedCount = 0
  const chars = Array.from(text) // Properly handles surrogate pairs
  const result: string[] = []

  for (const char of chars) {
    const code = char.codePointAt(0)!

    // Newlines — normalize and pass through
    if (code === 0x0A || code === 0x0D) {
      result.push('\n')
      continue
    }

    // Printable Basic Latin (0x20-0x7E) — always supported
    if (code >= 0x20 && code <= 0x7E) {
      result.push(char)
      continue
    }

    // Latin-1 Supplement (0xA0-0xFF) — supported by WinAnsiEncoding
    if (code >= 0xA0 && code <= 0xFF) {
      result.push(char)
      continue
    }

    // Extended WinAnsiEncoding Unicode mappings
    if (WIN_ANSI_EXTENDED.has(code)) {
      result.push(char)
      continue
    }

    // Check replacement map for known characters
    if (char in PDF_CHAR_REPLACEMENTS) {
      const replacement = PDF_CHAR_REPLACEMENTS[char]
      if (replacement) result.push(replacement)
      unsupportedCount++
      continue
    }

    // Truly unsupported character (CJK, Arabic, Cyrillic extended, emoji, etc.)
    unsupportedCount++
    result.push(' ')
  }

  return { sanitized: result.join(''), unsupportedCount }
}

// ─── Component ────────────────────────────────────────────────────────────

export default function WordToPDFPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null)
  const [preview, setPreview] = useState("")
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [isPending, startTransition] = useTransition()
  const [inputKey, setInputKey] = useState(0)

  // PDF Settings
  const [pageSize, setPageSize] = useState("A4")
  const [fontSize, setFontSize] = useState([12])

  const id = useId()

  // Computed document stats
  const stats = useMemo(() => {
    if (!preview) return { chars: 0, words: 0, paragraphs: 0 }
    const chars = preview.length
    const words = preview.trim().split(/\s+/).filter(Boolean).length
    const paragraphs = preview.split(/\n\s*\n/).filter(p => p.trim()).length
    return { chars, words, paragraphs }
  }, [preview])

  // Extract text when fileData changes
  useEffect(() => {
    if (!fileData) return

    startTransition(async () => {
      try {
        const result = await mammoth.extractRawText({ arrayBuffer: fileData })
        // Normalize line endings across platforms
        const normalized = result.value.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        setPreview(normalized)
        setError("")
        setSuccessMsg("")
      } catch (err) {
        console.error("Mammoth parsing error:", err)
        setError("Failed to read the Word document. Please ensure it is a valid .docx file.")
      }
    })
  }, [fileData])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    if (!uploadedFile.name.endsWith('.docx')) {
      setError("Please upload a valid Microsoft Word (.docx) file. Older .doc format is not supported in-browser.")
      setFile(null)
      setFileData(null)
      setPreview("")
      return
    }

    if (uploadedFile.size > 20 * 1024 * 1024) {
      setError("File is too large. Please upload a file smaller than 20MB.")
      return
    }

    setFile(uploadedFile)
    setError("")
    setSuccessMsg("")

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result instanceof ArrayBuffer) {
        setFileData(event.target.result)
      }
    }
    reader.readAsArrayBuffer(uploadedFile)
  }

  const clearFile = () => {
    setFile(null)
    setFileData(null)
    setPreview("")
    setError("")
    setSuccessMsg("")
    setInputKey(prev => prev + 1)
  }

  const convertToPDF = async () => {
    if (!preview.trim()) {
      setError("The document appears to be empty or unreadable.")
      return
    }

    startTransition(async () => {
      try {
        // ── Sanitize text for WinAnsiEncoding compatibility ──
        const { sanitized, unsupportedCount } = sanitizeForPdfLib(preview)

        if (!sanitized.trim()) {
          setError(
            "The document contains no renderable text after character sanitization. " +
            "It may only contain unsupported scripts (e.g., Chinese, Japanese, Korean, Arabic, Hindi). " +
            "Latin and Western European scripts are fully supported."
          )
          return
        }

        const pdfDoc = await PDFDocument.create()
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

        // Final safety net: ask pdf-lib itself which chars it can encode.
        // The named sanitizer above handles known cases nicely; this catches
        // anything unforeseen so drawText() can never throw.
        const encodableCache = new Map<string, boolean>()
        const safeForFont = (input: string) => {
          let out = ""
          for (const ch of input) {
            if (ch === "\n") { out += ch; continue }
            let ok = encodableCache.get(ch)
            if (ok === undefined) {
              try { font.encodeText(ch); ok = true } catch { ok = false }
              encodableCache.set(ch, ok)
            }
            out += ok ? ch : " "
          }
          return out
        }
        const safeText = safeForFont(sanitized)

        const pageSizes: Record<string, { width: number; height: number }> = {
          A4: { width: 595.28, height: 841.89 },
          Letter: { width: 612, height: 792 },
          Legal: { width: 612, height: 1008 },
        }

        const size = pageSizes[pageSize] || pageSizes.A4
        const currentFontSize = fontSize[0]
        const margin = 50
        const lineHeight = currentFontSize * 1.5
        const maxLineWidth = size.width - 2 * margin

        let page = pdfDoc.addPage([size.width, size.height])
        let y = size.height - margin

        const paragraphs = safeText.split('\n')

        for (const paragraph of paragraphs) {
          if (paragraph.trim() === "") {
            y -= lineHeight
            if (y < margin) {
              page = pdfDoc.addPage([size.width, size.height])
              y = size.height - margin
            }
            continue
          }

          const words = paragraph.split(' ').filter(Boolean)
          let currentLine = ''

          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word
            const textWidth = font.widthOfTextAtSize(testLine, currentFontSize)

            if (textWidth > maxLineWidth && currentLine) {
              // Line is full — draw it and move the overflow word to the next line
              page.drawText(currentLine, {
                x: margin, y, size: currentFontSize, font,
                color: rgb(0, 0, 0),
              })
              y -= lineHeight
              currentLine = word

              if (y < margin) {
                page = pdfDoc.addPage([size.width, size.height])
                y = size.height - margin
              }
            } else if (textWidth > maxLineWidth && !currentLine) {
              // Single word is wider than the page — force render it to prevent infinite loop
              page.drawText(word, {
                x: margin, y, size: currentFontSize, font,
                color: rgb(0, 0, 0),
              })
              y -= lineHeight
              currentLine = ''

              if (y < margin) {
                page = pdfDoc.addPage([size.width, size.height])
                y = size.height - margin
              }
            } else {
              currentLine = testLine
            }
          }

          // Draw any remaining text in the paragraph
          if (currentLine) {
            page.drawText(currentLine, {
              x: margin, y, size: currentFontSize, font,
              color: rgb(0, 0, 0),
            })
            y -= lineHeight

            if (y < margin) {
              page = pdfDoc.addPage([size.width, size.height])
              y = size.height - margin
            }
          }

          // Extra space after paragraphs
          y -= currentFontSize * 0.5
          if (y < margin) {
            page = pdfDoc.addPage([size.width, size.height])
            y = size.height - margin
          }
        }

        // Set PDF metadata for better document identification
        pdfDoc.setTitle(file?.name.replace('.docx', '') || 'Converted Document')
        pdfDoc.setCreator('Free Word to PDF Converter')
        pdfDoc.setProducer('Client-Side PDF Generation')

        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)

        const originalName = file?.name.replace('.docx', '') || 'document'
        const link = document.createElement("a")
        link.href = url
        link.download = `${originalName}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setTimeout(() => URL.revokeObjectURL(url), 1000)

        setError("")
        if (unsupportedCount > 0) {
          setSuccessMsg(
            `PDF downloaded successfully! Note: ${unsupportedCount} unsupported character` +
            `${unsupportedCount === 1 ? ' was' : 's were'} replaced with closest ASCII equivalents.`
          )
        } else {
          setSuccessMsg("PDF downloaded successfully!")
        }
      } catch (err) {
        console.error("PDF generation error:", err)
        setError(
          "Failed to generate PDF. The document may contain structures or characters " +
          "incompatible with the renderer. Try a simpler document or check the preview for issues."
        )
      }
    })
  }

  // ─── SEO Structured Data ──────────────────────────────────────────────

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the free Word to PDF converter work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our Word to PDF converter uses a local JavaScript parser to extract raw text from your .docx file, then constructs a clean, paginated PDF document using a robust client-side generation engine. No files are uploaded to any server — everything runs in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "Are my Word documents uploaded to a server when converting to PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Your documents and privacy are 100% protected. Both the reading of the Word document and the generation of the PDF happen entirely locally within your web browser's memory. No data ever leaves your device."
        }
      },
      {
        "@type": "Question",
        "name": "Will the Word to PDF converter preserve images and complex formatting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This utility extracts and converts the raw text of your document into a clean PDF. It preserves paragraphs and text flow with auto-pagination, but strips out complex layouts, images, and custom fonts to ensure a lightweight, universally readable PDF output."
        }
      },
      {
        "@type": "Question",
        "name": "What page sizes are supported for the PDF export?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can configure the generated PDF to use standard A4 (international), US Letter, or Legal paper dimensions before downloading."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert Word to PDF without internet or uploading my file?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Once the page has loaded, the entire conversion process runs client-side in your browser. No internet connection is required for the actual conversion, and your file is never uploaded to any server."
        }
      },
      {
        "@type": "Question",
        "name": "What languages and character sets does the Word to PDF converter support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The converter fully supports Latin and Western European scripts (English, French, German, Spanish, Portuguese, Italian, Dutch, Scandinavian languages, and more). Characters from non-Latin scripts (Chinese, Japanese, Korean, Arabic, Hindi, etc.) are replaced with space placeholders to prevent errors."
        }
      },
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Word to PDF Converter Online",
    "alternateName": "DOCX to PDF Converter",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "description": "Convert Microsoft Word (.docx) documents into clean PDF files securely in your browser. Free, private, no upload required. Extracts text and formats it perfectly with auto-pagination.",
    "browserRequirements": "Requires JavaScript. Requires HTML5."
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Convert Word to PDF Online Free",
    "description": "Convert your Microsoft Word documents to PDF format securely in your browser with this free online tool. No upload, no registration, no watermark.",
    "totalTime": "PT30S",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Upload Word Document",
        "text": "Click the upload area or drag and drop your .docx file. Files up to 20MB are supported."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Preview Extracted Text",
        "text": "Review the automatically extracted text in the preview panel to verify the document was read correctly."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Configure PDF Settings",
        "text": "Select your preferred page size (A4, US Letter, or Legal) and adjust the font size slider."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Download Your PDF",
        "text": "Click the Convert to PDF button. Your PDF is generated instantly in your browser and downloaded to your device."
      }
    ]
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "/" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "/tools" },
      { "@type": "ListItem", "position": 3, "name": "Word to PDF Converter", "item": "/tools/word-to-pdf" }
    ]
  }

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <>
      {/* Inject SEO Structured Data */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">

        {/* ── Header Section ── */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <FileOutput className="h-4 w-4" aria-hidden="true" /> Document Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free Word to PDF Converter Online
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Convert Microsoft Word (.docx) documents to PDF instantly — no upload, no registration,
            no watermark. 100% private and secure in your browser.
          </p>
        </header>

        {/* ── Interactive Tool Section ── */}
        <section aria-label="Word to PDF Converter" className="grid gap-6 lg:grid-cols-[1fr_350px] items-start">

          {/* Upload & Preview Panel */}
          <div className="space-y-6">
            <ToolCard title="1. Upload Document">
              <div className="space-y-4">

                {!file ? (
                  <div className="border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors relative cursor-pointer group">
                    <input
                      key={inputKey}
                      type="file"
                      accept=".docx"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label="Upload Word document"
                    />
                    <Upload className="h-10 w-10 text-muted-foreground mb-4 group-hover:text-primary transition-colors" aria-hidden="true" />
                    <h3 className="font-semibold text-lg mb-1">Upload .docx File</h3>
                    <p className="text-sm text-muted-foreground">
                      Click or drag and drop a Microsoft Word document here
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      Supports .docx files up to 20MB &middot; No upload to server
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-6 w-6 text-primary shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="font-medium truncate text-foreground text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={clearFile} className="shrink-0 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                )}

                {/* Alerts */}
                <div aria-live="polite" aria-atomic="true" className="space-y-3">
                  {error && (
                    <Alert variant="destructive" className="animate-in fade-in duration-300 shadow-sm border-destructive/50">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      <AlertDescription className="font-medium text-xs">{error}</AlertDescription>
                    </Alert>
                  )}
                  {successMsg && (
                    <Alert className="animate-in fade-in duration-300 shadow-sm border-green-500/50 bg-green-50 dark:bg-green-950/20">
                      <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                      <AlertDescription className="font-medium text-xs text-green-700 dark:text-green-400">
                        {successMsg}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

              </div>
            </ToolCard>

            <ToolCard title="Extracted Text Preview">
              <div className="relative flex flex-col h-full min-h-[300px]">
                {preview ? (
                  <>
                    {/* Stats bar */}
                    <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                      <span>{stats.chars.toLocaleString()} characters</span>
                      <span className="text-border">|</span>
                      <span>{stats.words.toLocaleString()} words</span>
                      <span className="text-border">|</span>
                      <span>{stats.paragraphs} paragraphs</span>
                    </div>
                    <div className="p-4 bg-[#1e1e2e] text-[#a6accd] rounded-lg max-h-[400px] overflow-auto shadow-inner">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                        {preview.slice(0, 2000)}
                        {preview.length > 2000 && (
                          <span className="text-muted-foreground/60 italic block mt-4">
                            [... Preview truncated. Full text will be included in the PDF.]
                          </span>
                        )}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground/40 border border-dashed rounded-lg bg-muted/10 pointer-events-none p-10 text-center">
                    <FileText className="h-10 w-10 mb-3 opacity-30" aria-hidden="true" />
                    <p className="text-sm font-medium">Your document text preview will appear here.</p>
                    <p className="text-xs mt-1 opacity-60">Supports Latin &amp; Western European scripts</p>
                  </div>
                )}
              </div>
            </ToolCard>
          </div>

          {/* Configuration Panel */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <ToolCard title="2. PDF Settings">
              <div className="space-y-6">

                <div className="space-y-3">
                  <Label htmlFor={`${id}-pagesize`} className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Page Size
                  </Label>
                  <Select value={pageSize} onValueChange={setPageSize} disabled={!preview}>
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
                    max={24}
                    step={1}
                    className="py-2"
                    disabled={!preview}
                    aria-label="Adjust font size"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Adjusts the text size. Words automatically wrap to fit the page margins.
                  </p>
                </div>

                {/* Character support notice */}
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                      <strong>Latin &amp; Western European</strong> scripts are fully supported.
                      CJK, Arabic, Cyrillic extended, and other non-Latin characters will be
                      replaced with spaces to prevent errors.
                    </p>
                  </div>
                </div>

              </div>
            </ToolCard>

            <ToolCard title="3. Export Document">
              <Button
                className="w-full py-6 text-base font-semibold shadow-sm gap-2"
                onClick={convertToPDF}
                disabled={!preview || isPending}
                aria-label="Convert and Download PDF"
              >
                <Download className={`h-5 w-5 ${isPending ? "animate-bounce" : ""}`} aria-hidden="true" />
                {isPending ? "Processing File..." : "Convert to PDF"}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                <Lock className="h-3 w-3 inline-block mr-1" aria-hidden="true" />
                Your file never leaves your device
              </p>
            </ToolCard>
          </div>

        </section>

      </div>
    </>
  )
}
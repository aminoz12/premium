"use client"

import React, { useState, useId, useCallback } from "react"
import { Document, Packer, Paragraph, TextRun } from "docx"
import {
  AlertCircle, Download, FileText,
  CheckCircle2, Zap, Shield, HelpCircle,
  Link2, FileOutput, FileUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"

export default function PDFToWordPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const id = useId()

  const processFile = useCallback((uploadedFile: File) => {
    if (uploadedFile.type !== "application/pdf" || uploadedFile.size > 20 * 1024 * 1024) {
      setError("Please upload a valid PDF under 20 MB.")
      return
    }

    setFile(uploadedFile)
    setError("")
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      processFile(uploadedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  const extractTextFromPDF = async (buffer: ArrayBuffer) => {
    const pdfjsLib = await import("pdfjs-dist")
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

    const pdf = await pdfjsLib.getDocument({
      data: buffer,
      cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
    }).promise

    let fullText = ""
    let totalItems = 0
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      totalItems += content.items.length
      const pageText = content.items
        .map((item: unknown) => {
          if (!item || typeof item !== "object" || !("str" in item)) return ""
          const it = item as { str?: string; hasEOL?: boolean }
          const s = it.str ?? ""
          return it.hasEOL ? s + "\n" : s + " "
        })
        .join("")
        .replace(/[ \t]+\n/g, "\n")
        .trim()

      if (pageText) fullText += pageText + "\n\n"
    }

    const text = fullText.trim()
    if (!text) {
      console.warn(`[pdf-to-word] pdfjs parsed ${pdf.numPages} page(s), found ${totalItems} text item(s), but no readable text. Likely scanned/image-only.`)
      throw new Error("This PDF appears to contain no directly extractable text. It may be a scanned/image-only document, which requires OCR.")
    }

    return text
  }

  const convert = async () => {
    if (!file) {
      setError("Please upload a PDF first.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const buffer = await file.arrayBuffer()
      const text = await extractTextFromPDF(buffer)
      const doc = new Document({
        sections: [
          {
            children: text.split(/\n+/).map(
              (line) =>
                new Paragraph({
                  children: [new TextRun({ text: line, size: 24 })],
                })
            ),
          },
        ],
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = file.name.replace(/\.pdf$/i, ".docx")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      console.error("[pdf-to-word] conversion failed:", err)
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg || "Conversion failed for this PDF.")
    } finally {
      setLoading(false)
    }
  }

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does this PDF to Word converter work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This tool extracts embedded text commands directly from your PDF file using client-side processing, and seamlessly writes that raw text into a new standard Microsoft Word (.docx) document."
        }
      },
      {
        "@type": "Question",
        "name": "Are my files uploaded to your server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Your privacy is fully protected. All file processing, reading, and converting happens entirely within your local web browser. Your PDF is never uploaded to any external server."
        }
      },
      {
        "@type": "Question",
        "name": "Why did my conversion fail with 'no extractable text'?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This usually happens when your PDF is a scanned image rather than a text-based document. Our tool extracts embedded text strings but does not perform Optical Character Recognition (OCR) on flat images."
        }
      },
      {
        "@type": "Question",
        "name": "What is the maximum file size?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The tool supports parsing PDF files up to 20 MB in size to ensure your browser remains responsive and fast during the text extraction process."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free PDF to Word Converter",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "description": "Convert text-based PDF documents into editable Word (.docx) files instantly and securely directly in your browser."
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
            Free PDF to Word Converter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly extract text from your PDF files and convert them into editable Word (.docx) documents. Fast, secure, and fully browser-based.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="PDF to Word Converter Tool" className="grid gap-6 lg:grid-cols-2">
          
          {/* Upload Panel */}
          <ToolCard title="1. Upload PDF Document">
            <div className="space-y-4 flex flex-col h-full">
              <Label 
                htmlFor={`${id}-pdf-file`} 
                className={`block cursor-pointer flex-grow transition-all duration-200 ease-in-out ${
                  isDragging ? "scale-[0.98] opacity-90" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 h-full transition-colors ${
                  isDragging 
                    ? "border-primary bg-primary/10" 
                    : "border-muted-foreground/25 hover:border-primary hover:bg-muted/50"
                }`}>
                  <div className={`p-4 rounded-full ${isDragging ? "bg-primary/20" : "bg-muted"}`}>
                    <FileUp className={`h-10 w-10 ${isDragging ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-lg text-foreground">
                      {isDragging ? "Drop your PDF here" : "Click or drag to upload"}
                    </p>
                    <p className="text-sm text-muted-foreground">Text-based PDFs work best (Max 20MB).</p>
                  </div>
                </div>
              </Label>
              <input 
                id={`${id}-pdf-file`} 
                type="file" 
                accept=".pdf,application/pdf" 
                className="hidden" 
                onChange={handleFileUpload} 
                aria-label="Upload PDF file"
              />

              {file ? (
                <div className="flex items-center gap-4 rounded-lg bg-primary/5 border border-primary/20 p-4 animate-in fade-in duration-300">
                  <div className="bg-background p-2 rounded border shadow-sm">
                    <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-sm text-foreground" title={file.name}>{file.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                      <p className="text-xs text-muted-foreground">PDF Document</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" aria-hidden="true" />
                </div>
              ) : null}
            </div>
          </ToolCard>

          {/* Conversion Panel */}
          <ToolCard title="2. Convert & Download">
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="rounded-xl bg-muted/40 p-5 border border-border/50 text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground block mb-1">How it works:</strong>
                  The converter reads the binary data of your PDF locally, extracts visible text commands, and repackages them into a clean, editable <code>.docx</code> format. Scanned images requiring OCR are currently not supported.
                </div>

                <div aria-live="polite" aria-atomic="true">
                  {error && (
                    <Alert variant="destructive" className="animate-in fade-in duration-300 shadow-sm border-destructive/50">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      <AlertDescription className="font-medium">{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full py-6 text-base font-semibold shadow-sm gap-2 transition-all" 
                  onClick={convert} 
                  disabled={!file || loading}
                  aria-label="Convert uploaded PDF to Word Document"
                >
                  <Download className={`h-5 w-5 ${loading ? "animate-bounce" : ""}`} aria-hidden="true" />
                  {loading ? "Converting Document..." : "Convert to Word"}
                </Button>
              </div>
            </div>
          </ToolCard>
        </section>

      </div>
    </>
  )
}
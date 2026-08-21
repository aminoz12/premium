"use client"

import React, { useState, useId } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import { 
  Copy, Download, Tags, Check, CheckCircle2, 
  Zap, Shield, HelpCircle, Link2, Code2, Globe 
} from "lucide-react"

export default function MetaTagsPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [keywords, setKeywords] = useState("")
  const [author, setAuthor] = useState("")
  const [ogTitle, setOgTitle] = useState("")
  const [ogDescription, setOgDescription] = useState("")
  const [ogImage, setOgImage] = useState("")
  const [ogUrl, setOgUrl] = useState("")
  const [twitterCard, setTwitterCard] = useState("summary_large_image")
  const [copied, setCopied] = useState(false)
  
  const { copy } = useClipboard()
  const id = useId()

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  }

  const generateMetaTags = () => {
    const tags: string[] = []

    tags.push(``)
    if (title) {
      tags.push(`<title>${escapeHtml(title)}</title>`)
      tags.push(`<meta name="title" content="${escapeHtml(title)}">`)
    }
    if (description) {
      tags.push(`<meta name="description" content="${escapeHtml(description)}">`)
    }
    if (keywords) {
      tags.push(`<meta name="keywords" content="${escapeHtml(keywords)}">`)
    }
    if (author) {
      tags.push(`<meta name="author" content="${escapeHtml(author)}">`)
    }

    tags.push(`\n`)
    tags.push(`<meta property="og:type" content="website">`)
    if (ogUrl) {
      tags.push(`<meta property="og:url" content="${escapeHtml(ogUrl)}">`)
    }
    if (ogTitle || title) {
      tags.push(`<meta property="og:title" content="${escapeHtml(ogTitle || title)}">`)
    }
    if (ogDescription || description) {
      tags.push(`<meta property="og:description" content="${escapeHtml(ogDescription || description)}">`)
    }
    if (ogImage) {
      tags.push(`<meta property="og:image" content="${escapeHtml(ogImage)}">`)
    }

    tags.push(`\n`)
    tags.push(`<meta property="twitter:card" content="${twitterCard}">`)
    if (ogUrl) {
      tags.push(`<meta property="twitter:url" content="${escapeHtml(ogUrl)}">`)
    }
    if (ogTitle || title) {
      tags.push(`<meta property="twitter:title" content="${escapeHtml(ogTitle || title)}">`)
    }
    if (ogDescription || description) {
      tags.push(`<meta property="twitter:description" content="${escapeHtml(ogDescription || description)}">`)
    }
    if (ogImage) {
      tags.push(`<meta property="twitter:image" content="${escapeHtml(ogImage)}">`)
    }

    return tags.join("\n")
  }

  const generatedCode = generateMetaTags()

  const handleCopy = async () => {
    if (!generatedCode) return
    await copy(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    if (!generatedCode) return
    const blob = new Blob([generatedCode], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "meta-tags.html"
    link.click()
    URL.revokeObjectURL(url)
  }

  // JSON-LD Schema for rich search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are Meta Tags?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Meta tags are snippets of HTML code that describe a page's content. They do not appear on the webpage itself, but rather in the page's source code. They tell search engines and social media platforms what a page is about."
        }
      },
      {
        "@type": "Question",
        "name": "What are Open Graph tags?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Open Graph (OG) tags are specific meta tags that dictate how URLs are displayed when shared on social media platforms like Facebook, LinkedIn, and Discord. They ensure your links look professional with rich images, titles, and descriptions."
        }
      },
      {
        "@type": "Question",
        "name": "Do meta keywords still matter for SEO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Major search engines like Google largely ignore the meta keywords tag for ranking purposes. However, it is still used by some smaller search engines, internal site search engines, and certain web directories."
        }
      },
      {
        "@type": "Question",
        "name": "How long should a meta description be?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An ideal meta description should be between 150 and 160 characters. If it is longer, search engines may truncate it with an ellipsis (...) in the search results."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Meta Tags Generator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Create optimized HTML meta tags and Open Graph tags for your website to improve SEO and social media link previews."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <Tags className="h-4 w-4" aria-hidden="true" /> SEO Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free Meta Tags Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly create perfectly formatted HTML meta tags, Open Graph data, and Twitter cards to boost your website's SEO and social sharing previews.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="Meta Tags Generator Configuration" className="grid gap-6 lg:grid-cols-2 items-start">
          
          <div className="space-y-6">
            {/* Basic Info Panel */}
            <ToolCard title="1. Basic Information">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-title`} className="font-semibold">Page Title</Label>
                  <Input
                    id={`${id}-title`}
                    placeholder="Your page title (Keep between 50-60 characters)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="Meta Title Input"
                  />
                  <p className={`text-xs font-medium ${title.length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {title.length}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-description`} className="font-semibold">Meta Description</Label>
                  <Textarea
                    id={`${id}-description`}
                    placeholder="Describe your page concisely (150-160 characters)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="resize-y"
                    aria-label="Meta Description Input"
                  />
                  <p className={`text-xs font-medium ${description.length > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {description.length}/160 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-keywords`} className="font-semibold">Keywords</Label>
                  <Input
                    id={`${id}-keywords`}
                    placeholder="keyword1, keyword2, keyword3"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    aria-label="Meta Keywords Input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-author`} className="font-semibold">Author</Label>
                  <Input
                    id={`${id}-author`}
                    placeholder="Author name or Company"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    aria-label="Author Meta Input"
                  />
                </div>
              </div>
            </ToolCard>

            {/* Social Graph Panel */}
            <ToolCard title="2. Open Graph & Social Media">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-og-url`} className="font-semibold">Canonical Page URL</Label>
                  <Input
                    id={`${id}-og-url`}
                    placeholder="https://example.com/page"
                    value={ogUrl}
                    onChange={(e) => setOgUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-og-title`} className="font-semibold">OG Title <span className="text-muted-foreground font-normal">(Defaults to Page Title)</span></Label>
                  <Input
                    id={`${id}-og-title`}
                    placeholder="Social media link title"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-og-desc`} className="font-semibold">OG Description <span className="text-muted-foreground font-normal">(Defaults to Meta Desc)</span></Label>
                  <Textarea
                    id={`${id}-og-desc`}
                    placeholder="Social media link description"
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    className="resize-y"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-og-image`} className="font-semibold">OG Image URL</Label>
                  <Input
                    id={`${id}-og-image`}
                    placeholder="https://example.com/assets/og-image.png"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-twitter-card`} className="font-semibold">Twitter Card Type</Label>
                  <Select value={twitterCard} onValueChange={setTwitterCard}>
                    <SelectTrigger id={`${id}-twitter-card`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary (Small Image)</SelectItem>
                      <SelectItem value="summary_large_image">Summary (Large Image)</SelectItem>
                      <SelectItem value="app">App Card</SelectItem>
                      <SelectItem value="player">Player Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </ToolCard>
          </div>

          {/* Output Panel */}
          <div className="lg:sticky lg:top-6">
            <ToolCard title="3. Generated Meta Code">
              <div className="space-y-4 flex flex-col h-full">
                <div className="relative">
                  <Label htmlFor={`${id}-output`} className="sr-only">Generated HTML Output</Label>
                  <Textarea
                    id={`${id}-output`}
                    value={generatedCode}
                    readOnly
                    placeholder="Your generated HTML tags will appear here..."
                    className="min-h-[500px] font-mono text-sm bg-muted/20 border-dashed focus-visible:ring-1 resize-y whitespace-pre"
                    spellCheck={false}
                  />
                </div>

                <div className="block gap-3">
                  <Button 
                    onClick={handleCopy} 
                    disabled={!generatedCode.trim()}
                    className="w-full gap-2 font-medium"
                    aria-label="Copy generated HTML tags"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        Copy Code
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={download} 
                    disabled={!generatedCode.trim()}
                    className="w-full gap-2 font-medium bg-background"
                    aria-label="Download HTML file"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download .html
                  </Button>
                </div>

                {!title && !description && (
                  <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center animate-in fade-in">
                    <Code2 className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    Fill in the basic information fields on the left to start generating your code.
                  </div>
                )}
              </div>
            </ToolCard>
          </div>
        </section>

      </div>
   </>
  )
}
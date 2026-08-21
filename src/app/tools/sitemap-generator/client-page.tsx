"use client"

import React, { useState, useId, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import { useClipboard } from "@/hooks/use-clipboard"
import { 
  Copy, Download, FolderTree, Plus, Trash2, Check, 
  CheckCircle2, Zap, Shield, HelpCircle, Link2, 
  Globe, Calendar, Activity, AlignLeft
} from "lucide-react"

interface SitemapUrl {
  id: string
  loc: string
  lastmod: string
  changefreq: string
  priority: string
}

const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export default function SitemapGeneratorPage({ initialLastmod }: { initialLastmod: string }) {
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { id: generateId(), loc: "https://example.com/", lastmod: initialLastmod, changefreq: "daily", priority: "1.0" },
    { id: generateId(), loc: "https://example.com/about", lastmod: initialLastmod, changefreq: "monthly", priority: "0.8" }
  ])
  
  const [copied, setCopied] = useState(false)
  const { copy } = useClipboard()
  const id = useId()

  const addUrl = () => {
    setUrls([
      ...urls,
      { id: generateId(), loc: "", lastmod: initialLastmod, changefreq: "weekly", priority: "0.5" },
    ])
  }

  const removeUrl = (idToRemove: string) => {
    setUrls(urls.filter((url) => url.id !== idToRemove))
  }

  const updateUrl = (idToUpdate: string, field: keyof Omit<SitemapUrl, "id">, value: string) => {
    setUrls(urls.map((url) => (url.id === idToUpdate ? { ...url, [field]: value } : url)))
  }

  const generatedSitemap = useMemo(() => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    
    let hasValidUrls = false

    urls.forEach((url) => {
      const finalLoc = url.loc.trim()
      if (!finalLoc) return

      hasValidUrls = true
      xml += `  <url>\n`
      xml += `    <loc>${escapeXml(finalLoc)}</loc>\n`
      if (url.lastmod) xml += `    <lastmod>${escapeXml(url.lastmod)}</lastmod>\n`
      if (url.changefreq !== "none") xml += `    <changefreq>${escapeXml(url.changefreq)}</changefreq>\n`
      if (url.priority !== "none") xml += `    <priority>${escapeXml(url.priority)}</priority>\n`
      xml += `  </url>\n`
    })

    xml += `</urlset>`
    
    return hasValidUrls ? xml : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  \n</urlset>`
  }, [urls])

  const handleCopy = async () => {
    if (!generatedSitemap) return
    await copy(generatedSitemap)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([generatedSitemap], { type: "application/xml" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "sitemap.xml"
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
        "name": "What is an XML Sitemap?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An XML sitemap is a file that lists a website's essential pages, making sure search engines like Google and Bing can easily find and crawl them. It acts as a roadmap for your website."
        }
      },
      {
        "@type": "Question",
        "name": "Why do I need a sitemap.xml?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While internal linking helps search engines find pages, a sitemap guarantees that search bots know exactly where all your important content is located, how often it changes, and its relative priority."
        }
      },
      {
        "@type": "Question",
        "name": "What do the changefreq and priority tags do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "'Changefreq' tells search engines how often a page's content is likely to change. 'Priority' indicates the importance of a specific URL relative to other pages on your site (ranging from 0.0 to 1.0). Note that Google uses these as hints, not absolute directives."
        }
      },
      {
        "@type": "Question",
        "name": "Where should I put my sitemap.xml file?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You should place your sitemap.xml in the root directory of your website (e.g., https://www.yourdomain.com/sitemap.xml). You should also link to it from your robots.txt file and submit it directly to Google Search Console."
        }
      }
    ]
  }

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free XML Sitemap Generator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Instantly generate valid XML sitemaps for your website to improve search engine indexing and technical SEO. 100% free and secure."
  }

  return (
    <>
      {/* Inject SEO Schemas */}

      <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
            <FolderTree className="h-4 w-4" aria-hidden="true" /> SEO Utility
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            Free XML Sitemap Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Instantly build properly formatted XML sitemaps to help search engines discover and index your website's pages faster.
          </p>
        </header>

        {/* Interactive Tool Section */}
        <section aria-label="Sitemap Generator Configuration" className="grid gap-6 lg:grid-cols-2 items-start">
          
          {/* Configuration Panel */}
          <div className="space-y-6">
            <ToolCard title="1. Define URLs">
              <div className="space-y-6">
                
                {urls.map((url, index) => (
                  <div key={url.id} className="p-4 bg-muted/30 border border-border/50 rounded-xl space-y-4 relative group animate-in fade-in slide-in-from-top-2 duration-300">
                    
                    {urls.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUrl(url.id)}
                        className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label={`Remove URL ${index + 1}`}
                        title="Remove URL"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    )}

                    <div className="space-y-2 pr-8">
                      <Label htmlFor={`${id}-loc-${url.id}`} className="font-semibold flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" /> Full Page URL
                      </Label>
                      <Input
                        id={`${id}-loc-${url.id}`}
                        type="url"
                        placeholder="https://example.com/page-path"
                        value={url.loc}
                        onChange={(e) => updateUrl(url.id, "loc", e.target.value)}
                        className="bg-background"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${id}-lastmod-${url.id}`} className="text-xs font-semibold flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Last Modified
                        </Label>
                        <Input
                          id={`${id}-lastmod-${url.id}`}
                          type="date"
                          value={url.lastmod}
                          onChange={(e) => updateUrl(url.id, "lastmod", e.target.value)}
                          className="bg-background h-9 text-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`${id}-freq-${url.id}`} className="text-xs font-semibold flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-muted-foreground" /> Change Freq.
                        </Label>
                        <Select
                          value={url.changefreq}
                          onValueChange={(value) => updateUrl(url.id, "changefreq", value)}
                        >
                          <SelectTrigger id={`${id}-freq-${url.id}`} className="bg-background h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Omit Tag</SelectItem>
                            <SelectItem value="always">Always</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${id}-pri-${url.id}`} className="text-xs font-semibold flex items-center gap-1.5">
                          <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" /> Priority (0.0 - 1.0)
                        </Label>
                        <Input
                          id={`${id}-pri-${url.id}`}
                          type="number"
                          step="0.1"
                          min="0"
                          max="1"
                          value={url.priority}
                          onChange={(e) => updateUrl(url.id, "priority", e.target.value)}
                          className="bg-background h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button 
                  variant="secondary" 
                  onClick={addUrl} 
                  className="w-full gap-2 border border-dashed py-6"
                  aria-label="Add new URL entry"
                >
                  <Plus className="h-5 w-5" aria-hidden="true" /> Add New Page URL
                </Button>
              </div>
            </ToolCard>
          </div>

          {/* Output Panel */}
          <div className="lg:sticky lg:top-6">
            <ToolCard title="2. Generated XML File">
              <div className="space-y-4 flex flex-col h-full">
                <div className="relative">
                  <Label htmlFor={`${id}-output`} className="sr-only">Generated XML Output</Label>
                  <Textarea
                    id={`${id}-output`}
                    value={generatedSitemap}
                    readOnly
                    placeholder="Your generated sitemap.xml content will appear here..."
                    className="min-h-[500px] font-mono text-sm bg-[#1e1e2e] text-[#a6accd] border-dashed focus-visible:ring-1 resize-y whitespace-pre p-5"
                    spellCheck={false}
                  />
                </div>

                <div className="block py-2 gap-3 pt-2">
                  <Button 
                    onClick={handleCopy} 
                    className="w-full my-2  gap-2 font-medium"
                    aria-label="Copy generated XML to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        Copy XML
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={download} 
                    className="w-full gap-2 font-medium bg-background"
                    aria-label="Download sitemap.xml file"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download .xml
                  </Button>
                </div>
              </div>
            </ToolCard>
          </div>
        </section>

      </div>
    </>
  )
}
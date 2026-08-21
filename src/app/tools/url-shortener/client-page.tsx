"use client"

import { useState, useEffect } from "react"
import { 
  Link as LinkIcon, Copy, Check, QrCode, Trash2, 
  AlertCircle, ArrowRight, Loader2, Share2, Download, 
  Sparkles, Clock, Palette
} from "lucide-react"

export default function URLShortenerClient() {
  const [url, setUrl] = useState("")
  const [short, setShort] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<{ original: string; short: string }[]>([])
  
  // QR Code States
  const [showQR, setShowQR] = useState(false)
  const [qrColor, setQrColor] = useState("#000000")
  const [qrBgColor, setQrBgColor] = useState("#ffffff")
  const [isDownloading, setIsDownloading] = useState(false)
  
  const [canShare, setCanShare] = useState(false)

  // Load history from local storage and check Web Share API support
  useEffect(() => {
    try {
      const saved = localStorage.getItem("url_history")
      if (saved) setHistory(JSON.parse(saved))
    } catch (e) {
      console.error("Could not load history")
    }
    if (typeof navigator !== "undefined" && 'share' in navigator) {
      setCanShare(true)
    }
  }, [])

  const isValidUrl = (urlString: string) => {
    try {
      return Boolean(new URL(urlString))
    } catch (e) {
      return false
    }
  }

  async function handleShorten(e?: React.FormEvent) {
    if (e) e.preventDefault()
    
    let targetUrl = url.trim()
    if (!targetUrl) return

    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl
    }

    if (!isValidUrl(targetUrl)) {
      setError("Please enter a valid URL (e.g., google.com or https://example.com)")
      return
    }

    setError("")
    setLoading(true)
    setShort("")
    setShowQR(false)
    setQrColor("#000000")
    setQrBgColor("#ffffff")

    try {
      const res = await fetch(`/api/shorten?url=${encodeURIComponent(targetUrl)}`)
      if (!res.ok) throw new Error("Service unavailable")

      const result = await res.text()
      setShort(result)
      
      const newHistory = [{ original: targetUrl, short: result }, ...history.filter(h => h.short !== result)].slice(0, 10)
      setHistory(newHistory)
      localStorage.setItem("url_history", JSON.stringify(newHistory))
    } catch {
      setError("Could not shorten URL. The servers might be busy, please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy(text: string, isMain = false) {
    await navigator.clipboard.writeText(text)
    if (isMain) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shortened Link',
          text: 'Check out this link:',
          url: short,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    }
  }

  function clearHistory() {
    if(confirm("Are you sure you want to clear your link history?")) {
      setHistory([])
      localStorage.removeItem("url_history")
    }
  }

  // Generate dynamic QR Code URL based on custom colors
  const qrCodeUrl = short 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(short)}&color=${qrColor.replace('#', '')}&bgcolor=${qrBgColor.replace('#', '')}`
    : ""

  async function downloadQRCode() {
    if (!qrCodeUrl) return
    setIsDownloading(true)
    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `QR-Code-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error("Failed to download QR code", error)
      alert("Failed to download QR code. You can also right-click the image and select 'Save Image As...'.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Main Action Box */}
      <div className="bg-card text-card-foreground border rounded-3xl p-6 md:p-10 shadow-2xl shadow-primary/5 transition-all">
        <form onSubmit={handleShorten} className="space-y-5">
          <label htmlFor="url-input" className="block text-base font-semibold text-foreground mb-1">
            Paste your long URL here
          </label>
          <div className="relative flex items-center group">
            <div className="absolute left-4 text-muted-foreground transition-colors group-focus-within:text-primary">
              <LinkIcon className="w-6 h-6" />
            </div>
            <input
              id="url-input"
              type="text"
              placeholder="https://your-very-long-and-ugly-url.com/example"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-14 pr-4 py-5 bg-background border-2 rounded-2xl text-foreground text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none disabled:opacity-50"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="absolute right-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Shorten"}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-3 animate-in slide-in-from-top-2 bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </form>

        {/* Result & CTA Box */}
        {short && (
          <div className="mt-10 p-6 md:p-8 bg-primary/5 border border-primary/20 rounded-2xl space-y-6 animate-in zoom-in-95 duration-500">
            <div>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Your short link is ready!
              </p>
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                <a 
                  href={short} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-2xl md:text-3xl font-extrabold text-foreground hover:text-primary transition-colors hover:underline break-all"
                >
                  {short}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-primary/10">
              <button
                onClick={() => handleCopy(short, true)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all text-white ${
                  copied ? "bg-green-500" : "bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg"
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
              
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-background border-2 hover:border-primary/50 rounded-xl transition-colors font-semibold text-sm shadow-sm"
              >
                <QrCode className="w-4 h-4" />
                {showQR ? "Hide QR" : "Custom QR Code"}
              </button>

              {canShare && (
                <button
                  onClick={handleShare}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-background border-2 hover:border-primary/50 rounded-xl transition-colors font-semibold text-sm shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              )}
            </div>

            {/* Custom QR Code Generator */}
            {showQR && (
              <div className="mt-6 p-6 bg-background border rounded-xl animate-in fade-in slide-in-from-top-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b pb-3">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Customize QR Code</h3>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* QR Display */}
                  <div className="shrink-0 p-4 bg-white rounded-2xl shadow-sm border">
                    <img 
                      src={qrCodeUrl} 
                      alt={`Custom QR Code for ${short}`} 
                      className="w-48 h-48 md:w-56 md:h-56 object-contain"
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex-1 w-full space-y-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-sm font-semibold">Foreground Color</label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground uppercase font-mono w-16">{qrColor}</span>
                          <input 
                            type="color" 
                            value={qrColor} 
                            onChange={(e) => setQrColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-sm font-semibold">Background Color</label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground uppercase font-mono w-16">{qrBgColor}</span>
                          <input 
                            type="color" 
                            value={qrBgColor} 
                            onChange={(e) => setQrBgColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={downloadQRCode}
                      disabled={isDownloading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-bold transition-all disabled:opacity-50 mt-4"
                    >
                      {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                      Download PNG
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Your Recent Links
            </h2>
            <button 
              onClick={clearHistory}
              className="text-sm font-medium text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {history.map((item, i) => (
              <div
                key={i}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-background border rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex-1 min-w-0 w-full space-y-1">
                  <p className="text-xs font-medium text-muted-foreground truncate" title={item.original}>
                    {item.original}
                  </p>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                    <a
                      href={item.short}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm md:text-base font-bold text-foreground hover:text-primary transition-colors truncate"
                    >
                      {item.short}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(item.short)}
                  className="shrink-0 w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
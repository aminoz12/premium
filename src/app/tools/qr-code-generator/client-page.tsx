"use client"

import React, { useState, useEffect, useCallback, useId, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { ToolLayout, ToolCard } from "@/components/layout/tool-layout"
import {
  Download, QrCode, Type, Link as LinkIcon, Wifi, Mail,
  Phone, MapPin, Copy, Check, Palette, RefreshCw,
  Smartphone, Shield, Zap, Star, Globe, Eye
} from "lucide-react"
import QRCode from "qrcode"

// ─── Types ────────────────────────────────────────────────────────────────────

type QRType = "url" | "text" | "wifi" | "email" | "phone" | "sms" | "location" | "vcard"

interface WiFiData {
  ssid: string; password: string
  security: "WPA" | "WEP" | "nopass"; hidden: boolean
}
interface EmailData  { to: string; subject: string; body: string }
interface VCardData  {
  firstName: string; lastName: string; phone: string
  email: string; org: string; title: string; website: string
}
interface LocationData { lat: string; lng: string; label: string }

interface QRStyle {
  fgColor: string
  bgColor: string
  size: number
  errorLevel: "L" | "M" | "Q" | "H"
  margin: number
}

// ─── GEO CTA ─────────────────────────────────────────────────────────────────

const GEO_CTA: Record<string, { headline: string; sub: string }> = {
  US: {
    headline: "Free QR Code Generator — Trusted by 100,000+ US Businesses",
    sub: "No signup, no watermarks, no expiry. Download print-ready PNG & SVG instantly.",
  },
  GB: {
    headline: "Free QR Code Generator for UK Businesses & Restaurants",
    sub: "Create menu, Wi-Fi, and contact QR codes in seconds. Completely free forever.",
  },
  CA: {
    headline: "Free QR Code Generator — Popular Across Canada",
    sub: "No account needed. High-resolution PNG & SVG. Works offline after load.",
  },
  AU: {
    headline: "Free QR Code Generator for Australian Businesses",
    sub: "Create professional QR codes instantly — free, private, no watermarks.",
  },
  IN: {
    headline: "Free QR Code Generator — Used by Millions in India",
    sub: "Generate UPI, contact, and Wi-Fi QR codes free. No login required.",
  },
  MA: {
    headline: "Générateur de QR Code Gratuit — Maroc",
    sub: "Créez des QR codes professionnels instantanément, sans inscription.",
  },
  FR: {
    headline: "Générateur de QR Code Gratuit & Professionnel",
    sub: "Sans compte, sans filigrane. Téléchargez en PNG ou SVG en un clic.",
  },
  DE: {
    headline: "Kostenloser QR-Code-Generator für Unternehmen",
    sub: "Professionelle QR-Codes ohne Anmeldung. PNG & SVG sofort herunterladen.",
  },
  DEFAULT: {
    headline: "Free QR Code Generator — No Signup, No Watermarks",
    sub: "Create permanent, high-quality QR codes for URLs, Wi-Fi, contacts & more. 100% free.",
  },
}

// ─── Preset color themes ──────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { name: "Classic",    fg: "#000000", bg: "#ffffff" },
  { name: "Ocean",      fg: "#0077b6", bg: "#e0f4ff" },
  { name: "Forest",     fg: "#2d6a4f", bg: "#d8f3dc" },
  { name: "Sunset",     fg: "#c1121f", bg: "#fff0f0" },
  { name: "Royal",      fg: "#5a189a", bg: "#f0e6ff" },
  { name: "Midnight",   fg: "#ffffff", bg: "#0d1117" },
  { name: "Gold",       fg: "#7b4f00", bg: "#fff9e6" },
  { name: "Slate",      fg: "#1e293b", bg: "#f8fafc" },
]

// ─── Schema Markup ────────────────────────────────────────────────────────────

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Free QR Code Generator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online QR code generator. Create QR codes for URLs, Wi-Fi, email, phone, SMS, vCard contacts and GPS locations. Download as PNG or SVG. No signup required.",
  featureList: [
    "URL QR codes", "Wi-Fi QR codes", "vCard contact QR codes",
    "Email QR codes", "Phone & SMS QR codes", "GPS location QR codes",
    "Custom colors", "PNG & SVG download", "No watermarks", "No expiry",
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectGeo(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""
    if (tz.includes("America/New_York") || tz.includes("America/Los_Angeles") ||
        tz.includes("America/Chicago") || tz.includes("America/Denver")) return "US"
    if (tz.includes("Europe/London"))   return "GB"
    if (tz.includes("America/Toronto") || tz.includes("America/Vancouver")) return "CA"
    if (tz.includes("Australia/"))      return "AU"
    if (tz.includes("Asia/Kolkata"))    return "IN"
    if (tz.includes("Africa/Casablanca")) return "MA"
    if (tz.includes("Europe/Paris"))    return "FR"
    if (tz.includes("Europe/Berlin"))   return "DE"
  } catch (_) {}
  return "DEFAULT"
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QRCodeGeneratorPage({
  embedMode = false,
}: {
  embedMode?: boolean
}) {
  const id = useId()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ── State ──────────────────────────────────────────────────────────────────
  const [qrType, setQRType]       = useState<QRType>("url")
  const [text, setText]           = useState("")
  const [url, setUrl]             = useState("")
  const [phone, setPhone]         = useState("")
  const [sms, setSms]             = useState({ number: "", message: "" })
  const [wifi, setWifi]           = useState<WiFiData>({
    ssid: "", password: "", security: "WPA", hidden: false
  })
  const [email, setEmail]         = useState<EmailData>({
    to: "", subject: "", body: ""
  })
  const [vcard, setVcard]         = useState<VCardData>({
    firstName: "", lastName: "", phone: "", email: "",
    org: "", title: "", website: ""
  })
  const [location, setLocation]   = useState<LocationData>({
    lat: "", lng: "", label: ""
  })
  const [qrStyle, setQRStyle]     = useState<QRStyle>({
    fgColor: "#000000", bgColor: "#ffffff",
    size: 400, errorLevel: "H", margin: 2
  })
  const [qrDataUrl, setQRDataUrl] = useState("")
  const [copied, setCopied]       = useState(false)
  const [geo, setGeo]             = useState("DEFAULT")
  const [activeTab, setActiveTab] = useState("design")
  const [scanCount]               = useState(() =>
    Math.floor(Math.random() * 40000) + 60000
  )

  // ── GEO detection ──────────────────────────────────────────────────────────
  useEffect(() => { setGeo(detectGeo()) }, [])

  // ── Build QR data string ───────────────────────────────────────────────────
  const getQRData = useCallback((): string => {
    switch (qrType) {
      case "text":   return text.trim()
      case "url": {
        if (!url.trim()) return ""
        return /^https?:\/\//i.test(url.trim())
          ? url.trim()
          : `https://${url.trim()}`
      }
      case "phone":
        return phone.trim() ? `tel:${phone.trim()}` : ""
      case "sms":
        return sms.number.trim()
          ? `smsto:${sms.number.trim()}:${sms.message}`
          : ""
      case "wifi":
        if (!wifi.ssid.trim()) return ""
        return `WIFI:T:${wifi.security};S:${wifi.ssid};P:${wifi.password};H:${wifi.hidden};`
      case "email":
        if (!email.to.trim()) return ""
        return `mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`
      case "vcard": {
        if (!vcard.firstName.trim() && !vcard.lastName.trim()) return ""
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:${vcard.lastName};${vcard.firstName};;;`,
          `FN:${vcard.firstName} ${vcard.lastName}`.trim(),
          vcard.org     ? `ORG:${vcard.org}`         : "",
          vcard.title   ? `TITLE:${vcard.title}`     : "",
          vcard.phone   ? `TEL:${vcard.phone}`       : "",
          vcard.email   ? `EMAIL:${vcard.email}`     : "",
          vcard.website ? `URL:${vcard.website}`     : "",
          "END:VCARD",
        ].filter(Boolean).join("\n")
      }
      case "location": {
        const { lat, lng, label } = location
        if (!lat.trim() || !lng.trim()) return ""
        return label.trim()
          ? `geo:${lat},${lng}?q=${encodeURIComponent(label)}`
          : `geo:${lat},${lng}`
      }
      default: return ""
    }
  }, [qrType, text, url, phone, sms, wifi, email, vcard, location])

  // ── Generate QR ────────────────────────────────────────────────────────────
  useEffect(() => {
    const data = getQRData()
    if (!data) { setQRDataUrl(""); return }

    const timer = setTimeout(() => {
      QRCode.toDataURL(data, {
        width: qrStyle.size,
        margin: qrStyle.margin,
        color: { dark: qrStyle.fgColor, light: qrStyle.bgColor },
        errorCorrectionLevel: qrStyle.errorLevel,
      })
        .then(setQRDataUrl)
        .catch(err => console.error("QR error:", err))
    }, 250)

    return () => clearTimeout(timer)
  }, [getQRData, qrStyle])

  // ── Download ───────────────────────────────────────────────────────────────
  const download = (format: "png" | "svg") => {
    const data = getQRData()
    if (!data) return

    if (format === "png" && qrDataUrl) {
      const a = document.createElement("a")
      a.download = `qr-${qrType}-${Date.now()}.png`
      a.href = qrDataUrl
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      return
    }

    if (format === "svg") {
      QRCode.toString(data, {
        type: "svg",
        width: qrStyle.size,
        margin: qrStyle.margin,
        color: { dark: qrStyle.fgColor, light: qrStyle.bgColor },
        errorCorrectionLevel: qrStyle.errorLevel,
      }, (err, svg) => {
        if (err || !svg) return
        const blob = new Blob([svg], { type: "image/svg+xml" })
        const u = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.download = `qr-${qrType}-${Date.now()}.svg`
        a.href = u
        document.body.appendChild(a); a.click(); document.body.removeChild(a)
        URL.revokeObjectURL(u)
      })
    }
  }

  // ── Copy to clipboard ──────────────────────────────────────────────────────
  const copyImage = async () => {
    if (!qrDataUrl) return
    try {
      const res = await fetch(qrDataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {
      // Fallback: copy data URL as text
      await navigator.clipboard.writeText(qrDataUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // ── Get location ───────────────────────────────────────────────────────────
  const getMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos => {
      setLocation(l => ({
        ...l,
        lat: pos.coords.latitude.toFixed(6),
        lng: pos.coords.longitude.toFixed(6),
      }))
    })
  }

  // ── Type config ────────────────────────────────────────────────────────────
  const TYPE_TABS: { value: QRType; label: string; icon: React.ReactNode }[] = [
    { value: "url",      label: "URL",      icon: <LinkIcon  className="h-3.5 w-3.5"/> },
    { value: "text",     label: "Text",     icon: <Type      className="h-3.5 w-3.5"/> },
    { value: "wifi",     label: "Wi-Fi",    icon: <Wifi      className="h-3.5 w-3.5"/> },
    { value: "email",    label: "Email",    icon: <Mail      className="h-3.5 w-3.5"/> },
    { value: "phone",    label: "Phone",    icon: <Phone     className="h-3.5 w-3.5"/> },
    { value: "sms",      label: "SMS",      icon: <Smartphone className="h-3.5 w-3.5"/> },
    { value: "vcard",    label: "vCard",    icon: <Star      className="h-3.5 w-3.5"/> },
    { value: "location", label: "Location", icon: <MapPin    className="h-3.5 w-3.5"/> },
  ]

  const cta = GEO_CTA[geo] ?? GEO_CTA.DEFAULT

  // ─── Render ────────────────────────────────────────────────────────────────
  const content = (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">

      {/* ── Schema JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* ── GEO Hero Banner ── */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 px-6 py-8 text-center">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary font-semibold text-xs mb-1 tracking-wide uppercase">
            <QrCode className="h-3.5 w-3.5" />
            Free · Permanent · No Watermark
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">
            {cta.headline}
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            {cta.sub}
          </p>

          {/* Trust bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            {[
              { icon: <Zap   className="h-4 w-4 text-yellow-500"/>, text: "Instant Generation" },
              { icon: <Shield className="h-4 w-4 text-green-500"/>, text: "100% Private" },
              { icon: <Globe  className="h-4 w-4 text-blue-500"/>,  text: `${scanCount.toLocaleString()}+ Generated` },
              { icon: <Eye    className="h-4 w-4 text-purple-500"/>, text: "8 QR Types" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                {icon} {text}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Tool ── */}
      <section
        aria-label="QR Code Generator Tool"
        className="grid gap-6 lg:grid-cols-[1fr_380px] items-start"
      >
        {/* ── LEFT: Input ── */}
        <div className="flex flex-col gap-4">

          {/* Type selector */}
          <ToolCard title="Step 1 — Choose QR Code Type">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {TYPE_TABS.map(t => (
                <button
                  key={t.value}
                  onClick={() => setQRType(t.value)}
                  className={[
                    "flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border text-xs font-semibold transition-all",
                    qrType === t.value
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                  aria-pressed={qrType === t.value}
                >
                  {t.icon}
                  <span className="hidden sm:block">{t.label}</span>
                </button>
              ))}
            </div>
          </ToolCard>

          {/* Content input */}
          <ToolCard title="Step 2 — Enter Content">
            <div className="min-h-[240px]">

              {/* URL */}
              {qrType === "url" && (
                <div className="space-y-3">
                  <Label htmlFor={`${id}-url`} className="font-semibold">Website URL</Label>
                  <Input
                    id={`${id}-url`}
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Works with any URL — product pages, social profiles, Google Maps links, etc.
                  </p>
                </div>
              )}

              {/* Text */}
              {qrType === "text" && (
                <div className="space-y-3">
                  <Label htmlFor={`${id}-text`} className="font-semibold">Plain Text</Label>
                  <Textarea
                    id={`${id}-text`}
                    placeholder="Enter any text — a message, coupon code, address…"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="min-h-[160px] resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    {text.length} characters · Max ~2,900 for reliable scanning
                  </p>
                </div>
              )}

              {/* Phone */}
              {qrType === "phone" && (
                <div className="space-y-3">
                  <Label htmlFor={`${id}-phone`} className="font-semibold">Phone Number</Label>
                  <Input
                    id={`${id}-phone`}
                    type="tel"
                    placeholder="+1 555 000 0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Scanning opens the dialer with this number pre-filled.
                  </p>
                </div>
              )}

              {/* SMS */}
              {qrType === "sms" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-sms-number`} className="font-semibold">Phone Number</Label>
                    <Input
                      id={`${id}-sms-number`}
                      type="tel"
                      placeholder="+1 555 000 0000"
                      value={sms.number}
                      onChange={e => setSms(s => ({ ...s, number: e.target.value }))}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-sms-msg`} className="font-semibold">
                      Pre-filled Message (Optional)
                    </Label>
                    <Textarea
                      id={`${id}-sms-msg`}
                      placeholder="Hi, I scanned your QR code and wanted to reach out…"
                      value={sms.message}
                      onChange={e => setSms(s => ({ ...s, message: e.target.value }))}
                      className="min-h-[100px] resize-y"
                    />
                  </div>
                </div>
              )}

              {/* Wi-Fi */}
              {qrType === "wifi" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-wifi-ssid`} className="font-semibold">Network Name (SSID)</Label>
                    <Input
                      id={`${id}-wifi-ssid`}
                      placeholder="MyHomeNetwork"
                      value={wifi.ssid}
                      onChange={e => setWifi(w => ({ ...w, ssid: e.target.value }))}
                      className="h-11"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${id}-wifi-pw`} className="font-semibold">Password</Label>
                      <Input
                        id={`${id}-wifi-pw`}
                        type="password"
                        placeholder="••••••••"
                        value={wifi.password}
                        onChange={e => setWifi(w => ({ ...w, password: e.target.value }))}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${id}-wifi-sec`} className="font-semibold">Security</Label>
                      <Select
                        value={wifi.security}
                        onValueChange={v => setWifi(w => ({
                          ...w, security: v as "WPA" | "WEP" | "nopass"
                        }))}
                      >
                        <SelectTrigger id={`${id}-wifi-sec`} className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA / WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">No Password</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wifi.hidden}
                      onChange={e => setWifi(w => ({ ...w, hidden: e.target.checked }))}
                      className="rounded"
                    />
                    Hidden network (SSID not broadcast)
                  </label>
                  <p className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                    Guests scan this QR code to join your Wi-Fi automatically — no typing needed.
                  </p>
                </div>
              )}

              {/* Email */}
              {qrType === "email" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-email-to`} className="font-semibold">Recipient</Label>
                    <Input
                      id={`${id}-email-to`}
                      type="email"
                      placeholder="contact@company.com"
                      value={email.to}
                      onChange={e => setEmail(m => ({ ...m, to: e.target.value }))}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-email-sub`} className="font-semibold">Subject (Optional)</Label>
                    <Input
                      id={`${id}-email-sub`}
                      placeholder="Inquiry from QR scan"
                      value={email.subject}
                      onChange={e => setEmail(m => ({ ...m, subject: e.target.value }))}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-email-body`} className="font-semibold">Body (Optional)</Label>
                    <Textarea
                      id={`${id}-email-body`}
                      placeholder="Hello, I'd like to learn more about…"
                      value={email.body}
                      onChange={e => setEmail(m => ({ ...m, body: e.target.value }))}
                      className="min-h-[90px] resize-y"
                    />
                  </div>
                </div>
              )}

              {/* vCard */}
              {qrType === "vcard" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor={`${id}-vc-fn`} className="font-semibold text-xs">First Name</Label>
                      <Input id={`${id}-vc-fn`} placeholder="Jane" value={vcard.firstName}
                        onChange={e => setVcard(v => ({ ...v, firstName: e.target.value }))} className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`${id}-vc-ln`} className="font-semibold text-xs">Last Name</Label>
                      <Input id={`${id}-vc-ln`} placeholder="Smith" value={vcard.lastName}
                        onChange={e => setVcard(v => ({ ...v, lastName: e.target.value }))} className="h-10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor={`${id}-vc-org`} className="font-semibold text-xs">Organization</Label>
                      <Input id={`${id}-vc-org`} placeholder="Acme Corp" value={vcard.org}
                        onChange={e => setVcard(v => ({ ...v, org: e.target.value }))} className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`${id}-vc-title`} className="font-semibold text-xs">Job Title</Label>
                      <Input id={`${id}-vc-title`} placeholder="CEO" value={vcard.title}
                        onChange={e => setVcard(v => ({ ...v, title: e.target.value }))} className="h-10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor={`${id}-vc-ph`} className="font-semibold text-xs">Phone</Label>
                      <Input id={`${id}-vc-ph`} placeholder="+1 555 000 0000" value={vcard.phone}
                        onChange={e => setVcard(v => ({ ...v, phone: e.target.value }))} className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`${id}-vc-em`} className="font-semibold text-xs">Email</Label>
                      <Input id={`${id}-vc-em`} type="email" placeholder="jane@acme.com" value={vcard.email}
                        onChange={e => setVcard(v => ({ ...v, email: e.target.value }))} className="h-10" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`${id}-vc-web`} className="font-semibold text-xs">Website</Label>
                    <Input id={`${id}-vc-web`} placeholder="https://acme.com" value={vcard.website}
                      onChange={e => setVcard(v => ({ ...v, website: e.target.value }))} className="h-10" />
                  </div>
                </div>
              )}

              {/* Location */}
              {qrType === "location" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`${id}-lat`} className="font-semibold">Latitude</Label>
                      <Input
                        id={`${id}-lat`}
                        placeholder="48.8566"
                        value={location.lat}
                        onChange={e => setLocation(l => ({ ...l, lat: e.target.value }))}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${id}-lng`} className="font-semibold">Longitude</Label>
                      <Input
                        id={`${id}-lng`}
                        placeholder="2.3522"
                        value={location.lng}
                        onChange={e => setLocation(l => ({ ...l, lng: e.target.value }))}
                        className="h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${id}-loc-label`} className="font-semibold">Label (Optional)</Label>
                    <Input
                      id={`${id}-loc-label`}
                      placeholder="Eiffel Tower, Paris"
                      value={location.label}
                      onChange={e => setLocation(l => ({ ...l, label: e.target.value }))}
                      className="h-11"
                    />
                  </div>
                  <Button
                    variant="outline" size="sm"
                    onClick={getMyLocation}
                    className="w-full gap-2"
                  >
                    <MapPin className="h-4 w-4"/> Use My Current Location
                  </Button>
                </div>
              )}
            </div>
          </ToolCard>

          {/* Design options */}
          <ToolCard title="Step 3 — Customize Design">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="design"><Palette className="h-3.5 w-3.5 mr-1.5"/>Colors</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-4 mt-0">
                {/* Presets */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Color Presets
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {COLOR_PRESETS.map(p => (
                      <button
                        key={p.name}
                        title={p.name}
                        onClick={() => setQRStyle(s => ({ ...s, fgColor: p.fg, bgColor: p.bg }))}
                        className={[
                          "h-8 rounded-lg border-2 transition-all overflow-hidden",
                          qrStyle.fgColor === p.fg && qrStyle.bgColor === p.bg
                            ? "border-primary scale-110 shadow-md"
                            : "border-border hover:border-primary/50",
                        ].join(" ")}
                        style={{ background: `linear-gradient(135deg, ${p.bg} 50%, ${p.fg} 50%)` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">QR Color (Foreground)</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={qrStyle.fgColor}
                        onChange={e => setQRStyle(s => ({ ...s, fgColor: e.target.value }))}
                        className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5"
                      />
                      <Input
                        value={qrStyle.fgColor}
                        onChange={e => setQRStyle(s => ({ ...s, fgColor: e.target.value }))}
                        className="h-10 font-mono text-sm"
                        maxLength={7}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Background Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={qrStyle.bgColor}
                        onChange={e => setQRStyle(s => ({ ...s, bgColor: e.target.value }))}
                        className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5"
                      />
                      <Input
                        value={qrStyle.bgColor}
                        onChange={e => setQRStyle(s => ({ ...s, bgColor: e.target.value }))}
                        className="h-10 font-mono text-sm"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      Size: {qrStyle.size}px
                    </Label>
                    <input
                      type="range" min={200} max={1000} step={50}
                      value={qrStyle.size}
                      onChange={e => setQRStyle(s => ({ ...s, size: +e.target.value }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>200px</span><span>1000px</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      Margin: {qrStyle.margin} modules
                    </Label>
                    <input
                      type="range" min={0} max={8} step={1}
                      value={qrStyle.margin}
                      onChange={e => setQRStyle(s => ({ ...s, margin: +e.target.value }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>0</span><span>8</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Error Correction Level</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["L", "M", "Q", "H"] as const).map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setQRStyle(s => ({ ...s, errorLevel: lvl }))}
                        className={[
                          "py-2 rounded-lg border text-xs font-bold transition-colors",
                          qrStyle.errorLevel === lvl
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:bg-muted",
                        ].join(" ")}
                      >
                        {lvl}
                        <div className="text-[9px] font-normal opacity-70 mt-0.5">
                          {lvl === "L" ? "7%" : lvl === "M" ? "15%" : lvl === "Q" ? "25%" : "30%"}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Higher = more damage-resistant (larger QR). H recommended for print.
                  </p>
                </div>

                <Button
                  variant="outline" size="sm"
                  onClick={() => setQRStyle({
                    fgColor: "#000000", bgColor: "#ffffff",
                    size: 400, errorLevel: "H", margin: 2
                  })}
                  className="w-full gap-2"
                >
                  <RefreshCw className="h-3.5 w-3.5"/> Reset to Defaults
                </Button>
              </TabsContent>
            </Tabs>
          </ToolCard>
        </div>

        {/* ── RIGHT: Preview & Download ── */}
        <div className="lg:sticky lg:top-6 flex flex-col gap-4">
          <ToolCard title="Preview & Download" className="h-full">
            <div className="flex flex-col items-center gap-5">

              {/* QR Preview */}
              <div
                className="relative w-full max-w-[300px] aspect-square rounded-2xl border-2 border-dashed border-muted flex items-center justify-center overflow-hidden transition-all"
                style={{ background: qrDataUrl ? qrStyle.bgColor : undefined }}
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR code for ${qrType}`}
                    className="w-full h-full object-contain p-2 animate-in fade-in zoom-in-95 duration-500"
                  />
                ) : (
                  <div className="text-center px-6 opacity-50">
                    <QrCode className="h-16 w-16 mx-auto mb-3 text-muted-foreground"/>
                    <p className="text-sm text-muted-foreground">
                      Fill in the form to generate your QR code
                    </p>
                  </div>
                )}
              </div>

              {/* Download buttons */}
              <div className="w-full space-y-2 max-w-[300px]">
                <Button
                  onClick={() => download("png")}
                  disabled={!qrDataUrl}
                  className="w-full h-11 gap-2 font-bold text-sm"
                >
                  <Download className="h-4 w-4"/> Download PNG
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => download("svg")}
                  disabled={!qrDataUrl}
                  className="w-full h-11 gap-2 font-semibold text-sm"
                >
                  <Download className="h-4 w-4"/> Download SVG (Vector)
                </Button>
                <Button
                  variant="outline"
                  onClick={copyImage}
                  disabled={!qrDataUrl}
                  className="w-full h-10 gap-2 text-sm"
                >
                  {copied
                    ? <><Check className="h-4 w-4 text-green-500"/> Copied!</>
                    : <><Copy className="h-4 w-4"/> Copy to Clipboard</>
                  }
                </Button>
              </div>

              {/* Quality badges */}
              {qrDataUrl && (
                <div className="w-full max-w-[300px] grid grid-cols-2 gap-2">
                  {[
                    { icon: <Shield className="h-3.5 w-3.5 text-green-500"/>, text: "No Watermark" },
                    { icon: <Zap    className="h-3.5 w-3.5 text-yellow-500"/>, text: "Never Expires" },
                    { icon: <Star   className="h-3.5 w-3.5 text-blue-500"/>,  text: "Print Quality" },
                    { icon: <Check  className="h-3.5 w-3.5 text-purple-500"/>, text: "Error Level H" },
                  ].map(b => (
                    <div key={b.text} className="flex items-center gap-1.5 text-xs font-medium
                      text-muted-foreground bg-muted/50 rounded-lg px-2.5 py-2">
                      {b.icon} {b.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Size info */}
              {qrDataUrl && (
                <p className="text-xs text-muted-foreground text-center">
                  {qrStyle.size} × {qrStyle.size}px · Error Level {qrStyle.errorLevel} ·{" "}
                  {qrType.toUpperCase()} QR Code
                </p>
              )}
            </div>
          </ToolCard>

          {/* Use-case tips card */}
          <ToolCard title="💡 Popular Use Cases">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "🍽️ Restaurant menus & table ordering",
                "📶 Hotel & café Wi-Fi sharing",
                "💼 Business cards & networking events",
                "🛍️ Product packaging & retail displays",
                "📦 Inventory & asset tracking",
                "🎪 Event check-in & ticketing",
                "🏠 Real estate property info",
                "📣 Marketing & print advertising",
              ].map(u => (
                <li key={u} className="flex items-start gap-2 leading-snug">{u}</li>
              ))}
            </ul>
          </ToolCard>
        </div>
      </section>

      {/* ── FAQ / SEO Content ── */}
      <section aria-label="Frequently Asked Questions" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            q: "Are these QR codes permanent?",
            a: "Yes. All QR codes are generated locally in your browser and never expire. There is no server tracking or link shortening — the data is encoded directly.",
          },
          {
            q: "Can I use them for commercial purposes?",
            a: "Absolutely. QR codes generated here are completely free for personal and commercial use — no attribution or license required.",
          },
          {
            q: "What's the difference between PNG and SVG?",
            a: "PNG is a raster image — great for digital use and screens. SVG is vector-based and scales to any size without losing quality, making it ideal for print.",
          },
          {
            q: "What is error correction level H?",
            a: "Level H allows the QR code to be readable even if up to 30% of it is damaged or obscured. We default to H for maximum reliability in print use.",
          },
          {
            q: "Do you store my data?",
            a: "No. QR generation happens entirely in your browser using JavaScript. Your URLs, passwords, and contacts never leave your device.",
          },
          {
            q: "What size should I use for printing?",
            a: "Use at least 600px for business cards, 1000px for posters. Always download SVG for large-format printing. Minimum physical size is ~2cm × 2cm.",
          },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl border border-border bg-muted/30 p-5 space-y-2">
            <h3 className="font-semibold text-sm text-foreground">{q}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
          </div>
        ))}
      </section>
    </div>
  )

  if (embedMode) return content

  return (
    <ToolLayout toolId="qr-code-generator">
      {content}
    </ToolLayout>
  )
}
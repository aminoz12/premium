"use client"

import { useState, useRef, useEffect, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = "transform" | "filters" | "presets" | "export"
type AnimType = "float" | "pulse" | "spin" | null
type SceneBg = "white" | "black" | "gray" | "checkerboard" | "gradient"

// ─── Presets ──────────────────────────────────────────────────────────────────
const PRESETS = [
  { name: "Reset",      icon: "↺",  values: { perspective: 1000, rotateX: 0,  rotateY: 0,   rotateZ: 0,  translateX: 0,   translateY: 0,   translateZ: 0,   scale: 1,    skewX: 0,  skewY: 0  }},
  { name: "3D Tilt",    icon: "📐", values: { perspective: 800,  rotateX: 15, rotateY: -20, rotateZ: 0,  translateX: 0,   translateY: 0,   translateZ: 50,  scale: 1,    skewX: 0,  skewY: 0  }},
  { name: "Hero Card",  icon: "🃏", values: { perspective: 600,  rotateX: 10, rotateY: 25,  rotateZ: -3, translateX: 0,   translateY: -10, translateZ: 80,  scale: 1.05, skewX: 0,  skewY: 0  }},
  { name: "Pop Out",    icon: "💥", values: { perspective: 500,  rotateX: 0,  rotateY: 0,   rotateZ: 0,  translateX: 0,   translateY: 0,   translateZ: 200, scale: 1.15, skewX: 0,  skewY: 0  }},
  { name: "Isometric",  icon: "🔷", values: { perspective: 0,    rotateX: 45, rotateY: 0,   rotateZ: 45, translateX: 0,   translateY: 0,   translateZ: 0,   scale: 0.8,  skewX: 0,  skewY: 0  }},
  { name: "Flip Left",  icon: "↩️", values: { perspective: 800,  rotateX: 0,  rotateY: -45, rotateZ: 0,  translateX: 0,   translateY: 0,   translateZ: 0,   scale: 1,    skewX: 0,  skewY: 0  }},
  { name: "Flip Right", icon: "↪️", values: { perspective: 800,  rotateX: 0,  rotateY: 45,  rotateZ: 0,  translateX: 0,   translateY: 0,   translateZ: 0,   scale: 1,    skewX: 0,  skewY: 0  }},
  { name: "Top Down",   icon: "⬇️", values: { perspective: 600,  rotateX: 55, rotateY: 0,   rotateZ: 0,  translateX: 0,   translateY: 0,   translateZ: 0,   scale: 0.9,  skewX: 0,  skewY: 0  }},
  { name: "Bottom Up",  icon: "⬆️", values: { perspective: 600,  rotateX: -40,rotateY: 0,   rotateZ: 0,  translateX: 0,   translateY: 0,   translateZ: 0,   scale: 0.9,  skewX: 0,  skewY: 0  }},
  { name: "Cinematic",  icon: "🎬", values: { perspective: 400,  rotateX: 8,  rotateY: -30, rotateZ: 2,  translateX: 20,  translateY: -15, translateZ: 100, scale: 1.1,  skewX: 0,  skewY: 0  }},
  { name: "Dramatic",   icon: "🎭", values: { perspective: 350,  rotateX: 25, rotateY: 35,  rotateZ: -5, translateX: -10, translateY: 0,   translateZ: 120, scale: 1.05, skewX: 0,  skewY: 0  }},
  { name: "Skewed",     icon: "◇",  values: { perspective: 1000, rotateX: 0,  rotateY: 0,   rotateZ: 0,  translateX: 0,   translateY: 0,   translateZ: 0,   scale: 1,    skewX: 15, skewY: 5  }},
  { name: "Float Away", icon: "🎈", values: { perspective: 900,  rotateX: -10,rotateY: 15,  rotateZ: 8,  translateX: 30,  translateY: -40, translateZ: 150, scale: 0.95, skewX: 0,  skewY: 0  }},
  { name: "Lay Flat",   icon: "📄", values: { perspective: 500,  rotateX: 70, rotateY: 0,   rotateZ: -20,translateX: 0,   translateY: 20,  translateZ: 0,   scale: 0.85, skewX: 0,  skewY: 0  }},
  { name: "Showcase",   icon: "🖼️", values: { perspective: 700,  rotateX: 5,  rotateY: -15, rotateZ: 0,  translateX: 0,   translateY: 0,   translateZ: 60,  scale: 1.08, skewX: 0,  skewY: 0  }},
  { name: "Diagonal",   icon: "↗️", values: { perspective: 800,  rotateX: 20, rotateY: 20,  rotateZ: 15, translateX: 15,  translateY: -15, translateZ: 40,  scale: 1,    skewX: 5,  skewY: -5 }},
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildTransformStr(rX: number, rY: number, rZ: number, tX: number, tY: number, tZ: number, sc: number, skX: number, skY: number) {
  let t = ""
  if (tX !== 0 || tY !== 0 || tZ !== 0) t += `translate3d(${tX}px,${tY}px,${tZ}px) `
  if (rX !== 0) t += `rotateX(${rX}deg) `
  if (rY !== 0) t += `rotateY(${rY}deg) `
  if (rZ !== 0) t += `rotateZ(${rZ}deg) `
  if (sc !== 1) t += `scale(${sc}) `
  if (skX !== 0) t += `skewX(${skX}deg) `
  if (skY !== 0) t += `skewY(${skY}deg) `
  return t.trim() || "none"
}

function buildFilterStr(br: number, co: number, sa: number, bl: number, gr: number, se: number, hu: number, inv: number, op: number, ds: number) {
  let f = ""
  if (br !== 100) f += `brightness(${br}%) `
  if (co !== 100) f += `contrast(${co}%) `
  if (sa !== 100) f += `saturate(${sa}%) `
  if (bl > 0)     f += `blur(${bl}px) `
  if (gr > 0)     f += `grayscale(${gr}%) `
  if (se > 0)     f += `sepia(${se}%) `
  if (hu > 0)     f += `hue-rotate(${hu}deg) `
  if (inv > 0)    f += `invert(${inv}%) `
  if (op < 100)   f += `opacity(${op}%) `
  if (ds > 0)     f += `drop-shadow(0 ${ds}px ${ds * 1.5}px rgba(0,0,0,0.3)) `
  return f.trim() || "none"
}

function buildDemoImage(): string {
  if (typeof document === "undefined") return ""
  const canvas = document.createElement("canvas")
  canvas.width = 600; canvas.height = 400
  const ctx = canvas.getContext("2d")!
  const grad = ctx.createLinearGradient(0, 0, 600, 400)
  grad.addColorStop(0, "#1a1a2e"); grad.addColorStop(0.5, "#16213e"); grad.addColorStop(1, "#0f3460")
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 600, 400)
  ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 2
  ctx.strokeRect(200, 120, 150, 150); ctx.strokeRect(250, 80, 150, 150)
  ctx.beginPath()
  ctx.moveTo(200,120); ctx.lineTo(250,80)
  ctx.moveTo(350,120); ctx.lineTo(400,80)
  ctx.moveTo(200,270); ctx.lineTo(250,230)
  ctx.moveTo(350,270); ctx.lineTo(400,230)
  ctx.stroke()
  ctx.fillStyle = "#ffffff"; ctx.font = "bold 26px sans-serif"; ctx.textAlign = "center"
  ctx.fillText("3D Transform Demo", 300, 340)
  ctx.font = "13px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.5)"
  ctx.fillText("Upload your own image to get started", 300, 368)
  return canvas.toDataURL("image/png")
}

// ─── Slider Row ───────────────────────────────────────────────────────────────
function SliderRow({ label, min, max, step, value, onChange, fmt }: {
  label: string; min: number; max: number; step: number; value: number
  onChange: (v: number) => void; fmt: (v: number) => string
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-400 font-mono min-w-[52px] text-right">{fmt(value)}</span>
      </div>
      <input
        type="range" className="g3d-slider"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        aria-label={label}
      />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Generate3DClient() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef       = useRef<HTMLImageElement>(null)
  const sceneRef     = useRef<HTMLDivElement>(null)
  const mouseTrackRef  = useRef(false)
  const animationRef   = useRef<AnimType>(null)
  const toastTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Image
  const [imageSrc, setImageSrc]     = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [dimensions, setDimensions]   = useState("")

  // 3D transform
  const [perspective, setPerspective] = useState(1000)
  const [rotateX, setRotateX]         = useState(0)
  const [rotateY, setRotateY]         = useState(0)
  const [rotateZ, setRotateZ]         = useState(0)
  const [translateX, setTranslateX]   = useState(0)
  const [translateY, setTranslateY]   = useState(0)
  const [translateZ, setTranslateZ]   = useState(0)
  const [scale, setScale]             = useState(1)
  const [skewX, setSkewX]             = useState(0)
  const [skewY, setSkewY]             = useState(0)

  // Filters
  const [brightness, setBrightness]   = useState(100)
  const [contrast, setContrast]       = useState(100)
  const [saturate, setSaturate]       = useState(100)
  const [blur, setBlur]               = useState(0)
  const [grayscale, setGrayscale]     = useState(0)
  const [sepia, setSepia]             = useState(0)
  const [hueRotate, setHueRotate]     = useState(0)
  const [invert, setInvert]           = useState(0)
  const [opacity, setOpacity]         = useState(100)
  const [dropShadow, setDropShadow]   = useState(0)

  // UI
  const [activeTab, setActiveTab]           = useState<TabId>("transform")
  const [mouseTrack, setMouseTrack]         = useState(false)
  const [reflection, setReflection]         = useState(false)
  const [shadow, setShadow]                 = useState(false)
  const [sceneBg, setSceneBg]               = useState<SceneBg>("white")
  const [currentAnimation, setCurrentAnimation] = useState<AnimType>(null)
  const [activePreset, setActivePreset]     = useState<number | null>(null)
  const [toast, setToast]                   = useState("")
  const [isDragOver, setIsDragOver]         = useState(false)
  const [exportFormat, setExportFormat]     = useState<"png" | "jpeg">("png")
  const [exportScale, setExportScale]       = useState(1)
  const [exportQuality, setExportQuality]   = useState(95)
  const [exportBg, setExportBg]             = useState("transparent")
  const [cssCode, setCssCode]               = useState("Upload an image to see the generated CSS.")

  // Keep refs in sync
  useEffect(() => { mouseTrackRef.current = mouseTrack },     [mouseTrack])
  useEffect(() => { animationRef.current  = currentAnimation }, [currentAnimation])

  const transformStr = buildTransformStr(rotateX, rotateY, rotateZ, translateX, translateY, translateZ, scale, skewX, skewY)
  const filterStr    = buildFilterStr(brightness, contrast, saturate, blur, grayscale, sepia, hueRotate, invert, opacity, dropShadow)

  // Update CSS preview
  useEffect(() => {
    if (!imageLoaded) return
    let css = `.image-3d {\n  transform: ${transformStr};\n`
    if (filterStr !== "none") css += `  filter: ${filterStr};\n`
    css += `  transform-style: preserve-3d;\n}\n`
    if (perspective > 0) css += `\n.image-3d-container {\n  perspective: ${perspective}px;\n}`
    setCssCode(css)
  }, [imageLoaded, transformStr, filterStr, perspective])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(""), 2500)
  }, [])

  // Demo image on mount
  useEffect(() => {
    const src = buildDemoImage()
    if (src) { setImageSrc(src); setImageLoaded(true); setDimensions("600 × 400") }
  }, [])

  // Global paste
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          e.preventDefault()
          const file = items[i].getAsFile()
          if (file) handleFile(file)
          break
        }
      }
    }
    document.addEventListener("paste", handler)
    return () => document.removeEventListener("paste", handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); handleResetAll() }
      if ((e.ctrlKey || e.metaKey) && e.key === "e") { e.preventDefault(); handleExport() }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageLoaded, imageSrc, exportFormat, exportScale, exportQuality, exportBg, sceneBg, brightness, contrast, saturate, blur, grayscale, sepia, hueRotate, invert, opacity, dropShadow])

  function handleFile(file: File) {
    if (file.size > 20 * 1024 * 1024) { showToast("File too large. Maximum 20 MB."); return }
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        setDimensions(`${img.naturalWidth} × ${img.naturalHeight}`)
        setImageSrc(src); setImageLoaded(true)
        showToast("Image loaded!")
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) handleFile(file)
    else showToast("Please drop a valid image file.")
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!mouseTrackRef.current || !imageLoaded || animationRef.current || !imgRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    imgRef.current.style.transform = `rotateX(${(0.5 - y) * 40}deg) rotateY(${(x - 0.5) * 40}deg) scale(1.05)`
  }

  function handleMouseLeave() {
    if (!mouseTrackRef.current || animationRef.current || !imgRef.current) return
    imgRef.current.style.transform = transformStr
  }

  function applyPreset(index: number) {
    const p = PRESETS[index]; if (!p) return
    setCurrentAnimation(null)
    setPerspective(p.values.perspective); setRotateX(p.values.rotateX); setRotateY(p.values.rotateY); setRotateZ(p.values.rotateZ)
    setTranslateX(p.values.translateX); setTranslateY(p.values.translateY); setTranslateZ(p.values.translateZ)
    setScale(p.values.scale); setSkewX(p.values.skewX); setSkewY(p.values.skewY)
    setActivePreset(index)
    showToast(`Applied "${p.name}"`)
  }

  function handleResetTransform() {
    setPerspective(1000); setRotateX(0); setRotateY(0); setRotateZ(0)
    setTranslateX(0); setTranslateY(0); setTranslateZ(0); setScale(1); setSkewX(0); setSkewY(0)
    setCurrentAnimation(null); setActivePreset(null)
    showToast("3D transforms reset")
  }

  function handleResetFilters() {
    setBrightness(100); setContrast(100); setSaturate(100); setBlur(0)
    setGrayscale(0); setSepia(0); setHueRotate(0); setInvert(0); setOpacity(100); setDropShadow(0)
    showToast("Filters reset")
  }

  function handleResetAll() {
    handleResetTransform(); handleResetFilters()
    setMouseTrack(false); setReflection(false); setShadow(false)
    showToast("All settings reset")
  }

  function toggleAnimation(type: "float" | "pulse" | "spin") {
    if (currentAnimation === type) { setCurrentAnimation(null); showToast("Animation stopped"); return }
    setCurrentAnimation(type)
    if (mouseTrack) setMouseTrack(false)
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} animation started`)
  }

  function handleExport() {
    if (!imageLoaded || !imageSrc || !imgRef.current) { showToast("Please upload an image first."); return }
    const img = imgRef.current
    const w = img.naturalWidth * exportScale
    const h = img.naturalHeight * exportScale
    const canvas = document.createElement("canvas")
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext("2d")!
    if (exportBg === "white") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h) }
    else if (exportBg === "black") { ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h) }
    else if (exportBg === "scene") {
      if (sceneBg === "black") { ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h) }
      else if (sceneBg === "gray") { ctx.fillStyle = "#f5f5f5"; ctx.fillRect(0, 0, w, h) }
      else { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h) }
    }
    const fStr = buildFilterStr(brightness, contrast, saturate, blur * exportScale, grayscale, sepia, hueRotate, invert, opacity, 0)
    if (fStr !== "none") ctx.filter = fStr
    ctx.drawImage(img, 0, 0, w, h)
    const ext = exportFormat === "jpeg" ? "jpg" : "png"
    try {
      const link = document.createElement("a")
      link.download = `3d-effect-${Date.now()}.${ext}`
      link.href = canvas.toDataURL(exportFormat === "jpeg" ? "image/jpeg" : "image/png", exportQuality / 100)
      document.body.appendChild(link); link.click(); document.body.removeChild(link)
      showToast(`Exported as ${ext.toUpperCase()} (${exportScale}x)`)
    } catch { showToast("Export failed. Try a different image.") }
  }

  function handleCopyCSS() {
    if (!imageLoaded) { showToast("Upload an image first."); return }
    navigator.clipboard.writeText(cssCode).then(() => showToast("CSS copied!")).catch(() => showToast("Copy failed."))
  }

  // Derived styles
  const animClass = currentAnimation === "float" ? "g3d-float" : currentAnimation === "pulse" ? "g3d-pulse" : currentAnimation === "spin" ? "g3d-spin" : ""
  const imgStyle: React.CSSProperties = {
    ...(currentAnimation ? {} : { transform: transformStr }),
    filter: filterStr,
    transformStyle: "preserve-3d",
    transition: currentAnimation ? "none" : "transform 0.1s ease-out, filter 0.1s ease-out",
    willChange: "transform, filter",
  }
  const sceneContainerStyle: React.CSSProperties = {
    perspective: perspective === 0 ? undefined : `${perspective}px`,
    ...(sceneBg === "white"    ? { background: "#ffffff" } :
        sceneBg === "black"    ? { background: "#000000" } :
        sceneBg === "gray"     ? { background: "#f5f5f5" } :
        sceneBg === "gradient" ? { background: "linear-gradient(135deg,#e8e8e8 0%,#fff 50%,#e8e8e8 100%)" } : {}),
  }

  return (
    <>
      {/* Keyframe animations + slider style */}
      <style>{`
        .g3d-float { animation: g3dFloat 4s ease-in-out infinite; }
        .g3d-pulse  { animation: g3dPulse 2s ease-in-out infinite; }
        .g3d-spin   { animation: g3dSpin 6s linear infinite; }
        @keyframes g3dFloat {
          0%,100% { transform: translateY(0) rotateX(10deg) rotateY(-10deg); }
          25%     { transform: translateY(-15px) rotateX(15deg) rotateY(-5deg); }
          50%     { transform: translateY(-25px) rotateX(10deg) rotateY(10deg); }
          75%     { transform: translateY(-10px) rotateX(5deg) rotateY(5deg); }
        }
        @keyframes g3dPulse {
          0%,100% { transform: scale(1) rotateY(0deg); }
          50%     { transform: scale(1.05) rotateY(5deg); }
        }
        @keyframes g3dSpin {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .g3d-checker {
          background-image:
            linear-gradient(45deg,#f0f0f0 25%,transparent 25%),
            linear-gradient(-45deg,#f0f0f0 25%,transparent 25%),
            linear-gradient(45deg,transparent 75%,#f0f0f0 75%),
            linear-gradient(-45deg,transparent 75%,#f0f0f0 75%);
          background-size: 16px 16px;
          background-position: 0 0,0 8px,8px -8px,-8px 0;
        }
        .g3d-slider { width:100%; height:6px; background:#e5e5e5; border-radius:3px; outline:none; cursor:pointer; appearance:none; }
        .g3d-slider:hover { background:#d4d4d4; }
        .g3d-slider::-webkit-slider-thumb { appearance:none; width:18px; height:18px; background:#000; border-radius:50%; cursor:pointer; border:2px solid #fff; box-shadow:0 0 0 1px #000; }
        .g3d-slider::-moz-range-thumb { width:18px; height:18px; background:#000; border-radius:50%; cursor:pointer; border:2px solid #fff; box-shadow:0 0 0 1px #000; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-black text-white px-6 py-3 rounded-xl text-sm font-medium pointer-events-none shadow-lg" role="status" aria-live="polite">
          {toast}
        </div>
      )}

      <div className="space-y-6">
        {/* Upload zone (shown when no custom image; demo always loads) */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {imageLoaded ? "Change Image" : "Upload Image"}
          </button>
          <span className="text-sm text-gray-400">or drag & drop / paste from clipboard</span>
          {dimensions && <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">{dimensions}</span>}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} aria-label="Choose image file" />

        {/* Main tool area */}
        <div
          className={`grid lg:grid-cols-[1fr_360px] gap-6 ${isDragOver ? "ring-2 ring-black ring-offset-2 rounded-2xl" : ""}`}
          onDragEnter={e => { e.preventDefault(); setIsDragOver(true) }}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          {/* LEFT: 3D Scene */}
          <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <button title="Mouse 3D Track (follows cursor)"
                  onClick={() => { setMouseTrack(v => !v); if (currentAnimation) setCurrentAnimation(null) }}
                  className={`p-2 rounded-lg transition-colors text-xs font-medium flex items-center gap-1.5 ${mouseTrack ? "bg-black text-white" : "text-black  dark:text-white hover:bg-gray-100"}`}
                  aria-pressed={mouseTrack}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/></svg>
                  Track
                </button>
                <button title="Reflection"
                  onClick={() => setReflection(v => !v)}
                  className={`p-2 rounded-lg transition-colors text-xs font-medium ${reflection ? "bg-black text-white" : "text-black  dark:text-white hover:bg-gray-100"}`}
                  aria-pressed={reflection}
                >
                  Reflect
                </button>
                <button title="Ground Shadow"
                  onClick={() => setShadow(v => !v)}
                  className={`p-2 rounded-lg transition-colors text-xs font-medium ${shadow ? "bg-black text-white" : "text-black  dark:text-white hover:bg-gray-100"}`}
                  aria-pressed={shadow}
                >
                  Shadow
                </button>
              </div>
              <button title="Reset All (Ctrl+Z)" onClick={handleResetAll} className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors" aria-label="Reset all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              </button>
            </div>

            {/* Scene */}
            <div
              ref={sceneRef}
              className={`rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center min-h-[400px] relative ${sceneBg === "checkerboard" ? "g3d-checker" : ""}`}
              style={sceneContainerStyle}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative z-10 p-10">
                <div className="relative inline-block">
                  {imageSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      ref={imgRef}
                      src={imageSrc}
                      alt="Image with 3D transform applied"
                      className={`max-w-full max-h-[420px] rounded-lg block ${animClass}`}
                      style={imgStyle}
                      crossOrigin="anonymous"
                    />
                  )}
                  {reflection && imageSrc && (
                    <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom: "-60%", height: "60%", transform: "scaleY(-1)", opacity: 0.15, maskImage: "linear-gradient(to bottom,rgba(0,0,0,0.4),transparent)", WebkitMaskImage: "linear-gradient(to bottom,rgba(0,0,0,0.4),transparent)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageSrc} alt="" className="w-full h-full object-cover rounded-lg" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {shadow && (
                  <div className="absolute pointer-events-none" style={{ bottom: -30, left: "10%", right: "10%", height: 40, background: "radial-gradient(ellipse,rgba(0,0,0,0.2) 0%,transparent 70%)", filter: "blur(8px)" }} />
                )}
              </div>
            </div>

            {/* Background selector */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs text-black  dark:text-white font-medium">Scene BG:</span>
              {(["white","black","gray","checkerboard","gradient"] as SceneBg[]).map(bg => (
                <button
                  key={bg}
                  onClick={() => setSceneBg(bg)}
                  title={bg}
                  aria-pressed={sceneBg === bg}
                  aria-label={`${bg} background`}
                  className={`w-6 h-6 rounded-full border-2 transition-colors ${sceneBg === bg ? "border-black scale-110" : "border-gray-300 hover:border-gray-500"} ${bg === "checkerboard" ? "g3d-checker" : ""}`}
                  style={
                    bg === "white"    ? { background: "#fff" } :
                    bg === "black"    ? { background: "#000" } :
                    bg === "gray"     ? { background: "#e5e5e5" } :
                    bg === "gradient" ? { background: "linear-gradient(135deg,#e0e0e0,#fff)" } : {}
                  }
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Controls panel */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-fit lg:sticky lg:top-24">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto" role="tablist" aria-label="Controls">
              {(["transform","filters","presets","export"] as TabId[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={`flex-1 px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === tab ? "bg-black text-white" : "text-gray-400 hover:text-gray-700"}`}
                >
                  {tab === "transform" ? "3D" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-4 max-h-[600px] overflow-y-auto space-y-4">

              {/* ── 3D Tab ── */}
              {activeTab === "transform" && (
                <div className="space-y-4">
                  <SliderRow label="Perspective"         min={100}  max={3000} step={10}   value={perspective}  onChange={setPerspective}  fmt={v => `${v}px`} />
                  <SliderRow label="Rotate X"            min={-180} max={180}  step={1}    value={rotateX}      onChange={setRotateX}      fmt={v => `${v}°`} />
                  <SliderRow label="Rotate Y"            min={-180} max={180}  step={1}    value={rotateY}      onChange={setRotateY}      fmt={v => `${v}°`} />
                  <SliderRow label="Rotate Z"            min={-180} max={180}  step={1}    value={rotateZ}      onChange={setRotateZ}      fmt={v => `${v}°`} />
                  <SliderRow label="Translate X"         min={-200} max={200}  step={1}    value={translateX}   onChange={setTranslateX}   fmt={v => `${v}px`} />
                  <SliderRow label="Translate Y"         min={-200} max={200}  step={1}    value={translateY}   onChange={setTranslateY}   fmt={v => `${v}px`} />
                  <SliderRow label="Translate Z (Depth)" min={-500} max={500}  step={5}    value={translateZ}   onChange={setTranslateZ}   fmt={v => `${v}px`} />
                  <SliderRow label="Scale"               min={0.1}  max={3}    step={0.05} value={scale}        onChange={setScale}        fmt={v => v.toFixed(2)} />
                  <SliderRow label="Skew X"              min={-45}  max={45}   step={1}    value={skewX}        onChange={setSkewX}        fmt={v => `${v}°`} />
                  <SliderRow label="Skew Y"              min={-45}  max={45}   step={1}    value={skewY}        onChange={setSkewY}        fmt={v => `${v}°`} />
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-black  dark:text-white mb-2">Animations</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(["float","pulse","spin"] as const).map(type => (
                        <button key={type} onClick={() => toggleAnimation(type)}
                          className={`text-xs font-medium py-2 rounded-lg border transition-colors capitalize ${currentAnimation === type ? "bg-black text-white border-black" : "border-gray-200 hover:border-gray-400"}`}
                        >{type}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleResetTransform} className="w-full py-2 rounded-lg border border-gray-200 text-sm font-medium text-black  dark:text-white hover:border-black hover:text-black transition-colors">
                    Reset 3D Transforms
                  </button>
                </div>
              )}

              {/* ── Filters Tab ── */}
              {activeTab === "filters" && (
                <div className="space-y-4">
                  <SliderRow label="Brightness"   min={0}   max={300} step={1}   value={brightness}  onChange={setBrightness}  fmt={v => `${v}%`} />
                  <SliderRow label="Contrast"     min={0}   max={300} step={1}   value={contrast}    onChange={setContrast}    fmt={v => `${v}%`} />
                  <SliderRow label="Saturation"   min={0}   max={300} step={1}   value={saturate}    onChange={setSaturate}    fmt={v => `${v}%`} />
                  <SliderRow label="Blur"         min={0}   max={20}  step={0.5} value={blur}        onChange={setBlur}        fmt={v => `${v}px`} />
                  <SliderRow label="Grayscale"    min={0}   max={100} step={1}   value={grayscale}   onChange={setGrayscale}   fmt={v => `${v}%`} />
                  <SliderRow label="Sepia"        min={0}   max={100} step={1}   value={sepia}       onChange={setSepia}       fmt={v => `${v}%`} />
                  <SliderRow label="Hue Rotate"   min={0}   max={360} step={1}   value={hueRotate}   onChange={setHueRotate}   fmt={v => `${v}°`} />
                  <SliderRow label="Invert"       min={0}   max={100} step={1}   value={invert}      onChange={setInvert}      fmt={v => `${v}%`} />
                  <SliderRow label="Opacity"      min={0}   max={100} step={1}   value={opacity}     onChange={setOpacity}     fmt={v => `${v}%`} />
                  <SliderRow label="Drop Shadow"  min={0}   max={40}  step={1}   value={dropShadow}  onChange={setDropShadow}  fmt={v => `${v}px`} />
                  <button onClick={handleResetFilters} className="w-full py-2 rounded-lg border border-gray-200 text-sm font-medium text-black  dark:text-white hover:border-black hover:text-black transition-colors">
                    Reset Filters
                  </button>
                </div>
              )}

              {/* ── Presets Tab ── */}
              {activeTab === "presets" && (
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((p, i) => (
                    <button key={p.name} onClick={() => applyPreset(i)}
                      aria-label={`Apply ${p.name} preset`} aria-pressed={activePreset === i}
                      className={`border rounded-xl p-3 text-center transition-all hover:-translate-y-0.5 ${activePreset === i ? "border-black bg-black text-white shadow-md" : "border-gray-200 hover:border-gray-400 hover:shadow-sm"}`}
                    >
                      <div className="text-xl mb-0.5">{p.icon}</div>
                      <div className="text-xs font-semibold">{p.name}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* ── Export Tab ── */}
              {activeTab === "export" && (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium mb-2">Format</p>
                    <div className="flex gap-2">
                      {(["png","jpeg"] as const).map(fmt => (
                        <button key={fmt} onClick={() => setExportFormat(fmt)}
                          className={`flex-1 py-2 rounded-lg border text-sm font-semibold uppercase transition-colors ${exportFormat === fmt ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                        >{fmt}</button>
                      ))}
                    </div>
                  </div>
                  <SliderRow label="Export Scale"   min={0.5} max={4}   step={0.5} value={exportScale}   onChange={setExportScale}   fmt={v => `${v}x`} />
                  <SliderRow label="Quality"        min={10}  max={100} step={5}   value={exportQuality} onChange={setExportQuality} fmt={v => `${v}%`} />
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Export Background</label>
                    <select value={exportBg} onChange={e => setExportBg(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                    >
                      <option value="transparent">Transparent</option>
                      <option value="white">White</option>
                      <option value="black">Black</option>
                      <option value="scene">Match Scene BG</option>
                    </select>
                  </div>
                  <button onClick={handleExport} className="w-full py-3 rounded-xl bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download (Ctrl+E)
                  </button>
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Generated CSS</span>
                      <button onClick={handleCopyCSS} className="text-xs font-medium text-black  dark:text-white hover:text-black transition-colors px-2 py-1 rounded hover:bg-gray-100">Copy</button>
                    </div>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto leading-relaxed">{cssCode}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

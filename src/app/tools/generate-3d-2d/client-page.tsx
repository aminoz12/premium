"use client"

import { useState, useRef, useEffect, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
type PresetId = "flat" | "float3d" | "tilt" | "vintage" | "glitch" | "noir" | "neon" | "dream" | "mirror"

interface Transforms {
  rotate: number; scale: number; skewX: number; skewY: number
  flipX: boolean; flipY: boolean
  rotateX: number; rotateY: number; rotateZ: number
  perspective: number; translateZ: number
}

interface Filters {
  brightness: number; contrast: number; saturate: number
  hueRotate: number; blur: number
  grayscale: boolean; sepia: boolean; invert: boolean; opacity: number
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_TRANSFORMS: Transforms = {
  rotate: 0, scale: 1, skewX: 0, skewY: 0,
  flipX: false, flipY: false,
  rotateX: 0, rotateY: 0, rotateZ: 0,
  perspective: 1000, translateZ: 0,
}

const DEFAULT_FILTERS: Filters = {
  brightness: 100, contrast: 100, saturate: 100,
  hueRotate: 0, blur: 0,
  grayscale: false, sepia: false, invert: false, opacity: 1,
}

// ─── Presets ──────────────────────────────────────────────────────────────────
const PRESETS: { id: PresetId; label: string; icon: string }[] = [
  { id: "flat",    label: "Flat",     icon: "⬜" },
  { id: "float3d", label: "Float 3D", icon: "🌐" },
  { id: "tilt",    label: "Tilt",     icon: "📐" },
  { id: "vintage", label: "Vintage",  icon: "📷" },
  { id: "glitch",  label: "Glitch",   icon: "📺" },
  { id: "noir",    label: "Noir",     icon: "🎞️" },
  { id: "neon",    label: "Neon",     icon: "💫" },
  { id: "dream",   label: "Dream",    icon: "🌙" },
  { id: "mirror",  label: "Mirror",   icon: "🪞" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildTransform(t: Transforms): string {
  let str = ""
  str += `rotate(${t.rotate}deg) `
  str += `scale(${t.scale}) `
  str += `skewX(${t.skewX}deg) skewY(${t.skewY}deg) `
  if (t.flipX) str += "scaleX(-1) "
  if (t.flipY) str += "scaleY(-1) "
  str += `rotateX(${t.rotateX}deg) rotateY(${t.rotateY}deg) rotateZ(${t.rotateZ}deg) `
  str += `translateZ(${t.translateZ}px)`
  return str.trim()
}

function buildFilter(f: Filters): string {
  let str = ""
  str += `brightness(${f.brightness}%) `
  str += `contrast(${f.contrast}%) `
  str += `saturate(${f.saturate}%) `
  str += `hue-rotate(${f.hueRotate}deg) `
  str += `blur(${f.blur}px) `
  if (f.grayscale) str += "grayscale(1) "
  if (f.sepia)     str += "sepia(1) "
  if (f.invert)    str += "invert(1) "
  return str.trim()
}

// ─── Slider Row ───────────────────────────────────────────────────────────────
function SliderRow({ label, min, max, step, value, onChange, fmt }: {
  label: string; min: number; max: number; step: number; value: number
  onChange: (v: number) => void; fmt: (v: number) => string
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-sm text-gray-300">{label}</label>
        <span className="text-sm font-mono text-white">{fmt(value)}</span>
      </div>
      <input
        type="range" className="pd-slider"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        aria-label={label}
      />
    </div>
  )
}

// ─── Toggle Button ────────────────────────────────────────────────────────────
function ToggleBtn({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors ${active ? "bg-white/10 border-white/30 text-white" : "border-white/20 text-gray-400 hover:bg-white/5"}`}
    >
      {label}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Generate3D2DClient() {
  const fileInputRef   = useRef<HTMLInputElement>(null)
  const imgRef         = useRef<HTMLImageElement>(null)
  const containerRef   = useRef<HTMLDivElement>(null)
  const toastTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [imageSrc, setImageSrc]       = useState<string | null>(null)
  const [transforms, setTransforms]   = useState<Transforms>(DEFAULT_TRANSFORMS)
  const [filters, setFilters]         = useState<Filters>(DEFAULT_FILTERS)
  const [animation, setAnimation]     = useState<string | null>(null)
  const [activePreset, setActivePreset] = useState<PresetId | null>(null)
  const [isDragOver, setIsDragOver]   = useState(false)
  const [toast, setToast]             = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null)
  const [fileName, setFileName]       = useState<string | null>(null)

  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "info") => {
    setToast({ msg, type })
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(null), 3000)
  }, [])

  // Derived styles
  const transformStr = buildTransform(transforms)
  const filterStr    = buildFilter(filters)

  const imgStyle: React.CSSProperties = {
    transform: transformStr,
    filter: filterStr,
    opacity: filters.opacity,
    animation: animation ?? "",
    transition: "transform 0.3s ease, filter 0.3s ease",
    maxWidth: "100%",
    maxHeight: "420px",
    display: "block",
    borderRadius: "0.75rem",
  }

  // File handling
  function handleFile(file: File) {
    const validTypes = ["image/jpeg","image/jpg","image/png","image/webp","image/gif"]
    if (!validTypes.includes(file.type)) { showToast("Please upload a valid image (JPG, PNG, WEBP, or GIF).", "error"); return }
    if (file.size > 10 * 1024 * 1024) { showToast("File is too large. Maximum size is 10 MB.", "error"); return }
    const reader = new FileReader()
    reader.onload = e => {
      setImageSrc(e.target?.result as string)
      setFileName(file.name)
      showToast("Image loaded successfully!", "success")
    }
    reader.readAsDataURL(file)
  }

  function updateTransform(key: keyof Transforms, value: number | boolean) {
    setTransforms(prev => ({ ...prev, [key]: value }))
  }

  function updateFilter(key: keyof Filters, value: number | boolean) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function resetAll() {
    setTransforms(DEFAULT_TRANSFORMS)
    setFilters(DEFAULT_FILTERS)
    setAnimation(null)
    setActivePreset(null)
  }

  function applyPreset(id: PresetId) {
    resetAll()
    setActivePreset(id)
    switch (id) {
      case "flat": break
      case "float3d":
        setTransforms(prev => ({ ...prev, rotateY: 10, perspective: 800 }))
        setAnimation("pd3dFloat 6s ease-in-out infinite")
        break
      case "tilt":
        setTransforms(prev => ({ ...prev, rotateY: 15, perspective: 600 }))
        break
      case "vintage":
        setFilters(prev => ({ ...prev, sepia: true, contrast: 120, saturate: 80 }))
        break
      case "glitch":
        setAnimation("pd3dGlitch 2s infinite")
        setFilters(prev => ({ ...prev, contrast: 130 }))
        break
      case "noir":
        setFilters(prev => ({ ...prev, grayscale: true, contrast: 130, brightness: 90 }))
        break
      case "neon":
        setFilters(prev => ({ ...prev, saturate: 150, contrast: 120 }))
        break
      case "dream":
        setFilters(prev => ({ ...prev, blur: 1, saturate: 130 }))
        setAnimation("pd3dFloat 8s ease-in-out infinite")
        break
      case "mirror":
        setTransforms(prev => ({ ...prev, flipX: true }))
        break
    }
    showToast(`Applied "${PRESETS.find(p => p.id === id)?.label}" preset`, "success")
  }

  function downloadImage() {
    if (!imageSrc || !imgRef.current) { showToast("Please upload an image first.", "error"); return }
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width; canvas.height = img.height
      const ctx = canvas.getContext("2d")!
      ctx.filter = filterStr
      ctx.drawImage(img, 0, 0)
      const link = document.createElement("a")
      link.download = "pixeldepth-transformed.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
      showToast("Image downloaded!", "success")
    }
    img.src = imageSrc
  }

  function copyCSSCode() {
    if (!imageSrc) { showToast("Please upload an image first.", "error"); return }
    const css = `.transformed-image {\n  transform: ${transformStr};\n  filter: ${filterStr};\n  opacity: ${filters.opacity};\n  perspective: ${transforms.perspective}px;\n  transform-style: preserve-3d;\n}`
    navigator.clipboard.writeText(css)
      .then(() => showToast("CSS copied to clipboard!", "success"))
      .catch(() => showToast("Failed to copy CSS.", "error"))
  }

  // Mouse 3D on preview
  function handlePreviewMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!imageSrc || !imgRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rX = ((y - rect.height / 2) / rect.height) * -10
    const rY = ((x - rect.width / 2) / rect.width) * 10
    imgRef.current.style.transform = transformStr + ` rotateX(${rX}deg) rotateY(${rY}deg)`
  }

  function handlePreviewMouseLeave() {
    if (imgRef.current) imgRef.current.style.transform = transformStr
  }

  const toastBg = toast?.type === "success" ? "bg-green-700" : toast?.type === "error" ? "bg-red-700" : "bg-gray-700"

  return (
    <>
      {/* Keyframes + slider */}
      <style>{`
        @keyframes pd3dFloat {
          0%,100% { transform: translateY(0) rotateY(10deg); }
          50%      { transform: translateY(-20px) rotateY(-5deg); }
        }
        @keyframes pd3dGlitch {
          0%,100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
          10%     { clip-path: inset(10% 0 80% 0); transform: translate(-4px,2px); }
          20%     { clip-path: inset(40% 0 40% 0); transform: translate(4px,-2px); }
          30%     { clip-path: inset(70% 0 10% 0); transform: translate(-2px,4px); }
          40%     { clip-path: inset(0 0 0 0);     transform: translate(0); }
        }
        .pd-slider { width:100%; height:4px; background:rgba(255,255,255,0.15); border-radius:2px; outline:none; cursor:pointer; appearance:none; }
        .pd-slider:hover { background:rgba(255,255,255,0.25); }
        .pd-slider::-webkit-slider-thumb { appearance:none; width:16px; height:16px; background:#fff; border-radius:50%; cursor:pointer; }
        .pd-slider::-moz-range-thumb { width:16px; height:16px; background:#fff; border-radius:50%; cursor:pointer; border:none; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] ${toastBg} text-white px-6 py-3 rounded-xl text-sm font-medium pointer-events-none shadow-lg`} role="alert">
          {toast.msg}
        </div>
      )}

      <div className="bg-black text-white rounded-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">

          {/* LEFT: Upload + Controls */}
          <div className="p-6 space-y-6 border-r border-white/10">

            {/* Drop Zone */}
            <div
              className={`rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${isDragOver ? "border-white bg-white/5" : "border-white/20 hover:border-white/40"}`}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click() }}}
              onDragEnter={e => { e.preventDefault(); setIsDragOver(true) }}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
              role="button"
              tabIndex={0}
              aria-label="Upload image: drag and drop or click to browse"
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} aria-label="Select image" />
              {fileName ? (
                <>
                  <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p className="text-green-400 font-medium">{fileName}</p>
                  <p className="text-xs text-gray-600 mt-1">Click to upload a different image</p>
                </>
              ) : (
                <>
                  <svg className="mx-auto mb-4 text-black  dark:text-white w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M24 32V12M24 12L16 20M24 12L32 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 32V36C8 38.2091 9.79086 40 12 40H36C38.2091 40 40 38.2091 40 36V32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p className="text-gray-400 mb-1">Drag & drop your image here</p>
                  <p className="text-sm text-gray-600">or <span className="text-white underline">browse files</span></p>
                  <p className="text-xs text-gray-700 mt-3">JPG, PNG, WEBP • Max 10 MB</p>
                </>
              )}
            </div>

            {/* Controls (only shown after image loaded) */}
            {imageSrc && (
              <div className="space-y-6">
                {/* 2D Transforms */}
                <section aria-labelledby="2d-transforms">
                  <h3 id="2d-transforms" className="text-base font-semibold mb-4 text-gray-200">2D Transforms</h3>
                  <div className="space-y-4">
                    <SliderRow label="Rotate"  min={-180} max={180} step={1}   value={transforms.rotate}  onChange={v => updateTransform("rotate", v)}  fmt={v => `${v}°`} />
                    <SliderRow label="Scale"   min={0.5}  max={2}   step={0.1} value={transforms.scale}   onChange={v => updateTransform("scale", v)}   fmt={v => `${v}x`} />
                    <div className="grid grid-cols-2 gap-4">
                      <SliderRow label="Skew X" min={-45} max={45} step={1} value={transforms.skewX} onChange={v => updateTransform("skewX", v)} fmt={v => `${v}°`} />
                      <SliderRow label="Skew Y" min={-45} max={45} step={1} value={transforms.skewY} onChange={v => updateTransform("skewY", v)} fmt={v => `${v}°`} />
                    </div>
                    <div className="flex gap-2">
                      <ToggleBtn label="Flip X" active={transforms.flipX} onToggle={() => updateTransform("flipX", !transforms.flipX)} />
                      <ToggleBtn label="Flip Y" active={transforms.flipY} onToggle={() => updateTransform("flipY", !transforms.flipY)} />
                      <button onClick={() => { setTransforms(prev => ({ ...prev, rotate:0, scale:1, skewX:0, skewY:0, flipX:false, flipY:false })) }} className="flex-1 px-3 py-2 rounded-lg border border-white/20 text-sm text-gray-400 hover:bg-white/5 transition-colors">Reset</button>
                    </div>
                  </div>
                </section>

                {/* 3D Transforms */}
                <section aria-labelledby="3d-transforms">
                  <h3 id="3d-transforms" className="text-base font-semibold mb-4 text-gray-200">3D Transforms</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <SliderRow label="Rotate X"  min={-90}  max={90}   step={1} value={transforms.rotateX}  onChange={v => updateTransform("rotateX", v)}  fmt={v => `${v}°`} />
                      <SliderRow label="Rotate Y"  min={-90}  max={90}   step={1} value={transforms.rotateY}  onChange={v => updateTransform("rotateY", v)}  fmt={v => `${v}°`} />
                      <SliderRow label="Rotate Z"  min={-180} max={180}  step={1} value={transforms.rotateZ}  onChange={v => updateTransform("rotateZ", v)}  fmt={v => `${v}°`} />
                    </div>
                    <SliderRow label="Perspective" min={100}  max={2000} step={50} value={transforms.perspective} onChange={v => updateTransform("perspective", v)} fmt={v => `${v}px`} />
                    <SliderRow label="Translate Z" min={-300} max={300}  step={10} value={transforms.translateZ}  onChange={v => updateTransform("translateZ", v)}  fmt={v => `${v}px`} />
                  </div>
                </section>

                {/* Filters */}
                <section aria-labelledby="filters">
                  <h3 id="filters" className="text-base font-semibold mb-4 text-gray-200">Filters</h3>
                  <div className="space-y-4">
                    <SliderRow label="Brightness" min={0}   max={200} step={1} value={filters.brightness} onChange={v => updateFilter("brightness", v)} fmt={v => `${v}%`} />
                    <SliderRow label="Contrast"   min={0}   max={200} step={1} value={filters.contrast}   onChange={v => updateFilter("contrast", v)}   fmt={v => `${v}%`} />
                    <SliderRow label="Saturation" min={0}   max={300} step={1} value={filters.saturate}   onChange={v => updateFilter("saturate", v)}   fmt={v => `${v}%`} />
                    <SliderRow label="Hue Rotate" min={0}   max={360} step={1} value={filters.hueRotate}  onChange={v => updateFilter("hueRotate", v)}  fmt={v => `${v}°`} />
                    <SliderRow label="Blur"        min={0}   max={10}  step={0.5} value={filters.blur}    onChange={v => updateFilter("blur", v)}        fmt={v => `${v}px`} />
                    <div className="flex gap-2 flex-wrap">
                      <ToggleBtn label="Grayscale" active={filters.grayscale} onToggle={() => updateFilter("grayscale", !filters.grayscale)} />
                      <ToggleBtn label="Sepia"     active={filters.sepia}     onToggle={() => updateFilter("sepia",     !filters.sepia)}     />
                      <ToggleBtn label="Invert"    active={filters.invert}    onToggle={() => updateFilter("invert",    !filters.invert)}    />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-gray-300">Opacity</span>
                        <span className="text-sm font-mono text-white">{Math.round(filters.opacity * 100)}%</span>
                      </div>
                      <input type="range" className="pd-slider" min={0} max={1} step={0.05} value={filters.opacity} onChange={e => updateFilter("opacity", parseFloat(e.target.value))} aria-label="Opacity" />
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* RIGHT: Preview + Presets + Export */}
          <div className="p-6 space-y-6 flex flex-col">

            {/* Preview */}
            <div
              ref={containerRef}
              className="rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center min-h-[300px] overflow-hidden relative cursor-default"
              style={{ perspective: `${transforms.perspective}px` }}
              onMouseMove={handlePreviewMouseMove}
              onMouseLeave={handlePreviewMouseLeave}
            >
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img ref={imgRef} src={imageSrc} alt="Image with 2D/3D transform and filter effects applied" style={imgStyle} />
              ) : (
                <div className="text-center text-gray-600 p-8">
                  <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p className="text-sm">Upload an image to preview transforms</p>
                </div>
              )}
            </div>

            {/* Presets */}
            <section aria-labelledby="presets-heading">
              <h3 id="presets-heading" className="text-base font-semibold mb-3 text-gray-200">Presets</h3>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    aria-pressed={activePreset === p.id}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${activePreset === p.id ? "bg-white text-black border-white" : "border-white/20 text-gray-300 hover:bg-white/5 hover:border-white/40"}`}
                  >
                    <span className="text-base">{p.icon}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Export */}
            <section aria-labelledby="export-heading" className="space-y-3 mt-auto">
              <h3 id="export-heading" className="text-base font-semibold text-gray-200">Export</h3>
              <div className="flex gap-3">
                <button
                  onClick={downloadImage}
                  className="flex-1 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  Download PNG
                </button>
                <button
                  onClick={copyCSSCode}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  Copy CSS
                </button>
              </div>
              <button onClick={resetAll} className="w-full py-2 rounded-xl border border-white/10 text-sm text-black  dark:text-white hover:bg-white/5 transition-colors">
                Reset All
              </button>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

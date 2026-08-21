import { useRef, useState, useCallback } from "react";
import { useLocation } from "./router";
import { Upload, Film, Link2, Play, Scissors, Minimize2, RefreshCw, Mic, Type, Zap } from "lucide-react";

const TOOLS = [
  {
    icon: <Scissors size={18} />,
    title: "Trim & Cut Video",
    desc: "Drag handles to set in/out points. Split clips at the playhead with one click.",
    color: "hsl(262 83% 68%)",
    badge: "60M+ searches/mo",
  },
  {
    icon: <Minimize2 size={18} />,
    title: "Compress Video",
    desc: "Shrink file size with quality presets. Perfect for WhatsApp, email, and social media limits.",
    color: "hsl(200 83% 60%)",
    badge: "50M+ searches/mo",
  },
  {
    icon: <RefreshCw size={18} />,
    title: "Convert Video Format",
    desc: "MP4 → MP4, MOV → MP4, any format. iPhone users: convert HEVC to MP4 instantly.",
    color: "hsl(150 70% 50%)",
    badge: "45M+ searches/mo",
  },
  {
    icon: <Film size={18} />,
    title: "Video to GIF",
    desc: "Turn any video clip into a high-quality animated GIF with palettegen optimization.",
    color: "hsl(40 90% 60%)",
    badge: "30M+ searches/mo",
  },
  {
    icon: <Type size={18} />,
    title: "Add Subtitles",
    desc: "Import .SRT files or type subtitles manually. Burn into video on export.",
    color: "hsl(320 75% 62%)",
    badge: "25M+ searches/mo",
  },
  {
    icon: <Mic size={18} />,
    title: "Extract Audio",
    desc: "Download the audio from any video as MP3 or WAV — great for podcasters and lectures.",
    color: "hsl(0 75% 62%)",
    badge: "20M+ searches/mo",
  },
];

export default function HomePage() {
  const [, navigate] = useLocation();
  const [dragging, setDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEditor = (src: string, name: string, type: "file" | "url") => {
    sessionStorage.setItem("ve_src", src);
    sessionStorage.setItem("ve_name", name);
    sessionStorage.setItem("ve_type", type);
    navigate("/edit");
  };

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    openEditor(url, file.name, "file");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleUrlSubmit = () => {
    setUrlError("");
    const val = urlInput.trim();
    if (!val) return;
    try { new URL(val); } catch { setUrlError("Please enter a valid URL."); return; }
    openEditor(val, val.split("/").pop() || "video", "url");
  };

  const demos = [
    { label: "Big Buck Bunny", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
    { label: "Elephant Dream", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
    { label: "Subaru Outback", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" },
  ];

  const S = {
    bg: "hsl(220 16% 8%)", bg2: "hsl(220 16% 12%)", bg3: "hsl(220 14% 17%)",
    border: "hsl(220 14% 22%)", text: "hsl(220 10% 88%)",
    muted: "hsl(220 10% 50%)", accent: "hsl(262 83% 68%)",
  };

  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: S.text, fontFamily: "system-ui,sans-serif" }}>
      {/* ── Hero ── */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 20px 0", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: S.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Film size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>Video Editor Lite</h1>
        </div>
        <p style={{ color: S.muted, fontSize: 15, margin: "0 0 32px", lineHeight: 1.6 }}>
          Trim, cut, compress, convert and edit videos&nbsp;<strong style={{ color: S.text }}>100% in your browser</strong>.<br />
          No uploads. No server. Completely free.
        </p>

        {/* Upload area */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            cursor: "pointer", borderRadius: 18, border: `2px dashed ${dragging ? S.accent : S.border}`,
            background: dragging ? "hsl(262 40% 14%)" : S.bg2, padding: "36px 20px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            transition: "all 0.2s", marginBottom: 14,
          }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: dragging ? "hsl(262 83% 68% / 0.2)" : S.bg3, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
            <Upload size={26} color={dragging ? S.accent : S.muted} />
          </div>
          <p style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>Drop any video, image, or audio file here</p>
          <p style={{ color: S.muted, fontSize: 12, margin: 0 }}>MP4 · MOV · MP4 · AVI · GIF · MP3 · JPG · PNG</p>
        </div>
        <input ref={fileInputRef} type="file" accept="video/*,image/*,audio/*,.gif" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        {/* URL input */}
        <div style={{ borderRadius: 16, padding: 16, background: S.bg2, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Link2 size={14} color={S.accent} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Or paste a video URL</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" placeholder="https://example.com/video.mp4"
              value={urlInput} onChange={e => { setUrlInput(e.target.value); setUrlError(""); }}
              onKeyDown={e => e.key === "Enter" && handleUrlSubmit()}
              style={{ flex: 1, borderRadius: 10, padding: "8px 12px", fontSize: 13, background: S.bg3, border: `1px solid ${S.border}`, color: S.text, outline: "none" }} />
            <button onClick={handleUrlSubmit}
              style={{ padding: "8px 16px", borderRadius: 10, background: S.accent, border: "none", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              Open
            </button>
          </div>
          {urlError && <p style={{ color: "hsl(0 70% 65%)", fontSize: 12, marginTop: 6 }}>{urlError}</p>}
        </div>

        {/* Demo videos */}
        <div style={{ borderRadius: 16, padding: 16, background: S.bg2, marginBottom: 48 }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: S.muted, margin: "0 0 10px" }}>Try a demo</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {demos.map(d => (
              <button key={d.src} onClick={() => openEditor(d.src, d.label, "url")}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, background: S.bg3, border: `1px solid ${S.border}`, color: S.text, fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                <Play size={14} color={S.accent} style={{ flexShrink: 0 }} />
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Feature Grid ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 64px" }}>
        <h2 style={{ textAlign: "center", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Everything you need to edit video online — free
        </h2>
        <p style={{ textAlign: "center", color: S.muted, fontSize: 13, marginBottom: 32 }}>
          All processing happens locally in your browser using FFmpeg WebAssembly. Your files never leave your device.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
          {TOOLS.map(t => (
            <div key={t.title} onClick={() => fileInputRef.current?.click()}
              style={{ background: S.bg2, border: `1px solid ${S.border}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = t.color)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = S.border)}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${t.color}22`, display: "flex", alignItems: "center", justifyContent: "center", color: t.color, flexShrink: 0 }}>
                  {t.icon}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{t.title}</p>
                  <p style={{ fontSize: 10, color: t.color, margin: 0, fontWeight: 600 }}>{t.badge}</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: S.muted, margin: 0, lineHeight: 1.6 }}>{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div style={{ marginTop: 48, display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {[
            { icon: <Zap size={14} />, txt: "No uploads — runs in browser" },
            { icon: <Film size={14} />, txt: "Powered by FFmpeg WASM" },
            { icon: <Mic size={14} />, txt: "100% free, no sign-up" },
          ].map(({ icon, txt }) => (
            <div key={txt} style={{ display: "flex", alignItems: "center", gap: 6, color: S.muted, fontSize: 12 }}>
              <span style={{ color: S.accent }}>{icon}</span>{txt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

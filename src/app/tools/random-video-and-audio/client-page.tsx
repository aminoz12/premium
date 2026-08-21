"use client";

/**
 * RandomMediaClient.tsx
 * app/tools/random-video-and-audio/RandomMediaClient.tsx
 * Env: NEXT_PUBLIC_PEXELS_API_KEY
 */

import { useState, useRef, useCallback, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════════════ */

type MediaMode = "video" | "audio" | "image" | "all";

interface PexelsVideoFile {
  link: string;
  quality: string;
  file_type: string;
  width: number;
  height: number;
}
interface PexelsVideo {
  id: number;
  url: string;
  image: string;
  duration: number;
  user: { name: string; url: string };
  video_files: PexelsVideoFile[];
  width: number;
  height: number;
}
interface PexelsAudio {
  id: number;
  title: string;
  duration: number;
  artist: string;
  audio_preview_url: string;
  url: string;
}
interface PexelsPhoto {
  id: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt: string;
  width: number;
  height: number;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

type MediaItem =
  | { kind: "video"; data: PexelsVideo }
  | { kind: "audio"; data: PexelsAudio }
  | { kind: "image"; data: PexelsPhoto };

/* ══════════════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════════════ */

const VIDEO_TOPICS = [
  "nature", "ocean", "mountains", "city skyline", "technology", "people working",
  "abstract motion", "travel adventure", "food cooking", "wildlife animals", "outer space",
  "architecture", "forest rain", "sunset golden hour", "night city lights", "drone aerial",
  "sports fitness", "contemporary art", "vintage retro", "water reflections", "fire flames",
  "desert landscape", "wildflowers", "urban street", "minimalist", "coffee shop", "fashion",
  "science laboratory", "meditation yoga", "construction", "underwater", "winter snow",
];

const AUDIO_TOPICS = [
  "ambient chill", "cinematic orchestral", "upbeat pop", "relaxing piano", "electronic synth",
  "jazz saxophone", "classical violin", "acoustic guitar", "lofi hip hop", "meditation bells",
  "corporate background", "epic trailer", "dark atmosphere", "happy positive", "inspirational",
  "nature sounds rain", "deep focus", "drum and bass", "folk acoustic", "tropical summer",
];

const IMAGE_TOPICS = [
  "minimal architecture", "ocean waves", "forest path", "city street photography", "abstract texture",
  "mountain landscape", "technology flat lay", "food photography", "portrait bokeh", "night sky stars",
  "vintage film", "geometric patterns", "flowers macro", "urban graffiti", "desert dunes",
  "cozy interior", "travel landmarks", "sports action", "wildlife close-up", "neon lights",
];

const SUGGESTION_TAGS = [
  "ocean 🌊", "forest 🌲", "city 🏙️", "jazz 🎷", "lofi 🎧", "sunset 🌅",
  "space 🚀", "rain 🌧️", "minimal ◻", "vintage 📷", "nature 🍃", "neon 💜",
  "drone 🛸", "abstract ◈", "wildlife 🦋", "mountain ⛰️", "food 🍜", "fire 🔥",
];

const KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY ?? "";

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════════════════ */

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randPage = () => Math.floor(Math.random() * 25) + 1;

function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

function bestVideo(files: PexelsVideoFile[]): PexelsVideoFile {
  return (
    files.find((f) => f.quality === "uhd") ??
    files.find((f) => f.quality === "hd") ??
    files.find((f) => f.quality === "sd") ??
    files[0]
  );
}

async function pexelsFetch(url: string) {
  const res = await fetch(url, { headers: { Authorization: KEY } });
  if (!res.ok) throw new Error(`Pexels API ${res.status}`);
  return res.json();
}

async function fetchVideo(query: string): Promise<PexelsVideo> {
  const q = query || pick(VIDEO_TOPICS);
  const data = await pexelsFetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=15&page=${randPage()}`
  );
  if (!data.videos?.length) throw new Error("No videos found");
  return pick<PexelsVideo>(data.videos);
}

async function fetchAudio(query: string): Promise<PexelsAudio> {
  const q = query || pick(AUDIO_TOPICS);
  const data = await pexelsFetch(
    `https://api.pexels.com/v1/audio?query=${encodeURIComponent(q)}&per_page=15&page=${randPage()}`
  );
  if (!data.audio?.length) throw new Error("No audio found");
  return pick<PexelsAudio>(data.audio);
}

async function fetchImage(query: string): Promise<PexelsPhoto> {
  const q = query || pick(IMAGE_TOPICS);
  const data = await pexelsFetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=15&page=${randPage()}`
  );
  if (!data.photos?.length) throw new Error("No images found");
  return pick<PexelsPhoto>(data.photos);
}

async function downloadBlob(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    window.open(url, "_blank");
  }
}

/* ══════════════════════════════════════════════════════════════════════════════
   CARD COMPONENTS
══════════════════════════════════════════════════════════════════════════════ */

function VideoCard({ data }: { data: PexelsVideo }) {
  const file = bestVideo(data.video_files);
  const [dl, setDl] = useState(false);

  return (
    <article className="media-card group border border-white/10 hover:border-white/30 transition-all duration-300 bg-zinc-950">
      <div className="relative aspect-video overflow-hidden bg-black">
        <video
          src={file.link}
          poster={data.image}
          controls
          preload="metadata"
          className="w-full h-full object-cover"
          aria-label={`Royalty-free video by ${data.user.name}`}
        />
        <span className="absolute top-2 left-2 text-[10px] font-mono uppercase tracking-widest bg-black/80 text-white/60 px-2 py-1 pointer-events-none">
          {(file?.quality || "HD").toUpperCase()} · {data.width}×{data.height}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-0.5">
              VIDEO · {fmtDuration(data.duration)}s
            </p>
            <a href={data.user.url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-white/50 hover:text-white transition-colors">
              by {data.user.name}
            </a>
          </div>
          <TypeBadge kind="video" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => { setDl(true); await downloadBlob(file.link, `pexels-video-${data.id}.mp4`); setDl(false); }}
            disabled={dl}
            className="btn-primary flex-1"
            aria-label={`Download video by ${data.user.name}`}
          >
            {dl ? "…" : "↓ Download MP4"}
          </button>
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="btn-ghost" aria-label="View on Pexels">↗</a>
        </div>
      </div>
    </article>
  );
}

function AudioCard({ data }: { data: PexelsAudio }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dl, setDl] = useState(false);
  const ref = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!ref.current) return;
    playing ? ref.current.pause() : ref.current.play();
    setPlaying(!playing);
  };

  return (
    <article className="media-card group border border-white/10 hover:border-white/30 transition-all duration-300 bg-zinc-950">
      {/* Waveform */}
      <div className="relative aspect-video bg-black flex flex-col items-center justify-center gap-4 px-6 overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-center gap-px px-4 pb-8 opacity-40">
          {Array.from({ length: 80 }).map((_, i) => {
            const h = 10 + Math.abs(Math.sin(i * 0.4 + data.id * 0.05 + i * 0.07)) * 70;
            return (
              <div key={i}
                className={`w-[2px] rounded-sm transition-all duration-150 ${playing ? "bg-white" : "bg-white/40"}`}
                style={{ height: `${h}%`, animationDelay: `${i * 20}ms` }}
              />
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-white/20 w-full">
          <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <button onClick={toggle}
          className="relative z-10 w-14 h-14 rounded-full border-2 border-white bg-black/80 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-200 active:scale-90"
          aria-label={playing ? "Pause" : "Play"}>
          {playing
            ? <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            : <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
          }
        </button>

        <audio ref={ref} src={data.audio_preview_url}
          onEnded={() => { setPlaying(false); setProgress(0); }}
          onTimeUpdate={() => {
            if (ref.current) setProgress((ref.current.currentTime / (ref.current.duration || 1)) * 100);
          }}
          className="sr-only" />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-0.5">
              AUDIO · {fmtDuration(data.duration)}
            </p>
            <p className="text-sm text-white font-semibold leading-tight line-clamp-1">{data.title}</p>
            <p className="text-xs text-white/40 mt-0.5">{data.artist}</p>
          </div>
          <TypeBadge kind="audio" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => { setDl(true); await downloadBlob(data.audio_preview_url, `pexels-audio-${data.id}.mp3`); setDl(false); }}
            disabled={dl} className="btn-primary flex-1"
            aria-label={`Download audio: ${data.title}`}>
            {dl ? "…" : "↓ Download MP3"}
          </button>
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">↗</a>
        </div>
      </div>
    </article>
  );
}

function ImageCard({ data }: { data: PexelsPhoto }) {
  const [dl, setDl] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <article className="media-card group border border-white/10 hover:border-white/30 transition-all duration-300 bg-zinc-950">
        <div className="relative aspect-video overflow-hidden bg-black cursor-zoom-in" onClick={() => setLightbox(true)}>
          {!loaded && <div className="absolute inset-0 flex items-center justify-center"><Pulse /></div>}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.src.large}
            alt={data.alt || `Photo by ${data.photographer} on Pexels`}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02] ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white/80 text-xs font-mono uppercase tracking-widest transition-all duration-200">
              Click to enlarge
            </span>
          </div>
          <span className="absolute top-2 left-2 text-[10px] font-mono uppercase tracking-widest bg-black/80 text-white/60 px-2 py-1 pointer-events-none">
            {data.width}×{data.height}
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-0.5">PHOTO</p>
              <a href={data.photographer_url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-white/50 hover:text-white transition-colors">
                by {data.photographer}
              </a>
            </div>
            <TypeBadge kind="image" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => { setDl(true); await downloadBlob(data.src.original, `pexels-photo-${data.id}.jpg`); setDl(false); }}
              disabled={dl} className="btn-primary flex-1"
              aria-label={`Download photo by ${data.photographer}`}>
              {dl ? "…" : "↓ Download JPG"}
            </button>
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">↗</a>
          </div>
        </div>
      </article>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)} role="dialog" aria-label="Image preview">
          <button onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white/50 hover:text-white text-xl font-mono"
            aria-label="Close preview">✕</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.src.large2x} alt={data.alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

/* ── Micro Components ── */

function TypeBadge({ kind }: { kind: "video" | "audio" | "image" }) {
  const map = { video: "🎬", audio: "🎵", image: "🖼️" };
  return (
    <span className="text-[10px] font-mono uppercase tracking-widest border border-white/10 px-2 py-1 text-white/30 shrink-0">
      {map[kind]}
    </span>
  );
}

function Pulse() {
  return (
    <div className="w-8 h-8 rounded-full border border-white/20 border-t-white/60 animate-spin" />
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════════════════ */

export default function RandomMediaClient() {
  const [mode, setMode] = useState<MediaMode>("all");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genCount, setGenCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const generate = useCallback(async (overrideQuery?: string) => {
    const q = overrideQuery ?? query;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const tasks: Promise<MediaItem>[] = [];

      const addVideo = () => tasks.push(fetchVideo(q).then((d) => ({ kind: "video" as const, data: d })));
      const addAudio = () => tasks.push(fetchAudio(q).then((d) => ({ kind: "audio" as const, data: d })));
      const addImage = () => tasks.push(fetchImage(q).then((d) => ({ kind: "image" as const, data: d })));

      if (mode === "video") { addVideo(); addVideo(); addVideo(); addVideo(); }
      else if (mode === "audio") { addAudio(); addAudio(); addAudio(); addAudio(); }
      else if (mode === "image") { addImage(); addImage(); addImage(); addImage(); }
      else {
        // "all" — 2 of each shuffled
        addVideo(); addVideo();
        addAudio(); addAudio();
        addImage(); addImage();
      }

      const settled = await Promise.allSettled(tasks);
      const ok = settled
        .filter((r): r is PromiseFulfilledResult<MediaItem> => r.status === "fulfilled")
        .map((r) => r.value);

      if (!ok.length) throw new Error("No results. Try a different keyword or check your Pexels API key.");

      // Shuffle mixed results
      if (mode === "all") ok.sort(() => Math.random() - 0.5);

      setResults(ok);
      setGenCount((c) => c + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [mode, query]);

  // Keyboard shortcut: Enter in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") generate();
  };

  const handleSuggestion = (tag: string) => {
    const clean = tag.replace(/\s*[^\w\s].*$/, "").trim(); // strip emoji
    setQuery(clean);
    generate(clean);
  };
  //replace emoji with icon
  const modes: { label: string; value: MediaMode; icon: string }[] = [
    { label: "Videos", value: "video", icon: "🎬" },
    { label: "Audio", value: "audio", icon: "🎵" },
    { label: "Images", value: "image", icon: "🖼️" },
    { label: "All Media", value: "all", icon: "⚡" },
  ];

  return (
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        .btn-primary{
          padding:.625rem 1rem;background:var(--white);color:var(--black);
          font-size:.7rem;font-family:'DM Mono',monospace;font-weight:700;
          letter-spacing:.1em;text-transform:uppercase;border:none;cursor:pointer;
          transition:opacity .15s,transform .1s;
        }
        .btn-primary:hover{opacity:.85;}
        .btn-primary:active{transform:scale(.97);}
        .btn-primary:disabled{opacity:.35;cursor:not-allowed;}
        .btn-ghost{
          padding:.625rem .875rem;background:transparent;color:var(--soft);
          font-size:.7rem;font-family:'DM Mono',monospace;letter-spacing:.1em;
          border:1px solid var(--dim);cursor:pointer;text-decoration:none;
          display:flex;align-items:center;transition:all .15s;
        }
        .btn-ghost:hover{border-color:var(--mid);color:var(--white);}
        .media-card{display:flex;flex-direction:column;overflow:hidden;}
        .font-display{font-family:'Bebas Neue',sans-serif;}
        .font-mono-custom{font-family:'DM Mono',monospace;}
        .font-body{font-family:'DM Sans',sans-serif;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}
        .fade-up{animation:fadeUp .4s ease both;}
        .fade-up-1{animation-delay:.05s;}
        .fade-up-2{animation-delay:.1s;}
        .fade-up-3{animation-delay:.15s;}
        .fade-up-4{animation-delay:.2s;}
        .fade-up-5{animation-delay:.25s;}
        .fade-up-6{animation-delay:.3s;}
        @keyframes scanline{0%,100%{opacity:.02;}50%{opacity:.05;}}
        .scanline{
          background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.015) 2px,rgba(255,255,255,.015) 4px);
          animation:scanline 8s ease infinite;
        }
      `}</style>

      <div className="min-h-screen bg-black text-white font-body" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Scanline overlay */}
        <div aria-hidden className="scanline pointer-events-none fixed inset-0 z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

          {/* ── Breadcrumb ── */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-widest text-white/25" style={{ fontFamily: "'DM Mono', monospace" }}>
              <li><a href="/" className="hover:text-white/60 transition-colors">Home</a></li>
              <li aria-hidden>/</li>
              <li><a href="/tools" className="hover:text-white/60 transition-colors">Tools</a></li>
              <li aria-hidden>/</li>
              <li className="text-white/50">Random Media</li>
            </ol>
          </nav>

          {/* ── Hero ── */}
          <header className="mb-12 md:mb-16">
            <div className="flex flex-wrap gap-2 mb-5">
              {["Free Tool", "Pexels API", "No Account Needed", "Royalty-Free"].map((t) => (
                <span key={t} className="text-[10px] font-mono-custom uppercase tracking-widest text-white/25 border border-white/10 px-2 py-1"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  {t}
                </span>
              ))}
            </div>

            <h2 className="font-display text-[clamp(3.5rem,10vw,7rem)] leading-none tracking-tight uppercase text-white mb-5"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Random<br />
              <span className="text-white/25">Video · Audio · Images</span>
            </h2>

            <p className="text-base md:text-lg text-white/45 max-w-2xl leading-relaxed">
              Search and download <strong className="text-white/75 font-medium">royalty-free videos, audio tracks, and photos</strong> from
              Pexels — powered by smart keyword discovery. No account. No watermarks. No limits.
            </p>
          </header>

          {/* ── Controls ── */}
          <section aria-label="Media generator controls" className="mb-10 space-y-5">

            {/* Mode tabs */}
            <div className="flex flex-wrap gap-0" role="group" aria-label="Select media type">
              {modes.map((m) => (
                <button key={m.value} onClick={() => setMode(m.value)}
                  aria-pressed={mode === m.value}
                  className="px-4 py-2.5 text-[11px] font-mono-custom font-bold uppercase tracking-widest transition-all duration-150 border-b-2"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    background: mode === m.value ? "#fff" : "transparent",
                    color: mode === m.value ? "#000" : "rgba(255,255,255,0.35)",
                    borderBottomColor: mode === m.value ? "#fff" : "transparent",
                  }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <label htmlFor="media-search" className="sr-only">Search keyword for media</label>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 font-mono-custom text-sm"
                  style={{ fontFamily: "'DM Mono', monospace" }} aria-hidden>⌕</span>
                <input
                  id="media-search"
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search: ocean, jazz, minimal, city…"
                  className="w-full bg-zinc-950 border border-white/15 text-white placeholder-white/20 pl-10 pr-4 py-3 text-sm outline-none focus:border-white/40 transition-colors"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <button onClick={() => generate()}
                disabled={loading}
                className="relative px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-white/85 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "'DM Mono', monospace" }}
                aria-label="Generate random media">
                <span className={loading ? "opacity-0" : "opacity-100"}>
                  {genCount === 0 ? "✦ Generate" : "✦ Regenerate"}
                </span>
                {loading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Pulse />
                  </span>
                )}
              </button>
            </div>

            {/* Suggestion tags */}
            <div className="flex flex-wrap gap-2" aria-label="Quick topic suggestions">
              <span className="text-[10px] font-mono-custom uppercase tracking-widest text-white/20 self-center mr-1"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                Try:
              </span>
              {SUGGESTION_TAGS.map((tag) => (
                <button key={tag}
                  onClick={() => handleSuggestion(tag)}
                  className="text-[11px] font-mono-custom px-3 py-1 border border-white/10 text-white/35 hover:border-white/35 hover:text-white/70 transition-all duration-150 hover:bg-white/5"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* ── Error ── */}
          {error && (
            <div role="alert" className="mb-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-white/60 font-mono-custom"
              style={{ fontFamily: "'DM Mono', monospace" }}>
              <span className="text-red-400">Error:</span> {error}
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin" />
              <p className="text-xs font-mono-custom uppercase tracking-widest text-white/25"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                Fetching from Pexels…
              </p>
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && !results.length && !error && (
            <div className="border border-dashed border-white/8 p-16 md:p-24 text-center">
              <p className="text-6xl mb-5 select-none" aria-hidden>◎</p>
              <p className="text-sm font-mono-custom uppercase tracking-widest text-white/20 mb-2"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                Type a keyword or hit Generate
              </p>
              <p className="text-xs text-white/15 font-mono-custom"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                Videos · Audio · Images — all royalty-free from Pexels
              </p>
            </div>
          )}

          {/* ── Results grid ── */}
          {!loading && results.length > 0 && (
            <section aria-label="Media results" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono-custom uppercase tracking-widest text-white/25"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  {results.length} results{query ? ` for "${query}"` : " — random"} · Generation #{genCount}
                </p>
                <button onClick={() => generate()}
                  className="text-[10px] font-mono-custom uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  ↻ Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.map((item, i) => (
                  <div key={`${item.kind}-${i}`} className={`fade-up fade-up-${Math.min(i + 1, 6)}`}>
                    {item.kind === "video" && <VideoCard data={item.data} />}
                    {item.kind === "audio" && <AudioCard data={item.data} />}
                    {item.kind === "image" && <ImageCard data={item.data} />}
                  </div>
                ))}
              </div>

              <p className="text-center text-[10px] font-mono-custom uppercase tracking-widest text-white/15 mt-6"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                Media provided by{" "}
                <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer"
                  className="hover:text-white/40 transition-colors">Pexels</a>
                {" "}· Free to use under the Pexels License
              </p>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              SEO CONTENT SECTIONS
          ══════════════════════════════════════════════════════════════════ */}

          <div className="mt-24 md:mt-32 space-y-20 border-t border-white/8 pt-16">

            {/* What Is */}
            <section aria-labelledby="about-heading">
              <h2 id="about-heading"
                className="font-display text-3xl md:text-4xl uppercase text-white mb-5"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                What Is the Random Media Generator?
              </h2>
              <div className="max-w-3xl space-y-4 text-white/45 leading-relaxed">
                <p>
                  The <strong className="text-white/70">Random Video, Audio & Image Generator</strong> is a free online media discovery tool
                  built on the Pexels API. It removes the friction of browsing stock libraries by surfacing
                  unpredictable, high-quality royalty-free content in seconds — based on your keyword or
                  a randomly chosen topic from our curated list.
                </p>
                <p>
                  Whether you need <strong className="text-white/70">background footage for a YouTube video</strong>,{" "}
                  <strong className="text-white/70">royalty-free music for a podcast</strong>, or{" "}
                  <strong className="text-white/70">free stock photos for a blog</strong>, this tool delivers
                  directly downloadable files with zero accounts, zero watermarks, and zero fees.
                </p>
              </div>
            </section>

            {/* Feature grid */}
            <section aria-labelledby="features-heading">
              <h2 id="features-heading"
                className="font-display text-3xl md:text-4xl uppercase text-white mb-8"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Key Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
                {[
                  { icon: "⌕", title: "Smart Keyword Search", body: "Type any topic — genre, mood, scene, color palette — and the tool queries Pexels for matching royalty-free media across all three types simultaneously." },
                  { icon: "◈", title: "Truly Random Discovery", body: "Leave the search blank and the generator picks from 50+ curated video, audio, and image topics with randomized page offsets — millions of unique combinations." },
                  { icon: "🎬", title: "HD & 4K Video Download", body: "Videos are fetched at the highest available quality — UHD 4K, HD 1080p, or SD — and download directly as MP4 files to your device." },
                  { icon: "🎵", title: "Audio Track Discovery", body: "Explore ambient, cinematic, lofi, jazz, classical, electronic, and 15+ other moods. Preview before downloading as MP3." },
                  { icon: "🖼️", title: "Full-Res Photo Download", body: "Photos are returned at original Pexels resolution and downloadable as high-quality JPG files, with a lightbox preview before saving." },
                  { icon: "⚡", title: "Mixed Media Mode", body: "Switch to All Media to get a shuffled mix of videos, audio tracks, and photos in one generation — ideal for multi-format projects." },
                  { icon: "↓", title: "One-Click Downloads", body: "Every result has a dedicated Download button. Files save directly from the browser — no redirect, no login, no clipboard tricks needed." },
                  { icon: "◌", title: "No Account Required", body: "TheFreeAITools handles Pexels API authentication. Open the page, generate, download — the entire workflow takes under 10 seconds." },
                  { icon: "⬡", title: "Fully Responsive", body: "Optimised for all screen sizes from mobile to widescreen desktop. The grid, player, and download controls adapt automatically." },
                ].map((f) => (
                  <div key={f.title} className="bg-black p-5 hover:bg-white/[0.02] transition-colors">
                    <span className="text-xl block mb-2 text-white/25" aria-hidden>{f.icon}</span>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-2"
                      style={{ fontFamily: "'DM Mono', monospace" }}>
                      {f.title}
                    </h3>
                    <p className="text-xs text-white/35 leading-relaxed">{f.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How To */}
            <section aria-labelledby="howto-heading">
              <h2 id="howto-heading"
                className="font-display text-3xl md:text-4xl uppercase text-white mb-8"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                How to Download Free Media in 5 Steps
              </h2>
              <ol className="space-y-6 max-w-3xl">
                {[
                  { n: "01", title: "Choose Media Type", desc: "Select Videos, Audio, Images, or All Media from the tabs to filter what the generator returns." },
                  { n: "02", title: "Enter a Search Term (Optional)", desc: "Type a keyword — 'ocean sunset', 'lofi hip hop', 'minimal architecture' — for targeted results. Leave it blank for a fully random pick from our curated topic pool." },
                  { n: "03", title: "Click Generate", desc: "Hit Generate to query Pexels with your term and randomized page offset. Results appear in under 2 seconds." },
                  { n: "04", title: "Preview Before Downloading", desc: "Play videos and audio inline. Click any image to open the full-resolution lightbox. No wasted downloads." },
                  { n: "05", title: "Download Directly to Your Device", desc: "Click the Download button to save MP4, MP3, or JPG files directly — no redirects, no extra steps." },
                ].map((s) => (
                  <li key={s.n} className="flex gap-6">
                    <span className="font-display text-4xl text-white/10 shrink-0 w-12 leading-none"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {s.n}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-1"
                        style={{ fontFamily: "'DM Mono', monospace" }}>
                        {s.title}
                      </h3>
                      <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Use Cases */}
            <section aria-labelledby="usecases-heading">
              <h2 id="usecases-heading"
                className="font-display text-3xl md:text-4xl uppercase text-white mb-6"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Who Uses This Tool?
              </h2>
              <p className="text-white/40 max-w-2xl mb-8 leading-relaxed">
                From solo creators to product teams — anyone who needs fast access to quality, license-safe media
                without paying for a subscription or navigating a bloated stock library.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {[
                  { label: "YouTube Creators", desc: "Background footage & music" },
                  { label: "Podcast Producers", desc: "Intro & outro music" },
                  { label: "Web Developers", desc: "Hero videos & placeholders" },
                  { label: "UI/UX Designers", desc: "Moodboard imagery" },
                  { label: "Video Editors", desc: "B-roll & stock footage" },
                  { label: "Marketing Teams", desc: "Social media visuals" },
                  { label: "Educators", desc: "Lesson presentation media" },
                  { label: "Game Developers", desc: "Ambient audio & art refs" },
                  { label: "Bloggers", desc: "Featured images" },
                  { label: "App Developers", desc: "Onboarding visuals" },
                  { label: "Students", desc: "Project presentations" },
                  { label: "Streamers", desc: "Stream overlays & music" },
                ].map((u) => (
                  <div key={u.label} className="border border-white/8 p-3 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-150">
                    <p className="text-xs font-bold text-white/60 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>{u.label}</p>
                    <p className="text-[10px] text-white/25" style={{ fontFamily: "'DM Mono', monospace" }}>{u.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading"
                className="font-display text-3xl md:text-4xl uppercase text-white mb-8"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Frequently Asked Questions
              </h2>
              <dl className="max-w-3xl divide-y divide-white/5">
                {[
                  { q: "Is all the downloaded media royalty-free for commercial use?", a: "Yes. All content is under the Pexels License — free for personal and commercial use, with no attribution required. This covers YouTube, TikTok, Instagram, client work, apps, and more." },
                  { q: "How does the smart keyword search work?", a: "Your keyword is passed directly to the Pexels API search endpoint with a randomized page number (1–25). This means you get different results every time you search the same term, keeping discovery fresh." },
                  { q: "What video quality can I download?", a: "The tool requests the highest quality Pexels provides for each video — UHD (4K) if available, then HD (1080p), then SD. The quality badge on each card shows what you'll get before downloading." },
                  { q: "Why do some audio tracks only preview and not download?", a: "The Pexels audio API returns preview URLs for unlocked tracks. If a direct download fails, clicking the Pexels link takes you to the full track page where you can download after a free login." },
                  { q: "Can I use downloaded video and audio together in one project?", a: "Absolutely. Both are under the same Pexels License, so you can combine them freely in any project — promotional videos, YouTube uploads, podcast episodes, or client deliverables." },
                  { q: "Is there a limit on how many times I can generate?", a: "No limits on TheFreeAITools. Generate as many times as you need. The Pexels API is rate-limited per key but in normal use you'll never encounter it." },
                  { q: "Does this tool work on mobile?", a: "Yes. The layout, grid, video player, audio player, and download buttons are all fully optimized for mobile and tablet screens." },
                  { q: "What file formats are the downloads?", a: "Videos save as .MP4, audio as .MP3, and images as .JPG (or .PNG for photos originally uploaded as PNG to Pexels)." },
                  { q: "Is my search data stored?", a: "No. The tool makes requests directly from your browser to the Pexels API. TheFreeAITools does not log your search queries or download activity." },
                ].map((item) => (
                  <div key={item.q} className="py-5">
                    <dt className="text-sm font-bold text-white/75 mb-2">{item.q}</dt>
                    <dd className="text-sm text-white/35 leading-relaxed">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Related tools */}
            <section aria-labelledby="related-heading">
              <h2 id="related-heading"
                className="font-display text-3xl md:text-4xl uppercase text-white mb-6"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                More Free Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { href: "/tools/background-remover", label: "Background Remover", desc: "Remove image backgrounds instantly — AI-powered, free." },
                  { href: "/tools/image-compressor", label: "Image Compressor", desc: "Compress JPG, PNG, WebP without visible quality loss." },
                  { href: "/tools/text-to-speech", label: "Text to Speech", desc: "Convert any text to natural-sounding audio for free." },
                  { href: "/tools/color-palette", label: "Color Palette Generator", desc: "Generate harmonious color palettes from any image or keyword." },
                  { href: "/tools/video-to-gif", label: "Video to GIF", desc: "Convert MP4 clips to animated GIFs in your browser." },
                  { href: "/tools", label: "Browse All Free Tools →", desc: "Explore the full TheFreeAITools library." },
                ].map((t) => (
                  <a key={t.href} href={t.href}
                    className="border border-white/8 p-4 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-150 group">
                    <p className="text-xs font-bold text-white/60 mb-1 group-hover:text-white/80 transition-colors"
                      style={{ fontFamily: "'DM Mono', monospace" }}>
                      {t.label}
                    </p>
                    <p className="text-[11px] text-white/25">{t.desc}</p>
                  </a>
                ))}
              </div>
            </section>

          </div>

          {/* ── Footer ── */}
          <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[10px] font-mono-custom uppercase tracking-widest text-white/20"
              style={{ fontFamily: "'DM Mono', monospace" }}>
              © {new Date().getFullYear()}{" "}
              <a href="https://www.thefreeaitools.com" className="hover:text-white/50 transition-colors">
                TheFreeAITools.com
              </a>
              {" "}· Free AI-Powered Tools
            </p>
            <p className="text-[10px] font-mono-custom uppercase tracking-widest text-white/15"
              style={{ fontFamily: "'DM Mono', monospace" }}>
              Media by{" "}
              <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-white/40 transition-colors">
                Pexels
              </a>
              {" "}· Pexels License
            </p>
          </footer>

        </div>
      </div>
    </>
  );
}
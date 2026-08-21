import {
  useRef, useState, useCallback, useEffect, useMemo,
} from "react";
import { useLocation } from "./router";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import {
  Upload, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize2, Minimize2, Plus, Trash2, ChevronLeft, Scissors, ZoomIn,
  ZoomOut, Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Music, Image as ImageIcon, Video, Download, Loader2, Layers,
  RefreshCw, X, Film, Mic, Check, AlertCircle, Info,
  FileText, ArrowRightLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ClipEffects {
  brightness: number; contrast: number; saturation: number;
  blur: number; hue: number;
  grayscale: boolean; sepia: boolean; invert: boolean;
}
interface MediaItem {
  id: string; name: string;
  type: "video" | "image" | "audio" | "gif";
  file: File; src: string; duration: number; thumbnail: string;
}
interface Clip {
  id: string; mediaId: string; name: string;
  type: "video" | "image" | "gif";
  src: string; file: File;
  startTime: number; duration: number;
  trimStart: number; trimEnd: number;
  track: number;
  effects: ClipEffects;
  volume: number; muted: boolean; audioRemoved: boolean;
  replacementAudio?: File;
}
interface AudioTrack {
  id: string; name: string; file: File; src: string;
  startTime: number; volume: number;
}
interface TextLayer {
  id: string; text: string;
  x: number; y: number; fontSize: number; color: string;
  bold: boolean; italic: boolean; align: "left" | "center" | "right";
  startTime: number; endTime: number;
  bgColor: string; bgOpacity: number;
}
interface SubLine { id: string; text: string; start: number; end: number; }
type ToastType = "ok" | "err" | "info";
interface Toast { msg: string; type: ToastType; }

// ─── Constants ────────────────────────────────────────────────────────────────
const DEF: ClipEffects = {
  brightness: 100, contrast: 100, saturation: 100,
  blur: 0, hue: 0, grayscale: false, sepia: false, invert: false,
};
const TRACK_H = 56;
const TEXT_COLORS = ["#ffffff", "#fbbf24", "#f87171", "#34d399", "#60a5fa", "#c084fc", "#fb923c", "#000000"];
const FONT_SIZES = [14, 18, 24, 32, 40, 48, 64, 80];
const FFMPEG_CDN = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
const CRF_PRESETS = [
  { label: "Lossless", crf: 18 }, { label: "High", crf: 22 }, { label: "Medium", crf: 28 }, { label: "Low", crf: 35 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const fmtT = (s: number) => {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60), ms = Math.floor((s % 1) * 10);
  return `${m}:${sec.toString().padStart(2, "0")}.${ms}`;
};
const fmtS = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
const srtTs = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60), ms = Math.floor((s % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
};

const parseSrt = (raw: string): SubLine[] => {
  return raw.trim().split(/\n\s*\n/).flatMap(block => {
    const lines = block.trim().split("\n");
    const tl = lines.find(l => l.includes("-->"));
    if (!tl) return [];
    const [a, b] = tl.split("-->").map(t => {
      const c = t.trim().replace(",", ".");
      const p = c.split(":");
      return p.length === 3 ? Number(p[0]) * 3600 + Number(p[1]) * 60 + Number(p[2]) : 0;
    });
    const idx = lines.indexOf(tl);
    const text = lines.slice(idx + 1).join("\n").replace(/<[^>]*>/g, "").trim();
    return text ? [{ id: uid(), text, start: a, end: b }] : [];
  });
};

const toCSS = (e: ClipEffects) => {
  const p: string[] = [];
  if (e.brightness !== 100) p.push(`brightness(${e.brightness}%)`);
  if (e.contrast !== 100) p.push(`contrast(${e.contrast}%)`);
  if (e.saturation !== 100) p.push(`saturate(${e.saturation}%)`);
  if (e.blur > 0) p.push(`blur(${e.blur}px)`);
  if (e.hue !== 0) p.push(`hue-rotate(${e.hue}deg)`);
  if (e.grayscale) p.push(`grayscale(100%)`);
  if (e.sepia) p.push(`sepia(100%)`);
  if (e.invert) p.push(`invert(100%)`);
  return p.join(" ") || "none";
};

const toVF = (e: ClipEffects): string => {
  const p: string[] = [], eq: string[] = [];
  if (e.brightness !== 100) eq.push(`brightness=${((e.brightness - 100) / 100).toFixed(2)}`);
  if (e.contrast !== 100) eq.push(`contrast=${(e.contrast / 100).toFixed(2)}`);
  if (e.saturation !== 100) eq.push(`saturation=${(e.saturation / 100).toFixed(2)}`);
  if (eq.length) p.push(`eq=${eq.join(":")}`);
  if (e.blur > 0) p.push(`gblur=sigma=${e.blur}`);
  if (e.grayscale) p.push(`hue=s=0`);
  if (e.sepia) p.push(`colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131`);
  if (e.invert) p.push(`negate`);
  if (e.hue !== 0) p.push(`hue=h=${e.hue}`);
  return p.join(",");
};

async function readDuration(file: File): Promise<number> {
  return new Promise(res => {
    const v = document.createElement("video"); v.preload = "metadata";
    v.onloadedmetadata = () => { URL.revokeObjectURL(v.src); res(v.duration); };
    v.onerror = () => res(5);
    v.src = URL.createObjectURL(file);
  });
}

async function makeThumb(file: File, type: "video" | "image" | "gif"): Promise<string> {
  if (type === "image" || type === "gif") {
    return new Promise(res => {
      const r = new FileReader();
      r.onload = e => res(e.target?.result as string ?? "");
      r.onerror = () => res("");
      r.readAsDataURL(file);
    });
  }
  return new Promise(res => {
    const v = document.createElement("video"); v.muted = true; v.preload = "metadata";
    v.src = URL.createObjectURL(file);
    v.onloadedmetadata = () => { v.currentTime = Math.min(1, v.duration * 0.1); };
    v.onseeked = () => {
      const c = document.createElement("canvas"); c.width = 120; c.height = 68;
      c.getContext("2d")?.drawImage(v, 0, 0, 120, 68);
      URL.revokeObjectURL(v.src); res(c.toDataURL("image/jpeg", 0.7));
    };
    v.onerror = () => { URL.revokeObjectURL(v.src); res(""); };
  });
}

function dlBlob(data: Uint8Array, mime: string, name: string) {
  const url = URL.createObjectURL(new Blob([data.buffer as ArrayBuffer], { type: mime }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function EditingVideo() {
  const [, navigate] = useLocation();

  // ── state
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [audios, setAudios] = useState<AudioTrack[]>([]);
  const [texts, setTexts] = useState<TextLayer[]>([]);
  const [subs, setSubs] = useState<SubLine[]>([]);

  // ── playback
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ct, setCt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fs, setFs] = useState(false);

  // ── video sync refs
  const ctRef = useRef(0);
  const playRef = useRef(false);
  const lastSrc = useRef("");
  const activeRef = useRef<Clip | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef(0);

  // ── selection
  const [selClip, setSelClip] = useState<string | null>(null);
  const [selText, setSelText] = useState<string | null>(null);
  const [editTxt, setEditTxt] = useState<string | null>(null);
  const [selSub, setSelSub] = useState<string | null>(null);
  const [hovClip, setHovClip] = useState<string | null>(null);

  // ── UI
  const [tab, setTab] = useState<"fx" | "audio" | "subs" | "tools" | "export">("fx");
  const [zoom, setZoom] = useState(60);
  const [toast, setToast] = useState<Toast | null>(null);

  // ── export settings
  const [fmt, setFmt] = useState<"mp4" | "gif">("mp4");
  const [res, setRes] = useState<"original" | "720p" | "480p">("720p");
  const [crf, setCrf] = useState(22);
  const [audioExtFmt, setAudioExtFmt] = useState<"mp3" | "wav">("mp3");

  // ── FFmpeg
  const ffRef = useRef<FFmpeg | null>(null);
  const [ffOk, setFfOk] = useState(false);
  const [ffLd, setFfLd] = useState(false);
  const [proc, setProc] = useState(false);
  const [pct, setPct] = useState(0);
  const [plbl, setPlbl] = useState("");

  // ── drag refs (all in one place — single mousemove/mouseup handler)
  const dragClip = useRef<{ id: string; sx: number; ox: number } | null>(null);
  const dragTrim = useRef<{ id: string; side: "L" | "R"; sx: number; ots: number; ote: number; ostart: number; odur: number } | null>(null);
  const dragTxt = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);

  // ── DOM refs
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const audioAltRef = useRef<HTMLInputElement>(null);
  const gifRef = useRef<HTMLInputElement>(null);
  const srtRef = useRef<HTMLInputElement>(null);

  // ─── Session storage init ─────────────────────────────────────────────────
  useEffect(() => {
    const src = sessionStorage.getItem("ve_src");
    const name = sessionStorage.getItem("ve_name") || "video.mp4";
    const type = sessionStorage.getItem("ve_type");
    if (!src) return;
    sessionStorage.removeItem("ve_src");
    sessionStorage.removeItem("ve_name");
    sessionStorage.removeItem("ve_type");
    (async () => {
      let fileSrc = src, dur = 0;
      await new Promise<void>(resolve => {
        const v = document.createElement("video"); v.preload = "metadata"; v.crossOrigin = "anonymous";
        v.onloadedmetadata = () => { dur = v.duration; resolve(); };
        v.onerror = () => { dur = 60; resolve(); };
        v.src = fileSrc;
      });
      const thumb = await new Promise<string>(res => {
        const v = document.createElement("video"); v.muted = true; v.preload = "metadata"; v.crossOrigin = "anonymous";
        v.src = fileSrc;
        v.onloadedmetadata = () => { v.currentTime = Math.min(1, dur * 0.1); };
        v.onseeked = () => {
          const c = document.createElement("canvas"); c.width = 120; c.height = 68;
          c.getContext("2d")?.drawImage(v, 0, 0, 120, 68);
          res(c.toDataURL("image/jpeg", 0.7));
        };
        v.onerror = () => res("");
        setTimeout(() => res(""), 3000);
      });
      let file: File;
      try {
        if (type === "url" || !src.startsWith("blob:")) {
          const resp = await fetch(src, { mode: "cors" });
          const blob = await resp.blob();
          file = new File([blob], name, { type: blob.type || "video/mp4" });
          fileSrc = URL.createObjectURL(file);
        } else {
          file = new File([], name, { type: "video/mp4" }); fileSrc = src;
        }
      } catch { file = new File([], name, { type: "video/mp4" }); fileSrc = src; }
      const item: MediaItem = { id: uid(), name, type: "video", file, src: fileSrc, duration: dur || 60, thumbnail: thumb };
      setMedia(p => [...p, item]);
      const clipId = uid();
      setClips([{
        id: clipId, mediaId: item.id, name, type: "video", src: fileSrc, file,
        startTime: 0, duration: dur || 60, trimStart: 0, trimEnd: dur || 60,
        track: 0, effects: { ...DEF }, volume: 1, muted: false, audioRemoved: false,
      }]);
      setSelClip(clipId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Toast ───────────────────────────────────────────────────────────────
  const toast_ = useCallback((msg: string, type: ToastType = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ─── Derived ─────────────────────────────────────────────────────────────
  const totalDur = useMemo(() =>
    clips.length ? Math.max(...clips.map(c => c.startTime + c.duration)) : 0
    , [clips]);
  const activeClip = useMemo(() => {
    const main = clips.filter(c => c.track === 0).sort((a, b) => a.startTime - b.startTime);
    return main.find(c => ct >= c.startTime && ct < c.startTime + c.duration) ?? null;
  }, [clips, ct]);
  const visTexts = useMemo(() => texts.filter(l => ct >= l.startTime && ct <= l.endTime), [texts, ct]);
  const visOver = useMemo(() => clips.filter(c => c.track === 1 && ct >= c.startTime && ct < c.startTime + c.duration), [clips, ct]);
  const visSubs = useMemo(() => subs.filter(s => ct >= s.start && ct <= s.end), [subs, ct]);
  const selClipObj = useMemo(() => clips.find(c => c.id === selClip) ?? null, [clips, selClip]);

  // keep refs in sync
  useEffect(() => { ctRef.current = ct; }, [ct]);
  useEffect(() => { playRef.current = playing; }, [playing]);
  useEffect(() => { activeRef.current = activeClip; }, [activeClip]);

  // ─── Video sync ───────────────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    if (!activeClip || activeClip.type !== "video") {
      if (lastSrc.current) { v.pause(); lastSrc.current = ""; }
      return;
    }
    v.muted = muted || activeClip.muted || activeClip.audioRemoved;
    v.volume = clamp(vol * (activeClip.volume ?? 1), 0, 1);
    if (lastSrc.current === activeClip.src) return;
    lastSrc.current = activeClip.src;
    v.pause(); v.src = activeClip.src; v.load();
    v.addEventListener("canplay", () => {
      const off = clamp(ctRef.current - activeClip.startTime + activeClip.trimStart, 0, activeClip.duration);
      v.currentTime = off;
      if (playRef.current) v.play().catch(() => { });
    }, { once: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClip?.src, activeClip?.muted, activeClip?.audioRemoved, muted, vol]);

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    if (playing && activeClip?.type === "video" && v.paused && v.readyState >= 2)
      v.play().catch(() => { });
    else if (!playing && !v.paused) v.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, activeClip?.id]);

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    const onTU = () => {
      const ac = activeRef.current; if (!ac || ac.type !== "video") return;
      const t = ac.startTime + v.currentTime - ac.trimStart;
      setCt(t); ctRef.current = t;
      if (t >= ac.startTime + ac.duration) { v.pause(); setPlaying(false); }
    };
    const onEnd = () => setPlaying(false);
    v.addEventListener("timeupdate", onTU);
    v.addEventListener("ended", onEnd);
    return () => { v.removeEventListener("timeupdate", onTU); v.removeEventListener("ended", onEnd); };
  }, []);

  // RAF for image/gif playback
  useEffect(() => {
    if (!playing) {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      return;
    }
    const needRaf = !activeClip || activeClip.type === "image" || activeClip.type === "gif";
    if (!needRaf) return;
    lastTs.current = 0;
    const tick = (ts: number) => {
      if (lastTs.current > 0) {
        const d = (ts - lastTs.current) / 1000;
        setCt(prev => {
          const next = prev + d;
          if (next >= totalDur) { setPlaying(false); return totalDur; }
          ctRef.current = next; return next;
        });
      }
      lastTs.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, activeClip?.type, totalDur]);

  // ─── Playback ─────────────────────────────────────────────────────────────
  const seekTo = useCallback((t: number) => {
    const c = clamp(t, 0, totalDur || 0);
    setCt(c); ctRef.current = c; setPlaying(false);
    const v = videoRef.current; const ac = activeRef.current;
    if (v && ac && ac.type === "video") {
      const off = clamp(c - ac.startTime + ac.trimStart, 0, ac.duration);
      if (Math.abs(v.currentTime - off) > 0.05) v.currentTime = off;
    }
  }, [totalDur]);
  const togglePlay = useCallback(() => {
    if (!totalDur) { toast_("Add clips to the timeline first", "err"); return; }
    if (ct >= totalDur) seekTo(0);
    setPlaying(p => !p);
  }, [totalDur, ct, seekTo, toast_]);
  const skip = (d: number) => seekTo(ct + d);

  // ─── Import files ─────────────────────────────────────────────────────────
  const importFiles = useCallback(async (files: FileList | File[]) => {
    for (const f of Array.from(files)) {
      const ext = (f.name.split(".").pop() ?? "").toLowerCase();
      let type: MediaItem["type"] = "video";
      if (["jpg", "jpeg", "png", "webp", "bmp", "svg"].includes(ext)) type = "image";
      else if (ext === "gif") type = "gif";
      else if (["mp3", "wav", "aac", "ogg", "m4a", "flac"].includes(ext)) type = "audio";
      const src = URL.createObjectURL(f);
      const duration = (type === "video" || type === "gif") ? await readDuration(f) : 5;
      const thumbnail = type === "audio" ? "" : await makeThumb(f, type === "gif" ? "video" : type as "video" | "image");
      setMedia(p => [...p, { id: uid(), name: f.name, type, file: f, src, duration, thumbnail }]);
    }
    toast_("Files imported — click Main to add to timeline", "ok");
  }, [toast_]);

  // ─── Remove from media bin (also removes its clips from timeline) ─────────
  const removeFromBin = useCallback((itemId: string) => {
    setMedia(p => p.filter(m => m.id !== itemId));
    setClips(p => {
      const removed = p.filter(c => c.mediaId === itemId);
      if (removed.some(c => c.id === selClip)) setSelClip(null);
      return p.filter(c => c.mediaId !== itemId);
    });
    toast_("Removed from bin", "ok");
  }, [selClip, toast_]);

  // ─── Add to timeline ──────────────────────────────────────────────────────
  const addToTimeline = useCallback((item: MediaItem, track = 0) => {
    if (item.type === "audio") {
      setAudios(p => [...p, { id: uid(), name: item.name, file: item.file, src: item.src, startTime: ct, volume: 1 }]);
      toast_(`Added "${item.name}" as background audio`, "ok"); return;
    }
    const trackClips = clips.filter(c => c.track === track);
    const startTime = trackClips.length ? Math.max(...trackClips.map(c => c.startTime + c.duration)) : 0;
    const id = uid();
    setClips(p => [...p, {
      id, mediaId: item.id, name: item.name,
      type: item.type as "video" | "image" | "gif",
      src: item.src, file: item.file,
      startTime, duration: item.duration,
      trimStart: 0, trimEnd: item.duration,
      track, effects: { ...DEF }, volume: 1, muted: false, audioRemoved: false,
    }]);
    setSelClip(id); setTab("fx");
    toast_(`"${item.name}" added — click it on the timeline to select`, "ok");
  }, [clips, ct, toast_]);

  // ─── Clip operations ──────────────────────────────────────────────────────
  // FIX: no longer depends on selClip state (avoids stale closure)
  const deleteClip = useCallback((id: string) => {
    setClips(p => p.filter(c => c.id !== id));
    setSelClip(prev => prev === id ? null : prev);
    toast_("Clip deleted", "ok");
  }, [toast_]);

  const splitClip = useCallback((id: string) => {
    const clip = clips.find(c => c.id === id);
    if (!clip) { toast_("Select a clip first", "err"); return; }
    if (ct <= clip.startTime || ct >= clip.startTime + clip.duration) {
      toast_("Move the playhead inside the clip", "err"); return;
    }
    const leftDur = ct - clip.startTime;
    const rightDur = clip.duration - leftDur;
    const left: Clip = { ...clip, id: uid(), duration: leftDur, trimEnd: clip.trimStart + leftDur };
    const right: Clip = { ...clip, id: uid(), startTime: ct, duration: rightDur, trimStart: clip.trimStart + leftDur };
    setClips(p => p.map(c => c.id === id ? null : c).filter(Boolean).concat([left, right]) as Clip[]);
    setSelClip(right.id);
    toast_(`Split at ${fmtT(ct)}`, "ok");
  }, [clips, ct, toast_]);

  const updClip = useCallback((id: string, patch: Partial<Clip>) => {
    setClips(p => p.map(c => c.id === id ? { ...c, ...patch } : c));
  }, []);
  const updFx = useCallback((id: string, patch: Partial<ClipEffects>) => {
    setClips(p => p.map(c => c.id === id ? { ...c, effects: { ...c.effects, ...patch } } : c));
  }, []);

  // ─── Audio operations ─────────────────────────────────────────────────────
  const removeAudio = useCallback((id: string) => {
    updClip(id, { audioRemoved: true, muted: true });
    if (videoRef.current && activeClip?.id === id) videoRef.current.muted = true;
    toast_("Audio removed", "ok");
  }, [updClip, activeClip?.id, toast_]);
  const replaceAudio = useCallback((id: string, file: File) => {
    updClip(id, { replacementAudio: file, audioRemoved: false, muted: false });
    toast_(`Audio replaced with "${file.name}"`, "ok");
  }, [updClip, toast_]);
  const restoreAudio = useCallback((id: string) => {
    updClip(id, { audioRemoved: false, replacementAudio: undefined, muted: false });
    if (videoRef.current && activeClip?.id === id) videoRef.current.muted = muted;
    toast_("Original audio restored", "ok");
  }, [updClip, activeClip?.id, muted, toast_]);

  // ─── FFmpeg loader ────────────────────────────────────────────────────────
  const loadFF = useCallback(async (): Promise<boolean> => {
    if (ffRef.current) return true;
    if (ffLd) return false;
    setFfLd(true); setPlbl("Loading FFmpeg…");
    try {
      const ff = new FFmpeg();
      ff.on("progress", ({ progress: p }) => setPct(Math.round(p * 100)));
      await ff.load({
        coreURL: await toBlobURL(`${FFMPEG_CDN}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${FFMPEG_CDN}/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffRef.current = ff; setFfOk(true);
      toast_("FFmpeg ready", "ok");
      return true;
    } catch (e) { console.error(e); toast_("FFmpeg failed to load", "err"); return false; }
    finally { setFfLd(false); setPlbl(""); }
  }, [ffLd, toast_]);

  // ─── Extract audio (FIX: auto-loads FFmpeg) ───────────────────────────────
  const extractAudio = useCallback(async (clipId: string, format: "mp3" | "wav") => {
    const clip = clips.find(c => c.id === clipId);
    if (!clip || clip.type !== "video") { toast_("Select a video clip on the timeline first", "err"); return; }
    const ready = ffRef.current ? true : await loadFF();
    if (!ready || !ffRef.current) { toast_("FFmpeg failed to load", "err"); return; }
    const ff = ffRef.current;
    setProc(true); setPct(0); setPlbl(`Extracting audio as ${format.toUpperCase()}…`);
    try {
      const ext = clip.name.split(".").pop() ?? "mp4";
      await ff.writeFile(`src.${ext}`, await fetchFile(clip.file));
      if (format === "mp3") {
        await ff.exec(["-i", `src.${ext}`, "-vn", "-acodec", "libmp3lame", "-q:a", "2", "audio.mp3"]);
        const data = await ff.readFile("audio.mp3") as Uint8Array;
        dlBlob(data, "audio/mpeg", clip.name.replace(/\.[^.]+$/, ".mp3"));
      } else {
        await ff.exec(["-i", `src.${ext}`, "-vn", "-acodec", "pcm_s16le", "audio.wav"]);
        const data = await ff.readFile("audio.wav") as Uint8Array;
        dlBlob(data, "audio/wav", clip.name.replace(/\.[^.]+$/, ".wav"));
      }
      toast_("Audio extracted — check your Downloads", "ok");
    } catch (e) { console.error(e); toast_("Extraction failed — is there audio in this video?", "err"); }
    finally { setProc(false); setPlbl(""); setPct(0); }
  }, [clips, loadFF, toast_]);

  // ─── Quick compress ───────────────────────────────────────────────────────
  const quickCompress = useCallback(async (file: File, targetCrf: number) => {
    const ready = ffRef.current ? true : await loadFF();
    if (!ready || !ffRef.current) { return; }
    const ff = ffRef.current;
    const ext = file.name.split(".").pop() ?? "mp4";
    setProc(true); setPct(0); setPlbl(`Compressing (CRF ${targetCrf})…`);
    try {
      await ff.writeFile(`in.${ext}`, await fetchFile(file));
      await ff.exec(["-i", `in.${ext}`, "-c:v", "libvpx-vp9", "-crf", String(targetCrf), "-preset", "medium", "-c:a", "aac", "-movflags", "faststart", "-pix_fmt", "yuv420p", "out.mp4"]);
      const data = await ff.readFile("out.mp4") as Uint8Array;
      dlBlob(data, "video/mp4", file.name.replace(/\.[^.]+$/, "_compressed.mp4"));
      toast_("Compressed — downloading", "ok");
    } catch (e) { console.error(e); toast_("Compression failed", "err"); }
    finally { setProc(false); setPlbl(""); setPct(0); }
  }, [loadFF, toast_]);

  // ─── Quick convert ────────────────────────────────────────────────────────
  const quickConvert = useCallback(async (file: File, toFmt: "mp4" | "gif") => {
    const ready = ffRef.current ? true : await loadFF();
    if (!ready || !ffRef.current) { return; }
    const ff = ffRef.current;
    const ext = file.name.split(".").pop() ?? "mp4";
    setProc(true); setPct(0); setPlbl(`Converting to ${toFmt.toUpperCase()}…`);
    try {
      await ff.writeFile(`in.${ext}`, await fetchFile(file));
      let cmd: string[];
      if (toFmt === "mp4")
        cmd = ["-i", `in.${ext}`, "-c:v", "libvpx-vp9", "-c:a", "libopus", "out.mp4"];
      else
        cmd = ["-i", `in.${ext}`, "-vf", "fps=12,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse", "out.gif"];
      await ff.exec(cmd);
      const outFile = `out.${toFmt}`;
      const data = await ff.readFile(outFile) as Uint8Array;
      const mime = toFmt === "mp4" ? "video/mp4" : toFmt === "gif" ? "image/gif" : "video/mp4";
      dlBlob(data, mime, file.name.replace(/\.[^.]+$/, `.${toFmt}`));
      toast_(`Converted to ${toFmt.toUpperCase()} — downloading`, "ok");
    } catch (e) { console.error(e); toast_("Conversion failed", "err"); }
    finally { setProc(false); setPlbl(""); setPct(0); }
  }, [loadFF, toast_]);

  // ─── GIF→MP4 ─────────────────────────────────────────────────────────────
  const convertGif = useCallback(async (file: File) => {
    const ready = ffRef.current ? true : await loadFF();
    if (!ready || !ffRef.current) { return; }
    const ff = ffRef.current;
    setProc(true); setPct(0); setPlbl("Converting GIF → MP4…");
    try {
      await ff.writeFile("in.gif", await fetchFile(file));
      await ff.exec(["-i", "in.gif", "-movflags", "faststart", "-pix_fmt", "yuv420p", "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "out.mp4"]);
      const data = await ff.readFile("out.mp4") as Uint8Array;
      dlBlob(data, "video/mp4", file.name.replace(/\.gif$/i, ".mp4"));
      toast_("GIF converted — downloading", "ok");
    } catch (e) { console.error(e); toast_("Conversion failed", "err"); }
    finally { setProc(false); setPlbl(""); }
  }, [loadFF, toast_]);

  // ─── Export (FIX: audio label tracking) ──────────────────────────────────
  const exportVideo = useCallback(async () => {
    if (!clips.length) { toast_("Add clips to the timeline first", "err"); return; }
    const ready = ffRef.current ? true : await loadFF();
    if (!ready || !ffRef.current) { return; }
    const ff = ffRef.current;
    setProc(true); setPct(0); setPlbl("Preparing…");
    try {
      const main = clips.filter(c => c.track === 0).sort((a, b) => a.startTime - b.startTime);
      let fileIdx = 0; // tracks actual FFmpeg input file indices
      const inArgs: string[] = [], vParts: string[] = [], aParts: string[] = [], audioLabels: string[] = [];

      // Write SRT if subtitles exist
      const hasSubs = subs.length > 0;
      if (hasSubs) {
        const srtContent = subs.map((s, i) => `${i + 1}\n${srtTs(s.start)} --> ${srtTs(s.end)}\n${s.text}`).join("\n\n");
        await ff.writeFile("subs.srt", new TextEncoder().encode(srtContent));
      }

      for (let i = 0; i < main.length; i++) {
        const c = main[i]; const ext = c.name.split(".").pop() ?? "mp4";
        setPlbl(`Loading clip ${i + 1}/${main.length}…`);
        await ff.writeFile(`in${fileIdx}.${ext}`, await fetchFile(c.file));
        const clipFileIdx = fileIdx; fileIdx++;

        const resVF = res === "720p" ? "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" : res === "480p" ? "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2" : "scale=trunc(iw/2)*2:trunc(ih/2)*2";
        const subVF = hasSubs && fmt !== "gif" ? ",subtitles=subs.srt" : "";
        inArgs.push("-i", `in${clipFileIdx}.${ext}`);

        if (fmt === "gif") {
          const vf = [toVF(c.effects), resVF, "fps=10"].filter(Boolean).join(",");
          vParts.push(`[${clipFileIdx}:v]${vf}[v${i}]`);
        } else {
          const vf = [toVF(c.effects), resVF + subVF].filter(Boolean).join(",");
          const trimFilter = c.type === "video" ? `trim=${c.trimStart}:${c.trimEnd},setpts=PTS-STARTPTS,` : "";
          vParts.push(`[${clipFileIdx}:v]${trimFilter}${vf}[v${i}]`);

          // Audio (only for video clips that haven't had audio removed)
          if (c.type === "video" && !c.audioRemoved) {
            const label = `a${i}`;
            if (c.replacementAudio) {
              const aext = c.replacementAudio.name.split(".").pop() ?? "mp3";
              await ff.writeFile(`aud${fileIdx}.${aext}`, await fetchFile(c.replacementAudio));
              inArgs.push("-i", `aud${fileIdx}.${aext}`);
              aParts.push(`[${fileIdx}:a]aresample=44100,volume=${c.volume}[${label}]`);
              fileIdx++;
            } else {
              aParts.push(`[${clipFileIdx}:a]atrim=${c.trimStart}:${c.trimEnd},asetpts=PTS-STARTPTS,volume=${c.volume}[${label}]`);
            }
            audioLabels.push(`[${label}]`);
          }
        }
      }

      setPlbl("Rendering…");
      if (fmt === "gif") {
        const vConcat = `${main.map((_, i) => `[v${i}]`).join("")}concat=n=${main.length}:v=1:a=0[vout]`;
        const pal = `[vout]split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse[gif]`;
        await ff.exec([...inArgs, "-filter_complex", [...vParts, vConcat, pal].join(";"), "-map", "[gif]", "out.gif"]);
        const data = await ff.readFile("out.gif") as Uint8Array;
        dlBlob(data, "image/gif", "export.gif");
      } else {
        const hasA = audioLabels.length > 0;
        const vConcat = `${main.map((_, i) => `[v${i}]`).join("")}concat=n=${main.length}:v=1:a=0[vout]`;
        const aConcat = hasA ? `${audioLabels.join("")}concat=n=${audioLabels.length}:v=0:a=1[aout]` : "";
        const fc = [...vParts, ...aParts, vConcat, ...(hasA ? [aConcat] : [])].join(";");
        const outExt = "mp4";
        const codec = fmt === "mp4"
          ? ["-c:v", "libvpx-vp9", "-c:a", "libopus"]
          : ["-c:v", "libvpx-vp9", "-crf", String(crf), "-preset", "medium", "-c:a", "aac", "-movflags", "faststart", "-pix_fmt", "yuv420p"];
        await ff.exec([...inArgs, "-filter_complex", fc, "-map", "[vout]", ...(hasA ? ["-map", "[aout]"] : []), ...codec, `out.${outExt}`]);
        const data = await ff.readFile(`out.${outExt}`) as Uint8Array;
        dlBlob(data, fmt === "mp4" ? "video/mp4" : "video/mp4", `export.${outExt}`);
      }
      toast_("Export complete — check your Downloads", "ok");
    } catch (e) { console.error(e); toast_("Export failed — see browser console", "err"); }
    finally { setProc(false); setPlbl(""); setPct(0); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clips, subs, fmt, res, crf, loadFF, toast_]);

  // ─── Text ops ─────────────────────────────────────────────────────────────
  const addText = useCallback(() => {
    const id = uid();
    setTexts(p => [...p, {
      id, text: "Your Text", x: 10, y: 10, fontSize: 36, color: "#ffffff",
      bold: false, italic: false, align: "left",
      startTime: ct, endTime: clamp(ct + 5, 0, totalDur || ct + 5),
      bgColor: "#000000", bgOpacity: 0,
    }]);
    setSelText(id); setTab("subs");
  }, [ct, totalDur]);
  const updText = useCallback((id: string, patch: Partial<TextLayer>) => {
    setTexts(p => p.map(l => l.id === id ? { ...l, ...patch } : l));
  }, []);
  const delText = useCallback((id: string) => {
    setTexts(p => p.filter(l => l.id !== id));
    setSelText(prev => prev === id ? null : prev);
  }, []);

  // ─── Subtitle ops ─────────────────────────────────────────────────────────
  const importSrt = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string; if (!text) return;
      const lines = parseSrt(text);
      setSubs(p => [...p, ...lines]);
      toast_(`${lines.length} subtitle${lines.length !== 1 ? "s" : ""} imported`, "ok");
    };
    reader.readAsText(file);
  }, [toast_]);
  const updSub = useCallback((id: string, patch: Partial<SubLine>) => {
    setSubs(p => p.map(s => s.id === id ? { ...s, ...patch } : s));
  }, []);
  const delSub = useCallback((id: string) => {
    setSubs(p => p.filter(s => s.id !== id));
    setSelSub(prev => prev === id ? null : prev);
  }, []);

  // ─── Text drag ────────────────────────────────────────────────────────────
  const onTxtDown = useCallback((e: React.MouseEvent, id: string) => {
    if (editTxt === id) return;
    e.preventDefault(); e.stopPropagation();
    setSelText(id);
    const l = texts.find(t => t.id === id); if (!l) return;
    dragTxt.current = { id, sx: e.clientX, sy: e.clientY, ox: l.x, oy: l.y };
  }, [texts, editTxt]);

  // ─── SINGLE global drag handler (FIX: was split across two useEffects) ────
  useEffect(() => {
    const mv = (e: MouseEvent) => {
      // Text drag
      const dt = dragTxt.current;
      if (dt) {
        const el = overlayRef.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const nx = clamp(dt.ox + ((e.clientX - dt.sx) / r.width) * 100, 0, 90);
        const ny = clamp(dt.oy + ((e.clientY - dt.sy) / r.height) * 100, 0, 90);
        const id = dt.id;
        setTexts(p => p.map(l => l.id === id ? { ...l, x: nx, y: ny } : l));
        return;
      }
      // Clip move
      const dc = dragClip.current;
      if (dc) {
        const nx = Math.max(0, dc.ox + (e.clientX - dc.sx) / zoom);
        const id = dc.id;
        setClips(p => p.map(c => c.id === id ? { ...c, startTime: nx } : c));
        return;
      }
      // Trim drag
      const tr = dragTrim.current;
      if (tr) {
        const deltaS = (e.clientX - tr.sx) / zoom;
        const id = tr.id;
        if (tr.side === "L") {
          const d = clamp(deltaS, -tr.ots, tr.ote - tr.ots - 0.1);
          const newTrimStart = tr.ots + d;
          const newStartTime = Math.max(0, tr.ostart + d);
          const newDur = tr.odur - d;
          if (newDur > 0.1)
            setClips(p => p.map(c => c.id === id ? { ...c, trimStart: newTrimStart, startTime: newStartTime, duration: newDur } : c));
        } else {
          const newDur = clamp(tr.odur + deltaS, 0.1, 99999);
          setClips(p => p.map(c => c.id === id ? { ...c, duration: newDur, trimEnd: tr.ote + deltaS } : c));
        }
      }
    };
    const up = () => {
      dragTxt.current = null; dragClip.current = null; dragTrim.current = null;
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [zoom]);

  // ─── Timeline click to seek ───────────────────────────────────────────────
  const onTlClick = useCallback((e: React.MouseEvent) => {
    if (dragClip.current || dragTrim.current || dragTxt.current) return;
    const tl = timelineRef.current; if (!tl) return;
    const r = tl.getBoundingClientRect();
    const x = e.clientX - r.left + tl.scrollLeft - 64;
    if (x < 0) return;
    seekTo(x / zoom);
  }, [zoom, seekTo]);

  // ─── Fullscreen ───────────────────────────────────────────────────────────
  useEffect(() => {
    const h = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);
  const toggleFs = useCallback(() => {
    const el = containerRef.current; if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => { });
    else document.exitFullscreen().catch(() => { });
  }, []);

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.code === "KeyS" && selClip) splitClip(selClip);
      if ((e.code === "Delete" || e.code === "Backspace") && selClip) deleteClip(selClip);
      if ((e.code === "Delete" || e.code === "Backspace") && selText && !selClip) delText(selText);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [togglePlay, splitClip, deleteClip, delText, selClip, selText]);

  // ─── Colours ─────────────────────────────────────────────────────────────
  const C = {
    bg: "hsla(0, 0%, 0%, 1.00)", bg2: "hsla(0, 0%, 0%, 1.00)",
    bg3: "hsl(220 14% 15%)", bg4: "hsl(220 14% 18%)",
    border: "hsl(220 14% 21%)", text: "hsl(220 10% 88%)",
    muted: "hsl(220 10% 48%)", accent: "hsl(262 83% 68%)",
    ok: "hsl(142 70% 45%)", err: "hsl(0 70% 58%)",
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} style={{
      background: C.bg, color: C.text, height: "100vh",
      display: "flex", flexDirection: "column", overflow: "hidden",
      fontFamily: "system-ui,sans-serif", fontSize: 13,
    }}>

      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: "6px 10px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <button onClick={() => navigate("/")} style={bsm(C)}><ChevronLeft size={13} /> Home</button>
        <Film size={15} color={C.accent} />
        <span style={{ fontWeight: 700, fontSize: 14 }}>Video Editor Lite</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: C.muted }}>Space=Play · S=Split · Del=Delete</span>
        <button onClick={() => importRef.current?.click()} style={bsm(C)}><Upload size={12} /> Import</button>
        <input ref={importRef} type="file" multiple accept="video/*,image/*,audio/*,.gif" style={{ display: "none" }}
          onChange={e => { if (e.target.files) importFiles(e.target.files); e.target.value = ""; }} />
        <button onClick={() => gifRef.current?.click()} style={bsm(C)}><RefreshCw size={12} /> GIF→MP4</button>
        <input ref={gifRef} type="file" accept=".gif,image/gif" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) convertGif(f); e.target.value = ""; }} />
        <button onClick={addText} style={bsm(C)}><Type size={12} /> Add Text</button>
        <button onClick={() => srtRef.current?.click()} style={bsm(C)} title="Import .SRT subtitle file"><FileText size={12} /> Import SRT</button>
        <input ref={srtRef} type="file" accept=".srt,.vtt" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) importSrt(f); e.target.value = ""; }} />
        <button onClick={() => { loadFF(); setTab("export"); }}
          style={{ ...bsm(C), background: C.accent, color: "#fff", border: "none", fontWeight: 700 }}>
          <Download size={12} /> Export
        </button>
      </div>

      {/* ── Middle row ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* ── Media Bin ────────────────────────────────────────────────── */}
        <div style={{ width: 225, flexShrink: 0, background: C.bg2, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "7px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.muted }}>Media Bin</span>
            <button onClick={() => importRef.current?.click()} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent }}><Plus size={15} /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 7, display: "flex", flexDirection: "column", gap: 7 }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); if (e.dataTransfer.files) importFiles(e.dataTransfer.files); }}>
            {!media.length && (
              <div onClick={() => importRef.current?.click()}
                style={{ border: `2px dashed ${C.border}`, borderRadius: 10, padding: "18px 8px", textAlign: "center", color: C.muted, fontSize: 12, cursor: "pointer" }}>
                <Upload size={18} style={{ margin: "0 auto 5px" }} /><br />Drop files here<br />or click Import
              </div>
            )}
            {media.map(item => (
              <div key={item.id} style={{ background: C.bg3, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}`, position: "relative" }}>
                {/* ── FIX: Delete button on media bin item ── */}
                <button onClick={() => removeFromBin(item.id)}
                  title="Remove from bin"
                  style={{ position: "absolute", top: 3, right: 3, zIndex: 10, background: "rgba(0,0,0,0.75)", border: "none", borderRadius: 4, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                  <X size={11} />
                </button>
                <div style={{ height: 52, overflow: "hidden", background: "#000" }}>
                  {item.thumbnail
                    ? <img src={item.thumbnail} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: C.accent }}>
                      {item.type === "audio" ? <Music size={20} /> : <ImageIcon size={20} />}
                    </div>
                  }
                </div>
                <div style={{ padding: "3px 8px 2px", fontSize: 10, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                <div style={{ padding: "3px 7px 7px", display: "flex", gap: 4 }}>
                  {item.type !== "audio" && (
                    <>
                      <button onClick={() => addToTimeline(item, 0)}
                        style={{ flex: 1, padding: "4px 0", background: C.accent, border: "none", borderRadius: 5, color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                        <Video size={10} /> Main
                      </button>
                      {(item.type === "image" || item.type === "gif") && (
                        <button onClick={() => addToTimeline(item, 1)}
                          style={{ flex: 1, padding: "4px 0", background: C.bg4, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                          <Layers size={10} /> Overlay
                        </button>
                      )}
                    </>
                  )}
                  {item.type === "audio" && (
                    <button onClick={() => addToTimeline(item)}
                      style={{ flex: 1, padding: "4px 0", background: C.bg4, border: `1px solid ${C.border}`, borderRadius: 5, color: C.text, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                      <Music size={10} /> Add Audio
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Preview ──────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <div style={{ flex: 1, background: "#000", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", minHeight: 0 }}>

            {/* Video element */}
            <video ref={videoRef}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: activeClip ? toCSS(activeClip.effects) : "none", display: activeClip && activeClip.type === "video" ? "block" : "none" }}
              playsInline crossOrigin="anonymous" />

            {/* Image / GIF display — FIX: uses selClipObj for effects when selected */}
            {activeClip && (activeClip.type === "image" || activeClip.type === "gif") && (
              <img src={activeClip.src} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: toCSS(activeClip.effects) }} />
            )}

            {/* Empty state */}
            {!activeClip && !clips.length && (
              <div style={{ textAlign: "center", color: C.muted }}>
                <Film size={36} style={{ margin: "0 auto 8px", opacity: 0.25 }} />
                <p style={{ fontSize: 13 }}>Import files and click <strong>Main</strong> to add to timeline</p>
              </div>
            )}

            {/* Overlay track clips */}
            {visOver.map(ov => (
              <img key={ov.id} src={ov.src} alt="" style={{ position: "absolute", maxWidth: "42%", maxHeight: "42%", top: 8, right: 8, filter: toCSS(ov.effects), objectFit: "contain", borderRadius: 4, border: "1px solid rgba(255,255,255,0.25)" }} />
            ))}

            {/* Text overlays */}
            <div ref={overlayRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {visTexts.map(layer => (
                <div key={layer.id}
                  onMouseDown={e => onTxtDown(e, layer.id)}
                  onDoubleClick={e => { e.stopPropagation(); setEditTxt(layer.id); setSelText(layer.id); }}
                  style={{
                    position: "absolute", left: `${layer.x}%`, top: `${layer.y}%`,
                    fontSize: layer.fontSize, color: layer.color,
                    fontWeight: layer.bold ? "bold" : "normal", fontStyle: layer.italic ? "italic" : "normal",
                    textAlign: layer.align, cursor: "grab", pointerEvents: "all", userSelect: "none",
                    outline: selText === layer.id ? `2px dashed ${C.accent}` : "none",
                    outlineOffset: 4, borderRadius: 3, padding: "2px 5px",
                    textShadow: "0 1px 8px rgba(0,0,0,0.95)",
                    background: layer.bgOpacity > 0 ? `${layer.bgColor}${Math.round(layer.bgOpacity * 255).toString(16).padStart(2, "0")}` : "transparent",
                    maxWidth: "80%", whiteSpace: "pre-wrap",
                  }}>
                  {editTxt === layer.id
                    ? <textarea autoFocus value={layer.text}
                      onChange={e => updText(layer.id, { text: e.target.value })}
                      onBlur={() => setEditTxt(null)}
                      onMouseDown={e => e.stopPropagation()} rows={2}
                      style={{ background: "rgba(0,0,0,0.75)", color: layer.color, fontSize: layer.fontSize, fontWeight: layer.bold ? "bold" : "normal", fontStyle: layer.italic ? "italic" : "normal", border: `1.5px solid ${C.accent}`, borderRadius: 5, padding: "4px 7px", outline: "none", resize: "both", minWidth: 120 }} />
                    : layer.text
                  }
                </div>
              ))}
              {/* Subtitles — bottom center */}
              {visSubs.map((s, i) => (
                <div key={s.id} onClick={() => { setSelSub(s.id); setTab("subs"); }}
                  style={{
                    position: "absolute", bottom: `${8 + (visSubs.length - 1 - i) * 8}%`, left: "50%",
                    transform: "translateX(-50%)", fontSize: 20, color: "#fff",
                    textShadow: "0 0 8px #000,0 2px 4px #000", textAlign: "center",
                    pointerEvents: "all", cursor: "pointer", maxWidth: "80%", whiteSpace: "pre-wrap",
                    fontWeight: 600, background: "rgba(0,0,0,0.45)", borderRadius: 5, padding: "2px 10px",
                    border: selSub === s.id ? `2px solid ${C.accent}` : "2px solid transparent",
                  }}>{s.text}</div>
              ))}
            </div>

            {/* Fullscreen toggle */}
            <button onClick={toggleFs} style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.55)", border: "none", borderRadius: 6, padding: 6, cursor: "pointer", color: "#fff" }}>
              {fs ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          </div>

          {/* Playback controls */}
          <div style={{ background: C.bg2, borderTop: `1px solid ${C.border}`, padding: "6px 12px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: C.muted, width: 54, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtT(ct)}</span>
              <input type="range" min={0} max={totalDur || 1} step={0.05} value={ct}
                onChange={e => seekTo(Number(e.target.value))}
                style={{ flex: 1, accentColor: C.accent, cursor: "pointer" }} />
              <span style={{ fontSize: 11, color: C.muted, width: 54, fontVariantNumeric: "tabular-nums" }}>{fmtT(totalDur)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <button onClick={() => seekTo(0)} style={{ background: "none", border: "none", cursor: "pointer", color: C.text, padding: 3 }}><SkipBack size={14} /></button>
              <button onClick={togglePlay} style={{ background: C.accent, border: "none", borderRadius: 8, padding: "5px 12px", cursor: "pointer", color: "#fff", display: "flex" }}>
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button onClick={() => seekTo(totalDur)} style={{ background: "none", border: "none", cursor: "pointer", color: C.text, padding: 3 }}><SkipForward size={14} /></button>
              <button onClick={() => skip(-5)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 3, fontSize: 11 }}>-5s</button>
              <button onClick={() => skip(5)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 3, fontSize: 11 }}>+5s</button>
              <div style={{ flex: 1 }} />
              <button onClick={() => { const n = !muted; setMuted(n); if (videoRef.current) videoRef.current.muted = n; }}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.text, padding: 3 }}>
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : vol}
                onChange={e => { const v = Number(e.target.value); setVol(v); setMuted(v === 0); if (videoRef.current) videoRef.current.volume = v; }}
                style={{ width: 68, accentColor: C.accent }} />
            </div>
          </div>
        </div>

        {/* ── Properties panel ─────────────────────────────────────────── */}
        <div style={{ width: 275, flexShrink: 0, background: C.bg2, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            {(["fx", "audio", "subs", "tools", "export"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: "7px 0", fontSize: 9, fontWeight: 700, textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", letterSpacing: 0.5, borderBottom: tab === t ? `2px solid ${C.accent}` : "2px solid transparent", color: tab === t ? C.accent : C.muted }}>
                {t === "fx" ? "FX" : t === "subs" ? "Subs" : t === "tools" ? "Tools" : t === "export" ? "Export" : "Audio"}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "11px 12px" }}>

            {/* ─── FX tab ──────────────────────────────────────────────── */}
            {tab === "fx" && (
              <>
                {!selClipObj
                  ? <div style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 24 }}>
                    <Info size={18} style={{ margin: "0 auto 7px", opacity: 0.35 }} />
                    Click any clip on the timeline to select it, then edit effects here
                  </div>
                  : <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                    <div style={{ background: C.bg3, borderRadius: 7, padding: "5px 9px", fontSize: 11, color: C.accent, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>✂️ {selClipObj.name}</span>
                      {/* FIX: delete button accessible from panel */}
                      <button onClick={() => deleteClip(selClipObj.id)} title="Delete clip"
                        style={{ background: "hsl(0 60% 18%)", border: `1px solid hsl(0 60% 30%)`, borderRadius: 5, padding: "2px 6px", cursor: "pointer", color: "hsl(0 70% 65%)", fontSize: 10, display: "flex", alignItems: "center", gap: 3, flexShrink: 0, marginLeft: 6 }}>
                        <Trash2 size={10} /> Delete
                      </button>
                    </div>
                    {([
                      { k: "brightness", lo: 0, hi: 200, lbl: "Brightness" },
                      { k: "contrast", lo: 0, hi: 200, lbl: "Contrast" },
                      { k: "saturation", lo: 0, hi: 200, lbl: "Saturation" },
                      { k: "blur", lo: 0, hi: 20, lbl: "Blur" },
                      { k: "hue", lo: -180, hi: 180, lbl: "Hue" },
                    ] as { k: keyof ClipEffects; lo: number; hi: number; lbl: string }[]).map(({ k, lo, hi, lbl }) => (
                      <Sld key={k} label={lbl} val={selClipObj.effects[k] as number} min={lo} max={hi}
                        accent={C.accent} textClr={C.text} mutedClr={C.muted}
                        onChange={v => updFx(selClipObj.id, { [k]: v })}
                        reset={() => updFx(selClipObj.id, { [k]: DEF[k as keyof ClipEffects] as number })} />
                    ))}
                    {(["grayscale", "sepia", "invert"] as const).map(k => (
                      <Tog key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}
                        val={selClipObj.effects[k]} accent={C.accent} bg={C.bg3} textClr={C.text}
                        onChange={v => updFx(selClipObj.id, { [k]: v })} />
                    ))}
                    <button onClick={() => updClip(selClipObj.id, { effects: { ...DEF } })}
                      style={{ padding: "6px 0", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, fontSize: 12, cursor: "pointer" }}>
                      Reset All Effects
                    </button>
                  </div>
                }
              </>
            )}

            {/* ─── Audio tab ───────────────────────────────────────────── */}
            {tab === "audio" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(!selClipObj || selClipObj.type !== "video")
                  ? <p style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 24 }}>
                    Select a <strong>video</strong> clip on the timeline to manage its audio
                  </p>
                  : <>
                    <div style={{ background: C.bg3, borderRadius: 7, padding: "5px 9px", fontSize: 11, color: C.accent, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🎬 {selClipObj.name}</div>
                    <Sld label="Volume" val={Math.round(selClipObj.volume * 100)} min={0} max={150}
                      accent={C.accent} textClr={C.text} mutedClr={C.muted}
                      onChange={v => updClip(selClipObj.id, { volume: v / 100 })}
                      reset={() => updClip(selClipObj.id, { volume: 1 })} />
                    <Tog label="Mute Clip" val={selClipObj.muted} accent={C.accent} bg={C.bg3} textClr={C.text}
                      onChange={v => { updClip(selClipObj.id, { muted: v }); if (videoRef.current && activeClip?.id === selClipObj.id) videoRef.current.muted = v; }} />

                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 11 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Audio Track</p>
                      {selClipObj.audioRemoved && (
                        <div style={{ background: "hsl(0 60% 14%)", borderRadius: 8, padding: "7px 10px", marginBottom: 7, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: "hsl(0 70% 65%)" }}>🔇 Audio deleted</span>
                          <button onClick={() => restoreAudio(selClipObj.id)} style={{ fontSize: 11, color: C.accent, background: "none", border: "none", cursor: "pointer" }}>Restore</button>
                        </div>
                      )}
                      {selClipObj.replacementAudio && !selClipObj.audioRemoved && (
                        <div style={{ background: "hsl(142 50% 12%)", borderRadius: 8, padding: "7px 10px", marginBottom: 7, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                          <span style={{ fontSize: 11, color: "hsl(142 70% 55%)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🎵 {selClipObj.replacementAudio.name}</span>
                          <button onClick={() => restoreAudio(selClipObj.id)} style={{ fontSize: 11, color: C.muted, background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>Remove</button>
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
                        {!selClipObj.audioRemoved && (
                          <button onClick={() => removeAudio(selClipObj.id)}
                            style={{ width: "100%", padding: "7px 0", background: "hsl(0 60% 16%)", border: `1px solid hsl(0 60% 27%)`, borderRadius: 8, color: "hsl(0 70% 68%)", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <VolumeX size={13} /> Delete Audio Track
                          </button>
                        )}
                        <button onClick={() => audioAltRef.current?.click()}
                          style={{ width: "100%", padding: "7px 0", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <Mic size={13} /> Replace Audio
                        </button>
                        <input ref={audioAltRef} type="file" accept="audio/*" style={{ display: "none" }}
                          onChange={e => { const f = e.target.files?.[0]; if (f && selClip) replaceAudio(selClip, f); e.target.value = ""; }} />
                      </div>
                    </div>

                    {/* Extract Audio — FIX: auto-loads FFmpeg */}
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 11 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Extract Audio</p>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        {(["mp3", "wav"] as const).map(f => (
                          <label key={f} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 12 }}>
                            <input type="radio" name="aefmt" checked={audioExtFmt === f} onChange={() => setAudioExtFmt(f)} style={{ accentColor: C.accent }} />
                            {f.toUpperCase()}
                          </label>
                        ))}
                      </div>
                      <button onClick={() => extractAudio(selClipObj.id, audioExtFmt)}
                        style={{ width: "100%", padding: "8px 0", background: "hsl(200 55% 17%)", border: `1px solid hsl(200 55% 29%)`, borderRadius: 8, color: "hsl(200 80% 68%)", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <Mic size={13} /> Download as {audioExtFmt.toUpperCase()}
                        {ffLd && <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} />}
                      </button>
                      <p style={{ fontSize: 10, color: C.muted, marginTop: 5 }}>FFmpeg loads automatically on first use</p>
                    </div>
                  </>
                }
                {/* Background audio tracks */}
                {audios.length > 0 && (
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 11 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 7 }}>Background Audio</p>
                    {audios.map(a => (
                      <div key={a.id} style={{ background: C.bg3, borderRadius: 7, padding: "5px 9px", display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                        <Music size={12} color={C.accent} style={{ flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                        <button onClick={() => setAudios(p => p.filter(x => x.id !== a.id))} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Subs tab ────────────────────────────────────────────── */}
            {tab === "subs" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {/* Text Overlays */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>Text Overlays ({texts.length})</span>
                    <button onClick={addText} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent }}><Plus size={15} /></button>
                  </div>
                  {texts.map(layer => (
                    <div key={layer.id} onClick={() => setSelText(layer.id)}
                      style={{ background: selText === layer.id ? "hsl(262 40% 17%)" : C.bg3, border: `1px solid ${selText === layer.id ? C.accent : C.border}`, borderRadius: 8, padding: "7px 9px", cursor: "pointer", marginBottom: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: selText === layer.id ? 6 : 0 }}>
                        <span style={{ flex: 1, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: layer.color }}>{layer.text || "(empty)"}</span>
                        <button onClick={e => { e.stopPropagation(); delText(layer.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><Trash2 size={11} /></button>
                      </div>
                      {selText === layer.id && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
                          <textarea value={layer.text} onChange={e => updText(layer.id, { text: e.target.value })} rows={2}
                            style={{ width: "100%", background: "hsl(220 14% 11%)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 7px", color: C.text, fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                          {/* Size */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                            {FONT_SIZES.map(s => (
                              <button key={s} onClick={() => updText(layer.id, { fontSize: s })}
                                style={{ padding: "2px 6px", borderRadius: 5, fontSize: 10, border: "none", cursor: "pointer", background: layer.fontSize === s ? C.accent : C.bg4, color: layer.fontSize === s ? "#fff" : C.muted }}>
                                {s}
                              </button>
                            ))}
                          </div>
                          {/* Style */}
                          <div style={{ display: "flex", gap: 4 }}>
                            {[
                              { icon: <Bold size={11} />, active: layer.bold, on: () => updText(layer.id, { bold: !layer.bold }) },
                              { icon: <Italic size={11} />, active: layer.italic, on: () => updText(layer.id, { italic: !layer.italic }) },
                              { icon: <AlignLeft size={11} />, active: layer.align === "left", on: () => updText(layer.id, { align: "left" }) },
                              { icon: <AlignCenter size={11} />, active: layer.align === "center", on: () => updText(layer.id, { align: "center" }) },
                              { icon: <AlignRight size={11} />, active: layer.align === "right", on: () => updText(layer.id, { align: "right" }) },
                            ].map((b, i) => (
                              <button key={i} onClick={b.on}
                                style={{ padding: 4, borderRadius: 5, border: "none", cursor: "pointer", background: b.active ? C.accent : C.bg4, color: b.active ? "#fff" : C.muted, display: "flex" }}>
                                {b.icon}
                              </button>
                            ))}
                          </div>
                          {/* Colors */}
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {TEXT_COLORS.map(c => (
                              <button key={c} onClick={() => updText(layer.id, { color: c })}
                                style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: layer.color === c ? `2px solid ${C.accent}` : "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }} />
                            ))}
                            <input type="color" value={layer.color} onChange={e => updText(layer.id, { color: e.target.value })}
                              style={{ width: 20, height: 20, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0 }} />
                          </div>
                          {/* BG */}
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <input type="color" value={layer.bgColor} onChange={e => updText(layer.id, { bgColor: e.target.value })}
                              style={{ width: 24, height: 24, borderRadius: 5, border: "none", cursor: "pointer" }} />
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>BG Opacity {Math.round(layer.bgOpacity * 100)}%</p>
                              <input type="range" min={0} max={1} step={0.05} value={layer.bgOpacity}
                                onChange={e => updText(layer.id, { bgOpacity: Number(e.target.value) })}
                                style={{ width: "100%", accentColor: C.accent }} />
                            </div>
                          </div>
                          {/* Timing */}
                          <div>
                            <p style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>{fmtS(layer.startTime)} → {fmtS(layer.endTime)}</p>
                            <input type="range" min={0} max={totalDur || 10} step={0.1} value={layer.startTime}
                              onChange={e => updText(layer.id, { startTime: Math.min(Number(e.target.value), layer.endTime - 0.1) })}
                              style={{ width: "100%", accentColor: C.accent, marginBottom: 4 }} />
                            <input type="range" min={0} max={totalDur || 10} step={0.1} value={layer.endTime}
                              onChange={e => updText(layer.id, { endTime: Math.max(Number(e.target.value), layer.startTime + 0.1) })}
                              style={{ width: "100%", accentColor: C.accent }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Subtitles */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 11 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>Subtitles ({subs.length})</span>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => srtRef.current?.click()} style={{ ...bsm(C), fontSize: 10, padding: "2px 7px" }}>Import SRT</button>
                      {subs.length > 0 && <button onClick={() => { setSubs([]); setSelSub(null); toast_("Cleared", "ok"); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 11 }}>Clear</button>}
                    </div>
                  </div>
                  <button onClick={() => setSubs(p => [...p, { id: uid(), text: "Subtitle text", start: ct, end: clamp(ct + 3, 0, totalDur || ct + 3) }])}
                    style={{ width: "100%", padding: "6px 0", background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 11, cursor: "pointer", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <Plus size={12} /> Add at Playhead ({fmtS(ct)})
                  </button>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 220, overflowY: "auto" }}>
                    {subs.map((s, i) => (
                      <div key={s.id} onClick={() => { setSelSub(s.id); seekTo(s.start); }}
                        style={{ background: selSub === s.id ? "hsl(262 40% 17%)" : C.bg3, border: `1px solid ${selSub === s.id ? C.accent : C.border}`, borderRadius: 7, padding: "6px 8px", cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                          <span style={{ fontSize: 10, color: C.muted, flexShrink: 0 }}>{i + 1}. {fmtS(s.start)}→{fmtS(s.end)}</span>
                          <div style={{ flex: 1 }} />
                          <button onClick={e => { e.stopPropagation(); delSub(s.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={11} /></button>
                        </div>
                        {selSub === s.id
                          ? <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            <textarea value={s.text} rows={2} onChange={e => updSub(s.id, { text: e.target.value })}
                              style={{ width: "100%", background: "hsl(220 14% 11%)", border: `1px solid ${C.border}`, borderRadius: 5, padding: "4px 6px", color: C.text, fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                              <div>
                                <p style={{ fontSize: 9, color: C.muted, marginBottom: 2 }}>Start {fmtS(s.start)}</p>
                                <input type="range" min={0} max={totalDur || 10} step={0.1} value={s.start}
                                  onChange={e => updSub(s.id, { start: Math.min(Number(e.target.value), s.end - 0.1) })}
                                  style={{ width: "100%", accentColor: C.accent }} />
                              </div>
                              <div>
                                <p style={{ fontSize: 9, color: C.muted, marginBottom: 2 }}>End {fmtS(s.end)}</p>
                                <input type="range" min={0} max={totalDur || 10} step={0.1} value={s.end}
                                  onChange={e => updSub(s.id, { end: Math.max(Number(e.target.value), s.start + 0.1) })}
                                  style={{ width: "100%", accentColor: C.accent }} />
                              </div>
                            </div>
                          </div>
                          : <p style={{ fontSize: 12, color: C.text, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.text}</p>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── Tools tab ───────────────────────────────────────────── */}
            {tab === "tools" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 2 }}>
                  All tools run entirely in-browser via FFmpeg. FFmpeg loads automatically on first use.
                </p>

                {/* Compress */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>🗜 Compress Video</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                    {CRF_PRESETS.map(p => (
                      <label key={p.crf} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", background: crf === p.crf ? "hsl(262 40% 16%)" : C.bg3, borderRadius: 7, padding: "5px 9px", border: `1px solid ${crf === p.crf ? C.accent : C.border}` }}>
                        <input type="radio" name="crf" checked={crf === p.crf} onChange={() => setCrf(p.crf)} style={{ accentColor: C.accent }} />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{p.label}</span>
                        <span style={{ fontSize: 10, color: C.muted }}>CRF {p.crf}</span>
                      </label>
                    ))}
                  </div>
                  <CompressBtn label="Choose video file to compress" onFile={f => quickCompress(f, crf)}
                    color="hsl(200 60% 18%)" borderColor="hsl(200 60% 30%)" textColor="hsl(200 80% 65%)" />
                </div>

                {/* Convert */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}><ArrowRightLeft size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />Convert Format</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
                    {(["mp4", "gif"] as const).map(f => (
                      <CompressBtn key={f} label={`→ ${f.toUpperCase()}`} onFile={file => quickConvert(file, f)}
                        color={C.bg3} borderColor={C.border} textColor={C.text} />
                    ))}
                  </div>
                  <p style={{ fontSize: 10, color: C.muted, marginTop: 5 }}>Pick any video and it converts + downloads instantly</p>
                </div>

                {/* Video→GIF */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>🎞 GIF Tools</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <CompressBtn label="Video → GIF" onFile={f => quickConvert(f, "gif")}
                      color="hsl(40 70% 15%)" borderColor="hsl(40 70% 28%)" textColor="hsl(40 80% 65%)" />
                    <CompressBtn label="GIF → MP4" onFile={convertGif} accept=".gif,image/gif"
                      color="hsl(40 70% 15%)" borderColor="hsl(40 70% 28%)" textColor="hsl(40 80% 65%)" />
                  </div>
                </div>

                {/* Extract audio from selected clip */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>🎵 Extract Audio</p>
                  {selClipObj && selClipObj.type === "video"
                    ? <>
                      <p style={{ fontSize: 11, color: C.muted, marginBottom: 7 }}>From: <strong style={{ color: C.text }}>{selClipObj.name}</strong></p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {(["mp3", "wav"] as const).map(f => (
                          <button key={f} onClick={() => extractAudio(selClipObj.id, f)}
                            style={{ padding: "8px 0", background: "hsl(0 55% 16%)", border: `1px solid hsl(0 55% 27%)`, borderRadius: 8, color: "hsl(0 70% 68%)", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                            {ffLd ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Mic size={11} />}
                            → {f.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </>
                    : <p style={{ fontSize: 11, color: C.muted, textAlign: "center" }}>Select a video clip on the timeline first, then extract its audio here</p>
                  }
                </div>
              </div>
            )}

            {/* ─── Export tab ──────────────────────────────────────────── */}
            {tab === "export" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Format */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>Format</p>
                  {(["mp4", "gif"] as const).map(f => (
                    <label key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
                      <input type="radio" name="fmt" checked={fmt === f} onChange={() => setFmt(f)} style={{ accentColor: C.accent }} />
                      <span style={{ fontWeight: 600 }}>{f.toUpperCase()}</span>
                      <span style={{ color: C.muted, fontSize: 11 }}>{f === "gif" ? "Animated GIF" : "VP9 — web"}</span>
                    </label>
                  ))}
                </div>
                {/* Quality */}
                {fmt !== "gif" && (
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>Quality — CRF {crf}</p>
                    <input type="range" min={14} max={40} value={crf} onChange={e => setCrf(Number(e.target.value))}
                      style={{ width: "100%", accentColor: C.accent, marginBottom: 5 }} />
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {CRF_PRESETS.map(p => (
                        <button key={p.crf} onClick={() => setCrf(p.crf)}
                          style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, border: "none", cursor: "pointer", background: crf === p.crf ? C.accent : C.bg4, color: crf === p.crf ? "#fff" : C.muted }}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Resolution */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 7 }}>Resolution</p>
                  {(["original", "720p", "480p"] as const).map(r => (
                    <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
                      <input type="radio" name="res" checked={res === r} onChange={() => setRes(r)} style={{ accentColor: C.accent }} />
                      <span>{r === "original" ? "Original" : r}</span>
                    </label>
                  ))}
                </div>
                {/* Subtitle indicator */}
                {subs.length > 0 && (
                  <div style={{ background: "hsl(142 40% 12%)", borderRadius: 8, padding: "7px 10px", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "hsl(142 70% 55%)" }}>
                    <Check size={12} /> {subs.length} subtitle{subs.length !== 1 ? "s" : ""} will be burned in
                  </div>
                )}
                {/* Load FFmpeg */}
                {!ffOk && !ffLd && (
                  <button onClick={loadFF}
                    style={{ padding: "8px 0", background: C.bg4, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Download size={13} /> Load FFmpeg Engine
                  </button>
                )}
                {ffLd && <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.muted, fontSize: 12 }}><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Loading FFmpeg…</div>}
                {ffOk && <div style={{ display: "flex", alignItems: "center", gap: 5, color: C.ok, fontSize: 12 }}><Check size={13} /> FFmpeg ready</div>}
                <button onClick={exportVideo} disabled={proc}
                  style={{ padding: "10px 0", background: proc ? C.bg3 : C.accent, border: "none", borderRadius: 10, color: proc ? C.muted : "#fff", fontWeight: 700, fontSize: 14, cursor: proc ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {proc ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />{pct}%</> : <><Download size={15} /> Export {fmt.toUpperCase()}</>}
                </button>
                <p style={{ fontSize: 10, color: C.muted, textAlign: "center" }}>FFmpeg auto-loads if not ready</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Timeline ───────────────────────────────────────────────────── */}
      <div style={{ background: C.bg2, borderTop: `1px solid ${C.border}`, flexShrink: 0, height: 218 }}>
        {/* Toolbar */}
        <div style={{ padding: "4px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 5 }}>
          <button onClick={() => { if (!selClip) { toast_("Click a clip first", "err"); return; } splitClip(selClip); }}
            style={{ ...bsm(C), background: selClip ? "hsl(262 40% 20%)" : C.bg3, borderColor: selClip ? C.accent : C.border, color: selClip ? C.accent : C.muted }}>
            <Scissors size={12} /> Split
          </button>
          <button onClick={() => { if (!selClip) { toast_("Click a clip first", "err"); return; } deleteClip(selClip); }}
            style={{ ...bsm(C), background: selClip ? "hsl(0 50% 16%)" : C.bg3, borderColor: selClip ? "hsl(0 60% 35%)" : C.border, color: selClip ? "hsl(0 70% 68%)" : C.muted }}>
            <Trash2 size={12} /> Delete
          </button>
          <div style={{ width: 1, height: 13, background: C.border }} />
          <button onClick={() => setZoom(z => Math.min(z * 1.5, 300))} style={bsm(C)}><ZoomIn size={12} /></button>
          <button onClick={() => setZoom(z => Math.max(z / 1.5, 15))} style={bsm(C)}><ZoomOut size={12} /></button>
          <span style={{ fontSize: 10, color: C.muted }}>{Math.round(zoom)}px/s</span>
          <div style={{ flex: 1 }} />
          {selClip
            ? <span style={{ fontSize: 10, color: C.accent }}>✓ Clip selected — drag edges to trim · S=Split · Del=Delete</span>
            : <span style={{ fontSize: 10, color: C.muted }}>Click any clip to select it · Drag clip edges to trim</span>
          }
        </div>

        {/* Track area */}
        <div ref={timelineRef} onClick={onTlClick}
          style={{ overflowX: "auto", overflowY: "auto", position: "relative", height: 170, cursor: "default" }}>
          <div style={{ position: "relative", minWidth: Math.max(800, totalDur * zoom + 240), height: "100%" }}>
            {/* Ruler */}
            <div style={{ position: "sticky", left: 0, top: 0, height: 20, borderBottom: `1px solid ${C.border}`, background: C.bg2, zIndex: 5, display: "flex" }}>
              <div style={{ width: 64, flexShrink: 0, borderRight: `1px solid ${C.border}` }} />
              <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
                {Array.from({ length: Math.ceil(totalDur) + 20 }, (_, i) => (
                  <div key={i} style={{ position: "absolute", left: i * zoom, top: 0, bottom: 0, borderLeft: `1px solid ${C.border}`, paddingLeft: 2, fontSize: 9, color: C.muted, lineHeight: "18px", pointerEvents: "none" }}>
                    {fmtS(i)}
                  </div>
                ))}
              </div>
            </div>

            {/* Video & Overlay tracks */}
            {[
              { track: 0, label: "Video", icon: <Video size={9} /> },
              { track: 1, label: "Overlay", icon: <Layers size={9} /> },
            ].map(({ track, label, icon }) => (
              <div key={track} style={{ position: "relative", height: TRACK_H, borderBottom: `1px solid ${C.border}`, display: "flex" }}>
                <div style={{ width: 64, flexShrink: 0, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, color: C.muted, fontSize: 9 }}>
                  {icon}{label}
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  {clips.filter(c => c.track === track).map(clip => {
                    const sel = selClip === clip.id;
                    const hov = hovClip === clip.id;
                    const w = Math.max(24, clip.duration * zoom);
                    const clrBase = clip.type === "image" ? "hsl(200 55% 28%)" : clip.type === "gif" ? "hsl(150 45% 24%)" : "hsl(220 38% 28%)";
                    return (
                      <div key={clip.id} style={{ position: "absolute", left: clip.startTime * zoom, top: 3, width: w, height: TRACK_H - 6 }}>
                        {/* Clip body */}
                        <div
                          onMouseEnter={() => setHovClip(clip.id)}
                          onMouseLeave={() => setHovClip(null)}
                          onClick={e => { e.stopPropagation(); setSelClip(clip.id); setTab("fx"); }}
                          onMouseDown={e => {
                            e.stopPropagation();
                            setSelClip(clip.id);
                            dragClip.current = { id: clip.id, sx: e.clientX, ox: clip.startTime };
                          }}
                          style={{
                            position: "absolute", inset: 0,
                            background: sel ? "hsl(262 55% 36%)" : clrBase,
                            borderRadius: 6, cursor: "grab",
                            border: sel ? `2px solid ${C.accent}` : `1px solid rgba(255,255,255,0.1)`,
                            display: "flex", alignItems: "center", padding: "0 10px 0 14px", gap: 4,
                            fontSize: 11, color: "#fff", overflow: "hidden", whiteSpace: "nowrap", userSelect: "none",
                          }}>
                          {clip.type === "image" ? <ImageIcon size={10} /> : clip.type === "gif" ? <Film size={10} /> : <Video size={10} />}
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{clip.name}</span>
                          {clip.audioRemoved && <VolumeX size={9} style={{ flexShrink: 0, opacity: 0.7 }} />}
                          {clip.replacementAudio && <Mic size={9} style={{ flexShrink: 0, opacity: 0.7 }} />}
                          {sel && <Check size={10} style={{ flexShrink: 0, color: C.accent }} />}
                        </div>

                        {/* ── FIX: × delete button directly on clip, always visible on hover/select ── */}
                        {(sel || hov) && (
                          <button
                            onClick={e => { e.stopPropagation(); deleteClip(clip.id); }}
                            onMouseDown={e => e.stopPropagation()}
                            title="Delete clip"
                            style={{
                              position: "absolute", top: 0, right: 0, zIndex: 4,
                              background: "hsl(0 65% 45%)", border: "none", borderRadius: "0 5px 0 5px",
                              width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", color: "#fff",
                            }}>
                            <X size={10} />
                          </button>
                        )}

                        {/* Trim handles — only on selected clip */}
                        {sel && w > 30 && (
                          <>
                            {/* Left trim handle */}
                            <div
                              onMouseDown={e => {
                                e.stopPropagation();
                                dragTrim.current = { id: clip.id, side: "L", sx: e.clientX, ots: clip.trimStart, ote: clip.trimEnd, ostart: clip.startTime, odur: clip.duration };
                              }}
                              title="Drag to trim start"
                              style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, cursor: "ew-resize", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.15)", borderRadius: "5px 0 0 5px" }}>
                              <div style={{ width: 2, height: 18, background: "rgba(255,255,255,0.9)", borderRadius: 2 }} />
                            </div>
                            {/* Right trim handle */}
                            <div
                              onMouseDown={e => {
                                e.stopPropagation();
                                dragTrim.current = { id: clip.id, side: "R", sx: e.clientX, ots: clip.trimStart, ote: clip.trimEnd, ostart: clip.startTime, odur: clip.duration };
                              }}
                              title="Drag to trim end"
                              style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 10, cursor: "ew-resize", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.15)", borderRadius: "0 5px 5px 0" }}>
                              <div style={{ width: 2, height: 18, background: "rgba(255,255,255,0.9)", borderRadius: 2 }} />
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Audio track */}
            <div style={{ position: "relative", height: TRACK_H, borderBottom: `1px solid ${C.border}`, display: "flex" }}>
              <div style={{ width: 64, flexShrink: 0, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, color: C.muted, fontSize: 9 }}>
                <Music size={9} />Audio
              </div>
              <div style={{ flex: 1, position: "relative" }}>
                {audios.map(a => (
                  <div key={a.id}
                    style={{ position: "absolute", left: a.startTime * zoom, top: 3, height: TRACK_H - 6, minWidth: 80, background: "hsl(262 38% 22%)", borderRadius: 6, padding: "0 6px", display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#fff", border: "1px solid hsl(262 50% 36%)", overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer" }}>
                    <Music size={9} /><span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</span>
                    <button onClick={e => { e.stopPropagation(); setAudios(p => p.filter(x => x.id !== a.id)); }} onMouseDown={e => e.stopPropagation()}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: 2, marginLeft: "auto", flexShrink: 0 }}><X size={9} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Text/Subtitle track */}
            <div style={{ position: "relative", height: TRACK_H, display: "flex" }}>
              <div style={{ width: 64, flexShrink: 0, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, color: C.muted, fontSize: 9 }}>
                <FileText size={9} />Subs
              </div>
              <div style={{ flex: 1, position: "relative" }}>
                {[
                  ...texts.map(l => ({ id: l.id, st: l.startTime, et: l.endTime, txt: l.text, isSub: false })),
                  ...subs.map(s => ({ id: s.id, st: s.start, et: s.end, txt: s.text, isSub: true })),
                ].map(item => (
                  <div key={item.id}
                    onClick={e => { e.stopPropagation(); if (item.isSub) { setSelSub(item.id); } else { setSelText(item.id); } setTab("subs"); }}
                    style={{
                      position: "absolute", left: item.st * zoom, top: 3,
                      width: Math.max(22, (item.et - item.st) * zoom), height: TRACK_H - 6,
                      background: item.isSub ? "hsl(150 40% 18%)" : "hsl(40 55% 20%)",
                      borderRadius: 6, fontSize: 10, color: "#fff", padding: "0 6px",
                      display: "flex", alignItems: "center", gap: 3, overflow: "hidden",
                      whiteSpace: "nowrap", border: `1px solid ${item.isSub ? "hsl(150 50% 30%)" : "hsl(40 55% 30%)"}`,
                      cursor: "pointer", userSelect: "none",
                    }}>
                    <Type size={8} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{item.txt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Playhead */}
            <div style={{ position: "absolute", left: 64 + ct * zoom, top: 0, bottom: 0, width: 2, background: C.accent, zIndex: 10, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: 0, left: -5, width: 10, height: 10, background: C.accent, borderRadius: "2px 2px 0 0" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Processing overlay ──────────────────────────────────────────── */}
      {proc && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, padding: "28px 36px", width: 340, textAlign: "center" }}>
            <Loader2 size={36} color={C.accent} style={{ margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{plbl || "Processing…"}</p>
            <div style={{ background: C.bg3, borderRadius: 8, height: 8, overflow: "hidden", marginTop: 12 }}>
              <div style={{ height: "100%", background: C.accent, width: `${pct}%`, transition: "width 0.3s", borderRadius: 8 }} />
            </div>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>{pct}%</p>
            <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>Running in browser — keep this tab open</p>
          </div>
        </div>
      )}

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {toast && (
        <div style={{ position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)", background: toast.type === "ok" ? "hsl(142 55% 14%)" : toast.type === "err" ? "hsl(0 55% 14%)" : "hsl(220 30% 15%)", border: `1px solid ${toast.type === "ok" ? C.ok : toast.type === "err" ? C.err : C.border}`, borderRadius: 10, padding: "9px 16px", color: toast.type === "ok" ? C.ok : toast.type === "err" ? C.err : C.text, display: "flex", alignItems: "center", gap: 8, fontSize: 13, zIndex: 1000, maxWidth: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>
          {toast.type === "ok" ? <Check size={14} /> : toast.type === "err" ? <AlertCircle size={14} /> : <Info size={14} />}
          {toast.msg}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function bsm(C: { bg3: string; border: string; text: string; muted: string }) {
  return {
    background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6,
    padding: "4px 8px", color: C.text, fontSize: 11, fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center" as const, gap: 4,
  };
}

/** A button that opens a file picker on click, then calls onFile */
function CompressBtn({ label, onFile, color, borderColor, textColor, accept = "video/*" }: {
  label: string; onFile: (f: File) => void;
  color: string; borderColor: string; textColor: string; accept?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button onClick={() => ref.current?.click()}
        style={{ width: "100%", padding: "8px 0", background: color, border: `1px solid ${borderColor}`, borderRadius: 8, color: textColor, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
        {label}
      </button>
      <input ref={ref} type="file" accept={accept} style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) { onFile(f); } e.target.value = ""; }} />
    </>
  );
}

function Sld({ label, val, min, max, accent, textClr, mutedClr, onChange, reset }: {
  label: string; val: number; min: number; max: number;
  accent: string; textClr: string; mutedClr: string;
  onChange: (v: number) => void; reset: () => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 12, color: textClr }}>{label}</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: mutedClr, fontVariantNumeric: "tabular-nums" }}>{val}</span>
          <button onClick={reset} style={{ fontSize: 11, color: mutedClr, background: "none", border: "none", cursor: "pointer" }}>↺</button>
        </div>
      </div>
      <input type="range" min={min} max={max} value={val}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: accent, cursor: "pointer" }} />
    </div>
  );
}

function Tog({ label, val, accent, bg, textClr, onChange }: {
  label: string; val: boolean; accent: string; bg: string; textClr: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: bg, borderRadius: 8, padding: "7px 10px" }}>
      <span style={{ fontSize: 12, color: textClr }}>{label}</span>
      <button onClick={() => onChange(!val)}
        style={{ width: 36, height: 19, borderRadius: 10, background: val ? accent : "hsl(220 14% 26%)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
        <div style={{ position: "absolute", top: 1.5, left: val ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
      </button>
    </div>
  );
}


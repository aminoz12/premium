"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";

// ═══════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════
interface Tool {
  id: string;
  cat: string;
  title: string;
  full: string;
  desc: string;
  act: string;
  ext: string;
  mime: string;
  accept: string;
  color: string;
  icon: string;
}

interface Toast {
  id: number;
  msg: string;
  type: "s" | "e" | "i";
}

interface OrigMeta {
  dur: number;
  sr: number;
  ch: number;
  size: number;
}

// ═══════════════════════════════════════════════════════════════
//  TOOLS REGISTRY — 50+ audio tools
// ═══════════════════════════════════════════════════════════════
const TOOLS: Tool[] = [
  // CONVERT — Format to Format
  { id: "mp3-to-wav", cat: "convert", title: "MP3 → WAV", full: "MP3 to WAV Converter", desc: "Convert MP3 to lossless WAV format", act: "Convert to WAV", ext: "wav", mime: "audio/wav", accept: "audio/mpeg,audio/mp3", color: "#f97316", icon: "note" },
  { id: "wav-to-mp3", cat: "convert", title: "WAV → MP3", full: "WAV to MP3 Converter", desc: "Compress WAV to MP3 with bitrate control", act: "Convert to MP3", ext: "mp3", mime: "audio/mpeg", accept: "audio/wav,audio/wave", color: "#3b82f6", icon: "note" },
  { id: "mp3-to-ogg", cat: "convert", title: "MP3 → OGG", full: "MP3 to OGG Converter", desc: "Convert MP3 to OGG Vorbis format", act: "Convert to OGG", ext: "ogg", mime: "audio/ogg", accept: "audio/mpeg,audio/mp3", color: "#06b6d4", icon: "note" },
  { id: "ogg-to-mp3", cat: "convert", title: "OGG → MP3", full: "OGG to MP3 Converter", desc: "Convert OGG Vorbis to universal MP3", act: "Convert to MP3", ext: "mp3", mime: "audio/mpeg", accept: "audio/ogg", color: "#0891b2", icon: "note" },
  { id: "mp3-to-m4a", cat: "convert", title: "MP3 → M4A", full: "MP3 to M4A Converter", desc: "Convert MP3 to Apple M4A format", act: "Convert to M4A", ext: "m4a", mime: "audio/mp4", accept: "audio/mpeg,audio/mp3", color: "#10b981", icon: "note" },
  { id: "m4a-to-mp3", cat: "convert", title: "M4A → MP3", full: "M4A to MP3 Converter", desc: "Convert iTunes M4A files to MP3", act: "Convert to MP3", ext: "mp3", mime: "audio/mpeg", accept: "audio/mp4,audio/m4a", color: "#059669", icon: "note" },
  { id: "wav-to-ogg", cat: "convert", title: "WAV → OGG", full: "WAV to OGG Converter", desc: "Convert WAV to compact OGG Vorbis", act: "Convert to OGG", ext: "ogg", mime: "audio/ogg", accept: "audio/wav,audio/wave", color: "#ec4899", icon: "note" },
  { id: "ogg-to-wav", cat: "convert", title: "OGG → WAV", full: "OGG to WAV Converter", desc: "Convert OGG to lossless WAV format", act: "Convert to WAV", ext: "wav", mime: "audio/wav", accept: "audio/ogg", color: "#db2777", icon: "note" },
  { id: "wav-to-m4a", cat: "convert", title: "WAV → M4A", full: "WAV to M4A Converter", desc: "Convert WAV to Apple M4A audio", act: "Convert to M4A", ext: "m4a", mime: "audio/mp4", accept: "audio/wav,audio/wave", color: "#be185d", icon: "note" },
  { id: "m4a-to-wav", cat: "convert", title: "M4A → WAV", full: "M4A to WAV Converter", desc: "Convert Apple M4A to WAV", act: "Convert to WAV", ext: "wav", mime: "audio/wav", accept: "audio/mp4,audio/m4a", color: "#7c3aed", icon: "note" },
  { id: "flac-to-mp3", cat: "convert", title: "FLAC → MP3", full: "FLAC to MP3 Converter", desc: "Convert lossless FLAC to MP3", act: "Convert to MP3", ext: "mp3", mime: "audio/mpeg", accept: "audio/flac", color: "#6d28d9", icon: "note" },
  { id: "flac-to-wav", cat: "convert", title: "FLAC → WAV", full: "FLAC to WAV Converter", desc: "Convert FLAC to standard WAV", act: "Convert to WAV", ext: "wav", mime: "audio/wav", accept: "audio/flac", color: "#64748b", icon: "note" },
  { id: "aac-to-mp3", cat: "convert", title: "AAC → MP3", full: "AAC to MP3 Converter", desc: "Convert AAC audio to MP3", act: "Convert to MP3", ext: "mp3", mime: "audio/mpeg", accept: "audio/aac", color: "#475569", icon: "note" },
  { id: "aac-to-wav", cat: "convert", title: "AAC → WAV", full: "AAC to WAV Converter", desc: "Convert AAC to lossless WAV", act: "Convert to WAV", ext: "wav", mime: "audio/wav", accept: "audio/aac", color: "#f43f5e", icon: "note" },
  { id: "mp4-to-mp3", cat: "convert", title: "MP4 → MP3", full: "MP4 Audio to MP3 Converter", desc: "Extract MP3 audio from MP4 files", act: "Convert to MP3", ext: "mp3", mime: "audio/mpeg", accept: "audio/mp4,video/mp4", color: "#e11d48", icon: "note" },
  { id: "mp4-to-wav", cat: "convert", title: "MP4 → WAV", full: "MP4 Audio to WAV Converter", desc: "Extract WAV audio from MP4 files", act: "Convert to WAV", ext: "wav", mime: "audio/wav", accept: "audio/mp4,video/mp4", color: "#9f1239", icon: "note" },
  { id: "aiff-to-mp3", cat: "convert", title: "AIFF → MP3", full: "AIFF to MP3 Converter", desc: "Convert Apple AIFF to MP3", act: "Convert to MP3", ext: "mp3", mime: "audio/mpeg", accept: "audio/aiff,audio/x-aiff", color: "#854d0e", icon: "note" },
  { id: "video-to-mp3", cat: "convert", title: "Video → MP3", full: "Extract MP3 from Video", desc: "Extract audio from MP4 / MP4 / MOV as MP3", act: "Extract MP3", ext: "mp3", mime: "audio/mpeg", accept: "video/*,audio/*", color: "#713f12", icon: "note" },
  { id: "any-to-mp3", cat: "convert", title: "Any → MP3", full: "Universal to MP3 Converter", desc: "Convert any audio format to MP3", act: "Convert to MP3", ext: "mp3", mime: "audio/mpeg", accept: "audio/*,video/*", color: "#365314", icon: "note" },
  { id: "any-to-wav", cat: "convert", title: "Any → WAV", full: "Universal to WAV Converter", desc: "Convert any audio to lossless WAV", act: "Convert to WAV", ext: "wav", mime: "audio/wav", accept: "audio/*,video/*", color: "#14532d", icon: "note" },
  // EDIT
  { id: "trim", cat: "edit", title: "Trim / Cut", full: "Trim & Cut Audio", desc: "Cut a precise section by start/end time", act: "Trim Audio", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#1d4ed8", icon: "cut" },
  { id: "reverse", cat: "edit", title: "Reverse", full: "Reverse Audio", desc: "Play any audio backwards in one click", act: "Reverse Audio", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#1e40af", icon: "reverse" },
  { id: "fade-in", cat: "edit", title: "Fade In", full: "Add Fade In Effect", desc: "Smoothly fade audio in at start", act: "Apply Fade In", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#0369a1", icon: "fade" },
  { id: "fade-out", cat: "edit", title: "Fade Out", full: "Add Fade Out Effect", desc: "Smoothly fade audio out at end", act: "Apply Fade Out", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#0c4a6e", icon: "fade" },
  { id: "volume", cat: "edit", title: "Volume", full: "Adjust Audio Volume", desc: "Increase or decrease overall loudness", act: "Apply Volume", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#10b981", icon: "volume" },
  { id: "speed", cat: "edit", title: "Speed", full: "Change Audio Speed", desc: "Speed up or slow down (changes pitch too)", act: "Apply Speed", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#8b5cf6", icon: "speed" },
  { id: "mono-to-stereo", cat: "edit", title: "Mono → Stereo", full: "Mono to Stereo Converter", desc: "Convert mono audio to dual-channel stereo", act: "Convert to Stereo", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#14b8a6", icon: "channels" },
  { id: "stereo-to-mono", cat: "edit", title: "Stereo → Mono", full: "Stereo to Mono Converter", desc: "Combine stereo channels to single mono", act: "Convert to Mono", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#84cc16", icon: "channels" },
  { id: "sample-rate", cat: "edit", title: "Sample Rate", full: "Change Sample Rate", desc: "Resample to 22.05/44.1/48/96 kHz", act: "Resample", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#f43f5e", icon: "rate" },
  { id: "silence-trim", cat: "edit", title: "Trim Silence", full: "Trim Leading/Trailing Silence", desc: "Auto-remove quiet sections at start and end", act: "Trim Silence", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#a78bfa", icon: "cut" },
  // EFFECTS
  { id: "reverb", cat: "effect", title: "Reverb", full: "Add Reverb Effect", desc: "Add room or hall reverberation", act: "Apply Reverb", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#60a5fa", icon: "fx" },
  { id: "echo", cat: "effect", title: "Echo / Delay", full: "Add Echo / Delay Effect", desc: "Add delayed echo with feedback control", act: "Apply Echo", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#34d399", icon: "fx" },
  { id: "distortion", cat: "effect", title: "Distortion", full: "Add Distortion / Overdrive", desc: "Add guitar-style distortion / fuzz", act: "Apply Distortion", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#2dd4bf", icon: "fx" },
  { id: "lowpass", cat: "effect", title: "Low-Pass", full: "Low-Pass Filter (Muffled)", desc: "Remove high frequencies (muffled effect)", act: "Apply Filter", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#e879f9", icon: "fx" },
  { id: "highpass", cat: "effect", title: "High-Pass", full: "High-Pass Filter (Tinny)", desc: "Remove low frequencies (tinny effect)", act: "Apply Filter", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#d946ef", icon: "fx" },
  { id: "bass-boost", cat: "effect", title: "Bass Boost", full: "Bass Boost Effect", desc: "Boost low-frequency bass response", act: "Boost Bass", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#fbbf24", icon: "fx" },
  { id: "treble-boost", cat: "effect", title: "Treble Boost", full: "Treble Boost Effect", desc: "Brighten high-frequency treble", act: "Boost Treble", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#fb923c", icon: "fx" },
  { id: "pitch", cat: "effect", title: "Pitch Shift", full: "Pitch Shifter", desc: "Shift pitch up or down (semitones)", act: "Shift Pitch", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#f97316", icon: "fx" },
  { id: "robot", cat: "effect", title: "Robot Voice", full: "Robot / Vocoder Voice", desc: "Apply tremolo robot / vocoder voice", act: "Robotize", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#a3e635", icon: "fx" },
  { id: "telephone", cat: "effect", title: "Telephone", full: "Telephone / Walkie-Talkie", desc: "Make audio sound like a phone call", act: "Apply Phone Effect", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#4ade80", icon: "fx" },
  // ADJUST
  { id: "normalize", cat: "adjust", title: "Normalize", full: "Normalize Audio Volume", desc: "Auto-adjust to maximum without clipping", act: "Normalize", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#22d3ee", icon: "adjust" },
  { id: "gain", cat: "adjust", title: "Gain", full: "Apply Audio Gain (dB)", desc: "Adjust gain level in decibels", act: "Apply Gain", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#818cf8", icon: "adjust" },
  { id: "compressor", cat: "adjust", title: "Compressor", full: "Dynamics Compressor", desc: "Even out loud and quiet sections", act: "Compress Audio", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#c084fc", icon: "adjust" },
  { id: "bitrate", cat: "adjust", title: "MP3 Bitrate", full: "Re-encode MP3 at New Bitrate", desc: "Change MP3 bitrate (compress/uncompress)", act: "Re-encode", ext: "mp3", mime: "audio/mpeg", accept: "audio/*", color: "#6b7280", icon: "adjust" },
  { id: "channels", cat: "adjust", title: "Channel Swap", full: "Swap Stereo Channels (L↔R)", desc: "Swap left and right stereo channels", act: "Swap Channels", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#92400e", icon: "adjust" },
  // EXPORT
  { id: "to-base64", cat: "export", title: "→ Base64", full: "Audio to Base64 Encoder", desc: "Encode audio to Base64 string for embedding", act: "Encode Base64", ext: "txt", mime: "text/plain", accept: "audio/*", color: "#1e293b", icon: "code" },
  { id: "to-dataurl", cat: "export", title: "→ Data URL", full: "Audio to Data URL", desc: "Get a data: URL ready for HTML/CSS embedding", act: "Get Data URL", ext: "txt", mime: "text/plain", accept: "audio/*", color: "#b45309", icon: "code" },
  { id: "ringtone", cat: "export", title: "Ringtone", full: "30-Second Ringtone Maker", desc: "Create a 30-second ringtone clip with fade", act: "Make Ringtone", ext: "mp3", mime: "audio/mpeg", accept: "audio/*", color: "#374151", icon: "export" },
  { id: "podcast", cat: "export", title: "Podcast MP3", full: "Podcast-Ready MP3 (mono 64k)", desc: "Export mono 64 kbps MP3 — small podcast files", act: "Export Podcast", ext: "mp3", mime: "audio/mpeg", accept: "audio/*", color: "#059669", icon: "export" },
  { id: "waveform", cat: "export", title: "Waveform PNG", full: "Export Audio Waveform as PNG", desc: "Save a styled waveform image for thumbnails", act: "Export Waveform", ext: "png", mime: "image/png", accept: "audio/*", color: "#4f46e5", icon: "export" },
  // AI-STYLE
  { id: "8d-audio", cat: "ai", title: "8D Audio", full: "8D Audio (Surround Pan)", desc: "Smoothly pans audio L↔R for headphone effect", act: "Apply 8D", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#0f172a", icon: "fx" },
  { id: "lofi", cat: "ai", title: "Slow + Reverb", full: "Lo-Fi Slow + Reverb", desc: "Trending lo-fi slowed-down + reverb effect", act: "Apply Lo-Fi", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#7e22ce", icon: "fx" },
  { id: "vinyl", cat: "ai", title: "Vinyl Crackle", full: "Vinyl Crackle Effect", desc: "Add nostalgic vinyl crackle & low-pass", act: "Add Vinyl", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#be123c", icon: "fx" },
  { id: "chipmunk", cat: "ai", title: "Chipmunk", full: "Chipmunk Voice Effect", desc: "Speed up + pitch up to chipmunk-style voice", act: "Chipmunk-ify", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#15803d", icon: "fx" },
  { id: "deep-voice", cat: "ai", title: "Deep Voice", full: "Deep Voice / Demon Effect", desc: "Slow down + pitch down to deep voice", act: "Deepen Voice", ext: "wav", mime: "audio/wav", accept: "audio/*", color: "#57534e", icon: "fx" },
];

// ═══════════════════════════════════════════════════════════════
//  ICON SVGs
// ═══════════════════════════════════════════════════════════════
const ICONS: Record<string, string> = {
  note: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  cut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
  reverse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>`,
  fade: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 3v18M3 21L21 3"/></svg>`,
  volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>`,
  speed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  channels: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
  rate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
  fx: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  adjust: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  export: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
};

// ═══════════════════════════════════════════════════════════════
//  AUDIO HELPERS (pure functions, no hooks)
// ═══════════════════════════════════════════════════════════════
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numCh = buffer.numberOfChannels;
  const sr = buffer.sampleRate;
  const len = buffer.length * numCh * 2 + 44;
  const ab = new ArrayBuffer(len);
  const v = new DataView(ab);
  const wStr = (off: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); };
  wStr(0, "RIFF"); v.setUint32(4, len - 8, true); wStr(8, "WAVE");
  wStr(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, numCh, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * numCh * 2, true);
  v.setUint16(32, numCh * 2, true); v.setUint16(34, 16, true);
  wStr(36, "data"); v.setUint32(40, len - 44, true);
  let off = 44;
  const chs: Float32Array[] = [];
  for (let c = 0; c < numCh; c++) chs.push(buffer.getChannelData(c));
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numCh; c++) {
      let s = Math.max(-1, Math.min(1, chs[c][i]));
      s = s < 0 ? s * 0x8000 : s * 0x7fff;
      v.setInt16(off, s, true);
      off += 2;
    }
  }
  return new Blob([ab], { type: "audio/wav" });
}

function audioBufferToMp3(buffer: AudioBuffer, kbps: number): Blob {
  const w = window as any;
  if (!w.lamejs || !w.lamejs.Mp3Encoder) throw new Error("MP3 encoder failed to load. Check your network and try again.");
  const numCh = Math.min(2, buffer.numberOfChannels);
  const sr = buffer.sampleRate;
  const enc = new w.lamejs.Mp3Encoder(numCh, sr, kbps || 128);
  const blockSize = 1152;
  const mp3Data: BlobPart[] = [];
  const float2int = (f: Float32Array) => {
    const out = new Int16Array(f.length);
    for (let i = 0; i < f.length; i++) {
      let s = Math.max(-1, Math.min(1, f[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  };
  const left = float2int(buffer.getChannelData(0));
  const right = numCh > 1 ? float2int(buffer.getChannelData(1)) : null;
  for (let i = 0; i < left.length; i += blockSize) {
    const lc = left.subarray(i, i + blockSize);
    let buf: any;
    if (right) { const rc = right.subarray(i, i + blockSize); buf = enc.encodeBuffer(lc, rc); }
    else { buf = enc.encodeBuffer(lc); }
    if (buf.length) mp3Data.push(new Int8Array(buf));
  }
  const flush = enc.flush();
  if (flush.length) mp3Data.push(new Int8Array(flush));
  return new Blob(mp3Data, { type: "audio/mp3" });
}

async function offlineRender(
  buffer: AudioBuffer,
  builder: (ctx: OfflineAudioContext, src: AudioBufferSourceNode) => AudioNode | void,
  opts?: { channels?: number; sampleRate?: number; length?: number }
): Promise<AudioBuffer> {
  const numCh = opts?.channels || buffer.numberOfChannels;
  const sr = opts?.sampleRate || buffer.sampleRate;
  const length = opts?.length || buffer.length;
  const OffCtx = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  const ctx = new OffCtx(numCh, length, sr) as OfflineAudioContext;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const last = builder(ctx, src) || src;
  (last as AudioNode).connect(ctx.destination);
  src.start(0);
  return await ctx.startRendering();
}

function reverseBuffer(buffer: AudioBuffer): AudioBuffer {
  const OffCtx = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  const ctx = new OffCtx(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const out = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const src = buffer.getChannelData(c);
    const dst = out.getChannelData(c);
    for (let i = 0; i < src.length; i++) dst[i] = src[src.length - 1 - i];
  }
  return out;
}

function sliceBuffer(buffer: AudioBuffer, start: number, end: number): AudioBuffer {
  start = Math.max(0, Math.min(buffer.duration, start));
  end = Math.max(start, Math.min(buffer.duration, end));
  const sr = buffer.sampleRate;
  const i0 = Math.floor(start * sr);
  const i1 = Math.floor(end * sr);
  const len = Math.max(1, i1 - i0);
  const OffCtx = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  const ctx = new OffCtx(buffer.numberOfChannels, len, sr);
  const out = ctx.createBuffer(buffer.numberOfChannels, len, sr);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const src = buffer.getChannelData(c);
    const dst = out.getChannelData(c);
    for (let i = 0; i < len; i++) dst[i] = src[i0 + i] || 0;
  }
  return out;
}

function makeImpulse(ctx: OfflineAudioContext, durationSec: number, decay: number): AudioBuffer {
  const sr = ctx.sampleRate;
  const length = Math.max(1, Math.floor(sr * durationSec));
  const ir = ctx.createBuffer(2, length, sr);
  for (let c = 0; c < 2; c++) {
    const ch = ir.getChannelData(c);
    for (let i = 0; i < length; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return ir;
}

function makeDistortionCurve(amount: number): Float32Array {
  const k = +amount;
  const n = 44100;
  const curve = new Float32Array(n);
  const deg = Math.PI / 180;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

const fmtSize = (b: number) => {
  if (!b) return "0B";
  const k = 1024, u = ["B", "KB", "MB", "GB"], i = Math.floor(Math.log(b) / Math.log(k));
  return (b / Math.pow(k, i)).toFixed(1) + u[i];
};
const fmtTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AudioConvertirAI() {
  const [dark, setDark] = useState(false);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [origMeta, setOrigMeta] = useState<OrigMeta | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [drag, setDrag] = useState(false);
  const [savePct, setSavePct] = useState<number | null>(null);
  const [convDims, setConvDims] = useState("");
  const [convSize, setConvSize] = useState("");

  // Options state
  const [mp3Br, setMp3Br] = useState(128);
  const [srRate, setSrRate] = useState(44100);
  const [trimSt, setTrimSt] = useState(0);
  const [trimEn, setTrimEn] = useState(0);
  const [fadeVal, setFadeVal] = useState(20);
  const [volVal, setVolVal] = useState(100);
  const [gainVal, setGainVal] = useState(0);
  const [spVal, setSpVal] = useState(100);
  const [ptVal, setPtVal] = useState(0);
  const [rvVal, setRvVal] = useState(50);
  const [rvSz, setRvSz] = useState("m");
  const [ecD, setEcD] = useState(0.4);
  const [ecF, setEcF] = useState(0.4);
  const [dtVal, setDtVal] = useState(40);
  const [cutVal, setCutVal] = useState(2000);
  const [bbVal, setBbVal] = useState(10);
  const [tbVal, setTbVal] = useState(10);
  const [nrVal, setNrVal] = useState(-1);
  const [cmpT, setCmpT] = useState(-24);
  const [cmpR, setCmpR] = useState(4);
  const [silVal, setSilVal] = useState(-40);
  const [ringSt, setRingSt] = useState(0);
  const [panVal, setPanVal] = useState(20);
  const [lfVal, setLfVal] = useState(85);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const wfOrigRef = useRef<HTMLCanvasElement>(null);
  const wfConvRef = useRef<HTMLCanvasElement>(null);
  const audOrigRef = useRef<HTMLAudioElement>(null);
  const audConvRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toastIdRef = useRef(0);

  // ── Dark mode init ──
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("dark"); } catch (e) { /* noop */ }
    const d = saved === "1" || (!saved && matchMedia("(prefers-color-scheme:dark)").matches);
    setDark(d);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    try { localStorage.setItem("dark", dark ? "1" : "0"); } catch (e) { /* noop */ }
  }, [dark]);

  // ── Custom cursor ──
  useEffect(() => {
    const isFine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine) return;
    document.body.classList.add("has-custom-cursor");
    const c = document.getElementById("cur");
    const c2 = document.getElementById("cur2");
    if (!c || !c2) return;
    let mx = -200, my = -200, rx = -200, ry = -200;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", onMove);
    let raf: number;
    const loop = () => {
      c.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
      c2.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    const show = () => { c.style.opacity = "1"; c2.style.opacity = "1"; };
    const hide = () => { c.style.opacity = "0"; c2.style.opacity = "0"; };
    const targets = "button,a,label,input,select,[role=button],.tool-card";
    const over = (e: MouseEvent) => { if ((e.target as Element).closest?.(targets)) document.body.classList.add("ch"); };
    const out = (e: MouseEvent) => { if ((e.target as Element).closest?.(targets)) document.body.classList.remove("ch"); };
    document.addEventListener("mouseenter", show);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.addEventListener("mousemove", show, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", show);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  // ── Paste ──
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!activeTool || !e.clipboardData) return;
      const item = [...e.clipboardData.items].find((i) => i.type?.startsWith("audio/") || i.type?.startsWith("video/"));
      if (item) { const f = item.getAsFile(); if (f) handleFile(f); }
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [activeTool]);

  // ── Toast ──
  const toast = useCallback((msg: string, type: "s" | "e" | "i" = "i", ms = 3000) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), ms);
  }, []);

  useEffect(() => { toast("50+ audio tools ready", "i", 2500); }, []);

  // ── Waveform drawing ──
  const drawWaveform = useCallback((canvas: HTMLCanvasElement | null, buffer: AudioBuffer, color: string) => {
    if (!buffer || !canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth || canvas.parentElement?.clientWidth || 400;
    const cssH = canvas.clientHeight || 90;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    const c = canvas.getContext("2d")!;
    c.scale(dpr, dpr);
    c.clearRect(0, 0, cssW, cssH);
    const ch = buffer.getChannelData(0);
    const step = Math.max(1, Math.floor(ch.length / cssW));
    const mid = cssH / 2;
    c.fillStyle = color;
    for (let x = 0; x < cssW; x++) {
      const start = x * step;
      const end = Math.min(ch.length, start + step);
      let min = 1, max = -1;
      for (let i = start; i < end; i++) { const v = ch[i]; if (v < min) min = v; if (v > max) max = v; }
      const yMin = mid - max * mid * 0.95;
      const yMax = mid - min * mid * 0.95;
      c.fillRect(x, yMin, 1, Math.max(1, yMax - yMin));
    }
  }, []);

  // ── Handle File ──
  const handleFile = useCallback(async (f: File) => {
    const isMedia = f?.type && (f.type.startsWith("audio/") || f.type.startsWith("video/"));
    if (!f || !isMedia) return toast("Please select a valid audio or video file", "e");
    if (f.size > 104857600) return toast("File too large. Max 100MB.", "e");
    setFile(f);
    setBlob(null);
    setAudioBuffer(null);
    setLoading(true);
    try {
      const arrayBuffer = await f.arrayBuffer();
      const ACtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new ACtx() as AudioContext;
      const buffer = await new Promise<AudioBuffer>((res, rej) => {
        ctx.decodeAudioData(arrayBuffer.slice(0), res, () => rej(new Error("Could not decode this audio file. Your browser may not support this format.")));
      });
      setAudioBuffer(buffer);
      setOrigMeta({ dur: buffer.duration, sr: buffer.sampleRate, ch: buffer.numberOfChannels, size: f.size });
      setTrimEn(parseFloat(buffer.duration.toFixed(1)));
      if (audOrigRef.current) audOrigRef.current.src = URL.createObjectURL(f);
      requestAnimationFrame(() => drawWaveform(wfOrigRef.current, buffer, "#e85d26"));
      // clear conv waveform
      if (wfConvRef.current) {
        const c = wfConvRef.current.getContext("2d");
        c?.clearRect(0, 0, wfConvRef.current.width, wfConvRef.current.height);
      }
      try { ctx.close(); } catch (e) { /* noop */ }
    } catch (err: any) {
      toast(err.message || "Could not decode this audio", "e", 4500);
      setFile(null);
    }
    setLoading(false);
  }, [toast, drawWaveform]);

  // ── Open Tool ──
  const openTool = (id: string) => {
    const tool = TOOLS.find((t) => t.id === id);
    if (!tool) return;
    setActiveTool(tool);
    setFile(null);
    setBlob(null);
    setAudioBuffer(null);
    setOrigMeta(null);
    setSavePct(null);
    setConvDims("");
    setConvSize("");
    if (fileInputRef.current) fileInputRef.current.accept = tool.accept || "audio/*";
    // Reset cutVal based on tool
    if (id === "highpass") setCutVal(500);
    else setCutVal(2000);
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    toast(`${tool.title} ready`, "i", 2000);
  };

  // ── Save buffer helper ──
  const saveBuffer = async (buf: AudioBuffer, target: string, kbps?: number): Promise<{ blob: Blob; ext: string; mime: string }> => {
    if (target === "mp3") {
      try { return { blob: audioBufferToMp3(buf, kbps || 128), ext: "mp3", mime: "audio/mpeg" }; }
      catch (e) {
        toast("MP3 encoder unavailable — saving as WAV instead.", "i", 3500);
        return { blob: audioBufferToWav(buf), ext: "wav", mime: "audio/wav" };
      }
    }
    if (target === "wav") return { blob: audioBufferToWav(buf), ext: "wav", mime: "audio/wav" };
    toast(`Your browser cannot natively encode ${target.toUpperCase()} — saving as WAV instead (lossless).`, "i", 4500);
    return { blob: audioBufferToWav(buf), ext: "wav", mime: "audio/wav" };
  };

  // ── Process ──
  const processAudio = async () => {
    if (!file || !activeTool || !audioBuffer) return;
    setProcessing(true);
    setBlob(null);
    setSavePct(null);
    setConvDims("");
    setConvSize("");
    try {
      await runConversion();
    } catch (e: any) {
      toast("Processing failed: " + (e?.message || "unknown error"), "e", 4500);
    }
    setProcessing(false);
  };

  const runConversion = async () => {
    if (!activeTool || !audioBuffer) return;
    const id = activeTool.id;
    let processed = audioBuffer;
    let result: { blob: Blob; ext: string; mime: string } | null = null;

    const OffCtx = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;

    if (["mp3-to-wav", "ogg-to-wav", "m4a-to-wav", "flac-to-wav", "aac-to-wav", "mp4-to-wav", "any-to-wav"].includes(id)) {
      result = await saveBuffer(processed, "wav");
    } else if (["wav-to-mp3", "ogg-to-mp3", "m4a-to-mp3", "flac-to-mp3", "aac-to-mp3", "mp4-to-mp3", "aiff-to-mp3", "video-to-mp3", "any-to-mp3"].includes(id)) {
      result = await saveBuffer(processed, "mp3", mp3Br);
    } else if (["mp3-to-ogg", "wav-to-ogg"].includes(id)) {
      result = await saveBuffer(processed, "ogg");
    } else if (["mp3-to-m4a", "wav-to-m4a"].includes(id)) {
      result = await saveBuffer(processed, "m4a");
    } else if (id === "trim") {
      const en = trimEn || processed.duration;
      if (en <= trimSt) throw new Error("End time must be greater than start time");
      processed = sliceBuffer(processed, trimSt, en);
      result = await saveBuffer(processed, "wav");
    } else if (id === "reverse") {
      processed = reverseBuffer(processed);
      result = await saveBuffer(processed, "wav");
    } else if (id === "fade-in" || id === "fade-out") {
      const dur = fadeVal / 10;
      processed = await offlineRender(audioBuffer, (ctx, src) => {
        const g = ctx.createGain();
        if (id === "fade-in") { g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(1, Math.min(dur, audioBuffer.duration)); }
        else { const t = audioBuffer.duration; g.gain.setValueAtTime(1, Math.max(0, t - dur)); g.gain.linearRampToValueAtTime(0, t); }
        src.connect(g); return g;
      });
      result = await saveBuffer(processed, "wav");
    } else if (id === "volume") {
      const v = volVal / 100;
      processed = await offlineRender(audioBuffer, (ctx, src) => { const g = ctx.createGain(); g.gain.value = v; src.connect(g); return g; });
      result = await saveBuffer(processed, "wav");
    } else if (id === "gain") {
      const lin = Math.pow(10, gainVal / 20);
      processed = await offlineRender(audioBuffer, (ctx, src) => { const g = ctx.createGain(); g.gain.value = lin; src.connect(g); return g; });
      result = await saveBuffer(processed, "wav");
    } else if (id === "speed") {
      const rate = spVal / 100;
      const newLen = Math.max(1, Math.floor(audioBuffer.length / rate));
      processed = await offlineRender(audioBuffer, (ctx, src) => { src.playbackRate.value = rate; return src; }, { length: newLen });
      result = await saveBuffer(processed, "wav");
    } else if (id === "pitch") {
      const factor = Math.pow(2, ptVal / 12);
      const newLen = Math.max(1, Math.floor(audioBuffer.length / factor));
      processed = await offlineRender(audioBuffer, (ctx, src) => { src.playbackRate.value = factor; return src; }, { length: newLen });
      result = await saveBuffer(processed, "wav");
    } else if (id === "mono-to-stereo") {
      const src = audioBuffer;
      const out = new OffCtx(2, src.length, src.sampleRate).createBuffer(2, src.length, src.sampleRate);
      const mono = src.getChannelData(0);
      out.getChannelData(0).set(mono);
      out.getChannelData(1).set(src.numberOfChannels > 1 ? src.getChannelData(1) : mono);
      result = await saveBuffer(out, "wav");
    } else if (id === "stereo-to-mono") {
      const src = audioBuffer;
      const out = new OffCtx(1, src.length, src.sampleRate).createBuffer(1, src.length, src.sampleRate);
      const m = out.getChannelData(0);
      const l = src.getChannelData(0);
      const r = src.numberOfChannels > 1 ? src.getChannelData(1) : l;
      for (let i = 0; i < src.length; i++) m[i] = (l[i] + r[i]) / 2;
      result = await saveBuffer(out, "wav");
    } else if (id === "sample-rate") {
      const ratio = srRate / audioBuffer.sampleRate;
      const newLen = Math.max(1, Math.floor(audioBuffer.length * ratio));
      processed = await offlineRender(audioBuffer, (ctx, src) => src, { sampleRate: srRate, length: newLen });
      result = await saveBuffer(processed, "wav");
    } else if (id === "channels") {
      const src = audioBuffer;
      if (src.numberOfChannels < 2) { toast("Audio is mono — channel swap has no effect.", "i"); result = await saveBuffer(src, "wav"); }
      else {
        const out = new OffCtx(2, src.length, src.sampleRate).createBuffer(2, src.length, src.sampleRate);
        out.getChannelData(0).set(src.getChannelData(1));
        out.getChannelData(1).set(src.getChannelData(0));
        result = await saveBuffer(out, "wav");
      }
    } else if (id === "silence-trim") {
      const threshold = Math.pow(10, silVal / 20);
      const ch = audioBuffer.getChannelData(0);
      let s = 0, e = ch.length - 1;
      while (s < ch.length && Math.abs(ch[s]) < threshold) s++;
      while (e > s && Math.abs(ch[e]) < threshold) e--;
      if (e <= s) throw new Error("No audio above the silence threshold was found");
      processed = sliceBuffer(audioBuffer, s / audioBuffer.sampleRate, e / audioBuffer.sampleRate);
      result = await saveBuffer(processed, "wav");
    } else if (id === "reverb") {
      const amt = rvVal / 100;
      const map: Record<string, [number, number]> = { s: [1.0, 2], m: [2.0, 2], l: [3.5, 1.5], xl: [5.0, 1.0] };
      const [dur, decay] = map[rvSz] || map.m;
      const renderLen = audioBuffer.length + Math.ceil(dur * audioBuffer.sampleRate);
      processed = await offlineRender(audioBuffer, (ctx, src) => {
        const ir = makeImpulse(ctx as unknown as OfflineAudioContext, dur, decay);
        const conv = ctx.createConvolver(); conv.buffer = ir;
        const wet = ctx.createGain(); wet.gain.value = amt;
        const dry = ctx.createGain(); dry.gain.value = 1 - amt * 0.5;
        const out = ctx.createGain();
        src.connect(dry); dry.connect(out);
        src.connect(conv); conv.connect(wet); wet.connect(out);
        return out;
      }, { length: renderLen });
      result = await saveBuffer(processed, "wav");
    } else if (id === "echo") {
      const tail = Math.ceil(ecD * audioBuffer.sampleRate * 6);
      processed = await offlineRender(audioBuffer, (ctx, src) => {
        const delay = ctx.createDelay(2.5); delay.delayTime.value = ecD;
        const feedback = ctx.createGain(); feedback.gain.value = Math.max(0, Math.min(0.9, ecF));
        const out = ctx.createGain();
        src.connect(out); src.connect(delay);
        delay.connect(feedback); feedback.connect(delay); delay.connect(out);
        return out;
      }, { length: audioBuffer.length + tail });
      result = await saveBuffer(processed, "wav");
    } else if (id === "distortion") {
      processed = await offlineRender(audioBuffer, (ctx, src) => {
        const ws = ctx.createWaveShaper();
        ws.curve = makeDistortionCurve(dtVal) as Float32Array<ArrayBuffer>; ws.oversample = "4x";
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 8000;
        src.connect(ws); ws.connect(lp); return lp;
      });
      result = await saveBuffer(processed, "wav");
    } else if (id === "lowpass" || id === "highpass") {
      processed = await offlineRender(audioBuffer, (ctx, src) => {
        const f = ctx.createBiquadFilter();
        f.type = id as BiquadFilterType; f.frequency.value = cutVal;
        src.connect(f); return f;
      });
      result = await saveBuffer(processed, "wav");
    } else if (id === "bass-boost" || id === "treble-boost") {
      const db = id === "bass-boost" ? bbVal : tbVal;
      processed = await offlineRender(audioBuffer, (ctx, src) => {
        const f = ctx.createBiquadFilter();
        f.type = id === "bass-boost" ? "lowshelf" : "highshelf";
        f.frequency.value = id === "bass-boost" ? 200 : 4000;
        f.gain.value = db;
        src.connect(f); return f;
      });
      result = await saveBuffer(processed, "wav");
    } else if (id === "robot") {
      processed = await offlineRender(audioBuffer, (ctx, src) => {
        const lfo = ctx.createOscillator(); lfo.frequency.value = 50;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.5;
        const trem = ctx.createGain(); trem.gain.value = 0.5;
        lfo.connect(lfoGain); lfoGain.connect(trem.gain);
        lfo.start(0); src.connect(trem); return trem;
      });
      result = await saveBuffer(processed, "wav");
    } else if (id === "telephone") {
      processed = await offlineRender(audioBuffer, (ctx, src) => {
        const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 300;
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3400;
        const bp = ctx.createBiquadFilter(); bp.type = "peaking"; bp.frequency.value = 1500; bp.gain.value = 8;
        src.connect(hp); hp.connect(lp); lp.connect(bp); return bp;
      });
      result = await saveBuffer(processed, "wav");
    } else if (id === "normalize") {
      const target = Math.pow(10, nrVal / 20);
      let peak = 0;
      for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
        const data = audioBuffer.getChannelData(c);
        for (let i = 0; i < data.length; i++) { const a = Math.abs(data[i]); if (a > peak) peak = a; }
      }
      const gain = peak > 0 ? target / peak : 1;
      processed = await offlineRender(audioBuffer, (ctx, src) => { const g = ctx.createGain(); g.gain.value = gain; src.connect(g); return g; });
      result = await saveBuffer(processed, "wav");
    } else if (id === "compressor") {
      processed = await offlineRender(audioBuffer, (ctx, src) => {
        const c = ctx.createDynamicsCompressor();
        c.threshold.value = cmpT; c.ratio.value = cmpR;
        c.knee.value = 30; c.attack.value = 0.003; c.release.value = 0.25;
        src.connect(c); return c;
      });
      result = await saveBuffer(processed, "wav");
    } else if (id === "bitrate") {
      result = await saveBuffer(audioBuffer, "mp3", mp3Br);
    } else if (id === "to-base64" || id === "to-dataurl") {
      const wavBlob = audioBufferToWav(processed);
      const buf = await wavBlob.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
      const b64 = btoa(binary);
      const content = id === "to-base64" ? b64 : "data:audio/wav;base64," + b64;
      result = { blob: new Blob([content], { type: "text/plain" }), ext: "txt", mime: "text/plain" };
    } else if (id === "ringtone") {
      const end = Math.min(processed.duration, ringSt + 30);
      let trimmed = sliceBuffer(processed, ringSt, end);
      const fadeSec = 1;
      trimmed = await offlineRender(trimmed, (ctx, src) => {
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, 0);
        g.gain.linearRampToValueAtTime(1, fadeSec);
        g.gain.setValueAtTime(1, Math.max(fadeSec, trimmed.duration - fadeSec));
        g.gain.linearRampToValueAtTime(0, trimmed.duration);
        src.connect(g); return g;
      });
      result = await saveBuffer(trimmed, "mp3", 192);
    } else if (id === "podcast") {
      const OffCtx2 = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
      const src = audioBuffer;
      const mono = new OffCtx2(1, src.length, src.sampleRate).createBuffer(1, src.length, src.sampleRate);
      const m = mono.getChannelData(0);
      const l = src.getChannelData(0);
      const r = src.numberOfChannels > 1 ? src.getChannelData(1) : l;
      for (let i = 0; i < src.length; i++) m[i] = (l[i] + r[i]) / 2;
      result = await saveBuffer(mono, "mp3", 64);
    } else if (id === "waveform") {
      const W = 1200, H = 300;
      const wf = document.createElement("canvas");
      wf.width = W; wf.height = H;
      const c = wf.getContext("2d")!;
      const isDark = document.body.classList.contains("dark");
      c.fillStyle = isDark ? "#181512" : "#faf8f4";
      c.fillRect(0, 0, W, H);
      const ch = processed.getChannelData(0);
      const step = Math.max(1, Math.floor(ch.length / W));
      const mid = H / 2;
      c.fillStyle = "#e85d26";
      for (let x = 0; x < W; x++) {
        const s0 = x * step, s1 = Math.min(ch.length, s0 + step);
        let mn = 1, mx = -1;
        for (let i = s0; i < s1; i++) { const v = ch[i]; if (v < mn) mn = v; if (v > mx) mx = v; }
        const yMin = mid - mx * mid * 0.92;
        const yMax = mid - mn * mid * 0.92;
        c.fillRect(x, yMin, 1, Math.max(2, yMax - yMin));
      }
      const pngBlob = await new Promise<Blob>((res) => wf.toBlob((b) => res(b!), "image/png"));
      result = { blob: pngBlob, ext: "png", mime: "image/png" };
    } else if (id === "8d-audio") {
      const speedHz = panVal / 100;
      let buf = audioBuffer;
      const OffCtx2 = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
      if (buf.numberOfChannels < 2) {
        const stereo = new OffCtx2(2, buf.length, buf.sampleRate).createBuffer(2, buf.length, buf.sampleRate);
        stereo.getChannelData(0).set(buf.getChannelData(0));
        stereo.getChannelData(1).set(buf.getChannelData(0));
        buf = stereo;
      }
      processed = await offlineRender(buf, (ctx, src) => {
        const panner = (ctx as any).createStereoPanner ? (ctx as any).createStereoPanner() : null;
        if (!panner) return src;
        const lfo = ctx.createOscillator(); lfo.frequency.value = speedHz;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.95;
        lfo.connect(lfoGain); lfoGain.connect(panner.pan);
        lfo.start(0); src.connect(panner); return panner;
      });
      result = await saveBuffer(processed, "wav");
    } else if (id === "lofi") {
      const slow = lfVal / 100;
      const newLen = Math.max(1, Math.floor(audioBuffer.length / slow));
      const slowed = await offlineRender(audioBuffer, (ctx, src) => { src.playbackRate.value = slow; return src; }, { length: newLen });
      const renderLen = slowed.length + Math.ceil(2.5 * slowed.sampleRate);
      processed = await offlineRender(slowed, (ctx, src) => {
        const ir = makeImpulse(ctx as unknown as OfflineAudioContext, 2.5, 1.5);
        const conv = ctx.createConvolver(); conv.buffer = ir;
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 4000;
        const wet = ctx.createGain(); wet.gain.value = 0.5;
        const dry = ctx.createGain(); dry.gain.value = 0.7;
        const out = ctx.createGain();
        src.connect(lp); lp.connect(dry); dry.connect(out);
        lp.connect(conv); conv.connect(wet); wet.connect(out);
        return out;
      }, { length: renderLen });
      result = await saveBuffer(processed, "wav");
    } else if (id === "vinyl") {
      const sr = audioBuffer.sampleRate;
      const len = audioBuffer.length;
      const OffCtx2 = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
      const crackleBuf = new OffCtx2(audioBuffer.numberOfChannels, len, sr).createBuffer(audioBuffer.numberOfChannels, len, sr);
      for (let c = 0; c < crackleBuf.numberOfChannels; c++) {
        const data = crackleBuf.getChannelData(c);
        for (let i = 0; i < len; i++) data[i] = Math.random() < 0.0008 ? Math.random() * 0.6 - 0.3 : 0;
      }
      processed = await offlineRender(audioBuffer, (ctx, src) => {
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 7500;
        const noiseSrc = ctx.createBufferSource(); noiseSrc.buffer = crackleBuf;
        const noiseGain = ctx.createGain(); noiseGain.gain.value = 0.5;
        const out = ctx.createGain();
        src.connect(lp); lp.connect(out);
        noiseSrc.connect(noiseGain); noiseGain.connect(out);
        noiseSrc.start(0); return out;
      });
      result = await saveBuffer(processed, "wav");
    } else if (id === "chipmunk") {
      const factor = Math.pow(2, 7 / 12);
      const newLen = Math.max(1, Math.floor(audioBuffer.length / factor));
      processed = await offlineRender(audioBuffer, (ctx, src) => { src.playbackRate.value = factor; return src; }, { length: newLen });
      result = await saveBuffer(processed, "wav");
    } else if (id === "deep-voice") {
      const factor = Math.pow(2, -7 / 12);
      const newLen = Math.max(1, Math.floor(audioBuffer.length / factor));
      processed = await offlineRender(audioBuffer, (ctx, src) => { src.playbackRate.value = factor; return src; }, { length: newLen });
      result = await saveBuffer(processed, "wav");
    } else {
      result = await saveBuffer(processed, "wav");
    }

    if (!result) return;
    setBlob(result.blob);

    // Update activeTool ext/mime if fallback happened
    if (result.ext !== activeTool.ext) {
      setActiveTool((prev) => prev ? { ...prev, ext: result!.ext, mime: result!.mime } : prev);
    }

    const isAudio = result.blob.type?.startsWith("audio/");
    const isImage = result.blob.type?.startsWith("image/");
    const isText = result.blob.type === "text/plain";
    const url = URL.createObjectURL(result.blob);

    if (isAudio) {
      if (audConvRef.current) audConvRef.current.src = url;
      try {
        const ab = await result.blob.arrayBuffer();
        const ACtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new ACtx() as AudioContext;
        const buf = await new Promise<AudioBuffer>((res, rej) => ctx.decodeAudioData(ab.slice(0), res, () => rej(new Error("preview decode failed"))));
        drawWaveform(wfConvRef.current, buf, "#16a34a");
        setConvDims(`${fmtTime(buf.duration)} · ${buf.sampleRate} Hz · ${buf.numberOfChannels === 1 ? "Mono" : "Stereo"}`);
        try { ctx.close(); } catch (e) { /* noop */ }
      } catch (e) { setConvDims("Audio ready"); }
    } else if (isImage) {
      if (audConvRef.current) audConvRef.current.removeAttribute("src");
      const wf = wfConvRef.current;
      if (wf) {
        const c = wf.getContext("2d")!;
        c.clearRect(0, 0, wf.width, wf.height);
        const im = new Image();
        im.onload = () => {
          const dpr = window.devicePixelRatio || 1;
          const cssW = wf.clientWidth || 400, cssH = wf.clientHeight || 90;
          wf.width = Math.floor(cssW * dpr); wf.height = Math.floor(cssH * dpr);
          c.scale(dpr, dpr);
          const r = Math.min(cssW / im.width, cssH / im.height);
          const w = im.width * r, h = im.height * r;
          c.drawImage(im, (cssW - w) / 2, (cssH - h) / 2, w, h);
        };
        im.src = url;
      }
      setConvDims("PNG image");
    } else if (isText) {
      if (audConvRef.current) audConvRef.current.removeAttribute("src");
      const wf = wfConvRef.current;
      if (wf) {
        const c = wf.getContext("2d")!; c.clearRect(0, 0, wf.width, wf.height);
        c.fillStyle = "#16a34a";
        c.font = "bold 18px Syne, system-ui, sans-serif";
        c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText("TEXT", wf.width / 2, wf.height / 2);
      }
      setConvDims("Text file");
    } else {
      setConvDims("File ready");
    }

    setConvSize(fmtSize(result.blob.size));
    if (origMeta && origMeta.size > 0) {
      const save = origMeta.size - result.blob.size;
      if (save > 0) setSavePct(Math.round((save / origMeta.size) * 100));
    }
    toast("Done!", "s");
  };

  // ── Download ──
  const downloadResult = () => {
    if (!blob || !activeTool || !file) return toast("Nothing to download yet — process an audio file first.", "i");
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      a.download = `${baseName}_${activeTool.id}.${activeTool.ext}`;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { try { a.remove(); } catch (e) { /* noop */ } URL.revokeObjectURL(url); }, 200);
      toast("Downloaded!", "s");
    } catch (err: any) {
      toast("Download failed: " + (err.message || "browser blocked the download"), "e", 4500);
    }
  };

  const copyResultLink = async () => {
    if (!blob) return toast("Nothing to copy yet — process an audio file first.", "i");
    if (blob.type === "text/plain") {
      try { const txt = await blob.text(); await navigator.clipboard.writeText(txt); return toast("Text copied to clipboard!", "s"); }
      catch (e) { return toast("Clipboard text copy not allowed in this browser", "e"); }
    }
    try {
      const url = URL.createObjectURL(blob);
      await navigator.clipboard.writeText(url);
      toast("Local link copied to clipboard", "s");
    } catch (e: any) { toast("Copy failed: " + (e.message || "clipboard permission denied"), "e", 4500); }
  };

  // ── Filtered tools ──
  const filtered = TOOLS.filter((t) =>
    (cat === "all" || t.cat === cat) &&
    (!q || t.title.toLowerCase().includes(q.toLowerCase()) || t.full.toLowerCase().includes(q.toLowerCase()) || t.desc.toLowerCase().includes(q.toLowerCase()))
  );

  // ── FAQ ──
  const faqs = [
    { q: "Are my audio files uploaded to a server?", a: "No. All processing happens 100% in your browser using the Web Audio API and a JavaScript MP3 encoder. Your files never leave your device and are never uploaded anywhere." },
    { q: "Which audio formats can I convert?", a: "We support MP3, WAV, OGG Vorbis, M4A / AAC, FLAC, MP4, AIFF and more as inputs (depending on your browser). Output formats include MP3, WAV, plus Base64 and PNG waveform exports." },
    { q: "Why do some output formats fall back to WAV?", a: "Browsers can natively encode WAV (always) and MP3 (via a JavaScript encoder). OGG, M4A and AAC have no native browser encoder, so for those targets we automatically save lossless WAV instead and tell you so you know." },
    { q: "What is the file size limit?", a: "The practical limit is around 100MB, depending on your browser and available device memory. Most podcast episodes and full-length songs work instantly." },
    { q: "Can I pitch-shift without changing speed?", a: "Our pitch-shift uses simple resampling, which changes both pitch and duration (like a tape recorder). True time-preserving pitch shift requires a phase vocoder — coming soon." },
    { q: "Can I paste audio from clipboard?", a: "Yes! After selecting a tool, press Ctrl+V (or Cmd+V on Mac) to paste an audio file directly from your clipboard." },
    { q: "Do I need to create an account?", a: "No. All 50+ tools are completely free with no registration, no sign-in and no email required." },
    { q: "What browsers are supported?", a: "All modern browsers: Chrome, Firefox, Safari, Edge, Opera and their mobile versions. Safari may not decode every format (e.g. OGG Vorbis) — try Chrome or Firefox for the widest format support." },
    { q: "Is there a watermark on the output?", a: "Never. Your processed audio files are completely watermark-free. We do not add any branding to your files." },
  ];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ── Options panel ──
  const renderOptions = () => {
    if (!activeTool) return null;
    const id = activeTool.id;

    const ChipGroup = ({ opts, val, onChange }: { opts: [string | number, string][]; val: string | number; onChange: (v: any) => void }) => (
      <div className="flex flex-wrap gap-2">
        {opts.map(([v, l]) => (
          <button key={v} onClick={() => onChange(v)}
            className="chip" style={{ borderColor: val == v ? "var(--accent)" : "var(--border)", background: val == v ? "rgba(232,93,38,0.08)" : "var(--card)", color: val == v ? "var(--accent)" : "var(--fg)" }}>
            {l}
          </button>
        ))}
      </div>
    );

    const SliderRow = ({ label, valDisplay, children }: { label: string; valDisplay: string; children: React.ReactNode }) => (
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <p className="slabel mb-0">{label}</p>
          <span className="font-bold text-xl" style={{ color: "var(--accent)" }}>{valDisplay}</span>
        </div>
        {children}
      </div>
    );

    const mp3Tools = ["wav-to-mp3", "ogg-to-mp3", "m4a-to-mp3", "flac-to-mp3", "aac-to-mp3", "mp4-to-mp3", "aiff-to-mp3", "video-to-mp3", "any-to-mp3", "bitrate"];
    if (mp3Tools.includes(id)) return (
      <div>
        <p className="slabel">MP3 Bitrate</p>
        <ChipGroup opts={[[64, "64 kbps"], [96, "96 kbps"], [128, "128 kbps"], [192, "192 kbps"], [256, "256 kbps"], [320, "320 kbps"]]} val={mp3Br} onChange={setMp3Br} />
      </div>
    );
    if (id === "sample-rate") return (
      <div>
        <p className="slabel">Output Sample Rate</p>
        <ChipGroup opts={[[8000, "8 kHz (telephone)"], [22050, "22.05 kHz"], [44100, "44.1 kHz (CD)"], [48000, "48 kHz (DVD)"], [96000, "96 kHz (HD)"]]} val={srRate} onChange={setSrRate} />
      </div>
    );
    if (id === "trim") return (
      <div>
        <p className="slabel">Trim Range (seconds)</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Start (s)</label><input type="number" className="inp" value={trimSt} min={0} step={0.1} onChange={(e) => setTrimSt(+e.target.value)} /></div>
          <div><label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>End (s)</label><input type="number" className="inp" value={trimEn} min={0} step={0.1} onChange={(e) => setTrimEn(+e.target.value)} /></div>
        </div>
      </div>
    );
    if (id === "fade-in" || id === "fade-out") return (
      <SliderRow label="Fade Duration" valDisplay={`${(fadeVal / 10).toFixed(1)}s`}>
        <input type="range" min={1} max={100} value={fadeVal} onChange={(e) => setFadeVal(+e.target.value)} />
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Length of the fade in seconds (0.1 – 10)</p>
      </SliderRow>
    );
    if (id === "volume") return (
      <SliderRow label="Volume" valDisplay={`${volVal}%`}>
        <input type="range" min={0} max={400} value={volVal} onChange={(e) => setVolVal(+e.target.value)} />
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>100% = original loudness · 200% = double · max 400%</p>
      </SliderRow>
    );
    if (id === "gain") return (
      <SliderRow label="Gain (dB)" valDisplay={`${gainVal >= 0 ? "+" : ""}${gainVal} dB`}>
        <input type="range" min={-24} max={24} value={gainVal} onChange={(e) => setGainVal(+e.target.value)} />
      </SliderRow>
    );
    if (id === "speed") return (
      <SliderRow label="Playback Speed" valDisplay={`${(spVal / 100).toFixed(2)}×`}>
        <input type="range" min={25} max={400} value={spVal} onChange={(e) => setSpVal(+e.target.value)} />
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>0.25× – 4.00×. Note: pitch will shift along with speed.</p>
      </SliderRow>
    );
    if (id === "pitch") return (
      <SliderRow label="Pitch (semitones)" valDisplay={`${ptVal > 0 ? "+" : ""}${ptVal}`}>
        <input type="range" min={-12} max={12} value={ptVal} onChange={(e) => setPtVal(+e.target.value)} />
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>±12 semitones = ±1 octave. Duration will change.</p>
      </SliderRow>
    );
    if (id === "reverb") return (
      <div>
        <SliderRow label="Reverb Amount" valDisplay={`${rvVal}%`}>
          <input type="range" min={10} max={100} value={rvVal} onChange={(e) => setRvVal(+e.target.value)} />
        </SliderRow>
        <p className="slabel mt-4">Room Size</p>
        <ChipGroup opts={[["s", "Small Room"], ["m", "Medium Hall"], ["l", "Large Hall"], ["xl", "Cathedral"]]} val={rvSz} onChange={setRvSz} />
      </div>
    );
    if (id === "echo") return (
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Delay (s)</label><input type="number" className="inp" value={ecD} min={0.05} max={2} step={0.05} onChange={(e) => setEcD(+e.target.value)} /></div>
        <div><label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Feedback</label><input type="number" className="inp" value={ecF} min={0} max={0.9} step={0.05} onChange={(e) => setEcF(+e.target.value)} /></div>
      </div>
    );
    if (id === "distortion") return (
      <SliderRow label="Distortion Amount" valDisplay={`${dtVal}`}>
        <input type="range" min={1} max={100} value={dtVal} onChange={(e) => setDtVal(+e.target.value)} />
      </SliderRow>
    );
    if (id === "lowpass" || id === "highpass") return (
      <SliderRow label="Cutoff Frequency" valDisplay={`${cutVal} Hz`}>
        <input type="range" min={100} max={20000} value={cutVal} step={100} onChange={(e) => setCutVal(+e.target.value)} />
      </SliderRow>
    );
    if (id === "bass-boost") return (
      <SliderRow label="Bass Boost" valDisplay={`+${bbVal} dB`}>
        <input type="range" min={0} max={24} value={bbVal} onChange={(e) => setBbVal(+e.target.value)} />
      </SliderRow>
    );
    if (id === "treble-boost") return (
      <SliderRow label="Treble Boost" valDisplay={`+${tbVal} dB`}>
        <input type="range" min={0} max={24} value={tbVal} onChange={(e) => setTbVal(+e.target.value)} />
      </SliderRow>
    );
    if (id === "normalize") return (
      <SliderRow label="Target Peak" valDisplay={`${nrVal} dBFS`}>
        <input type="range" min={-12} max={0} value={nrVal} onChange={(e) => setNrVal(+e.target.value)} />
      </SliderRow>
    );
    if (id === "compressor") return (
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Threshold (dB)</label><input type="number" className="inp" value={cmpT} min={-60} max={0} onChange={(e) => setCmpT(+e.target.value)} /></div>
        <div><label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Ratio</label><input type="number" className="inp" value={cmpR} min={1} max={20} step={0.5} onChange={(e) => setCmpR(+e.target.value)} /></div>
      </div>
    );
    if (id === "silence-trim") return (
      <SliderRow label="Silence Threshold" valDisplay={`${silVal} dB`}>
        <input type="range" min={-60} max={-10} value={silVal} onChange={(e) => setSilVal(+e.target.value)} />
      </SliderRow>
    );
    if (id === "ringtone") return (
      <div>
        <p className="slabel">Ringtone Start Time</p>
        <div><label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Start (seconds)</label><input type="number" className="inp w-32" value={ringSt} min={0} step={0.1} onChange={(e) => setRingSt(+e.target.value)} /></div>
        <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>Will produce a 30-second clip from this point with smooth fade-in / fade-out.</p>
      </div>
    );
    if (id === "8d-audio") return (
      <SliderRow label="Pan Speed" valDisplay={`${(panVal / 100).toFixed(2)} Hz`}>
        <input type="range" min={5} max={100} value={panVal} onChange={(e) => setPanVal(+e.target.value)} />
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Best experienced with headphones</p>
      </SliderRow>
    );
    if (id === "lofi") return (
      <SliderRow label="Slow-Down Amount" valDisplay={`${lfVal}%`}>
        <input type="range" min={50} max={100} value={lfVal} onChange={(e) => setLfVal(+e.target.value)} />
      </SliderRow>
    );
    return null;
  };

  const hasOptions = activeTool && ["wav-to-mp3", "ogg-to-mp3", "m4a-to-mp3", "flac-to-mp3", "aac-to-mp3", "mp4-to-mp3", "aiff-to-mp3", "video-to-mp3", "any-to-mp3", "bitrate", "sample-rate", "trim", "fade-in", "fade-out", "volume", "gain", "speed", "pitch", "reverb", "echo", "distortion", "lowpass", "highpass", "bass-boost", "treble-boost", "normalize", "compressor", "silence-trim", "ringtone", "8d-audio", "lofi"].includes(activeTool.id);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js" strategy="beforeInteractive" />

      <style>{`
        
        :root {
          --bg: #f5f3ef; --card: #ffffff; --border: #e4e0d8; --fg: #1a1714;
          --muted: #7a7167; --accent: #e85d26; --accent2: #2d6be4; --accent3: #16a34a;
          --surface: #faf8f4; --card-rgb: 255,255,255;
          --shadow: 0 2px 8px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.04);
          --shadow-lg: 0 12px 40px rgba(0,0,0,0.1),0 4px 12px rgba(0,0,0,0.06);
        }
        .dark {
          --bg: #131110; --card: #1e1b18; --border: #2e2a26; --fg: #f0ece6;
          --muted: #8c8680; --surface: #181512; --card-rgb: 30,27,24;
        }

        #cur { position:fixed;width:10px;height:10px;border-radius:50%;background:var(--accent);pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:width .15s,height .15s,background .15s;opacity:0;display:none; }
        #cur2 { position:fixed;width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(232,93,38,0.5);pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:width .2s,height .2s,opacity .2s;opacity:0;display:none; }
        body.has-custom-cursor #cur, body.has-custom-cursor #cur2 { display:block; }
        body.ch #cur{width:16px;height:16px;background:var(--accent2);}
        body.ch #cur2{width:44px;height:44px;border-color:rgba(45,107,228,0.6);}
        body::before {
          content:'';position:fixed;inset:0;pointer-events:none;z-index:-1;
          background-image: radial-gradient(circle at 20% 20%, rgba(232,93,38,0.06) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(45,107,228,0.05) 0%, transparent 50%);
        }
        .header-glass { background:rgba(var(--card-rgb),.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px); }
        .tool-card {
          background:var(--card);border:1.5px solid var(--border);
          border-radius:16px;padding:18px;text-align:left;width:100%;
          transition:transform .2s,box-shadow .2s,border-color .2s;
          position:relative;overflow:hidden;
        }
        .tool-card::after {
          content:'';position:absolute;inset:0;border-radius:16px;
          background:linear-gradient(135deg,rgba(255,255,255,0.06),transparent);
          opacity:0;transition:opacity .2s;pointer-events:none;
        }
        .tool-card:hover { transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:var(--accent); }
        .tool-card:hover::after { opacity:1; }
        .tool-card.active { border-color:var(--accent);box-shadow:0 0 0 3px rgba(232,93,38,0.15),var(--shadow); }
        .cat-tab { padding:7px 16px;border-radius:999px;font-size:.82rem;font-weight:600;border:1.5px solid var(--border);background:var(--card);color:var(--muted);transition:all .2s;white-space:nowrap; }
        .cat-tab.active { background:var(--fg);color:var(--bg);border-color:var(--fg); }
        .upload-zone { border:2px dashed var(--border);background:var(--surface);border-radius:20px;transition:all .25s; }
        .upload-zone.drag { border-color:var(--accent);background:rgba(232,93,38,0.04);transform:scale(1.01); }
        .btn { display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:12px;font-weight:600;font-size:.875rem;font-family:'Instrument Sans',sans-serif;transition:all .2s;border:none;cursor:pointer; }
        .btn-primary { background:var(--fg);color:var(--bg);box-shadow:0 4px 14px rgba(0,0,0,0.15); }
        .btn-primary:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.2); }
        .btn-primary:disabled { opacity:.45; }
        .btn-secondary { background:var(--card);color:var(--fg);border:1.5px solid var(--border); }
        .btn-secondary:hover { background:var(--border); }
        .btn-accent { background:var(--accent);color:white;box-shadow:0 4px 14px rgba(232,93,38,0.3); }
        .btn-accent:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 8px 24px rgba(232,93,38,0.4); }
        .btn-accent:disabled { opacity:.5; }
        .inp {
          width:100%;padding:9px 13px;border-radius:10px;border:1.5px solid var(--border);
          background:var(--card);color:var(--fg);font-family:'Instrument Sans',sans-serif;
          font-size:.875rem;outline:none;transition:border-color .2s,box-shadow .2s;
        }
        .inp:focus { border-color:var(--accent);box-shadow:0 0 0 3px rgba(232,93,38,0.1); }
        input[type=range] { -webkit-appearance:none;appearance:none;width:100%;height:5px;background:var(--border);border-radius:3px;outline:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--fg);box-shadow:0 2px 6px rgba(0,0,0,0.2);transition:transform .15s; }
        input[type=range]::-webkit-slider-thumb:hover { transform:scale(1.2); }
        input[type=range]::-moz-range-thumb { width:18px;height:18px;border-radius:50%;background:var(--fg);border:none;box-shadow:0 2px 6px rgba(0,0,0,0.2); }
        .wave-wrap { background:var(--surface);border-radius:14px;overflow:hidden;padding:12px;border:1px solid var(--border); }
        .wave-cvs { display:block;width:100%;height:90px;border-radius:8px;background:rgba(0,0,0,0.02); }
        .dark .wave-cvs { background:rgba(255,255,255,0.03); }
        .chip { display:inline-flex;align-items:center;gap:5px;border:1.5px solid var(--border);border-radius:10px;padding:6px 14px;font-size:.82rem;font-weight:600;background:var(--card);color:var(--fg);transition:all .2s;cursor:pointer; }
        .chip:hover { border-color:var(--accent);color:var(--accent); }
        .toast { padding:13px 18px;border-radius:14px;font-size:.84rem;font-weight:500;display:flex;align-items:center;gap:9px;box-shadow:var(--shadow-lg);max-width:300px;animation:slideUp .35s cubic-bezier(.16,1,.3,1) both; }
        .toast-s { background:#f0fdf4;border:1.5px solid #86efac;color:#14532d; }
        .toast-e { background:#fef2f2;border:1.5px solid #fca5a5;color:#7f1d1d; }
        .toast-i { background:#eff6ff;border:1.5px solid #bfdbfe;color:#1e3a8a; }
        .dark .toast-s { background:#052e16;border-color:#16a34a;color:#86efac; }
        .dark .toast-e { background:#450a0a;border-color:#dc2626;color:#fca5a5; }
        .dark .toast-i { background:#172554;border-color:#3b82f6;color:#bfdbfe; }
        .prog { height:3px;border-radius:2px;background:linear-gradient(90deg,var(--accent),var(--accent2),var(--accent));background-size:200% 100%;animation:shimmer 1.2s linear infinite; }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0}100%{background-position:200% 0} }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }
        .fade-up { animation:fadeUp .5s cubic-bezier(.16,1,.3,1) both; }
        .fa-1 { animation-delay:.05s } .fa-2 { animation-delay:.1s } .fa-3 { animation-delay:.15s }
        .slabel { font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px; }
        .search-wrap { position:relative; }
        .search-wrap svg { position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none; }
        .search-inp { padding-left:38px !important; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:var(--border);border-radius:3px; }
        :focus-visible { outline:2px solid var(--accent);outline-offset:3px;border-radius:6px; }
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms !important;transition-duration:.01ms !important}}
        .count-badge { font-size:.75rem;font-weight:700;padding:3px 10px;border-radius:999px;background:var(--fg);color:var(--bg); }
        .tool-icon { width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .tool-icon svg { width:20px;height:20px; }
        .fmt { font-size:.65rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:2px 7px;border-radius:5px; }
        .cats-scroll { overflow-x:auto;scrollbar-width:none; }
        .cats-scroll::-webkit-scrollbar { display:none; }
        .tool-card .badge-row { display:flex;align-items:center;gap:6px;margin-bottom:10px; }
        audio { width:100%;height:36px;margin-top:8px; }
        audio::-webkit-media-controls-panel { background:var(--card); }
      `}</style>
      <img
        src="/images/audio-convertir.webp"
        alt="Free Audio Converter — convert MP3, WAV, OGG, FLAC online"
        width="1200" height="675"
        loading="lazy" decoding="async"
        className="object-cover w-full h-auto rounded-lg"
      />

      <div id="cur" />
      <div id="cur2" />

      {/* Toast Box */}
      <div aria-live="polite" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "s" && <svg className="w-4 h-4" style={{ flexShrink: 0, width: 16, height: 16 }} fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>}
            {t.type === "e" && <svg className="w-4 h-4" style={{ flexShrink: 0, width: 16, height: 16 }} fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>}
            {t.type === "i" && <svg className="w-4 h-4" style={{ flexShrink: 0, width: 16, height: 16 }} fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" /></svg>}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Hero */}
        <section className="text-center mb-14" aria-labelledby="heroTitle">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 fade-up" style={{ background: "rgba(232,93,38,0.09)", color: "var(--accent)", border: "1px solid rgba(232,93,38,0.2)" }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ width: 16, height: 16 }}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            50+ Free Tools — Zero Uploads — Zero Tracking
          </div>
          <h2 id="heroTitle" className="font-display font-extrabold leading-[1.05] mb-5 fade-up fa-1" style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(2rem,5vw,3.75rem)", color: "var(--fg)" }}>
            Convert Any Audio<br />
            <span style={{ color: "var(--accent)" }}>To Any Format</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 fade-up fa-2" style={{ color: "var(--muted)" }}>
            MP3 ↔ WAV ↔ OGG ↔ M4A ↔ FLAC ↔ AAC ↔ MP4 ↔ AIFF and 40+ editing tools.
            Everything runs in your browser. Your audio files never leave your device.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8 fade-up fa-3">
            {["50+ Tools", "All Browsers", "No Registration", "Instant Results", "100% Free"].map((l) => (
              <span key={l} className="chip">{l}</span>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="mb-14" aria-label="Audio tools">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <p className="slabel">All Tools</p>
              <h2 className="font-display font-bold text-2xl" style={{ fontFamily: "Syne, sans-serif", color: "var(--fg)" }}>
                Pick a tool <span className="count-badge ml-2">{filtered.length}</span>
              </h2>
            </div>
            <div className="search-wrap w-full sm:w-64">
              <svg style={{ width: 16, height: 16, color: "var(--muted)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input type="search" placeholder="Search tools…" className="inp search-inp" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
            </div>
          </div>
          <div className="cats-scroll flex items-center gap-2 mb-5 pb-1">
            {["all", "convert", "edit", "effect", "adjust", "export", "ai"].map((c) => (
              <button key={c} className={`cat-tab${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>
                {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="text-center py-12" style={{ color: "var(--muted)" }}>No tools match your search.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((t, i) => (
                <button key={t.id} className={`tool-card${activeTool?.id === t.id ? " active" : ""}`}
                  style={{ animationName: "fadeUp", animationDuration: "0.4s", animationDelay: `${i * 0.03}s`, animationFillMode: "both" }}
                  onClick={() => openTool(t.id)} aria-label={t.full}>
                  <div className="badge-row">
                    <div className="tool-icon" style={{ background: `${t.color}18`, color: t.color }} dangerouslySetInnerHTML={{ __html: ICONS[t.icon] || ICONS.note }} />
                    <span className="fmt" style={{ background: `${t.color}18`, color: t.color }}>{t.cat}</span>
                  </div>
                  <div className="font-display font-bold text-sm leading-tight mb-1" style={{ fontFamily: "Syne, sans-serif", color: "var(--fg)" }}>{t.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{t.desc}</div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Active Tool Panel */}
        {activeTool && (
          <section id="toolPanel" className="mb-14" ref={panelRef} aria-label="Active tool">
            <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}>
              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center gap-4">
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${activeTool.color}20`, color: activeTool.color, display: "flex", alignItems: "center", justifyContent: "center" }} dangerouslySetInnerHTML={{ __html: ICONS[activeTool.icon] || ICONS.note }} />
                  <div>
                    <h2 className="font-display font-bold text-xl" style={{ fontFamily: "Syne, sans-serif", color: "var(--fg)" }}>{activeTool.full}</h2>
                    <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{activeTool.desc}</p>
                  </div>
                </div>
                <button aria-label="Close" onClick={() => { setActiveTool(null); setFile(null); setBlob(null); setAudioBuffer(null); }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--border)", color: "var(--muted)" }}>
                  <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              {(loading || processing) && <div className="prog" />}
              <div className="p-6">
                {/* Upload Zone */}
                {!file && (
                  <div className={`upload-zone p-10 text-center mb-6${drag ? " drag" : ""}`} role="button" tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
                    onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}>
                    <input ref={fileInputRef} type="file" className="hidden" accept={activeTool.accept || "audio/*"} style={{ display: "none" }}
                      onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
                    <div className="flex flex-col items-center gap-4">
                      <div style={{ animation: "float 3s ease-in-out infinite" }}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: "rgba(232,93,38,0.1)" }}>
                          <svg style={{ width: 32, height: 32, color: "var(--accent)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold mb-1" style={{ color: "var(--fg)" }}>Drop your audio here</p>
                        <p className="text-sm" style={{ color: "var(--muted)" }}>or <span style={{ color: "var(--accent)", fontWeight: 600 }}>click to browse</span> · MP3, WAV, OGG, M4A, FLAC, AAC, MP4, AIFF</p>
                      </div>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>Max 100MB · All formats · Instant processing · Paste with Ctrl+V</p>
                    </div>
                  </div>
                )}

                {/* File Info */}
                {file && (
                  <div className="flex items-center gap-4 p-4 rounded-xl mb-6" style={{ background: "rgba(232,93,38,0.06)", border: "1.5px solid rgba(232,93,38,0.15)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(232,93,38,0.12)" }}>
                      <svg style={{ width: 20, height: 20, color: "var(--accent)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: "var(--fg)" }}>{file.name}</p>
                      {origMeta && <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{fmtTime(origMeta.dur)} · {origMeta.sr} Hz · {origMeta.ch === 1 ? "mono" : "stereo"} · {(file.type.split("/")[1] || "").toUpperCase()}</p>}
                    </div>
                    <button className="btn btn-secondary text-xs py-1.5 px-3 flex-shrink-0" style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                      onClick={() => { setFile(null); setAudioBuffer(null); setBlob(null); if (fileInputRef.current) { fileInputRef.current.value = ""; fileInputRef.current.click(); } }}>
                      Change
                    </button>
                  </div>
                )}

                {/* Options */}
                {hasOptions && file && (
                  <div className="mb-6">{renderOptions()}</div>
                )}

                {/* Action row */}
                {file && audioBuffer && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    <button className="btn btn-accent" disabled={processing} onClick={processAudio}>
                      <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      {processing ? "Processing…" : activeTool.act}
                    </button>
                    <button className="btn btn-secondary" onClick={() => { setFile(null); setBlob(null); setAudioBuffer(null); setOrigMeta(null); setSavePct(null); setConvDims(""); setConvSize(""); }}>
                      <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 12a9 9 0 109-9M3 3v6h6" /></svg>
                      Reset
                    </button>
                  </div>
                )}

                {/* Result */}
                {file && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-semibold" style={{ fontFamily: "Syne, sans-serif", color: "var(--fg)" }}>Result</h3>
                      {savePct !== null && savePct > 0 && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(22,163,74,0.12)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.2)" }}>↓ {savePct}% smaller</span>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="slabel" style={{ marginBottom: 0 }}>Original</span>
                          {origMeta && <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--surface)", color: "var(--muted)" }}>{fmtSize(origMeta.size)}</span>}
                        </div>
                        <div className="wave-wrap">
                          <canvas ref={wfOrigRef} className="wave-cvs" />
                          <audio ref={audOrigRef} controls preload="metadata" />
                        </div>
                        {origMeta && <p className="text-xs mt-2 text-center" style={{ color: "var(--muted)" }}>{fmtTime(origMeta.dur)} · {origMeta.sr} Hz · {origMeta.ch === 1 ? "Mono" : "Stereo"}</p>}
                      </div>
                      <div style={{ opacity: blob ? 1 : 0.3, transition: "opacity 0.3s" }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="slabel" style={{ marginBottom: 0 }}>Result</span>
                          {convSize && <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--surface)", color: "var(--muted)" }}>{convSize}</span>}
                        </div>
                        <div className="wave-wrap">
                          <canvas ref={wfConvRef} className="wave-cvs" />
                          <audio ref={audConvRef} controls preload="metadata" />
                        </div>
                        {convDims && <p className="text-xs mt-2 text-center" style={{ color: "var(--muted)" }}>{convDims}</p>}
                      </div>
                    </div>
                    {blob && (
                      <div className="flex flex-wrap gap-3">
                        <button className="btn btn-accent" onClick={downloadResult}>
                          <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                          Download
                        </button>
                        <button className="btn btn-secondary" onClick={copyResultLink}>
                          <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                          Copy Link
                        </button>
                        <button className="btn btn-secondary" onClick={() => { setFile(null); setBlob(null); setAudioBuffer(null); setOrigMeta(null); setSavePct(null); setConvDims(""); setConvSize(""); setTimeout(() => fileInputRef.current?.click(), 100); }}>
                          <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" /></svg>
                          Another
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Features */}
        <section id="features" className="mb-16">
          <p className="slabel text-center mb-2">Why Use Us</p>
          <h2 className="font-display font-bold text-3xl text-center mb-10" style={{ fontFamily: "Syne, sans-serif", color: "var(--fg)" }}>Built for podcasters, musicians &amp; creators</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: `<svg class="w-6 h-6" style="color:var(--accent)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`, bg: "rgba(232,93,38,0.1)", title: "100% Client-Side", desc: "All processing happens in your browser using the Web Audio API. Your audio files are never uploaded to any server." },
              { icon: `<svg class="w-6 h-6" style="color:var(--accent2)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`, bg: "rgba(45,107,228,0.1)", title: "Instant Processing", desc: "No waiting for uploads. Conversion happens the moment you click — typically just a few seconds even for long audio." },
              { icon: `<svg class="w-6 h-6" style="color:var(--accent3)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`, bg: "rgba(22,163,74,0.1)", title: "50+ Tools, Always Free", desc: "No subscriptions, watermarks, or paywalls. Every tool — from format conversion to advanced effects — is permanently free." },
              { icon: `<svg class="w-6 h-6" style="color:#a855f7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`, bg: "rgba(168,85,247,0.1)", title: "All Browsers Supported", desc: "Works on Chrome, Firefox, Safari, Edge and any modern browser — desktop or mobile. No plugins or extensions needed." },
              { icon: `<svg class="w-6 h-6" style="color:#14b8a6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`, bg: "rgba(20,184,166,0.1)", title: "10+ Output Formats", desc: "Convert to MP3, WAV, OGG, M4A, FLAC, AAC, MP4, AIFF and more. All the formats musicians and podcasters need." },
              { icon: `<svg class="w-6 h-6" style="color:#f59e0b" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`, bg: "rgba(245,158,11,0.1)", title: "For Everyone", desc: "Designed for podcasters, musicians, video editors, content creators, voice artists and anyone who works with audio." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-6 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: f.bg }} dangerouslySetInnerHTML={{ __html: f.icon }} />
                <h3 className="font-display font-semibold text-lg mb-2" style={{ fontFamily: "Syne, sans-serif", color: "var(--fg)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Tools SEO Section */}
        <section className="mb-16" aria-label="Popular conversion tools">
          <p className="slabel text-center mb-2">Most Searched</p>
          <h2 className="font-display font-bold text-2xl text-center mb-8" style={{ fontFamily: "Syne, sans-serif", color: "var(--fg)" }}>Popular Audio Conversion Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "MP3 to WAV Converter", desc: "Convert compressed MP3 files to lossless WAV format for editing, mastering, or CD burning. Preserves full audio quality." },
              { title: "WAV to MP3 Converter", desc: "Compress large WAV files into smaller MP3 files. Choose your bitrate from 64 kbps up to 320 kbps high-fidelity." },
              { title: "M4A ↔ MP3 Converter", desc: "Convert iTunes M4A / AAC files to universally-supported MP3. Perfect for older players, car radios and Android devices." },
              { title: "Reverse Audio", desc: "Reverse any audio file to play it backwards. Discover hidden messages or create unique creative effects for music & video." },
              { title: "Trim & Cut Audio", desc: "Cut a precise section of any audio file. Set start and end times in seconds to extract exactly what you need." },
              { title: "Ringtone Maker", desc: "Cut any song into a 30-second ringtone-ready clip with smooth fade in & fade out. Works on iPhone and Android." },
              { title: "Audio Effects & Filters", desc: "Apply reverb, echo, distortion, low-pass, high-pass, bass boost, treble boost and more pro audio effects in one click." },
              { title: "FLAC / OGG / AAC Converter", desc: "Convert lossless FLAC, OGG Vorbis and AAC files to MP3 or WAV. Perfect for moving music between devices & platforms." },
            ].map((a) => (
              <article key={a.title} className="rounded-xl p-5 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <h3 className="font-display font-semibold mb-2" style={{ fontFamily: "Syne, sans-serif", color: "var(--fg)" }}>{a.title}</h3>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{a.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-16" aria-labelledby="faqTitle">
          <p className="slabel text-center mb-2">FAQ</p>
          <h2 id="faqTitle" className="font-display font-bold text-2xl text-center mb-8" style={{ fontFamily: "Syne, sans-serif", color: "var(--fg)" }}>Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  <span className="font-semibold pr-4 text-sm" style={{ color: "var(--fg)" }}>{f.q}</span>
                  <svg style={{ width: 18, height: 18, flexShrink: 0, color: "var(--muted)", transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>


    </>
  );
}
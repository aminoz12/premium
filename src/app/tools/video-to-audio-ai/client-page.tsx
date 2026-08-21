'use client';

import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import Script from 'next/script';
import {
  Upload, FileAudio, Music, Settings, Scissors, Layers,
  Gauge, Activity, Volume2, TrendingUp, VolumeX,
  Radio, Play, Pause, Download, X, ChevronRight,
  Zap, Shield, Clock, HardDrive, Sparkles, CheckCircle2,
  XCircle, Info, BarChart3, Wand2, Trash2, ArrowDownToLine,
  FastForward, Rewind, Volume1, Sliders, ChevronDown,
  FileVideo, AudioLines, Waves, SquareStack,
  Star, Lock, Cpu, WifiOff, Infinity,
  AlertCircle, Check, RefreshCw, Film,
  Globe, Users, FileArchive, FileUp, ArrowRight,
  MonitorPlay, Clapperboard, Headphones, Signal,
  Disc, Speaker, AlertTriangle, Moon, Sun, MoveHorizontal
} from 'lucide-react';

// ─── Types ───
type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast { id: number; message: string; type: ToastType; }
interface ResultData { url: string; name: string; format: string; size: string; }
interface AnaData {
  duration: string; sampleRate: string; channels: string;
  bitDepth: string; size: string; peak: string; rms: string; bpm: string;
}

// ─── Helpers ───
function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Web Worker for MP3 (Prevents UI Freeze, with CDN fallback) ───
const mp3WorkerScript = `
importScripts('https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js');
self.onmessage = function(e) {
  try {
    const { left, right, channels, sampleRate, bitrate } = e.data;
    if (typeof lamejs === 'undefined') {
      self.postMessage({ type: 'error', message: 'MP3 encoder failed to load' });
      return;
    }
    const mp3Encoder = new lamejs.Mp3Encoder(channels, sampleRate, bitrate);
    const mp3Data = [];
    const block = 1152;
    const totalSamples = left.length;
    for (let i = 0; i < totalSamples; i += block) {
      const leftChunk = left.subarray(i, i + block);
      const rightChunk = right.subarray(i, i + block);
      const mp3buf = mp3Encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) mp3Data.push(mp3buf);
      if (i % (block * 50) === 0) {
        self.postMessage({ type: 'progress', pct: Math.round((i / totalSamples) * 100) });
      }
    }
    const rem = mp3Encoder.flush();
    if (rem.length > 0) mp3Data.push(rem);
    self.postMessage({ type: 'done', mp3Data });
  } catch (err) {
    self.postMessage({ type: 'error', message: err.toString() });
  }
};
`;
const mp3WorkerBlob = typeof window !== 'undefined' ? new Blob([mp3WorkerScript], { type: 'application/javascript' }) : null;
const mp3WorkerUrl = mp3WorkerBlob ? URL.createObjectURL(mp3WorkerBlob) : '';

// ─── Stable sub-components (must be OUTSIDE the main component to prevent remount on every render) ───

const SectionHeader = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shrink-0">{icon}</div>
    <div><h2 className="text-sm font-bold text-black dark:text-white leading-tight">{title}</h2><p className="text-xs text-neutral-400 leading-tight mt-0.5">{subtitle}</p></div>
  </div>
);

const ToolCard = ({ icon, title, subtitle, toolKey, activeTool, children }: { icon: React.ReactNode; title: string; subtitle: string; toolKey: string; activeTool: string | null; children?: React.ReactNode }) => (
  <div className={`rounded-2xl border bg-white dark:bg-black p-5 transition-all duration-500 ${activeTool === toolKey ? 'border-black dark:border-white shadow-[0_0_0_1px_#000,0_8px_30px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_0_0_1px_#fff,0_8px_30px_-12px_rgba(255,255,255,0.1)] scale-[1.01]' : 'border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600'}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shrink-0">{icon}</div>
      <div><div className="text-sm font-bold text-black dark:text-white">{title}</div><div className="text-xs text-neutral-400">{subtitle}</div></div>
    </div>
    {children}
  </div>
);

const FileUploadBtn = ({ onFile, toolName, activeTool }: { onFile: (f: File) => void; toolName: string; activeTool: string | null }) => (
  <label className={`group flex items-center gap-2 rounded-xl border-2 border-dashed p-3 text-xs font-semibold cursor-pointer transition-all duration-300 mb-3 ${activeTool === toolName ? 'border-black dark:border-white bg-black/5 dark:bg-white/5 text-black dark:text-white' : 'border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'}`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
    <span>{activeTool === toolName ? 'Replace file' : 'Load audio file'}</span>
    <input type="file" accept="audio/*,video/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
  </label>
);

const ActionBtn = ({ onClick, icon, label, variant = 'primary' }: { onClick: () => void; icon: React.ReactNode; label: string; variant?: 'primary' | 'outline' }) => (
  <button onClick={onClick} className={`group flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-xs font-bold transition-all duration-300 active:scale-[0.97] ${variant === 'primary' ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200' : 'border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:bg-white hover:text-white dark:hover:text-black'}`}>
    <span className="transition-transform group-hover:scale-110">{icon}</span><span>{label}</span>
  </button>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">{children}</label>
);

const NumberInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input ref={ref} type="number" className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-black px-3 py-2.5 text-sm font-medium text-black dark:text-white outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 transition-all" {...props} />
));
NumberInput.displayName = 'NumberInput';

const SelectInput = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { children?: React.ReactNode }>(({ children, ...props }, ref) => (
  <div className="relative">
    <select ref={ref} className="w-full appearance-none rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-black px-3 py-2.5 text-sm font-medium text-black dark:text-white outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 transition-all pr-9" {...props}>{children}</select>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5"><polyline points="6 9 12 15 18 9" /></svg>
  </div>
));
SelectInput.displayName = 'SelectInput';

// ─── Visual Trimmer Component (optimized for performance) ───
const WaveformTrimmer = ({ buffer, trimStart, trimEnd, onTrimChange }: { buffer: AudioBuffer; trimStart: number; trimEnd: number; onTrimChange: (start: number, end: number) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'start' | 'end' | null>(null);

  const duration = buffer.duration;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? '#000' : '#fff';
    ctx.fillRect(0, 0, width, height);

    const data = buffer.getChannelData(0);
    // Decimate for performance: limit to 5000 points
    const step = Math.max(1, Math.floor(data.length / 5000));
    const amp = height / 2;

    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)';
    for (let i = 0; i < width; i++) {
      let min = 1.0, max = -1.0;
      const idx = Math.floor(i * step);
      for (let j = 0; j < step && idx + j < data.length; j++) {
        const val = data[idx + j] || 0;
        if (val < min) min = val;
        if (val > max) max = val;
      }
      const barH = Math.max(1, (max - min) * amp * 0.9);
      const y = (1 + min) * amp;
      ctx.fillRect(i, y, 1, barH);
    }
  }, [buffer]);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    const time = pct * duration;

    if (dragging === 'start') {
      onTrimChange(Math.min(time, trimEnd - 0.1), trimEnd);
    } else {
      onTrimChange(trimStart, Math.max(time, trimStart + 0.1));
    }
  }, [dragging, duration, trimStart, trimEnd, onTrimChange]);

  useEffect(() => {
    if (!dragging) return;
    const stopDragging = () => setDragging(null);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', stopDragging);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [dragging, handleMouseMove]);

  const startPct = (trimStart / duration) * 100;
  const endPct = (trimEnd / duration) * 100;

  return (
    <div className="mt-2 select-none">
      <div className="flex justify-between text-xs font-mono mb-1 text-black dark:text-white">
        <span>{formatTime(trimStart)}</span>
        <span>{formatTime(trimEnd)}</span>
      </div>
      <div ref={containerRef} className="relative w-full h-24 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 cursor-crosshair">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Left Mask */}
        <div className="absolute top-0 left-0 h-full bg-white/60 dark:bg-black/70" style={{ width: `${startPct}%` }} />
        {/* Right Mask */}
        <div className="absolute top-0 right-0 h-full bg-white/60 dark:bg-black/70" style={{ width: `${100 - endPct}%` }} />

        {/* Selection Highlight */}
        <div className="absolute top-0 h-full border-y-2 border-black dark:border-white" style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }} />

        {/* Left Handle */}
        <div
          onMouseDown={() => setDragging('start')}
          onTouchStart={() => setDragging('start')}
          className="absolute top-0 h-full w-3 bg-white dark:bg-black border-l border-r border-black dark:border-white cursor-ew-resize z-10 flex items-center justify-center shadow-md"
          style={{ left: `calc(${startPct}% - 6px)` }}
        >
          <MoveHorizontal size={10} className="text-black dark:text-white" />
        </div>

        {/* Right Handle */}
        <div
          onMouseDown={() => setDragging('end')}
          onTouchStart={() => setDragging('end')}
          className="absolute top-0 h-full w-3 bg-white dark:bg-black border-l border-r border-black dark:border-white cursor-ew-resize z-10 flex items-center justify-center shadow-md"
          style={{ left: `calc(${endPct}% - 6px)` }}
        >
          <MoveHorizontal size={10} className="text-black dark:text-white" />
        </div>
      </div>
      <p className="text-[10px] text-neutral-500 mt-1 text-center">Drag handles to crop audio visually</p>
    </div>
  );
};

export default function AudioForgePro() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('converter');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  const [convLoaded, setConvLoaded] = useState(false);
  const [convFileName, setConvFileName] = useState('');
  const [convFileMeta, setConvFileMeta] = useState('');
  const [converting, setConverting] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [outFormat, setOutFormat] = useState('mp3');
  const [outQuality, setOutQuality] = useState('192');
  const [outVolume, setOutVolume] = useState(100);
  const [outTrimStart, setOutTrimStart] = useState(0);
  const [outTrimEnd, setOutTrimEnd] = useState(0);

  const [speedVal, setSpeedVal] = useState('1.00');
  const [pitchVal, setPitchVal] = useState('0');
  const [freqVal, setFreqVal] = useState('440');

  const [mainBuffer, setMainBuffer] = useState<AudioBuffer | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [toolBuffer, setToolBuffer] = useState<AudioBuffer | null>(null);
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [toolDuration, setToolDuration] = useState('');
  const [tonePlaying, setTonePlaying] = useState(false);
  const [anaData, setAnaData] = useState<AnaData | null>(null);
  const [anaBuffer, setAnaBuffer] = useState<AudioBuffer | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<HTMLAudioElement>(null);
  const toneOscRef = useRef<OscillatorNode | null>(null);
  const toneCtxRef = useRef<AudioContext | null>(null);
  const anaWaveRef = useRef<HTMLCanvasElement>(null);
  const specRef = useRef<HTMLCanvasElement>(null);
  const activeWorkerRef = useRef<Worker | null>(null);

  const cutStartRef = useRef<HTMLInputElement>(null);
  const cutEndRef = useRef<HTMLInputElement>(null);
  const speedSliderRef = useRef<HTMLInputElement>(null);
  const pitchSliderRef = useRef<HTMLInputElement>(null);
  const fadeInRef = useRef<HTMLInputElement>(null);
  const fadeOutRef = useRef<HTMLInputElement>(null);
  const normTargetRef = useRef<HTMLInputElement>(null);
  const silenceThreshRef = useRef<HTMLInputElement>(null);
  const toneTypeRef = useRef<HTMLSelectElement>(null);
  const toneFreqRef = useRef<HTMLInputElement>(null);
  const toneDurRef = useRef<HTMLInputElement>(null);
  const noiseTypeRef = useRef<HTMLSelectElement>(null);
  const noiseDurRef = useRef<HTMLInputElement>(null);
  const silenceDurRef = useRef<HTMLInputElement>(null);
  const silenceSRRef = useRef<HTMLSelectElement>(null);

  // Init & Dark Mode
  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedDark = localStorage.getItem('audioForgeDark');
    if (savedDark === 'true' || (!savedDark && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem('audioForgeDark', String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setShowFloatingCta(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return () => { if (activeWorkerRef.current) activeWorkerRef.current.terminate(); };
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // ─── Handles file selection, with memory and error handling ───
  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
      showToast('Please select an audio or video file', 'error');
      return;
    }

    // Warning for large files > 50 MB
    if (file.size > 50 * 1024 * 1024) {
      showToast('File is larger than 50MB. Browser conversion may be slow or unstable. Files under 500MB are recommended for best performance.', 'warning');
    }

    // Reset state
    setCurrentFile(file);
    setConvFileName(file.name);
    setConvFileMeta(`${formatSize(file.size)} · Decoding...`);
    setConvLoaded(true);
    setResult(null);
    setOutTrimStart(0);
    setOutTrimEnd(0);
    setActiveTool(null);

    let arrayBuffer: ArrayBuffer | null = null;
    let audioContext: AudioContext | null = null;
    try {
      arrayBuffer = await file.arrayBuffer();
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decoded = await audioContext.decodeAudioData(arrayBuffer);
      audioContext.close();

      // Free arrayBuffer immediately
      arrayBuffer = null;

      setMainBuffer(decoded);
      setConvFileMeta(`${formatSize(file.size)} · ${formatTime(decoded.duration)} · ${decoded.sampleRate.toLocaleString()} Hz · ${decoded.numberOfChannels === 1 ? 'Mono' : 'Stereo'}`);
      setOutTrimEnd(decoded.duration);
      showToast('File decoded successfully', 'success');
    } catch (error: any) {
      if (audioContext) audioContext.close();
      arrayBuffer = null;

      if (error instanceof DOMException &&
        (error.name === 'NotSupportedError' || error.name === 'InvalidStateError' || error.name === 'EncodingError')) {
        showToast('File is too large for browser memory. Please trim the video or use a shorter clip.', 'error');
      } else {
        showToast('Error decoding file. Format may be unsupported or file is too large.', 'error');
      }
      setConvLoaded(false);
    }
  }, [showToast]);

  const resetConverter = useCallback(() => {
    setConvLoaded(false);
    setConvFileName('');
    setConvFileMeta('');
    setCurrentFile(null);
    setMainBuffer(null);
    setResult(null);
    setConverting(false);
    setProgressPct(0);
    setProgressText('');
    setOutTrimStart(0);
    setOutTrimEnd(0);
    setActiveTool(null);
    if (activeWorkerRef.current) activeWorkerRef.current.terminate();
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const updateProgress = useCallback((pct: number, text?: string) => {
    setProgressPct(pct);
    setProgressText(text || 'Processing...');
  }, []);

  // ─── Get trimmed buffer from mainBuffer ───
  const getTrimmedBuffer = useCallback(async (buffer: AudioBuffer, trimStart: number, trimEnd: number, volume: number): Promise<AudioBuffer> => {
    const sr = buffer.sampleRate;
    const ch = buffer.numberOfChannels;
    const start = Math.max(0, trimStart);
    const end = Math.min(buffer.duration, trimEnd > 0 ? trimEnd : buffer.duration);
    const duration = end - start;
    const len = Math.ceil(duration * sr);
    const offCtx = new OfflineAudioContext(ch, len, sr);
    const src = offCtx.createBufferSource();
    src.buffer = buffer;
    const gain = offCtx.createGain();
    gain.gain.value = volume;
    src.connect(gain);
    gain.connect(offCtx.destination);
    src.start(0, start, duration);
    return await offCtx.startRendering();
  }, []);

  // ─── Proper WAV generation (16-bit or 32-bit float) ───
  const audioBufferToWavBlob = useCallback((buffer: AudioBuffer, bitDepth: 16 | 32 = 16): Blob => {
    const numCh = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length;
    const bytesPerSample = bitDepth / 8;
    const dataLen = length * numCh * bytesPerSample;
    const headerLen = 44;
    const totalLen = headerLen + dataLen;

    const arrayBuffer = new ArrayBuffer(totalLen);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataLen, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    const formatTag = bitDepth === 32 ? 3 : 1;
    view.setUint16(20, formatTag, true);
    view.setUint16(22, numCh, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numCh * bytesPerSample, true);
    view.setUint16(32, numCh * bytesPerSample, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLen, true);

    let offset = 44;
    const channels: Float32Array[] = [];
    for (let c = 0; c < numCh; c++) {
      channels.push(buffer.getChannelData(c));
    }

    if (bitDepth === 32) {
      for (let i = 0; i < length; i++) {
        for (let c = 0; c < numCh; c++) {
          const val = Math.max(-1, Math.min(1, channels[c][i]));
          view.setFloat32(offset, val, true);
          offset += 4;
        }
      }
    } else {
      for (let i = 0; i < length; i++) {
        for (let c = 0; c < numCh; c++) {
          const val = Math.max(-1, Math.min(1, channels[c][i]));
          const intVal = val < 0 ? val * 0x8000 : val * 0x7FFF;
          view.setInt16(offset, Math.round(intVal), true);
          offset += 2;
        }
      }
    }
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }, []);

  // ─── AIFF generation ───
  const audioBufferToAIFFBlob = useCallback((buffer: AudioBuffer): Blob => {
    const numCh = buffer.numberOfChannels;
    const sr = buffer.sampleRate;
    const len = buffer.length;
    const bytesPerSample = 2; // AIFF only supports 16-bit PCM
    const dataLen = len * numCh * bytesPerSample;

    // Total size: FORM(4) + size(4) + AIFF(4) + COMM(4) + commSize(4) + commData(18) + SSND(4) + ssndSize(4) + offset(4) + blockSize(4) + data
    const totalSize = 46 + dataLen;
    const ab = new ArrayBuffer(totalSize);
    const view = new DataView(ab);
    let offset = 0;

    // Write big-endian strings
    const writeString = (str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
      offset += str.length;
    };

    // FORM chunk
    writeString('FORM');
    view.setUint32(offset, totalSize - 8, false); // size (big-endian)
    offset += 4;
    writeString('AIFF');

    // COMM chunk
    writeString('COMM');
    view.setUint32(offset, 18, false); // comm chunk size
    offset += 4;
    view.setUint16(offset, numCh, false);
    offset += 2;
    view.setUint32(offset, len, false);
    offset += 4;
    view.setUint16(offset, 16, false); // bits per sample
    offset += 2;

    // Sample rate as 80-bit extended float (big-endian)
    // Convert sampleRate to extended float (simple approximation for common rates)
    const srExp = Math.floor(Math.log2(sr)) + 16383;
    const srMant = Math.round((sr / Math.pow(2, Math.floor(Math.log2(sr)))) * 0x80000000);
    view.setUint16(offset, srExp, false);
    offset += 2;
    view.setUint32(offset, srMant >>> 0, false);
    offset += 4;
    view.setUint32(offset, 0, false); // low 32 bits of mantissa (0 for exact rates)
    offset += 4;

    // SSND chunk
    writeString('SSND');
    view.setUint32(offset, dataLen + 8, false);
    offset += 4;
    view.setUint32(offset, 0, false); // offset
    offset += 4;
    view.setUint32(offset, 0, false); // block size
    offset += 4;

    // Write audio data (16-bit PCM, big-endian)
    const channels: Float32Array[] = [];
    for (let c = 0; c < numCh; c++) {
      channels.push(buffer.getChannelData(c));
    }

    for (let i = 0; i < len; i++) {
      for (let c = 0; c < numCh; c++) {
        const val = Math.max(-1, Math.min(1, channels[c][i]));
        const intVal = val < 0 ? val * 0x8000 : val * 0x7FFF;
        view.setInt16(offset, Math.round(intVal), false); // big-endian
        offset += 2;
      }
    }

    return new Blob([ab], { type: 'audio/aiff' });
  }, []);

  // ─── WAV conversion with UI yield ───
  const convertToWAV = useCallback(async (volume: number, trimStart: number, trimEnd: number, bits: 16 | 32 = 16): Promise<Blob> => {
    if (!mainBuffer) throw new Error('No audio loaded');
    updateProgress(20, `Rendering WAV ${bits}-bit...`);
    await new Promise(resolve => setTimeout(resolve, 50));
    const rendered = await getTrimmedBuffer(mainBuffer, trimStart, trimEnd, volume);
    await new Promise(resolve => setTimeout(resolve, 0));
    updateProgress(80, 'Building WAV...');
    const blob = audioBufferToWavBlob(rendered, bits);
    updateProgress(100, 'Complete!');
    return blob;
  }, [mainBuffer, updateProgress, getTrimmedBuffer, audioBufferToWavBlob]);

  // ─── AIFF conversion with UI yield ───
  const convertToAIFF = useCallback(async (volume: number, trimStart: number, trimEnd: number): Promise<Blob> => {
    if (!mainBuffer) throw new Error('No audio loaded');
    updateProgress(20, 'Rendering AIFF...');
    await new Promise(resolve => setTimeout(resolve, 50));
    const rendered = await getTrimmedBuffer(mainBuffer, trimStart, trimEnd, volume);
    updateProgress(80, 'Building AIFF...');
    await new Promise(resolve => setTimeout(resolve, 50));
    const blob = audioBufferToAIFFBlob(rendered);
    updateProgress(100, 'Complete!');
    return blob;
  }, [mainBuffer, updateProgress, getTrimmedBuffer, audioBufferToAIFFBlob]);
  // ─── MP3 conversion with Web Worker ───
  const convertToMP3 = useCallback(async (bitrate: number, volume: number, trimStart: number, trimEnd: number): Promise<Blob> => {
    if (!mainBuffer) throw new Error('No audio loaded');
    updateProgress(10, 'Rendering audio...');
    const rendered = await getTrimmedBuffer(mainBuffer, trimStart, trimEnd, volume);
    updateProgress(20, 'Preparing MP3 encoding...');

    const left = rendered.getChannelData(0);
    const right = rendered.numberOfChannels > 1 ? rendered.getChannelData(1) : left;
    const li = new Int16Array(left.length);
    const ri = new Int16Array(right.length);
    for (let i = 0; i < left.length; i++) {
      li[i] = Math.max(-32768, Math.min(32767, left[i] * 32767));
      ri[i] = Math.max(-32768, Math.min(32767, right[i] * 32767));
    }

    return new Promise((resolve, reject) => {
      if (!mp3WorkerUrl) reject(new Error('Worker not available'));
      const worker = new Worker(mp3WorkerUrl);
      activeWorkerRef.current = worker;

      worker.onmessage = (e) => {
        if (e.data.type === 'progress') {
          updateProgress(20 + Math.round(e.data.pct * 0.7), `Encoding MP3... ${e.data.pct}%`);
        } else if (e.data.type === 'done') {
          const mp3Data = e.data.mp3Data;
          const total = mp3Data.reduce((a: number, b: Uint8Array) => a + b.length, 0);
          const out = new Uint8Array(total);
          let offset = 0;
          for (const c of mp3Data) {
            out.set(c, offset);
            offset += c.length;
          }
          updateProgress(100, 'Complete!');
          worker.terminate();
          activeWorkerRef.current = null;
          resolve(new Blob([out], { type: 'audio/mpeg' }));
        } else if (e.data.type === 'error') {
          reject(new Error(e.data.message));
        }
      };
      worker.onerror = (err) => {
        reject(new Error('MP3 encoding failed: ' + err.message));
        worker.terminate();
        activeWorkerRef.current = null;
      };
      worker.postMessage({ left: li, right: ri, channels: rendered.numberOfChannels, sampleRate: rendered.sampleRate, bitrate });
    });
  }, [mainBuffer, updateProgress, getTrimmedBuffer]);

  // ─── Real‑time MediaRecorder for OGG/MP4 (with progress updates) ───
  const convertToMediaRecorder = useCallback(async (mimeType: string, bitrate: number, volume: number, ext: string, trimStart: number, trimEnd: number): Promise<Blob> => {
    if (!mainBuffer) throw new Error('No audio loaded');
    updateProgress(20, 'Preparing real-time recording...');
    const rendered = await getTrimmedBuffer(mainBuffer, trimStart, trimEnd, volume);
    updateProgress(40, `Recording audio... (This takes duration of audio)`);

    const playCtx = new AudioContext({ sampleRate: rendered.sampleRate });
    const source = playCtx.createBufferSource();
    source.buffer = rendered;
    const dest = playCtx.createMediaStreamDestination();
    source.connect(dest);

    let finalMime = mimeType;
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      finalMime = ext === 'ogg' ? 'audio/ogg' : 'audio/mp4';
    }
    const chunks: Blob[] = [];

    return new Promise((resolve, reject) => {
      const rec = new MediaRecorder(dest.stream, {
        mimeType: finalMime,
        audioBitsPerSecond: bitrate * 1000,
      });
      rec.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      rec.onstop = () => {
        playCtx.close();
        updateProgress(100, 'Complete!');
        resolve(new Blob(chunks, { type: finalMime }));
      };
      rec.onerror = () => reject(new Error('Recorder error'));
      source.onended = () => rec.stop();
      source.start(0);
      rec.start();

      // Frequent progress updates during recording
      const interval = setInterval(() => {
        if (rec.state === 'recording') {
          const elapsed = playCtx.currentTime;
          const total = rendered.duration;
          const pct = Math.min(100, Math.round((elapsed / total) * 100));
          updateProgress(40 + pct * 0.6, `Recording... ${pct}%`);
        }
      }, 200);
      // Clear interval when done
      source.onended = () => {
        clearInterval(interval);
        rec.stop();
      };
    });
  }, [mainBuffer, updateProgress, getTrimmedBuffer]);

  // ─── Streaming fallback for large videos (>100MB) with real‑time formats ───
  const convertLargeVideoViaStreaming = useCallback(async (file: File, mimeType: string, bitrate: number, ext: string): Promise<Blob> => {
    if (!file.type.startsWith('video/')) {
      throw new Error('Streaming fallback only supports video files.');
    }
    showToast('Large file detected: using streaming fallback (trim/volume ignored).', 'warning');
    updateProgress(10, 'Preparing video stream...');

    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.loop = false;
    video.style.display = 'none';
    document.body.appendChild(video);

    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve;
      video.onerror = reject;
      setTimeout(() => reject(new Error('Video loading timeout')), 30000);
    });

    const stream = (video as any).captureStream();
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      throw new Error('No audio track found in video.');
    }
    const audioStream = new MediaStream(audioTracks);
    video.play();

    const chunks: Blob[] = [];
    let finalMime = mimeType;
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      finalMime = ext === 'ogg' ? 'audio/ogg' : 'audio/mp4';
    }

    return new Promise((resolve, reject) => {
      const rec = new MediaRecorder(audioStream, {
        mimeType: finalMime,
        audioBitsPerSecond: bitrate * 1000,
      });
      rec.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      rec.onstop = () => {
        video.pause();
        video.remove();
        URL.revokeObjectURL(video.src);
        const finalBlob = new Blob(chunks, { type: finalMime });
        updateProgress(100, 'Complete!');
        resolve(finalBlob);
      };
      rec.onerror = (err) => {
        video.pause();
        video.remove();
        reject(new Error('Recorder error: ' + err));
      };
      rec.start();
      video.onended = () => rec.stop();
      // Safety: stop after 2x duration
      setTimeout(() => {
        if (rec.state === 'recording') rec.stop();
      }, (video.duration || 300) * 2000);
    });
  }, [showToast, updateProgress]);

  // ─── Main conversion entry point ───
  const startConversion = useCallback(async () => {
    if (!currentFile || !mainBuffer) {
      showToast('Please load a file first', 'error');
      return;
    }
    const format = outFormat;
    const quality = parseInt(outQuality);
    const volume = outVolume / 100;
    const trimStart = outTrimStart;
    const trimEnd = outTrimEnd || mainBuffer.duration;

    setConverting(true);
    setResult(null);
    updateProgress(5, 'Starting...');

    // For large files (>100MB) and real‑time formats, use streaming fallback
    const realtimeFormats = ['ogg', 'mp4', 'opus', 'm4a', 'aac'];
    if (currentFile.size > 100 * 1024 * 1024 && realtimeFormats.includes(format)) {
      try {
        let mimeType: string;
        let ext = format;
        switch (format) {
          case 'ogg': mimeType = 'audio/ogg;codecs=vorbis'; break;
          case 'mp4': mimeType = 'audio/mp4;codecs=opus'; break;
          case 'opus': mimeType = 'audio/ogg;codecs=opus'; break;
          case 'm4a': mimeType = 'audio/mp4;codecs=opus'; break;
          case 'aac': mimeType = 'audio/mp4;codecs=opus'; break;
          default: throw new Error('Unsupported format for streaming fallback');
        }
        const blob = await convertLargeVideoViaStreaming(currentFile, mimeType, quality, ext);
        const url = URL.createObjectURL(blob);
        const baseName = currentFile.name.replace(/\.[^.]+$/, '') || 'audio';
        setResult({ url, name: `${baseName}.${ext}`, format: ext, size: formatSize(blob.size) });
        showToast(`${ext.toUpperCase()} ready via streaming — ${formatSize(blob.size)}`, 'success');
        setConverting(false);
        return;
      } catch (error: any) {
        showToast('Streaming fallback failed: ' + (error.message || 'Unknown error') + '. Trying normal conversion...', 'warning');
      }
    }

    // Normal conversion path
    try {
      let blob: Blob;
      let ext = format;
      switch (format) {
        case 'mp3':
          blob = await convertToMP3(quality, volume, trimStart, trimEnd);
          break;
        case 'wav':
          blob = await convertToWAV(volume, trimStart, trimEnd, 16);
          break;
        case 'wav32':
          blob = await convertToWAV(volume, trimStart, trimEnd, 32);
          ext = 'wav';
          break;
        case 'ogg':
          blob = await convertToMediaRecorder('audio/ogg;codecs=vorbis', quality, volume, 'ogg', trimStart, trimEnd);
          break;
        case 'mp4':
          blob = await convertToMediaRecorder('audio/mp4;codecs=opus', quality, volume, 'mp4', trimStart, trimEnd);
          break;
        case 'opus':
          blob = await convertToMediaRecorder('audio/ogg;codecs=opus', quality, volume, 'opus', trimStart, trimEnd);
          ext = 'opus';
          break;
        case 'flac':
          blob = await convertToWAV(volume, trimStart, trimEnd, 16);
          ext = 'flac';
          break;
        case 'aiff':
          blob = await convertToAIFF(volume, trimStart, trimEnd);
          ext = 'aiff';
          break;
        case 'm4a':
          blob = await convertToMediaRecorder('audio/mp4;codecs=opus', quality, volume, 'm4a', trimStart, trimEnd);
          ext = 'm4a';
          break;
        case 'aac':
          blob = await convertToMediaRecorder('audio/mp4;codecs=opus', quality, volume, 'aac', trimStart, trimEnd);
          ext = 'aac';
          break;
        default:
          throw new Error('Unsupported format: ' + format);
      }
      const url = URL.createObjectURL(blob);
      const baseName = currentFile.name.replace(/\.[^.]+$/, '') || 'audio';
      setResult({ url, name: `${baseName}.${ext}`, format: ext, size: formatSize(blob.size) });
      showToast(`${ext.toUpperCase()} ready — ${formatSize(blob.size)}`, 'success');
    } catch (error: any) {
      showToast('Conversion failed: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setConverting(false);
    }
  }, [
    currentFile, mainBuffer, outFormat, outQuality, outVolume, outTrimStart, outTrimEnd,
    showToast, updateProgress, convertToMP3, convertToWAV, convertToAIFF,
    convertToMediaRecorder, convertLargeVideoViaStreaming
  ]);

  // ─── Download with immediate memory cleanup ───
  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoke immediately to free memory
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast('Download failed: ' + err, 'error');
    }
  }, [showToast]);

  // ─── Tool functions (unchanged, but they use the fixed downloadBlob) ───
  const loadToolFile = useCallback(async (file: File, toolName: string) => {
    try {
      const ab = await file.arrayBuffer();
      const ac = new AudioContext();
      const buf = await ac.decodeAudioData(ab);
      ac.close();
      setToolBuffer(buf);
      setActiveTool(toolName);
      if (toolName === 'cutter') {
        if (cutEndRef.current) cutEndRef.current.value = buf.duration.toFixed(2);
        setToolDuration(formatTime(buf.duration));
      }
      showToast(`Loaded: ${file.name}`, 'success');
    } catch (err: any) {
      showToast('Error loading: ' + (err.message || 'Unknown error'), 'error');
    }
  }, [showToast]);

  const toolCut = useCallback(async () => {
    if (!toolBuffer) return;
    const start = parseFloat(cutStartRef.current?.value || '0');
    const end = parseFloat(cutEndRef.current?.value || '0') || toolBuffer.duration;
    if (start >= end) { showToast('End must be greater than start', 'error'); return; }
    const sr = toolBuffer.sampleRate;
    const ch = toolBuffer.numberOfChannels;
    const newLen = Math.ceil((end - start) * sr);
    const offCtx = new OfflineAudioContext(ch, newLen, sr);
    const src = offCtx.createBufferSource();
    src.buffer = toolBuffer;
    src.connect(offCtx.destination);
    src.start(0, start, end - start);
    const rendered = await offCtx.startRendering();
    downloadBlob(audioBufferToWavBlob(rendered), 'cut_audio.wav');
    showToast('Cut complete!', 'success');
  }, [toolBuffer, showToast, downloadBlob, audioBufferToWavBlob]);

  const addMergeFiles = useCallback((files: FileList) => {
    setMergeFiles(prev => [...prev, ...Array.from(files)]);
    showToast('Files added', 'info');
  }, [showToast]);

  const removeMergeFile = useCallback((idx: number) => {
    setMergeFiles(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const toolMerge = useCallback(async () => {
    if (mergeFiles.length < 2) { showToast('Add at least 2 files', 'error'); return; }
    const buffers: AudioBuffer[] = [];
    let totalLen = 0;
    for (const file of mergeFiles) {
      const ab = await file.arrayBuffer();
      const ac = new AudioContext();
      const buf = await ac.decodeAudioData(ab);
      ac.close();
      buffers.push(buf);
      totalLen += buf.length;
    }
    const sr = buffers[0].sampleRate;
    const ch = buffers[0].numberOfChannels;
    const offCtx = new OfflineAudioContext(ch, totalLen, sr);
    let offset = 0;
    for (const buf of buffers) {
      const src = offCtx.createBufferSource();
      src.buffer = buf;
      src.connect(offCtx.destination);
      src.start(offset);
      offset += buf.length / sr;
    }
    const rendered = await offCtx.startRendering();
    downloadBlob(audioBufferToWavBlob(rendered), 'merged_audio.wav');
    showToast('Merge complete!', 'success');
  }, [mergeFiles, showToast, downloadBlob, audioBufferToWavBlob]);

  const toolSpeed = useCallback(async () => {
    if (!toolBuffer) return;
    const speed = parseFloat(speedSliderRef.current?.value || '1');
    const newLen = Math.round(toolBuffer.length / speed);
    const offCtx = new OfflineAudioContext(toolBuffer.numberOfChannels, newLen, toolBuffer.sampleRate);
    const src = offCtx.createBufferSource();
    src.buffer = toolBuffer;
    src.playbackRate.value = speed;
    src.connect(offCtx.destination);
    src.start(0);
    const rendered = await offCtx.startRendering();
    downloadBlob(audioBufferToWavBlob(rendered), `speed_${speed}x.wav`);
    showToast('Speed changed!', 'success');
  }, [toolBuffer, downloadBlob, audioBufferToWavBlob, showToast]);

  const toolPitch = useCallback(async () => {
    if (!toolBuffer) return;
    const semitones = parseInt(pitchSliderRef.current?.value || '0');
    const factor = Math.pow(2, semitones / 12);
    const newLen = Math.round(toolBuffer.length / factor);
    const offCtx = new OfflineAudioContext(toolBuffer.numberOfChannels, newLen, toolBuffer.sampleRate);
    const src = offCtx.createBufferSource();
    src.buffer = toolBuffer;
    src.playbackRate.value = factor;
    src.connect(offCtx.destination);
    src.start(0);
    const rendered = await offCtx.startRendering();
    downloadBlob(audioBufferToWavBlob(rendered), `pitch_${semitones > 0 ? '+' : ''}${semitones}st.wav`);
    showToast('Pitch shifted!', 'success');
  }, [toolBuffer, downloadBlob, audioBufferToWavBlob, showToast]);

  const toolReverse = useCallback(async () => {
    if (!toolBuffer) return;
    const ch = toolBuffer.numberOfChannels;
    const len = toolBuffer.length;
    const offCtx = new OfflineAudioContext(ch, len, toolBuffer.sampleRate);
    const revBuf = offCtx.createBuffer(ch, len, toolBuffer.sampleRate);
    for (let c = 0; c < ch; c++) {
      const orig = toolBuffer.getChannelData(c);
      const rev = revBuf.getChannelData(c);
      for (let i = 0; i < len; i++) rev[len - 1 - i] = orig[i];
    }
    const src = offCtx.createBufferSource();
    src.buffer = revBuf;
    src.connect(offCtx.destination);
    src.start(0);
    const rendered = await offCtx.startRendering();
    downloadBlob(audioBufferToWavBlob(rendered), 'reversed.wav');
    showToast('Reversed!', 'success');
  }, [toolBuffer, downloadBlob, audioBufferToWavBlob, showToast]);

  const toolFade = useCallback(async () => {
    if (!toolBuffer) return;
    const fadeIn = parseFloat(fadeInRef.current?.value || '0');
    const fadeOut = parseFloat(fadeOutRef.current?.value || '0');
    const offCtx = new OfflineAudioContext(toolBuffer.numberOfChannels, toolBuffer.length, toolBuffer.sampleRate);
    const src = offCtx.createBufferSource();
    src.buffer = toolBuffer;
    const gIn = offCtx.createGain();
    const gOut = offCtx.createGain();
    src.connect(gIn);
    gIn.connect(gOut);
    gOut.connect(offCtx.destination);
    if (fadeIn > 0) {
      gIn.gain.setValueAtTime(0, 0);
      gIn.gain.linearRampToValueAtTime(1, fadeIn);
    }
    if (fadeOut > 0) {
      const s = toolBuffer.duration - fadeOut;
      gOut.gain.setValueAtTime(1, s);
      gOut.gain.linearRampToValueAtTime(0, toolBuffer.duration);
    }
    src.start(0);
    const rendered = await offCtx.startRendering();
    downloadBlob(audioBufferToWavBlob(rendered), 'faded.wav');
    showToast('Fades applied!', 'success');
  }, [toolBuffer, downloadBlob, audioBufferToWavBlob, showToast]);

  const toolNormalize = useCallback(async () => {
    if (!toolBuffer) return;
    const targetDb = parseFloat(normTargetRef.current?.value || '-1');
    const targetAmp = Math.pow(10, targetDb / 20);
    let peak = 0;
    for (let c = 0; c < toolBuffer.numberOfChannels; c++) {
      const d = toolBuffer.getChannelData(c);
      for (let i = 0; i < d.length; i++) if (Math.abs(d[i]) > peak) peak = Math.abs(d[i]);
    }
    if (peak === 0) { showToast('Audio is silent', 'error'); return; }
    const offCtx = new OfflineAudioContext(toolBuffer.numberOfChannels, toolBuffer.length, toolBuffer.sampleRate);
    const src = offCtx.createBufferSource();
    src.buffer = toolBuffer;
    const g = offCtx.createGain();
    g.gain.value = targetAmp / peak;
    src.connect(g);
    g.connect(offCtx.destination);
    src.start(0);
    const rendered = await offCtx.startRendering();
    downloadBlob(audioBufferToWavBlob(rendered), 'normalized.wav');
    showToast(`Normalized to ${targetDb} dBFS`, 'success');
  }, [toolBuffer, downloadBlob, audioBufferToWavBlob, showToast]);

  const toolTrimSilence = useCallback(async () => {
    if (!toolBuffer) return;
    const threshold = parseFloat(silenceThreshRef.current?.value || '0.01');
    const ch0 = toolBuffer.getChannelData(0);
    const sr = toolBuffer.sampleRate;
    let startSample = 0;
    let endSample = ch0.length - 1;
    while (startSample < ch0.length && Math.abs(ch0[startSample]) < threshold) startSample++;
    while (endSample > 0 && Math.abs(ch0[endSample]) < threshold) endSample--;
    if (startSample >= endSample) { showToast('No audio found above threshold', 'error'); return; }
    const newLen = endSample - startSample;
    const offCtx = new OfflineAudioContext(toolBuffer.numberOfChannels, newLen, sr);
    const src = offCtx.createBufferSource();
    src.buffer = toolBuffer;
    src.connect(offCtx.destination);
    src.start(0, startSample / sr, newLen / sr);
    const rendered = await offCtx.startRendering();
    downloadBlob(audioBufferToWavBlob(rendered), 'trimmed.wav');
    showToast('Trimmed silence', 'success');
  }, [toolBuffer, downloadBlob, audioBufferToWavBlob, showToast]);

  const playTonePreview = useCallback(() => {
    if (toneOscRef.current) { try { toneOscRef.current.stop(); } catch (e) { } }
    toneCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = toneCtxRef.current.createOscillator();
    const gain = toneCtxRef.current.createGain();
    osc.type = (toneTypeRef.current?.value || 'sine') as OscillatorType;
    osc.frequency.value = parseFloat(toneFreqRef.current?.value || '440');
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(toneCtxRef.current.destination);
    osc.start();
    toneOscRef.current = osc;
    setTonePlaying(true);
    const dur = parseFloat(toneDurRef.current?.value || '5');
    setTimeout(() => {
      try { toneOscRef.current?.stop(); } catch (e) { }
      toneOscRef.current = null;
      setTonePlaying(false);
    }, dur * 1000);
  }, []);

  const stopTonePreview = useCallback(() => {
    try { toneOscRef.current?.stop(); } catch (e) { }
    toneOscRef.current = null;
    setTonePlaying(false);
  }, []);

  const generateTone = useCallback(async () => {
    const type = (toneTypeRef.current?.value || 'sine') as OscillatorType;
    const freq = parseFloat(toneFreqRef.current?.value || '440');
    const dur = parseFloat(toneDurRef.current?.value || '5');
    const sr = 44100;
    const offCtx = new OfflineAudioContext(1, Math.ceil(dur * sr), sr);
    const osc = offCtx.createOscillator();
    const gain = offCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.8;
    gain.gain.setValueAtTime(0, 0);
    gain.gain.linearRampToValueAtTime(0.8, 0.01);
    gain.gain.setValueAtTime(0.8, dur - 0.01);
    gain.gain.linearRampToValueAtTime(0, dur);
    osc.connect(gain);
    gain.connect(offCtx.destination);
    osc.start(0);
    osc.stop(dur);
    const rendered = await offCtx.startRendering();
    downloadBlob(audioBufferToWavBlob(rendered), `${type}_${freq}hz_${dur}s.wav`);
    showToast('Tone saved!', 'success');
  }, [downloadBlob, audioBufferToWavBlob, showToast]);

  const generateSilence = useCallback(async () => {
    const dur = parseFloat(silenceDurRef.current?.value || '5');
    const sr = parseInt(silenceSRRef.current?.value || '44100');
    const len = Math.ceil(dur * sr);
    const offCtx = new OfflineAudioContext(1, len, sr);
    const buf = offCtx.createBuffer(1, len, sr);
    const src = offCtx.createBufferSource();
    src.buffer = buf;
    src.connect(offCtx.destination);
    src.start(0);
    const rendered = await offCtx.startRendering();
    downloadBlob(audioBufferToWavBlob(rendered), `silence_${dur}s.wav`);
    showToast('Silence generated', 'success');
  }, [downloadBlob, audioBufferToWavBlob, showToast]);

  const generateNoise = useCallback(async () => {
    const type = noiseTypeRef.current?.value || 'white';
    const dur = parseFloat(noiseDurRef.current?.value || '5');
    const sr = 44100;
    const len = Math.ceil(dur * sr);
    const offCtx = new OfflineAudioContext(1, len, sr);
    const buf = offCtx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    if (type === 'white') {
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.96900 * b2 + w * 0.1538520;
        b3 = 0.86650 * b3 + w * 0.3104856;
        b4 = 0.55000 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    } else {
      let last = 0;
      for (let i = 0; i < len; i++) {
        const w = (Math.random() * 2 - 1) * 0.02;
        last = Math.max(-1, Math.min(1, last + w));
        data[i] = last * 3.5;
      }
    }
    const src = offCtx.createBufferSource();
    src.buffer = buf;
    src.connect(offCtx.destination);
    src.start(0);
    const rendered = await offCtx.startRendering();
    downloadBlob(audioBufferToWavBlob(rendered), `${type}_noise_${dur}s.wav`);
    showToast(`${type} noise generated!`, 'success');
  }, [downloadBlob, audioBufferToWavBlob, showToast]);

  const analyzeAudio = useCallback(async (file: File) => {
    try {
      const ab = await file.arrayBuffer();
      const ac = new AudioContext();
      const buf = await ac.decodeAudioData(ab);
      ac.close();
      setAnaBuffer(buf);
      let peak = 0, rmsSum = 0;
      for (let c = 0; c < buf.numberOfChannels; c++) {
        const d = buf.getChannelData(c);
        for (let i = 0; i < d.length; i++) {
          const a = Math.abs(d[i]);
          if (a > peak) peak = a;
          rmsSum += d[i] * d[i];
        }
      }
      const rms = Math.sqrt(rmsSum / (buf.length * buf.numberOfChannels));
      const peakDb = peak > 0 ? 20 * Math.log10(peak) : -Infinity;
      const rmsDb = rms > 0 ? 20 * Math.log10(rms) : -Infinity;
      const data = buf.getChannelData(0);
      const sr = buf.sampleRate;
      const maxSeconds = Math.min(buf.duration, 30);
      const maxSamples = Math.floor(maxSeconds * sr);
      const downFactor = Math.floor(sr / 100);
      const ds = new Float32Array(Math.floor(maxSamples / downFactor));
      for (let i = 0; i < ds.length; i++) ds[i] = data[i * downFactor];
      let bestOff = 0, bestCorr = 0;
      const minOff = Math.floor(ds.length / (240 / 60));
      const maxOff = Math.floor(ds.length / (30 / 60));
      for (let off = minOff; off < maxOff && off < ds.length / 2; off++) {
        let corr = 0;
        for (let i = 0; i < ds.length - off; i++) corr += ds[i] * ds[i + off];
        if (corr > bestCorr) { bestCorr = corr; bestOff = off; }
      }
      const bpm = bestOff > 0 ? Math.max(30, Math.min(240, Math.round(60 / (bestOff * downFactor / sr)))) : 0;
      setAnaData({
        duration: formatTime(buf.duration),
        sampleRate: buf.sampleRate.toLocaleString() + ' Hz',
        channels: buf.numberOfChannels === 1 ? 'Mono' : buf.numberOfChannels === 2 ? 'Stereo' : buf.numberOfChannels + 'ch',
        bitDepth: '32-bit float',
        size: formatSize(file.size),
        peak: peakDb.toFixed(2) + ' dBFS',
        rms: rmsDb.toFixed(2) + ' dBFS',
        bpm: bpm > 0 ? bpm + ' BPM' : 'N/A'
      });
      showToast('Analysis complete!', 'success');
    } catch (err: any) {
      showToast('Error analyzing: ' + (err.message || 'Unknown error'), 'error');
    }
  }, [showToast]);

  const formatOptions = [
    { label: 'MP3', value: 'mp3', desc: 'Instant', icon: <Music size={13} /> },
    { label: 'WAV', value: 'wav', desc: 'Instant', icon: <Waves size={13} /> },
    { label: 'FLAC', value: 'flac', desc: 'Instant', icon: <FileArchive size={13} /> },
    { label: 'AIFF', value: 'aiff', desc: 'Instant', icon: <Speaker size={13} /> },
    { label: 'WAV32', value: 'wav32', desc: 'Instant', icon: <Cpu size={13} /> },
    { label: 'OGG', value: 'ogg', desc: 'Real-time', icon: <Disc size={13} /> },
    { label: 'MP4', value: 'mp4', desc: 'Real-time', icon: <Globe size={13} /> },
    { label: 'Opus', value: 'opus', desc: 'Real-time', icon: <Signal size={13} /> },
    { label: 'M4A', value: 'm4a', desc: 'Real-time', icon: <MonitorPlay size={13} /> },
    { label: 'AAC', value: 'aac', desc: 'Real-time', icon: <Radio size={13} /> },
  ];

  const tabs = [
    { id: 'converter', label: 'Convert', icon: <Settings size={16} /> },
    { id: 'editor', label: 'Edit', icon: <Scissors size={16} /> },
    { id: 'generator', label: 'Generate', icon: <Wand2 size={16} /> },
    { id: 'analyzer', label: 'Analyze', icon: <BarChart3 size={16} /> }
  ];

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js" strategy="afterInteractive" crossOrigin="anonymous" />
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        * { font-family: 'DM Sans', sans-serif; } code, .mono { font-family: 'DM Mono', monospace; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(24px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes barFloat { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
        @keyframes progressShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .anim-fadeUp { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; } .anim-scaleIn { animation: scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-toastIn { animation: toastIn 0.4s cubic-bezier(0.16,1,0.3,1) both; } .anim-slideDown { animation: slideDown 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-breathe { animation: breathe 3s ease-in-out infinite; } .bar-anim { animation: barFloat 1.4s ease-in-out infinite; }
        .progress-animated { background: linear-gradient(90deg, #000 0%, #333 50%, #000 100%); background-size: 200% 100%; animation: progressShimmer 1.5s linear infinite; }
        .dark .progress-animated { background: linear-gradient(90deg, #fff 0%, #999 50%, #fff 100%); background-size: 200% 100%; }
        .stagger-1 { animation-delay: 0.06s; } .stagger-2 { animation-delay: 0.12s; } .stagger-3 { animation-delay: 0.18s; } .stagger-4 { animation-delay: 0.24s; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px; background: #e5e5e5; outline: none; cursor: pointer; }
        .dark input[type=range] { background: #333; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #000; border: 2px solid #fff; box-shadow: 0 0 0 1.5px #000; transition: transform 0.2s; }
        .dark input[type=range]::-webkit-slider-thumb { background: #fff; border: 2px solid #000; box-shadow: 0 0 0 1.5px #fff; }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.25); }
        audio { width: 100%; border-radius: 12px; } audio::-webkit-media-controls-panel { background: #fafafa; border-radius: 12px; }
        ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
        .hover-lift { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease; } .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 30px -12px rgba(0,0,0,0.2); }
        .dark .hover-lift:hover { box-shadow: 0 8px 30px -12px rgba(255,255,255,0.1); }
        .btn-shine { position: relative; overflow: hidden; } .btn-shine::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transition: left 0.6s ease; } .btn-shine:hover::after { left: 120%; }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`anim-toastIn pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl border backdrop-blur-sm ${t.type === 'success' ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : t.type === 'error' ? 'bg-white text-black border-black dark:bg-black dark:text-white dark:border-white' : t.type === 'warning' ? 'bg-white text-black border-black dark:bg-black dark:text-white dark:border-white' : 'bg-white text-neutral-700 border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-700'}`}>
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${t.type === 'success' ? 'bg-white text-black dark:bg-black dark:text-white' : t.type === 'warning' || t.type === 'error' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
              {t.type === 'success' ? <CheckCircle2 size={12} /> : t.type === 'error' ? <XCircle size={12} /> : t.type === 'warning' ? <AlertTriangle size={12} /> : <Info size={12} />}
            </span>
            {t.message}
          </div>
        ))}
      </div>

      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${showFloatingCta && !convLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <button onClick={() => { setActiveTab('converter'); setTimeout(() => fileInputRef.current?.click(), 100); }} className="btn-shine group flex items-center gap-2.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-bold shadow-2xl hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_12px_40px_-8px_rgba(255,255,255,0.2)] active:scale-[0.97]">
          <Upload size={15} className="transition-transform group-hover:-translate-y-0.5" /> Convert Now <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className={`transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <header className="relative overflow-hidden rounded-3xl bg-black dark:bg-white mb-8 px-8 py-16 sm:px-12 sm:py-24">
          <div className="absolute inset-0 flex items-end justify-center gap-[3px] px-6 pb-0 opacity-[0.05] dark:opacity-[0.05] pointer-events-none">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="bar-anim w-[2px] bg-white dark:bg-black rounded-t-sm shrink-0" style={{ height: `${20 + Math.sin(i * 0.35) * 25}%`, animationDelay: `${i * 0.03}s`, animationDuration: `${1.1 + (i % 7) * 0.12}s` }} />
            ))}
          </div>
          <div className="absolute top-6 right-6 z-20">
            <button onClick={toggleDarkMode} className="p-2 rounded-full border border-white/20 dark:border-black/20 hover:bg-white/10 dark:hover:bg-black/10 transition-all">
              {isDark ? <Sun size={18} className="text-black" /> : <Moon size={18} className="text-white" />}
            </button>
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="anim-fadeUp inline-flex items-center gap-2 rounded-full border border-white/10 dark:border-black/10 bg-white/5 dark:bg-black/5 px-4 py-1.5 mb-6 text-[10px] font-bold text-white/50 dark: text-black/60 dark:text-white/60 uppercase tracking-[0.15em]">
              <Lock size={10} /> 100% Browser-Based <span className="w-1 h-1 rounded-full bg-white/20 dark:bg-black/20" /> Free Forever <span className="w-1 h-1 rounded-full bg-white/20 dark:bg-black/20" /> No Upload
            </div>
            <h2 className="anim-fadeUp stagger-1 text-4xl sm:text-6xl font-black text-white dark:text-black leading-[1.02] tracking-[-0.02em]">
              Convert Video<br />to Audio <span className="block text-white/20 dark:text-black/20 mt-1">in seconds.</span>
            </h2>
            <p className="anim-fadeUp stagger-2 mt-6 text-base sm:text-lg text-white/40 dark:text-black/40 max-w-lg leading-relaxed">
              Extract MP3, WAV, FLAC, AIFF from any video. Fast, local processing with visual cropping.
            </p>
            <div className="anim-fadeUp stagger-3 mt-10 flex flex-wrap gap-3">
              <button onClick={() => { setActiveTab('converter'); if (!convLoaded) setTimeout(() => fileInputRef.current?.click(), 100); }} className="btn-shine group flex items-center gap-3 rounded-2xl bg-white dark:bg-black text-black dark:text-white px-7 py-4 text-sm font-bold transition-all hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_40px_-8px_rgba(0,0,0,0.3)] active:scale-[0.97]">
                <Upload size={17} className="transition-transform group-hover:-translate-y-0.5" /> Convert Video to Audio <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={() => setActiveTab('editor')} className="group flex items-center gap-2.5 rounded-2xl border border-white/15 dark:border-black/15 text-white/70 dark:text-black/70 px-7 py-4 text-sm font-semibold transition-all hover:border-white/30 dark:hover:border-black/30 hover:text-white dark:hover:text-black hover:bg-white/5 dark:hover:bg-black/5 active:scale-[0.97]">
                <Scissors size={16} /> Audio Editor
              </button>
            </div>
          </div>
        </header>

        <nav className="mb-6 flex bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-1 gap-1" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-3 text-sm font-semibold transition-all duration-300 ${activeTab === t.id ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-white/50 dark:hover:bg-black/50'}`} role="tab" aria-selected={activeTab === t.id}>
              <span className={`transition-transform duration-200 ${activeTab === t.id ? 'scale-110' : ''}`}>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </nav>

        {activeTab === 'converter' && (
          <div className="space-y-4 anim-fadeUp">
            <div className="rounded-2xl bg-white dark:bg-black border border-neutral-100 dark:border-neutral-800 p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-black dark:text-white shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                <strong className="text-black dark:text-white">Performance Note:</strong> MP3, WAV, AIFF, and FLAC convert instantly faster-than-real-time. OGG, MP4, M4A, Opus rely on browser streaming and take the duration of the audio. Very large videos may exceed browser memory limits.
              </div>
            </div>

            {!convLoaded ? (
              <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }} onClick={() => fileInputRef.current?.click()} className={`relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-500 p-20 text-center ${isDragging ? 'border-black dark:border-white bg-black/5 dark:bg-white/5 scale-[1.005] shadow-[0_0_0_4px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_4px_rgba(255,255,255,0.05)]' : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-black hover:border-neutral-400 dark:hover:border-neutral-500'}`}>
                <div className={`mx-auto mb-6 w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${isDragging ? 'bg-black dark:bg-white text-white dark:text-black scale-110' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'}`}>
                  <FileUp size={36} strokeWidth={1.5} />
                </div>
                <p className={`text-xl font-black transition-colors ${isDragging ? 'text-black dark:text-white' : 'text-neutral-800 dark:text-neutral-200'}`}>{isDragging ? 'Release to convert' : 'Drop your video or audio file'}</p>
                <p className="text-sm text-neutral-400 mt-2">MP4, MOV, MKV, AVI, MP4 and more</p>
                <div className="mt-8 inline-flex items-center gap-2.5 btn-shine bg-black dark:bg-white text-white dark:text-black rounded-2xl px-7 py-3.5 text-sm font-bold hover:shadow-xl">
                  <FileVideo size={16} /> Select File <ArrowRight size={14} />
                </div>
                <p className="text-xs text-neutral-300 dark:text-neutral-600 mt-4 flex items-center justify-center gap-1.5">
                  <Lock size={10} /> Decoded locally in RAM
                </p>
                <input ref={fileInputRef} type="file" accept="video/*,audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>
            ) : (
              <div className="space-y-4 anim-scaleIn">
                <div className="bg-white dark:bg-black rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover-lift">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shrink-0"><FileAudio size={20} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-black dark:text-white truncate">{convFileName}</div>
                      <div className="mono text-xs text-neutral-400 mt-0.5">{convFileMeta}</div>
                    </div>
                    <button onClick={resetConverter} className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-300 dark:text-neutral-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shrink-0"><X size={15} /></button>
                  </div>
                  {mainBuffer && (
                    <WaveformTrimmer buffer={mainBuffer} trimStart={outTrimStart} trimEnd={outTrimEnd} onTrimChange={(start, end) => { setOutTrimStart(start); setOutTrimEnd(end); }} />
                  )}
                </div>

                <div className="bg-white dark:bg-black rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                  <SectionHeader icon={<Settings size={16} />} title="Export Settings" subtitle="Choose format, quality, and options" />
                  <div className="mb-5">
                    <FieldLabel>Output Format</FieldLabel>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                      {formatOptions.map(f => (
                        <button key={f.value} onClick={() => setOutFormat(f.value)} className={`flex flex-col items-center gap-1 rounded-xl p-2 text-center border transition-all duration-300 ${outFormat === f.value ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm scale-[1.02]' : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-500 border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'}`}>
                          <span className={`transition-transform duration-200 ${outFormat === f.value ? 'scale-110' : ''}`}>{f.icon}</span>
                          <span className="text-[10px] font-bold">{f.label}</span>
                          <span className={`text-[8px] font-medium ${outFormat === f.value ? 'text-white/40 dark:text-black/40' : 'text-neutral-300 dark:text-neutral-600'}`}>{f.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <div>
                      <FieldLabel>Format & Codec</FieldLabel>
                      <SelectInput value={outFormat} onChange={(e) => setOutFormat(e.target.value)}>
                        <optgroup label="Instant (Faster than real-time)">
                          <option value="mp3">MP3 — Universal</option>
                          <option value="wav">WAV 16-bit</option>
                          <option value="wav32">WAV 32-bit Float</option>
                          <option value="aiff">AIFF</option>
                          <option value="flac">FLAC</option>
                        </optgroup>
                        <optgroup label="Real-time (Takes duration of audio)">
                          <option value="ogg">OGG Vorbis</option>
                          <option value="mp4">MP4 Opus</option>
                          <option value="opus">Opus</option>
                          <option value="m4a">M4A</option>
                          <option value="aac">AAC</option>
                        </optgroup>
                      </SelectInput>
                    </div>
                    <div>
                      <FieldLabel>Bitrate / Quality</FieldLabel>
                      <SelectInput value={outQuality} onChange={(e) => setOutQuality(e.target.value)}>
                        <option value="320">320 kbps</option>
                        <option value="256">256 kbps</option>
                        <option value="192">192 kbps</option>
                        <option value="128">128 kbps</option>
                        <option value="96">96 kbps</option>
                      </SelectInput>
                    </div>
                  </div>
                  <div className="mb-6">
                    <FieldLabel>Volume: {outVolume}%</FieldLabel>
                    <input type="range" min="0" max="200" value={outVolume} onChange={(e) => setOutVolume(Number(e.target.value))} className="w-full mt-2" />
                    <div className="flex justify-between text-[10px] text-neutral-300 dark:text-neutral-600 font-medium mt-1.5">
                      <span>Mute</span><span>100%</span><span>200%</span>
                    </div>
                  </div>
                  <button onClick={startConversion} disabled={converting} className="btn-shine group relative w-full flex items-center justify-center gap-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black py-4 text-sm font-bold transition-all hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_30px_-8px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden">
                    {converting ? (
                      <><Activity size={16} className="animate-spin" /><span>Processing... {Math.round(progressPct)}%</span></>
                    ) : (
                      <><Sparkles size={16} className="transition-transform group-hover:scale-110 group-hover:rotate-12" /><span>Convert to {outFormat.toUpperCase()}</span><ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></>
                    )}
                  </button>
                </div>

                {converting && (
                  <div className="bg-white dark:bg-black rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 anim-scaleIn">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                        </div>
                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{progressText}</span>
                      </div>
                      <span className="mono text-sm font-bold text-black dark:text-white">{Math.round(progressPct)}%</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="progress-animated h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                )}
                {result && (
                  <div className="bg-black dark:bg-white rounded-2xl p-6 anim-scaleIn relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-black flex items-center justify-center text-black dark:text-white shrink-0 anim-breathe"><CheckCircle2 size={20} /></div>
                        <div>
                          <div className="text-sm font-bold text-white dark:text-black">Conversion Complete</div>
                          <div className="mono text-xs text-white/40 dark:text-black/40 mt-0.5">{result.format.toUpperCase()} · {result.size}</div>
                        </div>
                      </div>
                      <div className="rounded-xl overflow-hidden mb-5 border border-white/10 dark:border-black/10">
                        <audio ref={playerRef} src={result.url} controls />
                      </div>
                      <a href={result.url} download={result.name} className="btn-shine group flex w-full items-center justify-center gap-2.5 rounded-xl bg-white dark:bg-black text-black dark:text-white py-4 text-sm font-bold transition-all hover:shadow-[0_0_30px_-4px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_30px_-4px_rgba(0,0,0,0.3)] active:scale-[0.98]">
                        <ArrowDownToLine size={16} className="transition-transform group-hover:translate-y-0.5" /> Download {result.name}
                      </a>
                      <button onClick={resetConverter} className="mt-3 flex w-full items-center justify-center gap-2 text-white/30 dark:text-black/30 hover:text-white/60 dark:hover: text-black/60 dark:text-white/60 py-2 text-xs font-medium transition-colors">
                        <RefreshCw size={13} /> Convert another file
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="anim-fadeUp">
            <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-black border border-neutral-100 dark:border-neutral-800">
              <Scissors size={14} className="text-neutral-400" />
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">8 professional editing tools. All processing happens locally.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ToolCard icon={<Scissors size={15} />} title="Audio Cutter" subtitle="Trim to exact range" toolKey="cutter" activeTool={activeTool}>
                <FileUploadBtn onFile={(f: any) => loadToolFile(f, 'cutter')} toolName="cutter" activeTool={activeTool} />
                {activeTool === 'cutter' && (
                  <div className="space-y-3 anim-slideDown">
                    <div className="mono text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 rounded-lg px-3 py-2">{toolDuration}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><FieldLabel>Start (s)</FieldLabel><NumberInput ref={cutStartRef} defaultValue={0} step={0.01} min={0} /></div>
                      <div><FieldLabel>End (s)</FieldLabel><NumberInput ref={cutEndRef} defaultValue={5} step={0.01} min={0} /></div>
                    </div>
                    <ActionBtn onClick={toolCut} icon={<Scissors size={13} />} label="Cut & Download" />
                  </div>
                )}
              </ToolCard>
              <ToolCard icon={<Layers size={15} />} title="Audio Merger" subtitle="Join multiple files" toolKey="merger" activeTool={activeTool}>
                <label className="group flex items-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 p-3 text-xs font-semibold text-neutral-400 cursor-pointer hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all mb-3">
                  <Upload size={13} className="transition-transform group-hover:-translate-y-0.5" />Add files
                  <input type="file" accept="audio/*,video/*" multiple className="hidden" onChange={(e) => e.target.files && addMergeFiles(e.target.files)} />
                </label>
                {mergeFiles.length > 0 && (
                  <div className="space-y-1.5 mb-3 max-h-36 overflow-y-auto">
                    {mergeFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg px-2.5 py-2 text-xs anim-slideDown">
                        <Music size={11} className="text-neutral-400 shrink-0" />
                        <span className="flex-1 truncate font-medium text-neutral-700 dark:text-neutral-300">{f.name}</span>
                        <button onClick={() => removeMergeFile(i)} className="text-neutral-300 dark:text-neutral-600 hover:text-black dark:hover:text-white transition-colors p-0.5"><Trash2 size={11} /></button>
                      </div>
                    ))}
                  </div>
                )}
                {mergeFiles.length >= 2 && <ActionBtn onClick={toolMerge} icon={<Layers size={13} />} label={`Merge ${mergeFiles.length} files`} />}
              </ToolCard>
              <ToolCard icon={<FastForward size={15} />} title="Speed Changer" subtitle="0.25x to 4x playback" toolKey="speed" activeTool={activeTool}>
                <FileUploadBtn onFile={(f: any) => loadToolFile(f, 'speed')} toolName="speed" activeTool={activeTool} />
                {activeTool === 'speed' && (
                  <div className="space-y-3 anim-slideDown">
                    <div className="flex items-center justify-between">
                      <FieldLabel>Speed</FieldLabel>
                      <span className="mono text-xs font-bold text-black dark:text-white bg-neutral-100 dark:bg-neutral-800 rounded-lg px-2.5 py-1">{speedVal}x</span>
                    </div>
                    <input ref={speedSliderRef} type="range" min="0.25" max="4" step="0.05" defaultValue="1" onInput={(e) => setSpeedVal(parseFloat((e.target as HTMLInputElement).value).toFixed(2))} className="w-full" />
                    <ActionBtn onClick={toolSpeed} icon={<FastForward size={13} />} label="Apply & Download" />
                  </div>
                )}
              </ToolCard>
              <ToolCard icon={<Sliders size={15} />} title="Pitch Shifter" subtitle="+/- 12 semitones" toolKey="pitch" activeTool={activeTool}>
                <FileUploadBtn onFile={(f: any) => loadToolFile(f, 'pitch')} toolName="pitch" activeTool={activeTool} />
                {activeTool === 'pitch' && (
                  <div className="space-y-3 anim-slideDown">
                    <div className="flex items-center justify-between">
                      <FieldLabel>Semitones</FieldLabel>
                      <span className="mono text-xs font-bold text-black dark:text-white bg-neutral-100 dark:bg-neutral-800 rounded-lg px-2.5 py-1">{parseInt(pitchVal) > 0 ? '+' : ''}{pitchVal} st</span>
                    </div>
                    <input ref={pitchSliderRef} type="range" min="-12" max="12" step="1" defaultValue="0" onInput={(e) => setPitchVal((e.target as HTMLInputElement).value)} className="w-full" />
                    <ActionBtn onClick={toolPitch} icon={<Sliders size={13} />} label="Apply & Download" />
                  </div>
                )}
              </ToolCard>
              <ToolCard icon={<Rewind size={15} />} title="Reverse Audio" subtitle="Flip backwards" toolKey="reverse" activeTool={activeTool}>
                <FileUploadBtn onFile={(f: any) => loadToolFile(f, 'reverse')} toolName="reverse" activeTool={activeTool} />
                {activeTool === 'reverse' && (
                  <div className="anim-slideDown">
                    <ActionBtn onClick={toolReverse} icon={<Rewind size={13} />} label="Reverse & Download" />
                  </div>
                )}
              </ToolCard>
              <ToolCard icon={<Volume1 size={15} />} title="Fade In / Out" subtitle="Smooth envelopes" toolKey="fade" activeTool={activeTool}>
                <FileUploadBtn onFile={(f: any) => loadToolFile(f, 'fade')} toolName="fade" activeTool={activeTool} />
                {activeTool === 'fade' && (
                  <div className="space-y-3 anim-slideDown">
                    <div className="grid grid-cols-2 gap-2">
                      <div><FieldLabel>Fade In (s)</FieldLabel><NumberInput ref={fadeInRef} defaultValue={2} step={0.1} min={0} /></div>
                      <div><FieldLabel>Fade Out (s)</FieldLabel><NumberInput ref={fadeOutRef} defaultValue={2} step={0.1} min={0} /></div>
                    </div>
                    <ActionBtn onClick={toolFade} icon={<Volume1 size={13} />} label="Apply & Download" />
                  </div>
                )}
              </ToolCard>
              <ToolCard icon={<TrendingUp size={15} />} title="Normalize" subtitle="Set peak dBFS target" toolKey="normalize" activeTool={activeTool}>
                <FileUploadBtn onFile={(f: any) => loadToolFile(f, 'normalize')} toolName="normalize" activeTool={activeTool} />
                {activeTool === 'normalize' && (
                  <div className="space-y-3 anim-slideDown">
                    <div><FieldLabel>Target Peak (dBFS)</FieldLabel><NumberInput ref={normTargetRef} defaultValue={-1} step={0.5} max={0} min={-60} /></div>
                    <ActionBtn onClick={toolNormalize} icon={<TrendingUp size={13} />} label="Normalize & Download" />
                  </div>
                )}
              </ToolCard>
              <ToolCard icon={<VolumeX size={15} />} title="Trim Silence" subtitle="Remove quiet edges" toolKey="trim-silence" activeTool={activeTool}>
                <FileUploadBtn onFile={(f: any) => loadToolFile(f, 'trim-silence')} toolName="trim-silence" activeTool={activeTool} />
                {activeTool === 'trim-silence' && (
                  <div className="space-y-3 anim-slideDown">
                    <div><FieldLabel>Silence Threshold (0-1)</FieldLabel><NumberInput ref={silenceThreshRef} defaultValue={0.01} step={0.001} min={0} max={1} /></div>
                    <ActionBtn onClick={toolTrimSilence} icon={<VolumeX size={13} />} label="Trim & Download" />
                  </div>
                )}
              </ToolCard>
            </div>
          </div>
        )}

        {activeTab === 'generator' && (
          <div className="anim-fadeUp">
            <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-black border border-neutral-100 dark:border-neutral-800">
              <Wand2 size={14} className="text-neutral-400" />
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Generate tones, noise, and silence.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white dark:bg-black rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 hover-lift">
                <SectionHeader icon={<Radio size={16} />} title="Tone Generator" subtitle="Sine, square, saw, triangle" />
                <div className="space-y-4">
                  <div><FieldLabel>Wave Type</FieldLabel><SelectInput ref={toneTypeRef}><option value="sine">Sine</option><option value="square">Square</option><option value="sawtooth">Sawtooth</option><option value="triangle">Triangle</option></SelectInput></div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5"><FieldLabel>Frequency</FieldLabel><span className="mono text-xs font-bold text-black dark:text-white bg-neutral-100 dark:bg-neutral-800 rounded-lg px-2.5 py-1">{freqVal} Hz</span></div>
                    <input ref={toneFreqRef} type="range" min="20" max="20000" defaultValue="440" onInput={(e) => setFreqVal(parseFloat((e.target as HTMLInputElement).value).toFixed(0))} className="w-full" />
                  </div>
                  <div><FieldLabel>Duration (s)</FieldLabel><NumberInput ref={toneDurRef} defaultValue={5} min={0.1} max={300} step={0.1} /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <ActionBtn onClick={tonePlaying ? stopTonePreview : playTonePreview} icon={tonePlaying ? <Pause size={13} /> : <Play size={13} />} label={tonePlaying ? 'Stop' : 'Preview'} variant="outline" />
                    <ActionBtn onClick={generateTone} icon={<Download size={13} />} label="Save WAV" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-black rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 hover-lift">
                <SectionHeader icon={<Waves size={16} />} title="Noise Generator" subtitle="White, pink, brown" />
                <div className="space-y-4">
                  <div><FieldLabel>Noise Color</FieldLabel><SelectInput ref={noiseTypeRef}><option value="white">White</option><option value="pink">Pink</option><option value="brown">Brown</option></SelectInput></div>
                  <div><FieldLabel>Duration (s)</FieldLabel><NumberInput ref={noiseDurRef} defaultValue={10} min={0.1} max={300} step={0.1} /></div>
                  <ActionBtn onClick={generateNoise} icon={<Waves size={13} />} label="Generate & Download" />
                </div>
              </div>
              <div className="bg-white dark:bg-black rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 hover-lift">
                <SectionHeader icon={<VolumeX size={16} />} title="Silence Generator" subtitle="Padding & spacers" />
                <div className="space-y-4">
                  <div><FieldLabel>Duration (s)</FieldLabel><NumberInput ref={silenceDurRef} defaultValue={5} min={0.1} max={3600} step={0.1} /></div>
                  <div><FieldLabel>Sample Rate</FieldLabel><SelectInput ref={silenceSRRef}><option value="44100">44,100 Hz</option><option value="48000">48,000 Hz</option><option value="96000">96,000 Hz</option></SelectInput></div>
                  <ActionBtn onClick={generateSilence} icon={<VolumeX size={13} />} label="Generate WAV" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analyzer' && (
          <div className="anim-fadeUp">
            <div className="bg-white dark:bg-black rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6">
              <SectionHeader icon={<BarChart3 size={16} />} title="Audio Analyzer" subtitle="Peak, RMS, BPM, waveform, spectrum" />
              <label className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 p-12 text-center cursor-pointer hover:border-black dark:hover:border-white hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-all mb-6">
                <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black transition-transform group-hover:scale-110"><Upload size={26} strokeWidth={1.5} /></div>
                <div><div className="text-sm font-bold text-black dark:text-white">Drop audio file to analyze</div><div className="text-xs text-neutral-400 mt-1">Analyzing very long files may take a moment</div></div>
                <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && analyzeAudio(e.target.files[0])} />
              </label>
              {anaData && (
                <div className="space-y-5 anim-scaleIn">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Duration', val: anaData.duration, icon: <Clock size={13} /> },
                      { label: 'Sample Rate', val: anaData.sampleRate, icon: <Gauge size={13} /> },
                      { label: 'Channels', val: anaData.channels, icon: <AudioLines size={13} /> },
                      { label: 'Bit Depth', val: anaData.bitDepth, icon: <HardDrive size={13} /> },
                      { label: 'File Size', val: anaData.size, icon: <Download size={13} /> },
                      { label: 'Peak', val: anaData.peak, icon: <TrendingUp size={13} /> },
                      { label: 'RMS Level', val: anaData.rms, icon: <Activity size={13} /> },
                      { label: 'Est. BPM', val: anaData.bpm, icon: <Zap size={13} />, invert: true },
                    ].map((s, i) => (
                      <div key={i} className={`rounded-xl p-3.5 transition-all hover:scale-[1.02] ${s.invert ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                        <div className={`flex items-center gap-1.5 mb-2 ${s.invert ? 'text-white/40 dark:text-black/40' : 'text-neutral-400'}`}>
                          {s.icon}<span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
                        </div>
                        <div className={`mono text-sm font-bold ${s.invert ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <section className="mt-10 rounded-3xl border-2 border-black dark:border-white bg-white dark:bg-black p-10 sm:p-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black mx-auto mb-6 anim-breathe"><FileAudio size={30} strokeWidth={1.5} /></div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.03em] text-black dark:text-white">Ready to convert?</h2>
            <p className="text-base text-neutral-400 dark:text-neutral-500 mt-4 max-w-md mx-auto leading-relaxed">Free, private, instant. The fastest video-to-audio converter running entirely in your browser.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => { setActiveTab('converter'); if (!convLoaded) setTimeout(() => fileInputRef.current?.click(), 100); }} className="btn-shine group flex items-center gap-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black px-8 py-4 text-sm font-bold transition-all hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_8px_30px_-8px_rgba(255,255,255,0.2)] hover:scale-[1.03] active:scale-[0.97]">
                <Upload size={17} className="transition-transform group-hover:-translate-y-0.5" /> Start Converting — It's Free <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={() => setActiveTab('editor')} className="group flex items-center gap-2.5 rounded-2xl border-2 border-black dark:border-white text-black dark:text-white px-8 py-4 text-sm font-bold transition-all hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black active:scale-[0.97]">
                <Scissors size={16} /> Open Audio Editor
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-neutral-100 dark:border-neutral-800 pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black"><FileAudio size={16} /></div>
              <div><span className="text-sm font-black text-black dark:text-white">AudioForge Pro</span><p className="text-[10px] text-neutral-400 font-medium">Free Video to Audio Converter</p></div>
            </div>
            <button onClick={toggleDarkMode} className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
              {isDark ? <Sun size={18} className="text-white" /> : <Moon size={18} className="text-black" />}
            </button>
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed max-w-2xl">Converts video to audio entirely in your browser. MP4, MP4, MOV to MP3, WAV, FLAC. No servers. No accounts. No limits.</p>
        </footer>
      </div>
    </>
  );
}
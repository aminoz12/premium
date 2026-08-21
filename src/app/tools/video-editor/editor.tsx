import { useRef, useState, useCallback, useEffect } from "react";
import { useLocation } from "./router";
import {
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  Plus, Trash2, ChevronLeft, Type, Bold, Italic, AlignLeft,
  AlignCenter, AlignRight, Maximize2, Minimize2,
} from "lucide-react";

type FontSize = 16 | 20 | 24 | 32 | 40 | 48 | 64;
type Align = "left" | "center" | "right";

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: FontSize;
  color: string;
  bold: boolean;
  italic: boolean;
  align: Align;
  startTime: number;
  endTime: number;
}

const FONT_SIZES: FontSize[] = [16, 20, 24, 32, 40, 48, 64];
const COLORS = [
  "#ffffff", "#f8fafc", "#fbbf24", "#f87171",
  "#34d399", "#60a5fa", "#c084fc", "#fb923c",
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function EditorPage() {
  const [, navigate] = useLocation();

  // Video source from session storage
  const videoSrc = sessionStorage.getItem("ve_src") || "";
  const videoName = sessionStorage.getItem("ve_name") || "Untitled";

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Playback state
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Text layers
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Dragging — using a ref so the mousemove closure always has the latest value
  const dragging = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);

  // Editing text inline
  const [editingId, setEditingId] = useState<string | null>(null);

  // Selected layer shortcut
  const selectedLayer = textLayers.find((l) => l.id === selectedId) ?? null;

  // ------------------------------------------------------------------
  // Video events
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!videoSrc) { navigate("/"); return; }
  }, [videoSrc, navigate]);

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (v) setCurrentTime(v.currentTime);
  };

  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (v) {
      setDuration(v.duration);
      setVideoReady(true);
    }
  };

  const onEnded = () => setPlaying(false);

  // ------------------------------------------------------------------
  // Playback controls
  // ------------------------------------------------------------------
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const seek = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = val;
    setCurrentTime(val);
  };

  const skip = (delta: number) => seek(Math.max(0, Math.min(duration, currentTime + delta)));

  const changeVolume = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setFullscreen(false));
    }
  };

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ------------------------------------------------------------------
  // Text layer management
  // ------------------------------------------------------------------
  const addLayer = () => {
    const id = genId();
    const layer: TextLayer = {
      id,
      text: "New Text",
      x: 10,
      y: 10,
      fontSize: 32,
      color: "#ffffff",
      bold: false,
      italic: false,
      align: "left",
      startTime: 0,
      endTime: duration || 10,
    };
    setTextLayers((p) => [...p, layer]);
    setSelectedId(id);
  };

  const deleteLayer = (id: string) => {
    setTextLayers((p) => p.filter((l) => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateLayer = (id: string, patch: Partial<TextLayer>) => {
    setTextLayers((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  // ------------------------------------------------------------------
  // Drag logic — the key fix: snapshot dragging.current before setState
  // ------------------------------------------------------------------
  const onMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    const layer = textLayers.find((l) => l.id === id);
    if (!layer) return;
    dragging.current = { id, sx: e.clientX, sy: e.clientY, ox: layer.x, oy: layer.y };
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    const d = dragging.current;
    if (!d) return;
    const el = containerRef.current?.querySelector(".video-overlay") as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = ((e.clientX - d.sx) / rect.width) * 100;
    const dy = ((e.clientY - d.sy) / rect.height) * 100;
    const newX = Math.max(0, Math.min(95, d.ox + dx));
    const newY = Math.max(0, Math.min(95, d.oy + dy));
    // Snapshot id before the async setState callback
    const layerId = d.id;
    setTextLayers((p) =>
      p.map((t) => (t.id === layerId ? { ...t, x: newX, y: newY } : t))
    );
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // ------------------------------------------------------------------
  // Visible layers at current time
  // ------------------------------------------------------------------
  const visibleLayers = textLayers.filter(
    (l) => currentTime >= l.startTime && currentTime <= l.endTime
  );

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "hsl(220 16% 8%)", color: "hsl(220 10% 90%)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
        style={{ background: "hsl(220 16% 10%)", borderColor: "hsl(220 14% 18%)" }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: "hsl(220 10% 55%)" }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="w-px h-4 mx-1" style={{ background: "hsl(220 14% 22%)" }} />
        <span className="text-sm font-medium truncate max-w-xs" style={{ color: "hsl(220 10% 80%)" }}>
          {videoName}
        </span>
        <div className="flex-1" />
        <button
          onClick={addLayer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ background: "hsl(262 83% 68%)", color: "#fff" }}
        >
          <Plus className="w-4 h-4" />
          Add Text
        </button>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video + timeline */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Video player */}
          <div
            ref={containerRef}
            className="relative flex-1 flex items-center justify-center overflow-hidden"
            style={{ background: "#000" }}
            onClick={() => setSelectedId(null)}
          >
            {/* Actual video */}
            <video
              ref={videoRef}
              src={videoSrc}
              className="max-h-full max-w-full object-contain"
              style={{ display: "block" }}
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
              onEnded={onEnded}
              crossOrigin="anonymous"
              playsInline
            />

            {/* Text overlay — positioned absolutely over the video */}
            {videoReady && (
              <div
                className="video-overlay absolute inset-0 pointer-events-none"
                style={{ zIndex: 10 }}
              >
                {visibleLayers.map((layer) => (
                  <div
                    key={layer.id}
                    onMouseDown={(e) => {
                      if (editingId === layer.id) return;
                      onMouseDown(e, layer.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingId(layer.id);
                      setSelectedId(layer.id);
                    }}
                    style={{
                      position: "absolute",
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      fontSize: layer.fontSize,
                      color: layer.color,
                      fontWeight: layer.bold ? "bold" : "normal",
                      fontStyle: layer.italic ? "italic" : "normal",
                      textAlign: layer.align,
                      cursor: dragging.current?.id === layer.id ? "grabbing" : "grab",
                      userSelect: "none",
                      pointerEvents: "all",
                      outline:
                        selectedId === layer.id
                          ? "2px dashed hsl(262 83% 68%)"
                          : "none",
                      outlineOffset: "4px",
                      borderRadius: "2px",
                      padding: "2px 4px",
                      textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                      whiteSpace: "pre-wrap",
                      maxWidth: "80%",
                    }}
                  >
                    {editingId === layer.id ? (
                      <textarea
                        autoFocus
                        value={layer.text}
                        onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                        onBlur={() => setEditingId(null)}
                        onMouseDown={(e) => e.stopPropagation()}
                        rows={2}
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          color: layer.color,
                          fontSize: layer.fontSize,
                          fontWeight: layer.bold ? "bold" : "normal",
                          fontStyle: layer.italic ? "italic" : "normal",
                          textAlign: layer.align,
                          border: "1px solid hsl(262 83% 68%)",
                          borderRadius: "4px",
                          padding: "4px 6px",
                          outline: "none",
                          resize: "both",
                          minWidth: "120px",
                        }}
                      />
                    ) : (
                      layer.text
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Loading state */}
            {!videoReady && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#000" }}>
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "hsl(262 83% 68%)", borderTopColor: "transparent" }}
                  />
                  <p className="text-xs" style={{ color: "hsl(220 10% 50%)" }}>
                    Loading video…
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div
            className="px-4 py-3 space-y-2 shrink-0"
            style={{ background: "hsl(220 16% 10%)", borderTop: "1px solid hsl(220 14% 18%)" }}
          >
            {/* Seek bar */}
            <div className="flex items-center gap-2 text-xs" style={{ color: "hsl(220 10% 52%)" }}>
              <span className="w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="flex-1 accent-purple-400 cursor-pointer"
                style={{ accentColor: "hsl(262 83% 68%)" }}
              />
              <span className="w-10 tabular-nums">{formatTime(duration)}</span>
            </div>

            {/* Buttons row */}
            <div className="flex items-center gap-2">
              <button onClick={() => skip(-10)} title="Back 10s" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={togglePlay}
                className="p-2 rounded-lg font-semibold transition-all hover:opacity-90 active:scale-95"
                style={{ background: "hsl(262 83% 68%)", color: "#fff" }}
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={() => skip(10)} title="Forward 10s" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>

              <div className="flex-1" />

              {/* Volume */}
              <button onClick={toggleMute} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="w-20 cursor-pointer"
                style={{ accentColor: "hsl(262 83% 68%)" }}
              />

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar — text layer editor */}
        <div
          className="w-72 shrink-0 flex flex-col border-l overflow-y-auto"
          style={{
            background: "hsl(220 16% 11%)",
            borderColor: "hsl(220 14% 18%)",
          }}
        >
          {/* Layers list */}
          <div className="p-4 border-b" style={{ borderColor: "hsl(220 14% 18%)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(220 10% 45%)" }}>
                Text Layers
              </span>
              <button
                onClick={addLayer}
                className="p-1 rounded hover:bg-white/5 transition-colors"
                title="Add text layer"
              >
                <Plus className="w-4 h-4" style={{ color: "hsl(262 83% 68%)" }} />
              </button>
            </div>

            {textLayers.length === 0 ? (
              <div
                className="text-center py-6 rounded-lg border border-dashed"
                style={{ borderColor: "hsl(220 14% 22%)", color: "hsl(220 10% 40%)" }}
              >
                <Type className="w-6 h-6 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No text layers yet.</p>
                <p className="text-xs mt-0.5">Click "Add Text" to start.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {textLayers.map((layer) => (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedId(layer.id)}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background:
                        selectedId === layer.id
                          ? "hsl(262 40% 20%)"
                          : "hsl(220 14% 16%)",
                      border:
                        selectedId === layer.id
                          ? "1px solid hsl(262 83% 55%)"
                          : "1px solid transparent",
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: layer.color, border: "1px solid rgba(255,255,255,0.2)" }}
                    />
                    <span className="flex-1 truncate text-sm" style={{ color: "hsl(220 10% 82%)" }}>
                      {layer.text || "(empty)"}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                      className="p-0.5 rounded hover:bg-red-500/20 transition-colors opacity-50 hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: "hsl(0 70% 65%)" }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Layer properties */}
          {selectedLayer ? (
            <div className="p-4 space-y-5 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(220 10% 45%)" }}>
                Properties
              </p>

              {/* Text content */}
              <div className="space-y-1.5">
                <label className="text-xs" style={{ color: "hsl(220 10% 55%)" }}>Text</label>
                <textarea
                  value={selectedLayer.text}
                  onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none"
                  style={{
                    background: "hsl(220 14% 15%)",
                    border: "1px solid hsl(220 14% 22%)",
                    color: "hsl(220 10% 88%)",
                  }}
                />
              </div>

              {/* Font size */}
              <div className="space-y-1.5">
                <label className="text-xs" style={{ color: "hsl(220 10% 55%)" }}>
                  Font Size: {selectedLayer.fontSize}px
                </label>
                <div className="flex gap-1 flex-wrap">
                  {FONT_SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateLayer(selectedLayer.id, { fontSize: s })}
                      className="px-2 py-1 rounded text-xs font-semibold transition-all"
                      style={{
                        background:
                          selectedLayer.fontSize === s
                            ? "hsl(262 83% 68%)"
                            : "hsl(220 14% 18%)",
                        color:
                          selectedLayer.fontSize === s
                            ? "#fff"
                            : "hsl(220 10% 65%)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style toggles */}
              <div className="space-y-1.5">
                <label className="text-xs" style={{ color: "hsl(220 10% 55%)" }}>Style</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateLayer(selectedLayer.id, { bold: !selectedLayer.bold })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                    style={{
                      background: selectedLayer.bold ? "hsl(262 83% 68%)" : "hsl(220 14% 18%)",
                      color: selectedLayer.bold ? "#fff" : "hsl(220 10% 65%)",
                    }}
                  >
                    <Bold className="w-3.5 h-3.5" /> Bold
                  </button>
                  <button
                    onClick={() => updateLayer(selectedLayer.id, { italic: !selectedLayer.italic })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm italic transition-all"
                    style={{
                      background: selectedLayer.italic ? "hsl(262 83% 68%)" : "hsl(220 14% 18%)",
                      color: selectedLayer.italic ? "#fff" : "hsl(220 10% 65%)",
                    }}
                  >
                    <Italic className="w-3.5 h-3.5" /> Italic
                  </button>
                </div>
              </div>

              {/* Text align */}
              <div className="space-y-1.5">
                <label className="text-xs" style={{ color: "hsl(220 10% 55%)" }}>Alignment</label>
                <div className="flex gap-2">
                  {(["left", "center", "right"] as Align[]).map((a) => {
                    const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
                    return (
                      <button
                        key={a}
                        onClick={() => updateLayer(selectedLayer.id, { align: a })}
                        className="p-2 rounded-lg transition-all"
                        style={{
                          background: selectedLayer.align === a ? "hsl(262 83% 68%)" : "hsl(220 14% 18%)",
                          color: selectedLayer.align === a ? "#fff" : "hsl(220 10% 65%)",
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color picker */}
              <div className="space-y-1.5">
                <label className="text-xs" style={{ color: "hsl(220 10% 55%)" }}>Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateLayer(selectedLayer.id, { color: c })}
                      className="w-7 h-7 rounded-full transition-all"
                      style={{
                        background: c,
                        outline: selectedLayer.color === c ? "2px solid hsl(262 83% 68%)" : "none",
                        outlineOffset: "2px",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                      title={c}
                    />
                  ))}
                  <input
                    type="color"
                    value={selectedLayer.color}
                    onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
                    className="w-7 h-7 rounded-full cursor-pointer border-0 p-0"
                    style={{ background: "none" }}
                    title="Custom color"
                  />
                </div>
              </div>

              {/* Time range */}
              <div className="space-y-1.5">
                <label className="text-xs" style={{ color: "hsl(220 10% 55%)" }}>
                  Visible: {formatTime(selectedLayer.startTime)} — {formatTime(selectedLayer.endTime)}
                </label>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "hsl(220 10% 40%)" }}>Start</p>
                    <input
                      type="range"
                      min={0}
                      max={duration || 1}
                      step={0.1}
                      value={selectedLayer.startTime}
                      onChange={(e) =>
                        updateLayer(selectedLayer.id, {
                          startTime: Math.min(Number(e.target.value), selectedLayer.endTime - 0.1),
                        })
                      }
                      className="w-full cursor-pointer"
                      style={{ accentColor: "hsl(262 83% 68%)" }}
                    />
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "hsl(220 10% 40%)" }}>End</p>
                    <input
                      type="range"
                      min={0}
                      max={duration || 1}
                      step={0.1}
                      value={selectedLayer.endTime}
                      onChange={(e) =>
                        updateLayer(selectedLayer.id, {
                          endTime: Math.max(Number(e.target.value), selectedLayer.startTime + 0.1),
                        })
                      }
                      className="w-full cursor-pointer"
                      style={{ accentColor: "hsl(262 83% 68%)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Position display */}
              <div className="space-y-1.5">
                <label className="text-xs" style={{ color: "hsl(220 10% 55%)" }}>
                  Position (drag text on video to move)
                </label>
                <div className="flex gap-2">
                  <div
                    className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs tabular-nums"
                    style={{ background: "hsl(220 14% 15%)", color: "hsl(220 10% 55%)" }}
                  >
                    X: {selectedLayer.x.toFixed(1)}%
                  </div>
                  <div
                    className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs tabular-nums"
                    style={{ background: "hsl(220 14% 15%)", color: "hsl(220 10% 55%)" }}
                  >
                    Y: {selectedLayer.y.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteLayer(selectedLayer.id)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
                style={{ background: "hsl(0 60% 22%)", color: "hsl(0 70% 70%)" }}
              >
                <Trash2 className="w-4 h-4" />
                Delete Layer
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-2">
              <Type className="w-8 h-8 opacity-20" />
              <p className="text-sm" style={{ color: "hsl(220 10% 40%)" }}>
                Select a layer to edit its properties, or add a new text layer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

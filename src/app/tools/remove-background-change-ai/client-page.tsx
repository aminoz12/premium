"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Head from "next/head";

// ─── SEO DATA ────────────────────────────────────────────────────────────────

export const FAQ_ITEMS = [
  {
    question: "How does the AI background removal tool work?",
    answer:
      "Our tool uses three client-side algorithms — Color Pick (global color similarity), Flood Fill (BFS from image edges), and Edge Detect (Sobel-based edge preservation) — to build a pixel mask, optionally grow and feather it, then zero the alpha channel on matched pixels. All processing is done in your browser via the Canvas API; no image data is uploaded to any server.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "PNG, JPEG, WEBP, and any other format natively decoded by your browser's Canvas API. The output is always a transparent-background PNG to preserve alpha.",
  },
  {
    question: "Is my image data kept private?",
    answer:
      "Yes — 100%. Processing happens entirely in-browser using the HTML5 Canvas API. Your image never leaves your device and is never sent to our servers.",
  },
  {
    question: "What is the difference between the three removal modes?",
    answer:
      "Color Pick removes every pixel globally matching the target color within the tolerance range. Flood Fill performs a BFS from image corners and edges, only removing connected regions of matching color — ideal for solid, uninterrupted backgrounds. Edge Detect combines global color removal with Sobel edge detection to protect fine detail like hair or fur along object boundaries.",
  },
  {
    question: "How do Feather and Grow controls affect the result?",
    answer:
      "Grow expands the removal mask by N pixels before applying alpha, which helps close small gaps. Feather applies a Gaussian blur to the alpha channel, softening the mask edge for a more natural look. Use both together for the smoothest cutouts.",
  },
];

export const QUICK_ANSWER = {
  question: "How do I remove a background from an image for free?",
  answer:
    "Upload your image, pick the background color with the color picker (auto-sampled from the top-left corner), choose a removal mode (Color Pick for uniform backgrounds, Flood Fill for edge-connected fills, Edge Detect for detailed subjects), adjust tolerance and feather, then click Remove Background. Download the transparent PNG instantly — no signup required.",
};

export const WHO_USES = [
  {
    icon: "🛍️",
    title: "E-commerce Sellers",
    desc: "Create clean product photos on white or transparent backgrounds for marketplaces like Amazon, Shopify, and Etsy.",
  },
  {
    icon: "🎨",
    title: "Graphic Designers",
    desc: "Quickly cut out subjects for compositing, mockups, or layered poster designs without leaving the browser.",
  },
  {
    icon: "📸",
    title: "Photographers",
    desc: "Strip studio backdrops from portrait sessions or swap backgrounds for client deliverables in seconds.",
  },
  {
    icon: "💼",
    title: "Social Media Managers",
    desc: "Produce transparent-background logos and headshots for branded content across every platform.",
  },
];

function buildJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "AI Background Remover — TheFreeAITools",
      url: "https://www.thefreeaitools.com/tools/remove-background-and-change-ai",
      description:
        "Free browser-based AI background removal tool. Supports Color Pick, Flood Fill, and Edge Detect modes with feathering and mask grow controls. No upload required.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Color-based background removal",
        "Flood fill from edges",
        "Sobel edge-preserving mode",
        "Gaussian feathering",
        "Mask dilation (grow)",
        "PNG export",
        "Clipboard copy",
        "100% client-side — no upload",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.thefreeaitools.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tools",
          item: "https://www.thefreeaitools.com/tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Remove Background",
          item: "https://www.thefreeaitools.com/tools/remove-background-and-change-ai",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Remove a Background from an Image",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Upload image",
          text: "Drag and drop or click to browse your PNG, JPG, or WEBP file.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Set target color",
          text: "The color picker is auto-seeded from your image's top-left pixel. Adjust if needed.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Choose removal mode",
          text: "Color Pick for solid backgrounds, Flood Fill for connected fills, Edge Detect for detailed subjects.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Adjust tolerance and refine",
          text: "Raise tolerance to catch more shades. Use Grow and Feather for smooth edges.",
        },
        {
          "@type": "HowToStep",
          position: 5,
          name: "Download or copy",
          text: "Export as transparent PNG or copy directly to clipboard.",
        },
      ],
    },
  ];
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const RemoveBackgroundPage: React.FC = () => {
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorPickRef = useRef<HTMLInputElement>(null);
  const toleranceRef = useRef<HTMLInputElement>(null);
  const featherRef = useRef<HTMLInputElement>(null);
  const growRef = useRef<HTMLInputElement>(null);
  const btnRemoveRef = useRef<HTMLButtonElement>(null);
  const btnResetRef = useRef<HTMLButtonElement>(null);
  const btnDownloadRef = useRef<HTMLButtonElement>(null);
  const btnCopyRef = useRef<HTMLButtonElement>(null);
  const workCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [tolerance, setTolerance] = useState(30);
  const [feather, setFeather] = useState(2);
  const [grow, setGrow] = useState(0);
  const [mode, setMode] = useState<"color" | "flood" | "edge">("color");
  const [status, setStatus] = useState<{ msg: string; type: "idle" | "ok" | "err" | "loading" }>({ msg: "Upload an image to get started.", type: "idle" });
  const [hasImage, setHasImage] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);

  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ─── Algorithms ──────────────────────────────────────────────────────────

  const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) =>
    Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);

  const hexToRgb = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  });

  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  function floodFill(data: Uint8ClampedArray, mask: Uint8Array, W: number, H: number, tol: number, target: { r: number; g: number; b: number }) {
    const visited = new Uint8Array(W * H);
    const queue: number[] = [];
    const seeds: [number, number][] = [
      [0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1],
      [Math.floor(W / 2), 0], [0, Math.floor(H / 2)],
      [W - 1, Math.floor(H / 2)], [Math.floor(W / 2), H - 1],
    ];
    for (const [sx, sy] of seeds) {
      const si = sy * W + sx;
      if (!visited[si]) { visited[si] = 1; queue.push(si); }
    }
    while (queue.length) {
      const idx = queue.pop()!;
      const r = data[idx * 4], g = data[idx * 4 + 1], b = data[idx * 4 + 2];
      if (colorDistance(r, g, b, target.r, target.g, target.b) > tol) continue;
      mask[idx] = 255;
      const x = idx % W, y = Math.floor(idx / W);
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
        const ni = ny * W + nx;
        if (!visited[ni]) { visited[ni] = 1; queue.push(ni); }
      }
    }
  }

  function sobelEdges(data: Uint8ClampedArray, W: number, H: number) {
    const gray = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++)
      gray[i] = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) / 255;
    const edges = new Float32Array(W * H);
    for (let y = 1; y < H - 1; y++)
      for (let x = 1; x < W - 1; x++) {
        const gx = -gray[(y - 1) * W + (x - 1)] + gray[(y - 1) * W + (x + 1)] - 2 * gray[y * W + (x - 1)] + 2 * gray[y * W + (x + 1)] - gray[(y + 1) * W + (x - 1)] + gray[(y + 1) * W + (x + 1)];
        const gy = -gray[(y - 1) * W + (x - 1)] - 2 * gray[(y - 1) * W + x] - gray[(y - 1) * W + (x + 1)] + gray[(y + 1) * W + (x - 1)] + 2 * gray[(y + 1) * W + x] + gray[(y + 1) * W + (x + 1)];
        edges[y * W + x] = Math.sqrt(gx * gx + gy * gy) * 255;
      }
    return edges;
  }

  function dilate(mask: Uint8Array, W: number, H: number, r: number) {
    const out = new Uint8Array(W * H);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        if (mask[y * W + x] === 0) continue;
        for (let dy = -r; dy <= r; dy++)
          for (let dx = -r; dx <= r; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < W && ny >= 0 && ny < H) out[ny * W + nx] = 255;
          }
      }
    return out;
  }

  function gaussianBlurAlpha(alpha: Float32Array, W: number, H: number, radius: number) {
    const sigma = radius / 2;
    const kernel: number[] = [];
    for (let i = -radius; i <= radius; i++) kernel.push(Math.exp(-(i * i) / (2 * sigma * sigma)));
    const tmp = new Float32Array(W * H);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let sum = 0, wsum = 0;
        for (let k = -radius; k <= radius; k++) {
          const nx = x + k;
          if (nx >= 0 && nx < W) { const w = kernel[k + radius]; sum += alpha[y * W + nx] * w; wsum += w; }
        }
        tmp[y * W + x] = sum / wsum;
      }
    const out = new Float32Array(W * H);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let sum = 0, wsum = 0;
        for (let k = -radius; k <= radius; k++) {
          const ny = y + k;
          if (ny >= 0 && ny < H) { const w = kernel[k + radius]; sum += tmp[ny * W + x] * w; wsum += w; }
        }
        out[y * W + x] = sum / wsum;
      }
    return out;
  }

  // ─── File loading ─────────────────────────────────────────────────────────

  const loadFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        setPreviewSrc(img.src);
        setHasImage(true);
        setHasResult(false);
        setResultDataUrl(null);
        resultCanvasRef.current = null;
        setStatus({ msg: `Loaded: ${img.width} × ${img.height}px`, type: "ok" });

        // Auto-sample top-left corner
        const wc = workCanvasRef.current!;
        wc.width = img.width;
        wc.height = img.height;
        const ctx = wc.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0);
        const px = ctx.getImageData(0, 0, 1, 1).data;
        if (colorPickRef.current) colorPickRef.current.value = rgbToHex(px[0], px[1], px[2]);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  // ─── Remove background ────────────────────────────────────────────────────

  const handleRemove = useCallback(async () => {
    const img = originalImageRef.current;
    if (!img) return;

    setHasResult(false);
    setProgress(0);
    setProgressMsg("Preparing image…");
    setStatus({ msg: "Processing…", type: "loading" });

    await sleep(20);

    const wc = workCanvasRef.current!;
    wc.width = img.width;
    wc.height = img.height;
    const ctx = wc.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, wc.width, wc.height);
    const data = imageData.data;
    const W = wc.width, H = wc.height;
    const tol = tolerance;
    const featherVal = feather;
    const growVal = grow;
    const targetColor = hexToRgb(colorPickRef.current?.value ?? "#ffffff");
    const mask = new Uint8Array(W * H);

    setProgress(10); setProgressMsg("Building mask…");
    await sleep(10);

    if (mode === "color") {
      for (let i = 0; i < W * H; i++) {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
        if (colorDistance(r, g, b, targetColor.r, targetColor.g, targetColor.b) <= tol) mask[i] = 255;
      }
    } else if (mode === "flood") {
      floodFill(data, mask, W, H, tol, targetColor);
    } else {
      for (let i = 0; i < W * H; i++) {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
        if (colorDistance(r, g, b, targetColor.r, targetColor.g, targetColor.b) <= tol) mask[i] = 255;
      }
      const edges = sobelEdges(data, W, H);
      for (let i = 0; i < W * H; i++) { if (edges[i] > 40) mask[i] = 0; }
    }

    setProgress(40); setProgressMsg("Growing mask…");
    await sleep(10);

    let finalMask = mask;
    if (growVal > 0) finalMask = dilate(finalMask, W, H, growVal);

    setProgress(60); setProgressMsg("Feathering edges…");
    await sleep(10);

    const alpha = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) alpha[i] = finalMask[i] / 255;

    if (featherVal > 0) {
      const blurred = gaussianBlurAlpha(alpha, W, H, featherVal);
      for (let i = 0; i < W * H; i++) alpha[i] = blurred[i];
    }

    setProgress(80); setProgressMsg("Applying transparency…");
    await sleep(10);

    for (let i = 0; i < W * H; i++) {
      data[i * 4 + 3] = Math.round((1 - alpha[i]) * data[i * 4 + 3]);
    }
    ctx.putImageData(imageData, 0, 0);

    setProgress(95); setProgressMsg("Rendering output…");
    await sleep(10);

    const rc = document.createElement("canvas");
    rc.width = W; rc.height = H;
    rc.getContext("2d")!.drawImage(wc, 0, 0);
    resultCanvasRef.current = rc;

    setResultDataUrl(rc.toDataURL("image/png"));
    setProgress(100);
    setHasResult(true);
    setStatus({ msg: `Done — ${W}×${H}px. Transparent background applied.`, type: "ok" });
    setTimeout(() => setProgress(0), 600);
  }, [mode, tolerance, feather, grow]);

  const handleReset = useCallback(() => {
    if (!originalImageRef.current) return;
    resultCanvasRef.current = null;
    setResultDataUrl(null);
    setHasResult(false);
    setStatus({ msg: "Reset. Ready to process.", type: "idle" });
  }, []);

  const handleDownload = useCallback(() => {
    const rc = resultCanvasRef.current;
    if (!rc) return;
    const a = document.createElement("a");
    a.href = rc.toDataURL("image/png");
    a.download = "bg-removed.png";
    a.click();
  }, []);

  const handleCopy = useCallback(async () => {
    const rc = resultCanvasRef.current;
    if (!rc) return;
    try {
      rc.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setStatus({ msg: "Copied to clipboard!", type: "ok" });
      });
    } catch {
      setStatus({ msg: "Clipboard API not supported in this browser.", type: "err" });
    }
  }, []);

  // ─── Drag & drop ─────────────────────────────────────────────────────────

  useEffect(() => {
    const dz = dropZoneRef.current!;
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files[0];
      if (file && file.type.startsWith("image/")) loadFile(file);
    };
    const onOver = (e: DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onLeave = () => setIsDragging(false);
    dz.addEventListener("dragover", onOver);
    dz.addEventListener("dragleave", onLeave);
    dz.addEventListener("drop", onDrop);
    return () => {
      dz.removeEventListener("dragover", onOver);
      dz.removeEventListener("dragleave", onLeave);
      dz.removeEventListener("drop", onDrop);
    };
  }, [loadFile]);


  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <Head>
        <title>Free AI Background Remover — Remove Background Online | TheFreeAITools</title>
        <meta name="description" content="Remove image backgrounds instantly with our free AI-powered tool. No signup, no upload — 100% browser-based. Supports Color Pick, Flood Fill, and Edge Detect modes with feathering. Export transparent PNG." />
        <meta name="keywords" content="remove background from image free, background remover online, transparent background maker, AI background removal, remove background PNG, background eraser, free background remover tool, no signup background remover, browser background removal, remove white background, image background changer, cutout image online" />
        <meta name="author" content="TheFreeAITools" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="bingbot" content="index,follow" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="3 days" />
        <link rel="canonical" href="https://www.thefreeaitools.com/tools/remove-background-and-change-ai" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.thefreeaitools.com/tools/remove-background-and-change-ai" />
        <meta property="og:title" content="Free AI Background Remover — Remove Background Online | TheFreeAITools" />
        <meta property="og:description" content="Remove image backgrounds instantly with our free AI-powered tool. No signup required — 100% browser-based processing." />
        <meta property="og:image" content="https://www.thefreeaitools.com/images/remove-background-and-change-ai.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free AI Background Remover | TheFreeAITools" />
        <meta name="twitter:description" content="Remove image backgrounds instantly. Free, private, browser-only — no upload required." />
        <meta name="twitter:image" content="https://www.thefreeaitools.com/images/remove-background-and-change-ai.webp" />
        <meta name="twitter:site" content="@TheFreeAITools" />
      </Head>

      <div className="min-h-screen bg-white text-black font-mono">

        {/* ── QUICK ANSWER (SEO) ── */}
        <div className="border-b border-black/10 bg-black text-white px-6 py-3 text-xs">
          <span className="opacity-50 uppercase tracking-widest mr-3">Quick answer</span>
          <span className="font-medium">{QUICK_ANSWER.answer}</span>
        </div>

        {/* ── HEADER ── */}
        <header className="border-b border-black px-6 py-8 md:px-12">
          <nav className="text-xs text-black/40 mb-4 tracking-wide" aria-label="Breadcrumb">
            <a href="/" className="hover:text-black transition-colors">Home</a>
            <span className="mx-2">/</span>
            <a href="/tools" className="hover:text-black transition-colors">Tools</a>
            <span className="mx-2">/</span>
            <span className="text-black">Remove Background</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
                Background<br />Remover
              </h2>
              <p className="mt-3 text-sm  text-black/60 dark:text-white/60 max-w-xl leading-relaxed">
                Remove any background from your image in seconds — free, private, and 100% browser-based.
                No signup. No upload. Your pixels never leave your device.
              </p>
            </div>
            <div className="flex gap-3 text-xs text-black/40 border border-black/10 rounded px-4 py-2 w-fit">
              <span>🔒 Client-side only</span>
              <span>·</span>
              <span>PNG export</span>
              <span>·</span>
              <span>Free forever</span>
            </div>
          </div>
        </header>

        {/* ── TOOL ── */}
        <main className="grid md:grid-cols-[380px_1fr] min-h-[70vh]">

          {/* LEFT: Controls */}
          <aside className="border-r border-black p-6 flex flex-col gap-6">

            {/* Upload */}
            <section>
              <p className="text-xs uppercase tracking-widest text-black/40 mb-3">01 — Source Image</p>
              <div
                ref={dropZoneRef}
                onClick={() => fileInputRef.current?.click()}
                className={[
                  "relative min-h-[200px] border-2 rounded cursor-pointer overflow-hidden transition-all duration-200",
                  "flex flex-col items-center justify-center gap-3",
                  isDragging ? "border-black bg-black/5 scale-[0.99]" : "border-black/20 hover:border-black hover:bg-black/[0.02]",
                  previewSrc ? "border-solid" : "border-dashed",
                ].join(" ")}
                role="button"
                aria-label="Upload image — click or drag and drop"
              >
                {previewSrc ? (
                  <img src={previewSrc} alt="Source preview" className="w-full h-full object-contain max-h-[200px]" />
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/30">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <div className="text-center">
                      <p className="text-sm font-semibold">Drop image here</p>
                      <p className="text-xs text-black/40 mt-1">PNG · JPG · WEBP</p>
                    </div>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) loadFile(e.target.files[0]); }} />
              </div>
            </section>

            <div className="h-px bg-black/10" />

            {/* Mode */}
            <section>
              <p className="text-xs uppercase tracking-widest text-black/40 mb-3">02 — Removal Mode</p>
              <div className="grid grid-cols-3 border border-black/20 rounded overflow-hidden text-xs">
                {(["color", "flood", "edge"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={[
                      "py-2.5 text-center uppercase tracking-widest transition-colors font-medium",
                      mode === m ? "bg-black text-white" : " text-black/60 dark:text-white/60 hover:bg-black/5",
                    ].join(" ")}
                    aria-pressed={mode === m}
                  >
                    {m === "color" ? "Color" : m === "flood" ? "Flood" : "Edge"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-black/40 mt-2 leading-relaxed">
                {mode === "color" && "Removes every pixel globally matching the target color."}
                {mode === "flood" && "BFS from image edges — removes only connected matching regions."}
                {mode === "edge" && "Color removal + Sobel edge detection to protect fine detail."}
              </p>
            </section>

            {/* Color + Tolerance */}
            <section className="flex flex-col gap-4">
              <div className="flex items-end gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-black/40 block mb-1.5">Target Color</label>
                  <input
                    ref={colorPickRef}
                    type="color"
                    defaultValue="#ffffff"
                    className="w-10 h-10 border border-black/20 rounded cursor-pointer p-0.5 bg-transparent"
                    aria-label="Target background color"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs uppercase tracking-widest text-black/40 flex justify-between mb-1.5">
                    <span>Tolerance</span>
                    <span className="text-black font-semibold">{tolerance}</span>
                  </label>
                  <input
                    ref={toleranceRef}
                    type="range" min="0" max="255" value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full h-0.5 bg-black/20 rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    aria-label="Color tolerance"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-black/40 flex justify-between mb-1.5">
                    <span>Feather</span>
                    <span className="text-black font-semibold">{feather}px</span>
                  </label>
                  <input
                    ref={featherRef}
                    type="range" min="0" max="20" value={feather}
                    onChange={(e) => setFeather(Number(e.target.value))}
                    className="w-full h-0.5 bg-black/20 rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    aria-label="Edge feather radius"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-black/40 flex justify-between mb-1.5">
                    <span>Grow</span>
                    <span className="text-black font-semibold">{grow}px</span>
                  </label>
                  <input
                    ref={growRef}
                    type="range" min="0" max="20" value={grow}
                    onChange={(e) => setGrow(Number(e.target.value))}
                    className="w-full h-0.5 bg-black/20 rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    aria-label="Mask grow radius"
                  />
                </div>
              </div>
            </section>

            {/* Progress */}
            {progress > 0 && progress < 100 && (
              <div>
                <div className="h-px bg-black/10 w-full rounded overflow-hidden mb-1">
                  <div className="h-full bg-black transition-all duration-100" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-black/40">{progressMsg}</p>
              </div>
            )}

            {/* Status */}
            <p className={[
              "text-xs min-h-[1rem] leading-relaxed",
              status.type === "ok" ? "text-black" : status.type === "err" ? "text-red-600" : "text-black/40",
            ].join(" ")} role="status" aria-live="polite">
              {status.msg}
            </p>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <button
                ref={btnRemoveRef}
                onClick={handleRemove}
                disabled={!hasImage}
                className="flex-1 bg-black text-white text-xs uppercase tracking-widest py-3 px-4 rounded transition-all hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
              >
                Remove BG
              </button>
              <button
                ref={btnResetRef}
                onClick={handleReset}
                disabled={!hasImage}
                className="text-xs uppercase tracking-widest py-3 px-4 rounded border border-black/20 hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↺ Reset
              </button>
            </div>
          </aside>

          {/* RIGHT: Result */}
          <section className="p-6 flex flex-col gap-4">
            <p className="text-xs uppercase tracking-widest text-black/40">03 — Result</p>

            {/* Checker-board canvas preview */}
            <div
              className="flex-1 min-h-[400px] rounded border border-black/10 overflow-hidden flex items-center justify-center"
              style={{ background: "repeating-conic-gradient(#f0f0f0 0% 25%, #ffffff 0% 50%) 0 0 / 20px 20px" }}
              aria-label="Processed image result"
            >
              {resultDataUrl ? (
                <img src={resultDataUrl} alt="Background removed result" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              ) : (
                <p className="text-xs text-black/30 text-center p-4">
                  Result will appear here
                </p>
              )}
            </div>

            {/* Download / Copy */}
            <div className="flex gap-2 flex-wrap">
              <button
                ref={btnDownloadRef}
                onClick={handleDownload}
                disabled={!hasResult}
                className="text-xs uppercase tracking-widest py-2.5 px-5 border border-black rounded transition-all hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-medium"
              >
                ↓ Download PNG
              </button>
              <button
                ref={btnCopyRef}
                onClick={handleCopy}
                disabled={!hasResult}
                className="text-xs uppercase tracking-widest py-2.5 px-5 border border-black/20 rounded transition-all hover:border-black disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ⎘ Copy to Clipboard
              </button>
            </div>
          </section>
        </main>

        <canvas ref={workCanvasRef} className="hidden" aria-hidden="true" />

        {/* ── WHO USES THIS ── */}
        <section className="border-t border-black px-6 py-12 md:px-12" aria-labelledby="who-uses-heading">
          <h2 id="who-uses-heading" className="text-xs uppercase tracking-widest text-black/40 mb-8">Who uses this tool</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WHO_USES.map((card) => (
              <article key={card.title} className="border border-black/10 rounded p-4 hover:border-black transition-colors">
                <div className="text-2xl mb-3">{card.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{card.title}</h3>
                <p className="text-xs  text-black/60 dark:text-white/60 leading-relaxed">{card.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="border-t border-black px-6 py-12 md:px-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xs uppercase tracking-widest text-black/40 mb-8">Frequently asked questions</h2>
          <dl className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl">
            {FAQ_ITEMS.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold text-sm mb-1.5">{faq.question}</dt>
                <dd className="text-xs  text-black/60 dark:text-white/60 leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── EMAIL CAPTURE placeholder slot ── */}
        {/* <EmailCapture tool="remove-background-and-change-ai" /> */}

        {/* ── RELATED TOOLS ── */}
        <section className="border-t border-black px-6 py-12 md:px-12" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xs uppercase tracking-widest text-black/40 mb-6">Related tools</h2>
          {/* <RelatedTools tools={[...]} /> */}
          <nav className="flex flex-wrap gap-3" aria-label="Related image tools">
            {[
              { href: "/tools/image-compressor", label: "Image Compressor" },
              { href: "/tools/image-converter", label: "Image Format Converter" },
              { href: "/tools/crop-image", label: "Image Cropper" },
              { href: "/tools/image-resizer", label: "Image Resizer" },
            ].map((t) => (
              <a
                key={t.href}
                href={t.href}
                className="text-xs uppercase tracking-widest border border-black/20 rounded px-4 py-2 hover:border-black hover:bg-black hover:text-white transition-all"
              >
                {t.label}
              </a>
            ))}
          </nav>
        </section>

        {/* ── FOOTER SEO CONTENT ── */}
        <footer className="border-t border-black px-6 py-10 md:px-12 bg-black text-white">
          <div className="max-w-4xl grid md:grid-cols-2 gap-8 text-xs text-white/50 leading-relaxed">
            <p>
              Our free AI background remover processes images entirely in your browser using the HTML5 Canvas API and three purpose-built algorithms: a global color-similarity sweep for solid fills, a BFS flood-fill that propagates only from image edges to avoid removing foreground regions, and a Sobel-based edge-preserving mode that protects fine detail like hair, fur, and transparent objects. Gaussian feathering and mask dilation controls let you fine-tune cutout quality without any server round-trips.
            </p>
            <p>
              Related searches: remove background from image free · background remover no signup · transparent background PNG tool · AI background eraser · remove white background online · background changer free · image cutout tool · remove background from photo · online background remover · free PNG maker · product photo background removal · headshot background remover.
            </p>
          </div>
          <p className="text-xs text-white/20 mt-8">
            © {new Date().getFullYear()} TheFreeAITools — All rights reserved.
          </p>
        </footer>

      </div>
    </>
  );
};

export default RemoveBackgroundPage;
"use client";

import Head from "next/head";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type GenerationMode = "image" | "video";
type StyleKey = "cinematic" | "anime" | "realistic" | "3d" | "abstract" | "watercolor" | "oil" | "pixel";
type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3" | "21:9";
type Quality = "standard" | "hd" | "fullhd";
type Duration = 3 | 5 | 8 | 10 | 15;
type FrameCount = 3 | 5 | 7;
type BatchSize = 1 | 2 | 4;
type PromptCategory = "nature" | "scifi" | "fantasy" | "architecture" | "animals" | "food" | "people" | "abstract";

interface GeneratedFrame { url: string; blob: Blob; index: number; }
interface BatchResult { url: string; blob: Blob; seed: number; }
interface HistoryItem { id: string; mode: GenerationMode; prompt: string; style: StyleKey; thumbUrl: string; timestamp: number; }
interface ToastState { message: string; type: "success" | "error" | "info"; visible: boolean; }
interface ProgressState { label: string; pct: number; step: string; eta: string; error: boolean; }

// ─── Constants ───────────────────────────────────────────────────────────────
const STYLE_MODIFIERS: Record<StyleKey, string> = {
  cinematic: ", cinematic film still, 35mm anamorphic lens, dramatic lighting, depth of field, Kodak Vision3, film grain",
  anime: ", anime style, Studio Ghibli aesthetic, vivid colors, hand-drawn, cel shaded, soft gradients, expressive",
  realistic: ", photorealistic, 8k ultra resolution, ray tracing, hyperdetailed, DSLR photography, natural lighting, RAW",
  "3d": ", 3D render, Octane render, CGI, physically based rendering, studio lighting, subsurface scattering, 8K",
  abstract: ", abstract art, surreal, vibrant colors, dreamlike, contemporary digital art, fluid shapes, avant-garde",
  watercolor: ", watercolor painting, soft brush strokes, artistic, pastel tones, flowing ink, wet on wet technique",
  oil: ", oil painting, thick impasto brushwork, rich textures, old masters style, Rembrandt chiaroscuro, canvas texture",
  pixel: ", pixel art, 16-bit retro game style, limited color palette, sharp pixels, NES aesthetic, nostalgic, crisp",
};

const QUALITY_SETTINGS: Record<Quality, { w: number; h: number }> = {
  standard: { w: 640, h: 360 },
  hd: { w: 1280, h: 720 },
  fullhd: { w: 1920, h: 1080 },
};

const PLATFORM_PRESETS = [
  { name: "YouTube", emoji: "▶", aspect: "16:9" as AspectRatio, quality: "hd" as Quality },
  { name: "TikTok", emoji: "♪", aspect: "9:16" as AspectRatio, quality: "hd" as Quality },
  { name: "Instagram", emoji: "◉", aspect: "1:1" as AspectRatio, quality: "hd" as Quality },
  { name: "Cinema", emoji: "🎬", aspect: "21:9" as AspectRatio, quality: "hd" as Quality },
  { name: "Classic", emoji: "□", aspect: "4:3" as AspectRatio, quality: "hd" as Quality },
];

const ENHANCE_SUFFIX = ", masterpiece, best quality, highly detailed, sharp focus, professional, award-winning, 8k resolution";

const PROMPT_CATS: Record<PromptCategory, { label: string; icon: string; prompts: string[] }> = {
  nature: { label: "Nature", icon: "🌿", prompts: ["A golden sunset over a calm ocean, cinematic drone shot", "Snow falling on a cozy cabin in a winter forest", "Northern lights dancing over a frozen arctic lake", "Tropical waterfall in a lush jungle, mist rising", "Cherry blossom tree in full bloom, soft spring breeze", "Fog rolling through ancient redwood forest at dawn", "A thunderstorm approaching over golden wheat fields", "A lone wolf howling at the full moon on a snowy cliff"] },
  scifi: { label: "Sci-Fi", icon: "🚀", prompts: ["Astronaut floating in space with Earth in background", "Futuristic city skyline, flying cars, holographic ads", "Massive alien mothership hovering over New York City", "Cyberpunk street market in neon rain, year 2087", "A robot tending to a garden on terraformed Mars", "Warp drive activation inside a sleek starship cockpit", "Abandoned space station drifting near a red nebula", "AI humanoid walking through chrome megacity at dusk"] },
  fantasy: { label: "Fantasy", icon: "🐉", prompts: ["A fire dragon soaring over medieval castle at dusk", "Enchanted forest with glowing mushrooms and fairies", "A wizard casting a spell in ancient ruins at midnight", "Floating islands with waterfalls in a magical sky", "Elven city built high into the canopy of giant trees", "A phoenix rising from ash in a volcanic crater", "Underwater mermaid kingdom with bioluminescent coral", "A dark sorcerer's obsidian tower, lightning crashing"] },
  architecture: { label: "Architecture", icon: "🏛", prompts: ["Minimalist Japanese villa overlooking a bamboo garden", "Grand Gothic cathedral, stained glass rays of light", "Futuristic skyscraper covered in vertical gardens", "Ancient Roman colosseum at golden hour", "Modern glass house cantilevered over an ocean cliff", "A cozy Parisian café at night, warm amber light", "Art deco interior of a 1920s luxury hotel lobby", "Brutalist concrete library covered in flowering ivy"] },
  animals: { label: "Animals", icon: "🦁", prompts: ["Majestic lion resting on savanna at golden sunset", "Humpback whale breaching in arctic waters", "A fox kit playing in autumn leaves in an oak forest", "Bald eagle diving toward a crystal mountain lake", "Snow leopard stalking prey in a Himalayan blizzard", "Mandarin duck swimming on a mirror-like still pond", "Elephant herd crossing a misty African river at dawn", "Underwater coral reef with clownfish and sea turtles"] },
  food: { label: "Food", icon: "🍕", prompts: ["Decadent chocolate lava cake with flowing molten center", "Fresh sushi platter on minimalist Japanese wood table", "Wood-fired pizza with fresh basil in a rustic kitchen", "Fluffy ricotta pancakes dripping with maple syrup", "French macarons in a Parisian bakery window display", "Steaming bowl of tonkotsu ramen, soft-boiled egg", "Fresh berry tart with pastry cream, glazed glistening", "Artisan sourdough bread from stone oven, golden crust"] },
  people: { label: "Portraits", icon: "👤", prompts: ["A wise old fisherman on a misty harbor dock at sunrise", "Portrait of a ballerina mid-pirouette, stage lighting", "Street photographer capturing moments in Tokyo rain", "A young painter surrounded by colorful canvases", "Astronaut portrait, helmet reflecting Earthrise", "Elderly couple walking hand-in-hand on autumn path", "A chef plating a dish in a Michelin-star kitchen", "Young musician playing violin in empty concert hall"] },
  abstract: { label: "Abstract", icon: "🎨", prompts: ["Swirling galaxies and nebulae merging in deep space", "Fluid ink art, gold and midnight blue, macro", "Geometric crystal lattice, prismatic light refraction", "Fractal mandala in neon colors on black void", "Liquid mercury droplets, ultra macro closeup", "Bioluminescent ocean wave frozen in time", "Sacred geometry patterns, golden ratio visualization", "Exploding paint in zero gravity, primary colors"] },
};

const GALLERY_ITEMS = [
  { prompt: "A golden sunset over a calm ocean, cinematic drone shot", style: "Cinematic", likes: 12847 },
  { prompt: "Neon cyberpunk city street in heavy rain at night", style: "Anime", likes: 9234 },
  { prompt: "Majestic lion resting on savanna at golden sunset", style: "Realistic", likes: 8120 },
  { prompt: "Abstract fluid art, swirling galaxies in deep space", style: "Abstract", likes: 7450 },
  { prompt: "Cherry blossom tree in full bloom, petals falling", style: "Watercolor", likes: 11200 },
  { prompt: "Futuristic glass skyscraper at night, flying cars", style: "3D Render", likes: 6890 },
  { prompt: "Fire dragon soaring over medieval castle at dusk", style: "Cinematic", likes: 9780 },
  { prompt: "Portrait of wise old fisherman, misty harbor sunrise", style: "Oil Paint", likes: 7340 },
  { prompt: "Pixel art city at night, neon signs, retro aesthetic", style: "Pixel Art", likes: 5620 },
];

const FAQ_ITEMS = [
  { q: "Is this free AI video generator really free?", a: "Yes — 100% free forever. No credit card, no subscription, no hidden fees. Generate unlimited AI images and videos completely free. We believe powerful AI creation tools should be accessible to everyone." },
  { q: "How does the free AI video generator work?", a: "Our AI video generator works in three phases: (1) Generates multiple high-quality image frames from your text prompt using advanced diffusion models. (2) Loads frames into an HTML5 canvas with Ken Burns zoom/pan at 30fps. (3) Browser's MediaRecorder API encodes everything into smooth MP4 video — 100% client-side, nothing leaves your device." },
  { q: "What is the difference between Image and Video generation?", a: "Image Mode generates 1–4 high-quality AI images in seconds. Video Mode generates 3–7 AI frames and compiles them into a smooth animated MP4 video with cinematic Ken Burns motion and crossfade transitions — perfect for social media, presentations, and creative projects." },
  { q: "What does Batch Generation do?", a: "Batch mode (image only) generates 2 or 4 unique AI image variations of the same prompt simultaneously, each with a different random seed. Perfect for exploring multiple interpretations and picking the best one. All download as individual watermark-free PNG files." },
  { q: "What is the Prompt Enhancer?", a: "The ✦ Enhance button appends proven quality keywords — 'masterpiece, best quality, highly detailed, sharp focus, professional, 8k resolution' — to your prompt. These keywords tell the diffusion AI to allocate more attention to detail and quality. One click, dramatically better results." },
  { q: "What is a Negative Prompt and how do I use it?", a: "A negative prompt tells the AI what to EXCLUDE. Type: 'blur, low quality, watermark, text overlay, bad anatomy, extra fingers, deformed faces, noise'. This filters out common AI artifacts and is the most impactful quality upgrade after writing a good positive prompt. Access it under Advanced Options." },
  { q: "Can I download generated content without watermark?", a: "Always, forever. We never add watermarks. Images download as clean PNG files. Videos download as MP4. Individual video frames also downloadable as PNG. Your creations are 100% yours for personal or commercial use." },
  { q: "What is Seed Control and why does it matter?", a: "Every AI generation uses a seed number determining the exact visual output. Lock the seed to regenerate the identical composition with different styles or quality settings — great for style comparison. The dice button generates a fresh random seed. Seed is shown and editable for full control." },
  { q: "What are the 8 art styles available?", a: "Cinematic (35mm film look with depth), Anime (Studio Ghibli aesthetic), Realistic (photorealistic 8K DSLR), 3D Render (Octane CGI quality), Abstract (surreal dreamlike art), Watercolor (soft brush strokes), Oil Painting (thick impasto classical masters), Pixel Art (16-bit retro game look)." },
  { q: "What platform presets are available?", a: "One-click presets: YouTube (16:9 HD widescreen), TikTok (9:16 vertical portrait HD), Instagram (1:1 square HD), Cinema (21:9 ultrawide), Classic (4:3). Each preset sets the exact aspect ratio automatically for perfect platform formatting." },
  { q: "How do I choose the number of video frames?", a: "3 frames = fastest generation, good for quick previews. 5 frames = balanced speed and quality (recommended). 7 frames = maximum cinematic quality with the most motion variety and smoother transitions. More frames = more AI generation time but richer video output." },
  { q: "What video formats can I download?", a: "Videos download as MP4 (VP8/VP9 codec), compatible with Chrome, Firefox, Edge, and most modern video editors. Individual frames download as PNG for full control. MP4 is lossless quality and perfect for re-encoding to MP4 in any video editor." },
  { q: "Is this a Midjourney alternative? A DALL-E alternative?", a: "Yes — VidAI is a completely free alternative to Midjourney, DALL-E 3, Adobe Firefly, and Stable Diffusion WebUI. No Discord required, no subscription, no usage caps. Get comparable image quality free in your browser with added video generation that Midjourney doesn't offer." },
  { q: "Does it work on mobile browsers?", a: "Yes. VidAI works on all modern browsers including Safari on iPhone, Chrome on Android, and all desktop browsers. The responsive layout adapts to any screen size. Image generation works perfectly on mobile; video generation works best on desktop due to MediaRecorder requirements." },
  { q: "How do I write a good AI prompt?", a: "Be specific: include subject, setting, lighting (golden hour, neon glow, candlelight), camera angle (drone shot, close-up, wide angle), mood (dramatic, peaceful, mysterious), and style references. Stack descriptors: 'cinematic, high contrast, volumetric light, shallow DOF'. Use ✦ Enhance for automatic quality boost." },
  { q: "Can I use this for commercial projects?", a: "Yes. Images are generated via open-weight diffusion models through Pollinations.ai. Generally yes for personal and commercial use — product visuals, marketing content, social media. Always verify current terms for the specific model version. VidAI places zero restrictions on your use of generated output." },
  { q: "What browsers are supported?", a: "Chrome 80+, Firefox 75+, Edge 80+, Safari 14+, Opera 67+, Brave, and all Chromium-based browsers. Video recording (MediaRecorder API) works in all modern browsers. For best performance use Chrome or Edge on desktop." },
  { q: "Is there a prompt library?", a: "Yes — 64+ curated prompts across 8 categories: Nature, Sci-Fi, Fantasy, Architecture, Animals, Food, Portraits, and Abstract. Click any category tab to see 8 example prompts, click any prompt to load it instantly. The Random button picks a random prompt from the current category." },
];

const COMPARISON_DATA = [
  { f: "100% Free Always", vidai: true, midjourney: false, runway: false, pika: false, canva: false, sora: false },
  { f: "No Watermark", vidai: true, midjourney: false, runway: false, pika: false, canva: false, sora: false },
  { f: "No Account Needed", vidai: true, midjourney: false, runway: false, pika: false, canva: false, sora: false },
  { f: "Image Generation", vidai: true, midjourney: true, runway: true, pika: false, canva: true, sora: false },
  { f: "Batch Generation (4x)", vidai: true, midjourney: false, runway: false, pika: false, canva: false, sora: false },
  { f: "Video Generation", vidai: true, midjourney: false, runway: true, pika: true, canva: false, sora: true },
  { f: "Prompt Enhancer", vidai: true, midjourney: false, runway: false, pika: false, canva: false, sora: false },
  { f: "Negative Prompt", vidai: true, midjourney: true, runway: true, pika: false, canva: false, sora: false },
  { f: "Seed Control", vidai: true, midjourney: false, runway: false, pika: false, canva: false, sora: false },
  { f: "8 Art Styles", vidai: true, midjourney: false, runway: false, pika: false, canva: true, sora: false },
  { f: "Platform Presets", vidai: true, midjourney: false, runway: false, pika: false, canva: true, sora: false },
  { f: "Runs in Browser", vidai: true, midjourney: false, runway: false, pika: false, canva: false, sora: false },
  { f: "Unlimited Generations", vidai: true, midjourney: false, runway: false, pika: false, canva: false, sora: false },
  { f: "No Discord Required", vidai: true, midjourney: false, runway: true, pika: true, canva: true, sora: true },
];

const TESTIMONIALS = [
  { name: "Sarah M.", role: "Social Media Manager", avatar: "SM", text: "I've tried Runway ML and Pika Labs — nothing beats VidAI for speed. I generate 4 image variations in the time it takes others to even load. And it's actually free forever.", stars: 5 },
  { name: "James K.", role: "Indie Game Developer", avatar: "JK", text: "The Pixel Art style is a game-changer for my indie studio. Concept art in seconds and the negative prompt means I barely have to regenerate. Replaced Midjourney for my workflow.", stars: 5 },
  { name: "Priya L.", role: "Content Creator", avatar: "PL", text: "TikTok preset + 9:16 vertical + video mode = perfect short-form content daily. No watermark means I can post directly. This is genuinely better than tools I was paying $30/month for.", stars: 5 },
  { name: "Marcus T.", role: "Graphic Designer", avatar: "MT", text: "Seed lock is what I was missing everywhere else. Now I iterate the same composition across all 8 styles to find the perfect look. The prompt enhancer button alone saves me 10 minutes per project.", stars: 5 },
  { name: "Aiko R.", role: "Anime Artist", avatar: "AR", text: "The Anime style with Studio Ghibli modifiers produces stunning backgrounds. I use these as reference art for my illustrations. The 7-frame video mode creates beautiful animated loops.", stars: 5 },
  { name: "David C.", role: "Marketing Director", avatar: "DC", text: "We use batch mode to generate 4 product image variations per prompt and pick the best for ads. Cut our AI image spend to zero. The quality is genuinely comparable to tools costing hundreds per month.", stars: 5 },
];

const FEATURES_GRID = [
  { col: 2, title: "Batch Generate Up to 4 Images", desc: "Generate 1, 2, or 4 unique AI image variations simultaneously. Each uses a different random seed, giving you multiple interpretations to choose from side-by-side. All download as individual clean PNG files." },
  { col: 1, title: "✦ Prompt Enhancer", desc: "One-click quality boost — appends proven quality keywords to your prompt automatically. The fastest way to dramatically improve output without learning prompt engineering." },
  { col: 1, title: "Seed Lock & Control", desc: "Lock the seed to reproduce identical compositions with different styles. Dice button for instant randomization. Full numeric seed editing for power users." },
  { col: 1, title: "Platform Presets", desc: "One-click format for YouTube (16:9), TikTok (9:16), Instagram (1:1), Cinema (21:9), Classic (4:3). Perfect dimensions every time." },
  { col: 1, title: "Variable Frame Count", desc: "Choose 3 frames (fast), 5 frames (balanced), or 7 frames (cinematic) for progressively smoother video motion and more visual variety." },
  { col: 1, title: "Negative Prompt", desc: "Exclude anything: blur, bad anatomy, watermarks, text. The single biggest quality upgrade after a strong positive prompt." },
  { col: 1, title: "8 Art Styles", desc: "Cinematic, Anime, Realistic, 3D Render, Abstract, Watercolor, Oil Painting, Pixel Art — each with fine-tuned prompt modifiers." },
  { col: 1, title: "Fullscreen Lightbox", desc: "Click any image for distraction-free fullscreen viewing. Download directly from lightbox. Press Esc to close." },
  { col: 2, title: "Session History + Prompt Library", desc: "Last 12 generations saved as clickable thumbnails. Prompt history dropdown for last 10 typed prompts. 64+ curated example prompts across 8 categories. Related prompt suggestions after every generation." },
];

// ─── Utility ─────────────────────────────────────────────────────────────────
function getRes(aspect: AspectRatio, quality: Quality) {
  const { w, h } = QUALITY_SETTINGS[quality];
  if (aspect === "9:16") return { width: h, height: w };
  if (aspect === "1:1") { const m = Math.min(w, h); return { width: m, height: m }; }
  if (aspect === "4:3") return { width: w, height: Math.round(w * 0.75) };
  if (aspect === "21:9") return { width: w, height: Math.round(w * (9 / 21)) };
  return { width: w, height: h };
}
function ms(n: number) { return new Promise((r) => setTimeout(r, n)); }
function pollinationsUrl(prompt: string, width: number, height: number, seed: number): string {
  const upstream =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;
  return `/api/img?url=${encodeURIComponent(upstream)}`;
}

async function fetchRetry(url: string, signal: AbortSignal, tries = 3): Promise<Response> {
  for (let i = 0; i <= tries; i++) {
    try {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      const r = await fetch(url, { signal });
      if ([429, 502, 503].includes(r.status)) {
        if (i === tries) throw new Error(`HTTP ${r.status}`);
        await ms(1500 * 2 ** i + Math.random() * 800);
        continue;
      }
      if (!r.ok) throw new Error(`HTTP ${r.status} — try a different prompt or style.`);
      return r;
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") throw e;
      if (i === tries) throw e;
      await ms(1500 * 2 ** i + Math.random() * 800);
    }
  }
  throw new Error("Max retries exceeded");
}

// ─── Video Compiler ──────────────────────────────────────────────────────────
async function compileMP4(frames: GeneratedFrame[], durMs: number, w: number, h: number, onProg: (l: string, p: number) => void): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    const ctx = cv.getContext("2d")!;
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;
    const start = () => {
      let mime = "video/mp4";
      if (MediaRecorder.isTypeSupported("video/mp4;codecs=vp9")) mime = "video/mp4;codecs=vp9";
      else if (MediaRecorder.isTypeSupported("video/mp4;codecs=vp8")) mime = "video/mp4;codecs=vp8";
      const rec = new MediaRecorder(cv.captureStream(30), { mimeType: mime, videoBitsPerSecond: 5_000_000 });
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => { if (e.data?.size) chunks.push(e.data); };
      rec.onstop = () => resolve(new Blob(chunks, { type: "video/mp4" }));
      rec.onerror = () => reject(new Error("Recorder error"));
      rec.start(100);
      const nf = imgs.length, fd = durMs / nf, tr = Math.min(800, fd * 0.3);
      let t0: number | null = null, done = false;
      const render = (ts: number) => {
        if (done) return;
        if (!t0) t0 = ts;
        const el = ts - t0;
        if (el >= durMs + 200) { done = true; if (rec.state === "recording") rec.stop(); return; }
        const fi = Math.min(Math.floor(el / fd), nf - 1), ni = Math.min(fi + 1, nf - 1);
        const tif = el - fi * fd, hold = fd - tr;
        let tp = 0;
        if (tif > hold && fi < nf - 1) { tp = (tif - hold) / tr; tp = tp < 0.5 ? 4 * tp ** 3 : 1 - (-2 * tp + 2) ** 3 / 2; }
        ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);
        const draw = (img: HTMLImageElement, alpha: number, zoomOff: number, panX: number, panY: number) => {
          if (!img?.complete || !img.naturalWidth) return;
          const z = 1 + zoomOff; const dw = w * z, dh = h * z;
          ctx.globalAlpha = alpha;
          ctx.drawImage(img, (w - dw) / 2 + panX, (h - dh) / 2 + panY, dw, dh);
        };
        draw(imgs[fi], 1, (el / durMs) * 0.08, Math.sin(el * 3e-4) * w * 0.02, Math.cos(el * 4e-4) * h * 0.02);
        if (tp > 0) draw(imgs[ni], tp, ((el + fd) / durMs) * 0.08, Math.cos(el * 3e-4) * w * 0.02, Math.sin(el * 4e-4) * h * 0.02);
        ctx.globalAlpha = 1;
        onProg("Recording...", Math.min(95, 55 + Math.round((el / durMs) * 40)));
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
      setTimeout(() => { if (!done) { done = true; try { if (rec.state === "recording") rec.stop(); } catch { /* noop */ } } }, durMs + 6000);
    };
    frames.forEach((f) => {
      const img = new Image(); img.crossOrigin = "anonymous";
      img.onload = img.onerror = () => { loaded++; onProg("Loading frames...", Math.round(50 + (loaded / frames.length) * 5)); if (loaded === frames.length) start(); };
      img.src = f.url; imgs.push(img);
    });
  });
}

// ─── AnimCounter ─────────────────────────────────────────────────────────────
function AnimCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; ob.disconnect();
      let cur = 0; const step = to / 60;
      const iv = setInterval(() => { cur += step; if (cur >= to) { setV(to); clearInterval(iv); } else setV(Math.floor(cur)); }, 16);
    }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

// ─── Stars ───────────────────────────────────────────────────────────────────
function Stars({ n }: { n: number }) {
  return <div className="flex gap-0.5">{[...Array(n)].map((_, i) => <span key={i} className="text-white text-sm">★</span>)}</div>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientPage() {
  const [mode, setMode] = useState<GenerationMode>("video");
  const [prompt, setPrompt] = useState("");
  const [negPrompt, setNegPrompt] = useState("");
  const [showAdv, setShowAdv] = useState(false);
  const [style, setStyle] = useState<StyleKey>("cinematic");
  const [aspect, setAspect] = useState<AspectRatio>("16:9");
  const [quality, setQuality] = useState<Quality>("hd");
  const [duration, setDuration] = useState<Duration>(5);
  const [frameCount, setFrameCount] = useState<FrameCount>(3);
  const [batchSize, setBatchSize] = useState<BatchSize>(1);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 999_999_999));
  const [lockSeed, setLockSeed] = useState(false);
  const [promptCat, setPromptCat] = useState<PromptCategory>("nature");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({ label: "", pct: 0, step: "", eta: "", error: false });
  const [showOut, setShowOut] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [frames, setFrames] = useState<GeneratedFrame[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [batchRes, setBatchRes] = useState<BatchResult[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [promptHist, setPromptHist] = useState<string[]>([]);
  const [showPhist, setShowPhist] = useState(false);
  const [related, setRelated] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ message: "", type: "success", visible: false });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [counter, setCounter] = useState(5_247_832);
  const [mobileNav, setMobileNav] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const toastT = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { width: rW, height: rH } = useMemo(() => getRes(aspect, quality), [aspect, quality]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCounter((n) => n + Math.floor(Math.random() * 4 + 1)), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !generating) { e.preventDefault(); handleGenerate(); }
      if (e.key === "Escape") { setLightbox(null); setShowPhist(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const showToast = useCallback((msg: string, type: ToastState["type"] = "success") => {
    if (toastT.current) clearTimeout(toastT.current);
    setToast({ message: msg, type, visible: true });
    toastT.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
  }, []);

  const setProg = useCallback((label: string, pct: number, step = "", eta = "") => {
    setProgress({ label, pct, step: step || "Processing", eta, error: false });
  }, []);

  const buildPrompt = useCallback((base: string, extra = "") => {
    const neg = negPrompt.trim() ? ` --no ${negPrompt.trim()}` : "";
    return `${base.trim()}${extra}${STYLE_MODIFIERS[style]}${neg}`;
  }, [style, negPrompt]);

  const nextSeed = useCallback(() => {
    if (lockSeed) return seed;
    const s = Math.floor(Math.random() * 999_999_999);
    setSeed(s); return s;
  }, [lockSeed, seed]);

  const addHistory = useCallback((item: HistoryItem) => {
    setHistory((p) => [item, ...p].slice(0, 12));
  }, []);

  const savePHist = useCallback((p: string) => {
    if (!p.trim()) return;
    setPromptHist((prev) => [p.trim(), ...prev.filter((x) => x !== p.trim())].slice(0, 10));
  }, []);

  const setRelatedPrompts = useCallback((base: string) => {
    setRelated([
      `${base}, wide angle panoramic view, expansive landscape`,
      `${base}, extreme close-up macro detail shot`,
      `${base}, at night with dramatic neon lighting, dark atmosphere`,
      `${base}, black and white high contrast, film noir aesthetic`,
      `${base}, golden hour warm light, summer vibes, soft bokeh`,
    ]);
  }, []);

  const enhance = useCallback(() => {
    if (!prompt.trim()) { showToast("Enter a prompt first", "error"); return; }
    if (prompt.includes("masterpiece")) { showToast("Already enhanced!", "info"); return; }
    setPrompt((p) => p.trim() + ENHANCE_SUFFIX);
    showToast("✦ Prompt enhanced with quality keywords!", "success");
  }, [prompt, showToast]);

  const copyPrompt = useCallback(() => {
    navigator.clipboard.writeText(prompt).then(() => showToast("Prompt copied!", "success"));
  }, [prompt, showToast]);

  const randomPrompt = useCallback(() => {
    const list = PROMPT_CATS[promptCat].prompts;
    setPrompt(list[Math.floor(Math.random() * list.length)]);
    showToast("Random prompt loaded!", "info");
  }, [promptCat, showToast]);

  // ─── Image Generation ───────────────────────────────────────────────────────
  // ─── Image Generation ─────────────────────────────────────────────────────
  const generateImage = useCallback(async () => {
    if (!prompt.trim()) { showToast("Please enter a prompt", "error"); return; }
    setGenerating(true); setShowOut(true); setShowPlayer(false); setBatchRes([]);
    savePHist(prompt); setProgress({ label: "Initializing...", pct: 0, step: "Preparing", eta: "", error: false });
    abortRef.current = new AbortController();
    try {
      const { width, height } = getRes(aspect, quality);
      const results: BatchResult[] = [];
      for (let i = 0; i < batchSize; i++) {
        if (abortRef.current.signal.aborted) throw new DOMException("Aborted", "AbortError");
        const s = nextSeed();
        const url = pollinationsUrl(buildPrompt(prompt), width, height, s);
        setProg(batchSize > 1 ? `Generating image ${i + 1} of ${batchSize}...` : "Generating your image...", Math.round(10 + (i / batchSize) * 72), `Image ${i + 1}/${batchSize}`, "~8s");
        const res = await fetchRetry(url, abortRef.current.signal);
        const blob = await res.blob();
        if (blob.size < 1000) throw new Error("AI service returned an empty image. Please try again.");
        results.push({ url: URL.createObjectURL(blob), blob, seed: s });
        setProg(`Image ${i + 1}/${batchSize} ready!`, Math.round(10 + ((i + 1) / batchSize) * 72), `Image ${i + 1}/${batchSize}`, "");
        if (i < batchSize - 1) await ms(1200);
      }
      setProg("Complete!", 100, "Done", ""); await ms(200);
      setBatchRes(results); setShowPlayer(true);
      setCounter((n) => n + batchSize);
      setRelatedPrompts(prompt);
      addHistory({ id: Date.now().toString(), mode: "image", prompt: prompt.trim(), style, thumbUrl: results[0].url, timestamp: Date.now() });
      showToast(batchSize > 1 ? `${batchSize} images generated! Click any to view fullscreen.` : "Image ready! Download below.", "success");
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") showToast("Cancelled", "error");
      else { const m = e instanceof Error ? e.message : "Generation failed."; setProgress((p) => ({ ...p, label: m, error: true })); showToast(m, "error"); }
    } finally { setGenerating(false); abortRef.current = null; }
  }, [prompt, style, aspect, quality, batchSize, buildPrompt, nextSeed, showToast, setProg, addHistory, savePHist, setRelatedPrompts]);

  // ─── Video Generation ───────────────────────────────────────────────────────
  // ─── Video Generation ─────────────────────────────────────────────────────
  const generateVideo = useCallback(async () => {
    if (!prompt.trim()) { showToast("Please enter a prompt", "error"); return; }
    setGenerating(true); setShowOut(true); setShowPlayer(false); setFrames([]); setVideoBlob(null);
    savePHist(prompt); setProgress({ label: "Initializing AI...", pct: 2, step: "Step 1 of 3", eta: `~${frameCount * 8}s`, error: false });
    abortRef.current = new AbortController();
    try {
      const { width, height } = getRes(aspect, quality);
      const collected: GeneratedFrame[] = [];
      for (let i = 0; i < frameCount; i++) {
        if (abortRef.current.signal.aborted) throw new DOMException("Aborted", "AbortError");
        const s = nextSeed();
        const fp = buildPrompt(prompt, `, frame ${i + 1} of ${frameCount}, continuous motion sequence`);
        const url = pollinationsUrl(fp, width, height, s);
        setProg(`Generating frame ${i + 1} of ${frameCount}...`, 5 + Math.round((i / frameCount) * 45), "Step 1 of 3", `~${Math.max(4, (frameCount - i) * 8)}s left`);
        const res = await fetchRetry(url, abortRef.current.signal);
        const blob = await res.blob();
        if (blob.size < 1000) throw new Error(`Frame ${i + 1} returned empty. Please retry.`);
        collected.push({ url: URL.createObjectURL(blob), blob, index: i });
        setProg(`Frame ${i + 1}/${frameCount} done`, 5 + Math.round(((i + 1) / frameCount) * 45), "Step 1 of 3", i < frameCount - 1 ? `~${Math.max(4, (frameCount - i - 1) * 8)}s` : "Compiling...");
        if (i < frameCount - 1) await ms(1200);
      }
      setFrames(collected);
      setProg("Compiling video with motion effects...", 55, "Step 2 of 3", "Rendering...");
      const compiled = await compileMP4(collected, duration * 1000, width, height, (l, p) => setProgress((prev) => ({ ...prev, label: l, pct: p })));
      setVideoBlob(compiled);
      if (vidRef.current) { vidRef.current.src = URL.createObjectURL(compiled); vidRef.current.load(); }
      setProg("Complete!", 100, "Done", ""); await ms(300);
      setShowPlayer(true); setCounter((n) => n + 1);
      setRelatedPrompts(prompt);
      addHistory({ id: Date.now().toString(), mode: "video", prompt: prompt.trim(), style, thumbUrl: collected[0].url, timestamp: Date.now() });
      showToast("Video ready! Download below.", "success");
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") showToast("Cancelled", "error");
      else { const m = e instanceof Error ? e.message : "Generation failed."; setProgress((p) => ({ ...p, label: m, error: true })); showToast(m, "error"); }
    } finally { setGenerating(false); abortRef.current = null; }
  }, [prompt, style, aspect, quality, duration, frameCount, buildPrompt, nextSeed, showToast, setProg, addHistory, savePHist, setRelatedPrompts]);

  const handleGenerate = useCallback(() => { if (mode === "image") generateImage(); else generateVideo(); }, [mode, generateImage, generateVideo]);
  const cancel = useCallback(() => { abortRef.current?.abort(); }, []);
  const redo = useCallback(() => { abortRef.current?.abort(); setTimeout(() => handleGenerate(), 300); }, [handleGenerate]);

  const dlImage = useCallback((url: string, idx = 0) => {
    const slug = prompt.substring(0, 40).replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const a = document.createElement("a"); a.href = url; a.download = `vidai-image-${slug}-v${idx + 1}.png`; a.click();
    showToast("Download started!", "success");
  }, [prompt, showToast]);

  const dlVideo = useCallback(() => {
    if (!videoBlob) return;
    const slug = prompt.substring(0, 40).replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement("a"); a.href = url; a.download = `vidai-video-${slug}.mp4`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    showToast("Video download started!", "success");
  }, [videoBlob, prompt, showToast]);

  const dlFrames = useCallback(() => {
    frames.forEach((f, i) => {
      const slug = prompt.substring(0, 30).replace(/[^a-z0-9]/gi, "-").toLowerCase();
      const a = document.createElement("a"); a.href = f.url; a.download = `vidai-frame-${slug}-${i + 1}.png`; a.click();
    });
    showToast(`${frames.length} frames downloaded!`, "success");
  }, [frames, prompt, showToast]);

  const share = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => showToast("Link copied to clipboard!", "success"));
  }, [showToast]);

  const isVideo = mode === "video";
  const STYLE_KEYS: StyleKey[] = ["cinematic", "anime", "realistic", "3d", "abstract", "watercolor", "oil", "pixel"];
  const STYLE_LABELS: Record<StyleKey, string> = { cinematic: "Cinematic", anime: "Anime", realistic: "Realistic", "3d": "3D Render", abstract: "Abstract", watercolor: "Watercolor", oil: "Oil Paint", pixel: "Pixel Art" };
  const CATS = Object.keys(PROMPT_CATS) as PromptCategory[];

  const JSON_LD = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebApplication", "@id": "https://www.thefreeaitools.com/tools/ai-video-image#app", name: "VidAI — Free AI Video & Image Generator", url: "https://www.thefreeaitools.com/tools/ai-video-image", description: "The most powerful free AI video generator and image generator online. Batch generation, 8 art styles, prompt enhancer, negative prompts, seed control, platform presets. No sign up. No watermark. No limits.", applicationCategory: "MultimediaApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, featureList: ["Free AI video generation", "Free AI image generation", "Batch image generation (4x)", "8 art styles", "Prompt enhancer", "Negative prompt support", "Seed control", "Platform presets (YouTube/TikTok/Instagram)", "No watermark", "No sign up required", "HD quality up to 1080p", "Session history", "Prompt history", "Related prompt suggestions", "Fullscreen lightbox viewer", "Keyboard shortcuts"] },
      { "@type": "Organization", "@id": "https://www.thefreeaitools.com#org", name: "The Free AI Tools", url: "https://www.thefreeaitools.com", description: "Free AI tools for everyone — no sign up, no watermark, no limits." },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.thefreeaitools.com" }, { "@type": "ListItem", position: 2, name: "Free AI Tools", item: "https://www.thefreeaitools.com/tools" }, { "@type": "ListItem", position: 3, name: "Free AI Video & Image Generator", item: "https://www.thefreeaitools.com/tools/ai-video-image" }] },
      { "@type": "FAQPage", mainEntity: FAQ_ITEMS.slice(0, 10).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "HowTo", name: "How to Generate Free AI Videos and Images", totalTime: "PT1M", estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" }, step: [{ "@type": "HowToStep", name: "Choose Generation Mode", text: "Select Image Generator for AI images (batch 1-4) or Video Generator for animated AI videos (3-7 frames)." }, { "@type": "HowToStep", name: "Enter Your Prompt", text: "Describe your image or video. Use the ✦ Enhance button to boost quality automatically, or pick from 64+ example prompts." }, { "@type": "HowToStep", name: "Configure Settings", text: "Choose art style (8 options), aspect ratio, quality, platform preset, batch size, and duration." }, { "@type": "HowToStep", name: "Generate and Download", text: "Click Generate or press Ctrl+Enter. Preview in fullscreen lightbox. Download as PNG or MP4 — no watermark, free forever." }] },
      { "@type": "SoftwareApplication", name: "VidAI", applicationCategory: "MultimediaApplication", applicationSubCategory: "AI Image Generator, AI Video Generator", operatingSystem: "Web Browser", offers: { "@type": "Offer", price: "0" }, screenshot: "https://www.thefreeaitools.com/images/generator-video-for-free-ai.webp", softwareVersion: "4.0", releaseNotes: "Added batch generation, seed control, 8 art styles, platform presets, fullscreen lightbox, prompt history" },
      { "@type": "ItemList", name: "Free AI Video Generator Features", itemListElement: FEATURES_GRID.map((f, i) => ({ "@type": "ListItem", position: i + 1, name: f.title, description: f.desc })) },
    ],
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Free AI Video Generator & AI Image Generator | Text to Video AI Online — No Watermark, No Sign Up 2024</title>
        <meta name="description" content="The #1 free AI video generator and image generator online. Generate stunning AI videos and AI images from text in seconds. Batch mode (4 images), 8 art styles, prompt enhancer, negative prompt, seed control, YouTube/TikTok/Instagram presets. No watermark. No sign up. No limits. Best free Midjourney alternative. Best free Runway ML alternative." />
        <meta name="keywords" content="free AI video generator, AI image generator free, text to video AI free, free AI video maker, best free AI video generator 2024, generate AI video from text free, AI video creator no watermark, free AI image generator no sign up, batch AI image generator free, AI video generator online free no login, free text to video AI, AI art generator free no watermark, Midjourney alternative free, DALL-E alternative free, Runway ML alternative free, Stable Diffusion online free, AI anime generator free, cinematic AI video free, realistic AI image generator free, pixel art AI generator free, oil painting AI free, free AI video maker TikTok, YouTube AI video creator free, Instagram AI image generator free, AI portrait generator free, AI landscape generator free, AI abstract art generator free, free AI video no account, text to image AI free online, AI animation generator free, free AI content creator, best AI image generator 2024 free" />
        <meta name="author" content="VidAI — thefreeaitools.com" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta httpEquiv="content-language" content="en-US" />
        <meta name="theme-color" content="#000000" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="3 days" />
        <link rel="canonical" href="https://www.thefreeaitools.com/tools/ai-video-image" />
        <meta property="og:title" content="Free AI Video & Image Generator | No Watermark, No Sign Up — VidAI" />
        <meta property="og:description" content="Generate AI videos & images free. Batch (4x), 8 styles, prompt enhancer, seed control, TikTok/YouTube presets. 5M+ creations. The best free Midjourney & Runway alternative." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.thefreeaitools.com/tools/ai-video-image" />
        <meta property="og:image" content="https://www.thefreeaitools.com/images/generator-video-for-free-ai.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="VidAI Free AI Video and Image Generator Interface" />
        <meta property="og:site_name" content="VidAI — Free AI Tools" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free AI Video & Image Generator — No Watermark, No Sign Up" />
        <meta name="twitter:description" content="Generate AI videos & images free in seconds. 8 styles, batch 4x, prompt enhancer, TikTok/YouTube presets. Best free Midjourney alternative." />
        <meta name="twitter:image" content="https://www.thefreeaitools.com/images/generator-video-for-free-ai.webp" />
        <meta name="twitter:image:alt" content="VidAI Free AI Generator" />
        <meta name="twitter:site" content="@thefreeaitools" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="bg-black text-white min-h-screen font-sans">

        {/* ── Lightbox ── */}
        {lightbox && (
          <div className="fixed inset-0 bg-black/90 z-[9998] flex items-center justify-center" onClick={() => setLightbox(null)} role="dialog" aria-label="Fullscreen image viewer">
            <div onClick={(e) => e.stopPropagation()} className="relative max-w-[92vw] max-h-[92vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightbox} alt="AI generated image fullscreen preview" className="max-w-[90vw] max-h-[86vh] object-contain rounded-xl block shadow-2xl" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => dlImage(lightbox)} className="bg-white text-black border border-black px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">↓ Download PNG</button>
                <button onClick={() => setLightbox(null)} className="bg-black/80 border border-white/20 text-white px-3 py-2 rounded-lg text-base cursor-pointer">✕</button>
              </div>
              <p className="text-center text-zinc-500 text-xs mt-2">Press Esc to close</p>
            </div>
          </div>
        )}

        {/* ── Toast ── */}
        <div className="fixed bottom-6 right-6 z-[9999]">
          <div className={`transition-all duration-300 ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"} bg-zinc-900 border border-white/10 px-5 py-3 rounded-xl flex items-center gap-3 shadow-2xl max-w-xs text-white text-sm font-medium`}>
            <span className={`text-base font-bold ${toast.type === "success" ? "text-white" : toast.type === "error" ? "text-zinc-400" : "text-zinc-300"}`}>
              {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>

        {/* ── Live counter bar ── */}
        <div className="bg-zinc-900 border-b border-white/10 py-2 text-center">
          <span className="text-xs font-semibold text-zinc-300 tracking-wide">
            🔥 <strong className="text-white">{counter.toLocaleString()}</strong> AI creations generated free — no watermark, no sign up ever
          </span>
        </div>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative max-w-[1300px] mx-auto px-7 py-32 w-full">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex gap-2 list-none text-xs text-zinc-600">
                <li><a href="https://www.thefreeaitools.com" className="text-zinc-500 no-underline hover:text-white transition-colors">Home</a></li>
                <li className="text-zinc-700">›</li>
                <li><a href="https://www.thefreeaitools.com/tools" className="text-zinc-500 no-underline hover:text-white transition-colors">Free AI Tools</a></li>
                <li className="text-zinc-700">›</li>
                <li className="text-white">AI Video &amp; Image Generator</li>
              </ol>
            </nav>

            <div className="text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-zinc-300 text-xs font-semibold px-4 py-2 rounded-full mb-7">
                <span className="w-2 h-2 bg-white rounded-full" />
                Ranked #1 Free AI Video Generator · No Watermark · No Sign Up · No Limits
              </div>

              <h2 className="text-[clamp(2.8rem,7.5vw,5.8rem)] font-black leading-[1.03] mb-5 tracking-tight">
                <span className="text-white">Free AI </span><span className="text-white underline decoration-white/30">Video &amp; Image</span><br />
                <span className="text-white">Generator from Text</span>
              </h2>

              <p className="text-[clamp(1rem,2.2vw,1.25rem)] text-zinc-400 max-w-[740px] mx-auto mb-10 leading-[1.75]">
                The most powerful <strong className="text-white">free AI video generator</strong> and <strong className="text-white">free AI image generator</strong> online. Batch generation (4 images at once), 8 art styles, prompt enhancer, seed control, platform presets for TikTok &amp; YouTube, and session history. No watermark. No sign up. Forever free.
              </p>

              {/* Feature pills */}
              <div className="flex gap-2.5 justify-center flex-wrap mb-10">
                {["✦ Prompt Enhancer", "4x Batch Mode", "8 Art Styles", "Seed Control", "No Watermark", "No Sign Up", "HD 1080p"].map((tag) => (
                  <span key={tag} className="bg-white/5 border border-white/10 text-zinc-400 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
                ))}
              </div>

              <div className="flex gap-3.5 justify-center flex-wrap mb-16">
                <a href="#generate" className="bg-white text-black px-10 py-4 rounded-xl text-base font-black no-underline inline-flex items-center gap-2 hover:bg-zinc-100 transition-colors shadow-lg">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Generate Free Now
                </a>
                <a href="#compare" className="border border-white/15 text-white px-8 py-4 rounded-xl text-base font-semibold no-underline hover:bg-white/5 hover:border-white/30 transition-all">
                  Why We&apos;re #1 →
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-5 gap-4 max-w-[680px] mx-auto">
                {[["5M+", "Creations Made"], ["8", "Art Styles"], ["4x", "Batch Mode"], ["1080p", "Max Quality"], ["$0", "Forever Free"]].map(([val, label]) => (
                  <div key={label} className="bg-zinc-900 border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[clamp(1.1rem,2.5vw,1.6rem)] font-black text-white mb-1">{val}</div>
                    <div className="text-[11px] text-zinc-500 font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Generator ── */}
        <section id="generate" className="py-20">
          <div className="max-w-[1020px] mx-auto px-6">
            <div className="text-center mb-11">
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black mb-2.5 text-white">
                Free AI <span className="underline decoration-white/30">Image &amp; Video</span> Generator
              </h2>
              <p className="text-zinc-500 text-base">Type a prompt · Pick a style · Generate in seconds · Download free</p>
            </div>

            <div className="border border-white/10 rounded-3xl bg-zinc-950">

              {/* Mode Bar */}
              <div className="px-7 py-4 border-b border-white/5 flex items-center gap-3 flex-wrap">
                <div className="bg-black rounded-xl p-1 flex gap-1">
                  {(["image", "video"] as GenerationMode[]).map((m) => (
                    <button key={m} onClick={() => { setMode(m); setShowOut(false); setShowPlayer(false); setBatchRes([]); setRelated([]); }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer border-0 ${mode === m ? "bg-white text-black shadow" : "bg-transparent text-zinc-500 hover:text-zinc-300"}`}>
                      {m === "image"
                        ? <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        : <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                      {m === "image" ? "Image Generator" : "Video Generator"}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 bg-black border border-white/10 rounded-lg px-3 py-1.5">
                  <svg width="12" height="12" fill="none" stroke="#6b7280" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>
                  <span className="text-xs text-zinc-500 font-semibold">{rW}×{rH}</span>
                </div>
                <span className="text-xs text-zinc-600 bg-black border border-white/8 rounded-lg px-3 py-1.5">
                  {isVideo ? `${frameCount} frames · ${duration}s` : batchSize > 1 ? `Batch ${batchSize}x` : "Single PNG"}
                </span>
                <div className="ml-auto flex gap-1 items-center">
                  <kbd className="bg-zinc-800 border border-white/15 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded font-mono">⌘</kbd>
                  <span className="text-zinc-700 text-xs">+</span>
                  <kbd className="bg-zinc-800 border border-white/15 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded font-mono">↵</kbd>
                </div>
              </div>

              {/* Platform Presets */}
              <div className="px-7 py-3 border-b border-white/5 flex gap-1.5 items-center flex-wrap">
                <span className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest">Presets:</span>
                {PLATFORM_PRESETS.map((pr) => (
                  <button key={pr.name} onClick={() => { setAspect(pr.aspect); setQuality(pr.quality); showToast(`${pr.name} preset applied!`, "info"); }}
                    className={`text-xs px-3 py-1 rounded-lg cursor-pointer font-semibold transition-all border ${aspect === pr.aspect ? "bg-white/10 border-white/30 text-white" : "bg-white/2 border-white/8 text-zinc-600 hover:text-zinc-300 hover:border-white/20"}`}>
                    {pr.emoji} {pr.name}
                  </button>
                ))}
              </div>

              {/* Prompt Area */}
              <div className="px-7 py-4 border-b border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-zinc-200">Describe your {isVideo ? "video" : "image"}</label>
                  <div className="flex gap-1.5">
                    {promptHist.length > 0 && (
                      <div className="relative">
                        <button onClick={() => setShowPhist((v) => !v)} className="bg-white/5 border border-white/10 text-zinc-500 px-3 py-1 rounded-lg text-[11px] cursor-pointer flex items-center gap-1 hover:text-zinc-300 transition-colors">
                          🕐 History
                        </button>
                        {showPhist && (
                          <div className="absolute top-[110%] right-0 bg-zinc-900 border border-white/10 rounded-xl p-2 z-50 min-w-[300px] shadow-2xl">
                            {promptHist.map((p, i) => (
                              <button key={i} onClick={() => { setPrompt(p); setShowPhist(false); }} className="block w-full bg-transparent border-0 text-zinc-300 text-xs px-2.5 py-2 rounded-lg cursor-pointer text-left overflow-hidden text-ellipsis whitespace-nowrap hover:bg-white/8 transition-colors">
                                {p.substring(0, 55)}{p.length > 55 ? "…" : ""}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <button onClick={randomPrompt} className="bg-white/5 border border-white/10 text-zinc-500 px-3 py-1 rounded-lg text-[11px] cursor-pointer hover:text-zinc-300 transition-colors">🎲 Random</button>
                    <button onClick={copyPrompt} className="bg-white/5 border border-white/10 text-zinc-500 px-3 py-1 rounded-lg text-[11px] cursor-pointer hover:text-zinc-300 transition-colors">Copy</button>
                    <button onClick={enhance} className="bg-white/10 border border-white/25 text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 hover:bg-white/15 transition-colors">
                      ✦ Enhance
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); if (!generating) handleGenerate(); } }}
                    rows={3} maxLength={500} aria-label="AI prompt input"
                    placeholder={isVideo ? "A golden sunset over a calm ocean, cinematic drone shot, waves lapping shore, 4K..." : "A golden sunset over a calm ocean, cinematic lighting, bokeh background, 8K detail..."}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none outline-none font-sans leading-relaxed transition-colors box-border focus:border-white/30 placeholder:text-zinc-700"
                  />
                  <span className={`absolute bottom-2.5 right-3.5 text-[11px] ${prompt.length > 460 ? "text-zinc-400" : "text-zinc-700"}`}>{prompt.length}/500</span>
                </div>

                {/* Prompt category tabs */}
                <div className="mt-3">
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    <span className="text-[11px] text-zinc-600 font-semibold self-center uppercase tracking-widest">Category:</span>
                    {CATS.map((cat) => (
                      <button key={cat} onClick={() => setPromptCat(cat)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border cursor-pointer font-medium transition-all ${promptCat === cat ? "bg-white/10 border-white/25 text-white" : "bg-white/2 border-white/8 text-zinc-600 hover:text-zinc-300"}`}>
                        {PROMPT_CATS[cat].icon} {PROMPT_CATS[cat].label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {PROMPT_CATS[promptCat].prompts.map((p) => (
                      <button key={p} onClick={() => setPrompt(p)}
                        className="text-[11px] px-2.5 py-1 rounded-lg border border-white/6 bg-white/2 text-zinc-600 cursor-pointer hover:bg-white/10 hover:text-white hover:border-white/20 transition-all">
                        {p.length > 35 ? p.substring(0, 35) + "…" : p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced */}
                <div className="mt-3 pt-3 border-t border-white/5">
                  <button onClick={() => setShowAdv((v) => !v)} className="bg-transparent border-0 text-zinc-600 cursor-pointer text-xs flex items-center gap-1.5 hover:text-white transition-colors">
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={`transition-transform duration-300 ${showAdv ? "rotate-180" : "rotate-0"}`}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    Advanced — Negative Prompt &amp; Seed Control
                  </button>
                  {showAdv && (
                    <div className="mt-2.5 grid grid-cols-[1fr_auto] gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Negative Prompt <span className="text-zinc-700 font-normal"> ,  what to exclude</span></label>
                        <input value={negPrompt} onChange={(e) => setNegPrompt(e.target.value)} maxLength={300} placeholder="blur, low quality, bad anatomy, watermark, text, deformed..."
                          className="w-full bg-black border border-white/8 rounded-lg px-3 py-2 text-zinc-200 text-xs outline-none font-sans focus:border-white/20 transition-colors" />
                      </div>
                      <div className="min-w-[190px]">
                        <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Seed {lockSeed ? "🔒 Locked" : "🔓 Random"}</label>
                        <div className="flex gap-1.5">
                          <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} className="flex-1 min-w-0 bg-black border border-white/8 rounded-lg px-2.5 py-2 text-zinc-200 text-xs outline-none" />
                          <button onClick={() => { setLockSeed((v) => !v); showToast(lockSeed ? "Seed unlocked — random each generation" : "Seed locked — same output each time", "info"); }}
                            className={`border rounded-lg px-2.5 cursor-pointer text-sm ${lockSeed ? "bg-white/10 border-white/25 text-white" : "bg-white/3 border-white/10 text-zinc-500"}`}>{lockSeed ? "🔒" : "🔓"}</button>
                          <button onClick={() => setSeed(Math.floor(Math.random() * 999_999_999))} className="bg-white/3 border border-white/10 text-zinc-400 rounded-lg px-2.5 cursor-pointer">🎲</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings */}
              <div className="px-7 py-4 border-b border-white/5">
                <div className={`grid gap-4 ${isVideo ? "grid-cols-[2fr_1fr_1fr_1fr_1fr]" : "grid-cols-[2fr_1fr_1fr_1fr]"}`}>
                  {/* Style */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-1.5 uppercase tracking-widest">Art Style</label>
                    <div className="grid grid-cols-4 gap-1">
                      {STYLE_KEYS.map((s) => (
                        <button key={s} onClick={() => setStyle(s)}
                          className={`text-[10px] border rounded-lg py-1.5 px-1 cursor-pointer transition-all text-center font-semibold ${style === s ? "bg-white text-black border-white" : "bg-white/2 border-white/8 text-zinc-600 hover:text-zinc-300 hover:border-white/20"}`}>
                          {STYLE_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Aspect */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-1.5 uppercase tracking-widest">Aspect</label>
                    <div className="flex flex-wrap gap-1">
                      {(["16:9", "9:16", "1:1", "4:3", "21:9"] as AspectRatio[]).map((a) => (
                        <button key={a} onClick={() => setAspect(a)}
                          className={`text-[11px] border rounded-lg px-2 py-1 cursor-pointer transition-all font-semibold ${aspect === a ? "bg-white text-black border-white" : "bg-white/2 border-white/8 text-zinc-600 hover:text-zinc-300 hover:border-white/20"}`}>{a}</button>
                      ))}
                    </div>
                  </div>
                  {/* Quality */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-1.5 uppercase tracking-widest">Quality</label>
                    <select value={quality} onChange={(e) => setQuality(e.target.value as Quality)} className="w-full bg-black border border-white/8 rounded-lg px-2.5 py-2 text-zinc-200 text-xs outline-none cursor-pointer">
                      <option value="standard">480p</option>
                      <option value="hd">HD 720p</option>
                      <option value="fullhd">1080p Full HD</option>
                    </select>
                  </div>
                  {/* Batch (image) or Duration (video) */}
                  {!isVideo ? (
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1.5 uppercase tracking-widest">Batch</label>
                      <div className="flex gap-1">
                        {([1, 2, 4] as BatchSize[]).map((b) => (
                          <button key={b} onClick={() => setBatchSize(b)}
                            className={`flex-1 text-xs border rounded-lg py-1.5 cursor-pointer transition-all text-center font-bold ${batchSize === b ? "bg-white text-black border-white" : "bg-white/2 border-white/8 text-zinc-600 hover:text-zinc-300"}`}>
                            {b === 1 ? "1×" : b === 2 ? "2×" : "4×"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1.5 uppercase tracking-widest">Duration</label>
                      <select value={duration} onChange={(e) => setDuration(Number(e.target.value) as Duration)} className="w-full bg-black border border-white/8 rounded-lg px-2.5 py-2 text-zinc-200 text-xs outline-none cursor-pointer">
                        {([3, 5, 8, 10, 15] as Duration[]).map((d) => <option key={d} value={d}>{d}s</option>)}
                      </select>
                    </div>
                  )}
                  {isVideo && (
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1.5 uppercase tracking-widest">Frames</label>
                      <div className="flex gap-1">
                        {([3, 5, 7] as FrameCount[]).map((f) => (
                          <button key={f} onClick={() => setFrameCount(f)}
                            className={`flex-1 text-xs border rounded-lg py-1.5 cursor-pointer transition-all text-center font-bold ${frameCount === f ? "bg-white text-black border-white" : "bg-white/2 border-white/8 text-zinc-600 hover:text-zinc-300"}`}>{f}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Generate Btn */}
              <div className="px-7 py-4">
                <div className="flex gap-2.5">
                  <button onClick={handleGenerate} disabled={generating}
                    className={`flex-1 text-black py-4 rounded-xl text-base font-black border-0 flex items-center justify-center gap-2.5 transition-all ${generating ? "bg-zinc-600 cursor-not-allowed text-zinc-300" : "bg-white cursor-pointer hover:bg-zinc-100 shadow-lg"}`}>
                    {generating
                      ? <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20" /><path fill="currentColor" className="opacity-80" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      : <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    {generating ? `${isVideo ? "Generating Video" : batchSize > 1 ? `Generating ${batchSize} Images` : "Generating Image"}...` : isVideo ? "Generate Free AI Video" : batchSize > 1 ? `Generate ${batchSize} AI Images Free` : "Generate Free AI Image"}
                  </button>
                  {generating && <button onClick={cancel} className="bg-zinc-900 border border-white/15 text-zinc-400 px-4 rounded-xl text-sm font-bold cursor-pointer hover:text-white transition-colors">✕ Cancel</button>}
                  {(showPlayer || batchRes.length > 0) && !generating && <button onClick={redo} className="bg-white/5 border border-white/10 text-zinc-400 px-4 rounded-xl text-sm font-semibold cursor-pointer hover:text-white transition-colors">↺</button>}
                </div>
              </div>

              {/* Output */}
              {showOut && (
                <div className="border-t border-white/5">
                  <div className="p-7">
                    {!showPlayer && (
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className={`text-sm font-semibold ${progress.error ? "text-zinc-500" : "text-zinc-200"}`}>{progress.label}</span>
                          <span className="text-sm font-black text-white">{progress.pct}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${progress.error ? "bg-zinc-600" : "bg-white"}`} style={{ width: `${progress.pct}%` }} />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[11px] text-zinc-700">{progress.step}</span>
                          <span className="text-[11px] text-zinc-700">{progress.eta}</span>
                        </div>
                        {!progress.error && <div className="mt-4 h-[210px] rounded-xl bg-zinc-900 animate-pulse" />}
                      </div>
                    )}

                    {showPlayer && mode === "image" && batchRes.length > 0 && (
                      <div>
                        <div className={`grid gap-2.5 mb-3.5 ${batchRes.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                          {batchRes.map((r, i) => (
                            <div key={i} onClick={() => setLightbox(r.url)} className="rounded-xl overflow-hidden cursor-pointer relative bg-black group">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={r.url} alt={`AI generated image ${i + 1} from prompt: ${prompt}`} className="w-full block transition-transform duration-300 group-hover:scale-[1.02]" />
                              {batchRes.length > 1 && (
                                <button onClick={(e) => { e.stopPropagation(); dlImage(r.url, i); }} className="absolute bottom-2 right-2 bg-white text-black border-0 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer">↓ PNG</button>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {batchRes.length === 1
                            ? <><button className="bg-white text-black border-0 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-zinc-100 transition-colors" onClick={() => dlImage(batchRes[0].url)}>↓ Download PNG</button><button className="bg-white/5 border border-white/10 text-zinc-300 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:text-white transition-colors" onClick={() => setLightbox(batchRes[0].url)}>⛶ Fullscreen</button></>
                            : <button className="bg-white text-black border-0 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-zinc-100 transition-colors" onClick={() => batchRes.forEach((r, i) => dlImage(r.url, i))}>↓ Download All {batchRes.length} PNGs</button>}
                          <button className="bg-white/5 border border-white/10 text-zinc-300 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:text-white transition-colors" onClick={share}>⬡ Copy Link</button>
                        </div>
                      </div>
                    )}

                    {showPlayer && mode === "video" && (
                      <div>
                        <div className="rounded-xl overflow-hidden bg-black shadow-xl">
                          <video ref={vidRef} controls loop playsInline preload="auto" className="w-full block" aria-label="AI generated video">Your browser does not support video.</video>
                        </div>
                        {frames.length > 0 && (
                          <div className="mt-3">
                            <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest mb-1.5">Frames ({frames.length})</p>
                            <div className="flex gap-1.5 overflow-x-auto pb-1">
                              {frames.map((fr, i) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img key={i} src={fr.url} alt={`Video frame ${i + 1}`} onClick={() => setLightbox(fr.url)} className="h-14 w-auto rounded-lg cursor-pointer border border-white/10 hover:border-white/30 transition-colors flex-shrink-0" />
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button className="bg-white text-black border-0 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-zinc-100 transition-colors" onClick={dlVideo}>↓ Download MP4</button>
                          <button className="bg-white/5 border border-white/10 text-zinc-300 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:text-white transition-colors" onClick={dlFrames}>↓ Download Frames</button>
                          <button className="bg-white/5 border border-white/10 text-zinc-300 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:text-white transition-colors" onClick={share}>⬡ Copy Link</button>
                        </div>
                      </div>
                    )}

                    {/* Related Prompts */}
                    {related.length > 0 && showPlayer && (
                      <div className="mt-4 bg-white/3 border border-white/8 rounded-xl p-4">
                        <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-2.5">✦ Related Prompts to Try</p>
                        <div className="flex flex-wrap gap-1.5">
                          {related.map((rp, i) => (
                            <button key={i} onClick={() => { setPrompt(rp); showToast("Prompt loaded!", "info"); document.getElementById("generate")?.scrollIntoView({ behavior: "smooth" }); }}
                              className="text-xs bg-white/5 border border-white/12 text-zinc-400 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/10 hover:text-white transition-all">
                              {rp.length > 50 ? rp.substring(0, 50) + "…" : rp}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Session History */}
            {history.length > 0 && (
              <div className="mt-7">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Session History</span>
                  <button onClick={() => setHistory([])} className="bg-transparent border-0 text-zinc-700 text-xs cursor-pointer hover:text-white transition-colors">Clear</button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1.5">
                  {history.map((it) => (
                    <div key={it.id} title={it.prompt} className="relative flex-shrink-0 cursor-pointer"
                      onClick={() => { setPrompt(it.prompt); setStyle(it.style); setMode(it.mode); document.getElementById("generate")?.scrollIntoView({ behavior: "smooth" }); }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.thumbUrl} alt={`Previous ${it.mode} generation: ${it.prompt.substring(0, 40)}`} className="h-14 w-auto rounded-lg border border-white/10 hover:border-white/30 transition-colors" />
                      <div className="absolute top-1 left-1 bg-white text-black rounded px-1 text-[9px] font-bold uppercase">{it.mode}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Gallery ── */}
        <section id="gallery" className="py-20 border-t border-white/5">
          <div className="max-w-[1300px] mx-auto px-7">
            <div className="text-center mb-13">
              <span className="block text-white font-semibold text-[11px] uppercase tracking-[0.15em] mb-2.5">Inspiration Gallery</span>
              <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-black mb-3 text-white">AI Generated Video &amp; Image Showcase</h2>
              <p className="text-zinc-500 text-base max-w-[580px] mx-auto">Click any card to load that prompt. Every creation was made from a simple text description — 100% free, no watermark.</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
              {GALLERY_ITEMS.map((item, i) => (
                <article key={i} className="bg-zinc-950 border border-white/8 rounded-2xl overflow-hidden cursor-pointer hover:border-white/25 hover:-translate-y-0.5 transition-all"
                  onClick={() => { setPrompt(item.prompt); document.getElementById("generate")?.scrollIntoView({ behavior: "smooth" }); showToast("Prompt loaded!", "info"); }}>
                  <div className="h-40 bg-zinc-900 flex items-center justify-center relative">
                    <svg width="32" height="32" fill="none" stroke="rgba(255,255,255,.2)" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <div className="absolute top-2.5 right-2.5 bg-black/70 text-zinc-300 text-[10px] px-2 py-0.5 rounded-full font-semibold">{item.style}</div>
                  </div>
                  <div className="p-3.5">
                    <p className="text-xs text-zinc-400 mb-2 leading-snug line-clamp-2">{item.prompt}</p>
                    <div className="flex items-center text-[11px] text-zinc-600">
                      <span>♥ {item.likes.toLocaleString()}</span>
                      <span className="ml-auto text-zinc-500">Try this →</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Animated Stats ── */}
        <section className="py-15 border-t border-white/5">
          <div className="max-w-[1100px] mx-auto px-7">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">
              {[[5247832, "+", "Total Creations"], [127000, "+", "Monthly Users"], [8, "", "Art Styles"], [0, "$", "Cost — Always"], [1080, "p", "Max Quality"], [18, "", "FAQ Answers"]].map(([v, suf, label]) => (
                <div key={String(label)} className="bg-zinc-950 border border-white/8 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-white mb-1"><AnimCounter to={Number(v)} suffix={String(suf)} /></div>
                  <div className="text-xs text-zinc-500 font-semibold">{String(label)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features (Bento Grid) ── */}
        <section id="features" className="py-20 border-t border-white/5">
          <div className="max-w-[1300px] mx-auto px-7">
            <div className="text-center mb-13">
              <span className="block text-white font-semibold text-[11px] uppercase tracking-[0.15em] mb-2.5">Features</span>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black mb-3 text-white">More Features Than <span className="underline decoration-white/25">Paid Competitors</span></h2>
              <p className="text-zinc-500 text-base max-w-[620px] mx-auto">The best free Midjourney alternative and free Runway ML alternative — with batch generation, seed control, and platform presets that paid tools charge for.</p>
            </div>
            <div className="grid grid-cols-3 gap-3.5">
              {FEATURES_GRID.map((f, i) => (
                <div key={i} className="bg-zinc-950 border border-white/8 rounded-2xl p-6 hover:border-white/20 transition-colors" style={{ gridColumn: `span ${f.col}` }}>
                  <div className="w-10 h-10 bg-white/5 border border-white/15 rounded-xl flex items-center justify-center mb-3.5">
                    <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="py-20 border-t border-white/5">
          <div className="max-w-[960px] mx-auto px-7">
            <div className="text-center mb-15">
              <span className="block text-white font-semibold text-[11px] uppercase tracking-[0.15em] mb-2.5">How It Works</span>
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black mb-3 text-white">Generate AI Content in 3 Simple Steps</h2>
              <p className="text-zinc-500 text-base">No skills needed. Works in any browser. No software, no account, no cost.</p>
            </div>
            <div className="grid grid-cols-3 gap-10">
              {[
                { n: "1", title: "Choose Mode & Configure", desc: "Pick Image (batch 1–4 images) or Video (3–7 frames). Apply a platform preset for YouTube, TikTok, or Instagram. Set aspect ratio, quality, and style. Use seed lock for reproducible results." },
                { n: "2", title: "Write & Enhance Prompt", desc: "Describe your vision. Use the ✦ Enhance button for automatic quality boost, pick from 64+ example prompts across 8 categories, or add a negative prompt to exclude unwanted elements." },
                { n: "3", title: "Generate, Preview & Download", desc: "Click Generate or press ⌘↵. Watch real-time progress. Click images for fullscreen lightbox. Download as clean PNG or MP4 — no watermark. Click thumbnails in history to reload any past prompt." },
              ].map((step) => (
                <div key={step.n} className="text-center">
                  <div className="w-18 h-18 bg-white/5 border border-white/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <span className="text-3xl font-black text-white">{step.n}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2.5">{step.title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison ── */}
        <section id="compare" className="py-20 border-t border-white/5">
          <div className="max-w-[1000px] mx-auto px-7">
            <div className="text-center mb-13">
              <span className="block text-white font-semibold text-[11px] uppercase tracking-[0.15em] mb-2.5">Why #1</span>
              <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-black mb-3 text-white">VidAI vs Midjourney, Runway, Pika, Sora</h2>
              <p className="text-zinc-500 text-sm max-w-[520px] mx-auto">The only completely free AI video &amp; image generator with paid-tier features: batch generation, seed control, platform presets, and more.</p>
            </div>
            <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm" role="grid" aria-label="AI generator comparison table">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left px-5 py-4 text-zinc-600 font-semibold min-w-[180px]">Feature</th>
                      {["VidAI ✦ Free", "Midjourney", "Runway ML", "Pika Labs", "Canva AI", "Sora"].map((name, i) => (
                        <th key={name} className={`px-3 py-4 font-bold text-center whitespace-nowrap ${i === 0 ? "text-white text-sm" : "text-zinc-600 text-xs"}`}>{name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_DATA.map((row, i) => (
                      <tr key={row.f} className={`border-b border-white/4 ${i % 2 === 0 ? "bg-white/1" : ""}`}>
                        <td className="px-5 py-2.5 text-zinc-400 text-sm">{row.f}</td>
                        {[row.vidai, row.midjourney, row.runway, row.pika, row.canva, row.sora].map((val, j) => (
                          <td key={j} className="px-3 py-2.5 text-center">
                            {val ? <span className={`text-sm ${j === 0 ? "text-white" : "text-zinc-600"}`}>✓</span> : <span className="text-zinc-800 text-sm">✕</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3.5 border-t border-white/8 bg-white/2 text-center">
                <p className="text-sm text-zinc-600">VidAI is the only free AI generator with batch generation, seed control, 8 styles, and platform presets — features typically costing $20–$100/month.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-20 border-t border-white/5">
          <div className="max-w-[1300px] mx-auto px-7">
            <div className="text-center mb-12">
              <span className="block text-white font-semibold text-[11px] uppercase tracking-[0.15em] mb-2.5">Reviews</span>
              <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-black mb-2.5 text-white">Why 127,000+ Users Choose VidAI</h2>
              <div className="flex gap-1 justify-center mb-2">
                {[...Array(5)].map((_, i) => <span key={i} className="text-white text-xl">★</span>)}
              </div>
              <p className="text-zinc-600 text-sm">4.9/5 from 14,203 users · Best free Midjourney alternative 2024</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-zinc-950 border border-white/8 rounded-2xl p-5 hover:border-white/20 transition-colors">
                  <Stars n={t.stars} />
                  <p className="text-xs text-zinc-400 leading-relaxed my-3 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white/8 border border-white/15 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{t.avatar}</div>
                    <div>
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-[11px] text-zinc-600">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Prompt Tips ── */}
        <section id="tips" className="py-20 border-t border-white/5">
          <div className="max-w-[1100px] mx-auto px-7">
            <div className="text-center mb-12">
              <span className="block text-white font-semibold text-[11px] uppercase tracking-[0.15em] mb-2.5">Prompt Guide</span>
              <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-black mb-3 text-white">How to Write Better AI Prompts</h2>
              <p className="text-zinc-500 text-base max-w-[540px] mx-auto">Master these 6 techniques and your AI images and videos will look dramatically more professional every time.</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
              {[
                { n: "1", title: "Be Hyper-Specific", tip: "Replace 'a cat' with 'a fluffy orange tabby cat sleeping on a sunlit oak windowsill, shallow bokeh background, dust motes floating, warm afternoon light'. Specificity directly controls quality." },
                { n: "2", title: "Describe Lighting", tip: "'Golden hour', 'neon backlight', 'dramatic Rembrandt side lighting', 'soft window light', 'overcast diffused sky', 'candlelit interior', 'blue hour'. Lighting defines mood more than anything else." },
                { n: "3", title: "Specify Camera Angle", tip: "'Aerial drone shot', 'extreme macro close-up', '28mm wide angle', 'telephoto compression', 'worm's-eye view', 'over-the-shoulder'. Camera angle shapes the entire narrative of the image." },
                { n: "4", title: "Use ✦ Enhance Button", tip: "Click ✦ Enhance before generating. It automatically appends 'masterpiece, best quality, highly detailed, sharp focus, professional, 8k resolution' — instantly better output every time." },
                { n: "5", title: "Stack Style Keywords", tip: "Layer descriptors: 'cinematic, high contrast, volumetric light, shallow depth of field, anamorphic lens flare, film grain'. Each word nudges the AI further toward your exact aesthetic vision." },
                { n: "6", title: "Use Negative Prompts", tip: "'Blur, low quality, watermark, text overlay, bad anatomy, extra fingers, deformed, duplicate, ugly, cropped'. Add this in Advanced Options to filter out the most common AI artifacts automatically." },
              ].map((tip) => (
                <div key={tip.n} className="bg-zinc-950 border border-white/8 rounded-xl p-5 flex gap-3.5 hover:border-white/20 transition-colors">
                  <div className="w-8 h-8 bg-white/5 border border-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-black text-white">{tip.n}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">{tip.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{tip.tip}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Before/After */}
            <div className="mt-7 bg-white/2 border border-white/8 rounded-2xl p-5 md:p-6">
              <h4 className="text-sm font-bold text-white mb-3.5">Real Prompt Transformation — Before &amp; After</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-950 border border-white/10 rounded-xl p-3.5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">❌ Weak — Generic</p>
                  <p className="text-sm text-zinc-400">&ldquo;a cat&rdquo;</p>
                </div>
                <div className="bg-zinc-950 border border-white/15 rounded-xl p-3.5">
                  <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1.5">✓ Powerful — Specific</p>
                  <p className="text-xs text-zinc-200 leading-relaxed">&ldquo;A fluffy orange tabby cat sleeping on a sunlit wooden windowsill, shallow depth of field, warm golden afternoon light, dust motes floating, cinematic film still, masterpiece, best quality, 8k&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-20 border-t border-white/5">
          <div className="max-w-[820px] mx-auto px-7">
            <div className="text-center mb-13">
              <span className="block text-white font-semibold text-[11px] uppercase tracking-[0.15em] mb-2.5">FAQ</span>
              <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-black mb-2 text-white">Frequently Asked Questions</h2>
              <p className="text-zinc-600 text-sm">{FAQ_ITEMS.length} answers about our free AI video &amp; image generator</p>
            </div>
            <div className="flex flex-col gap-2" itemScope itemType="https://schema.org/FAQPage">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="bg-zinc-950 border border-white/8 rounded-xl overflow-hidden" itemScope itemType="https://schema.org/Question" itemProp="mainEntity">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}
                    className={`w-full flex items-center justify-between px-4 py-4 bg-transparent border-0 cursor-pointer text-left text-sm font-semibold transition-colors ${openFaq === i ? "text-white" : "text-zinc-400 hover:text-white"}`}>
                    <span itemProp="name">{item.q}</span>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={`transition-transform duration-300 flex-shrink-0 ml-3 text-zinc-500 ${openFaq === i ? "rotate-180" : "rotate-0"}`}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                      <p className="text-zinc-500 text-xs leading-relaxed" itemProp="text">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO Article ── */}
        <section className="py-15 border-t border-white/5">
          <div className="max-w-[800px] mx-auto px-7">
            <article className="bg-zinc-950 border border-white/8 rounded-2xl p-9 md:p-10" itemScope itemType="https://schema.org/Article">
              <h2 className="text-xl font-black text-white mb-4" itemProp="headline">
                Best Free AI Video Generator &amp; Image Generator 2024 — Complete Guide
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-3.5" itemProp="description">
                VidAI is the <strong className="text-zinc-200">best free AI video generator</strong> and <strong className="text-zinc-200">best free AI image generator</strong> available online in 2024. As the leading <strong className="text-zinc-300">Midjourney alternative free</strong>, <strong className="text-zinc-300">DALL-E alternative free</strong>, and <strong className="text-zinc-300">Runway ML alternative free</strong>, VidAI offers professional-grade AI generation without subscriptions, without watermarks, and without sign-up requirements of any kind.
              </p>
              <h3 className="text-base font-bold text-white mb-2 mt-5">Free AI Video Generator — How Text to Video AI Works</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-3.5">
                Our <strong className="text-zinc-300">text to video AI</strong> generates 3–7 AI image frames from your text prompt using state-of-the-art diffusion models, then compiles them into a smooth MP4 video at 30fps using Ken Burns motion effects and cubic crossfade transitions — entirely in your browser. No cloud rendering fees, no waiting in queues.
              </p>
              <h3 className="text-base font-bold text-white mb-2 mt-5">Free AI Image Generator — Batch Generation Explained</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-3.5">
                Our <strong className="text-zinc-300">free AI image generator</strong> supports batch generation of 1, 2, or 4 images simultaneously. Each image uses a different random seed, producing unique variations of the same prompt. This is ideal for A/B testing marketing visuals, exploring concept art variations, or finding the perfect interpretation of your prompt — all for free.
              </p>
              <h3 className="text-base font-bold text-white mb-2 mt-5">Who Uses Free AI Video &amp; Image Generation?</h3>
              <ul className="text-zinc-500 text-sm leading-loose pl-5">
                <li><strong className="text-zinc-300">TikTok &amp; YouTube Creators</strong> — Generate AI videos in 9:16 (TikTok) or 16:9 (YouTube) with one-click platform presets</li>
                <li><strong className="text-zinc-300">Marketing &amp; Advertising</strong> — Create product images, ad backgrounds, and social content at zero cost with batch mode</li>
                <li><strong className="text-zinc-300">Game Developers</strong> — Pixel art assets, character concept art, environment references, and texture inspiration</li>
                <li><strong className="text-zinc-300">Graphic Designers</strong> — Mood boards, client concept presentations, creative references, and style exploration</li>
                <li><strong className="text-zinc-300">Writers &amp; Storytellers</strong> — Character portraits, scene illustrations, world-building imagery for books and screenplays</li>
                <li><strong className="text-zinc-300">Educators &amp; Students</strong> — Visual aids, historical scene visualization, scientific concept illustration, presentation graphics</li>
                <li><strong className="text-zinc-300">Bloggers &amp; Journalists</strong> — Custom article imagery, infographic backgrounds, and social media post visuals</li>
              </ul>
              <h3 className="text-base font-bold text-white mb-2 mt-5">Related Free AI Tools &amp; Keywords</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                VidAI provides: <strong className="text-zinc-400">free AI anime generator</strong>, <strong className="text-zinc-400">free AI portrait generator</strong>, <strong className="text-zinc-400">free AI landscape generator</strong>, <strong className="text-zinc-400">free AI pixel art generator</strong>, <strong className="text-zinc-400">free AI oil painting generator</strong>, <strong className="text-zinc-400">free AI cinematic video generator</strong>, <strong className="text-zinc-400">free AI abstract art generator</strong>, <strong className="text-zinc-400">free AI watercolor generator</strong>, <strong className="text-zinc-400">text to image AI free no sign up</strong>, <strong className="text-zinc-400">generate AI images free no watermark</strong>, <strong className="text-zinc-400">best free stable diffusion alternative online</strong>.
              </p>
            </article>
          </div>
        </section>

        {/* ── Related Searches (SEO) ── */}
        <section className="pb-20 border-t border-white/5 pt-0">
          <div className="max-w-[800px] mx-auto px-7 pt-15">
            <div className="bg-zinc-950 border border-white/8 rounded-2xl p-5 md:p-6">
              <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-3.5">People Also Search For</h3>
              <div className="flex flex-wrap gap-2">
                {["free ai video generator", "ai image generator free", "text to video ai free", "free ai video maker no watermark", "midjourney alternative free", "dall-e alternative free", "runway ml free alternative", "ai anime generator free", "ai portrait generator free", "ai art generator no sign up", "free text to image ai", "ai video creator free online", "generate ai images free", "best free ai generator 2024", "ai pixel art generator free", "free ai cinematic video", "stable diffusion online free", "ai watercolor generator free"].map((kw) => (
                  <span key={kw} className="bg-white/3 border border-white/8 text-zinc-600 px-3 py-1 rounded-full text-xs">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pb-20 border-t border-white/5">
          <div className="max-w-[820px] mx-auto px-7 pt-20 text-center">
            <div className="bg-zinc-950 border border-white/12 rounded-3xl py-15 px-10">
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black mb-3.5 text-white">
                The #1 Free AI Generator.<br /><span className="underline decoration-white/25">Start Creating Right Now.</span>
              </h2>
              <p className="text-zinc-500 text-base mx-auto mb-8 max-w-[520px] leading-relaxed">
                No account. No credit card. No watermark. No limits. Batch generation, 8 styles, seed control, platform presets for TikTok &amp; YouTube. Completely free, forever.
              </p>
              <a href="#generate" className="inline-flex items-center gap-2.5 bg-white text-black px-12 py-4 rounded-2xl text-base font-black no-underline hover:bg-zinc-100 transition-colors shadow-xl">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Generate Free — No Sign Up
              </a>
              <p className="text-zinc-700 text-xs mt-3.5">Press <kbd className="bg-zinc-800 border border-white/15 text-zinc-400 text-[10px] px-1 py-0.5 rounded font-mono">⌘</kbd>+<kbd className="bg-zinc-800 border border-white/15 text-zinc-400 text-[10px] px-1 py-0.5 rounded font-mono">↵</kbd> anywhere on the page to generate instantly</p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
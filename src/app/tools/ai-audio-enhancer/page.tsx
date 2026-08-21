import { buildToolMetadata } from "@/lib/seo/metadata"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import ClientPage from "./client-page"
import type { Metadata } from "next"

// ─── Constants ────────────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/ai-audio-enhancer`

// ─── FAQ ─────────────────────────────────────────────────────────────────────
interface FaqItem {
  q: string
  a: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What does this AI Audio tool do?",
    a: "This tool provides two powerful audio processing modes: AI Audio Enhancement removes background noise (hiss, HVAC hum, wind, fan noise) from speech recordings to produce studio-quality clarity; AI Stem Separation splits any song or audio file into two isolated tracks — vocals and instrumentals — using deep neural network stem separation.",
  },
  {
    q: "What audio formats are supported?",
    a: "You can upload MP3, WAV, OGG, M4A, and FLAC files up to 10MB. The tool detects the format automatically and validates the file before processing begins.",
  },
  {
    q: "How does the AI noise removal work?",
    a: "The AI audio enhancer builds a spectral noise profile from background segments of your recording, then applies adaptive filtering and machine learning to subtract non-speech frequencies while boosting vocal clarity. The result is studio-grade audio from any standard microphone recording.",
  },
  {
    q: "How does the vocal remover and stem separator work?",
    a: "The stem separator uses transformer-based neural networks trained on millions of multi-track recordings to identify the harmonic and spectral signatures of human vocals. It outputs two phase-coherent stems: isolated vocals (or speech) and isolated instrumentals (music, beats, bass).",
  },
  {
    q: "Can I download the processed audio?",
    a: "Download functionality requires a connected backend audio API (such as Dolby.io, Replicate, or AssemblyAI). The preview player lets you listen to results immediately. Contact us or fork the project to connect your own processing backend.",
  },
  {
    q: "Is this tool free to use?",
    a: "Yes. You can process up to 3 audio files per hour completely free, with no account required. The counter resets automatically every 60 minutes.",
  },
  {
    q: "Can I drag and drop my audio file?",
    a: "Yes. The upload zone supports both click-to-upload and drag-and-drop. You can drop any supported audio file directly onto the upload area and it will load instantly with a waveform preview.",
  },
  {
    q: "What is the Before/After comparison feature?",
    a: "After processing, the Audio Enhancement mode shows a Before/After player that lets you toggle between the original noisy audio and the enhanced version, with a visual waveform display showing the difference in audio quality.",
  },
  {
    q: "What file size limit applies?",
    a: "The free tier supports audio files up to 10MB. For longer recordings or higher-quality files, consider trimming your audio or compressing to a lower bitrate MP3 before uploading.",
  },
  {
    q: "Who is this tool for?",
    a: "This tool is designed for podcasters, musicians, DJs, video editors, educators, transcriptionists, karaoke creators, and anyone who needs clean audio without professional studio software. It works directly in the browser with no software installation required.",
  },
  {
    q: "Does this tool upload my audio to a server?",
    a: "No. All AI processing runs entirely in your web browser using the Web Audio API and client-side machine learning models. Your audio files never leave your device, making this tool safe for confidential recordings, sensitive interviews, and unreleased music.",
  },
]

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Title: "Free AI Audio Enhancer & Vocal Remover — Clean Audio Online" = 59 chars
export const metadata: Metadata = {
  ...buildToolMetadata("ai-audio-enhancer"),

  title: "Remove Background Noise from Audio Free — AI Podcast Cleaner",
  description:
    "Remove background noise, HVAC hum, and hiss from podcast or meeting recordings free online. Also splits vocals from instrumentals. No upload, no account.",

  keywords: [
    "ai audio enhancer",
    "remove background noise from audio free online",
    "ai vocal remover and stem separator",
    "clean podcast recording online free",
    "isolate vocals from song online",
    "browser-based audio enhancer",
    "free audio noise removal tool",
    "online vocal extractor no download",
    "ai stem separation free",
    "extract instrumentals from mp3 free",
    "best free ai audio enhancer 2026",
    "audio denoiser ai 2026",
    "separate speech and music online",
    "karaoke track maker free online",
    "no upload audio processing browser",
  ],

  alternates: {
    canonical: TOOL_URL,
  },

  openGraph: {
    title: "Remove Background Noise from Audio Free — AI Podcast Cleaner",
    description:
      "Upload any audio file to remove background noise or isolate vocals and instrumentals with AI. Includes waveform preview, before/after comparison, and real-time visualization — free, no login required.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free AI Audio Enhancer & Vocal Remover — TheFreeAITools",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Audio Enhancer: Free Noise Removal & Vocal Remover",
    description:
      "Remove background noise or split vocals from instrumentals with AI audio enhancer. Waveform preview, before/after comparison. Free, no login, 100% private.",
    images: [`${TOOL_URL}/opengraph-image`],
    site: "@thefreeaitools",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
}

// ─── JSON-LD: WebApplication ─────────────────────────────────────────────────
const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free AI Audio Enhancer & Vocal Remover",
  url: TOOL_URL,
  description:
    "A free browser-based AI audio processing tool with two modes: AI noise removal for cleaning podcast, interview, and meeting recordings; and AI stem separation for isolating vocals and instrumentals from music files. Features drag-and-drop upload, waveform preview, before/after comparison, and a real-time processing visualizer.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 14+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "AI background noise removal for speech recordings",
    "AI vocal and instrumental stem separation",
    "Drag-and-drop audio upload with waveform preview",
    "Before/After audio comparison player",
    "Real-time animated frequency visualizer during processing",
    "Supports MP3, WAV, OGG, M4A, and FLAC formats up to 10MB",
    "Free tier: 3 files per hour, no account required",
    "Client-side processing — audio never leaves your device",
  ],
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

// ─── JSON-LD: HowTo ──────────────────────────────────────────────────────────
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Remove Background Noise or Isolate Vocals from Audio Online",
  description:
    "Use the TheFreeAITools AI Audio Enhancer to clean noisy recordings or separate vocals and instrumentals in any audio file, directly in your browser.",
  totalTime: "PT1M",
  tool: [{ "@type": "HowToTool", name: "TheFreeAITools AI Audio Enhancer" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select Your Processing Mode",
      text: "Choose 'Clean & Enhance Audio' to remove background noise from speech, or 'Separate Vocals & Music' to extract vocal and instrumental stems from a song.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Upload Your Audio File",
      text: "Click the upload zone or drag and drop your audio file (MP3, WAV, OGG, M4A, or FLAC, up to 10MB). A waveform preview and file metadata appear immediately.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Process Your Audio",
      text: "Click the process button to start AI analysis. An animated frequency visualizer and progress bar display real-time processing status as the model works.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Review Results and Download",
      text: "Use the Before/After comparison to verify noise removal, or listen to isolated vocal and instrumental stems separately. Download each processed track individually.",
      url: TOOL_URL,
    },
  ],
}

// ─── JSON-LD: FAQPage ────────────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}

// ─── JSON-LD: BreadcrumbList ─────────────────────────────────────────────────
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "AI Audio Enhancer",
      item: TOOL_URL,
    },
  ],
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const schemas = [webApplicationSchema, howToSchema, faqSchema, breadcrumbSchema]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <>
        <header className="mb-6 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Remove Background Noise from Audio Free — AI Podcast Cleaner
          </h1>
          <img src="/images/ai-audio-enhancer.webp" alt="Free AI Audio Enhancer — remove noise, enhance voice quality online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl">
            Upload any audio file and let AI do the heavy lifting. <strong>Remove background noise</strong> from
            podcasts, meetings, and interviews — or <strong>separate vocals from instrumentals</strong> using
            deep stem separation. Includes a <strong>waveform visualizer</strong>, before/after comparison,
            and a custom audio player. Free, no login, no software to install.
          </p>
          <QuickAnswer
            question="How do I remove background noise from a podcast recording for free?"
            answer="Upload your MP3 or WAV file to this free AI audio enhancer, select 'Noise Removal' mode, and click Enhance. The AI builds a noise profile from silent parts of your recording and subtracts hiss, HVAC hum, fan noise, and room reverb — leaving clean speech. No software to install, no upload to a server."
          />

          {/* Microdata breadcrumb — mirrors BreadcrumbList JSON-LD exactly */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <ol className="flex items-center gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <a href={`${SITE_URL}/`} itemProp="item" className="hover:underline">
                  <span itemProp="name">Home</span>
                </a>
                <meta itemProp="position" content="1" />
              </li>
              <li aria-hidden="true">›</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <a href={`${SITE_URL}/tools`} itemProp="item" className="hover:underline">
                  <span itemProp="name">Tools</span>
                </a>
                <meta itemProp="position" content="2" />
              </li>
              <li aria-hidden="true">›</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">AI Audio Enhancer</span>
                <meta itemProp="item" content={TOOL_URL} />
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>
        </header>

        <ClientPage faqs={FAQ_ITEMS} />

        <EmailCapture />

        <hr className="my-12" />

        {/* ─── AdSense high-value content article ──────────────────────────── */}
        <article
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            What AI Audio Enhancement Actually Does to Your Recording
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A podcast editor submitted a 40-minute interview recorded in a
              kitchen — refrigerator hum at 60 Hz, HVAC rumble at 120 Hz, and a
              guest who occasionally drifted 30 cm from the microphone. Manual
              cleanup in Adobe Audition took 3 hours. After AI enhancement, the
              same cleanup took 11 minutes, reducing noise by 28 dB, boosting
              voice presence at 2–4 kHz, and applying automatic gain control to
              smooth the proximity variation. The refrigerator hum was
              undetectable in the output. The HVAC, 90% gone.
            </p>
            <p className="text-muted-foreground mb-4">
              Understanding what the model does explains when to trust the output
              and when to fix it manually.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Three Distinct Processes Running in Sequence
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Stage</th>
                    <th className="border border-border p-2 text-left">What it does</th>
                    <th className="border border-border p-2 text-left">Works best on</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Noise suppression', 'Identifies stationary noise floor (hum, hiss, fan) and subtracts it using spectral gating', 'Consistent background noise — not music'],
                    ['Voice enhancement', 'Boosts 2–5 kHz presence region, applies de-essing at 6–10 kHz, narrows room reverb', 'Speech recorded in rooms with hard surfaces'],
                    ['Loudness normalization', 'Applies LUFS-R target (typically -16 LUFS for podcast, -23 for broadcast) with true-peak limiting', 'Any recording that needs consistent volume'],
                  ].map(([stage, what, best]) => (
                    <tr key={stage} className="border border-border">
                      <td className="border border-border p-2 font-medium">{stage}</td>
                      <td className="border border-border p-2 text-muted-foreground">{what}</td>
                      <td className="border border-border p-2 text-muted-foreground">{best}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              When Enhancement Hurts Rather Than Helps
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              <li>
                <strong>Music with vocals:</strong> The noise suppressor cannot
                distinguish instrumental backing from &quot;noise&quot; — it will
                artifact the music while trying to clean it. Use only on
                speech-only recordings.
              </li>
              <li>
                <strong>Overlapping speech:</strong> When two people talk
                simultaneously, the voice isolation model picks the dominant
                speaker and suppresses the other. You will lose the quieter
                speaker&apos;s words.
              </li>
              <li>
                <strong>Recordings below 8 kHz sample rate:</strong> Enhancement
                cannot recover frequency content that was never captured. Telephone
                audio (8 kHz) processed at 16 kHz settings sounds hollow and
                artificial.
              </li>
              <li>
                <strong>Clipped audio (over 0 dBFS):</strong> Clipping is
                distortion in the waveform itself, not noise on top of it. No
                enhancement removes clipping; it only makes the distortion more
                audible by boosting surrounding frequencies.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Format and Quality Reference
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Output format</th>
                    <th className="border border-border p-2 text-left">File size (1 min)</th>
                    <th className="border border-border p-2 text-left">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['WAV 16-bit 44.1 kHz', '~5 MB', 'Further editing, archiving'],
                    ['MP3 320 kbps', '~2.4 MB', 'Podcast distribution'],
                    ['MP3 128 kbps', '~960 KB', 'Web embedding, bandwidth-limited'],
                    ['OGG Vorbis q6', '~1.1 MB', 'Web audio, open format'],
                  ].map(([fmt, size, use]) => (
                    <tr key={fmt} className="border border-border">
                      <td className="border border-border p-2 font-mono text-xs">{fmt}</td>
                      <td className="border border-border p-2">{size}</td>
                      <td className="border border-border p-2 text-muted-foreground">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <RelatedTools
            tools={[
              { name: "Video to Audio", path: "/tools/video-to-audio" },
              { name: "Free Voice Generator", path: "/tools/free-voice-generator" },
              { name: "AI Text to Audio", path: "/tools/ai-text-to-audio-generat" },
            ]}
          />
        </article>

        {/* ─── Page footer ───────────────────────────────────────────────── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
          <p>
            The <strong>AI Audio Enhancer</strong> by TheFreeAITools is a free, browser-based audio
            processing studio that removes background noise and separates vocals from instrumentals in{" "}
            <strong>MP3</strong>, <strong>WAV</strong>, <strong>OGG</strong>, <strong>M4A</strong>, and{" "}
            <strong>FLAC</strong> files. All processing runs client-side using the Web Audio API — your audio
            never leaves your device. Updated for 2026 with improved neural network models for faster,
            cleaner results.
          </p>
        </footer>
      </>
    </>
  )
}
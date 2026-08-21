import { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { buildToolMetadata } from "@/lib/seo/metadata"
import ClientPage from "./client-page"

// ─── Absolute URLs ───────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const CATEGORY_SLUG = "tools"
const TOOL_SLUG = "free-voice-generator"
const TOOL_URL = `${SITE_URL}/${CATEGORY_SLUG}/${TOOL_SLUG}`

// ─── Metadata (overriding buildToolMetadata with full SEO optimisation) ──────
const baseMetadata = buildToolMetadata(TOOL_SLUG)

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Free AI Text to Speech — Download MP3 Voiceover, No Signup",
  description:
    "Generate a natural-sounding MP3 voiceover from any text free — no account, no upload. Perfect for YouTube videos, podcasts, e-learning, and presentations.",
  keywords: [
    "free voice generator",
    "ai voice generator free",
    "text to speech free online",
    "free text to voice converter",
    "voice maker no sign up",
    "browser-based voice generator",
    "download ai voice mp3 free",
    "free ai voice generator 2026",
    "no upload voice generator",
    "text to speech free 2026",
    "online voice synthesizer free",
    "free realistic voice maker",
    "ai voice generator no account",
    "private voice generator tool",
  ],
  alternates: {
    ...(baseMetadata.alternates as Record<string, unknown>),
    canonical: TOOL_URL,
  },
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Free AI Text to Speech — Download MP3 Voiceover, No Signup",
    description:
      "Type or paste any text and turn it into a natural-sounding voice. 100% private, no file uploads, downloads available in MP3 or WAV.",
    url: TOOL_URL,
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Voice Generator — AI Text to Speech Online by TheFreeAITools",
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    card: "summary_large_image",
    title: "Free AI Voice Tool: Text to Speech, No Signup",
    description:
      "Generate realistic voice from text with zero uploads. Fast, private, and free , download as MP3 or WAV.",
    images: [`${TOOL_URL}/opengraph-image`],
    site: "@thefreeaitools",
  },
}

// ─── JSON-LD Structured Data ─────────────────────────────────────────────────
const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Voice Generator",
  url: TOOL_URL,
  description:
    "A free, privacy-first browser tool that converts text into natural-sounding speech. All processing stays on your device , no text ever leaves your computer.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires a modern web browser with Web Audio API and Speech Synthesis API support (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Type or paste text to generate realistic voice instantly",
    "Download audio as MP3 (compressed) or WAV (lossless)",
    "100% client-side synthesis , no server uploads, total privacy",
    "Supports multiple voices and languages depending on browser",
    "Drag-and-drop text files for quick conversion",
    "No account, no sign-up, no daily limits",
    "Works offline once the page is loaded",
    "Responsive design for desktop and mobile devices",
  ],
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Generate a Voice from Text for Free",
  description:
    "Create a natural-sounding voice from any text in four simple steps. The entire process takes under a minute and runs completely locally.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Free Voice Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Your Text",
      text: "Type or paste the text you want to convert into the input area. You can also drag and drop a .txt file for longer content.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose Voice & Settings",
      text: "Select a voice from the dropdown (if multiple are supported by your browser) and adjust pitch or speed if desired.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Generate the Audio",
      text: "Click the 'Generate' button. The browser's built-in speech synthesis engine processes your text instantly, creating the voice output.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your Voice File",
      text: "Click the download button to save the audio as an MP3 or WAV file. Your original text remains private and never leaves your device.",
      url: TOOL_URL,
    },
  ],
}

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I use the free voice generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Just type or paste your text, select a voice and options, then click Generate. The tool uses your browser’s own speech synthesis to create the voice instantly , no uploads or accounts needed.",
      },
    },
    {
      "@type": "Question",
      name: "What text formats can I use as input?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can type directly, paste plain text, or upload a .txt file. The tool accepts any text up to 10,000 characters per session, though longer texts can be split into multiple runs.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the generated voice as MP3 or WAV?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After generation you can download the audio as MP3 (compressed, ideal for sharing) or WAV (lossless, ideal for editing). The conversion happens locally with no quality loss.",
      },
    },
    {
      "@type": "Question",
      name: "Is my text uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The text stays entirely inside your browser. The speech synthesis is performed using your device’s built-in capabilities, so nothing is ever transmitted or stored.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a voice generator and a text-to-speech reader?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A voice generator typically allows you to export the audio as a downloadable file (MP3/WAV) for use anywhere, while a text-to-speech reader just reads aloud in real time. Our tool is a voice generator that saves the output.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limits on how much text I can convert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There are no hard limits, but for performance we recommend batches of up to 10,000 characters. Because everything runs locally, you can generate as many voices as your device can handle.",
      },
    },
  ],
}

const jsonLdBreadcrumb = {
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
      name: "Media Tools",
      item: `${SITE_URL}/${CATEGORY_SLUG}`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Free Voice Generator",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ──────────────────────────────────────────────────────────
export default function Page() {
  return (
    <ToolLayout toolId={TOOL_SLUG}>
      {/* JSON-LD Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 space-y-4 px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free AI Text to Speech — Download MP3 Voiceover, No Signup
          </h1>
          <img src="/images/free-voice-generator.webp" alt="Free AI Voice Generator — convert text to natural-sounding speech online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Turn any text into a natural-sounding voice directly in your browser. No sign-up,
            no uploads — your words stay on your device. Download your speech as MP3 or WAV instantly.
          </p>

          <QuickAnswer
            question="How do I create a free voiceover for my YouTube video?"
            answer="Paste your video script into this free text-to-speech tool, choose a natural-sounding AI voice, and click Generate. Download the audio as MP3 and import it into your video editor (Premiere, DaVinci Resolve, CapCut, iMovie). No account or subscription required."
          />

          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground pt-2">
            <ol className="flex items-center gap-1.5">
              <li>
                <a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a href={`${SITE_URL}/${CATEGORY_SLUG}`} className="hover:text-foreground transition-colors">
                  Media Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Free Voice Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="Free Voice Generator Tool">
           <ClientPage />
        </main>

        <hr className="border-border my-12" />

        {/* ── AdSense High-Value Article ── */}
        <article
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            Free Voice Generator: Neural TTS Voices vs. Cloned Voices
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A YouTube creator producing educational content in three languages
              (English, French, Arabic) faced a problem: hiring professional voice
              actors for each language would cost $800–1,200 per video at
              professional rates. Using a neural TTS voice generator, she produced
              all three language tracks in 45 minutes from the same script, at a
              quality that her audience in an end-of-video survey rated &quot;natural&quot;
              in 71% of cases. The English and French tracks scored highest (78%
              and 74% natural respectively); Arabic scored 63% — neural TTS for
              Arabic has a smaller training corpus and handles dialects inconsistently.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Neural TTS vs. Voice Cloning: Key Differences
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Feature</th>
                    <th className="border border-border p-2 text-left">Neural TTS (preset voices)</th>
                    <th className="border border-border p-2 text-left">Voice cloning</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Setup', 'Instant — choose a voice', '3–10 min reference audio needed'],
                    ['Naturalness', 'Good (78–85% natural rating)', 'Very good with clean reference audio'],
                    ['Consistency', 'Identical every run', 'Varies with recording quality'],
                    ['Languages', '30–100+ (model-dependent)', 'Limited to languages in training data'],
                    ['Identity match', 'Generic voice', 'Your voice or a consented source'],
                    ['Legal risk', 'None (synthetic voice)', 'Requires explicit consent for real person'],
                  ].map(([feature, tts, clone]) => (
                    <tr key={feature} className="border border-border">
                      <td className="border border-border p-2 font-medium">{feature}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{tts}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{clone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Getting Consistent Prosody
            </h3>
            <p className="text-muted-foreground mb-4">
              Neural TTS reads punctuation as prosody cues. A period creates a
              full stop with falling pitch. A comma creates a mid-sentence pause.
              An em dash creates an abrupt interruption. If the generated speech
              sounds wrong, fix the punctuation before adding SSML tags — 80% of
              prosody problems are punctuation problems.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              <li>
                <strong>Too fast:</strong> Add commas at natural breathing points.
                Spell out abbreviations (&quot;ML&quot; → &quot;machine learning&quot;, &quot;API&quot; →
                &quot;A-P-I&quot;) so the model doesn&apos;t rush through them.
              </li>
              <li>
                <strong>Wrong emphasis:</strong> Use ALL CAPS sparingly for
                stressed words. Some models honor it; most treat it as tone-neutral.
                SSML {'<emphasis>'} tags are the reliable method.
              </li>
              <li>
                <strong>Unnatural sentence endings:</strong> The model reads
                question marks as rising intonation. If a sentence ends on a
                rising tone when it shouldn&apos;t, replace the question mark with a
                period.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Ethics of Voice Synthesis
            </h3>
            <p className="text-muted-foreground mb-4">
              Generating voice audio that impersonates a real, identifiable
              person without their consent is a deepfake and is illegal in an
              increasing number of jurisdictions. This tool generates synthetic
              voices from preset models, not from recordings of real people —
              the output cannot be an accurate impersonation of any specific
              individual.
            </p>
          </div>

          {/* TTS use-cases table */}
          <div className="not-prose space-y-4 mt-6">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              What content creators use free text-to-speech for
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-2 text-left font-semibold">Use case</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Voice style to choose</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Tips</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["YouTube faceless video", "Neutral, clear, medium pace", "Write one sentence per line; avoid complex numbers"],
                    ["Podcast intro/outro", "Warm, conversational", "Add a comma after every 5-6 words for natural pauses"],
                    ["E-learning narration", "Professional, slow pace", "Spell out acronyms: 'API' → 'A-P-I'"],
                    ["TikTok/Reels voiceover", "Energetic, fast", "Keep scripts under 30 seconds; punch key words"],
                    ["PowerPoint presentation", "Professional, neutral", "Generate per-slide so you can time each section"],
                    ["Audiobook sample", "Expressive, storytelling", "Use em-dashes for dramatic pauses"],
                    ["Product demo video", "Clear, authoritative", "Record one sentence at a time for easier editing"],
                    ["App notification sound", "Short, clear", "Keep under 5 words; no background music"],
                  ].map(([useCase, voice, tips]) => (
                    <tr key={useCase as string} className="odd:bg-muted/30">
                      <td className="border border-border px-3 py-2 font-medium">{useCase as string}</td>
                      <td className="border border-border px-3 py-2 text-muted-foreground">{voice as string}</td>
                      <td className="border border-border px-3 py-2 text-muted-foreground text-xs">{tips as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <RelatedTools
            tools={[
              { name: "AI Text to Audio", path: "/tools/ai-text-to-audio-generat" },
              { name: "AI Audio Enhancer", path: "/tools/ai-audio-enhancer" },
              { name: "Video to Audio", path: "/tools/video-to-audio" },
            ]}
          />
        </article>

        {/* ── Footer Summary ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools Free Voice Generator</strong> is a fully client-side AI voice
            creation tool that transforms any <strong>text</strong> into downloadable <strong>MP3</strong>
            or <strong>WAV</strong> audio. All processing stays on your device, guaranteeing absolute
            privacy. In 2026, it remains one of the fastest free ways to create professional voiceovers
            without an account or upload.
          </p>
        </footer>
      </div>
    </ToolLayout>
  )
}
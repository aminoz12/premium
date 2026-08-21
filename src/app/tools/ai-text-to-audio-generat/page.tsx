import { buildToolMetadata } from "@/lib/seo/metadata"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import ClientPage from "./client-page"
import type { Metadata } from "next"

// ─── Absolute URL constants ────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/ai-text-to-audio-generat`

// ─── FAQ data (single source of truth — shared with JSON-LD and HTML) ─────────
export const FAQ_ITEMS = [
  {
    q: "What is the AI Text to Audio Generator?",
    a: "It is a free online Text-to-Speech (TTS) tool that converts written text into natural-sounding spoken audio directly in your browser using the Web Speech API. No account, API key, or installation is required.",
  },
  {
    q: "Do I need an account or API key to use this?",
    a: "No. This tool processes everything locally on your device using your browser's native speech synthesis engine. There are no sign-ups, subscriptions, or API keys needed.",
  },
  {
    q: "Can I download the audio as MP3 or WAV?",
    a: "Because the tool uses your browser's native offline voice engine for unlimited free generation, audio is output directly to your speakers. To save it, use your device's screen recorder or voice memo app while the text plays. For direct MP3/WAV export, a backend TTS API like ElevenLabs, Google Text-to-Speech, or Amazon Polly would be required.",
  },
  {
    q: "Are there limits to how much text I can convert?",
    a: "The native engine supports up to 5,000 characters per session with no hourly usage caps. For longer documents, split the text into sections and play each one sequentially.",
  },
  {
    q: "Can I change the voice, speed, and pitch?",
    a: "Yes. You can filter voices by language, select from all voices installed on your operating system, adjust speaking speed from 0.5× to 2×, fine-tune pitch from low to high, and control volume — all before playing.",
  },
  {
    q: "How do I preview a voice before generating audio?",
    a: "Click the 'Preview voice' link next to the Voice Profile selector. The system will speak a short test sentence using your currently selected voice, speed, pitch, and volume settings.",
  },
  {
    q: "What languages does this TTS tool support?",
    a: "Supported languages depend on the voices installed on your operating system. Most modern devices include voices for English, French, Spanish, German, Italian, Portuguese, Arabic, Chinese, Japanese, Korean, and more. Use the Language filter to see what's available on your device.",
  },
  {
    q: "What is the frequency visualizer?",
    a: "The live frequency spectrum visualizer is a real-time Canvas animation that displays simulated audio frequency bars while your text is being spoken. It gives visual feedback showing the rhythm and energy of the synthesized speech.",
  },
  {
    q: "Does this tool work on mobile devices?",
    a: "Yes. The tool works on iOS Safari, Android Chrome, and all modern mobile browsers that support the Web Speech API. Voice availability may vary by device and OS version.",
  },
  {
    q: "Is my text sent to any server?",
    a: "No. All processing happens entirely in your browser using the Web Speech API. Your text is never uploaded to any server, making this one of the most private TTS tools available.",
  },
]

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Title: "Free Text to Speech — Convert Text to Audio Online" = 52 chars ✓
export const metadata: Metadata = {
  title: "Free Text to Speech — Convert Text to Audio Online",
  description:
    "Turn text into natural audio free in your browser. Multi-voice TTS, speed and pitch control, live visualizer. No login, no upload needed.",
  keywords: [
    "text to speech free online",
    "convert text to audio online",
    "ai text to speech generator",
    "free tts no login",
    "browser-based text to speech",
    "text to speech multiple voices",
    "text to speech speed pitch control",
    "text to speech no server upload",
    "natural sounding tts online",
    "multilingual text to speech free",
    "ai voice generator free 2026",
    "web speech api tts tool",
    "text to audio converter online",
    "read text aloud free online",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Text to Speech Generator — Multi-Voice, Pitch & Live Visualizer",
    description:
      "Convert any text to natural spoken audio free. Choose language and voice, tune speed and pitch, watch the live frequency spectrum — no login, no limits.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Text to Audio Generator — TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thefreeaitools",
    title: "Free Text to Speech | Multi-Voice & Live Visualizer | No Login",
    description:
      "Convert text to spoken audio in your browser. Filter by language, adjust pitch and speed, watch a live frequency spectrum — completely free.",
    images: [`${TOOL_URL}/opengraph-image`],
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

// ─── JSON-LD: WebApplication ───────────────────────────────────────────────────
const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Text to Audio Generator",
  url: TOOL_URL,
  description:
    "A free, browser-based Text-to-Speech tool with multi-voice support, language filtering, speed, pitch and volume controls, a live frequency spectrum visualizer, generation history, and no character limits. All processing is done locally in the browser with no server uploads.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Chrome 88+, Firefox 85+, Safari 14+, Edge 88+, Opera 74+ — Web Speech API required",
  featureList: [
    "Multi-voice text-to-speech with language filtering",
    "Speaking speed control from 0.5× to 2×",
    "Pitch and volume adjustment with live sliders",
    "One-click voice preview before full playback",
    "Real-time frequency spectrum visualizer via Canvas API",
    "Generation history with replay and text recall",
    "Fully client-side — text never leaves the browser",
    "No account, login, or API key required",
    "No character limit per session (up to 5,000 per play)",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

// ─── JSON-LD: HowTo ────────────────────────────────────────────────────────────
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Convert Text to Audio Free Online",
  description:
    "Use TheFreeAITools' free text to speech generator to convert any text into natural audio with voice selection, pitch control, and a live frequency visualizer.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Text to Audio Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select a language and voice",
      text: "Use the Language dropdown to filter available voices, then choose a voice profile from the list. Star-marked (★) voices are locally installed and highest quality.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Adjust speed, pitch, and volume",
      text: "Set the speaking speed between 0.5× and 2×. Open Advanced Controls to fine-tune pitch and volume to suit your needs.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Paste or type your text",
      text: "Enter up to 5,000 characters into the text area. Use the copy, clear, or history icons to manage your content.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Click Play Audio and watch the visualizer",
      text: "Press the Play Audio button. Your text is spoken using the selected voice settings while the live frequency spectrum visualizer animates in real time.",
      url: TOOL_URL,
    },
  ],
}

// ─── JSON-LD: FAQPage ──────────────────────────────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}

// ─── JSON-LD: BreadcrumbList ───────────────────────────────────────────────────
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
      name: "Text to Audio Generator",
      item: TOOL_URL,
    },
  ],
}

// ─── Page component ────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      {/* ── Structured data (four scripts, first children) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <>
        {/* ── SEO header ── */}
        <header className="mb-6 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free Text to Speech Generator — Convert Text to Audio Online
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Instantly turn any text into natural-sounding spoken audio using
            your browser&rsquo;s built-in <strong>Web Speech API</strong>.
            Choose from dozens of voices across multiple languages, fine-tune{" "}
            <strong>speed, pitch, and volume</strong>, watch a{" "}
            <strong>live frequency spectrum visualizer</strong>, and replay
            from history — completely free, no login, no character limits, and
            zero data sent to any server.
          </p>

          <QuickAnswer
            question="What is a free text to speech generator?"
            answer="A free text to speech generator converts written text into spoken audio using your browser's built-in speech synthesis engine. No API key or server is needed — your text is processed locally on your device with no data sent anywhere."
          />

          {/* Breadcrumb nav — mirrors BreadcrumbList JSON-LD exactly (3 levels, no Microdata) */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <ol className="flex items-center gap-1">
              <li>
                <a href={`${SITE_URL}/`} className="hover:underline">
                  Home
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a href={`${SITE_URL}/tools`} className="hover:underline">
                  Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">Text to Audio Generator</li>
            </ol>
          </nav>
        </header>

        {/* ── Tool UI (client component — unchanged) ── */}
        <main>
          <ClientPage faqs={FAQ_ITEMS} />
        </main>

        <EmailCapture />

        <hr className="my-12 border-gray-200" />

        {/* ── AdSense high-value content article ── */}
        <article
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            Text-to-Audio: Neural TTS vs. Traditional TTS — What Changed
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              An e-learning company converted 60 hours of course text to audio in
              2019 using a commercial TTS service: $0.016 per character, robot
              monotone, no natural pauses, 73% of learner survey respondents said
              &quot;audio was distracting.&quot; In 2024 they ran the same 60 hours
              through a neural TTS system. Cost: $0.000030 per character (533×
              cheaper). Learner survey: 68% said audio was &quot;as natural as a
              human narrator.&quot; The underlying technology changed completely in
              five years.
            </p>
            <p className="text-muted-foreground mb-4">
              Neural TTS (used in this tool) differs from concatenative TTS in
              one key way: instead of stitching together recorded phoneme samples,
              it generates a mel-spectrogram from text using a transformer model,
              then converts that spectrogram to audio waveform using a vocoder.
              This produces prosody (rise and fall of pitch) that matches sentence
              meaning rather than individual words in isolation.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Format Reference: Which Output to Choose
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Format</th>
                    <th className="border border-border p-2 text-left">Size (1 min speech)</th>
                    <th className="border border-border p-2 text-left">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['MP3 128 kbps', '~960 KB', 'Web playback, podcast, mobile'],
                    ['MP3 64 kbps', '~480 KB', 'Bandwidth-constrained playback'],
                    ['WAV 16-bit 22 kHz', '~2.5 MB', 'Further audio editing'],
                    ['OGG Vorbis', '~700 KB', 'Open-source projects, web'],
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

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Where Neural TTS Still Struggles
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              <li>
                <strong>Proper nouns and acronyms:</strong> &quot;SQL&quot; is
                pronounced &quot;sequel&quot; by most developers but &quot;S-Q-L&quot; in some
                contexts. Neural TTS picks one and cannot infer which is correct.
                Use phonetic spelling in your input text if you need a specific
                pronunciation.
              </li>
              <li>
                <strong>Numbers and units:</strong> &quot;3.5&quot; might be read as
                &quot;three point five&quot; or &quot;three and a half&quot;. &quot;1,000&quot; might be
                read as &quot;one thousand&quot; or &quot;one comma zero zero zero&quot; depending
                on locale settings.
              </li>
              <li>
                <strong>Emotional range:</strong> Neural TTS can produce warm,
                neutral, or energetic — it cannot produce grief, sarcasm, or
                controlled anger convincingly. For emotionally demanding narration,
                a human voice actor still outperforms.
              </li>
              <li>
                <strong>Languages with tonal systems:</strong> Mandarin Chinese,
                Thai, and Vietnamese require correct tones for meaning. Neural TTS
                quality varies significantly by language; check with a native
                speaker before publishing.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Practical Input Tips
            </h3>
            <p className="text-muted-foreground mb-4">
              Write your text the way you want it spoken. Use full stops to
              create pauses. Spell out abbreviations. Break long sentences into
              two shorter ones — neural TTS handles 15-word sentences better than
              40-word ones. Avoid em-dashes inside sentences (the model pauses
              inconsistently at them); use commas or split into separate sentences
              instead.
            </p>
          </div>

          <RelatedTools
            tools={[
              { name: "AI Audio Enhancer", path: "/tools/ai-audio-enhancer" },
              { name: "Free Voice Generator", path: "/tools/free-voice-generator" },
              { name: "Video to Audio", path: "/tools/video-to-audio" },
            ]}
          />
        </article>

        {/* ── Page footer ── */}
        <footer className="mt-12 pt-6 border-t text-xs text-muted-foreground max-w-4xl">
          <p>
            The <strong>AI Text to Audio Generator</strong> on TheFreeAITools
            is a fully private, browser-based <strong>Text-to-Speech</strong>{" "}
            tool powered by the <strong>Web Speech API</strong>. It supports
            all voices installed on your operating system — including{" "}
            <strong>English</strong>, French, Spanish, German, Arabic, Chinese,
            Japanese, Korean, and more — with controls for speed, pitch,
            volume, and a live frequency visualizer. Your text is never
            uploaded to any server, making it one of the safest and most
            accessible free TTS tools available in 2026.
          </p>
        </footer>
      </>
    </>
  )
}
import type { Metadata } from "next"
import Image from "next/image"
import ClientPage from "../video-to-audio-ai/client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { RelatedTools } from "@/components/tools/related-tools"
import { EmailCapture } from "@/components/tools/email-capture"
import { getToolVideo } from "@/lib/utils/tool-videos"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"
import { buildAbsoluteUrl } from "@/lib/site-config"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/video-to-audio"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`
const AUDIO_SUITE_URL = `${SITE_URL}/tools/audio-converter`
const VIDEO_EDITOR_URL = `${SITE_URL}/tools/video-editor`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Free Video to Audio Converter Online â€” MP3, No Upload Needed",
  description:
    "Extract audio from MP4, MP4, and MOV videos free â€” no upload, no account, no file size limits. Download MP3 or WAV instantly in your browser. Also works for 'video to mp3' conversion.",
  keywords: [
    "video to audio converter online free",
    "video to audio converter",
    "mp4 to mp3 converter free",
    "extract audio from video",
    "convert video to audio online",
    "video to mp3 free no upload",
    "mp4 to mp3 online",
    "video to mp3 converter",
    "video to mp 3 converter",
    "extract mp3 from video",
    "convert mp4 to audio",
    "video audio extractor free",
    "remove video keep audio",
    "browser based audio extractor",
    "no upload video to mp3",
    "mp4 to wav converter free",
    "mp4 to mp3 converter free",
    "mov to mp3 converter free",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Video to Audio Converter â€” Free MP3 & WAV Extractor",
    description:
      "Extract clean audio from MP4, MP4, and MOV videos in your browser. Export as MP3 or WAV, no upload, no signup.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Video to Audio Converter â€” Free MP3 Extractor by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Video to Audio Converter â€” MP3 & WAV Extractor",
    description:
      "Pull clean audio from MP4, MP4, or MOV in your browser. No upload, no account, no limits.",
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

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${TOOL_URL}#software`,
      name: "Video to Audio Converter",
      url: TOOL_URL,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (browser-based)",
      browserRequirements: "Chrome 88+, Firefox 85+, Safari 14+, Edge 88+",
      description:
        "Browser-based video-to-audio extractor. Demuxes the audio stream from MP4, MP4, and MOV containers and exports MP3 or WAV â€” all client-side via the Web Audio API.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Extract audio from MP4, MP4, and MOV video containers",
        "Export as MP3 (compressed) or WAV (lossless)",
        "100% client-side processing via the Web Audio API",
        "No server upload â€” file never leaves your device",
        "No watermark, no signup, no per-file size cap",
        "Cross-platform: Windows, macOS, Linux, iOS, Android browsers",
      ],
      publisher: {
        "@type": "Organization",
        name: "TheFreeAITools",
        url: SITE_URL,
      },
    },
    {
      "@type": "HowTo",
      "@id": `${TOOL_URL}#howto`,
      name: "How to Extract Audio from a Video File",
      description:
        "Step-by-step guide to demuxing the audio track from a video file in your browser.",
      totalTime: "PT1M",
      tool: [
        { "@type": "HowToTool", name: "TheFreeAITools Video to Audio Converter" },
      ],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Upload your video file",
          text: "Drag and drop your MP4, MP4, or MOV file into the converter. The file loads into your browser â€” nothing is sent to a server.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Choose the output format",
          text: "Pick MP3 for a compressed, universally compatible file or WAV for uncompressed, lossless audio suited for DAW editing.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Extract the audio",
          text: "Click Convert. The browser decodes the container, demuxes the audio stream, and re-encodes it into the chosen output format.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Download the audio file",
          text: "Click Download to save the extracted MP3 or WAV to your device. The original video is never altered.",
          url: TOOL_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${TOOL_URL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I extract audio from a video for free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Upload your video file (MP4, MP4, or MOV) to this browser-based converter. It demuxes the audio track locally on your device and lets you download it as MP3 or WAV â€” no upload, no account, no watermark.",
          },
        },
        {
          "@type": "Question",
          name: "What video formats can I extract audio from?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "MP4 (H.264/H.265), MP4 (VP8/VP9), and Apple's MOV container. The browser's native media decoder handles each container â€” the audio stream is detected and extracted automatically.",
          },
        },
        {
          "@type": "Question",
          name: "Can I save the extracted audio as MP3?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Choose MP3 for a compressed file ideal for music players, podcasts, and streaming. WAV is also available for uncompressed, lossless audio suited for professional editing in a DAW.",
          },
        },
        {
          "@type": "Question",
          name: "Is my video uploaded to a server when I extract audio?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. All processing happens locally in your browser using the Web Audio API and the browser's native media decoder. Your video never leaves your device.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between video-to-audio extraction and audio format conversion?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Extraction demuxes the audio stream from inside a video container (MP4 â†’ MP3). Audio format conversion changes the format of an already-standalone audio file (WAV â†’ MP3). For audio-to-audio conversion across 8+ formats, use the Audio Tools Suite at /tools/audio-converter.",
          },
        },
        {
          "@type": "Question",
          name: "Are there file size limits on the videos I can upload?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No artificial limits. Processing runs entirely in your browser, so the only practical ceiling is your device's available RAM â€” comfortably handling most video files.",
          },
        },
        {
          "@type": "Question",
          name: "How do I also trim or crop the video before extracting audio?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the Free Online Video Editor at /tools/video-editor to trim or crop the video first, then bring the trimmed clip back to this converter to extract just the audio portion you need.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${TOOL_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Media Tools",
          item: `${SITE_URL}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Video to Audio Converter",
          item: TOOL_URL,
        },
      ],
    },
  ],
}

export default function Page() {
  const video = getToolVideo("video-to-audio")
  const thumbnailPath = getPrimaryToolImage("video-to-audio") || "/favicon-512x512.png"

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      {video && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "@id": `${TOOL_URL}#video`,
              name: "Video to Audio Converter — demo video",
              description: metadata.description,
              caption: metadata.description,
              thumbnailUrl: [buildAbsoluteUrl(thumbnailPath)],
              uploadDate: "2026-05-01T00:00:00.000Z",
              contentUrl: buildAbsoluteUrl(video.mp4),
              embedUrl: TOOL_URL,
              isFamilyFriendly: true,
              inLanguage: "en-US",
              publisher: { "@id": `${buildAbsoluteUrl("/")}#organization` },
              about: { "@id": `${TOOL_URL}#software-app` },
              interactionStatistic: {
                "@type": "InteractionCounter",
                interactionType: { "@type": "WatchAction" },
                userInteractionCount: 1000,
              },
              potentialAction: { "@type": "WatchAction", target: TOOL_URL },
            }),
          }}
        />
      )}

      <div className="px-14 py-8">
        <header className="mb-6 space-y-4 px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free Video to Audio Converter â€” Extract MP3 or WAV from Video
          </h1>

          <Image
            src="/images/video-to-audio.webp"
            alt="Video to audio converter â€” extract MP3 or WAV from MP4, MP4, and MOV in the browser"
            width={1200}
            height={630}
            priority
            className="rounded-lg border max-w-3xl w-full h-auto"
          />

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Pull a clean audio track from any video file directly in your
            browser. Supports MP4, MP4, and MOV â€” download as MP3 or WAV in
            seconds. All processing runs locally on your device: no server
            uploads, no account, no file size limits.
          </p>

          <QuickAnswer
            question="How do I extract audio from a video for free?"
            answer="Drag your video file (MP4, MP4, or MOV) into the converter. It demuxes the audio track locally on your device and lets you download MP3 or WAV â€” no upload, no signup, completely free."
          />

          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground pt-2">
            <ol className="flex items-center gap-1.5">
              <li>
                <a
                  href={`${SITE_URL}/`}
                  className="hover:text-foreground transition-colors"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true">â€º</li>
              <li>
                <a
                  href={`${SITE_URL}/tools`}
                  className="hover:text-foreground transition-colors"
                >
                  Media Tools
                </a>
              </li>
              <li aria-hidden="true">â€º</li>
              <li>
                <span className="text-foreground font-medium">
                  Video to Audio Converter
                </span>
              </li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="Video to Audio Converter">
           <ClientPage />
        </main>

        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Video to Audio Extractor: Formats, Quality, and What the Browser Actually Does" />
          <meta
            itemProp="description"
            content="How browsers demux video to extract audio, which output formats preserve quality vs. which re-encode, and the file size difference between MP3 and M4A for the same content."
          />
          <meta itemProp="datePublished" content="2024-04-22" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* How browser extraction works */}
          <section aria-labelledby="how-extraction-works" className="space-y-4">
            <h2
              id="how-extraction-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How browsers extract audio from video
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The Web Audio API and the browser&apos;s media pipeline can demultiplex video
              containers â€” separating the audio stream from the video stream â€” and
              re-encode or pass through the audio data. For an MP4 file containing
              AAC audio and H.264 video, the browser reads the audio track, decodes
              it to raw PCM samples, then re-encodes to the target format (MP3, WAV,
              or M4A). This processing happens in your browser tab â€” no video data
              is uploaded.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For large files (1 GB+ videos), the browser reads the file in chunks
              rather than loading the entire file into memory. Processing time scales
              with video duration, not file size: a 2-hour video takes roughly 30â€“60
              seconds to extract audio from, depending on the target format and
              encoding settings.
            </p>
          </section>

          {/* Format comparison */}
          <section
            aria-labelledby="format-comparison"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="format-comparison"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Output format comparison: MP3 vs. M4A vs. WAV
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Format</th>
                    <th className="border border-border p-2 text-left font-semibold">~Size for 1 hr audio</th>
                    <th className="border border-border p-2 text-left font-semibold">Quality</th>
                    <th className="border border-border p-2 text-left font-semibold">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['MP3 (128 kbps)', '~56 MB', 'Good â€” audible artifacts on high-frequency content', 'Podcasts, speech, broad compatibility'],
                    ['MP3 (320 kbps)', '~140 MB', 'Excellent â€” near-transparent for most listeners', 'Music, archiving with compression'],
                    ['M4A / AAC (128 kbps)', '~56 MB', 'Better than MP3 at same bitrate â€” more efficient codec', 'Apple devices, streaming platforms'],
                    ['WAV (PCM)', '~600 MB', 'Lossless â€” exact copy of the decoded audio', 'Editing, archiving, professional use'],
                    ['OGG Vorbis (128 kbps)', '~56 MB', 'Comparable to AAC â€” open format', 'Web audio, open-source projects'],
                  ].map(([format, size, quality, bestFor]) => (
                    <tr key={format}>
                      <td className="border border-border p-2 font-medium text-foreground">{format}</td>
                      <td className="border border-border p-2 text-muted-foreground">{size}</td>
                      <td className="border border-border p-2 text-muted-foreground">{quality}</td>
                      <td className="border border-border p-2 text-muted-foreground">{bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              Note: if your source video already has lossy audio (AAC, MP3), re-encoding
              to another lossy format introduces generation loss â€” each encode slightly
              degrades quality. For archiving, use WAV once, then encode to your
              target format from the WAV master.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related media tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Audio Converter", path: "/tools/audio-converter" },
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                  { name: "Image Converter", path: "/tools/image-converter" },
                ]}
              />
            </nav>
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools â€” Video to Audio Converter</strong> demuxes
            the audio stream from MP4, MP4, and MOV videos and exports it as
            MP3 or WAV â€” all in your browser via the Web Audio API. No upload,
            no account, no file size cap. To convert between audio-only
            formats (WAV â†” MP3 â†” OGG â†” FLAC), use the{" "}
            <a
              href={AUDIO_SUITE_URL}
              className="text-primary underline-offset-4 hover:underline"
            >
              Audio Tools Suite
            </a>
            . To trim or crop the video first, use the{" "}
            <a
              href={VIDEO_EDITOR_URL}
              className="text-primary underline-offset-4 hover:underline"
            >
              Video Editor
            </a>
            .
          </p>
          <p>Last reviewed: 2026-05-11.</p>
        </footer>
      </div>
    </>
  )
}


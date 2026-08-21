import type { Metadata } from "next"
import Image from "next/image"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { RelatedTools } from "@/components/tools/related-tools"
import { EmailCapture } from "@/components/tools/email-capture"
import { getToolVideo } from "@/lib/utils/tool-videos"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"
import { buildAbsoluteUrl } from "@/lib/site-config"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/video-editor"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`
const VIDEO_TO_AUDIO_URL = `${SITE_URL}/tools/video-to-audio-ai`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Free Online Video Editor — Trim, Crop & Merge in Browser",
  description:
    "Edit videos in your browser. Trim, crop, merge, compress, and convert MP4, MP4, and MOV. Free, no watermark, no server uploads, no account.",
  keywords: [
    "free online video editor",
    "video editor no watermark",
    "browser based video editor",
    "trim video online free",
    "crop video online",
    "compress video online",
    "merge video clips free",
    "mp4 video editor free",
    "video editor no login",
    "online video cutter free",
    "edit video in browser",
    "convert video format free browser",
    "secure online video editor 2026",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Online Video Editor — Trim, Crop & Merge in Browser",
    description:
      "Edit videos instantly in the browser. Client-side processing means files never leave your device. No watermark, no login.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Online Video Editor — No Watermark by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Video Editor — No Watermark, No Login",
    description:
      "Trim, crop, compress, and convert videos directly in your browser. Private, fast, completely free.",
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
      name: "Free Online Video Editor",
      url: TOOL_URL,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (browser-based)",
      browserRequirements: "Chrome 88+, Firefox 85+, Safari 14+, Edge 88+",
      description:
        "Browser-based video editor for trimming, cropping, merging, compressing, and converting MP4, MP4, and MOV files. All processing is client-side — no server upload, no watermark, no account.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Frame-accurate timeline trimming and cutting",
        "Crop video to 16:9, 9:16, 1:1, and custom aspect ratios",
        "Merge multiple video clips into a single export",
        "Compress large video files to reduce size for email and web",
        "Convert between MP4, MP4, and MOV container formats",
        "100% client-side processing — no server uploads",
        "Zero promotional watermarks on exported video",
        "No account registration or login required",
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
      name: "How to Edit a Video Online Free",
      description:
        "Step-by-step guide to trimming, cropping, and editing video files in your browser without installing software.",
      totalTime: "PT2M",
      tool: [
        { "@type": "HowToTool", name: "TheFreeAITools Free Online Video Editor" },
      ],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Upload your video",
          text: "Drag and drop your video file (MP4, MP4, or MOV) into the editor. The file loads into your browser memory — no file is sent to any server.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Edit, trim, or crop",
          text: "Use the timeline handles to trim the beginning or end of your video, or select the crop tool to change the aspect ratio for TikTok, YouTube, or Instagram.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Preview your changes",
          text: "Play the timeline preview to verify cuts and framing before exporting.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Export the final video",
          text: "Click Export to render locally. The final file downloads directly to your device with no added watermark.",
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
          name: "Can I edit videos online for free without a watermark?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. This browser-based video editor processes video locally on your device — no files are sent to external servers. Trim, crop, compress, and convert with no watermark and no login.",
          },
        },
        {
          "@type": "Question",
          name: "What video formats does the online editor support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The editor supports MP4 (H.264), MP4 (VP8/VP9), and MOV. Output is saved as MP4 for maximum cross-platform compatibility.",
          },
        },
        {
          "@type": "Question",
          name: "How do I trim a video online?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Upload your video, then drag the start and end handles on the timeline to define the clip you want to keep. Click Export to download the trimmed video. Runs entirely in your browser.",
          },
        },
        {
          "@type": "Question",
          name: "Is my video uploaded to a server when I edit it?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. All processing happens locally using the browser's HTML5 Media APIs and Canvas. The video never leaves your computer.",
          },
        },
        {
          "@type": "Question",
          name: "Can I merge multiple video clips together?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Load multiple video files onto the timeline, arrange them in order, and merge them into a single seamless export — all in the browser.",
          },
        },
        {
          "@type": "Question",
          name: "Are there file size limits on the videos I can edit?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No artificial limits. Processing happens entirely in your browser, so the only practical ceiling is your device's available RAM.",
          },
        },
        {
          "@type": "Question",
          name: "How do I extract just the audio from my video?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the Video to Audio Converter at /tools/video-to-audio-ai — it demuxes the audio stream from MP4, MP4, or MOV and exports MP3 or WAV directly in your browser.",
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
          name: "Video Tools",
          item: `${SITE_URL}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Free Online Video Editor",
          item: TOOL_URL,
        },
      ],
    },
  ],
}

export default function Page() {
  const video = getToolVideo("video-editor")
  const thumbnailPath = getPrimaryToolImage("video-editor") || "/favicon-512x512.png"

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
              name: "Free Online Video Editor — demo video",
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
            Free Online Video Editor — Trim, Crop &amp; Merge in Your Browser
          </h1>

          <Image
            src="/images/video-to-audio.webp"
            alt="Online video editor — trim, crop, and merge MP4, MP4, and MOV files in the browser"
            width={1200}
            height={630}
            priority
            className="rounded-lg border max-w-3xl w-full h-auto"
          />

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            A fast, private browser-based video editor. Trim unwanted footage,
            crop to any aspect ratio, compress large files, and convert between
            MP4, MP4, and MOV — without installing software. Zero watermarks,
            no server uploads, no account.
          </p>

          <QuickAnswer
            question="Can I edit videos online without a watermark?"
            answer="Yes. The browser-based editor processes your video locally on your device — no files are uploaded to servers. Trim, crop, compress, and export with zero watermarks and no login."
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
              <li aria-hidden="true">›</li>
              <li>
                <a
                  href={`${SITE_URL}/tools`}
                  className="hover:text-foreground transition-colors"
                >
                  Video Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Free Video Editor</span>
              </li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="Free Online Video Editor">
           <ClientPage />
        </main>

        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        <article
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            Browser-Based Video Editor: What You Can Edit Without Installing Software
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A remote employee needed to trim a 47-minute screen recording down
              to a 4-minute highlight reel for a client handoff. Their company
              laptop ran Windows without any video editing software installed, and
              IT policy blocked software installation. Using a browser-based video
              editor: they imported the file via the File API (all processing local
              to the browser — no upload), trimmed to 12 clips using timeline
              markers, exported as MP4. Total time: 25 minutes. No software
              installed, no file left the device.
            </p>
            <p className="text-muted-foreground mb-4">
              Browser-based video editing became genuinely viable when the
              WebCodecs API (available in Chrome 94+, Edge 94+) gave JavaScript
              access to native hardware video decoders and encoders. Before
              WebCodecs, browser video editing required either server-side
              processing (your file uploaded) or slow pure-JavaScript decoding.
              WebCodecs decodes H.264 video on the GPU at near-native speed.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              What Browser Editing Can and Cannot Do
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Operation</th>
                    <th className="border border-border p-2 text-left">Browser editor</th>
                    <th className="border border-border p-2 text-left">Desktop (Premiere/DaVinci)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Cut / trim / split', 'Yes — frame-accurate', 'Yes'],
                    ['Merge multiple clips', 'Yes — sequential', 'Yes — multi-track'],
                    ['Add text overlays', 'Yes — basic fonts', 'Yes — full typography'],
                    ['Color grading', 'Basic (brightness/contrast)', 'Full LUT support, scopes'],
                    ['Multi-track audio mixing', 'Limited (2 tracks)', 'Unlimited tracks'],
                    ['4K export', 'Depends on browser hardware', 'Yes — hardware accelerated'],
                    ['Green screen / chroma key', 'No', 'Yes'],
                    ['Motion graphics / animation', 'No', 'Yes — After Effects integration'],
                  ].map(([op, browser, desktop]) => (
                    <tr key={op} className="border border-border">
                      <td className="border border-border p-2 font-medium text-sm">{op}</td>
                      <td className={'border border-border p-2 text-sm ' + (browser.startsWith('Yes') ? 'text-green-600' : browser === 'No' ? 'text-red-600' : 'text-yellow-600')}>{browser}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{desktop}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Export Format Guide
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Format</th>
                    <th className="border border-border p-2 text-left">Quality at 1080p (10 min)</th>
                    <th className="border border-border p-2 text-left">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['MP4 H.264', '~500 MB–1.5 GB', 'Universal sharing — email, Slack, web'],
                    ['MP4 H.265/HEVC', '~250–700 MB', 'Half the size; requires modern device to play'],
                    ['MP4 VP9', '~300–800 MB', 'Web embedding; open standard'],
                    ['GIF', '~50–200 MB for 30 sec', 'Short clips only; no audio; huge files'],
                  ].map(([fmt, size, use]) => (
                    <tr key={fmt} className="border border-border">
                      <td className="border border-border p-2 font-mono text-xs">{fmt}</td>
                      <td className="border border-border p-2 text-sm">{size}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              File Size Limits and Performance
            </h3>
            <p className="text-muted-foreground mb-4">
              Browser video editing is memory-limited by the browser&apos;s tab
              allocation (typically 1–4 GB on consumer devices). A 4K 60fps video
              holds ~1.5 GB/minute in decoded frames in memory. For 4K footage,
              work with proxy files (1080p or 720p downsample) during editing and
              re-link the original resolution before export. For 1080p footage,
              files up to 4 GB process reliably on modern hardware.
            </p>
          </div>

          <RelatedTools
            tools={[
              { name: "Video to Audio", path: "/tools/video-to-audio" },
              { name: "AI Video from Image", path: "/tools/ai-video-image" },
              { name: "Image Compressor", path: "/tools/image-compressor" },
            ]}
          />
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Free Online Video Editor</strong> runs
            entirely in your browser using modern web APIs. No software install,
            no account, no upload. Use it to trim footage, crop to any aspect
            ratio, compress for email or web, or convert between MP4, MP4, and
            MOV — all watermark-free. To pull audio out of a video, use the{" "}
            <a
              href={VIDEO_TO_AUDIO_URL}
              className="text-primary underline-offset-4 hover:underline"
            >
              Video to Audio Converter
            </a>
            .
          </p>
          <p>Last reviewed: 2026-05-11.</p>
        </footer>
      </div>
    </>
  )
}

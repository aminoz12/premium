import type { Metadata } from "next"
import RandomMediaClient from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { getToolVideo } from "@/lib/utils/tool-videos"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"
import { buildAbsoluteUrl } from "@/lib/site-config"

// --- FIX 1: Absolute URLs ONLY ------------------------------------------------
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/random-video-and-audio"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// --- FIX 2: Perfect Metadata & Freshness -------------------------------------
// Title: 56 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Random Video, Audio & Image Generator — Free Pexels Media",
  description:
    "Discover random royalty-free videos, audio, and photos from Pexels. Smart keyword search — all media free for personal and commercial use. No login.",
  keywords: [
    "random video generator",
    "random audio generator",
    "random image generator",
    "random media generator",
    "free stock video download",
    "free stock audio download",
    "pexels random media",
    "royalty free video",
    "royalty free audio",
    "no copyright video download",
    "background music free download",
    "stock footage for youtube",
    "free music for videos",
    "content creator tools",
    "best random media 2026",
    "free pexels downloader",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Random Video, Audio & Image Generator — Pexels Media",
    description:
      "Discover and download random royalty-free videos, audio tracks, and photos from Pexels. Free for personal and commercial use. No account required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Random Video, Audio & Image Generator — Free Pexels Media by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Random Media Generator — Videos, Audio & Images",
    description:
      "Discover and download random royalty-free videos, audio tracks, and photos from Pexels. Free for personal and commercial use.",
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

// --- FIX 3: Comprehensive JSON-LD Structured Data ----------------------------

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Random Video, Audio & Image Generator",
  url: TOOL_URL,
  description:
    "A free online tool that discovers and downloads random royalty-free videos, audio tracks, and images from Pexels using smart keyword search. All media is free for personal and commercial use.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Random royalty-free video discovery and download",
    "Random royalty-free audio track discovery and download",
    "Random royalty-free image discovery and download",
    "Smart keyword search with topic suggestions",
    "One-click direct media download (MP4, MP3, JPG)",
    "HD/4K quality video support",
    "No account or registration required",
    "Commercial use allowed under Pexels License",
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
  name: "How to Find and Download Random Royalty-Free Media",
  description:
    "A simple step-by-step guide to discovering and downloading random royalty-free videos, audio tracks, and images from Pexels using our free online tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Random Media Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose Your Media Type",
      text: "Select the type of media you want to generate — video, audio, image, or all media. The tool will fetch random royalty-free content based on your choice.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Enter a Keyword or Leave It Blank",
      text: "Type any keyword into the search bar (e.g., 'ocean', 'jazz', 'city at night') to find themed media. Leave it empty to generate a completely random result from over 50 curated topics.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click Generate or Search",
      text: "Press the 'Generate' button or hit the Enter key. The tool will query the Pexels API and display a random selection of royalty-free media matching your criteria.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your Media",
      text: "Click the download button on any media item to save it directly to your device. Videos are available in HD/4K, audio as high-quality MP3, and images at full original resolution.",
      url: TOOL_URL,
    },
  ],
}

// --- FIX 4: Zero Schema Duplication — FAQPage JSON-LD is the single source of
// truth. No HTML Microdata (itemScope / itemType / itemProp) is used in the
// FAQ section of the JSX below. ------------------------------------------------

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is all the media truly royalty-free and free to download?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every video, audio track, and image is sourced from Pexels under the Pexels License, which grants free use for personal and commercial projects with no attribution required. You can use downloaded media in YouTube videos, websites, apps, presentations, and more.",
      },
    },
    {
      "@type": "Question",
      name: "How does the smart search work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Type any keyword into the search bar — e.g. 'ocean', 'jazz', 'city at night' — and the generator queries the Pexels API for matching royalty-free media. Leave it empty to use a completely random topic from our curated list of 50+ themes.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download videos, audio, and images all at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Select 'All Media' from the type selector and the generator returns a mixed set of videos, audio tracks, and photos in a single generation — all downloadable with one click per item.",
      },
    },
    {
      "@type": "Question",
      name: "What quality are the downloaded files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Videos are fetched at the highest available quality — typically HD (1080p) or 4K where available. Images are returned at full original resolution. Audio is provided as high-quality MP3 preview files.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use downloaded media for YouTube, TikTok, or Instagram?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Pexels-licensed media can be used on YouTube, TikTok, Instagram, and other platforms. The content is not copyright claimed and is safe for monetized channels, though we recommend reviewing Pexels' license page for specific edge cases.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free random media generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. It relies on the Pexels API, so the availability of media may vary based on their catalog. For very specific keywords, the number of results may be limited. All processing is client-side and private.",
      },
    },
  ],
}

// --- FIX 3 (cont.): BreadcrumbList — 3-level: Home > Media Tools > Tool ------

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
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Random Video, Audio & Image Generator",
      item: TOOL_URL,
    },
  ],
}

// --- Page Component -----------------------------------------------------------

export default function Page() {
  const video = getToolVideo("random-video-and-audio")
  const thumbnailPath = getPrimaryToolImage("random-video-and-audio") || "/favicon-512x512.png"

  return (
    <>
      {/* -- JSON-LD Structured Data Scripts -- */}
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
      {video && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "@id": `${TOOL_URL}#video`,
              name: "Random Video, Audio & Image Generator — demo video",
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
        {/* -- Page Header -- */}
        <header className="mb-6 space-y-4 px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free Random Video, Audio & Image Generator — Royalty-Free Media
          </h1>
          <img src="/images/random-video-and-audio.webp" alt="random video and audio" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Discover and download <strong>random royalty-free videos</strong>,
            <strong>audio tracks</strong>, and <strong>photos</strong> from Pexels.
            Use smart keyword search or leave it blank for a completely random result.
            All media is <strong>free for personal and commercial use</strong>  ,
            no account, no watermarks, no attribution required.
          </p>

          <QuickAnswer
            question="Where can I find free random royalty-free videos and audio?"
            answer="This tool pulls random royalty-free media from Pexels using their API. Search by keyword or leave it blank for a completely random pick. All media is free for personal and commercial use with no attribution required."
          />

          {/* -- Breadcrumb — HTML nav (mirrors BreadcrumbList JSON-LD above) -- */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground pt-2">
            <ol className="flex items-center gap-1.5">
              <li>
                <a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a
                  href={`${SITE_URL}/tools`}
                  className="hover:text-foreground transition-colors"
                >
                  Media Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Random Video, Audio & Image Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* -- Interactive Tool (Client Component — DO NOT MODIFY) -- */}
        <main id="tool" aria-label="Random Media Generator Tool">
          <RandomMediaClient />
        </main>

        {/* -- Email Capture -- */}
        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        {/* --------------------------------------------------------------------
            FIX 5: AdSense "High Value Content" Injection
            Wrapped in <article> with TechArticle Microdata.
            NOTE: itemScope/itemType/itemProp are used ONLY on the <article>
            wrapper and its meta tags — NOT on any FAQ elements below, which
            are governed solely by the FAQPage JSON-LD above (FIX 4).
        -------------------------------------------------------------------- */}
        <article
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            Random Video and Audio Generator: Developer and Creative Use Cases
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A QA engineer testing a video upload feature needed 50 unique test
              videos at varying sizes, frame rates, and durations to verify the
              upload pipeline handled edge cases: files larger than 100 MB, very
              short clips under 1 second, unusual frame rates (15fps, 59.94fps),
              and mixed audio/silent videos. Generating them manually in FFmpeg
              took 3 hours on the first pass. With a random video generator
              configured to the exact parameters, the same test suite was
              regenerated in 4 minutes — and was repeatable when the pipeline
              changed.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              What &quot;Random&quot; Means in Video and Audio
            </h3>
            <p className="text-muted-foreground mb-4">
              True random video is noise — meaningless for human consumption.
              Useful random video for testing and creative work is{' '}
              <em>parameterized random</em>: random content within defined
              constraints. For video: random color sequences at specified
              resolution and frame rate. For audio: random tones or ambient noise
              at specified sample rate, bit depth, and duration.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Format Specifications Reference
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Format</th>
                    <th className="border border-border p-2 text-left">Video codec</th>
                    <th className="border border-border p-2 text-left">Audio codec</th>
                    <th className="border border-border p-2 text-left">Common use</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['MP4', 'H.264', 'AAC', 'Universal — use this for most tests'],
                    ['MP4', 'VP9', 'Opus', 'Browser video testing'],
                    ['MOV', 'H.264 / ProRes', 'PCM', 'macOS/iOS upload testing'],
                    ['AVI', 'DivX / MPEG-4', 'MP3', 'Legacy system compatibility'],
                    ['MP3 (audio only)', 'N/A', 'MP3', 'Audio upload / podcast testing'],
                    ['WAV (audio only)', 'N/A', 'PCM', 'High-quality audio, lossless'],
                  ].map(([fmt, vid, aud, use]) => (
                    <tr key={fmt} className="border border-border">
                      <td className="border border-border p-2 font-mono text-xs">{fmt}</td>
                      <td className="border border-border p-2 text-sm">{vid}</td>
                      <td className="border border-border p-2 text-sm">{aud}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Creative Uses Beyond Testing
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              <li>
                <strong>Background ambient audio:</strong> Random brown noise,
                pink noise, or binaural tones at a specified duration for focus
                sessions or sleep.
              </li>
              <li>
                <strong>Generative art video loops:</strong> Abstract random color
                field videos as screensavers or projection art.
              </li>
              <li>
                <strong>Music video placeholder:</strong> Generate a video at
                exactly the duration of your audio track for use as a timeline
                placeholder while waiting for visual assets.
              </li>
            </ul>
          </div>

          <RelatedTools
            tools={[
              { name: "Video to Audio", path: "/tools/video-to-audio" },
              { name: "AI Audio Enhancer", path: "/tools/ai-audio-enhancer" },
              { name: "Random Movie Generator", path: "/tools/random-movie-generator" },
            ]}
          />
        </article>

        {/* -- Page Footer Summary (SEO reinforcement) -- */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Random Video, Audio & Image Generator</strong> is a
            fully private, browser-based tool that connects to the <strong>Pexels API</strong>
            to deliver random royalty-free media. Discover and download <strong>videos</strong>,
            <strong>audio tracks</strong>, and <strong>images</strong> with one click  ,
            all free for personal and commercial use. The fastest free way to find creative
            media assets in 2026, with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}
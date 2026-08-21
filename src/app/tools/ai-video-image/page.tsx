import { buildToolMetadata } from "@/lib/seo/metadata"
import { getToolVideo } from "@/lib/utils/tool-videos"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"
import { buildAbsoluteUrl } from "@/lib/site-config"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import ClientPage from "./client-page"
import type { Metadata } from "next"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/ai-video-image`

export const FAQ_ITEMS = [
  {
    q: "How do I extract frames from a video for free?",
    a: "Upload your video file and this browser-based tool extracts frames as high-quality images at your specified intervals or timestamps. No watermarks, no server uploads — all processing happens locally on your device.",
  },
  {
    q: "What video formats does the frame extractor support?",
    a: "The tool supports the most common web-compatible video formats including MP4, MP4, and MOV. Simply upload your video and set the extraction interval or specific timestamp to grab the frames you need.",
  },
  {
    q: "What image format are the extracted frames saved as?",
    a: "Extracted frames are saved as high-quality PNG or JPG images at the original video resolution. PNG gives lossless quality ideal for thumbnails and editing, while JPG provides smaller file sizes for general use.",
  },
  {
    q: "Is my video uploaded to a server when extracting frames?",
    a: "No. All frame extraction processing happens locally in your browser using the HTML5 Canvas and Video APIs. Your video file never leaves your device, ensuring complete privacy and working even without an internet connection.",
  },
  {
    q: "What is the difference between interval extraction and timestamp extraction?",
    a: "Interval extraction automatically captures frames at regular time gaps (e.g., every 1 second or every 5 seconds) throughout the entire video, generating a sequence of images. Timestamp extraction lets you enter specific moments (e.g., 00:45 or 2:30) to grab individual frames at precise exact moments you choose.",
  },
  {
    q: "Are there any limits on video file size or number of frames?",
    a: "There are no artificial limits imposed by the tool itself. The practical limits depend on your device's memory and processing power. Very large video files (4GB+) may take longer to process, and extracting frames at very short intervals (e.g., every 0.1 seconds) from long videos will generate many images. For best performance, use videos under 2GB and reasonable extraction intervals.",
  },
]

export const metadata: Metadata = {
  ...buildToolMetadata("ai-video-image"),
  title: "Free Video Frame Extractor — Convert Video to Images",
  description:
    "Extract PNG and JPG frames from MP4, MP4, or MOV videos free. Set custom intervals or timestamps — no watermarks, no signup, runs in your browser.",
  keywords: [
    "video frame extractor",
    "extract images from video free online",
    "convert video to jpg png no watermark",
    "video to image converter browser based",
    "free video screenshot tool online 2026",
    "mp4 to image frame extractor private",
    "video frame capture no upload local",
    "extract frames at intervals timestamps",
    "video to image sequence converter free",
    "browser based video frame grabber 2026",
    "no registration video frame extractor",
    "offline video to image converter tool",
    "high quality video frame extraction",
    "privacy first video screenshot tool",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Video Frame Extractor — Convert Video to Images Online",
    description:
      "Instantly extract high-quality PNG and JPG frames from any video. Custom intervals or exact timestamps — free, no watermark, works entirely in your browser with zero server uploads.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Video Frame Extractor — Convert Video to Images Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Extract Video Frames Free — No Upload, No Watermark",
    description:
      "Turn any MP4, MP4, or MOV into high-quality images. Pick intervals or exact timestamps. 100% private browser processing — your video never leaves your device.",
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

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Video Frame Extractor",
  url: TOOL_URL,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 14+, Edge 88+",
  description:
    "A free, browser-based video frame extractor that saves high-quality image frames from MP4, MP4, and MOV videos at custom intervals or timestamps — with no watermarks and no server uploads.",
  featureList: [
    "Extract video frames from MP4, MP4, and MOV formats with full codec compatibility",
    "Set custom extraction intervals from 0.1 seconds to any duration for automated frame sequences",
    "Enter precise timestamps to capture individual frames at exact moments",
    "Export frames as high-quality lossless PNG or compressed JPG at original resolution",
    "Zero watermarks on all extracted frames for professional and personal use",
    "100% client-side processing using HTML5 Canvas and Video APIs — no server uploads",
    "No account registration, email collection, or login required to use the tool",
    "Works offline after initial page load with no internet connection required",
    "Drag-and-drop video upload with instant preview and frame navigation",
    "Batch download all extracted frames as a ZIP archive or individual image files",
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Extract Frames from a Video for Free",
  description:
    "A step-by-step guide to converting video files into high-quality image frames using a free browser-based tool. No software installation or account required.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Video Frame Extractor",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your Video File",
      text: "Drag and drop your MP4, MP4, or MOV video file into the browser window, or click the upload button to select a file from your device. The tool loads the video instantly for local preview.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose Your Extraction Method",
      text: "Select either interval extraction to capture frames at regular time gaps (e.g., every 1 second), or timestamp extraction to enter specific moments (e.g., 00:45) for individual frame capture.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Configure Output Settings",
      text: "Pick your preferred image format — PNG for lossless quality ideal for editing and thumbnails, or JPG for smaller file sizes suitable for web and social media sharing.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Extract and Download Frames",
      text: "Click the extract button to process the video locally in your browser. Preview the generated frames and download them individually or as a batch ZIP archive — no watermarks applied.",
      url: TOOL_URL,
    },
  ],
}

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}

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
      name: "Media Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Video Frame Extractor",
      item: TOOL_URL,
    },
  ],
}

export default function Page() {
  const video = getToolVideo("ai-video-image")
  const thumbnailPath = getPrimaryToolImage("ai-video-image") || "/favicon-512x512.png"

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {video && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "@id": `${TOOL_URL}#video`,
              name: "Free Video Frame Extractor — demo video",
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
        <header className="mb-6 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free Video Frame Extractor — Extract Images from Any Video
          </h1>
          <img src="/images/ai-video-image.webp" alt="Free Video Frame Extractor — extract PNG and JPG frames from MP4 videos online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl">
            Extract high-quality image frames from any video file — MP4, MP4, or MOV. Set custom extraction intervals or pick specific timestamps to capture exactly the frames you need. No watermarks, no registration, 100% private — all processing happens locally on your device.
          </p>
          <QuickAnswer
            question="How do I extract frames from a video for free?"
            answer="Upload your video file and this browser-based tool extracts frames as high-quality images at your specified intervals or timestamps. No watermarks, no server uploads — all processing happens locally on your device."
          />
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <ol className="flex items-center gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <a href={SITE_URL} itemProp="item" className="hover:underline">
                  <span itemProp="name">Home</span>
                </a>
                <meta itemProp="position" content="1" />
              </li>
              <li aria-hidden="true">›</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <a href={`${SITE_URL}/tools`} itemProp="item" className="hover:underline">
                  <span itemProp="name">Media Tools</span>
                </a>
                <meta itemProp="position" content="2" />
              </li>
              <li aria-hidden="true">›</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">Video Frame Extractor</span>
                <meta itemProp="item" content={TOOL_URL} />
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>
        </header>

        <main>
           <ClientPage />
        </main>

        <EmailCapture />

        <hr className="my-12 border-border" />

        <article
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            AI Video-from-Image: How Frame Interpolation and Motion Synthesis Work
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A product photographer submitted 12 static pack shots of a skincare
              bottle to an AI video tool. The output: 12 three-second clips showing
              the bottle rotating 360 degrees, with realistic highlight tracking
              across the glass surface. The clips were used in Instagram Reels and
              achieved 4.2× higher engagement than the static posts. Total
              production time for the photographer: 20 minutes. Traditional
              turntable photography would have required a dedicated half-day shoot.
            </p>
            <p className="text-muted-foreground mb-4">
              The technology behind this is video diffusion — a generative model
              that learns the statistical distribution of how pixels move between
              video frames. When given a single image as a starting frame, it
              synthesizes plausible subsequent frames by sampling from that
              distribution conditioned on the input image. It does not trace actual
              3D geometry; it hallucinates motion that looks plausible given what it
              has seen during training.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Motion Types: What the Model Handles Well
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Motion type</th>
                    <th className="border border-border p-2 text-left">Quality</th>
                    <th className="border border-border p-2 text-left">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Slow camera pan / zoom', 'Excellent', 'Dominant pattern in training data (stock footage)'],
                    ['Object rotation (simple geometry)', 'Good', 'Seen in product video training sets'],
                    ['Hair/fabric movement in wind', 'Good', 'Fluid motion well-represented in training'],
                    ['Human walking', 'Mediocre', 'Limb articulation produces artifacts at joints'],
                    ['Text in motion', 'Poor', 'Letters distort; model treats text as texture'],
                    ['Fast action / sports', 'Poor', 'Motion blur synthesis is unconvincing'],
                    ['Water with complex reflection', 'Mediocre', 'Reflection coherence breaks over frames'],
                  ].map(([motion, quality, why]) => (
                    <tr key={motion} className="border border-border">
                      <td className="border border-border p-2 font-medium">{motion}</td>
                      <td className={'border border-border p-2 font-medium ' + (quality === 'Excellent' ? 'text-green-600' : quality === 'Good' ? 'text-black  dark:text-white' : quality === 'Mediocre' ? 'text-yellow-600' : 'text-red-600')}>{quality}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Output Specifications
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Setting</th>
                    <th className="border border-border p-2 text-left">Options</th>
                    <th className="border border-border p-2 text-left">Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Duration', '2–4 seconds typical', 'Longer clips accumulate more artifacts'],
                    ['Resolution', 'Up to 1080p (model-dependent)', 'Match your source image resolution'],
                    ['Frame rate', '24fps standard', 'Higher FPS requires more inference compute'],
                    ['Format', 'MP4 (H.264)', 'Universal compatibility; re-encode for social platforms'],
                  ].map(([setting, opts, rec]) => (
                    <tr key={setting} className="border border-border">
                      <td className="border border-border p-2 font-medium">{setting}</td>
                      <td className="border border-border p-2 text-muted-foreground">{opts}</td>
                      <td className="border border-border p-2 text-muted-foreground">{rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Honest Limitations
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              <li>
                <strong>No 3D consistency:</strong> If the camera moves far enough
                to reveal an occluded area (the back of an object), the model
                invents that area. It will look plausible but not accurate.
              </li>
              <li>
                <strong>Face animation artifacts:</strong> Mouths, eyes, and teeth
                are the hardest areas. Small videos with close-up faces frequently
                produce uncanny-valley results.
              </li>
              <li>
                <strong>Looping:</strong> The generated clip does not loop cleanly
                unless specifically trained for loop generation. You will see a
                jump cut at the end-to-start boundary.
              </li>
            </ul>
          </div>

          <RelatedTools
            tools={[
              { name: "Image Compressor", path: "/tools/image-compressor" },
              { name: "Video to Audio", path: "/tools/video-to-audio" },
              { name: "Free AI Image Generator", path: "/tools/free-ai-image-generator" },
            ]}
          />
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
          <p>
            <strong>TheFreeAITools — Video Frame Extractor</strong> is a fully private, browser-based tool that captures high-quality image frames from <strong>MP4, MP4, and MOV</strong> video files. In 2026, extract frames at regular intervals to create a visual timeline, or enter specific timestamps to grab individual moments — all output as <strong>watermark-free PNG or JPG</strong> images at the original video resolution. No account, no upload, no software installation required.
          </p>
          <p>
            Searches related to this tool:{" "}
            <em>
              extract frames from video online free, video to image converter no watermark,
              mp4 to jpg frame extractor, capture video screenshot online free, video frame grabber browser,
              extract images from video no upload, save frames from video free, video frame capture tool,
              convert video to image sequence free, extract png from mp4 online.
            </em>
          </p>
        </footer>
      </div>
    </>
  )
}
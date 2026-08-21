import type { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { getToolVideo } from "@/lib/utils/tool-videos"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"
import { buildAbsoluteUrl } from "@/lib/site-config"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ClientPage from "./client-page"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/free-ai-video-generator`

export const metadata: Metadata = {
  title: "Free AI Video Generator — Text to Video Online 2026",
  description:
    "Create AI videos from text prompts instantly in your browser. Free text-to-video generator — no watermarks, no sign-up required. Fast, private, high-quality.",
  keywords: [
    "free ai video generator",
    "text to video ai free",
    "ai video generator online",
    "free ai video maker no signup",
    "browser based text to video",
    "ai video generator no watermark",
    "free online video ai generator",
    "text to video generator free 2026",
    "ai video creator free",
    "free ai video generator no login",
    "ai video maker free online",
    "private ai video creator",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    title: "Free AI Video Generator — Text to Video Online 2026",
    description: "Create AI videos from text prompts instantly. No watermarks, no sign-up. Free browser-based text-to-video generator.",
    url: TOOL_URL,
    type: "website",
    siteName: "TheFreeAITools",
    images: [{ url: `${TOOL_URL}/opengraph-image`, width: 1200, height: 630, alt: "Free AI Video Generator — Text to Video Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Video Generator — Text to Video Online",
    description: "Generate AI videos from text prompts in your browser. Free, no watermarks, no sign-up required.",
    images: [`${TOOL_URL}/opengraph-image`],
    creator: "@thefreeaitools",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
}

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free AI Video Generator — Text to Video Online",
  url: TOOL_URL,
  description: "A free browser-based AI video generator that creates high-quality videos from text prompts. No watermarks, no account required, no software install.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Generate AI videos from text descriptions",
    "No watermarks on exported videos",
    "No account registration or email required",
    "Multiple aspect ratios: 16:9, 9:16, 1:1",
    "High-definition output",
    "Privacy-first — prompts not stored",
  ],
  publisher: { "@type": "Organization", name: "TheFreeAITools", url: SITE_URL },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Generate AI Videos from Text Online",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter Your Prompt", text: "Type a detailed description of the video scene you want to create — include lighting, style, and camera motion.", url: TOOL_URL },
    { "@type": "HowToStep", position: 2, name: "Select Video Parameters", text: "Choose your aspect ratio (16:9 for YouTube, 9:16 for TikTok) and artistic style.", url: TOOL_URL },
    { "@type": "HowToStep", position: 3, name: "Generate", text: "Click generate. The AI processes your prompt and produces a video sequence.", url: TOOL_URL },
    { "@type": "HowToStep", position: 4, name: "Download", text: "Download your MP4 video file — no watermark, no fee.", url: TOOL_URL },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I use the free AI video generator?",
      acceptedAnswer: { "@type": "Answer", text: "Type a descriptive prompt, select your aspect ratio and style, and click Generate. The AI creates a video clip ready to download." },
    },
    {
      "@type": "Question",
      name: "What video formats are supported for download?",
      acceptedAnswer: { "@type": "Answer", text: "The generator outputs MP4 files, compatible with all major video editors, social media platforms, and devices." },
    },
    {
      "@type": "Question",
      name: "Are my video prompts stored on your servers?",
      acceptedAnswer: { "@type": "Answer", text: "No. Prompts are processed through secure APIs to generate the video but are not stored, retained, or used for model training." },
    },
    {
      "@type": "Question",
      name: "What types of videos does AI generate well?",
      acceptedAnswer: { "@type": "Answer", text: "Landscapes, abstract motion, environmental scenes, and artistic visuals produce the best results. Complex action sequences and close-up human faces are harder for current AI video models to render consistently." },
    },
    {
      "@type": "Question",
      name: "Is this tool free to use?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, completely free. No subscription, no credit card, no account required. All features are available immediately." },
    },
  ],
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "AI Tools", item: `${SITE_URL}/tools` },
    { "@type": "ListItem", position: 3, name: "Free AI Video Generator", item: TOOL_URL },
  ],
}

export default function Page() {
  const video = getToolVideo("free-ai-video-generator")
  const thumbnailPath = getPrimaryToolImage("free-ai-video-generator") || "/favicon-512x512.png"

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {video && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "@id": `${TOOL_URL}#video`,
              name: "Free AI Video Generator — demo video",
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

      <>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-muted-foreground">
              <li><a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">Home</a></li>
              <li><span>/</span></li>
              <li><a href={`${SITE_URL}/tools`} className="hover:text-foreground transition-colors">AI Tools</a></li>
              <li><span>/</span></li>
              <li><span className="text-foreground font-medium" aria-current="page">Free AI Video Generator</span></li>
            </ol>
          </nav>

          <header className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Free AI Video Generator — Text to Video Online
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              Turn text prompts into AI-generated video clips instantly. Free browser-based video
              creator — no watermarks, no account required, no software to install.
            </p>
            <QuickAnswer
              question="How do I generate a video from text using AI for free?"
              answer="Type a descriptive prompt (e.g., 'A drone flying over a mountain lake at sunset, cinematic 4K'), select video length and style, then click Generate. The AI creates a video clip based on your description. No account required, no watermark, free to download. For best results, be specific: include camera movement, lighting, mood, and subject details in your prompt."
            />
          </header>

          <main className="mb-16">
            <ClientPage />
          </main>

          <hr className="my-16 border-border" />

          <article className="mt-8 prose prose-slate dark:prose-invert max-w-none" itemScope itemType="https://schema.org/TechArticle">
            <meta itemProp="author" content="Achraf A." />
            <meta itemProp="datePublished" content="2026-06-01" />
            <meta itemProp="dateModified" content="2026-06-04" />

            <h2 className="text-2xl font-bold mb-4">How AI Video Generation Works — and What It Does Well</h2>
            <div itemProp="articleBody">
              <p className="text-muted-foreground mb-4">
                Text-to-video AI is fundamentally harder than image generation because the model must
                maintain <strong>temporal consistency</strong> — the same subject must look coherent
                across every frame. Current video diffusion models solve this by learning the joint
                distribution of image frames conditioned on their sequence position. The result: objects
                and scenes remain stable for 2–4 seconds, after which coherence degrades unless the model
                is guided to simple camera motions.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Output Quality by Content Type</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-border text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Content type</th>
                      <th className="border border-border p-2 text-left">Quality</th>
                      <th className="border border-border p-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Landscape / environment", "Good", "Best with slow camera motion"],
                      ["Abstract / artistic motion", "Good", "Paint, particles, fluid effects"],
                      ["Human walking / gesturing", "Moderate", "Gait artifacts appear after ~2s"],
                      ["Face close-ups", "Moderate", "Eye and mouth movement can appear uncanny"],
                      ["Complex action sequences", "Challenging", "Motion blur and subject drift"],
                      ["Text rendered on screen", "Challenging", "Letters distort across frames"],
                    ].map(([type, quality, note]) => (
                      <tr key={type} className="border border-border">
                        <td className="border border-border p-2 font-medium text-sm">{type}</td>
                        <td className={`border border-border p-2 font-semibold text-sm ${quality === "Good" ? "text-green-600" : quality === "Moderate" ? "text-yellow-600" : "text-red-600"}`}>{quality}</td>
                        <td className="border border-border p-2 text-muted-foreground text-sm">{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">Tips for Better AI Video Prompts</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                <li>Keep prompts to one dominant subject and one motion type — complex multi-subject scenes lose coherence quickly.</li>
                <li>Specify camera motion explicitly: <em>"slow push in"</em>, <em>"static camera"</em>, or <em>"gentle pan left"</em>.</li>
                <li>Add a color grade description like <em>"warm golden hour light"</em> or <em>"cool cinematic teal shadows"</em> for consistent aesthetic.</li>
                <li>Generated clips work best as background plates, reference material, or B-roll alongside real footage.</li>
              </ul>
            </div>

            <RelatedTools
              tools={[
                { name: "AI Video from Image", path: "/tools/ai-video-image" },
                { name: "Video to Audio", path: "/tools/video-to-audio" },
                { name: "Free AI Image Generator", path: "/tools/free-ai-image-generator" },
              ]}
            />
          </article>

          <footer className="mt-16 pt-8 border-t border-border max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>TheFreeAITools — Free AI Video Generator</strong> is a browser-based text-to-video
              tool that creates AI-generated video clips from text descriptions. No watermarks, no
              account required, no software install. Works on all modern browsers on desktop and mobile.
            </p>
          </footer>
        </div>
      </>
    </>
  )
}

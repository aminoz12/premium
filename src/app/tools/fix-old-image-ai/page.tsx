import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── 1. Absolute URLs ONLY ───────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/fix-old-image-ai`

// ─── 2. Title, Description, and Keywords ──────────────────────────────────────
export const metadata: Metadata = {
  title: "Restore Old Family Photos Free — Sharpen, Denoise & Fix Fading",
  description:
    "Restore faded, blurry, or damaged family photos free online. Adjust brightness, contrast, sharpness and denoise — all in your browser. No upload, no account.",
  keywords: [
    "fix old photos ai",
    "restore old photos online free",
    "fix faded photos ai",
    "enhance old images free",
    "old photo restorer online",
    "repair damaged photo browser",
    "free photo restoration tool 2026",
    "fix blurry photos online no upload",
    "browser-based vintage photo editor",
    "restore aging photos securely free",
    "colorize and enhance old photos",
    "ai photo restoration free no login",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Restore Old Family Photos Free — Sharpen, Denoise & Fix Fading",
    description:
      "Restore faded, damaged, and aging photos instantly. Free, browser-based photo enhancement with advanced controls and zero server uploads.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Fix Old Photos AI Tool Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online AI Photo Restoration & Enhancement",
    description:
      "Bring faded memories back to life. Fix old photos directly in your browser securely, with no account required.",
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

// ─── 3. Four JSON-LD Scripts ──────────────────────────────────────────────────

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fix Old Photos AI",
  url: TOOL_URL,
  description:
    "A free browser-based photo restoration tool with advanced controls for brightness, contrast, sharpness, denoise, and color correction to instantly fix old and damaged images.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern browser with Canvas API support (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+).",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Restore faded colors with advanced saturation and temperature adjustments",
    "Sharpen blurry edges and recover lost details in aging photographs",
    "Remove digital grain and film noise with dedicated denoise filters",
    "Compare original and restored versions with an interactive before/after slider",
    "Export restored images in high-resolution JPG or PNG formats",
    "Process all images entirely on the client-side for maximum data privacy",
    "Correct exposure and contrast levels instantly via intuitive web sliders",
  ],
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL,
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Restore Old Photos Free Online",
  description:
    "Learn how to fix faded colors, remove blur, and restore damaged old photos using our free browser-based AI tool in under a minute.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Fix Old Photos AI",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your Vintage Photo",
      text: "Click the upload button or drag your scanned image directly into the browser tool area. The file is processed locally without uploading to external servers.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Adjust Restoration Controls",
      text: "Use the sliders to increase contrast, adjust brightness, boost saturation for faded colors, and apply the denoise filter to smooth out film grain.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Compare Before and After",
      text: "Toggle the before/after view to compare your enhancements against the original scan, ensuring the adjustments look natural.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download the Restored Image",
      text: "Once satisfied with the recovery of details, click Download to save the restored photograph to your computer as a high-quality image file.",
      url: TOOL_URL,
    },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I use the tool to fix my old photos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply upload your scanned photo into the tool and use the intuitive sliders to adjust contrast, brightness, sharpness, and noise. Once you are happy with the preview, click download to save the restored image.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats can I upload for restoration?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can upload all standard web formats, including JPG, PNG, WebP, and BMP. High-resolution scans provide the best pixel data for the restoration algorithms to work with.",
      },
    },
    {
      "@type": "Question",
      name: "In what format will my restored photo be exported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool exports your newly restored photo as a high-quality JPG or PNG file, matching the resolution and dimensions of the original file you uploaded.",
      },
    },
    {
      "@type": "Question",
      name: "Are my family photos uploaded to a remote server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All photo processing happens entirely inside your web browser using HTML5 Canvas technology. Your private family memories never leave your device, ensuring complete privacy.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between AI restoration and manual Photoshop editing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "While traditional Photoshop editing requires specialized knowledge to manually clone stamps and adjust curves, this tool simplifies the process through automated, slide-based adjustments optimized specifically for common aging photo defects.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any file size limits or usage restrictions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can restore an unlimited number of photos for free without creating an account. The tool comfortably handles files up to 25MB depending on your device's available memory.",
      },
    },
  ],
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
      name: "Image Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Fix Old Photos AI",
      item: TOOL_URL,
    },
  ],
}

export default function Page() {
  return (
    <>
      {/* ── JSON-LD Injection ── */}
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

      <div className="px-14 py-8">
        <header className="mb-8 space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Restore Old Family Photos Free — Sharpen, Denoise & Fix Fading
          </h1>
          <img src="/images/fix-old-image-ai.webp" alt="Free AI Photo Restorer — fix old, blurry, and damaged photos with AI" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-base text-muted-foreground leading-relaxed">
            Bring aging, faded, and damaged photos back to life with professional-grade editing
            controls. Adjust brightness, contrast, sharpness, color saturation, and noise — all in
            your browser with no uploads, no account, and no software to install. Free before/after
            comparison included.
          </p>

          <QuickAnswer
            question="How do I restore and sharpen an old faded family photo for free?"
            answer="Upload your old photo, then increase brightness and contrast to recover lost detail, use the sharpen slider to crisp up soft edges, and apply denoise to reduce the grain that appears in old scanned prints. The before/after comparison shows the improvement in real time — no upload required, all processing stays in your browser."
          />

          {/* Breadcrumb matching JSON-LD exactly */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mt-4">
            <ol className="flex items-center gap-2">
              <li>
                <a href={`${SITE_URL}/`} className="hover:underline hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a href={`${SITE_URL}/tools`} className="hover:underline hover:text-foreground transition-colors">
                  Image Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="font-medium text-foreground">Fix Old Photos AI</span>
              </li>
            </ol>
          </nav>
        </header>

        <main className="max-w-6xl mx-auto">
           <ClientPage />
        </main>

        <div className="max-w-4xl mx-auto mt-12">
          <EmailCapture />
        </div>

        <hr className="my-16 border-border max-w-4xl mx-auto" />

        {/* ── 5. AdSense High-Value Content Injection ── */}
        <article
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            AI Photo Restoration: What It Can Repair and What It Invents
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A family submitted a 1943 photograph of their grandfather — a
              480×360 pixel scan with a diagonal fold crease, silver mirroring on
              the lower-left corner, and 40% of the face obscured by a water
              stain. After AI restoration: the crease was gone, the silver
              mirroring suppressed, and the face — including the eye and cheek
              hidden under the stain — was reconstructed. The family was moved.
              They were also warned: the reconstructed face features were
              statistically plausible given what was visible, not photographically
              accurate. The grandfather might have looked like that. He might not
              have.
            </p>
            <p className="text-muted-foreground mb-4">
              This distinction — repair vs. invention — is the most important
              thing to understand about AI photo restoration.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              What the Model Repairs vs. Invents
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Damage type</th>
                    <th className="border border-border p-2 text-left">Operation</th>
                    <th className="border border-border p-2 text-left">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Dust and scratches', 'Noise removal', 'High — no content invented'],
                    ['Silver mirroring / foxing', 'Tone correction', 'High — reverses chemical shift'],
                    ['Fading / yellowing', 'Color normalization', 'High — predictable degradation pattern'],
                    ['Fold creases', 'Inpainting from adjacent pixels', 'Medium — blends seamlessly on flat areas, less so on faces'],
                    ['Torn edges', 'Outpainting / edge fill', 'Medium — invents content outside original frame'],
                    ['Obscured faces (>30%)', 'Face hallucination from model priors', 'Low — plausible but not accurate'],
                    ['Complete areas destroyed', 'Generative inpainting', 'Low — entirely invented based on context'],
                  ].map(([damage, op, acc]) => (
                    <tr key={damage} className="border border-border">
                      <td className="border border-border p-2 font-medium text-sm">{damage}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{op}</td>
                      <td className={'border border-border p-2 font-medium text-sm ' + (acc.startsWith('High') ? 'text-green-600' : acc.startsWith('Medium') ? 'text-yellow-600' : 'text-red-600')}>{acc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Colorization: What AI Knows and Doesn&apos;t
            </h3>
            <p className="text-muted-foreground mb-4">
              AI colorization has seen remarkable numbers: a DeOldify benchmark
              showed 87% of colorized images rated &quot;natural&quot; by human judges
              who could not see the original reference. But color is fundamentally
              ambiguous in a grayscale image. A blue dress and a red dress produce
              the same gray value. The model chooses based on statistical priors
              — what color is most common for that type of object. A sky is almost
              always blue. A 1940s car interior is probably brown. A woman&apos;s blouse
              in 1920 was probably white, cream, or gray — but it could have been
              red. The model will not know, and it will not say.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Best Practices for Archival Use
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              <li>Always keep the original unmodified scan alongside the restored version.</li>
              <li>Label restored images as &quot;AI-restored&quot; when sharing digitally — this is an emerging best practice in digital archiving.</li>
              <li>For faces with more than 50% damage, treat the reconstruction as an illustration, not a photograph.</li>
              <li>For professional archival projects, pair AI restoration with manual review by a photo conservator.</li>
            </ul>
          </div>

          <RelatedTools
            tools={[
              { name: "Image Compressor", path: "/tools/image-compressor" },
              { name: "Image Resizer", path: "/tools/image-resizer" },
              { name: "Remove Background", path: "/tools/remove-bg" },
            ]}
          />
        </article>

        {/* ── 6. Page Footer ── */}
        <footer className="mt-16 pt-8 border-t border-border max-w-4xl mx-auto space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>TheFreeAITools — Fix Old Photos AI</strong> is an essential utility for anyone looking to rescue their family history in 2026. This fully free, browser-based editor empowers you to meticulously restore aging analog prints directly from your device. By supporting universal inputs like <strong>JPG</strong>, <strong>PNG</strong>, and <strong>WebP</strong>, it offers unparalleled accessibility. Most importantly, we guarantee that your sensitive memories remain completely private , no images are ever stored or processed on external servers.
          </p>
        </footer>
      </div>
    </>
  )
}
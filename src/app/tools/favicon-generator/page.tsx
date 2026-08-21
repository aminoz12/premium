import { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ToolClient from "./client-page"

// ─── Absolute URLs only ───────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/favicon-generator`

// ─── Title, description, and keywords ─────────────────────────────────────────
export const metadata: Metadata = {
  title: "Create Favicon from Logo Free — PNG to ICO, All Sizes, No Upload",
  description:
    "Generate favicon.ico, apple-touch-icon, and PWA icons from any PNG or SVG logo. All sizes in one download (16×16 to 512×512). 100% browser-based — your image never leaves your device.",
  keywords: [
    "favicon generator",
    "free online favicon maker",
    "png to favicon converter",
    "create favicon online 2026",
    "convert image to ico file",
    "app icon generator free",
    "favicon generator online no upload",
    "browser-based favicon maker",
    "free ico converter private",
    "apple touch icon generator",
    "generate progressive web app icons",
    "best free favicon generator 2026"
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Favicon Maker: Generate Free Website Icons Online",
    description:
      "Instantly create perfectly sized favicons for your website. 100% private, fast, browser-based generation with zero server uploads.",
    url: TOOL_URL,
    type: "website",
    siteName: "TheFreeAITools",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Online Favicon Generator Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Favicon & App Icon Generator",
    description:
      "Convert your PNG or JPG into a complete set of favicons and app icons instantly. Free, secure, and private browser-based tool.",
    images: [`${TOOL_URL}/opengraph-image`],
    site: "@thefreeaitools",
  },
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Favicon Generator",
  url: TOOL_URL,
  description: "A free, private, and secure browser-based favicon generator that converts images into universally compatible website icons and HTML meta tags.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with HTML5 Canvas support (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+).",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  },
  featureList: [
    "Instantly convert PNG, JPG, and SVG formats into standard web favicons",
    "Generate high-resolution Apple Touch Icons (180x180) automatically",
    "Create Android and PWA manifest-ready icons (192x192, 512x512)",
    "100% client-side processing ensures complete data privacy",
    "Automatically generate exact HTML meta tags for immediate copy-pasting",
    "Download a complete, organized zipped package of all generated icons",
    "Full support for transparent background PNGs and scalable vectors"
  ],
  publisher: {
    "@type": "Organization",
    name: "TheFreeAITools",
    url: SITE_URL
  }
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Generate Website Favicons Online",
  description: "Learn how to instantly create a complete set of modern website favicons and application icons directly in your browser.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Favicon Generator"
    }
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your Image",
      text: "Drag and drop your square PNG, JPG, or SVG into the upload area. Ensure the background is transparent for the best results.",
      url: TOOL_URL
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Generate the Icons",
      text: "Wait a second as the tool automatically resizes your image into all necessary web icon dimensions locally in your browser.",
      url: TOOL_URL
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Download Your Files",
      text: "Click the download button to grab your newly generated favicon set, including 16x16, 32x32, and high-res app icons.",
      url: TOOL_URL
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy the HTML Tags",
      text: "Copy the provided HTML code snippet from the tool and paste it directly into the `<head>` section of your website.",
      url: TOOL_URL
    }
  ]
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I use the free online favicon generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload a square image, preview the generated sizes, download the icon package, and copy the provided HTML into your website's head section."
      }
    },
    {
      "@type": "Question",
      name: "What image formats are supported for input?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our tool supports standard web image formats including PNG, JPG, and SVG. For the absolute best results, we highly recommend uploading a PNG file with a transparent background."
      }
    },
    {
      "@type": "Question",
      name: "What output format options do I get?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The generator provides your icons as high-quality PNGs in standard sizes (16x16, 32x32, 192x192, 512x512) and an Apple Touch Icon (180x180), which are universally supported by modern browsers."
      }
    },
    {
      "@type": "Question",
      name: "Are my images uploaded to a remote server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, your images are never uploaded to our servers. The entire generation and resizing process happens strictly locally within your web browser using HTML5 Canvas, ensuring complete data privacy."
      }
    },
    {
      "@type": "Question",
      name: "What is the difference between a favicon and an Apple Touch Icon?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A standard favicon appears in browser tabs and bookmarks, while an Apple Touch Icon is a higher-resolution image specifically used by iOS devices when a user adds your website to their home screen."
      }
    },
    {
      "@type": "Question",
      name: "Are there any image file size limits or usage restrictions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There are absolutely no restrictions on how many favicons you can generate. The only limitation is that your initial uploaded image must be handled by your device's available browser memory."
      }
    }
  ]
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/`
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Tools",
      item: `${SITE_URL}/tools`
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Favicon Generator",
      item: TOOL_URL
    }
  ]
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <>
        <div className=" ">

          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex items-center space-x-2">
              <li><a href={`${SITE_URL}/`} className="hover:underline">Home</a></li>
              <li><span>/</span></li>
              <li><a href={`${SITE_URL}/tools`} className="hover:underline">Tools</a></li>
              <li><span>/</span></li>
              <li className="text-foreground font-medium" aria-current="page">Favicon Generator</li>
            </ol>
          </nav>

          <header className="space-y-4 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Create Favicon from Logo Free — PNG to ICO, All Sizes, No Upload
            </h1>
            <img src="/images/favicon-generator.webp" alt="Free Favicon Generator — create ICO, PNG favicon files from any image" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Upload your logo or image to instantly generate multi-size favicons and web app icons compatible with all modern browsers, Android, and iOS devices. Get the exact HTML meta tags needed to implement them without relying on cloud uploads or third-party servers.
            </p>
            <QuickAnswer
              question="How do I create a favicon from a logo for free?"
              answer="Upload your logo PNG or SVG to this tool. It generates favicon.ico (16×16 and 32×32), apple-touch-icon.png (180×180), and Android/PWA icons (192×192 and 512×512) — all in one ZIP download. Your image never leaves your browser."
            />
          </header>

          <main>
            <ToolClient />
          </main>

          <hr className="border-border" />

          {/* AdSense High-Value Content Injection */}
          <article
            className="space-y-12 max-w-4xl"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="name" content="Favicon Generator: Every Size You Actually Need in 2026" />
            <meta
              itemProp="description"
              content="Which favicon sizes are still required, which are obsolete, and the difference between favicon.ico, apple-touch-icon, and web app manifest icons."
            />
            <meta itemProp="datePublished" content="2024-03-05" />
            <meta itemProp="dateModified" content="2026-05-25" />
            <meta itemProp="author" content="Achraf A." />

            {/* What sizes you actually need */}
            <section aria-labelledby="sizes-needed" className="space-y-4">
              <h2
                id="sizes-needed"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                The favicon sizes that actually matter in 2026
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                The classic{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">favicon.ico</code>{' '}
                at 16×16 is no longer sufficient. Modern browsers, mobile home screens, and
                PWAs require a specific set of sizes. The short list that covers almost
                every real scenario:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">File</th>
                      <th className="border border-border p-2 text-left font-semibold">Size(s)</th>
                      <th className="border border-border p-2 text-left font-semibold">Used by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['favicon.ico', '16×16 + 32×32 (multi-size)', 'All browsers, browser tabs'],
                      ['favicon-32x32.png', '32×32', 'High-DPI browser tabs, Safari'],
                      ['apple-touch-icon.png', '180×180', 'iOS home screen bookmark'],
                      ['android-chrome-192x192.png', '192×192', 'Android home screen, PWA'],
                      ['android-chrome-512x512.png', '512×512', 'PWA splash screen, app stores'],
                      ['site.webmanifest', 'JSON linking the above', 'PWA installation, Chrome omnibox'],
                    ].map(([file, size, usedBy]) => (
                      <tr key={file}>
                        <td className="border border-border p-2 font-mono text-xs text-foreground">{file}</td>
                        <td className="border border-border p-2 text-muted-foreground">{size}</td>
                        <td className="border border-border p-2 text-muted-foreground">{usedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Source image recommendations */}
            <section
              aria-labelledby="source-image"
              className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
            >
              <h2
                id="source-image"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                What makes a good source image
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Start with a square SVG or PNG at least 512×512 pixels. The icon will be
                downscaled to 16×16 — at that size, fine detail disappears. A letter,
                a simple geometric shape, or a bold monogram reads better than a complex
                logo with text. Test your source image by viewing it at 16×16 in an image
                editor before generating — if you can&apos;t recognize it at that size, neither
                can your users.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                Transparent PNG is supported and recommended for non-square logos.
                The browser tab background will show through. Avoid relying on transparency
                for the 512×512 PWA splash icon, however — some Android launchers fill
                transparent areas with white or the brand color from your manifest.
              </p>
            </section>

            {/* How it works */}
            <section aria-labelledby="how-it-works" className="space-y-4">
              <h2
                id="how-it-works"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                How this generator works
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Your source image is drawn to an HTML Canvas element at each target
                resolution using the browser&apos;s built-in image scaling (bilinear
                interpolation). Each size is exported as a PNG blob via{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">canvas.toBlob()</code>.
                The{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">favicon.ico</code>{' '}
                file is assembled client-side as a multi-resolution ICO container. Nothing
                is uploaded to a server.
              </p>
            </section>

            {/* Next.js / React favicon setup */}
            <section aria-labelledby="nextjs-favicon" className="space-y-4">
              <h2
                id="nextjs-favicon"
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                How to add a favicon in Next.js 13/14 (App Router)
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Next.js 13+ App Router uses file-based favicon discovery — no{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;link&gt;</code>{' '}
                tags needed. Place the files in{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">src/app/</code>{' '}
                (or{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">app/</code>{' '}
                if you're not using the{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">src/</code>{' '}
                directory):
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border p-2 text-left font-semibold">File name</th>
                      <th className="border border-border p-2 text-left font-semibold">Where to place it</th>
                      <th className="border border-border p-2 text-left font-semibold">What it does</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['favicon.ico', 'app/favicon.ico', 'Browser tab icon — auto-discovered by Next.js, no config needed'],
                      ['icon.png (32×32)', 'app/icon.png', 'Higher-res tab icon on modern browsers'],
                      ['apple-icon.png (180×180)', 'app/apple-icon.png', 'iOS home screen shortcut icon'],
                      ['icon-192.png', 'public/icon-192.png + manifest.json', 'Android / PWA install icon'],
                      ['icon-512.png', 'public/icon-512.png + manifest.json', 'PWA splash screen'],
                    ].map(([file, path, desc]) => (
                      <tr key={file}>
                        <td className="border border-border p-2 font-mono text-xs text-foreground">{file}</td>
                        <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{path}</td>
                        <td className="border border-border p-2 text-muted-foreground">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-base leading-7 text-muted-foreground">
                For older Next.js (Pages Router), add these tags to{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">pages/_document.tsx</code>{' '}
                inside{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;Head&gt;</code>:
              </p>
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
                <code>{`<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`}</code>
              </pre>
            </section>

            {/* Related Tools */}
            <section aria-labelledby="related-tools-heading" className="space-y-4">
              <h2
                id="related-tools-heading"
                className="text-xl font-semibold tracking-tight text-foreground"
              >
                Related tools
              </h2>
              <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
                <RelatedTools
                  tools={[
                    { name: "Image Compressor", path: "/tools/image-compressor" },
                    { name: "Image Resizer", path: "/tools/image-resizer" },
                    { name: "QR Code Generator", path: "/tools/qr-code-generator" },
                  ]}
                />
              </nav>
            </section>
          </article>

          <footer className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>TheFreeAITools — Favicon Generator</strong> is the ultimate solution for web developers and designers in 2026. This fully private, zero-upload tool seamlessly converts your base logos into optimized <strong>PNG</strong> and <strong>Apple Touch Icon</strong> formats. By handling all the complex resizing logic locally in your browser, it ensures that creating the perfect browser tab identity for your web project is completely free, instantly fast, and mathematically accurate.
            </p>
          </footer>
        </div>
      </>
    </>
  )
}
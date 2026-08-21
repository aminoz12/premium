import type { Metadata } from "next"
import Image from "next/image"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/remove-bg"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

export const metadata: Metadata = {
  title: "Remove White Background from Image Free — Transparent PNG, No Upload",
  description:
    "Remove white or solid-color backgrounds from product photos free — transparent PNG output, no signup, no upload to servers, no watermark. Click the background color and download instantly.",
  keywords: [
    "remove white background from image",
    "remove white background from image free online",
    "transparent png maker free",
    "product photo background remover",
    "remove background from product photo",
    "make background transparent free",
    "remove white background no upload",
    "background remover for shopify",
    "background remover for etsy",
    "background remover for amazon product photos",
    "remove background free no watermark no signup",
    "white background remover online",
    "make product photo transparent background",
    "remove solid color background online free",
    "browser background remover no upload",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Remove White Background from Image Free — Transparent PNG, No Upload",
    description:
      "Remove white or solid backgrounds from product photos free — transparent PNG, no upload, no watermark. Perfect for Shopify, Etsy, and Amazon listings.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Background Remover — Free Online Transparent PNG Maker by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove White Background from Image Free — No Upload",
    description:
      "Remove white or solid backgrounds from product photos free — transparent PNG, no upload, no watermark. No signup.",
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
      name: "Free Online Background Remover",
      url: TOOL_URL,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (browser-based)",
      browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
      description:
        "Browser-based background remover using HTML5 Canvas color keying. Click a background color, adjust tolerance, and export a transparent PNG. All processing is client-side — no server upload, no signup.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Click-to-erase color keying with adjustable tolerance",
        "Transparent PNG output at original resolution",
        "Supports JPG, PNG, WebP inputs up to 50 MB",
        "100% client-side — images never leave your device",
        "Clipboard export to Figma, Canva, Photoshop",
        "No signup, no watermark, no per-image quota",
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
      name: "How to Remove a Background from an Image with Color Keying",
      description:
        "Step-by-step guide to erasing a background by clicking the color you want removed.",
      totalTime: "PT1M",
      tool: [{ "@type": "HowToTool", name: "TheFreeAITools Background Remover" }],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Upload your image",
          text: "Drag a JPG, PNG, or WebP file onto the upload zone, or click to browse. The image loads into your browser — nothing is uploaded to a server.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Click the background color",
          text: "Click anywhere on the background color you want to erase. Every pixel matching that color becomes transparent.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Adjust tolerance",
          text: "Drag the Tolerance slider higher to catch more shades of the background, or lower to protect subject pixels that share a similar hue.",
          url: TOOL_URL,
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Download the transparent PNG",
          text: "Click Download PNG to save the result at full resolution, or Copy to paste straight into Figma, Canva, or Photoshop.",
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
          name: "How do I remove a background from a photo for free without signing up?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Open the free online background remover, drag your image onto the canvas, and click the background color you want to erase. The tool produces a transparent PNG you can download instantly — no signup, no upload to any server.",
          },
        },
        {
          "@type": "Question",
          name: "Is the free background remover safe — do my images get uploaded?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All processing happens locally in your browser using HTML5 Canvas. Your images are never transmitted to a server, stored, or logged.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between a color-key background remover and an AI background remover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Color-key tools erase pixels that match a color you click. They are fast and private but struggle with multi-colored backgrounds. AI background removers use a segmentation model to detect the subject regardless of background color, at the cost of cloud processing. For complex scenes, use our AI background remover at /tools/remove-background-change-ai.",
          },
        },
        {
          "@type": "Question",
          name: "Why does part of my subject get erased along with the background?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Your subject shares colors with the background. Lower the Tolerance slider so the algorithm is stricter about which pixels it marks transparent.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use this background remover for Shopify, Etsy, or Amazon product photos commercially?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The tool only manipulates pixels you already own or have rights to. The transparent PNG output is suitable for Shopify, Etsy, Amazon, and any other commercial listing platform.",
          },
        },
        {
          "@type": "Question",
          name: "Does the background remover work on hair, fur, or transparent objects?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For wispy hair, fur, or semi-transparent objects, a color-keying tool will leave artifacts. Use our AI background remover at /tools/remove-background-change-ai — it uses a segmentation model that handles soft edges.",
          },
        },
        {
          "@type": "Question",
          name: "What image formats are supported?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Upload JPG, PNG, or WebP up to 50 MB. The output is always PNG so the transparent background is preserved — JPEG does not support transparency.",
          },
        },
        {
          "@type": "Question",
          name: "Is there a usage limit or watermark on the output?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No usage limit and no watermark. Process unlimited images, free forever.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${TOOL_URL}#breadcrumb`,
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
          name: "Background Remover",
          item: TOOL_URL,
        },
      ],
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <div className="px-14 py-8">
        <header className="mb-6 space-y-4 px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Remove White Background from Image Free — Transparent PNG, No Upload
          </h1>

          <Image
            src="/images/remove-bg.webp"
            alt="Remove white background from product photo — before and after transparent PNG"
            width={1200}
            height={630}
            priority
            className="rounded-lg border max-w-3xl w-full h-auto"
          />

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Got a product photo on a white background that needs to be transparent? Click the
            white area — every matching pixel becomes transparent instantly. Download as a{" "}
            <strong>transparent PNG</strong> ready for Shopify, Etsy, Amazon, or Canva.{" "}
            <strong>No upload to any server. No signup. No watermark.</strong> Everything runs
            locally in your browser.
          </p>

          <QuickAnswer
            question="How do I remove a white background from a product photo for free?"
            answer="Upload your product image, click the white background, and the tool makes every matching pixel transparent. Download as a transparent PNG — ready for Shopify, Etsy, or any design tool. Runs in your browser with no server upload."
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
                <a
                  href={`${SITE_URL}/tools`}
                  className="hover:text-foreground transition-colors"
                >
                  Image Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Background Remover</span>
              </li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="Background Remover">
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
          <meta itemProp="name" content="Background Remover: How AI Segmentation Works and What It Gets Wrong" />
          <meta
            itemProp="description"
            content="How neural network background removal works in a browser, which subjects it handles well, and the four image types where it fails consistently."
          />
          <meta itemProp="datePublished" content="2024-04-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Product photo / e-commerce section */}
          <section aria-labelledby="product-photos" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2
              id="product-photos"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Remove white backgrounds from product photos for Shopify, Etsy &amp; Amazon
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Most product photos land on a white or near-white background — a lightbox setup,
              a white sheet, or a studio sweep. Marketplaces like Amazon require white backgrounds
              for main listing images. Shopify and Etsy sellers use transparent PNGs to composite
              products onto branded or seasonal backgrounds without re-shooting.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Color keying (what this tool uses) is ideal for this exact case: the background is
              a single solid color (white, grey, or chroma-key green), so clicking once removes
              it cleanly. The tolerance slider handles slight color variation from lighting — raise
              it to catch shadows in corners of a lightbox, lower it to protect white products
              (a white mug on a white background needs very low tolerance).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Platform</th>
                    <th className="border border-border p-2 text-left font-semibold">Background requirement</th>
                    <th className="border border-border p-2 text-left font-semibold">Output to use</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Amazon main image", "Pure white (RGB 255,255,255), ≥85% of frame", "Download PNG → place on white canvas in Canva"],
                    ["Shopify product", "White or transparent — merchant choice", "Transparent PNG works directly"],
                    ["Etsy listing", "Clean background, no text overlays", "Transparent PNG or white background"],
                    ["Canva design", "Transparent PNG for compositing", "Download transparent PNG → upload to Canva"],
                    ["WooCommerce / WordPress", "Any — transparent preferred", "Transparent PNG, resized to square"],
                  ].map(([platform, req, output]) => (
                    <tr key={String(platform)}>
                      <td className="border border-border p-2 font-medium">{platform}</td>
                      <td className="border border-border p-2 text-muted-foreground text-xs">{req}</td>
                      <td className="border border-border p-2 text-muted-foreground text-xs">{output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              For products with complex subjects (hair, fur, semi-transparent packaging), use
              the{" "}
              <a href="/tools/remove-background-change-ai" className="text-primary underline-offset-4 hover:underline">
                AI background remover
              </a>{" "}
              which uses segmentation instead of color keying.
            </p>
          </section>

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How AI background removal works in a browser
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Browser-based background removal uses a lightweight neural network model
              (typically a variant of U2-Net or RMBG) running in WebAssembly or via
              the Web AI APIs. The model performs semantic segmentation: it classifies
              each pixel as foreground (subject) or background, producing a mask.
              That mask is then applied to the original image to make background
              pixels transparent, outputting a PNG with an alpha channel.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The model runs entirely in your browser — your photo is not uploaded to
              a server. Processing time depends on image resolution and your device&apos;s
              GPU: a 1920×1080 photo typically takes 1–5 seconds on a modern laptop.
              The model weights are downloaded once and cached, so subsequent uses
              are faster.
            </p>
          </section>

          {/* What it handles well vs poorly */}
          <section
            aria-labelledby="accuracy"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="accuracy"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What the model handles well — and what it gets wrong
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              <strong>Works well:</strong> people on solid or simple backgrounds
              (the dominant training case), product photos on white or light-colored
              backgrounds, animals with clear silhouettes, and cars. These subjects
              have distinct color contrast at their edges and match the model&apos;s
              training distribution.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground mt-4">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Hair and fur</span>
                <span>
                  Fine strands of hair and fur are the hardest case for segmentation.
                  The model often produces a rough silhouette that clips hair edges.
                  For professional product shots requiring perfect hair, use a
                  dedicated tool like Photoshop Select &amp; Mask or remove.bg&apos;s
                  paid tier, which uses higher-resolution models.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Transparent or glass objects</span>
                <span>
                  Wine glasses, bottles, and transparent objects confuse the model —
                  the background is visible through the subject, making the
                  foreground/background boundary undefined. Expect rough masks.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Complex backgrounds matching subject color</span>
                <span>
                  A person wearing a white shirt against a white wall, or a dark
                  object on a dark background — when subject and background share
                  similar colors, the model cannot find an edge to cut along.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Very busy or detailed backgrounds</span>
                <span>
                  Crowds, forests, and cluttered scenes with many overlapping objects
                  at the subject boundary produce noisy masks with artifacts.
                </span>
              </li>
            </ul>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related image tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                  { name: "Image Converter", path: "/tools/image-converter" },
                  { name: "Image Resizer", path: "/tools/image-resizer" },
                ]}
              />
            </nav>
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Background Remover</strong> is a fully private,
            browser-based tool that erases image backgrounds using HTML5 Canvas color
            keying and outputs <strong>transparent PNG</strong> files. Supports JPG,
            PNG, and WebP inputs up to 50 MB, click-to-erase color selection with
            adjustable tolerance, and one-click download. All processing runs locally
            on your device — your images never leave your computer. For complex
            scenes with hair, fur, or multi-colored backgrounds, use the{" "}
            <a
              href="/tools/remove-background-change-ai"
              className="text-primary underline-offset-4 hover:underline"
            >
              AI background remover
            </a>
            .
          </p>
          <p>Last reviewed: 2026-05-11.</p>
        </footer>
      </div>
    </>
  )
}

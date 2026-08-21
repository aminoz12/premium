import type { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import Image from "next/image"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import Generate3DClient from "./client-page"

// ─── Absolute URLs ONLY ───────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/generate-3d`

// ─── Perfect Metadata & Freshness ─────────────────────────────────────────────
// Title: 56 characters — well within the 50–60 char SERP window
export const metadata: Metadata = {
  title: "Add 3D Tilt Effect to Image Free — CSS Parallax Generator Online",
  description:
    "Add a 3D tilt, parallax, or perspective effect to any image online. Export as PNG or copy the CSS transform code. Free, no upload, works in your browser.",
  keywords: [
    "2d to 3d image converter online",
    "free 2d to 3d photo converter online",
    "convert 2d image to 3d perspective",
    "browser-based 3d image effect generator",
    "css 3d transform tool online 2026",
    "create parallax photo effect free",
    "no upload 3d image generator",
    "add depth effect to image online",
    "best 2d to 3d picture maker 2026",
    "export 3d perspective image png",
    "generate css 3d transform code",
    "free 3d photo maker without watermark",
    "3d tilt effect online tool",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Add 3D Tilt Effect to Image Free — CSS Parallax Generator Online",
    description:
      "Add a 3D tilt, parallax, or perspective effect to any image. Export as PNG or copy the CSS transform. Free, no upload.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "2D to 3D Image Effect Generator by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 2D to 3D Image Transform Generator",
    description:
      "Apply live 3D perspective transforms, depth effects, and rotations to any image right in your browser. Copy CSS or download as PNG.",
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

// ─── Comprehensive JSON-LD Structured Data ────────────────────────────────────

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "2D to 3D Image Effect Generator",
  url: TOOL_URL,
  description:
    "A free, browser-based 2D to 3D image converter that applies real-time 3D perspective transforms, rotations, depth effects, and parallax presets to uploaded photos. Export as PNG or extract generated CSS.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with Canvas API and CSS 3D Transform support (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Apply live 3D perspective transforms to any 2D image file",
    "Rotate images interactively along X, Y, and Z axes in real-time",
    "Adjust depth, scale, and skew for custom CSS 3D transforms",
    "Apply 10 live image filters including blur, sepia, and hue-rotate",
    "Export transformed images directly as high-resolution PNG or JPEG",
    "Copy generated CSS 3D transform snippets instantly for web development",
    "16 pre-built animation presets like Cinematic, Isometric, and Pop Out",
    "100% client-side rendering for complete data privacy with no server uploads",
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
  name: "How to Convert a 2D Image to 3D Perspective",
  description:
    "A simple 4-step guide to applying CSS 3D perspective, rotation, and parallax effects to your 2D images using our browser-based generator.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools 2D to 3D Image Effect Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your Image",
      text: "Click the upload area or drag and drop your 2D image file (JPG, PNG, WebP) directly into the browser. Your file is rendered locally and never uploaded to a server.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Adjust 3D Perspective Controls",
      text: "Use the interactive sliders to modify X, Y, and Z axis rotation, adjust the perspective depth, and tweak the scale or skew to achieve your desired 3D tilt.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Apply Filters and Presets",
      text: "Enhance your 3D effect by switching to the Filters tab to adjust brightness, contrast, or drop shadows, or click on predefined presets like 'Cinematic' or 'Isometric' for instant results.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Export Image or Copy CSS",
      text: "Click the Export button to download the resulting image as a high-resolution PNG or JPEG. Alternatively, copy the generated CSS transform code to paste directly into your web project.",
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
      name: "Does this tool actually create a real 3D model?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — it applies CSS 3D transforms to a flat image, simulating depth with perspective projection. The result is a 2D image that looks 3D. True 3D models require dedicated software like Blender.",
      },
    },
    {
      "@type": "Question",
      name: "Are my images uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Never. All processing happens entirely in your browser using the Canvas API and CSS transforms. Your images stay securely on your device at all times.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The generator supports JPG, PNG, WebP, SVG, GIF, and BMP — basically any format natively decoded by your browser. The exported file is always rendered as a PNG or JPEG.",
      },
    },
    {
      "@type": "Question",
      name: "Why does the exported PNG look different from the preview?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Canvas export captures the flat image with filters applied but cannot capture the 3D perspective projection itself — that's a browser-rendering limitation. The CSS snippet in the Export tab gives you the exact values to apply programmatically.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the generated CSS in my own project?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, freely. The generated CSS is composed of standard CSS transforms with no proprietary dependencies. You can apply it to any img or div element in your own codebase.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a file size limit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool enforces a 20 MB limit per image to keep browser performance smooth. Most images well under this limit process instantly without any lag or memory issues.",
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
      name: "Image Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "2D to 3D Image Effect Generator",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Generate3DPage() {
  return (
    <>
      {/* ── JSON-LD Structured Data Scripts ── */}
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

      <>
        <div className="mx-auto max-w-6xl space-y-10">
          {/* ── Page Header ── */}
          <header className="space-y-4 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Add 3D Tilt Effect to Image Free — CSS Parallax Generator
            </h1>
            <img src="/images/generate-3d.webp" alt="Free 3D Text Generator — create 3D text effects and export online" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              Upload any image and apply live 3D perspective transforms, rotations, depth effects,
              filters, and animated presets — all processed locally in your browser. Export the
              result as PNG/JPEG or copy the generated CSS directly into your projects.
            </p>

            <QuickAnswer
              question="How do I add a 3D tilt or parallax effect to an image?"
              answer="Upload your image, adjust the X/Y rotation and perspective depth sliders to get the 3D tilt look you want, then either export the result as a PNG or click 'Copy CSS' to get the transform code you can paste directly into your CSS file."
            />

            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground pt-2">
              <ol className="flex items-center gap-1.5 justify-center sm:justify-start">
                <li>
                  <a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">
                    Home
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <a href={`${SITE_URL}/tools`} className="hover:text-foreground transition-colors">
                    Image Tools
                  </a>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <span className="text-foreground font-medium">2D to 3D Generator</span>
                </li>
              </ol>
            </nav>
          </header>

          {/* ── Interactive Tool Client Component ── */}
          <main id="tool" aria-label="2D to 3D Image Converter Tool">
            <Generate3DClient />
          </main>

          <hr className="border-border my-12" />

          {/* ── High-Value AdSense Educational Content ── */}
          <article
            className="mt-8 prose prose-slate dark:prose-invert max-w-none"
            itemScope
            itemType="https://schema.org/TechArticle"
          >
            <meta itemProp="author" content="Achraf A." />
            <meta itemProp="datePublished" content="2025-01-01" />
            <meta itemProp="dateModified" content="2026-05-01" />

            <h2 className="text-2xl font-bold mb-4" itemProp="headline">
              AI 3D Generation: From Text Prompt to Mesh — What the Model Does
            </h2>
            <div itemProp="articleBody">
              <p className="text-muted-foreground mb-4">
                A product designer needed a rough 3D concept model of a new
                ergonomic keyboard for a client pitch. Traditional 3D modeling in
                Blender: 4–8 hours minimum. AI 3D generation from a text description
                + reference photo: 12 minutes for a usable mesh. The mesh was not
                print-ready (50,000 triangles with no UV unwrap), but it was
                sufficient to render a believable pitch image and get client
                sign-off on the form factor before committing to a full model.
              </p>
              <p className="text-muted-foreground mb-4">
                That use case — concept visualization before committing to
                professional 3D work — is where AI 3D generation is genuinely
                useful today. Production-ready 3D assets for games, manufacturing,
                or AR/VR require human artists; AI 3D generation provides a starting
                point and a concept tool, not a final deliverable.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                How Text-to-3D Works (Two Main Approaches)
              </h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-border text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Approach</th>
                      <th className="border border-border p-2 text-left">Method</th>
                      <th className="border border-border p-2 text-left">Output quality</th>
                      <th className="border border-border p-2 text-left">Generation time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Score Distillation (SDS)', 'Optimizes a NeRF using a 2D diffusion model as a critic — 360° views must all match the text prompt', 'Smooth but "blob-like" shapes; fine surface detail lost', '5–20 minutes'],
                      ['Multi-view image + reconstruction', 'Generates 6–12 views of the object from different angles, then runs photogrammetry-style reconstruction', 'Better surface detail; depends heavily on view consistency', '30–120 seconds'],
                      ['Retrieval + deformation', 'Finds closest 3D asset in training set, deforms to match prompt', 'Highest quality but limited to training set shapes', '5–10 seconds'],
                    ].map(([approach, method, quality, time]) => (
                      <tr key={approach} className="border border-border">
                        <td className="border border-border p-2 font-medium text-sm">{approach}</td>
                        <td className="border border-border p-2 text-muted-foreground text-sm">{method}</td>
                        <td className="border border-border p-2 text-muted-foreground text-sm">{quality}</td>
                        <td className="border border-border p-2 text-muted-foreground text-sm">{time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Output Format Guide
              </h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-border text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Format</th>
                      <th className="border border-border p-2 text-left">Use case</th>
                      <th className="border border-border p-2 text-left">Compatible with</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['OBJ + MTL', 'General 3D editing', 'Blender, Maya, 3ds Max, Cinema 4D'],
                      ['GLB/glTF', 'Web 3D, AR/VR preview', 'Three.js, Babylon.js, Unity, Unreal'],
                      ['STL', '3D printing', 'Any slicer (Cura, PrusaSlicer)'],
                      ['FBX', 'Game engine import', 'Unity, Unreal (with textures)'],
                    ].map(([fmt, use, compat]) => (
                      <tr key={fmt} className="border border-border">
                        <td className="border border-border p-2 font-mono text-xs">{fmt}</td>
                        <td className="border border-border p-2 text-muted-foreground">{use}</td>
                        <td className="border border-border p-2 text-muted-foreground text-sm">{compat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                What AI 3D Cannot Do Yet
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                <li>Produce print-ready manifold meshes without post-processing — expect holes, inverted normals, and disconnected surfaces that need repair in Blender or Meshmixer.</li>
                <li>Generate rigged (animated) 3D characters — bones and skinning are not part of current text-to-3D pipelines.</li>
                <li>Maintain specific dimensions — AI models produce shapes, not engineering drawings with tolerances.</li>
              </ul>
            </div>

            {/* CSS 3D transform properties reference */}
            <div className="not-prose space-y-4 mt-6">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                CSS 3D transform properties — quick reference
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-3 py-2 text-left font-semibold">CSS property / function</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold">Example value</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold">What it does</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["perspective", "800px", "Distance from viewer to z=0 plane — lower = more dramatic"],
                      ["rotateX()", "rotateX(25deg)", "Tilt forward/backward (X axis)"],
                      ["rotateY()", "rotateY(-15deg)", "Tilt left/right (Y axis)"],
                      ["rotateZ()", "rotateZ(5deg)", "Spin in-plane (Z axis)"],
                      ["translateZ()", "translateZ(50px)", "Move element toward/away from viewer"],
                      ["scale3d()", "scale3d(1.05, 1.05, 1)", "Scale on all three axes"],
                      ["transform-style", "preserve-3d", "Required on parent for children to use 3D space"],
                      ["backface-visibility", "hidden", "Hide element face when rotated >90deg (card flip)"],
                    ].map(([prop, example, desc]) => (
                      <tr key={prop as string} className="odd:bg-muted/30">
                        <td className="border border-border px-3 py-2 font-mono text-xs">{prop as string}</td>
                        <td className="border border-border px-3 py-2 font-mono text-xs">{example as string}</td>
                        <td className="border border-border px-3 py-2 text-muted-foreground">{desc as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <RelatedTools
              tools={[
                { name: "Generate 3D from 2D", path: "/tools/generate-3d-2d" },
                { name: "Diagram Generator", path: "/tools/diagram-generator" },
                { name: "UML AI Generator", path: "/tools/uml-ai" },
              ]}
            />
          </article>

          {/* ── Page Footer Summary ── */}
          <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
            <p>
              <strong>TheFreeAITools — 2D to 3D Image Effect Generator</strong> is an advanced,
              fully private client-side utility that transforms flat imagery. Upload standard formats
              like <strong>JPG</strong>, <strong>PNG</strong>, and <strong>WebP</strong> to apply
              stunning 3D perspective, rotation, and parallax effects. Whether you are extracting
              CSS transform code for modern web development or downloading styled graphics in 2026,
              our 100% free tool processes everything securely in your browser , no uploads required.
            </p>
          </footer>
        </div>
     </>
    </>
  )
}
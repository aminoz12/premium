import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import ClientPage from "./client-page"
import type { Metadata } from "next"
import Link from "next/link"
import { ToolLayout } from "@/components/layout/tool-layout-server"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/base64-encoder`

export const metadata: Metadata = {
  title: "Base64 Encode Image for HTML/CSS Free — Encoder & Decoder Online",
  description:
    "Base64 encode any image, text, or file and embed it directly in HTML, CSS, or HTTP headers. Decode Base64 strings instantly in your browser.",
  alternates: { canonical: TOOL_URL },
}

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Base64 Encoder & Decoder",
  url: TOOL_URL,
  description:
    "A free, browser-based tool to encode text, images, or binary data to Base64 format, or decode Base64 strings back to their original form.",
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Encode or Decode a Base64 String",
  description: "Use the Base64 Encoder to convert text or binary to Base64 and back.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Paste or type your input", text: "Paste or type the input you want to encode or decode.", url: TOOL_URL },
    { "@type": "HowToStep", position: 2, name: "Select mode", text: "Choose Encode or Decode.", url: TOOL_URL },
    { "@type": "HowToStep", position: 3, name: "Copy result", text: "Copy the result or use it inline in HTML/CSS.", url: TOOL_URL },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Does this tool upload my data?", acceptedAnswer: { "@type": "Answer", text: "No — all processing happens in your browser." } },
  ],
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
    { "@type": "ListItem", position: 3, name: "Base64 Encoder & Decoder", item: TOOL_URL },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-black dark:text-white">
        <ol className="flex items-center gap-1">
          <li>
            <Link href={`${SITE_URL}/`} className="hover:underline">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`${SITE_URL}/tools`} className="hover:underline">Tools</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">Base64 Encoder &amp; Decoder</li>
        </ol>
      </nav>

      <header className="mb-6 space-y-4 px-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Base64 Encode Image for HTML/CSS — Encoder & Decoder Online</h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Encode text, images, or binary data to Base64 in your browser. Use the result as a data URI in HTML or CSS. No uploads.
        </p>
        <QuickAnswer question="How do I Base64 encode an image?" answer="Paste or encode the image here and use the generated data URI in your HTML/CSS." />
      </header>

      <main>
        <ClientPage />
      </main>

      <hr className="my-12 border-gray-200" />

      <article className="space-y-12 max-w-4xl" itemScope itemType="https://schema.org/TechArticle">
        <meta itemProp="name" content="Base64 Encoder/Decoder: What It Does and When to Use It" />
        <section aria-labelledby="related-tools-heading" className="space-y-4">
          <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight text-foreground">Related tools</h2>
          <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
            <RelatedTools tools={[{ name: "JWT Decoder", path: "/tools/jwt-decoder" }, { name: "URL Encoder / Decoder", path: "/tools/url-encoder" }]} />
          </nav>
        </section>
      </article>
    </>
  )
}

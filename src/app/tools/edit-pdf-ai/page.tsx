import type { Metadata } from "next"
import Image from "next/image"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/edit-pdf-ai"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`
const PRIMARY_EDITOR_URL = `${SITE_URL}/tools/edit-pdf`
const CHAT_PDF_URL = `${SITE_URL}/tools/chat-with-pdf`

export const metadata: Metadata = {
  title: "AI PDF Editor Workflow — Edit PDFs + AI Reading, Free",
  description:
    "Edit PDFs in your browser paired with AI for summarizing and Q&A. Free, no upload, no account. Browser-based PDF editor enhanced with AI assistance.",
  keywords: [
    "ai pdf editor",
    "edit pdf with ai",
    "ai assisted pdf editing",
    "free ai pdf tool",
    "summarize pdf and edit",
    "chat with pdf and edit",
    "edit pdf no upload ai",
    "ai pdf editing workflow",
    "pdf editor ai pairing",
    "no account ai pdf",
  ],
  // Canonical points to the primary PDF editor URL. This page exists as a
  // workflow-guide variant of the same underlying tool; signals consolidate to
  // /tools/edit-pdf to avoid duplicate-content cannibalization.
  alternates: {
    canonical: PRIMARY_EDITOR_URL,
  },
  openGraph: {
    title: "AI PDF Editor Workflow — Edit PDFs + AI Reading, Free",
    description:
      "Edit PDFs in your browser and pair with AI for summarizing or Q&A. Free, no upload, no account.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "AI PDF Editor Workflow — Edit + AI Reading by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI PDF Editor Workflow — Free, No Upload",
    description:
      "Edit PDFs in your browser, then pair with Chat with PDF for AI summarization and Q&A. No account.",
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

// Minimal schema graph. No SoftwareApplication / HowTo / FAQPage here because
// the canonical /tools/edit-pdf owns those rich results for the underlying
// editor. We only emit a BreadcrumbList specific to this URL.
const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
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
          name: "PDF Tools",
          item: `${SITE_URL}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "AI PDF Editor Workflow",
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
        <header className="mb-6 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            AI PDF Editor Workflow — Edit Privately, Pair with AI for Reading
          </h1>

          <Image
            src="/images/edit-pdf-1.webp"
            alt="PDF editor interface — edit text and annotate; pair with AI Chat with PDF for summarization"
            width={1200}
            height={630}
            priority
            className="rounded-lg border max-w-3xl w-full h-auto"
          />

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Looking for an AI PDF editor? Here&apos;s the honest answer: the editor
            itself is a browser-based PDF editor that runs entirely on your device
            (the same one available at{" "}
            <a
              href="/tools/edit-pdf"
              className="text-primary underline-offset-4 hover:underline"
            >
              /tools/edit-pdf
            </a>
            ), and for AI-driven tasks like summarization or Q&amp;A you pair it with
            our{" "}
            <a
              href="/tools/chat-with-pdf"
              className="text-primary underline-offset-4 hover:underline"
            >
              Chat with PDF
            </a>{" "}
            tool. Both are free, both keep editing private to your device.
          </p>

          <QuickAnswer
            question="Is there a free AI PDF editor that edits text and summarizes documents in one tool?"
            answer="No single tool does both well. The free PDF editor at /tools/edit-pdf modifies PDF text, annotations, and signatures in your browser without uploading. For AI summarization and Q&A, pair it with the Chat with PDF tool at /tools/chat-with-pdf. The combination gives you private editing plus AI-assisted reading."
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
                  PDF Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">
                  AI PDF Editor Workflow
                </span>
              </li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="PDF Editor">
           <ClientPage />
        </main>

        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        <article className="space-y-12 max-w-4xl">
          <section aria-labelledby="why-two-tools" className="space-y-4">
            <h2
              id="why-two-tools"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why Two Tools Instead of One AI PDF Editor?
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Most pages selling an &quot;AI PDF editor&quot; bundle two very different
              jobs into one product: <strong>editing</strong> (changing the content of
              the file) and <strong>reading</strong> (understanding the content with AI
              assistance). Combining them in a single tool usually means uploading your
              PDF to a server so a cloud AI model can process it. That breaks the
              privacy guarantee that makes browser-based editing valuable in the first
              place.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              We split the workflow on purpose. The{" "}
              <a
                href={PRIMARY_EDITOR_URL}
                className="text-primary underline-offset-4 hover:underline"
              >
                PDF Editor
              </a>{" "}
              runs entirely in your browser — no upload, ever. The{" "}
              <a
                href={CHAT_PDF_URL}
                className="text-primary underline-offset-4 hover:underline"
              >
                Chat with PDF
              </a>{" "}
              tool sends content to an AI provider only when you choose to ask a
              question or summarize. You decide which document content leaves your
              device.
            </p>
          </section>

          <section aria-labelledby="workflow" className="space-y-4">
            <h2
              id="workflow"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Recommended AI-Assisted PDF Workflow
            </h2>
            <ol className="space-y-3 text-base leading-7 text-muted-foreground list-decimal list-inside">
              <li>
                <strong>Open the PDF in this editor</strong> to see the contents and
                make any obvious edits, redactions, or annotations privately.
              </li>
              <li>
                <strong>If you need to summarize or ask questions</strong>, switch to{" "}
                <a
                  href={CHAT_PDF_URL}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Chat with PDF
                </a>
                . Upload only the version you&apos;re comfortable sharing with an AI
                provider — redact anything sensitive in this editor first.
              </li>
              <li>
                <strong>Bring AI insights back into the edit</strong>: paste the AI
                summary as a sticky note or callout on the PDF, then export the
                annotated version for sharing.
              </li>
              <li>
                <strong>For pure manual edits</strong>, the bookmark you want is{" "}
                <a
                  href={PRIMARY_EDITOR_URL}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  /tools/edit-pdf
                </a>{" "}
                — same editor, cleaner URL.
              </li>
            </ol>
          </section>

          <section aria-labelledby="honest-faq" className="space-y-4 rounded-2xl bg-muted/30 p-6 md:p-8">
            <h2
              id="honest-faq"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Honest Questions About AI PDF Editing
            </h2>
            <dl className="grid gap-6 md:grid-cols-2">
              <div>
                <dt className="text-base font-semibold text-foreground">
                  Does this editor use AI to edit PDFs?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  No. The editor itself is a manual PDF editor — you click, type,
                  highlight, and sign. AI tasks (summarization, Q&amp;A, extraction)
                  are handled by our separate{" "}
                  <a
                    href={CHAT_PDF_URL}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Chat with PDF
                  </a>{" "}
                  tool. Pairing the two gives you the best of both worlds.
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-foreground">
                  Is there a fully local AI PDF editor?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  In-browser AI summarization at production quality is still
                  experimental — running an LLM client-side requires hundreds of
                  megabytes of model weights and significant device RAM. Until that
                  matures, splitting editing (local) from AI reading (cloud, with your
                  consent) is the honest, private trade-off.
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-foreground">
                  Can I send the edited PDF to ChatGPT or Claude for summarization?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Yes — export from this editor, then upload the result to any AI
                  service you trust. Or use our{" "}
                  <a
                    href={CHAT_PDF_URL}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Chat with PDF
                  </a>{" "}
                  tool directly.
                </dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-foreground">
                  Should I bookmark this URL or /tools/edit-pdf?
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Bookmark{" "}
                  <a
                    href={PRIMARY_EDITOR_URL}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    /tools/edit-pdf
                  </a>
                  . It&apos;s the canonical URL for the editor. This page exists as a
                  workflow guide for users searching specifically for &quot;AI PDF
                  editor&quot;.
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="related" className="space-y-4">
            <h2
              id="related"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related PDF Tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Free PDF Editor (canonical)", path: "/tools/edit-pdf" },
                  {
                    name: "Chat with PDF (AI summarization & Q&A)",
                    path: "/tools/chat-with-pdf",
                  },
                  { name: "PDF to Word", path: "/tools/pdf-to-word" },
                  { name: "Word to PDF", path: "/tools/word-to-pdf" },
                ]}
              />
            </nav>
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>About this page:</strong> the editor on this URL is the same
            browser-based PDF editor available at{" "}
            <a
              href={PRIMARY_EDITOR_URL}
              className="text-primary underline-offset-4 hover:underline"
            >
              /tools/edit-pdf
            </a>{" "}
            (the canonical URL). For AI-driven tasks like summarization and Q&amp;A,
            use{" "}
            <a
              href={CHAT_PDF_URL}
              className="text-primary underline-offset-4 hover:underline"
            >
              /tools/chat-with-pdf
            </a>
            .
          </p>
          <p>Last reviewed: 2026-05-11.</p>
        </footer>
      </div>
    </>
  )
}

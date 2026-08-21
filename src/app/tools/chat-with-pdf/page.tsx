import type { Metadata } from "next"
import { RelatedTools } from "@/components/tools/related-tools"
import { QuickAnswer } from "@/components/seo/quick-answer"
import Image from "next/image"
import { JsonLd } from "@/components/seo/json-ld"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import ChatWithPdfClient from "./client-page"

// ─── Absolute URL constants ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/chat-with-pdf`

// ─── Legacy constants preserved ───────────────────────────────────────────
const PATH = "/tools/chat-with-pdf"
const IMAGE = "/images/chat-with-pdf.webp"

// Title: "Chat with PDF Free: AI PDF Reader & Q&A Tool" = 50 characters ✓
const TITLE = "Summarize PDF Free — Ask AI Questions About Any Document"
const DESCRIPTION =
  "Upload any PDF and ask the AI to summarize it, extract key points, or explain contract clauses. Free, no account, file never leaves your browser."

// ─── FAQ data (single source of truth — mirrors JSON-LD exactly) ───────────
const FAQ_ITEMS = [
  {
    q: "How do I chat with my PDF?",
    a: "Click the upload area to select your PDF, or drag and drop it onto the page. Once the document loads, type your question into the chat input — for example 'Summarise the key findings' or 'What are the payment terms?' — and press Enter. The AI reads the extracted text and answers in seconds.",
  },
  {
    q: "What types of PDFs are supported?",
    a: "Text-based PDFs work perfectly — research papers, contracts, e-books, reports, slides with embedded text, and technical documentation. Scanned image-only PDFs (where each page is a photograph) cannot be read because there is no embedded text layer. If your scan was processed with OCR before saving, it will work.",
  },
  {
    q: "What output formats or answer styles can I request?",
    a: "You can ask for any format in your question. Request a bullet-point summary, a numbered list of key clauses, a plain-English explanation of legal language, a comparison table, or a one-paragraph abstract. The AI adapts its output format to whatever you ask for.",
  },
  {
    q: "Is my PDF stored on your servers?",
    a: "No. Text extraction happens entirely in your browser using PDF.js. Your file is never uploaded to any server, never stored, and never shared. The only data sent to the AI model is the extracted plain text, which is not retained after your session ends.",
  },
  {
    q: "What is the difference between a PDF reader and a PDF AI chatbot?",
    a: "A standard PDF reader displays the document and lets you scroll, search, and annotate. A PDF AI chatbot reads the entire document and lets you ask natural-language questions — it can summarise sections, extract specific facts, compare clauses, explain jargon, and answer follow-up questions in a conversational thread without you having to read the whole document yourself.",
  },
  {
    q: "Is there a file size or page limit?",
    a: "There is no hard file size limit on upload. The AI context window is capped at 80,000 characters of extracted text. Very large PDFs are automatically truncated to that limit, so for very long documents you may want to split them into chapters or sections and chat with each part separately.",
  },
  {
    q: "Is Chat with PDF free to use?",
    a: "Yes, completely free. No account, no subscription, and no credit card is required. You can upload and chat with as many PDFs as you like.",
  },
  {
    q: "Can I use this to study textbooks or research papers?",
    a: "Absolutely — this is one of the most popular use cases. Ask for a section summary, request definitions of technical terms, generate practice questions from a chapter, or ask the AI to explain a complex methodology in simpler language. It works with any text-based academic PDF.",
  },
]

// ─── Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "chat with pdf",
    "ai pdf reader",
    "pdf question answering",
    "ask pdf questions free",
    "pdf ai chatbot",
    "pdf summarizer free",
    "document ai free",
    "pdf analyzer online",
    "read pdf with ai",
    "free pdf chat no signup",
    "ai document assistant",
    "chat with pdf free no account",
    "pdf to chat online",
    "pdf reader ai browser-based",
    "pdf question answering no upload",
    "chat with pdf 2026",
    "summarize pdf free online",
    "extract clauses from pdf ai",
    "study pdf with ai free",
    "private pdf ai no server",
    "research paper summarizer free",
    "contract pdf analyzer free",
    "pdf chatbot online free",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    type: "website",
    url: TOOL_URL,
    title: "Chat with PDF Free — Ask Questions, Summarise & Extract Instantly",
    description:
      "Upload any PDF and ask the AI anything. Summarize papers, extract contract clauses, study textbooks. Free, private — your file never leaves your browser.",
    siteName: siteConfig.name,
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Chat with PDF AI Tool — TheFreeAITools.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat with PDF Free: AI Reads Your Doc & Answers Any Question",
    description:
      "Drop in any PDF and start asking questions. Summaries, clause extraction, study Q&A — free, no account, private. File never leaves your browser.",
    images: [`${TOOL_URL}/opengraph-image`],
    site: "@thefreeaitools",
  },
  robots: { index: true, follow: true },
}

// ─── JSON-LD schemas ───────────────────────────────────────────────────────
const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Chat with PDF — Free AI PDF Reader",
  url: TOOL_URL,
  description:
    "Upload any PDF and ask the AI anything. Summarize papers, extract contract clauses, study textbooks. Free, private — file never leaves your browser.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements:
    "Requires JavaScript. Chrome 88+, Firefox 85+, Safari 14+, Edge 88+.",
  featureList: [
    "Natural-language question answering across the full PDF text",
    "Automatic document summarisation on request",
    "Contract clause extraction and plain-English explanation",
    "100% browser-based text extraction via PDF.js — file never uploaded to a server",
    "Supports research papers, contracts, e-books, reports, and technical documentation",
    "Multi-turn conversational Q&A — ask follow-up questions in the same session",
    "No account, subscription, or credit card required",
    "80,000-character context window for long documents",
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
  name: "How to Chat with a PDF Using AI",
  description:
    "Use the free AI PDF chatbot to ask questions about any PDF document in under a minute.",
  totalTime: "PT1M",
  tool: [{ "@type": "HowToTool", name: "TheFreeAITools Chat with PDF" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your PDF",
      text: "Click the upload area or drag and drop your PDF onto the page. Text extraction begins immediately in your browser using PDF.js — the file is never sent to a server.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Wait for the Document to Load",
      text: "The tool extracts the text from your PDF locally. A progress indicator shows when extraction is complete and the AI is ready to answer questions.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Type Your Question",
      text: "Type any natural-language question into the chat input — for example 'What are the main findings?', 'List all payment terms', or 'Explain section 4 in plain English'.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Read the Answer and Ask Follow-Ups",
      text: "The AI responds using the document's content. Continue asking follow-up questions in the same session — the conversation is fully multi-turn and retains full document context.",
      url: TOOL_URL,
    },
  ],
}

const faqSchema = {
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
      name: "AI Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Chat with PDF",
      item: TOOL_URL,
    },
  ],
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ChatWithPdfPage() {
  return (
    <>
      <JsonLd id="chat-pdf-webapp-schema" data={webAppSchema} />
      <JsonLd id="chat-pdf-howto-schema" data={howToSchema} />
      <JsonLd id="chat-pdf-faq-schema" data={faqSchema} />
      <JsonLd id="chat-pdf-breadcrumb-schema" data={breadcrumbSchema} />

      <header className="max-w-4xl mx-auto px-4 pt-8 pb-4 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Summarize PDF Free — Ask AI Questions About Any Document
        </h1>
        <Image
          src="/images/chat-with-pdf.webp"
          alt="Chat with PDF interface — upload a PDF and ask the AI questions in natural language"
          width={1200}
          height={630}
          priority
          className="rounded-lg border w-full h-auto"
        />
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Upload any text-based PDF and ask the AI anything. Summarise research
          papers, extract contract clauses, study textbooks — free, no account,
          private. Your file is parsed in the browser using PDF.js; only the
          extracted text is sent to the AI model.
        </p>

        <QuickAnswer
          question="How do I summarize a PDF for free using AI?"
          answer="Upload your PDF to this tool (it stays in your browser — never uploaded to a server), then type 'Give me a 5-bullet summary of this document' and press Enter. The AI reads the full text and returns a concise summary in seconds. No account or subscription required."
        />
      </header>

      <ChatWithPdfClient />

      <hr className="my-10 border-border" />

      {/* ── Rich article for AdSense content quality ── */}
      <article
        className="space-y-12 max-w-4xl"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="name" content="Chat with PDF: How RAG Works and What It Gets Wrong" />
        <meta
          itemProp="description"
          content="How PDF Q&A tools use retrieval-augmented generation, why they hallucinate answers that aren't in the document, and how to prompt them to get accurate results."
        />
        <meta itemProp="datePublished" content="2024-04-25" />
        <meta itemProp="dateModified" content="2026-05-25" />
        <meta itemProp="author" content="Achraf A." />

        {/* How RAG works */}
        <section aria-labelledby="how-rag-works" className="space-y-4">
          <h2
            id="how-rag-works"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            How &quot;chat with PDF&quot; actually works under the hood
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            PDF Q&amp;A tools use Retrieval-Augmented Generation (RAG): the PDF text is
            split into chunks (typically 500–1000 tokens each), converted to vector
            embeddings, and stored in a local vector index. When you ask a question,
            the tool finds the chunks most semantically similar to your question,
            injects them into a prompt, and sends that to a language model. The
            model answers based only on those retrieved chunks — not the full document.
          </p>
          <p className="text-base leading-7 text-muted-foreground">
            This means the accuracy of the answer depends on two things: whether
            the relevant text was retrieved (retrieval accuracy), and whether the
            model correctly synthesized the retrieved text (generation accuracy).
            Both can fail independently — and when they fail, the tool often produces
            a confident-sounding wrong answer.
          </p>
        </section>

        {/* Why it hallucinates */}
        <section
          aria-labelledby="why-hallucinations"
          className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
        >
          <h2
            id="why-hallucinations"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            Why PDF Q&amp;A tools give wrong answers with confidence
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-0.5 shrink-0 font-bold text-foreground">The answer spans multiple sections</span>
              <span>
                If the answer requires combining information from page 3 and page 47,
                the retrieval step may only fetch one of those sections. The model
                answers from incomplete context, filling the gap with plausible-sounding
                but fabricated content.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 shrink-0 font-bold text-foreground">The question uses different words than the document</span>
              <span>
                Vector similarity is not perfect synonym matching. Asking about
                &quot;revenue&quot; when the document says &quot;sales&quot; may retrieve wrong chunks.
                Rephrasing your question using the document&apos;s own terminology
                dramatically improves retrieval accuracy.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 shrink-0 font-bold text-foreground">The document uses tables, charts, or images</span>
              <span>
                Most RAG pipelines extract plain text. Data in tables is often
                extracted poorly or incorrectly (merged cells, misaligned columns).
                Charts and images are skipped entirely. Numerical answers from tables
                are the highest-risk category for hallucination.
              </span>
            </li>
          </ul>
        </section>

        {/* How to get accurate results */}
        <section aria-labelledby="accurate-results" className="space-y-4">
          <h2
            id="accurate-results"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            How to prompt for more accurate answers
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            Ask the tool to quote the source passage: &quot;What does the document say
            about X? Quote the relevant section.&quot; If the tool can&apos;t quote it,
            the answer is likely hallucinated. For numerical data, ask for the
            page number or section: &quot;On what page is the revenue figure mentioned?&quot;
            Then verify manually. Treat every answer as a starting point for
            verification, not a final answer — especially for numbers, dates,
            names, and contractual terms.
          </p>
        </section>

        {/* PDF prompt cheat sheet */}
        <section aria-labelledby="pdf-prompts" className="space-y-4">
          <h2
            id="pdf-prompts"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            Best prompts for chatting with PDFs — by document type
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-2 text-left font-semibold">Document type</th>
                  <th className="border border-border px-3 py-2 text-left font-semibold">Prompt to use</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Research paper", "Summarize the key findings and methodology in 5 bullet points. What are the limitations acknowledged by the authors?"],
                  ["Contract / legal agreement", "List every obligation of each party. What are the termination clauses? What happens if a party breaches the agreement?"],
                  ["Annual report / financial doc", "What was the total revenue and net income? What risks did management highlight? Summarize the outlook section."],
                  ["Technical documentation", "Explain [feature name] in simple terms. What are the prerequisites? Give me a step-by-step quick-start guide."],
                  ["Textbook chapter", "Create 10 multiple-choice practice questions from this chapter. Then explain [concept] as if I am a beginner."],
                  ["Job offer letter", "List the salary, start date, benefits, non-compete terms, and any equity or bonus details. What is missing compared to a standard offer?"],
                  ["User manual / FAQ", "What troubleshooting steps are recommended for [problem]? Is there a warranty section? What voids the warranty?"],
                  ["Academic thesis", "What is the research question? Summarize the abstract, methodology, and conclusion in plain English."],
                ].map(([docType, prompt]) => (
                  <tr key={docType as string} className="odd:bg-muted/30">
                    <td className="border border-border px-3 py-2 font-medium align-top">{docType as string}</td>
                    <td className="border border-border px-3 py-2 text-muted-foreground italic text-xs">{prompt as string}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                { name: "PDF to Word", path: "/tools/pdf-to-word" },
                { name: "PDF Editor", path: "/tools/edit-pdf" },
                { name: "Text Humanizer", path: "/tools/text-humanizer" },
              ]}
            />
          </nav>
        </section>
      </article>

      <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl mx-auto px-4">
        <p>
          <strong>TheFreeAITools — Chat with PDF</strong> is a free, private AI
          document tool that lets you ask questions about any text-based{" "}
          <strong>PDF</strong> directly in your browser. Supports{" "}
          <strong>research papers</strong>, <strong>contracts</strong>,{" "}
          <strong>e-books</strong>, <strong>reports</strong>, and{" "}
          <strong>technical documentation</strong>. Text extraction is performed
          locally using <strong>PDF.js</strong> — your file never leaves your
          device and is never stored on any server. Fully free with no account
          required, maintained and updated through 2026.
        </p>
      </footer>
    </>
  )
}
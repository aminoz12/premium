import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
// ─── FIX 1: Absolute URLs ONLY ────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/perchance-story-generator"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

// ─── FIX 2: Perfect Metadata & Freshness ─────────────────────────────────────
// Title: 57 characters (counted manually) — within 50–60 char SERP window

export const metadata: Metadata = {
  title: "Free Story Generator — Romance, Novel & AI Creative Stories",
  description:
    "Generate romance stories, novels, and creative fiction free — no signup. AI story generator with perchance-style randomness. Free romance story generator, no restrictions.",
  keywords: [
    "romance story generator",
    "ai story generator free",
    "free romance story generator",
    "ai novel generator free",
    "perchance story generator",
    "random story generator",
    "ai story generator",
    "creative writing tool",
    "story prompt generator",
    "perchance generator",
    "short story maker",
    "free story generator",
    "random tale creator",
    "fiction writer tool",
    "story idea generator",
    "browser-based story tool",
    "no signup story generator",
    "secure creative writing",
    "best story generator 2026",
    "perchance alternative",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free Perchance Story Generator — AI-Generated Creative Stories",
    description:
      "Generate unique, creative stories instantly with our Perchance story generator. Free, browser-based tool for writers, gamers, and creative prompts. No signup required.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free Perchance Story Generator — AI-Generated Creative Stories by TheFreeAITools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Perchance Story Generator — Creative Story Maker",
    description:
      "Generate unique, creative stories instantly with our Perchance story generator. Free, browser-based tool. No signup required.",
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

// ─── FIX 3: Comprehensive JSON-LD Structured Data ────────────────────────────

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Perchance Story Generator",
  url: TOOL_URL,
  description:
    "A free online tool that generates unique, AI-powered creative stories using a Perchance-style random generator. Perfect for writers, role-playing games, and creative prompts. All processing is client-side and private.",
  applicationCategory: "WritingApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 15.4+, Edge 88+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Generate creative stories with one click",
    "Customize story length and style",
    "Choose from multiple genres (fantasy, sci-fi, horror, romance)",
    "Randomly combine characters, settings, and plots",
    "Copy generated stories to clipboard",
    "100% client-side processing for privacy",
    "No account or signup required",
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
  name: "How to Generate a Creative Story with Perchance",
  description:
    "A simple step-by-step guide to creating unique, AI-generated stories using our free Perchance story generator.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools Perchance Story Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose Your Story Preferences",
      text: "Select a genre (fantasy, sci-fi, horror, romance) and choose the desired length — short, medium, or long. You can also pick a narrative style like 'classic' or 'twist ending'.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Click Generate Story",
      text: "Press the 'Generate Story' button. The tool will randomly combine characters, settings, and plot elements from its Perchance-style library to create a unique story.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Read and Enjoy Your Story",
      text: "The generated story will appear on screen. Read it for inspiration, use it as a writing prompt, or share it with friends.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Regenerate or Copy",
      text: "Click 'Regenerate' to get a new story, or click 'Copy' to save the story to your clipboard for later use in your writing projects.",
      url: TOOL_URL,
    },
  ],
}

// ─── FIX 4: Zero Schema Duplication — FAQPage JSON-LD is the single source of
// truth. No HTML Microdata (itemScope / itemType / itemProp) is used in the
// FAQ section of the JSX below. ────────────────────────────────────────────────

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a Perchance story generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Perchance story generator is a tool that uses a random selection algorithm to combine story elements — characters, settings, conflicts, and outcomes — into a unique narrative. It's named after the popular Perchance platform for randomized generators.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the generated stories for commercial purposes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the stories generated by this tool are free to use for personal or commercial projects, including writing prompts, game scenarios, social media content, or even as inspiration for published works. No attribution is required.",
      },
    },
    {
      "@type": "Question",
      name: "What genres does the story generator support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool supports multiple genres, including fantasy, science fiction, horror, romance, and mystery. Each genre has its own set of story elements, ensuring diverse and creative output.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data secure when generating stories with this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% secure. All processing occurs entirely in your browser using JavaScript. Your story preferences and generated content are never sent to our servers, stored, or logged. The tool is completely private.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a Perchance story generator and an AI language model?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Perchance story generator uses prewritten story fragments and random combinations to create narratives, offering endless variety without needing a massive neural network. An AI language model (like ChatGPT) generates text word by word based on training data. Both produce stories, but Perchance generators tend to be faster, more consistent, and fully client-side.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any limitations to this free story generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool is completely free with no usage limits. It supports all major genres and story lengths. For very specific or niche story requirements, the combination library may not include every possible element, but it covers a wide range of creative options. All processing is client-side and private.",
      },
    },
  ],
}

// ─── FIX 3 (cont.): BreadcrumbList — 3-level: Home > Writing Tools > Tool ──────

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
      name: "Writing Tools",
      item: `${SITE_URL}/categories/writing`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Perchance Story Generator",
      item: TOOL_URL,
    },
  ],
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Page() {
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

      <div className="px-14 py-8">
        {/* ── Page Header ── */}
        <header className="mb-6 space-y-4 px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free Perchance Story Generator — AI-Generated Creative Stories
          </h1>
          <img src="/images/perchance-story-generator.webp" alt="perchance story generator" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Generate unique, <strong>creative stories</strong> instantly with our
            Perchance-style generator. Choose from multiple genres — <strong>fantasy</strong>,
            <strong>sci-fi</strong>, <strong>horror</strong>, <strong>romance</strong>
            — and adjust the length. Perfect for writers, role-playing games, and
            creative prompts. All processing runs locally in your browser with
            <strong>100% privacy</strong> — no signup or upload required.
          </p>

          <QuickAnswer
            question="What is a Perchance story generator?"
            answer="A Perchance story generator uses a random selection algorithm to combine story elements — characters, settings, conflicts, and outcomes — into a unique narrative. It's named after the popular Perchance platform for randomized generators."
          />

          {/* ── Breadcrumb — HTML nav (mirrors BreadcrumbList JSON-LD above) ── */}
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
                  href={`${SITE_URL}/categories/writing`}
                  className="hover:text-foreground transition-colors"
                >
                  Writing Tools
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <span className="text-foreground font-medium">Perchance Story Generator</span>
              </li>
            </ol>
          </nav>
        </header>

        {/* ── Interactive Tool (Client Component — DO NOT MODIFY) ── */}
        <main id="tool" aria-label="Perchance Story Generator Tool">
           <ClientPage />
        </main>

        {/* ── Email Capture ── */}
        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        {/* ────────────────────────────────────────────────────────────────────
            FIX 5: AdSense "High Value Content" Injection
            Wrapped in <article> with TechArticle Microdata.
            NOTE: itemScope/itemType/itemProp are used ONLY on the <article>
            wrapper and its meta tags — NOT on any FAQ elements below, which
            are governed solely by the FAQPage JSON-LD above (FIX 4).
        ──────────────────────────────────────────────────────────────────── */}
        <article
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            Perchance-Style Story Generation: Weighted Randomness vs. LLM Generation
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              Perchance.org popularized a specific approach to story generation:
              hierarchical weighted random tables. A story generator built on
              this model doesn&apos;t use a language model at all — it assembles
              stories by randomly selecting elements from nested lists, each
              element weighted by frequency. &quot;A &#123;hero&#125; who must &#123;quest&#125; in
              &#123;setting&#125;&quot; becomes &quot;A reluctant blacksmith who must recover a
              stolen crown in a clockwork city.&quot; The randomness is transparent
              and the output is always grammatically correct, because the grammar
              is baked into the table structure.
            </p>
            <p className="text-muted-foreground mb-4">
              This approach produces a fundamentally different kind of output than
              LLM story generation: shorter, more structured, and highly
              reproducible. Its strength is randomness with human-defined
              constraints; its weakness is that it cannot produce open-ended prose.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Weighted Random vs. LLM Story Generation
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Feature</th>
                    <th className="border border-border p-2 text-left">Weighted random (Perchance style)</th>
                    <th className="border border-border p-2 text-left">LLM generation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Output length', 'Short (1–3 sentences)', 'Unlimited'],
                    ['Grammar', 'Always correct (human-defined)', 'Usually correct (model-generated)'],
                    ['Consistency', 'Same structure every time', 'Variable'],
                    ['Customization', 'Edit the tables', 'Edit the prompt'],
                    ['Reproducibility', 'Same seed = same output', 'Same seed ≈ same output'],
                    ['Truly novel sentences', 'No — recombines defined elements', 'Yes — generates new prose'],
                    ['Speed', 'Instant (no AI call)', 'Seconds (API call)'],
                  ].map(([feature, weighted, llm]) => (
                    <tr key={feature} className="border border-border">
                      <td className="border border-border p-2 font-medium">{feature}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{weighted}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{llm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Best Uses for Each Approach
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              <li>
                <strong>Perchance/weighted random is better for:</strong> Tabletop
                RPG encounter tables, writing prompts that need structural variety,
                character name generators, loot tables, NPC relationship generators.
                Anything where you want &quot;surprising within a defined space.&quot;
              </li>
              <li>
                <strong>LLM generation is better for:</strong> Actual story prose,
                dialogue, descriptions longer than a sentence, and cases where you
                want the generator to make creative connections between elements.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              The Seed System
            </h3>
            <p className="text-muted-foreground mb-4">
              Both approaches support seeding: a fixed seed number produces the
              same output every time. This is useful for sharing stories (&quot;use
              seed 42847 for the story I showed you&quot;), for testing (verify your
              generator produces expected output), and for iterating (hold
              character elements fixed while randomizing the plot).
            </p>
          </div>

          <RelatedTools
            tools={[
              { name: "AI Story Generator", path: "/tools/ai-story-and-novel-generator" },
              { name: "AI Prompt Generator", path: "/tools/ai-prompt-generator" },
              { name: "Random Movie Generator", path: "/tools/random-movie-generator" },
            ]}
          />
        </article>

        {/* ── Page Footer Summary (SEO reinforcement) ── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Perchance Story Generator</strong> is a fully private,
            browser-based tool that generates <strong>creative stories</strong> using a
            Perchance-style randomizer. Supports multiple genres — <strong>fantasy</strong>,
            <strong>sci-fi</strong>, <strong>horror</strong>, <strong>romance</strong>,
            <strong>mystery</strong> — and adjustable story lengths. All processing runs
            locally on your device — your story preferences and generated narratives
            never leave your computer. The fastest free way to generate story ideas in
            2026, with no installs, no accounts, and no hidden limits.
          </p>
        </footer>
      </div>
    </>
  )
}
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { buildToolMetadata } from "@/lib/seo/metadata"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import ClientPage from "./client-page"
import type { Metadata } from "next"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/ai-prompt-generator`

export const FAQ_ITEMS = [
  {
    q: "What is an AI Prompt Generator?",
    a: "An AI Prompt Generator takes your simple ideas and expands them into highly detailed, optimized prompts designed specifically for AI models like Midjourney, ChatGPT, Stable Diffusion, or Claude. It ensures you get the highest quality output from the AI.",
  },
  {
    q: "Which AI tools is this prompt generator compatible with?",
    a: "You can generate prompts tailored for Midjourney, Stable Diffusion, DALL-E 3, ChatGPT, Claude, and Gemini. Just select your target AI from the dropdown menu before generating.",
  },
  {
    q: "What makes a generated prompt better than writing one myself?",
    a: "For image generators like Midjourney, the tool adds professional photography terms, lighting descriptors, art style modifiers, and rendering keywords that dramatically improve visual quality. For text models like ChatGPT, it injects structure, persona, context, and formatting constraints that eliminate vague responses and produce actionable, detailed answers.",
  },
  {
    q: "Is this AI prompt generator free to use?",
    a: "Yes! Our tool is completely free. We use an intelligent rate-limiting system to ensure fair access for everyone while utilizing top-tier open-source and free-tier LLMs for the prompt engineering.",
  },
  {
    q: "Do I need an account or API key to use this tool?",
    a: "No account, login, or API key is required. You can start generating professional-grade prompts instantly right here in your browser. Your input text is processed through our backend and never stored permanently.",
  },
  {
    q: "What is the difference between image prompt generation and text prompt generation?",
    a: "Image prompt generation focuses on visual descriptors — adding camera angles, lighting conditions, artistic mediums, and rendering engines to create photorealistic or stylized outputs. Text prompt generation focuses on structural logic — adding role definitions, step-by-step instructions, output format constraints, and contextual background to produce precise, comprehensive text responses from language models.",
  },
]

export const metadata: Metadata = {
  ...buildToolMetadata("ai-prompt-generator"),
  title: "Free AI Prompt Generator for Midjourney & ChatGPT",
  description:
    "Turn simple ideas into detailed prompts for Midjourney, ChatGPT, Stable Diffusion, and DALL-E 3. Free AI prompt builder — no account needed.",
  keywords: [
    "ai prompt generator",
    "free ai prompt generator online 2026",
    "midjourney prompt generator free",
    "chatgpt prompt builder no account",
    "stable diffusion prompt creator online",
    "dall-e 3 prompt generator browser based",
    "ai art prompt optimizer free",
    "text prompt enhancer for chatgpt claude",
    "automatic prompt engineering tool",
    "best free prompt generator for ai images",
    "no login ai prompt maker online",
    "prompt engineering assistant free tool",
    "midjourney prompt helper with styles",
    "chatgpt system prompt generator",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free AI Prompt Generator — Master Midjourney & ChatGPT Prompts",
    description:
      "Transform vague ideas into masterpiece prompts. Generate detailed, structured prompts for AI image and text models instantly — free, no account needed.",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free AI Prompt Generator — Master Midjourney & ChatGPT Prompts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Perfect AI Prompts in Seconds — Free, No Login",
    description:
      "Stop guessing with AI prompts. Generate expert-level prompts for Midjourney, ChatGPT, and Stable Diffusion instantly. No account required.",
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
  name: "Free AI Prompt Generator",
  url: TOOL_URL,
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  browserRequirements: "Chrome 88+, Firefox 85+, Safari 14+, Edge 88+",
  description:
    "A free browser-based tool that optimizes short text ideas into highly detailed, professional-grade prompts for AI image generators (Midjourney, Stable Diffusion, DALL-E) and text models (ChatGPT, Claude, Gemini).",
  featureList: [
    "Multi-model prompt generation supporting Midjourney, Stable Diffusion, DALL-E 3, ChatGPT, Claude, and Gemini",
    "Image prompt mode with automatic injection of lighting, camera angles, art styles, and rendering engine keywords",
    "Text prompt mode with structured persona, context, format constraints, and step-by-step logic for language models",
    "One-click copy of generated prompts with formatting preserved for direct pasting into target AI platforms",
    "Intelligent rate-limiting system ensuring free access without account registration or API keys",
    "Real-time prompt preview showing how modifiers and constraints will shape the final AI output",
    "Browser-based interface with zero software installation — works on desktop, tablet, and mobile devices",
    "Privacy-first architecture with no permanent storage of user input text or generated prompts",
    "Responsive dark-mode UI optimized for extended creative sessions and reduced eye strain",
    "Context-aware suggestions that adapt prompt complexity based on the selected target AI model",
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
  name: "How to Generate Better AI Prompts for Free",
  description:
    "A step-by-step guide to transforming simple ideas into highly detailed, optimized prompts for AI image and text generation models using a free browser-based tool.",
  totalTime: "PT1M",
  tool: [
    {
      "@type": "HowToTool",
      name: "TheFreeAITools AI Prompt Generator",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter Your Core Idea",
      text: "Type a simple description of what you want to create into the input field. For images, describe the subject and scene. For text, describe the topic or question you need answered.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select Your Target AI Model",
      text: "Choose the AI platform you are prompting for from the dropdown menu — Midjourney, Stable Diffusion, DALL-E 3, ChatGPT, Claude, or Gemini. The generator adapts its output format and keyword strategy specifically for that model.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Choose Image or Text Prompt Mode",
      text: "Toggle between image prompt generation (which adds visual descriptors like lighting and camera angles) or text prompt generation (which adds structural logic like personas and format constraints) based on your creative goal.",
      url: TOOL_URL,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Copy and Paste Into Your AI Tool",
      text: "Click the generate button to receive your optimized prompt, then copy it directly into Midjourney, ChatGPT, or your chosen AI platform. The structured prompt will produce significantly higher quality outputs than your original simple idea.",
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
      name: "AI Writing Tools",
      item: `${SITE_URL}/tools`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "AI Prompt Generator",
      item: TOOL_URL,
    },
  ],
}

export default function Page() {
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

      <>
        <header className="mb-6 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free AI Prompt Generator — Midjourney & ChatGPT
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Stop getting bad AI outputs. Type a simple idea below, and our tool will expand it into a highly detailed, professional-grade prompt engineered specifically for your target AI.
          </p>
          <QuickAnswer
            question="What is an AI prompt generator?"
            answer="An AI prompt generator takes a simple idea and expands it into a detailed, optimized prompt for tools like Midjourney, Stable Diffusion, ChatGPT, or DALL-E — improving output quality without requiring prompt engineering expertise."
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
                  <span itemProp="name">AI Writing Tools</span>
                </a>
                <meta itemProp="position" content="2" />
              </li>
              <li aria-hidden="true">›</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">AI Prompt Generator</span>
                <meta itemProp="item" content={TOOL_URL} />
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>
        </header>

        <main>
          <ClientPage faqs={FAQ_ITEMS} />
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
            The Anatomy of an Effective AI Prompt — And Why Vague Prompts Fail
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A marketing team ran an A/B test on two prompts to generate product
              descriptions for the same item — a portable solar charger. Prompt A:
              &quot;Write a product description for a solar charger.&quot; Prompt B:
              &quot;Write a 120-word product description for a 20,000 mAh solar
              charger targeting outdoor hikers aged 25–45. Lead with the
              fastest-charging scenario. Mention IP67 water resistance and dual
              USB-C output. Tone: confident, no exclamation marks.&quot; Prompt B
              outperformed Prompt A in click-through rate by 34% in a 2-week
              trial. The only variable was prompt specificity.
            </p>
            <p className="text-muted-foreground mb-4">
              Large language models are probability machines. A vague prompt
              averages over thousands of possible interpretations. A specific
              prompt narrows the distribution to a small region of relevant
              outputs. The prompt generator here applies structural patterns that
              consistently produce narrower, higher-quality distributions.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              The Six Elements of a High-Quality Prompt
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Element</th>
                    <th className="border border-border p-2 text-left">What it does</th>
                    <th className="border border-border p-2 text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Role', 'Sets the persona/expertise level', '"You are a senior Python developer specializing in async code"'],
                    ['Task', 'Clear action verb + deliverable', '"Write a decorator that retries failed HTTP calls"'],
                    ['Context', 'Background that changes the answer', '"The codebase uses httpx 0.27, Python 3.12"'],
                    ['Constraints', 'What to exclude or limit', '"No external libraries beyond httpx. Max 40 lines."'],
                    ['Format', 'Output structure', '"Return only the decorator code, no explanation"'],
                    ['Examples', 'Reference output (few-shot)', '"Here is a similar decorator we use: [code]"'],
                  ].map(([el, what, ex]) => (
                    <tr key={el} className="border border-border">
                      <td className="border border-border p-2 font-medium">{el}</td>
                      <td className="border border-border p-2 text-muted-foreground">{what}</td>
                      <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{ex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Prompt Patterns by Use Case
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              <li>
                <strong>Image generation (Midjourney/DALL-E):</strong> Subject →
                style → lighting → camera → mood. Order matters — earlier tokens
                have higher weight. &quot;Moroccan medina, watercolor illustration,
                golden hour light, overhead drone view, peaceful&quot; outperforms
                rearranging those words.
              </li>
              <li>
                <strong>Code generation:</strong> Language + version + library
                versions + what it must NOT do. The &quot;must not&quot; constraint
                prevents the most common failure modes (wrong library version,
                unwanted dependencies).
              </li>
              <li>
                <strong>Writing/editing:</strong> Audience + reading level + word
                count + what emotion to leave the reader with. Without the
                emotional target, outputs are technically correct but flat.
              </li>
              <li>
                <strong>Analysis/research:</strong> Specify the output format
                first (table, bullet list, prose) — the model&apos;s reasoning
                adapts to fit the format constraint rather than the format being
                bolted on at the end.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              What the Generator Cannot Do
            </h3>
            <p className="text-muted-foreground mb-4">
              The prompt generator creates structure — it cannot supply domain
              knowledge you haven&apos;t provided. If you don&apos;t specify the
              target model (GPT-4o, Claude 3, Gemini 1.5), the generated prompt
              may use formatting conventions that work on one model and confuse
              another. Chain-of-thought instructions (&quot;think step by step&quot;)
              improve reasoning on models above ~70B parameters but add noise on
              smaller models. The generator applies these patterns conservatively
              by default.
            </p>
          </div>

          <RelatedTools
            tools={[
              { name: "AI Story Generator", path: "/tools/ai-story-and-novel-generator" },
              { name: "AI Code Generator", path: "/tools/ai-agent-generate-code" },
              { name: "Diagram Generator", path: "/tools/diagram-generator" },
            ]}
          />
        </article>

        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
          <p>
            <strong>TheFreeAITools — AI Prompt Generator</strong> is a free browser-based tool that transforms simple ideas into professional-grade prompts for <strong>Midjourney, ChatGPT, Stable Diffusion, DALL-E 3, Claude, and Gemini</strong>. In 2026, get better AI outputs instantly with structured, model-specific prompt engineering — no account, no API key, and no software installation required. Your creative ideas are processed securely and never stored permanently.
          </p>
          <p>
            Searches related to this tool:{" "}
            <em>
              midjourney prompt generator free, chatgpt prompt builder, ai art prompt maker,
              how to write good ai prompts, stable diffusion prompt creator, best prompt generator online,
              free ai prompt optimizer, dall-e 3 prompt helper, claude prompt engineering tool,
              automatic prompt generator no login.
            </em>
          </p>
        </footer>
      </>
    </>
  )
}
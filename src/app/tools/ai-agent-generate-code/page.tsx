import { buildToolMetadata } from "@/lib/seo/metadata"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import ClientPage from "./client-page"
import type { Metadata } from "next"

// ─── Constants ───────────────────────────────────────────────────────────────
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_SLUG = "ai-agent-generate-code"
const TOOL_URL = `${SITE_URL}/tools/${TOOL_SLUG}`
const CATEGORY_NAME = "Developer Tools"
const CATEGORY_SLUG = "tools"
const SITE_NAME = "TheFreeAITools"
const TWITTER_HANDLE = "@thefreeaitools"

// ─── FAQ Items (must match JSON-LD and HTML FAQ exactly) ──────────────────
export const FAQ_ITEMS = [
  {
    q: "What is the AI Agent Code Generator?",
    a: "It is a free AI-powered tool that generates complete, working code for any task you describe in plain English. It supports Python, JavaScript, TypeScript, Go, Rust, Java, and 15+ other languages — including agent-style code using frameworks like LangChain and AutoGen.",
  },
  {
    q: "What kinds of code can it generate?",
    a: "The tool generates scripts, functions, classes, API integrations, data pipelines, CLI tools, web scrapers, automation agents, and full application modules. Just describe what you want and the AI writes it.",
  },
  {
    q: "Does it generate AI agent code specifically?",
    a: "Yes. You can specify frameworks like LangChain, LlamaIndex, AutoGen, CrewAI, or plain OpenAI/Anthropic API calls. The generator writes agent loops, tool definitions, memory management, and multi-agent orchestration code.",
  },
  {
    q: "Which programming languages are supported?",
    a: "Python, JavaScript, TypeScript, Go, Rust, Java, Kotlin, C#, C++, PHP, Ruby, Swift, Bash, SQL, and more. Specify your preferred language in the prompt or select it from the language dropdown.",
  },
  {
    q: "Is the generated code production-ready?",
    a: "The generated code is a strong starting point. The AI follows language idioms, adds error handling, and includes inline comments for non-obvious logic. Always review and test before deploying to production.",
  },
  {
    q: "Is this code generator free to use?",
    a: "Yes. TheFreeAITools provides this tool completely free with up to 5 code generations per hour. No account or subscription required.",
  },
]

// ─── Metadata ───────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  ...buildToolMetadata(TOOL_SLUG),
  title: "AI Code Generator — Python, JS, TypeScript from Description Free",
  description:
    "Describe what you want to build and the AI writes working code in Python, JavaScript, TypeScript, Go, Rust, or LangChain agent code. Free, no login required.",
  keywords: [
    "ai code generator",
    "generate code from description",
    "ai agent code generator",
    "free code generator online",
    "python code generator ai",
    "javascript code generator",
    "langchain code generator",
    "autogen code generator",
    "ai write code for me",
    "generate python script ai",
    "free ai coding tool 2026",
    "ai programming assistant",
    "generate typescript code",
    "ai agent builder free",
  ],
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: "Free AI Code Generator — Generate Code & AI Agents Instantly",
    description:
      "Describe your task in plain English and get complete, working code. Supports 15+ languages and AI agent frameworks like LangChain and AutoGen.",
    url: TOOL_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${TOOL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Free AI Code Generator — Write Code & AI Agents Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Code Generator – Write Code & AI Agents (No Login)",
    description:
      "Generate Python, JS, Go, Rust & agent code from plain English. Free, no signup, 5 generations per hour.",
    images: [`${TOOL_URL}/opengraph-image`],
    site: TWITTER_HANDLE,
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

// ─── JSON-LD Structured Data ──────────────────────────────────────────────
function buildJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free AI Code Generator",
    url: TOOL_URL,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works with Chrome 88+, Firefox 85+, Safari 14+, Edge 88+.",
    description:
      "A free AI-powered code generator that writes complete, working code in 15+ languages from plain English descriptions. Supports Python, JavaScript, TypeScript, Go, Rust, and AI agent frameworks.",
    featureList: [
      "15+ programming languages supported",
      "AI agent code (LangChain, AutoGen, CrewAI)",
      "Functions, classes, scripts, APIs, data pipelines",
      "Idiomatic output with error handling and comments",
      "5 free generations per hour",
      "No account or signup required",
      "Client-side processing for privacy",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Generate Code with the Free AI Code Generator",
    description:
      "Use our AI code generator to write code in any language from a plain English description. Follow these four simple steps.",
    totalTime: "PT1M",
    tool: [
      {
        "@type": "HowToTool",
        name: `${SITE_NAME} AI Code Generator`,
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Describe your task in plain English",
        text: "Type a sentence describing what you want the code to do. For example: 'Write a Python function that downloads a CSV from a URL and returns it as a pandas DataFrame.' Be specific about input, output, and any libraries.",
        url: TOOL_URL,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Select your programming language",
        text: "Choose from the dropdown menu — Python, JavaScript, TypeScript, Go, Rust, Java, or any of the 15+ supported languages. You can also specify the framework (e.g., LangChain, AutoGen) in the description.",
        url: TOOL_URL,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Choose code type and complexity",
        text: "Select whether you want a simple function, a complete script, a class, or an AI agent. Adjust the complexity level to get more detailed or more concise output.",
        url: TOOL_URL,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Generate, review, and copy your code",
        text: "Click 'Generate Code'. In seconds, you'll receive complete, working code with comments and error handling. Copy it to your clipboard or download as a file, then test and integrate it into your project.",
        url: TOOL_URL,
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
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: CATEGORY_NAME,
        item: `${SITE_URL}/${CATEGORY_SLUG}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "AI Code Generator",
        item: TOOL_URL,
      },
    ],
  }

  return [faqSchema, webAppSchema, howToSchema, breadcrumbSchema]
}

// ─── Page Component ────────────────────────────────────────────────────────
export default function Page() {
  const schemas = buildJsonLd()

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <ToolLayout toolId={TOOL_SLUG}>
        <header className="mb-6 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            AI Code Generator — Python, JS, TypeScript from Description Free
          </h1>
          <img src="/images/ai.webp" alt="Free AI Code Generator — write Python, JavaScript, and TypeScript code with AI" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
          <p className="text-sm text-muted-foreground max-w-2xl">
            Describe what you want to build in plain English and the AI writes
            complete, working code. Supports Python, JavaScript, TypeScript, Go,
            Rust, and AI agent frameworks like LangChain and AutoGen. Free, no
            login required.
          </p>
          <QuickAnswer
            question="How do I generate a Python script from a description using AI?"
            answer="Describe what you want the script to do in plain English — for example: 'Read a CSV file, remove duplicate rows, and save the result.' Select Python from the language dropdown and click Generate. The AI writes the complete script with imports, error handling, and comments. Copy and run it directly."
          />
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <ol className="flex items-center gap-1">
              <li>
                <a href={SITE_URL} className="hover:underline">Home</a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a href={`${SITE_URL}/${CATEGORY_SLUG}`} className="hover:underline">
                  {CATEGORY_NAME}
                </a>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">AI Code Generator</li>
            </ol>
          </nav>
        </header>

        <ClientPage />

        <EmailCapture />

        {/* ─── AdSense High-Value Content ────────────────────────── */}
        <hr className="my-12 border-t" />

        <article
          className="mt-8 prose prose-slate dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="author" content="Achraf A." />
          <meta itemProp="datePublished" content="2025-01-01" />
          <meta itemProp="dateModified" content="2026-05-01" />

          <h2 className="text-2xl font-bold mb-4" itemProp="headline">
            How AI Code Agents Actually Work — And Where They Still Fail
          </h2>
          <div itemProp="articleBody">
            <p className="text-muted-foreground mb-4">
              A developer at a fintech startup asked an AI agent to{' '}
              <em>
                &quot;add Stripe webhook support to the existing Express app&quot;
              </em>
              . The agent wrote 340 lines of handler code, updated the{' '}
              <code>package.json</code>, added a route file, and even wrote a Jest
              test — all in one shot. The test passed locally. In staging, the
              webhook silently failed because the agent used{' '}
              <code>req.body</code> as plain JSON without the raw-body middleware
              Stripe requires for signature verification. A human catching that
              would have taken 10 minutes; the agent took 8 seconds to produce
              plausible-looking broken code.
            </p>
            <p className="text-muted-foreground mb-4">
              That story illustrates the core trade-off: AI code agents collapse
              the time from idea to working prototype dramatically, but they
              produce confident errors indistinguishable from confident correct
              code. Understanding the mechanism helps you use them safely.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              What the Agent Is Actually Doing
            </h3>
            <p className="text-muted-foreground mb-4">
              Unlike a simple autocomplete, an agentic code generator runs a
              loop: it generates a plan, writes code, reads its own output,
              identifies what to fix, and iterates — typically 3–8 rounds before
              delivering a final result. Each round costs one or more LLM
              inference calls. For a 10-file feature, that means 15–40 API calls
              behind the scenes. The quality of the result depends on three
              things: the clarity of your specification, the size of the context
              window (128k tokens ≈ ~90,000 words ≈ a mid-size codebase), and
              whether the model has seen similar patterns in training data.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              What It Generates Well vs. Poorly
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Task type</th>
                    <th className="border border-border p-2 text-left">Quality</th>
                    <th className="border border-border p-2 text-left">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['CRUD REST API', 'Excellent', 'Extremely common pattern in training data'],
                    ['React component with props', 'Excellent', 'Seen millions of times'],
                    ['SQL schema + migrations', 'Good', 'Well-structured, deterministic'],
                    ['CLI tool with flags', 'Good', 'Clear input/output contract'],
                    ['OAuth2 + PKCE flow', 'Mediocre', 'Security details frequently wrong'],
                    ['Distributed system logic', 'Poor', 'Race conditions invisible to LLMs'],
                    ['Business-specific domain logic', 'Poor', 'No training context for your rules'],
                    ['Performance-critical algorithms', 'Poor', 'Correctness bias over efficiency'],
                  ].map(([task, quality, why]) => (
                    <tr key={task} className="border border-border">
                      <td className="border border-border p-2 font-mono text-xs">{task}</td>
                      <td className={'border border-border p-2 font-medium ' + (quality === 'Excellent' ? 'text-green-600' : quality === 'Good' ? 'text-black  dark:text-white' : quality === 'Mediocre' ? 'text-yellow-600' : 'text-red-600')}>{quality}</td>
                      <td className="border border-border p-2 text-muted-foreground">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Honest Limitations
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
              <li>
                <strong>No execution feedback:</strong> The agent cannot run your
                tests unless you provide a terminal tool. It reasons about code
                correctness, it does not verify it.
              </li>
              <li>
                <strong>Context window ceiling:</strong> Projects over ~50,000
                lines of code will exceed the context window. The agent will
                hallucinate imports, function signatures, and file locations that
                don&apos;t exist in the truncated portion.
              </li>
              <li>
                <strong>Security patterns are the highest-risk area:</strong>{' '}
                Input validation, authentication middleware, and SQL query
                construction look correct but contain subtle flaws in roughly 1
                in 4 generated outputs based on security audits of LLM-generated
                code from 2024 research.
              </li>
              <li>
                <strong>No awareness of your git history:</strong> The agent
                cannot see why a previous approach was reverted or what bug a
                past pattern fixed.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              Getting Useful Output: Prompt Structure
            </h3>
            <p className="text-muted-foreground mb-2">
              Vague prompts produce generic code. Specific prompts produce
              specific code. The difference:
            </p>
            <div className="bg-muted rounded-lg p-4 mb-4 text-sm font-mono">
              <p className="text-red-600 mb-2">
                Bad: &quot;add authentication to my app&quot;
              </p>
              <p className="text-green-600">
                Good: &quot;add JWT authentication to this Express 4 app. Use
                jsonwebtoken 9.x. Store tokens in httpOnly cookies (not
                localStorage). Middleware should reject requests with 401 if no
                valid token. Do not add a refresh token endpoint — we handle that
                separately.&quot;
              </p>
            </div>
            <p className="text-muted-foreground mb-4">
              The good prompt eliminates 6 design decisions the agent would
              otherwise make arbitrarily.
            </p>
          </div>

          {/* Prompt examples table */}
          <div className="not-prose space-y-4 mt-6">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              Ready-to-paste prompt examples — by task type
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-2 text-left font-semibold">Task</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Prompt example</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Language</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["CSV deduplication", "Read a CSV file, remove duplicate rows by the 'email' column, and save the cleaned result to output.csv", "Python"],
                    ["REST API call", "Make a GET request to https://api.example.com/users with Bearer token auth, parse the JSON response, and print each user's name and email", "JavaScript"],
                    ["Web scraper", "Scrape the title, price, and URL of each product on a given page using BeautifulSoup. Handle pagination up to 5 pages", "Python"],
                    ["SQLite query", "Connect to database.db, query the 'orders' table for all orders placed in the last 30 days, and return results grouped by customer_id", "Python"],
                    ["CLI file watcher", "Watch a directory for new .json files, validate each against a schema, and log success or errors to a log file", "Node.js"],
                    ["LangChain agent", "Create a LangChain agent with a DuckDuckGo search tool and a calculator tool. Use Claude claude-sonnet-4-6 as the LLM", "Python"],
                    ["React component", "Build a React 18 card component with a title, description, image, and 'Learn More' button. Use Tailwind CSS for styling", "TypeScript"],
                    ["Bash automation", "Delete all .log files older than 7 days in /var/log/myapp and send an email summary of what was deleted", "Bash"],
                  ].map(([task, prompt, lang]) => (
                    <tr key={task as string} className="odd:bg-muted/30">
                      <td className="border border-border px-3 py-2 font-medium align-top">{task as string}</td>
                      <td className="border border-border px-3 py-2 text-muted-foreground text-xs italic align-top">{prompt as string}</td>
                      <td className="border border-border px-3 py-2 font-mono text-xs align-top">{lang as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <RelatedTools
            tools={[
              { name: "Code Explainer", path: "/tools/code-explainer" },
              { name: "Code Converter", path: "/tools/code-converter" },
              { name: "AI Regex Generator", path: "/tools/generator-rex" },
            ]}
          />
        </article>

        {/* ─── Page Footer ──────────────────────────────────────────── */}
        <footer className="mt-12 pt-6 border-t space-y-3 text-xs text-muted-foreground">
          <p>
            <strong>{SITE_NAME} — AI Code Generator</strong> is a free, privacy-first tool that
            uses advanced LLMs to produce idiomatic, production-ready code from natural language
            descriptions. Whether you need a <strong>Python</strong> data pipeline, a{' '}
            <strong>JavaScript</strong> API client, a <strong>LangChain</strong> agent, or an{' '}
            <strong>AutoGen</strong> multi-agent workflow — describe it and the AI builds it.
            No signup, no data collection, no uploads. As of 2026, we continue to refine the
            model for better accuracy and broader language support.
          </p>
          <p>
            Searches related to this tool:{" "}
            <em>
              ai code generator free, generate python code from description, write code using ai,
              langchain code generator, autogen agent builder, ai programming assistant free,
              code from natural language, generate typescript code ai, free coding ai tool.
            </em>
          </p>
        </footer>
      </ToolLayout>
    </>
  )
}
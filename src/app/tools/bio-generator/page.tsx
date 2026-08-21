import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/bio-generator"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

export const metadata: Metadata = {
  title: "Bio Generator — Free Instagram, TikTok & LinkedIn Bio Creator",
  description:
    "Generate a perfect social media bio in seconds. Enter your name, profession, and interests — get 3 ready-to-copy bios for Instagram, TikTok, Twitter/X, or LinkedIn. Free, no signup.",
  keywords: [
    "bio generator", "instagram bio generator", "tiktok bio generator", "linkedin bio generator",
    "twitter bio generator", "social media bio generator free", "bio ideas for instagram",
    "cool instagram bio", "professional bio generator online", "bio creator free",
    "instagram bio ideas 2026", "tiktok bio ideas", "bio for social media",
    "personal bio generator", "short bio generator", "creative bio ideas",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    title: "Free Bio Generator — Instagram, TikTok, Twitter & LinkedIn Bios",
    description: "Generate 3 unique social media bios in seconds. Enter your profession and interests — get fun, professional, or bold bios for any platform.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Free Social Media Bio Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Bio Generator — Instagram, TikTok, Twitter & LinkedIn",
    description: "Generate 3 perfect social media bios in seconds. Fun, professional, or bold — free, no signup.",
    images: [`${SITE_URL}/og-image.png`],
    site: "@thefreeaitools",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
}

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Bio Generator — Instagram, TikTok & LinkedIn",
  url: TOOL_URL,
  description: "Generate three ready-to-copy social media bios for Instagram, TikTok, Twitter/X, or LinkedIn. Personalized by profession, interests, name, and tone.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Generate 3 unique bio variations per platform",
    "Supports Instagram (150 chars), TikTok (80), Twitter/X (160), LinkedIn (220)",
    "Three tone options: Fun, Professional, Bold",
    "Personalized by name, profession, and interests",
    "Character count per bio and platform limit",
    "One-click copy for each bio",
  ],
  publisher: { "@type": "Organization", name: "TheFreeAITools", url: SITE_URL },
}

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long should an Instagram bio be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Instagram allows up to 150 characters in the bio section. The most effective bios use 3–5 lines: first line with your role/niche, second with what you offer or your value proposition, third with personality or interests, and optionally a link call-to-action. Use line breaks to improve readability.",
      },
    },
    {
      "@type": "Question",
      name: "What should I put in my TikTok bio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TikTok bios are limited to 80 characters. Focus on one clear statement: who you are, what you create, or a personality hook. Emojis work well in TikTok bios as they convey meaning quickly. Include your niche or content category so new viewers instantly know if they should follow you.",
      },
    },
    {
      "@type": "Question",
      name: "What makes a good LinkedIn bio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LinkedIn allows 220 characters in the About summary preview. A strong LinkedIn bio states your professional role, your primary area of expertise, and a value statement (what you help others achieve). Avoid jargon and focus on clear, concrete language. Including specific skills and industries improves discoverability in LinkedIn search.",
      },
    },
    {
      "@type": "Question",
      name: "Should I use emojis in my professional bio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the platform and your industry. Instagram and TikTok benefit from emojis as visual markers that break up text and communicate personality quickly. Twitter/X profiles in creative fields commonly use emojis. LinkedIn is more conservative — one or two relevant emojis are acceptable in most industries, but avoid overuse in formal sectors like law, finance, or executive roles.",
      },
    },
    {
      "@type": "Question",
      name: "How often should I update my social media bio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Update your bio whenever your role, focus, or primary content changes. Also update seasonal campaigns or promotions in the link field. A bio that reflects your current work performs better in platform discovery algorithms than a stale one. Quarterly reviews are a good habit.",
      },
    },
  ],
}

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Text & AI Content", item: `${SITE_URL}/categories/text` },
    { "@type": "ListItem", position: 3, name: "Bio Generator", item: TOOL_URL },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <div className="px-4 md:px-14 py-8">
        <header className="mb-6 space-y-4 px-2 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free Bio Generator — Instagram, TikTok, Twitter & LinkedIn Bios
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Create the perfect <strong>social media bio</strong> in seconds. Enter your name, profession,
            and interests — choose your platform and tone — and get <strong>3 ready-to-copy bios</strong> instantly.
            Free, no signup, no limits.
          </p>

          <QuickAnswer
            question="How do I create a good social media bio?"
            answer="Enter your profession and interests below, choose your platform (Instagram, TikTok, Twitter/X, or LinkedIn) and tone (fun, professional, or bold), then click Generate. You'll get 3 unique bios — copy your favorite with one click."
          />

          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground pt-2">
            <ol className="flex items-center gap-1.5">
              <li><a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">Home</a></li>
              <li aria-hidden="true">›</li>
              <li><a href={`${SITE_URL}/tools`} className="hover:text-foreground transition-colors">Tools</a></li>
              <li aria-hidden="true">›</li>
              <li><span className="text-foreground font-medium">Bio Generator</span></li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="Social Media Bio Generator Tool">
           <ClientPage />
        </main>

        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        <article className="space-y-10 max-w-4xl" itemScope itemType="https://schema.org/TechArticle">
          <meta itemProp="name" content="How to Write a Perfect Social Media Bio for Every Platform" />
          <meta itemProp="description" content="Platform-by-platform guide to writing bios that convert visitors into followers on Instagram, TikTok, Twitter/X, and LinkedIn." />
          <meta itemProp="datePublished" content="2026-06-01" />
          <meta itemProp="dateModified" content="2026-06-04" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="bio-anatomy" className="space-y-4">
            <h2 id="bio-anatomy" className="text-2xl font-semibold tracking-tight">
              The anatomy of a high-converting social media bio
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Every effective social media bio answers three questions a new visitor asks in under three
              seconds: <em>Who are you? What do you create or offer? Why should I follow?</em>
              The best bios compress all three answers into a single punchy statement or three short lines.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Element</th>
                    <th className="border border-border p-2 text-left font-semibold">Purpose</th>
                    <th className="border border-border p-2 text-left font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Role/Niche", "Instant context for new visitors", "Fitness coach · nutrition specialist"],
                    ["Value hook", "Why follow or connect", "Helping busy people lose 10kg in 90 days"],
                    ["Personality", "Make it human, not a job description", "Coffee addict ☕ · 3x marathon finisher"],
                    ["CTA / link", "Drive an action", "↓ Free 7-day meal plan"],
                  ].map(([elem, purpose, example]) => (
                    <tr key={elem}>
                      <td className="border border-border p-2 font-medium text-foreground">{elem}</td>
                      <td className="border border-border p-2 text-muted-foreground">{purpose}</td>
                      <td className="border border-border p-2 text-muted-foreground font-mono text-xs">{example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="platform-differences" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="platform-differences" className="text-2xl font-semibold tracking-tight">
              How bio strategy differs by platform
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {[
                ["📸 Instagram", "Visual-forward. Use line breaks, emojis as bullet points, and include a link CTA. Focus on personality and niche. 150-character limit rewards tight writing."],
                ["🎵 TikTok", "Discovery-driven. 80-character limit means one punchy sentence wins. TikTok's algorithm surfaces content to non-followers, so your bio converts curious viewers — keep it sharp."],
                ["🐦 Twitter/X", "Conversation-forward. Keywords matter because Twitter's search indexes bios. Include your expertise area and 1–2 hashtags related to your niche."],
                ["💼 LinkedIn", "Professional credibility. Lead with your current role, add a value statement, and mention the industries you work in. Keywords in the bio improve LinkedIn search ranking."],
              ].map(([platform, text]) => (
                <li key={platform as string} className="flex gap-3">
                  <span className="font-bold text-foreground shrink-0">{platform}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight">Related tools</h2>
            <nav aria-label="Related tools">
              <RelatedTools
                tools={[
                  { name: "Hashtag Generator", path: "/tools/hashtag-generator" },
                  { name: "URL Shortener", path: "/tools/url-shortener" },
                  { name: "Cursive Text Generator", path: "/tools/cursive-text-generator" },
                ]}
              />
            </nav>
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Social Media Bio Generator</strong> creates personalized bios for
            Instagram, TikTok, Twitter/X, and LinkedIn. Enter your profession and interests, choose a tone
            (fun, professional, or bold), and get 3 unique bio options — copy any with one click.
            Free, no signup, works on all devices.
          </p>
        </footer>
      </div>
    </>
  )
}


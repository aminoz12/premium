import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
import { ToolLayout } from "@/components/layout/tool-layout-server"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/hashtag-generator"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

export const metadata: Metadata = {
  title: "Free Hashtag Generator — Best Instagram & TikTok Hashtags 2026",
  description:
    "Generate the best hashtags for Instagram, TikTok, Twitter/X, and YouTube instantly. Enter any topic and get 30 trending, mid-size, and niche hashtags — free, no signup.",
  keywords: [
    "hashtag generator", "instagram hashtag generator", "tiktok hashtag generator",
    "best hashtags for instagram", "free hashtag generator online", "hashtag generator 2026",
    "youtube hashtag generator", "hashtags for reels", "viral hashtags",
    "hashtag finder free", "instagram hashtag finder", "hashtag creator",
    "social media hashtags generator", "twitter hashtag generator", "hashtag ideas",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    title: "Free Hashtag Generator — Instagram, TikTok & YouTube Hashtags",
    description: "Generate 30 optimized hashtags for any topic instantly. Mix trending, mid-size, and niche tags for maximum reach on Instagram, TikTok, and YouTube.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Free Hashtag Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Hashtag Generator — Instagram, TikTok & YouTube",
    description: "Get 30 optimized hashtags for any topic. Free, instant, no signup.",
    images: [`${SITE_URL}/og-image.png`],
    site: "@thefreeaitools",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
}

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Hashtag Generator",
  url: TOOL_URL,
  description: "Generate optimized hashtags for Instagram, TikTok, Twitter/X, and YouTube — free, no account required.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Generate up to 30 hashtags per topic",
    "Supports Instagram, TikTok, Twitter/X, and YouTube limits",
    "Hashtags grouped by popularity (trending, mid-size, niche)",
    "One-click copy all or copy by group",
    "Click individual hashtags to copy",
  ],
  publisher: { "@type": "Organization", name: "TheFreeAITools", url: SITE_URL },
}

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many hashtags should I use on Instagram?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Instagram allows up to 30 hashtags per post. Research suggests using 3–10 highly relevant hashtags performs better than filling all 30 with unrelated tags. Mix 2–3 popular hashtags (1M+ posts), 3–5 mid-size hashtags (100K–1M posts), and 2–3 niche hashtags (<100K posts) for the best reach-to-competition ratio.",
      },
    },
    {
      "@type": "Question",
      name: "How many hashtags should I use on TikTok?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TikTok recommends using 3–5 relevant hashtags. Overstuffing hashtags can confuse TikTok's recommendation algorithm. Always include 1–2 niche-specific hashtags plus 1–2 trending hashtags for broad discovery.",
      },
    },
    {
      "@type": "Question",
      name: "Do hashtags still work on Instagram in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. While Instagram's algorithm prioritizes interest graphs over follower counts, hashtags remain a key discoverability signal for reaching new audiences beyond your followers. The strategy has shifted toward fewer, more targeted hashtags rather than maximum quantity.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between trending and niche hashtags?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trending hashtags (#fitness, #travel) have millions of posts and high competition — your content disappears quickly. Niche hashtags (<100K posts) have smaller audiences but your content stays visible longer and reaches a more targeted audience. Best results come from mixing both.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the same hashtags every post?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Using identical hashtags on every post may signal repetitive behavior to Instagram's algorithm, potentially reducing reach. Rotate your hashtag sets and refresh them every 2–4 weeks to maintain organic reach.",
      },
    },
  ],
}

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "SEO & Web", item: `${SITE_URL}/categories/seo` },
    { "@type": "ListItem", position: 3, name: "Hashtag Generator", item: TOOL_URL },
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
            Free Hashtag Generator — Best Instagram, TikTok & YouTube Hashtags
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Enter any topic or niche to instantly generate <strong>30 optimized hashtags</strong> for Instagram,
            TikTok, Twitter/X, or YouTube. Get a perfect mix of trending, mid-size, and niche hashtags —
            free, no account, no limits.
          </p>

          <QuickAnswer
            question="How do I generate hashtags?"
            answer="Type your topic (e.g. 'travel', 'fitness', 'food'), select your platform, and click Generate. You'll get 30 hashtags grouped by popularity — copy them all with one click."
          />

          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground pt-2">
            <ol className="flex items-center gap-1.5">
              <li><a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">Home</a></li>
              <li aria-hidden="true">›</li>
              <li><a href={`${SITE_URL}/tools`} className="hover:text-foreground transition-colors">Tools</a></li>
              <li aria-hidden="true">›</li>
              <li><span className="text-foreground font-medium">Hashtag Generator</span></li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="Hashtag Generator Tool">
           <ClientPage />
        </main>

        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        <article className="space-y-10 max-w-4xl" itemScope itemType="https://schema.org/TechArticle">
          <meta itemProp="name" content="Hashtag Strategy: How to Choose the Right Hashtags for Maximum Reach" />
          <meta itemProp="description" content="A data-driven guide to choosing hashtags that actually grow your reach on Instagram, TikTok, and YouTube in 2026." />
          <meta itemProp="datePublished" content="2026-06-01" />
          <meta itemProp="dateModified" content="2026-06-04" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="hashtag-strategy" className="space-y-4">
            <h2 id="hashtag-strategy" className="text-2xl font-semibold tracking-tight">
              The 3-tier hashtag strategy that actually works
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Most creators make one of two mistakes: they use only massive hashtags like #love or #fitness
              (too competitive — your post disappears in seconds) or they use only tiny niche hashtags
              (too small — limited discovery). The proven approach is a <strong>3-tier mix</strong>:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground list-none pl-0">
              <li className="flex gap-3">
                <span className="font-bold text-orange-500 shrink-0">Trending (20%)</span>
                <span>Hashtags with 1M+ posts. Include 2–3 per post. These give exposure but your content competes with millions of others and falls off the feed quickly.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-500 shrink-0">Mid-size (50%)</span>
                <span>Hashtags with 100K–1M posts. This is your primary growth zone. Competition is moderate and your content stays visible longer — often for hours, not seconds.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-green-500 shrink-0">Niche (30%)</span>
                <span>Hashtags with under 100K posts. Highly targeted — the audience is smaller but more engaged, and your content can rank at the top for days.</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="platform-rules" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="platform-rules" className="text-2xl font-semibold tracking-tight">
              Platform-specific hashtag rules
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Platform</th>
                    <th className="border border-border p-2 text-left font-semibold">Max</th>
                    <th className="border border-border p-2 text-left font-semibold">Sweet spot</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Instagram", "30", "5–10", "Put in caption or first comment — both work equally"],
                    ["TikTok", "No limit", "3–5", "Algorithm-driven; fewer targeted tags outperform keyword stuffing"],
                    ["Twitter/X", "No limit", "1–3", "More than 3 looks spammy; trending hashtags get more clicks"],
                    ["YouTube", "15 shown", "5–8", "Tags in description have less impact than title; use both"],
                  ].map(([platform, max, sweet, note]) => (
                    <tr key={platform}>
                      <td className="border border-border p-2 font-medium text-foreground">{platform}</td>
                      <td className="border border-border p-2 text-muted-foreground">{max}</td>
                      <td className="border border-border p-2 text-muted-foreground">{sweet}</td>
                      <td className="border border-border p-2 text-muted-foreground">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="common-mistakes" className="space-y-4">
            <h2 id="common-mistakes" className="text-2xl font-semibold tracking-tight">
              5 hashtag mistakes that kill your reach
            </h2>
            <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
              <li><strong>Using the same hashtags every post.</strong> Platforms may flag repetitive patterns as inauthentic. Rotate sets.</li>
              <li><strong>Only using mega-popular hashtags.</strong> Your content competes with 50M+ posts and disappears in minutes.</li>
              <li><strong>Using irrelevant hashtags.</strong> Platforms track whether users who find your post through a hashtag engage. Mismatch hurts reach.</li>
              <li><strong>Hashtag stuffing with 30 generic tags.</strong> Quality beats quantity — 8 targeted tags outperform 30 generic ones.</li>
              <li><strong>Ignoring hashtag bans.</strong> Some hashtags are shadowbanned. Check if a hashtag shows a warning before using it.</li>
            </ol>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight">Related tools</h2>
            <nav aria-label="Related tools">
              <RelatedTools
                tools={[
                  { name: "URL Shortener", path: "/tools/url-shortener" },
                  { name: "Meta Tags Generator", path: "/tools/meta-tags" },
                  { name: "QR Code Generator", path: "/tools/qr-code-generator" },
                ]}
              />
            </nav>
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Free Hashtag Generator</strong> helps creators on Instagram, TikTok,
            Twitter/X, and YouTube discover the best hashtags for any topic. Mix trending, mid-size, and
            niche hashtags for maximum reach. Copy all hashtags in one click. No signup, no limits, 100% free.
          </p>
        </footer>
      </div>
    </>
  )
}


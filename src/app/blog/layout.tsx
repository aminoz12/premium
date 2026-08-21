
import { RecentTools } from "@/components/tool/RecentTools";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  FileText,
  Image,
  QrCode,
  KeyRound,
  Palette,
  Code2,
  Lock,
} from "lucide-react";
import type { Metadata } from "next";

import { buildHomeMetadata } from "@/lib/seo/metadata"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import {
  getToolsByCategory,
  liveTools,
  toolCategories,
} from "@/lib/tools/tools-config"

const liveToolCount = liveTools.length; // derived once, used in FAQ

// ─── Metadata export (moved outside the component) ─────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const base = buildHomeMetadata();
  return {
    ...base,
    alternates: {
      ...(typeof base.alternates === "object" ? base.alternates : {}),
      canonical: buildAbsoluteUrl("/"),
      languages: {
        "en-US": buildAbsoluteUrl("/"),
        "x-default": buildAbsoluteUrl("/"),
      },
    },
  };
}

// ─── Featured tool order ────────────────────────────────────────────────────
const HOMEPAGE_FEATURED_IDS = [
  "word-counter",
  "image-compressor",
  "qr-code-generator",
  "password-generator",
  "color-picker",
  "diff-checker",
  "markdown-to-html",
  "lorem-ipsum",
  "url-encoder",
  "uuid-generator",
  "json-formatter",
  "regex-tester",
  "jwt-decoder",
  "base64-encoder",
  "hash-generator",
  "bcrypt",
  "sql-formatter",
  "cron-parser",
  "css-minifier",
  "meta-tags",
];

// ─── Tools by profession ────────────────────────────────────────────────────
const TOOLS_BY_PROFESSION = [
  {
    profession: "Free tools for developers",
    href: "/categories/developer",
    description:
      "JSON formatter, regex tester, JWT decoder, SQL formatter, hash generator, Base64 encoder, UUID generator, code converter.",
  },
  {
    profession: "Free tools for SEO & marketing",
    href: "/categories/seo",
    description:
      "Meta tags generator, robots.txt generator, sitemap generator, SSL checker, DNS lookup, QR codes, Open Graph generator, URL shortener.",
  },
  {
    profession: "Free tools for designers",
    href: "/categories/design",
    description:
      "Color picker, CSS gradient, box shadow, border radius, favicon generator, contrast checker, grid generator.",
  },
  {
    profession: "Free tools for writers, students & content teams",
    href: "/categories/text",
    description:
      "Word counter, AI paraphraser, lorem ipsum, case converter, AI text detector, story generator, text humanizer.",
  },
  {
    profession: "Free tools for image & video work",
    href: "/categories/image",
    description:
      "Image compressor, background remover, image converter, image resizer, AI image generator, video to audio.",
  },
  {
    profession: "Free tools for security & IT",
    href: "/categories/security",
    description:
      "Password generator, hash generator, bcrypt, JWT decoder, SSL checker, IP lookup, encoder/decoder.",
  },
];

// ─── Quick‑action shortcuts ─────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Compress an image", href: "/tools/image-compressor", Icon: Image },
  { label: "Count words", href: "/tools/word-counter", Icon: FileText },
  { label: "Make a QR code", href: "/tools/qr-code-generator", Icon: QrCode },
  {
    label: "Generate a password",
    href: "/tools/password-generator",
    Icon: KeyRound,
  },
  { label: "Pick a color", href: "/tools/color-picker", Icon: Palette },
  { label: "Format code", href: "/tools/json-formatter", Icon: Code2 },
];

// ─── Category tile accents ──────────────────────────────────────────────────
const TILE_COLORS = [
  {
    ring: "from-blue-500/40 to-cyan-500/20",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500 dark:bg-blue-400",
    iconBg: "from-blue-500/30 to-blue-500/0",
  },
  {
    ring: "from-violet-500/40 to-fuchsia-500/20",
    text: "text-violet-700 dark:text-violet-300",
    dot: "bg-violet-500 dark:bg-violet-400",
    iconBg: "from-violet-500/30 to-violet-500/0",
  },
  {
    ring: "from-emerald-500/40 to-teal-500/20",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500 dark:bg-emerald-400",
    iconBg: "from-emerald-500/30 to-emerald-500/0",
  },
  {
    ring: "from-orange-500/40 to-rose-500/20",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500 dark:bg-orange-400",
    iconBg: "from-orange-500/30 to-orange-500/0",
  },
  {
    ring: "from-pink-500/40 to-rose-500/20",
    text: "text-pink-700 dark:text-pink-300",
    dot: "bg-pink-500 dark:bg-pink-400",
    iconBg: "from-pink-500/30 to-pink-500/0",
  },
  {
    ring: "from-teal-500/40 to-cyan-500/20",
    text: "text-teal-700 dark:text-teal-300",
    dot: "bg-teal-500 dark:bg-teal-400",
    iconBg: "from-teal-500/30 to-teal-500/0",
  },
  {
    ring: "from-amber-500/40 to-yellow-500/20",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500 dark:bg-amber-400",
    iconBg: "from-amber-500/30 to-amber-500/0",
  },
  {
    ring: "from-rose-500/40 to-pink-500/20",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500 dark:bg-rose-400",
    iconBg: "from-rose-500/30 to-rose-500/0",
  },
  {
    ring: "from-cyan-500/40 to-sky-500/20",
    text: "text-cyan-700 dark:text-cyan-300",
    dot: "bg-cyan-500 dark:bg-cyan-400",
    iconBg: "from-cyan-500/30 to-cyan-500/0",
  },
  {
    ring: "from-indigo-500/40 to-blue-500/20",
    text: "text-indigo-700 dark:text-indigo-300",
    dot: "bg-indigo-500 dark:bg-indigo-400",
    iconBg: "from-indigo-500/30 to-indigo-500/0",
  },
  {
    ring: "from-lime-500/40 to-emerald-500/20",
    text: "text-lime-700 dark:text-lime-300",
    dot: "bg-lime-500 dark:bg-lime-400",
    iconBg: "from-lime-500/30 to-lime-500/0",
  },
  {
    ring: "from-sky-500/40 to-blue-500/20",
    text: "text-sky-700 dark:text-sky-300",
    dot: "bg-sky-500 dark:bg-sky-400",
    iconBg: "from-sky-500/30 to-sky-500/0",
  },
];

// ─── FAQ (uses imported liveTools / toolCategories) ─────────────────────────
const homepageFaqs = [
  {
    question: "What is the best free online tools website?",
    answer: `${siteConfig.name} is a free online tools directory with ${liveTools.length}+ browser-based utilities for SEO, developers, image editing, AI, text processing, calculators, and security. Every tool is 100% free, requires no signup, runs in your browser, and protects your privacy.`,
  },
  {
    question: "Are these online tools really 100% free?",
    answer: `Yes — every single tool on ${siteConfig.name} is 100% free forever. No subscription, no trial limit, no credit card, no hidden upgrade. The site is supported by non-intrusive ads, which is why we can keep all ${liveTools.length}+ tools free for everyone.`,
  },
  {
    question: "Do I need to create an account to use the tools?",
    answer:
      "No account, no email, no password — ever. Open any tool page and start using it instantly. We never ask for personal information to use any of the free tools on this site.",
  },
  {
    question: "Is my data safe? Are my files uploaded to a server?",
    answer:
      "Your data is completely safe. Almost every tool runs entirely inside your browser using JavaScript. Your photos, PDFs, passwords, and any text you paste never leave your device. The few AI-powered tools that need a server only send the minimum data required and never store it.",
  },
  {
    question: "Do these free tools work on iPhone, Android, and tablets?",
    answer:
      "Yes — every tool is fully responsive and works on iPhone, Android, iPad, and other tablets. Layouts automatically adapt to any screen size, and tools load fast even on slow mobile connections.",
  },
  {
    question: "Do I need to download or install anything?",
    answer:
      "Nothing to download, no apps to install, no browser extensions required. Open any page in Chrome, Safari, Firefox, Edge, or Brave and the tool works immediately. The whole site is a Progressive Web App — you can even add it to your home screen.",
  },
  {
    question: `How many free tools are available on ${siteConfig.name}?`,
    answer: `${liveTools.length}+ free tools across ${toolCategories.length} categories: text & writing, image editing, AI tools, password & security, developer utilities, SEO tools, file converters, calculators, colors & design, and accessibility checkers — all in one place, all free.`,
  },
  {
    question: "Can I use these tools offline without internet?",
    answer:
      "Most tools work fully offline after the first page load. This is useful on a plane, train, or anywhere with a slow or no connection. Look for the offline indicator on each tool page.",
  },
  {
    question: "Who can use these free online tools?",
    answer:
      "Everyone — students writing essays, developers debugging code, designers picking colors, SEO specialists optimizing pages, marketers creating QR codes, content writers counting words, small business owners generating invoices, and anyone who needs a quick, reliable utility without paying for expensive software.",
  },
  {
    question: "What is the best free image compressor online?",
    answer:
      "Our free Image Compressor works on JPG, PNG, and WebP, runs entirely in your browser (your files are not uploaded), and lets you trade off file size against quality with a live preview. Typical lossy savings at quality 80 are in the 60–80% range with no perceptible difference at normal screen resolutions.",
  },
  {
    question: "Is there a free PDF to Word converter without signup?",
    answer:
      "Yes — our PDF to Word converter is free with no signup. It handles standard text-based PDFs well. Heavily scanned PDFs, complex multi-column layouts, and embedded tables often need manual cleanup after conversion; that is a limitation of any PDF-to-Word pipeline, not just ours.",
  },
  {
    question: "How do I generate a strong password for free?",
    answer:
      "Use our free Password Generator — pick a length (16+ characters is a good baseline), choose which character classes to include, and click Generate. The password is created in your browser using the Web Crypto API's cryptographically secure randomness and is never sent to any server.",
  },
  {
    question: "How do these free tools compare to paid alternatives?",
    answer:
      "For everyday tasks (compressing an image, formatting JSON, generating a QR code, counting words), these free tools cover the same ground as paid alternatives with the added benefit that everything runs in your browser — your files are not uploaded. Paid tools tend to add value only for advanced or enterprise-specific features (OCR on scanned PDFs, team collaboration, bulk APIs).",
  },
  {
    question: "Why are these online tools completely free?",
    answer: `${siteConfig.name} is free because the tools run client-side in your browser, which means we don't pay for expensive servers to process your files. We cover the small cost of hosting through non-intrusive display ads, allowing us to keep ${liveTools.length}+ tools free forever.`,
  },
];
const USE_CASES = [
  {
    Icon: Image,
    color: "from-violet-500/20 to-fuchsia-500/0 dark:from-violet-500/30 dark:to-fuchsia-500/0 text-violet-700 dark:text-violet-300",
    heading: "Work with images",
    body: "Compress photos before sending them by email, resize pictures for social media, remove backgrounds, or pick the perfect color for a design project — all without installing any app.",
  },
  {
    Icon: FileText,
    color: "from-blue-500/20 to-cyan-500/0 dark:from-blue-500/30 dark:to-cyan-500/0 text-blue-700 dark:text-blue-300",
    heading: "Edit and format text",
    body: "Count words and characters in an essay, compare two documents side by side, convert text to different formats, or generate placeholder text for a presentation.",
  },
  {
    Icon: Lock,
    color: "from-emerald-500/20 to-teal-500/0 dark:from-emerald-500/30 dark:to-teal-500/0 text-emerald-700 dark:text-emerald-300",
    heading: "Stay safe online",
    body: "Create a strong unique password in one click, check how secure a password is, encode or decode data, and generate secure tokens — your data never leaves your device.",
  },
  {
    Icon: Calculator,
    color: "from-orange-500/20 to-rose-500/0 dark:from-orange-500/30 dark:to-rose-500/0 text-orange-700 dark:text-orange-300",
    heading: "Calculate anything",
    body: "BMI, loan repayments, unit conversions, date differences, and dozens of other everyday calculations — no spreadsheet or formula knowledge required.",
  },
]
  const categoriesWithTools = toolCategories
    .map((category) => ({
      category,
      items: getToolsByCategory(category.id).filter((t) => t.status !== "preview"),
    }))
    .filter(({ items }) => items.length > 0)
// ─── Blog Layout Component ──────────────────────────────────────────────────
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-wrapper container py-8 px-10">
       {/* Native + double rectangles after author */}
    

      <RecentTools />

   
      {children}

      {/* Author card */}
      <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-border bg-card px-6 py-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold select-none">
          A
        </div>
        <div>
          <p className="font-semibold text-foreground">Achraf A.</p>
          <p className="text-sm text-muted-foreground">Full-Stack Developer · Morocco 🇲🇦</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Building browser-based tools at{" "}
            <Link href="/about" className="text-black  dark:text-white hover:underline dark:text-blue-400">
              The Free AI Tools
            </Link>{" "}
            since 2024. Every tool runs 100% in your browser — no uploads, no accounts.
          </p>
        </div>
      </div>

      

      <RecentTools />

      

      {/* Browse by category */}
      <section
        className="border-t border-border py-12 "
        aria-labelledby="categories-heading"
      >
        <div className="mb-8">
          <h2
            id="categories-heading"
            className="text-2xl font-bold sm:text-3xl"
          >
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
              Browse by category
            </span>
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Not sure which tool you need? Start with a category.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categoriesWithTools.map(({ category, items }, i) => {
            const color = TILE_COLORS[i % TILE_COLORS.length];
            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-white/25 dark:hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                aria-label={`${category.name} — ${items.length} free tools`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${color.ring} opacity-15 transition-opacity group-hover:opacity-30 dark:opacity-30 dark:group-hover:opacity-60`}
                  aria-hidden="true"
                />
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${color.iconBg} blur-2xl`}
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-between">
                  <span className={`text-sm font-semibold ${color.text}`}>
                    {category.name}
                  </span>
                  <ArrowRight
                    className={`h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 ${color.text}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="relative mt-4 flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${color.dot}`}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-muted-foreground">
                    {items.length} tools
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Ad after categories grid */}
       
      </section>

      {/* What you can do — using imported USE_CASES */}
      <section
        className="border-t border-border py-12"
        aria-labelledby="usecases-heading"
      >
        <div className="mb-10 text-center">
          <h2
            id="usecases-heading"
            className="text-2xl font-bold sm:text-3xl"
          >
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
              Everything you can do — for free
            </span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            No software to buy. No account to create. Just open a tool and get
            it done.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {USE_CASES.map(({ Icon, color, heading, body }) => (
            <div
              key={heading}
              className="group relative flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-blue-300 hover:bg-muted/30 dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-blue-400/40 dark:hover:bg-white/[0.06]"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
              <div
                className={`relative mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} ring-1 ring-border dark:ring-white/10`}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="relative">
                <h3 className="font-bold text-foreground">{heading}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Extra SEO paragraph */}
        <div className="mx-auto mt-10 max-w-3xl space-y-4 text-center text-sm leading-7 text-muted-foreground">
          <p>
            <strong className="text-foreground">{siteConfig.name}</strong> is a
            free collection of{" "}
            <strong className="text-foreground">
              {liveToolCount}+ online tools
            </strong>{" "}
            that work directly in your web browser — no download, no
            installation, no account required. Whether you need to compress an
            image for email, count words in an essay, generate a strong
            password, create a QR code for your business, or format JSON for
            development — you will find a simple, free tool here.
          </p>
          <p>
            Every tool is{" "}
            <strong className="text-foreground">privacy-first</strong>: your
            files, text, and data never leave your device. Tools cover{" "}
            <Link
              href="/categories/image"
              className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300"
            >
              image editing
            </Link>
            ,{" "}
            <Link
              href="/categories/text"
              className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300"
            >
              text processing
            </Link>
            ,{" "}
            <Link
              href="/categories/developer"
              className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300"
            >
              developer utilities
            </Link>
            ,{" "}
            <Link
              href="/categories/security"
              className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300"
            >
              security &amp; encoding
            </Link>
            ,{" "}
            <Link
              href="/categories/seo"
              className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300"
            >
              SEO &amp; web
            </Link>
            ,{" "}
            <Link
              href="/categories/design"
              className="text-black  dark:text-white transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-cyan-300"
            >
              design &amp; CSS
            </Link>
            , and more.
          </p>
        </div>

        {/* Final ads at very bottom of blog layout */}
     
      </section>
    </div>
  );
}

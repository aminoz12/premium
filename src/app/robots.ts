import type { MetadataRoute } from "next"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"

const disallow = ["/search", "/api/", "/status"]

// AI / LLM crawlers we explicitly welcome (GEO — generative engine optimization).
// `User-agent: *` already allows them, but naming them is an explicit signal and
// keeps a single authoritative robots source (this route is what actually serves
// /robots.txt; the old public/robots.txt was being ignored).
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Google-Extended",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Applebot",
  "Applebot-Extended",
  "meta-externalagent",
  "cohere-ai",
  "Bytespider",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      // NOTE: Crawl-delay is removed for Bingbot/YandexBot below on purpose.
      // Google Search Console flags it as "rule ignored by Googlebot" because
      // Googlebot never supported Crawl-delay (Bing/Yandex do, but GSC's
      // tester only reports from Googlebot's point of view). If you actually
      // need to throttle Bing/Yandex, set it in their respective webmaster
      // tools dashboards instead of robots.txt.
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "YandexBot",
        allow: "/",
        disallow,
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/search"],
      })),
    ],
    sitemap: [buildAbsoluteUrl("/sitemap.xml"), buildAbsoluteUrl("/image-sitemap.xml"), buildAbsoluteUrl("/videos-sitemap.xml")],
    // NOTE: `host` is intentionally NOT set here anymore.
    // `Host:` is a legacy Yandex-only directive. Google has never supported
    // it and Googlebot ignores it outright — this is what GSC was flagging.
    // Next.js's MetadataRoute.Robots type still serializes `host` if present,
    // so we just omit the field entirely rather than setting siteConfig.url.
  }
}
type SiteConfig = {
  name: string
  shortName: string
  url: string
  canonicalHost: string
  alternateHosts: string[]
  locale: string
  description: string
  email: string
  securityEmail: string
  organizationName: string
  googleSiteVerification: string
  bingSiteVerification: string
  yandexSiteVerification: string
  googleAdSenseAccount: string
  xHandle: string | null
  social: {
    twitter: string | null
    github: string | null
    linkedin: string | null
    producthunt: string | null
  }
  themeColor: {
    light: string
    dark: string
  }
  ogImage: string
  legalLastUpdated: string
  supportedBrowsers: string[]
  primaryKeywords: string[]
}

const DEFAULT_SITE_URL = "https://www.thefreeaitools.com"
const isProduction = process.env.NODE_ENV === "production"

function normalizeSiteUrl(value?: string) {
  // Canonical must be stable in production to avoid host duplication (www vs non-www vs Vercel).
  const candidate = isProduction ? DEFAULT_SITE_URL : value?.trim() || DEFAULT_SITE_URL
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`

  return new URL(withProtocol).origin
}

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)
const canonicalHost = new URL(siteUrl).hostname
const alternateHosts = ["thefreeaitools.com", "www.thefreeaitools.com", "toolkitpropp.vercel.app"].filter(
  (host) => host !== canonicalHost
)

export const siteConfig: SiteConfig = {
  name: "The Free AI Tools",
  shortName: "Free AI Tools",
  url: siteUrl,
  canonicalHost,
  alternateHosts,
  locale: "en_US",
  description:
    "The Free AI Tools is a privacy-first directory of free online tools for SEO, developers, text, images, files, calculators, and browser-based workflows. Most tools run client-side with no signup and minimal uploads.",
  email: "contact@thefreeaitools.com",
  securityEmail: "security@thefreeaitools.com",
  organizationName: "The Free AI Tools",
  googleSiteVerification: "UHvUTOKSmXiRMQiQQkuR7k8h6s62ROoja1M4GzZwOs8",
  bingSiteVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
  yandexSiteVerification: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION ?? "",
  googleAdSenseAccount: "ca-pub-8141731290667759",
  xHandle: "@thefreeaitools",
  social: {
    twitter: "https://twitter.com/thefreeaitools",
    github: null, // Set to e.g. "https://github.com/thefreeaitools" once org is created
    linkedin: null, // Set to LinkedIn company page URL once created
    producthunt: null, // Set to Product Hunt page URL after launch
  },
  themeColor: {
    light: "#ffffff",
    dark: "#09090b",
  },
  ogImage: "/opengraph-image",
  legalLastUpdated: "May 6, 2026",
  supportedBrowsers: ["Chrome", "Firefox", "Safari", "Edge", "Brave"],
  primaryKeywords: [
    "free online tools",
    "free online tools directory",
    "online tools",
    "browser-based tools",
    "privacy-first online tools",
    "no signup online tools",
    "developer tools online",
    "technical seo tools",
    "image tools online",
    "text tools online",
    "file tools online",
    "online calculators",
  ],
}

export function buildAbsoluteUrl(pathname = "/") {
  if (/^https?:\/\//.test(pathname)) {
    return pathname
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`
  const url = new URL(normalizedPath, siteConfig.url)

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "")
  }

  return url.toString()
}

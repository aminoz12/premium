import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import { liveTools, toolCategories, type Tool, getCategoryById, type ToolCategory } from "@/lib/tools/tools-config"
import { getToolExpansionIdea } from "@/lib/tools/tool-expansion"

type CollectionPageItem = {
  name: string
  path: string
  description?: string
}

// ✅ Organization Schema — core identity for Google
export function buildOrganizationSchema() {
  const sameAs = [
    "https://futurepedia.io/tool/thefreeaitools",
    "https://toolify.ai/thefreeaitools",
    "https://theresanaiforthat.com/ai/thefreeaitools",
    ...(siteConfig.xHandle
      ? [`https://x.com/${siteConfig.xHandle.replace("@", "")}`]
      : []),
    ...(siteConfig.social.twitter ? [siteConfig.social.twitter] : []),
    ...(siteConfig.social.github ? [siteConfig.social.github] : []),
    ...(siteConfig.social.linkedin ? [siteConfig.social.linkedin] : []),
    ...(siteConfig.social.producthunt ? [siteConfig.social.producthunt] : ["https://www.producthunt.com/products/thefreeaitools"]),
  ]

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.organizationName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteConfig.url}/#logo`,
      url: buildAbsoluteUrl("/logo.png"),
      contentUrl: buildAbsoluteUrl("/logo.png"),
      width: 512,
      height: 512,
      caption: siteConfig.name,
    },
    image: {
      "@type": "ImageObject",
      url: buildAbsoluteUrl(siteConfig.ogImage),
      width: 1200,
      height: 630,
    },
    description: `${siteConfig.name} provides ${liveTools.length}+ free online tools across ${toolCategories.length} categories — SEO, developer utilities, text, images, files, calculators, and more. No signup required, privacy-first, and 100% browser-based.`,
    email: siteConfig.email,
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Achraf A.",
      url: `${siteConfig.url}/about`,
      jobTitle: "Software Developer",
      sameAs: ["https://github.com/thefreeaitools"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
      addressRegion: "Morocco",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.email,
        url: buildAbsoluteUrl("/contact"),
        availableLanguage: "English",
        contactOption: "TollFree",
      },
    ],
    sameAs,
  }
}

// ✅ WebSite Schema — enables Google Sitelinks Searchbox
export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    // SEO: keep alternateNames consistent with how real users search
    alternateName: [siteConfig.shortName, siteConfig.organizationName].filter(Boolean),
    url: siteConfig.url,
    description: `${liveTools.length}+ free online tools across ${toolCategories.length} categories. No signup, no download — privacy-first browser workflows.`,
    inLanguage: "en-US",
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

// ✅ SoftwareApplication Schema — enables star ratings in search results
export function buildSoftwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteConfig.url}/#software`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: `${liveTools.length}+ free online tools for text, SEO, images, coding, and productivity. No signup required — all tools run in your browser.`,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "Online Tools Directory",
    operatingSystem: "Web Browser",
    browserRequirements: `JavaScript enabled; works in ${siteConfig.supportedBrowsers.join(", ")}`,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    // SEO SAFETY: aggregateRating removed — Google penalizes fabricated review
    // data in structured markup. Re-add this section only after collecting real,
    // verifiable user reviews from an actual data source.
    featureList: [
      "No signup required",
      "100% free forever",
      "Privacy-first — runs entirely in browser",
      "Mobile friendly and responsive",
      "No data sent to server",
      `${liveTools.length}+ tools available`,
      `${toolCategories.length} tool categories`,
      "Works on all modern browsers",
      "No installation or download needed",
      "Instant results",
    ],
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
  }
}

// ✅ Tool Schema — use on individual tool pages
export function buildToolSchema(tool: Tool) {
  const expansionIdea = getToolExpansionIdea(tool.id)
  const category = getCategoryById(tool.category)
  const featureList = Array.from(
    new Set(expansionIdea?.featureList ?? tool.keywords)
  ).slice(0, 12)
  const keywords = Array.from(
    new Set([tool.name, ...tool.keywords])
  ).slice(0, 16)
  const toolUrl = buildAbsoluteUrl(tool.path)

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    // SEO: stable fragment ID so sitewide entity graph stays connected
    "@id": `${toolUrl}#software`,
    name: tool.name,
    description: expansionIdea?.description ?? tool.description,
    applicationCategory: category?.name ?? "UtilitiesApplication",
    applicationSubCategory: category?.name ?? "Browser Tool",
    operatingSystem: "Web",
    browserRequirements: `JavaScript enabled; works in ${siteConfig.supportedBrowsers.join(", ")}`,
    isAccessibleForFree: true,
    keywords: keywords.join(", "),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: toolUrl,
    },
    creator: {
      "@id": `${siteConfig.url}/#organization`,
    },
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    featureList,
    url: toolUrl,
    ...(tool.lastModified ? { dateModified: tool.lastModified } : {}),
  }
}

// ✅ Breadcrumb Schema — use on all inner pages
export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  }
}

// ✅ Collection Page Schema — use on category pages
export function buildCollectionPageSchema({
  name,
  path,
  description,
  items,
}: {
  name: string
  path: string
  description: string
  items: CollectionPageItem[]
}) {
  const pageUrl = buildAbsoluteUrl(path)

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    name,
    url: pageUrl,
    description,
    inLanguage: "en-US",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    about: {
      "@id": `${siteConfig.url}/#organization`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
        url: buildAbsoluteUrl(item.path),
      })),
    },
  }
}

// ✅ Category Schema — use on /categories/[id] pages
export function buildCategorySchema(category: ToolCategory, tools: Tool[]) {
  return buildCollectionPageSchema({
    name: `${category.name} Tools`,
    path: `/categories/${category.id}`,
    description: category.description,
    items: tools.map((tool) => ({
      name: tool.name,
      path: tool.path,
      description: tool.description,
    })),
  })
}

// ✅ FAQ Schema — use on tool pages and home page
export function buildFaqSchema(
  questions: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

// ✅ Article Schema — use on blog/guide pages
export function buildArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  imageUrl,
}: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified: string
  imageUrl?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    author: {
      "@id": `${siteConfig.url}/#organization`,
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    ...(imageUrl
      ? {
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      }
      : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "en-US",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
  }
}

// ✅ WebPage Schema — use on static pages like about, contact, privacy
export function buildWebPageSchema({
  name,
  description,
  path,
  datePublished,
  dateModified,
}: {
  name: string
  description: string
  path: string
  datePublished?: string
  dateModified?: string
}) {
  const pageUrl = buildAbsoluteUrl(path)

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name,
    description,
    url: pageUrl,
    inLanguage: "en-US",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    about: {
      "@id": `${siteConfig.url}/#organization`,
    },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  }
}

// ✅ HowTo Schema — use on tool pages to explain usage
export function buildHowToSchema({
  name,
  description,
  steps,
  toolName,
  toolUrl,
}: {
  name: string
  description: string
  steps: Array<{ name: string; text: string }>
  toolName: string
  toolUrl: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    tool: {
      "@type": "HowToTool",
      name: toolName,
      // FIX: original passed toolUrl directly to buildAbsoluteUrl, which
      // is correct — keeping as-is but making it explicit
      url: buildAbsoluteUrl(toolUrl),
    },
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    // SEO: totalTime helps Google surface this in "How-to" rich results
    totalTime: "PT1M",
    supply: [],
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
  }
}
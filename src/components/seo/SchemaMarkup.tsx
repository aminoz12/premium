import { JsonLd } from "@/components/seo/json-ld"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import type { ToolSeoContent } from "@/lib/seo/tool-content"
import { getPrimaryToolImage } from "@/lib/utils/tool-images"
import { getToolVideo } from "@/lib/utils/tool-videos"

export function SchemaMarkup({ tool }: { tool: ToolSeoContent }) {
  const video = getToolVideo(tool.toolId)
  const thumbnailPath = getPrimaryToolImage(tool.toolId) ?? "/favicon-512x512.png"
  const faqSchema =
    tool.faqs.length >= 3
      ? ({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${tool.canonicalUrl}#faq`,
          mainEntity: tool.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        } satisfies Record<string, unknown>)
      : null

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${tool.canonicalUrl}#software-app`,
      name: tool.name,
      description: tool.metaDescription,
      url: tool.canonicalUrl,
      applicationCategory: tool.categoryName,
      applicationSubCategory: tool.categoryName,
      operatingSystem: "Web Browser",
      browserRequirements: "JavaScript enabled",
      isAccessibleForFree: true,
      keywords: [tool.primaryKeyword, ...tool.lsiKeywords].slice(0, 10).join(", "),
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      featureList: tool.benefits.join(", "),
      author: {
        "@type": "Organization",
        name: siteConfig.organizationName,
        url: siteConfig.url,
      },
      provider: {
        "@id": `${buildAbsoluteUrl("/")}#organization`,
      },
      audience: {
        "@type": "Audience",
        audienceType: "General public, developers, marketers, designers, students",
      },
      potentialAction: {
        "@type": "UseAction",
        target: tool.canonicalUrl,
        name: `Use ${tool.name} free online`,
      },
      dateModified: tool.updatedAt,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${tool.canonicalUrl}#breadcrumb`,
      itemListElement: tool.breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${tool.canonicalUrl}#howto`,
      name: `How to use ${tool.name}`,
      description: `Step-by-step instructions for using ${tool.name} online.`,
      totalTime: "PT2M",
      tool: [
        {
          "@type": "HowToTool",
          name: tool.name,
          url: tool.canonicalUrl,
        },
      ],
      step: tool.howToSteps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.description,
      })),
      ...(video ? { video: { "@id": `${tool.canonicalUrl}#video` } } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${tool.canonicalUrl}#webpage`,
      name: tool.h1,
      url: tool.canonicalUrl,
      description: tool.metaDescription,
      dateModified: tool.updatedAt,
      inLanguage: "en-US",
      isPartOf: {
        "@id": `${buildAbsoluteUrl("/")}#website`,
      },
      about: {
        "@id": `${tool.canonicalUrl}#software-app`,
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "#quick-answer", ".tool-intro-text"],
      },
      ...(video ? { video: { "@id": `${tool.canonicalUrl}#video` } } : {}),
    },
  ]

  if (video) {
    const transcriptText = tool.whatIsContent && tool.whatIsContent.length > 0 ? tool.whatIsContent[0] : tool.introText
    schemas.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "@id": `${tool.canonicalUrl}#video`,
      name: `${tool.name} video tutorial`,
      description: tool.metaDescription,
      thumbnailUrl: [buildAbsoluteUrl(thumbnailPath)],
      caption: tool.metaDescription,
      transcript: transcriptText,
      uploadDate: tool.updatedAt,
      contentUrl: buildAbsoluteUrl(video.mp4),
      embedUrl: tool.canonicalUrl,
      isFamilyFriendly: true,
      inLanguage: "en-US",
      publisher: {
        "@id": `${buildAbsoluteUrl("/")}#organization`,
      },
      about: {
        "@id": `${tool.canonicalUrl}#software-app`,
      },
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: { "@type": "WatchAction" },
        userInteractionCount: 5000,
      },
      potentialAction: {
        "@type": "WatchAction",
        target: tool.canonicalUrl,
      },
    })
  }

  if (faqSchema) {
    schemas.splice(1, 0, faqSchema)
  }

  return <JsonLd id={`tool-schema-${tool.slug}`} data={schemas} />
}

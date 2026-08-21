import type { Metadata } from "next"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"

type BuildPageMetadataOptions = {
  title: string
  description: string
  path: string
  keywords?: string[]
  ogImagePath?: string
  follow?: boolean
  openGraphType?: "website" | "article"
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImagePath = siteConfig.ogImage,
  follow = true,
  openGraphType = "website",
}: BuildPageMetadataOptions): Metadata {
  const canonical = buildAbsoluteUrl(path)
  const imageUrl = buildAbsoluteUrl(ogImagePath)
  const dedupedKeywords = Array.from(new Set([...siteConfig.primaryKeywords, ...keywords]))

  return {
    title,
    description,
    keywords: dedupedKeywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: openGraphType,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url: canonical,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} on ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [imageUrl],
      ...(siteConfig.xHandle
        ? {
            site: siteConfig.xHandle,
            creator: siteConfig.xHandle,
          }
        : {}),
    },
    robots: {
      index: true,
      follow,
      googleBot: {
        index: true,
        follow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}

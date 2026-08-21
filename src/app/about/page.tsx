import { AboutPage } from "./about-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildPageMetadata } from "@/lib/page-metadata"
import { buildOrganizationSchema } from "@/lib/seo/schema"
import { toolCount } from "@/lib/tools/tools-config"


export const metadata = buildPageMetadata({
  title: "About — The Free AI Tools | Who Built It & Why",
  description: `TheFreeAITools.com — ${toolCount}+ free browser-based tools by Achraf A. All tools run client-side: no server uploads, no accounts, no fees. Always free.`,
  path: "/about",
  keywords: ["about The Free AI Tools", "who built thefreeaitools.com", "privacy-first browser tools", "browser-based utilities"],
})

export default function Page() {
  return (
    <>
      <JsonLd id="about-organization-schema" data={buildOrganizationSchema()} />
      <AboutPage />
    </>
  )
}


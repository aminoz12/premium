/**
 * WebsiteSchema.tsx
 *
 * Drop this component wherever your existing
 * <script id="website-schema"> is rendered
 * (app/layout.tsx  OR  app/page.tsx).
 *
 * ─────────────────────────────────────────────────────────────
 * WHY THIS FILE EXISTS — ROOT CAUSE OF THE GSC ERRORS
 * ─────────────────────────────────────────────────────────────
 * The original website-schema script was an ARRAY containing
 * both a WebSite node AND a FAQPage node:
 *
 *   [
 *     { "@type": "WebSite", ... },
 *     { "@type": "FAQPage", "mainEntity": [ 3 questions ] }  ← DUPLICATE
 *   ]
 *
 * At the same time, FAQ.tsx also outputs a FAQPage node with
 * 21 questions. Google finds TWO FAQPage declarations on the
 * same URL and flags both as "Duplicate field / Unnamed item"
 * critical errors, making the page ineligible for rich results.
 *
 * FIX: This component outputs ONLY the WebSite node.
 *      The FAQPage lives exclusively in FAQ.tsx → CombinedSchema().
 *
 * ─────────────────────────────────────────────────────────────
 * HOW TO USE
 * ─────────────────────────────────────────────────────────────
 * 1. Delete (or comment out) the old <script id="website-schema">
 *    from app/layout.tsx or app/page.tsx.
 *
 * 2. Import and render <WebsiteSchema /> in its place:
 *
 *      import { WebsiteSchema } from "@/components/WebsiteSchema"
 *      // ...
 *      <WebsiteSchema />
 *
 * That's it. Google will now see exactly ONE FAQPage on the
 * /faq route and zero FAQPage nodes on every other route.
 * ─────────────────────────────────────────────────────────────
 */

const BASE = siteConfig.url

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    /*
     * @id lets Google de-duplicate this node across pages.
     * Use the same value here and in any other schema that
     * references your site (e.g. Organization.url).
     */
    "@id": `${BASE}/#website`,
    url: BASE,
    name: siteConfig.name,
    description:
      siteConfig.description,
    /*
     * SearchAction enables the Google Sitelinks Searchbox.
     * "target" must be a plain URL-template string — NOT an
     * EntryPoint sub-object. The sub-object format is rejected
     * by Google's Rich Results Test on FAQPage documents.
     */
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
import { siteConfig } from "@/lib/site-config"

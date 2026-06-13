import React from 'react'
import { Helmet } from 'react-helmet-async'

const SITE = 'https://watchworldcup.us'

// Per-route SEO: one canonical, title, description, OG/Twitter, optional JSON-LD.
// The static tags in index.html (og:image, og:site_name, hreflang, the main JSON-LD
// graph, etc.) stay as defaults; this component owns the per-route bits.
export default function Seo({
  title,
  description,
  path = '/',
  lang = 'en',
  type = 'website',
  noindex = false,
  jsonLd = null
}) {
  const url = path.startsWith('http') ? path : `${SITE}${path}`
  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}

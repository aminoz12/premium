# LLM discovery policy

## Purpose

Maintain a short, factual route to the site’s important public resources for systems that choose to read plain text. The canonical SEO implementation remains the rendered HTML, links, metadata, sitemap and robots policy.

## Rules

- Keep the file on the canonical host and use absolute canonical URLs.
- Include the brand description, public contact route, high-value pages, sitemap and clear claim limitations.
- Do not include private routes, credentials, payment instructions, confidential data or unsupported commercial assertions.
- Do not target individual models, include prompts, attempt to manipulate answers, or serve different factual content to crawlers and visitors.
- Update the file whenever a linked public route is removed, renamed or materially changed.

The route must remain plain text, return `200`, and be covered by the release check.

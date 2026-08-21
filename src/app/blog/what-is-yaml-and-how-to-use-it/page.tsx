import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "What Is YAML and How Do You Use It? A Practical Guide",
  description:
    "YAML is the configuration language for Docker, GitHub Actions, Kubernetes, and more. Here's the syntax explained clearly â€” and how to convert YAML to JSON free.",
  path: "/blog/what-is-yaml-and-how-to-use-it",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-06-02" />
        <meta itemProp="dateModified" content="2026-06-02" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs text-black/60 dark:text-white/60">
            <time dateTime="2026-06-02">June 2, 2026</time>
            <span>Â·</span>
            <span>6 min read</span>
            <span>Â·</span>
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            What Is YAML and How Do You Use It? A Practical Guide
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            YAML powers Docker Compose, GitHub Actions, Kubernetes, and most modern CI/CD systems. Here&apos;s the syntax, the common pitfalls (tabs will break everything), and how to convert YAML to JSON.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What YAML stands for</h2>
          <p>
            YAML stands for &quot;YAML Ain&apos;t Markup Language&quot; â€” a recursive acronym. It&apos;s a human-readable data serialization format designed to be easy to write and read, especially for configuration files.
          </p>
          <p>
            YAML is a superset of JSON â€” every valid JSON document is also valid YAML. But YAML&apos;s primary purpose is human-written configuration, where readability matters more than compactness.
          </p>

          <h2>Basic YAML syntax</h2>
          <p>
            YAML represents data as key-value pairs with indentation showing structure. <strong>Critical rule: use spaces, not tabs.</strong> Tabs are illegal in YAML and will cause a parse error.
          </p>
          <pre><code>{`# This is a comment
name: John Doe
age: 30
email: john@example.com
active: true
score: 9.5`}</code></pre>
          <p>
            Equivalent JSON:
          </p>
          <pre><code>{`{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "active": true,
  "score": 9.5
}`}</code></pre>

          <h2>Lists (sequences)</h2>
          <pre><code>{`# Block sequence (most readable)
fruits:
  - apple
  - banana
  - cherry

# Flow sequence (inline, like JSON)
colors: [red, green, blue]`}</code></pre>

          <h2>Nested objects (mappings)</h2>
          <pre><code>{`user:
  id: 42
  name: Jane Doe
  address:
    street: 123 Main St
    city: Springfield
    country: US`}</code></pre>

          <h2>Multi-line strings</h2>
          <p>
            YAML has two ways to write multi-line strings:
          </p>
          <pre><code>{`# Literal block (|) â€” preserves newlines
description: |
  This is the first line.
  This is the second line.
  Newlines are preserved.

# Folded block (>) â€” newlines become spaces
summary: >
  This long text will be
  folded into a single line
  with spaces between parts.`}</code></pre>

          <h2>Real-world examples</h2>

          <h3>Docker Compose</h3>
          <pre><code>{`version: "3.8"
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp`}</code></pre>

          <h3>GitHub Actions workflow</h3>
          <pre><code>{`name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test`}</code></pre>

          <h2>Common YAML pitfalls</h2>

          <h3>1. Tabs vs spaces (the #1 error)</h3>
          <pre><code>{`# WRONG â€” tab character at the start
	name: John   # TAB â€” will throw ParseError

# RIGHT â€” spaces only
  name: John   # 2 spaces`}</code></pre>

          <h3>2. Strings that look like other types</h3>
          <pre><code>{`version: 3.8      # Parsed as float: 3.8
version: "3.8"    # Stays a string: "3.8" â† correct for Docker

enabled: yes      # Parsed as boolean: true (YAML 1.1)
enabled: "yes"    # Stays string: "yes"

country_code: NO  # Parsed as boolean: false (NO = Norway, also false!)
country_code: "NO"  # Correct â€” stays string`}</code></pre>
          <p>
            In YAML 1.1 (used by many tools), <code>yes</code>, <code>no</code>, <code>on</code>, <code>off</code>, <code>true</code>, <code>false</code> are all booleans. Wrap strings in quotes when the value might be misinterpreted.
          </p>

          <h3>3. Colon in values</h3>
          <pre><code>{`# WRONG â€” colon without quotes
url: https://example.com   # Parse error

# RIGHT
url: "https://example.com"
# OR
url: 'https://example.com'`}</code></pre>

          <h3>4. Indentation inconsistency</h3>
          <pre><code>{`# WRONG â€” mixing 2-space and 4-space indentation
user:
  name: John
    email: john@example.com   # 4 spaces â€” wrong level

# RIGHT â€” consistent 2-space indentation
user:
  name: John
  email: john@example.com`}</code></pre>

          <h2>Converting between YAML and JSON</h2>
          <p>
            Since YAML is a superset of JSON, conversion between them is lossless (with minor caveats around comments and anchors). The <Link href="/tools/yaml-json-converter">free YAML to JSON converter</Link> handles both directions â€” paste YAML and get JSON, or paste JSON and get clean YAML.
          </p>
          <p>
            Useful when:
          </p>
          <ul>
            <li>An API expects JSON but your config is in YAML</li>
            <li>You want to validate YAML structure by converting to JSON and using a JSON formatter</li>
            <li>Migrating configuration files between systems that expect different formats</li>
          </ul>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/yaml-json-converter">Free YAML to JSON Converter</Link> â€” convert between YAML and JSON instantly</li>
            <li><Link href="/tools/json-formatter">Free JSON Formatter</Link> â€” format and validate the converted JSON output</li>
          </ul>

          <hr className="my-8" />
          <p className="text-sm text-gray-400">
            Written by <Link href="/about" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Achraf A.</Link>, founder of TheFreeAITools.
          </p>
        </div>
      </article>
    </main>
  )
}

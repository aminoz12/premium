import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Convert CSV to JSON Free Online (With Real Examples)",
  description:
    "Convert CSV files to JSON arrays instantly â€” free in your browser, no account, no upload. Includes handling headers, quoted fields, and nested data.",
  path: "/blog/how-to-convert-csv-to-json",
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
            <span>5 min read</span>
            <span>Â·</span>
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Convert CSV to JSON Free Online (With Real Examples)
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            CSV exports from Excel, Google Sheets, and databases need to be JSON for most APIs and JavaScript apps. Here&apos;s how to convert them instantly â€” and what to do with commas inside quoted fields.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What the conversion produces</h2>
          <p>
            A CSV like this:
          </p>
          <pre><code>{`name,email,age,active
John Doe,john@example.com,30,true
Jane Smith,jane@example.com,25,false`}</code></pre>
          <p>
            Becomes a JSON array of objects, one per row, using the header row as property names:
          </p>
          <pre><code>{`[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "age": "30",
    "active": "true"
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": "25",
    "active": "false"
  }
]`}</code></pre>
          <p>
            Notice: all values are strings by default. CSV has no type system â€” everything is text. If you need <code>age</code> as a number and <code>active</code> as a boolean, you&apos;ll need to handle type coercion after conversion.
          </p>
          <p>
            Convert any CSV file using the <Link href="/tools/csv-to-json">free CSV to JSON converter</Link> â€” paste CSV or upload a file, get formatted JSON instantly.
          </p>

          <h2>Handling the common problems</h2>

          <h3>Commas inside field values</h3>
          <p>
            RFC 4180 (the CSV standard) handles commas inside field values by wrapping the field in double quotes:
          </p>
          <pre><code>{`name,address,city
John,"123 Main St, Apt 4B",Springfield`}</code></pre>
          <p>
            The <code>address</code> field contains a comma but is correctly parsed as one value because it&apos;s quoted. Any proper CSV parser handles this â€” but if you&apos;re writing a simple split-on-comma parser yourself, you&apos;ll miss this and get the wrong result. Use the converter or a proper library.
          </p>

          <h3>Quotes inside quoted fields</h3>
          <pre><code>{`name,bio
John,"He said ""hello"" to everyone"`}</code></pre>
          <p>
            Double-quote characters inside a quoted field are escaped by doubling them (<code>""</code>). The resulting JSON:
          </p>
          <pre><code>{`{"name": "John", "bio": "He said \"hello\" to everyone"}`}</code></pre>

          <h3>Different delimiters (TSV, semicolons)</h3>
          <p>
            Not all &quot;CSV&quot; files use commas. European locales often export with semicolons (<code>;</code>) because commas are used as decimal separators. Tab-separated values (TSV) use tabs.
          </p>
          <p>
            The converter lets you specify the delimiter â€” choose comma, semicolon, tab, or pipe (<code>|</code>) depending on your source file.
          </p>

          <h2>Type conversion after parsing</h2>
          <p>
            Since CSV values are all strings, you&apos;ll often need to convert types in code. In JavaScript:
          </p>
          <pre><code>{`const raw = [
  { name: "John", age: "30", active: "true" }
];

const typed = raw.map(row => ({
  ...row,
  age: Number(row.age),
  active: row.active === 'true'
}));
// Result: { name: "John", age: 30, active: true }`}</code></pre>
          <p>
            For large datasets, consider using a library like Papa Parse (browser) or fast-csv (Node.js) which supports type inference options.
          </p>

          <h2>Converting in code (no tool needed)</h2>
          <p>
            If you need to convert CSV to JSON programmatically:
          </p>
          <p>JavaScript (browser/Node.js, simple case):</p>
          <pre><code>{`function csvToJson(csv) {
  const lines = csv.trim().split('\\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i]?.trim() ?? '';
      return obj;
    }, {});
  });
}`}</code></pre>
          <p>
            Note: this simple approach doesn&apos;t handle quoted fields with commas inside them. For production use, use Papa Parse or a proper CSV library.
          </p>
          <p>Python:</p>
          <pre><code>{`import csv, json

with open('data.csv', newline='') as f:
    reader = csv.DictReader(f)
    data = list(reader)

print(json.dumps(data, indent=2))`}</code></pre>

          <h2>Common use cases</h2>
          <ul>
            <li><strong>Google Sheets â†’ API payload:</strong> Export as CSV â†’ convert to JSON â†’ POST to a REST API that expects JSON</li>
            <li><strong>Excel data â†’ database seed:</strong> Convert CSV export to JSON for seeding a database via a script</li>
            <li><strong>Product catalog import:</strong> Many e-commerce platforms accept JSON imports â€” convert your spreadsheet product data</li>
            <li><strong>Data analysis prototype:</strong> Convert CSV data to JSON to use with JavaScript charting libraries (Chart.js, D3.js) that expect JSON arrays</li>
          </ul>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/csv-to-json">Free CSV to JSON Converter</Link> â€” convert CSV files or paste CSV text to JSON instantly</li>
            <li><Link href="/tools/json-formatter">Free JSON Formatter</Link> â€” format and validate the resulting JSON</li>
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

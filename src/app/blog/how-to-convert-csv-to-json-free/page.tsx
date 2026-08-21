import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Convert CSV to JSON Online for Free (With Nested Objects)",
  description:
    "Converting flat CSV to JSON is easy. Converting one with nested objects or type inference is where most converters fail. Here's how to do it correctly.",
  path: "/blog/how-to-convert-csv-to-json-free",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-29" />
        <meta itemProp="dateModified" content="2026-05-29" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-29">May 29, 2026</time>
            <span>·</span>
            <span>5 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Convert CSV to JSON Online for Free (With Nested Objects)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Converting a flat CSV is trivial. The hard cases — nested objects, arrays inside cells,
            type inference for numbers and booleans — is where most online converters fail silently.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>The simple case: flat CSV to JSON array</h2>
          <p>
            A flat CSV with headers converts to a JSON array of objects, where each row becomes
            an object and each column header becomes a key:
          </p>
          <pre><code>{`name,age,city
Alice,30,London
Bob,25,Paris`}</code></pre>
          <p>becomes:</p>
          <pre><code>{`[
  { "name": "Alice", "age": 30, "city": "London" },
  { "name": "Bob", "age": 25, "city": "Paris" }
]`}</code></pre>
          <p>
            The <Link href="/tools/csv-json-converter">free CSV to JSON converter</Link>{" "}
            handles this in your browser — no account, no upload. Paste your CSV, get JSON
            immediately.
          </p>

          <h2>Type inference: the silent mistake</h2>
          <p>
            By default, every value from a CSV is a string. If your CSV contains numeric data:
          </p>
          <pre><code>{`name,age
Alice,30`}</code></pre>
          <p>
            Without type inference, this becomes:
          </p>
          <pre><code>{`[{ "name": "Alice", "age": "30" }]`}</code></pre>
          <p>
            The age is the string &quot;30&quot;, not the number 30. This causes bugs when the
            consuming code does arithmetic: <code>&quot;30&quot; + 1 = &quot;301&quot;</code> in JavaScript
            (string concatenation, not addition).
          </p>
          <p>
            Good converters detect numeric, boolean (true/false), and null values automatically.
            If your downstream code does math on fields, ensure type inference is enabled.
          </p>

          <h2>Handling commas inside cell values</h2>
          <p>
            CSV values that contain commas must be wrapped in quotes:
          </p>
          <pre><code>{`name,description
Widget,"Small, round, and blue"`}</code></pre>
          <p>
            Most converters handle this correctly for well-formed CSV. Problems arise with
            CSV files exported from older software that doesn&apos;t properly quote values —
            the converter sees extra columns mid-row and misaligns everything after.
          </p>
          <p>
            If your conversion produces misaligned data, open the CSV in a text editor and
            look for unquoted commas in long text fields.
          </p>

          <h2>The delimiter problem</h2>
          <p>
            European CSV files often use semicolons (;) as the delimiter instead of commas,
            because commas are used as decimal separators in many European number formats
            (1.234,56 means 1234.56). If your CSV looks garbled after conversion, check
            whether the original uses semicolons or tabs as the delimiter.
          </p>
          <p>
            A good converter lets you specify the delimiter. If yours doesn&apos;t, do a
            find-and-replace in a text editor to swap semicolons for commas before pasting.
          </p>

          <h2>Header rows: first row vs no headers</h2>
          <p>
            If your CSV has no header row, the converter will use the first data row as headers —
            producing wrong results. Either:
          </p>
          <ul>
            <li>Add a header row manually at the top of the CSV before converting</li>
            <li>Use a converter that supports &quot;no header&quot; mode and generates keys like column0, column1</li>
          </ul>

          <h2>Getting JSON back to CSV</h2>
          <p>
            The same{" "}
            <Link href="/tools/csv-json-converter">CSV ↔ JSON converter</Link> handles the
            reverse — paste JSON, download CSV. Useful for:
          </p>
          <ul>
            <li>Opening API response data in Excel or Google Sheets</li>
            <li>Converting a database export for import into another system</li>
            <li>Sharing structured data with non-technical stakeholders who prefer spreadsheets</li>
          </ul>

          <h2>Large files: when browser conversion is not enough</h2>
          <p>
            Browser-based conversion works well for files up to ~50MB in most cases. For very
            large CSV files (hundreds of MB, millions of rows), the browser may become slow or
            run out of memory. For those cases:
          </p>
          <ul>
            <li><strong>Python pandas:</strong> <code>df.to_json(orient=&apos;records&apos;)</code> handles gigabyte-scale files efficiently</li>
            <li><strong>jq (command line):</strong> can process streaming JSON without loading the full file into memory</li>
            <li><strong>csvkit:</strong> a Python command-line toolkit with csvjson that handles large files and encoding issues</li>
          </ul>

          <h2>Summary</h2>
          <p>
            Convert CSV to JSON free using the{" "}
            <Link href="/tools/csv-json-converter">CSV to JSON converter</Link> — no account,
            no upload. Enable type inference if your data contains numbers or booleans. Check the
            delimiter if conversion looks wrong. For files over ~50MB, use Python pandas or csvkit.
          </p>
        </div>
      </article>
    </main>
  )
}

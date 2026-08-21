import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "Roman Numeral Converter: How Roman Numerals Work and Where They're Used",
  description:
    "How Roman numerals work, the subtractive notation rules, and a free converter for any number. Includes common uses in modern contexts.",
  path: "/blog/roman-numeral-converter-explained",
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
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            Roman Numeral Converter: How Roman Numerals Work and Where They&apos;re Used
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Roman numerals show up on clock faces, movie sequel titles, Super Bowl numbers, and copyright dates. Here&apos;s the complete system â€” rules, common values, and a free converter.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>The seven symbols</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Symbol</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Value</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Origin</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 text-gray-600 font-bold">I</td><td className="border border-gray-200 p-3 text-gray-600">1</td><td className="border border-gray-200 p-3 text-gray-600">One finger/tally</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600 font-bold">V</td><td className="border border-gray-200 p-3 text-gray-600">5</td><td className="border border-gray-200 p-3 text-gray-600">Hand (V shape of thumb and fingers)</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600 font-bold">X</td><td className="border border-gray-200 p-3 text-gray-600">10</td><td className="border border-gray-200 p-3 text-gray-600">Two V&apos;s (two hands)</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600 font-bold">L</td><td className="border border-gray-200 p-3 text-gray-600">50</td><td className="border border-gray-200 p-3 text-gray-600">Half of C (100)</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600 font-bold">C</td><td className="border border-gray-200 p-3 text-gray-600">100</td><td className="border border-gray-200 p-3 text-gray-600">Centum (Latin for 100)</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600 font-bold">D</td><td className="border border-gray-200 p-3 text-gray-600">500</td><td className="border border-gray-200 p-3 text-gray-600">Half of M (1000)</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600 font-bold">M</td><td className="border border-gray-200 p-3 text-gray-600">1000</td><td className="border border-gray-200 p-3 text-gray-600">Mille (Latin for 1000)</td></tr>
              </tbody>
            </table>
          </div>

          <h2>The additive and subtractive rules</h2>
          <p>
            Roman numerals are generally written largest to smallest, left to right, and you add the values:
          </p>
          <ul>
            <li>VIII = 5 + 1 + 1 + 1 = 8</li>
            <li>XVII = 10 + 5 + 1 + 1 = 17</li>
            <li>CXXX = 100 + 10 + 10 + 10 = 130</li>
          </ul>
          <p>
            The subtractive notation rule: when a smaller symbol appears before a larger one, subtract it. Only six specific subtractive combinations are valid:
          </p>
          <ul>
            <li><strong>IV</strong> = 4 (not IIII)</li>
            <li><strong>IX</strong> = 9 (not VIIII)</li>
            <li><strong>XL</strong> = 40 (not XXXX)</li>
            <li><strong>XC</strong> = 90 (not LXXXX)</li>
            <li><strong>CD</strong> = 400 (not CCCC)</li>
            <li><strong>CM</strong> = 900 (not DCCCC)</li>
          </ul>
          <p>
            Combinations outside these six are not valid â€” IIX (trying to write 8) or VX (trying to write 5) are incorrect. Only one smaller symbol can precede a larger one in a subtractive pair.
          </p>

          <h2>Common values reference</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Number</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Roman</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Number</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Roman</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 p-3 text-gray-600">4</td><td className="border border-gray-200 p-3 text-gray-600">IV</td><td className="border border-gray-200 p-3 text-gray-600">40</td><td className="border border-gray-200 p-3 text-gray-600">XL</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">9</td><td className="border border-gray-200 p-3 text-gray-600">IX</td><td className="border border-gray-200 p-3 text-gray-600">90</td><td className="border border-gray-200 p-3 text-gray-600">XC</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">14</td><td className="border border-gray-200 p-3 text-gray-600">XIV</td><td className="border border-gray-200 p-3 text-gray-600">400</td><td className="border border-gray-200 p-3 text-gray-600">CD</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">19</td><td className="border border-gray-200 p-3 text-gray-600">XIX</td><td className="border border-gray-200 p-3 text-gray-600">500</td><td className="border border-gray-200 p-3 text-gray-600">D</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">24</td><td className="border border-gray-200 p-3 text-gray-600">XXIV</td><td className="border border-gray-200 p-3 text-gray-600">900</td><td className="border border-gray-200 p-3 text-gray-600">CM</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">29</td><td className="border border-gray-200 p-3 text-gray-600">XXIX</td><td className="border border-gray-200 p-3 text-gray-600">1000</td><td className="border border-gray-200 p-3 text-gray-600">M</td></tr>
                <tr><td className="border border-gray-200 p-3 text-gray-600">Super Bowl LVIII</td><td className="border border-gray-200 p-3 text-gray-600">58</td><td className="border border-gray-200 p-3 text-gray-600">MMXXVI</td><td className="border border-gray-200 p-3 text-gray-600">2026</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Where Roman numerals appear today</h2>
          <ul>
            <li><strong>Super Bowl.</strong> The NFL uses Roman numerals for Super Bowl numbers â€” Super Bowl LVIII was played in February 2024 (58th Super Bowl). The NFL skipped Roman numerals for Super Bowl 50 because &quot;L&quot; looked awkward as branding.</li>
            <li><strong>Copyright years.</strong> Credits in movies, TV shows, and books often display the copyright year as Roman numerals â€” a tradition meant to obscure the production date (no longer effective given the internet, but the tradition persists).</li>
            <li><strong>Clock faces.</strong> Analog clocks and watches frequently use Roman numerals. Note: on most clocks, 4 o&apos;clock is written as IIII (additive), not IV (subtractive) â€” this is a historical convention for clock aesthetics, not standard Roman numeral notation.</li>
            <li><strong>Royalty and papal names.</strong> King Charles III, Pope John Paul II â€” sequential numbering with Roman numerals is standard for monarchs and popes sharing a name.</li>
            <li><strong>Outlines and lists.</strong> Formal outlines use Roman numerals for top-level sections (I, II, III) with capital letters for subsections (A, B, C).</li>
            <li><strong>Building cornerstones and public art.</strong> The year of construction on buildings, bridges, and monuments is often inscribed in Roman numerals.</li>
          </ul>

          <h2>Converting large numbers</h2>
          <p>
            Standard Roman numerals top out at 3,999 (MMMCMXCIX). Ancient Romans handled larger numbers with overbars (a bar over a numeral multiplied it by 1,000) or vinculum notation â€” but these aren&apos;t in common use today.
          </p>
          <p>
            For any number conversion â€” year, sequence number, or any integer â€” use the <Link href="/tools/roman-numeral-converter">free Roman numeral converter</Link>. It converts both directions (number to Roman and Roman to number) instantly.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/roman-numeral-converter">Free Roman Numeral Converter</Link> â€” convert any number to Roman numerals and back</li>
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

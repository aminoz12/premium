import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "What Is Lorem Ipsum and Why Do Designers Use It?",
  description:
    "Lorem ipsum has been in design mockups since the 1960s — but it's not random gibberish. It's derived from Cicero's De Finibus, scrambled. Here's the history and when to use real content instead.",
  path: "/blog/what-is-lorem-ipsum-and-why-it-exists",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-30" />
        <meta itemProp="dateModified" content="2026-05-30" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-30">May 30, 2026</time>
            <span>·</span>
            <span>4 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            What Is Lorem Ipsum and Why Do Designers Use It?
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Lorem ipsum is not random — it is a scrambled passage from a 45 BC philosophical
            treatise by Cicero. Here&apos;s why it&apos;s been in design mockups for 60 years
            and when to use real content instead.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>What lorem ipsum actually is</h2>
          <p>
            Lorem ipsum is derived from <em>De Finibus Bonorum et Malorum</em> (On the Ends of
            Good and Evil) by Cicero, written in 45 BC. The original passage reads:
          </p>
          <blockquote>
            <p>
              &quot;Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur,
              adipisci velit...&quot; (&quot;Nor is there anyone who loves pain itself since it is pain
              and thus wants to obtain it...&quot;)
            </p>
          </blockquote>
          <p>
            The lorem ipsum text is a scrambled, partially nonsensical version of this passage.
            It was introduced to the design world in the 1960s when Letraset (a dry-transfer
            lettering company) used it on their typeface sample sheets. When desktop publishing
            software like PageMaker became common in the 1980s, it was included as filler text —
            and it has been the standard ever since.
          </p>

          <h2>Why designers use placeholder text</h2>
          <p>
            The core reason: placeholder text lets designers focus on layout, typography, and
            visual hierarchy without the distraction of real content.
          </p>
          <p>
            When a mockup uses real content — especially a client&apos;s actual marketing copy —
            stakeholders focus on the words rather than the design. They correct spelling, argue
            about tone, and approve specific phrasing instead of evaluating whether the layout
            works. Placeholder text prevents this problem.
          </p>
          <p>
            Lorem ipsum specifically is better than English filler text like &quot;This is
            placeholder text&quot; because it fills space naturally (Latin has similar word
            lengths to English) and is obviously not real content — no one tries to read it for meaning.
          </p>

          <h2>The full standard lorem ipsum passage</h2>
          <p>
            The classic version used in most design tools:
          </p>
          <p>
            <em>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </em>
          </p>
          <p>
            Generate more paragraphs with the{" "}
            <Link href="/tools/lorem-ipsum">free Lorem Ipsum generator</Link> — any number
            of paragraphs, words, or sentences, in your browser with no account.
          </p>

          <h2>When not to use lorem ipsum</h2>
          <p>
            Placeholder text is useful in early design stages but becomes a liability in later ones.
            Stop using lorem ipsum when:
          </p>
          <ul>
            <li>
              <strong>You are testing typography decisions:</strong> different typefaces render
              differently with Latin vs English. The actual character mix in your language affects
              spacing and readability.
            </li>
            <li>
              <strong>You are presenting to a client for approval:</strong> clients cannot
              accurately assess how a layout feels with real content until they see real content.
              Placeholder text gets approved; the real content then breaks the design.
            </li>
            <li>
              <strong>You are testing content hierarchy:</strong> the relative importance of
              different text elements only becomes clear with actual headlines and body copy.
            </li>
            <li>
              <strong>The content is going to be variable length:</strong> a headline that works
              with &quot;Lorem ipsum dolor&quot; may break with &quot;How Our Q3 Enterprise SaaS
              Platform Outperformed Market Expectations by 47%.&quot;
            </li>
          </ul>

          <h2>Alternatives to lorem ipsum</h2>
          <ul>
            <li><strong>Real content drafts:</strong> even rough copy is better than Latin for late-stage design</li>
            <li><strong>Language-specific generators:</strong> some tools generate placeholder text in your target language, which tests line-break behavior more accurately</li>
            <li><strong>Hipster Ipsum, Bacon Ipsum, etc.:</strong> humorous alternatives that are still obviously placeholder but more entertaining for internal use</li>
          </ul>

          <h2>Summary</h2>
          <p>
            Lorem ipsum is a scrambled Latin passage from Cicero, used since the 1960s to fill
            design mockups without distracting stakeholders with real content. Use it freely in
            early-stage layouts. Switch to real content before final design approval. Generate
            any amount of it with the{" "}
            <Link href="/tools/lorem-ipsum">free Lorem Ipsum generator</Link>.
          </p>
        </div>
      </article>
    </main>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Check Password Strength: What the Meters Actually Measure",
  description:
    "Password strength meters measure different things â€” entropy, pattern matching, and dictionary checks. Here's what they mean and what actually makes a password strong.",
  path: "/blog/how-to-check-password-strength",
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
            <span>7 min read</span>
            <span>Â·</span>
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">
              Blog
            </Link>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl"
            itemProp="headline"
          >
            How to Check Password Strength: What the Meters Actually Measure
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Password strength meters disagree with each other â€” the same password can be &quot;weak&quot; on one site and &quot;strong&quot; on another. Here&apos;s what they&apos;re actually measuring and what determines real-world strength.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>What password strength meters actually measure</h2>
          <p>
            Most simple password meters count which character types are present (uppercase, lowercase, numbers, symbols) and apply a score based on length. The problem: <code>Password1!</code> scores well on these meters despite being one of the most commonly used passwords in the world.
          </p>
          <p>
            Better meters (like the zxcvbn library, used by Dropbox and many security tools) use pattern matching against a database of common passwords, dictionary words, keyboard patterns (qwerty, 123456), and known substitutions (p@ssw0rd). These give a much more accurate picture of real-world crackability.
          </p>
          <p>
            The <Link href="/tools/password-generator">free password generator and checker</Link> shows you entropy (in bits) and estimated crack time â€” the two most meaningful metrics.
          </p>

          <h2>The entropy metric</h2>
          <p>
            Entropy measures how much randomness (unpredictability) a password contains, in bits. Higher entropy means more possible passwords an attacker must try to crack yours by brute force.
          </p>
          <p>
            Rough formula: <strong>entropy = logâ‚‚(character_set_size) Ã— password_length</strong>
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Password type</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Character set</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Example</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Entropy at 12 chars</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Lowercase only</td>
                  <td className="border border-gray-200 p-3 text-gray-600">26</td>
                  <td className="border border-gray-200 p-3 text-gray-600">abcdefghijkl</td>
                  <td className="border border-gray-200 p-3 text-gray-600">56 bits</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Lower + upper</td>
                  <td className="border border-gray-200 p-3 text-gray-600">52</td>
                  <td className="border border-gray-200 p-3 text-gray-600">AbCdEfGhIjKl</td>
                  <td className="border border-gray-200 p-3 text-gray-600">68 bits</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Lower + upper + numbers</td>
                  <td className="border border-gray-200 p-3 text-gray-600">62</td>
                  <td className="border border-gray-200 p-3 text-gray-600">AbCd3fGh1jKl</td>
                  <td className="border border-gray-200 p-3 text-gray-600">71 bits</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Lower + upper + numbers + symbols</td>
                  <td className="border border-gray-200 p-3 text-gray-600">94</td>
                  <td className="border border-gray-200 p-3 text-gray-600">AbC!3fG#1jK$</td>
                  <td className="border border-gray-200 p-3 text-gray-600">79 bits</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These are theoretical maximums assuming the password is truly random. Passwords with words, names, dates, or predictable patterns have much lower effective entropy â€” regardless of what character types they contain.
          </p>

          <h2>Crack time estimates</h2>
          <p>
            Modern GPUs can attempt billions of password hashes per second. Crack time estimates depend heavily on what hashing algorithm protects the password:
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold">Hash algorithm</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Guesses/second (single GPU)</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">MD5</td>
                  <td className="border border-gray-200 p-3 text-gray-600">~68 billion</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Never use for passwords</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">SHA-256</td>
                  <td className="border border-gray-200 p-3 text-gray-600">~12 billion</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Not designed for passwords</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">bcrypt (cost 10)</td>
                  <td className="border border-gray-200 p-3 text-gray-600">~23,000</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Designed for passwords â€” slow by design</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-3 text-gray-600">Argon2id</td>
                  <td className="border border-gray-200 p-3 text-gray-600">~1,000â€“10,000</td>
                  <td className="border border-gray-200 p-3 text-gray-600">Current best practice</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A 6-character alphanumeric password cracked with MD5 takes seconds. The same password protected by bcrypt might take hours. The right answer is: use a strong random password AND assume good hashing. Don&apos;t rely on the site to protect you.
          </p>

          <h2>The passphrase alternative</h2>
          <p>
            NIST (National Institute of Standards and Technology) guidelines now recommend length over complexity. A passphrase â€” a sequence of random words â€” can be more secure and far more memorable than a complex 8-character password.
          </p>
          <ul>
            <li><code>correct-horse-battery-staple</code> â€” 28 characters, 4 random words â€” approximately 44 bits of entropy from a 2,000-word dictionary</li>
            <li><code>P@ssw0rd1!</code> â€” 10 characters, looks complex â€” but it&apos;s in every password cracking dictionary</li>
          </ul>
          <p>
            For human-memorable passwords, passphrases win. For passwords stored in a password manager (which you should be using), a fully random 16â€“20 character string with all character types is strongest.
          </p>

          <h2>What actually makes a password weak (real-world risks)</h2>
          <ul>
            <li><strong>Reuse.</strong> The biggest real-world password risk is not brute force â€” it&apos;s credential stuffing. If one site is breached and your password is exposed, attackers try that same email+password combination on every major service. Use a unique password for every site.</li>
            <li><strong>Dictionary words and names.</strong> Attackers run dictionary attacks first â€” full lists of common words, names, places, and known leaked passwords. A password from a dictionary is cracked in seconds regardless of length.</li>
            <li><strong>Predictable substitutions.</strong> Replacing &apos;a&apos; with &apos;@&apos; and &apos;o&apos; with &apos;0&apos; is in every cracker&apos;s substitution table. &apos;p@ssw0rd&apos; is treated the same as &apos;password&apos; by modern crackers.</li>
            <li><strong>Short passwords.</strong> Under 12 characters, even fully random passwords face real brute-force risk against fast algorithms. 16+ characters is the current practical minimum for important accounts.</li>
          </ul>

          <h2>Generating strong passwords</h2>
          <p>
            The <Link href="/tools/password-generator">free password generator</Link> creates cryptographically random passwords at any length. For important accounts (email, banking, password manager master password), use 20+ characters with all character types. Store them in a password manager â€” no one can remember 20-character random strings, and they shouldn&apos;t try.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/password-generator">Free Password Generator</Link> â€” generate cryptographically random passwords and check strength</li>
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

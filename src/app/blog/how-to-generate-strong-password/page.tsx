import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"
export const metadata: Metadata = buildPageMetadata({
  title: "How to Generate a Strong Password (And Why Your Method Might Be Wrong)",
  description:
    "Most people think strong passwords look like xK9#mQ2!. Research shows a passphrase is stronger and more memorable. Here's the math behind it.",
  path: "/blog/how-to-generate-strong-password",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-05-31" />
        <meta itemProp="dateModified" content="2026-05-31" />
        <meta itemProp="author" content="Achraf A." />
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs  text-black/60 dark:text-white/60">
            <time dateTime="2026-05-31">May 31, 2026</time>
            <span>·</span>
            <span>6 min read</span>
            <span>·</span>
            <Link href="/blog" className=" text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            How to Generate a Strong Password (And Why Your Current Method Might Be Wrong)
          </h1>
          <p className="mt-4 text-lg leading-relaxed  text-black/60 dark:text-white/60">
            Password strength is about entropy, not complexity. A random string of words is
            mathematically stronger than a short string of symbols — and you can actually remember it.
          </p>
        </header>
        <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60" itemProp="articleBody">
          <h2>Why entropy is what actually matters</h2>
          <p>
            Password strength is measured in bits of entropy — how many guesses an attacker needs
            to try on average to crack it. A password with 60 bits of entropy requires 2^60 guesses
            on average — over a quadrillion attempts. At one billion guesses per second (a realistic
            GPU attack rate), that takes over 36,000 years.
          </p>
          <p>
            The number of characters and the character set determine entropy:
          </p>
          <ul>
            <li>8 characters, lowercase only: ~37 bits — crackable in hours</li>
            <li>8 characters, mixed case + digits + symbols: ~52 bits — crackable in weeks</li>
            <li>16 characters, lowercase only: ~75 bits — effectively uncrackable</li>
            <li>4 random words (like &quot;correct horse battery staple&quot;): ~44 bits per word × 4 = ~77 bits — effectively uncrackable</li>
          </ul>

          <h2>The correct-horse-battery-staple insight</h2>
          <p>
            The xkcd comic that popularized &quot;correct horse battery staple&quot; made a real
            mathematical point. Four random common words produce a password with more entropy
            than a shorter complex one — and it is far easier to remember.
          </p>
          <p>
            The key word is <em>random</em>. &quot;ilovemydog2006&quot; is not a passphrase — it
            is predictable. A truly random selection of words from a large word list (like the EFF
            word list with 7,776 words) gives ~12.9 bits of entropy per word. Four words gives ~52
            bits, five words gives ~65 bits.
          </p>

          <h2>The two types of strong passwords and when to use each</h2>
          <p>
            <strong>Random character strings</strong> (like <code>xK9#mQ2!vB3p</code>) are ideal
            when:
          </p>
          <ul>
            <li>You are using a password manager and never need to type or remember the password</li>
            <li>The site has a character limit that prevents long passphrases</li>
            <li>You need maximum entropy in minimum characters</li>
          </ul>
          <p>
            <strong>Passphrases</strong> (like <code>correct-horse-battery-staple</code>) are ideal when:
          </p>
          <ul>
            <li>You need to type the password regularly (disk encryption, computer login)</li>
            <li>You need to share it verbally or remember it without a manager</li>
            <li>The site does not have a maximum length restriction</li>
          </ul>

          <h2>What makes a password weak</h2>
          <p>
            Attackers do not guess randomly. They use dictionaries — lists of known passwords,
            common words, and variations. These attacks catch:
          </p>
          <ul>
            <li>Any word in a dictionary, even with obvious substitutions (p@ssword, passw0rd)</li>
            <li>Names followed by years (john2019, sarah1987)</li>
            <li>Keyboard walks (qwerty, 123456, asdfgh)</li>
            <li>Any password from previous data breaches — these are in every attacker&apos;s wordlist</li>
          </ul>
          <p>
            Check if your email has appeared in known breaches at haveibeenpwned.com. Any password
            associated with a breached account should be changed immediately.
          </p>

          <h2>How to generate a strong password now</h2>
          <p>
            Use the <Link href="/tools/password-generator">free password generator</Link> —
            it uses the browser&apos;s cryptographically secure random number generator
            (<code>crypto.getRandomValues</code>), which is specifically designed to produce
            values that cannot be predicted. Generated passwords are never sent to any server.
          </p>
          <p>
            For a random character password: select at least 16 characters with uppercase,
            lowercase, digits, and symbols.
          </p>
          <p>
            For a passphrase: select the passphrase option, which picks words randomly from a
            large word list. Four words minimum, five or six for high-security accounts.
          </p>

          <h2>Reuse is the biggest risk</h2>
          <p>
            The most dangerous password habit is not using a weak password — it is using the same
            password on multiple sites. When one site suffers a breach, attackers immediately try
            the leaked credentials on every major service (credential stuffing). Unique passwords
            for every account eliminate this attack entirely.
          </p>
          <p>
            The only practical way to have unique strong passwords for every service is a password
            manager. Generate a random 20-character password per site, store it in the manager,
            and use the master password + 2FA to protect the manager itself.
          </p>

          <h2>Summary</h2>
          <ul>
            <li>Aim for at least 16 characters or a 4-word passphrase for new passwords</li>
            <li>Use cryptographic randomness — not a pattern you make up</li>
            <li>Never reuse passwords across different sites</li>
            <li>Use a password manager so you only need to remember one master password</li>
            <li>Generate passwords with the <Link href="/tools/password-generator">free password generator</Link> — nothing leaves your browser</li>
          </ul>
        </div>
      </article>
    </main>
  )
}

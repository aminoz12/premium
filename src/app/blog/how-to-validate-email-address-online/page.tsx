import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "How to Validate an Email Address: What Actually Matters",
  description:
    "Email validation rules, the regex patterns that work, why 100% validation is impossible, and how to check if an email is real without sending a test message.",
  path: "/blog/how-to-validate-email-address-online",
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
            How to Validate an Email Address: What Actually Matters
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            Email validation sounds simple but RFC 5322 allows addresses that most people would reject as invalid. Here&apos;s the practical approach to validation â€” what to check, what to accept, and why perfect validation is a myth.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>The minimum viable email validation</h2>
          <p>
            For most applications, this is enough:
          </p>
          <pre><code>{`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`}</code></pre>
          <p>
            This checks that the address has:
          </p>
          <ol>
            <li>A local part before the @ (letters, numbers, dots, underscores, percent, plus, hyphen)</li>
            <li>An @ symbol</li>
            <li>A domain name</li>
            <li>A dot followed by at least 2 letters (TLD)</li>
          </ol>
          <p>
            It will reject clearly invalid addresses and accept all common ones. It will also accept some technically invalid addresses â€” but that&apos;s the right trade-off, as we&apos;ll see.
          </p>
          <p>
            Test this pattern immediately in the <Link href="/tools/regex-tester">free regex tester</Link>.
          </p>

          <h2>What RFC 5322 actually allows (the problem)</h2>
          <p>
            The official email standard (RFC 5322) allows email addresses that look nothing like what most people expect:
          </p>
          <ul>
            <li><code>"john doe"@example.com</code> â€” quoted local part with a space</li>
            <li><code>user+tag@example.com</code> â€” plus addressing (common, works fine)</li>
            <li><code>user.@example.com</code> â€” trailing dot in local part (technically valid)</li>
            <li><code>"very.unusual.@.unusual.com"@example.com</code> â€” quoted with special chars</li>
            <li><code>user@[192.168.1.1]</code> â€” IP address as domain</li>
          </ul>
          <p>
            If you write a regex strict enough to reject all these edge cases, you&apos;ll also reject some legitimate addresses your users actually have. The consensus among email deliverability experts: validate leniently in the regex and validate strictly by sending a confirmation email.
          </p>

          <h2>The only real validation: send a confirmation email</h2>
          <p>
            Regex validation tells you if an email address is formatted plausibly. It can&apos;t tell you:
          </p>
          <ul>
            <li>Whether the mailbox exists</li>
            <li>Whether the person has access to it</li>
            <li>Whether the domain has working MX records</li>
            <li>Whether it&apos;s a disposable email (10-minute mail)</li>
          </ul>
          <p>
            A confirmation email with a link is the only reliable way to verify that an email address is real and belongs to the person signing up. This is also why you should <em>never</em> block users from continuing past email validation â€” let them proceed, send the confirmation, and require clicking the link before giving full access.
          </p>

          <h2>MX record checking</h2>
          <p>
            One step beyond regex: verify that the email&apos;s domain has an MX (Mail Exchanger) DNS record â€” meaning it can receive email at all. Domains without MX records can&apos;t receive email.
          </p>
          <p>
            Check DNS records (including MX) for any domain with the <Link href="/tools/dns-lookup">free DNS lookup tool</Link>. If a domain has no MX records, the email address is certainly undeliverable.
          </p>
          <p>
            In code (Node.js):
          </p>
          <pre><code>{`const dns = require('dns').promises;
const hasMX = await dns.resolveMx('example.com')
  .then(records => records.length > 0)
  .catch(() => false);`}</code></pre>

          <h2>Common validation mistakes to avoid</h2>
          <ul>
            <li><strong>Rejecting plus addressing.</strong> <code>user+tag@gmail.com</code> is valid and commonly used for filtering. Many strict regex patterns reject the <code>+</code> character â€” don&apos;t.</li>
            <li><strong>Rejecting long TLDs.</strong> New TLDs like <code>.photography</code>, <code>.academy</code>, and <code>.technology</code> are up to 63 characters long. Any validation that limits TLD to 4 characters will reject these legitimate addresses.</li>
            <li><strong>Rejecting international email.</strong> Email addresses can use internationalized domain names and, in some implementations, Unicode local parts. If your system handles international users, be careful with overly restrictive validation.</li>
            <li><strong>Blocking disposable email services.</strong> Maintaining a blocklist of disposable email providers (Mailinator, Temp-Mail, etc.) is a valid anti-abuse measure â€” but it requires ongoing maintenance and will occasionally block legitimate users using privacy-focused email services.</li>
          </ul>

          <h2>Client-side vs server-side validation</h2>
          <p>
            Always validate on both:
          </p>
          <ul>
            <li><strong>Client-side (HTML5 / JavaScript):</strong> Immediate feedback to the user before form submission. Use the HTML <code>type="email"</code> input, which provides built-in basic validation in modern browsers. Add JavaScript for custom error messages.</li>
            <li><strong>Server-side:</strong> Never trust client-side validation alone â€” it can be bypassed. Re-validate the email format and perform MX checks on the server before storing or using the address.</li>
          </ul>
          <p>
            HTML input with built-in email validation:
          </p>
          <pre><code>{`<input
  type="email"
  required
  placeholder="your@email.com"
  pattern="[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}"
/>`}</code></pre>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/regex-tester">Free Regex Tester</Link> â€” test your email validation regex against real addresses</li>
            <li><Link href="/tools/dns-lookup">Free DNS Lookup</Link> â€” check if a domain has MX records before sending</li>
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

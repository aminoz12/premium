const fs = require('fs');
const content = fs.readFileSync('src/app/tools/password-generator/page.tsx', 'utf8');

const newArticle = `        <article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Password Generator: How It Works and When to Use It" />
          <meta
            itemProp="description"
            content="Uses crypto.getRandomValues() — cryptographically secure, never Math.random(). Includes entropy table, honest limitations vs. password managers, and when each approach makes sense."
          />
          <meta itemProp="datePublished" content="2024-01-15" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* The problem this tool solves */}
          <section aria-labelledby="problem-heading" className="space-y-4">
            <h2
              id="problem-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When you reach for this instead of a password manager
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Password managers are better for most situations — they autofill, detect
              phishing, and sync across devices. But there are specific cases where a
              browser-based generator is the right tool: creating a password for a shared
              account you need to hand to someone else, generating a temporary credential
              for a contractor who doesn&apos;t use your team&apos;s password manager, or creating
              a root account password that you&apos;ll write down and store physically in a safe.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              In these scenarios, a manager&apos;s autofill advantage is irrelevant. What you
              need is a strong random string, generated privately, without it being stored
              in any third-party vault. That&apos;s what this does. Generate, copy, done — nothing
              saved anywhere.
            </p>
          </section>

          {/* How it actually works: CSPRNG */}
          <section
            aria-labelledby="how-it-works"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why{' '}
              <code className="text-sm bg-muted px-1 py-0.5 rounded">crypto.getRandomValues()</code>{' '}
              matters
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              This generator uses the Web Crypto API&apos;s{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">crypto.getRandomValues()</code>,
              which draws from the operating system&apos;s cryptographically secure pseudo-random
              number generator (CSPRNG). This is the same entropy source used by SSL/TLS
              to generate session keys. It is not{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">Math.random()</code>,
              which uses a seeded algorithm and is predictable if you know the seed.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Entropy by password length — what &quot;unguessable&quot; actually means in bits:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Length</th>
                    <th className="border border-border p-2 text-left font-semibold">Character set (lower+upper+digits+symbols)</th>
                    <th className="border border-border p-2 text-left font-semibold">Entropy (bits)</th>
                    <th className="border border-border p-2 text-left font-semibold">Brute-force time at 1 billion guesses/sec</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2 text-muted-foreground">8 chars</td>
                    <td className="border border-border p-2 text-muted-foreground">94 printable ASCII</td>
                    <td className="border border-border p-2 text-muted-foreground">52 bits</td>
                    <td className="border border-border p-2 text-muted-foreground">~1 hour</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-muted-foreground">12 chars</td>
                    <td className="border border-border p-2 text-muted-foreground">94 printable ASCII</td>
                    <td className="border border-border p-2 text-muted-foreground">79 bits</td>
                    <td className="border border-border p-2 text-muted-foreground">~300 years</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-muted-foreground">16 chars</td>
                    <td className="border border-border p-2 text-muted-foreground">94 printable ASCII</td>
                    <td className="border border-border p-2 text-muted-foreground">105 bits</td>
                    <td className="border border-border p-2 text-muted-foreground">universe-scale</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 text-muted-foreground">20 chars</td>
                    <td className="border border-border p-2 text-muted-foreground">94 printable ASCII</td>
                    <td className="border border-border p-2 text-muted-foreground">131 bits</td>
                    <td className="border border-border p-2 text-muted-foreground">universe-scale</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              12 characters with all character types is the practical minimum for anything
              important. 16 is the standard recommendation. Below 10 characters, a
              well-resourced attacker with a GPU cluster can brute-force a hash in hours.
            </p>
          </section>

          {/* Honest limitations vs. password managers */}
          <section aria-labelledby="limitations-heading" className="space-y-4">
            <h2
              id="limitations-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What a browser generator can&apos;t replace
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Phishing protection</span>
                <span>
                  Password managers autofill only on the exact domain the password was saved
                  for. They catch phishing sites automatically. A generated password you paste
                  manually offers no such protection — you&apos;ll paste it on a fake site just as
                  easily as the real one.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Storage and recall</span>
                <span>
                  This tool generates and forgets. There is no vault, no sync, no history.
                  Once you close the tab, the password is gone from here. You need to copy it
                  somewhere — ideally a password manager, a secure note, or physical storage.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Breach monitoring</span>
                <span>
                  Managers like 1Password and Bitwarden check your passwords against breach
                  databases and alert you when a site you use is compromised. A standalone
                  generator has no visibility into this.
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Short version: use this for one-off generation of passwords you&apos;ll immediately
              store somewhere secure. For day-to-day login credentials, use a password manager.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related security tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Hash Generator", path: "/tools/hash-generator" },
                  { name: "Bcrypt Password Hasher", path: "/tools/bcrypt" },
                  { name: "JWT Decoder", path: "/tools/jwt-decoder" },
                ]}
              />
            </nav>
          </section>
        </article>`;

const articleStart = content.indexOf('        <article');
const articleEnd = content.lastIndexOf('        </article>') + '        </article>'.length;

const newContent = content.slice(0, articleStart) + newArticle + content.slice(articleEnd);
fs.writeFileSync('src/app/tools/password-generator/page.tsx', newContent, 'utf8');
console.log('Done. Lines written:', newContent.split('\n').length);

import Link from "next/link"
import { Github, Mail, Twitter, Linkedin, Wrench, Phone } from "lucide-react"
import { getHubPages } from "@/lib/hubs"
import { siteConfig } from "@/lib/site-config"
import { toolCategories, toolCount } from "@/lib/tools/tools-config"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const topCategories = toolCategories
  const hubPages = getHubPages()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">{siteConfig.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Privacy-first browser tools
                </p>
              </div>
            </Link>

            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              {siteConfig.description} Browse {toolCount}+ tools spanning development, design,
              SEO, accessibility, file workflows, finance, and technical calculators.
            </p>

            <div className="">
            
          <a
            href={`mailto:${siteConfig.email}`}
            className=" flex gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors "
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {siteConfig.email}        </a>
             <a
            href="mailto:hello@thefreeaitools.com"
            className=" flex gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors "
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
           hello@thefreeaitools.com       </a>
             <a
            href="tel:+212755164113"
            className=" flex gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors "
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            +212 755164113       </a>
             <a
            href="mailto:support@thefreeaitools.com"
            className=" flex gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors "
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            support@thefreeaitools.com        </a>
             <a
            href="mailto:security@thefreeaitools.com"
            className=" flex gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors "
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            security@thefreeaitools.com      </a>
              <a
            href="mailto:info@thefreeaitools.com"
            className=" flex gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors "
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            info@thefreeaitools.com      </a>
          <Link
            href="/contact"
            className=" gap-2 my-20 rounded-lg border border-gray-200 bg-white dark:bg-black px-6 py-3 text-sm font-semibold text-black  dark:text-white transition-colors hover:border-blue-400 hover:text-black  dark:text-white"
          >
            Contact form
          </Link>
    
            </div>

            
          </div>

          <div>
            <h2 className="mb-4 font-semibold">Navigate</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">Home</Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-foreground">Tools</Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground">Categories</Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-foreground">Comparisons</Link>
              </li>
              <li>
                <Link href="/alternatives" className="hover:text-foreground">Free Alternatives</Link>
              </li>
              <li>
                <Link href="/best" className="hover:text-foreground">Best Tools</Link>
              </li>
              <li>
                <Link href="/use-cases" className="hover:text-foreground">How-To Guides</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground">Blog</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">About</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-semibold">Top Categories</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {topCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.id}`}
                    className="hover:text-foreground"
                    prefetch={false}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-semibold">SEO Hubs</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {hubPages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`} className="hover:text-foreground" prefetch={false}>
                    {page.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/disclaimer" className="hover:text-foreground">Disclaimer</Link>
            <Link href="/acceptable-use" className="hover:text-foreground">Acceptable Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

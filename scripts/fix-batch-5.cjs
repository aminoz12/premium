const fs = require('fs');

function replaceArticle(filePath, newArticle) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('RelatedTools')) {
    const firstNL = content.indexOf('\n');
    content = content.slice(0, firstNL + 1) +
      'import { RelatedTools } from "@/components/tools/related-tools"\n' +
      content.slice(firstNL + 1);
  }
  const techIdx = content.indexOf('itemType="https://schema.org/TechArticle"');
  const articleStart = content.lastIndexOf('<article', techIdx);
  const articleEnd = content.lastIndexOf('</article>') + '</article>'.length;
  console.log(filePath + ': replacing ' + articleStart + '-' + articleEnd + ' of ' + content.length);
  const newContent = content.slice(0, articleStart) + newArticle + content.slice(articleEnd);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Done. Lines: ' + newContent.split('\n').length);
}

// ── 1. favicon-generator ─────────────────────────────────────────────────────
replaceArticle('src/app/tools/favicon-generator/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Favicon Generator: Every Size You Actually Need in 2026" />
          <meta
            itemProp="description"
            content="Which favicon sizes are still required, which are obsolete, and the difference between favicon.ico, apple-touch-icon, and web app manifest icons."
          />
          <meta itemProp="datePublished" content="2024-03-05" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What sizes you actually need */}
          <section aria-labelledby="sizes-needed" className="space-y-4">
            <h2
              id="sizes-needed"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The favicon sizes that actually matter in 2026
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The classic{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">favicon.ico</code>{' '}
              at 16×16 is no longer sufficient. Modern browsers, mobile home screens, and
              PWAs require a specific set of sizes. The short list that covers almost
              every real scenario:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">File</th>
                    <th className="border border-border p-2 text-left font-semibold">Size(s)</th>
                    <th className="border border-border p-2 text-left font-semibold">Used by</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['favicon.ico', '16×16 + 32×32 (multi-size)', 'All browsers, browser tabs'],
                    ['favicon-32x32.png', '32×32', 'High-DPI browser tabs, Safari'],
                    ['apple-touch-icon.png', '180×180', 'iOS home screen bookmark'],
                    ['android-chrome-192x192.png', '192×192', 'Android home screen, PWA'],
                    ['android-chrome-512x512.png', '512×512', 'PWA splash screen, app stores'],
                    ['site.webmanifest', 'JSON linking the above', 'PWA installation, Chrome omnibox'],
                  ].map(([file, size, usedBy]) => (
                    <tr key={file}>
                      <td className="border border-border p-2 font-mono text-xs text-foreground">{file}</td>
                      <td className="border border-border p-2 text-muted-foreground">{size}</td>
                      <td className="border border-border p-2 text-muted-foreground">{usedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Source image recommendations */}
          <section
            aria-labelledby="source-image"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="source-image"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What makes a good source image
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Start with a square SVG or PNG at least 512×512 pixels. The icon will be
              downscaled to 16×16 — at that size, fine detail disappears. A letter,
              a simple geometric shape, or a bold monogram reads better than a complex
              logo with text. Test your source image by viewing it at 16×16 in an image
              editor before generating — if you can&apos;t recognize it at that size, neither
              can your users.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Transparent PNG is supported and recommended for non-square logos.
              The browser tab background will show through. Avoid relying on transparency
              for the 512×512 PWA splash icon, however — some Android launchers fill
              transparent areas with white or the brand color from your manifest.
            </p>
          </section>

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How this generator works
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Your source image is drawn to an HTML Canvas element at each target
              resolution using the browser&apos;s built-in image scaling (bilinear
              interpolation). Each size is exported as a PNG blob via{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">canvas.toBlob()</code>.
              The{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">favicon.ico</code>{' '}
              file is assembled client-side as a multi-resolution ICO container. Nothing
              is uploaded to a server.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                  { name: "Image Resizer", path: "/tools/image-resizer" },
                  { name: "QR Code Generator", path: "/tools/qr-code-generator" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 2. css-gradient ──────────────────────────────────────────────────────────
replaceArticle('src/app/tools/css-gradient/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="CSS Gradient Generator: Linear, Radial, Conic — and the Color Stop Mistake Everyone Makes" />
          <meta
            itemProp="description"
            content="How each CSS gradient type works, the gray dead zone that appears in two-color gradients, and how to fix it with a mid-point color stop."
          />
          <meta itemProp="datePublished" content="2024-03-20" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* The gray dead zone problem */}
          <section aria-labelledby="gray-zone" className="space-y-4">
            <h2
              id="gray-zone"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The gray dead zone in two-color gradients
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              If you build a gradient between two saturated complementary colors —
              say, blue (#3B82F6) to orange (#F97316) — the midpoint interpolates
              through gray in sRGB color space. The gradient looks muddy or washed out
              in the middle. This is not a rendering bug; it&apos;s how sRGB linear
              interpolation works between colors that are opposite on the hue wheel.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The fix: add a mid-point color stop at 50% using a saturated color that
              sits between the two hues on the wheel. For blue-to-orange, that&apos;s
              roughly purple (#7C3AED) or magenta. Alternatively, use{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">oklch</code>{' '}
              color interpolation (supported in Chrome 111+ and Safari 16.2):
              {' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {'background: linear-gradient(in oklch, #3B82F6, #F97316)'}
              </code>{' '}
              — the OKLCH color space interpolates through perceptually uniform
              hues, avoiding the gray dead zone entirely.
            </p>
          </section>

          {/* Gradient types */}
          <section
            aria-labelledby="gradient-types"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="gradient-types"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When to use linear, radial, and conic
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">linear-gradient</span>
                <span>
                  Color transitions along a straight line at any angle. Use for
                  hero backgrounds, button hover states, and directional highlights.
                  The angle{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">to bottom right</code>{' '}
                  is equivalent to{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">135deg</code>{' '}
                  — both are valid.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">radial-gradient</span>
                <span>
                  Color radiates outward from a center point. Use for spotlight
                  effects, circular element backgrounds, and vignette overlays on
                  images. Control shape with{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">circle</code>{' '}
                  or{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">ellipse</code>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">conic-gradient</span>
                <span>
                  Color sweeps around a center point like a clock face. Use for
                  pie charts, color wheels, and angular segment indicators. Often
                  combined with{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">border-radius: 50%</code>{' '}
                  to render a circle. Browser support is universal as of 2023.
                </span>
              </li>
            </ul>
          </section>

          {/* Performance note */}
          <section aria-labelledby="perf-note" className="space-y-4">
            <h2
              id="perf-note"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              CSS gradients vs. image backgrounds for performance
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              CSS gradients are rendered by the GPU on every paint. A simple two-stop
              linear gradient has essentially zero performance cost. A complex
              multi-stop radial gradient on a large element that repaints frequently
              (e.g., inside a scroll animation) can cause paint bottlenecks on
              low-end hardware. For static decorative backgrounds, CSS gradients
              are always faster than image files — no network request, no decode step,
              scalable at any resolution.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related CSS tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "CSS Box Shadow Generator", path: "/tools/box-shadow" },
                  { name: "Color Picker", path: "/tools/color-picker" },
                  { name: "Color Contrast Checker", path: "/tools/color-contrast-checker" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 3. css-minifier ──────────────────────────────────────────────────────────
replaceArticle('src/app/tools/css-minifier/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="CSS Minifier: What Gets Removed, What Stays, and How Much Size Reduction to Expect" />
          <meta
            itemProp="description"
            content="Concrete size reduction numbers from minifying production CSS, the specific transformations applied, and when to use a minifier vs. a bundler."
          />
          <meta itemProp="datePublished" content="2024-02-25" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Actual size reductions */}
          <section aria-labelledby="size-numbers" className="space-y-4">
            <h2
              id="size-numbers"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              How much CSS minification actually reduces file size
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Real-world CSS minification numbers depend heavily on how the original
              was written. Developer-formatted CSS with comments, blank lines, and
              long property names typically compresses 20–35%. A verbose CSS framework
              like a hand-written utility class file might compress 15–25%. Tailwind
              CSS output (which is already generated) typically compresses less because
              class names are short and there&apos;s little whitespace to remove. For
              comparison:{' '}
              <strong>Bootstrap 5.3 full CSS: 231 KB → 197 KB minified</strong>{' '}
              (15% reduction), but <strong>gzipped it drops to 26 KB</strong> —
              the takeaway: Gzip or Brotli compression on the server is worth far more
              than minification alone for large stylesheets.
            </p>
          </section>

          {/* What gets transformed */}
          <section
            aria-labelledby="transformations"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="transformations"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What the minifier actually does to your CSS
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Whitespace removal</span>
                <span>
                  All newlines, tabs, and multiple spaces are replaced with a single
                  space or removed entirely. Spaces inside selectors and around
                  combinators are removed where safe.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Comment stripping</span>
                <span>
                  All{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{'/* comments */'}</code>{' '}
                  are removed. Exception: license comments starting with{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">/*!</code>{' '}
                  are preserved by most minifiers to comply with open-source license
                  requirements.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Color shortening</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">#ffffff</code>{' '}
                  becomes{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">#fff</code>.{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">rgb(0, 0, 0)</code>{' '}
                  becomes{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">#000</code>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Zero value simplification</span>
                <span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">0px</code>,{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">0em</code>, and{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">0%</code>{' '}
                  all become{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">0</code>{' '}
                  — units on zero values are redundant in CSS.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Last semicolon removal</span>
                <span>
                  The final semicolon before a closing brace is optional in CSS.
                  Minifiers remove it. Safe in all browsers.
                </span>
              </li>
            </ul>
          </section>

          {/* When to use a bundler instead */}
          <section aria-labelledby="bundler-vs-minifier" className="space-y-4">
            <h2
              id="bundler-vs-minifier"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When to use a bundler instead
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              This tool is for one-off minification of a finished stylesheet — a vendor
              file you&apos;re shipping as-is, or a CSS snippet you&apos;re inlining in an email.
              For production builds in a Next.js, Vite, or webpack project, minification
              happens automatically as part of the build step. Running a stylesheet through
              this tool before committing it adds no value in those setups — the bundler
              will minify it anyway (and do more, like dead-code elimination via PurgeCSS
              or Tailwind&apos;s JIT tree-shaking).
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related developer tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "JS Minifier", path: "/tools/js-minifier" },
                  { name: "CSS Gradient Generator", path: "/tools/css-gradient" },
                  { name: "HTML Escape", path: "/tools/html-escape" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 4. image-resizer ─────────────────────────────────────────────────────────
replaceArticle('src/app/tools/image-resizer/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="Image Resizer: Common Dimensions for Web, Social, and Print" />
          <meta
            itemProp="description"
            content="A reference table for the image dimensions that actually matter, why upscaling degrades quality, and when browser-side resizing is enough vs. when to use a build pipeline."
          />
          <meta itemProp="datePublished" content="2024-02-15" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* Dimension reference */}
          <section aria-labelledby="dimension-ref" className="space-y-4">
            <h2
              id="dimension-ref"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Common image dimensions by use case
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Use case</th>
                    <th className="border border-border p-2 text-left font-semibold">Recommended size</th>
                    <th className="border border-border p-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Blog hero image', '1200×630 px', 'Also works as og:image for social sharing'],
                    ['Twitter/X post image', '1200×675 px (16:9)', 'summary_large_image card'],
                    ['LinkedIn post image', '1200×627 px', 'Appears as link preview thumbnail'],
                    ['Instagram square post', '1080×1080 px', 'Displayed at 510×510 in feed'],
                    ['Instagram story', '1080×1920 px (9:16)', 'Fills full screen vertically'],
                    ['Product thumbnail (e-commerce)', '800×800 px', 'Square, consistent grid appearance'],
                    ['Avatar / profile photo', '400×400 px', 'Downscaled to 40–80px on most UIs'],
                    ['Full-screen background', '1920×1080 px', 'HiDPI: 2560×1440 for retina'],
                  ].map(([useCase, size, notes]) => (
                    <tr key={useCase}>
                      <td className="border border-border p-2 text-muted-foreground">{useCase}</td>
                      <td className="border border-border p-2 font-medium text-foreground">{size}</td>
                      <td className="border border-border p-2 text-muted-foreground">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Upscaling quality note */}
          <section
            aria-labelledby="upscaling"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="upscaling"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Why upscaling always degrades quality
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Resizing a 400×400 image to 1200×1200 doesn&apos;t add detail — it interpolates
              pixels, producing a blurry result. This is a hard constraint of raster
              images: information destroyed during capture or prior downscaling cannot be
              recovered by resizing. The browser Canvas API uses bilinear interpolation
              by default, which produces smoother edges than nearest-neighbor but still
              blurs high-contrast detail.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For logos and icons that need to scale up cleanly, use SVG — a vector
              format that renders at any size without quality loss. This tool handles
              raster images (JPEG, PNG, WebP). If your source image looks blurry after
              upscaling, the only real fix is to obtain a higher-resolution source.
            </p>
          </section>

          {/* How it works */}
          <section aria-labelledby="how-it-works" className="space-y-4">
            <h2
              id="how-it-works"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Browser resizing vs. server-side pipeline
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              This tool resizes your image locally using an HTML Canvas element — no
              upload, no server, instant preview. It&apos;s the right choice for one-off
              resizing tasks. For a website that needs to serve responsive images at
              multiple breakpoints automatically, use a build pipeline: Next.js Image
              component,{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">sharp</code>{' '}
              in Node.js, or an image CDN (Cloudinary, Imgix). These generate all
              sizes at build/request time and serve the appropriate size via{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">srcset</code>{' '}
              — saving bandwidth and improving Core Web Vitals automatically.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related image tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "Image Compressor", path: "/tools/image-compressor" },
                  { name: "Image Converter", path: "/tools/image-converter" },
                  { name: "Favicon Generator", path: "/tools/favicon-generator" },
                ]}
              />
            </nav>
          </section>
        </article>`);

// ── 5. url-shortener ─────────────────────────────────────────────────────────
replaceArticle('src/app/tools/url-shortener/page.tsx', `<article
          className="space-y-12 max-w-4xl"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <meta itemProp="name" content="URL Shortener: What Short Links Actually Do to Your Traffic Data" />
          <meta
            itemProp="description"
            content="How URL shorteners work, what tracking data they collect, and the two cases where a short link is worth the referrer data loss."
          />
          <meta itemProp="datePublished" content="2024-04-05" />
          <meta itemProp="dateModified" content="2026-05-25" />
          <meta itemProp="author" content="Achraf A." />

          {/* What short links do to your analytics */}
          <section aria-labelledby="analytics-impact" className="space-y-4">
            <h2
              id="analytics-impact"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              What URL shorteners do to your analytics
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              When someone clicks a short link, the shortener server receives the request,
              logs it (URL, timestamp, approximate location, device type, referrer), then
              redirects to your destination. Your analytics tool sees the traffic as
              arriving from the shortener&apos;s domain — not from the original source (Twitter,
              email, a Slack message). This is the referrer problem: you lose source
              attribution unless you add UTM parameters to the destination URL before
              shortening it.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The practical rule:{' '}
              <strong>always append UTM parameters before shortening</strong>.
              Shorten{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {'https://example.com/post?utm_source=twitter&utm_medium=social&utm_campaign=launch'}
              </code>{' '}
              — not the bare URL. Your GA4 or Plausible dashboard will show the
              correct source even though the click went through a redirect.
            </p>
          </section>

          {/* When to use */}
          <section
            aria-labelledby="when-to-use"
            className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10"
          >
            <h2
              id="when-to-use"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              When a short link is worth the trade-off
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Print materials</span>
                <span>
                  A 200-character URL on a flyer is unusable. A short link is the only
                  practical option. Combine it with a QR code — most people who see
                  print media will scan rather than type anyway.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">SMS campaigns</span>
                <span>
                  SMS has a 160-character limit. Long URLs consume most of the message.
                  Shortening is necessary. Note that carriers increasingly block messages
                  containing bit.ly and other generic shorteners — branded short domains
                  (e.g., go.yourcompany.com) have higher deliverability.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-foreground">Character-limited social posts</span>
                <span>
                  Twitter/X counts short URLs as 23 characters regardless of the original
                  URL length — t.co wrapping happens automatically. For other platforms
                  (LinkedIn, Mastodon), shortening URLs in long-form posts is rarely
                  worth the analytics trade-off.
                </span>
              </li>
            </ul>
          </section>

          {/* Privacy note */}
          <section aria-labelledby="privacy-note" className="space-y-4">
            <h2
              id="privacy-note"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              The privacy and permanence trade-off
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Every click on a short link is visible to the shortener service —
              including clicks from people who have no idea they&apos;re being tracked.
              For personal or sensitive links, a direct URL is the more privacy-respecting
              choice. Also consider link permanence: several major URL shortening services
              have shut down (Google URL Shortener in 2019, Bitly once changed its free
              tier terms), making millions of short links dead overnight. For links that
              need to work indefinitely, use a custom domain you control — a CNAME
              redirect via your own domain is permanent and survives any third-party service change.
            </p>
          </section>

          {/* Related Tools */}
          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2
              id="related-tools-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related tools
            </h2>
            <nav aria-label="Related tools" className="flex flex-wrap gap-x-6 gap-y-3">
              <RelatedTools
                tools={[
                  { name: "QR Code Generator", path: "/tools/qr-code-generator" },
                  { name: "URL Encoder / Decoder", path: "/tools/url-encoder" },
                  { name: "Meta Tags Generator", path: "/tools/meta-tags" },
                ]}
              />
            </nav>
          </section>
        </article>`);

console.log('\nAll 5 pages updated.');

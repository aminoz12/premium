// Single source of truth for blog post metadata. Consumed by the blog index
// (src/app/blog/page.tsx) and the sitemap (src/app/sitemap.ts) so every post is
// guaranteed to be discoverable by crawlers. Add new posts at the top.

export type BlogPostMeta = {
  slug: string
  title: string
  summary: string
  date: string
  readTime: string
  tags: string[]
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "browser-seo-tools-guide",
    title: "Browser-Based SEO Tools: Complete Guide to Meta Tags, Robots.txt, Sitemap & More",
    summary:
      "Meta tag generators, robots.txt builders, XML sitemap creators, Open Graph validators, DNS lookup, and hashtag tools â€” all free, browser-based, no signup. Includes a complete step-by-step SEO workflow.",
    date: "2026-05-15",
    readTime: "14 min read",
    tags: ["SEO", "meta tags", "robots.txt", "sitemap", "DNS", "Open Graph", "free tools"],
  },
  {
    slug: "browser-text-tools-writers-guide",
    title: "Free Browser Text Tools for Writers â€” Word Counter, Case Converter, Lorem Ipsum & More",
    summary:
      "Complete guide to five free browser text tools for writers: word counter, case converter, lorem ipsum generator, bio generator, palindrome checker. No signup, runs in your browser, instant results.",
    date: "2026-04-20",
    readTime: "13 min read",
    tags: ["writing", "word counter", "lorem ipsum", "bio generator", "text tools", "free tools"],
  },
  {
    slug: "browser-developer-tools-guide",
    title: "The Complete Guide to Browser-Based Developer Tools (2026) â€” No Install, No Account",
    summary:
      "JSON formatters, JWT decoders, bcrypt generators, CSV converters and 30+ more free browser developer tools. When to use each, how they work, and how they protect your data.",
    date: "2026-06-14",
    readTime: "12 min read",
    tags: ["developer tools", "JSON", "JWT", "browser tools", "security", "free tools"],
  },
  {
    slug: "image-compression-quality-settings-guide",
    title: "Image Compression Quality Settings Guide â€” What Number to Use for Web, Email, Social",
    summary:
      "JPEG quality 75â€“82 reduces file size 60â€“80% with no visible quality loss. WebP saves 25â€“34% more. Real data from 60 images compressed across quality settings, formats, and use cases.",
    date: "2026-06-01",
    readTime: "7 min read",
    tags: ["image compression", "JPEG quality", "WebP", "web performance", "file size"],
  },
  {
    slug: "how-to-convert-m4a-to-mp3-free-no-upload",
    title: "How to Convert M4A to MP3 Free (iPhone Voice Memos, No Upload, 2026)",
    summary:
      "M4A is the default iPhone voice memo format but MP3 is what podcast hosts, transcription APIs, and non-Apple devices expect. Convert free in-browser â€” no upload, no server, no signup.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["audio", "M4A", "MP3", "iPhone", "voice memo", "free tools"],
  },
  {
    slug: "how-to-remove-background-from-product-photo-free",
    title: "How to Remove Background from Product Photo Free (No Photoshop, 2026)",
    summary:
      "Color keying vs AI segmentation â€” which method to use for Shopify, Etsy, and Amazon product photos. Platform requirements, Canva workflow for Amazon pure-white, and a green screen tip.",
    date: "2026-06-03",
    readTime: "6 min read",
    tags: ["image editing", "e-commerce", "product photos", "background remover", "free tools"],
  },
  {
    slug: "qr-code-size-error-correction-scan-rate",
    title: "QR Code Size, Error Correction & Scan Rate: What the Specs Don't Tell You",
    summary:
      "40 QR codes tested across sizes, error correction levels (L/M/Q/H), and color combos â€” scan rates on iPhone, Samsung, and Pixel under 3 lighting conditions. Minimum print sizes for every use case.",
    date: "2026-06-04",
    readTime: "8 min read",
    tags: ["QR code", "developer", "print", "design", "free tools"],
  },
  {
    slug: "best-free-ai-story-generators-no-signup-2026",
    title: "Best Free AI Story Generators 2026 â€” Romance, Novel, No Signup",
    summary:
      "Tested: which AI story and novel generators actually work free without an account in 2026 â€” romance, fantasy, sci-fi. Includes a prompting formula for better output and genre-specific tips.",
    date: "2026-06-05",
    readTime: "7 min read",
    tags: ["AI writing", "story generator", "novel generator", "creative writing", "free tools"],
  },
  {
    slug: "how-to-convert-text-to-word-ai-free",
    title: "How to Convert Text to Word Document Free (AI, No Signup, 2026)",
    summary:
      "Convert plain text or AI-generated Markdown to a formatted .docx file free online â€” headings, bold, italic, lists preserved. No signup, no watermark, opens in Word/Google Docs/LibreOffice.",
    date: "2026-06-06",
    readTime: "6 min read",
    tags: ["text to Word", "docx converter", "AI writing", "document", "free tools"],
  },
  {
    slug: "how-to-create-er-diagram-online-free",
    title: "How to Create an ER Diagram Free Online (No Download, No Signup)",
    summary:
      "erDiagram syntax, crow's foot cardinality notation, PK/FK attributes, junction tables, and a complete e-commerce database example â€” draw ER diagrams in your browser for free.",
    date: "2026-06-07",
    readTime: "7 min read",
    tags: ["ER diagram", "database design", "UML", "developer", "free tools"],
  },
  {
    slug: "how-to-check-internal-links-free",
    title: "How to Check Internal Links Free (Find Broken Links & Orphan Pages)",
    summary:
      "GSC, Screaming Frog, browser DevTools, and a sitemap cross-check â€” four free methods to find broken internal links and orphan pages that are silently draining PageRank.",
    date: "2026-06-08",
    readTime: "7 min read",
    tags: ["SEO", "internal links", "technical SEO", "free tools"],
  },
  {
    slug: "how-to-analyze-website-free-online",
    title: "How to Analyze a Website Free Online (SEO, Speed, DNS, SSL)",
    summary:
      "A four-layer website audit using only free browser-based tools: DNS records, SSL certificate, meta tags, canonical, sitemap, content depth, and Core Web Vitals â€” no account required.",
    date: "2026-06-09",
    readTime: "7 min read",
    tags: ["SEO", "web analyzer", "technical SEO", "free tools", "DNS"],
  },
  {
    slug: "how-to-create-class-diagram-online-free",
    title: "How to Create a Class Diagram Online Free (No Download, No Signup)",
    summary:
      "Draw a UML class diagram in your browser â€” classes, attributes, methods, visibility modifiers, and relationships (inheritance, composition, aggregation) explained with a worked example.",
    date: "2026-06-10",
    readTime: "8 min read",
    tags: ["UML", "class diagram", "developer", "diagrams", "free tools"],
  },
  {
    slug: "best-free-paraphrasing-tools-no-signup-2026",
    title: "Best Free Paraphrasing Tools 2026 â€” No Signup, No Watermark",
    summary:
      "QuillBot, Scribbr, Wordtune, and Spinbot tested and compared against a no-signup alternative. Word limits, output quality, and mode counts on each free tier.",
    date: "2026-06-11",
    readTime: "6 min read",
    tags: ["paraphrasing", "AI writing", "free tools", "no signup"],
  },
  {
    slug: "best-free-seo-tools-no-signup-2026",
    title: "Best Free SEO Tools 2026 (No Signup, No Account Required)",
    summary:
      "Meta tag generators, DNS lookup, sitemap creators, SSL checkers, and word counters â€” the free SEO tools that work on the first visit without creating an account.",
    date: "2026-06-12",
    readTime: "7 min read",
    tags: ["SEO", "free tools", "no signup", "technical SEO"],
  },
  {
    slug: "how-to-center-a-div-css",
    title: "How to Center a Div in CSS (Every Method, 2026)",
    summary:
      "Flexbox, Grid, absolute positioning, and margin: auto â€” every way to center a div in CSS, with the modern approach you should use for each situation.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["CSS", "frontend", "layout", "flexbox"],
  },
  {
    slug: "javascript-array-methods-cheat-sheet",
    title: "JavaScript Array Methods Cheat Sheet: map, filter, reduce and the Rest",
    summary:
      "The JavaScript array methods you use every day â€” map, filter, reduce, find, some, every, flat, flatMap â€” explained with real examples.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["JavaScript", "developer", "arrays", "cheat sheet"],
  },
  {
    slug: "how-to-convert-csv-to-json",
    title: "How to Convert CSV to JSON Free Online (With Real Examples)",
    summary:
      "CSV exports from Excel and Sheets become JSON arrays for APIs and JavaScript apps. How quoted fields work, handling semicolons, type coercion, and a free in-browser converter.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["developer", "CSV", "JSON", "data"],
  },
  {
    slug: "http-status-codes-explained",
    title: "HTTP Status Codes Explained: 200, 301, 404, 500 and the Rest",
    summary:
      "The five code families, why 301 vs 302 matters for SEO, when 410 beats 404, and the 4xx codes every developer encounters in API debugging.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["developer", "HTTP", "APIs", "SEO"],
  },
  {
    slug: "how-to-make-website-sitemap",
    title: "How to Make a Website Sitemap (XML and HTML) â€” Free Generator",
    summary:
      "What a sitemap is, when Google actually needs one, how to generate XML sitemaps free in 5 minutes, and how to submit to Google Search Console.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["SEO", "sitemaps", "Google"],
  },
  {
    slug: "mysql-vs-postgresql-which-to-use",
    title: "MySQL vs PostgreSQL: Which Database Should You Use in 2026?",
    summary:
      "MySQL is ubiquitous; PostgreSQL is increasingly the developer default for new projects. An honest comparison of JSON support, advanced types, standards compliance, and ecosystem.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["databases", "MySQL", "PostgreSQL", "SQL"],
  },
  {
    slug: "svg-file-format-explained",
    title: "SVG File Format Explained: When to Use Vector Over Raster",
    summary:
      "SVG is pure XML â€” it scales infinitely, can be styled with CSS, and is always smaller than PNG for logos and icons. Here's when vector beats raster and how to use it in web development.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["images", "SVG", "web development", "design"],
  },
  {
    slug: "what-is-yaml-and-how-to-use-it",
    title: "What Is YAML and How Do You Use It? A Practical Guide",
    summary:
      "YAML powers Docker Compose, GitHub Actions, and Kubernetes. Here's the syntax â€” lists, objects, multi-line strings, and the common pitfalls (tabs will break everything).",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["developer", "YAML", "DevOps", "configuration"],
  },
  {
    slug: "css-units-explained-px-em-rem",
    title: "CSS Units Explained: px, em, rem, vh, vw â€” When to Use Each",
    summary:
      "Mixing px, em, rem, and viewport units wrong breaks responsive layouts and ignores user accessibility settings. The practical decision guide with real examples.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["CSS", "responsive design", "accessibility"],
  },
  {
    slug: "how-to-validate-email-address-online",
    title: "How to Validate an Email Address: What Actually Matters",
    summary:
      "RFC 5322 allows email addresses most regex patterns reject. The practical approach â€” what to check, what to accept, why perfect validation is a myth, and the only real method: send a confirmation.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["developer", "email", "regex"],
  },
  {
    slug: "wordpress-vs-wix-comparison",
    title: "WordPress vs Wix: Which Is Better for Your Site in 2026?",
    summary:
      "WordPress gives you full ownership and unlimited flexibility. Wix trades that for simplicity and zero maintenance. An honest comparison with real pricing and who each is right for.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["WordPress", "Wix", "website builders"],
  },
  {
    slug: "json-vs-xml-when-to-use",
    title: "JSON vs XML: When to Use Each (With Real Examples)",
    summary:
      "JSON won the API wars but XML is still the right choice for documents, SOAP services, and Office formats. A practical comparison with real code examples.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["developer", "JSON", "XML", "APIs"],
  },
  {
    slug: "css-color-codes-explained",
    title: "CSS Color Codes Explained: HEX, RGB, HSL, and When to Use Each",
    summary:
      "CSS has four ways to write the same color. HEX for design handoffs, RGBA for transparency, HSL for programmatic palette generation â€” when to use which.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["CSS", "design", "color"],
  },
  {
    slug: "how-to-read-jwt-token",
    title: "How to Read a JWT Token: Decoding the Header, Payload, and Signature",
    summary:
      "JWT tokens appear in every modern API. Here's what the three parts contain, what the standard claims mean, and how to decode them in a browser console or online tool.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["developer", "JWT", "authentication", "API"],
  },
  {
    slug: "regex-cheat-sheet-beginners",
    title: "Regex Cheat Sheet for Beginners: The Patterns You'll Actually Use",
    summary:
      "90% of regex use cases are covered by the same 20 patterns. Character classes, quantifiers, anchors, groups â€” the practical subset with real examples and a live tester.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["developer", "regex", "programming"],
  },
  {
    slug: "what-is-a-url-shortener-how-it-works",
    title: "What Is a URL Shortener and How Does It Work?",
    summary:
      "How URL shorteners redirect traffic, what tracking data they collect on every click, when to use one, and when a short link is a security risk.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["tools", "URLs", "tracking"],
  },
  {
    slug: "what-is-a-qr-code-how-it-works",
    title: "What Is a QR Code and How Does It Work? (The Non-Technical Explanation)",
    summary:
      "QR codes are everywhere â€” but how do they actually store information? Why are there three corner squares? And why can they still scan when damaged? Explained clearly.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["QR codes", "explainer", "technology"],
  },
  {
    slug: "how-to-format-sql-queries",
    title: "How to Format SQL Queries: Style Rules That Actually Matter",
    summary:
      "Unformatted SQL hides logic bugs that are visible once formatted. The capitalization, indentation, JOIN alignment, and WHERE clause rules that make queries readable.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["SQL", "developer", "databases"],
  },
  {
    slug: "how-to-remove-background-from-image-free",
    title: "How to Remove Background from an Image Free (No App, No Account)",
    summary:
      "AI background removal takes seconds and is completely free in your browser. The method, tips for getting cleaner results on tricky subjects, and what to use the result for.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["images", "AI", "e-commerce"],
  },
  {
    slug: "unix-timestamp-to-date-guide",
    title: "Unix Timestamp to Date: What Unix Time Is and How to Convert It",
    summary:
      "Unix timestamps are everywhere in APIs, logs, and databases â€” they're just a count of seconds since January 1, 1970. Here's everything you need to understand and convert them.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["developer", "time", "API"],
  },
  {
    slug: "html-entity-encoder-explained",
    title: "HTML Entity Encoder: What HTML Entities Are and When to Use Them",
    summary:
      "&lt; looks like nonsense but it's how you display < in HTML without breaking markup. The complete guide to HTML entities and XSS prevention.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["HTML", "security", "developer"],
  },
  {
    slug: "binary-to-text-conversion-guide",
    title: "Binary to Text Conversion: How Computers Encode Characters",
    summary:
      "Every character you type is stored as a number, which is stored as binary. Here's how that works â€” from ASCII to Unicode â€” with a free converter.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["developer", "encoding", "binary"],
  },
  {
    slug: "roman-numeral-converter-explained",
    title: "Roman Numeral Converter: How Roman Numerals Work and Where They're Used",
    summary:
      "Roman numerals appear on clock faces, Super Bowl titles, and copyright dates. Here's the complete system â€” rules, common values, and a free converter.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["tools", "reference", "history"],
  },
  {
    slug: "diff-checker-for-code-reviews",
    title: "Diff Checker for Code Reviews: How to Compare Text and Code Changes",
    summary:
      "Diff tools show exactly what changed between two versions of text or code. How they work, how to read unified diff output, and when a browser-based diff checker is right.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["developer", "code-review", "tools"],
  },
  {
    slug: "how-to-minify-css-javascript",
    title: "How to Minify CSS and JavaScript: What It Does and When You Need It",
    summary:
      "Minification removes whitespace and comments from code. Here's what actually changes, how much it saves, and whether you need a build tool or online minifier.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["CSS", "JavaScript", "performance"],
  },
  {
    slug: "css-gradient-generator-how-to-use",
    title: "CSS Gradient Generator: How to Create Linear, Radial, and Conic Gradients",
    summary:
      "CSS gradients are pure CSS â€” no images needed. How the three types work, how to write the syntax, and how to generate gradient code visually for free.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["CSS", "design", "gradients"],
  },
  {
    slug: "md5-sha256-hash-explained",
    title: "MD5 vs SHA-256: Hash Functions Explained (And When Not to Use MD5)",
    summary:
      "Both produce a fixed-length fingerprint of any input. One is cryptographically broken. What hashing is, how they differ, and which to use for security.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["security", "cryptography", "developer"],
  },
  {
    slug: "url-encode-decode-explained",
    title: "URL Encoding and Decoding Explained (With Examples)",
    summary:
      "Why spaces become %20, why & breaks query strings, and when to use encodeURIComponent vs encodeURI. URL encoding explained with real JavaScript examples.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["developer", "web", "URLs"],
  },
  {
    slug: "free-lorem-ipsum-generator-uses",
    title: "Lorem Ipsum Generator: What It's For and When Not to Use It",
    summary:
      "Lorem Ipsum has been the standard placeholder text for 500+ years â€” but using it at the wrong design stage is a common mistake. When it helps and when it hurts.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["design", "UX", "tools"],
  },
  {
    slug: "how-to-check-password-strength",
    title: "How to Check Password Strength: What the Meters Actually Measure",
    summary:
      "Password strength meters measure different things â€” entropy, pattern matching, and dictionary checks. What they mean and what actually makes a password strong.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["security", "passwords"],
  },
  {
    slug: "base64-decode-encode-what-it-is",
    title: "Base64 Encode and Decode: What It Is and When You Actually Use It",
    summary:
      "Base64 is not encryption. It's a way to represent binary data as plain text â€” and understanding when to use it saves you debugging time. Real use cases in APIs and web dev.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["developer", "encoding", "API"],
  },
  {
    slug: "how-to-count-words-in-google-docs",
    title: "How to Count Words in Google Docs (All Methods)",
    summary:
      "The keyboard shortcut, the live toolbar display, character counts, and how to get reading time and sentence count that Google Docs doesn't show you.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["productivity", "writing", "tools"],
  },
  {
    slug: "convert-heic-to-jpg-on-windows",
    title: "How to Convert HEIC to JPG on Windows (Free, 3 Methods)",
    summary:
      "Windows can't open HEIC files without a codec. Three completely free methods compared â€” online converter, Microsoft Store codec, and IrfanView for batch conversion.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["images", "HEIC", "Windows"],
  },
  {
    slug: "how-to-resize-image-for-instagram",
    title: "How to Resize an Image for Instagram (All Formats, 2026)",
    summary:
      "Exact Instagram image dimensions for feed posts, Stories, and Reels. Why portrait (4:5) gets the most engagement, and how to resize free without an app.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["social media", "Instagram", "images"],
  },
  {
    slug: "free-background-remover-for-product-photos",
    title: "Free Background Remover for Product Photos: A Practical Guide",
    summary:
      "AI background removal has gotten remarkably good. What types of products work cleanly, where you'll need manual touch-up, and how to use it free for e-commerce.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["e-commerce", "images", "AI"],
  },
  {
    slug: "how-to-generate-qr-code-restaurant-menu",
    title: "How to Generate a QR Code for a Restaurant Menu (Free, No Subscription)",
    summary:
      "Many QR code services threaten to deactivate your codes if you stop paying. Here's how to create a permanent, free QR code for your restaurant menu that never expires.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["QR codes", "restaurant", "small business"],
  },
  {
    slug: "how-to-compress-pdf-without-losing-quality",
    title: "How to Compress a PDF Without Losing Quality (Free Methods)",
    summary:
      "A 40MB PDF from a design tool becomes 2MB with the right compression. What controls PDF file size and the free methods that preserve text clarity while cutting bloat.",
    date: "2026-06-02",
    readTime: "8 min read",
    tags: ["PDF", "compression", "tools"],
  },
  {
    slug: "best-free-image-compressor-for-wordpress",
    title: "Best Free Image Compressor for WordPress (2026): Real Results",
    summary:
      "WordPress image bloat is a top reason sites fail Core Web Vitals. How to compress images before upload â€” free, no plugin required â€” with the settings that actually work.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["WordPress", "images", "SEO", "performance"],
  },
  {
    slug: "hex-to-rgb-rgb-to-hex-color-converter",
    title: "Hex to RGB and RGB to Hex: The Color Conversion Guide (With Calculator)",
    summary:
      "CSS uses both hex (#ff6600) and RGB (255, 102, 0) for the same colors. Here's how to convert between them mentally, with a formula, and with a free tool that also outputs HSL.",
    date: "2026-06-02",
    readTime: "4 min read",
    tags: ["CSS", "design", "color"],
  },
  {
    slug: "how-to-convert-pdf-to-jpg-free",
    title: "How to Convert PDF to JPG for Free (Every Page as a Separate Image)",
    summary:
      "Converting a PDF to images is useful for thumbnails, presentations, and email attachments. Here's how to extract every page as a JPG â€” free, in your browser, no account.",
    date: "2026-06-02",
    readTime: "4 min read",
    tags: ["PDF", "images", "conversion"],
  },
  {
    slug: "css-flexbox-vs-grid-which-to-use",
    title: "CSS Flexbox vs Grid: Which One to Use and When",
    summary:
      "Flexbox and Grid both handle layout, but they solve different problems. Here's the decision rule that ends the confusion â€” with the one case where you genuinely need both.",
    date: "2026-06-01",
    readTime: "6 min read",
    tags: ["CSS", "frontend", "developer tools"],
  },
  {
    slug: "how-to-generate-css-gradient-free",
    title: "How to Generate a CSS Gradient for Free (Linear, Radial, and Conic)",
    summary:
      "CSS gradients look complex in code but follow a simple pattern. Here's how to create any gradient type with the right syntax â€” and the free visual generator that outputs ready-to-paste CSS.",
    date: "2026-06-01",
    readTime: "5 min read",
    tags: ["CSS", "design", "developer tools"],
  },
  {
    slug: "how-to-scan-qr-code-from-image-online",
    title: "How to Read a QR Code from an Image or Screenshot (No Phone Needed)",
    summary:
      "If you have a QR code as an image or screenshot, you can decode it directly in your browser â€” no need to print it and scan with a phone. Here's how in under 10 seconds.",
    date: "2026-05-26",
    readTime: "3 min read",
    tags: ["QR codes", "tools", "productivity"],
  },
  {
    slug: "how-to-check-color-contrast-accessibility-wcag",
    title: "How to Check Color Contrast for Accessibility (WCAG AA and AAA Guide)",
    summary:
      "Poor color contrast is the most common accessibility failure on the web. Here's what the WCAG ratios actually mean in practice, and how to check any color pair free in your browser.",
    date: "2026-05-25",
    readTime: "5 min read",
    tags: ["accessibility", "design", "CSS"],
  },
  {
    slug: "tailwind-css-vs-bootstrap-which-to-use",
    title: "Tailwind CSS vs Bootstrap: Which Should You Use in 2026?",
    summary:
      "Bootstrap dominated the 2010s. Tailwind dominates now. Here's the real difference in philosophy, when each is the right choice, and why the answer depends on your team size.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["CSS", "frontend", "developer tools"],
  },
  {
    slug: "how-to-optimize-meta-tags-for-seo",
    title: "How to Optimize Meta Tags for SEO (Title, Description, and What Actually Matters)",
    summary:
      "Meta tags still matter in 2026 â€” but not all of them. Here's which tags Google actually uses, the exact character limits that prevent truncation, and the free tool to preview before publishing.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["SEO", "meta tags", "developer tools"],
  },
  {
    slug: "what-is-encoding-vs-encryption-vs-hashing",
    title: "Encoding vs Encryption vs Hashing: What's the Difference?",
    summary:
      "Developers mix these up constantly â€” and using the wrong one is a security vulnerability. Here's the exact difference with real examples and when to use each.",
    date: "2026-06-01",
    readTime: "6 min read",
    tags: ["security", "encoding", "cryptography"],
  },
  {
    slug: "how-to-write-markdown-guide",
    title: "How to Write Markdown: A Practical Guide (With Cheat Sheet)",
    summary:
      "Markdown powers GitHub READMEs, documentation, and most blogging platforms. Here's every syntax you actually need â€” and the formatting choices that break rendering in unexpected places.",
    date: "2026-06-01",
    readTime: "6 min read",
    tags: ["markdown", "writing", "developer tools"],
  },
  {
    slug: "how-to-check-if-website-is-down",
    title: "How to Check if a Website Is Down for Everyone or Just You",
    summary:
      "When a site won't load, the first question is whether it's down everywhere or just for you. Here's how to diagnose in 60 seconds â€” and what the different failure modes mean.",
    date: "2026-05-23",
    readTime: "5 min read",
    tags: ["networking", "developer tools", "debugging"],
  },
  {
    slug: "how-to-create-seo-meta-tags-free",
    title: "How to Create SEO Meta Tags for Free (With Preview of How Google Shows Them)",
    summary:
      "Writing meta tags without seeing how they'll look in search results is guesswork. Here's the format, the limits, and how to preview exactly what Google will show before you publish.",
    date: "2026-05-30",
    readTime: "5 min read",
    tags: ["SEO", "meta tags", "content"],
  },
  {
    slug: "how-to-use-regex-practical-guide",
    title: "How to Use Regex: A Practical Guide for the Patterns You Actually Need",
    summary:
      "Regex looks like noise until you know 10 patterns. Here are the ones that cover 90% of real-world use: email validation, URL matching, phone numbers, and finding things inside strings.",
    date: "2026-05-14",
    readTime: "8 min read",
    tags: ["developer tools", "regex", "programming"],
  },
  {
    slug: "difference-between-utf8-ascii-unicode",
    title: "UTF-8, ASCII, Unicode: What's the Difference and Why Does It Matter?",
    summary:
      "Encoding errors â€” the mysterious box characters, question marks, and mojibake â€” almost always come from a mismatch between these three. Here's the plain-English explanation with real examples.",
    date: "2026-05-29",
    readTime: "7 min read",
    tags: ["encoding", "developer tools", "internationalization"],
  },
  {
    slug: "what-is-my-ip-address-how-to-find",
    title: "What Is My IP Address and What Does It Reveal About Me?",
    summary:
      "Your IP address reveals your approximate city, your ISP, and whether you are behind a VPN. Here's what it does and doesn't expose â€” and how to find it in one click.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["networking", "privacy", "developer tools"],
  },
  {
    slug: "how-to-convert-word-to-pdf-free",
    title: "How to Convert Word to PDF for Free (Without Microsoft Office)",
    summary:
      "You don't need Microsoft Office or Adobe to convert a .docx to PDF. Here's how to do it free in under 30 seconds â€” and the one formatting quirk that always needs a manual fix.",
    date: "2026-06-02",
    readTime: "4 min read",
    tags: ["PDF", "Word", "file tools"],
  },
  {
    slug: "how-to-create-favicon-free",
    title: "How to Create a Favicon for Your Website for Free (16Ã—16 to 512Ã—512)",
    summary:
      "A favicon is the small icon in the browser tab â€” and most websites get it wrong by using the wrong size or wrong format. Here's how to generate one correctly for all devices.",
    date: "2026-06-01",
    readTime: "5 min read",
    tags: ["web design", "favicon", "developer tools"],
  },
  {
    slug: "heic-to-jpg-convert-free",
    title: "How to Convert HEIC to JPG for Free (iPhone Photos on Windows and Web)",
    summary:
      "iPhone photos save as HEIC by default, which Windows, many websites, and most apps don't support. Here's how to convert HEIC to JPG in seconds â€” free, no app download required.",
    date: "2026-06-01",
    readTime: "4 min read",
    tags: ["images", "iPhone", "conversion"],
  },
  {
    slug: "how-to-test-typing-speed-online",
    title: "How to Test Your Typing Speed Online â€” and What WPM Actually Means",
    summary:
      "Typing speed tests give you a WPM score but don't tell you what to do with it. Here's what a good WPM is for different jobs, how accuracy matters more than speed, and the fastest way to improve.",
    date: "2026-05-21",
    readTime: "5 min read",
    tags: ["productivity", "typing", "tools"],
  },
  {
    slug: "what-is-lorem-ipsum-and-why-it-exists",
    title: "What Is Lorem Ipsum and Why Do Designers Use It?",
    summary:
      "Lorem ipsum has been in design mockups since the 1960s â€” but it's not random gibberish. It's derived from Cicero's De Finibus, scrambled. Here's the history and when to use real content instead.",
    date: "2026-05-12",
    readTime: "4 min read",
    tags: ["design", "typography", "developer tools"],
  },
  {
    slug: "how-to-check-dns-records-free",
    title: "How to Check DNS Records Online for Free (A, CNAME, MX, TXT Explained)",
    summary:
      "DNS records control where your domain points, your email delivery, and domain verification. Here's how to look up any record type and what each one does.",
    date: "2026-05-09",
    readTime: "6 min read",
    tags: ["networking", "DNS", "developer tools"],
  },
  {
    slug: "what-is-a-hash-function-explained",
    title: "What Is a Hash Function? A Plain-English Explanation With Real Examples",
    summary:
      "Hash functions turn any data into a fixed-length string. They power passwords, file integrity, blockchain, and Git commits. Here's how they work without the math.",
    date: "2026-05-04",
    readTime: "6 min read",
    tags: ["security", "cryptography", "developer tools"],
  },
  {
    slug: "how-to-generate-sitemap-xml-free",
    title: "How to Generate a Sitemap.xml for Free (And How to Submit It to Google)",
    summary:
      "A sitemap tells Google which pages exist on your site and how often they change. Here's how to generate one free, what to include, and how to submit it in Google Search Console.",
    date: "2026-05-02",
    readTime: "6 min read",
    tags: ["SEO", "Google", "developer tools"],
  },
  {
    slug: "how-to-convert-audio-free-online",
    title: "How to Convert Audio Files Online for Free (MP3, WAV, M4A, OGG)",
    summary:
      "Different platforms require different audio formats. Here's how to convert between MP3, WAV, M4A, OGG, and more in your browser â€” no download, no account.",
    date: "2026-05-28",
    readTime: "5 min read",
    tags: ["audio", "conversion", "free tools"],
  },
  {
    slug: "how-to-check-robots-txt",
    title: "How to Check and Generate a Robots.txt File (And What the Rules Mean)",
    summary:
      "Robots.txt tells search engine crawlers which pages to index. A misconfigured file can block Google from your entire site. Here's how to check, read, and fix one.",
    date: "2026-04-27",
    readTime: "6 min read",
    tags: ["SEO", "robots.txt", "developer tools"],
  },
  {
    slug: "how-to-encode-decode-url-free",
    title: "How to Encode and Decode URLs Online for Free (And Why It Matters)",
    summary:
      "URL encoding converts special characters to a safe format for transmission. Decoding reverses it. Here's when encoding is necessary, what %20 means, and the free tool to do both.",
    date: "2026-05-27",
    readTime: "5 min read",
    tags: ["developer tools", "URLs", "encoding"],
  },
  {
    slug: "how-to-humanize-ai-text-free",
    title: "How to Humanize AI Text for Free (So It Passes Detectors and Reads Naturally)",
    summary:
      "AI-generated text has statistical fingerprints that detectors catch. Here's what those fingerprints are, the editing techniques that remove them, and the free tool that does it automatically.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["AI tools", "writing", "AI detection"],
  },
  {
    slug: "how-to-format-json-online",
    title: "How to Format and Validate JSON Online (And Fix the Most Common Errors)",
    summary:
      "Malformed JSON is one of the most common API debugging frustrations. Here's how to format, validate, and fix JSON in seconds â€” and the three errors that account for 80% of JSON parse failures.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["developer tools", "JSON", "API debugging"],
  },
  {
    slug: "how-to-convert-image-formats-online",
    title: "How to Convert Image Formats Online for Free (JPG, PNG, WebP, AVIF)",
    summary:
      "Different platforms require different image formats. Here's the fastest way to convert between any image format in your browser â€” no upload, no account, and the format guide for when to use each.",
    date: "2026-06-01",
    readTime: "5 min read",
    tags: ["images", "conversion", "web performance"],
  },
  {
    slug: "how-to-minify-css-and-js-free",
    title: "How to Minify CSS and JavaScript for Free (And How Much It Actually Helps)",
    summary:
      "Minification removes whitespace and comments from CSS and JS files, reducing their size by 20â€“40%. Here's how to do it in seconds and whether it matters for your specific site.",
    date: "2026-06-01",
    readTime: "5 min read",
    tags: ["developer tools", "performance", "CSS"],
  },
  {
    slug: "how-to-generate-uuid-free",
    title: "How to Generate a UUID Online for Free (v4, v1, and What the Difference Is)",
    summary:
      "UUIDs look similar but v4 and v1 are generated completely differently, with different privacy implications. Here's what the versions mean, when each is appropriate, and how to generate them free.",
    date: "2026-05-19",
    readTime: "5 min read",
    tags: ["developer tools", "databases", "security"],
  },
  {
    slug: "how-to-detect-ai-generated-text",
    title: "How to Detect AI-Generated Text in 2026 (And Why It's Getting Harder)",
    summary:
      "AI detectors are useful but not infallible. Here's how they work, what the scores actually mean, the cases where every detector fails, and the free tool I use first.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["AI detection", "AI tools", "writing"],
  },
  {
    slug: "how-to-make-qr-code-free",
    title: "How to Make a QR Code for Free (That Never Expires)",
    summary:
      "Most QR code services lock you into a subscription to keep codes active. Here's how to generate a permanent QR code free â€” with the size and error correction settings that actually scan reliably.",
    date: "2026-06-02",
    readTime: "5 min read",
    tags: ["QR codes", "free tools", "business"],
  },
  {
    slug: "how-to-resize-image-free-online",
    title: "How to Resize an Image Online for Free (Without Losing Quality)",
    summary:
      "Resizing an image sounds trivial but most tools do it wrong â€” they scale down with the wrong algorithm and introduce blur. Here's the right way, the best free tools, and when to resize vs. crop.",
    date: "2026-06-01",
    readTime: "5 min read",
    tags: ["images", "web tools", "design"],
  },
  {
    slug: "webp-to-jpg-convert-free",
    title: "How to Convert WebP to JPG (and Back) for Free in Your Browser",
    summary:
      "WebP is everywhere now but not everything accepts it â€” email clients, older apps, and some social platforms reject WebP files. Here's how to convert in seconds with no account.",
    date: "2026-06-01",
    readTime: "4 min read",
    tags: ["images", "WebP", "conversion"],
  },
  {
    slug: "how-to-generate-strong-password",
    title: "How to Generate a Strong Password (And Why Your Current Method Might Be Wrong)",
    summary:
      "Most people think a strong password looks like xK9#mQ2!. Research shows a password like correct-horse-battery-staple is stronger and more memorable. Here's the math behind it.",
    date: "2026-05-31",
    readTime: "6 min read",
    tags: ["security", "passwords", "best practices"],
  },
  {
    slug: "convert-image-to-pdf-free",
    title: "How to Convert an Image to PDF for Free (JPG, PNG, WebP)",
    summary:
      "Need to send a photo as a PDF? Here's how to convert any image to PDF in under 30 seconds, free, with no account â€” and the settings that control page size and margins.",
    date: "2026-05-07",
    readTime: "4 min read",
    tags: ["PDF", "images", "conversion"],
  },
  {
    slug: "how-to-check-ssl-certificate",
    title: "How to Check If a Website's SSL Certificate Is Valid (And What to Look For)",
    summary:
      "A padlock icon doesn't mean a site is safe â€” it only means the connection is encrypted. Here's how to check an SSL certificate properly, what the fields mean, and the expiry check most developers forget.",
    date: "2026-04-30",
    readTime: "6 min read",
    tags: ["security", "SSL", "developer tools"],
  },
  {
    slug: "how-to-convert-csv-to-json-free",
    title: "How to Convert CSV to JSON Online for Free (With Nested Objects)",
    summary:
      "Converting a flat CSV to JSON is trivial. Converting one with nested objects, arrays, or type inference is where most converters fail. Here's how to do it correctly.",
    date: "2026-04-29",
    readTime: "5 min read",
    tags: ["developer tools", "CSV", "JSON"],
  },
  {
    slug: "what-is-bcrypt-how-it-works",
    title: "What Is Bcrypt and How Does It Work? (A Plain-English Explanation)",
    summary:
      "Bcrypt shows up in every authentication system, but the documentation assumes you already know why slow hashing matters. Here's how it works, what the cost factor does, and why SHA-256 is the wrong choice for passwords.",
    date: "2026-04-26",
    readTime: "8 min read",
    tags: ["security", "authentication", "developer tools"],
  },
  {
    slug: "word-count-for-seo-does-length-matter",
    title: "Word Count and SEO: Does Article Length Actually Matter in 2026?",
    summary:
      "The '2,000+ words ranks better' rule is outdated and often wrong. Here's what Google actually rewards, the correlation vs. causation problem with long-form content, and when shorter is better.",
    date: "2026-05-27",
    readTime: "7 min read",
    tags: ["SEO", "writing", "content strategy"],
  },
  {
    slug: "convert-pdf-to-word-free-online",
    title: "How to Convert PDF to Word Online for Free (Without Adobe Acrobat)",
    summary:
      "Adobe Acrobat charges $23/month for PDF-to-Word conversion. Here's how to do it free in under 60 seconds â€” the format that survives the conversion, the one that doesn't, and the quick fix when tables break.",
    date: "2026-06-02",
    readTime: "6 min read",
    tags: ["PDF", "Word", "file tools"],
  },
  {
    slug: "free-ai-image-generator-no-signup-2026",
    title: "Free AI Image Generator in 2026: What Actually Works Without Signing Up",
    summary:
      "I tested 8 free AI image generators to find which ones actually work without an account, produce usable images, and don't watermark or throttle you after 3 prompts. Here's what I found.",
    date: "2026-06-02",
    readTime: "8 min read",
    tags: ["AI tools", "image generation", "free tools"],
  },
  {
    slug: "compress-pdf-free-reduce-file-size",
    title: "How to Compress a PDF for Free Without Losing Quality",
    summary:
      "A 50 MB PDF can usually be compressed to under 5 MB without any visible quality loss. Here's why PDF files get bloated, the two settings that matter most, and the fastest way to compress without uploading to a server.",
    date: "2026-06-01",
    readTime: "7 min read",
    tags: ["PDF", "compression", "file tools"],
  },
  {
    slug: "remove-background-free-no-photoshop",
    title: "How to Remove a Background from an Image Without Photoshop (Free, In-Browser)",
    summary:
      "Photoshop charges $23/month for a task that now takes 5 seconds in a browser. Here's how to remove any background for free â€” the cases where auto-removal works perfectly, the cases where it struggles, and the quick manual fix.",
    date: "2026-05-18",
    readTime: "6 min read",
    tags: ["images", "background removal", "free tools"],
  },
  {
    slug: "png-vs-jpg-which-format-to-use",
    title: "PNG vs JPG: Which Image Format Should You Use and When?",
    summary:
      "Picking the wrong format can triple your file size or destroy image quality. Here's the exact decision rule I use â€” with the one exception that trips up most developers when working with logos on colored backgrounds.",
    date: "2026-05-06",
    readTime: "5 min read",
    tags: ["images", "web performance", "formats"],
  },
  {
    slug: "summarize-pdf-free-without-signup",
    title: "How to Summarize a Long PDF for Free Without Signing Up",
    summary:
      "You have a 60-page report and 10 minutes. Here's how to get a reliable summary in the browser without uploading it to an account-walled service â€” plus the two cases where AI summaries quietly mislead you.",
    date: "2026-06-02",
    readTime: "7 min read",
    tags: ["PDF", "AI tools", "privacy"],
  },
  {
    slug: "convert-python-to-javascript-in-browser",
    title: "Converting Python to JavaScript in the Browser: What Translates and What Breaks",
    summary:
      "Syntax converts in seconds; semantics don't. Here's the realistic workflow for porting a Python snippet to JavaScript, the three patterns that always need a human, and how to check the result fast.",
    date: "2026-06-01",
    readTime: "8 min read",
    tags: ["developer tools", "Python", "JavaScript"],
  },
  {
    slug: "compress-image-under-100kb-for-email",
    title: "How to Compress an Image to Under 100 KB for Email (Without It Looking Terrible)",
    summary:
      "Email clients choke on large attachments and inline images. Here's how I get a photo under 100 KB while keeping it sharp â€” the quality setting that matters, when to switch formats, and the resize-first trick.",
    date: "2026-05-16",
    readTime: "6 min read",
    tags: ["images", "email", "compression"],
  },
  {
    slug: "base64-is-not-encryption",
    title: "Base64 Is Not Encryption: The Security Mistake I See in Code Reviews Every Week",
    summary:
      "Base64-encoded strings look scrambled, and that trips up a surprising number of developers into thinking the data is protected. Here's what Base64 actually does, where it belongs, and what to use when you actually need security.",
    date: "2026-05-24",
    readTime: "7 min read",
    tags: ["security", "developer tools", "encoding"],
  },
  {
    slug: "reading-jwt-tokens-without-a-library",
    title: "Reading JWT Tokens Without a Library: What Your Auth Headers Actually Contain",
    summary:
      "A JWT is three Base64url-encoded chunks separated by dots. Once you know that, you can read any token in a browser tab in 10 seconds. Here's how, and what to check when an auth bug goes dark.",
    date: "2026-05-22",
    readTime: "8 min read",
    tags: ["security", "authentication", "developer tools"],
  },
  {
    slug: "qr-codes-what-specs-dont-tell-you",
    title: "QR Codes for Print and Web: What the Spec Sheets Don't Tell You About Scan Rates",
    summary:
      "I generated and tested 40 QR codes at different sizes, error correction levels, and color contrasts to find the settings that actually scan reliably. The defaults are not always the right choice.",
    date: "2026-05-20",
    readTime: "9 min read",
    tags: ["QR codes", "print", "testing"],
  },
  {
    slug: "password-generator-vs-password-manager",
    title: "Browser Password Generator vs. Password Manager: When Each Makes Sense",
    summary:
      "Both generate strong passwords, but they solve different problems. Here's the specific scenario where I reach for the browser generator instead of 1Password, and why the distinction matters for shared accounts and one-time use.",
    date: "2026-05-17",
    readTime: "6 min read",
    tags: ["security", "passwords", "workflow"],
  },
  {
    slug: "css-box-shadow-real-numbers",
    title: "CSS Box Shadows That Look Natural: The Numbers Behind the Effect",
    summary:
      "Most box shadow tutorials give you a single value and call it a day. Real shadows don't work that way. Here's a breakdown of the five parameters, why ambient and key layers should be separate, and the specific values I use in production.",
    date: "2026-05-15",
    readTime: "8 min read",
    tags: ["CSS", "design", "frontend"],
  },
  {
    slug: "color-contrast-wcag-what-it-means",
    title: "Color Contrast Ratios: What WCAG AA and AAA Actually Mean in Practice",
    summary:
      "The 4.5:1 minimum ratio for text passes WCAG AA â€” but it can still fail badly on real screens with glare, aging eyes, or low brightness. Here's how I test contrast in practice and where the spec falls short.",
    date: "2026-05-13",
    readTime: "7 min read",
    tags: ["accessibility", "design", "CSS"],
  },
  {
    slug: "cron-syntax-the-parts-that-bite-you",
    title: "Cron Syntax: The Parts That Bite You (And How to Test Before Deploying)",
    summary:
      "Cron expressions look simple until your scheduled job runs at 3 AM on a Tuesday instead of every Tuesday at 3 AM. Here's a breakdown of every field, the common mistakes, and how to validate a cron expression before it goes live.",
    date: "2026-05-11",
    readTime: "9 min read",
    tags: ["developer tools", "scheduling", "DevOps"],
  },
  {
    slug: "extract-audio-from-video-in-browser",
    title: "How to Extract Audio from a Video File in Your Browser (No Upload, No App)",
    summary:
      "Zoom calls saved as MP4, lecture recordings, DJ sets, raw interview footage â€” here's how to strip the audio track client-side using the Web Audio API, with specific numbers on what you can expect.",
    date: "2026-05-10",
    readTime: "8 min read",
    tags: ["audio", "browser APIs", "privacy"],
  },
  {
    slug: "image-compression-real-numbers",
    title: "Image Compression in Practice: From 3.2 MB to 412 KB Without Visible Quality Loss",
    summary:
      "I ran 60 JPEG and WebP images through the browser-based compressor to find the quality setting sweet spot. Here's what the data says about bitrate, color depth, and when to stop compressing.",
    date: "2026-05-08",
    readTime: "10 min read",
    tags: ["images", "performance", "web.dev"],
  },
  {
    slug: "json-formatter-api-debugging-privacy",
    title: "Why You Should Format JSON Locally, Not in a Cloud Paste Tool",
    summary:
      "API responses containing tokens, PII, or business logic get pasted into cloud formatters every day. Here's what actually happens to that data and how browser-based formatting works differently.",
    date: "2026-05-05",
    readTime: "7 min read",
    tags: ["developer tools", "security", "JSON"],
  },
  {
    slug: "regex-testing-workflow",
    title: "How I Test Regex Before It Breaks Production: A Practical Workflow",
    summary:
      "Regular expressions are the one code construct where a single wrong character silently changes behavior with no compile error. Here's the workflow I use to test regex safely before it ships.",
    date: "2026-05-03",
    readTime: "9 min read",
    tags: ["developer tools", "regex", "workflow"],
  },
  {
    slug: "word-count-writing-workflow",
    title: "Word Count as a Writing Tool: How Counting Characters Changed How I Write",
    summary:
      "Word counters seem trivial until you use them seriously. Here's how I use character counts, reading time estimates, and density metrics to actually improve writing quality â€” not just hit targets.",
    date: "2026-05-01",
    readTime: "7 min read",
    tags: ["writing", "SEO", "productivity"],
  },
  {
    slug: "sql-formatting-database-debugging",
    title: "SQL Formatting as a Debugging Tool: Reading Queries You Didn't Write",
    summary:
      "Unformatted SQL is where bugs hide. Here's how I use SQL formatting as the first step in diagnosing slow queries, wrong joins, and logic errors in queries written by ORMs or other developers.",
    date: "2026-04-28",
    readTime: "8 min read",
    tags: ["SQL", "databases", "developer tools"],
  },
  {
    slug: "url-shorteners-tracking-what-they-do",
    title: "URL Shorteners: What They Actually Track and When to Use Your Own",
    summary:
      "Short links look clean, but they're also tracking infrastructure. Here's what click data gets collected, the 301 vs 302 distinction, and when you should use your own domain instead of a third-party service.",
    date: "2026-04-25",
    readTime: "7 min read",
    tags: ["privacy", "marketing", "URLs"],
  },
  {
    slug: "markdown-to-html-workflow",
    title: "Markdown to HTML: The Conversion Gotchas That Cost Me an Afternoon",
    summary:
      "Markdown is almost a standard â€” but different parsers handle tables, nested lists, code blocks, and inline HTML differently. Here are the specific conversion issues I ran into migrating a 340-page documentation site.",
    date: "2026-04-22",
    readTime: "8 min read",
    tags: ["Markdown", "developer tools", "documentation"],
  },
]

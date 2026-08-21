export type CategoryHubContent = {
  h1: string
  intro: string
  useCases: { title: string; description: string }[]
  faqs: { question: string; answer: string }[]
}

const categoryHubContent: Record<string, CategoryHubContent> = {
  developer: {
    h1: "Free Developer Tools Online — No Sign-Up Required",
    intro:
      "Every modern developer workflow involves at least one data-transformation step: formatting raw JSON from an API, decoding a JWT to inspect its claims, converting binary payloads to Base64, or testing a regex before shipping it to production. These tasks are repetitive, context-switching away from your editor is costly, and spinning up a local script just to check one value is overkill. Our free developer tools online run entirely in your browser — zero install, zero account, zero data sent to any server. Paste your input, get your output instantly. The full collection covers JSON formatting and validation, SQL beautification, regex testing with group highlighting, Base64 encoding and decoding, JWT inspection, UUID generation, URL encoding, cron expression parsing, bcrypt hashing, SHA-256 checksums, CSS minification, and more. Each tool opens in seconds and preserves your privacy because nothing ever leaves your machine.",
    useCases: [
      {
        title: "API development and debugging",
        description:
          "Inspect JWT tokens from your auth provider, format raw JSON responses, decode Base64 payloads, and validate URL query strings — all without leaving your browser. When an API returns garbled output, paste it here to identify the encoding or format instantly.",
      },
      {
        title: "Database and query work",
        description:
          "Beautify sprawling SQL queries so you can read join chains and WHERE clauses at a glance. Cross-check values with a diff checker when comparing query results. Parse cron expressions to confirm your scheduled job will fire at the right intervals.",
      },
      {
        title: "Security and credentials",
        description:
          "Generate bcrypt hashes for password storage, compute SHA-256 checksums to verify file integrity, create strong UUIDs for primary keys, and decode JWT headers without sending sensitive tokens to a third-party server.",
      },
      {
        title: "Front-end and DevOps automation",
        description:
          "Minify CSS before bundling, encode special characters in URLs for query-string parameters, and validate regex patterns used in routing or input sanitisation. Cron expression parsing helps DevOps teams confirm CI schedules without needing a live cron daemon.",
      },
    ],
    faqs: [
      {
        question: "Are these developer tools really free?",
        answer:
          "Yes — every tool on this page is permanently free to use. There is no trial period, no credit card, and no account required. The tools are funded by non-intrusive display advertising.",
      },
      {
        question: "Do these tools send my data to a server?",
        answer:
          "No. Every tool on this page runs entirely in your browser using client-side JavaScript. Your input never leaves your machine. This is especially important for sensitive data like JWT tokens, passwords, and API keys.",
      },
      {
        question: "Can I use these tools on mobile?",
        answer:
          "Yes. The tools are fully responsive and work on any modern smartphone or tablet browser. Touch input, paste, and copy actions all behave correctly on iOS and Android.",
      },
      {
        question: "What is the most popular developer tool on this site?",
        answer:
          "JSON Formatter and Validator is consistently the most-used tool, followed by Base64 Encoder/Decoder, Regex Tester, and JWT Decoder. These four tools cover the majority of everyday developer data-inspection tasks.",
      },
      {
        question: "Do you support keyboard shortcuts?",
        answer:
          "Most tools support standard OS shortcuts: Ctrl+A to select all, Ctrl+C to copy, and Ctrl+Z to undo. The site-wide search is accessible via Ctrl+K or the / key from any page.",
      },
      {
        question: "How accurate is the regex tester?",
        answer:
          "The regex tester runs the native JavaScript RegExp engine, which is the same engine used in Node.js, Chrome, Firefox, and Safari. Patterns are evaluated in real time with full support for flags (g, i, m, s, u, y) and named capture groups.",
      },
    ],
  },

  image: {
    h1: "Free Image Tools Online — No Sign-Up Required",
    intro:
      "Image optimisation is one of the highest-impact things you can do for web performance, and it used to require Photoshop, ImageMagick, or a paid SaaS subscription. Our free image tools online change that. Every tool runs entirely in your browser — your files never touch a remote server — which means you can compress, convert, and inspect images without worrying about privacy or file-size upload limits. The collection covers image compression for JPEG, PNG, and WebP, format conversion, QR code generation from any URL or text, colour picking with HEX, RGB, and HSL output, and colour contrast checking against the WCAG AA and AAA accessibility standards. Whether you are a web developer squeezing page-weight out of a hero image, a designer checking brand colours against accessibility requirements, or a marketer generating a QR code for a print campaign, these tools give you professional-grade output in seconds.",
    useCases: [
      {
        title: "Web performance optimisation",
        description:
          "Compress images before uploading them to your CMS or CDN. Reducing a hero image from 2 MB to 200 KB can shave 1–2 seconds off your Largest Contentful Paint (LCP) score, which is a direct Google ranking factor. Convert PNG screenshots to WebP for next-generation format savings of 25–34%.",
      },
      {
        title: "Marketing and print campaigns",
        description:
          "Generate QR codes that link to product pages, event registrations, or contact cards. Download the code as an SVG for crisp print output at any size. Pair with the colour picker to ensure your campaign colours are consistent across digital and physical materials.",
      },
      {
        title: "Accessibility compliance",
        description:
          "Use the colour contrast checker to verify that your text and background colour combinations meet WCAG 2.1 Level AA (minimum 4.5:1 ratio for normal text) or Level AAA (7:1 ratio). This is required for public-sector websites in many jurisdictions and recommended for all commercial sites.",
      },
      {
        title: "Design system and UI work",
        description:
          "Pick exact HEX, RGB, or HSL values from a reference image using the colour picker. Export CSS colour variables directly. Cross-check proposed UI colours against contrast requirements before committing them to your design system or Figma library.",
      },
    ],
    faqs: [
      {
        question: "Is image compression lossless or lossy?",
        answer:
          "The image compressor offers both modes. Lossless compression removes metadata and optimises encoding without changing visible pixels. Lossy compression allows you to set a quality level (1–100) and typically achieves 60–80% file-size reduction at quality 80 with no perceptible difference at normal screen resolutions.",
      },
      {
        question: "Do my images get uploaded to your servers?",
        answer:
          "No. All image processing runs locally in your browser using the Canvas API and WebAssembly-based codecs. Your files never leave your device. This makes the tools safe to use with confidential or copyright-protected images.",
      },
      {
        question: "What image formats are supported?",
        answer:
          "The image compressor and converter support JPEG, PNG, WebP, GIF, and BMP input. Output formats include JPEG, PNG, and WebP. SVG output is available for the QR code generator.",
      },
      {
        question: "What is the maximum image file size I can process?",
        answer:
          "There is no server-side file-size limit because processing happens in your browser. Practical limits depend on your device's available RAM. Images up to 50 MB process reliably on most modern laptops and desktops.",
      },
      {
        question: "How do I check if my colours pass WCAG contrast requirements?",
        answer:
          "Open the Colour Contrast Checker, enter your foreground (text) colour and background colour as HEX values, and click Check. The tool instantly shows your contrast ratio and whether it passes WCAG 2.1 Level AA (4.5:1 for normal text, 3:1 for large text) and Level AAA (7:1 for normal text).",
      },
      {
        question: "Can I use the QR code generator for commercial purposes?",
        answer:
          "Yes. QR codes generated on this site are yours to use in any context — commercial print, digital campaigns, product packaging, or event tickets — with no attribution required. There are no watermarks or usage restrictions.",
      },
    ],
  },

  text: {
    h1: "Free Text Tools Online — No Sign-Up Required",
    intro:
      "Writing, editing, and analysing text at scale involves dozens of micro-tasks that interrupt your flow: counting words before submitting to a word-limited form, comparing two drafts to spot what changed, converting Markdown notes into HTML for a CMS, or generating placeholder text to fill a wireframe. Our free text tools online handle all of these in the browser — no paste-into-Word workarounds, no installing an extension, no copying into a paid AI tool just to count paragraphs. The collection includes a word and character counter with live statistics, a side-by-side diff checker that highlights added and removed lines, a Markdown-to-HTML converter with syntax-highlighted preview, a Lorem Ipsum generator for placeholder content, and a growing set of AI-assisted writing tools. Every tool is instant and privacy-safe: your text never leaves your browser.",
    useCases: [
      {
        title: "Content writing and editing",
        description:
          "Count words, characters, sentences, and reading time before submitting an article to a platform with strict word limits. Use the diff checker to compare a client's revised brief against your original draft, instantly seeing what was added, removed, or changed.",
      },
      {
        title: "Front-end and CMS development",
        description:
          "Convert Markdown documentation into clean HTML for embedding in a CMS. Use the Lorem Ipsum generator to fill layouts with realistic paragraph lengths while designing page templates. Copy the output directly into HTML, Figma, or your component library.",
      },
      {
        title: "Academic and professional writing",
        description:
          "Monitor word counts against submission requirements for essays, reports, and grant applications. Paste two versions of a document into the diff checker to produce a clean change-log for version control or reviewer feedback.",
      },
      {
        title: "API and developer workflows",
        description:
          "Verify that an API response or webhook payload contains the exact text you expect by running it through the diff checker against a known-good snapshot. Convert Markdown API documentation into HTML for use in in-app help panels.",
      },
    ],
    faqs: [
      {
        question: "How does the word counter count words?",
        answer:
          "Words are counted by splitting on whitespace and punctuation boundaries, consistent with how most publishing platforms count words. The tool also reports character count (with and without spaces), sentence count, paragraph count, and estimated reading time at 200 words per minute.",
      },
      {
        question: "Does the diff checker support large files?",
        answer:
          "Yes. The diff algorithm runs in-browser and can handle files up to several thousand lines. For very large comparisons (100k+ characters), rendering may take a second or two but the result is accurate.",
      },
      {
        question: "What flavour of Markdown does the converter support?",
        answer:
          "The Markdown-to-HTML converter follows the CommonMark specification, which is the standard used by GitHub, GitLab, Discord, and most modern documentation tools. GitHub Flavored Markdown (GFM) extensions — tables, strikethrough, and task lists — are also supported.",
      },
      {
        question: "Can I customise the Lorem Ipsum output?",
        answer:
          "Yes. The Lorem Ipsum generator lets you choose the number of words, sentences, or paragraphs, and optionally start with the classic 'Lorem ipsum dolor sit amet' opener or use randomly shuffled Latin words for variety.",
      },
      {
        question: "Is my text stored anywhere?",
        answer:
          "No. All text processing happens locally in your browser. Nothing you type or paste is transmitted to a server, logged, or stored. The tools retain your text only for the duration of your browser session.",
      },
      {
        question: "Can I use these tools for proofreading?",
        answer:
          "The word counter and diff checker are useful for structural analysis (length, changes, consistency) but do not check grammar or spelling. For grammar checking, combine these tools with your browser's built-in spell-check or a dedicated writing assistant.",
      },
    ],
  },

  security: {
    h1: "Free Security & Encoding Tools Online — No Sign-Up Required",
    intro:
      "Security-sensitive tasks — hashing passwords, verifying checksums, inspecting tokens, generating UUIDs — require tools you can trust not to exfiltrate your data. Cloud-based hash generators and JWT decoders are convenient, but submitting a production password or a live API token to an unknown server is a risk that is difficult to justify. Our free security tools online run every operation client-side in your browser: no network requests, no server logs, no third-party telemetry. The collection covers bcrypt password hashing with configurable work factors, SHA-256 and SHA-512 cryptographic checksums, a strong password generator with entropy estimation, JWT decoding with header and payload inspection, RFC 4122-compliant UUID v4 generation, and URL-safe Base64 encoding. These tools are suitable for developers, security engineers, and privacy-conscious users who need professional cryptographic utilities without installing local software.",
    useCases: [
      {
        title: "Password storage and verification",
        description:
          "Generate bcrypt hashes for passwords before storing them in a database. Test different work factors (cost parameters) to balance security and authentication latency. Verify that a plaintext password matches a stored bcrypt hash without running server-side code.",
      },
      {
        title: "File and data integrity",
        description:
          "Compute SHA-256 or SHA-512 checksums of files or strings to verify integrity. Compare the output against a published checksum to confirm a downloaded binary has not been tampered with. Use the diff checker alongside hash tools to audit configuration file changes.",
      },
      {
        title: "Authentication and API security",
        description:
          "Decode JWT tokens to inspect claims, expiry timestamps, and signing algorithm without a running backend. Identify misconfigured tokens (wrong audience, expired iat, or missing sub claim) during local development or code review.",
      },
      {
        title: "Unique ID and secret generation",
        description:
          "Generate cryptographically random UUID v4 values for database primary keys, idempotency tokens, and session identifiers. Use the password generator to create high-entropy API keys, webhook secrets, and service account credentials.",
      },
    ],
    faqs: [
      {
        question: "Is it safe to hash passwords in the browser?",
        answer:
          "Yes — for the purpose of testing and development. The bcrypt computation runs entirely in your browser using a pure-JavaScript implementation. Nothing is transmitted to a server. In production, password hashing should always happen server-side; this tool is for generating test hashes, tuning work factors, and verifying stored hashes.",
      },
      {
        question: "What bcrypt work factor should I use?",
        answer:
          "The OWASP password storage cheat sheet recommends a work factor (cost) that makes hashing take at least 1 second on your target hardware. For most modern servers, a work factor of 12–13 achieves this. The bcrypt tool lets you experiment with different values and see the output instantly.",
      },
      {
        question: "Can I decode an encrypted JWT here?",
        answer:
          "The JWT decoder can decode the header and payload of any JWT — signed (JWS) or unsigned — because the Base64url-encoded sections are not encrypted. If the token is a JWE (JSON Web Encryption), the payload is encrypted and cannot be decoded without the private key.",
      },
      {
        question: "Are the generated UUIDs truly random?",
        answer:
          "Yes. UUID v4 generation uses the browser's crypto.getRandomValues() API, which is a cryptographically secure pseudo-random number generator (CSPRNG). This is the same entropy source used by production UUID libraries in Node.js and browser runtimes.",
      },
      {
        question: "How long should a strong password be?",
        answer:
          "NIST SP 800-63B recommends a minimum of 8 characters but notes that longer passwords (15+) dramatically increase resistance to brute-force attacks. The password generator defaults to 16 characters with mixed case, digits, and symbols, giving roughly 96 bits of entropy — sufficient for most high-value accounts.",
      },
      {
        question: "Is SHA-256 safe to use for password hashing?",
        answer:
          "No. SHA-256 is a general-purpose hash function designed for speed, which makes it unsuitable for password storage — attackers can compute billions of SHA-256 hashes per second on commodity hardware. Use bcrypt, Argon2, or scrypt for password hashing. SHA-256 is appropriate for file integrity verification and data fingerprinting.",
      },
    ],
  },

  seo: {
    h1: "Free SEO Tools Online — No Sign-Up Required",
    intro:
      "Effective SEO work requires constant iteration on meta tags, structured data, and on-page signals — tasks that slow down when you have to jump between a CMS, a browser extension, and a paid audit tool. Our free SEO tools online consolidate the most common on-page and technical SEO utilities into one privacy-safe, browser-based workspace. There is no account to create, no monthly subscription, and no data submitted to external servers. The collection includes a meta tag generator and SERP preview, an Open Graph tag builder for social sharing, a colour contrast checker for accessibility-driven SEO, and a growing set of web inspection tools. Whether you are optimising a new landing page, auditing structured data on an existing post, or verifying that a page title fits within Google's 600-pixel display limit, these tools give you instant feedback without switching context.",
    useCases: [
      {
        title: "On-page SEO optimisation",
        description:
          "Generate and preview title tags and meta descriptions within Google's character and pixel limits. Check that your primary keyword appears in the first 100 characters of the title. Preview how the snippet will appear in mobile and desktop SERPs before publishing.",
      },
      {
        title: "Social media and Open Graph",
        description:
          "Build Open Graph tags (og:title, og:description, og:image) and Twitter Card markup for accurate social previews. Verify that your og:image meets the recommended 1200×630 pixel dimensions and that the description fits within Twitter's 200-character card limit.",
      },
      {
        title: "Technical SEO auditing",
        description:
          "Inspect robots meta tags, canonical URLs, and hreflang attributes. Verify that noindex directives are not accidentally applied to pages you want indexed. Use the URL encoder to clean up query strings in canonical tags.",
      },
      {
        title: "Accessibility and Core Web Vitals",
        description:
          "Google's ranking algorithm incorporates accessibility signals. Use the colour contrast checker to ensure text meets WCAG AA requirements (4.5:1 ratio) — passing accessibility checks also helps your pages score better in accessibility-focused ranking factors.",
      },
    ],
    faqs: [
      {
        question: "What meta tags does the meta tag generator create?",
        answer:
          "The meta tag generator creates the full set of on-page SEO tags: title, meta description, canonical URL, robots directives (index/noindex, follow/nofollow), Open Graph tags (og:title, og:description, og:image, og:type, og:url), and Twitter Card tags. Output is ready-to-paste HTML.",
      },
      {
        question: "How long should a meta description be?",
        answer:
          "Google displays meta descriptions up to approximately 160 characters on desktop and 120 characters on mobile. Descriptions longer than this are truncated with an ellipsis. The meta tag generator shows a live character count and SERP preview so you can trim before publishing.",
      },
      {
        question: "Does having good meta tags improve Google rankings?",
        answer:
          "Meta descriptions are not a direct ranking factor, but they significantly affect click-through rate (CTR) from SERPs. A compelling description with the target keyword bolded by Google can increase CTR by 5–15%, which indirectly improves rankings through higher engagement signals.",
      },
      {
        question: "What is an Open Graph image and what size should it be?",
        answer:
          "An Open Graph image (og:image) is the thumbnail shown when your page is shared on social media platforms including Facebook, LinkedIn, Slack, and WhatsApp. The recommended size is 1200×630 pixels (1.91:1 ratio). Images smaller than 600×314 pixels may not display correctly.",
      },
      {
        question: "Do these SEO tools work for all CMS platforms?",
        answer:
          "Yes. The meta tag generator outputs plain HTML that you can paste into any CMS — WordPress, Webflow, Shopify, Squarespace, or a custom Next.js app. CMS-specific plugins (Yoast, RankMath) can generate the same tags, but this tool is useful when you want to preview or validate tags outside the CMS interface.",
      },
      {
        question: "How do I check if a page is indexed by Google?",
        answer:
          "The fastest method is a site: search — type 'site:yourdomain.com/page-path' into Google. For systematic monitoring, set up Google Search Console (free) and check the URL Inspection tool. Our meta tag generator can help you ensure the page has correct robots directives before you submit it for indexing.",
      },
    ],
  },

  design: {
    h1: "Free Design & CSS Tools Online — No Sign-Up Required",
    intro:
      "Front-end design work lives in tiny, repeated decisions: the exact radius on a card corner, the spread and blur of a shadow that reads as 'elevated' instead of 'muddy', the two colour stops that make a gradient feel intentional rather than accidental. Doing this by hand-editing CSS and refreshing the browser is slow, and most online generators bury the output in ads or paywalls. Our free design tools online give you live visual feedback and copy-ready CSS in the browser — no account, no watermark, nothing uploaded. The collection covers CSS gradient generation (linear, radial, and conic), box-shadow building with layered shadows and elevation presets, border-radius shaping including the eight-value slash syntax, a colour picker with HEX, RGB, and HSL output, a WCAG contrast checker, and a CSS Grid layout generator. Every tool outputs standards-compliant CSS you can paste straight into a stylesheet, a Tailwind arbitrary value, or a CSS-in-JS object.",
    useCases: [
      {
        title: "Design systems and component libraries",
        description:
          "Generate a consistent elevation scale (typically 5 levels from subtle 0 1px 2px shadows up to 0 25px 50px modal shadows), copy exact border-radius tokens, and lock colour values as HEX or HSL variables. HSL is the better choice for hover states because you can shift lightness by a fixed percentage and keep the hue stable.",
      },
      {
        title: "Landing pages and marketing sites",
        description:
          "Build eye-catching gradient backgrounds and hero sections without a designer. The conic and radial gradient generators produce effects that are difficult to write by hand, and the box-shadow tool lets you layer multiple shadows for realistic depth on cards and CTAs.",
      },
      {
        title: "Accessibility-compliant UI",
        description:
          "Run every text-on-background colour pair through the WCAG contrast checker before shipping. Normal text needs a 4.5:1 ratio for AA, large text needs 3:1, and #767676 on white is the famous borderline grey that passes AA for normal text at exactly 4.54:1.",
      },
      {
        title: "Rapid prototyping and Figma-to-code",
        description:
          "Pick colours straight from a reference or mockup, convert between HEX, RGB, and HSL instantly, and translate a Figma auto-layout into a working CSS Grid template with fr units and auto-fill. Copy the generated grid-template-columns rather than hand-counting tracks.",
      },
    ],
    faqs: [
      {
        question: "What CSS gradient types can I generate?",
        answer:
          "You can generate linear gradients (with any angle), radial gradients (circular or elliptical, with positionable centres), and conic gradients (which sweep colour around a centre point and are ideal for pie-chart-style effects and colour wheels). Each generator outputs the full background or background-image declaration ready to paste.",
      },
      {
        question: "How do I avoid the grey 'dead zone' in gradients?",
        answer:
          "When two complementary colours (for example blue and orange) blend in the default sRGB colour space, the midpoint passes through a desaturated grey. To fix it, add an intermediate colour stop or use a wider-gamut interpolation such as oklch. The gradient generator lets you insert extra stops to keep the transition vivid.",
      },
      {
        question: "What is the difference between AA and AAA contrast?",
        answer:
          "WCAG Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18pt regular or 14pt bold). Level AAA is stricter: 7:1 for normal text and 4.5:1 for large text. AA is the legal baseline in most jurisdictions; AAA is recommended for body text on content-heavy pages.",
      },
      {
        question: "Can I create layered (multiple) box shadows?",
        answer:
          "Yes. The box-shadow generator supports comma-separated multiple shadows, which is how realistic elevation is built — a tight, dark shadow close to the element plus a softer, larger ambient shadow further out. You can also create inset shadows for pressed or recessed effects.",
      },
      {
        question: "Does the colour picker support HSL and opacity?",
        answer:
          "Yes. The colour picker outputs HEX (including 8-digit HEX with alpha), RGB/RGBA, and HSL/HSLA. HSL is particularly useful for generating tints and shades programmatically because you adjust a single lightness value rather than recalculating three RGB channels.",
      },
      {
        question: "Is the generated CSS compatible with Tailwind?",
        answer:
          "Yes. You can drop any generated value into a Tailwind arbitrary value, for example shadow-[0_10px_30px_rgba(0,0,0,0.15)] or rounded-[14px]. The output is standard CSS, so it also works in plain stylesheets, CSS modules, styled-components, and Emotion.",
      },
    ],
  },

  calculator: {
    h1: "Free Online Calculators & Converters — No Sign-Up Required",
    intro:
      "Most everyday calculations don't need a spreadsheet — they need a single field, an instant answer, and no formula to remember. Our free online calculators and converters do exactly that, entirely in your browser, with no account and no data leaving your device. The collection spans unit conversion (length, weight, temperature, volume, speed, and data storage), percentage and ratio maths, date and time arithmetic, number-base conversion (binary, octal, hexadecimal, decimal), and a range of health, finance, and everyday calculators. Each tool shows its working where it matters, handles edge cases like leap years and rounding correctly, and updates the result as you type. Whether you are converting a recipe from cups to millilitres, working out the number of business days between two dates, or checking a percentage discount, the answer appears immediately.",
    useCases: [
      {
        title: "Students and homework",
        description:
          "Convert units for physics and chemistry problems, calculate percentages and averages, and switch between number bases for computer-science coursework. The calculators show the conversion factor used so you can verify the method, not just copy the answer.",
      },
      {
        title: "Everyday life and home",
        description:
          "Convert cooking measurements between metric and imperial, work out tip and discount amounts, calculate how many days until an event, and convert temperatures for travel. Date-difference calculations correctly account for leap years and varying month lengths.",
      },
      {
        title: "Developers and technical users",
        description:
          "Convert between binary, octal, hexadecimal, and decimal for bit-level work, calculate data-storage sizes (KB, MB, GB with both 1000 and 1024 bases), and convert Unix timestamps to human-readable dates. These avoid the off-by-one errors common when doing base conversions by hand.",
      },
      {
        title: "Finance and budgeting",
        description:
          "Calculate percentage change for price comparisons, work out compound versus simple interest, and convert currencies using current rates. Percentage-increase and percentage-of calculations are separated so you don't confuse 'X is what percent of Y' with 'increase X by Y percent'.",
      },
    ],
    faqs: [
      {
        question: "Do these calculators use 1000 or 1024 for data sizes?",
        answer:
          "The data-storage converter supports both. The decimal (SI) standard uses 1000 (1 KB = 1000 bytes), which is how storage manufacturers label drives. The binary standard uses 1024 (1 KiB = 1024 bytes), which is how operating systems report file sizes. The tool labels each clearly so you pick the right one.",
      },
      {
        question: "Are date calculations adjusted for leap years?",
        answer:
          "Yes. The date-difference calculator uses real calendar arithmetic, so it correctly counts leap days (February 29) and handles months of different lengths. A range crossing February in a leap year will include the extra day; the same range in a non-leap year will not.",
      },
      {
        question: "How accurate are the unit conversions?",
        answer:
          "Conversions use internationally defined exact factors where they exist (for example, 1 inch = 2.54 cm exactly, 1 pound = 0.45359237 kg exactly). Results are shown to a sensible number of decimal places, and you can see the underlying factor for verification.",
      },
      {
        question: "Is there a difference between percentage increase and percentage of?",
        answer:
          "Yes, and confusing them is a common mistake. 'What is 20% of 150' equals 30. 'Increase 150 by 20%' equals 180. 'What percent of 150 is 30' equals 20%. The calculators keep these as separate inputs so you always get the calculation you intended.",
      },
      {
        question: "Can I convert temperatures including Kelvin?",
        answer:
          "Yes. The temperature converter handles Celsius, Fahrenheit, and Kelvin in any direction. Note that Kelvin has no negative values (absolute zero is 0 K = -273.15°C), and the tool reflects that physical constraint.",
      },
      {
        question: "Do the calculators work offline?",
        answer:
          "All calculations run client-side in JavaScript, so unit, percentage, date, and number-base calculators work fully offline after the page loads. Currency conversion is the exception — it needs a network request to fetch up-to-date exchange rates.",
      },
    ],
  },

  random: {
    h1: "Free Random Generators Online — No Sign-Up Required",
    intro:
      "Randomness is deceptively hard to get right. Math.random() is fine for a coin flip but unacceptable for anything security-sensitive, and 'random' name or list pickers often have hidden bias that makes some outcomes far more likely than others. Our free random generators online use the right entropy source for each job — the browser's cryptographically secure crypto.getRandomValues() for passwords, tokens, and UUIDs, and unbiased shuffling algorithms for list pickers and team makers. Everything runs in your browser with no account and no data sent anywhere. The collection includes a strong password generator, RFC 4122 UUID generation, random number and string generators, list randomisers and winner pickers, dice and coin tools, and placeholder-data generators for testing. Where security matters, the tools say so explicitly and use a CSPRNG; where it doesn't, they prioritise speed and convenience.",
    useCases: [
      {
        title: "Security and credentials",
        description:
          "Generate high-entropy passwords, API keys, and secrets using crypto.getRandomValues(), the same cryptographically secure source production libraries use. A 16-character password with mixed case, digits, and symbols carries roughly 96 bits of entropy — far beyond brute-force reach.",
      },
      {
        title: "Development and testing",
        description:
          "Create UUID v4 identifiers for database keys, generate mock data to populate test fixtures, and produce random strings for fuzz testing. UUID v4 collision probability is negligible: you would need to generate 2.7 billion per second for 100 years to reach a 50% chance of one collision.",
      },
      {
        title: "Giveaways and fair selection",
        description:
          "Pick contest winners, shuffle a list, or split people into teams using an unbiased Fisher-Yates shuffle so every arrangement is equally likely. This matters for fairness — naive shuffles based on sorting with a random comparator are measurably biased.",
      },
      {
        title: "Games, classrooms, and decisions",
        description:
          "Roll dice, flip coins, draw a random card, or pick a random item from a list for games, teaching, and tie-breaking. The dice and coin tools use the same uniform random source so each face is genuinely equally likely.",
      },
    ],
    faqs: [
      {
        question: "Are the random passwords cryptographically secure?",
        answer:
          "Yes. The password and token generators use the browser's crypto.getRandomValues() API, which is a cryptographically secure pseudo-random number generator (CSPRNG). This is fundamentally different from Math.random(), which is predictable and must never be used for anything security-related.",
      },
      {
        question: "How unique are the generated UUIDs?",
        answer:
          "UUID v4 values contain 122 bits of randomness, giving about 5.3 x 10^36 possible values. The probability of a collision is so small that for practical purposes UUIDs can be treated as globally unique without a central authority coordinating them.",
      },
      {
        question: "Is the list shuffler actually unbiased?",
        answer:
          "Yes. The shuffler uses the Fisher-Yates (Knuth) algorithm, which produces every possible ordering with equal probability. This avoids the subtle bias of shuffling by sorting with a random comparator, which skews results toward certain arrangements.",
      },
      {
        question: "Can I set a range for random numbers?",
        answer:
          "Yes. The random number generator lets you set minimum and maximum bounds (inclusive), choose integers or decimals, and optionally generate multiple values at once with or without duplicates — useful for lottery-style picks where each number must be unique.",
      },
      {
        question: "Is anything I generate stored or logged?",
        answer:
          "No. Every value is generated locally in your browser and never transmitted to a server. This is essential for the password and secret generators — a generated credential that traveled over the network would no longer be secret.",
      },
      {
        question: "What is the difference between UUID v4 and v7?",
        answer:
          "UUID v4 is fully random. UUID v7 is time-ordered — it embeds a millisecond timestamp in the high bits, so v7 values sort chronologically. v7 is increasingly preferred for database primary keys because sequential values reduce index fragmentation compared with fully random v4.",
      },
    ],
  },

  audio: {
    h1: "Free Audio & Media Tools Online — No Sign-Up Required",
    intro:
      "Audio work used to mean installing a digital audio workstation just to trim a clip or convert a format. Our free audio and media tools online handle the most common tasks directly in the browser, using the Web Audio API and modern codecs — no install, no account, and for most tools no upload, because processing happens on your device. The collection covers audio format conversion (MP3, WAV, OGG, and more), extracting audio from video files, audio enhancement and noise reduction, text-to-speech generation, and voice tools. Browser-based audio became genuinely viable once the WebCodecs and Web Audio APIs gave JavaScript access to hardware-accelerated decoding, so a one-minute clip now processes in seconds rather than minutes. Each tool states clearly whether it runs locally or needs a server, so you always know where your media is going.",
    useCases: [
      {
        title: "Podcasters and content creators",
        description:
          "Extract the audio track from a recorded video for a podcast feed, convert between MP3 and WAV depending on whether you need small files or lossless editing masters, and apply noise reduction to clean up room hum and HVAC rumble before publishing.",
      },
      {
        title: "Video editors and YouTubers",
        description:
          "Pull a clean audio stream out of an MP4 to edit separately, then re-sync it. Converting a one-minute clip to MP3 at 128 kbps produces roughly a 1 MB file — small enough to share, good enough for spoken-word content.",
      },
      {
        title: "Accessibility and voiceover",
        description:
          "Generate natural-sounding voiceovers from a script using neural text-to-speech, useful for narration, e-learning, and making written content available as audio. Write the text the way you want it spoken — punctuation drives the pauses and intonation.",
      },
      {
        title: "Musicians and audio hobbyists",
        description:
          "Convert lossless recordings to compressed formats for sharing, normalise loudness so tracks play at a consistent level, and clean up amateur recordings. Note that noise reduction works on speech-style content, not on music with instrumental backing.",
      },
    ],
    faqs: [
      {
        question: "Which audio format should I export — MP3 or WAV?",
        answer:
          "Use WAV (lossless) when you need to edit further or archive a master, because it preserves full quality but produces large files (about 5 MB per minute at 16-bit/44.1 kHz). Use MP3 (lossy) for distribution and sharing — 320 kbps for music, 128 kbps for spoken word — which cuts file size by 80–90% with no audible loss for most listeners.",
      },
      {
        question: "Does extracting audio from video upload my file?",
        answer:
          "For most browser-based extraction the file is processed locally using the WebCodecs API and never leaves your device. Tools that require server-side processing for large or unusual formats state this explicitly and discard the file after conversion.",
      },
      {
        question: "Can AI noise reduction clean up any recording?",
        answer:
          "It works best on speech with consistent background noise (fan, hum, hiss), where it can remove 20–28 dB of noise. It struggles with music (it cannot tell instruments from 'noise'), overlapping speakers, and clipped audio — clipping is distortion baked into the waveform and cannot be removed, only made less obvious.",
      },
      {
        question: "How natural does the text-to-speech sound?",
        answer:
          "Modern neural TTS is rated 'natural' by most listeners for English and major European languages. It still struggles with proper nouns, acronyms (SQL might be read letter-by-letter or as 'sequel'), and emotional range. For pronunciation control, spell tricky words phonetically in the input.",
      },
      {
        question: "What sample rate and bitrate should I use?",
        answer:
          "For spoken-word content, 44.1 kHz sample rate and 128 kbps MP3 is the sweet spot. For music distribution, use 320 kbps MP3 or a lossless format. Higher sample rates (48 kHz, 96 kHz) matter mainly for professional production, not for typical web or podcast use.",
      },
      {
        question: "Do these tools work on mobile browsers?",
        answer:
          "Yes, on modern iOS and Android browsers that support the Web Audio and WebCodecs APIs. Very large files may hit mobile memory limits — for files over a few hundred megabytes, a desktop browser is more reliable.",
      },
    ],
  },

  file: {
    h1: "Free File Tools & Converters Online — No Sign-Up Required",
    intro:
      "Converting and inspecting files usually sends you to sites that upload your document to a server, watermark the output, or cap the file size unless you pay. Our free file tools online avoid all of that by doing the work in your browser wherever the format allows — your PDFs, spreadsheets, and documents never leave your device. The collection covers PDF conversion (to and from Word, images, and text), document conversion between formats, CSV and JSON transformation, and image-to-PDF assembly. Because conversion between rich formats is fundamentally lossy — a PDF's fixed layout doesn't map cleanly onto Word's reflowing paragraphs, for example — each tool is honest about what survives the round trip and what needs manual cleanup. Where a tool must use a server for a format the browser can't handle natively, it says so and discards your file immediately after processing.",
    useCases: [
      {
        title: "Office and administrative work",
        description:
          "Convert a PDF to an editable Word document, turn a finished Word file into a shareable PDF, and combine scanned pages into a single PDF. PDF-to-Word works best on text-heavy documents; complex multi-column layouts and tables often need manual fixes afterward.",
      },
      {
        title: "Data and spreadsheets",
        description:
          "Convert CSV to JSON for an API import, or JSON back to CSV for a spreadsheet. Watch for type inference issues — a CSV value like '007' may be read as the number 7, and dates can be misparsed, so verify the output when types matter.",
      },
      {
        title: "Document sharing and archiving",
        description:
          "Convert text and Word files to PDF so they display identically on every device and can't be accidentally edited. PDF embeds fonts and fixes layout, which is exactly why it's the standard for contracts, invoices, and anything that must look the same everywhere.",
      },
      {
        title: "Scanning and image assembly",
        description:
          "Combine photos of receipts or documents into one PDF for expense reports. Use JPEG embedding for photos (smaller files) and PNG for screenshots or line art. For print, target 300 DPI; for screen viewing, 150 DPI keeps the file small.",
      },
    ],
    faqs: [
      {
        question: "Why isn't my PDF-to-Word conversion perfect?",
        answer:
          "PDF is a fixed-layout format that describes where each character sits on the page; Word uses reflowing paragraphs. Converting between them requires reconstructing the document's structure, which works well for simple text but struggles with multi-column layouts, tables, and scanned images. Expect to do some manual cleanup on complex documents.",
      },
      {
        question: "Are my files uploaded to a server?",
        answer:
          "For formats the browser can process natively (most PDF, text, CSV, and JSON operations), everything happens locally and nothing is uploaded. A few conversions involving complex formats use server-side processing — these are labeled, and the file is deleted immediately after the conversion completes.",
      },
      {
        question: "What's the difference between converting to JPEG vs PNG in a PDF?",
        answer:
          "JPEG uses lossy compression and is ideal for photographs — it produces much smaller files. PNG is lossless and better for screenshots, diagrams, and any image with sharp edges or text, where JPEG would introduce visible artifacts. Choose based on the image content, not habit.",
      },
      {
        question: "Why does my CSV-to-JSON conversion change my data types?",
        answer:
          "CSV is untyped — everything is text. When converting to JSON, the tool infers types, so '123' becomes a number and 'true' becomes a boolean. This causes problems with leading zeros (zip codes, phone numbers) and IDs. Look for an option to keep all values as strings if type preservation matters.",
      },
      {
        question: "What DPI should I use when converting images to PDF?",
        answer:
          "For on-screen viewing, 72–150 DPI is plenty and keeps file size down. For printing, use 300 DPI so text and images stay crisp. Higher than 300 DPI rarely improves perceptible print quality and just inflates the file.",
      },
      {
        question: "Will the fonts in my document survive conversion to PDF?",
        answer:
          "PDF can embed fonts, which is why it preserves appearance across devices. When converting to PDF, standard system fonts embed reliably; unusual or licensed fonts may be substituted if they can't be embedded. Stick to common fonts if exact appearance is critical.",
      },
    ],
  },

  accessibility: {
    h1: "Free Accessibility Tools Online — No Sign-Up Required",
    intro:
      "Accessibility is increasingly a legal requirement, not just good practice — the WCAG 2.1 and 2.2 guidelines underpin the ADA, Section 508, and the European Accessibility Act. But you don't need an enterprise audit suite to catch the most common failures. Our free accessibility tools online let you check the highest-impact issues directly in the browser, with no account and nothing uploaded. The collection focuses on the problems that fail real audits most often: insufficient colour contrast, missing or inadequate alt text, and unclear visual hierarchy. Colour contrast alone accounts for a large share of automated-audit failures, and it's the easiest to fix once you can measure it. Each tool gives you the precise ratio or check result against WCAG thresholds so you can fix issues before they reach a user with a disability — or a compliance reviewer.",
    useCases: [
      {
        title: "Web developers and designers",
        description:
          "Check every text-on-background colour pair against WCAG AA (4.5:1 for normal text, 3:1 for large text) and AAA (7:1) before shipping. Colour contrast is the single most common automated-audit failure, and fixing it is usually a small tweak to a lightness value.",
      },
      {
        title: "Content and marketing teams",
        description:
          "Verify that images have meaningful alt text and that link text makes sense out of context (screen-reader users often navigate by jumping between links, so 'click here' is useless). These checks improve both accessibility and SEO, since search engines read the same signals.",
      },
      {
        title: "Public-sector and regulated sites",
        description:
          "Government and many commercial sites must meet WCAG 2.1 AA for legal compliance. Use these tools to document that text contrast, colour usage, and content structure meet the required thresholds before an accessibility statement or VPAT is published.",
      },
      {
        title: "QA and pre-launch review",
        description:
          "Add a contrast and alt-text pass to your pre-launch checklist. Catching these issues before release is far cheaper than retrofitting after a complaint — and it protects users who rely on assistive technology from day one.",
      },
    ],
    faqs: [
      {
        question: "What contrast ratio do I need to pass WCAG?",
        answer:
          "WCAG 2.1 Level AA requires 4.5:1 for normal text and 3:1 for large text (18pt regular or 14pt bold). Level AAA requires 7:1 for normal text and 4.5:1 for large text. The contrast checker shows your exact ratio and which levels it passes so there's no guesswork.",
      },
      {
        question: "Does passing colour contrast make my whole site accessible?",
        answer:
          "No — contrast is one criterion among dozens, but it's the most commonly failed and the easiest to measure. Full accessibility also requires keyboard navigation, proper heading structure, ARIA where needed, form labels, and more. Contrast is the best place to start because it has the highest failure rate.",
      },
      {
        question: "What makes good alt text?",
        answer:
          "Good alt text conveys the image's purpose in context, concisely. A product photo's alt text should name the product; a decorative image should have empty alt (alt=\"\") so screen readers skip it. Avoid 'image of' prefixes — screen readers already announce that it's an image.",
      },
      {
        question: "Is colour contrast a Google ranking factor?",
        answer:
          "Accessibility signals contribute to Google's page-experience assessment, and accessible pages tend to have cleaner structure and better engagement, which indirectly helps rankings. More directly, alt text helps images rank in Google Images. Accessibility and SEO overlap substantially.",
      },
      {
        question: "What's the difference between WCAG 2.1 and 2.2?",
        answer:
          "WCAG 2.2 (published 2023) builds on 2.1 by adding nine new success criteria, mostly around focus appearance, target size (minimum 24x24 px for interactive elements), and dragging alternatives. If you meet 2.2 you also meet 2.1. Most current legal requirements reference 2.1 AA, with 2.2 adoption growing.",
      },
      {
        question: "Can these tools check a live URL automatically?",
        answer:
          "These tools check the specific values you provide (colour pairs, text, markup) rather than crawling a whole site. For full-page automated scans, pair them with a browser extension or audit tool; use these for fast, precise checks during design and development.",
      },
    ],
  },

  data: {
    h1: "Free Data & Analytics Tools Online — No Sign-Up Required",
    intro:
      "Working with data means a constant stream of inspect-transform-validate tasks: pretty-printing a minified API response, validating that a JSON payload matches its schema, parsing a user-agent string out of a log line, or converting between data formats. Doing this in a notebook or a one-off script is overkill, and pasting sensitive data into an unknown web tool is a risk. Our free data and analytics tools online run client-side in your browser — no account, no upload, no logging — so you can work with production-shaped data safely. The collection covers JSON formatting and validation, data format conversion, log and user-agent parsing, and analytics utilities. Each tool is built for the reality of messy real-world data: malformed JSON, inconsistent encodings, and edge cases that break naive parsers. You get fast, accurate results without exposing the data you're inspecting.",
    useCases: [
      {
        title: "API and backend debugging",
        description:
          "Format and validate JSON responses to spot the missing comma or unclosed bracket that broke a parse. Pretty-print a 2,000-character single-line payload into a readable tree so you can find the field you need without scrolling horizontally.",
      },
      {
        title: "Log analysis and monitoring",
        description:
          "Parse user-agent strings to identify which browsers and bots hit your site, extract structured fields from log lines, and analyse response patterns. User-agent parsing is notoriously unreliable for version detection — the tools flag what's trustworthy versus what's spoofable.",
      },
      {
        title: "Data engineering and ETL",
        description:
          "Convert between JSON, CSV, and YAML during pipeline development, validate data against a schema before ingestion, and inspect data types to catch inference problems early. Catching a type mismatch here prevents a failed load downstream.",
      },
      {
        title: "QA and data validation",
        description:
          "Compare an API response against a known-good snapshot, validate that required fields are present and correctly typed, and confirm that an export matches its specification before it ships to a customer or partner.",
      },
    ],
    faqs: [
      {
        question: "Is my data sent to a server when I use these tools?",
        answer:
          "No. JSON formatting, validation, format conversion, and parsing all run locally in your browser using client-side JavaScript. Your data never leaves your device, which is essential when you're inspecting production payloads, customer data, or anything sensitive.",
      },
      {
        question: "How does the JSON validator report errors?",
        answer:
          "The validator runs the same parsing logic as the native JSON.parse(), pinpointing the line and character where parsing fails — typically a trailing comma, an unquoted key, or a single quote where JSON requires double quotes. It distinguishes a syntax error from valid-but-unexpected structure.",
      },
      {
        question: "Why is user-agent version detection unreliable?",
        answer:
          "User-agent strings are historically full of compatibility lies — every browser claims to be 'Mozilla', and many spoof other browsers' tokens for compatibility. Browser family and OS are reasonably reliable; exact version numbers and device detection are easily spoofed and should not be trusted for security decisions.",
      },
      {
        question: "Can these tools handle large JSON files?",
        answer:
          "Yes, within your browser's memory limits. Files up to several megabytes format and validate near-instantly on a modern device. Extremely large files (hundreds of MB) may be slow or hit memory limits — for those, a streaming command-line tool is more appropriate.",
      },
      {
        question: "What data formats can I convert between?",
        answer:
          "Common conversions include JSON to and from CSV, YAML, and XML. Each conversion notes what's preserved and what's lost — for example, YAML comments and anchors don't exist in JSON, and CSV has no nested structure, so deep JSON objects must be flattened.",
      },
      {
        question: "Does converting JSON to CSV lose information?",
        answer:
          "It can. CSV is a flat, tabular format with no concept of nested objects or arrays. Deeply nested JSON must be flattened (using dotted keys) or it can't be represented faithfully. The conversion is lossless only for already-flat, array-of-objects JSON.",
      },
    ],
  },

  finance: {
    h1: "Free Financial & Business Calculators Online — No Sign-Up Required",
    intro:
      "Financial decisions hinge on numbers that are easy to get wrong by hand: the difference between markup and margin, how compound interest snowballs over years, what a loan actually costs once interest is included. Our free financial and business calculators online give you accurate, instant answers in the browser — no account, no spreadsheet, and nothing about your finances sent to a server. The collection covers profit and margin calculations, interest (simple and compound), loan and payment maths, ROI and break-even analysis, tax and pricing, and SaaS metrics like MRR, LTV, and CAC. Each calculator uses the standard financial formula and shows enough of its working that you can trust — and verify — the result. Whether you're pricing a product, evaluating an investment, or modelling a startup's runway, the maths is done correctly so you can focus on the decision.",
    useCases: [
      {
        title: "Founders and small business owners",
        description:
          "Calculate gross and net profit margins, work out break-even points, and price products with the correct markup. Markup and margin are not the same: a 50% markup on a $10 cost gives a $15 price, which is only a 33% margin — confusing them erodes profit.",
      },
      {
        title: "Investors and savers",
        description:
          "Model compound interest to see how an investment grows over time, calculate ROI and annualised returns, and compare scenarios. Compound interest is why starting early matters: the difference between 7% compounded over 10 versus 30 years is dramatic.",
      },
      {
        title: "Loan and mortgage planning",
        description:
          "Work out monthly payments, total interest paid over a loan term, and how extra payments shorten the schedule. Seeing the total interest — not just the monthly figure — reframes whether a loan is worth it.",
      },
      {
        title: "SaaS and subscription businesses",
        description:
          "Calculate MRR and ARR, customer lifetime value (LTV), customer acquisition cost (CAC), and the LTV:CAC ratio. A healthy SaaS business generally targets an LTV:CAC of 3:1 or better, and these calculators make the ratio explicit.",
      },
    ],
    faqs: [
      {
        question: "What's the difference between markup and margin?",
        answer:
          "Markup is the percentage added to cost; margin is the percentage of the selling price that is profit. A product costing $10 sold at $15 has a 50% markup ($5/$10) but a 33% margin ($5/$15). Pricing tools that confuse the two systematically under- or over-charge.",
      },
      {
        question: "How is compound interest different from simple interest?",
        answer:
          "Simple interest is calculated only on the original principal. Compound interest is calculated on the principal plus all previously accumulated interest, so it grows faster. Over long periods the difference is large — this is the core reason long-term investing and early saving are so powerful.",
      },
      {
        question: "Is my financial data stored or sent anywhere?",
        answer:
          "No. All calculations run locally in your browser. The numbers you enter — salaries, loan amounts, investment figures — never leave your device and are not logged. This makes the calculators safe to use with real, sensitive financial figures.",
      },
      {
        question: "What is a good LTV:CAC ratio for SaaS?",
        answer:
          "A commonly cited benchmark is 3:1 — a customer should generate at least three times their acquisition cost over their lifetime. Below 1:1 you lose money on every customer; far above 3:1 may mean you're underinvesting in growth. The calculator computes the ratio from your inputs.",
      },
      {
        question: "Do the loan calculators show total interest paid?",
        answer:
          "Yes. Beyond the monthly payment, the loan calculator shows the total amount repaid and the total interest paid over the full term. This is often the more revealing number — a low monthly payment over a long term can mean paying far more in interest overall.",
      },
      {
        question: "Are tax calculations accurate for my country?",
        answer:
          "The tax and VAT/GST calculators apply the rate you enter, so they're accurate for any jurisdiction once you supply the correct rate. They don't hard-code country-specific brackets, which keeps them flexible and current — you control the rate, the tool does the arithmetic.",
      },
    ],
  },

  engineering: {
    h1: "Free Engineering Calculators Online — No Sign-Up Required",
    intro:
      "Engineering calculations demand precision and the correct formula — a misremembered Ohm's law rearrangement or a wrong unit prefix can damage hardware or fail a design review. Our free engineering calculators online give you accurate results in the browser, with no account and no data leaving your device. The collection covers electrical calculations (Ohm's law, resistor values and colour codes, voltage dividers, power dissipation), unit conversions specific to engineering work, and technical maths used by makers, students, and professional engineers. Each calculator uses the established physical formula and standard constants, and shows the relationship being computed so you can sanity-check the result against your own intuition. Whether you're sizing a current-limiting resistor for an LED, decoding a resistor's colour bands, or converting between power units, the tool removes arithmetic error from the equation so you can trust the number.",
    useCases: [
      {
        title: "Electronics hobbyists and makers",
        description:
          "Calculate the current-limiting resistor for an LED (using the supply voltage, the LED's forward voltage, and desired current), decode resistor colour bands, and work out voltage-divider outputs. These are the calculations that come up constantly in Arduino and Raspberry Pi projects.",
      },
      {
        title: "Electrical engineering students",
        description:
          "Apply Ohm's law in any direction (V=IR and its rearrangements), calculate power dissipation (P=VI=I²R), and check series and parallel resistor combinations. The calculators show the formula used so they reinforce learning rather than just giving an answer.",
      },
      {
        title: "Professional engineers and technicians",
        description:
          "Verify component values during design, convert between power units (watts, horsepower, kW), and run quick sanity checks before committing to a design. Catching an order-of-magnitude error here is far cheaper than discovering it in a prototype.",
      },
      {
        title: "Field work and repair",
        description:
          "Decode resistor colour codes when the markings are all you have, calculate replacement component values, and convert units on the fly. Useful when you're at the bench without a reference chart to hand.",
      },
    ],
    faqs: [
      {
        question: "How do I calculate the right resistor for an LED?",
        answer:
          "Use R = (V_supply − V_forward) / I_LED. For a typical red LED (2V forward voltage, 20mA) on a 5V supply: R = (5 − 2) / 0.02 = 150 ohms. Round up to the nearest standard value (often 220 ohms) to stay safely within the LED's current limit. The calculator does this for you.",
      },
      {
        question: "What are the forms of Ohm's law?",
        answer:
          "Ohm's law is V = I × R, which rearranges to I = V / R and R = V / I. Combined with power (P = V × I), you can derive P = I² × R and P = V² / R. The calculators let you solve for whichever variable you're missing.",
      },
      {
        question: "How do I read a resistor colour code?",
        answer:
          "Standard 4-band resistors use the first two bands as significant digits, the third as a multiplier, and the fourth as tolerance. For example, brown-black-red-gold is 1, 0, ×100, ±5% = 1,000 ohms (1k) ±5%. The colour-code calculator decodes 4-, 5-, and 6-band resistors.",
      },
      {
        question: "Are the calculations precise enough for real designs?",
        answer:
          "The calculators use exact formulas and full floating-point precision, so the maths is reliable. For real designs, remember to account for component tolerances (resistors are commonly ±5% or ±1%), temperature effects, and power ratings — the calculator gives the ideal value, and you add the engineering margin.",
      },
      {
        question: "Can I convert between watts and horsepower?",
        answer:
          "Yes. 1 mechanical horsepower equals about 745.7 watts, and 1 metric horsepower equals about 735.5 watts. The power converter handles watts, kilowatts, and both horsepower definitions, which matters because motor specs use different conventions in different regions.",
      },
      {
        question: "Is my data sent anywhere?",
        answer:
          "No. All engineering calculations run locally in your browser using client-side JavaScript. Nothing you enter is transmitted or stored, so the tools work offline once the page has loaded.",
      },
    ],
  },

  education: {
    h1: "Free Education & Learning Tools Online — No Sign-Up Required",
    intro:
      "Studying and teaching involve a lot of small, repeated tasks: counting words for an assignment, checking reading level, converting units for a science problem, or generating practice material. Our free education and learning tools online help students, teachers, and lifelong learners with these tasks directly in the browser — no account, no subscription, and nothing uploaded. The collection brings together text analysis, calculators, converters, and study aids drawn from across the site, chosen because they solve genuine classroom and homework problems. Each tool is designed to support understanding, not replace it: calculators show the method, text tools report the underlying counts, and converters display the factors used. Whether you're a student working through coursework, a teacher preparing materials, or someone learning a new subject, these tools remove busywork so you can focus on the actual learning.",
    useCases: [
      {
        title: "Students and homework",
        description:
          "Count words and characters against assignment limits, check the reading level of your writing, convert units for maths and science problems, and verify calculations. The word counter reports sentences and estimated reading time alongside the word count.",
      },
      {
        title: "Teachers and educators",
        description:
          "Prepare and check materials — verify that a handout's reading level suits the grade, generate placeholder or practice text, and produce clear examples. Reading-level checks help match content difficulty to your students' level.",
      },
      {
        title: "Language and writing practice",
        description:
          "Analyse text complexity, count words for essay practice, and check writing against length and readability targets. Seeing the numbers helps learners develop an intuition for pacing and structure in their writing.",
      },
      {
        title: "STEM and problem solving",
        description:
          "Convert between units, compute percentages and ratios, switch number bases for computer science, and check arithmetic. Because the calculators show their working, they help reinforce the underlying method rather than just delivering an answer.",
      },
    ],
    faqs: [
      {
        question: "Are these education tools free for students and teachers?",
        answer:
          "Yes — every tool is permanently free, with no account, trial, or subscription. They're supported by non-intrusive advertising, which keeps them free for classrooms, individual students, and self-learners alike.",
      },
      {
        question: "How does the reading-level check work?",
        answer:
          "Readability is estimated using established formulas (such as Flesch–Kincaid) that combine sentence length and word complexity into a grade level or ease score. Shorter sentences and simpler words yield a lower grade level. It's a useful guide for matching text to an audience, not an absolute measure of quality.",
      },
      {
        question: "Can students use the word counter for essays?",
        answer:
          "Yes. It reports word count, character count (with and without spaces), sentence and paragraph counts, and estimated reading time at about 200 words per minute — everything needed to meet essay and assignment requirements. Counting matches how most platforms tally words.",
      },
      {
        question: "Is my work stored or seen by anyone?",
        answer:
          "No. All analysis happens locally in your browser. The text you paste and the numbers you enter are never transmitted to a server or stored, so the tools are safe to use with unpublished schoolwork and private notes.",
      },
      {
        question: "Do the calculators show how the answer is reached?",
        answer:
          "Where it aids learning, yes — unit converters show the conversion factor, percentage tools separate the different percentage operations, and number-base converters make the place values visible. The goal is to support understanding, not just hand over a result.",
      },
      {
        question: "Do these tools work on a school Chromebook?",
        answer:
          "Yes. They run in any modern browser, including the Chrome browser on school-issued Chromebooks, with no installation or admin permissions required. Most tools also work offline after the first load.",
      },
    ],
  },

  astronomy: {
    h1: "Free Astronomy & Space Tools Online — No Sign-Up Required",
    intro:
      "Astronomy involves numbers and scales that defy everyday intuition: distances measured in light-years, planetary data spanning orders of magnitude, and unit systems (astronomical units, parsecs, solar masses) you rarely meet elsewhere. Our free astronomy and space tools online help students, educators, and enthusiasts work with these in the browser — no account, no subscription, nothing uploaded. The collection brings together calculators and converters for astronomical units and distances, planetary and orbital data, and space-related conversions, alongside educational references that put cosmic scales into perspective. Each tool uses accepted scientific constants (the speed of light, the astronomical unit, standard gravitational parameters) and shows the relationships involved, so the results are both accurate and instructive. Whether you're doing astronomy coursework, preparing a lesson, or simply curious about how far a light-year really is, these tools make the maths of the cosmos accessible.",
    useCases: [
      {
        title: "Astronomy students",
        description:
          "Convert between astronomical units, light-years, and parsecs, work with planetary data, and apply orbital relationships in coursework. The converters use the defined values (1 AU = 149,597,870.7 km exactly; 1 light-year ≈ 9.46 trillion km) so your answers match textbook figures.",
      },
      {
        title: "Teachers and science communicators",
        description:
          "Build intuition for cosmic scale by converting unimaginable distances into relatable comparisons, and prepare accurate figures for lessons and presentations. Concrete numbers — light from the Sun takes about 8 minutes 20 seconds to reach Earth — make abstract scales stick.",
      },
      {
        title: "Amateur astronomers and enthusiasts",
        description:
          "Look up and convert planetary and stellar data, calculate distances and scales, and satisfy curiosity about the numbers behind the night sky. Useful for planning observations and understanding what you're looking at.",
      },
      {
        title: "Science and STEM projects",
        description:
          "Use accurate astronomical constants and conversions for school projects, models, and reports. Because the tools show the constants and relationships used, they double as a learning reference, not just a calculator.",
      },
    ],
    faqs: [
      {
        question: "How far is a light-year in kilometres?",
        answer:
          "A light-year is the distance light travels in one year in a vacuum: about 9.46 trillion kilometres (9.46 × 10^12 km), or roughly 63,241 astronomical units. The converter handles light-years, AU, parsecs, and kilometres so you can move between the scales used in different contexts.",
      },
      {
        question: "What is an astronomical unit (AU)?",
        answer:
          "One astronomical unit is the average distance from the Earth to the Sun, defined exactly as 149,597,870.7 kilometres. It's the natural unit for distances within the Solar System — Jupiter is about 5.2 AU from the Sun, Neptune about 30 AU.",
      },
      {
        question: "How long does sunlight take to reach Earth?",
        answer:
          "About 8 minutes and 20 seconds. Since the Sun is roughly 1 AU (about 150 million km) away and light travels at about 299,792 km/s, the light you see left the Sun's surface over eight minutes ago — a vivid illustration of how astronomical distances translate into time.",
      },
      {
        question: "What's the difference between a light-year and a parsec?",
        answer:
          "Both measure distance. A light-year is based on the speed of light over a year. A parsec is based on parallax geometry and equals about 3.26 light-years. Professional astronomers favour parsecs (and kiloparsecs, megaparsecs) because they relate directly to measured parallax angles.",
      },
      {
        question: "Are the astronomical constants accurate?",
        answer:
          "Yes. The tools use internationally accepted values — the IAU-defined astronomical unit, the exact speed of light (299,792,458 m/s), and standard planetary parameters. Results match the figures used in textbooks and professional references.",
      },
      {
        question: "Are these tools free and private?",
        answer:
          "Yes. Every astronomy tool is free with no account required, and all calculations run locally in your browser — nothing you enter is uploaded or stored. They also work offline once the page has loaded.",
      },
    ],
  },
}

export function getCategoryHubContent(categoryId: string): CategoryHubContent | null {
  return categoryHubContent[categoryId] ?? null
}

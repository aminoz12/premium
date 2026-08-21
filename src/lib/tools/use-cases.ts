export type UseCaseConfig = {
  slug: string
  metaTitle: string
  h1: string
  keyword: string
  intro: string
  body: string
  tip: string
  faqs: { question: string; answer: string }[]
  relatedToolIds: string[]
}

export const USE_CASES: Record<string, UseCaseConfig[]> = {
  "image-compressor": [
    {
      slug: "for-whatsapp",
      metaTitle: "Compress Image for WhatsApp — Free Online, No Sign-Up",
      h1: "Compress Image for WhatsApp — Free Online",
      keyword: "compress image for whatsapp",
      intro:
        "WhatsApp automatically recompresses any photo you send, often reducing quality to the point where text becomes blurry and colours look washed out. The fix is to compress the image yourself — to the right size — before sending, so WhatsApp's own compression pass has less destructive work to do. Our free image compressor runs entirely in your browser: select your photo, set a target quality or file size, and download the compressed version in seconds. No upload to any server, no account required. For WhatsApp, the sweet spot is under 500 KB at 80% quality — the resulting file is small enough to send quickly even on a slow connection, yet sharp enough that recipients can read any text clearly.",
      body:
        "WhatsApp's built-in compression caps images at roughly 1600 × 1200 pixels and drops quality aggressively when the original is over 1 MB. By pre-compressing to under 500 KB you retain full control: you choose the quality level, the dimensions, and the format. JPEG at 80% quality typically reduces a 3 MB phone photo to around 300–400 KB with no visible degradation at normal viewing size. PNG is better only if the image contains flat colour or transparent areas — otherwise, use JPEG for photos every time.",
      tip: "For WhatsApp, target 500 KB or less at 80% JPEG quality. This passes WhatsApp's threshold without triggering its secondary compression.",
      faqs: [
        {
          question: "Why does WhatsApp make my photos blurry?",
          answer:
            "WhatsApp recompresses images above its internal size limit to reduce bandwidth. Pre-compressing to under 500 KB before sending gives WhatsApp less to compress, resulting in a sharper delivered image.",
        },
        {
          question: "What is the best image format for WhatsApp?",
          answer:
            "JPEG is best for photos. It achieves the smallest file size at acceptable quality. PNG is only preferable for screenshots, logos, or images with large areas of solid colour where JPEG artefacts would be visible.",
        },
        {
          question: "Does this compressor upload my images to a server?",
          answer:
            "No. All compression runs locally in your browser using the Canvas API. Your images never leave your device, making this safe for personal or sensitive photos.",
        },
      ],
      relatedToolIds: ["color-picker", "qr-code-generator"],
    },
    {
      slug: "for-instagram",
      metaTitle: "Compress Image for Instagram — Free Online, No Sign-Up",
      h1: "Compress Image for Instagram — Free Online",
      keyword: "compress image for instagram",
      intro:
        "Instagram resamples photos to a maximum of 1080 pixels on the longest side and applies its own JPEG compression, which can introduce colour banding and noise in areas of smooth gradient. The best practice before posting is to resize your image to exactly 1080 × 1080 pixels (square), 1080 × 1350 (portrait), or 1080 × 566 (landscape) and compress it to under 1 MB at 90% quality. This way Instagram's second-pass compression has nothing to do and your posted image looks identical to what you exported. Our free compressor handles this entirely in your browser — no account, no watermarks, no upload limits. Choose your target dimensions, set quality to 90%, download, and post.",
      body:
        "Instagram's algorithm also considers engagement rate, and a visually sharp photo outperforms a blurry one regardless of caption quality. The formats Instagram accepts are JPEG, PNG, and HEIC — but JPEG is the most predictable because Instagram's internal processing pipeline is optimised for it. Keep colour profile as sRGB: images with a P3 or Adobe RGB profile often look desaturated on Android devices because Instagram strips the embedded profile. Our compressor outputs standard sRGB JPEG, so what you see in preview is what followers see.",
      tip: "Export at 1080 × 1080 (or 1080 × 1350 for portrait), quality 90%, sRGB JPEG, under 1 MB. This is the exact spec that defeats Instagram's recompression.",
      faqs: [
        {
          question: "What size should an Instagram post image be?",
          answer:
            "1080 × 1080 px for square, 1080 × 1350 px for portrait (4:5 ratio), and 1080 × 566 px for landscape. Instagram downscales anything larger to these dimensions, so uploading larger wastes bandwidth without improving quality.",
        },
        {
          question: "How do I stop Instagram from reducing image quality?",
          answer:
            "Resize to 1080 px wide and compress to under 1 MB at 90% JPEG quality before uploading. Instagram then has nothing to compress further and the posted image matches your original.",
        },
        {
          question: "Should I use JPEG or PNG for Instagram?",
          answer:
            "JPEG for photos and illustrations with gradients. PNG only for images with large areas of flat colour or hard edges where JPEG compression artefacts (blockiness) would be visible.",
        },
      ],
      relatedToolIds: ["color-picker", "color-contrast-checker"],
    },
    {
      slug: "for-email",
      metaTitle: "Compress Image for Email — Free Online, No Sign-Up",
      h1: "Compress Image for Email — Free Online",
      keyword: "compress image for email",
      intro:
        "Most email clients have a file-size limit for attachments: Gmail caps individual attachments at 25 MB, Outlook at 20 MB, and many corporate mail servers reject messages over 10 MB. Even within those limits, large images slow down email delivery, fill up recipient inboxes, and display slowly on mobile connections. The practical target for an image attachment is under 500 KB — small enough to load instantly in a preview pane on a 4G connection. Our free browser-based image compressor reduces JPEG, PNG, and WebP files to your chosen target size in seconds, with no upload to any server and no account required. Paste, compress, download, attach.",
      body:
        "For inline images embedded directly in HTML email (not attachments), the guideline is stricter: under 100 KB per image to keep total email size under 500 KB, which is the threshold above which many spam filters penalise delivery. Compress hero images to 600 px wide (the standard email width) at 75% JPEG quality. Icons and logos below 200 × 200 px can use PNG with lossless compression. Avoid embedding large images in the email body — link to a hosted version instead and use a compressed thumbnail inline.",
      tip: "Aim for under 500 KB for attachments, under 100 KB for inline email images. Resize to 600 px wide before compressing — that matches the standard email client display width.",
      faqs: [
        {
          question: "What is the maximum image size for email attachments?",
          answer:
            "Gmail: 25 MB. Outlook: 20 MB. Most corporate mail servers: 10 MB. In practice, keep individual image attachments under 1 MB so the email loads quickly on mobile and does not trigger spam filters.",
        },
        {
          question: "How do I compress an image for email without losing quality?",
          answer:
            "Resize to 600 px wide (email display width) and compress at 80% JPEG quality. At that quality level on a 600 px wide image, quality loss is invisible to most viewers while file size drops 70–85% versus the original.",
        },
        {
          question: "Can I compress a PNG for email?",
          answer:
            "Yes. Use lossless PNG compression for logos and flat-colour graphics. For photos, convert to JPEG first — JPEG achieves 5–10× smaller file sizes than PNG for photographic content.",
        },
      ],
      relatedToolIds: ["qr-code-generator", "meta-tags"],
    },
    {
      slug: "for-website",
      metaTitle: "Compress Image for Website — Free Online, No Sign-Up",
      h1: "Compress Image for Website — Free Online",
      keyword: "compress image for website",
      intro:
        "Images are the largest contributor to page weight on most websites. A single uncompressed hero image can be 3–8 MB, which pushes Largest Contentful Paint (LCP) above 4 seconds on mobile — a direct Google ranking penalty. The target for web images is under 200 KB for above-the-fold images and under 500 KB for everything else. Our free image compressor converts to WebP (the format Chrome, Firefox, and Safari now all support natively), JPEG, or PNG, at any quality level you choose, entirely in your browser with no server upload. Reducing your hero image from 3 MB to 150 KB WebP can improve LCP by 1–2 seconds, directly improving Google rankings and Core Web Vitals scores.",
      body:
        "The format hierarchy for the web: WebP first (25–34% smaller than equivalent-quality JPEG), then JPEG for browsers that don't support WebP (rare in 2026), then PNG only for images that need transparency. For a CMS like WordPress or Webflow, compress before uploading — the CMS resizer creates multiple sizes from your original, so uploading a 200 KB WebP produces thumbnails that are 20–50 KB each. For a Next.js site, the next/image component handles WebP conversion automatically, but you should still compress originals to under 500 KB to stay within edge-function memory limits.",
      tip: "Convert to WebP at 80% quality and resize to your display width ×2 (for retina). A 1200 px wide hero at 80% WebP quality is typically 80–150 KB — fast enough for a sub-2-second LCP.",
      faqs: [
        {
          question: "What image format is best for websites in 2026?",
          answer:
            "WebP is the best choice: 25–34% smaller than JPEG at equivalent quality, and supported by all modern browsers. Use AVIF for even smaller files if your target audience is mostly on Chrome. Fall back to JPEG for older browser compatibility.",
        },
        {
          question: "How does image compression affect SEO?",
          answer:
            "Smaller images reduce page load time, which improves LCP (Largest Contentful Paint) — a Core Web Vitals metric Google uses as a ranking signal. Pages with LCP under 2.5 seconds rank better than pages with LCP above 4 seconds, all else being equal.",
        },
        {
          question: "What quality level should I use for website images?",
          answer:
            "80% JPEG or WebP quality is the industry standard for web images. At 80%, the quality loss is invisible at normal screen viewing distances, while file size drops 50–70% versus 100% quality.",
        },
      ],
      relatedToolIds: ["color-contrast-checker", "meta-tags"],
    },
    {
      slug: "for-google-docs",
      metaTitle: "Compress Image for Google Docs — Free Online, No Sign-Up",
      h1: "Compress Image for Google Docs — Free Online",
      keyword: "compress image for google docs",
      intro:
        "Google Docs has a 50 MB limit per file, and large embedded images are almost always the cause when a document grows beyond that. Google also recompresses images when you share or export a Doc to PDF, sometimes reducing quality noticeably. By compressing images before pasting them into your document, you control the quality and keep file size predictable. Our free image compressor works entirely in your browser: compress the image to your desired size, copy it, and paste it directly into Google Docs. For most document images — diagrams, screenshots, product photos — 800 px wide at 85% JPEG quality keeps them sharp in a printed or PDF version while adding under 100 KB per image to the document.",
      body:
        "Google Docs also has a built-in compression setting: Insert → Image → More image options → and there's a 'Compress' checkbox when you resize. But this applies Docs' own compression algorithm, which you can't control. Pre-compressing gives you a predictable result. For screenshots — the most common pasted image type — use PNG lossless compression rather than JPEG because screenshots contain sharp text edges where JPEG compression creates visible artefacts. For photos embedded in a report or proposal, JPEG at 85% quality and 800 px wide is the right balance between print sharpness and file size.",
      tip: "For screenshots and text-heavy images, use PNG lossless. For photos in a document, use JPEG at 85% quality, resized to 800 px wide. This keeps documents under 10 MB even with 20+ images.",
      faqs: [
        {
          question: "How do I reduce the file size of a Google Doc with images?",
          answer:
            "Compress images before inserting them. Select your images in the compressor, reduce to 85% JPEG quality and 800 px width, then paste the compressed versions into the Doc. You can also use File → Download → PDF (optimised) to reduce the exported PDF size.",
        },
        {
          question: "What is the maximum file size for Google Docs?",
          answer:
            "Google Docs has a 50 MB limit per file. Uncompressed images are almost always the cause when a document grows beyond this limit. Compressing images before insertion typically reduces a bloated document by 80–90%.",
        },
        {
          question: "Does compressing images in Google Docs reduce quality?",
          answer:
            "Only if you let Google compress them. Pre-compressing at 85% JPEG quality yourself produces a better result than letting Docs apply its own algorithm, because you control the quality level and output dimensions.",
        },
      ],
      relatedToolIds: ["word-counter", "diff-checker"],
    },
  ],

  "qr-code-generator": [
    {
      slug: "for-wifi",
      metaTitle: "QR Code for WiFi — Free Generator, No Sign-Up",
      h1: "QR Code for WiFi — Free Generator",
      keyword: "qr code for wifi",
      intro:
        "A WiFi QR code lets anyone connect to your network instantly by scanning — no typing a password. When a guest scans your WiFi QR code with their iPhone or Android camera, the phone asks if they want to join the network. One tap and they're connected, with the correct SSID and password pre-filled. Our free QR code generator creates a properly formatted WiFi QR code from your network name (SSID), password, and security type (WPA2, WPA3, or open). The resulting code works with every modern smartphone without installing any app. Download as PNG for printing, or SVG for sharp reproduction at any size on a label, card, or framed print.",
      body:
        "The format for a WiFi QR code is standardised: WIFI:T:WPA;S:YourNetworkName;P:YourPassword;; — our generator handles this encoding automatically so you just fill in the fields. For WPA2/WPA3 networks (the most common), select WPA as the security type. For open networks (no password), select None and leave the password blank. After generating, test the code with your own phone before printing. If the SSID contains special characters like a colon or semicolon, the generator escapes them correctly. Print at a minimum of 2.5 × 2.5 cm (1 inch) for reliable scanning from a standard distance.",
      tip: "Print the WiFi QR code at 1 inch minimum size and laminate it. Place it near the entrance or on the table — guests scan once and never ask for the password again.",
      faqs: [
        {
          question: "How do I create a QR code for my WiFi network?",
          answer:
            "Enter your network name (SSID), password, and security type (WPA2 for most home networks) in the generator, click Generate, and download the PNG. Share it digitally or print it. Guests scan it with their phone camera and connect instantly.",
        },
        {
          question: "Does a WiFi QR code expose my password?",
          answer:
            "Anyone who scans the code can join your network, but the password itself is not displayed — only encoded. The code is as secure as sharing your password verbally. For guest networks, consider generating a separate QR code for a guest WiFi network with limited access.",
        },
        {
          question: "Do WiFi QR codes work on iPhone without an app?",
          answer:
            "Yes. iOS 11 and later (released 2017) support WiFi QR codes natively in the Camera app. No third-party app is needed. Open Camera, point at the code, and tap the notification banner to join.",
        },
      ],
      relatedToolIds: ["url-encoder", "password-generator"],
    },
    {
      slug: "for-business-card",
      metaTitle: "QR Code for Business Card — Free Generator, No Sign-Up",
      h1: "QR Code for Business Card — Free Generator",
      keyword: "qr code for business card",
      intro:
        "Adding a QR code to your business card turns a static piece of paper into a live link — to your LinkedIn profile, portfolio, website, or a digital vCard that adds your contact directly to the recipient's phone. A business card QR code should be at least 1.5 cm × 1.5 cm (0.6 inches) to scan reliably. Download the code as SVG from our generator for print-quality output that stays sharp at any size, or PNG at 1000 × 1000 pixels if your printer requires a raster format. The code encodes whatever URL or text you choose: a personal site, a booking page, or a vCard data string. Test the printed code before ordering a full print run.",
      body:
        "For a contact card (vCard), the QR code encodes a VCARD 3.0 string with your name, phone, email, and URL. When scanned, iOS and Android both prompt the user to save the contact — no app required. Our generator accepts plain URLs, phone numbers (tel:), email addresses (mailto:), and raw text. For business cards going to international contacts, include the country code in your phone number (+1, +44, etc.) so the tel: link works globally. Choose a high error-correction level (H) if you plan to print the code on a dark or textured background — this adds redundancy that allows the code to scan even if 30% of the surface is damaged.",
      tip: "Export as SVG for business card printing. Select error-correction level H if printing on a coloured or textured background. Minimum print size: 1.5 × 1.5 cm.",
      faqs: [
        {
          question: "What should a business card QR code link to?",
          answer:
            "The most useful destinations are: your LinkedIn profile (for networking events), your personal or company website (for general use), a digital vCard (for contacts who want to save your details immediately), or a Calendly booking page (for sales and consulting). Choose based on who you hand the card to.",
        },
        {
          question: "How big should a QR code be on a business card?",
          answer:
            "Minimum 1.5 × 1.5 cm (0.6 inches) for reliable scanning. Larger is better — 2 × 2 cm (0.8 inches) is comfortable on a standard business card without dominating the design. Leave a white quiet zone of at least 4 modules around the code.",
        },
        {
          question: "Can I customise the colours of a business card QR code?",
          answer:
            "Yes — you can use a dark foreground on a light background, or brand colours, as long as the contrast ratio between foreground and background is at least 4:1. Avoid light-on-dark codes (they scan less reliably). Test any coloured code before printing.",
        },
      ],
      relatedToolIds: ["color-picker", "url-encoder"],
    },
    {
      slug: "for-restaurant",
      metaTitle: "QR Code for Restaurant Menu — Free Generator, No Sign-Up",
      h1: "QR Code for Restaurant Menu — Free Generator",
      keyword: "qr code for restaurant menu",
      intro:
        "A restaurant menu QR code lets diners scan to view your full menu on their phone — no printed menus to sanitise, no out-of-date inserts to reprint when prices change. The code links to your online menu URL: a dedicated menu page on your website, a Google Drive PDF, a Canva menu published as a link, or a menu platform like Square or Toast. Our generator creates the code instantly: enter the URL, click Generate, and download SVG for table tents and signage, or PNG for quick prints. Update the linked page any time the menu changes — the QR code itself stays the same, so you never reprint the codes just because a dish changed.",
      body:
        "For the best scan experience at a restaurant table, print the code at 5 × 5 cm (2 inches) minimum and laminate it on a table tent or menu stand. Use a white or very light background — codes on dark backgrounds require higher error correction and scan less reliably. If your menu is a PDF, host it on Google Drive or Dropbox and set sharing to 'Anyone with link can view'. For accessibility, add a short URL or QR code description below the code: 'Scan to view menu' in the primary language of your dining room. Consider creating separate codes for food and drinks menus if you want to track which one gets more scans via URL parameters.",
      tip: "Link to a mobile-optimised page, not a large PDF. A PDF menu on mobile requires zoom and scroll; an HTML menu page with large text is faster and easier to read.",
      faqs: [
        {
          question: "How do I create a QR code for my restaurant menu?",
          answer:
            "Publish your menu as a URL (website, Google Drive, or Canva link), enter the URL in the generator, click Generate, and download. Print at 5 × 5 cm or larger. When you update the menu, update the linked page — the QR code never changes.",
        },
        {
          question: "Do customers need an app to scan a restaurant QR code?",
          answer:
            "No. iPhones (iOS 11+) and Android phones (Android 9+) scan QR codes directly with the built-in camera app. No additional app or account is needed. The camera shows a notification banner that opens the menu URL.",
        },
        {
          question: "How often do I need to reprint restaurant QR codes?",
          answer:
            "Never, if you keep the linked URL the same. Update the menu content on your website or hosted page and the QR code automatically points to the new content. Only reprint if the physical code is damaged or if you change the linked URL.",
        },
      ],
      relatedToolIds: ["url-encoder", "image-compressor"],
    },
    {
      slug: "for-instagram",
      metaTitle: "Instagram QR Code — Free Generator, No Sign-Up",
      h1: "Instagram QR Code — Free Generator",
      keyword: "instagram qr code generator",
      intro:
        "An Instagram QR code links directly to your profile page, making it easy for people to follow you from business cards, flyers, packaging, or in-person events. When scanned, the phone opens Instagram directly to your profile (if the app is installed) or to the mobile web version. Our generator creates the code from your Instagram profile URL. Your Instagram profile URL is: instagram.com/yourusername. Enter that URL, generate the code, and download SVG for sharp print output. A minimum print size of 2 × 2 cm ensures reliable scanning across different phone cameras and lighting conditions. Add a call to action below the code: 'Follow us on Instagram' to make the purpose clear.",
      body:
        "Instagram natively generates QR codes inside the app (Profile → QR Code), but those codes only work inside the Instagram app — they don't open a web browser for users who haven't installed Instagram. Our generator creates a standard URL-based QR code that works universally: in the Instagram app for users who have it, and in any browser for everyone else. For marketing materials, place the code alongside your Instagram handle written in plain text — that way people who prefer to type rather than scan can still find you. Include your Instagram handle in the quiet zone label below the code: '@yourbrand'.",
      tip: "Use the format instagram.com/yourusername (not the app deeplink) so the code works for both app users and non-users.",
      faqs: [
        {
          question: "What URL do I use for an Instagram QR code?",
          answer:
            "Use https://instagram.com/yourusername — replace 'yourusername' with your actual Instagram handle. This URL works in any browser and also opens the Instagram app directly if installed.",
        },
        {
          question: "Where should I use an Instagram QR code?",
          answer:
            "Business cards, product packaging, store signage, flyers, event materials, email signatures, and presentation slides. Anywhere a physical or digital audience might see you in person and want to follow you without typing.",
        },
        {
          question: "Can I customise the colours of an Instagram QR code?",
          answer:
            "Yes. You can use Instagram's brand colours (gradient purple-orange on white background) or your own brand colours. Ensure the foreground-to-background contrast is at least 4:1 for reliable scanning.",
        },
      ],
      relatedToolIds: ["image-compressor", "color-picker"],
    },
    {
      slug: "for-event",
      metaTitle: "QR Code for Event — Free Generator, No Sign-Up",
      h1: "QR Code for Event — Free Generator",
      keyword: "qr code for event",
      intro:
        "An event QR code can link to your registration page, ticket verification URL, event schedule, venue map, or digital programme — letting attendees access information instantly without searching for the URL. For ticketing, a unique QR code per attendee can be scanned at the door to confirm registration. For general event information, a single code on posters and programmes links to your event website. Our generator creates codes for URLs, plain text, or any structured data you need to encode. Download SVG for large-format printing on banners and signage, or PNG for digital use in email invites and event apps.",
      body:
        "For attendee check-in, each unique ticket QR code should encode a unique identifier (booking ID or email hash) that your check-in system validates against a list. This is different from a single event-info QR code, which all attendees share. For a simple event, a URL pointing to a schedule page is sufficient. For conferences with multiple tracks, encode the URL with a session parameter so each room's QR code opens the correct track schedule. Print event QR codes at 5 × 5 cm minimum on posters and at 2.5 × 2.5 cm on programmes and name badges. Use high error-correction (H level) for outdoor events where lighting and angle vary.",
      tip: "For posters and outdoor signage, select error-correction level H and print at 10 × 10 cm or larger. Codes that pass the 'thumb-cover test' (cover 30% and still scan) are set up correctly.",
      faqs: [
        {
          question: "How do I use a QR code for event check-in?",
          answer:
            "Generate a unique QR code per attendee encoding their booking ID. Use a check-in app (Eventbrite, Google Forms, or a custom system) that scans the code and marks the attendee as arrived. Print or email unique codes to each registrant before the event.",
        },
        {
          question: "What should an event QR code link to?",
          answer:
            "For general use: your event registration or info page. For venue signage: the schedule or map. For check-in: a unique per-attendee identifier. For sponsors: the sponsor's landing page with a UTM parameter to track event referral traffic.",
        },
        {
          question: "How large should a QR code be on an event poster?",
          answer:
            "At least 5 × 5 cm (2 inches) for a standard A4 poster viewed from 30 cm. For A1 banners, 15 × 15 cm (6 inches) allows scanning from 1–2 metres. Use SVG format so the code is sharp at any print size.",
        },
      ],
      relatedToolIds: ["url-encoder", "color-picker"],
    },
  ],

  "word-counter": [
    {
      slug: "for-twitter",
      metaTitle: "Twitter Character Counter — Free Online, No Sign-Up",
      h1: "Twitter / X Character Counter — Free Online",
      keyword: "twitter character counter",
      intro:
        "Twitter (now X) limits standard tweets to 280 characters, with URLs always counting as 23 characters regardless of their actual length. Links, @mentions, and #hashtags all count toward the limit, but images and video attachments do not. Our word counter shows your character count in real time as you type or paste — so you know exactly how many characters you have left before hitting the limit. It also counts words, sentences, and paragraphs, which is useful for threads where you want consistent post lengths. Paste your draft tweet here, check the count, trim or expand, then copy and post.",
      body:
        "For Twitter threads, each tweet in the thread has its own 280-character limit. Write each tweet as a separate paragraph and count them individually. The character counter ignores line breaks, so you can write an entire thread separated by blank lines and check each section's length. For X Premium subscribers, the limit is 25,000 characters per post — the counter handles this too. Hashtags count as regular characters: #marketing = 11 characters. Mentions count normally: @username = 9 characters for a 7-character username. URLs always count as exactly 23 characters regardless of how long the actual link is.",
      tip: "Write your tweet, check the count, and aim for 220–250 characters — leaving room for a reply to add context or a retweet to add a comment.",
      faqs: [
        {
          question: "How many characters is a tweet on Twitter/X?",
          answer:
            "280 characters for standard accounts. 25,000 characters for X Premium subscribers. URLs always count as 23 characters regardless of actual length. Images, videos, and GIFs do not count toward the character limit.",
        },
        {
          question: "Do spaces count in Twitter's character limit?",
          answer:
            "Yes. Every character including spaces, punctuation, and line breaks counts toward the 280-character limit. Emojis typically count as 2 characters. URLs always count as 23 regardless of their length.",
        },
        {
          question: "How do hashtags count in Twitter's character limit?",
          answer:
            "Hashtags count as regular characters including the # symbol. #marketing = 11 characters, #SEO = 4 characters. There is no discount for hashtags — they consume exactly as many characters as they contain.",
        },
      ],
      relatedToolIds: ["lorem-ipsum", "diff-checker"],
    },
    {
      slug: "for-essay",
      metaTitle: "Word Counter for Essays — Free Online, No Sign-Up",
      h1: "Word Counter for Essays — Free Online",
      keyword: "word counter for essay",
      intro:
        "Most academic essays, college applications, and scholarship submissions have strict word limits. Going over by even one word can result in automatic disqualification in some systems, and submitting 20% below the minimum signals a failure to meet the assignment brief. Our word counter gives you a live word count, character count, sentence count, and paragraph count as you type or paste. For essay submissions, the word count is what matters: academic word counts typically count hyphenated compound words as one word, and contractions as one word. Our counter follows this standard — the same method used by Microsoft Word and Google Docs.",
      body:
        "For college essays with specific word limits (Common App: 650 words, UC application: 350 words per prompt, scholarship essays: typically 500–1,000 words), aim to land within 5% of the maximum — close to the limit, but under it. A 650-word essay that uses 640 words is fine; one that uses 580 words suggests you haven't fully developed your argument. For academic papers with page limits instead of word limits, the industry standard is 250 words per double-spaced page. A 5-page paper = approximately 1,250 words. For IELTS and TOEFL essays, the minimum is 150 words (Task 1) or 250 words (Task 2) — the counter shows instantly whether you've met the threshold.",
      tip: "Paste your full essay draft and check the count before final review. Aim for within 10 words of the maximum limit — it shows you used the full opportunity.",
      faqs: [
        {
          question: "How many words is a typical college application essay?",
          answer:
            "Common App: 250–650 words (hard maximum). UC application: 350 words per prompt. Coalition App: 500 words. Scholarship essays vary but are typically 250–1,000 words. Always check the specific prompt for the exact limit.",
        },
        {
          question: "Do citations count in an essay word count?",
          answer:
            "Usually not. Most academic style guides (APA, MLA, Chicago) exclude in-text citations and reference lists from the word count. However, footnotes (Chicago style) may or may not count — check your specific assignment rubric.",
        },
        {
          question: "How many words is a 5-page double-spaced essay?",
          answer:
            "Approximately 1,250 words, based on the standard of 250 words per double-spaced page at 12pt Times New Roman or 11pt Calibri. Single-spaced: approximately 500 words per page.",
        },
      ],
      relatedToolIds: ["diff-checker", "lorem-ipsum"],
    },
    {
      slug: "for-instagram",
      metaTitle: "Instagram Caption Character Counter — Free Online",
      h1: "Instagram Caption Character Counter — Free Online",
      keyword: "instagram caption character limit",
      intro:
        "Instagram captions can be up to 2,200 characters, but only the first 125 characters appear in the feed before the 'more' link. Everything after 125 characters requires a tap to expand — so your hook must fit in the first 125 characters. Our counter shows both your total caption length and the critical first-125-character threshold. Write your caption, paste it here, and see instantly whether your opening line lands within the visible preview. Hashtags in captions count as regular characters; 30 hashtags of average length add roughly 250–300 characters. Plan your hashtag strategy within the 2,200 total and leave room for a strong opening hook.",
      body:
        "Instagram also limits the number of hashtags to 30 per post. Research shows that 5–10 highly relevant hashtags typically outperform 30 generic ones in reach. For Reels captions, the same 2,200-character limit applies. For Stories, captions work differently — text overlays are not indexed by Instagram, so character count is less important there. For the bio (separate from captions), the limit is 150 characters. Use the counter to draft and trim your bio to fit exactly, with room for a clear CTA or link mention at the end.",
      tip: "Write your first-125-character hook first — that is what appears in the feed. Add context, hashtags, and calls to action after the visible threshold.",
      faqs: [
        {
          question: "How long can an Instagram caption be?",
          answer:
            "Instagram captions can be up to 2,200 characters. Only the first 125 characters are visible in the feed without tapping 'more'. The bio limit is separate at 150 characters.",
        },
        {
          question: "How many hashtags should I use in an Instagram caption?",
          answer:
            "Instagram allows up to 30 hashtags per post. In 2024–2026, Instagram's own guidance recommends 3–5 highly targeted hashtags over 30 generic ones. Too many hashtags can signal spam to the algorithm.",
        },
        {
          question: "Do spaces count in Instagram's character limit?",
          answer:
            "Yes. Every character including spaces, line breaks, punctuation, and emojis counts toward the 2,200-character caption limit. Emojis typically count as 1–2 characters each depending on the specific emoji.",
        },
      ],
      relatedToolIds: ["lorem-ipsum", "image-compressor"],
    },
    {
      slug: "for-seo",
      metaTitle: "Word Count for SEO — Free Online Counter, No Sign-Up",
      h1: "Word Count for SEO Content — Free Online",
      keyword: "word count for seo",
      intro:
        "Content length is not a direct Google ranking factor, but it correlates strongly with ranking position for competitive keywords. Analysis of top-ranking pages consistently shows that articles ranking on page 1 for competitive queries contain 1,500–2,500 words — long enough to cover a topic comprehensively, include natural keyword variations, and attract internal links. Our word counter gives you a live count as you write, along with character count, sentence count, paragraph count, and estimated reading time. Use it to benchmark your draft against the top-ranking competitor content before publishing. If competitors average 2,000 words and you publish 800, you are competing at a structural disadvantage on topic coverage.",
      body:
        "For blog posts, the recommended minimum for competitive keywords is 1,500 words. For long-form guides and pillar pages, 3,000–5,000 words is common among top-ranking content. However, word count without quality is irrelevant — thin content padded to 2,000 words ranks worse than a concise 800-word article that fully answers the query. The real SEO goal is topical completeness: covering every sub-question a searcher might have. Use the counter to track your draft, but validate against tools like Surfer SEO or Clearscope that measure topical depth rather than raw word count.",
      tip: "Check the word count of the top 3 competing pages for your target keyword. Aim to match or exceed the average while maintaining genuinely useful content.",
      faqs: [
        {
          question: "How many words should a blog post be for SEO?",
          answer:
            "1,500–2,500 words for competitive informational keywords. 800–1,200 for low-competition long-tail queries. 3,000–5,000 for pillar pages or comprehensive guides. Match the length of the top-ranking competitors rather than following a fixed rule.",
        },
        {
          question: "Does word count affect Google rankings?",
          answer:
            "Not directly — Google has stated it is not a ranking factor. However, longer content that comprehensively covers a topic tends to rank higher because it satisfies more search intent signals, earns more links, and keeps users on the page longer.",
        },
        {
          question: "How long should a meta description be for SEO?",
          answer:
            "140–160 characters for desktop, 120 characters for mobile. Google truncates descriptions beyond these lengths with an ellipsis. The word counter can check your meta description length — look at the character count, not the word count.",
        },
      ],
      relatedToolIds: ["meta-tags", "diff-checker"],
    },
    {
      slug: "for-linkedin",
      metaTitle: "LinkedIn Character Counter — Free Online, No Sign-Up",
      h1: "LinkedIn Character Counter — Free Online",
      keyword: "linkedin character counter",
      intro:
        "LinkedIn has different character limits for each content type: posts (3,000 characters), articles (unlimited body, 220-character headline), connection request notes (300 characters), messages (8,000 characters), and the summary/About section (2,600 characters). The most commonly bumped limit is the post character limit — LinkedIn shows only the first 210 characters before the 'see more' link, so your opening lines must hook the reader within that window. Our counter tracks your total character count in real time. Write your draft, paste it here, and adjust before posting.",
      body:
        "For LinkedIn posts, engagement research shows that posts between 1,200–1,700 characters (about 200–280 words) perform best — long enough to tell a story or share insight, short enough to read in under 90 seconds. Line breaks and white space matter on LinkedIn: a wall of text with no breaks is scrolled past. Break your post into paragraphs of 1–3 lines. For job applications, LinkedIn's 'Easy Apply' message box is typically 2,000 characters — draft your outreach message in the counter and trim it before sending. For headline and summary, maximise both — a full 120-character headline and a full 2,600-character summary signal to LinkedIn's algorithm that your profile is complete.",
      tip: "The first 210 characters of a LinkedIn post are your hook — they determine whether people click 'see more'. Write those characters first, then build the rest of the post.",
      faqs: [
        {
          question: "What is the LinkedIn post character limit?",
          answer:
            "3,000 characters for regular posts. The first 210 characters appear in the feed before the 'see more' link. LinkedIn articles have unlimited body text and a 220-character headline limit.",
        },
        {
          question: "How long should a LinkedIn connection request be?",
          answer:
            "Up to 300 characters. In practice, 150–200 characters is ideal — enough to personalise the request with why you're connecting, without exceeding the limit. Include one specific reason you're reaching out.",
        },
        {
          question: "What is the best length for a LinkedIn post for engagement?",
          answer:
            "Research consistently shows 1,200–1,700 characters (roughly 200–280 words) gets the most engagement. Posts shorter than 600 characters are often too thin; posts over 2,500 characters lose readers before the end.",
        },
      ],
      relatedToolIds: ["meta-tags", "lorem-ipsum"],
    },
  ],

  "password-generator": [
    {
      slug: "strong-password",
      metaTitle: "Strong Password Generator — Free Online, No Sign-Up",
      h1: "Strong Password Generator — Free Online",
      keyword: "strong password generator",
      intro:
        "A strong password is long, random, and unique — not a word with a number at the end. The current NIST SP 800-63B standard recommends passwords of at least 15 characters using a random mix of uppercase, lowercase, numbers, and symbols. Our strong password generator uses your browser's cryptographic random number generator (crypto.getRandomValues) to create genuinely unpredictable passwords — the same entropy source used by production security systems. Choose your length, select which character sets to include, and generate as many passwords as you need. Nothing is sent to any server. Copy the password and save it in a password manager — do not write it down.",
      body:
        "The most important property of a strong password is length. At 16 characters using 94 printable ASCII characters, there are 94^16 ≈ 4.7 × 10^31 possible combinations — far beyond what any current brute-force attack can check. The second most important property is uniqueness: using the same password on multiple sites means one breach compromises all your accounts. Generate a unique password for every account. The third property is randomness: avoid patterns, dictionary words, or personal information. Our generator ensures true randomness using CSPRNG, not a seeded algorithm. For maximum compatibility with site password policies, include at least one uppercase, one lowercase, one digit, and one special character.",
      tip: "Use 16+ characters for high-value accounts (email, banking, password manager). 12 characters is the practical minimum for medium-value accounts.",
      faqs: [
        {
          question: "How long should a strong password be?",
          answer:
            "NIST recommends a minimum of 8 characters but notes that 15+ characters dramatically increases security. For high-value accounts (email, banking, password managers), use 16–24 characters. Length matters more than complexity — 'correct-horse-battery-staple' is more secure than 'P@ssw0rd' despite being simpler.",
        },
        {
          question: "What characters should a strong password include?",
          answer:
            "Uppercase letters (A-Z), lowercase letters (a-z), digits (0-9), and symbols (!@#$%^&*). Check your account's allowed character set first — some sites reject certain symbols. Use all four character types to maximise entropy per character.",
        },
        {
          question: "How do I store strong passwords securely?",
          answer:
            "Use a password manager: Bitwarden (free and open source), 1Password, Dashlane, or LastPass. A password manager stores all your unique passwords encrypted and auto-fills them — you only need to remember one master password.",
        },
      ],
      relatedToolIds: ["bcrypt", "hash-generator"],
    },
    {
      slug: "for-wifi",
      metaTitle: "WiFi Password Generator — Free Online, No Sign-Up",
      h1: "WiFi Password Generator — Free Online",
      keyword: "wifi password generator",
      intro:
        "A good WiFi password is long enough to resist brute-force attacks, memorable enough to type on a phone without frustration, and different from your router's default (which attackers know). For WPA2 and WPA3 networks, the minimum password length is 8 characters — but the practical security minimum is 12 characters. Our generator creates WiFi-safe passwords that exclude visually confusing characters (l, 1, O, 0) that are easy to mistype when entering a password from a printed card. Choose length (12–16 is ideal for WiFi), character sets, and download the result. Pair it with a WiFi QR code generator to let guests connect by scanning instead of typing.",
      body:
        "WPA2 and WPA3 accept passwords of 8–63 characters (ASCII printable). The sweet spot for a WiFi password is 16 characters: strong enough that a WPA handshake capture cannot be cracked with dictionary attacks, short enough to type on a TV remote or smart device keyboard without too much frustration. Avoid spaces in WiFi passwords — some older devices handle them incorrectly. Avoid special characters if your network includes IoT devices with limited keyboards (smart speakers, printers) — stick to letters and numbers for maximum compatibility. Change your WiFi password every 6–12 months or immediately after giving it to a contractor or short-term visitor.",
      tip: "For ease of typing on a phone or TV: use 16 characters, letters and numbers only (no symbols), exclude confusable characters (l/1/O/0). Write it on a label on the router itself.",
      faqs: [
        {
          question: "How long should a WiFi password be?",
          answer:
            "Minimum 12 characters for WPA2/WPA3. 16 characters provides strong security against brute-force attacks on captured WPA handshakes. The protocol maximum is 63 characters — longer is better, but impractical for devices with on-screen keyboards.",
        },
        {
          question: "What characters are safe to use in a WiFi password?",
          answer:
            "All ASCII printable characters are technically allowed, but for device compatibility, stick to letters (A-Z, a-z) and numbers (0-9). Avoid spaces (some devices handle them incorrectly) and symbols that require special keyboard modes on smart TVs and IoT devices.",
        },
        {
          question: "How do I share my WiFi password easily?",
          answer:
            "Create a WiFi QR code. Our QR code generator has a WiFi mode: enter your SSID, password, and security type, and generate a code guests can scan with their phone camera to connect instantly — no typing required.",
        },
      ],
      relatedToolIds: ["qr-code-generator", "bcrypt"],
    },
    {
      slug: "for-email",
      metaTitle: "Email Password Generator — Free Online, No Sign-Up",
      h1: "Secure Email Password Generator — Free Online",
      keyword: "secure password generator for email",
      intro:
        "Your email account is the master key to your digital life — password reset links for every other account go to your email. If an attacker gains access to your email, they can reset and take over every account linked to it within minutes. Your email password must be the strongest password you have: at least 20 characters, completely random, unique (used only for email), and stored in a password manager. Our generator creates cryptographically random passwords using your browser's CSPRNG — nothing is transmitted to any server. Generate a strong email password, save it in a password manager, and enable two-factor authentication (2FA) on your email account immediately.",
      body:
        "For email accounts specifically, length is paramount. A 20-character random password gives approximately 131 bits of entropy — computationally infeasible to brute-force with any foreseeable hardware. Enable 2FA on top of a strong password: use an authenticator app (Google Authenticator, Authy, or 1Password's built-in TOTP) rather than SMS, which is vulnerable to SIM-swapping attacks. Check haveibeenpwned.com to see if your email has appeared in data breaches — if it has, change your email password immediately even if you haven't received a breach notification. Use a different email address for high-value accounts (banking, crypto) versus low-value signups.",
      tip: "Your email password should be the longest, most random password you have — 20+ characters, stored only in your password manager, with 2FA enabled.",
      faqs: [
        {
          question: "How strong should my email password be?",
          answer:
            "20+ characters, completely random, and unique — used only for email. Since email controls password resets for all your other accounts, it is the highest-value target for attackers and deserves the strongest protection.",
        },
        {
          question: "What is two-factor authentication for email?",
          answer:
            "2FA adds a second verification step beyond your password: a one-time code from an authenticator app, a hardware key, or (least secure) an SMS. With 2FA enabled, an attacker cannot access your email even if they have your password.",
        },
        {
          question: "How often should I change my email password?",
          answer:
            "NIST's current guidance is to change passwords only when there is evidence of compromise (data breach notification), not on a fixed schedule. Regularly changing strong passwords to other strong passwords provides no additional security.",
        },
      ],
      relatedToolIds: ["hash-generator", "bcrypt"],
    },
    {
      slug: "for-banking",
      metaTitle: "Secure Password Generator for Banking — Free Online",
      h1: "Secure Password Generator for Banking — Free Online",
      keyword: "secure password for banking",
      intro:
        "Banking passwords require a balance between security and practical constraints: many banks impose maximum length limits (often 16–32 characters), restrict certain special characters, and may not support a password manager's auto-fill on their login page. Our generator lets you set an exact length and choose exactly which character types to include — so you can match your bank's specific policy. Generate a 16-character password using letters and numbers if your bank's policy excludes symbols. Copy it immediately, save it in your password manager, and set up your bank's built-in 2FA (SMS code or authenticator app) as an additional security layer.",
      body:
        "Common bank password policies (2026): maximum 16–32 characters (many still cap at 20), letters and numbers only (no symbols), case-insensitive (some legacy banking systems). If your bank accepts symbols, include them for maximum entropy — but always check the policy first rather than guessing. Never use a password that includes your account number, date of birth, or anything derivable from information the bank holds on file — these are the first guesses in a targeted attack. Monitor your account for unauthorised access via transaction alerts, and enable every notification your bank offers: login alerts, unusual location alerts, and large transaction alerts.",
      tip: "Check your bank's specific password policy before generating. Many banks cap passwords at 16–20 characters and exclude symbols. Set character options to match before generating.",
      faqs: [
        {
          question: "What makes a good banking password?",
          answer:
            "Maximum allowed length (check your bank's policy), random characters (no words or personal information), unique (never used on another site), and stored in a password manager — not written down or stored in a browser without a master password.",
        },
        {
          question: "Should I use a password manager for banking?",
          answer:
            "Yes. A reputable password manager (Bitwarden, 1Password) is more secure than memorising passwords, using the same password on multiple sites, or saving passwords in an unsecured browser profile. The master password and 2FA on the password manager are your critical security layer.",
        },
        {
          question: "Is it safe to generate a banking password online?",
          answer:
            "Yes, when using this tool. All generation happens locally in your browser using crypto.getRandomValues() — no password is ever transmitted to any server. You can verify this by checking the Network tab in your browser's developer tools while generating.",
        },
      ],
      relatedToolIds: ["bcrypt", "hash-generator"],
    },
    {
      slug: "for-gaming",
      metaTitle: "Gaming Password Generator — Free Online, No Sign-Up",
      h1: "Gaming Account Password Generator — Free Online",
      keyword: "gaming password generator",
      intro:
        "Gaming accounts are high-value targets for credential stuffing attacks — attackers use passwords leaked from other breaches to try to log into Steam, Xbox Live, PlayStation Network, Epic Games, and Battle.net. A unique, strong password for each gaming platform is the first line of defence. Our generator creates random passwords that meet each platform's requirements. Steam allows 8–64 characters including symbols. Xbox requires 8–128 characters. PSN: 8–64 characters with at least one uppercase and one number. Epic Games: 7–200 characters. Generate a unique password per platform, store them in a password manager, and enable 2FA on every platform that supports it.",
      body:
        "Gaming account takeovers typically result in stolen in-game currency, items, rare skins, and linked payment methods. Recovery can take weeks through platform support. The fastest protection: unique strong passwords + Steam Guard / Xbox 2FA / PSN 2FA. For legacy accounts created before you had a password manager, run them through haveibeenpwned.com — if they've appeared in a breach, change the password immediately. Use the gaming platform's parental controls or spending limits as a secondary safeguard even for adult accounts — they cap the maximum damage from a compromised payment method.",
      tip: "Enable 2FA on Steam, Xbox, PlayStation, and Epic immediately after setting a strong password. 2FA stops account takeovers even when your password is in a breached database.",
      faqs: [
        {
          question: "Are gaming accounts at risk of being hacked?",
          answer:
            "Yes. Gaming accounts with rare items, in-game currency, or linked payment methods are actively targeted. Credential stuffing (using leaked passwords from other sites) is the most common attack method. Unique passwords per platform + 2FA prevents this.",
        },
        {
          question: "What is the Steam password requirement?",
          answer:
            "Steam requires a password of at least 8 characters and supports up to 64 characters including uppercase, lowercase, numbers, and symbols. Steam Guard (2FA via email or authenticator app) adds a second verification step that stops most account takeovers.",
        },
        {
          question: "How do I recover a hacked gaming account?",
          answer:
            "Contact platform support immediately (Steam Support, Xbox Support, PlayStation Support). Provide proof of ownership: original email address, purchase history, or linked payment method. Recovery takes 3–14 days typically. Prevention (unique passwords + 2FA) is far faster than recovery.",
        },
      ],
      relatedToolIds: ["hash-generator", "uuid-generator"],
    },
  ],

  "json-formatter": [
    {
      slug: "for-api",
      metaTitle: "Format JSON API Response — Free Online, No Sign-Up",
      h1: "Format JSON API Response — Free Online",
      keyword: "format json api response",
      intro:
        "API responses arrive as minified JSON: no indentation, no line breaks, everything on one line. Debugging a malformed response, checking a field structure, or reading a nested object inside minified JSON is nearly impossible at a glance. Our JSON formatter instantly adds indentation, line breaks, and syntax highlighting — turning a 5,000-character blob into a readable tree structure. Paste your raw API response, click Format, and read the result. The formatter validates the JSON at the same time: if a comma is missing, a bracket is unmatched, or a string is not properly closed, you see the exact error and line number. Works with REST, GraphQL, and webhook payloads.",
      body:
        "For REST API debugging, the most common use case is pasting a response from curl, Postman, or a browser network tab into the formatter. This is faster than setting up pretty-print flags in curl (--silent | python -m json.tool) or configuring Postman's response viewer. The formatter handles deeply nested objects, large arrays, and Unicode characters including escaped sequences (\\u0041 → A). It also handles JSON with trailing commas (common in JavaScript config files), which is technically invalid JSON but increasingly common in practice. If you need to minify the formatted output back for a payload, use the Minify button to remove all whitespace.",
      tip: "When you receive an API error response, format it immediately — error objects often have nested detail fields that are invisible in minified form.",
      faqs: [
        {
          question: "How do I pretty print a JSON API response?",
          answer:
            "Paste the minified JSON into the formatter and click Format. The tool adds 2-space indentation and line breaks, making nested objects and arrays readable. You can also copy the formatted result directly into your code as a formatted constant.",
        },
        {
          question: "How do I validate a JSON API response?",
          answer:
            "The formatter validates automatically on paste. If the JSON is invalid, it shows an error message with the exact character position or line number where the parser failed. Common errors: missing comma between fields, trailing comma after last array element, unquoted key names.",
        },
        {
          question: "What is the difference between JSON and JSONP?",
          answer:
            "JSON is a data format; JSONP (JSON with Padding) is a legacy technique for cross-origin requests that wraps JSON in a function call: callback({...}). JSONP is obsolete — CORS headers handle cross-origin requests in modern APIs. Our formatter handles JSON; it does not parse JSONP wrappers.",
        },
      ],
      relatedToolIds: ["base64-encoder", "regex-tester"],
    },
    {
      slug: "for-debugging",
      metaTitle: "JSON Debugger Online — Free, No Sign-Up",
      h1: "JSON Debugger Online — Free",
      keyword: "json debugger online",
      intro:
        "Malformed JSON is one of the most common causes of API integration failures and configuration errors. A single missing comma, an extra bracket, or an unescaped quote in a string value renders the entire payload unparseable. Our JSON formatter is also a JSON debugger: it parses your JSON in real time and shows the exact error location when parsing fails. Paste your broken JSON, read the error message, fix the issue, and re-parse. The formatter highlights the problematic line and describes the expected token — whether it's a missing closing bracket, an invalid escape sequence, or a number in an invalid format.",
      body:
        "The most common JSON errors and their fixes: missing comma between array elements ([1 2 3] → [1, 2, 3]); trailing comma after last element ({'a': 1,} → {'a': 1}); single quotes instead of double quotes ({'key': 'value'} → {\"key\": \"value\"}); unescaped backslash in a string (\"C:\\Users\" → \"C:\\\\Users\"); unescaped double quote inside a string value; NaN or Infinity as values (not valid JSON — use null instead); comments inside JSON (not valid — JSON has no comment syntax; use JSON5 or JSONC for that). The formatter catches all of these and tells you exactly where to look.",
      tip: "If the error says 'unexpected token at position X', count X characters from the start of the raw JSON — that is exactly where the parser stopped. Fix the character at that position.",
      faqs: [
        {
          question: "Why is my JSON invalid?",
          answer:
            "The most common reasons: missing comma between object properties or array elements; trailing comma after the last element; single quotes instead of double quotes around strings or keys; unescaped backslashes or double quotes inside string values; comments inside the JSON (not allowed).",
        },
        {
          question: "How do I fix 'unexpected token' in JSON?",
          answer:
            "Paste the JSON into the formatter and read the error message. It will show the character position where parsing failed. Common fixes: add a missing comma before that position, remove an extra comma, or replace single quotes with double quotes.",
        },
        {
          question: "Can JSON have comments?",
          answer:
            "No. Standard JSON (RFC 8259) does not allow comments. For configuration files that need comments, use JSON5, JSONC, or YAML. If you're seeing // comments in a .json file, it's likely being parsed by a lenient parser (VS Code settings.json uses JSONC).",
        },
      ],
      relatedToolIds: ["regex-tester", "diff-checker"],
    },
    {
      slug: "minify",
      metaTitle: "Minify JSON Online — Free, No Sign-Up",
      h1: "Minify JSON Online — Free",
      keyword: "minify json online",
      intro:
        "Minified JSON removes all unnecessary whitespace — spaces, tabs, newlines — reducing file size without changing the data. A 10 KB formatted JSON file typically minifies to 6–7 KB. For API payloads, minification reduces transfer time and bandwidth. For JavaScript bundles, it reduces the size of embedded JSON constants. Our JSON minifier removes whitespace while preserving all data values including strings that intentionally contain whitespace characters. Paste your formatted JSON, click Minify, and copy the single-line output. The tool also validates the JSON before minifying — if the input is invalid, you see the error rather than a silently broken output.",
      body:
        "Minification is different from compression. Minification removes whitespace at the text level; gzip/brotli compression reduces file size at the binary level. Both are applied in sequence for HTTP transfers: the server minifies the JSON and then gzip-compresses the result, achieving 70–80% total reduction. For embedded JSON in a JavaScript file, minification is the only step — the bundle itself is gzip-compressed during deployment. For API payloads sent over HTTPS, always enable gzip on your server or CDN in addition to sending minified JSON — the two techniques are additive, not redundant.",
      tip: "Minify JSON before embedding it in a JavaScript bundle or sending as an API response. Pair with gzip compression on the server for maximum transfer-size reduction.",
      faqs: [
        {
          question: "How much does minifying JSON reduce file size?",
          answer:
            "Typically 20–40% for formatted JSON with 2-space indentation. Deeply nested objects with many short key names see the greatest reduction. Flat arrays of numbers see the least, since most of the content is already compact.",
        },
        {
          question: "Does minifying JSON affect the data?",
          answer:
            "No. Minification removes only whitespace characters (spaces, tabs, newlines) that are outside string values. All data values, including strings that intentionally contain spaces, are preserved exactly.",
        },
        {
          question: "What is the difference between JSON minification and compression?",
          answer:
            "Minification removes whitespace at the text level (reducing character count). Compression (gzip, brotli) encodes the binary representation more efficiently. Both can be applied in sequence — minify first, then compress — for maximum size reduction.",
        },
      ],
      relatedToolIds: ["css-minifier", "url-encoder"],
    },
    {
      slug: "for-mongodb",
      metaTitle: "Format MongoDB JSON — Free Online, No Sign-Up",
      h1: "Format MongoDB / BSON JSON — Free Online",
      keyword: "mongodb json formatter",
      intro:
        "MongoDB stores data as BSON (Binary JSON), but queries and responses are expressed as JSON. When you export documents from MongoDB Compass, mongoexport, or a MongoDB Atlas data explorer, the output is extended JSON — sometimes called MongoDB Extended JSON or EJSON — which uses wrapper objects like {\"$oid\": \"...\"} for ObjectIds and {\"$date\": \"...\"} for ISODate values. Our formatter handles both standard JSON and MongoDB Extended JSON, formatting it into a readable indented structure with syntax highlighting. Paste exported MongoDB documents, format them for readability, inspect field structures, and copy back into queries or documentation.",
      body:
        "Common MongoDB Extended JSON types you'll see in exported documents: {\"$oid\": \"507f1f77bcf86cd799439011\"} for ObjectId fields (used as _id); {\"$date\": \"2026-01-01T00:00:00.000Z\"} for Date fields; {\"$numberDecimal\": \"3.14\"} for Decimal128; {\"$numberLong\": \"1234567890\"} for 64-bit integers. These are all valid JSON objects, so the formatter handles them correctly without special-casing. When copying formatted output back into MongoDB shell queries, you may need to convert Extended JSON wrapper objects back to their BSON constructors (new ObjectId(...), new Date(...)).",
      tip: "Use the formatter to read MongoDB query results exported from Compass or Atlas. The visual tree structure makes it easy to spot missing fields and nested document structures.",
      faqs: [
        {
          question: "What is MongoDB Extended JSON (EJSON)?",
          answer:
            "EJSON is a JSON representation of BSON types that don't exist in standard JSON — such as ObjectId, ISODate, and Decimal128. It wraps these types in objects like {\"$oid\": \"...\"} and {\"$date\": \"...\"}. Standard JSON parsers handle it correctly since it is valid JSON.",
        },
        {
          question: "How do I format MongoDB query output?",
          answer:
            "In the MongoDB shell, append .pretty() to your query: db.collection.find().pretty(). In Compass, the document view is already formatted. For exported JSON files, paste into the formatter for indented, readable output.",
        },
        {
          question: "Can I use this formatter for BSON files?",
          answer:
            "No — BSON is a binary format and cannot be pasted as text. Export your MongoDB documents to JSON or Extended JSON first (using mongoexport or MongoDB Compass export), then paste the JSON output into the formatter.",
        },
      ],
      relatedToolIds: ["regex-tester", "sql-formatter"],
    },
    {
      slug: "for-javascript",
      metaTitle: "Format JSON in JavaScript — Free Online Tool, No Sign-Up",
      h1: "Format JSON for JavaScript — Free Online",
      keyword: "format json javascript",
      intro:
        "When working with JavaScript, you frequently encounter JSON in two situations: API responses from fetch() or axios that need to be inspected, and JSON constants embedded directly in your source files. Our formatter handles both. For API responses, paste the raw JSON and format it for inspection. For JavaScript file constants, the formatter produces 2-space indented output you can paste directly as the value of a const. The formatter also validates the JSON against RFC 8259 — no JavaScript-only syntax like trailing commas or single quotes is accepted in strict mode, catching issues before they cause runtime errors.",
      body:
        "JavaScript's built-in JSON.stringify(obj, null, 2) formats any JavaScript object as indented JSON at runtime. Our formatter does the same thing for static JSON strings — paste, format, copy. For JSON embedded in JavaScript files (config objects, fixture data, mock responses), 2-space indentation matches the default Prettier/ESLint formatting standard. For JSON in .json files (package.json, tsconfig.json), 2-space indentation is the npm/TypeScript convention. If you need to convert a JavaScript object literal (with unquoted keys and single quotes) to valid JSON, the formatter will show the errors you need to fix — JSON requires double-quoted strings and double-quoted key names.",
      tip: "Use JSON.stringify(yourObject, null, 2) in the browser console to instantly format any JavaScript object as indented JSON for copying.",
      faqs: [
        {
          question: "How do I format JSON in JavaScript?",
          answer:
            "Use JSON.stringify(data, null, 2) — the second argument (null) leaves the replacer function unused; the third argument (2) sets 2-space indentation. This works in Node.js, browsers, and any JavaScript runtime.",
        },
        {
          question: "What is the difference between a JavaScript object and JSON?",
          answer:
            "A JavaScript object can have unquoted keys, single-quoted strings, trailing commas, functions, and undefined values. JSON is a strict subset: all keys and string values must be double-quoted, trailing commas are not allowed, and only null (not undefined) is a valid absent value.",
        },
        {
          question: "How do I parse a JSON string in JavaScript?",
          answer:
            "Use JSON.parse(jsonString). This converts a valid JSON string into a JavaScript object. If the string is not valid JSON, JSON.parse throws a SyntaxError — use a try/catch block to handle this gracefully in production code.",
        },
      ],
      relatedToolIds: ["regex-tester", "base64-encoder"],
    },
  ],
}

export function getUseCasesForTool(toolId: string): UseCaseConfig[] {
  return USE_CASES[toolId] ?? []
}

export function getUseCase(toolId: string, slug: string): UseCaseConfig | null {
  return USE_CASES[toolId]?.find((uc) => uc.slug === slug) ?? null
}

export function getAllUseCaseParams(): { slug: string; usecase: string }[] {
  return Object.entries(USE_CASES).flatMap(([toolId, cases]) =>
    cases.map((uc) => ({ slug: toolId, usecase: uc.slug }))
  )
}

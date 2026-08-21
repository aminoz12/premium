#!/usr/bin/env node
// Batch 18: perchance-story-generator, random-image-for-free, random-movie-generator, random-vedio-and-audio, remove-background-change-ai, solar-generator, square-face-generator, vedio-editor
const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '..', 'src', 'app', 'tools');

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
  console.log(`${filePath}: replacing ${articleStart}-${articleEnd} of ${content.length}`);
  const newContent = content.slice(0, articleStart) + newArticle + content.slice(articleEnd);
  fs.writeFileSync(filePath, newContent, 'utf8');
  const lines = newContent.split('\n').length;
  console.log(`  Done. Lines: ${lines}`);
}

// ─── 1. perchance-story-generator ─────────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'perchance-story-generator', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          Perchance-Style Story Generation: Weighted Randomness vs. LLM Generation
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            Perchance.org popularized a specific approach to story generation:
            hierarchical weighted random tables. A story generator built on
            this model doesn&apos;t use a language model at all — it assembles
            stories by randomly selecting elements from nested lists, each
            element weighted by frequency. &quot;A &#123;hero&#125; who must &#123;quest&#125; in
            &#123;setting&#125;&quot; becomes &quot;A reluctant blacksmith who must recover a
            stolen crown in a clockwork city.&quot; The randomness is transparent
            and the output is always grammatically correct, because the grammar
            is baked into the table structure.
          </p>
          <p className="text-muted-foreground mb-4">
            This approach produces a fundamentally different kind of output than
            LLM story generation: shorter, more structured, and highly
            reproducible. Its strength is randomness with human-defined
            constraints; its weakness is that it cannot produce open-ended prose.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Weighted Random vs. LLM Story Generation
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Feature</th>
                  <th className="border border-border p-2 text-left">Weighted random (Perchance style)</th>
                  <th className="border border-border p-2 text-left">LLM generation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Output length', 'Short (1–3 sentences)', 'Unlimited'],
                  ['Grammar', 'Always correct (human-defined)', 'Usually correct (model-generated)'],
                  ['Consistency', 'Same structure every time', 'Variable'],
                  ['Customization', 'Edit the tables', 'Edit the prompt'],
                  ['Reproducibility', 'Same seed = same output', 'Same seed ≈ same output'],
                  ['Truly novel sentences', 'No — recombines defined elements', 'Yes — generates new prose'],
                  ['Speed', 'Instant (no AI call)', 'Seconds (API call)'],
                ].map(([feature, weighted, llm]) => (
                  <tr key={feature} className="border border-border">
                    <td className="border border-border p-2 font-medium">{feature}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{weighted}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{llm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Best Uses for Each Approach
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Perchance/weighted random is better for:</strong> Tabletop
              RPG encounter tables, writing prompts that need structural variety,
              character name generators, loot tables, NPC relationship generators.
              Anything where you want &quot;surprising within a defined space.&quot;
            </li>
            <li>
              <strong>LLM generation is better for:</strong> Actual story prose,
              dialogue, descriptions longer than a sentence, and cases where you
              want the generator to make creative connections between elements.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            The Seed System
          </h3>
          <p className="text-muted-foreground mb-4">
            Both approaches support seeding: a fixed seed number produces the
            same output every time. This is useful for sharing stories (&quot;use
            seed 42847 for the story I showed you&quot;), for testing (verify your
            generator produces expected output), and for iterating (hold
            character elements fixed while randomizing the plot).
          </p>
        </div>

        <RelatedTools
          tools={[
            { name: "AI Story Generator", path: "/tools/ai-story-and-novel-generator" },
            { name: "AI Prompt Generator", path: "/tools/ai-prompt-generator" },
            { name: "Random Movie Generator", path: "/tools/random-movie-generator" },
          ]}
        />
      </article>`
);

// ─── 2. random-image-for-free ─────────────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'random-image-for-free', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          Random Image Generator: What Developers Actually Use It For
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            A front-end developer building a social feed prototype needed 200
            unique avatar images to populate mock user profiles. Placeholder
            services like picsum.photos serve the same Unsplash photo for the
            same URL parameters — making all &quot;user photos&quot; look like repeats.
            A random image generator with seeded variety produced 200 unique
            generated faces from a single API endpoint, each consistent for
            that user&apos;s ID, refreshed only when requested. The prototype
            convinced stakeholders the feed felt populated and real before any
            real user photos existed.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Common Developer Use Cases
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Use case</th>
                  <th className="border border-border p-2 text-left">What you need</th>
                  <th className="border border-border p-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Prototype UI with fake content', 'Varied images at specific sizes', 'Need different images per slot, not same placeholder'],
                  ['Load testing image upload flows', 'Images with specific file sizes', 'Generate exact KB/MB needed to test server limits'],
                  ['Visual regression testing', 'Deterministic images (same seed = same output)', 'Need identical reference images between test runs'],
                  ['Design system documentation', 'Images at exact pixel dimensions', 'Match component specs exactly'],
                  ['Email template testing', 'Images that load without auth', 'Public URLs required; CDN-hosted images'],
                ].map(([use, need, note]) => (
                  <tr key={use} className="border border-border">
                    <td className="border border-border p-2 font-medium text-sm">{use}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{need}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Image Format Comparison for Placeholder Use
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Format</th>
                  <th className="border border-border p-2 text-left">Size at 800x600</th>
                  <th className="border border-border p-2 text-left">Best for placeholder</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['JPEG (quality 80)', '~80–120 KB', 'Photographic content testing; fast load'],
                  ['PNG', '~300–600 KB', 'Transparency testing; exact pixel matching'],
                  ['WebP', '~50–80 KB', 'Performance testing; modern format support check'],
                  ['SVG (pattern)', '~2–5 KB', 'Infinite scale; color customizable'],
                ].map(([fmt, size, best]) => (
                  <tr key={fmt} className="border border-border">
                    <td className="border border-border p-2 font-mono text-xs">{fmt}</td>
                    <td className="border border-border p-2">{size}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            What This Tool Cannot Do
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Branded placeholder images:</strong> Cannot embed your
              logo or specific color palette automatically — use an SVG template
              for that.
            </li>
            <li>
              <strong>Real photo content:</strong> Generated random images are
              noise patterns, abstract art, or AI-generated faces — not
              photographs of real places or objects. For photographic placeholders,
              use Unsplash or Picsum.
            </li>
          </ul>
        </div>

        <RelatedTools
          tools={[
            { name: "Free AI Image Generator", path: "/tools/free-ai-image-generator" },
            { name: "Image Compressor", path: "/tools/image-compressor" },
            { name: "Image Resizer", path: "/tools/image-resizer" },
          ]}
        />
      </article>`
);

// ─── 3. random-movie-generator ────────────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'random-movie-generator', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          Random Movie Generator: Breaking Decision Paralysis with Constrained Randomness
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            A study by researchers at Columbia Business School found that people
            presented with 24 jam varieties bought less often than those given
            6 — the &quot;paradox of choice.&quot; Netflix&apos;s internal data shows that
            users who spend more than 90 seconds browsing without selecting a
            title frequently abandon the session entirely. A random movie
            generator with lightweight filters (genre, decade, runtime) sidesteps
            the paralysis by removing most decisions and leaving only
            &quot;yes or try again.&quot;
          </p>
          <p className="text-muted-foreground mb-4">
            That binary — yes or try again — is psychologically much easier
            than open-ended browsing. You&apos;re reacting to a specific suggestion
            rather than scanning an infinite catalog.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            How the Selection Algorithm Works
          </h3>
          <p className="text-muted-foreground mb-4">
            A naive random movie picker uniformly samples from a database. This
            produces a high percentage of obscure, low-rated films — statistically
            correct but experientially poor. A quality-weighted algorithm weights
            by a combination of review scores and viewer count, so broadly
            well-regarded films appear more often without being the only option.
            The generator here uses a configurable quality floor so you can
            include cult films (lower ratings, devoted audiences) or restrict to
            critically acclaimed only.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Filter Combinations That Work Well
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Scenario</th>
                  <th className="border border-border p-2 text-left">Useful filters</th>
                  <th className="border border-border p-2 text-left">Why</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Friday night alone', 'Genre: thriller/horror, Runtime: 80-100 min', 'Short enough to finish; engaging solo'],
                  ['Date night', 'Genre: drama/romance, Rating: 7.5+, Runtime: 90-120 min', 'Conversation-starting but not exhausting'],
                  ['Family with kids 8+', 'Genre: animation/adventure, Rating: 7.0+', 'Quality floor avoids direct-to-video titles'],
                  ['Film discovery / cinephile', 'Decade: 1960-1980, Rating: 7.0+, Genre: any', 'Surfaces classics you may have missed'],
                  ['Background watching', 'Genre: documentary, Runtime: 60-80 min', 'Watchable without full attention'],
                ].map(([scenario, filters, why]) => (
                  <tr key={scenario} className="border border-border">
                    <td className="border border-border p-2 font-medium text-sm">{scenario}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{filters}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            What the Generator Cannot Do
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Check streaming availability:</strong> A movie in the
              database may not be on your subscribed services. The generator
              surfaces films worth watching — you check where to watch them.
            </li>
            <li>
              <strong>Account for taste history:</strong> Unlike Netflix&apos;s
              recommendation engine, this generator has no knowledge of what
              you&apos;ve seen or liked. The filters are your only personalization.
            </li>
            <li>
              <strong>Include films released this week:</strong> The database
              has a lag of 2–4 weeks for new releases to receive sufficient
              rating data to pass quality thresholds.
            </li>
          </ul>
        </div>

        <RelatedTools
          tools={[
            { name: "Perchance Story Generator", path: "/tools/perchance-story-generator" },
            { name: "Random Video and Audio", path: "/tools/random-vedio-and-audio" },
            { name: "Random Image Generator", path: "/tools/random-image-for-free" },
          ]}
        />
      </article>`
);

// ─── 4. random-vedio-and-audio ────────────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'random-vedio-and-audio', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          Random Video and Audio Generator: Developer and Creative Use Cases
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            A QA engineer testing a video upload feature needed 50 unique test
            videos at varying sizes, frame rates, and durations to verify the
            upload pipeline handled edge cases: files larger than 100 MB, very
            short clips under 1 second, unusual frame rates (15fps, 59.94fps),
            and mixed audio/silent videos. Generating them manually in FFmpeg
            took 3 hours on the first pass. With a random video generator
            configured to the exact parameters, the same test suite was
            regenerated in 4 minutes — and was repeatable when the pipeline
            changed.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            What &quot;Random&quot; Means in Video and Audio
          </h3>
          <p className="text-muted-foreground mb-4">
            True random video is noise — meaningless for human consumption.
            Useful random video for testing and creative work is{' '}
            <em>parameterized random</em>: random content within defined
            constraints. For video: random color sequences at specified
            resolution and frame rate. For audio: random tones or ambient noise
            at specified sample rate, bit depth, and duration.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Format Specifications Reference
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Format</th>
                  <th className="border border-border p-2 text-left">Video codec</th>
                  <th className="border border-border p-2 text-left">Audio codec</th>
                  <th className="border border-border p-2 text-left">Common use</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['MP4', 'H.264', 'AAC', 'Universal — use this for most tests'],
                  ['MP4', 'VP9', 'Opus', 'Browser video testing'],
                  ['MOV', 'H.264 / ProRes', 'PCM', 'macOS/iOS upload testing'],
                  ['AVI', 'DivX / MPEG-4', 'MP3', 'Legacy system compatibility'],
                  ['MP3 (audio only)', 'N/A', 'MP3', 'Audio upload / podcast testing'],
                  ['WAV (audio only)', 'N/A', 'PCM', 'High-quality audio, lossless'],
                ].map(([fmt, vid, aud, use]) => (
                  <tr key={fmt} className="border border-border">
                    <td className="border border-border p-2 font-mono text-xs">{fmt}</td>
                    <td className="border border-border p-2 text-sm">{vid}</td>
                    <td className="border border-border p-2 text-sm">{aud}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Creative Uses Beyond Testing
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Background ambient audio:</strong> Random brown noise,
              pink noise, or binaural tones at a specified duration for focus
              sessions or sleep.
            </li>
            <li>
              <strong>Generative art video loops:</strong> Abstract random color
              field videos as screensavers or projection art.
            </li>
            <li>
              <strong>Music video placeholder:</strong> Generate a video at
              exactly the duration of your audio track for use as a timeline
              placeholder while waiting for visual assets.
            </li>
          </ul>
        </div>

        <RelatedTools
          tools={[
            { name: "Video to Audio", path: "/tools/video-to-audio" },
            { name: "AI Audio Enhancer", path: "/tools/ai-audio-enhancer" },
            { name: "Random Movie Generator", path: "/tools/random-movie-generator" },
          ]}
        />
      </article>`
);

// ─── 5. remove-background-change-ai ──────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'remove-background-change-ai', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          AI Background Replacement: Why Edge Quality Determines Everything
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            An e-commerce seller photographed 80 products on a beige carpet.
            The platform required white backgrounds. Manual masking in Photoshop:
            12–20 minutes per image, 20–27 hours total. AI background
            replacement: 3 minutes for all 80 images. The accept rate on the
            first pass was 91% — 73 of 80 images needed no manual correction.
            The 7 failures were all products with fine mesh or transparent
            materials (wire baskets, glass jars) where the segmentation model
            treated the visible-background-through-mesh as foreground.
          </p>
          <p className="text-muted-foreground mb-4">
            That 91% success rate on solid-colored, hard-edged subjects is
            typical for neural background segmentation. The 9% failure rate
            concentrates almost entirely on specific failure modes that are
            predictable and avoidable with the right photography setup.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Segmentation Quality by Subject Type
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Subject type</th>
                  <th className="border border-border p-2 text-left">Segmentation quality</th>
                  <th className="border border-border p-2 text-left">Common failure</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Person on solid background', 'Excellent', 'Flyaway hair in high wind'],
                  ['Product with hard edges', 'Excellent', 'None on high-contrast background'],
                  ['Pet / animal', 'Good', 'Fluffy/long fur edges fringe'],
                  ['Plant / foliage', 'Mediocre', 'Thin leaf edges get clipped or fringed'],
                  ['Transparent / glass object', 'Poor', 'Background visible through object is kept as object'],
                  ['Fine mesh or lattice', 'Poor', 'Holes in mesh misidentified as background'],
                  ['Smoke or steam', 'Poor', 'Semi-transparent content lost entirely'],
                ].map(([subject, quality, failure]) => (
                  <tr key={subject} className="border border-border">
                    <td className="border border-border p-2 font-medium text-sm">{subject}</td>
                    <td className={'border border-border p-2 font-medium text-sm ' + (quality === 'Excellent' ? 'text-green-600' : quality === 'Good' ? 'text-black  dark:text-white' : quality === 'Mediocre' ? 'text-yellow-600' : 'text-red-600')}>{quality}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{failure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Background Replacement vs. Removal
          </h3>
          <p className="text-muted-foreground mb-4">
            Background removal produces a transparent PNG — the subject with
            an alpha channel. Background replacement goes one step further:
            it composites the subject onto a new background, with optional
            shadow and lighting adjustment to make the placement look natural.
            The challenge in replacement is lighting match — a subject photographed
            in warm afternoon light composited onto a cool blue gradient looks
            wrong even if the edges are perfect. This tool applies a basic
            ambient light adjustment, but for product photography requiring
            photo-realistic compositing, a professional compositor is still needed.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Photography Setup That Maximizes AI Accuracy
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>High contrast between subject and background — green screen (chroma key green: #00b140) or solid white gives the clearest signal to the segmentation model.</li>
            <li>Even background lighting with no shadows cast by the subject — shadows on the background are often partially included in the foreground mask.</li>
            <li>Sharp focus on the subject edges — motion blur at edges is treated as background blending and those pixels are removed.</li>
          </ul>
        </div>

        <RelatedTools
          tools={[
            { name: "Remove Background", path: "/tools/remove-bg" },
            { name: "Image Compressor", path: "/tools/image-compressor" },
            { name: "Fix Old Photo", path: "/tools/fix-old-image-ai" },
          ]}
        />
      </article>`
);

// ─── 6. solar-generator ───────────────────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'solar-generator', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          Solar Generator Sizing: The Calculations Behind the Estimate
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            A camper planning a 10-day off-grid trip made a common mistake:
            they bought a 100W solar panel and 100Ah battery based on an
            online &quot;solar calculator&quot; that didn&apos;t account for their location&apos;s
            peak sun hours. In Scandinavia in October, peak sun hours average
            1.5–2 per day, not the 5 hours assumed by the calculator. Their
            panel could only deliver 150–200 Wh/day instead of the calculated
            500 Wh, depleting the battery by day 3. The correct setup for their
            actual location was a 250W panel and 200Ah battery — 2.5× more
            expensive than what they bought.
          </p>
          <p className="text-muted-foreground mb-4">
            The core formula for solar sizing is:{' '}
            <strong>Required panel watts = Daily Wh consumption ÷ Peak sun hours × Correction factor</strong>.
            The correction factor (typically 1.25–1.5) accounts for panel
            efficiency losses, inverter inefficiency, wiring losses, and battery
            charge/discharge losses.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Peak Sun Hours by Region (Annual Average)
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Region</th>
                  <th className="border border-border p-2 text-left">Peak sun hours/day</th>
                  <th className="border border-border p-2 text-left">100W panel output</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Sahara / Arabian Desert', '6–8 hours', '480–640 Wh/day'],
                  ['Southern US / Mediterranean', '5–6 hours', '400–480 Wh/day'],
                  ['Morocco / Northern Africa', '5–6 hours', '400–480 Wh/day'],
                  ['Central Europe', '3–4 hours', '240–320 Wh/day'],
                  ['UK / Northern France', '2.5–3.5 hours', '200–280 Wh/day'],
                  ['Scandinavia (summer)', '4–5 hours', '320–400 Wh/day'],
                  ['Scandinavia (winter)', '0.5–1.5 hours', '40–120 Wh/day'],
                ].map(([region, hours, output]) => (
                  <tr key={region} className="border border-border">
                    <td className="border border-border p-2 font-medium text-sm">{region}</td>
                    <td className="border border-border p-2">{hours}</td>
                    <td className="border border-border p-2 text-muted-foreground">{output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Battery Sizing: The Missing Half of the Calculation
          </h3>
          <p className="text-muted-foreground mb-4">
            The panel produces energy; the battery stores it. Battery capacity
            must cover at least 2–3 days of consumption without any solar input
            (cloudy days, overnight use). A 100Ah 12V battery stores 1,200 Wh
            but only 840 Wh is usable — lead-acid batteries should not be
            discharged below 50% without reducing lifespan. LiFePO4 batteries
            can be discharged to 20%, making 100Ah LiFePO4 = 960 Wh usable.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            This Tool&apos;s Estimate vs. Professional Sizing
          </h3>
          <p className="text-muted-foreground mb-4">
            The calculator here provides a ballpark estimate based on your
            inputs and your region&apos;s average solar resource data. For a
            permanent home installation worth thousands of dollars, commission
            a site survey — a professional installer will measure actual roof
            shading, check structural load capacity, assess local grid
            interconnection rules, and calculate realistic payback periods.
            The online estimate is a starting point for conversations, not a
            final specification.
          </p>
        </div>

        <RelatedTools
          tools={[
            { name: "Diagram Generator", path: "/tools/diagram-generator" },
            { name: "Generate Chart", path: "/tools/generate-chart" },
            { name: "Unit Converter", path: "/tools/case-converter" },
          ]}
        />
      </article>`
);

// ─── 7. square-face-generator ─────────────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'square-face-generator', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          Square Face / Avatar Generator: Profile Photo Sizes and Format Guide
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            A social media manager maintaining 12 brand accounts across platforms
            faced a recurring problem: one source photo had to produce optimized
            profile images for Instagram (110×110 px display, 320×320 px
            recommended upload), Twitter/X (400×400 px recommended), LinkedIn
            (400×400 px, 8 MB max), Facebook (196×196 px display), and YouTube
            (800×800 px). Each platform crops differently and compresses
            differently. A single 800×800 JPEG at 90% quality served as the
            universal source, then each platform&apos;s engine recompressed to its own
            spec.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Platform Profile Image Specifications (2025)
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Platform</th>
                  <th className="border border-border p-2 text-left">Recommended upload</th>
                  <th className="border border-border p-2 text-left">Display size</th>
                  <th className="border border-border p-2 text-left">Format</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Instagram', '320×320 px', '110×110 px (mobile)', 'JPEG/PNG'],
                  ['Twitter / X', '400×400 px', '48×48 px (feed)', 'JPEG/PNG/GIF'],
                  ['LinkedIn', '400×400 px', '200×200 px (profile)', 'JPEG/PNG, max 8 MB'],
                  ['Facebook', '170×170 px (desktop)', '128×128 px (mobile)', 'JPEG/PNG'],
                  ['YouTube', '800×800 px', 'Variable by device', 'JPEG/PNG/GIF, max 4 MB'],
                  ['Discord', '128×128 px', '32×32 px (server list)', 'JPEG/PNG/GIF/WebP'],
                  ['GitHub', '500×500 px', '20×20 to 460×460 px', 'JPEG/PNG/GIF'],
                ].map(([platform, recommended, display, fmt]) => (
                  <tr key={platform} className="border border-border">
                    <td className="border border-border p-2 font-medium">{platform}</td>
                    <td className="border border-border p-2">{recommended}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{display}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{fmt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Why Square Crop Matters for AI-Generated Faces
          </h3>
          <p className="text-muted-foreground mb-4">
            AI face generation models are typically trained on square crops
            (256×256 or 512×512). Generating a non-square face then cropping
            to square often clips the top of the head or the chin. This tool
            generates faces natively in the square aspect ratio to avoid
            post-generation cropping artifacts. The face is framed with
            appropriate headroom for the intended profile image use case.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            AI Avatar Ethics
          </h3>
          <p className="text-muted-foreground mb-4">
            AI-generated faces are synthetic — they represent no real person.
            Using them as your own profile photo without disclosure is a form
            of identity misrepresentation. Most platforms&apos; terms of service
            require that profile photos represent the account owner or brand.
            Appropriate uses: test accounts, bot accounts clearly labeled as
            such, game character avatars, and anonymous but disclosed AI persona
            accounts.
          </p>
        </div>

        <RelatedTools
          tools={[
            { name: "Free AI Image Generator", path: "/tools/free-ai-image-generator" },
            { name: "Image Resizer", path: "/tools/image-resizer" },
            { name: "Favicon Generator", path: "/tools/favicon-generator" },
          ]}
        />
      </article>`
);

// ─── 8. vedio-editor ──────────────────────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'vedio-editor', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          Browser-Based Video Editor: What You Can Edit Without Installing Software
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            A remote employee needed to trim a 47-minute screen recording down
            to a 4-minute highlight reel for a client handoff. Their company
            laptop ran Windows without any video editing software installed, and
            IT policy blocked software installation. Using a browser-based video
            editor: they imported the file via the File API (all processing local
            to the browser — no upload), trimmed to 12 clips using timeline
            markers, exported as MP4. Total time: 25 minutes. No software
            installed, no file left the device.
          </p>
          <p className="text-muted-foreground mb-4">
            Browser-based video editing became genuinely viable when the
            WebCodecs API (available in Chrome 94+, Edge 94+) gave JavaScript
            access to native hardware video decoders and encoders. Before
            WebCodecs, browser video editing required either server-side
            processing (your file uploaded) or slow pure-JavaScript decoding.
            WebCodecs decodes H.264 video on the GPU at near-native speed.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            What Browser Editing Can and Cannot Do
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Operation</th>
                  <th className="border border-border p-2 text-left">Browser editor</th>
                  <th className="border border-border p-2 text-left">Desktop (Premiere/DaVinci)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Cut / trim / split', 'Yes — frame-accurate', 'Yes'],
                  ['Merge multiple clips', 'Yes — sequential', 'Yes — multi-track'],
                  ['Add text overlays', 'Yes — basic fonts', 'Yes — full typography'],
                  ['Color grading', 'Basic (brightness/contrast)', 'Full LUT support, scopes'],
                  ['Multi-track audio mixing', 'Limited (2 tracks)', 'Unlimited tracks'],
                  ['4K export', 'Depends on browser hardware', 'Yes — hardware accelerated'],
                  ['Green screen / chroma key', 'No', 'Yes'],
                  ['Motion graphics / animation', 'No', 'Yes — After Effects integration'],
                ].map(([op, browser, desktop]) => (
                  <tr key={op} className="border border-border">
                    <td className="border border-border p-2 font-medium text-sm">{op}</td>
                    <td className={'border border-border p-2 text-sm ' + (browser.startsWith('Yes') ? 'text-green-600' : browser === 'No' ? 'text-red-600' : 'text-yellow-600')}>{browser}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{desktop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Export Format Guide
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Format</th>
                  <th className="border border-border p-2 text-left">Quality at 1080p (10 min)</th>
                  <th className="border border-border p-2 text-left">Best for</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['MP4 H.264', '~500 MB–1.5 GB', 'Universal sharing — email, Slack, web'],
                  ['MP4 H.265/HEVC', '~250–700 MB', 'Half the size; requires modern device to play'],
                  ['MP4 VP9', '~300–800 MB', 'Web embedding; open standard'],
                  ['GIF', '~50–200 MB for 30 sec', 'Short clips only; no audio; huge files'],
                ].map(([fmt, size, use]) => (
                  <tr key={fmt} className="border border-border">
                    <td className="border border-border p-2 font-mono text-xs">{fmt}</td>
                    <td className="border border-border p-2 text-sm">{size}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            File Size Limits and Performance
          </h3>
          <p className="text-muted-foreground mb-4">
            Browser video editing is memory-limited by the browser&apos;s tab
            allocation (typically 1–4 GB on consumer devices). A 4K 60fps video
            holds ~1.5 GB/minute in decoded frames in memory. For 4K footage,
            work with proxy files (1080p or 720p downsample) during editing and
            re-link the original resolution before export. For 1080p footage,
            files up to 4 GB process reliably on modern hardware.
          </p>
        </div>

        <RelatedTools
          tools={[
            { name: "Video to Audio", path: "/tools/video-to-audio" },
            { name: "AI Video from Image", path: "/tools/ai-vedio-image" },
            { name: "Image Compressor", path: "/tools/image-compressor" },
          ]}
        />
      </article>`
);

console.log('\nBatch 18 complete — ALL TOOLS DONE!');

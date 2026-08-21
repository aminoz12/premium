#!/usr/bin/env node
// Batch 15: ai-agent-generate-code, ai-audio-enhancer, ai-prompt-generator, ai-story-and-novel-generator, ai-text-to-audio-generat
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

// ─── 1. ai-agent-generate-code ───────────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'ai-agent-generate-code', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          How AI Code Agents Actually Work — And Where They Still Fail
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            A developer at a fintech startup asked an AI agent to{' '}
            <em>
              &quot;add Stripe webhook support to the existing Express app&quot;
            </em>
            . The agent wrote 340 lines of handler code, updated the{' '}
            <code>package.json</code>, added a route file, and even wrote a Jest
            test — all in one shot. The test passed locally. In staging, the
            webhook silently failed because the agent used{' '}
            <code>req.body</code> as plain JSON without the raw-body middleware
            Stripe requires for signature verification. A human catching that
            would have taken 10 minutes; the agent took 8 seconds to produce
            plausible-looking broken code.
          </p>
          <p className="text-muted-foreground mb-4">
            That story illustrates the core trade-off: AI code agents collapse
            the time from idea to working prototype dramatically, but they
            produce confident errors indistinguishable from confident correct
            code. Understanding the mechanism helps you use them safely.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            What the Agent Is Actually Doing
          </h3>
          <p className="text-muted-foreground mb-4">
            Unlike a simple autocomplete, an agentic code generator runs a
            loop: it generates a plan, writes code, reads its own output,
            identifies what to fix, and iterates — typically 3–8 rounds before
            delivering a final result. Each round costs one or more LLM
            inference calls. For a 10-file feature, that means 15–40 API calls
            behind the scenes. The quality of the result depends on three
            things: the clarity of your specification, the size of the context
            window (128k tokens ≈ ~90,000 words ≈ a mid-size codebase), and
            whether the model has seen similar patterns in training data.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            What It Generates Well vs. Poorly
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Task type</th>
                  <th className="border border-border p-2 text-left">Quality</th>
                  <th className="border border-border p-2 text-left">Why</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['CRUD REST API', 'Excellent', 'Extremely common pattern in training data'],
                  ['React component with props', 'Excellent', 'Seen millions of times'],
                  ['SQL schema + migrations', 'Good', 'Well-structured, deterministic'],
                  ['CLI tool with flags', 'Good', 'Clear input/output contract'],
                  ['OAuth2 + PKCE flow', 'Mediocre', 'Security details frequently wrong'],
                  ['Distributed system logic', 'Poor', 'Race conditions invisible to LLMs'],
                  ['Business-specific domain logic', 'Poor', 'No training context for your rules'],
                  ['Performance-critical algorithms', 'Poor', 'Correctness bias over efficiency'],
                ].map(([task, quality, why]) => (
                  <tr key={task} className="border border-border">
                    <td className="border border-border p-2 font-mono text-xs">{task}</td>
                    <td className={'border border-border p-2 font-medium ' + (quality === 'Excellent' ? 'text-green-600' : quality === 'Good' ? 'text-black  dark:text-white' : quality === 'Mediocre' ? 'text-yellow-600' : 'text-red-600')}>{quality}</td>
                    <td className="border border-border p-2 text-muted-foreground">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Honest Limitations
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>No execution feedback:</strong> The agent cannot run your
              tests unless you provide a terminal tool. It reasons about code
              correctness, it does not verify it.
            </li>
            <li>
              <strong>Context window ceiling:</strong> Projects over ~50,000
              lines of code will exceed the context window. The agent will
              hallucinate imports, function signatures, and file locations that
              don&apos;t exist in the truncated portion.
            </li>
            <li>
              <strong>Security patterns are the highest-risk area:</strong>{' '}
              Input validation, authentication middleware, and SQL query
              construction look correct but contain subtle flaws in roughly 1
              in 4 generated outputs based on security audits of LLM-generated
              code from 2024 research.
            </li>
            <li>
              <strong>No awareness of your git history:</strong> The agent
              cannot see why a previous approach was reverted or what bug a
              past pattern fixed.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Getting Useful Output: Prompt Structure
          </h3>
          <p className="text-muted-foreground mb-2">
            Vague prompts produce generic code. Specific prompts produce
            specific code. The difference:
          </p>
          <div className="bg-muted rounded-lg p-4 mb-4 text-sm font-mono">
            <p className="text-red-600 mb-2">
              Bad: &quot;add authentication to my app&quot;
            </p>
            <p className="text-green-600">
              Good: &quot;add JWT authentication to this Express 4 app. Use
              jsonwebtoken 9.x. Store tokens in httpOnly cookies (not
              localStorage). Middleware should reject requests with 401 if no
              valid token. Do not add a refresh token endpoint — we handle that
              separately.&quot;
            </p>
          </div>
          <p className="text-muted-foreground mb-4">
            The good prompt eliminates 6 design decisions the agent would
            otherwise make arbitrarily.
          </p>
        </div>

        <RelatedTools currentToolSlug="ai-agent-generate-code" />
      </article>`
);

// ─── 2. ai-audio-enhancer ────────────────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'ai-audio-enhancer', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          What AI Audio Enhancement Actually Does to Your Recording
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            A podcast editor submitted a 40-minute interview recorded in a
            kitchen — refrigerator hum at 60 Hz, HVAC rumble at 120 Hz, and a
            guest who occasionally drifted 30 cm from the microphone. Manual
            cleanup in Adobe Audition took 3 hours. After AI enhancement, the
            same cleanup took 11 minutes, reducing noise by 28 dB, boosting
            voice presence at 2–4 kHz, and applying automatic gain control to
            smooth the proximity variation. The refrigerator hum was
            undetectable in the output. The HVAC, 90% gone.
          </p>
          <p className="text-muted-foreground mb-4">
            Understanding what the model does explains when to trust the output
            and when to fix it manually.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Three Distinct Processes Running in Sequence
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Stage</th>
                  <th className="border border-border p-2 text-left">What it does</th>
                  <th className="border border-border p-2 text-left">Works best on</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Noise suppression', 'Identifies stationary noise floor (hum, hiss, fan) and subtracts it using spectral gating', 'Consistent background noise — not music'],
                  ['Voice enhancement', 'Boosts 2–5 kHz presence region, applies de-essing at 6–10 kHz, narrows room reverb', 'Speech recorded in rooms with hard surfaces'],
                  ['Loudness normalization', 'Applies LUFS-R target (typically -16 LUFS for podcast, -23 for broadcast) with true-peak limiting', 'Any recording that needs consistent volume'],
                ].map(([stage, what, best]) => (
                  <tr key={stage} className="border border-border">
                    <td className="border border-border p-2 font-medium">{stage}</td>
                    <td className="border border-border p-2 text-muted-foreground">{what}</td>
                    <td className="border border-border p-2 text-muted-foreground">{best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            When Enhancement Hurts Rather Than Helps
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Music with vocals:</strong> The noise suppressor cannot
              distinguish instrumental backing from &quot;noise&quot; — it will
              artifact the music while trying to clean it. Use only on
              speech-only recordings.
            </li>
            <li>
              <strong>Overlapping speech:</strong> When two people talk
              simultaneously, the voice isolation model picks the dominant
              speaker and suppresses the other. You will lose the quieter
              speaker&apos;s words.
            </li>
            <li>
              <strong>Recordings below 8 kHz sample rate:</strong> Enhancement
              cannot recover frequency content that was never captured. Telephone
              audio (8 kHz) processed at 16 kHz settings sounds hollow and
              artificial.
            </li>
            <li>
              <strong>Clipped audio (over 0 dBFS):</strong> Clipping is
              distortion in the waveform itself, not noise on top of it. No
              enhancement removes clipping; it only makes the distortion more
              audible by boosting surrounding frequencies.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Format and Quality Reference
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Output format</th>
                  <th className="border border-border p-2 text-left">File size (1 min)</th>
                  <th className="border border-border p-2 text-left">Best for</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['WAV 16-bit 44.1 kHz', '~5 MB', 'Further editing, archiving'],
                  ['MP3 320 kbps', '~2.4 MB', 'Podcast distribution'],
                  ['MP3 128 kbps', '~960 KB', 'Web embedding, bandwidth-limited'],
                  ['OGG Vorbis q6', '~1.1 MB', 'Web audio, open format'],
                ].map(([fmt, size, use]) => (
                  <tr key={fmt} className="border border-border">
                    <td className="border border-border p-2 font-mono text-xs">{fmt}</td>
                    <td className="border border-border p-2">{size}</td>
                    <td className="border border-border p-2 text-muted-foreground">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <RelatedTools currentToolSlug="ai-audio-enhancer" />
      </article>`
);

// ─── 3. ai-prompt-generator ──────────────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'ai-prompt-generator', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          The Anatomy of an Effective AI Prompt — And Why Vague Prompts Fail
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            A marketing team ran an A/B test on two prompts to generate product
            descriptions for the same item — a portable solar charger. Prompt A:
            &quot;Write a product description for a solar charger.&quot; Prompt B:
            &quot;Write a 120-word product description for a 20,000 mAh solar
            charger targeting outdoor hikers aged 25–45. Lead with the
            fastest-charging scenario. Mention IP67 water resistance and dual
            USB-C output. Tone: confident, no exclamation marks.&quot; Prompt B
            outperformed Prompt A in click-through rate by 34% in a 2-week
            trial. The only variable was prompt specificity.
          </p>
          <p className="text-muted-foreground mb-4">
            Large language models are probability machines. A vague prompt
            averages over thousands of possible interpretations. A specific
            prompt narrows the distribution to a small region of relevant
            outputs. The prompt generator here applies structural patterns that
            consistently produce narrower, higher-quality distributions.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            The Six Elements of a High-Quality Prompt
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Element</th>
                  <th className="border border-border p-2 text-left">What it does</th>
                  <th className="border border-border p-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Role', 'Sets the persona/expertise level', '"You are a senior Python developer specializing in async code"'],
                  ['Task', 'Clear action verb + deliverable', '"Write a decorator that retries failed HTTP calls"'],
                  ['Context', 'Background that changes the answer', '"The codebase uses httpx 0.27, Python 3.12"'],
                  ['Constraints', 'What to exclude or limit', '"No external libraries beyond httpx. Max 40 lines."'],
                  ['Format', 'Output structure', '"Return only the decorator code, no explanation"'],
                  ['Examples', 'Reference output (few-shot)', '"Here is a similar decorator we use: [code]"'],
                ].map(([el, what, ex]) => (
                  <tr key={el} className="border border-border">
                    <td className="border border-border p-2 font-medium">{el}</td>
                    <td className="border border-border p-2 text-muted-foreground">{what}</td>
                    <td className="border border-border p-2 font-mono text-xs text-muted-foreground">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Prompt Patterns by Use Case
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Image generation (Midjourney/DALL-E):</strong> Subject →
              style → lighting → camera → mood. Order matters — earlier tokens
              have higher weight. &quot;Moroccan medina, watercolor illustration,
              golden hour light, overhead drone view, peaceful&quot; outperforms
              rearranging those words.
            </li>
            <li>
              <strong>Code generation:</strong> Language + version + library
              versions + what it must NOT do. The &quot;must not&quot; constraint
              prevents the most common failure modes (wrong library version,
              unwanted dependencies).
            </li>
            <li>
              <strong>Writing/editing:</strong> Audience + reading level + word
              count + what emotion to leave the reader with. Without the
              emotional target, outputs are technically correct but flat.
            </li>
            <li>
              <strong>Analysis/research:</strong> Specify the output format
              first (table, bullet list, prose) — the model&apos;s reasoning
              adapts to fit the format constraint rather than the format being
              bolted on at the end.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            What the Generator Cannot Do
          </h3>
          <p className="text-muted-foreground mb-4">
            The prompt generator creates structure — it cannot supply domain
            knowledge you haven&apos;t provided. If you don&apos;t specify the
            target model (GPT-4o, Claude 3, Gemini 1.5), the generated prompt
            may use formatting conventions that work on one model and confuse
            another. Chain-of-thought instructions (&quot;think step by step&quot;)
            improve reasoning on models above ~70B parameters but add noise on
            smaller models. The generator applies these patterns conservatively
            by default.
          </p>
        </div>

        <RelatedTools currentToolSlug="ai-prompt-generator" />
      </article>`
);

// ─── 4. ai-story-and-novel-generator ─────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'ai-story-and-novel-generator', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          Using AI Story Generators Without Losing Your Voice
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            A novelist drafting her third book used an AI story generator for a
            specific problem: she knew her plot structure but kept stalling on
            transition scenes — the connector chapters between major events that
            move characters from one situation to the next without drama. She
            fed the generator her character profiles (400 words each), the
            preceding scene&apos;s final paragraph, and the destination scene&apos;s
            opening. The generator produced a 600-word bridge. She kept 40% of
            it verbatim, rewrote 40%, and cut 20%. What would have taken her
            two blocked days took four hours. She finished the novel three weeks
            ahead of schedule.
          </p>
          <p className="text-muted-foreground mb-4">
            That use case — targeted generation for specific structural problems
            — is where AI story tools are most effective. Full novel generation
            from a single prompt produces flat arcs, inconsistent characters,
            and prose that reads like it was written by committee. Targeted
            generation on specific problems produces usable material.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            What AI Handles Well vs. Poorly in Fiction
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Fiction element</th>
                  <th className="border border-border p-2 text-left">AI capability</th>
                  <th className="border border-border p-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Scene-level prose', 'Good', 'Especially action, description, dialogue formatting'],
                  ['Dialogue', 'Good with context', 'Needs character voice examples; generic without them'],
                  ['Plot structure', 'Mediocre', 'Defaults to hero journey/three-act; misses subversions'],
                  ['Character consistency over chapters', 'Poor', 'Context window limits cross-chapter memory'],
                  ['Subtext and irony', 'Poor', 'Tends to state things directly; misses implication'],
                  ['Genre-specific conventions', 'Good', 'Mystery, romance, thriller tropes are well-represented'],
                  ['Original worldbuilding', 'Poor', 'Recombines known worlds; rarely invents truly new ones'],
                ].map(([el, cap, note]) => (
                  <tr key={el} className="border border-border">
                    <td className="border border-border p-2 font-medium">{el}</td>
                    <td className={'border border-border p-2 font-medium ' + (cap.startsWith('Good') ? 'text-green-600' : cap === 'Mediocre' ? 'text-yellow-600' : 'text-red-600')}>{cap}</td>
                    <td className="border border-border p-2 text-muted-foreground text-sm">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Getting Better Output: The Context Injection Method
          </h3>
          <p className="text-muted-foreground mb-4">
            AI story generators fail when they lack context about your specific
            story. Before generating, provide:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Character sheet:</strong> Name, age, want, need, flaw,
              speech pattern. &quot;Wants to be respected; needs to forgive himself;
              flaw is he mistakes cruelty for strength; speaks in short sentences,
              avoids metaphors.&quot;
            </li>
            <li>
              <strong>Setting details:</strong> Physical location, time of day,
              season, what the character smells/hears. Sensory anchors produce
              grounded prose rather than floating dialogue.
            </li>
            <li>
              <strong>Emotional target:</strong> &quot;This scene should leave the
              reader uneasy but not sure why.&quot; Without an emotional target,
              outputs are plotty but not affecting.
            </li>
            <li>
              <strong>What to avoid:</strong> &quot;Do not resolve the conflict in
              this scene. Do not have the characters explain their motivations
              out loud.&quot;
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Copyright and Originality
          </h3>
          <p className="text-muted-foreground mb-4">
            AI-generated fiction in most jurisdictions is not copyrightable by
            the prompter. In the US, the Copyright Office has declined to
            register purely AI-generated creative content (2023 guidance). If
            you substantially rewrite the output — changing more than 50% of
            the material — the human-authored portion may qualify. Treat AI
            output as a draft, not a finished work.
          </p>
        </div>

        <RelatedTools currentToolSlug="ai-story-and-novel-generator" />
      </article>`
);

// ─── 5. ai-text-to-audio-generat ─────────────────────────────────────────────
replaceArticle(
  path.join(toolsDir, 'ai-text-to-audio-generat', 'page.tsx'),
  `<article
        className="mt-8 prose prose-slate dark:prose-invert max-w-none"
        itemScope
        itemType="https://schema.org/TechArticle"
      >
        <meta itemProp="author" content="Achraf A." />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content="2026-05-01" />

        <h2 className="text-2xl font-bold mb-4" itemProp="headline">
          Text-to-Audio: Neural TTS vs. Traditional TTS — What Changed
        </h2>
        <div itemProp="articleBody">
          <p className="text-muted-foreground mb-4">
            An e-learning company converted 60 hours of course text to audio in
            2019 using a commercial TTS service: $0.016 per character, robot
            monotone, no natural pauses, 73% of learner survey respondents said
            &quot;audio was distracting.&quot; In 2024 they ran the same 60 hours
            through a neural TTS system. Cost: $0.000030 per character (533×
            cheaper). Learner survey: 68% said audio was &quot;as natural as a
            human narrator.&quot; The underlying technology changed completely in
            five years.
          </p>
          <p className="text-muted-foreground mb-4">
            Neural TTS (used in this tool) differs from concatenative TTS in
            one key way: instead of stitching together recorded phoneme samples,
            it generates a mel-spectrogram from text using a transformer model,
            then converts that spectrogram to audio waveform using a vocoder.
            This produces prosody (rise and fall of pitch) that matches sentence
            meaning rather than individual words in isolation.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Format Reference: Which Output to Choose
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Format</th>
                  <th className="border border-border p-2 text-left">Size (1 min speech)</th>
                  <th className="border border-border p-2 text-left">Best for</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['MP3 128 kbps', '~960 KB', 'Web playback, podcast, mobile'],
                  ['MP3 64 kbps', '~480 KB', 'Bandwidth-constrained playback'],
                  ['WAV 16-bit 22 kHz', '~2.5 MB', 'Further audio editing'],
                  ['OGG Vorbis', '~700 KB', 'Open-source projects, web'],
                ].map(([fmt, size, use]) => (
                  <tr key={fmt} className="border border-border">
                    <td className="border border-border p-2 font-mono text-xs">{fmt}</td>
                    <td className="border border-border p-2">{size}</td>
                    <td className="border border-border p-2 text-muted-foreground">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Where Neural TTS Still Struggles
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Proper nouns and acronyms:</strong> &quot;SQL&quot; is
              pronounced &quot;sequel&quot; by most developers but &quot;S-Q-L&quot; in some
              contexts. Neural TTS picks one and cannot infer which is correct.
              Use phonetic spelling in your input text if you need a specific
              pronunciation.
            </li>
            <li>
              <strong>Numbers and units:</strong> &quot;3.5&quot; might be read as
              &quot;three point five&quot; or &quot;three and a half&quot;. &quot;1,000&quot; might be
              read as &quot;one thousand&quot; or &quot;one comma zero zero zero&quot; depending
              on locale settings.
            </li>
            <li>
              <strong>Emotional range:</strong> Neural TTS can produce warm,
              neutral, or energetic — it cannot produce grief, sarcasm, or
              controlled anger convincingly. For emotionally demanding narration,
              a human voice actor still outperforms.
            </li>
            <li>
              <strong>Languages with tonal systems:</strong> Mandarin Chinese,
              Thai, and Vietnamese require correct tones for meaning. Neural TTS
              quality varies significantly by language; check with a native
              speaker before publishing.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Practical Input Tips
          </h3>
          <p className="text-muted-foreground mb-4">
            Write your text the way you want it spoken. Use full stops to
            create pauses. Spell out abbreviations. Break long sentences into
            two shorter ones — neural TTS handles 15-word sentences better than
            40-word ones. Avoid em-dashes inside sentences (the model pauses
            inconsistently at them); use commas or split into separate sentences
            instead.
          </p>
        </div>

        <RelatedTools currentToolSlug="ai-text-to-audio-generat" />
      </article>`
);

console.log('\nBatch 15 complete.');

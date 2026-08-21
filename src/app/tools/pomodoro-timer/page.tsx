import type { Metadata } from "next"
import ClientPage from "./client-page"
import { QuickAnswer } from "@/components/seo/quick-answer"; import { RelatedTools } from "@/components/tools/related-tools";
import { EmailCapture } from "@/components/tools/email-capture"
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_PATH = "/tools/pomodoro-timer"
const TOOL_URL = `${SITE_URL}${TOOL_PATH}`

export const metadata: Metadata = {
  title: "Free 25-Minute Pomodoro Timer Online — Study, Focus, No Signup",
  description:
    "Free online 25-minute Pomodoro timer with task list, break tracking, and sound alerts. Study timer for students, focus timer for work and ADHD. No signup, no app to install.",
  keywords: [
    "pomodoro timer", "pomodoro timer online free", "25 minute timer", "focus timer online",
    "study timer", "pomodoro technique", "work timer online", "productivity timer free",
    "pomodoro clock", "25 5 timer", "online study timer", "pomodoro timer no signup",
    "focus session timer", "break timer", "pomodoro method free",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    title: "Free Pomodoro Timer — Focus & Study Timer Online",
    description: "25-minute Pomodoro timer with task list, break tracking, and sound alerts. Free, no signup.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
    locale: "en_US",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Free Pomodoro Timer Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Pomodoro Timer — Focus & Study Timer",
    description: "25-min focus sessions + breaks. Free online Pomodoro timer with task list and sound alerts.",
    images: [`${SITE_URL}/og-image.png`],
    site: "@thefreeaitools",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
}

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pomodoro Timer — Free Online Focus Timer",
  url: TOOL_URL,
  description: "A free browser-based Pomodoro technique timer with 25-minute work sessions, 5-minute short breaks, 15-minute long breaks, task list, and audio alerts.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "25-minute Pomodoro work sessions",
    "5-minute short breaks and 15-minute long breaks",
    "Audio notification on session completion",
    "Task list with completion tracking",
    "Session counter and total focus time",
    "Customizable session durations",
    "Updates browser tab title with countdown",
  ],
  publisher: { "@type": "Organization", name: "TheFreeAITools", url: SITE_URL },
}

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Use the Pomodoro Technique",
  description: "A step-by-step guide to using the Pomodoro Technique to improve focus and productivity.",
  totalTime: "PT30M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Add your tasks", text: "Before starting, list the tasks you want to complete during your session. This prevents task-switching and keeps you focused.", url: TOOL_URL },
    { "@type": "HowToStep", position: 2, name: "Start a 25-minute focus session", text: "Click START to begin your Pomodoro session. Work on a single task without distractions for the full 25 minutes.", url: TOOL_URL },
    { "@type": "HowToStep", position: 3, name: "Take a short break", text: "When the alarm sounds, take a 5-minute break. Step away from your screen, stretch, or hydrate.", url: TOOL_URL },
    { "@type": "HowToStep", position: 4, name: "Repeat and take a long break", text: "After 4 Pomodoros, take a 15-minute long break. The timer will automatically suggest the correct break type.", url: TOOL_URL },
  ],
}

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Pomodoro Technique?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses timed work intervals (traditionally 25 minutes) separated by short breaks to improve focus and reduce mental fatigue. Each work interval is called a 'Pomodoro' (Italian for tomato, after the tomato-shaped timer Cirillo used).",
      },
    },
    {
      "@type": "Question",
      name: "Why 25 minutes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "25 minutes is long enough to make meaningful progress on a task but short enough to maintain focused attention without mental fatigue. Research on attention spans suggests that sustained focus begins to degrade after 20–30 minutes for most people. You can customize the duration in the settings if 25 minutes doesn't suit your work style.",
      },
    },
    {
      "@type": "Question",
      name: "Does the Pomodoro Technique actually work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Multiple studies support time-boxing as an effective productivity strategy. The technique works by creating a sense of urgency (the ticking clock), reducing open-ended procrastination, making large tasks feel manageable, and building in mandatory rest to prevent burnout. It is particularly effective for knowledge workers, students, and anyone who struggles with distraction.",
      },
    },
    {
      "@type": "Question",
      name: "What if I finish a task before the timer ends?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the remaining time to review your work, start the next task, or practice over-learning the material. Do not end the session early — completing the full Pomodoro builds the habit of deep focus even when the immediate task is done.",
      },
    },
    {
      "@type": "Question",
      name: "Can I customize the Pomodoro timer duration?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Open the 'Customize durations' section at the bottom of the timer to adjust the work session length, short break, and long break to fit your personal work rhythm. Common alternatives are 50/10 (50-minute sessions with 10-minute breaks) for tasks requiring deeper focus.",
      },
    },
  ],
}

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Productivity Tools", item: `${SITE_URL}/tools` },
    { "@type": "ListItem", position: 3, name: "Pomodoro Timer", item: TOOL_URL },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <div className="px-4 md:px-14 py-8">
        <header className="mb-6 space-y-4 px-2 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Free 25-Minute Pomodoro Timer Online — Study, Focus, No Signup
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Boost your productivity with the <strong>Pomodoro Technique</strong>. Work for 25 minutes,
            break for 5, and take a 15-minute rest every 4 sessions. Free browser-based timer with
            task list, session counter, and sound alerts — no signup, no install.
          </p>

          <QuickAnswer
            question="How does the Pomodoro Technique work?"
            answer="Work for 25 minutes without interruption, then take a 5-minute break. After 4 sessions, take a 15-minute long break. Each 25-minute block is called a 'Pomodoro'. The structured intervals improve focus and prevent mental fatigue."
          />

          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground pt-2">
            <ol className="flex items-center gap-1.5">
              <li><a href={`${SITE_URL}/`} className="hover:text-foreground transition-colors">Home</a></li>
              <li aria-hidden="true">›</li>
              <li><a href={`${SITE_URL}/tools`} className="hover:text-foreground transition-colors">Tools</a></li>
              <li aria-hidden="true">›</li>
              <li><span className="text-foreground font-medium">Pomodoro Timer</span></li>
            </ol>
          </nav>
        </header>

        <main id="tool" aria-label="Pomodoro Timer Tool">
           <ClientPage />
        </main>

        <div className="mt-8">
          <EmailCapture />
        </div>

        <hr className="border-border my-12" />

        <article className="space-y-10 max-w-4xl" itemScope itemType="https://schema.org/TechArticle">
          <meta itemProp="name" content="The Pomodoro Technique: Evidence-Based Focus Strategy" />
          <meta itemProp="description" content="Why the Pomodoro Technique works, how to customize it for your work style, and how to combine it with deep work principles." />
          <meta itemProp="datePublished" content="2026-06-01" />
          <meta itemProp="dateModified" content="2026-06-04" />
          <meta itemProp="author" content="Achraf A." />

          <section aria-labelledby="why-pomodoro-works" className="space-y-4">
            <h2 id="why-pomodoro-works" className="text-2xl font-semibold tracking-tight">
              Why the Pomodoro Technique works
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The technique works on four psychological principles. First, <strong>time constraints reduce perfectionism</strong> —
              knowing you have only 25 minutes forces you to start working instead of planning indefinitely.
              Second, <strong>breaks prevent cognitive fatigue</strong> — the human brain can maintain peak focus
              for roughly 20–30 minutes before attention drifts; the built-in break resets this clock.
              Third, <strong>visible progress builds motivation</strong> — counting completed Pomodoros turns
              abstract work into a concrete, measurable streak. Fourth, <strong>single-tasking reduces context-switching costs</strong> —
              each session is dedicated to one task, eliminating the 23-minute re-focus time lost when switching between tasks.
            </p>
          </section>

          <section aria-labelledby="tips" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="tips" className="text-2xl font-semibold tracking-tight">
              5 ways to get more from each Pomodoro
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground list-none pl-0">
              {[
                ["Write tasks before starting", "List what you&apos;ll do in the next session. This primes your brain and reduces decision fatigue during the work interval."],
                ["Silence all notifications", "Every notification is an attention context switch. Turn on Do Not Disturb before the timer starts."],
                ["Stand up during short breaks", "Don&apos;t scroll your phone — move your body. Even 30 seconds of standing improves circulation and helps reset focus."],
                ["Track your Pomodoro count", "High performers consistently use 6–10 Pomodoros per day. Tracking gives you honest data about your actual productive hours."],
                ["Adjust for task type", "Use 50/10 intervals for deep creative work, 25/5 for email and admin tasks. Customize the timer to match the cognitive load."],
              ].map(([title, text]) => (
                <li key={title as string} className="flex gap-3">
                  <span className="font-bold text-foreground shrink-0">{title}</span>
                  <span dangerouslySetInnerHTML={{ __html: text as string }} />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="study-guide" className="space-y-4">
            <h2 id="study-guide" className="text-2xl font-semibold tracking-tight">
              Using the Pomodoro timer for studying — students and exam prep
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The Pomodoro method is particularly effective for studying because it directly
              addresses the two biggest study problems: starting (procrastination) and stopping
              (cramming without breaks, which degrades retention).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left font-semibold">Study task</th>
                    <th className="border border-border p-2 text-left font-semibold">Recommended session</th>
                    <th className="border border-border p-2 text-left font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Reading a textbook chapter", "25 min × 2–3", "Dense material; shorter sessions force active summarization at each break"],
                    ["Flashcard review (Anki, Quizlet)", "25 min", "Spaced repetition already structures the session; one Pomodoro per deck"],
                    ["Essay or report writing", "50 min × 2–4", "Extended sessions reduce restart friction — use 50/10 for deep writing"],
                    ["Practice problems / past papers", "25 min", "Stop at the alarm even mid-problem; review what you completed in the break"],
                    ["Lecture replay or note review", "25 min", "Passive consumption — breaks force you to test recall before continuing"],
                    ["Memorisation (dates, formulas, vocab)", "25 min × many", "Multiple short sessions outperform single long ones for retention (spacing effect)"],
                  ].map(([task, session, why]) => (
                    <tr key={String(task)}>
                      <td className="border border-border p-2 font-medium text-sm">{task}</td>
                      <td className="border border-border p-2 text-muted-foreground text-sm">{session}</td>
                      <td className="border border-border p-2 text-muted-foreground text-xs">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="adhd-section" className="space-y-4 rounded-xl bg-primary/5 p-6 md:p-8 border border-primary/10">
            <h2 id="adhd-section" className="text-2xl font-semibold tracking-tight">
              Pomodoro timer for ADHD — shorter sessions, external structure
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The Pomodoro method is widely used by people with ADHD because it provides two
              things the ADHD brain struggles to generate internally: <strong>a defined start</strong>{" "}
              (pressing the button removes the decision paralysis of "when to begin") and{" "}
              <strong>an external deadline</strong> (the ticking timer creates urgency without
              requiring motivation).
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              For ADHD specifically: <strong>shorten the work session</strong>. 25 minutes is the
              standard, but 10–15 minutes works better for hyperfocus tasks that are hard to start
              (a shorter timer is less intimidating) or for high-distractibility environments. Use
              the "Customize durations" section in the timer to set it to 10 or 15 minutes. After
              completing 3–4 mini-Pomodoros successfully, gradually extend to 20, then 25.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The mandatory break is especially important for ADHD: without it, hyperfocus can
              run for hours and cause burnout. Set the break to 10 minutes and physically leave
              your workspace during it — the environmental change helps reset focus.
            </p>
          </section>

          <section aria-labelledby="interval-variants" className="space-y-4">
            <h2 id="interval-variants" className="text-2xl font-semibold tracking-tight">
              Customize the timer — 25/5, 50/10, or 90/20?
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              The standard 25/5 interval was chosen arbitrarily by Francesco Cirillo — it is not
              backed by specific science. The right interval depends on your work type and
              attentional capacity. Use the "Customize durations" section to change it:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-foreground shrink-0">25/5 (standard)</span>
                <span>Best for: email, admin, reading, tasks with frequent context switching. The short sessions prevent overcommitting to any one task.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-foreground shrink-0">50/10</span>
                <span>Best for: deep writing, coding, research, design. 50 minutes is long enough to reach a flow state. 10-minute breaks are enough to reset without losing context.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-foreground shrink-0">90/20</span>
                <span>Based on the ultradian rhythm (the body&apos;s natural 90-minute focus-rest cycle). Best for: very deep work on a single problem. Demanding — not suitable for early adopters of the method.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-foreground shrink-0">10/2 or 15/3</span>
                <span>Best for: high-distraction environments, ADHD, or any task where starting is the hardest part. Very short sessions build momentum and habit before extending.</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="related-tools-heading" className="space-y-4">
            <h2 id="related-tools-heading" className="text-xl font-semibold tracking-tight">Related productivity tools</h2>
            <nav aria-label="Related tools">
              <RelatedTools
                tools={[
                  { name: "Word Counter", path: "/tools/word-counter" },
                  { name: "Typing Speed Test", path: "/tools/typing-speed-test" },
                  { name: "Internet Speed Test", path: "/tools/test-speed-connection" },
                ]}
              />
            </nav>
          </section>
        </article>

        <footer className="mt-12 pt-6 border-t text-xs text-muted-foreground max-w-4xl">
          <p>
            <strong>TheFreeAITools — Pomodoro Timer</strong> is a free browser-based focus timer
            implementing the Pomodoro Technique. Features 25-minute work intervals, 5-minute short breaks,
            15-minute long breaks after every 4 sessions, task tracking, session statistics, and audio alerts.
            No signup, no install, works on all devices.
          </p>
        </footer>
      </div>
    </>
  )
}

import { ArrowRightIcon } from "../_components/Icons";
import Image from "next/image";
import Link from "next/link";
import PageShell from "../_components/PageShell";
import { CommercialCTA } from "../_components/WhatsAppCTA";
import { BreadcrumbSchema, FAQSchema } from "../schema";
import { pageMetadata } from "@/lib/seo";
const path = "/setup-guides";
export const metadata = pageMetadata({
  title: "IPTV Setup Guides for TV, Mobile & Fire TV | WATCHWORLDCUP",
  description:
    "Step-by-step IPTV and M3U setup workflows for Smart TV, Android, iPhone, Fire TV, and desktop. Confirm your device, app, and credential format before configuring.",
  path,
  type: "article",
});
const faqs = [
  {
    question: "What information is normally required for IPTV setup?",
    answer:
      "A compatible app may request an M3U playlist URL or another credential format supplied after the order. Use only the exact details provided to you.",
  },
  {
    question: "Which IPTV app should I install?",
    answer:
      "App availability and compatibility differ by device and region. Confirm the intended app and credential format with support before purchasing.",
  },
  {
    question: "Should I share my IPTV credentials?",
    answer:
      "No. Treat playlist URLs, usernames and passwords as private subscription credentials.",
  },
  {
    question: "What should I check when playback fails?",
    answer:
      "Check the subscription status, exact credentials, internet connection, app version, device time, restart state and whether the content is currently available.",
  },
];
export default function Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Setup guides", path },
        ]}
      />
      <FAQSchema faqs={faqs} path={path} />
      <PageShell
        eyebrow="IPTV / M3U setup"
        title="Prepare your device and compatible IPTV application."
        description="Setup screens differ by platform and app. Use this workflow to identify the required information, enter delivered subscription details safely and troubleshoot common configuration problems."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Setup guides" }]}
      >
        <div className="relative aspect-[16/7]">
          <Image
            src="/images/commercial/devices.webp"
            alt="Original illustration of generic IPTV-compatible device families"
            fill
            priority
            quality={55}
            sizes="100vw"
            className="object-cover saturate-[.78] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/75 to-transparent" />
        </div>
        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Smart TV / TV platform",
            "Android TV or Android",
            "iPhone or iPad",
            "Windows or Mac",
            "Fire TV class device",
            "Streaming box",
            "Phone or tablet",
            "Compatible IPTV application",
          ].map((device) => (
            <article
              key={device}
              className="premium-card glass rounded-2xl p-6"
            >
              <h2 className="font-black">{device}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Confirm the exact model, OS, app and credential format before
                ordering.
              </p>
            </article>
          ))}
        </section>
        <section className="mt-16">
          <p className="eyebrow">Generic setup workflow</p>
          <h2 className="mt-3 text-3xl font-black">
            Six steps from requirements to troubleshooting
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {[
              [
                "1. Requirements",
                "Record the device model, operating system, available storage, network type and intended IPTV application.",
              ],
              [
                "2. Installation",
                "Install a compatible IPTV application from the device’s legitimate app source. Confirm that the app accepts the supplied credential format.",
              ],
              [
                "3. Configuration",
                "Open the app’s playlist, account or provider section. Labels vary by app; do not copy credentials into unrelated websites.",
              ],
              [
                "4. Login or playlist setup",
                "Enter the M3U URL or other subscription information exactly as delivered. Avoid adding spaces or exposing the details in screenshots.",
              ],
              [
                "5. First playback check",
                "Allow the app to load, then test one currently available item. Confirm audio, language and stream behavior on your network.",
              ],
              [
                "6. Troubleshooting",
                "Recheck credentials, subscription status, device time, app updates, network connection and restart state before requesting support.",
              ],
            ].map(([title, text]) => (
              <article
                key={title}
                className="premium-card glass rounded-2xl p-7"
              >
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="mt-16 grid gap-5 lg:grid-cols-2">
          <div className="glass rounded-2xl p-7">
            <h2 className="text-2xl font-black">
              Keep subscription details private
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              M3U URLs and account credentials can provide access to the
              subscription. Do not publish them, paste them into unknown tools,
              or send passwords and one-time security codes.
            </p>
          </div>
          <div className="glass rounded-2xl p-7">
            <h2 className="text-2xl font-black">
              Diagnose network problems separately
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              A correct setup can still be affected by Wi-Fi, device resources,
              app behavior or source availability.
            </p>
            <Link
              href="/guides/stop-sports-buffering"
              className="mt-5 inline-block font-black text-red-400"
            >
              Open the buffering diagnostic
              <ArrowRightIcon className="ml-2 inline h-4 w-4" />
            </Link>
          </div>
        </section>
        <section className="mt-16 max-w-4xl">
          <h2 className="text-3xl font-black">Setup questions</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="glass rounded-2xl p-6">
                <summary className="cursor-pointer font-bold">
                  {f.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
        <div className="mt-16">
          <CommercialCTA placement="setup-guides" />
        </div>
      </PageShell>
    </>
  );
}

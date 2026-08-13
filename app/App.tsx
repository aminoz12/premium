"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackWhatsAppClick } from "./_components/WhatsAppCTA";
import CommercialPlanCards from "./_components/CommercialPlanCards";
import { WHATSAPP_URL, whatsappOrderUrl } from "@/lib/cta";
import { serviceCategories } from "@/lib/commercial";
import {
  ArchiveIcon,
  ArrowRightIcon,
  ChannelStackIcon,
  CheckCircleIcon,
  ClockIcon,
  DeviceIcon,
  FilmIcon,
  HandshakeIcon,
  ListIcon,
  MessageIcon,
  SeriesIcon,
  ShieldIcon,
  SportsIcon,
  TvIcon,
} from "./_components/Icons";

const serviceFaqs = [
  [
    "What does WATCHWORLDCUP sell?",
    "WATCHWORLDCUP sells time-based IPTV / M3U subscriptions. Current content, language, quality, app, device and regional availability should be confirmed before payment.",
  ],
  [
    "How do I order?",
    "Choose a plan, then contact WATCHWORLDCUP through the displayed WhatsApp ordering link. Confirm the plan and compatibility details before payment.",
  ],
  [
    "Are specific channels, films or series guaranteed?",
    "No title or channel is guaranteed on this website without a connected, dated inventory source. Ask for current availability before ordering.",
  ],
  [
    "Does WATCHWORLDCUP claim official sports or FIFA affiliation?",
    "No. WATCHWORLDCUP is not FIFA, a league, a broadcaster, a studio, or an official tournament partner.",
  ],
];
const channels = [
  { id: 1, src: "images/assets/channels/1.webp", alt: "Channel 1" },
  { id: 2, src: "images/assets/channels/2.webp", alt: "Channel 2" },
  { id: 3, src: "images/assets/channels/3.webp", alt: "Channel 3" },
  { id: 4, src: "images/assets/channels/4.webp", alt: "Channel 4" },
  { id: 5, src: "images/assets/channels/5.webp", alt: "Channel 5" },
  { id: 6, src: "images/assets/channels/6.webp", alt: "Channel 6" },
];
const sports = [
  { id: 1, src: "images/assets/sports/1.webp", alt: "Channel 1" },
  { id: 2, src: "images/assets/sports/2.webp", alt: "Channel 2" },
  { id: 3, src: "images/assets/sports/3.webp", alt: "Channel 3" },
  { id: 4, src: "images/assets/sports/4.webp", alt: "Channel 4" },
  { id: 5, src: "images/assets/sports/5.webp", alt: "Channel 5" },
  { id: 6, src: "images/assets/sports/6.webp", alt: "Channel 6" },
  { id: 7, src: "images/assets/sports/7.webp", alt: "Channel 7" },
  { id: 8, src: "images/assets/sports/8.webp", alt: "Channel 8" },
  { id: 9, src: "images/assets/sports/9.webp", alt: "Channel 9" },
];
const payments = [
  {
    id: 1,
    src: "images/assets/payment/crypto.svg",
    alt: "crypto ",
    name: "crypto",
  },
  {
    id: 2,
    src: "images/assets/payment/mastercard.svg",
    alt: "mastercard ",
    name: "mastercard",
  },
  {
    id: 3,
    src: "images/assets/payment/paypal.svg",
    alt: "paypal ",
    name: "paypal",
  },
  {
    id: 4,
    src: "images/assets/payment/revolut.svg",
    alt: "revolut ",
    name: "revolut",
  },
  { id: 5, src: "images/assets/payment/visa.svg", alt: "visa ", name: "visa" },
];

const movies = [
  "Bobleponge.webp",
  "DaredevilReoborn.webp",
  "kanan.webp",
  "Mufasa.webp",
  "onepiece",
  "Paddington.webp",
  "Reacher.webp",
  "shangri.webp",
  "sololeveling.webp",
  "TheElectricState.webp",
  "TheGorge.webp",
];

const serviceIcons = {
  "/live-tv": TvIcon,
  "/sports": SportsIcon,
  "/movies": FilmIcon,
  "/series": SeriesIcon,
} as const;
const orderIcons = [
  ListIcon,
  CheckCircleIcon,
  DeviceIcon,
  MessageIcon,
  ShieldIcon,
];
const factIcons = [ClockIcon, ListIcon, MessageIcon, ShieldIcon];
const channelRequestUrl = whatsappOrderUrl(
  "Hi! I want a current availability check from WATCHWORLDCUP IPTV. My request concerns: beIN SPORTS, Disney, Netflix, or another named channel/platform. Country/region: [add]. Language: [add]. Please confirm what is currently available before payment.",
);
const collaborationUrl = whatsappOrderUrl(
  "Hi! I want to discuss a collaboration with WATCHWORLDCUP IPTV. Collaboration type: [editorial, data, business, or other]. Organization/name: [add]. Proposal: [add].",
);
function Splash({
  progressRef,
  fading,
}: {
  progressRef: RefObject<HTMLParagraphElement | null>;
  fading: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute right-4 top-24 z-[100] transition-opacity duration-700 sm:right-6 lg:right-10 lg:top-28 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      <div className="w-40 rounded-2xl border border-white/10 bg-[#0b0b0c]/95 px-5 py-4 text-center shadow-[0_24px_80px_rgba(0,0,0,.62),0_0_60px_rgba(239,59,79,.12)] backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-xs font-black text-white shadow-[0_0_45px_rgba(239,59,79,.22)]">
          WWC
        </div>
        <p
          ref={progressRef}
          className="mt-3 text-3xl font-black tabular-nums text-white"
        >
          0
        </p>
        <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[.2em] text-red-400">
          Loading service
        </p>
      </div>
    </div>
  );
}
export default function App() {
  const progressRef = useRef<HTMLParagraphElement>(null),
    [fading, setFading] = useState(false),
    [mounted, setMounted] = useState(true);
  useEffect(() => {
    let frame = 0;
    let hold: ReturnType<typeof setTimeout> | undefined;
    let remove: ReturnType<typeof setTimeout> | undefined;
    const started = performance.now();
    const tick = (now: number) => {
      const value = Math.min(100, Math.floor(((now - started) / 1500) * 100));
      if (progressRef.current) progressRef.current.textContent = String(value);
      if (value < 100) frame = requestAnimationFrame(tick);
      else
        hold = setTimeout(() => {
          setFading(true);
          remove = setTimeout(() => setMounted(false), 700);
        }, 300);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      if (hold) clearTimeout(hold);
      if (remove) clearTimeout(remove);
    };
  }, []);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(".glass")
          : null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
      target.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", move, { passive: true });
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section"),
    ).slice(1);
    for (const section of sections) {
      section.classList.add("reveal-section");
      Array.from(section.children).forEach((child, index) => {
        const item = child as HTMLElement;
        item.classList.add("reveal-item");
        item.style.setProperty(
          "--reveal-delay",
          `${Math.min(index * 90, 450)}ms`,
        );
      });
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.01, rootMargin: "100px 0px 100px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      document.removeEventListener("pointermove", move);
    };
  }, []);
  const [isReverse, setIsReverse] = useState(false);
  const [speed, setSpeed] = useState(25); // Speed in seconds
  return (
    <>
      {mounted && <Splash progressRef={progressRef} fading={fading} />}
      <main>
        <section className="soft-grid relative min-h-[88vh] overflow-hidden border-b border-white/5">
          <div
            aria-hidden="true"
            className="hero-media absolute inset-y-0 right-0 hidden w-[62%] bg-cover bg-center opacity-40 lg:block"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_32%,rgba(239,59,79,.11),transparent_34%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/88 to-[#080808]/50" />
          <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center justify-between gap-10 px-4 py-20 md:px-8">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-400/10 px-4 py-2 text-xs font-extrabold text-red-300">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                IPTV / M3U subscriptions · WhatsApp ordering
              </div>
              <h1
                className="mt-7 font-black leading-[.92] tracking-[-.055em]"
                style={{ fontSize: "clamp(2.8rem,6.7vw,6.5rem)" }}
              >
                LIVE TV. SPORTS.
                <br />
                <span className="bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent">
                  MOVIES. SERIES.
                </span>
              </h1>
              <p className="mt-7 max-w-3xl text-base leading-8 text-slate-200 md:text-xl">
                WATCHWORLDCUP provides time-based IPTV and M3U subscriptions for
                use with compatible IPTV applications and devices. Confirm
                current content, language, quality and compatibility before
                ordering.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/pricing" className="button-primary px-7 py-4">
                  Choose your IPTV subscription
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M4 10h11M11 6l4 4-4 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  onClick={() => trackWhatsAppClick("home-hero")}
                  className="button-whatsapp px-7 py-4"
                >
                  Order on WhatsApp
                </a>
              </div>
              <p className="mt-5 max-w-3xl text-xs leading-6 text-slate-400">
                No catalog totals or specific titles are claimed without a
                connected inventory source. WATCHWORLDCUP is not affiliated with
                FIFA, leagues, broadcasters, studios or streaming platforms.
              </p>
            </div>
            <aside className="surface-panel soft-grid hidden w-72 shrink-0 rounded-2xl p-6 xl:block">
              <p className="eyebrow">Before ordering</p>
              <h2 className="mt-4 text-xl font-black">Confirm your setup</h2>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                {[
                  "Current content scope",
                  "Exact device and IPTV app",
                  "Delivery, payment and terms",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-[#080808]/70 p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-xs font-black text-red-300">
                      {index + 1}
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <Link
                href="/order"
                className="mt-5 flex items-center font-black text-red-300"
              >
                Prepare order
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M4 10h11M11 6l4 4-4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </aside>
          </div>
        </section>
        <div className="flex flex-col items-center justify-center gap-6 ">
          {/* Infinite Logo Loop Container */}
          <div className="relative w-full overflow-hidden">
            {/* Animated Marquee Row */}
            <div
              className={`flex w-max hover:[animation-play-state:paused] ${
                isReverse
                  ? "animate-infinite-scroll"
                  : "animate-infinite-scroll-reverse"
              }`}
              style={{ animationDuration: `${speed}s` }}
            >
              {/* Duplicated set for smooth infinite loop without gaps */}
              {[...channels, ...channels].map((channel, index) => (
                <div
                  key={`${channel.id}-${index}`}
                  className="flex items-center justify-center mx-8 transition-transform duration-300 hover:scale-110"
                >
                  <img
                    src={channel.src}
                    alt={channel.alt}
                    className="h-28 w-auto max-w-[150px] object-contain transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 ">
          {/* Infinite Logo Loop Container */}
          <div className="relative w-full overflow-hidden">
            {/* Animated Marquee Row */}
            <div
              className={`flex w-max hover:[animation-play-state:paused] ${
                isReverse
                  ? "animate-infinite-scroll-reverse"
                  : "animate-infinite-scroll"
              }`}
              style={{ animationDuration: `${speed}s` }}
            >
              {/* Duplicated set for smooth infinite loop without gaps */}
              {[...sports, ...sports].map((channel, index) => (
                <div
                  key={`${channel.id}-${index}`}
                  className="flex items-center justify-center mx-8 transition-transform duration-300 hover:scale-110"
                >
                  <img
                    src={channel.src}
                    alt={channel.alt}
                    className="h-28 w-auto max-w-[150px] object-contain transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <p className="eyebrow">Entertainment categories</p>
          <h2 className="mt-4 max-w-4xl text-3xl font-black md:text-5xl">
            One subscription service, four content areas.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Browse the service structure, then ask for the current availability
            relevant to your country, language and viewing needs.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {serviceCategories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group premium-card glass overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[16/7] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={`Original illustrative artwork for ${category.title}`}
                    fill
                    quality={55}
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover saturate-[.78] contrast-110 opacity-60 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141416] to-transparent" />
                </div>
                <div className="p-7">
                  {(() => {
                    const Icon =
                      serviceIcons[category.href as keyof typeof serviceIcons];
                    return <Icon className="h-7 w-7 text-red-400" />;
                  })()}
                  <h3 className="mt-5 text-2xl font-black">{category.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {category.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-black text-red-400">
                    Explore category
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
            <p className="eyebrow">Simple ordering flow</p>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              From plan selection to IPTV setup.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-5">
              {[
                ["01", "Choose a plan", "Select 3 months, 6 months or 1 year."],
                [
                  "02",
                  "Confirm availability",
                  "Ask about current content, language and region.",
                ],
                [
                  "03",
                  "Check compatibility",
                  "Confirm your device and intended IPTV app.",
                ],
                [
                  "04",
                  "Order on WhatsApp",
                  "Agree on delivery, payment and applicable terms.",
                ],
                [
                  "05",
                  "Set up your access",
                  "Use the delivered subscription details with a compatible app.",
                ],
              ].map(([n, title, text], index) => {
                const Icon = orderIcons[index];
                return (
                  <article key={n} className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <Icon className="h-6 w-6 text-red-400" />
                      <span className="text-xs font-black text-slate-500">
                        {n}
                      </span>
                    </div>
                    <h3 className="mt-5 font-black">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Verified plan prices</p>
              <h2 className="mt-4 text-3xl font-black md:text-5xl">
                Choose your IPTV subscription.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                Plan prices and durations are shown below. Content inventory and
                technical compatibility are confirmed through WhatsApp before
                payment.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 font-black text-red-400"
            >
              Compare plan details
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10">
            <CommercialPlanCards placement="home-plan" />
          </div>
          <div className="flex flex-row items-center justify-center gap-6 overflow-x-auto py-2  rounded-xl">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col items-center gap-1 min-w-[60px] border border-white/30"
              >
                <img
                  src={payment.src}
                  alt={payment.alt}
                  width={50}
                  height={50}
                  className="object-contain hover:scale-110 transition-all duration-300"
                />
                <span className="text-xs hover:text-red-400 transition-all duration-300 font-black text-slate-500 text-center">
                  {payment.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="">
          <div className="mx-auto grid max-w-8xl gap-10 px-4 py-20 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div className="relative aspect-[16/11] overflow-hidden ">
              <Image
                src="/images/commercial/devices.webp"
                alt="Original illustration of generic television, computer, tablet and phone device types"
                fill
                quality={55}
                sizes="(max-width:1424px) 100vw, 45vw"
                className="object-cover saturate-[.78] contrast-110"
              />
            </div>
            <div>
              <p className="eyebrow">Compatibility before purchase</p>
              <h2 className="mt-4 text-3xl font-black md:text-5xl">
                Use your M3U details with a compatible IPTV app.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                App support differs by television, streaming device, phone,
                tablet and computer. Tell support your exact device model and
                intended app before ordering.
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                {[
                  "Exact device and operating system",
                  "IPTV application name and version",
                  "Playlist or credential format required",
                  "Network and display capability",
                ].map((item) => (
                  <li
                    key={item}
                    className="glass flex items-center gap-3 rounded-xl p-4"
                  >
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/setup-guides"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-black text-white hover:bg-red-500"
              >
                View setup guides
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      
        <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
          <p className="eyebrow">Questions before ordering</p>
          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            IPTV subscription FAQ
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {serviceFaqs.map(([question, answer]) => (
              <details key={question} className="glass rounded-2xl p-6">
                <summary className="cursor-pointer font-black">
                  {question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

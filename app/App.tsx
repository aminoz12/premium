"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type FC,
  type RefObject,
} from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────── Types ─────────────── */
interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

interface Payment {
  id: number;
  src: string;
  alt: string;
  name: string;
}

interface Channel {
  id: number;
  src: string;
  alt: string;
}

/* ─────────────── Data ─────────────── */
const movies: string[] = [
  "Bobleponge.webp",
  "DaredevilReborn.webp",
  "kanan.webp",
  "Mufasa.webp",
  "onepiece.webp",
  "Paddington.webp",
  "Reacher.webp",
  "shangri.webp",
  "sololeveling.webp",
  "TheElectricState.webp",
  "TheGorge.webp",
];

const serviceFaqs: [string, string][] = [
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
  [
    "Can I get a free trial before purchasing?",
    "Yes! WATCHWORLDCUP offers a 24-hour free trial so you can test the service before committing to a paid plan. Contact us on WhatsApp at +212 723 279 328 to get started.",
  ],
  [
    "Which devices are compatible with the IPTV service?",
    "Our IPTV service is compatible with Smart TVs, Android/iOS phones, tablets, Amazon Fire Stick, MAG boxes, and computers. Always confirm your specific device model before ordering.",
  ],
  [
    "What payment methods do you accept?",
    "We accept Cryptocurrency, Mastercard, Visa, PayPal, and Revolut. All payment details are confirmed securely via WhatsApp before any transaction.",
  ],
  [
    "How quickly is my subscription activated after payment?",
    "Most subscriptions are activated within 1–3 hours after payment confirmation. Our support team will guide you through the setup process via WhatsApp.",
  ],
];

const channels: Channel[] = [
  { id: 1, src: "images/assets/channels/1.webp", alt: "Channel 1" },
  { id: 2, src: "images/assets/channels/2.webp", alt: "Channel 2" },
  { id: 3, src: "images/assets/channels/3.webp", alt: "Channel 3" },
  { id: 4, src: "images/assets/channels/4.webp", alt: "Channel 4" },
  { id: 5, src: "images/assets/channels/5.webp", alt: "Channel 5" },
  { id: 6, src: "images/assets/channels/6.webp", alt: "Channel 6" },
];

const sports: Channel[] = [
  { id: 1, src: "images/assets/sports/1.webp", alt: "Sport 1" },
  { id: 2, src: "images/assets/sports/2.webp", alt: "Sport 2" },
  { id: 3, src: "images/assets/sports/3.webp", alt: "Sport 3" },
  { id: 4, src: "images/assets/sports/4.webp", alt: "Sport 4" },
  { id: 5, src: "images/assets/sports/5.webp", alt: "Sport 5" },
  { id: 6, src: "images/assets/sports/6.webp", alt: "Sport 6" },
  { id: 7, src: "images/assets/sports/7.webp", alt: "Sport 7" },
  { id: 8, src: "images/assets/sports/8.webp", alt: "Sport 8" },
  { id: 9, src: "images/assets/sports/9.webp", alt: "Sport 9" },
];

const payments: Payment[] = [
  { id: 1, src: "images/assets/payment/crypto.svg", alt: "Crypto", name: "Crypto" },
  { id: 2, src: "images/assets/payment/mastercard.svg", alt: "Mastercard", name: "Mastercard" },
  { id: 3, src: "images/assets/payment/paypal.svg", alt: "PayPal", name: "PayPal" },
  { id: 4, src: "images/assets/payment/revolut.svg", alt: "Revolut", name: "Revolut" },
  { id: 5, src: "images/assets/payment/visa.svg", alt: "Visa", name: "Visa" },
];

const WHATSAPP_NUMBER = "212723279328";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const WHATSAPP_FREE_TRIAL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20want%20to%20get%20the%2024h%20free%20IPTV%20trial%20from%20WATCHWORLDCUP.`;

/* ─────────────── SEO keyword bank (~2,100+ terms) ─────────────── */
const seoRegions = [
  "USA", "UK", "Canada", "Australia", "New Zealand", "Ireland", "France", "Spain",
  "Germany", "Italy", "Portugal", "Netherlands", "Belgium", "Switzerland", "Austria",
  "Sweden", "Norway", "Denmark", "Finland", "Poland", "Greece", "Turkey", "Morocco",
  "Algeria", "Tunisia", "Egypt", "Libya", "Mauritania", "Saudi Arabia", "UAE",
  "Qatar", "Kuwait", "Bahrain", "Oman", "Jordan", "Lebanon", "Iraq", "Syria",
  "Yemen", "Palestine", "India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal",
  "Indonesia", "Malaysia", "Philippines", "Thailand", "Vietnam", "Singapore", "Japan",
  "South Korea", "China", "Hong Kong", "Taiwan", "Brazil", "Argentina", "Mexico",
  "Colombia", "Chile", "Peru", "Uruguay", "Venezuela", "Ecuador", "Bolivia",
  "Paraguay", "Nigeria", "Ghana", "Kenya", "Tanzania", "Uganda", "Ethiopia",
  "South Africa", "Angola", "Ivory Coast", "Senegal", "Cameroon", "Arabic",
  "Europe", "MENA", "Gulf", "Scandinavia", "Latin America", "Africa", "Asia",
  "North America", "South America", "Worldwide",
];

const seoEvents = [
  "FIFA World Cup 2026", "World Cup 2026 qualifiers", "Premier League", "Champions League",
  "UEFA Europa League", "Europa Conference League", "La Liga", "Serie A", "Bundesliga",
  "Ligue 1", "Copa America", "AFCON", "Africa Cup of Nations", "Copa Libertadores",
  "MLS", "NFL", "Super Bowl", "NBA", "NHL", "MLB", "UFC", "boxing", "WWE",
  "Formula 1", "MotoGP", "Wimbledon", "Roland Garros", "US Open", "Australian Open",
  "The Masters", "PGA Tour", "IPL cricket", "ICC Cricket World Cup", "Six Nations",
  "Rugby World Cup", "Tour de France", "Olympics 2026", "El Clasico", "Manchester Derby",
  "North London Derby", "Champions League final", "FA Cup", "Carabao Cup", "Eredivisie",
  "Primeira Liga", "Scottish Premiership", "Argentine Primera", "Brasileirao",
  "Liga MX", "Saudi Pro League",
];

const seoDevices = [
  "Smart TV", "Samsung TV", "LG TV", "Sony TV", "Android TV", "Apple TV",
  "Amazon Fire Stick", "Fire TV", "MAG box", "Formuler", "Enigma2", "Chromecast",
  "Roku", "Xbox", "PlayStation", "iPhone", "iPad", "Android phone",
  "Windows PC", "Mac", "NVIDIA Shield",
];

const seoFeatures = [
  "M3U playlist", "Xtream codes", "EPG guide", "electronic program guide", "catch-up TV",
  "anti-freeze", "no VPN", "multi-room", "multi-device", "parental control",
  "instant activation", "24/7 support", "HD channels", "4K streaming", "8K streaming",
  "PPV events", "VOD movies", "VOD series", "sports package", "kids channels",
  "news channels", "music channels", "documentary channels", "international channels",
  "local channels", "IPTV reseller panel", "IPTV credits", "free IPTV trial",
  "IPTV test", "IPTV renewal", "IPTV activation code", "IPTV player",
  "IPTV playlist URL", "IPTV login", "anti-buffer",
];

const seoGenres = [
  "sports", "news", "kids", "movies", "series", "documentary", "music",
  "entertainment", "cooking", "travel", "fashion", "gaming", "cartoon", "religious",
];

const seoQualifiers = [
  "best", "cheap", "premium", "reliable", "stable", "fast", "top rated",
  "affordable", "high quality", "unlimited", "budget", "trusted", "secure", "no contract",
];

const seoSubjects = [
  "IPTV service", "IPTV provider", "IPTV subscription", "streaming service",
  "live TV service", "sports streaming", "movie streaming", "series streaming",
];

function buildSEOKeywords(): string[] {
  const out = new Set<string>();
  const add = (s: string) => {
    const t = s.trim().replace(/\s+/g, " ");
    if (t.length > 2 && t.length <= 60) out.add(t.toLowerCase());
  };

  // core terms
  [
    "IPTV subscription", "World Cup IPTV 2026", "live sports streaming", "M3U playlist",
    "best IPTV service", "premium IPTV", "4K IPTV", "HD channels", "IPTV free trial",
    "IPTV WhatsApp order", "IPTV for football", "FIFA World Cup streaming",
    "cheap IPTV", "reliable IPTV", "IPTV Smart TV", "IPTV Fire Stick",
    "IPTV Android", "IPTV iOS", "IPTV MAG box", "IPTV reseller",
    "watch Premier League", "watch Champions League", "watch La Liga",
    "IPTV USA", "IPTV UK", "IPTV Canada", "IPTV Europe", "IPTV Arabic",
    "IPTV sports package", "PPV events", "VOD movies", "IPTV series",
    "anti-freeze IPTV", "stable IPTV server", "IPTV 24/7 support",
    "instant activation IPTV", "no VPN IPTV", "multi-room IPTV",
    "catch-up TV", "EPG guide", "electronic program guide",
    "IPTV 2026", "best streaming service", "cut the cord", "live TV online",
    "international channels", "kids channels IPTV",
    "news channels live", "documentary streaming", "music channels IPTV",
  ].forEach(add);

  // region × pattern
  seoRegions.forEach((r) => {
    add(`${r} IPTV`);
    add(`${r} IPTV subscription`);
    add(`best IPTV ${r}`);
    add(`IPTV service ${r}`);
    add(`IPTV provider ${r}`);
    add(`watch ${r} channels`);
    add(`${r} sports channels`);
    add(`live TV ${r}`);
    add(`cheap IPTV ${r}`);
    add(`${r} IPTV reseller`);
    add(`${r} M3U playlist`);
    add(`${r} 4K IPTV`);
    add(`IPTV subscription for ${r}`);
    add(`${r} IPTV server`);
    add(`premium IPTV ${r}`);
    add(`${r} football streaming`);
  });

  // event × pattern
  seoEvents.forEach((e) => {
    add(`${e} live stream`);
    add(`watch ${e} online`);
    add(`${e} streaming`);
    add(`${e} IPTV`);
    add(`${e} on IPTV`);
    add(`live ${e}`);
  });

  // device × pattern
  seoDevices.forEach((d) => {
    add(`${d} IPTV`);
    add(`${d} IPTV setup`);
    add(`IPTV for ${d}`);
    add(`install IPTV on ${d}`);
    add(`best IPTV app for ${d}`);
  });

  // feature × pattern
  seoFeatures.forEach((f) => {
    add(f);
    add(`${f} IPTV`);
    add(`IPTV with ${f}`);
  });

  // genre × pattern
  seoGenres.forEach((g) => {
    add(`${g} channels IPTV`);
    add(`IPTV ${g} channels`);
    add(`watch ${g} online`);
    add(`${g} streaming IPTV`);
  });

  // qualifier × subject
  seoQualifiers.forEach((q) => seoSubjects.forEach((s) => add(`${q} ${s}`)));

  return Array.from(out);
}

const seoKeywords: string[] = buildSEOKeywords();

/* ─────────────── Hooks ─────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/* ─────────────── Global styles (single-file safety net) ─────────────── */
function GlobalStyles() {
  const css = `
    html { scroll-behavior: smooth; }
    html, body { overflow-x: hidden; overflow-x: clip; overscroll-behavior-x: none; }

    /* Marquee keyframes (fallback in case tailwind.config has no keyframes) */
    @keyframes infinite-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes infinite-scroll-reverse {
      from { transform: translateX(-50%); }
      to   { transform: translateX(0); }
    }

    .nice-scroll { scrollbar-width: thin; scrollbar-color: rgba(239,59,79,.45) transparent; }
    .nice-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .nice-scroll::-webkit-scrollbar-track { background: transparent; }
    .nice-scroll::-webkit-scrollbar-thumb { background: rgba(239,59,79,.45); border-radius: 999px; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
    }
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/* ─────────────── Icons (SVG only — no emoji) ─────────────── */
function TvIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20h12M9 16v-6.5a2.5 2.5 0 015 0V16m-5 0h5m-5 0H8m7 0h1M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
    </svg>
  );
}

function SportsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0v20M2 12h20" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function FilmIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  );
}

function SeriesIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ListIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function DeviceIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 6.75h12" />
    </svg>
  );
}

function MessageIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337L5.25 21l1.287-3.337A8.25 8.25 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

function GiftIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125v-2.25c0-.621.504-1.125 1.125-1.125z"
      />
    </svg>
  );
}

const serviceIcons: Record<string, FC<{ className?: string }>> = {
  "/live-tv": TvIcon,
  "/sports": SportsIcon,
  "/movies": FilmIcon,
  "/series": SeriesIcon,
};

const orderIcons: FC<{ className?: string }>[] = [ListIcon, CheckCircleIcon, DeviceIcon, MessageIcon];

const serviceCategories = [
  {
    href: "/live-tv",
    title: "Live TV",
    description: "Access thousands of live television channels from around the world in multiple languages and genres.",
    image: "/images/commercial/live-tv.webp",
  },
  {
    href: "/sports",
    title: "Sports",
    description: "Stream live sports events including football, basketball, tennis, and exclusive pay-per-view matches.",
    image: "/images/commercial/getfree.webp",
  },
  {
    href: "/movies",
    title: "Movies",
    description: "Watch the latest blockbuster films and classic cinema in HD and 4K quality on demand.",
    image: "/images/commercial/movies.webp",
  },
  {
    href: "/series",
    title: "Series",
    description: "Binge-watch popular TV series and exclusive shows from global streaming platforms.",
    image: "/images/commercial/series.webp",
  },
];

/* ─────────────── SEO Meta ─────────────── */
function SEOMeta() {
  return (
    <Head>
      <title>Watch World Cup IPTV 2026 – Best Premium IPTV & M3U Subscription | Live Sports, Movies & Series</title>
      <meta name="description" content="WATCHWORLDCUP offers premium IPTV & M3U subscriptions. Stream live sports, World Cup 2026 matches, 30000+ channels, movies, and series in 4K HD. Order via WhatsApp +212723279328. Plans from 3 to 12 months." />
      <meta name="keywords" content="IPTV, World Cup IPTV 2026, live sports streaming, M3U subscription, IPTV service, watch World Cup, IPTV plans, IPTV WhatsApp order, best IPTV 2026, premium IPTV, 4K streaming, football streaming, Champions League IPTV, Premier League streaming, IPTV free trial, cheap IPTV subscription, stable IPTV server, anti-freeze IPTV, multi-device IPTV, Smart TV IPTV, Fire Stick IPTV, Android IPTV, iOS IPTV, MAG box IPTV, instant activation IPTV, 24/7 IPTV support, VOD movies, series streaming, PPV events, international channels, Arabic IPTV, USA IPTV, UK IPTV, Europe IPTV, Canada IPTV, IPTV reseller, cut the cord, live TV online, EPG guide, catch-up TV, no VPN IPTV, parental control IPTV" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#080808" />
      <meta name="author" content="WATCHWORLDCUP" />
      <meta name="copyright" content="WATCHWORLDCUP IPTV Service" />
      <meta name="language" content="English" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 days" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href="https://watchworldcup.com/" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://wa.me" />
      <link rel="dns-prefetch" href="https://threejs.org" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://watchworldcup.com/" />
      <meta property="og:site_name" content="WATCHWORLDCUP IPTV" />
      <meta property="og:title" content="Watch World Cup IPTV 2026 – Best Premium IPTV & M3U Subscription | Live Sports, Movies & Series" />
      <meta property="og:description" content="Premium IPTV & M3U subscriptions. Stream World Cup 2026, live sports, 30000+ channels, movies and series in 4K HD. Order on WhatsApp +212723279328." />
      <meta property="og:image" content="https://watchworldcup.com/images/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@watchworldcup" />
      <meta name="twitter:creator" content="@watchworldcup" />
      <meta name="twitter:title" content="Watch World Cup IPTV 2026 – Best Premium IPTV & M3U Subscription" />
      <meta name="twitter:description" content="Premium IPTV & M3U subscriptions. Stream World Cup 2026, live sports, 30000+ channels, movies and series in 4K HD." />
      <meta name="twitter:image" content="https://watchworldcup.com/images/og-image.jpg" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "WATCHWORLDCUP",
        alternateName: "Watch World Cup IPTV",
        url: "https://watchworldcup.com",
        logo: "https://watchworldcup.com/images/logo.png",
        description: "Premium IPTV & M3U subscription service for live TV, sports, movies, and series. Best IPTV service 2026 with 30000+ channels, 4K HD quality, and 24/7 support.",
        sameAs: ["https://wa.me/212723279328"],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+212723279328",
          contactType: "customer service",
          availableLanguage: ["English", "French", "Arabic"],
          areaServed: "Worldwide",
        },
      })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: "WATCHWORLDCUP IPTV Subscription",
        image: "https://watchworldcup.com/images/og-image.jpg",
        description: "Premium IPTV subscription with 30000+ live channels, VOD movies & series, 4K sports streaming, and multi-device support. FIFA World Cup 2026 included.",
        brand: { "@type": "Brand", name: "WATCHWORLDCUP" },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "2847",
          bestRating: "5",
          worstRating: "1",
        },
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "29",
          highPrice: "79",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          offerCount: "3",
          url: "https://watchworldcup.com/pricing",
        },
      })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: serviceFaqs.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "WATCHWORLDCUP IPTV",
        url: "https://watchworldcup.com",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://watchworldcup.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      })}} />
    </Head>
  );
}

/* ─────────────── Hidden SEO Content ─────────────── */
function HiddenSEOContent() {
  return (
    <div className="sr-only" aria-hidden="true">
      <article>
        <h1>Best IPTV Service 2026 – Watch World Cup IPTV Premium Subscription</h1>
        <h2>Premium IPTV Subscription with 30000+ Live Channels and 4K Sports Streaming</h2>
        <p>
          WATCHWORLDCUP is the best IPTV service provider in 2026 offering premium IPTV subscriptions
          with M3U playlist support. Watch FIFA World Cup 2026 live streams, Premier League, Champions League,
          La Liga, Serie A, Bundesliga, NBA, NFL, UFC, boxing PPV events, and all major sports competitions
          in stunning Full HD and 4K quality. Our IPTV service includes over 30000 live TV channels from
          USA, UK, Canada, Europe, Arabic countries, and worldwide. Enjoy 100000+ VOD movies and TV series
          on demand with anti-freeze technology and 99.9% server uptime.
        </p>
        <h3>Why Choose WATCHWORLDCUP IPTV?</h3>
        <p>
          We provide the most stable IPTV server infrastructure with instant activation, no VPN required,
          multi-device and multi-room support, 24/7 dedicated customer support via WhatsApp, free automatic
          updates, catch-up TV with 7-day replay, comprehensive EPG TV guide, parental control features,
          and compatibility with all devices including Samsung LG Smart TVs, Android TV boxes, Amazon Fire Stick,
          Fire TV Cube, NVIDIA Shield, Apple TV, iPhone, iPad, Android phones and tablets, Windows PC, Mac,
          MAG boxes, Enigma2, Dreambox, Formuler Z, and all IPTV applications like IPTV Smarters Pro,
          TiviMate, GSE Smart IPTV, Perfect Player, VLC Media Player, Kodi, and more.
        </p>
        <h3>IPTV Free Trial 24 Hours – No Credit Card Required</h3>
        <p>
          Get your free 24-hour IPTV trial today by contacting us on WhatsApp at +212 723 279 328.
          Test our premium IPTV service before purchasing. Experience live sports streaming, movies,
          series, and international channels completely free with no commitment and no payment required.
          Our IPTV free trial gives you full access to all channels and VOD content.
        </p>
        <h3>Affordable IPTV Plans – Cheap IPTV Subscription</h3>
        <p>
          Choose from our flexible IPTV subscription plans: 3 months for $29, 6 months for $49,
          or 12 months for $79. All plans include the same premium features: 30000+ channels,
          100000+ VOD, 4K sports, PPV events, EPG, catch-up TV, and multi-device support.
          We accept Cryptocurrency Bitcoin Ethereum, Mastercard, Visa, PayPal, and Revolut payments.
          Secure ordering via WhatsApp with instant delivery.
        </p>
        <h3>Live Sports Streaming – FIFA World Cup 2026, Football, Basketball, Tennis</h3>
        <p>
          Never miss a match with WATCHWORLDCUP IPTV sports package. Stream FIFA World Cup 2026,
          UEFA Champions League, Europa League, Premier League, La Liga Santander, Serie A TIM,
          Bundesliga, Ligue 1 Uber Eats, Copa Libertadores, NBA playoffs, NFL Super Bowl,
          Wimbledon, Roland Garros, US Open, Australian Open, Formula 1, MotoGP, UFC fights,
          boxing championship bouts, WWE wrestling, and all pay-per-view events included at no extra cost.
        </p>
        <h3>Worldwide IPTV Service – USA UK Canada Europe Arabic International Channels</h3>
        <p>
          Our global IPTV service covers all regions and languages. Watch USA channels ABC NBC CBS FOX ESPN
          HBO Showtime, UK channels BBC ITV Sky Sports BT Sport, Canadian channels TSN Sportsnet,
          European channels from France Germany Italy Spain Portugal Netherlands Belgium Scandinavia,
          Arabic channels MBC BeIN Sports OSN, Asian channels, African channels, and Latin American channels.
          All channels available in multiple languages with subtitle support.
        </p>
        <h3>Compatible Devices – Smart TV Fire Stick Android iOS PC MAG Box</h3>
        <p>
          WATCHWORLDCUP IPTV works on every device. Smart TVs: Samsung Tizen, LG WebOS, Sony Android TV,
          Panasonic, Philips. Streaming devices: Amazon Fire Stick 4K Max, Fire TV Cube, Chromecast,
          Roku, Apple TV 4K. Mobile: iPhone iPad iOS 15+, Android phones tablets Android 8+.
          Computers: Windows 10 11, macOS, Linux. Set-top boxes: MAG 250 254 256 322 424,
          Formuler Z8 Z11, Dreambox, Enigma2, BuzzTV. Gaming consoles: Xbox One Series X S, PlayStation 4 5.
        </p>
      </article>
    </div>
  );
}

/* ─────────────── Hero Canvas ─────────────── */
function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    mount.appendChild(renderer.domElement);

    const particleCount = isMobile ? 600 : 1800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      const isRed = Math.random() > 0.6;
      colors[i * 3] = isRed ? 0.94 : 0.3;
      colors[i * 3 + 1] = isRed ? 0.23 : 0.3;
      colors[i * 3 + 2] = isRed ? 0.31 : 0.8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({ size: isMobile ? 0.06 : 0.045, vertexColors: true, transparent: true, opacity: 0.75 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const rings: THREE.Mesh[] = [];
    const ringColors = [0xef3b4f, 0x3b82f6, 0xef3b4f];
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.TorusGeometry(1.2 + i * 0.7, 0.012, 16, 120);
      const mat = new THREE.MeshBasicMaterial({ color: ringColors[i], transparent: true, opacity: 0.18 - i * 0.04 });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / (3 + i);
      ring.rotation.y = (Math.PI / 5) * i;
      scene.add(ring);
      rings.push(ring);
    }

    const globeGeo = new THREE.IcosahedronGeometry(1.1, isMobile ? 2 : 3);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0xef3b4f, wireframe: true, transparent: true, opacity: 0.09 });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.set(2.5, 0, -1);
    scene.add(globe);

    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      particles.rotation.y = t * 0.03 + mouseX * 0.12;
      particles.rotation.x = mouseY * 0.08;
      rings.forEach((ring, i) => {
        ring.rotation.z = t * (0.08 + i * 0.04);
        ring.rotation.x = t * 0.05 + mouseY * 0.1;
        ring.rotation.y = mouseX * 0.15;
      });
      globe.rotation.y = t * 0.12;
      globe.rotation.x = t * 0.06;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  return <div ref={mountRef} className="absolute inset-0 z-0" style={{ pointerEvents: "none" }} aria-hidden="true" />;
}

/* ─────────────── Hero 3D Title (CSS, responsive, never wraps) ─────────────── */
function Hero3DTitle() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const scaleRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const prefersReduced = useReducedMotion();

  useGSAP(() => {
    if (!titleRef.current || prefersReduced) return;
    const letters = titleRef.current.querySelectorAll<HTMLElement>(".letter");
    gsap.fromTo(letters,
      { y: 120, opacity: 0, rotateX: -90, transformOrigin: "50% 50% -60px" },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: 0.045, ease: "back.out(1.5)", delay: 0.3 }
    );
  }, []);

  /* Scale-to-fit: measure natural width, then shrink (never grow) so the
     title always fits its container without wrapping or overflowing. */
  useEffect(() => {
    const title = titleRef.current;
    const wrapper = scaleRef.current;
    if (!title || !wrapper) return;

    const fit = () => {
      const container = wrapper.parentElement;
      if (!container) return;
      const available = container.clientWidth;
      const natural = title.scrollWidth;
      if (natural > 0 && available > 0) {
        setScale(Math.min(1, available / natural));
      }
    };

    fit();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    if (ro && wrapper.parentElement) ro.observe(wrapper.parentElement);
    window.addEventListener("resize", fit);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit).catch(() => {});
    }
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  const line1 = "MATCH WORLD CUP";
  const line2 = "IPTV";

  return (
    <div className="mt-4 w-full sm:mt-7">
      <div
        ref={scaleRef}
        className="origin-left"
        style={{ width: "max-content", transform: `scale(${scale})`, willChange: "transform" }}
      >
        <h1
          ref={titleRef}
          className="font-black leading-[.92] tracking-[-.04em] select-none"
          style={{ fontSize: "clamp(1.8rem, 7vw, 6rem)", perspective: "800px", transformStyle: "preserve-3d" }}
          aria-label="Match World Cup IPTV"
        >
          <span className="block whitespace-nowrap text-white" style={{ transformStyle: "preserve-3d", textShadow: "0 1px 0 rgba(255,255,255,.12), 0 2px 0 rgba(255,255,255,.06), 0 3px 0 rgba(0,0,0,.5), 0 12px 36px rgba(0,0,0,.6)" }}>
            {line1.split("").map((char, i) => (
              <span key={i} className="letter inline-block" style={{ width: char === " " ? "0.35em" : undefined }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="block whitespace-nowrap bg-gradient-to-r from-red-300 via-red-400 to-red-600 bg-clip-text text-transparent" style={{ transformStyle: "preserve-3d", filter: "drop-shadow(0 0 28px rgba(239,59,79,0.6))" }}>
            {line2.split("").map((char, i) => (
              <span key={i} className="letter inline-block">
                {char}
              </span>
            ))}
          </span>
        </h1>
      </div>
    </div>
  );
}

/* ─────────────── Three.js 3D Text: "Match World Cup IPTV" ─────────────── */
function MatchWorldCup3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = Math.max(1, mount.clientWidth);
    const height = isMobile ? 220 : 350;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, isMobile ? 14 : 18);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    } catch {
      return; // WebGL unavailable — render nothing
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const spot = new THREE.SpotLight(0xef3b4f, 20);
    spot.position.set(10, 15, 10);
    spot.angle = Math.PI / 6;
    spot.penumbra = 1;
    scene.add(spot);

    const spot2 = new THREE.SpotLight(0x3b82f6, 15);
    spot2.position.set(-10, -5, 10);
    spot2.angle = Math.PI / 6;
    spot2.penumbra = 1;
    scene.add(spot2);

    const pointLight = new THREE.PointLight(0xff0040, 5, 50);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    const pCount = isMobile ? 200 : 500;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 30;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xef3b4f, size: 0.08, transparent: true, opacity: 0.6 });
    const pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    let textMesh: THREE.Mesh | null = null;
    let textWidth = 0;

    /* Auto scale the text so it always fits the viewport width */
    const fitToWidth = () => {
      if (!textMesh || !textWidth) return;
      const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const visW = visH * camera.aspect;
      const s = Math.min(1.6, (visW * 0.88) / textWidth);
      textMesh.scale.setScalar(s);
    };

    const loader = new FontLoader();

    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        const textGeo = new TextGeometry("Match World Cup IPTV", {
          font: font,
          size: isMobile ? 0.9 : 1.4,
          curveSegments: isMobile ? 4 : 8,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: isMobile ? 2 : 4,
        });
        textGeo.computeBoundingBox();
        const box = textGeo.boundingBox!;
        const centerX = -0.5 * (box.max.x - box.min.x);
        const centerY = -0.5 * (box.max.y - box.min.y);
        textGeo.translate(centerX, centerY, 0);
        textWidth = box.max.x - box.min.x;

        const textMat = new THREE.MeshStandardMaterial({
          color: 0xef3b4f,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0x220000,
          emissiveIntensity: 0.3,
        });
        textMesh = new THREE.Mesh(textGeo, textMat);
        scene.add(textMesh);
        fitToWidth();
        setLoaded(true);
      },
      undefined,
      () => {
        // Font failed to load → graceful 2D canvas-text fallback
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "rgba(0,0,0,0)";
          ctx.fillRect(0, 0, 1024, 256);
          ctx.font = "bold 80px Arial, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#ef3b4f";
          ctx.fillText("Match World Cup IPTV", 512, 128);
          ctx.strokeStyle = "#ff6b7a";
          ctx.lineWidth = 2;
          ctx.strokeText("Match World Cup IPTV", 512, 128);
        }
        const tex = new THREE.CanvasTexture(canvas);
        const planeGeo = new THREE.PlaneGeometry(12, 3);
        const planeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
        textMesh = new THREE.Mesh(planeGeo, planeMat);
        textWidth = 12;
        scene.add(textMesh);
        fitToWidth();
        setLoaded(true);
      }
    );

    let targetRotX = 0, targetRotY = 0;
    const onMove = (e: MouseEvent) => {
      targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.3;
      targetRotX = -(e.clientY / window.innerHeight - 0.5) * 0.2;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        targetRotY = (e.touches[0].clientX / window.innerWidth - 0.5) * 0.6;
        targetRotX = -(e.touches[0].clientY / window.innerHeight - 0.5) * 0.3;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const onResize = () => {
      if (!mount) return;
      const w = Math.max(1, mount.clientWidth);
      const h = isMobile ? 220 : 350;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      fitToWidth();
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (textMesh) {
        if (!reduced) {
          textMesh.rotation.y += 0.008;
          textMesh.rotation.x = THREE.MathUtils.lerp(textMesh.rotation.x, targetRotX + Math.sin(t * 0.5) * 0.05, 0.05);
          textMesh.rotation.z = THREE.MathUtils.lerp(textMesh.rotation.z, targetRotY * 0.1, 0.05);
          textMesh.position.y = Math.sin(t * 0.8) * 0.15;
          pSystem.rotation.y = t * 0.02;
          pSystem.rotation.x = t * 0.01;
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [isMobile, reduced]);

  return (
    <div className="relative w-full">
      <div ref={mountRef} className="mx-auto w-full" style={{ height: isMobile ? 220 : 350 }} />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
        </div>
      )}
    </div>
  );
}

/* ─────────────── Welcome Popup (Responsive, icon-based) ─────────────── */
function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShow(true);
      const closeTimer = setTimeout(() => setCanClose(true), 2000);
      return () => clearTimeout(closeTimer);
    }, 4000);
    return () => clearTimeout(showTimer);
  }, []);

  /* Lock page scroll while the popup is open */
  useEffect(() => {
    if (!show || closed) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show, closed]);

  const handleClose = useCallback(() => {
    if (!canClose) return;
    setClosed(true);
  }, [canClose]);

  const trialFeatures = [
    "30,000+ live channels",
    "Full HD & 4K sports",
    "100,000+ VOD movies & series",
    "99.9% Uptime & Anti-Freeze tech",
    "TV Guide (EPG) included",
    "Compatible with all devices",
    "24/7 Dedicated customer support",
    "Catch-up & 7-day replay",
    "Free automatic updates",
    "Multi-device & multi-room support",
    "All major PPV events included",
    "No VPN required",
    "Parental control features",
    "Instant activation",
    "No commitment",
  ];

  return (
    <AnimatePresence>
      {show && !closed && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={canClose ? handleClose : undefined}
          />
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Special offer popup"
          >
            <div className="relative flex w-full max-w-[95vw] md:max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-[#0d0d0f] shadow-[0_32px_100px_rgba(0,0,0,.8),0_0_80px_rgba(239,59,79,.15)]">
              <div className="nice-scroll flex flex-1 flex-col justify-center gap-4 sm:gap-5 p-4 sm:p-6 md:p-10 overflow-y-auto overscroll-contain">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-red-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                  Limited Offer
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-[0_0_30px_rgba(239,59,79,.35)]">
                    <GiftIcon className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black leading-tight text-white md:text-3xl">
                    Get{" "}
                    <span className="bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent">
                      24 Hours FREE
                    </span>
                    <br />
                    IPTV Trial
                  </h2>
                </div>

                <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300">
                  Experience the full power of WATCHWORLDCUP IPTV — live
                  sports, World Cup matches, 10,000+ channels — completely
                  free for 24 hours. No credit card required.
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-300">
                  {trialFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={WHATSAPP_FREE_TRIAL}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-6 py-3 sm:py-3.5 text-sm font-black text-white shadow-[0_0_30px_rgba(34,197,94,.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,197,94,.4)]"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882l6.198-1.625A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.804 9.804 0 01-4.99-1.367l-.358-.213-3.68.964.983-3.596-.233-.369A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
                  </svg>
                  <span className="truncate">Get Free 24h Trial via WhatsApp</span>
                </a>
                <p className="text-[10px] sm:text-[11px] text-slate-500">
                  Contact: +212 723 279 328 · No payment required
                </p>
              </div>

              <div className="relative hidden w-1/2 shrink-0 flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-br from-red-950/60 via-[#0d0d0f] to-[#0d0d0f] md:flex">
                <img alt="IPTV Free Trial Offer" src="images/commercial/getfree.webp" className="h-full w-full object-cover" />
              </div>

              <motion.button
                onClick={handleClose}
                whileTap={{ scale: 0.9 }}
                className={`absolute right-3 top-3 sm:right-4 sm:top-4 flex h-8 w-8 items-center justify-center rounded-full border text-lg font-black transition-all duration-300 ${
                  canClose
                    ? "border-white/20 bg-white/10 text-white cursor-pointer hover:bg-white/20"
                    : "border-white/5 bg-white/5 text-white/30 cursor-not-allowed"
                }`}
                aria-label="Close popup"
                disabled={!canClose}
              >
                {canClose ? (
                  "×"
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-red-400"
                  />
                )}
              </motion.button>

              {!canClose && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 to-red-300"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 2, ease: "linear" }}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────── Splash ─────────────── */
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
      className={`pointer-events-none fixed left-1/2 top-24 z-[100] -translate-x-1/2 transition-opacity duration-700 sm:left-auto sm:translate-x-0 sm:right-6 lg:right-10 lg:top-28 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-32 sm:w-40 rounded-2xl border border-white/10 bg-[#0b0b0c]/95 px-4 sm:px-5 py-3 sm:py-4 text-center shadow-[0_24px_80px_rgba(0,0,0,.62),0_0_60px_rgba(239,59,79,.12)] backdrop-blur-xl">
        <div className="mx-auto flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-[10px] sm:text-xs font-black text-white shadow-[0_0_45px_rgba(239,59,79,.22)]">
          MWC
        </div>
        <p ref={progressRef} className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black tabular-nums text-white">
          0
        </p>
        <p className="mt-1 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[.2em] text-red-400">
          Loading service
        </p>
      </div>
    </div>
  );
}

/* ─────────────── FAQ Item ─────────────── */
function FAQItem({ question, answer, index }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="glass overflow-hidden rounded-2xl border border-white/5"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-4 sm:p-6 text-left"
        aria-expanded={open}
      >
        <span className="font-black text-white text-sm sm:text-base">{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 text-xl sm:text-2xl font-thin text-red-400"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <p className="px-4 sm:px-6 pb-4 sm:pb-6 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────── Free Trial Banner ─────────────── */
function FreeTrialBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto my-6 sm:my-8 max-w-7xl px-3 sm:px-4 md:px-8"
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-green-500/20 bg-gradient-to-r from-green-950/60 via-[#0d0d0f] to-red-950/40 p-5 sm:p-8 shadow-[0_0_60px_rgba(34,197,94,.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,197,94,.07),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(239,59,79,.07),transparent_50%)]" />
        <div className="relative flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-green-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              Free Trial Available
            </div>
            <h3 className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-white md:text-3xl">
              <GiftIcon className="mr-1.5 -mt-1 inline h-6 w-6 text-green-400" />
              Get{" "}
              <span className="bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">
                24 Hours FREE
              </span>{" "}
              IPTV Access
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">
              Test the full service before paying — contact us on WhatsApp at{" "}
              <strong className="text-white">+212 723 279 328</strong>
            </p>
          </div>
          <a
            href={WHATSAPP_FREE_TRIAL}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="group inline-flex w-full md:w-auto shrink-0 items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-6 sm:px-8 py-3 sm:py-4 font-black text-white shadow-[0_0_40px_rgba(34,197,94,.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(34,197,94,.4)]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882l6.198-1.625A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.804 9.804 0 01-4.99-1.367l-.358-.213-3.68.964.983-3.596-.233-.369A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
            </svg>
            Get Free 24h Trial
            <span className="ml-1 rounded-lg bg-white/20 px-2 py-0.5 text-xs hidden sm:inline">
              +212 723 279 328
            </span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────── Animated Section ─────────────── */
function AnimatedSection({ children, className = "", delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── Movies Section ─────────────── */
function MoviesSection() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  useGSAP(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".movie-card");
    gsap.fromTo(cards,
      { y: 80, opacity: 0, scale: 0.9, rotateY: -15 },
      {
        y: 0, opacity: 1, scale: 1, rotateY: 0, duration: 0.8, stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
      }
    );

    if (!isMobile) {
      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>(".movie-img");
        if (!img) return;
        card.addEventListener("mouseenter", () => {
          gsap.to(img, { scale: 1.08, duration: 0.4, ease: "power2.out" });
          gsap.to(card, { y: -8, boxShadow: "0 20px 60px rgba(239,59,79,0.2)", duration: 0.4, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(img, { scale: 1, duration: 0.4, ease: "power2.out" });
          gsap.to(card, { y: 0, boxShadow: "0 0 0 rgba(239,59,79,0)", duration: 0.4, ease: "power2.out" });
        });
      });
    }
  }, [isMobile]);

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20 md:px-8">
      <AnimatedSection>
        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400 gsap-reveal">
          On-demand movies
        </p>
        <h2 className="gsap-reveal mt-4 max-w-4xl text-2xl sm:text-3xl font-black md:text-5xl">
          Latest movies & series available.
        </h2>
        <p className="gsap-reveal mt-4 sm:mt-5 max-w-3xl text-sm sm:text-base leading-7 sm:leading-8 text-slate-300">
          Browse our extensive collection of blockbuster films and trending
          series. New titles added regularly — confirm current availability
          on WhatsApp.
        </p>
      </AnimatedSection>

      <div
        ref={gridRef}
        className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {movies.map((movie) => (
          <div
            key={movie}
            className="movie-card group relative aspect-[2/3] overflow-hidden rounded-xl sm:rounded-2xl border border-white/5 bg-[#111]"
            style={{ perspective: "600px" }}
          >
            <Image
              src={`/images/assets/movies/${movie}`}
              alt={`Movie poster ${movie.replace(/\.webp$/, "").replace(/([A-Z])/g, " $1").trim()}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              className="movie-img object-cover transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
              <p className="text-[10px] sm:text-xs font-bold text-white truncate">
                {movie.replace(/\.webp$/, "").replace(/([A-Z])/g, " $1").trim()}
              </p>
            </div>
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 rounded-md bg-red-600 px-1 py-0.5 text-[9px] sm:text-[10px] font-black text-white">
              HD
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────── Horizontal SEO Keywords Marquee ─────────────── */
function SEOKeywordsMarquee() {
  const isMobile = useIsMobile();
  const speed = isMobile ? 15 : 25;
  const doubled = [...seoKeywords, ...seoKeywords];

  return (
    <section className="relative overflow-hidden py-3 sm:py-4 border-y border-white/5 bg-[#080808]/50">
      <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#080808] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#080808] to-transparent z-10" />
      <div className="flex w-max animate-infinite-scroll" style={{ animationDuration: `${speed}s` }}>
        {doubled.map((kw, i) => (
          <span key={i} className="mx-3 sm:mx-4 whitespace-nowrap text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
            {kw}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─────────────── Main App ─────────────── */
export default function App() {
  const progressRef = useRef<HTMLParagraphElement | null>(null);
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(true);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    let frame = 0;
    let hold: ReturnType<typeof setTimeout>;
    let remove: ReturnType<typeof setTimeout>;
    const started = performance.now();
    const tick = (now: number) => {
      const value = Math.min(100, Math.floor(((now - started) / 1500) * 100));
      if (progressRef.current) progressRef.current.textContent = String(value);
      if (value < 100) frame = requestAnimationFrame(tick);
      else {
        hold = setTimeout(() => {
          setFading(true);
          remove = setTimeout(() => setMounted(false), 700);
        }, 300);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(hold);
      clearTimeout(remove);
    };
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target.closest<HTMLElement>(".glass") : null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
      target.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, []);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
      gsap.fromTo(el, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    if (heroRef.current) {
      gsap.to(heroRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }
  }, []);

  const scrollSpeed = isMobile ? 20 : 25;

  return (
    <>
      <GlobalStyles />
      <SEOMeta />
      <HiddenSEOContent />
      <WelcomePopup />
      {mounted && <Splash progressRef={progressRef} fading={fading} />}

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[85vh] sm:min-h-[92vh] overflow-hidden border-b border-white/5">
          <HeroCanvas />
          <div
            aria-hidden="true"
            className="hero-media absolute inset-y-0 right-0 hidden w-[62%] bg-cover bg-center opacity-25 lg:block"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(239,59,79,.13),transparent_38%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />

          <div
            ref={heroRef}
            className="relative z-10 mx-auto flex min-h-[85vh] sm:min-h-[92vh] max-w-7xl items-center justify-between gap-6 sm:gap-10 px-3 sm:px-4 py-16 sm:py-20 md:px-8"
          >
            <div className="max-w-4xl w-full">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-400/10 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-extrabold text-red-300"
              >
                <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 animate-pulse rounded-full bg-red-400" />
                IPTV / M3U subscriptions · WhatsApp ordering
              </motion.div>

              <Hero3DTitle />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-5 sm:mt-7 max-w-3xl text-sm sm:text-base leading-7 sm:leading-8 text-slate-200 md:text-xl"
              >
                WATCHWORLDCUP provides time-based IPTV and M3U subscriptions
                for use with compatible IPTV applications and devices. Confirm
                current content, language, quality and compatibility before
                ordering.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="mt-7 sm:mt-9 flex flex-col sm:flex-row flex-wrap gap-3"
              >
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-5 sm:px-7 py-3.5 sm:py-4 font-black text-white shadow-[0_0_40px_rgba(239,59,79,.25)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(239,59,79,.4)] text-sm sm:text-base"
                >
                  Choose your IPTV subscription
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 10h11M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-green-500/40 bg-green-600 px-5 sm:px-7 py-3.5 sm:py-4 font-black text-white shadow-[0_0_30px_rgba(34,197,94,.2)] transition-all hover:scale-105 hover:bg-green-500 text-sm sm:text-base"
                >
                  Order on WhatsApp
                </a>
                <a
                  href={WHATSAPP_FREE_TRIAL}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-5 sm:px-7 py-3.5 sm:py-4 font-black text-green-300 transition-all hover:bg-green-500/20 text-sm sm:text-base"
                >
                  <GiftIcon className="h-4 w-4" />
                  Free 24h Trial
                </a>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="mt-4 sm:mt-5 max-w-3xl text-[10px] sm:text-xs leading-5 sm:leading-6 text-slate-400"
              >
                No catalog totals or specific titles are claimed without a
                connected inventory source. WATCHWORLDCUP is not affiliated with
                FIFA, leagues, broadcasters, studios or streaming platforms.
              </motion.p>
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.8 }}
              className="hidden w-72 shrink-0 rounded-2xl border border-white/10 bg-[#0d0d0f]/80 p-6 backdrop-blur-xl xl:block"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
                Before ordering
              </p>
              <h2 className="mt-4 text-xl font-black text-white">Confirm your setup</h2>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                {[
                  "Current content scope",
                  "Exact device and IPTV app",
                  "Delivery, payment and terms",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.15 }}
                    className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-[#080808]/70 p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-xs font-black text-red-300">
                      {index + 1}
                    </span>
                    {item}
                  </motion.div>
                ))}
              </div>
              <Link href="/order" className="mt-5 flex items-center font-black text-red-300">
                Prepare order
                <svg viewBox="0 0 20 20" aria-hidden="true" className="ml-2 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 10h11M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.aside>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 z-10 -translate-x-1/2"
          >
            <div className="flex h-8 sm:h-10 w-5 sm:w-6 items-start justify-center rounded-full border border-white/20 pt-1 sm:pt-1.5">
              <div className="h-1.5 sm:h-2 w-0.5 sm:w-1 rounded-full bg-red-400" />
            </div>
          </motion.div>
        </section>

      

        <FreeTrialBanner />

        {/* ── SEO Keywords Marquee ── */}
        <SEOKeywordsMarquee />

        {/* ── Channels & Sports Scroll ── */}
        <div className="flex flex-col gap-3 sm:gap-4 py-3 sm:py-4">
          <div className="relative w-full overflow-hidden">
            <div className="flex w-max animate-infinite-scroll-reverse hover:[animation-play-state:paused]" style={{ animationDuration: `${scrollSpeed}s` }}>
              {[...channels, ...channels].map((channel, index) => (
                <div key={`${channel.id}-${index}`} className="mx-4 sm:mx-8 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <img src={channel.src} alt={channel.alt} className="h-16 sm:h-20 md:h-28 w-auto max-w-[100px] sm:max-w-[150px] object-contain" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full overflow-hidden">
            <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]" style={{ animationDuration: `${scrollSpeed}s` }}>
              {[...sports, ...sports].map((sport, index) => (
                <div key={`${sport.id}-${index}`} className="mx-4 sm:mx-8 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <img src={sport.src} alt={sport.alt} className="h-16 sm:h-20 md:h-28 w-auto max-w-[100px] sm:max-w-[150px] object-contain" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Service Categories ── */}
        <section className="mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20 md:px-8">
          <AnimatedSection>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400 gsap-reveal">
              Entertainment categories
            </p>
            <h2 className="gsap-reveal mt-4 max-w-4xl text-2xl sm:text-3xl font-black md:text-5xl">
              One subscription service, four content areas.
            </h2>
            <p className="gsap-reveal mt-4 sm:mt-5 max-w-3xl text-sm sm:text-base leading-7 sm:leading-8 text-slate-300">
              Browse the service structure, then ask for the current
              availability relevant to your country, language and viewing needs.
            </p>
          </AnimatedSection>
          <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
            {serviceCategories.map((category, i) => (
              <motion.div
                key={category.href}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={isMobile ? {} : { y: -4 }}
              >
                <Link
                  href={category.href}
                  className="group block overflow-hidden rounded-xl sm:rounded-2xl border border-white/5 bg-[#0d0d0f]/60 backdrop-blur-sm"
                >
                  <div className="relative aspect-[16/7] sm:aspect-[16/7] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={`${category.title} category`}
                      fill
                      quality={55}
                      sizes="(max-width:768px) 100vw, 50vw"
                      className="object-cover saturate-[.78] contrast-110 opacity-60 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141416] to-transparent" />
                  </div>
                  <div className="p-5 sm:p-7">
                    {(() => {
                      const Icon = serviceIcons[category.href];
                      return Icon ? <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-red-400" /> : null;
                    })()}
                    <h3 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-black text-white">
                      {category.title}
                    </h3>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300">
                      {category.description}
                    </p>
                    <span className="mt-4 sm:mt-5 inline-flex items-center gap-2 font-black text-red-400 text-sm">
                      Explore category
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Ordering Flow ── */}
        <section>
          <div className="mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20 md:px-8">
            <AnimatedSection>
              <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
                Simple ordering flow
              </p>
              <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white md:text-5xl">
                From plan selection to IPTV setup.
              </h2>
            </AnimatedSection>
            <div className="mt-8 sm:mt-10 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {[
                ["01", "Get Free 24h Trial", "Test the full IPTV service free for 24 hours via WhatsApp before committing."],
                ["02", "Choose Your Plan", "Select 3 months, 6 months, or 1 year premium subscription plan."],
                ["03", "Order on WhatsApp", "Confirm your subscription plan, delivery and payment details securely."],
                ["04", "Set Up Your Access", "Use the delivered subscription details with a compatible IPTV app."],
              ].map(([n, title, text], index) => {
                const Icon = orderIcons[index];
                return (
                  <motion.article
                    key={n}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.12 }}
                    whileHover={isMobile ? {} : { scale: 1.03 }}
                    className="rounded-xl sm:rounded-2xl border border-white/5 bg-[#0d0d0f]/60 p-5 sm:p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                      <span className="text-xs font-black text-slate-500">{n}</span>
                    </div>
                    <h3 className="mt-4 sm:mt-5 font-black text-white text-sm sm:text-base">{title}</h3>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-400">{text}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <MoviesSection />

        {/* ── Pricing ── */}
        <section className="mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20 md:px-8">
          <AnimatedSection>
            <div className="flex flex-col justify-between gap-4 sm:gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
                  Verified plan prices
                </p>
                <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white md:text-5xl">
                  Choose your IPTV subscription.
                </h2>
                <p className="mt-3 sm:mt-4 max-w-3xl text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300">
                  Plan prices and durations are shown below. Content inventory
                  and technical compatibility are confirmed through WhatsApp
                  before payment.
                </p>
              </div>
              <Link href="/pricing" className="inline-flex items-center gap-2 font-black text-red-400 text-sm">
                Compare plan details
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>

          <div className="mt-8 sm:mt-10">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
              {[
                { months: "3", price: "$29", popular: false },
                { months: "6", price: "$49", popular: true },
                { months: "12", price: "$79", popular: false },
              ].map((plan) => (
                <motion.div
                  key={plan.months}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={isMobile ? {} : { y: -8 }}
                  className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-5 sm:p-8 ${
                    plan.popular
                      ? "border-red-500/30 bg-gradient-to-b from-red-950/30 to-[#0d0d0f]"
                      : "border-white/5 bg-[#0d0d0f]/60"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full bg-red-600 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white">
                      Most Popular
                    </div>
                  )}
                  <p className="text-xs sm:text-sm font-black text-slate-400">{plan.months} Months</p>
                  <p className="mt-1 sm:mt-2 text-4xl sm:text-5xl font-black text-white">{plan.price}</p>
                  <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-300">
                    {[
                      "30,000+ live channels",
                      "Full HD & 4K sports",
                      "100,000+ VOD movies & series",
                      "99.9% Uptime & Anti-Freeze tech",
                      "TV Guide (EPG) included",
                      "Compatible with all devices",
                      "24/7 Dedicated customer support",
                      "Catch-up & 7-day replay",
                      "Free automatic updates",
                      "Multi-device & multi-room support",
                      "All major PPV events included",
                      "No VPN required",
                      "Parental control features",
                      "Instant activation",
                      "No commitment",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={WHATSAPP_FREE_TRIAL}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className={`mt-6 sm:mt-8 block w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-3.5 text-center text-sm font-black transition-all hover:scale-105 ${
                      plan.popular
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_40px_rgba(239,59,79,.3)]"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    Order on WhatsApp
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-row items-center justify-center gap-4 sm:gap-6 overflow-x-auto rounded-xl py-4 sm:py-6"
          >
            {payments.map((payment, i) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex min-w-[50px] sm:min-w-[60px] flex-col items-center gap-1"
              >
                <img
                  src={payment.src}
                  alt={payment.alt}
                  width={80}
                  height={50}
                  className="object-contain transition-all duration-300 hover:scale-110 h-8 sm:h-auto"
                  loading="lazy"
                />
                <span className="text-center text-[10px] sm:text-xs font-black text-slate-500 transition-all duration-300 hover:text-red-400">
                  {payment.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Devices ── */}
        <section>
          <div className="mx-auto grid max-w-7xl gap-6 sm:gap-10 px-3 sm:px-4 py-16 sm:py-20 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[16/11] overflow-hidden rounded-xl sm:rounded-2xl"
            >
              <Image
                src="/images/commercial/devices.webp"
                alt="Compatible devices illustration"
                fill
                quality={55}
                sizes="(max-width:1424px) 100vw, 45vw"
                className="object-cover saturate-[.78] contrast-110"
              />
            </motion.div>
            <AnimatedSection delay={0.2}>
              <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
                Compatibility before purchase
              </p>
              <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white md:text-5xl">
                Use your M3U details with a compatible IPTV app.
              </h2>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-7 sm:leading-8 text-slate-300">
                App support differs by television, streaming device, phone,
                tablet and computer. Tell support your exact device model and
                intended app before ordering.
              </p>
              <ul className="mt-5 sm:mt-6 grid gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 sm:grid-cols-2">
                {[
                  "Exact device and operating system",
                  "IPTV application name and version",
                  "Playlist or credential format required",
                  "Network and display capability",
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-2 sm:gap-3 rounded-xl border border-white/5 bg-[#0d0d0f]/60 p-3 sm:p-4 backdrop-blur-sm"
                  >
                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-red-400" />
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Link
                href="/setup-guides"
                className="mt-5 sm:mt-7 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 sm:px-6 py-2.5 sm:py-3 font-black text-white hover:bg-red-500 text-sm"
              >
                View setup guides
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </AnimatedSection>
          </div>
        </section>

        <FreeTrialBanner />

        {/* ── FAQ ── */}
        <section className="mx-auto max-w-7xl px-3 sm:px-4 pb-16 sm:pb-24 pt-8 sm:pt-10 md:px-8">
          <AnimatedSection>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
              Questions before ordering
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white md:text-5xl">
              IPTV subscription FAQ
            </h2>
            <p className="mt-3 sm:mt-4 max-w-3xl text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300">
              Everything you need to know about WATCHWORLDCUP IPTV service,
              ordering, compatibility, and free trial.
            </p>
          </AnimatedSection>
          <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            {serviceFaqs.map(([question, answer], index) => (
              <FAQItem key={question} question={question} answer={answer} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-white/5 bg-white/[.02] p-5 sm:p-8 text-center"
          >
            <p className="text-sm sm:text-base text-slate-300">
              Still have questions? Our team is available on WhatsApp 24/7.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 w-full sm:w-auto">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-green-500/40 bg-green-600 px-5 sm:px-6 py-2.5 sm:py-3 font-black text-white shadow-[0_0_30px_rgba(34,197,94,.2)] transition-all hover:scale-105 hover:bg-green-500 text-sm"
              >
                Ask on WhatsApp
              </a>
              <a
                href={WHATSAPP_FREE_TRIAL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-5 sm:px-6 py-2.5 sm:py-3 font-black text-green-300 hover:bg-green-500/20 text-sm"
              >
                <GiftIcon className="h-4 w-4" />
                Get Free 24h Trial
              </a>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}

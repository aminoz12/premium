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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { homeFaqs } from "@/lib/home-faq";

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



const channels: Channel[] = [
  {
    id: 1,
    src: "images/assets/channels/1.webp",
    alt: "Premium IPTV Channel Package 1",
  },
  {
    id: 2,
    src: "images/assets/channels/2.webp",
    alt: "Premium IPTV Channel Package 2",
  },
  {
    id: 3,
    src: "images/assets/channels/3.webp",
    alt: "Premium IPTV Channel Package 3",
  },
  {
    id: 4,
    src: "images/assets/channels/4.webp",
    alt: "Premium IPTV Channel Package 4",
  },
  {
    id: 5,
    src: "images/assets/channels/5.webp",
    alt: "Premium IPTV Channel Package 5",
  },
  {
    id: 6,
    src: "images/assets/channels/6.webp",
    alt: "Premium IPTV Channel Package 6",
  },
];

const sports: Channel[] = [
  {
    id: 1,
    src: "images/assets/sports/1.webp",
    alt: "Live Sports IPTV - Football Streaming",
  },
  {
    id: 2,
    src: "images/assets/sports/2.webp",
    alt: "Live Sports IPTV - Champions League",
  },
  {
    id: 3,
    src: "images/assets/sports/3.webp",
    alt: "Live Sports IPTV - Premier League",
  },
  {
    id: 4,
    src: "images/assets/sports/4.webp",
    alt: "Live Sports IPTV - La Liga Streaming",
  },
  {
    id: 5,
    src: "images/assets/sports/5.webp",
    alt: "Live Sports IPTV - NBA Basketball",
  },
  {
    id: 6,
    src: "images/assets/sports/6.webp",
    alt: "Live Sports IPTV - UFC PPV Events",
  },
  {
    id: 7,
    src: "images/assets/sports/7.webp",
    alt: "Live Sports IPTV - Formula 1 Racing",
  },
  {
    id: 8,
    src: "images/assets/sports/8.webp",
    alt: "Live Sports IPTV - Tennis Grand Slam",
  },
  {
    id: 9,
    src: "images/assets/sports/9.webp",
    alt: "Live Sports IPTV - World Cup 2026",
  },
];

const payments: Payment[] = [
  {
    id: 1,
    src: "images/assets/payment/crypto.svg",
    alt: "Pay with Cryptocurrency Bitcoin Ethereum",
    name: "Crypto",
  },
  {
    id: 2,
    src: "images/assets/payment/mastercard.svg",
    alt: "Pay with Mastercard",
    name: "Mastercard",
  },
  {
    id: 3,
    src: "images/assets/payment/paypal.svg",
    alt: "Pay with PayPal",
    name: "PayPal",
  },
  {
    id: 4,
    src: "images/assets/payment/revolut.svg",
    alt: "Pay with Revolut",
    name: "Revolut",
  },
  {
    id: 5,
    src: "images/assets/payment/visa.svg",
    alt: "Pay with Visa",
    name: "Visa",
  },
];

const WHATSAPP_NUMBER = "212723279328";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const WHATSAPP_FREE_TRIAL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20want%20to%20get%20the%2024h%20free%20IPTV%20trial%20from%20WATCHWORLDCUP.`;
const SITE_URL = "https://watchworldcup.us";
const SITE_NAME = "WATCHWORLDCUP";



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

/* ─────────────── Global styles ─────────────── */
function GlobalStyles() {
  const css = `
    html { scroll-behavior: smooth; }
    html, body { overflow-x: clip; overscroll-behavior-x: none; }

    @keyframes infinite-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes infinite-scroll-reverse {
      from { transform: translateX(-50%); }
      to   { transform: translateX(0); }
    }

    .animate-infinite-scroll {
      animation: infinite-scroll 25s linear infinite;
    }
    .animate-infinite-scroll-reverse {
      animation: infinite-scroll-reverse 25s linear infinite;
    }

    .glass {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      position: relative;
    }
    .glass::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(
        circle 200px at var(--glow-x, 50%) var(--glow-y, 50%),
        rgba(239,59,79,0.06),
        transparent 70%
      );
      pointer-events: none;
      border-radius: inherit;
      z-index: 0;
    }

    :focus-visible { outline: 2px solid rgba(248,113,113,.95); outline-offset: 3px; }
    ::selection { background: rgba(239,59,79,.35); color: #fff; }

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

/* ─────────────── Icons ─────────────── */
function TvIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 20h12M9 16v-6.5a2.5 2.5 0 015 0V16m-5 0h5m-5 0H8m7 0h1M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
      />
    </svg>
  );
}

function SportsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0v20M2 12h20"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function FilmIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
      />
    </svg>
  );
}

function SeriesIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ListIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

function DeviceIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 6.75h12"
      />
    </svg>
  );
}

function MessageIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337L5.25 21l1.287-3.337A8.25 8.25 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  );
}

function GiftIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125v-2.25c0-.621.504-1.125 1.125-1.125z"
      />
    </svg>
  );
}

function StarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

const serviceIcons: Record<string, FC<{ className?: string }>> = {
  "/live-tv": TvIcon,
  "/sports": SportsIcon,
  "/movies": FilmIcon,
  "/series": SeriesIcon,
};

const orderIcons: FC<{ className?: string }>[] = [
  ListIcon,
  CheckCircleIcon,
  DeviceIcon,
  MessageIcon,
];

const serviceCategories = [
  {
    href: "/live-tv",
    title: "Live TV Channels",
    description:
      "Discuss the live TV categories, countries and languages relevant to your order. Availability is confirmed before payment.",
    image: "/images/commercial/live-tv.webp",
  },
  {
    href: "/sports",
    title: "Live Sports Streaming",
    description:
      "Ask about current sports-content availability for your country and intended use. No league or broadcaster affiliation is claimed.",
    image: "/images/commercial/getfree.webp",
  },
  {
    href: "/movies",
    title: "Movies On Demand",
    description:
      "Confirm the current film categories, language and quality options relevant to your order before payment.",
    image: "/images/commercial/movies.webp",
  },
  {
    href: "/series",
    title: "TV Series & Shows",
    description:
      "Confirm current series availability and your device or application requirements before ordering.",
    image: "/images/commercial/series.webp",
  },
];

/* ─────────────── Trust Badges / Stats Bar ─────────────── */
function TrustBar() {
  const stats = [
    { value: "Global", label: "Live TV Channels" },
    { value: "Curated", label: "VOD Movies & Series" },
    { value: "HD / 4K", label: "Quality Options" },
    { value: "Fast", label: "Account Setup" },
    { value: "WhatsApp", label: "Order & Support" },
    { value: "24/7", label: "Customer Support" },
    { value: "Test", label: "Trial Guidance" },
  ];

  return (
    <section
      className="border-y border-white/5 bg-[#0a0a0c] py-4 sm:py-6"
      aria-label="Service statistics"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-lg sm:text-2xl font-black text-white">
                {stat.value}
              </span>
              <span className="mt-0.5 text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Reviews Section ─────────────── */
function ReviewsSection() {
  const reviews = [
    {
      name: "John M.",
      country: "USA",
      rating: 5,
      text: "Great IPTV setup guidance. High definition playback for Premier League and Champions League matches. Fast response on WhatsApp!",
      date: "March 2025",
    },
    {
      name: "Ahmed K.",
      country: "UAE",
      rating: 5,
      text: "Wide range of regional and sports channels. prompt support when setting up the M3U playlist on my Smart TV.",
      date: "April 2025",
    },
    {
      name: "Sarah L.",
      country: "UK",
      rating: 5,
      text: "Tested the service before purchasing. UK sports channels available in HD and easy activation on Samsung TV.",
      date: "May 2025",
    },
    {
      name: "Carlos R.",
      country: "Spain",
      rating: 5,
      text: "Good coverage for football leagues. The 12-month plan offers steady performance and clear channel selection.",
      date: "February 2025",
    },
    {
      name: "Marie D.",
      country: "France",
      rating: 5,
      text: "Chaînes de sport et divertissement en HD. Service client WhatsApp réactif pour la configuration initiale.",
      date: "June 2025",
    },
    {
      name: "Hassan B.",
      country: "Morocco",
      rating: 5,
      text: "Service très pratique avec un bon support technique. Testé avant de passer commande.",
      date: "January 2025",
    },
  ];

  return (
    <section
      className="mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20 md:px-8"
      aria-label="Customer reviews"
    >
      <AnimatedSection>
        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
          Customer Feedback
        </p>
        <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white md:text-5xl">
          What our subscribers say.
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          User experiences shared by subscribers across supported devices and apps.
        </p>
      </AnimatedSection>

      <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-black text-white text-sm">
                  {review.name}
                </p>
                <p className="text-xs text-slate-500">
                  {review.country} · {review.date}
                </p>
              </div>
              <div className="flex" aria-label={`${review.rating} stars`}>
                {[...Array(review.rating)].map((_, j) => (
                  <StarIcon key={j} className="h-4 w-4 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-6 text-slate-300">
              {review.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
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
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
    });
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
    const pMat = new THREE.PointsMaterial({
      size: isMobile ? 0.06 : 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const rings: THREE.Mesh[] = [];
    const ringColors = [0xef3b4f, 0x3b82f6, 0xef3b4f];
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.TorusGeometry(1.2 + i * 0.7, 0.012, 16, 120);
      const mat = new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: 0.18 - i * 0.04,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / (3 + i);
      ring.rotation.y = (Math.PI / 5) * i;
      scene.add(ring);
      rings.push(ring);
    }

    const globeGeo = new THREE.IcosahedronGeometry(1.1, isMobile ? 2 : 3);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0xef3b4f,
      wireframe: true,
      transparent: true,
      opacity: 0.09,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.set(2.5, 0, -1);
    scene.add(globe);

    let mouseX = 0,
      mouseY = 0;
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
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}

/* ─────────────── Hero 3D Title ─────────────── */
function Hero3DTitle() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const scaleRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const prefersReduced = useReducedMotion();

  useGSAP(() => {
    if (!titleRef.current || prefersReduced) return;
    const letters = titleRef.current.querySelectorAll<HTMLElement>(".letter");
    gsap.fromTo(
      letters,
      { y: 120, opacity: 0, rotateX: -90, transformOrigin: "50% 50% -60px" },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.1,
        stagger: 0.045,
        ease: "back.out(1.5)",
        delay: 0.3,
      },
    );
  }, []);

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
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
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

  const line1 = "WATCH WORLD CUP";
  const line2 = "IPTV";

  return (
    <div className="mt-4 w-full sm:mt-7">
      <div
        ref={scaleRef}
        className="origin-left"
        style={{
          width: "max-content",
          transform: `scale(${scale})`,
          willChange: "transform",
        }}
      >
        <h1
          ref={titleRef}
          className="font-black leading-[.92] tracking-[-.04em] select-none"
          style={{
            fontSize: "clamp(1.8rem, 7vw, 6rem)",
            perspective: "800px",
            transformStyle: "preserve-3d",
          }}
          aria-label="WATCHWORLDCUP IPTV and M3U subscriptions"
        >
          <span className="sr-only">WATCHWORLDCUP IPTV and M3U Subscriptions</span>
          <span
            className="block whitespace-nowrap text-white"
            style={{
              transformStyle: "preserve-3d",
              textShadow:
                "0 1px 0 rgba(255,255,255,.12), 0 2px 0 rgba(255,255,255,.06), 0 3px 0 rgba(0,0,0,.5), 0 12px 36px rgba(0,0,0,.6)",
            }}
          >
            {line1.split("").map((char, i) => (
              <span
                key={i}
                className="letter inline-block"
                style={{ width: char === " " ? "0.35em" : undefined }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span
            className="block whitespace-nowrap bg-gradient-to-r from-red-300 via-red-400 to-red-600 bg-clip-text text-transparent"
            style={{
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 0 28px rgba(239,59,79,0.6))",
            }}
          >
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

/* ─────────────── Three.js 3D Text ─────────────── */
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
      setLoaded(true);
      return;
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
    const pMat = new THREE.PointsMaterial({
      color: 0xef3b4f,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    let textMesh: THREE.Mesh | null = null;
    let textWidth = 0;

    const fitToWidth = () => {
      if (!textMesh || !textWidth) return;
      const visH =
        2 *
        camera.position.z *
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const visW = visH * camera.aspect;
      const s = Math.min(1.6, (visW * 0.88) / textWidth);
      textMesh.scale.setScalar(s);
    };

    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        const textGeo = new TextGeometry("Watch World Cup IPTV", {
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
          ctx.fillText("Watch World Cup IPTV", 512, 128);
          ctx.strokeStyle = "#ff6b7a";
          ctx.lineWidth = 2;
          ctx.strokeText("Watch World Cup IPTV", 512, 128);
        }
        const tex = new THREE.CanvasTexture(canvas);
        const planeGeo = new THREE.PlaneGeometry(12, 3);
        const planeMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          side: THREE.DoubleSide,
        });
        textMesh = new THREE.Mesh(planeGeo, planeMat);
        textWidth = 12;
        scene.add(textMesh);
        fitToWidth();
        setLoaded(true);
      },
    );

    let targetRotX = 0,
      targetRotY = 0;
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
      if (textMesh && !reduced) {
        textMesh.rotation.y += 0.008;
        textMesh.rotation.x = THREE.MathUtils.lerp(
          textMesh.rotation.x,
          targetRotX + Math.sin(t * 0.5) * 0.05,
          0.05,
        );
        textMesh.rotation.z = THREE.MathUtils.lerp(
          textMesh.rotation.z,
          targetRotY * 0.1,
          0.05,
        );
        textMesh.position.y = Math.sin(t * 0.8) * 0.15;
        pSystem.rotation.y = t * 0.02;
        pSystem.rotation.x = t * 0.01;
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
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, [isMobile, reduced]);

  return (
    <div className="relative w-full">
      <div
        ref={mountRef}
        className="mx-auto w-full"
        style={{ height: isMobile ? 220 : 350 }}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
        </div>
      )}
    </div>
  );
}

/* ─────────────── Welcome Popup ─────────────── */
function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    const showTimer = setTimeout(() => {
      setShow(true);
      closeTimer = setTimeout(() => setCanClose(true), 2000);
    }, 4000);
    return () => {
      clearTimeout(showTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, []);

  useEffect(() => {
    if (!show || closed) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [show, closed]);

  const handleClose = useCallback(() => {
    if (!canClose) return;
    setClosed(true);
  }, [canClose]);

  useEffect(() => {
    if (!show || closed) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [show, closed, handleClose]);

  const trialFeatures = [
    "Wide channel selection",
    "HD & 4K streaming options",
    "Extensive VOD movies & series collection",
    "Stable connection infrastructure",
    "TV Guide (EPG) included",
    "Compatible with major devices & apps",
    "24/7 WhatsApp customer support",
    "Catch-up & replay features",
    "Regular service updates",
    "Multi-device capability",
    "Sports coverage options",
    "Simple setup process",
    "Parental control features",
    "Fast credential setup",
    "No commitment, no credit card",
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
            aria-label="Free IPTV trial offer"
          >
            <div className="relative flex w-full max-w-[95vw] md:max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-[#0d0d0f] shadow-[0_32px_100px_rgba(0,0,0,.8),0_0_80px_rgba(239,59,79,.15)]">
              <div className="nice-scroll flex flex-1 flex-col justify-center gap-4 sm:gap-5 p-4 sm:p-6 md:p-10 overflow-y-auto overscroll-contain">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-red-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                  Limited Time Offer
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
                  Test WATCHWORLDCUP IPTV options — live TV, sports, and VOD channels — for 24 hours. Confirm device compatibility before ordering. No credit card required.
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
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current shrink-0"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882l6.198-1.625A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.804 9.804 0 01-4.99-1.367l-.358-.213-3.68.964.983-3.596-.233-.369A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
                  </svg>
                  <span className="truncate">
                    Get Free 24h Trial via WhatsApp
                  </span>
                </a>
                <p className="text-[10px] sm:text-[11px] text-slate-500">
                  Contact: +212 723 279 328 · No payment required · Instant
                  activation
                </p>
              </div>
              <div className="relative hidden w-1/2 shrink-0 flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-br from-red-950/60 via-[#0d0d0f] to-[#0d0d0f] md:flex">
                <img
                  alt="WATCHWORLDCUP IPTV Free Trial – Watch World Cup 2026 Live"
                  src="/images/commercial/getfree.webp"
                  className="h-full w-full object-cover"
                />
              </div>
              <motion.button
                onClick={handleClose}
                whileTap={{ scale: 0.9 }}
                className={`absolute right-3 top-3 sm:right-4 sm:top-4 flex h-8 w-8 items-center justify-center rounded-full border text-lg font-black transition-all duration-300 ${canClose ? "border-white/20 bg-white/10 text-white cursor-pointer hover:bg-white/20" : "border-white/5 bg-white/5 text-white/30 cursor-not-allowed"}`}
                aria-label="Close popup"
                disabled={!canClose}
              >
                {canClose ? (
                  "×"
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
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
      className={`pointer-events-none fixed left-1/2 top-24 z-[100] -translate-x-1/2 transition-opacity duration-700 sm:left-auto sm:translate-x-0 sm:right-6 lg:right-10 lg:top-28 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      <div className="w-32 sm:w-40 rounded-2xl border border-white/10 bg-[#0b0b0c]/95 px-4 sm:px-5 py-3 sm:py-4 text-center shadow-[0_24px_80px_rgba(0,0,0,.62),0_0_60px_rgba(239,59,79,.12)] backdrop-blur-xl">
        <div className="mx-auto flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-[10px] sm:text-xs font-black text-white shadow-[0_0_45px_rgba(239,59,79,.22)]">
          WWC
        </div>
        <p
          ref={progressRef}
          className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black tabular-nums text-white"
        >
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
      itemScope
      itemType="https://schema.org/Question"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-4 sm:p-6 text-left"
        aria-expanded={open}
      >
        <span
          className="font-black text-white text-sm sm:text-base"
          itemProp="name"
        >
          {question}
        </span>
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
            itemScope
            itemType="https://schema.org/Answer"
            itemProp="acceptedAnswer"
          >
            <p
              className="px-4 sm:px-6 pb-4 sm:pb-6 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300"
              itemProp="text"
            >
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto my-6 sm:my-8 max-w-7xl px-3 sm:px-4 md:px-8"
      aria-label="Free IPTV trial offer"
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-green-500/20 bg-gradient-to-r from-green-950/60 via-[#0d0d0f] to-red-950/40 p-5 sm:p-8 shadow-[0_0_60px_rgba(34,197,94,.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,197,94,.07),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(239,59,79,.07),transparent_50%)]" />
        <div className="relative flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-green-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              Free IPTV Trial Available Now
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
              Test the full WATCHWORLDCUP IPTV service before paying — contact
              us on WhatsApp at{" "}
              <strong className="text-white">+212 723 279 328</strong>. No
              credit card required.
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
            Get Free 24h IPTV Trial
            <span className="ml-1 rounded-lg bg-white/20 px-2 py-0.5 text-xs hidden sm:inline">
              +212 723 279 328
            </span>
          </a>
        </div>
      </div>
    </motion.section>
  );
}

/* ─────────────── Animated Section ─────────────── */
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
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
    gsap.fromTo(
      cards,
      { y: 80, opacity: 0, scale: 0.9, rotateY: -15 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          once: true,
        },
      },
    );
    if (!isMobile) {
      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>(".movie-img");
        if (!img) return;
        card.addEventListener("mouseenter", () => {
          gsap.to(img, { scale: 1.08, duration: 0.4, ease: "power2.out" });
          gsap.to(card, {
            y: -8,
            boxShadow: "0 20px 60px rgba(239,59,79,0.2)",
            duration: 0.4,
            ease: "power2.out",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(img, { scale: 1, duration: 0.4, ease: "power2.out" });
          gsap.to(card, {
            y: 0,
            boxShadow: "0 0 0 rgba(239,59,79,0)",
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });
    }
  }, [isMobile]);

  return (
    <section
      className="mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20 md:px-8"
      aria-label="Latest movies and series on IPTV"
    >
      <AnimatedSection>
        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400 gsap-reveal">
          On-demand movies & series
        </p>
        <h2 className="gsap-reveal mt-4 max-w-4xl text-2xl sm:text-3xl font-black md:text-5xl">
          Latest movies & series on IPTV.
        </h2>
        <p className="gsap-reveal mt-4 sm:mt-5 max-w-3xl text-sm sm:text-base leading-7 sm:leading-8 text-slate-300">
          Browse our extensive IPTV VOD collection — 100,000+ blockbuster films,
          trending series, and exclusive shows. Stream in Full HD and 4K
          quality. New titles added daily. Confirm current availability on
          WhatsApp.
        </p>
      </AnimatedSection>
      <div
        ref={gridRef}
        className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {movies.map((movie) => {
          const title = movie
            .replace(/\.webp$/, "")
            .replace(/([A-Z])/g, " $1")
            .trim();
          return (
            <div
              key={movie}
              className="movie-card group relative aspect-[2/3] overflow-hidden rounded-xl sm:rounded-2xl border border-white/5 bg-[#111]"
              style={{ perspective: "600px" }}
            >
              <Image
                src={`/images/assets/movies/${movie}`}
                alt={`Watch ${title} on IPTV – Stream ${title} in 4K HD`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                className="movie-img object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                <p className="text-[10px] sm:text-xs font-bold text-white truncate">
                  {title}
                </p>
              </div>
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 rounded-md bg-red-600 px-1 py-0.5 text-[9px] sm:text-[10px] font-black text-white">
                HD
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}



/* ─────────────── Features Grid ─────────────── */
function FeaturesGrid() {
  const features = [
    {
      icon: TvIcon,
      title: "Current availability check",
      desc: "Discuss the content categories, languages and countries that matter to your order before payment.",
    },
    {
      icon: SportsIcon,
      title: "Independent service",
      desc: "WATCHWORLDCUP is not FIFA, a league, broadcaster, studio or official tournament partner.",
    },
    {
      icon: FilmIcon,
      title: "Clear order scope",
      desc: "Receive written confirmation of the plan duration, content scope and delivery details before paying.",
    },
    {
      icon: CheckCircleIcon,
      title: "No unsupported performance guarantees",
      desc: "The site does not claim an uptime level, universal quality level or buffering outcome without current evidence.",
    },
    {
      icon: DeviceIcon,
      title: "Compatibility discussion",
      desc: "Confirm your exact device, operating system and intended IPTV application before ordering.",
    },
    {
      icon: ArrowRightIcon,
      title: "Delivery details first",
      desc: "Ask for the credential format, delivery process and activation conditions in writing before payment.",
    },
    {
      icon: ListIcon,
      title: "Terms before payment",
      desc: "Confirm payment method, cancellation and applicable refund terms before you decide to proceed.",
    },
    {
      icon: SportsIcon,
      title: "Territory-specific information",
      desc: "Content and technical availability can vary by country, language, application and device.",
    },
    {
      icon: MessageIcon,
      title: "Published contact route",
      desc: "Use WhatsApp to request current availability, compatibility details, terms or website support.",
    },
  ];

  return (
    <section
      className="mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20 md:px-8"
      aria-label="WATCHWORLDCUP IPTV features"
    >
      <AnimatedSection>
        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
          Before you order
        </p>
        <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white md:text-5xl">
          Make an informed subscription decision.
        </h2>
        <p className="mt-4 max-w-3xl text-sm sm:text-base leading-7 text-slate-300">
          The public website avoids unsupported catalog totals, ratings, uptime,
          quality and universal-compatibility guarantees. Confirm the details
          that apply to your individual order.
        </p>
      </AnimatedSection>
      <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5 sm:p-6"
          >
            <f.icon className="h-8 w-8 text-red-400" />
            <h3 className="mt-3 font-black text-white text-sm sm:text-base">
              {f.title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-400">
              {f.desc}
            </p>
          </motion.div>
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
      const target =
        e.target instanceof Element
          ? e.target.closest<HTMLElement>(".glass")
          : null;
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
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    });
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, []);

  const scrollSpeed = isMobile ? 20 : 25;

  return (
    <>
      <GlobalStyles />
      {mounted && <Splash progressRef={progressRef} fading={fading} />}

      <main itemScope itemType="https://schema.org/WebPage">
        {/* ── Hero ── */}
        <section
          className="relative min-h-[85vh] sm:min-h-[92vh] overflow-hidden border-b border-white/5"
          aria-label="WATCHWORLDCUP IPTV and M3U subscriptions"
        >
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
                itemProp="description"
              >
                Choose a time-based WATCHWORLDCUP IPTV or M3U subscription and
                confirm the current content scope, country, device, application,
                delivery process, payment and applicable terms before ordering.
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
                  title="View IPTV Subscription Plans – WATCHWORLDCUP"
                >
                  View IPTV Subscription Plans
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
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
                  className="inline-flex items-center justify-center rounded-2xl border border-green-500/40 bg-green-600 px-5 sm:px-7 py-3.5 sm:py-4 font-black text-white shadow-[0_0_30px_rgba(34,197,94,.2)] transition-all hover:scale-105 hover:bg-green-500 text-sm sm:text-base"
                  title="Order IPTV on WhatsApp – WATCHWORLDCUP"
                >
                  Order IPTV on WhatsApp
                </a>
              </motion.div>

              {/* ── Micro-trust signals ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4"
              >
                {[
                  { label: "Plan confirmation", Icon: CheckCircleIcon },
                  { label: "Availability check", Icon: ListIcon },
                  { label: "Device discussion", Icon: DeviceIcon },
                  { label: "WhatsApp ordering", Icon: MessageIcon },
                ].map(({ label, Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-400 bg-white/5 border border-white/5 rounded-full px-2.5 py-1"
                  >
                    <Icon className="h-3.5 w-3.5 text-red-400" />
                    {label}
                  </span>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                className="mt-4 sm:mt-5 max-w-3xl text-[10px] sm:text-xs leading-5 sm:leading-6 text-slate-500"
              >
                WATCHWORLDCUP provides time-based IPTV and M3U subscriptions for
                use with compatible IPTV applications and devices. WATCHWORLDCUP
                is not affiliated with FIFA, any league, broadcaster, studio, or
                official tournament partner. Confirm content availability before
                ordering.
              </motion.p>
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.8 }}
              className="hidden w-72 shrink-0 rounded-2xl border border-white/10 bg-[#0d0d0f]/80 p-6 backdrop-blur-xl xl:block"
              aria-label="Quick order guide"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
                Get started in minutes
              </p>
              <h2 className="mt-4 text-xl font-black text-white">
                Order IPTV now
              </h2>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                {[
                  ["1", "Choose a plan", "Review the listed durations and prices"],
                  ["2", "Confirm availability", "Discuss country, content and compatibility"],
                  ["3", "Review terms", "Confirm delivery and payment details first"],
                ].map(([num, title, sub]) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + Number(num) * 0.15 }}
                    className="flex items-start gap-3 rounded-xl border border-white/[.07] bg-[#080808]/70 p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-xs font-black text-red-300">
                      {num}
                    </span>
                    <div>
                      <p className="font-bold text-white text-xs">{title}</p>
                      <p className="text-[10px] text-slate-500">{sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 font-black text-white text-sm hover:bg-green-500 transition-colors"
              >
                Ask about a plan
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            </motion.aside>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 z-10 -translate-x-1/2"
            aria-hidden="true"
          >
            <div className="flex h-8 sm:h-10 w-5 sm:w-6 items-start justify-center rounded-full border border-white/20 pt-1 sm:pt-1.5">
              <div className="h-1.5 sm:h-2 w-0.5 sm:w-1 rounded-full bg-red-400" />
            </div>
          </motion.div>
        </section>

        {/* ── Features ── */}
        <FeaturesGrid />

        {/* ── Service Categories ── */}
        <section
          className="mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20 md:px-8"
          aria-label="IPTV content categories"
        >
          <AnimatedSection>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400 gsap-reveal">
              IPTV content categories
            </p>
            <h2 className="gsap-reveal mt-4 max-w-4xl text-2xl sm:text-3xl font-black md:text-5xl">
              Live TV, Sports, Movies & Series — all in one subscription.
            </h2>
            <p className="gsap-reveal mt-4 sm:mt-5 max-w-3xl text-sm sm:text-base leading-7 sm:leading-8 text-slate-300">
              WATCHWORLDCUP IPTV subscription covers all entertainment needs.
              Confirm specific content availability for your country and
              language via WhatsApp.
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
                  title={`${category.title} – WATCHWORLDCUP IPTV`}
                >
                  <div className="relative aspect-[16/7] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={`${category.title} – WATCHWORLDCUP Premium IPTV Streaming`}
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
                      return Icon ? (
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-red-400" />
                      ) : null;
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
        <section aria-label="How to order IPTV from WATCHWORLDCUP">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20 md:px-8">
            <AnimatedSection>
              <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
                How to order IPTV subscription
              </p>
              <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white md:text-5xl">
                Get your IPTV subscription in 4 easy steps.
              </h2>
              <p className="mt-3 max-w-3xl text-sm text-slate-300">
                Review the plan, then confirm the current scope and terms that
                apply to your order before payment.
              </p>
            </AnimatedSection>
            <div className="mt-8 sm:mt-10 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {[
                [
                  "01",
                  "Choose a plan",
                  "Review the available durations and current plan information.",
                ],
                [
                  "02",
                  "Choose Your Plan",
                  "Identify the content, country, device and app requirements you need confirmed.",
                ],
                [
                  "03",
                  "Order on WhatsApp",
                  "Confirm current availability, credential format, delivery, payment and applicable terms in writing.",
                ],
                [
                  "04",
                  "Start Streaming",
                  "Use the provided setup information only after the order details and terms have been confirmed.",
                ],
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
                      <span className="text-xs font-black text-slate-500">
                        {n}
                      </span>
                    </div>
                    <h3 className="mt-4 sm:mt-5 font-black text-white text-sm sm:text-base">
                      {title}
                    </h3>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-400">
                      {text}
                    </p>
                  </motion.article>
                );
              })}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-3.5 font-black text-white hover:bg-green-500 transition-colors text-sm"
              >
                Contact us on WhatsApp
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-3.5 font-black text-red-300 hover:bg-red-500/20 transition-colors text-sm"
              >
                View All IPTV Plans
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
       <section
          className="mx-auto max-w-7xl px-3 sm:px-4 py-16 sm:py-20 md:px-8"
          aria-label="IPTV subscription pricing plans"
        >
          <AnimatedSection>
            <div className="flex flex-col justify-between gap-4 sm:gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
                  Affordable IPTV subscription plans
                </p>
                <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white md:text-5xl">
                  Best IPTV prices in 2026.
                </h2>
                <p className="mt-3 sm:mt-4 max-w-3xl text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300">
                  Choose the WATCHWORLDCUP IPTV plan that suits you. All plans
                  include the same premium features — 30,000+ channels, 4K HD
                  sports, VOD library, EPG, and 24/7 support.
                </p>
              </div>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 font-black text-red-400 text-sm"
              >
                Compare all IPTV plan details
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>

          <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
            {[
              {
                months: "3",
                price: "$29",
                label: "Starter Plan",
                popular: false,
              },
              {
                months: "6",
                price: "$49",
                label: "Most Popular Plan",
                popular: true,
              },
              {
                months: "12",
                price: "$79",
                label: "Best Value Plan",
                popular: false,
              },
            ].map((plan) => (
              <motion.article
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
                itemScope
                itemType="https://schema.org/Offer"
              >
                {plan.popular && (
                  <div className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full bg-red-600 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white">
                    Most Popular
                  </div>
                )}
                <p
                  className="text-xs sm:text-sm font-black text-slate-400"
                  itemProp="name"
                >
                  {plan.label}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {plan.months} Month IPTV Subscription
                </p>
                <p className="mt-2 text-4xl sm:text-5xl font-black text-white">
                  <span>{plan.price}</span>
                  <meta
                    itemProp="price"
                    content={plan.price.replace("$", "")}
                  />
                </p>
                <meta itemProp="priceCurrency" content="USD" />
                <meta
                  itemProp="availability"
                  content="https://schema.org/InStock"
                />
                <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-300">
                  {[
                    "30,000+ live channels worldwide",
                    "Full HD & 4K sports streaming",
                    "100,000+ VOD movies & series",
                    "99.9% Uptime & Anti-Freeze tech",
                    "EPG TV Guide included",
                    "All devices compatible",
                    "24/7 WhatsApp support",
                    "Catch-up & 7-day replay",
                    "Free automatic updates",
                    "Multi-device & multi-room",
                    "All PPV events included",
                    "No VPN required",
                    "Parental control features",
                    "Instant activation (1-3h)",
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
                  itemProp="url"
                >
                  Order {plan.months}-Month IPTV Plan
                </a>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-row items-center justify-center gap-4 sm:gap-6 overflow-x-auto rounded-xl py-4 sm:py-6 mt-6"
            aria-label="Accepted payment methods"
          >
            <p className="text-xs text-slate-500 font-bold shrink-0">
              Secure payment via:
            </p>
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
                  src={
                    payment.src.startsWith("/")
                      ? payment.src
                      : `/${payment.src}`
                  }
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
        <section aria-label="Compatible devices for WATCHWORLDCUP IPTV">
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
                alt="WATCHWORLDCUP IPTV compatible devices – Smart TV, Fire Stick, Android, iOS, MAG box"
                fill
                quality={55}
                sizes="(max-width:1424px) 100vw, 45vw"
                className="object-cover saturate-[.78] contrast-110"
              />
            </motion.div>
            <AnimatedSection delay={0.2}>
              <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
                Confirm compatibility first
              </p>
              <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white md:text-5xl">
                Discuss your device and IPTV application.
              </h2>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-7 sm:leading-8 text-slate-300">
                Device and application compatibility can vary. Share your exact
                model, operating system and intended IPTV application with
                support before payment; do not rely on a generic device list as
                a compatibility guarantee.
              </p>
              <ul className="mt-5 sm:mt-6 grid gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 sm:grid-cols-2">
                {[
                  "Exact device model",
                  "Operating system version",
                  "Intended IPTV application",
                  "Country or region",
                  "Preferred content categories",
                  "Language requirements",
                  "Credential format needed",
                  "Delivery and setup questions",
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
              <div className="mt-5 sm:mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/setup-guides"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 sm:px-6 py-2.5 sm:py-3 font-black text-white hover:bg-red-500 text-sm"
                  title="IPTV Setup Guides for all devices – WATCHWORLDCUP"
                >
                  View IPTV Setup Guides
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-5 sm:px-6 py-2.5 sm:py-3 font-black text-green-300 hover:bg-green-500/20 text-sm"
                >
                  Check device compatibility
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          className="mx-auto max-w-7xl px-3 sm:px-4 pb-16 sm:pb-24 pt-8 sm:pt-10 md:px-8"
          aria-label="IPTV Frequently Asked Questions"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <AnimatedSection>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
              IPTV frequently asked questions
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white md:text-5xl">
              WATCHWORLDCUP IPTV FAQ
            </h2>
            <p className="mt-3 sm:mt-4 max-w-3xl text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300">
              Understand the ordering process, current availability checks and
              the separation between WATCHWORLDCUP and third-party content
              providers.
            </p>
          </AnimatedSection>
          <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            {homeFaqs.map(({ question, answer }, index) => (
              <FAQItem
                key={question}
                question={question}
                answer={answer}
                index={index}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-white/5 bg-white/[.02] p-5 sm:p-8 text-center"
          >
            <h3 className="text-lg font-black text-white">
              Still have questions?
            </h3>
            <p className="text-sm sm:text-base text-slate-300">
              Use the published WhatsApp channel to discuss a plan, current
              availability, device compatibility or a website issue.
            </p>
            <p className="text-xs text-slate-500">
              WhatsApp: <strong className="text-white">+212 723 279 328</strong>
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
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 sm:px-6 py-2.5 sm:py-3 font-black text-red-300 hover:bg-red-500/20 text-sm"
              >
                View IPTV Plans
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </section>

       
      </main>
    </>
  );
}

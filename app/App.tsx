"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

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

const serviceIcons: Record<string, React.FC<{ className?: string }>> = {
  "/live-tv": TvIcon,
  "/sports": SportsIcon,
  "/movies": FilmIcon,
  "/series": SeriesIcon,
};

const orderIcons = [ListIcon, CheckCircleIcon, DeviceIcon, MessageIcon];

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

function SEOMeta() {
  return (
    <Head>
      <title>Watch World Cup IPTV – Live TV, Sports, Movies & Series</title>
      <meta
        name="description"
        content="WATCHWORLDCUP offers premium IPTV & M3U subscriptions. Stream live sports, World Cup matches, movies, and series. Order via WhatsApp. Plans from 3 to 12 months."
      />
      <meta
        name="keywords"
        content="IPTV, World Cup IPTV, live sports streaming, M3U subscription, IPTV service, watch World Cup, IPTV plans, IPTV WhatsApp order"
      />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href="https://watchworldcup.com/" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://watchworldcup.com/" />
      <meta property="og:title" content="Watch World Cup IPTV – Live TV, Sports, Movies & Series" />
      <meta property="og:description" content="Premium IPTV & M3U subscriptions. Stream World Cup, live sports, movies and series. Order on WhatsApp." />
      <meta property="og:image" content="https://watchworldcup.com/images/og-image.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Watch World Cup IPTV – Live TV, Sports, Movies & Series" />
      <meta name="twitter:description" content="Premium IPTV & M3U subscriptions. Stream World Cup, live sports, movies and series." />
      <meta name="twitter:image" content="https://watchworldcup.com/images/og-image.jpg" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "WATCHWORLDCUP",
            url: "https://watchworldcup.com",
            description: "Premium IPTV & M3U subscription service for live TV, sports, movies, and series.",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+212723279328",
              contactType: "customer service",
              availableLanguage: ["English", "French", "Arabic"],
            },
            offers: {
              "@type": "Offer",
              name: "IPTV Subscription Plans",
              description: "3-month, 6-month, and 12-month IPTV subscription plans",
            },
          }),
        }}
      />
    </Head>
  );
}

function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const particleCount = 1800;
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
      size: 0.045,
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

    const globeGeo = new THREE.IcosahedronGeometry(1.1, 3);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0xef3b4f,
      wireframe: true,
      transparent: true,
      opacity: 0.09,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.set(2.5, 0, -1);
    scene.add(globe);

    let mouseX = 0;
    let mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

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
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}

function Hero3DTitle() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useGSAP(() => {
    if (!titleRef.current) return;
    const letters = titleRef.current.querySelectorAll<HTMLElement>(".letter");
    gsap.fromTo(
      letters,
      {
        y: 120,
        opacity: 0,
        rotateX: -90,
        transformOrigin: "50% 50% -60px",
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.1,
        stagger: 0.045,
        ease: "back.out(1.5)",
        delay: 0.3,
      }
    );
  }, []);

  const line1 = "WATCH WORLD CUP";
  const line2 = "IPTV";

  return (
    <h1
      ref={titleRef}
      className="mt-7 font-black leading-[.92] tracking-[-.04em] select-none"
      style={{
        fontSize: "clamp(2.4rem, 6vw, 6rem)",
        perspective: "800px",
        transformStyle: "preserve-3d",
      }}
      aria-label="WATCH WORLD CUP IPTV"
    >
      <span className="block" style={{ transformStyle: "preserve-3d" }}>
        {line1.split("").map((char, i) => (
          <span
            key={i}
            className="letter inline-block"
            style={{
              display: char === " " ? "inline" : "inline-block",
              width: char === " " ? "0.35em" : undefined,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span
        className="block bg-gradient-to-r from-red-300 via-red-400 to-red-600 bg-clip-text text-transparent"
        style={{ transformStyle: "preserve-3d" }}
      >
        {line2.split("").map((char, i) => (
          <span
            key={i}
            className="letter inline-block"
            style={{
              filter: "drop-shadow(0 0 28px rgba(239,59,79,0.6))",
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </h1>
  );
}

function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShow(true);
      const closeTimer = setTimeout(() => {
        setCanClose(true);
      }, 2000);
      return () => clearTimeout(closeTimer);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
    };
  }, []);

  const handleClose = useCallback(() => {
    if (!canClose) return;
    setClosed(true);
  }, [canClose]);

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
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Special offer popup"
          >
            <div className="relative flex w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0f] shadow-[0_32px_100px_rgba(0,0,0,.8),0_0_80px_rgba(239,59,79,.15)]">
              <div className="flex flex-1 flex-col justify-center gap-5 p-8 md:p-10">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-red-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                  Limited Offer
                </div>
                <div>
                  <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
                    🎁 Get{" "}
                    <span className="bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent">
                      24 Hours FREE
                    </span>
                    <br />
                    IPTV Trial
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Experience the full power of WATCHWORLDCUP IPTV — live
                    sports, World Cup matches, 10,000+ channels — completely
                    free for 24 hours. No credit card required.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {[
                    "✅ 10,000+ live channels",
                    "✅ Full HD & 4K sports",
                    "✅ Instant activation",
                    "✅ No commitment",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={WHATSAPP_FREE_TRIAL}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3.5 text-sm font-black text-white shadow-[0_0_30px_rgba(34,197,94,.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,.4)]"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882l6.198-1.625A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.804 9.804 0 01-4.99-1.367l-.358-.213-3.68.964.983-3.596-.233-.369A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
                  </svg>
                  Get Free 24h Trial via WhatsApp
                </a>
                <p className="text-[11px] text-slate-500">
                  Contact: +212 723 279 328 · No payment required
                </p>
              </div>
              <div className="relative hidden w-1/2 shrink-0 flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-br from-red-950/60 via-[#0d0d0f] to-[#0d0d0f] md:flex">
                <img
                alt=""
             
                src="images/commercial/getfree.webp"
                className="h-full w-full"
                />
              </div>
              <motion.button
                onClick={handleClose}
                whileTap={{ scale: 0.9 }}
                className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border text-lg font-black transition-all duration-300 ${
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

function Splash({
  progressRef,
  fading,
}: {
  progressRef: React.RefObject<HTMLParagraphElement | null>;
  fading: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute right-4 top-24 z-[100] transition-opacity duration-700 sm:right-6 lg:right-10 lg:top-28 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
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
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
        aria-expanded={open}
      >
        <span className="font-black text-white">{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 text-2xl font-thin text-red-400"
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
            <p className="px-6 pb-6 text-sm leading-7 text-slate-300">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FreeTrialBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto my-8 max-w-7xl px-4 md:px-8"
    >
      <div className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-r from-green-950/60 via-[#0d0d0f] to-red-950/40 p-8 shadow-[0_0_60px_rgba(34,197,94,.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,197,94,.07),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(239,59,79,.07),transparent_50%)]" />
        <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-green-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              Free Trial Available
            </div>
            <h3 className="mt-3 text-2xl font-black text-white md:text-3xl">
              🎁 Get{" "}
              <span className="bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">
                24 Hours FREE
              </span>{" "}
              IPTV Access
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Test the full service before paying — contact us on WhatsApp at{" "}
              <strong className="text-white">+212 723 279 328</strong>
            </p>
          </div>
          <a
            href={WHATSAPP_FREE_TRIAL}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 font-black text-white shadow-[0_0_40px_rgba(34,197,94,.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(34,197,94,.4)]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882l6.198-1.625A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.804 9.804 0 01-4.99-1.367l-.358-.213-3.68.964.983-3.596-.233-.369A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
            </svg>
            Get Free 24h Trial
            <span className="ml-1 rounded-lg bg-white/20 px-2 py-0.5 text-xs">
              +212 723 279 328
            </span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

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

function MoviesSection() {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".movie-card");

    gsap.fromTo(
      cards,
      {
        y: 80,
        opacity: 0,
        scale: 0.9,
        rotateY: -15,
      },
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
      }
    );

    cards.forEach((card) => {
      const img = card.querySelector<HTMLElement>(".movie-img");
      if (!img) return;

      card.addEventListener("mouseenter", () => {
        gsap.to(img, {
          scale: 1.08,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(card, {
          y: -8,
          boxShadow: "0 20px 60px rgba(239,59,79,0.2)",
          duration: 0.4,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(img, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(card, {
          y: 0,
          boxShadow: "0 0 0 rgba(239,59,79,0)",
          duration: 0.4,
          ease: "power2.out",
        });
      });
    });
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <AnimatedSection>
        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400 gsap-reveal">
          On-demand movies
        </p>
        <h2 className="gsap-reveal mt-4 max-w-4xl text-3xl font-black md:text-5xl">
          Latest movies & series available.
        </h2>
        <p className="gsap-reveal mt-5 max-w-3xl text-base leading-8 text-slate-300">
          Browse our extensive collection of blockbuster films and trending
          series. New titles added regularly — confirm current availability
          on WhatsApp.
        </p>
      </AnimatedSection>

      <div
        ref={gridRef}
        className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {movies.map((movie) => (
          <div
            key={movie}
            className="movie-card group relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/5 bg-[#111]"
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
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
              <p className="text-xs font-bold text-white truncate">
                {movie.replace(/\.webp$/, "").replace(/([A-Z])/g, " $1").trim()}
              </p>
            </div>
            <div className="absolute top-2 right-2 rounded-md bg-red-600 px-1.5 py-0.5 text-[10px] font-black text-white">
              HD
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const progressRef = useRef<HTMLParagraphElement | null>(null);
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(true);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [speed] = useState(25);

  useEffect(() => {
    let frame = 0;
    let hold: ReturnType<typeof setTimeout>;
    let remove: ReturnType<typeof setTimeout>;
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
      clearTimeout(hold);
      clearTimeout(remove);
    };
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const target =
        e.target instanceof Element ? e.target.closest<HTMLElement>(".glass") : null;
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
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
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

  return (
    <>
      <SEOMeta />
      <WelcomePopup />
      {mounted && <Splash progressRef={progressRef} fading={fading} />}

      <main>
        <section className="relative min-h-[92vh] overflow-hidden border-b border-white/5">
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
            className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-center justify-between gap-10 px-4 py-20 md:px-8"
          >
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-400/10 px-4 py-2 text-xs font-extrabold text-red-300"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                IPTV / M3U subscriptions · WhatsApp ordering
              </motion.div>

              <Hero3DTitle />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-7 max-w-3xl text-base leading-8 text-slate-200 md:text-xl"
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
                className="mt-9 flex flex-wrap gap-3"
              >
                <Link
                  href="/pricing"
                  className="inline-flex items-center rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-7 py-4 font-black text-white shadow-[0_0_40px_rgba(239,59,79,.25)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(239,59,79,.4)]"
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
                  className="inline-flex items-center rounded-2xl border border-green-500/40 bg-green-600 px-7 py-4 font-black text-white shadow-[0_0_30px_rgba(34,197,94,.2)] transition-all hover:scale-105 hover:bg-green-500"
                >
                  Order on WhatsApp
                </a>
                <a
                  href={WHATSAPP_FREE_TRIAL}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-7 py-4 font-black text-green-300 transition-all hover:bg-green-500/20"
                >
                  🎁 Free 24h Trial
                </a>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="mt-5 max-w-3xl text-xs leading-6 text-slate-400"
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
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          >
            <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 pt-1.5">
              <div className="h-2 w-1 rounded-full bg-red-400" />
            </div>
          </motion.div>
        </section>

        <FreeTrialBanner />

        <div className="flex flex-col gap-4 py-4">
          <div className="relative w-full overflow-hidden">
            <div className="flex w-max animate-infinite-scroll-reverse hover:[animation-play-state:paused]" style={{ animationDuration: `${speed}s` }}>
              {[...channels, ...channels].map((channel, index) => (
                <div key={`${channel.id}-${index}`} className="mx-8 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <img src={channel.src} alt={channel.alt} className="h-28 w-auto max-w-[150px] object-contain" />
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full overflow-hidden">
            <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]" style={{ animationDuration: `${speed}s` }}>
              {[...sports, ...sports].map((sport, index) => (
                <div key={`${sport.id}-${index}`} className="mx-8 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <img src={sport.src} alt={sport.alt} className="h-28 w-auto max-w-[150px] object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <AnimatedSection>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400 gsap-reveal">
              Entertainment categories
            </p>
            <h2 className="gsap-reveal mt-4 max-w-4xl text-3xl font-black md:text-5xl">
              One subscription service, four content areas.
            </h2>
            <p className="gsap-reveal mt-5 max-w-3xl text-base leading-8 text-slate-300">
              Browse the service structure, then ask for the current
              availability relevant to your country, language and viewing needs.
            </p>
          </AnimatedSection>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {serviceCategories.map((category, i) => (
              <motion.div
                key={category.href}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={category.href}
                  className="group block overflow-hidden rounded-2xl border border-white/5 bg-[#0d0d0f]/60 backdrop-blur-sm"
                >
                  <div className="relative aspect-[16/7] overflow-hidden">
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
                  <div className="p-7">
                    {(() => {
                      const Icon = serviceIcons[category.href];
                      return Icon ? <Icon className="h-7 w-7 text-red-400" /> : null;
                    })()}
                    <h3 className="mt-5 text-2xl font-black text-white">
                      {category.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {category.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 font-black text-red-400">
                      Explore category
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
            <AnimatedSection>
              <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
                Simple ordering flow
              </p>
              <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">
                From plan selection to IPTV setup.
              </h2>
            </AnimatedSection>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
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
                    whileHover={{ scale: 1.03 }}
                    className="rounded-2xl border border-white/5 bg-[#0d0d0f]/60 p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="h-6 w-6 text-red-400" />
                      <span className="text-xs font-black text-slate-500">{n}</span>
                    </div>
                    <h3 className="mt-5 font-black text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <MoviesSection />

        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <AnimatedSection>
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
                  Verified plan prices
                </p>
                <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">
                  Choose your IPTV subscription.
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                  Plan prices and durations are shown below. Content inventory
                  and technical compatibility are confirmed through WhatsApp
                  before payment.
                </p>
              </div>
              <Link href="/pricing" className="inline-flex items-center gap-2 font-black text-red-400">
                Compare plan details
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>

          <div className="mt-10">
            <div className="grid gap-6 md:grid-cols-3">
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
                  whileHover={{ y: -8 }}
                  className={`relative overflow-hidden rounded-3xl border p-8 ${
                    plan.popular
                      ? "border-red-500/30 bg-gradient-to-b from-red-950/30 to-[#0d0d0f]"
                      : "border-white/5 bg-[#0d0d0f]/60"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                      Most Popular
                    </div>
                  )}
                  <p className="text-sm font-black text-slate-400">{plan.months} Months</p>
                  <p className="mt-2 text-5xl font-black text-white">{plan.price}</p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-300">
                    {[
                      "10,000+ Live Channels",
                      "Full HD & 4K Quality",
                      "Movies & Series On-Demand",
                      "24/7 WhatsApp Support",
                      "Instant Activation",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-red-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={WHATSAPP_FREE_TRIAL}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className={`mt-8 block w-full rounded-2xl px-6 py-3.5 text-center text-sm font-black transition-all hover:scale-105 ${
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
            className="flex flex-row items-center justify-center gap-6 overflow-x-auto rounded-xl py-6"
          >
            {payments.map((payment, i) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex min-w-[60px] flex-col items-center gap-1"
              >
                <img
                  src={payment.src}
                  alt={payment.alt}
                  width={80}
                  height={50}
                  className="object-contain transition-all duration-300 hover:scale-110"
                />
                <span className="text-center text-xs font-black text-slate-500 transition-all duration-300 hover:text-red-400">
                  {payment.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section>
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[16/11] overflow-hidden rounded-2xl"
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
              <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">
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
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0d0d0f]/60 p-4 backdrop-blur-sm"
                  >
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-red-400" />
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Link
                href="/setup-guides"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-black text-white hover:bg-red-500"
              >
                View setup guides
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </AnimatedSection>
          </div>
        </section>

        <FreeTrialBanner />

        <section className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:px-8">
          <AnimatedSection>
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-400">
              Questions before ordering
            </p>
            <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">
              IPTV subscription FAQ
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Everything you need to know about WATCHWORLDCUP IPTV service,
              ordering, compatibility, and free trial.
            </p>
          </AnimatedSection>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {serviceFaqs.map(([question, answer], index) => (
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
            className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-white/5 bg-white/[.02] p-8 text-center"
          >
            <p className="text-slate-300">
              Still have questions? Our team is available on WhatsApp 24/7.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center rounded-2xl border border-green-500/40 bg-green-600 px-6 py-3 font-black text-white shadow-[0_0_30px_rgba(34,197,94,.2)] transition-all hover:scale-105 hover:bg-green-500"
              >
                Ask on WhatsApp
              </a>
              <a
                href={WHATSAPP_FREE_TRIAL}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-6 py-3 font-black text-green-300 hover:bg-green-500/20"
              >
                🎁 Get Free 24h Trial
              </a>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}
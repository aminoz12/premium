"use client";
import {
  CTA_EVENT_NAME,
  WHATSAPP_PHONE_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/cta";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}
export function trackWhatsAppClick(placement: string) {
  const detail = {
    event: CTA_EVENT_NAME,
    placement,
    path: window.location.pathname,
    target: "watchworldcup-iptv-whatsapp",
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(detail);
  window.dispatchEvent(new CustomEvent("watchworldcup:cta", { detail }));
}
function WhatsAppIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12.04 2a9.84 9.84 0 0 0-8.5 14.78L2 22l5.36-1.5A9.96 9.96 0 1 0 12.04 2Zm0 17.95a8.02 8.02 0 0 1-4.08-1.12l-.29-.17-3.18.89.85-3.1-.19-.31a8.03 8.03 0 1 1 6.89 3.81Zm4.4-6.01c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2a7.27 7.27 0 0 1-1.34-1.67c-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46a.88.88 0 0 0-.64.3c-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
export function FloatingWhatsAppCTA() {
  return (
    <div className="group fixed bottom-5 right-4 z-[70] sm:right-6">
      <span className="pointer-events-none absolute bottom-full right-0 mb-3 hidden w-72 rounded-xl border border-white/10 bg-[#080808]/95 p-3 text-xs leading-5 text-slate-200 shadow-2xl group-hover:block group-focus-within:block">
        Ask WATCHWORLDCUP about plans, current availability, and app/device
        compatibility before ordering.
      </span>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        onClick={() => trackWhatsAppClick("floating")}
        aria-label="Contact WATCHWORLDCUP IPTV sales on WhatsApp (opens in a new tab)"
        className="relative flex h-14 items-center justify-center gap-2 rounded-full border border-green-400/35 bg-gradient-to-r from-green-600 to-green-800 px-4 font-black text-white shadow-[0_16px_55px_rgba(239,59,79,.28)] transition-all duration-300 before:absolute before:inset-[-5px] before:-z-10 before:rounded-full before:border before:border-green-500/25 hover:-translate-y-1 hover:shadow-[0_20px_65px_rgba(239,59,79,.38)] focus-visible:outline-white"
      >
        <WhatsAppIcon />
        <span className="hidden sm:inline">Order on WhatsApp</span>
      </a>
    </div>
  );
}
export function CommercialCTA({
  placement = "footer",
}: {
  placement?: string;
}) {
  return (
    <section
      className="surface-panel relative overflow-hidden rounded-2xl border-green-500/25 p-6 before:pointer-events-none before:absolute before:-right-16 before:-top-24 before:h-52 before:w-52 before:rounded-full before:bg-green-600/10 before:blur-3xl md:flex md:items-center md:justify-between md:gap-8"
      aria-label="WATCHWORLDCUP IPTV WhatsApp ordering"
    >
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[.2em] text-green-300">
          WhatsApp ordering
        </p>
        <h2 className="mt-2 text-xl font-black text-white">
          Choose or confirm your IPTV plan
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Message WATCHWORLDCUP at {WHATSAPP_PHONE_DISPLAY}. Confirm current
          content availability, your intended device and IPTV app, what
          credentials you will receive, and the applicable terms before payment.
        </p>
      </div>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        onClick={() => trackWhatsAppClick(placement)}
        className="relative mt-5 inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-green-800 px-5 py-3 font-black text-white shadow-[0_12px_35px_rgba(239,59,79,.22)] transition-all duration-300 hover:-translate-y-0.5 hover:from-green-500 hover:to-green-700 hover:shadow-[0_16px_45px_rgba(239,59,79,.32)] md:mt-0"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Message WATCHWORLDCUP
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </section>
  );
}

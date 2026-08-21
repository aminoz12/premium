"use client";
import { planFeatures, subscriptionPlans } from "@/lib/commercial";
import { ClockIcon } from "./Icons";
import { trackWhatsAppClick } from "./WhatsAppCTA";
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="mt-1 h-4 w-4 shrink-0 text-red-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="m4 10 3.5 3.5L16 5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default function CommercialPlanCards({
  placement = "pricing",
}: {
  placement?: string;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {subscriptionPlans.map((plan, index) => {
        const monthly = (plan.price / plan.months).toFixed(2);
        return (
          <article
            key={plan.id}
            className={`premium-card glass rounded-2xl p-7 ${index === 1 ? "border-red-400/35 bg-red-400/[.055] shadow-[0_24px_80px_rgba(239,59,79,.07)]" : ""}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-red-400" />
                <p className="text-xs font-extrabold uppercase tracking-[.18em] text-red-400">
                  {plan.name}
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[.045] px-3 py-1 text-[10px] font-black uppercase tracking-[.14em] text-slate-300">
                IPTV / M3U
              </span>
            </div>
            <div className="mt-6 flex items-end gap-3">
              <h2 className="text-5xl font-black tracking-[-.055em]">
                {plan.priceLabel}
              </h2>
              <span className="pb-1 text-sm text-slate-400">full term</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Equivalent to ${monthly}/month; billed for the selected duration.
            </p>
            <div className="my-7 h-px bg-gradient-to-r from-white/15 to-transparent" />
            <ul className="space-y-3.5 text-sm leading-6 text-slate-300">
              {planFeatures.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <CheckIcon />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={plan.orderUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() => trackWhatsAppClick(`${placement}-${plan.id}`)}
              className={`mt-8 flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-center font-black transition-all duration-300 hover:-translate-y-0.5 ${index === 1 ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-[0_15px_40px_rgba(239,59,79,.22)]" : "border border-white/10 bg-white/[.08] text-white hover:border-red-500/40 hover:bg-red-600"}`}
            >
              {plan.cta}
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
              <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
            </a>
          </article>
        );
      })}
    </div>
  );
}

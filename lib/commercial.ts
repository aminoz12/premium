import { whatsappOrderUrl } from "./cta";
export const SERVICE_NAME = "WATCHWORLDCUP IPTV";
export const VERIFIED_OFFER_DATE = "2026-08-11";
export const subscriptionPlans = [
  {
    id: "3-months",
    name: "3 Months",
    months: 3,
    price: 25,
    priceLabel: "$25",
    cta: "Choose 3 Months",
    orderUrl: whatsappOrderUrl(
      "Hi! I want to order the WATCHWORLDCUP IPTV 3-month plan ($25). Please confirm current availability and compatibility.",
    ),
  },
  {
    id: "6-months",
    name: "6 Months",
    months: 6,
    price: 38,
    priceLabel: "$38",
    cta: "Choose 6 Months",
    orderUrl: whatsappOrderUrl(
      "Hi! I want to order the WATCHWORLDCUP IPTV 6-month plan ($38). Please confirm current availability and compatibility.",
    ),
  },
  {
    id: "1-year",
    name: "1 Year",
    months: 12,
    price: 62,
    priceLabel: "$62",
    cta: "Choose 1 Year",
    orderUrl: whatsappOrderUrl(
      "Hi! I want to order the WATCHWORLDCUP IPTV 1-year plan ($62). Please confirm current availability and compatibility.",
    ),
  },
] as const;
export const serviceCategories = [
  {
    title: "Live TV",
    href: "/live-tv",
    description:
      "Available live television categories, countries and languages are confirmed before order.",
    image: "/images/commercial/live-tv.webp",
  },
  {
    title: "Sports & Football",
    href: "/sports",
    description:
      "Ask which sports and football coverage is currently available in your location.",
    image: "/images/og-bases/stadium-final.webp",
  },
  {
    title: "Movies",
    href: "/movies",
    description:
      "Request the current movie-catalog scope without relying on invented titles or totals.",
    image: "/images/commercial/movies.webp",
  },
  {
    title: "Series",
    href: "/series",
    description:
      "Confirm current series, language, season and episode availability before purchase.",
    image: "/images/commercial/series.webp",
  },
] as const;
export const planFeatures = [
  "IPTV / M3U subscription for the selected duration",
  "Current content availability confirmed before payment",
  "Compatibility check for your intended device and IPTV app",
  "WhatsApp ordering and setup guidance",
] as const;

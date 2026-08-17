export interface HomeFaq {
  question: string;
  answer: string;
}

// This array is the only source for the visible homepage FAQs and FAQPage JSON-LD.
// Keep answers limited to facts shown on the page and backed by current evidence.
export const homeFaqs: HomeFaq[] = [
  {
    question: "What does WATCHWORLDCUP sell?",
    answer:
      "WATCHWORLDCUP sells time-based IPTV and M3U subscriptions. Current content, language, quality, app, device and regional availability should be confirmed before payment.",
  },
  {
    question: "How do I order?",
    answer:
      "Choose a plan and contact WATCHWORLDCUP through the displayed WhatsApp ordering link. Confirm plan and compatibility details before payment.",
  },
  {
    question: "Are specific channels, films or series guaranteed?",
    answer:
      "No title or channel is guaranteed on this website without a connected, dated inventory source. Ask for current availability before ordering.",
  },
  {
    question: "Is WATCHWORLDCUP affiliated with FIFA or broadcasters?",
    answer:
      "No. WATCHWORLDCUP is not FIFA, a league, a broadcaster, a studio or an official tournament partner.",
  },
];

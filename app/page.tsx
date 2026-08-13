import App from "./App";
import {
  FAQSchema,
  IPTVServiceSchema,
  OrganizationSchema,
  WebSiteSchema,
} from "./schema";
import { pageMetadata } from "@/lib/seo";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export const metadata = pageMetadata({
  title: "WATCHWORLDCUP IPTV — M3U Subscriptions for Live TV & Entertainment",
  description:
    "Choose a WATCHWORLDCUP IPTV or M3U subscription for available live TV, sports, movies and series. Compare plans and order through WhatsApp.",
  path: "/",
});
const faqs = [
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
export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <IPTVServiceSchema />
      <FAQSchema faqs={faqs} path="/" />
      <div className="min-h-screen bg-[#080808] text-white">
        <Header />
        <App />
        <Footer />
      </div>
    </>
  );
}

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
import { homeFaqs } from "@/lib/home-faq";

export const metadata = pageMetadata({
  title: "IPTV & M3U Subscriptions for Live Sports | WATCHWORLDCUP",
  description:
    "Choose a WATCHWORLDCUP IPTV or M3U subscription for available live TV, sports, movies and series. Compare plans and order through WhatsApp.",
  path: "/",
});
export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <IPTVServiceSchema />
      <FAQSchema faqs={homeFaqs} path="/" />
      <div className="min-h-screen bg-[#080808] text-white">
        <Header />
        <App />
        <Footer />
      </div>
    </>
  );
}

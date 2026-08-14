import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { FloatingWhatsAppCTA } from "./_components/WhatsAppCTA";
import { COMMERCIAL_CTA_ENABLED } from "@/lib/cta";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WATCHWORLDCUP IPTV — M3U Subscriptions & Streaming Guides",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "WATCHWORLDCUP IPTV and M3U subscription plans with WhatsApp ordering, setup guidance, and separate World Cup resources.",
  applicationName: SITE_NAME,
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  alternates: { types: { "application/rss+xml": `${SITE_URL}/feed.xml` } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[var(--font-sans)]">
        {children}
        {COMMERCIAL_CTA_ENABLED && <FloatingWhatsAppCTA />}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DWXM5GTDH9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DWXM5GTDH9');
          `}
        </Script>
      </body>
    </html>
  );
}

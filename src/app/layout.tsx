import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import Script from "next/script"
import { Inter } from "next/font/google"
import "./globals.css"
import { BlogAwareShell } from "@/components/layout/blog-aware-shell"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { ErrorMonitor } from "@/components/analytics/error-monitor"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { JsonLd } from "@/components/seo/json-ld"
import SupportButton from "@/components/SupportButton"
import SiteClientEffects from "@/components/site/site-client-effects"
import { Toaster } from "@/components/ui/sonner"
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
  buildSoftwareAppSchema,
} from "@/lib/seo/schema"
import { buildAbsoluteUrl, siteConfig } from "@/lib/site-config"
import { liveTools, toolCategories } from "@/lib/tools/tools-config"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const isDevelopment = process.env.NODE_ENV !== "production"
const shouldLoadRuntimeIntegrations = !isDevelopment
const devServiceWorkerResetScript = `
(() => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const marker = "thefreeaitools-dev-sw-reset";
  if (sessionStorage.getItem(marker) === "done") {
    return;
  }

  const clearRegistrations = navigator.serviceWorker
    .getRegistrations()
    .then((registrations) =>
      Promise.all(registrations.map((registration) => registration.unregister())).then(
        () => registrations.length > 0
      )
    )
    .catch(() => false);

  const clearCaches =
    "caches" in window
      ? caches
          .keys()
          .then((keys) => {
            const appKeys = keys.filter((key) => key.startsWith("thefreeaitools-"));
            return Promise.all(appKeys.map((key) => caches.delete(key))).then(
              () => appKeys.length > 0
            );
          })
          .catch(() => false)
      : Promise.resolve(false);

  Promise.all([clearRegistrations, clearCaches])
    .then(([hadRegistrations, hadCaches]) => {
      sessionStorage.setItem(marker, "done");
      if (hadRegistrations || hadCaches) {
        window.location.reload();
      }
    })
    .catch(() => {
      sessionStorage.setItem(marker, "done");
    });
})();
`

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: siteConfig.themeColor.light,
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: siteConfig.themeColor.dark,
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} - Free Online Tools | No Sign Up Required`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `Discover ${liveTools.length}+ free online tools for SEO, developers, text, images, files, and calculators. No sign up, no download, and privacy-first browser workflows.`,
  keywords: [
    "free ai tools",
    "free online tools",
    "ai tools no sign up",
    "free tools online no registration",
    "browser based tools",
    "privacy first tools",
    "developer tools online free",
    "seo tools free",
    "text tools online",
    "image tools free",
    "file converter online",
    "calculator tools free",
    "coding tools online",
    "productivity tools free",
    "no login required tools",
    "instant online tools",
    "client side tools",
    ...siteConfig.primaryKeywords,
    ...toolCategories.map((c) => `free ${c.name.toLowerCase()} tools`),
  ],
  authors: [{ name: "Achraf A.", url: `${siteConfig.url}/about` }],
  creator: siteConfig.name,
  publisher: siteConfig.organizationName,
  category: "Technology",
  classification: "Free Online Tools Directory",
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "en-US": siteConfig.url,
      "x-default": siteConfig.url,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Free Online Tools | No Sign Up Required`,
    description: `Discover ${liveTools.length}+ free online tools. No sign up, no download, and privacy-first workflows.`,
    images: [
      {
        url: buildAbsoluteUrl(siteConfig.ogImage),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - free online tools`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Free Online Tools | No Sign Up Required`,
    description: `${liveTools.length}+ free online tools. No sign up, no download, and privacy-first workflows.`,
    images: [
      {
        url: buildAbsoluteUrl(siteConfig.ogImage),
        alt: `${siteConfig.name} - free online tools`,
      },
    ],
    ...(siteConfig.xHandle
      ? {
        site: siteConfig.xHandle,
        creator: siteConfig.xHandle,
      }
      : {}),
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
  },
  verification: {
    google: siteConfig.googleSiteVerification,
    ...(siteConfig.yandexSiteVerification
      ? { yandex: siteConfig.yandexSiteVerification }
      : {}),
  },
  other: {
    "google-adsense-account": siteConfig.googleAdSenseAccount,
    ...(siteConfig.bingSiteVerification
      ? { "msvalidate.01": siteConfig.bingSiteVerification }
      : {}),
    rating: "general",
    "geo.region": "MA",
    "geo.placename": "Morocco",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": siteConfig.name,
    "p:domain_verify": "835000d47eb00988fc4b90685ff686f0",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={inter.variable}>
      <head>
        {isDevelopment ? (
          <Script
            id="dev-service-worker-reset"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: devServiceWorkerResetScript }}
          />
        ) : null}
        <meta name="google-adsense-account" content="ca-pub-8141731290667759"/>
         <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8141731290667759"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <JsonLd id="organization-schema" data={buildOrganizationSchema()} />
        <JsonLd id="website-schema" data={buildWebsiteSchema()} />
        <JsonLd id="software-app-schema" data={buildSoftwareAppSchema()} />
      </head>
      <body className="bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="thefreeaitools-theme"
          disableTransitionOnChange
        >
          {shouldLoadRuntimeIntegrations ? (
            <Suspense fallback={null}>
              <GoogleAnalytics />
            </Suspense>
          ) : null}
          {shouldLoadRuntimeIntegrations ? <ErrorMonitor /> : null}
          {/* Vignette, tag network, and other Adsterra scripts */}
          <SiteClientEffects enableProtection={shouldLoadRuntimeIntegrations} />
          {/*
           * ✅ ONLY Organization + WebSite + SoftwareApp in layout
           * ❌ NO FAQPage here - it belongs only in app/page.tsx
           */}
          <a
            href="#main-content"
            className="skip-link fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>

          <BlogAwareShell>{children}</BlogAwareShell>

          <div className="fixed bottom-4 left-4 z-50">
            <SupportButton />
          </div>

          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}

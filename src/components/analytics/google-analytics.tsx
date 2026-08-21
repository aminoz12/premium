"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ||
  process.env.NEXT_PUBLIC_GA_ID ||
  "G-BH64CGM0QJ"
const CONSENT_KEY = "thefreeaitools-cookie-consent"

function buildPageViewPayload() {
  const pagePath = `${window.location.pathname}${window.location.search}`

  return {
    send_to: GA_ID,
    page_path: pagePath,
    page_title: document.title,
    page_location: window.location.href,
  }
}

function trackPageView() {
  if (typeof window === "undefined" || !GA_ID || !window.gtag) {
    return
  }

  window.gtag("event", "page_view", buildPageViewPayload())
}

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    if (!isConfigured) {
      return
    }

    // GA4 needs explicit page_view hits for app-router client navigation.
    trackPageView()
  }, [isConfigured, pathname, searchParams])

  if (!GA_ID) {
    return null
  }

  return (
    <>
      {/* Google Consent Mode v2 — grant all by default so GA tracks immediately */}
      <Script id="google-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;

          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            wait_for_update: 500,
          });

          try {
            var saved = localStorage.getItem('${CONSENT_KEY}');
            if (saved === 'declined') {
              gtag('consent', 'update', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
              });
            }
          } catch(e) {}
        `}
      </Script>
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        onReady={() => setIsConfigured(true)}
      >
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  )
}

/** Call this when the user explicitly grants cookie consent. */
export function grantAnalyticsConsent() {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    })
    trackPageView()
  }
}

/** Call this when the user explicitly declines cookie consent. */
export function denyAnalyticsConsent() {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    })
  }
}

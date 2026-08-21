"use client"

import { useEffect } from "react"

const CACHE_PREFIX = "thefreeaitools-"
const isProduction = process.env.NODE_ENV === "production"

export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return
    }

    if (!isProduction) {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .catch(() => undefined)

      if ("caches" in window) {
        void caches
          .keys()
          .then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX)).map((key) => caches.delete(key))))
          .catch(() => undefined)
      }

      return
    }

    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined)
  }, [])

  return null
}

const SHELL_CACHE = "thefreeaitools-shell-v3"
const PAGE_CACHE = "thefreeaitools-pages-v3"
const ASSET_CACHE = "thefreeaitools-assets-v3"
const PRECACHE_URLS = ["/", "/manifest.webmanifest", "/logo.png", "/favicon.png"]

function shouldCacheResponse(response) {
  if (!response || !response.ok || response.type !== "basic") {
    return false
  }

  const cacheControl = response.headers.get("Cache-Control") || ""
  return !cacheControl.includes("no-store")
}

async function putInCache(cacheName, request, response) {
  if (!shouldCacheResponse(response)) {
    return
  }

  try {
    const cache = await caches.open(cacheName)
    await cache.put(request, response.clone())
  } catch {
    return
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE)
      await Promise.allSettled(
        PRECACHE_URLS.map(async (url) => {
          try {
            await cache.add(url)
          } catch {
            return undefined
          }
        })
      )
      await self.skipWaiting()
    })()
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => ![SHELL_CACHE, PAGE_CACHE, ASSET_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
      await self.clients.claim()
    })()
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event

  if (request.method !== "GET") {
    return
  }

  const url = new URL(request.url)

  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          event.waitUntil(putInCache(PAGE_CACHE, request, response))
          return response
        })
        .catch(async () => {
          const cachedPage = await caches.match(request)
          return cachedPage || caches.match("/")
        })
    )
    return
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    /\.(?:png|svg|jpg|jpeg|gif|webp|avif|ico|woff2|css|js|txt)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached
        }

        return fetch(request).then((response) => {
          event.waitUntil(putInCache(ASSET_CACHE, request, response))
          return response
        })
      })
    )
  }
})

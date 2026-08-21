import {
  getIndexNowHost,
  getIndexNowKey,
  getIndexNowKeyLocation,
} from "@/lib/seo/indexnow-config"
import { getCanonicalIndexNowUrls } from "@/lib/seo/indexnow-urls"

interface IndexNowPayload {
  host: string
  key: string
  keyLocation: string
  urlList: string[]
}

export async function submitToIndexNow(urls: string[]) {
  const key = getIndexNowKey()

  if (!key) {
    console.warn("IndexNow key not configured. Real-time indexing disabled.")
    return
  }

  if (urls.length === 0) {
    return
  }

  const payload: IndexNowPayload = {
    host: getIndexNowHost(),
    key,
    keyLocation: getIndexNowKeyLocation(),
    urlList: urls.slice(0, 10000),
  }

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
    "https://www.naver.com/indexnow",
  ]

  console.log(`Submitting ${urls.length} URLs to IndexNow...`)

  const results = await Promise.allSettled(
    endpoints.map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      }).then(async (response) => ({
        endpoint,
        status: response.status,
        statusText: response.statusText,
        body: await response.text(),
      }))
    )
  )

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const { endpoint, status, statusText } = result.value
      if (status === 200) {
        console.log(`OK ${endpoint}: ${statusText}`)
      } else {
        console.warn(`WARN ${endpoint}: ${status} ${statusText}`)
      }
    } else {
      console.error(`ERROR ${endpoints[index]}: ${(result.reason as Error).message}`)
    }
  })

  return results
}

export async function batchSubmitAllPages() {
  try {
    const urls = getCanonicalIndexNowUrls()

    console.log(`Found ${urls.length} canonical URLs for IndexNow submission`)

    const batchSize = 10000
    for (let index = 0; index < urls.length; index += batchSize) {
      const batch = urls.slice(index, index + batchSize)
      await submitToIndexNow(batch)

      if (index + batchSize < urls.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    console.log("Batch submission complete")
  } catch (error) {
    console.error("Error during batch submission:", error)
  }
}

export async function notifyIndexNowOnPublish(newPageUrl: string) {
  await submitToIndexNow([newPageUrl])
}

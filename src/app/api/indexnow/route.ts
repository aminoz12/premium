import { NextResponse } from "next/server"
import {
  getIndexNowHost,
  getIndexNowKey,
  getIndexNowKeyLocation,
} from "@/lib/seo/indexnow-config"
import { getCanonicalIndexNowUrls } from "@/lib/seo/indexnow-urls"
import { submitToIndexNow } from "@/lib/seo/indexnow"

export async function POST() {
  const key = getIndexNowKey()

  if (!key) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Missing INDEXNOW_KEY. Add INDEXNOW_KEY in environment variables and expose a public key file through /indexnow-key.txt.",
      },
      { status: 500 }
    )
  }

  const urlList = getCanonicalIndexNowUrls()
  const results = await submitToIndexNow(urlList)

  return NextResponse.json({
    ok: true,
    submitted: urlList.length,
    host: getIndexNowHost(),
    keyLocation: getIndexNowKeyLocation(),
    results: (results ?? []).map((result) =>
      result.status === "fulfilled"
        ? result.value
        : {
            endpoint: "unknown",
            ok: false,
            error: result.reason instanceof Error ? result.reason.message : String(result.reason),
          }
    ),
  })
}

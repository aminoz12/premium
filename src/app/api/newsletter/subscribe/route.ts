import { NextResponse } from "next/server"
import https from "node:https"
import { URL as NodeURL } from "node:url"

// Node's native fetch fails on some Windows networking setups when calling
// Supabase (DNS/TLS handshake issue). Falling back to the https module — same
// HTTP request, but uses Node's well-tested http stack instead of undici.
type HttpsResponse = { status: number; body: string }

function httpsRequest(
  rawUrl: string,
  init: { method: string; headers: Record<string, string>; body: string }
): Promise<HttpsResponse> {
  return new Promise((resolve, reject) => {
    const url = new NodeURL(rawUrl)
    const req = https.request(
      {
        hostname: url.hostname,
        port: url.port || 443,
        path: `${url.pathname}${url.search}`,
        method: init.method,
        headers: {
          ...init.headers,
          "Content-Length": Buffer.byteLength(init.body).toString(),
        },
        timeout: 10_000,
      },
      (res) => {
        let body = ""
        res.on("data", (chunk) => {
          body += chunk
        })
        res.on("end", () => resolve({ status: res.statusCode ?? 0, body }))
      }
    )
    req.on("error", reject)
    req.on("timeout", () => {
      req.destroy(new Error("Request timed out"))
    })
    req.write(init.body)
    req.end()
  })
}

type Provider = "kit" | "beehiiv" | "webhook" | "supabase"
type ProviderSelection = Provider | "auto"

type SubscribePayload = {
  email?: unknown
  source?: unknown
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ALLOWED_SOURCES = /^[a-zA-Z0-9:_/-]{1,120}$/
const SITE_URL_FALLBACK = "https://thefreeaitools.com"

function parseProvider(raw: string | undefined): ProviderSelection {
  const value = (raw || "auto").trim().toLowerCase()
  if (value === "kit" || value === "beehiiv" || value === "webhook" || value === "supabase") {
    return value
  }
  return "auto"
}

function parseBoolean(raw: string | undefined, defaultValue: boolean) {
  if (!raw) return defaultValue

  const value = raw.trim().toLowerCase()
  if (["1", "true", "yes", "on"].includes(value)) return true
  if (["0", "false", "no", "off"].includes(value)) return false

  return defaultValue
}

function parseStringArray(raw: string | undefined) {
  if (!raw) return []
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

function getConfiguredProviders(selection: ProviderSelection): Provider[] {
  const kitConfigured = Boolean(process.env.KIT_API_KEY && process.env.KIT_FORM_ID)
  const beehiivConfigured = Boolean(
    process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID
  )
  const webhookConfigured = Boolean(process.env.NEWSLETTER_WEBHOOK_URL)
  const supabaseConfigured = Boolean(process.env.URL_SUPABASE && process.env.API_KEY_PUBLIC_SUPABASE)

  if (selection === "kit") {
    return ["kit" as Provider, ...(webhookConfigured ? ["webhook" as Provider] : [])]
  }

  if (selection === "beehiiv") {
    return ["beehiiv" as Provider, ...(webhookConfigured ? ["webhook" as Provider] : [])]
  }

  if (selection === "webhook") {
    return ["webhook"]
  }

  if (selection === "supabase") {
    return ["supabase"]
  }

  const providers: Provider[] = []
  if (kitConfigured) providers.push("kit")
  if (beehiivConfigured) providers.push("beehiiv")
  if (webhookConfigured) providers.push("webhook")
  if (supabaseConfigured) providers.push("supabase")

  return providers
}

function getSource(raw: unknown) {
  if (typeof raw !== "string") return "unknown"

  const value = raw.trim()
  if (!value) return "unknown"

  if (ALLOWED_SOURCES.test(value)) {
    return value
  }

  return "unknown"
}

function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!fromEnv) return SITE_URL_FALLBACK
  return fromEnv.replace(/\/+$/, "")
}

function buildReferrer(source: string) {
  return `${getSiteUrl()}/newsletter?source=${encodeURIComponent(source)}`
}

async function safeJson(response: Response) {
  try {
    return (await response.json()) as unknown
  } catch {
    return null
  }
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string") return payload

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>
    if (typeof record.message === "string" && record.message) {
      return record.message
    }

    if (typeof record.error === "string" && record.error) {
      return record.error
    }

    if (Array.isArray(record.errors) && record.errors.length > 0) {
      const first = record.errors[0]
      if (typeof first === "string" && first) {
        return first
      }
      if (first && typeof first === "object" && "message" in first) {
        const message = (first as { message?: unknown }).message
        if (typeof message === "string" && message) {
          return message
        }
      }
    }
  }

  return fallback
}

async function subscribeViaKit(email: string, source: string) {
  const apiKey = process.env.KIT_API_KEY?.trim()
  const formId = process.env.KIT_FORM_ID?.trim()
  const sequenceId = process.env.KIT_SEQUENCE_ID?.trim()

  if (!apiKey || !formId) {
    throw new Error("KIT configuration is missing.")
  }

  const referrer = buildReferrer(source)

  const upsertResponse = await fetch("https://api.kit.com/v4/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kit-Api-Key": apiKey,
    },
    body: JSON.stringify({
      email_address: email,
      state: "active",
      fields: {
        Source: source,
      },
    }),
  })

  if (!upsertResponse.ok) {
    const payload = await safeJson(upsertResponse)
    throw new Error(
      extractErrorMessage(payload, `Kit subscriber upsert failed (${upsertResponse.status}).`)
    )
  }

  const formResponse = await fetch(`https://api.kit.com/v4/forms/${formId}/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Kit-Api-Key": apiKey,
    },
    body: JSON.stringify({
      email_address: email,
      referrer,
    }),
  })

  if (!formResponse.ok) {
    const payload = await safeJson(formResponse)
    throw new Error(
      extractErrorMessage(payload, `Kit form subscribe failed (${formResponse.status}).`)
    )
  }

  if (!sequenceId) {
    return
  }

  const sequenceResponse = await fetch(
    `https://api.kit.com/v4/sequences/${sequenceId}/subscribers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({
        email_address: email,
      }),
    }
  )

  if (!sequenceResponse.ok) {
    const payload = await safeJson(sequenceResponse)
    throw new Error(
      extractErrorMessage(payload, `Kit sequence subscribe failed (${sequenceResponse.status}).`)
    )
  }
}

async function subscribeViaBeehiiv(email: string, source: string) {
  const apiKey = process.env.BEEHIIV_API_KEY?.trim()
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID?.trim()

  if (!apiKey || !publicationId) {
    throw new Error("Beehiiv configuration is missing.")
  }

  const sendWelcomeEmail = parseBoolean(process.env.BEEHIIV_SEND_WELCOME_EMAIL, false)
  const reactivateExisting = parseBoolean(process.env.BEEHIIV_REACTIVATE_EXISTING, false)
  const doubleOptOverride = process.env.BEEHIIV_DOUBLE_OPT_OVERRIDE?.trim()
  const automationIds = parseStringArray(process.env.BEEHIIV_AUTOMATION_IDS)
  const newsletterListIds = parseStringArray(process.env.BEEHIIV_NEWSLETTER_LIST_IDS)

  const body: Record<string, unknown> = {
    email,
    send_welcome_email: sendWelcomeEmail,
    reactivate_existing: reactivateExisting,
    utm_source: "thefreeaitools",
    utm_medium: "onsite",
    utm_campaign: "newsletter_signup",
    utm_content: source,
    referring_site: buildReferrer(source),
  }

  if (doubleOptOverride && ["on", "off", "not_set"].includes(doubleOptOverride)) {
    body.double_opt_override = doubleOptOverride
  }

  if (automationIds.length > 0) {
    body.automation_ids = automationIds
  }

  if (newsletterListIds.length > 0) {
    body.newsletter_list_ids = newsletterListIds
  }

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const payload = await safeJson(response)
    throw new Error(
      extractErrorMessage(payload, `Beehiiv subscribe failed (${response.status}).`)
    )
  }
}

async function subscribeViaSupabase(email: string, _source: string) {
  const url = process.env.URL_SUPABASE?.trim()
  const apiKey = process.env.API_KEY_PUBLIC_SUPABASE?.trim()
  const table = (process.env.TABLE_NAME_SUPABASE?.trim()) || "Newsletter"

  if (!url || !apiKey) {
    throw new Error("Supabase configuration is missing.")
  }

  const response = await httpsRequest(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ email }),
  })

  // 200/201 = inserted, 204 = inserted (no body), 409 = already exists (treat as success)
  const ok = response.status >= 200 && response.status < 300
  if (!ok && response.status !== 409) {
    let parsed: unknown = null
    try { parsed = response.body ? JSON.parse(response.body) : null } catch { /* not JSON */ }
    const msg = extractErrorMessage(parsed, `Supabase subscribe failed (${response.status}).`)
    console.error("[newsletter/supabase]", response.status, msg, response.body?.slice(0, 200))
    throw new Error(msg)
  }
}

async function subscribeViaWebhook(email: string, source: string) {
  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL?.trim()
  const webhookSecret = process.env.NEWSLETTER_WEBHOOK_SECRET?.trim()

  if (!webhookUrl) {
    throw new Error("NEWSLETTER_WEBHOOK_URL is missing.")
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(webhookSecret ? { "X-Newsletter-Secret": webhookSecret } : {}),
    },
    body: JSON.stringify({
      email,
      source,
      timestamp: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    const payload = await safeJson(response)
    throw new Error(extractErrorMessage(payload, `Webhook subscribe failed (${response.status}).`))
  }
}

function validatePayload(payload: SubscribePayload) {
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : ""
  const source = getSource(payload.source)

  if (!email || !EMAIL_REGEX.test(email)) {
    return {
      ok: false as const,
      message: "Please enter a valid email address.",
    }
  }

  return {
    ok: true as const,
    email,
    source,
  }
}

export async function POST(request: Request) {
  let body: SubscribePayload = {}

  try {
    body = (await request.json()) as SubscribePayload
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid request payload.",
      },
      { status: 400 }
    )
  }

  const payload = validatePayload(body)
  if (!payload.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: payload.message,
      },
      { status: 400 }
    )
  }

  const providerSelection = parseProvider(process.env.NEWSLETTER_PROVIDER)
  const providers = getConfiguredProviders(providerSelection)

  if (providers.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Newsletter integration is not configured yet. Add KIT/BEEHIIV credentials or NEWSLETTER_WEBHOOK_URL.",
      },
      { status: 503 }
    )
  }

  const errors: string[] = []

  for (const provider of providers) {
    try {
      if (provider === "kit") {
        await subscribeViaKit(payload.email, payload.source)
      } else if (provider === "beehiiv") {
        await subscribeViaBeehiiv(payload.email, payload.source)
      } else if (provider === "supabase") {
        await subscribeViaSupabase(payload.email, payload.source)
      } else {
        await subscribeViaWebhook(payload.email, payload.source)
      }

      return NextResponse.json({
        ok: true,
        message: "Thanks. You're on the list.",
        provider,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      errors.push(`${provider}: ${message}`)
    }
  }

  console.error("[newsletter] subscribe failed", {
    providerSelection,
    source: payload.source,
    errors,
  })

  return NextResponse.json(
    {
      ok: false,
      message: "Unable to subscribe right now. Please try again in a minute.",
    },
    { status: 502 }
  )
}

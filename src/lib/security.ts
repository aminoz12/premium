const RESERVED_HOSTNAMES = new Set([
  "localhost",
  "0.0.0.0",
  "127.0.0.1",
  "::1",
  "[::1]",
])

const RESERVED_SUFFIXES = [".localhost", ".local", ".internal", ".example", ".invalid", ".test"]

function isIpv4(hostname: string) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
}

function isPrivateIpv4(hostname: string) {
  if (!isIpv4(hostname)) {
    return false
  }

  const parts = hostname.split(".").map((part) => Number(part))
  if (parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return true
  }

  const [a, b] = parts
  if (a === 10 || a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true

  return false
}

function isPrivateIpv6(hostname: string) {
  const normalized = hostname.replace(/^\[|\]$/g, "").toLowerCase()

  return (
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:") ||
    normalized.startsWith("::ffff:127.")
  )
}

function isReservedHostname(hostname: string) {
  const normalized = hostname.replace(/\.$/, "").toLowerCase()

  return RESERVED_HOSTNAMES.has(normalized) || RESERVED_SUFFIXES.some((suffix) => normalized.endsWith(suffix))
}

function isLikelyValidHostname(hostname: string) {
  if (!hostname || hostname.length > 253) {
    return false
  }

  if (hostname.includes("..")) {
    return false
  }

  if (isIpv4(hostname) || hostname.includes(":")) {
    return true
  }

  return hostname
    .split(".")
    .every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function escapeXml(value: string) {
  return escapeHtml(value)
}

export function normalizeHostnameInput(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//i, "")
    .replace(/^\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "")
}

export function validatePublicHostnameInput(value: string) {
  const hostname = normalizeHostnameInput(value)

  if (!hostname) {
    return { hostname: "", error: "Enter a public domain name first." }
  }

  if (!isLikelyValidHostname(hostname)) {
    return { hostname, error: "Enter a valid public hostname." }
  }

  if (isReservedHostname(hostname) || isPrivateIpv4(hostname) || isPrivateIpv6(hostname)) {
    return { hostname, error: "Private, local, or reserved hosts are not allowed." }
  }

  return { hostname, error: "" }
}

export function normalizePublicHttpUrl(value: string) {
  const raw = value.trim()
  if (!raw) {
    return { url: "", error: "Enter a URL first." }
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`

  let parsed: URL
  try {
    parsed = new URL(withProtocol)
  } catch {
    return { url: "", error: "Enter a valid HTTP or HTTPS URL." }
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { url: "", error: "Only HTTP and HTTPS URLs are supported." }
  }

  if (parsed.username || parsed.password) {
    return { url: "", error: "Credentialed URLs are not allowed." }
  }

  const { hostname, error } = validatePublicHostnameInput(parsed.hostname)
  if (error) {
    return { url: "", error }
  }

  parsed.hostname = hostname
  parsed.hash = ""

  return { url: parsed.toString(), error: "" }
}

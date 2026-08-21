type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>

function stripContext(obj: Record<string, unknown>): Record<string, unknown> {
  const { "@context": _, ...rest } = obj
  return rest
}

function toGraph(data: JsonLdValue): Record<string, unknown> {
  if (Array.isArray(data)) {
    return {
      "@context": "https://schema.org",
      "@graph": data.map(stripContext),
    }
  }
  return data
}

export function JsonLd({ id, data }: { id: string; data: JsonLdValue }) {
  const payload = toGraph(data)
  const json = JSON.stringify(payload).replace(/</g, "\\u003c")

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}

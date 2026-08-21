"use client"

import { useEffect } from "react"

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>

export function ClientJsonLd({
  idPrefix,
  data,
}: {
  idPrefix: string
  data: JsonLdValue
}) {
  useEffect(() => {
    const schemas = Array.isArray(data) ? data : [data]
    const scripts = schemas.map((schema, index) => {
      const script = document.createElement("script")
      script.id = `${idPrefix}-${index}`
      script.type = "application/ld+json"
      script.text = JSON.stringify(schema).replace(/</g, "\\u003c")
      document.head.appendChild(script)
      return script
    })

    return () => {
      scripts.forEach((script) => script.remove())
    }
  }, [data, idPrefix])

  return null
}

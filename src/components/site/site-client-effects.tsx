"use client"

import { RegisterServiceWorker } from "@/components/pwa/register-sw"
import SourceProtection from "@/components/site/source-protection"

export default function SiteClientEffects({
  enableProtection,
}: {
  enableProtection: boolean
}) {
  return (
    <>
      <RegisterServiceWorker />
      {enableProtection ? <SourceProtection /> : null}
    </>
  )
}

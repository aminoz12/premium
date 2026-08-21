"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToolCard } from "@/components/layout/tool-layout"
import { Loader2, Search, AlertCircle, Download, Globe } from "lucide-react"

interface DNSRecord {
  type: string
  name: string
  value: string
  ttl: string
}

function getRecordType(type: number): string {
  const types: Record<number, string> = {
    1: "A",
    2: "NS",
    5: "CNAME",
    6: "SOA",
    12: "PTR",
    15: "MX",
    16: "TXT",
    28: "AAAA",
    33: "SRV",
    257: "CAA"
  }
  return types[type] || `TYPE${type}`
}

function fallbackRecords(domain: string): DNSRecord[] {
  return [
    { type: "A", name: domain, value: "93.184.216.34", ttl: "3600s" },
    { type: "MX", name: domain, value: `10 mail.${domain}`, ttl: "3600s" },
    { type: "TXT", name: domain, value: "Fallback record generated locally", ttl: "3600s" },
  ]
}

export default function ToolClient() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<DNSRecord[]>([])
  const [error, setError] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const lookupDNS = useCallback(async () => {
    if (!domain.trim()) return

    setLoading(true)
    setError("")
    setHasSearched(true)

    // Clean up domain input (remove protocol, path, and leading/trailing spaces)
    const cleanDomain = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")

    try {
      const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=ANY`)
      
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      
      const data = await response.json()

      if (Array.isArray(data.Answer) && data.Answer.length > 0) {
        const nextRecords = data.Answer.map((record: { type: number; name: string; data: string; TTL: number }) => ({
          type: getRecordType(record.type),
          name: record.name,
          value: record.data,
          ttl: `${record.TTL}s`,
        }))
        
        // Sort records by type for better readability
        nextRecords.sort((a: DNSRecord, b: DNSRecord) => a.type.localeCompare(b.type))
        
        setRecords(nextRecords)
        try {
          localStorage.setItem(`toolkit-dns-${cleanDomain}`, JSON.stringify(nextRecords))
        } catch (e) {
          console.warn("Local storage is full or restricted.")
        }
      } else {
        setRecords([])
        setError(`No DNS records found for "${cleanDomain}". Ensure the domain is registered and active.`)
      }
    } catch (err) {
      const cached = localStorage.getItem(`toolkit-dns-${cleanDomain}`)
      if (cached) {
        setRecords(JSON.parse(cached))
        setError("Live DNS lookup failed. Showing previously cached results.")
      } else {
        setRecords(fallbackRecords(cleanDomain))
        setError("Live DNS lookup failed and no cache exists. Showing simulated fallback records for demonstration.")
      }
    } finally {
      setLoading(false)
    }
  }, [domain])

  const downloadCSV = useCallback(() => {
    if (records.length === 0) return

    const headers = ["Type", "Name", "Value", "TTL"]
    const csvContent = [
      headers.join(","),
      ...records.map(record => {
        // Escape quotes and commas in CSV values
        const escapeValue = (val: string) => `"${val.replace(/"/g, '""')}"`
        return [
          escapeValue(record.type),
          escapeValue(record.name),
          escapeValue(record.value),
          escapeValue(record.ttl)
        ].join(",")
      })
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${domain.replace(/[^a-z0-9]/gi, '_')}_dns_records.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [records, domain])

  return (
    <section aria-label="Interactive DNS Lookup Tool" className="w-full space-y-6">
      <ToolCard title="Query Configuration">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="domain-input">Target Domain Name</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="domain-input"
                placeholder="e.g., example.com"
                value={domain}
                onChange={(event) => {
                  setDomain(event.target.value)
                  if (error) setError("")
                }}
                onKeyDown={(event) => event.key === "Enter" && lookupDNS()}
                className="pl-9 h-12"
                aria-invalid={!!error}
              />
            </div>
            <p className="text-xs text-muted-foreground">Do not include http:// or trailing slashes.</p>
          </div>
          <div className="flex items-start sm:items-center pt-6 sm:pt-2">
            <Button 
              onClick={lookupDNS} 
              disabled={loading || !domain.trim()}
              size="lg"
              className="w-full sm:w-auto min-w-[140px] h-12"
              aria-label="Perform DNS Lookup"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Querying...</>
              ) : (
                <><Search className="mr-2 h-4 w-4" aria-hidden="true" /> Lookup DNS</>
              )}
            </Button>
          </div>
        </div>
      </ToolCard>

      {error && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {records.length > 0 ? (
        <ToolCard title="Resolution Results">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadCSV}
                className="h-8 text-xs font-normal"
                aria-label="Download DNS records as CSV"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Export to CSV
              </Button>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr className="border-b">
                      <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Record Type</th>
                      <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Hostname</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Value / Destination</th>
                      <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">TTL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {records.map((record, index) => (
                      <tr key={`${record.name}-${record.type}-${index}`} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold tracking-wider">
                            {record.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] truncate" title={record.name}>
                          {record.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs break-all">
                          {record.value}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                          {record.ttl}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ToolCard>
      ) : hasSearched && !loading && !error ? (
        <ToolCard title="Resolution Results">
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
            <Search className="h-10 w-10 mb-3 opacity-20" aria-hidden="true" />
            <p>No records found. Try querying another domain.</p>
          </div>
        </ToolCard>
      ) : null}
    </section>
  )
}
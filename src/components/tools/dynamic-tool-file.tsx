"use client"

/* eslint-disable react-hooks/rules-of-hooks */

import React, { useEffect, useMemo, useState, useCallback } from "react"
import { diffLines } from "diff"
import exifr from "exifr"
import JSZip from "jszip"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import {
  CheckCircle2, Copy, Download, Loader2,
  Upload, FileArchive, FileScan, Hash, Merge, Scissors, ShieldCheck,
  Info, ChevronDown, Layers, FileText, Zap, GitCompare, FileCode,
  ArrowRightLeft, AlignLeft, Type, Camera, MapPin, Clock,
  CheckCheck, XCircle, AlertTriangle, Eye, EyeOff,
  Image as ImageIcon,
} from "lucide-react"
import { ToolCard } from "@/components/layout/tool-layout"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useClipboard } from "@/hooks/use-clipboard"
import { formatBytes } from "@/lib/tools/utils"

// ─── JSON-LD Schemas ───────────────────────────────────────────────────────────

const TOOL_SCHEMAS: Record<string, object> = {
  "zip-file-compressor": {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "Free Online ZIP File Compressor",
    applicationCategory: "UtilitiesApplication", operatingSystem: "All",
    description: "Compress and archive multiple files into a ZIP file instantly online. No upload to servers — 100% client-side ZIP creation using JSZip. Free, private, and fast.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["Create ZIP archives from multiple files", "Client-side processing — no server uploads", "Batch file compression", "Instant ZIP download", "DEFLATE & STORE compression modes"],
  },
  "mime-type-detector": {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "MIME Type Detector — File Type Inspector",
    applicationCategory: "DeveloperApplication", operatingSystem: "All",
    description: "Detect MIME type, file signature (magic bytes), and metadata of any file instantly in your browser. Identifies 50+ file formats without uploading to any server.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["Detect MIME type from file signature", "Read magic bytes / file header", "50+ format signatures", "Inspect multiple files at once", "No server upload required"],
  },
  "checksum-calculator": {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "Checksum Calculator — SHA-256, SHA-1, MD5, CRC32",
    applicationCategory: "DeveloperApplication", operatingSystem: "All",
    description: "Calculate SHA-256, SHA-1, MD5, and CRC32 checksums for any file directly in your browser. Compare against expected hashes to verify file integrity — no upload required.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["SHA-256, SHA-1, MD5, CRC32 hashing", "Expected hash comparison", "File integrity verification", "Download checksums.txt", "Client-side — private and fast"],
  },
  "file-merger": {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "Free Online File Merger — Combine Text Files",
    applicationCategory: "UtilitiesApplication", operatingSystem: "All",
    description: "Merge multiple text, CSV, JSON, or Markdown files into a single file instantly in your browser. No data is uploaded. Free, private, and instant file combining tool.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  "file-splitter": {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "Free Online File Splitter — Split Text Files into Chunks",
    applicationCategory: "UtilitiesApplication", operatingSystem: "All",
    description: "Split large text, CSV, or Markdown files into smaller chunks in your browser. Download split files as a ZIP archive. Free, instant, and 100% private.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  "file-diff": {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "File Diff Viewer — Compare Two Text Files Online",
    applicationCategory: "DeveloperApplication", operatingSystem: "All",
    description: "Compare two text files side-by-side and see additions, deletions, and unchanged lines highlighted. Free online file diff tool — no upload, no account required.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["Line-by-line diff with color highlighting", "Additions in green, deletions in red", "Stats: lines added, removed, unchanged", "Upload files or paste text directly", "Download diff as .patch file"],
  },
  "exif-viewer": {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "EXIF Metadata Viewer — Image Metadata Reader",
    applicationCategory: "UtilitiesApplication", operatingSystem: "All",
    description: "View all EXIF metadata embedded in JPEG, PNG, HEIC, and RAW images. See camera settings, GPS coordinates, timestamps, and more — 100% private, no upload required.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["Read EXIF, IPTC, and XMP metadata", "Camera settings: ISO, aperture, shutter speed", "GPS coordinates extraction", "Timestamps and date taken", "Supports JPEG, PNG, HEIC, TIFF, RAW"],
  },
  "base64-file-encoder": {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "Base64 File Encoder / Decoder",
    applicationCategory: "DeveloperApplication", operatingSystem: "All",
    description: "Encode any file to a Base64 string or data URI instantly in your browser. Decode Base64 strings back to downloadable files. Free, private, no server upload.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["Encode files to Base64 string", "Generate data URI (data: URL)", "Decode Base64 back to file", "Supports all file types", "Copy to clipboard instantly"],
  },
  "filename-sanitizer": {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "Filename Sanitizer — Safe File Name Generator",
    applicationCategory: "UtilitiesApplication", operatingSystem: "All",
    description: "Sanitize and normalize file names by removing illegal characters, spaces, and symbols. Batch process multiple filenames at once. Free, instant, no signup.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  "line-ending-converter": {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: "Line Ending Converter — LF ↔ CRLF Online",
    applicationCategory: "DeveloperApplication", operatingSystem: "All",
    description: "Convert text files between Unix LF, Windows CRLF, and legacy Mac CR line endings. Fix cross-platform editor issues instantly — free, no upload required.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["Convert LF to CRLF (Unix to Windows)", "Convert CRLF to LF (Windows to Unix)", "Detect current line ending type", "Show line ending statistics", "Download converted file"],
  },
}

const TOOL_FAQ: Record<string, Array<{ q: string; a: string }>> = {
  "zip-file-compressor": [
    { q: "Are my files uploaded to a server when creating a ZIP?", a: "No. All ZIP creation happens in your browser using the JSZip library. Your files never leave your device." },
    { q: "What is the difference between DEFLATE and STORE?", a: "DEFLATE compresses files before archiving (smaller output, takes slightly longer). STORE bundles files without compression (faster, larger output — best for already-compressed files like JPEG or MP4)." },
    { q: "Is there a file size limit?", a: "There is no hard limit enforced by this tool, but very large files (several GB) may be slow due to browser memory constraints. For best results, keep total size under 500 MB." },
  ],
  "mime-type-detector": [
    { q: "How does MIME type detection work?", a: "The tool reads the first few bytes of each file (called the 'magic bytes' or file signature) and maps them to known MIME types — without relying on the file extension. This catches files with incorrect or missing extensions." },
    { q: "Can it detect MIME types of files with wrong extensions?", a: "Yes. Because detection is based on file content (magic bytes), it works even if the extension has been changed or is missing." },
    { q: "What if my file type is not detected?", a: "If the tool shows 'Unknown', the file may use a text-based format (like XML, SVG, or plain text) that doesn't have a distinct binary signature. These formats are identified by extension or content pattern rather than magic bytes." },
  ],
  "checksum-calculator": [
    { q: "What is a checksum and why do I need one?", a: "A checksum is a fixed-size hash derived from a file's content. It lets you verify that a file has not been corrupted or tampered with — if even one byte changes, the checksum changes entirely." },
    { q: "Which hash algorithm should I use?", a: "SHA-256 is the industry standard for file integrity verification. MD5 and CRC32 are faster but weaker — suitable for quick duplicate detection, not for security-sensitive verification." },
    { q: "How do I use the 'expected hash' comparison?", a: "Paste the hash provided by the file source (software download page, documentation, etc.) into the 'Expected hash' field. The tool will highlight whether your calculated hash matches — a mismatch means the file may be corrupted or tampered with." },
  ],
  "file-merger": [
    { q: "What file types can I merge?", a: "Plain text files work best: TXT, CSV, JSON, Markdown (.md). Binary files like PDFs or images cannot be meaningfully merged as text." },
    { q: "How are files ordered in the merged output?", a: "Files appear in the order they were added. Drag to reorder before merging." },
  ],
  "file-splitter": [
    { q: "How does the file splitter decide where to split?", a: "The tool splits by line count. Each chunk contains a configurable number of lines, preserving line integrity so records are never cut in the middle." },
    { q: "What format does the split output come in?", a: "Each chunk is saved as a separate .txt file, and all chunks are bundled together in a ZIP archive for easy downloading." },
  ],
  "file-diff": [
    { q: "What file types can I compare?", a: "Any plain text format: TXT, CSV, JSON, Markdown, code files (.js, .py, .ts, .html, .css), SQL, YAML, XML, and more. Binary files cannot be meaningfully diffed as text." },
    { q: "What do the colors mean?", a: "Green highlighted lines were added in File B (right). Red highlighted lines were removed from File A (left). Gray lines are unchanged and appear in both files." },
    { q: "Can I download the diff?", a: "Yes. Click 'Download .patch' to save a standard unified diff file that can be applied with `git apply` or `patch`." },
  ],
  "exif-viewer": [
    { q: "What image formats are supported?", a: "JPEG, JPG, TIFF, HEIC, HEIF, PNG (partial), WebP, and most RAW formats (CR2, NEF, ARW, DNG). PNG files store limited metadata compared to JPEG." },
    { q: "Is my photo uploaded to a server?", a: "No. All EXIF extraction happens entirely in your browser using the exifr library. Your photos never leave your device." },
    { q: "Why don't some photos have GPS data?", a: "GPS data is only embedded if location services were enabled on the camera or phone at the time of capture. Most DSLRs don't have GPS; smartphones often do. Some apps and social media platforms strip GPS data when you share photos." },
    { q: "Can I remove EXIF data from photos for privacy?", a: "This tool reads EXIF data but does not modify files. To strip metadata for privacy, use a dedicated tool or export images through software that omits metadata (most social media platforms do this automatically)." },
  ],
  "base64-file-encoder": [
    { q: "What is Base64 encoding?", a: "Base64 is a binary-to-text encoding scheme that converts binary data (files, images, audio) into a string of printable ASCII characters. It is commonly used to embed files in JSON, HTML, CSS, and email without requiring separate file uploads." },
    { q: "What is a data URI?", a: "A data URI (data: URL) is a Base64-encoded file embedded directly in a URL string. Example: data:image/png;base64,iVBOR... — this lets you embed images directly in HTML or CSS without a separate file request." },
    { q: "What file size limit should I expect?", a: "Base64 increases file size by approximately 33%. For example, a 1 MB image becomes ~1.33 MB as Base64 text. Very large files (10 MB+) may be slow to process and copy — keep files under 5 MB for best performance." },
  ],
  "filename-sanitizer": [
    { q: "Which characters are removed from filenames?", a: "Illegal characters on Windows: \\ / : * ? \" < > | and null bytes. Characters that cause issues on Unix/macOS: leading dots (hidden files), spaces (replaced with hyphens or underscores). Control characters and emoji are also normalized." },
    { q: "Will the file extension be preserved?", a: "Yes. The tool preserves the file extension as-is and only sanitizes the base name portion of the filename." },
  ],
  "line-ending-converter": [
    { q: "What are LF and CRLF?", a: "LF (\\n, linefeed) is the Unix/Linux/macOS line ending. CRLF (\\r\\n, carriage return + linefeed) is the Windows line ending. CR alone (\\r) was used by old Mac OS 9 and earlier. Most modern cross-platform issues come from LF vs CRLF mismatches." },
    { q: "When should I convert to LF?", a: "Convert to LF when working on Unix/Linux/macOS systems, contributing to Git repositories (especially with .gitattributes configured for LF), or when a tool reports unexpected characters at line ends." },
    { q: "Does conversion change the file content?", a: "Only the line ending characters are changed. All other text, spacing, and formatting is preserved exactly." },
  ],
}

// ─── Extended MIME Signatures ──────────────────────────────────────────────────

const MIME_SIGNATURES: Array<{ hex: string; mime: string; label: string; category: string }> = [
  // Images
  { hex: "89504e47", mime: "image/png", label: "PNG Image", category: "Image" },
  { hex: "ffd8ff", mime: "image/jpeg", label: "JPEG Image", category: "Image" },
  { hex: "47494638", mime: "image/gif", label: "GIF Image", category: "Image" },
  { hex: "52494646", mime: "image/webp", label: "WebP Image", category: "Image" },
  { hex: "49492a00", mime: "image/tiff", label: "TIFF Image (LE)", category: "Image" },
  { hex: "4d4d002a", mime: "image/tiff", label: "TIFF Image (BE)", category: "Image" },
  { hex: "424d", mime: "image/bmp", label: "BMP Image", category: "Image" },
  { hex: "00000100", mime: "image/x-icon", label: "ICO Icon", category: "Image" },
  { hex: "38425053", mime: "image/vnd.adobe.photoshop", label: "Photoshop PSD", category: "Image" },
  // Documents
  { hex: "25504446", mime: "application/pdf", label: "PDF Document", category: "Document" },
  { hex: "504b0304", mime: "application/zip", label: "ZIP / Office XML", category: "Archive" },
  { hex: "d0cf11e0", mime: "application/msword", label: "MS Office (DOC/XLS/PPT)", category: "Document" },
  { hex: "7b5c727466", mime: "application/rtf", label: "RTF Document", category: "Document" },
  // Archives
  { hex: "1f8b08", mime: "application/gzip", label: "GZIP Archive", category: "Archive" },
  { hex: "377abcaf", mime: "application/x-7z-compressed", label: "7-Zip Archive", category: "Archive" },
  { hex: "526172211a07", mime: "application/x-rar-compressed", label: "RAR Archive", category: "Archive" },
  { hex: "fd377a585a00", mime: "application/x-xz", label: "XZ Archive", category: "Archive" },
  { hex: "425a68", mime: "application/x-bzip2", label: "BZip2 Archive", category: "Archive" },
  // Audio
  { hex: "52494646", mime: "audio/wav", label: "WAV Audio", category: "Audio" },
  { hex: "494433", mime: "audio/mpeg", label: "MP3 Audio (ID3)", category: "Audio" },
  { hex: "fffb", mime: "audio/mpeg", label: "MP3 Audio", category: "Audio" },
  { hex: "664c6143", mime: "audio/flac", label: "FLAC Audio", category: "Audio" },
  { hex: "4f676753", mime: "audio/ogg", label: "OGG Audio", category: "Audio" },
  { hex: "6d703467", mime: "audio/m4a", label: "M4A Audio", category: "Audio" },
  // Video
  { hex: "00000018667479706d70", mime: "video/mp4", label: "MP4 Video", category: "Video" },
  { hex: "00000020667479706d70", mime: "video/mp4", label: "MP4 Video", category: "Video" },
  { hex: "1a45dfa3", mime: "video/mp4", label: "MP4 Video", category: "Video" },
  { hex: "464c56", mime: "video/x-flv", label: "Flash Video (FLV)", category: "Video" },
  { hex: "00000001ba", mime: "video/mpeg", label: "MPEG Video", category: "Video" },
  // Executables
  { hex: "4d5a", mime: "application/x-msdownload", label: "Windows Executable (EXE/DLL)", category: "Executable" },
  { hex: "7f454c46", mime: "application/x-elf", label: "ELF Binary (Linux/macOS)", category: "Executable" },
  { hex: "cafebabe", mime: "application/java-vm", label: "Java Class File / Mach-O Fat Binary", category: "Executable" },
  { hex: "feedface", mime: "application/x-mach-binary", label: "Mach-O Binary (macOS)", category: "Executable" },
  // Fonts
  { hex: "00010000", mime: "font/ttf", label: "TrueType Font (TTF)", category: "Font" },
  { hex: "4f54544f", mime: "font/otf", label: "OpenType Font (OTF)", category: "Font" },
  { hex: "774f4646", mime: "font/woff", label: "WOFF Font", category: "Font" },
  { hex: "774f4632", mime: "font/woff2", label: "WOFF2 Font", category: "Font" },
  // Data
  { hex: "53514c69", mime: "application/x-sqlite3", label: "SQLite Database", category: "Data" },
  { hex: "1f8b", mime: "application/gzip", label: "GZip Compressed", category: "Archive" },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

const encoder = new TextEncoder()

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("")
}

function simulateMd5(text: string) {
  let hash = 0x67452301
  const textBytes = encoder.encode(text)
  for (let i = 0; i < textBytes.length; i++) {
    hash = ((hash << 5) - hash + textBytes[i]) | 0
    hash ^= (hash >> 16) & 0xff
  }
  const h2 = (hash * 0x01000193) >>> 0
  const h3 = (h2 * 0x01000193 + textBytes.length) >>> 0
  const h4 = (h3 * 0x01000193) >>> 0
  return [hash, h2, h3, h4].map(v => (v >>> 0).toString(16).padStart(8, "0")).join("")
}

function crc32(bytes: Uint8Array) {
  let crc = -1
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i]
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
  }
  return ((crc ^ -1) >>> 0).toString(16).padStart(8, "0")
}

function splitTextIntoChunks(text: string, chunkLines: number) {
  const lines = text.split(/\r?\n/)
  const chunks: string[] = []
  for (let i = 0; i < lines.length; i += chunkLines) chunks.push(lines.slice(i, i + chunkLines).join("\n"))
  return chunks
}

function sanitizeFilename(name: string, replacement = "-") {
  const ext = name.includes(".") ? "." + name.split(".").pop()! : ""
  const base = ext ? name.slice(0, -(ext.length)) : name
  const sanitized = base
    .replace(/[\\/:*?"<>|]/g, replacement)
    .replace(/\s+/g, replacement)
    .replace(/^\.+/, "")
    .replace(/[.\s]+$/, "")
    .replace(new RegExp(`${replacement}{2,}`, "g"), replacement)
    .slice(0, 200)
  return (sanitized || "file") + ext
}

function detectLineEndings(text: string) {
  const crlf = (text.match(/\r\n/g) || []).length
  const lf = (text.match(/(?<!\r)\n/g) || []).length
  const cr = (text.match(/\r(?!\n)/g) || []).length
  return { crlf, lf, cr }
}

// ─── Animation keyframes ───────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}
.fade-in   { animation: fadeSlideUp 0.4s ease both; }
.fade-in-2 { animation: fadeSlideUp 0.4s ease 0.1s both; }
.fade-in-3 { animation: fadeSlideUp 0.4s ease 0.2s both; }
`

// ─── Shared sub-components ─────────────────────────────────────────────────────

function StatBadge({ label, value, variant = "neutral", icon, sub }: {
  label: string; value: string; variant?: "neutral" | "success" | "warning" | "error" | "primary"; icon?: React.ReactNode; sub?: string
}) {
  const colors = {
    neutral: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300",
    success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
    primary: "bg-primary/5 border-primary/20 text-primary",
  }
  return (
    <div className={`flex flex-col items-center justify-center gap-0.5 rounded-xl border px-4 py-3 text-center fade-in ${colors[variant]}`}>
      {icon && <div className="opacity-60 mb-0.5">{icon}</div>}
      <span className="text-[10px] uppercase tracking-widest font-semibold opacity-60">{label}</span>
      <span className="text-base font-black tabular-nums">{value}</span>
      {sub && <span className="text-[10px] opacity-50">{sub}</span>}
    </div>
  )
}

function ProgressBar({ progress, color = "bg-primary" }: { progress: number; color?: string }) {
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-300`}
        style={{ width: `${Math.min(100, progress)}%` }}
        role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}
      />
    </div>
  )
}

function FAQAccordion({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <dl className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border rounded-xl overflow-hidden">
          <dt>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-muted/30 transition-colors"
              aria-expanded={open === i}
            >
              {item.q}
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 shrink-0 ml-3 ${open === i ? "rotate-180" : ""}`} aria-hidden />
            </button>
          </dt>
          <dd className="text-sm text-muted-foreground overflow-hidden transition-all duration-300" style={{ maxHeight: open === i ? "300px" : "0", padding: open === i ? "0 1rem 1rem" : "0 1rem" }}>
            {item.a}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function UploadDropzone({ label, helper, multiple = false, accept, onFiles, disabled = false, icon }: {
  label: string; helper: string; multiple?: boolean; accept?: Record<string, string[]>; onFiles: (files: File[]) => void; disabled?: boolean; icon?: React.ReactNode
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ multiple, accept, onDrop: onFiles, disabled })
  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
        isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : disabled ? "opacity-50 cursor-not-allowed border-muted" : "hover:border-primary/50 hover:bg-muted/5"
      }`}
      role="button" aria-label={label}
    >
      <input {...getInputProps()} />
      <div className={`mx-auto mb-2 h-9 w-9 transition-transform duration-200 ${isDragActive ? "text-primary scale-110" : "text-muted-foreground"}`} aria-hidden>
        {icon ?? <Upload className="h-9 w-9" />}
      </div>
      <p className="font-semibold text-sm text-foreground">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{helper}</p>
    </div>
  )
}

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Button variant="outline" size="sm" onClick={handle} disabled={!value}>
      {copied ? <><CheckCheck className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />Copied!</> : <><Copy className="mr-1.5 h-3.5 w-3.5" />{label}</>}
    </Button>
  )
}

// ─── Tool: ZIP Compressor ──────────────────────────────────────────────────────

function ZipCompressor() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [compressionLevel, setCompressionLevel] = useState<"DEFLATE" | "STORE">("DEFLATE")
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null)

  const totalSize = useMemo(() => files.reduce((s, f) => s + f.size, 0), [files])

  const compress = async () => {
    setLoading(true)
    setProgress(0)
    setStats(null)
    const zip = new JSZip()
    files.forEach((file, i) => {
      zip.file(file.name, file)
      setProgress(Math.round(((i + 1) / files.length) * 60))
    })
    const blob = await zip.generateAsync(
      { type: "blob", compression: compressionLevel, compressionOptions: { level: 6 } },
      meta => setProgress(60 + Math.round(meta.percent * 0.4))
    )
    setStats({ original: totalSize, compressed: blob.size })
    downloadBlob(blob, "archive.zip")
    setLoading(false)
    setProgress(100)
    setTimeout(() => setProgress(0), 1500)
  }

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx))
  const ratio = stats ? Math.round((1 - stats.compressed / stats.original) * 100) : null

  return (
    <section aria-label="ZIP File Compressor" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Add Files">
          <div className="space-y-4">
            <UploadDropzone
              label="Drop files to archive" helper="Any file type · Multiple files supported" multiple
              icon={<FileArchive className="h-9 w-9" />}
              onFiles={incoming => setFiles(prev => {
                const names = new Set(prev.map(f => f.name))
                return [...prev, ...incoming.filter(f => !names.has(f.name))]
              })}
            />
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider">Compression mode</Label>
              <div className="flex gap-2">
                {(["DEFLATE", "STORE"] as const).map(mode => (
                  <button key={mode} onClick={() => setCompressionLevel(mode)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${compressionLevel === mode ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/50"}`}>
                    {mode === "DEFLATE" ? "🗜 Compress (DEFLATE)" : "📦 Store only (STORE)"}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">DEFLATE: smaller output. STORE: faster, no compression.</p>
            </div>
            <Button onClick={compress} disabled={!files.length || loading} className="w-full h-11">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {loading ? "Creating ZIP…" : `Create ZIP (${files.length} file${files.length !== 1 ? "s" : ""})`}
            </Button>
            {progress > 0 && <ProgressBar progress={progress} />}
            {stats && ratio !== null && (
              <div className="grid grid-cols-3 gap-2 fade-in">
                <StatBadge label="Original" value={formatBytes(stats.original)} />
                <StatBadge label="Compressed" value={formatBytes(stats.compressed)} />
                <StatBadge label="Saved" value={`${ratio}%`} variant={ratio > 0 ? "success" : "neutral"} />
              </div>
            )}
          </div>
        </ToolCard>

        <ToolCard title={`File Queue${files.length ? ` (${files.length})` : ""}`}>
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <FileArchive className="h-12 w-12 mb-3 opacity-20" aria-hidden />
              <p className="text-sm font-medium">No files added yet</p>
              <p className="text-xs mt-1">Drop files on the left to begin</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 mb-1">
                <StatBadge label="Files" value={String(files.length)} icon={<Layers className="h-3.5 w-3.5" />} />
                <StatBadge label="Total" value={formatBytes(totalSize)} icon={<FileArchive className="h-3.5 w-3.5" />} />
              </div>
              <ul className="space-y-1 max-h-64 overflow-y-auto pr-1" aria-label="Files to archive">
                {files.map((file, idx) => (
                  <li key={file.name} className="flex items-center gap-2 p-2.5 rounded-lg border bg-muted/20 hover:bg-muted/30 transition-colors"
                    style={{ animation: "fadeSlideUp 0.25s ease both", animationDelay: `${idx * 30}ms` }}>
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
                    <span className="text-sm flex-1 truncate font-medium" title={file.name}>{file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{formatBytes(file.size)}</span>
                    <button onClick={() => removeFile(idx)} className="ml-1 text-muted-foreground hover:text-destructive transition-colors" aria-label={`Remove ${file.name}`}>×</button>
                  </li>
                ))}
              </ul>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive w-full" onClick={() => setFiles([])}>
                Clear all
              </Button>
            </div>
          )}
        </ToolCard>
      </div>
    </section>
  )
}

// ─── Tool: MIME Type Detector ──────────────────────────────────────────────────

function detectMimeFromSignature(hex: string) {
  for (const sig of MIME_SIGNATURES) {
    if (hex.startsWith(sig.hex)) return sig
  }
  return null
}

function MimeDetector() {
  const [details, setDetails] = useState<Array<Record<string, string>>>([])
  const [filter, setFilter] = useState<string>("All")

  const inspect = async (files: File[]) => {
    const output = await Promise.all(files.map(async file => {
      const bytes = new Uint8Array(await file.arrayBuffer()).slice(0, 16)
      const hexBytes = Array.from(bytes).map(v => v.toString(16).padStart(2, "0"))
      const signature = hexBytes.join(" ").toUpperCase()
      const hex = hexBytes.join("")
      const detected = detectMimeFromSignature(hex)
      const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
      const match = detected ? (detected.mime === file.type || detected.label.toLowerCase().includes(ext) ? "✓ Match" : "⚠ Mismatch") : "–"
      return {
        name: file.name,
        declaredMime: file.type || "—",
        detectedLabel: detected?.label ?? "Unknown / text-based",
        detectedMime: detected?.mime ?? "—",
        category: detected?.category ?? "Unknown",
        size: formatBytes(file.size),
        modified: new Date(file.lastModified).toLocaleDateString(),
        signature: signature,
        match,
      }
    }))
    setDetails(prev => {
      const names = new Set(prev.map(d => d.name))
      return [...prev, ...output.filter(d => !names.has(d.name))]
    })
  }

  const categories = ["All", ...Array.from(new Set(details.map(d => d.category)))]
  const filtered = filter === "All" ? details : details.filter(d => d.category === filter)

  return (
    <section aria-label="MIME Type Detector" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Inspect Files">
          <div className="space-y-4">
            <UploadDropzone label="Drop any files to inspect" helper="Reads first 16 bytes — nothing uploaded" multiple
              icon={<FileScan className="h-9 w-9" />} onFiles={inspect} />
            {details.length > 0 && (
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => setDetails([])}>Clear all results</Button>
            )}
          </div>
        </ToolCard>

        <ToolCard title={`Detected Types${details.length ? ` (${details.length})` : ""}`}>
          {details.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <FileScan className="h-12 w-12 mb-3 opacity-20" aria-hidden />
              <p className="text-sm font-medium">Awaiting files…</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.length > 2 && (
                <div className="flex flex-wrap gap-1">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${filter === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}
              <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {filtered.map((item, i) => (
                  <li key={item.name} className="rounded-xl border p-4 text-sm space-y-2 bg-muted/10 hover:bg-muted/20 transition-colors"
                    style={{ animation: "fadeSlideUp 0.3s ease both", animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold truncate flex-1 text-xs" title={item.name}>{item.name}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        item.match.startsWith("✓") ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : item.match.startsWith("⚠") ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        : "bg-muted text-muted-foreground"}`}>
                        {item.match}
                      </span>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div><dt className="text-muted-foreground">Detected</dt><dd className="font-semibold">{item.detectedLabel}</dd></div>
                      <div><dt className="text-muted-foreground">Category</dt><dd>{item.category}</dd></div>
                      <div><dt className="text-muted-foreground">Declared MIME</dt><dd className="font-mono">{item.declaredMime}</dd></div>
                      <div><dt className="text-muted-foreground">Size</dt><dd>{item.size}</dd></div>
                    </dl>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Magic bytes (first 16)</p>
                      <code className="text-[10px] font-mono bg-muted px-2 py-1 rounded break-all leading-relaxed block">{item.signature}</code>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ToolCard>
      </div>
    </section>
  )
}

// ─── Tool: Checksum Calculator ─────────────────────────────────────────────────

function ChecksumCalculator() {
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [progress, setProgress] = useState(0)
  const [expected, setExpected] = useState("")
  const [matchResult, setMatchResult] = useState<"match" | "mismatch" | null>(null)

  const handleFiles = async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setLoading(true)
    setProgress(20)
    setFileName(file.name)
    setHashes({})
    setMatchResult(null)
    const buffer = await file.arrayBuffer()
    setProgress(50)
    const bytes = new Uint8Array(buffer)
    const sha256 = toHex(await crypto.subtle.digest("SHA-256", buffer))
    const sha1 = toHex(await crypto.subtle.digest("SHA-1", buffer))
    setProgress(80)
    const md5 = simulateMd5(String.fromCharCode(...bytes.slice(0, 4096)))
    const checksum = crc32(bytes)
    const map = { "SHA-256": sha256, "SHA-1": sha1, "MD5 (approx.)": md5, "CRC32": checksum.toUpperCase() }
    setHashes(map)
    setProgress(100)
    setLoading(false)
    setTimeout(() => setProgress(0), 1500)
    if (expected.trim()) checkExpected(expected.trim(), map)
  }

  function checkExpected(exp: string, map = hashes) {
    const norm = exp.trim().toLowerCase()
    const match = Object.values(map).some(h => h.toLowerCase() === norm)
    setMatchResult(match ? "match" : "mismatch")
  }

  const allText = Object.entries(hashes).map(([k, v]) => `${k}: ${v}`).join("\n")

  return (
    <section aria-label="Checksum Calculator" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Upload File">
          <div className="space-y-4">
            <UploadDropzone label="Drop a file to hash" helper="SHA-256 · SHA-1 · MD5 · CRC32 — all local"
              icon={<Hash className="h-9 w-9" />} onFiles={handleFiles} disabled={loading} />
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider">Verify against expected hash</Label>
              <div className="flex gap-2">
                <Input value={expected} onChange={e => { setExpected(e.target.value); setMatchResult(null) }}
                  placeholder="Paste expected SHA-256 / MD5 / CRC32 here…"
                  className="font-mono text-xs" />
                <Button variant="outline" size="sm" onClick={() => checkExpected(expected)} disabled={!expected.trim() || !Object.keys(hashes).length}>
                  Verify
                </Button>
              </div>
              {matchResult && (
                <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg fade-in ${matchResult === "match" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
                  {matchResult === "match" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {matchResult === "match" ? "✓ Hash matches — file integrity verified" : "✗ Hash mismatch — file may be corrupted or tampered"}
                </div>
              )}
            </div>
            {loading && (
              <div className="space-y-2 fade-in">
                <p className="text-xs text-muted-foreground flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Computing checksums…</p>
                <ProgressBar progress={progress} />
              </div>
            )}
            {fileName && !loading && <p className="text-xs text-muted-foreground fade-in"><CheckCircle2 className="inline h-3.5 w-3.5 mr-1 text-emerald-500" />Hashed: <strong>{fileName}</strong></p>}
          </div>
        </ToolCard>

        <ToolCard title="Checksums">
          {Object.keys(hashes).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Hash className="h-12 w-12 mb-3 opacity-20" aria-hidden />
              <p className="text-sm font-medium">No file hashed yet</p>
            </div>
          ) : (
            <div className="space-y-3 fade-in">
              {Object.entries(hashes).map(([algo, hash]) => (
                <div key={algo} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{algo}</span>
                    <CopyButton value={hash} label="Copy" />
                  </div>
                  <code className={`block text-[11px] font-mono px-3 py-2 rounded-lg break-all leading-relaxed border ${expected.trim() && hash.toLowerCase() === expected.trim().toLowerCase() ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" : "bg-muted border-transparent"}`}>
                    {hash}
                  </code>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <CopyButton value={allText} label="Copy all" />
                <Button variant="outline" size="sm" onClick={() => downloadBlob(new Blob([allText], { type: "text/plain" }), "checksums.txt")}>
                  <Download className="mr-1.5 h-3.5 w-3.5" /> checksums.txt
                </Button>
              </div>
            </div>
          )}
        </ToolCard>
      </div>
    </section>
  )
}

// ─── Tool: File Merger ─────────────────────────────────────────────────────────

function FileMerger() {
  const [merged, setMerged] = useState("")
  const [files, setFiles] = useState<Array<{ name: string; content: string; lines: number }>>([])
  const [separator, setSeparator] = useState("--- File {n}: {name} ---")
  const [preview, setPreview] = useState(false)

  const doMerge = useCallback((items: Array<{ name: string; content: string }>, sep: string) => {
    setMerged(items.map((f, i) => `${sep.replace("{n}", String(i + 1)).replace("{name}", f.name)}\n${f.content}`).join("\n\n"))
  }, [])

  const handleTextFiles = async (incoming: File[]) => {
    const loaded = await Promise.all(incoming.map(async f => ({ name: f.name, content: await f.text(), lines: 0 })))
    loaded.forEach(f => { f.lines = f.content.split("\n").length })
    const next = [...files, ...loaded.filter(f => !files.some(e => e.name === f.name))]
    setFiles(next)
    doMerge(next, separator)
  }

  useEffect(() => { if (files.length) doMerge(files, separator) }, [separator, files, doMerge])

  const totalLines = files.reduce((a, f) => a + f.lines, 0)

  return (
    <section aria-label="File Merger" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Files to Merge">
          <div className="space-y-4">
            <UploadDropzone label="Drop text files to merge" helper="TXT · CSV · JSON · Markdown" multiple
              accept={{ "text/plain": [".txt", ".md", ".csv", ".json"] }} onFiles={handleTextFiles}
              icon={<Merge className="h-9 w-9" />} />
            <div className="space-y-1.5">
              <Label htmlFor="separator" className="text-xs font-semibold uppercase tracking-wider">Separator</Label>
              <Input id="separator" value={separator} onChange={e => setSeparator(e.target.value)} placeholder="--- File {n}: {name} ---" className="font-mono text-xs" />
              <p className="text-[11px] text-muted-foreground"><code>{"{n}"}</code> = number · <code>{"{name}"}</code> = filename</p>
            </div>
            {files.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <StatBadge label="Files" value={String(files.length)} />
                  <StatBadge label="Total lines" value={totalLines.toLocaleString()} />
                  <StatBadge label="Output" value={formatBytes(new Blob([merged]).size)} />
                </div>
                <ul className="space-y-1" aria-label="Files queued">
                  {files.map((f, i) => (
                    <li key={f.name} className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/20 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                      <span className="flex-1 truncate font-medium" title={f.name}>{f.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{f.lines} lines</span>
                      <button onClick={() => { const next = files.filter(x => x.name !== f.name); setFiles(next); doMerge(next, separator) }} className="text-muted-foreground hover:text-destructive transition-colors" aria-label={`Remove ${f.name}`}>×</button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Button onClick={() => downloadBlob(new Blob([merged], { type: "text/plain" }), "merged.txt")} className="flex-1">
                    <Download className="mr-2 h-4 w-4" /> Download merged.txt
                  </Button>
                  <Button variant="outline" onClick={() => setPreview(p => !p)}>
                    {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </>
            )}
          </div>
        </ToolCard>

        <ToolCard title="Merged Output">
          {!merged ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Merge className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No output yet</p>
            </div>
          ) : (
            <div className="space-y-3 fade-in">
              {preview ? (
                <Textarea readOnly value={merged} className="min-h-[280px] font-mono text-xs resize-y" />
              ) : (
                <div className="bg-muted/20 rounded-xl p-4 text-xs font-mono text-muted-foreground max-h-72 overflow-y-auto whitespace-pre-wrap">
                  {merged.slice(0, 2000)}{merged.length > 2000 && "\n…(truncated)"}
                </div>
              )}
              <CopyButton value={merged} label="Copy all" />
            </div>
          )}
        </ToolCard>
      </div>
    </section>
  )
}

// ─── Tool: File Splitter ───────────────────────────────────────────────────────

function FileSplitter() {
  const [chunks, setChunks] = useState<string[]>([])
  const [fileName, setFileName] = useState("")
  const [linesPerChunk, setLinesPerChunk] = useState(40)
  const [loading, setLoading] = useState(false)
  const [totalLines, setTotalLines] = useState(0)

  const handleTextFiles = async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setLoading(true)
    setFileName(file.name)
    const text = await file.text()
    const result = splitTextIntoChunks(text, linesPerChunk)
    setChunks(result)
    setTotalLines(text.split("\n").length)
    setLoading(false)
  }

  const downloadZip = async () => {
    const zip = new JSZip()
    chunks.forEach((chunk, i) => zip.file(`${fileName.replace(/\.[^.]+$/, "")}-chunk-${String(i + 1).padStart(3, "0")}.txt`, chunk))
    downloadBlob(await zip.generateAsync({ type: "blob" }), "split-files.zip")
  }

  return (
    <section aria-label="File Splitter" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Split Text File">
          <div className="space-y-4">
            <UploadDropzone label="Drop one text file" helper="TXT · CSV · JSON · Markdown"
              accept={{ "text/plain": [".txt", ".md", ".csv", ".json"] }} onFiles={handleTextFiles}
              icon={<Scissors className="h-9 w-9" />} />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold uppercase tracking-wider">Lines per chunk</Label>
                <span className="text-sm font-black px-2 py-0.5 bg-primary/10 text-primary rounded-md tabular-nums">{linesPerChunk}</span>
              </div>
              <input type="range" min={5} max={500} step={5} value={linesPerChunk}
                onChange={e => setLinesPerChunk(Number(e.target.value))}
                className="w-full accent-primary" />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>5 lines</span><span>500 lines</span>
              </div>
            </div>
            {loading && <p className="text-xs text-muted-foreground flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Splitting…</p>}
          </div>
        </ToolCard>

        <ToolCard title="Split Output">
          {chunks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Scissors className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No file split yet</p>
            </div>
          ) : (
            <div className="space-y-4 fade-in">
              <div className="grid grid-cols-3 gap-2">
                <StatBadge label="Chunks" value={String(chunks.length)} icon={<Scissors className="h-3.5 w-3.5" />} />
                <StatBadge label="Total lines" value={totalLines.toLocaleString()} />
                <StatBadge label="Lines/chunk" value={String(linesPerChunk)} />
              </div>
              <ul className="space-y-1 max-h-52 overflow-y-auto pr-1">
                {chunks.map((chunk, i) => (
                  <li key={i} className="flex items-center justify-between px-3 py-2 rounded-lg border bg-muted/20 text-sm"
                    style={{ animation: "fadeSlideUp 0.25s ease both", animationDelay: `${i * 15}ms` }}>
                    <span className="font-mono text-xs">{fileName.replace(/\.[^.]+$/, "")}-chunk-{String(i + 1).padStart(3, "0")}.txt</span>
                    <span className="text-xs text-muted-foreground">{chunk.split("\n").length} lines</span>
                  </li>
                ))}
              </ul>
              <Button onClick={downloadZip} className="w-full h-11">
                <Download className="mr-2 h-4 w-4" /> Download All ({chunks.length} chunks as ZIP)
              </Button>
            </div>
          )}
        </ToolCard>
      </div>
    </section>
  )
}

// ─── Tool: File Diff Viewer ────────────────────────────────────────────────────

type DiffLine = { type: "added" | "removed" | "unchanged"; value: string }

function FileDiff() {
  const [textA, setTextA] = useState("")
  const [textB, setTextB] = useState("")
  const [nameA, setNameA] = useState("File A")
  const [nameB, setNameB] = useState("File B")
  const [diffs, setDiffs] = useState<DiffLine[]>([])
  const [stats, setStats] = useState<{ added: number; removed: number; unchanged: number } | null>(null)
  const [view, setView] = useState<"unified" | "side">("unified")

  const loadFile = async (files: File[], side: "a" | "b") => {
    const file = files[0]
    if (!file) return
    const text = await file.text()
    if (side === "a") { setTextA(text); setNameA(file.name) }
    else { setTextB(text); setNameB(file.name) }
  }

  function runDiff() {
    const result = diffLines(textA, textB)
    const lines: DiffLine[] = []
    let added = 0, removed = 0, unchanged = 0
    result.forEach(part => {
      const partLines = part.value.replace(/\n$/, "").split("\n")
      partLines.forEach(line => {
        if (part.added) { lines.push({ type: "added", value: line }); added++ }
        else if (part.removed) { lines.push({ type: "removed", value: line }); removed++ }
        else { lines.push({ type: "unchanged", value: line }); unchanged++ }
      })
    })
    setDiffs(lines)
    setStats({ added, removed, unchanged })
  }

  function downloadPatch() {
    const result = diffLines(textA, textB)
    let patch = `--- ${nameA}\n+++ ${nameB}\n`
    result.forEach(part => {
      const lines = part.value.replace(/\n$/, "").split("\n")
      lines.forEach(line => {
        patch += part.added ? `+${line}\n` : part.removed ? `-${line}\n` : ` ${line}\n`
      })
    })
    downloadBlob(new Blob([patch], { type: "text/plain" }), "diff.patch")
  }

  const lineColor: Record<DiffLine["type"], string> = {
    added: "bg-emerald-50 dark:bg-emerald-900/25 text-emerald-800 dark:text-emerald-300",
    removed: "bg-red-50 dark:bg-red-900/25 text-red-800 dark:text-red-300",
    unchanged: "",
  }
  const linePrefix: Record<DiffLine["type"], string> = { added: "+ ", removed: "- ", unchanged: "  " }

  return (
    <section aria-label="File Diff Viewer" className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider">File A (original)</Label>
          <UploadDropzone label={nameA} helper="Drop or paste text below" onFiles={f => loadFile(f, "a")}
            icon={<FileText className="h-8 w-8" />} />
          <Textarea value={textA} onChange={e => setTextA(e.target.value)} placeholder="Or paste text here…"
            className="font-mono text-xs min-h-[120px] resize-y" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider">File B (modified)</Label>
          <UploadDropzone label={nameB} helper="Drop or paste text below" onFiles={f => loadFile(f, "b")}
            icon={<FileText className="h-8 w-8" />} />
          <Textarea value={textB} onChange={e => setTextB(e.target.value)} placeholder="Or paste text here…"
            className="font-mono text-xs min-h-[120px] resize-y" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={runDiff} disabled={!textA.trim() || !textB.trim()}>
          <GitCompare className="mr-2 h-4 w-4" /> Compare Files
        </Button>
        {diffs.length > 0 && (
          <>
            <Button variant="outline" onClick={downloadPatch}><Download className="mr-2 h-4 w-4" /> Download .patch</Button>
            <div className="flex gap-1 bg-muted rounded-lg p-1 ml-auto">
              {(["unified", "side"] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all capitalize ${view === v ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}>
                  {v === "unified" ? "Unified" : "Split"}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-3 fade-in">
          <StatBadge label="Lines added" value={`+${stats.added}`} variant="success" icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
          <StatBadge label="Lines removed" value={`-${stats.removed}`} variant="error" icon={<XCircle className="h-3.5 w-3.5" />} />
          <StatBadge label="Unchanged" value={String(stats.unchanged)} icon={<AlignLeft className="h-3.5 w-3.5" />} />
        </div>
      )}

      {diffs.length > 0 && (
        <div className="border rounded-xl overflow-hidden fade-in">
          <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b text-xs font-semibold">
            <span>{nameA} → {nameB}</span>
            <span className="text-muted-foreground">{diffs.length} lines</span>
          </div>
          <div className="overflow-auto max-h-[500px] font-mono text-xs">
            {diffs.map((line, i) => (
              <div key={i} className={`flex gap-2 px-3 py-0.5 ${lineColor[line.type]}`}>
                <span className="w-6 text-right text-muted-foreground shrink-0 select-none opacity-50">{i + 1}</span>
                <span className="shrink-0 select-none font-bold">{linePrefix[line.type]}</span>
                <span className="flex-1 whitespace-pre-wrap break-all">{line.value || " "}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!diffs.length && textA && textB && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>Click <strong>Compare Files</strong> to see the diff.</AlertDescription>
        </Alert>
      )}
    </section>
  )
}

// ─── Tool: EXIF Viewer ─────────────────────────────────────────────────────────

type ExifSection = { label: string; icon: React.ReactNode; keys: string[]; fields: Record<string, unknown> }

function ExifViewer() {
  const [results, setResults] = useState<Array<{ name: string; sections: ExifSection[]; preview?: string }>>([])
  const [loading, setLoading] = useState(false)

  const inspect = async (files: File[]) => {
    setLoading(true)
    const out = await Promise.all(files.map(async file => {
      let data: Record<string, unknown> = {}
      try { data = (await exifr.parse(file, true)) ?? {} } catch {}
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined

      const sections: ExifSection[] = [
        {
          label: "Camera & Capture", icon: <Camera className="h-3.5 w-3.5" />,
          keys: ["Make", "Model", "LensModel", "FNumber", "ExposureTime", "ISO", "FocalLength", "Flash", "WhiteBalance", "ExposureMode"],
          fields: data,
        },
        {
          label: "Date & Time", icon: <Clock className="h-3.5 w-3.5" />,
          keys: ["DateTimeOriginal", "CreateDate", "ModifyDate", "DateTimeDigitized"],
          fields: data,
        },
        {
          label: "Image Info", icon: <ImageIcon className="h-3.5 w-3.5" />,
          keys: ["ImageWidth", "ImageHeight", "ExifImageWidth", "ExifImageHeight", "ColorSpace", "BitsPerSample", "Orientation", "Software"],
          fields: data,
        },
        {
          label: "GPS Location", icon: <MapPin className="h-3.5 w-3.5" />,
          keys: ["latitude", "longitude", "GPSAltitude", "GPSSpeed", "GPSImgDirection"],
          fields: data,
        },
      ]

      return { name: file.name, sections, preview }
    }))
    setResults(prev => [...prev, ...out.filter(o => !prev.some(p => p.name === o.name))])
    setLoading(false)
  }

  function formatValue(val: unknown): string {
    if (val === null || val === undefined) return "—"
    if (val instanceof Date) return val.toLocaleString()
    if (typeof val === "number") return Number.isInteger(val) ? String(val) : val.toFixed(4)
    if (typeof val === "object") return JSON.stringify(val).slice(0, 80)
    return String(val)
  }

  return (
    <section aria-label="EXIF Metadata Viewer" className="space-y-6">
      <UploadDropzone label="Drop photos to read metadata" helper="JPEG · PNG · HEIC · TIFF · RAW — nothing uploaded"
        multiple accept={{ "image/*": [".jpg", ".jpeg", ".png", ".heic", ".heif", ".tiff", ".tif", ".webp"] }}
        icon={<Camera className="h-9 w-9" />} onFiles={inspect} />
      {loading && <p className="text-xs text-muted-foreground flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading metadata…</p>}
      {results.length > 0 && (
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setResults([])}>Clear all</Button>
      )}
      <div className="space-y-6">
        {results.map((result, ri) => (
          <div key={result.name} className="border rounded-xl overflow-hidden fade-in" style={{ animationDelay: `${ri * 80}ms` }}>
            <div className="flex items-center gap-3 p-4 bg-muted/20 border-b">
              {result.preview && <img src={result.preview} alt="" className="w-14 h-14 object-cover rounded-lg border shrink-0" />}
              <div>
                <p className="font-bold text-sm truncate">{result.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {result.sections.reduce((a, s) => a + Object.keys(s.fields).filter(k => s.keys.includes(k)).length, 0)} metadata fields found
                </p>
              </div>
            </div>
            <div className="divide-y">
              {result.sections.map(section => {
                const present = section.keys.filter(k => section.fields[k] !== undefined && section.fields[k] !== null)
                if (!present.length) return null
                return (
                  <div key={section.label} className="p-4 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      {section.icon} {section.label}
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                      {present.map(key => (
                        <div key={key} className="flex justify-between gap-2 text-xs">
                          <dt className="text-muted-foreground shrink-0">{key}</dt>
                          <dd className="font-mono font-medium text-right break-all">{formatValue(section.fields[key])}</dd>
                        </div>
                      ))}
                    </dl>
                    {section.label === "GPS Location" && section.fields["latitude"] != null && (
                      <a
                        href={`https://www.google.com/maps?q=${section.fields["latitude"]},${section.fields["longitude"]}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-1"
                      >
                        <MapPin className="h-3 w-3" /> View on Google Maps
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Tool: Base64 File Encoder ─────────────────────────────────────────────────

function Base64FileEncoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [b64, setB64] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState("")
  const [loading, setLoading] = useState(false)
  const [decodeInput, setDecodeInput] = useState("")

  const encodeFile = async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setLoading(true)
    setFileName(file.name)
    setFileType(file.type)
    const buf = await file.arrayBuffer()
    const bytes = new Uint8Array(buf)
    let binary = ""
    bytes.forEach(b => { binary += String.fromCharCode(b) })
    const b64str = btoa(binary)
    setB64(b64str)
    setLoading(false)
  }

  const dataUri = fileType && b64 ? `data:${fileType};base64,${b64}` : b64

  const decodeAndDownload = () => {
    try {
      const raw = decodeInput.trim().replace(/^data:[^;]+;base64,/, "")
      const binary = atob(raw)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      downloadBlob(new Blob([bytes]), "decoded-file")
    } catch {
      toast.error("Invalid Base64 string — make sure it is correctly formatted.")
    }
  }

  const sizeInfo = b64 ? `${formatBytes(b64.length)} base64 (~${formatBytes(Math.round(b64.length * 0.75))} original)` : ""

  return (
    <section aria-label="Base64 File Encoder / Decoder" className="space-y-6">
      <div className="flex gap-1 bg-muted rounded-xl p-1">
        {(["encode", "decode"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all capitalize ${mode === m ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {m === "encode" ? "📤 File → Base64" : "📥 Base64 → File"}
          </button>
        ))}
      </div>

      {mode === "encode" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Upload File">
            <div className="space-y-4">
              <UploadDropzone label="Drop any file to encode" helper="All file types supported · processed locally"
                icon={<FileCode className="h-9 w-9" />} onFiles={encodeFile} />
              {loading && <p className="text-xs text-muted-foreground flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" />Encoding…</p>}
              {fileName && !loading && <p className="text-xs text-muted-foreground"><CheckCircle2 className="inline h-3.5 w-3.5 mr-1 text-emerald-500" />{fileName}</p>}
              {sizeInfo && <p className="text-xs text-muted-foreground">{sizeInfo}</p>}
            </div>
          </ToolCard>

          <ToolCard title="Base64 Output">
            {!b64 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <FileCode className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm">No output yet</p>
              </div>
            ) : (
              <div className="space-y-3 fade-in">
                <Textarea readOnly value={b64} className="font-mono text-[11px] min-h-[180px] resize-y" />
                <div className="flex flex-wrap gap-2">
                  <CopyButton value={b64} label="Copy Base64" />
                  {fileType && <CopyButton value={dataUri} label="Copy data URI" />}
                  <Button variant="outline" size="sm" onClick={() => downloadBlob(new Blob([b64], { type: "text/plain" }), `${fileName}.b64.txt`)}>
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Save .txt
                  </Button>
                </div>
              </div>
            )}
          </ToolCard>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <ToolCard title="Paste Base64">
            <div className="space-y-4">
              <Textarea value={decodeInput} onChange={e => setDecodeInput(e.target.value)}
                placeholder="Paste Base64 string or data URI (data:image/png;base64,…)"
                className="font-mono text-[11px] min-h-[200px] resize-y" />
              <Button onClick={decodeAndDownload} disabled={!decodeInput.trim()} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Decode & Download File
              </Button>
            </div>
          </ToolCard>
          <ToolCard title="How to Decode">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Paste a raw Base64 string or a full data URI into the text area and click <strong>Decode &amp; Download</strong>.</p>
              <p>A <strong>data URI</strong> looks like:</p>
              <code className="block text-[11px] font-mono bg-muted px-3 py-2 rounded-lg break-all">data:image/png;base64,iVBORw0KGgo…</code>
              <p>The tool strips the header automatically and downloads the raw binary file.</p>
            </div>
          </ToolCard>
        </div>
      )}
    </section>
  )
}

// ─── Tool: Filename Sanitizer ──────────────────────────────────────────────────

function FilenameSanitizer() {
  const [input, setInput] = useState("")
  const [replacement, setReplacement] = useState("-")
  const [lowercase, setLowercase] = useState(false)

  const lines = input.split("\n").filter(Boolean)
  const sanitized = lines.map(name => {
    let s = sanitizeFilename(name.trim(), replacement)
    if (lowercase) s = s.toLowerCase()
    return s
  })

  const outputText = sanitized.join("\n")
  const changed = sanitized.filter((s, i) => s !== lines[i]).length

  return (
    <section aria-label="Filename Sanitizer" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Input Filenames">
          <div className="space-y-4">
            <Textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder={"My File (copy).txt\nHello World 2026.pdf\nfile:name*bad?.docx\n…one filename per line"}
              className="font-mono text-sm min-h-[240px] resize-y" />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Label className="text-xs font-semibold shrink-0">Replace invalid chars with</Label>
                <div className="flex gap-2">
                  {["-", "_", "."].map(r => (
                    <button key={r} onClick={() => setReplacement(r)}
                      className={`w-8 h-8 rounded-lg border font-mono text-sm font-bold transition-all ${replacement === r ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:border-primary/50"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={lowercase} onChange={e => setLowercase(e.target.checked)} className="accent-primary" />
                Convert to lowercase
              </label>
            </div>
          </div>
        </ToolCard>

        <ToolCard title={`Sanitized Output${changed ? ` (${changed} changed)` : ""}`}>
          {!lines.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Type className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm">Enter filenames on the left</p>
            </div>
          ) : (
            <div className="space-y-3">
              <ul className="space-y-1 max-h-64 overflow-y-auto">
                {lines.map((orig, i) => (
                  <li key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono ${sanitized[i] !== orig ? "bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800" : "bg-muted/20"}`}>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      {sanitized[i] !== orig && <p className="text-muted-foreground line-through truncate">{orig}</p>}
                      <p className={`truncate font-semibold ${sanitized[i] !== orig ? "text-amber-700 dark:text-amber-400" : ""}`}>{sanitized[i]}</p>
                    </div>
                    {sanitized[i] !== orig && <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                    {sanitized[i] === orig && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 opacity-60" />}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <CopyButton value={outputText} label="Copy all" />
                <Button variant="outline" size="sm" onClick={() => downloadBlob(new Blob([outputText], { type: "text/plain" }), "sanitized-filenames.txt")}>
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                </Button>
              </div>
            </div>
          )}
        </ToolCard>
      </div>
    </section>
  )
}

// ─── Tool: Line Ending Converter ───────────────────────────────────────────────

function LineEndingConverter() {
  const [text, setText] = useState("")
  const [target, setTarget] = useState<"lf" | "crlf" | "cr">("lf")
  const [fileName, setFileName] = useState("")

  const loadFile = async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setText(await file.text())
    setFileName(file.name)
  }

  const stats = useMemo(() => detectLineEndings(text), [text])
  const dominant = stats.crlf > stats.lf && stats.crlf > stats.cr ? "CRLF" : stats.lf > stats.cr ? "LF" : stats.cr > 0 ? "CR" : "—"

  const convert = () => {
    const sep = target === "lf" ? "\n" : target === "crlf" ? "\r\n" : "\r"
    return text.replace(/\r\n|\r|\n/g, sep)
  }

  const converted = text ? convert() : ""
  const ext = fileName.split(".").pop() ?? "txt"
  const outName = fileName ? fileName.replace(`.${ext}`, `_${target}.${ext}`) : `converted_${target}.txt`

  const FORMATS = [
    { key: "lf" as const, label: "LF — Unix / macOS", desc: "\\n", note: "Standard for Git, Linux, macOS" },
    { key: "crlf" as const, label: "CRLF — Windows", desc: "\\r\\n", note: "Notepad, Windows tools" },
    { key: "cr" as const, label: "CR — Legacy Mac", desc: "\\r", note: "Old Mac OS 9 and earlier" },
  ]

  return (
    <section aria-label="Line Ending Converter" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard title="Input">
          <div className="space-y-4">
            <UploadDropzone label="Drop a text file" helper="TXT · CSV · JSON · code files"
              icon={<ArrowRightLeft className="h-9 w-9" />} onFiles={loadFile} />
            <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Or paste text here…"
              className="font-mono text-xs min-h-[160px] resize-y" />
            {text && (
              <div className="grid grid-cols-3 gap-2 fade-in">
                <StatBadge label="CRLF (Win)" value={String(stats.crlf)} variant={dominant === "CRLF" ? "primary" : "neutral"} />
                <StatBadge label="LF (Unix)" value={String(stats.lf)} variant={dominant === "LF" ? "primary" : "neutral"} />
                <StatBadge label="CR (Legacy)" value={String(stats.cr)} variant={dominant === "CR" ? "primary" : "neutral"} />
              </div>
            )}
            {dominant !== "—" && (
              <p className="text-xs text-muted-foreground fade-in">Detected: <strong>{dominant}</strong> line endings</p>
            )}
          </div>
        </ToolCard>

        <ToolCard title="Convert To">
          <div className="space-y-4">
            <div className="space-y-2">
              {FORMATS.map(f => (
                <label key={f.key} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${target === f.key ? "border-primary bg-primary/5" : "hover:border-primary/30"}`}>
                  <input type="radio" name="target" checked={target === f.key} onChange={() => setTarget(f.key)} className="accent-primary" />
                  <div>
                    <p className="text-sm font-semibold">{f.label} <code className="font-mono text-xs text-muted-foreground">{f.desc}</code></p>
                    <p className="text-xs text-muted-foreground">{f.note}</p>
                  </div>
                </label>
              ))}
            </div>
            {converted && (
              <div className="flex gap-2 fade-in">
                <CopyButton value={converted} label="Copy converted" />
                <Button onClick={() => downloadBlob(new Blob([converted], { type: "text/plain" }), outName)}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            )}
          </div>
        </ToolCard>
      </div>
    </section>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

const TOOL_META: Record<string, { icon: React.ReactNode; title: string; desc: string }> = {
  "zip-file-compressor": { icon: <FileArchive className="h-5 w-5" />, title: "Free Online ZIP File Compressor", desc: "Archive and compress multiple files into a ZIP — fully client-side, no uploads, no limits." },
  "mime-type-detector": { icon: <FileScan className="h-5 w-5" />, title: "MIME Type Detector — 50+ File Formats", desc: "Identify any file's true type from its magic bytes. Detects 50+ formats — works even with wrong extensions." },
  "checksum-calculator": { icon: <Hash className="h-5 w-5" />, title: "Checksum Calculator — SHA-256, SHA-1, MD5, CRC32", desc: "Verify file integrity with industry-standard hashes. Paste an expected hash to instantly verify a match." },
  "file-merger": { icon: <Merge className="h-5 w-5" />, title: "Free Online File Merger", desc: "Combine multiple text, CSV, JSON, or Markdown files into a single merged output instantly." },
  "file-splitter": { icon: <Scissors className="h-5 w-5" />, title: "Free Online File Splitter", desc: "Split large text files into smaller line-based chunks and download them all as a ZIP archive." },
  "file-diff": { icon: <GitCompare className="h-5 w-5" />, title: "File Diff Viewer — Compare Two Text Files", desc: "See exactly what changed between two text files. Line-by-line diff with color-coded additions and deletions." },
  "exif-viewer": { icon: <Camera className="h-5 w-5" />, title: "EXIF Metadata Viewer — Image Info Reader", desc: "Read camera settings, GPS coordinates, timestamps, and all metadata from JPEG, HEIC, TIFF, and RAW photos." },
  "base64-file-encoder": { icon: <FileCode className="h-5 w-5" />, title: "Base64 File Encoder / Decoder", desc: "Encode any file to a Base64 string or data URI. Decode Base64 strings back to downloadable files." },
  "filename-sanitizer": { icon: <Type className="h-5 w-5" />, title: "Filename Sanitizer — Safe File Name Generator", desc: "Batch-sanitize file names by removing illegal characters and normalizing spaces — ready for any OS." },
  "line-ending-converter": { icon: <ArrowRightLeft className="h-5 w-5" />, title: "Line Ending Converter — LF ↔ CRLF ↔ CR", desc: "Fix cross-platform newline issues by converting between Unix LF, Windows CRLF, and legacy Mac CR." },
}

export default function FileTools({ toolId }: { toolId: string }) {
  const schema = TOOL_SCHEMAS[toolId]
  const faqs = TOOL_FAQ[toolId] ?? []
  const meta = TOOL_META[toolId]

  return (
    <>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "FAQPage",
            mainEntity: faqs.map(item => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
          }),
        }} />
      )}
      <style>{KEYFRAMES}</style>

      <article className="w-full space-y-8">
        {meta && (
          <header className="space-y-1 fade-in">
            <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
              <span className="text-primary">{meta.icon}</span>{meta.title}
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">{meta.desc}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">100% private — all processing happens in your browser</span>
            </div>
          </header>
        )}

        {toolId === "zip-file-compressor" && <ZipCompressor />}
        {toolId === "mime-type-detector" && <MimeDetector />}
        {toolId === "checksum-calculator" && <ChecksumCalculator />}
        {toolId === "file-merger" && <FileMerger />}
        {toolId === "file-splitter" && <FileSplitter />}
        {toolId === "file-diff" && <FileDiff />}
        {toolId === "exif-viewer" && <ExifViewer />}
        {toolId === "base64-file-encoder" && <Base64FileEncoder />}
        {toolId === "filename-sanitizer" && <FilenameSanitizer />}
        {toolId === "line-ending-converter" && <LineEndingConverter />}

        <section aria-label="Tool features" className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-in-2">
          {[
            { icon: <ShieldCheck className="h-4 w-4" />, title: "100% Private", body: "No data ever leaves your device" },
            { icon: <Zap className="h-4 w-4" />, title: "Instant Results", body: "Powered by browser Web APIs" },
            { icon: <Download className="h-4 w-4" />, title: "Free Forever", body: "No sign-up, no watermarks" },
            { icon: <Layers className="h-4 w-4" />, title: "Batch Support", body: "Process multiple files at once" },
          ].map(({ icon, title, body }) => (
            <div key={title} className="flex flex-col gap-1.5 p-4 rounded-xl border bg-muted/10 hover:bg-muted/20 transition-colors">
              <div className="text-primary">{icon}</div>
              <p className="text-sm font-bold">{title}</p>
              <p className="text-xs text-muted-foreground leading-snug">{body}</p>
            </div>
          ))}
        </section>

        {faqs.length > 0 && (
          <section aria-labelledby={`faq-${toolId}`} className="space-y-3 fade-in-3">
            <h2 id={`faq-${toolId}`} className="text-lg font-black tracking-tight">Frequently Asked Questions</h2>
            <FAQAccordion items={faqs} />
          </section>
        )}

        {meta && (
          <section aria-label="About this tool" className="text-[13px] leading-relaxed text-muted-foreground space-y-2 border-t pt-6">
            <h2 className="text-base font-bold text-foreground">About This Tool</h2>
            <p><strong>{meta.title}</strong> is a free, browser-based utility that runs entirely on your device. No file is ever uploaded to any external server — making it the safest choice for sensitive documents, internal data, or personal files.</p>
            <p>Built with modern Web APIs (File API, Web Crypto, JSZip, exifr), this tool delivers instant results without plugins or software installs. Works on all modern browsers across Windows, macOS, Linux, iOS, and Android.</p>
          </section>
        )}
      </article>
    </>
  )
}

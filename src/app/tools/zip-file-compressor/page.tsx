import type { Metadata } from "next"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { DynamicToolLoader } from "@/components/tools/dynamic-tool-loader"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { JsonLd } from "@/components/seo/json-ld"
import { buildToolSchema, buildBreadcrumbSchema } from "@/lib/seo/schema"
import { getToolById } from "@/lib/tools/tools-config"
const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/zip-file-compressor`

export const metadata: Metadata = {
  title: "Free ZIP File Compressor Online — Create ZIP, No Signup",
  description:
    "Create ZIP archives free online — no signup, no upload to servers. Compress multiple files into a ZIP instantly in your browser. DEFLATE & STORE modes, unlimited, 100% private.",
  keywords: [
    "zip compressor free",
    "zip file compressor online",
    "create zip online free",
    "zip archive maker free",
    "compress files to zip free no signup",
    "free zip tool no upload",
    "zip files browser based",
    "zip compressor no account",
    "free online zip creator",
    "zip file maker free",
    "free zip compressor 2026",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    title: "Free ZIP File Compressor Online — Create ZIP, No Signup",
    description:
      "Compress multiple files into a ZIP archive free — no upload, no signup, 100% private. Runs entirely in your browser.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  const tool = getToolById("zip-file-compressor")
  return (
    <>
      {tool && (
        <JsonLd
          id="zip-compressor-schema"
          data={[
            buildToolSchema(tool),
            buildBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "File Tools", path: "/categories/file" },
              { name: "ZIP File Compressor", path: "/tools/zip-file-compressor" },
            ]),
          ]}
        />
      )}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Free ZIP File Compressor — Create ZIP Archives Online, No Upload
      </h1>
      
      <QuickAnswer
        question="How do I compress multiple files into a ZIP online for free?"
        answer="Click 'Add Files', select the files you want to compress, choose DEFLATE (smaller archive) or STORE (no compression, faster) mode, then click 'Create ZIP' to download the archive instantly. No files are uploaded to any server — all compression runs entirely in your browser using the JSZip library. Works with any file type, any size, with no account required."
      />
      <DynamicToolLoader category="file" toolId="zip-file-compressor" />
      <section className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">What is a ZIP File?</h2>
          <p>A ZIP file is a compressed archive format that packages one or more files into a single container, reducing total file size using lossless compression algorithms. ZIP is the most universally supported archive format — natively supported on Windows, macOS, Linux, iOS, and Android with no extra software needed. It is the standard for sending multiple files by email, sharing project folders, and distributing software.</p>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">DEFLATE vs STORE — Which to Choose?</h2>
          <p><strong>DEFLATE</strong> applies compression to reduce file sizes. It is best for text files, HTML, CSS, JavaScript, JSON, and CSV — these compress 60–90%. Binary files like images, PDFs, MP4 videos, and already-compressed archives see little reduction. <strong>STORE</strong> packages files without compression — the ZIP is essentially the same size as the original files combined. Use STORE when speed matters more than size, or when the files are already compressed (e.g., JPEG images).</p>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Common Use Cases</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Sharing project files:</strong> Package a folder of source code, assets, and configs into one download link.</li>
            <li><strong>Email attachments:</strong> Most email providers have per-file limits — a ZIP combines many files into one attachment.</li>
            <li><strong>Client deliverables:</strong> Designers and developers zip their deliverables (Figma exports, build folders) before sending to clients.</li>
            <li><strong>Archiving old files:</strong> Compress old project folders to save disk space without losing the files.</li>
            <li><strong>Uploading to CMS or hosting:</strong> Some platforms accept ZIP uploads for bulk file imports.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Privacy — Your Files Stay on Your Device</h2>
          <p>This tool runs entirely in your browser using the JSZip JavaScript library. Your files are never transmitted to any server — not even temporarily. The ZIP is generated locally in your browser memory and downloaded directly to your computer. This makes it safe to use with confidential documents, private photos, client files, and any other sensitive data.</p>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h2>
          <dl className="space-y-4">
            <div>
              <dt className="font-medium text-foreground">Is there a file size limit?</dt>
              <dd>There is no hard file size limit. The practical limit depends on your browser and available RAM. Most users can ZIP files totalling several gigabytes without issues on modern hardware.</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Can I ZIP folders?</dt>
              <dd>Yes. Select all files inside the folder manually (Ctrl+A on Windows, Cmd+A on Mac) and add them. The ZIP will preserve the filenames. Full folder structure (sub-directories) depends on browser support for the File System Access API.</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Does it support password-protected ZIPs?</dt>
              <dd>This tool creates unencrypted ZIPs. For password-protected archives, use a desktop application such as 7-Zip (free, open source) which supports AES-256 encryption.</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  )
}

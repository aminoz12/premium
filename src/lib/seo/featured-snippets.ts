export type FeaturedSnippetBlock =
  | {
      query: string
      type: "paragraph"
      answer: string
    }
  | {
      query: string
      type: "list"
      steps: string[]
    }
  | {
      query: string
      type: "table"
      headers: string[]
      rows: string[][]
    }

const FEATURED_SNIPPETS_BY_TOOL: Record<string, FeaturedSnippetBlock[]> = {
  "qr-code-generator": [
    {
      query: "What is a QR code?",
      type: "paragraph",
      answer:
        "A QR code (Quick Response code) is a two-dimensional barcode that stores information such as a website URL, contact details, or Wi-Fi credentials. Smartphones can scan QR codes instantly using their camera app.",
    },
  ],
  "image-compressor": [
    {
      query: "How to compress an image",
      type: "list",
      steps: [
        "Upload the original image and choose the target format (usually JPEG or WebP).",
        "Resize dimensions first to match where the image will be used.",
        "Reduce quality gradually until the file size target is reached.",
        "Preview at 100% zoom to confirm text and edges remain clear.",
        "Download and test loading speed before publishing or sending.",
      ],
    },
  ],
  "base64-encoder": [
    {
      query: "What is Base64?",
      type: "paragraph",
      answer:
        "Base64 is an encoding method that converts binary data into text-safe characters. It helps transport files or bytes through systems that expect plain text, but it is not encryption.",
    },
  ],
  "regex-tester": [
    {
      query: "Regex cheat sheet",
      type: "table",
      headers: ["Pattern", "Meaning", "Example match"],
      rows: [
        ["^...$", "Start and end anchors", "Match full string only"],
        ["\\d+", "One or more digits", "2026"],
        ["[A-Za-z]+", "Letters only", "FreeTools"],
        ["\\s+", "Whitespace sequence", "space or tab blocks"],
        ["(foo|bar)", "Either value", "foo"],
      ],
    },
  ],
  "password-generator": [
    {
      query: "How long should a password be?",
      type: "paragraph",
      answer:
        "For most accounts, use at least 14 characters. For critical accounts like email, banking, or admin access, use 16-20+ characters plus multifactor authentication.",
    },
  ],
  "json-formatter": [
    {
      query: "What is JSON?",
      type: "paragraph",
      answer:
        "JSON (JavaScript Object Notation) is a lightweight text format for structured data. It is commonly used in APIs, configuration files, and application payloads because it is easy for both humans and machines to read.",
    },
  ],
}

export function getFeaturedSnippetsForTool(toolId: string): FeaturedSnippetBlock[] {
  return FEATURED_SNIPPETS_BY_TOOL[toolId] ?? []
}

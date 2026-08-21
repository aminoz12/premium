import fs from "node:fs"
import path from "node:path"

const toolsConfigPath = path.join(process.cwd(), "src/lib/tools/tools-config.ts")
const outputDir = path.join(process.cwd(), "docs", "seo")
const outputPath = path.join(outputDir, "keyword-research-tool-pages.csv")

const PRIORITY_TOOL_IDS = [
  "qr-code-generator",
  "word-counter",
  "image-compressor",
  "password-generator",
  "color-picker",
  "json-formatter",
  "lorem-ipsum",
  "base64-encoder",
  "regex-tester",
  "uuid-generator",
  "bcrypt",
  "jwt-decoder",
  "markdown-to-html",
  "box-shadow",
  "color-contrast-checker",
  "css-gradient",
  "diff-checker",
  "url-encoder",
  "hash-generator",
  "sql-formatter",
]

const PRIORITY_METRICS = {
  "qr-code-generator": { volume: "1200000", kd: "hard", primaryKeyword: "qr code generator" },
  "password-generator": { volume: "600000", kd: "hard", primaryKeyword: "password generator" },
  "word-counter": { volume: "450000", kd: "medium", primaryKeyword: "word counter" },
  "image-compressor": { volume: "300000", kd: "medium", primaryKeyword: "image compressor" },
  "json-formatter": { volume: "200000", kd: "medium", primaryKeyword: "json formatter" },
  "color-picker": { volume: "180000", kd: "hard", primaryKeyword: "color picker" },
  "lorem-ipsum": { volume: "150000", kd: "medium", primaryKeyword: "lorem ipsum generator" },
  "base64-encoder": { volume: "120000", kd: "low", primaryKeyword: "base64 decode" },
  "regex-tester": { volume: "100000", kd: "low", primaryKeyword: "regex tester" },
  "uuid-generator": { volume: "90000", kd: "low", primaryKeyword: "uuid generator" },
  "bcrypt": { volume: "40000", kd: "low", primaryKeyword: "bcrypt generator" },
  "jwt-decoder": { volume: "35000", kd: "low", primaryKeyword: "jwt decoder" },
  "markdown-to-html": { volume: "25000", kd: "low", primaryKeyword: "markdown to html" },
  "box-shadow": { volume: "22000", kd: "low", primaryKeyword: "css box shadow generator" },
  "color-contrast-checker": { volume: "18000", kd: "low", primaryKeyword: "color contrast checker" },
  "css-gradient": { volume: "12000", kd: "low", primaryKeyword: "css gradient generator" },
  "diff-checker": { volume: "15000", kd: "low", primaryKeyword: "diff checker" },
  "url-encoder": { volume: "80000", kd: "low", primaryKeyword: "url encoder" },
  "hash-generator": { volume: "30000", kd: "low", primaryKeyword: "sha256 hash generator" },
  "sql-formatter": { volume: "5000", kd: "low", primaryKeyword: "sql formatter" },
}

function extractCreateToolBlocks(source) {
  const token = "createTool({"
  const blocks = []
  let searchIndex = 0

  while (true) {
    const start = source.indexOf(token, searchIndex)
    if (start === -1) break

    let cursor = start + token.length
    let depth = 1
    let inString = false
    let quote = ""
    let escaped = false
    let block = ""

    while (cursor < source.length && depth > 0) {
      const char = source[cursor]
      block += char

      if (inString) {
        if (escaped) {
          escaped = false
        } else if (char === "\\") {
          escaped = true
        } else if (char === quote) {
          inString = false
          quote = ""
        }
      } else if (char === '"' || char === "'" || char === "`") {
        inString = true
        quote = char
      } else if (char === "{") {
        depth += 1
      } else if (char === "}") {
        depth -= 1
        if (depth === 0) {
          block = block.slice(0, -1)
        }
      }

      cursor += 1
    }

    blocks.push(block)
    searchIndex = cursor
  }

  return blocks
}

function extractStringField(block, field) {
  const match = block.match(new RegExp(`${field}:\\s*"([^"]+)"`))
  return match?.[1] ?? null
}

function extractKeywords(block) {
  const match = block.match(/keywords:\s*\[([\s\S]*?)\]/)
  if (!match) return []

  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) =>
    entry[1]
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
  )
}

function unique(list) {
  return [...new Set(list.filter(Boolean))]
}

function toKeywordQuestion(keyword) {
  if (keyword.includes("how to")) return keyword.replace(/\?+$/, "") + "?"

  if (
    keyword.includes("generator") ||
    keyword.includes("formatter") ||
    keyword.includes("converter") ||
    keyword.includes("checker") ||
    keyword.includes("calculator")
  ) {
    return `how to use ${keyword} online?`
  }

  return `what is ${keyword}?`
}

function csvEscape(value) {
  const normalized = String(value ?? "")
  if (normalized.includes(",") || normalized.includes('"') || normalized.includes("\n")) {
    return `"${normalized.replace(/"/g, '""')}"`
  }
  return normalized
}

const source = fs.readFileSync(toolsConfigPath, "utf8")
const blocks = extractCreateToolBlocks(source)

const tools = blocks
  .map((block) => {
    const id = extractStringField(block, "id")
    const name = extractStringField(block, "name")
    const status = extractStringField(block, "status") ?? "live"

    if (!id || !name) return null
    if (status === "preview") return null

    const keywords = unique(extractKeywords(block))
    return { id, name, keywords }
  })
  .filter(Boolean)

const toolRows = tools
  .map((tool) => {
    const metrics = PRIORITY_METRICS[tool.id] ?? null
    const primaryKeyword =
      metrics?.primaryKeyword ??
      tool.keywords[0] ??
      tool.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")

    const longTail = unique(
      tool.keywords.filter((keyword) => keyword !== primaryKeyword)
    ).slice(0, 5)

    while (longTail.length < 5) {
      const fallback = [
        `${primaryKeyword} online`,
        `free ${primaryKeyword}`,
        `${primaryKeyword} no signup`,
        `${primaryKeyword} browser tool`,
        `${primaryKeyword} instant results`,
      ][longTail.length]
      if (!longTail.includes(fallback) && fallback !== primaryKeyword) {
        longTail.push(fallback)
      }
    }

    const featuredSnippetQuestion = toKeywordQuestion(primaryKeyword)
    const peopleAlsoAsk = [
      `is ${primaryKeyword} free?`,
      `is ${primaryKeyword} safe to use?`,
      `what is the best way to use ${primaryKeyword}?`,
    ]

    return {
      tool_id: tool.id,
      primary_keyword: primaryKeyword,
      volume: metrics?.volume ?? "tbd",
      kd: metrics?.kd ?? "tbd",
      longtail_keywords: longTail.join(" | "),
      featured_snippet_question: featuredSnippetQuestion,
      people_also_ask_questions: peopleAlsoAsk.join(" | "),
    }
  })
  .sort((a, b) => {
    const ai = PRIORITY_TOOL_IDS.indexOf(a.tool_id)
    const bi = PRIORITY_TOOL_IDS.indexOf(b.tool_id)

    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return a.tool_id.localeCompare(b.tool_id)
  })

const headers = [
  "tool_id",
  "primary_keyword",
  "volume",
  "kd",
  "longtail_keywords",
  "featured_snippet_question",
  "people_also_ask_questions",
]

const csvLines = [
  headers.join(","),
  ...toolRows.map((row) =>
    headers.map((header) => csvEscape(row[header])).join(",")
  ),
]

fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(outputPath, `${csvLines.join("\n")}\n`, "utf8")

console.log(`Generated ${toolRows.length} tool rows: ${path.relative(process.cwd(), outputPath)}`)

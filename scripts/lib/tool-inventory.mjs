import fs from "node:fs"
import path from "node:path"

const toolsConfigRelativePath = "src/lib/tools/tools-config.ts"
const toolExpansionRelativePath = "src/lib/tools/tool-expansion.ts"
const expansionToolIdsRelativePath = "src/lib/tools/expansion-tool-ids.ts"

function readFile(repoRoot, relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8")
}

function extractCreateToolBlocks(source) {
  const token = "createTool({"
  const blocks = []
  let searchIndex = 0

  while (true) {
    const start = source.indexOf(token, searchIndex)
    if (start === -1) {
      break
    }

    let cursor = start + token.length
    let depth = 1
    let inString = false
    let stringQuote = ""
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
        } else if (char === stringQuote) {
          inString = false
          stringQuote = ""
        }
      } else if (char === '"' || char === "'" || char === "`") {
        inString = true
        stringQuote = char
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

function extractArrayObjects(source, marker) {
  const markerIndex = source.indexOf(marker)
  if (markerIndex === -1) {
    return []
  }

  const equalsIndex = source.indexOf("=", markerIndex)
  if (equalsIndex === -1) {
    return []
  }

  const arrayStart = source.indexOf("[", equalsIndex)
  if (arrayStart === -1) {
    return []
  }

  const blocks = []
  let cursor = arrayStart + 1
  let objectStart = -1
  let depth = 0
  let inString = false
  let stringQuote = ""
  let escaped = false

  while (cursor < source.length) {
    const char = source[cursor]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === "\\") {
        escaped = true
      } else if (char === stringQuote) {
        inString = false
        stringQuote = ""
      }
    } else if (char === '"' || char === "'" || char === "`") {
      inString = true
      stringQuote = char
    } else if (char === "{") {
      if (depth === 0) {
        objectStart = cursor
      }
      depth += 1
    } else if (char === "}") {
      depth -= 1
      if (depth === 0 && objectStart !== -1) {
        blocks.push(source.slice(objectStart, cursor + 1))
        objectStart = -1
      }
    } else if (char === "]" && depth === 0) {
      break
    }

    cursor += 1
  }

  return blocks
}

function extractValue(block, fieldName) {
  return block.match(new RegExp(`${fieldName}:\\s*"([^"]+)"`))?.[1] ?? null
}

function loadExpansionToolIds(repoRoot) {
  const source = readFile(repoRoot, expansionToolIdsRelativePath)
  return new Set([...source.matchAll(/"([^"]+)"/g)].map((match) => match[1]))
}

export function loadConfiguredTools(repoRoot) {
  const source = readFile(repoRoot, toolsConfigRelativePath)
  const blocks = extractCreateToolBlocks(source)

  return blocks
    .map((block) => {
      const id = extractValue(block, "id")
      const name = extractValue(block, "name")
      const description = extractValue(block, "description")
      const category = extractValue(block, "category")
      const pageType = extractValue(block, "pageType") ?? "static"
      const status = extractValue(block, "status") ?? "live"

      if (!id || !name || !description || !category) {
        return null
      }

      return {
        id,
        name,
        description,
        category,
        path: `/tools/${id}`,
        pageType,
        status,
        source: toolsConfigRelativePath,
      }
    })
    .filter(Boolean)
}

export function loadPreviewTools(repoRoot) {
  const source = readFile(repoRoot, toolExpansionRelativePath)
  const blocks = extractArrayObjects(source, "export const toolExpansionIdeas")
  const implementedExpansionTools = loadExpansionToolIds(repoRoot)

  return blocks
    .map((block) => {
      const slug = extractValue(block, "slug")
      const name = extractValue(block, "name")
      const route = extractValue(block, "route")
      const category = extractValue(block, "category")
      const description = extractValue(block, "description")

      if (!slug || !name || !route || !category || !description) {
        return null
      }

      return {
        id: slug,
        name,
        description,
        category,
        path: route,
        pageType: "dynamic",
        status: implementedExpansionTools.has(slug) ? "live" : "preview",
        source: toolExpansionRelativePath,
      }
    })
    .filter(Boolean)
}

export function loadAllToolEntries(repoRoot) {
  const tools = [...loadConfiguredTools(repoRoot), ...loadPreviewTools(repoRoot)]
  const deduped = new Map()

  for (const tool of tools) {
    deduped.set(tool.id, tool)
  }

  return [...deduped.values()].sort((first, second) => first.name.localeCompare(second.name))
}

export function loadToolCategories(repoRoot) {
  const source = readFile(repoRoot, toolsConfigRelativePath)
  const blocks = extractArrayObjects(source, "export const toolCategories")

  return blocks
    .map((block) => {
      const id = extractValue(block, "id")
      const name = extractValue(block, "name")
      const description = extractValue(block, "description")

      if (!id || !name || !description) {
        return null
      }

      return {
        id,
        name,
        description,
      }
    })
    .filter(Boolean)
}

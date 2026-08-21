import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"

export const docsDirectory = path.join(process.cwd(), "docs")

export async function getDocSlugs(): Promise<string[]> {
  const slugs: string[] = []

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
        const rel = path
          .relative(docsDirectory, fullPath)
          .replace(/\\/g, "/")
          .replace(/\.(mdx?)$/, "")
        slugs.push(rel)
      }
    }
  }

  try {
    await walk(docsDirectory)
  } catch (e) {
    return []
  }

  return slugs.sort()
}

export async function getDocBySlug(slug: string) {
  const normalized = slug.replace(/^\//, "").replace(/\.mdx?$/, "")
  const candidates = [
    path.join(docsDirectory, `${normalized}.md`),
    path.join(docsDirectory, `${normalized}.mdx`),
    path.join(docsDirectory, normalized, "index.md"),
    path.join(docsDirectory, normalized, "README.md"),
  ]

  let fullPath = ""
  for (const p of candidates) {
    try {
      await fs.access(p)
      fullPath = p
      break
    } catch (e) {
      // ignore
    }
  }

  if (!fullPath) {
    throw new Error(`Document not found: ${slug}`)
  }

  const raw = await fs.readFile(fullPath, "utf-8")
  const { data, content } = matter(raw)

  return {
    slug: normalized,
    data: data ?? {},
    content,
  }
}

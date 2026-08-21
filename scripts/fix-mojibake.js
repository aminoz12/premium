/**
 * Repairs double-encoding mojibake (UTF-8 bytes that were decoded as Windows-1252
 * and re-saved as UTF-8). Self-guarding: only replaces runs of non-ASCII characters
 * that cleanly byte-decode back to valid UTF-8. Single correct accented chars / dashes
 * are left untouched because a 1-char run decodes to an invalid byte (U+FFFD) and is skipped.
 *
 * Usage:  node scripts/fix-mojibake.js          (dry run, reports only)
 *         node scripts/fix-mojibake.js --write   (applies changes)
 */
const fs = require("fs")
const path = require("path")

const WRITE = process.argv.includes("--write")
const ROOT = path.join(__dirname, "..", "src")
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".mdx"])

// Windows-1252 high range (0x80-0x9F) -> byte value. 0xA0-0xFF map 1:1 to U+00A0-U+00FF.
const CP1252 = {
  "€": 0x80, "‚": 0x82, "ƒ": 0x83, "„": 0x84, "…": 0x85,
  "†": 0x86, "‡": 0x87, "ˆ": 0x88, "‰": 0x89, "Š": 0x8a,
  "‹": 0x8b, "Œ": 0x8c, "Ž": 0x8e, "‘": 0x91, "’": 0x92,
  "“": 0x93, "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97,
  "˜": 0x98, "™": 0x99, "š": 0x9a, "›": 0x9b, "œ": 0x9c,
  "ž": 0x9e, "Ÿ": 0x9f,
}

function toByte(ch) {
  const c = ch.codePointAt(0)
  if (c <= 0xff) return c
  if (CP1252[ch] !== undefined) return CP1252[ch]
  return -1
}

// After repair we replace U+2011 (non-breaking hyphen) and U+00A0 (nbsp) with plain
// ASCII so titles/keywords stay clean and searchable.
function normalize(s) {
  return s.replace(/‑/g, "-").replace(/ /g, " ")
}

// A mojibake run must START with one of the UTF-8 lead bytes that actually occur
// in this codebase's corruption: Â (0xC2), Ã (0xC3), â (0xE2). Restricting the lead
// avoids false positives on legit standalone symbols like × (0xD7) or ÷ that can
// otherwise byte-decode with a following char into a valid-but-wrong sequence.
const LEAD_BYTES = new Set([0xc2, 0xc3, 0xe2])
// Continuation bytes in real UTF-8 multibyte sequences are 0x80-0xBF.
const isContinuation = (ch) => {
  const b = toByte(ch)
  return b >= 0x80 && b <= 0xbf
}

function fixString(input) {
  let out = ""
  let i = 0
  let changes = 0
  while (i < input.length) {
    const ch = input[i]
    if (!LEAD_BYTES.has(toByte(ch))) {
      out += ch
      i += ch.length // handle surrogate pairs safely
      continue
    }
    // Build a run: lead char followed by continuation chars (possibly multiple
    // lead+continuation groups, e.g. "â€‘â€‘" or "Ã©Ã¨").
    let run = ch
    let j = i + 1
    while (j < input.length) {
      const cj = input[j]
      if (isContinuation(cj) || LEAD_BYTES.has(toByte(cj))) {
        run += cj
        j += 1
      } else break
    }
    const bytes = Buffer.from([...run].map(toByte))
    const decoded = bytes.toString("utf8")
    if (run.length >= 2 && !decoded.includes("�") && decoded !== run) {
      out += normalize(decoded)
      changes += 1
    } else {
      out += run
    }
    i = j
  }
  return { out, changes }
}

function walk(dir, acc) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue
      walk(p, acc)
    } else if (EXTS.has(path.extname(name))) {
      acc.push(p)
    }
  }
  return acc
}

const files = walk(ROOT, [])
let totalFiles = 0
let totalRuns = 0
const samples = []

for (const file of files) {
  const original = fs.readFileSync(file, "utf8")
  if (!/[À-ÿŒ-Ÿ–-™€]/.test(original)) continue
  const { out, changes } = fixString(original)
  if (out !== original && changes > 0) {
    totalFiles += 1
    totalRuns += changes
    // collect a couple of sample line diffs for rendered SEO fields
    const oLines = original.split("\n")
    const nLines = out.split("\n")
    for (let k = 0; k < oLines.length && samples.length < 40; k++) {
      if (oLines[k] !== nLines[k] && /title:|description:|name:|alt:/.test(oLines[k])) {
        samples.push(
          `${path.relative(ROOT, file)}:${k + 1}\n  - ${oLines[k].trim()}\n  + ${nLines[k].trim()}`
        )
      }
    }
    if (WRITE) fs.writeFileSync(file, out, "utf8")
  }
}

console.log(`${WRITE ? "APPLIED" : "DRY RUN"} — files changed: ${totalFiles}, runs fixed: ${totalRuns}`)
console.log("\nSample rendered-string fixes (title/description/name/alt):\n")
console.log(samples.join("\n\n"))

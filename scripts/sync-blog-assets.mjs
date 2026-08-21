import { cpSync, existsSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"

// Blog profile images were previously sourced from src/app/blog/Blog/public/profiles.
// That directory no longer exists after the blog section was replaced with /blog-tools.
// Profiles are already committed to public/profiles, so no sync is needed.
const source = resolve("src/app/blog/Blog/public/profiles")
const destination = resolve("public/profiles")

if (existsSync(source)) {
  mkdirSync(destination, { recursive: true })
  cpSync(source, destination, { force: true, recursive: true })
}

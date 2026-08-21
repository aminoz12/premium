import { cpSync, existsSync, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"

function copyIntoStandalone(sourcePath, destinationPath) {
  const source = resolve(sourcePath)
  const destination = resolve(destinationPath)

  if (!existsSync(source)) {
    throw new Error(`Missing path: ${sourcePath}`)
  }

  mkdirSync(dirname(destination), { recursive: true })
  cpSync(source, destination, { force: true, recursive: true })
}

if (!existsSync(resolve(".next/standalone"))) {
  process.exit(0)
}

copyIntoStandalone(".next/static", ".next/standalone/.next/static")
copyIntoStandalone("public", ".next/standalone/public")

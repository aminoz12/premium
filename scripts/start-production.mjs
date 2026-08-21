import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { resolve } from "node:path"

const standaloneServerPath = resolve(".next/standalone/server.js")
const nextCliPath = resolve("node_modules", "next", "dist", "bin", "next")
const port = process.env.PORT?.trim() || "3000"
const hostname = process.env.HOSTNAME?.trim() || "0.0.0.0"

const commandConfig = existsSync(standaloneServerPath)
  ? {
      label: "standalone server",
      command: "node",
      args: [standaloneServerPath],
    }
  : {
      label: "next start",
      command: "node",
      args: [nextCliPath, "start", "--port", port, "--hostname", hostname],
    }

console.log(`[start-production] Launching ${commandConfig.label} on ${hostname}:${port}`)

const child = spawn(commandConfig.command, commandConfig.args, {
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: port,
    HOSTNAME: hostname,
  },
  shell: false,
  stdio: "inherit",
})

child.on("error", (error) => {
  console.error(error)
  process.exit(1)
})

child.on("close", (code, signal) => {
  if (signal) {
    process.exit(1)
  }

  process.exit(code ?? 1)
})

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    if (!child.killed) {
      child.kill(signal)
    }
  })
}

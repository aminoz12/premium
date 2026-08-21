import { spawn } from "node:child_process"
import { createWriteStream, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"

function fail(message) {
  console.error(message)
  process.exit(1)
}

const argv = process.argv.slice(2)
let logPath = ""
const extraEnv = {}
let index = 0

while (index < argv.length) {
  const arg = argv[index]

  if (arg === "--") {
    index += 1
    break
  }

  if (arg === "--log") {
    logPath = argv[index + 1] ?? ""
    index += 2
    continue
  }

  if (arg === "--env") {
    const assignment = argv[index + 1] ?? ""
    const separatorIndex = assignment.indexOf("=")

    if (separatorIndex <= 0) {
      fail(`Invalid --env value: ${assignment}`)
    }

    const key = assignment.slice(0, separatorIndex)
    const value = assignment.slice(separatorIndex + 1)
    extraEnv[key] = value
    index += 2
    continue
  }

  fail(`Unknown option: ${arg}`)
}

const command = argv[index]
const commandArgs = argv.slice(index + 1)

if (!logPath || !command) {
  fail("Usage: node scripts/run-with-log.mjs --log <file> [--env KEY=VALUE] -- <command> [args...]")
}

const normalizeCommandArgs = (cmd, args) => {
  if (cmd !== "next" || !args.includes("dev") || args.length === 0) {
    return args
  }

  const trailingArg = args[args.length - 1]
  const trailingLooksLikePort = /^\d+$/.test(trailingArg)

  if (!trailingLooksLikePort) {
    return args
  }

  const normalized = []

  for (let i = 0; i < args.length - 1; i += 1) {
    const arg = args[i]

    if (arg === "-p" || arg === "--port") {
      i += 1
      continue
    }

    normalized.push(arg)
  }

  normalized.push("--port", trailingArg)
  return normalized
}

const normalizedCommandArgs = normalizeCommandArgs(command, commandArgs)

const resolvedLogPath = resolve(logPath)
mkdirSync(dirname(resolvedLogPath), { recursive: true })
const logStream = createWriteStream(resolvedLogPath, { flags: "w" })

const forwardOutput = (chunk) => {
  process.stdout.write(chunk)
  logStream.write(chunk)
}

const child = spawn(command, normalizedCommandArgs, {
  env: { ...process.env, ...extraEnv },
  shell: true,
  stdio: ["inherit", "pipe", "pipe"],
})

child.stdout.on("data", forwardOutput)
child.stderr.on("data", forwardOutput)

child.on("error", (error) => {
  console.error(error)
  logStream.end()
  process.exit(1)
})

child.on("close", (code, signal) => {
  logStream.end()

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

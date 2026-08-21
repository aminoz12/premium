type WorkerRequest =
  | {
      id: string
      type: "format-json"
      payload: string
    }
  | {
      id: string
      type: "hash-text"
      payload: string
    }

type WorkerResponse =
  | {
      id: string
      ok: true
      result: string
    }
  | {
      id: string
      ok: false
      error: string
    }

const encoder = new TextEncoder()

async function hashText(value: string) {
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(value))
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const message = event.data

  try {
    if (message.type === "format-json") {
      const result = JSON.stringify(JSON.parse(message.payload), null, 2)
      const response: WorkerResponse = {
        id: message.id,
        ok: true,
        result,
      }
      self.postMessage(response)
      return
    }

    if (message.type === "hash-text") {
      const result = await hashText(message.payload)
      const response: WorkerResponse = {
        id: message.id,
        ok: true,
        result,
      }
      self.postMessage(response)
    }
  } catch (error) {
    const response: WorkerResponse = {
      id: message.id,
      ok: false,
      error: error instanceof Error ? error.message : "Worker task failed.",
    }
    self.postMessage(response)
  }
}

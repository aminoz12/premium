export function createToolWorker() {
  return new Worker(new URL("../../workers/tool-processor.worker.ts", import.meta.url))
}

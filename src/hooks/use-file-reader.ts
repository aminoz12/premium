"use client"

import * as React from "react"

interface FileReaderResult {
  content: string | ArrayBuffer | null
  loading: boolean
  error: string | null
}

interface FileValidationOptions {
  accept?: string[]
  maxSizeMb?: number
}

function validateFile(file: File, options?: FileValidationOptions) {
  if (!options) return null

  if (options.maxSizeMb && file.size > options.maxSizeMb * 1024 * 1024) {
    return `File is too large. Please keep it under ${options.maxSizeMb} MB.`
  }

  if (options.accept?.length) {
    const extension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`
    const matches = options.accept.some((type) => {
      if (type.startsWith(".")) return extension === type.toLowerCase()
      if (type.endsWith("/*")) return file.type.startsWith(type.replace("*", ""))
      return file.type === type
    })

    if (!matches) {
      return `Unsupported file type. Accepted types: ${options.accept.join(", ")}`
    }
  }

  return null
}

export function useFileReader() {
  const [result, setResult] = React.useState<FileReaderResult>({
    content: null,
    loading: false,
    error: null,
  })

  const readFile = React.useCallback(
    (
      file: File,
      method: "readAsText" | "readAsDataURL" | "readAsArrayBuffer",
      options?: FileValidationOptions
    ) => {
      const validationError = validateFile(file, options)

      if (validationError) {
        setResult({ content: null, loading: false, error: validationError })
        return
      }

      setResult({ content: null, loading: true, error: null })

      const reader = new FileReader()
      reader.onload = () => {
        setResult({ content: reader.result, loading: false, error: null })
      }
      reader.onerror = () => {
        setResult({
          content: null,
          loading: false,
          error: "Failed to read file. The file may be corrupted or inaccessible.",
        })
      }
      reader.onabort = () => {
        setResult({ content: null, loading: false, error: "File reading was cancelled." })
      }

      reader[method](file)
    },
    []
  )

  const readAsText = React.useCallback(
    (file: File, options?: FileValidationOptions) => readFile(file, "readAsText", options),
    [readFile]
  )

  const readAsDataURL = React.useCallback(
    (file: File, options?: FileValidationOptions) => readFile(file, "readAsDataURL", options),
    [readFile]
  )

  const readAsArrayBuffer = React.useCallback(
    (file: File, options?: FileValidationOptions) => readFile(file, "readAsArrayBuffer", options),
    [readFile]
  )

  const reset = React.useCallback(() => {
    setResult({ content: null, loading: false, error: null })
  }, [])

  return {
    ...result,
    readAsText,
    readAsDataURL,
    readAsArrayBuffer,
    reset,
  }
}

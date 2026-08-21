import { getToolById } from "@/lib/tools/tools-config"

export const SUPPORTED_LANGS = ["es"] as const
export type SupportedLang = (typeof SUPPORTED_LANGS)[number]

export const SPANISH_TOP_TOOL_IDS = [
  "qr-code-generator",
  "word-counter",
  "image-compressor",
  "password-generator",
  "color-picker",
  "json-formatter",
  "lorem-ipsum",
  "base64-encoder",
  "regex-tester",
  "uuid-generator",
  "bcrypt",
  "jwt-decoder",
  "markdown-to-html",
  "box-shadow",
  "color-contrast-checker",
  "css-gradient",
  "diff-checker",
  "url-encoder",
  "hash-generator",
  "sql-formatter",
] as const

export const spanishHomeCopy = {
  title: "Herramientas online gratis para tareas diarias",
  description:
    "Usa más de 200 herramientas gratuitas desde tu navegador: sin registro, sin descarga y con resultados instantáneos.",
  ctaBrowseAll: "Ver todas las herramientas",
  ctaOpenTool: "Abrir herramienta",
  topToolsHeading: "20 herramientas destacadas",
  topToolsDescription:
    "Estas páginas están localizadas en español para captar búsquedas long-tail internacionales.",
}

type SpanishToolCopy = {
  title: string
  description: string
  quickAnswer: string
}

export function getSpanishToolCopy(toolId: string): SpanishToolCopy | null {
  const tool = getToolById(toolId)
  if (!tool) return null

  return {
    title: `${tool.name} gratis en línea (guía en español)`,
    description:
      `Aprende cómo usar ${tool.name} paso a paso, sin registro y directamente en el navegador. ` +
      `Incluye flujo rápido, recomendaciones y acceso inmediato a la herramienta.`,
    quickAnswer:
      `${tool.name} funciona mejor cuando usas un flujo claro: prepara el dato de entrada, ` +
      `aplica el ajuste principal y valida el resultado antes de compartir o publicar.`,
  }
}

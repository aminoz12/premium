import type { Metadata } from "next"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { DynamicToolLoader } from "@/components/tools/dynamic-tool-loader"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { JsonLd } from "@/components/seo/json-ld"
import { buildToolSchema, buildBreadcrumbSchema } from "@/lib/seo/schema"
import { getToolById } from "@/lib/tools/tools-config"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/er-diagram-maker`

export const metadata: Metadata = {
  title: "Free ER Diagram Maker Online — Entity Relationship, No Signup",
  description:
    "Create entity-relationship (ER) diagrams free online — drag-and-drop, Mermaid syntax, export to SVG/PNG. No signup, no download, no watermark. Browser-based ER diagram tool.",
  keywords: [
    "er diagram maker free",
    "er diagram generator online free",
    "entity relationship diagram online",
    "er diagram tool freeware",
    "er diagram maker online no signup",
    "eer diagram maker",
    "er diagram creator free",
    "free er diagram software online",
    "create er diagram online",
    "er diagram drawing tool free",
    "database diagram maker free",
    "er diagram generator ai",
    "er diagram program free 2026",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    title: "Free ER Diagram Maker Online — Entity Relationship, No Signup",
    description:
      "Draw ER diagrams with drag-and-drop nodes, Mermaid syntax, and SVG/PNG export. Free, no signup, browser-based.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  const tool = getToolById("er-diagram-maker")
  return (
    <>
      {tool && (
        <JsonLd
          id="er-diagram-schema"
          data={[
            buildToolSchema(tool),
            buildBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Developer Tools", path: "/categories/developer" },
              { name: "ER Diagram Maker", path: "/tools/er-diagram-maker" },
            ]),
          ]}
        />
      )}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Free ER Diagram Maker — Draw Entity-Relationship Diagrams Online
      </h1>
      <QuickAnswer
        question="What is an ER diagram and what are the three types of relationships?"
        answer="An Entity-Relationship (ER) diagram maps the data model of a database: entities (tables), attributes (columns), and relationships between them. The three relationship types are: (1) One-to-One (1:1) — each record in Table A relates to exactly one in Table B (e.g. User ↔ Profile); (2) One-to-Many (1:N) — one record in A maps to many in B (e.g. Author → Books); (3) Many-to-Many (M:N) — multiple records on both sides (e.g. Students ↔ Courses), requiring a junction table."
      />
      <DynamicToolLoader category="developer" toolId="er-diagram-maker" />
    </>
  )
}

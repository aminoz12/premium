import type { Metadata } from "next"
import { ToolLayout } from "@/components/layout/tool-layout-server"
import { DynamicToolLoader } from "@/components/tools/dynamic-tool-loader"
import { QuickAnswer } from "@/components/seo/quick-answer"
import { JsonLd } from "@/components/seo/json-ld"
import { buildToolSchema, buildBreadcrumbSchema } from "@/lib/seo/schema"
import { getToolById } from "@/lib/tools/tools-config"

const SITE_URL = "https://www.thefreeaitools.com"
const TOOL_URL = `${SITE_URL}/tools/class-diagram-maker`

export const metadata: Metadata = {
  title: "Free Class Diagram Maker Online — UML, No Signup, No Download",
  description:
    "Create UML class diagrams free online — drag-and-drop classes, define attributes and methods, draw inheritance and composition. No signup, no download, export to SVG/PNG.",
  keywords: [
    "class diagram maker",
    "class diagram online free",
    "uml class diagram maker online",
    "class diagram generator free",
    "class diagram creator online",
    "class diagram tool free",
    "free class diagram software online",
    "class diagram no signup",
    "draw class diagram online",
    "class diagram maker 2026",
    "uml diagram tool free online",
    "class diagram with inheritance free",
  ],
  alternates: { canonical: TOOL_URL },
  openGraph: {
    title: "Free Class Diagram Maker Online — UML, No Signup",
    description:
      "Draw UML class diagrams with inheritance, composition, aggregation, and association. Drag-and-drop, Mermaid syntax, SVG/PNG export. Free, no signup.",
    type: "website",
    url: TOOL_URL,
    siteName: "TheFreeAITools",
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  const tool = getToolById("class-diagram-maker")
  return (
    <>
      {tool && (
        <JsonLd
          id="class-diagram-schema"
          data={[
            buildToolSchema(tool),
            buildBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Developer Tools", path: "/categories/developer" },
              { name: "Class Diagram Maker", path: "/tools/class-diagram-maker" },
            ]),
          ]}
        />
      )}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Free Class Diagram Maker — UML, Mermaid & SVG Export Online
      </h1>
      <QuickAnswer
        question="What are the main components of a UML class diagram?"
        answer="A UML class diagram has three main components: (1) Classes — boxes divided into three sections: class name (top), attributes (middle), and methods (bottom); (2) Relationships — inheritance (solid line + hollow arrow), composition (filled diamond), aggregation (open diamond), association (solid line), dependency (dashed arrow), and realization (dashed + hollow arrow); (3) Multiplicity — numbers on relationship ends showing cardinality (1, 0..*, 1..n). Use this tool to draw and export class diagrams as SVG or PNG."
      />
      <DynamicToolLoader category="developer" toolId="class-diagram-maker" />
   </>
  )
}

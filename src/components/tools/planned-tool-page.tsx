import Link from "next/link"
import { Lightbulb, Rocket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getToolExpansionIdea } from "@/lib/tools/tool-expansion"
import { getCategoryById, getToolById } from "@/lib/tools/tools-config"

export function PlannedToolPage({ toolId }: { toolId: string }) {
  const tool = getToolById(toolId)
  const idea = getToolExpansionIdea(toolId)
  const category = tool ? getCategoryById(tool.category) : undefined

  if (!tool || !idea) {
    return null
  }

  return (
    <article className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Rocket className="h-5 w-5 text-primary" />
            Planned experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>{idea.description}</p>
          <p>
            This route is already live for internal navigation and product planning. The interactive
            implementation is staged so The Free AI Tools can expand responsibly without
            compromising privacy, accessibility, or performance, and the page stays out of search
            results until the full experience is ready.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Complexity: {idea.complexity}</Badge>
            <Badge variant="outline">Est. build time: {idea.estimatedHours}h</Badge>
            <Badge variant="outline">Uniqueness score: {idea.uniquenessScore}/10</Badge>
            <Badge variant="outline">Monetization fit: {idea.monetizationFit}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Privacy model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>{idea.privacyModel}</p>
            <p>
              That matches the browser-first philosophy behind The Free AI Tools: keep user input local, avoid
              unnecessary requests, and make offline support practical after the first load.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target users</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {idea.targetUsers.map((user) => (
                <li key={user}>- {user}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planned capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 md:grid-cols-2">
            {idea.featureList.map((feature) => (
              <li
                key={feature}
                className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground"
              >
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Implementation approach</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {idea.techImplementation.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Educational value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {idea.educationPoints.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why this stands out</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>{idea.uniqueness}</p>
          <p>
            In the meantime, you can explore live tools in{" "}
            <Link
              href={`/categories/${tool.category}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {category?.name ?? tool.category}
            </Link>{" "}
            while this expansion page keeps navigation and product direction moving toward the next
            release wave.
          </p>
        </CardContent>
      </Card>

      <section aria-labelledby={`${tool.id}-faq`} className="space-y-4">
        <h2 id={`${tool.id}-faq`} className="text-2xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>

        <div className="space-y-4">
          {idea.faq.map((item) => (
            <Card key={item.question}>
              <CardHeader>
                <CardTitle className="text-lg">{item.question}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">
                {item.answer}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </article>
  )
}

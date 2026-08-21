type Props = { params: { slug: string } }

export default function EmbeddedToolPage({ params }: Props) {
  const { slug } = params
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Embedded Tool: {slug}</h1>
      <p className="mt-4 text-sm text-muted-foreground">Placeholder dynamic route for embedded tools.</p>
    </main>
  )
}

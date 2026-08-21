import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { question, pdfText, history, sessionId } = await req.json();

  // Validate session ID format — must be a UUID generated client-side
  if (!sessionId || typeof sessionId !== "string" || sessionId.length < 8) {
    return new Response(JSON.stringify({ error: "Invalid session" }), { status: 400 });
  }

  // Validate inputs
  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Question is required" }), { status: 400 });
  }
  if (!pdfText || typeof pdfText !== "string" || pdfText.trim().length === 0) {
    return new Response(JSON.stringify({ error: "PDF text is required" }), { status: 400 });
  }

  const truncated = pdfText.slice(0, 80000);

  const systemPrompt = `You are a helpful assistant. Answer questions based only on this PDF content:\n\n${truncated}`;

  const safeHistory = Array.isArray(history)
    ? (history as { role: string; content: string }[]).filter(
      (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
    )
    : [];

  const messages = [
    { role: "system", content: systemPrompt },
    ...safeHistory,
    { role: "user", content: question.slice(0, 2000) },
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY2}`,
      "HTTP-Referer": "https://www.thefreeaitools.com",
      // Pass session ID for OpenRouter logs — never stored on our side
      "X-Title": `chat-pdf-session-${sessionId.slice(0, 8)}`,
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return new Response(JSON.stringify({ error: err }), { status: 500 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                controller.enqueue(new TextEncoder().encode(delta));
              }
            } catch {
              // skip malformed SSE lines
            }
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      // Prevent any caching — each response belongs to one session only
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "Pragma": "no-cache",
      "Vary": "*",
    },
  });
}

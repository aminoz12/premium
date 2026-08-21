import { submitUrlsToIndexNow } from '@/lib/indexnow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const urls: string[] = body.urls || [];

    if (!urls.length) {
      return new Response(JSON.stringify({ error: 'No URLs provided in body.urls array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await submitUrlsToIndexNow(urls);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Invalid request' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

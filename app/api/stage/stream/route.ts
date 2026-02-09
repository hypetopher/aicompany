import { getStageEvents, getStageSummary } from '../../../../src/api/stage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const write = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const tick = async () => {
        try {
          const [summary, events] = await Promise.all([getStageSummary(), getStageEvents(30)]);
          write('summary', summary);
          write('events', events);
          write('heartbeat', { ts: Date.now() });
        } catch (e) {
          write('error', { message: e instanceof Error ? e.message : String(e) });
        }
      };

      await tick();
      const id = setInterval(tick, 8000);

      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(id);
        controller.close();
      };

      // @ts-ignore
      controller.signal?.addEventListener?.('abort', close);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

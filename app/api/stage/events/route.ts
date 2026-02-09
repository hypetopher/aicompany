import { NextResponse } from 'next/server';
import { getStageEvents } from '../../../../src/api/stage';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get('limit') ?? 100);
    const before = url.searchParams.get('before') ?? undefined;
    const data = await getStageEvents(limit, before);
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

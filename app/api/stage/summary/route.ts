import { NextResponse } from 'next/server';
import { getStageSummary } from '../../../../src/api/stage';

export async function GET() {
  try {
    const data = await getStageSummary();
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

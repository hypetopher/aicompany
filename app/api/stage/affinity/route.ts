import { NextResponse } from 'next/server';
import { getSupabase } from '../../../../src/lib/supabase';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const agent = (url.searchParams.get('agent') ?? '').toLowerCase();
    const limit = Number(url.searchParams.get('limit') ?? 20);

    const sb = getSupabase() as any;
    let q = sb
      .from('ops_agent_affinities')
      .select('from_agent_id,to_agent_id,score,interactions,updated_at')
      .order('score', { ascending: false })
      .limit(limit);

    if (agent) q = q.eq('from_agent_id', agent);

    const { data, error } = await q;
    if (error) throw error;

    return NextResponse.json({ ok: true, data: data ?? [] });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const hasDbEnv = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = hasDbEnv
  ? createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })
  : null;

describe('integration: claim_one_step concurrency (db harness)', () => {
  it.skipIf(!hasDbEnv)('claims are unique across concurrent workers', async () => {
    const runTag = `test-claim-${Date.now()}`;

    const { data: mission, error: mErr } = await sb!
      .from('ops_missions')
      .insert({ title: runTag, created_by: 'test-runner', status: 'approved' })
      .select('id')
      .single();
    if (mErr) throw mErr;

    const missionId = mission.id as number;

    const steps = Array.from({ length: 20 }, (_, i) => ({
      mission_id: missionId,
      kind: 'analyze',
      payload: { idx: i },
      status: 'queued',
      run_after: new Date().toISOString(),
      idempotency_key: `${runTag}-step-${i}`,
    }));

    const { error: sErr } = await sb!.from('ops_mission_steps').insert(steps);
    if (sErr) throw sErr;

    const workers = Array.from({ length: 50 }, (_, i) =>
      sb!.rpc('claim_one_step', { p_worker_id: `${runTag}-w${i}` }),
    );

    const results = await Promise.all(workers);
    for (const r of results) if (r.error) throw r.error;

    const claimedIds = results
      .flatMap((r) => (r.data ?? []) as Array<{ id: number }>)
      .map((r) => r.id);

    const unique = new Set(claimedIds);

    // no duplicate claims among concurrent calls
    expect(unique.size).toBe(claimedIds.length);
    // cannot claim more than created steps
    expect(unique.size).toBeLessThanOrEqual(20);

    // cleanup
    await sb!.from('ops_mission_steps').delete().eq('mission_id', missionId);
    await sb!.from('ops_missions').delete().eq('id', missionId);
  });
});

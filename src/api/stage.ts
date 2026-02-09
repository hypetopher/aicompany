import { getSupabase } from '../lib/supabase.js';

export async function getStageSummary() {
  const { data, error } = await (getSupabase() as any).rpc('stage_summary');
  if (error) throw error;
  return data;
}

export async function getStageAgents() {
  const { data, error } = await (getSupabase() as any)
    .from('ops_agent_events')
    .select('agent_id, kind, summary, created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;

  const map = new Map<string, { id: string; statusLine: string; lastEventAt: string; affect: string; role: string; model: string }>();
  for (const row of data ?? []) {
    if (map.has(row.agent_id)) continue;
    map.set(row.agent_id, {
      id: row.agent_id,
      statusLine: row.summary ?? row.kind,
      lastEventAt: row.created_at,
      affect: inferAffect(row.summary ?? ''),
      role: inferRole(row.agent_id),
      model: inferModel(row.agent_id),
    });
  }
  return Array.from(map.values());
}

export async function getStageEvents(limit = 100, before?: string) {
  let q = (getSupabase() as any)
    .from('ops_agent_events')
    .select('id, agent_id, kind, title, summary, payload, created_at')
    .order('id', { ascending: false })
    .limit(limit);
  if (before) q = q.lt('id', Number(before));

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    timestamp: r.created_at,
    actor: r.agent_id,
    type: mapType(r.kind),
    title: r.title,
    summary: r.summary,
    relation: relationFromPayload(r.payload),
  }));
}

export async function getStageTasks(limit = 100) {
  const { data: missions, error: e1 } = await (getSupabase() as any)
    .from('ops_missions')
    .select('id, title, status, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (e1) throw e1;

  const missionIds = (missions ?? []).map((m: any) => m.id);
  if (missionIds.length === 0) return [];

  const { data: steps, error: e2 } = await (getSupabase() as any)
    .from('ops_mission_steps')
    .select('mission_id, status')
    .in('mission_id', missionIds);
  if (e2) throw e2;

  const grouped = new Map<number, { queued: number; running: number; succeeded: number; failed: number }>();
  for (const s of steps ?? []) {
    const g = grouped.get(s.mission_id) ?? { queued: 0, running: 0, succeeded: 0, failed: 0 };
    (g as any)[s.status] = ((g as any)[s.status] ?? 0) + 1;
    grouped.set(s.mission_id, g);
  }

  return (missions ?? []).map((m: any) => ({
    id: m.id,
    title: m.title,
    status: m.status,
    updatedAt: m.updated_at,
    progress: grouped.get(m.id) ?? { queued: 0, running: 0, succeeded: 0, failed: 0 },
  }));
}

function mapType(kind: string): 'pulse' | 'dialog' | 'event' {
  if (kind.includes('pulse')) return 'pulse';
  if (kind.includes('dialog')) return 'dialog';
  return 'event';
}

function relationFromPayload(payload: any): string | null {
  const from = payload?.fromAgent;
  const to = payload?.toAgent;
  if (from && to) return `${from} -> ${to}`;
  return null;
}

function inferAffect(s: string): string {
  const t = s.toLowerCase();
  if (t.includes('error') || t.includes('failed')) return 'concerned';
  if (t.includes('standby') || t.includes('quiet')) return 'lazy';
  if (t.includes('focus') || t.includes('analysis')) return 'focused';
  return 'neutral';
}
function inferRole(agentId: string): string {
  const roles: Record<string, string> = {
    minion: 'Chief of Staff',
    sage: 'Head of Research',
    scout: 'Head of Growth',
    quill: 'Creative Director',
    xalt: 'Social Media Director',
    observer: 'Operations Analyst',
  };
  return roles[agentId] ?? 'Agent';
}
function inferModel(agentId: string): string {
  const models: Record<string, string> = {
    minion: 'Claude Opus 4.6',
    sage: 'GPT-5.3 Codex',
    scout: 'GPT-5.2 Codex',
    quill: 'Claude Sonnet 4.5',
    xalt: 'Gemini 3 Pro',
    observer: 'GPT-5.3 Codex',
  };
  return models[agentId] ?? 'Unknown';
}

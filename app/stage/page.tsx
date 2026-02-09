'use client';

import { useEffect, useMemo, useState } from 'react';

type Summary = {
  missions: number;
  proposals: number;
  deploys: number;
  insights: number;
  events: number;
  lastEventAt: string | null;
  nextTickAt: string | null;
};

type Agent = { id: string; role: string; model: string; affect: string; statusLine: string; lastEventAt: string };
type EventRow = { id: number; timestamp: string; actor: string; type: 'pulse' | 'dialog' | 'event'; title: string; summary?: string; relation?: string | null };
type Task = { id: number; title: string; status: string; updatedAt: string; progress: { queued: number; running: number; succeeded: number; failed: number } };

const roleEmoji: Record<string, string> = {
  minion: '🧠',
  sage: '📊',
  scout: '🛰️',
  quill: '✍️',
  xalt: '📣',
  observer: '👁️',
};

export default function StagePage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tab, setTab] = useState<'live' | 'tasks' | 'social'>('live');
  const [serverNow, setServerNow] = useState<number>(Date.now());

  useEffect(() => {
    const load = async () => {
      const [s, a, e, t] = await Promise.all([
        fetch('/api/stage/summary').then((r) => r.json()),
        fetch('/api/stage/agents').then((r) => r.json()),
        fetch('/api/stage/events?limit=100').then((r) => r.json()),
        fetch('/api/stage/tasks?limit=100').then((r) => r.json()),
      ]);
      if (s.ok) setSummary(s.data);
      if (a.ok) setAgents(a.data);
      if (e.ok) setEvents(e.data);
      if (t.ok) setTasks(t.data);
    };

    load();

    const es = new EventSource('/api/stage/stream');
    es.addEventListener('summary', (ev) => {
      const data = JSON.parse((ev as MessageEvent).data);
      setSummary(data);
    });
    es.addEventListener('events', (ev) => {
      const data = JSON.parse((ev as MessageEvent).data) as EventRow[];
      setEvents(data);
    });
    es.addEventListener('heartbeat', (ev) => {
      const data = JSON.parse((ev as MessageEvent).data);
      setServerNow(data.ts ?? Date.now());
    });

    const pull = setInterval(load, 45000);
    const clock = setInterval(() => setServerNow((x) => x + 1000), 1000);

    return () => {
      clearInterval(pull);
      clearInterval(clock);
      es.close();
    };
  }, []);

  const grouped = useMemo(() => groupEvents(events), [events]);
  const nextInSec = useMemo(() => {
    if (!summary?.nextTickAt) return null;
    const d = Math.max(0, Math.floor((new Date(summary.nextTickAt).getTime() - serverNow) / 1000));
    return d;
  }, [summary?.nextTickAt, serverNow]);

  return (
    <main style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif', color: '#e5e7eb', background: '#0b1020', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 36, margin: 0 }}>The Stage</h1>
        <div style={{ fontSize: 13, opacity: 0.9 }}>
          <span style={{ marginRight: 14 }}>🟢 Live</span>
          <span>Next in {nextInSec ?? '--'}s</span>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 16, margin: '16px 0 18px 0' }}>
        <Stat label="MSN" value={summary?.missions ?? 0} />
        <Stat label="PRP" value={summary?.proposals ?? 0} />
        <Stat label="DPL" value={summary?.deploys ?? 0} />
        <Stat label="INS" value={summary?.insights ?? 0} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Tab active={tab === 'live'} onClick={() => setTab('live')} label="Live Feed" />
        <Tab active={tab === 'tasks'} onClick={() => setTab('tasks')} label="Tasks" />
        <Tab active={tab === 'social'} onClick={() => setTab('social')} label="Social" />
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        <div style={{ border: '1px solid #334155', borderRadius: 12, padding: 12 }}>
          <h3>Agents</h3>
          {agents.map((a) => (
            <div key={a.id} style={{ borderTop: '1px solid #1f2937', paddingTop: 10, marginTop: 10 }}>
              <strong>{roleEmoji[a.id] ?? '🤖'} {a.id}</strong> · {a.role}
              <div style={{ fontSize: 12, opacity: 0.9 }}>{a.model} · affect: {a.affect}</div>
              <div style={{ fontSize: 13 }}>{a.statusLine}</div>
            </div>
          ))}
        </div>

        <div style={{ border: '1px solid #334155', borderRadius: 12, padding: 12 }}>
          {tab === 'live' && (
            <>
              <h3>Live event feed</h3>
              {grouped.map((g, idx) => (
                <div key={`${g.actor}-${idx}`} style={{ borderTop: '1px solid #1f2937', padding: '8px 0' }}>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{g.actor} · {g.type} · {new Date(g.latestTs).toLocaleString()}</div>
                  <div><strong>{g.title}</strong></div>
                  <div>{g.summary}</div>
                  {g.moreCount > 0 && <div style={{ fontSize: 12, opacity: 0.8 }}>↓ {g.moreCount} more from {g.actor}</div>}
                </div>
              ))}
            </>
          )}

          {tab === 'tasks' && (
            <>
              <h3>Tasks</h3>
              {tasks.map((t) => (
                <div key={t.id} style={{ borderTop: '1px solid #1f2937', padding: '8px 0' }}>
                  <div><strong>{t.title}</strong> · {t.status}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    queued {t.progress.queued} · running {t.progress.running} · done {t.progress.succeeded} · failed {t.progress.failed}
                  </div>
                  <div style={{ height: 8, background: '#1f2937', borderRadius: 999, marginTop: 6 }}>
                    <div style={{
                      width: `${progressPct(t.progress)}%`,
                      height: 8,
                      borderRadius: 999,
                      background: '#22c55e',
                    }} />
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'social' && (
            <>
              <h3>Social</h3>
              {events.filter((e) => e.title.toLowerCase().includes('tweet')).slice(0, 30).map((e) => (
                <div key={e.id} style={{ borderTop: '1px solid #1f2937', padding: '8px 0' }}>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{new Date(e.timestamp).toLocaleString()} · {e.actor}</div>
                  <div><strong>{e.title}</strong></div>
                  <div>{e.summary}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function progressPct(p: Task['progress']) {
  const total = p.queued + p.running + p.succeeded + p.failed;
  if (total === 0) return 0;
  return Math.round((p.succeeded / total) * 100);
}

function groupEvents(events: EventRow[]) {
  const out: Array<{ actor: string; type: string; latestTs: string; title: string; summary: string; moreCount: number }> = [];
  const buckets = new Map<string, EventRow[]>();
  for (const e of events.slice(0, 120)) {
    const key = `${e.actor}|${e.type}|${e.title}`;
    const list = buckets.get(key) ?? [];
    list.push(e);
    buckets.set(key, list);
  }
  for (const [, list] of buckets) {
    const first = list[0];
    out.push({
      actor: first.actor,
      type: first.type,
      latestTs: first.timestamp,
      title: first.title,
      summary: first.summary ?? '',
      moreCount: Math.max(0, list.length - 1),
    });
  }
  return out
    .sort((a, b) => +new Date(b.latestTs) - +new Date(a.latestTs))
    .slice(0, 60);
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ border: '1px solid #334155', borderRadius: 10, padding: '8px 12px', minWidth: 82 }}>
      <div style={{ fontSize: 11, opacity: 0.8 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? '#1d4ed8' : '#0f172a',
        color: '#e5e7eb',
        border: '1px solid #334155',
        borderRadius: 10,
        padding: '8px 12px',
      }}
    >
      {label}
    </button>
  );
}

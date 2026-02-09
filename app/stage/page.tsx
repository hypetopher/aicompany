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

export default function StagePage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tab, setTab] = useState<'live' | 'tasks' | 'social'>('live');

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
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const liveEvents = useMemo(() => events.slice(0, 50), [events]);

  return (
    <main style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif', color: '#e5e7eb', background: '#0b1020', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>The Stage</h1>
      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <Stat label="MSN" value={summary?.missions ?? 0} />
        <Stat label="PRP" value={summary?.proposals ?? 0} />
        <Stat label="DPL" value={summary?.deploys ?? 0} />
        <Stat label="INS" value={summary?.insights ?? 0} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab('live')}>Live Feed</button>
        <button onClick={() => setTab('tasks')}>Tasks</button>
        <button onClick={() => setTab('social')}>Social</button>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        <div style={{ border: '1px solid #334155', borderRadius: 12, padding: 12 }}>
          <h3>Agents</h3>
          {agents.map((a) => (
            <div key={a.id} style={{ borderTop: '1px solid #1f2937', paddingTop: 10, marginTop: 10 }}>
              <strong>{a.id}</strong> · {a.role}
              <div style={{ fontSize: 12, opacity: 0.9 }}>{a.model} · affect: {a.affect}</div>
              <div style={{ fontSize: 13 }}>{a.statusLine}</div>
            </div>
          ))}
        </div>

        <div style={{ border: '1px solid #334155', borderRadius: 12, padding: 12 }}>
          {tab === 'live' && (
            <>
              <h3>Live event feed</h3>
              {liveEvents.map((e) => (
                <div key={e.id} style={{ borderTop: '1px solid #1f2937', padding: '8px 0' }}>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{new Date(e.timestamp).toLocaleString()} · {e.actor} · {e.type}</div>
                  <div><strong>{e.title}</strong></div>
                  {e.summary && <div>{e.summary}</div>}
                  {e.relation && <div style={{ fontSize: 12, opacity: 0.8 }}>{e.relation}</div>}
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
                </div>
              ))}
            </>
          )}

          {tab === 'social' && (
            <>
              <h3>Social</h3>
              {events.filter((e) => e.title.toLowerCase().includes('tweet')).slice(0, 30).map((e) => (
                <div key={e.id} style={{ borderTop: '1px solid #1f2937', padding: '8px 0' }}>
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ border: '1px solid #334155', borderRadius: 10, padding: '8px 12px', minWidth: 82 }}>
      <div style={{ fontSize: 11, opacity: 0.8 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

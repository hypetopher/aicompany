'use client';

import { useEffect, useMemo, useState } from 'react';
import '../components/stage-theme.css';

type Summary = { missions:number; proposals:number; deploys:number; insights:number; events:number; lastEventAt:string|null; nextTickAt:string|null };
type Agent = { id:string; role:string; model:string; affect:string; statusLine:string; lastEventAt:string };
type EventRow = { id:number; timestamp:string; actor:string; type:'pulse'|'dialog'|'event'; title:string; summary?:string; relation?:string|null };
type Task = { id:number; title:string; status:string; updatedAt:string; progress:{ queued:number; running:number; succeeded:number; failed:number } };

const avatars: Record<string, string> = {
  minion: '/agents/minion.png', sage: '/agents/sage.png', scout: '/agents/scout.png',
  quill: '/agents/quill.png', xalt: '/agents/xalt.png', observer: '/agents/observer.png',
};

export default function StagePage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tab, setTab] = useState<'live'|'tasks'|'social'>('live');
  const [serverNow, setServerNow] = useState<number>(Date.now());
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [affinityRows, setAffinityRows] = useState<Array<{from_agent_id:string;to_agent_id:string;score:number;interactions:number;updated_at:string}>>([]);

  useEffect(() => {
    const load = async () => {
      const [s,a,e,t] = await Promise.all([
        fetch('/api/stage/summary').then(r=>r.json()),
        fetch('/api/stage/agents').then(r=>r.json()),
        fetch('/api/stage/events?limit=180').then(r=>r.json()),
        fetch('/api/stage/tasks?limit=100').then(r=>r.json()),
      ]);
      if (s.ok) setSummary(s.data);
      if (a.ok) setAgents(a.data);
      if (e.ok) setEvents(e.data);
      if (t.ok) setTasks(t.data);
    };
    load();

    const es = new EventSource('/api/stage/stream');
    es.addEventListener('summary', ev => setSummary(JSON.parse((ev as MessageEvent).data)));
    es.addEventListener('events', ev => setEvents(JSON.parse((ev as MessageEvent).data)));
    es.addEventListener('heartbeat', ev => setServerNow(JSON.parse((ev as MessageEvent).data).ts ?? Date.now()));

    const pull = setInterval(load, 45000);
    const clock = setInterval(() => setServerNow(x => x + 1000), 1000);
    return () => { clearInterval(pull); clearInterval(clock); es.close(); };
  }, []);

  const nextInSec = useMemo(() => {
    if (!summary?.nextTickAt) return null;
    return Math.max(0, Math.floor((new Date(summary.nextTickAt).getTime() - serverNow)/1000));
  }, [summary?.nextTickAt, serverNow]);

  const grouped = useMemo(() => groupEvents(events), [events]);
  const timeline = useMemo(() => buildTimeline(tasks), [tasks]);
  const agentEvents = useMemo(() => {
    if (!activeAgent) return [];
    return events.filter(e => e.actor === activeAgent.id).slice(0, 20);
  }, [events, activeAgent]);

  useEffect(() => {
    if (!activeAgent) {
      setAffinityRows([]);
      return;
    }
    fetch(`/api/stage/affinity?agent=${encodeURIComponent(activeAgent.id)}&limit=12`)
      .then(r => r.json())
      .then(j => setAffinityRows(j.ok ? j.data : []))
      .catch(() => setAffinityRows([]));
  }, [activeAgent]);

  return (
    <main className="stage-wrap" style={{padding:24,fontFamily:'Inter,system-ui,sans-serif'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1 className="neon" style={{fontSize:36,margin:0}}>The Stage</h1>
        <div style={{fontSize:13,opacity:.95,display:'flex',gap:16}}>
          <span className="badge-live">Live</span>
          <span>Next in {nextInSec ?? '--'}s</span>
        </div>
      </header>

      <div style={{display:'flex',gap:12,margin:'16px 0'}}>
        <Stat label="MSN" value={summary?.missions ?? 0}/>
        <Stat label="PRP" value={summary?.proposals ?? 0}/>
        <Stat label="DPL" value={summary?.deploys ?? 0}/>
        <Stat label="INS" value={summary?.insights ?? 0}/>
      </div>

      <div style={{display:'flex',gap:8,marginBottom:14}}>
        <Tab label="Live Feed" active={tab==='live'} onClick={()=>setTab('live')}/>
        <Tab label="Tasks" active={tab==='tasks'} onClick={()=>setTab('tasks')}/>
        <Tab label="Social" active={tab==='social'} onClick={()=>setTab('social')}/>
      </div>

      <section style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:20}}>
        <div className="glass" style={{padding:12}}>
          <h3 style={{margin:'0 0 6px 0'}}>Agent Roster</h3>
          {agents.map(a => (
            <div key={a.id} className="agent-row" onClick={() => setActiveAgent(a)}>
              <img className="avatar" src={avatars[a.id] ?? '/favicon.ico'} alt={a.id} />
              <div>
                <strong>{a.id}</strong> · {a.role}
                <div style={{fontSize:12,color:'#9fb0da'}}>{a.model} · affect {a.affect}</div>
                <div style={{fontSize:13}}>{a.statusLine}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass" style={{padding:12}}>
          {tab==='live' && <>
            <h3 style={{marginTop:0}}>Live event feed</h3>
            {grouped.map((g,idx)=><FeedCard key={`${g.actor}-${idx}`} {...g}/>) }
          </>}

          {tab==='tasks' && <>
            <h3 style={{marginTop:0}}>Tasks</h3>
            <div className="timeline">
              {timeline.map(t => (
                <div className="timeline-card" key={t.id}>
                  <div><strong>{t.title}</strong> · {t.status}</div>
                  <div style={{fontSize:12,color:'#9fb0da'}}>updated {new Date(t.updatedAt).toLocaleString()}</div>
                  <div className="status-lane">
                    <div className="status-chip status-queued">Q {t.progress.queued}</div>
                    <div className="status-chip status-running">R {t.progress.running}</div>
                    <div className="status-chip status-succeeded">S {t.progress.succeeded}</div>
                    <div className="status-chip status-failed">F {t.progress.failed}</div>
                  </div>
                  <div style={{height:8,background:'#111a35',borderRadius:999,marginTop:8}}>
                    <div style={{height:8,width:`${progressPct(t.progress)}%`,borderRadius:999,background:'linear-gradient(90deg,#22c55e,#14b8a6)',transition:'width .5s ease'}}/>
                  </div>
                </div>
              ))}
            </div>
          </>}

          {tab==='social' && <>
            <h3 style={{marginTop:0}}>Social</h3>
            {events.filter(e=>e.title.toLowerCase().includes('tweet')).slice(0,40).map(e => (
              <FeedCard key={e.id} actor={e.actor} type={e.type} title={e.title} summary={e.summary ?? ''} latestTs={e.timestamp} moreCount={0} />
            ))}
          </>}
        </div>
      </section>

      {activeAgent && (
        <>
          <div className="drawer-backdrop" onClick={() => setActiveAgent(null)} />
          <aside className="drawer">
            <button onClick={() => setActiveAgent(null)} style={{float:'right'}}>Close</button>
            <h3>{activeAgent.id}</h3>
            <div className="muted">{activeAgent.role} · {activeAgent.model}</div>
            <p>{activeAgent.statusLine}</p>
            <h4>Recent activity</h4>
            {agentEvents.map(e => (
              <div key={e.id} style={{borderTop:'1px solid #24305a',padding:'8px 0'}}>
                <div className="muted">{new Date(e.timestamp).toLocaleString()} · {e.type}</div>
                <strong>{e.title}</strong>
                <div>{e.summary}</div>
              </div>
            ))}
            <h4>Affinity graph</h4>
            {affinityRows.length === 0 && <div className="muted">No affinity edges yet. Run `npm run affinity:update` after events exist.</div>}
            {affinityRows.map((r, i) => (
              <div key={`${r.from_agent_id}-${r.to_agent_id}-${i}`} style={{borderTop:'1px solid #24305a',padding:'8px 0'}}>
                <div><strong>{r.from_agent_id}</strong> → {r.to_agent_id}</div>
                <div className="muted">score {r.score} · interactions {r.interactions} · updated {new Date(r.updated_at).toLocaleString()}</div>
              </div>
            ))}
          </aside>
        </>
      )}
    </main>
  );
}

function FeedCard({actor,type,title,summary,latestTs,moreCount}:{actor:string;type:string;title:string;summary:string;latestTs:string;moreCount:number}) {
  return <div style={{borderTop:'1px solid #1a2446',padding:'8px 0'}}>
    <div style={{fontSize:12,color:'#96a8d3'}}>{actor} · {type} · {new Date(latestTs).toLocaleString()}</div>
    <div><strong>{title}</strong></div>
    <div>{summary}</div>
    {moreCount>0 && <div style={{fontSize:12,color:'#96a8d3'}}>↓ {moreCount} more from {actor}</div>}
  </div>;
}

function Stat({label,value}:{label:string;value:number}) { return <div className="glass" style={{padding:'8px 12px',minWidth:86}}><div style={{fontSize:11,color:'#9fb0da'}}>{label}</div><div style={{fontSize:20,fontWeight:700}}>{value}</div></div>; }
function Tab({label,active,onClick}:{label:string;active:boolean;onClick:()=>void}) { return <button onClick={onClick} style={{background:active?'#1d4ed8':'#0f172a',color:'#e5e7eb',border:'1px solid #334155',borderRadius:10,padding:'8px 12px'}}>{label}</button>; }

function progressPct(p: Task['progress']) { const total=p.queued+p.running+p.succeeded+p.failed; return total?Math.round((p.succeeded/total)*100):0; }
function buildTimeline(tasks: Task[]) { return [...tasks].sort((a,b)=>+new Date(b.updatedAt)-+new Date(a.updatedAt)).slice(0,20); }
function groupEvents(events: EventRow[]) {
  const out: Array<{actor:string;type:string;latestTs:string;title:string;summary:string;moreCount:number}> = [];
  const buckets = new Map<string, EventRow[]>();
  for (const e of events.slice(0,140)) {
    const key = `${e.actor}|${e.type}|${e.title}`;
    const list = buckets.get(key) ?? [];
    list.push(e); buckets.set(key,list);
  }
  for (const [,list] of buckets) {
    const first = list[0];
    out.push({actor:first.actor,type:first.type,latestTs:first.timestamp,title:first.title,summary:first.summary ?? '',moreCount:Math.max(0,list.length-1)});
  }
  return out.sort((a,b)=>+new Date(b.latestTs)-+new Date(a.latestTs)).slice(0,70);
}

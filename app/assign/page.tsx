'use client';

import { useState } from 'react';

const AGENTS = ['minion', 'sage', 'scout', 'quill', 'xalt', 'observer'];
const STEPS = ['analyze', 'write_content', 'draft_tweet', 'post_tweet'];

export default function AssignPage() {
  const [agentId, setAgentId] = useState('sage');
  const [title, setTitle] = useState('');
  const [stepKind, setStepKind] = useState('analyze');
  const [payloadText, setPayloadText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, title, stepKind, payloadText }),
      });
      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    } catch (err) {
      setResult(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 760, margin: '24px auto', padding: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>Assign Task to Agents Team</h1>
      <p>Create a proposal directly into the multi-agent loop.</p>

      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Agent
          <select value={agentId} onChange={(e) => setAgentId(e.target.value)} style={{ display: 'block', width: '100%', padding: 8 }}>
            {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>

        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Weekly competitor analysis" required style={{ display: 'block', width: '100%', padding: 8 }} />
        </label>

        <label>
          Step Kind
          <select value={stepKind} onChange={(e) => setStepKind(e.target.value)} style={{ display: 'block', width: '100%', padding: 8 }}>
            {STEPS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label>
          Payload / Topic (text or JSON)
          <textarea value={payloadText} onChange={(e) => setPayloadText(e.target.value)} rows={6} placeholder='text OR JSON e.g. {"target":"market trend"}' style={{ display: 'block', width: '100%', padding: 8 }} />
        </label>

        <button type="submit" disabled={loading} style={{ padding: '10px 14px' }}>
          {loading ? 'Submitting...' : 'Create Proposal'}
        </button>
      </form>

      {!!result && (
        <pre style={{ marginTop: 16, background: '#111827', color: '#e5e7eb', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
          {result}
        </pre>
      )}
    </main>
  );
}

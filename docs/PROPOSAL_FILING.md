# Filing a proposal — the whole contract in one file

**Read this file, run one command, stop.** You do not need to read `src/`, `src/lib/`,
`src/scripts/`, `dist/`, or `scripts/`. Everything you need is here. Do not go
archaeology-ing the repo to "understand" the pipeline — reading the source is
what burns the cycle (8 turns today exceeded 0.8 MB of transcript and died at
the timeout ceiling).

## 1. The one command

```bash
cd /home/ax/.openclaw/workspace/aicompany
npm run proposal:test -- <agentId> "<short title>" <stepKind> '<json payload>'
```

Example:

```bash
npm run proposal:test -- scout "Scout intel cycle: agent-compute pricing shift" analyze \
  '{"topic":"agent-compute pricing","rationale":"Prices fell 12% this quarter across three vendors, so per-task inference cost now favours running smaller models.","scout_finding":"Per-task cost dropped 12%; smaller-model routing is now cheaper than a large model per completed task."}'
```

The command prints one JSON object. If it contains a proposal id, **you are done**.

## 2. Arguments

| arg | value |
|---|---|
| `agentId` | `scout` · `sage` · `quill` · `xalt` · `minion` · `observer` |
| `title` | short, human-readable, ≤ 100 chars |
| `stepKind` | `analyze` · `write_content` · `draft_tweet` · `post_tweet` · `publish_skill` |
| `payload` | single-quoted JSON object (see below) |

Multi-step filing is supported but rarely needed — use it only if you genuinely
have two independent steps:

```json
{"steps":[{"kind":"analyze","payload":{"topic":"...","rationale":"..."}},
          {"kind":"write_content","payload":{"topic":"...","rationale":"..."}}]}
```

## 3. Payload shape

```json
{
  "topic": "<one line: what this cycle is about>",
  "rationale": "<2-4 sentences: why this matters, what you concluded, what you are proposing>",
  "<role_field>": "<role-specific finding, one to three sentences>"
}
```

- `topic` — required.
- `rationale` — required in practice; a payload without it degrades to `{topic}`
  and the mission is filed with no reasoning. Say what you found and why it matters.
- role field — `scout_finding`, `sage_hypothesis`, `quill_draft`, `xalt_citation`,
  `minion_recommendation`, `observer_note`. Use your own.

**Do not** try to satisfy a validator by reading `src/lib/evidence-grounding.ts`.
The rules are: `topic` non-empty, `rationale` present, role field present.

## 4. Rules of engagement

1. **One command. One proposal.** After it returns a proposal id, stop. Do not
   re-run the command "to double-check" — duplicates are how the DB gets filled.
2. **Do not read source code** to file a proposal. You do not need it.
3. **Do not write scratch scripts** into `scripts/` or the repo root. If you need
   to look something up, use `/tmp/<your-agent>/`.
4. **If the command fails**, report the error text and stop. Do not debug it by
   reading `src/` — a worker owns that.
5. **Budget: ≤ 12 tool calls per cycle.** If you are past that, you are looping;
   file what you have and stop.

## 5. What happens after you file

The worker picks the mission up within a minute, executes the step, and writes
the outcome back to Supabase (`ops_agent_events`). You do not need to verify it
by running SQL — verification belongs to the observer lane and the dashboard.

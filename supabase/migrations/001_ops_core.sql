-- Core closed-loop tables

create table if not exists ops_mission_proposals (
  id bigserial primary key,
  agent_id text not null,
  source text not null check (source in ('api','trigger','reaction')),
  title text not null,
  rationale text,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  reject_reason text,
  proposed_steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ops_missions (
  id bigserial primary key,
  proposal_id bigint references ops_mission_proposals(id) on delete set null,
  created_by text not null,
  title text not null,
  status text not null default 'approved' check (status in ('approved','running','succeeded','failed')),
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ops_mission_steps (
  id bigserial primary key,
  mission_id bigint not null references ops_missions(id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued','running','succeeded','failed')),
  worker_id text,
  idempotency_key text,
  run_after timestamptz not null default now(),
  attempts int not null default 0,
  last_error text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists idx_ops_mission_steps_idempotency on ops_mission_steps (idempotency_key) where idempotency_key is not null;
create index if not exists idx_ops_mission_steps_claim on ops_mission_steps (status, run_after, id);

create table if not exists ops_agent_events (
  id bigserial primary key,
  agent_id text not null,
  mission_id bigint references ops_missions(id) on delete set null,
  step_id bigint references ops_mission_steps(id) on delete set null,
  kind text not null,
  title text not null,
  summary text,
  tags text[] not null default '{}',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists ops_policy (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists ops_action_runs (
  id bigserial primary key,
  actor text not null,
  action text not null,
  success boolean not null,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into ops_policy(key, value)
values
  ('auto_approve', '{"enabled": true, "allowed_step_kinds": ["draft_tweet","crawl","analyze","write_content"]}'),
  ('x_daily_quota', '{"limit": 8, "enabled": true}'),
  ('content_policy', '{"enabled": true, "max_drafts_per_day": 8}')
on conflict (key) do nothing;

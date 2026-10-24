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
create or replace function claim_one_step(p_worker_id text)
returns table (
  id bigint,
  mission_id bigint,
  kind text,
  payload jsonb,
  attempts int
)
language plpgsql
as $$
begin
  return query
  with pick as (
    select s.id
    from ops_mission_steps s
    where s.status = 'queued'
      and s.run_after <= now()
    order by s.id asc
    for update skip locked
    limit 1
  )
  update ops_mission_steps s
  set status = 'running',
      attempts = s.attempts + 1,
      started_at = now(),
      updated_at = now(),
      worker_id = p_worker_id
  from pick
  where s.id = pick.id
  returning s.id, s.mission_id, s.kind, s.payload, s.attempts;
end;
$$;
create table if not exists ops_reaction_queue (
  id bigserial primary key,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','processed','ignored','failed')),
  attempts int not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);
create index if not exists idx_ops_reaction_queue_pending on ops_reaction_queue(status, id);

create table if not exists ops_social_posts (
  id bigserial primary key,
  platform text not null default 'x',
  external_post_id text,
  content text not null,
  status text not null default 'draft' check (status in ('draft','posted','failed')),
  author_agent_id text,
  mission_id bigint references ops_missions(id) on delete set null,
  step_id bigint references ops_mission_steps(id) on delete set null,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  posted_at timestamptz
);
create index if not exists idx_ops_social_posts_status on ops_social_posts(status, created_at desc);

create or replace function stage_summary()
returns jsonb
language sql
as $$
select jsonb_build_object(
  'missions', (select count(*) from ops_missions),
  'proposals', (select count(*) from ops_mission_proposals),
  'deploys', (select count(*) from ops_mission_steps where kind='deploy'),
  'insights', (select count(*) from ops_agent_events where kind='insight.generated'),
  'events', (select count(*) from ops_agent_events),
  'lastEventAt', (select max(created_at) from ops_agent_events),
  'nextTickAt', (now() + interval '1 minute')
);
$$;
create table if not exists ops_agent_affinities (
  id bigserial primary key,
  from_agent_id text not null,
  to_agent_id text not null,
  score int not null default 0,
  interactions int not null default 0,
  last_event_id bigint,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(from_agent_id, to_agent_id)
);

create index if not exists idx_affinity_from_to on ops_agent_affinities(from_agent_id, to_agent_id);
create index if not exists idx_affinity_score on ops_agent_affinities(score desc);

create or replace function upsert_affinity(
  p_from text,
  p_to text,
  p_delta int,
  p_event_id bigint default null
)
returns void
language plpgsql
as $$
begin
  if p_from is null or p_to is null or p_from = '' or p_to = '' or p_from = p_to then
    return;
  end if;

  insert into ops_agent_affinities(from_agent_id, to_agent_id, score, interactions, last_event_id)
  values(p_from, p_to, p_delta, 1, p_event_id)
  on conflict (from_agent_id, to_agent_id)
  do update set
    score = greatest(-100, least(100, ops_agent_affinities.score + excluded.score)),
    interactions = ops_agent_affinities.interactions + 1,
    last_event_id = coalesce(excluded.last_event_id, ops_agent_affinities.last_event_id),
    updated_at = now();
end;
$$;
create or replace function apply_affinity_decay(p_percent numeric default 0.02)
returns int
language plpgsql
as $$
declare
  v_count int;
begin
  update ops_agent_affinities
  set score = case
    when score > 0 then greatest(0, ceil(score * (1 - p_percent)))
    when score < 0 then least(0, floor(score * (1 - p_percent)))
    else 0
  end,
  updated_at = now()
  where score != 0;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create or replace function clamp_affinity_scores()
returns int
language plpgsql
as $$
declare
  v_count int;
begin
  update ops_agent_affinities
  set score = greatest(-100, least(100, score)),
      updated_at = now()
  where score < -100 or score > 100;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

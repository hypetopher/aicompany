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

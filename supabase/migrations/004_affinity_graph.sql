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

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

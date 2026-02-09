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
  updated_at = now();

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
      updated_at = now();
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

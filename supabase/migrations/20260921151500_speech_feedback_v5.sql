-- Add a bounded correction claim without changing the legacy RPC used by older deployments.
begin;
create or replace function public.claim_speech_feedback_v5(p_id uuid,p_user uuid,p_transcript text,p_revision boolean default false)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare a speech_attempts;
begin
  perform pg_advisory_xact_lock(hashtextextended('speech-budget',0));
  select * into a from speech_attempts where id=p_id and user_id=p_user and deleted_at is null for update;
  if not found then raise exception 'not_found'; end if;
  if a.status='processing' then return false; end if;
  if a.status='complete' and (not p_revision or a.transcript=p_transcript) then return false; end if;
  if a.status not in ('transcribed','complete') or a.feedback_calls>=3 then raise exception 'invalid_state'; end if;
  if length(p_transcript)<20 or length(p_transcript)>10000 then raise exception 'invalid_transcript'; end if;
  insert into speech_budget(day,calls) values(current_date,0) on conflict do nothing;
  if (select calls from speech_budget where day=current_date)>=200 then raise exception 'daily_limit'; end if;
  update speech_budget set calls=calls+1 where day=current_date;
  update speech_attempts set transcript=p_transcript,status='processing',feedback_calls=feedback_calls+1,updated_at=now() where id=p_id;
  return true;
end $$;
revoke all on function public.claim_speech_feedback_v5(uuid,uuid,text,boolean) from public,anon,authenticated;
grant execute on function public.claim_speech_feedback_v5(uuid,uuid,text,boolean) to service_role;
commit;

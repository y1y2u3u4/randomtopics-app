-- Dedicated RandomTopics only. Additive; old deployments retain the 2/40 RPC.
begin;
alter table public.speech_accounts add column if not exists return_trial_at timestamptz;
alter table public.speech_attempts add column if not exists allowance_kind text not null default 'standard';

create or replace function public.schedule_speech_return_trial()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
  -- One scheduled return per account, earned by a completed first-answer/retry
  -- pair in this release. A rating is not required. No retrospective grants.
  if new.status='complete' and old.status<>'complete' and new.previous_id is not null
    and new.usage->'context'->>'journeyVersion'='task_v1'
    and exists(select 1 from speech_attempts p where p.id=new.previous_id and p.user_id=new.user_id
      and p.previous_id is null and p.status='complete' and p.deleted_at is null and p.topic=new.topic
      and p.usage->'context'->>'journeyVersion'='task_v1') then
    update speech_accounts set return_trial_at=now()+interval '24 hours'
      where user_id=new.user_id and return_trial_at is null and not subscription_active
      and (select count(*) from speech_attempts where user_id=new.user_id and status<>'failed')<=2;
  end if;
  return new;
end $$;
revoke all on function public.schedule_speech_return_trial() from public,anon,authenticated;
create trigger speech_return_trial_completed after update of status on public.speech_attempts
  for each row execute function public.schedule_speech_return_trial();

create or replace function public.reserve_speech_attempt_v6(p_id uuid,p_user uuid,p_topic text,p_previous uuid,p_duration integer,p_network text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare a speech_accounts; used integer; allowance integer; old speech_attempts; paid boolean;
begin
  perform pg_advisory_xact_lock(hashtextextended('speech-budget',0));
  select * into old from speech_attempts where id=p_id;
  if found then
    if old.user_id<>p_user or old.topic<>p_topic or old.previous_id is distinct from p_previous then raise exception 'request_conflict'; end if;
    return false;
  end if;
  insert into speech_accounts(user_id) values(p_user) on conflict do nothing;
  select * into a from speech_accounts where user_id=p_user for update;
  update speech_attempts set status='failed', updated_at=now() where user_id=p_user and status in ('transcribing','processing') and updated_at<now()-interval '1 hour';
  paid := coalesce(a.subscription_active and a.period_end>now() and a.period_start<=now(),false);
  allowance := case when paid then 40 when a.return_trial_at<=now() then 3 else 2 end;
  select count(*) into used from speech_attempts where user_id=p_user and status<>'failed' and (not paid or created_at>=a.period_start);
  if used>=allowance then raise exception 'quota_exceeded'; end if;
  if p_previous is not null and not exists(select 1 from speech_attempts where id=p_previous and user_id=p_user and topic=p_topic and status='complete' and deleted_at is null) then raise exception 'invalid_previous'; end if;
  if (select count(*) from speech_attempts where network_hash=p_network and created_at>now()-interval '1 day')>=30 then raise exception 'daily_limit'; end if;
  insert into speech_budget(day,calls) values(current_date,0) on conflict do nothing;
  if (select calls from speech_budget where day=current_date)>=200 then raise exception 'daily_limit'; end if;
  update speech_budget set calls=calls+1 where day=current_date;
  insert into speech_attempts(id,user_id,topic,previous_id,duration,network_hash,allowance_kind)
    values(p_id,p_user,p_topic,p_previous,p_duration,p_network,case when not paid and allowance=3 and used=2 then 'return_trial' else 'standard' end);
  return true;
end $$;
revoke all on function public.reserve_speech_attempt_v6(uuid,uuid,text,uuid,integer,text) from public,anon,authenticated;
grant execute on function public.reserve_speech_attempt_v6(uuid,uuid,text,uuid,integer,text) to service_role;
commit;

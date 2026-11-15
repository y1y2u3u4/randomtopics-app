-- 2026-11-15: paid users are no longer blocked by the free daily caps (v7 stays for older deployments).
begin;

create or replace function public.reserve_speech_attempt_v8(p_id uuid,p_user uuid,p_topic text,p_previous uuid,p_duration integer,p_network text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare a speech_accounts; used integer; allowance integer; free integer; packs integer; old speech_attempts; paid boolean;
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
  free := case when a.return_trial_at<=now() then 3 else 2 end;
  select coalesce(sum(credits),0) into packs from speech_pack_grants where user_id=p_user;
  allowance := case when paid then 40 else free + packs end;
  select count(*) into used from speech_attempts where user_id=p_user and status<>'failed' and (not paid or created_at>=a.period_start);
  if used>=allowance then raise exception 'quota_exceeded'; end if;
  if p_previous is not null and not exists(select 1 from speech_attempts where id=p_previous and user_id=p_user and topic=p_topic and status='complete' and deleted_at is null) then raise exception 'invalid_previous'; end if;
  -- v8: the shared-network and site-wide free caps apply to free rounds only.
  -- Subscribers and pack holders have a bounded paid allowance, so they skip both.
  if not (paid or packs>0) and (select count(*) from speech_attempts where network_hash=p_network and created_at>now()-interval '1 day')>=30 then raise exception 'daily_limit'; end if;
  insert into speech_budget(day,calls) values(current_date,0) on conflict do nothing;
  if not (paid or packs>0) and (select calls from speech_budget where day=current_date)>=200 then raise exception 'daily_limit'; end if;
  update speech_budget set calls=calls+1 where day=current_date;
  insert into speech_attempts(id,user_id,topic,previous_id,duration,network_hash,allowance_kind)
    values(p_id,p_user,p_topic,p_previous,p_duration,p_network,
      case when paid then 'standard' when used>=free then 'pack' when free=3 and used=2 then 'return_trial' else 'standard' end);
  return true;
end $$;
revoke all on function public.reserve_speech_attempt_v8(uuid,uuid,text,uuid,integer,text) from public,anon,authenticated;
grant execute on function public.reserve_speech_attempt_v8(uuid,uuid,text,uuid,integer,text) to service_role;

commit;

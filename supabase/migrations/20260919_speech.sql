-- Run only in a dedicated RandomTopics Supabase project.
begin;
create table public.speech_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  customer_id text unique, subscription_id text unique,
  period_start timestamptz, period_end timestamptz,
  subscription_active boolean not null default false,
  billing_event_time bigint not null default 0
);
create table public.speech_attempts (
  id uuid primary key, user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null check (length(topic) between 1 and 700),
  previous_id uuid references public.speech_attempts(id) on delete set null,
  duration integer not null check (duration between 5 and 120),
  status text not null default 'transcribing' check (status in ('transcribing','transcribed','processing','complete','failed')),
  transcript text, feedback jsonb, usage jsonb not null default '{}'::jsonb,
  model text, network_hash text not null,
  feedback_calls integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index speech_attempts_owner on public.speech_attempts(user_id, created_at desc);
create index speech_attempts_budget on public.speech_attempts(created_at);
create table public.speech_budget (day date primary key, calls integer not null default 0);
alter table public.speech_accounts enable row level security;
alter table public.speech_attempts enable row level security;
alter table public.speech_budget enable row level security;
-- Client tokens have no direct database access. All ownership checks live in API routes.
revoke all on public.speech_accounts, public.speech_attempts, public.speech_budget from anon, authenticated;
grant all on public.speech_accounts, public.speech_attempts, public.speech_budget to service_role;

create function public.reserve_speech_attempt(p_id uuid,p_user uuid,p_topic text,p_previous uuid,p_duration integer,p_network text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare a speech_accounts; used integer; allowance integer; old speech_attempts;
begin
  perform pg_advisory_xact_lock(hashtextextended('speech-budget',0));
  select * into old from speech_attempts where id=p_id;
  if found then
    if old.user_id<>p_user or old.topic<>p_topic or old.previous_id is distinct from p_previous then raise exception 'request_conflict'; end if;
    return false;
  end if;
  insert into speech_accounts(user_id) values(p_user) on conflict do nothing;
  select * into a from speech_accounts where user_id=p_user for update;
  -- Expired work cannot consume quota forever, but still counts toward cost limits.
  update speech_attempts set status='failed', updated_at=now() where user_id=p_user and status in ('transcribing','processing') and updated_at<now()-interval '1 hour';
  allowance := case when a.subscription_active and a.period_end>now() and a.period_start<=now() then 40 else 2 end;
  select count(*) into used from speech_attempts where user_id=p_user and status<>'failed' and (allowance=2 or created_at>=a.period_start);
  if used>=allowance then raise exception 'quota_exceeded'; end if;
  if p_previous is not null and not exists(select 1 from speech_attempts where id=p_previous and user_id=p_user and topic=p_topic and status='complete' and deleted_at is null) then raise exception 'invalid_previous'; end if;
  if (select count(*) from speech_attempts where network_hash=p_network and created_at>now()-interval '1 day')>=30 then raise exception 'daily_limit'; end if;
  insert into speech_budget(day,calls) values(current_date,0) on conflict do nothing;
  if (select calls from speech_budget where day=current_date)>=200 then raise exception 'daily_limit'; end if;
  update speech_budget set calls=calls+1 where day=current_date;
  insert into speech_attempts(id,user_id,topic,previous_id,duration,network_hash) values(p_id,p_user,p_topic,p_previous,p_duration,p_network);
  return true;
end $$;
create function public.claim_speech_feedback(p_id uuid,p_user uuid,p_transcript text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare a speech_attempts;
begin
  perform pg_advisory_xact_lock(hashtextextended('speech-budget',0));
  select * into a from speech_attempts where id=p_id and user_id=p_user and deleted_at is null for update;
  if not found then raise exception 'not_found'; end if;
  if a.status in ('processing','complete') then return false; end if;
  if a.status<>'transcribed' or a.feedback_calls>=3 then raise exception 'invalid_state'; end if;
  if length(p_transcript)<20 or length(p_transcript)>10000 then raise exception 'invalid_transcript'; end if;
  insert into speech_budget(day,calls) values(current_date,0) on conflict do nothing;
  if (select calls from speech_budget where day=current_date)>=200 then raise exception 'daily_limit'; end if;
  update speech_budget set calls=calls+1 where day=current_date;
  update speech_attempts set transcript=p_transcript,status='processing',feedback_calls=feedback_calls+1,updated_at=now() where id=p_id;
  return true;
end $$;
revoke all on function public.reserve_speech_attempt(uuid,uuid,text,uuid,integer,text) from public,anon,authenticated;
revoke all on function public.claim_speech_feedback(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.reserve_speech_attempt(uuid,uuid,text,uuid,integer,text) to service_role;
grant execute on function public.claim_speech_feedback(uuid,uuid,text) to service_role;
commit;

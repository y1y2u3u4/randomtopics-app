-- Dedicated RandomTopics only. Additive.
-- Host Pass: presenter mode (fullscreen, timer, no repeats, no ads).
-- One row per paid Checkout session (30-day pass) or per subscription.
begin;

create table if not exists public.host_passes (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('pass30', 'monthly', 'yearly')),
  amount integer not null check (amount > 0),
  livemode boolean not null,
  expires_at timestamptz not null,
  event_time bigint not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists host_passes_owner on public.host_passes(user_id, expires_at);
alter table public.host_passes enable row level security;
revoke all on public.host_passes from anon, authenticated;
grant all on public.host_passes to service_role;

-- Idempotent: a paid 30-day pass session grants once. A pass bought while
-- another is still valid starts when the current one ends.
create or replace function public.grant_host_pass(p_session text, p_user uuid, p_amount integer, p_livemode boolean)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare v_start timestamptz;
begin
  perform pg_advisory_xact_lock(hashtext('host_pass:' || p_user::text));
  if exists(select 1 from host_passes where id = p_session) then return false; end if;
  select greatest(now(), coalesce(max(expires_at), now())) into v_start
    from host_passes where user_id = p_user and plan = 'pass30' and livemode = p_livemode;
  insert into host_passes(id,user_id,plan,amount,livemode,expires_at)
    values(p_session,p_user,'pass30',p_amount,p_livemode,v_start + interval '30 days');
  return true;
end $$;
revoke all on function public.grant_host_pass(text,uuid,integer,boolean) from public,anon,authenticated;
grant execute on function public.grant_host_pass(text,uuid,integer,boolean) to service_role;

-- Subscriptions: access runs to the end of the paid period. Ordered by the
-- Stripe event time so an old webhook never overwrites a newer state.
create or replace function public.sync_host_subscription(p_subscription text, p_user uuid, p_plan text, p_amount integer, p_livemode boolean, p_expires timestamptz, p_event bigint)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare v_new boolean;
begin
  v_new := not exists(select 1 from host_passes where id = p_subscription);
  insert into host_passes(id,user_id,plan,amount,livemode,expires_at,event_time)
    values(p_subscription,p_user,p_plan,p_amount,p_livemode,p_expires,p_event)
  on conflict (id) do update set expires_at = excluded.expires_at, event_time = excluded.event_time
    where host_passes.user_id = excluded.user_id and host_passes.event_time <= excluded.event_time;
  return v_new;
end $$;
revoke all on function public.sync_host_subscription(text,uuid,text,integer,boolean,timestamptz,bigint) from public,anon,authenticated;
grant execute on function public.sync_host_subscription(text,uuid,text,integer,boolean,timestamptz,bigint) to service_role;

commit;

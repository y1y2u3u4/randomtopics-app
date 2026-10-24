-- Dedicated RandomTopics only. Additive: new tables and functions, nothing existing changes.
-- Five subscription products (teacher warm-ups, team icebreaker bot, writing
-- journal, couples daily question, class roster wheel Pro) and their data.
-- Every table is service_role only; the app reads and writes through API routes.
begin;

-- One row per Stripe subscription. Access runs to the end of the paid period.
create table if not exists public.product_subscriptions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null check (product in ('teacher', 'bot', 'journal', 'couples', 'wheel')),
  plan text not null check (plan in ('monthly', 'yearly')),
  amount integer not null check (amount > 0),
  livemode boolean not null,
  expires_at timestamptz not null,
  event_time bigint not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists product_subscriptions_owner on public.product_subscriptions(user_id, product, expires_at);

-- Ordered by the Stripe event time so an old webhook never overwrites a newer state.
create or replace function public.sync_product_subscription(p_subscription text, p_user uuid, p_product text, p_plan text, p_amount integer, p_livemode boolean, p_expires timestamptz, p_event bigint)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare v_new boolean;
begin
  v_new := not exists(select 1 from product_subscriptions where id = p_subscription);
  insert into product_subscriptions(id,user_id,product,plan,amount,livemode,expires_at,event_time)
    values(p_subscription,p_user,p_product,p_plan,p_amount,p_livemode,p_expires,p_event)
  on conflict (id) do update set expires_at = excluded.expires_at, event_time = excluded.event_time
    where product_subscriptions.user_id = excluded.user_id and product_subscriptions.event_time <= excluded.event_time;
  return v_new;
end $$;
revoke all on function public.sync_product_subscription(text,uuid,text,text,integer,boolean,timestamptz,bigint) from public,anon,authenticated;
grant execute on function public.sync_product_subscription(text,uuid,text,text,integer,boolean,timestamptz,bigint) to service_role;

-- Team icebreaker bot: the customer's own incoming webhook (Slack, Discord, Teams workflow).
create table if not exists public.bot_channels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('slack', 'discord', 'teams')),
  webhook_url text not null check (length(webhook_url) between 20 and 600),
  label text not null default '' check (length(label) <= 60),
  category text not null check (length(category) between 1 and 30),
  frequency text not null check (frequency in ('daily', 'weekdays', 'weekly')),
  send_hour smallint not null check (send_hour between 0 and 23),
  timezone text not null check (length(timezone) between 1 and 64),
  trial_ends_at timestamptz not null,
  sent_count integer not null default 0,
  last_sent_at timestamptz,
  last_error text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists bot_channels_owner on public.bot_channels(user_id);
create index if not exists bot_channels_active on public.bot_channels(active) where active;

-- Writing journal: one entry per day.
create table if not exists public.journal_entries (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  prompt text not null check (length(prompt) <= 500),
  body text not null check (length(body) between 1 and 20000),
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- Couples daily question: a room for two; answers reveal when both answered.
create table if not exists public.couple_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Za-z0-9]{10,16}$'),
  owner_id uuid not null references auth.users(id) on delete cascade,
  partner_id uuid references auth.users(id) on delete set null,
  lang text not null default 'en' check (lang in ('en', 'es')),
  timezone text not null check (length(timezone) between 1 and 64),
  created_at timestamptz not null default now(),
  check (partner_id is null or partner_id <> owner_id)
);
create index if not exists couple_rooms_owner on public.couple_rooms(owner_id);
create index if not exists couple_rooms_partner on public.couple_rooms(partner_id);
create table if not exists public.couple_answers (
  room_id uuid not null references public.couple_rooms(id) on delete cascade,
  day date not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  answer text not null check (length(answer) between 1 and 2000),
  created_at timestamptz not null default now(),
  primary key (room_id, day, user_id)
);

-- Class roster wheel Pro: saved rosters with draw state and history.
create table if not exists public.wheel_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(name) between 1 and 60),
  names jsonb not null default '[]'::jsonb check (jsonb_typeof(names) = 'array' and jsonb_array_length(names) <= 300),
  drawn jsonb not null default '[]'::jsonb check (jsonb_typeof(drawn) = 'array'),
  history jsonb not null default '[]'::jsonb check (jsonb_typeof(history) = 'array' and jsonb_array_length(history) <= 200),
  updated_at timestamptz not null default now()
);
create index if not exists wheel_lists_owner on public.wheel_lists(user_id, updated_at desc);

alter table public.product_subscriptions enable row level security;
alter table public.bot_channels enable row level security;
alter table public.journal_entries enable row level security;
alter table public.couple_rooms enable row level security;
alter table public.couple_answers enable row level security;
alter table public.wheel_lists enable row level security;
revoke all on public.product_subscriptions, public.bot_channels, public.journal_entries, public.couple_rooms, public.couple_answers, public.wheel_lists from anon, authenticated;
grant all on public.product_subscriptions, public.bot_channels, public.journal_entries, public.couple_rooms, public.couple_answers, public.wheel_lists to service_role;

commit;

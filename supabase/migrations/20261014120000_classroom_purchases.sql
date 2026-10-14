-- Dedicated RandomTopics only. Additive.
-- One-time classroom pack purchases (downloads, presenter mode, no ads).
begin;

create table if not exists public.classroom_purchases (
  session_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  pack text not null check (pack in ('question-of-the-day', 'debate', 'speech', 'all')),
  amount integer not null check (amount > 0),
  livemode boolean not null,
  email_sent boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists classroom_purchases_owner on public.classroom_purchases(user_id);
alter table public.classroom_purchases enable row level security;
revoke all on public.classroom_purchases from anon, authenticated;
grant all on public.classroom_purchases to service_role;

-- Idempotent: a Checkout session grants its pack once.
create or replace function public.grant_classroom_pack(p_session text, p_user uuid, p_pack text, p_amount integer, p_livemode boolean)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
  insert into classroom_purchases(session_id,user_id,pack,amount,livemode)
    values(p_session,p_user,p_pack,p_amount,p_livemode) on conflict (session_id) do nothing;
  return found;
end $$;
revoke all on function public.grant_classroom_pack(text,uuid,text,integer,boolean) from public,anon,authenticated;
grant execute on function public.grant_classroom_pack(text,uuid,text,integer,boolean) to service_role;

-- Exported PPTX/PDF files (not in the public repository). Private: only the
-- service role creates one-minute signed download links for owners.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('classroom-packs', 'classroom-packs', false, 20971520,
  array['application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'])
on conflict (id) do nothing;

commit;

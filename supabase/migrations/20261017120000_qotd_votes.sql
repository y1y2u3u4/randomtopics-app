-- Dedicated RandomTopics only. Additive.
-- Anonymous daily answer votes for the question of the day. No account, no
-- raw IP: the server stores keyed hashes of a per-browser id and of the IP.
begin;

create table if not exists public.qotd_votes (
  day date not null,
  question smallint not null check (question between 0 and 999),
  choice smallint not null check (choice between 0 and 4),
  voter text not null check (length(voter) = 64),
  ip_hash text not null check (length(ip_hash) = 64),
  created_at timestamptz not null default now(),
  primary key (day, question, voter)
);
create index if not exists qotd_votes_ip on public.qotd_votes(day, question, ip_hash);
alter table public.qotd_votes enable row level security;
revoke all on public.qotd_votes from anon, authenticated;
grant all on public.qotd_votes to service_role;

create or replace function public.qotd_counts(p_day date, p_question smallint)
returns table(choice smallint, votes bigint) language sql stable security definer set search_path=public,pg_temp as $$
  select v.choice, count(*) from qotd_votes v where v.day = p_day and v.question = p_question group by v.choice;
$$;

-- One vote per browser per question and day (a later vote replaces it). At
-- most 30 browsers per IP hash, so a classroom or office still counts, but a
-- script cannot flood the results. Rows older than 45 days are removed.
create or replace function public.cast_qotd_vote(p_day date, p_question smallint, p_choice smallint, p_voter text, p_ip text)
returns table(choice smallint, votes bigint) language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if exists (select 1 from qotd_votes v where v.day = p_day and v.question = p_question and v.voter = p_voter) then
    update qotd_votes v set choice = p_choice where v.day = p_day and v.question = p_question and v.voter = p_voter;
  elsif (select count(*) from qotd_votes v where v.day = p_day and v.question = p_question and v.ip_hash = p_ip) < 30 then
    insert into qotd_votes(day, question, choice, voter, ip_hash) values (p_day, p_question, p_choice, p_voter, p_ip)
      on conflict do nothing;
  end if;
  if random() < 0.01 then delete from qotd_votes v where v.day < current_date - 45; end if;
  return query select * from qotd_counts(p_day, p_question);
end $$;
revoke all on function public.qotd_counts(date, smallint) from public, anon, authenticated;
revoke all on function public.cast_qotd_vote(date, smallint, smallint, text, text) from public, anon, authenticated;
grant execute on function public.qotd_counts(date, smallint) to service_role;
grant execute on function public.cast_qotd_vote(date, smallint, smallint, text, text) to service_role;

commit;

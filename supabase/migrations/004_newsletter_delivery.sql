-- Newsletter delivery foundation: lifecycle + manual send log.

create extension if not exists pgcrypto;

alter table public.subscribers
  add column if not exists status text default 'active',
  add column if not exists subscribed_at timestamptz default now(),
  add column if not exists unsub_token text default gen_random_uuid()::text,
  add column if not exists source text;

update public.subscribers
set
  email = lower(trim(email)),
  status = case when status = 'unsubscribed' then 'unsubscribed' else 'active' end,
  subscribed_at = coalesce(subscribed_at, now()),
  unsub_token = coalesce(nullif(unsub_token, ''), gen_random_uuid()::text);

with ranked as (
  select
    id,
    row_number() over (
      partition by lower(email)
      order by
        case when status = 'active' then 0 else 1 end,
        subscribed_at desc nulls last,
        id
    ) as rn
  from public.subscribers
)
delete from public.subscribers
using ranked
where public.subscribers.id = ranked.id
  and ranked.rn > 1;

alter table public.subscribers
  alter column status set default 'active',
  alter column status set not null,
  alter column subscribed_at set default now(),
  alter column subscribed_at set not null,
  alter column unsub_token set default gen_random_uuid()::text,
  alter column unsub_token set not null;

do $$
declare
  constraint_record record;
begin
  for constraint_record in
    select conname
    from pg_constraint
    where conrelid = 'public.subscribers'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.subscribers drop constraint if exists %I', constraint_record.conname);
  end loop;
end $$;

alter table public.subscribers
  add constraint subscribers_status_check
    check (status in ('active', 'unsubscribed'));

create unique index if not exists subscribers_email_lower_key
  on public.subscribers (lower(email));

create unique index if not exists subscribers_unsub_token_key
  on public.subscribers (unsub_token);

create table if not exists public.newsletter_sends (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  status text not null default 'sent' check (status in ('sent', 'failed')),
  subject text not null,
  recipient_count integer not null default 0,
  sent_at timestamptz not null default now(),
  error_message text
);

create unique index if not exists newsletter_sends_post_sent_key
  on public.newsletter_sends(post_id)
  where status = 'sent';

create index if not exists newsletter_sends_sent_at_idx
  on public.newsletter_sends(sent_at desc);

-- Homepage client logo selection.
-- About page can list all published client logos; homepage uses at most 8 selected logos.

alter table public.client_logos
  add column if not exists show_on_home boolean not null default false;

create index if not exists idx_client_logos_home_status_order
  on public.client_logos(status, show_on_home, display_order);

with first_home_logos as (
  select id
  from public.client_logos
  where status = 'published'
  order by display_order, name
  limit 8
)
update public.client_logos
set show_on_home = true,
    updated_at = now()
where id in (select id from first_home_logos)
  and show_on_home = false;

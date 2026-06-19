-- Event detail content for /su-kien/[slug].
-- Existing events remain compatible; empty arrays hide optional sections in UI.

alter table public.events
  add column if not exists description text,
  add column if not exists agenda_items text[] not null default '{}',
  add column if not exists audience_items text[] not null default '{}',
  add column if not exists cta_label text,
  add column if not exists cta_href text;

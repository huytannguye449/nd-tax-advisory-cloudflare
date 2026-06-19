-- Add optional public phone number for CMS people profiles.
-- Nullable so existing people records remain valid.

alter table public.people
  add column if not exists phone text;

alter table public.people
  drop constraint if exists people_phone_format_check;

alter table public.people
  add constraint people_phone_format_check
  check (
    phone is null
    or phone ~ '^\+?[0-9][0-9[:space:]().-]{7,19}$'
  );

comment on column public.people.phone is
  'Optional public contact phone number for CMS people profiles.';

-- Standardize meeting operations for booking requests and leads.
-- Meeting metadata is stored in dedicated columns, not message/internal notes.

alter table public.bookings
  add column if not exists meeting_type text default 'online',
  add column if not exists meeting_link text;

alter table public.leads
  add column if not exists meeting_type text default 'online',
  add column if not exists meeting_link text;

update public.bookings
set meeting_type = 'online'
where meeting_type is null or meeting_type not in ('online', 'offline');

update public.leads
set meeting_type = 'online'
where meeting_type is null or meeting_type not in ('online', 'offline');

update public.bookings
set status = 'pending'
where status is null
  or status = 'rescheduled'
  or status not in ('pending', 'confirmed', 'completed', 'cancelled');

update public.leads
set status = 'new'
where status is null
  or status not in ('new', 'contacted', 'qualified', 'closed', 'spam');

alter table public.bookings
  alter column meeting_type set default 'online',
  alter column meeting_type set not null;

alter table public.leads
  alter column meeting_type set default 'online',
  alter column meeting_type set not null;

do $$
declare
  constraint_record record;
begin
  for constraint_record in
    select conname
    from pg_constraint
    where conrelid = 'public.bookings'::regclass
      and contype = 'c'
      and (
        pg_get_constraintdef(oid) ilike '%status%'
        or pg_get_constraintdef(oid) ilike '%meeting_type%'
      )
  loop
    execute format('alter table public.bookings drop constraint if exists %I', constraint_record.conname);
  end loop;

  for constraint_record in
    select conname
    from pg_constraint
    where conrelid = 'public.leads'::regclass
      and contype = 'c'
      and (
        pg_get_constraintdef(oid) ilike '%status%'
        or pg_get_constraintdef(oid) ilike '%meeting_type%'
      )
  loop
    execute format('alter table public.leads drop constraint if exists %I', constraint_record.conname);
  end loop;
end $$;

alter table public.bookings
  add constraint bookings_meeting_type_check
    check (meeting_type in ('online', 'offline')),
  add constraint bookings_status_check
    check (status in ('pending', 'confirmed', 'completed', 'cancelled'));

alter table public.leads
  add constraint leads_meeting_type_check
    check (meeting_type in ('online', 'offline')),
  add constraint leads_status_check
    check (status in ('new', 'contacted', 'qualified', 'closed', 'spam'));

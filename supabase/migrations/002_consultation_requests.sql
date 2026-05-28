-- Consultation request flow for /dat-lich.
-- The public form creates a pending booking request first; admin confirms the actual schedule later.

alter table public.bookings
  add column if not exists services text[];

alter table public.bookings
  alter column scheduled_at drop not null;

alter table public.bookings
  alter column status set default 'pending';

create index if not exists idx_bookings_status_created_at
  on public.bookings(status, created_at desc);

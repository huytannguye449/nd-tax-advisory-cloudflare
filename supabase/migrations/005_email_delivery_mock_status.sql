-- Allow local/dev newsletter sends to be logged without marking them as real delivery.

do $$
declare
  constraint_record record;
begin
  for constraint_record in
    select conname
    from pg_constraint
    where conrelid = 'public.newsletter_sends'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.newsletter_sends drop constraint if exists %I', constraint_record.conname);
  end loop;
end $$;

alter table public.newsletter_sends
  add constraint newsletter_sends_status_check
    check (status in ('sent', 'failed', 'mocked'));

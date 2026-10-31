-- NEXORA V2 — Admin roles, owner backfill, and hardened signup trigger.
-- Idempotent: safe to re-run. Never stores any password/credential here.
-- Admin access is granted ONLY through Supabase Auth (dashboard) + this role flag.

-- 1) Ensure the role column exists with a safe default.
alter table public.profiles
  add column if not exists role text not null default 'student';

-- 2) Constrain allowed roles (guarded so re-runs never fail).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('admin', 'student'));
  end if;
end $$;

-- 3) Index for fast role lookups used by RLS policies.
create index if not exists profiles_role_idx on public.profiles (role);

-- 4) Security-definer helper so RLS policies can check admin without recursion.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

-- 5) Reaffirm the signup trigger. New users always default to 'student';
--    admin is granted later via the dashboard-created account + backfill below.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(public.profiles.full_name, ''), excluded.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6) Owner backfill. Promote the owner account to admin IF it already exists.
--    No-op until the owner auth user is created in the Supabase dashboard.
update public.profiles
  set role = 'admin'
  where lower(email) = lower('Musapcb3@gmail.com');

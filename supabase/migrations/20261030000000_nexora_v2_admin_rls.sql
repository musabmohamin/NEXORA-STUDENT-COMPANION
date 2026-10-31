-- NEXORA V2 — admin access hardening + v2 content columns.
-- Idempotent: safe to re-run. Contains NO credentials, passwords or secrets.
-- Admin access is granted ONLY through Supabase Auth (dashboard) + role flag.

-- 1) Admin helper (idempotent — redefined in case the baseline never ran) ---
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

-- 2) Optional v2 content columns -------------------------------------------
alter table public.projects
  add column if not exists project_type text default 'code_task',
  add column if not exists required_deliverables jsonb default '[]'::jsonb,
  add column if not exists level text;

alter table public.units
  add column if not exists objectives jsonb default '[]'::jsonb,
  add column if not exists estimated_time_minutes integer,
  add column if not exists status text default 'draft',
  add column if not exists order_index integer default 0;

alter table public.resources
  add column if not exists unit_id uuid references public.units (id) on delete cascade,
  add column if not exists resource_type text default 'pdf',
  add column if not exists author text,
  add column if not exists doi text,
  add column if not exists year integer,
  add column if not exists preview_url text;

-- 3) Platform settings (admin only writes, authenticated may read) ----------
create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.system_settings enable row level security;

drop policy if exists "system_settings_read" on public.system_settings;
create policy "system_settings_read" on public.system_settings
  for select to authenticated using (true);

drop policy if exists "system_settings_write_admin" on public.system_settings;
create policy "system_settings_write_admin" on public.system_settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 4) Admin read/write access to profiles -----------------------------------
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin" on public.profiles
  for select to authenticated using (public.is_admin());

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 5) Admin full CRUD across every managed content table --------------------
do $$
declare
  t text;
  managed text[] := array[
    'departments', 'academic_years', 'semesters', 'courses', 'units',
    'resources', 'projects', 'enrollments', 'unit_progress', 'submissions',
    'submission_versions', 'submission_files', 'announcements', 'applications',
    'collaboration_posts', 'join_requests', 'points_rules',
    'points_transactions', 'notifications', 'chat_messages', 'audit_log'
  ];
begin
  foreach t in array managed loop
    execute format('drop policy if exists %I on public.%I', 'nexora_admin_all_' || t, t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      'nexora_admin_all_' || t, t
    );
  end loop;
end $$;

-- 6) Owner promotion (no-op until the owner auth user exists) --------------
--    Create the owner in the Supabase dashboard, then re-run this statement.
update public.profiles
  set role = 'admin'
  where lower(email) = lower('Musapcb3@gmail.com');
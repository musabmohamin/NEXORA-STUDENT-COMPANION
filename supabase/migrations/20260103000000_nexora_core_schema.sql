-- NEXORA core content schema. Creates every managed table the live data layer
-- (src/services/api.ts) reads/writes, with FKs and student-facing RLS.
-- Admin full-CRUD policies are added by the later nexora_v2_admin_rls migration.
-- Idempotent: safe to re-run.

-- 1) Extra profile columns used by the app (avatar, dept, preferred dept).
alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists department text,
  add column if not exists preferred_department_id uuid;

-- 2) Departments & academic structure -------------------------------------
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments (id) on delete cascade,
  name text not null,
  year_number integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.semesters (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years (id) on delete cascade,
  name text not null,
  semester_number integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  department_id uuid not null references public.departments (id) on delete cascade,
  semester_id uuid references public.semesters (id) on delete set null,
  title text not null,
  description text,
  difficulty text,
  prerequisites text,
  outcomes text[] default '{}',
  status text not null default 'published',
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  description text,
  kind text not null default 'lesson',
  order_index integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'general',
  course_id uuid references public.courses (id) on delete cascade,
  department_id uuid references public.departments (id) on delete cascade,
  storage_path text,
  url text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text,
  level text not null default 'Beginner',
  objectives text,
  requirements text,
  deliverables text,
  rubric jsonb,
  status text not null default 'published',
  deadline timestamptz,
  allow_late boolean default true,
  allow_retry boolean default true,
  revision_limit integer default 3,
  created_at timestamptz not null default now()
);

-- 3) Student activity ------------------------------------------------------
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create table if not exists public.unit_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  unit_id uuid not null references public.units (id) on delete cascade,
  completed boolean not null default true,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (student_id, unit_id)
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  reviewer_id uuid references public.profiles (id) on delete set null,
  status text not null default 'Not Started',
  score integer,
  github_url text,
  demo_url text,
  summary text,
  tech_stack text[] default '{}',
  testing_notes text,
  feedback text,
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_id, project_id)
);

create table if not exists public.submission_versions (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions (id) on delete cascade,
  version_number integer not null default 1,
  github_url text,
  summary text,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists public.submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions (id) on delete cascade,
  file_name text not null,
  mime_type text,
  storage_path text not null,
  uploaded_at timestamptz not null default now()
);

-- 4) Community & announcements --------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'news',
  description text,
  status text not null default 'published',
  featured boolean default false,
  external_url text,
  event_date timestamptz,
  deadline timestamptz,
  location text,
  image_url text,
  department_id uuid references public.departments (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid not null references public.announcements (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'Pending',
  motivation text,
  cv_url text,
  links text[] default '{}',
  created_at timestamptz not null default now(),
  unique (announcement_id, student_id)
);

create table if not exists public.collaboration_posts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  type text not null default 'study_group',
  description text,
  skills text[] default '{}',
  team_size integer default 3,
  filled integer default 1,
  status text not null default 'open',
  department_id uuid references public.departments (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.join_requests (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.collaboration_posts (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (post_id, student_id)
);

-- 5) Points, notifications, chat, audit ---------------------------------
create table if not exists public.points_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'general',
  points integer not null default 0,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.points_transactions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  rule_id uuid references public.points_rules (id) on delete set null,
  source_id text,
  points integer not null default 0,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text,
  type text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- 6) Link preferred_department_id now that departments exists.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_preferred_dept_fk'
  ) then
    alter table public.profiles
      add constraint profiles_preferred_dept_fk
      foreign key (preferred_department_id) references public.departments (id) on delete set null;
  end if;
end $$;

-- 7) Enable RLS on every content table.
do $$
declare t text;
begin
  foreach t in array array[
    'departments','academic_years','semesters','courses','units','resources',
    'projects','enrollments','unit_progress','submissions','submission_versions',
    'submission_files','announcements','applications','collaboration_posts',
    'join_requests','points_rules','points_transactions','notifications',
    'chat_messages','audit_log'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- 8) Student-facing policies. Browse tables: any authenticated user may read.
--    Personal tables: owner-scoped read/write. Admin full-CRUD added later.
drop policy if exists "nexora_browse_read" on public.departments;
create policy "nexora_browse_read" on public.departments for select to authenticated using (true);
drop policy if exists "nexora_browse_read" on public.academic_years;
create policy "nexora_browse_read" on public.academic_years for select to authenticated using (true);
drop policy if exists "nexora_browse_read" on public.semesters;
create policy "nexora_browse_read" on public.semesters for select to authenticated using (true);
drop policy if exists "nexora_browse_read" on public.courses;
create policy "nexora_browse_read" on public.courses for select to authenticated using (true);
drop policy if exists "nexora_browse_read" on public.units;
create policy "nexora_browse_read" on public.units for select to authenticated using (true);
drop policy if exists "nexora_browse_read" on public.resources;
create policy "nexora_browse_read" on public.resources for select to authenticated using (true);
drop policy if exists "nexora_browse_read" on public.projects;
create policy "nexora_browse_read" on public.projects for select to authenticated using (true);
drop policy if exists "nexora_browse_read" on public.announcements;
create policy "nexora_browse_read" on public.announcements for select to authenticated using (true);
drop policy if exists "nexora_browse_read" on public.points_rules;
create policy "nexora_browse_read" on public.points_rules for select to authenticated using (true);

-- enrollments
drop policy if exists "nexora_owner_enroll" on public.enrollments;
create policy "nexora_owner_enroll" on public.enrollments for all to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));

-- unit_progress
drop policy if exists "nexora_owner_progress" on public.unit_progress;
create policy "nexora_owner_progress" on public.unit_progress for all to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));

-- submissions
drop policy if exists "nexora_owner_submission" on public.submissions;
create policy "nexora_owner_submission" on public.submissions for all to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));

-- submission_versions
drop policy if exists "nexora_owner_subversion" on public.submission_versions;
create policy "nexora_owner_subversion" on public.submission_versions for all to authenticated
  using (exists (select 1 from public.submissions s
    where s.id = submission_id and s.student_id = (select auth.uid())))
  with check (exists (select 1 from public.submissions s
    where s.id = submission_id and s.student_id = (select auth.uid())));

-- submission_files
drop policy if exists "nexora_owner_subfile" on public.submission_files;
create policy "nexora_owner_subfile" on public.submission_files for all to authenticated
  using (exists (select 1 from public.submissions s
    where s.id = submission_id and s.student_id = (select auth.uid())))
  with check (exists (select 1 from public.submissions s
    where s.id = submission_id and s.student_id = (select auth.uid())));

-- applications
drop policy if exists "nexora_owner_application" on public.applications;
create policy "nexora_owner_application" on public.applications for all to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));

-- collaboration_posts
drop policy if exists "nexora_collab_read" on public.collaboration_posts;
create policy "nexora_collab_read" on public.collaboration_posts for select to authenticated using (true);
drop policy if exists "nexora_owner_collab" on public.collaboration_posts;
create policy "nexora_owner_collab" on public.collaboration_posts for all to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));

-- join_requests
drop policy if exists "nexora_owner_join" on public.join_requests;
create policy "nexora_owner_join" on public.join_requests for all to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));

-- points_transactions (read own; writes are admin-only via v2)
drop policy if exists "nexora_points_read" on public.points_transactions;
create policy "nexora_points_read" on public.points_transactions for select to authenticated
  using (student_id = (select auth.uid()));

-- notifications
drop policy if exists "nexora_notif_read" on public.notifications;
create policy "nexora_notif_read" on public.notifications for select to authenticated
  using (student_id = (select auth.uid()));
drop policy if exists "nexora_notif_update" on public.notifications;
create policy "nexora_notif_update" on public.notifications for update to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));

-- chat_messages
drop policy if exists "nexora_chat_rw" on public.chat_messages;
create policy "nexora_chat_rw" on public.chat_messages for all to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));

-- Durcissement sécurité (2026-10-09)

-- 1. Offres : rattachées à un utilisateur, visibles / modifiables uniquement par lui
alter table public.jobs add column if not exists user_id uuid references auth.users(id) on delete cascade default auth.uid();
drop policy if exists "Anyone can view jobs" on public.jobs;
drop policy if exists "Public jobs are viewable by everyone" on public.jobs;
drop policy if exists "Authenticated users can insert jobs" on public.jobs;
drop policy if exists "Authenticated users can update jobs" on public.jobs;
drop policy if exists "Authenticated users can delete jobs" on public.jobs;
create policy "Users manage own jobs" on public.jobs for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 2. Recruteurs : plus de lecture globale
drop policy if exists "Users can view all recruiters" on public.recruiters;
alter table public.recruiters alter column user_id set default auth.uid();
drop policy if exists "Users can manage own recruiters" on public.recruiters;
create policy "Users manage own recruiters" on public.recruiters for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. CV : lecture et upload limités au dossier de l'utilisateur (<user_id>/...)
drop policy if exists "CVs are publicly accessible" on storage.objects;
drop policy if exists "Users can upload CVs" on storage.objects;
create policy "Users can upload own CVs" on storage.objects for insert to authenticated
  with check (bucket_id = 'cvs' and (auth.uid())::text = (storage.foldername(name))[1]);

-- 4. Trigger de création de profil : search_path fixé, non appelable via l'API
alter function public.handle_new_user() set search_path = public;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- 5. Rôle admin déplacé dans app_metadata (non modifiable par l'utilisateur)
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where raw_user_meta_data->>'role' = 'admin';

-- 6. Aucun accès aux tables avant connexion
revoke all on public.jobs, public.applications, public.recruiters, public.agent_actions, public.webhook_config, public.user_profiles from anon;

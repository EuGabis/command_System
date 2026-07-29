-- Login/Perfil. Rode no SQL Editor do Supabase DEPOIS do schema.sql.

-- Perfil do usuário (1:1 com auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  empresa text not null default '',
  marca text not null default '',
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Cada usuário só enxerga/edita o próprio perfil
drop policy if exists "perfil_select_proprio" on profiles;
create policy "perfil_select_proprio" on profiles for select
  to authenticated using ((select auth.uid()) = id);

drop policy if exists "perfil_insert_proprio" on profiles;
create policy "perfil_insert_proprio" on profiles for insert
  to authenticated with check ((select auth.uid()) = id);

drop policy if exists "perfil_update_proprio" on profiles;
create policy "perfil_update_proprio" on profiles for update
  to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Cria a linha de perfil automaticamente quando um usuário é criado
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===== Storage: bucket de avatares =====
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Leitura pública dos avatares
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects for select
  using (bucket_id = 'avatars');

-- Upload/atualização/remoção só do próprio arquivo (prefixo = user id)
drop policy if exists "avatars_insert_proprio" on storage.objects;
create policy "avatars_insert_proprio" on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "avatars_update_proprio" on storage.objects;
create policy "avatars_update_proprio" on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "avatars_delete_proprio" on storage.objects;
create policy "avatars_delete_proprio" on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));

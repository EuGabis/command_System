-- Mídia nas mensagens, respostas rápidas e bucket de storage.
-- Rode no SQL Editor do Supabase.

-- 1) Mídia nas mensagens
alter table messages
  add column if not exists media_url text,
  add column if not exists media_type text,   -- image | audio | video | document
  add column if not exists media_name text;

-- 2) Respostas rápidas (templates do atendente)
create table if not exists quick_replies (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  texto text not null,
  created_at timestamptz not null default now()
);
-- RLS ligado: acesso só pelo servidor (service_role ignora RLS).
alter table quick_replies enable row level security;

-- 3) Bucket público para mídia do WhatsApp (URLs com nome aleatório)
insert into storage.buckets (id, name, public)
values ('whatsapp-media', 'whatsapp-media', true)
on conflict (id) do nothing;

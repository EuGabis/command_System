-- Toggle de IA por conversa (usado na tela de Conversas).
-- Rode no SQL Editor do Supabase.
alter table conversations
  add column if not exists ia_ativa boolean not null default true;

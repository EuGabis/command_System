-- Schema da Central de Comando. Rode no SQL Editor do Supabase.

create table if not exists channel_connections (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique check (platform in ('whatsapp','instagram')),
  -- credenciais criptografadas (AES-256-GCM) em JSON string cifrada
  credentials_encrypted text,
  verify_token text,
  status text not null default 'desconectado' check (status in ('desconectado','pendente','conectado','erro')),
  last_error text,
  updated_at timestamptz not null default now()
);

create table if not exists ai_config (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique check (platform in ('whatsapp','instagram')),
  persona text not null default 'Você é um atendente virtual simpático e prestativo.',
  tom text not null default 'profissional e cordial',
  modelo text not null default 'gpt-4o-mini',
  base_conhecimento text not null default '',
  regras_escalonamento text not null default '',
  ativo boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('whatsapp','instagram')),
  contato text not null,
  nome_contato text,
  status text not null default 'aberta' check (status in ('aberta','ia','humano','fechada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, contato)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  direcao text not null check (direcao in ('entrada','saida')),
  conteudo text not null,
  autor text not null default 'cliente', -- cliente | ia | humano
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_conv on messages(conversation_id, created_at);

-- Segurança: RLS ligado. O app acessa estas tabelas apenas pelo servidor
-- (service_role, que ignora RLS). Sem policies, os papéis anon/authenticated
-- ficam sem acesso via API pública.
alter table channel_connections enable row level security;
alter table ai_config enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- uma config de IA por canal
insert into ai_config (platform)
select 'whatsapp' where not exists (select 1 from ai_config where platform = 'whatsapp');
insert into ai_config (platform)
select 'instagram' where not exists (select 1 from ai_config where platform = 'instagram');

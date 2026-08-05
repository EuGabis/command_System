-- Fase 1 do CRM: etapas configuráveis, tags e campos personalizados.
-- Rode no SQL Editor do Supabase.

-- ===== 1) Etapas do funil (configuráveis) =====
create table if not exists pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,               -- chave usada em conversations.pipeline_stage
  nome text not null,
  cor text not null default '#f2871e',
  tipo text not null default 'em_processo' check (tipo in ('em_processo','ganho','perdido')),
  ordem int not null default 0,
  created_at timestamptz not null default now()
);
alter table pipeline_stages enable row level security;

-- Semeia as 6 etapas atuais (mantém compatibilidade com o pipeline existente)
insert into pipeline_stages (key, nome, cor, tipo, ordem) values
  ('novo_lead',       'Novo Lead',       '#4f8cff', 'em_processo', 1),
  ('em_atendimento',  'Em Atendimento',  '#a855f7', 'em_processo', 2),
  ('cotacao_enviada', 'Cotação Enviada', '#f59e0b', 'em_processo', 3),
  ('negociacao',      'Negociação',      '#14b8a6', 'em_processo', 4),
  ('fechado',         'Fechado',         '#22c55e', 'ganho',       5),
  ('perdido',         'Perdido',         '#ef4444', 'perdido',     6)
on conflict (key) do nothing;

-- Etapas passam a ser livres (remove o CHECK fixo em conversations)
alter table conversations drop constraint if exists conversations_pipeline_stage_check;

-- ===== 2) Tags =====
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cor text not null default '#f2871e',
  created_at timestamptz not null default now()
);
alter table tags enable row level security;

create table if not exists contact_tags (
  conversation_id uuid not null references conversations(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (conversation_id, tag_id)
);
alter table contact_tags enable row level security;

-- ===== 3) Campos personalizados =====
create table if not exists custom_fields (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null default 'texto' check (tipo in ('texto','numero','data','selecao')),
  opcoes jsonb not null default '[]'::jsonb,   -- usado quando tipo = 'selecao'
  ordem int not null default 0,
  created_at timestamptz not null default now()
);
alter table custom_fields enable row level security;

create table if not exists contact_field_values (
  conversation_id uuid not null references conversations(id) on delete cascade,
  field_id uuid not null references custom_fields(id) on delete cascade,
  valor text,
  primary key (conversation_id, field_id)
);
alter table contact_field_values enable row level security;

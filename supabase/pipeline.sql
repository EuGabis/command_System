-- Pipeline de contatos (CRM) — colunas em conversations.
-- Rode no SQL Editor do Supabase.
alter table conversations
  add column if not exists pipeline_stage text not null default 'novo_lead'
    check (pipeline_stage in ('novo_lead','em_atendimento','cotacao_enviada','negociacao','fechado','perdido')),
  add column if not exists lead_data jsonb not null default '{}'::jsonb,
  add column if not exists lead_resumo text,
  add column if not exists stage_locked boolean not null default false,
  add column if not exists lead_updated_at timestamptz;

create index if not exists idx_conversations_stage on conversations(pipeline_stage);

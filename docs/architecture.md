# Central de Comando — Bots WhatsApp & Instagram com IA

Data: 2026-07-29

## Objetivo
Painel (central de comando) para configurar e operar bots de atendimento no WhatsApp e Instagram,
com um motor de IA (OpenAI) que responde automaticamente aos clientes. Entrega: MVP funcional.

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Postgres) — projeto `emzoyjwqearykfnqttgh`
- OpenAI SDK (motor de atendimento)
- Deploy alvo: Vercel
- UI em português

## Telas
1. **Dashboard** — status das conexões (WhatsApp/Instagram), métricas de mensagens e conversas.
2. **Conexão WhatsApp** — Phone Number ID, WABA ID, Access Token, Verify Token do webhook; botão "testar conexão".
3. **Conexão Instagram** — Page ID, IG Business Account ID, Access Token, App Secret, Verify Token.
4. **Configuração da IA** — persona/prompt, tom, base de conhecimento (FAQ), modelo OpenAI, toggle IA ativa/handoff, regras de escalonamento.
5. **Conversas** — inbox unificado (leitura das conversas das duas plataformas).

## Backend / Rotas
- `GET/POST /api/webhook/whatsapp` — verificação (GET hub.challenge) + eventos (POST).
- `GET/POST /api/webhook/instagram` — idem.
- `POST /api/connections/:platform/test` — testa credenciais chamando a Graph API.
- CRUD de configuração (IA e conexões) via rotas server-side usando service_role.
- Motor: mensagem recebida → carrega config IA + histórico → OpenAI → envia resposta via Graph API → persiste.

## Dados (Supabase)
- `channel_connections` (platform, credenciais criptografadas, status, verify_token)
- `ai_config` (persona, tom, modelo, base_conhecimento, ativo, regras_escalonamento)
- `conversations` (platform, contato, status)
- `messages` (conversation_id, direção, conteúdo, timestamp)

## Segurança
- Credenciais das plataformas criptografadas em repouso (AES-256-GCM via `CREDENTIALS_ENCRYPTION_KEY`).
- `service_role` só no servidor; nunca no client nem no git.
- `.env.local` gitignored. Chave service_role a ser rotacionada (exposta no chat).
- Validação de assinatura dos webhooks (verify token / app secret).

## Modo simulado
Sem credenciais reais, telas navegáveis e webhooks respondem em modo simulado para validação de UX.

## Fora de escopo (fase 2)
- Multi-tenant / múltiplas contas, billing, analytics avançado, envio em massa/campanhas.

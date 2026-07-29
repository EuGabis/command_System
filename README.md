# Central de Comando — Bots WhatsApp & Instagram com IA

Painel para configurar e operar bots de atendimento no **WhatsApp** (Meta Cloud API) e
**Instagram** (Graph API), com um motor de **IA (OpenAI)** que responde os clientes automaticamente.

## Telas
- **Dashboard** — status das conexões, métricas, checklist de configuração
- **Conexão WhatsApp** — credenciais da Cloud API + webhook
- **Conexão Instagram** — credenciais da Graph API + webhook
- **Configuração da IA** — persona, tom, modelo, base de conhecimento, regras de escalonamento, liga/desliga
- **Conversas** — inbox unificado das duas plataformas

## Setup

### 1. Variáveis de ambiente
Copie `.env.example` para `.env.local` e preencha:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` — sua chave da OpenAI
- `CREDENTIALS_ENCRYPTION_KEY` — gere com: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

> ⚠️ **Segurança:** `.env.local` está no `.gitignore` e **nunca** deve ser commitado.
> A `service_role` foi exposta no chat durante o setup — **rotacione-a** no Supabase
> (Settings → API → Reset service_role key).

### 2. Banco de dados
No **SQL Editor do Supabase**, rode **nesta ordem**:
1. [`supabase/schema.sql`](supabase/schema.sql) — tabelas do bot (`channel_connections`, `ai_config`, `conversations`, `messages`).
2. [`supabase/auth-profile.sql`](supabase/auth-profile.sql) — tabela `profiles` (com RLS), trigger de criação automática de perfil e bucket de avatares no Storage.

> A conta do dono só pode ser criada depois de rodar o `auth-profile.sql` (o trigger insere na tabela `profiles`).

### 3. Rodar
```bash
npm install
npm run dev
```
Acesse http://localhost:3000

## Login e perfil
- **Acesso fechado (só o dono).** No **primeiro acesso**, a tela de login mostra o formulário
  "criar conta do dono" — isso só funciona enquanto **não existir nenhum usuário**. Depois disso o
  cadastro fica bloqueado; novos usuários só podem ser criados por você no painel do Supabase (Authentication → Users).
- Todas as rotas do painel são protegidas por sessão (cookies, via `src/proxy.ts`). Sem login, tudo redireciona para `/login`.
- **Perfil** (`/perfil`): nome, email, troca de senha, foto (Supabase Storage) e dados do negócio
  (empresa/marca) — que são injetados no contexto do atendente de IA.

> 🔒 **Feche o cadastro no Supabase também:** em **Authentication → Sign In / Providers → Email**,
> desative *"Allow new users to sign up"*. A conta do dono é criada via API admin (não usa o signup
> público), então isso não te atrapalha e impede que alguém use a chave anon para se registrar.

## Conectar as plataformas

### WhatsApp (Meta Cloud API)
1. Em [Meta for Developers](https://developers.facebook.com/apps), pegue **Phone Number ID**, **WABA ID** e um **Access Token** permanente.
2. Cole na tela **WhatsApp** e salve.
3. Configure o webhook na Meta apontando para `https://SEU-DOMINIO/api/webhook/whatsapp` usando o **Verify Token** definido no painel.
4. Clique em **Testar conexão**.

### Instagram (Graph API)
1. Conta Business/Creator vinculada a uma Página do Facebook.
2. Pegue **Page ID**, **IG Business Account ID**, **Access Token** e **App Secret**.
3. Webhook: `https://SEU-DOMINIO/api/webhook/instagram`.

## Como funciona o atendimento
Mensagem recebida → webhook persiste a entrada → carrega a config da IA + histórico →
OpenAI gera a resposta → envia via Graph API → registra a saída. Se a IA estiver
**desativada**, a mensagem só é registrada (handoff humano).

## Deploy
Pronto para Vercel. Configure as mesmas variáveis de ambiente no projeto Vercel
e aponte os webhooks da Meta para o domínio de produção.

## Stack
Next.js (App Router) · TypeScript · Tailwind · Supabase (Postgres) · OpenAI

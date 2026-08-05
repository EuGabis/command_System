# Prompt de Implementação — CRM + IA completo (referência: demo NickBot) para o GAABTUR

> Cole este prompt para um agente de código executar. Ele descreve TODAS as
> funcionalidades desejadas, já cruzadas com o que o sistema atual possui.
> Implemente **em fases**, na ordem sugerida no fim. Não recrie o que já existe.

---

## 0. Contexto do sistema atual (NÃO recriar)

**Stack:** Next.js (App Router) + TypeScript + Tailwind · Supabase (Postgres; acesso
via `service_role` no servidor, RLS ligado) · OpenAI · deploy Vercel.
**Rotas do admin:** sob `/painel/*`. **Marca:** GAABTUR (preto + laranja `#f2871e`,
fontes Inter/Montserrat + Plex Mono, ícones de linha via `src/components/Icon.tsx`).

**Já existe (aproveitar/estender, não refazer):**
- Login fechado (só dono) + auto sign-out por inatividade/aba fechada.
- Dashboard por canal (status, total de conversas, aguardando).
- Conversas: inbox unificado (WhatsApp + Instagram), filtro por canal, envio manual
  pelo humano, IA ligável/desligável por conversa, mídia do WhatsApp, player de
  áudio + transcrição, auto-handoff com notificação ao dono, respostas rápidas.
- Pipeline Kanban: drag-and-drop entre estágios; a IA extrai dados do lead e um resumo.
- IA por canal: persona, tom, modelo, base de conhecimento, regras de escalonamento, on/off.
- Canais: WhatsApp (Meta Cloud API **e** Evolution/QR) e Instagram (Graph API).
- Perfil: nome, e-mail, senha, avatar, dados do negócio.

**Padrões obrigatórios em tudo que for novo:**
- Toda tabela nova: RLS ligado; acesso só pelo servidor (service_role). Migration em `supabase/*.sql`.
- Escritas no banco sempre checam `error` e propagam (nada de "salvo" falso).
- Seguir o design system atual (grafite/laranja, cantos `--r-card`/`--r-ctrl`, ícones de linha, rótulos mono maiúsculos `.eyebrow`).
- Novas telas sob `/painel/*`. Responsivo (desktop + mobile).

---

## 1. Dashboard (visão geral) — MELHORAR

Hoje mostra métricas por canal. Adicionar visão executiva:
- **Cartões de topo:** conversas **hoje**, conversas **no mês**, **total de contatos**, **agendamentos de hoje**.
- **Gráfico** de atividade de conversas dos **últimos 7 dias** (barras/linha).
- **Conversas recentes** (lista com últimas interações).
- **Acesso rápido** (atalhos: nova conversa, ver pipeline, config IA, etc.).

## 2. Conversas — MELHORAR

Manter o inbox atual e adicionar à lista de conversas:
- Colunas/infos: **nome**, **número**, **última interação**, **status**, **tokens consumidos**.
- Ações por conversa: **acompanhar** (abrir), **deletar contato**, **bloquear** contato, **reativar follow-up**.
- Já existe o "olho"/abrir para ver as mensagens trocadas — manter.

## 3. Contatos — NOVO (tela dedicada)

Uma tela `/painel/contatos` com as mesmas infos das conversas, porém:
- **Exportar listagem** (CSV).
- **Deletar** contato específico.
- Busca/filtro por nome, número, tag, status, origem.

## 4. CRM (visão) — NOVO

Tela `/painel/crm` com indicadores de vendas:
- **Total de contatos**, **novos hoje**, **valor da pipeline** (soma dos valores dos leads), **ganhos do mês** (leads fechados no mês).
- **Atividades pendentes** e **follow-ups atrasados**.
- Prévia do **funil Kanban** (personalizável).
- **Contatos recentes**, **próximas atividades**, **contatos por tag**, **ações rápidas**.

## 5. Funil Kanban — MELHORAR

Manter drag-and-drop. Adicionar:
- **Duplo clique** no card abre a **ficha do contato** (item 6).
- Colunas do funil vindas da **configuração de etapas** (item 7), com cor e contagem.

## 6. Ficha do contato (modal/painel de detalhe) — NOVO

Ao abrir um contato, mostrar e permitir editar:
- Dados básicos + **campos personalizados** (definidos em Config).
- **Status/estágio** do funil (trocar de coluna aqui também).
- **Origem de entrada** e **score** (0–100, útil para vendas).
- **Tags** do contato.
- **Agendar mensagem:** compor mensagem + **data e hora** de envio para aquele contato.
- **Atividades/lembretes:** criar lembrete com **tipo**, **título**, **descrição**, **data e hora**.
- **Notas** livres por cliente.
- **Histórico de atividades** e **lista de mensagens agendadas**.

## 7. Configurações do CRM — NOVO

Tela `/painel/crm/config`:
- **Etapas do funil:** criar/editar/reordenar; cada etapa tem **nome**, **cor** e **tipo** (`em_processo` | `ganho` | `perdido`). (Hoje os estágios são fixos no código — migrar para configuráveis por tabela.)
- **Tags:** criar/editar; **nome** + **cor**.
- **Campos personalizados:** criar diversos campos (texto, número, data, seleção); usados no cadastro/ficha do contato.

## 8. Automações — NOVO (hub `/painel/automacoes`)

- **Configurar assistente** (ver item 9).
- **Agenda:** ver eventos; **sincronização com Google Calendar**.
- **Formulários:** criar campos/filtros que a IA usa para **coletar as informações necessárias** do lead (qualificação).
- **Lista de transmissão:** criar lista, disparar envio em massa e **acompanhar os envios** (status por destinatário).
- **Arquivos:** repositório de **documentos, fotos e PDFs** que a IA pode **enviar quando o cliente pedir** (ex.: catálogo, tabela de preços).
- **API de envio:** endpoint + **documentação** para sistemas externos dispararem mensagens.
- **API de consulta:** permitir a IA **consultar sistemas externos** (ex.: status de pedido, 2ª via de boleto) via integrações configuráveis.

## 9. Configurar Assistente / IA — MELHORAR

Estender a config de IA por canal com:
- **Tokens disponíveis/consumidos** (medição de uso por assistente/conta).
- **Conexão WhatsApp:** manter as 2 formas (API não oficial/Evolution e API oficial Meta).
- Campos de identidade: **nome**, **identidade**, **objetivo**, **instruções** (prompt com infos do negócio) — mapear para a persona/base atual.
- **Temperatura**, **interpretar imagens** (on/off), **tempo de espera** (debounce — já existe, expor na UI).
- **Comando de ativação**, **transferir ao atendente** (handoff — já existe, tornar configurável), **controle de áudio** (responder/transcrever áudio), **captura no CRM** (a IA preenche campos do lead — já parcial), **templates da Meta**, **horário de atendimento**, **follow-up** automático.

## 10. Tema claro/escuro — NOVO

Alternância de tema (claro/escuro) persistida por usuário. Hoje o app é dark fixo;
tokenizar cores para suportar os dois e um toggle no header/perfil.

## 11. Tokens — NOVO (transversal)

Registrar consumo de tokens da OpenAI por conversa/assistente; exibir em Conversas,
Ficha do contato e Config do Assistente.

---

## Esquema de dados (novas tabelas sugeridas — RLS ligado)

- `tags (id, nome, cor)`
- `contact_tags (contact_id, tag_id)`
- `pipeline_stages (id, nome, cor, tipo, ordem)` — substitui estágios fixos
- `custom_fields (id, nome, tipo, opcoes jsonb, ordem)`
- `contact_field_values (contact_id, field_id, valor)`
- `activities (id, contact_id, tipo, titulo, descricao, quando timestamptz, feito bool)`
- `scheduled_messages (id, contact_id, texto, quando, status)`
- `notes (id, contact_id, texto, created_at)`
- `files (id, nome, url, tipo, descricao)` — Supabase Storage
- `broadcasts (id, nome, criado_at)` + `broadcast_targets (broadcast_id, contact_id, status)`
- `forms (id, nome, campos jsonb)`
- `token_usage (id, conversation_id, prompt_tokens, completion_tokens, created_at)`
- Estender `conversations`: `origem`, `score`, `bloqueado bool`, `valor numeric`.

---

## Ordem de implementação (fases)

1. **Fundação CRM:** `tags`, `pipeline_stages` configuráveis, `custom_fields` + tela de Config do CRM (item 7).
2. **Contatos + Ficha:** tela de Contatos (item 3) e ficha do contato com notas, atividades, agendamento, score, origem, tags e campos personalizados (itens 3, 6); duplo-clique no Kanban abre a ficha (item 5).
3. **CRM & Dashboard executivo:** métricas dia/mês/agendamentos, gráfico 7 dias, tela de CRM com valor da pipeline e ganhos do mês (itens 1, 4); ações de bloquear/reativar/deletar e colunas de tokens em Conversas (item 2).
4. **Automações:** arquivos, formulários, lista de transmissão, follow-up automático, agenda + Google Calendar, API de envio e API de consulta (item 8).
5. **IA avançada + Tema + Tokens:** expor temperatura, imagens, tempo de espera, horário de atendimento, templates Meta, medição de tokens; tema claro/escuro (itens 9, 10, 11).

Ao final de cada fase: rodar o SQL correspondente no Supabase, testar no `/painel` e
fazer commit no padrão conventional (`feat: ...`).

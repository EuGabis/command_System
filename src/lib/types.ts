export type Platform = "whatsapp" | "instagram";

export type ConnectionStatus = "desconectado" | "pendente" | "conectado" | "erro";

// Provedor usado para o canal WhatsApp. "meta" = Cloud API oficial;
// "evolution" = Evolution API (WhatsApp Web / QR code).
export type WhatsAppProvider = "meta" | "evolution";

export interface WhatsAppCredentials {
  provider?: WhatsAppProvider; // ausente = "meta" (compatibilidade)
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
}

export interface EvolutionCredentials {
  provider: "evolution";
  instanceName: string;
}

export interface InstagramCredentials {
  pageId: string;
  igBusinessId: string;
  accessToken: string;
  appSecret: string;
}

export interface ConnectionView {
  platform: Platform;
  status: ConnectionStatus;
  verifyToken: string | null;
  lastError: string | null;
  hasCredentials: boolean;
  credentials?: Partial<WhatsAppCredentials & InstagramCredentials & EvolutionCredentials>;
}

export interface AiConfig {
  id?: string;
  platform?: Platform;
  persona: string;
  tom: string;
  modelo: string;
  base_conhecimento: string;
  regras_escalonamento: string;
  ativo: boolean;
}

export type PipelineStage =
  | "novo_lead"
  | "em_atendimento"
  | "cotacao_enviada"
  | "negociacao"
  | "fechado"
  | "perdido";

export const PIPELINE_STAGES: { key: PipelineStage; label: string }[] = [
  { key: "novo_lead", label: "Novo Lead" },
  { key: "em_atendimento", label: "Em Atendimento" },
  { key: "cotacao_enviada", label: "Cotação Enviada" },
  { key: "negociacao", label: "Negociação" },
  { key: "fechado", label: "Fechado" },
  { key: "perdido", label: "Perdido" },
];

// Dados do lead extraídos pela IA. Todos opcionais — a IA preenche o que conseguir.
export interface LeadData {
  origem?: string;
  destino?: string;
  data_ida?: string;
  data_volta?: string;
  passageiros?: string;
  tipo_servico?: string;
  valor?: string;
}

export interface Conversation {
  id: string;
  platform: Platform;
  contato: string;
  nome_contato: string | null;
  status: string;
  ia_ativa: boolean;
  pipeline_stage: PipelineStage;
  lead_data: LeadData;
  lead_resumo: string | null;
  stage_locked: boolean;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  direcao: "entrada" | "saida";
  conteudo: string;
  autor: string;
  created_at: string;
}

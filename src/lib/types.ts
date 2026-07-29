export type Platform = "whatsapp" | "instagram";

export type ConnectionStatus = "desconectado" | "pendente" | "conectado" | "erro";

export interface WhatsAppCredentials {
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
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
  credentials?: Partial<WhatsAppCredentials & InstagramCredentials>;
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

export interface Conversation {
  id: string;
  platform: Platform;
  contato: string;
  nome_contato: string | null;
  status: string;
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

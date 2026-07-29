import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { encrypt, decrypt } from "./crypto";
import type {
  Platform,
  ConnectionView,
  ConnectionStatus,
  AiConfig,
  Conversation,
  Message,
} from "./types";

export { isSupabaseConfigured };

const DEFAULT_AI: AiConfig = {
  persona: "Você é um atendente virtual simpático e prestativo.",
  tom: "profissional e cordial",
  modelo: "gpt-4o-mini",
  base_conhecimento: "",
  regras_escalonamento: "",
  ativo: true,
};

/* ---------- Conexões ---------- */

export async function getConnection(platform: Platform): Promise<ConnectionView> {
  const empty: ConnectionView = {
    platform,
    status: "desconectado",
    verifyToken: null,
    lastError: null,
    hasCredentials: false,
  };
  if (!isSupabaseConfigured()) return empty;

  const { data } = await supabaseAdmin()
    .from("channel_connections")
    .select("*")
    .eq("platform", platform)
    .maybeSingle();

  if (!data) return empty;

  let credentials: Record<string, string> | undefined;
  if (data.credentials_encrypted) {
    try {
      credentials = JSON.parse(decrypt(data.credentials_encrypted));
    } catch {
      credentials = undefined;
    }
  }
  return {
    platform,
    status: (data.status as ConnectionStatus) ?? "desconectado",
    verifyToken: data.verify_token ?? null,
    lastError: data.last_error ?? null,
    hasCredentials: Boolean(data.credentials_encrypted),
    credentials,
  };
}

export async function saveConnection(
  platform: Platform,
  credentials: Record<string, string>,
  verifyToken: string,
  status: ConnectionStatus = "pendente",
): Promise<void> {
  const row = {
    platform,
    credentials_encrypted: encrypt(JSON.stringify(credentials)),
    verify_token: verifyToken,
    status,
    last_error: null,
    updated_at: new Date().toISOString(),
  };
  await supabaseAdmin()
    .from("channel_connections")
    .upsert(row, { onConflict: "platform" });
}

export async function setConnectionStatus(
  platform: Platform,
  status: ConnectionStatus,
  lastError: string | null = null,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await supabaseAdmin()
    .from("channel_connections")
    .update({ status, last_error: lastError, updated_at: new Date().toISOString() })
    .eq("platform", platform);
}

export async function getCredentials<T = Record<string, string>>(
  platform: Platform,
): Promise<T | null> {
  const c = await getConnection(platform);
  return (c.credentials as T) ?? null;
}

/* ---------- Config IA ---------- */

export async function getAiConfig(): Promise<AiConfig> {
  if (!isSupabaseConfigured()) return DEFAULT_AI;
  const { data } = await supabaseAdmin().from("ai_config").select("*").limit(1).maybeSingle();
  return data ? (data as AiConfig) : DEFAULT_AI;
}

export async function saveAiConfig(cfg: AiConfig): Promise<void> {
  const client = supabaseAdmin();
  const { data } = await client.from("ai_config").select("id").limit(1).maybeSingle();
  const payload = { ...cfg, updated_at: new Date().toISOString() };
  if (data?.id) {
    await client.from("ai_config").update(payload).eq("id", data.id);
  } else {
    await client.from("ai_config").insert(payload);
  }
}

/* ---------- Conversas / Mensagens ---------- */

export async function listConversations(): Promise<Conversation[]> {
  if (!isSupabaseConfigured()) return [];
  const { data } = await supabaseAdmin()
    .from("conversations")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(100);
  return (data as Conversation[]) ?? [];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  if (!isSupabaseConfigured()) return [];
  const { data } = await supabaseAdmin()
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return (data as Message[]) ?? [];
}

export async function upsertConversation(
  platform: Platform,
  contato: string,
  nome?: string,
): Promise<string> {
  const client = supabaseAdmin();
  const { data } = await client
    .from("conversations")
    .upsert(
      { platform, contato, nome_contato: nome ?? null, updated_at: new Date().toISOString() },
      { onConflict: "platform,contato" },
    )
    .select("id")
    .single();
  return data!.id as string;
}

export async function addMessage(
  conversationId: string,
  direcao: "entrada" | "saida",
  conteudo: string,
  autor: string,
): Promise<void> {
  await supabaseAdmin().from("messages").insert({
    conversation_id: conversationId,
    direcao,
    conteudo,
    autor,
  });
  await supabaseAdmin()
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);
}

export interface PlatformStats {
  total: number;
  aguardando: number;
}

// Estatísticas de um canal: total de conversas e quantas aguardam atenção
// (abertas ou em atendimento humano).
export async function getPlatformStats(platform: Platform): Promise<PlatformStats> {
  if (!isSupabaseConfigured()) return { total: 0, aguardando: 0 };
  const client = supabaseAdmin();
  const [{ count: total }, { count: aguardando }] = await Promise.all([
    client.from("conversations").select("*", { count: "exact", head: true }).eq("platform", platform),
    client
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("platform", platform)
      .in("status", ["aberta", "humano"]),
  ]);
  return { total: total ?? 0, aguardando: aguardando ?? 0 };
}

export async function listConversationsByPlatform(
  platform: Platform,
  limit = 20,
): Promise<Conversation[]> {
  if (!isSupabaseConfigured()) return [];
  const { data } = await supabaseAdmin()
    .from("conversations")
    .select("*")
    .eq("platform", platform)
    .order("updated_at", { ascending: false })
    .limit(limit);
  return (data as Conversation[]) ?? [];
}

export async function getOwnerBusiness(): Promise<{ empresa: string; marca: string } | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await supabaseAdmin()
    .from("profiles")
    .select("empresa, marca")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return { empresa: data.empresa ?? "", marca: data.marca ?? "" };
}

export async function conversationHistory(conversationId: string, limit = 12): Promise<Message[]> {
  if (!isSupabaseConfigured()) return [];
  const { data } = await supabaseAdmin()
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data as Message[]) ?? []).reverse();
}

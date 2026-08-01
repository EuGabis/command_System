// Cliente da Evolution API (WhatsApp via Baileys / QR code).
// Base URL e chave global ficam em variáveis de ambiente — nunca no browser.

const DEFAULT_INSTANCE = "Teste";

export function isEvolutionConfigured(): boolean {
  return Boolean(process.env.EVOLUTION_API_URL && process.env.EVOLUTION_API_KEY);
}

function baseUrl(): string {
  const url = process.env.EVOLUTION_API_URL;
  if (!url) throw new Error("EVOLUTION_API_URL não configurada.");
  return url.replace(/\/+$/, "");
}

function apiKey(): string {
  const key = process.env.EVOLUTION_API_KEY;
  if (!key) throw new Error("EVOLUTION_API_KEY não configurada.");
  return key;
}

export function defaultInstance(): string {
  return process.env.EVOLUTION_INSTANCE || DEFAULT_INSTANCE;
}

async function call<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: {
      apikey: apiKey(),
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "message" in data && (data as { message: unknown }).message) ||
      text ||
      res.statusText;
    throw new Error(`Evolution ${res.status}: ${typeof msg === "string" ? msg : JSON.stringify(msg)}`);
  }
  return data as T;
}

export type EvolutionState = "open" | "connecting" | "close" | "unknown";

interface FetchInstance {
  name?: string;
  instanceName?: string;
  connectionStatus?: string;
  number?: string;
  ownerJid?: string;
  profileName?: string;
}

// Estado da conexão de uma instância. Retorna também metadados úteis (número, nome).
export async function evolutionStatus(
  instance: string,
): Promise<{ state: EvolutionState; number: string | null; profileName: string | null; exists: boolean }> {
  const list = await call<FetchInstance[]>("GET", `/instance/fetchInstances?instanceName=${encodeURIComponent(instance)}`);
  const found = Array.isArray(list)
    ? list.find((i) => (i.name ?? i.instanceName) === instance)
    : undefined;
  if (!found) return { state: "close", number: null, profileName: null, exists: false };
  const raw = (found.connectionStatus ?? "").toLowerCase();
  const state: EvolutionState =
    raw === "open" ? "open" : raw === "connecting" ? "connecting" : raw === "close" ? "close" : "unknown";
  return {
    state,
    number: found.number ?? (found.ownerJid ? found.ownerJid.split("@")[0] : null),
    profileName: found.profileName ?? null,
    exists: true,
  };
}

// Cria a instância se ela ainda não existir. Idempotente.
export async function evolutionEnsureInstance(instance: string): Promise<void> {
  const { exists } = await evolutionStatus(instance);
  if (exists) return;
  await call("POST", "/instance/create", {
    instanceName: instance,
    integration: "WHATSAPP-BAILEYS",
    qrcode: true,
  });
}

// Inicia a conexão e retorna o QR code (base64 data URI) e/ou pairing code.
// Se a instância já estiver conectada, retorna base64/pairingCode nulos.
export async function evolutionConnect(
  instance: string,
): Promise<{ base64: string | null; pairingCode: string | null }> {
  const data = await call<{ base64?: string; code?: string; pairingCode?: string }>(
    "GET",
    `/instance/connect/${encodeURIComponent(instance)}`,
  );
  return {
    base64: data?.base64 ?? null,
    pairingCode: data?.pairingCode ?? data?.code ?? null,
  };
}

// Configura o webhook da instância para apontar para o nosso endpoint.
export async function evolutionSetWebhook(instance: string, url: string): Promise<void> {
  await call("POST", `/webhook/set/${encodeURIComponent(instance)}`, {
    webhook: {
      enabled: true,
      url,
      byEvents: false,
      base64: false,
      events: ["MESSAGES_UPSERT"],
    },
  });
}

// Desconecta (logout) a instância — mantém a instância criada, mas encerra a sessão.
export async function evolutionLogout(instance: string): Promise<void> {
  await call("DELETE", `/instance/logout/${encodeURIComponent(instance)}`);
}

// Envia uma mensagem de texto. `to` é o número com DDI (ex: 5511999999999).
export async function evolutionSendText(instance: string, to: string, text: string): Promise<void> {
  await call("POST", `/message/sendText/${encodeURIComponent(instance)}`, {
    number: to,
    text,
  });
}

/* ---------- Mídia ---------- */

// Baixa o conteúdo (base64) de uma mensagem de mídia recebida.
export async function evolutionGetBase64(
  instance: string,
  message: unknown,
): Promise<{ base64: string; mimetype: string } | null> {
  try {
    const data = await call<{ base64?: string; mimetype?: string }>(
      "POST",
      `/chat/getBase64FromMediaMessage/${encodeURIComponent(instance)}`,
      { message, convertToMp4: false },
    );
    if (!data?.base64) return null;
    return { base64: data.base64, mimetype: data.mimetype ?? "application/octet-stream" };
  } catch (e) {
    console.error("Evolution getBase64 falhou:", e);
    return null;
  }
}

// Envia imagem/vídeo/documento a partir de uma URL pública.
export async function evolutionSendMedia(
  instance: string,
  to: string,
  mediatype: "image" | "video" | "document",
  url: string,
  fileName?: string,
  caption?: string,
): Promise<void> {
  await call("POST", `/message/sendMedia/${encodeURIComponent(instance)}`, {
    number: to,
    mediatype,
    media: url,
    fileName: fileName ?? "arquivo",
    caption: caption ?? "",
  });
}

// Envia áudio (nota de voz) a partir de uma URL pública.
export async function evolutionSendAudio(instance: string, to: string, url: string): Promise<void> {
  await call("POST", `/message/sendWhatsAppAudio/${encodeURIComponent(instance)}`, {
    number: to,
    audio: url,
  });
}

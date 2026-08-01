import {
  upsertConversation,
  addMessage,
  conversationHistory,
  getAiConfig,
  getCredentials,
  getOwnerBusiness,
  getConversationById,
  saveLead,
  ultimaEntradaId,
  setConversationIa,
  setConversationStatus,
  type MediaInfo,
} from "./repo";
import { gerarResposta, extrairLead } from "./ai";
import { whatsappSendText, instagramSendText } from "./meta";
import {
  evolutionSendText,
  evolutionSendMedia,
  evolutionSendAudio,
  isEvolutionConfigured as evolutionConfigured,
  defaultInstance,
} from "./evolution";
import type {
  Platform,
  WhatsAppCredentials,
  InstagramCredentials,
  EvolutionCredentials,
} from "./types";

/**
 * Processa uma mensagem recebida de qualquer plataforma:
 * persiste entrada -> gera resposta da IA -> envia -> persiste saída.
 * Se a IA estiver inativa, apenas registra e deixa para atendimento humano.
 */
// Envia uma mensagem manual (operador humano) para o contato e persiste a saída.
export async function enviarMensagemManual(
  conversationId: string,
  platform: Platform,
  contato: string,
  texto: string,
): Promise<void> {
  if (platform === "whatsapp") {
    const creds = await getCredentials<WhatsAppCredentials & Partial<EvolutionCredentials>>("whatsapp");
    if (creds?.provider === "evolution") {
      await evolutionSendText(creds.instanceName as string, contato, texto);
    } else if (creds) {
      await whatsappSendText(creds, contato, texto);
    } else if (evolutionConfigured()) {
      // sem conexão salva, mas Evolution disponível — usa a instância padrão
      await evolutionSendText(defaultInstance(), contato, texto);
    } else {
      throw new Error("Sem canal de envio configurado para WhatsApp.");
    }
  } else {
    const creds = await getCredentials<InstagramCredentials>("instagram");
    if (!creds) throw new Error("Sem credenciais do Instagram.");
    await instagramSendText(creds, contato, texto);
  }
  await addMessage(conversationId, "saida", texto, "humano");
}

async function resolverInstanciaWhatsApp(): Promise<string> {
  const creds = await getCredentials<WhatsAppCredentials & Partial<EvolutionCredentials>>("whatsapp");
  if (creds?.provider === "evolution" && creds.instanceName) return creds.instanceName;
  if (evolutionConfigured()) return defaultInstance();
  throw new Error("Evolution não configurada para envio de mídia.");
}

// Envia um anexo (já hospedado) para o contato e registra a saída.
export async function enviarMidiaManual(
  conversationId: string,
  platform: Platform,
  contato: string,
  media: MediaInfo,
  caption?: string,
): Promise<void> {
  if (platform !== "whatsapp") throw new Error("Envio de mídia disponível apenas no WhatsApp.");
  const inst = await resolverInstanciaWhatsApp();
  if (media.type === "audio") {
    await evolutionSendAudio(inst, contato, media.url);
  } else {
    await evolutionSendMedia(inst, contato, media.type, media.url, media.name ?? undefined, caption);
  }
  await addMessage(conversationId, "saida", caption ?? "", "humano", media);
}

// Janela de agrupamento de mensagens em rajada (ms). Ajustável por env.
const DEBOUNCE_MS = Number(process.env.AI_DEBOUNCE_MS ?? 8000);

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export interface OrigemMensagem {
  // Quando a mensagem chega pelo webhook da Evolution, sabemos que a resposta
  // deve voltar por essa mesma instância — independente da conexão salva.
  evolutionInstance?: string;
  media?: MediaInfo;      // anexo recebido (imagem/áudio/etc)
  aiText?: string;        // texto que a IA deve "ler" (ex: transcrição, ou placeholder de imagem)
}

// Avisa o dono no WhatsApp (se OWNER_WHATSAPP estiver definido). Best-effort.
async function notificarDono(texto: string, instance?: string): Promise<void> {
  const dono = (process.env.OWNER_WHATSAPP ?? "").replace(/\D/g, "");
  if (!dono) return;
  const inst = instance ?? (evolutionConfigured() ? defaultInstance() : null);
  if (!inst) return;
  try {
    await evolutionSendText(inst, dono, texto);
  } catch (e) {
    console.error("Falha ao notificar o dono:", e);
  }
}

// Detecta pedido de atendente humano (marcador da IA ou frase do cliente).
function precisaHumano(clienteTexto: string, respostaIa: string): boolean {
  if (/\[\[\s*handoff\s*\]\]/i.test(respostaIa)) return true;
  return /(atendente|falar com (uma |um )?(pessoa|humano|atendente)|pessoa de verdade|quero um humano)/i.test(clienteTexto);
}

export async function processarMensagemRecebida(
  platform: Platform,
  contato: string,
  texto: string,
  nome?: string,
  origem?: OrigemMensagem,
): Promise<void> {
  const conversationId = await upsertConversation(platform, contato, nome);
  const primeiroContato = (await ultimaEntradaId(conversationId)) === null;
  await addMessage(conversationId, "entrada", texto, "cliente", origem?.media);

  // Novo lead chegou -> avisa o dono.
  if (primeiroContato) {
    await notificarDono(`🆕 Novo contato no ${platform === "whatsapp" ? "WhatsApp" : "Instagram"}: ${nome ?? contato}`, origem?.evolutionInstance);
  }

  const aiText = origem?.aiText ?? texto;

  const cfg = await getAiConfig(platform);
  const conv = await getConversationById(conversationId);
  // IA responde só se ligada globalmente (config do canal) E nesta conversa.
  if (!cfg.ativo || conv?.ia_ativa === false) {
    await atualizarPipeline(conversationId, conv?.stage_locked ?? false);
    return; // handoff humano — não responde automaticamente
  }

  // Debounce de rajadas: se o cliente manda várias mensagens seguidas, cada uma
  // dispara um webhook. Esperamos um instante e, se chegou mensagem mais nova,
  // esta invocação desiste — só a última responde, considerando o histórico todo.
  const marcador = await ultimaEntradaId(conversationId);
  await sleep(DEBOUNCE_MS);
  const maisRecente = await ultimaEntradaId(conversationId);
  if (marcador && maisRecente && maisRecente !== marcador) {
    return; // chegou mensagem nova — a invocação dela vai responder
  }

  const negocio = await getOwnerBusiness();
  // O histórico já inclui a mensagem atual; remove a última pra não duplicar.
  const hist = await conversationHistory(conversationId, 30);
  const historico = hist.slice(0, -1);
  let resposta = await gerarResposta(cfg, historico, aiText, negocio);

  // Handoff: a IA (ou o cliente) pediu atendente humano.
  const handoff = precisaHumano(aiText, resposta);
  resposta = resposta.replace(/\[\[\s*handoff\s*\]\]/gi, "").trim();

  let enviado = false;
  try {
    if (platform === "whatsapp") {
      // 1) origem explícita (webhook Evolution) tem prioridade
      if (origem?.evolutionInstance) {
        await evolutionSendText(origem.evolutionInstance, contato, resposta);
        enviado = true;
      } else {
        const creds = await getCredentials<WhatsAppCredentials & Partial<EvolutionCredentials>>("whatsapp");
        if (creds?.provider === "evolution") {
          await evolutionSendText(creds.instanceName as string, contato, resposta);
          enviado = true;
        } else if (creds) {
          await whatsappSendText(creds, contato, resposta);
          enviado = true;
        }
      }
    } else {
      const creds = await getCredentials<InstagramCredentials>("instagram");
      if (creds) {
        await instagramSendText(creds, contato, resposta);
        enviado = true;
      }
    }
  } catch (e) {
    console.error("Falha ao enviar resposta:", e);
  }

  if (!enviado) {
    console.warn(`Resposta gerada mas NÃO enviada (${platform}/${contato}) — canal de envio indisponível.`);
  }

  await addMessage(conversationId, "saida", resposta, "ia");

  // Ao escalar: desliga a IA nesta conversa, marca como humano e avisa o dono.
  if (handoff) {
    await setConversationIa(conversationId, false);
    await setConversationStatus(conversationId, "humano");
    await notificarDono(`🔔 Atendimento humano solicitado — ${nome ?? contato} (${platform})`, origem?.evolutionInstance);
  }

  await atualizarPipeline(conversationId, conv?.stage_locked ?? false);
}

// Extrai dados do lead e atualiza o pipeline. Nunca lança — é best-effort.
async function atualizarPipeline(conversationId: string, stageLocked: boolean): Promise<void> {
  try {
    const historico = await conversationHistory(conversationId, 30);
    const extra = await extrairLead(historico);
    if (extra) {
      await saveLead(conversationId, extra.lead_data, extra.resumo, extra.estagio, stageLocked);
    }
  } catch (e) {
    console.error("Falha ao atualizar pipeline:", e);
  }
}

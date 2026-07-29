import {
  upsertConversation,
  addMessage,
  conversationHistory,
  getAiConfig,
  getCredentials,
  getOwnerBusiness,
} from "./repo";
import { gerarResposta } from "./ai";
import { whatsappSendText, instagramSendText } from "./meta";
import type { Platform, WhatsAppCredentials, InstagramCredentials } from "./types";

/**
 * Processa uma mensagem recebida de qualquer plataforma:
 * persiste entrada -> gera resposta da IA -> envia -> persiste saída.
 * Se a IA estiver inativa, apenas registra e deixa para atendimento humano.
 */
export async function processarMensagemRecebida(
  platform: Platform,
  contato: string,
  texto: string,
  nome?: string,
): Promise<void> {
  const conversationId = await upsertConversation(platform, contato, nome);
  await addMessage(conversationId, "entrada", texto, "cliente");

  const cfg = await getAiConfig(platform);
  if (!cfg.ativo) {
    return; // handoff humano — não responde automaticamente
  }

  const historico = await conversationHistory(conversationId);
  const negocio = await getOwnerBusiness();
  const resposta = await gerarResposta(cfg, historico, texto, negocio);

  try {
    if (platform === "whatsapp") {
      const creds = await getCredentials<WhatsAppCredentials>("whatsapp");
      if (creds) await whatsappSendText(creds, contato, resposta);
    } else {
      const creds = await getCredentials<InstagramCredentials>("instagram");
      if (creds) await instagramSendText(creds, contato, resposta);
    }
  } catch (e) {
    console.error("Falha ao enviar resposta:", e);
  }

  await addMessage(conversationId, "saida", resposta, "ia");
}

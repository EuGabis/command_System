import {
  upsertConversation,
  addMessage,
  conversationHistory,
  getAiConfig,
  getCredentials,
  getOwnerBusiness,
  getConversationById,
} from "./repo";
import { gerarResposta } from "./ai";
import { whatsappSendText, instagramSendText } from "./meta";
import {
  evolutionSendText,
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

export interface OrigemMensagem {
  // Quando a mensagem chega pelo webhook da Evolution, sabemos que a resposta
  // deve voltar por essa mesma instância — independente da conexão salva.
  evolutionInstance?: string;
}

export async function processarMensagemRecebida(
  platform: Platform,
  contato: string,
  texto: string,
  nome?: string,
  origem?: OrigemMensagem,
): Promise<void> {
  const conversationId = await upsertConversation(platform, contato, nome);
  await addMessage(conversationId, "entrada", texto, "cliente");

  const cfg = await getAiConfig(platform);
  const conv = await getConversationById(conversationId);
  // IA responde só se ligada globalmente (config do canal) E nesta conversa.
  if (!cfg.ativo || conv?.ia_ativa === false) {
    return; // handoff humano — não responde automaticamente
  }

  const historico = await conversationHistory(conversationId);
  const negocio = await getOwnerBusiness();
  const resposta = await gerarResposta(cfg, historico, texto, negocio);

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
}

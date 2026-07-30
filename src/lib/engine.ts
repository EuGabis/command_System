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
import { evolutionSendText } from "./evolution";
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
  if (!cfg.ativo) {
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

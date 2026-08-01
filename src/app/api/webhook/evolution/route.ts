import { NextRequest, NextResponse } from "next/server";
import { processarMensagemRecebida } from "@/lib/engine";
import { evolutionGetBase64 } from "@/lib/evolution";
import { uploadBase64, mediaTypeFromMime } from "@/lib/storage";
import { transcreverAudio } from "@/lib/ai";
import type { MediaInfo } from "@/lib/repo";

interface EvolutionMessage {
  key?: { remoteJid?: string; fromMe?: boolean; id?: string };
  pushName?: string;
  message?: {
    conversation?: string;
    extendedTextMessage?: { text?: string };
    imageMessage?: { caption?: string; mimetype?: string };
    videoMessage?: { caption?: string; mimetype?: string };
    audioMessage?: { mimetype?: string };
    documentMessage?: { caption?: string; fileName?: string; mimetype?: string };
    documentWithCaptionMessage?: { message?: { documentMessage?: { caption?: string; fileName?: string; mimetype?: string } } };
    stickerMessage?: { mimetype?: string };
  };
}

function textoSimples(msg: EvolutionMessage): string | null {
  return msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? null;
}

// Identifica o tipo de mídia da mensagem (se houver).
function detectarMidia(msg: EvolutionMessage): { kind: "image" | "audio" | "video" | "document"; caption: string; fileName?: string } | null {
  const m = msg.message;
  if (!m) return null;
  if (m.imageMessage) return { kind: "image", caption: m.imageMessage.caption ?? "" };
  if (m.stickerMessage) return { kind: "image", caption: "" };
  if (m.audioMessage) return { kind: "audio", caption: "" };
  if (m.videoMessage) return { kind: "video", caption: m.videoMessage.caption ?? "" };
  if (m.documentMessage) return { kind: "document", caption: m.documentMessage.caption ?? "", fileName: m.documentMessage.fileName };
  const dwc = m.documentWithCaptionMessage?.message?.documentMessage;
  if (dwc) return { kind: "document", caption: dwc.caption ?? "", fileName: dwc.fileName };
  return null;
}

// Recebe eventos da Evolution API (MESSAGES_UPSERT). Sempre responde 200.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = (body?.event as string | undefined)?.toLowerCase();
    if (event && event !== "messages.upsert") {
      return NextResponse.json({ ok: true });
    }

    const instance = body?.instance as string | undefined;
    const raw = body?.data;
    const items: EvolutionMessage[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

    for (const msg of items) {
      const remoteJid = msg.key?.remoteJid ?? "";
      if (msg.key?.fromMe) continue;
      if (remoteJid.endsWith("@g.us")) continue;
      const contato = remoteJid.split("@")[0];
      if (!contato) continue;

      const midia = detectarMidia(msg);

      if (midia && instance) {
        // baixa, sobe pro storage e monta a MediaInfo
        let media: MediaInfo | undefined;
        let aiText = "";
        let conteudo = midia.caption;
        try {
          const bin = await evolutionGetBase64(instance, { key: msg.key, message: msg.message });
          if (bin) {
            const url = await uploadBase64(bin.base64, bin.mimetype);
            media = { url, type: mediaTypeFromMime(bin.mimetype), name: midia.fileName };
            if (midia.kind === "audio") {
              const t = await transcreverAudio(bin.base64, bin.mimetype);
              conteudo = t ?? "🎤 Áudio recebido";
              aiText = t ?? "[o cliente enviou um áudio]";
            }
          }
        } catch (e) {
          console.error("Falha ao processar mídia:", e);
        }
        if (midia.kind === "image") aiText = midia.caption || "[o cliente enviou uma imagem]";
        else if (midia.kind === "video") aiText = midia.caption || "[o cliente enviou um vídeo]";
        else if (midia.kind === "document") { aiText = `[o cliente enviou um documento${midia.fileName ? `: ${midia.fileName}` : ""}]`; conteudo = midia.caption || midia.fileName || "📄 Documento"; }

        await processarMensagemRecebida("whatsapp", contato, conteudo, msg.pushName, {
          evolutionInstance: instance,
          media,
          aiText,
        });
        continue;
      }

      const texto = textoSimples(msg);
      if (!texto) continue;
      await processarMensagemRecebida("whatsapp", contato, texto, msg.pushName, {
        evolutionInstance: instance,
      });
    }
  } catch (e) {
    console.error("Webhook Evolution erro:", e);
  }
  return NextResponse.json({ ok: true });
}

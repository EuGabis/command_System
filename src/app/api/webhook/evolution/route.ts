import { NextRequest, NextResponse } from "next/server";
import { processarMensagemRecebida } from "@/lib/engine";

interface EvolutionMessage {
  key?: { remoteJid?: string; fromMe?: boolean; id?: string };
  pushName?: string;
  message?: {
    conversation?: string;
    extendedTextMessage?: { text?: string };
  };
}

function extractText(msg: EvolutionMessage): string | null {
  return msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? null;
}

// Recebe eventos da Evolution API (MESSAGES_UPSERT). Sempre responde 200
// para a Evolution não reenviar em loop.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = (body?.event as string | undefined)?.toLowerCase();
    if (event && event !== "messages.upsert") {
      return NextResponse.json({ ok: true });
    }

    // data pode vir como objeto único ou array
    const raw = body?.data;
    const items: EvolutionMessage[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

    for (const msg of items) {
      const remoteJid = msg.key?.remoteJid ?? "";
      // ignora mensagens próprias e grupos
      if (msg.key?.fromMe) continue;
      if (remoteJid.endsWith("@g.us")) continue;

      const texto = extractText(msg);
      if (!texto) continue;

      const contato = remoteJid.split("@")[0];
      if (!contato) continue;

      await processarMensagemRecebida("whatsapp", contato, texto, msg.pushName);
    }
  } catch (e) {
    console.error("Webhook Evolution erro:", e);
  }
  return NextResponse.json({ ok: true });
}

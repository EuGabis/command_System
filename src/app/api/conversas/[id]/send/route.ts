import { NextRequest, NextResponse } from "next/server";
import { getConversationById } from "@/lib/repo";
import { enviarMensagemManual } from "@/lib/engine";
import type { Platform } from "@/lib/types";

// Envio manual pelo operador. Envia ao contato e registra a saída (autor humano).
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const texto = (body?.texto as string | undefined)?.trim();
  if (!texto) return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });

  const conversa = await getConversationById(id);
  if (!conversa) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });

  try {
    await enviarMensagemManual(id, conversa.platform as Platform, conversa.contato, texto);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

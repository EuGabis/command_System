import { NextRequest, NextResponse } from "next/server";
import {
  getConversationById,
  getMessages,
  setConversationStatus,
  setConversationIa,
} from "@/lib/repo";

// Detalhe da conversa: dados + mensagens.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const conversa = await getConversationById(id);
  if (!conversa) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
  const mensagens = await getMessages(id);
  return NextResponse.json({ conversa, mensagens });
}

// Atualiza status (resolver/reabrir) ou toggle de IA da conversa.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  try {
    if (typeof body.status === "string") {
      await setConversationStatus(id, body.status);
    }
    if (typeof body.ia_ativa === "boolean") {
      await setConversationIa(id, body.ia_ativa);
    }
    const conversa = await getConversationById(id);
    return NextResponse.json({ ok: true, conversa });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

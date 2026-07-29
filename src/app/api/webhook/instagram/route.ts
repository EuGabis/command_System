import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/repo";
import { processarMensagemRecebida } from "@/lib/engine";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  const conn = await getConnection("instagram");
  if (mode === "subscribe" && token && token === conn.verifyToken) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Verificação falhou", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = body?.entry?.[0];
    const messaging = entry?.messaging?.[0];
    const texto = messaging?.message?.text as string | undefined;
    const senderId = messaging?.sender?.id as string | undefined;
    // Ignora echo das próprias mensagens
    if (texto && senderId && !messaging?.message?.is_echo) {
      await processarMensagemRecebida("instagram", senderId, texto);
    }
  } catch (e) {
    console.error("Webhook Instagram erro:", e);
  }
  return NextResponse.json({ ok: true });
}

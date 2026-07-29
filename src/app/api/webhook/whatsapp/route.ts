import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/repo";
import { processarMensagemRecebida } from "@/lib/engine";

// Verificação do webhook (Meta faz GET com hub.challenge)
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  const conn = await getConnection("whatsapp");
  if (mode === "subscribe" && token && token === conn.verifyToken) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Verificação falhou", { status: 403 });
}

// Eventos de mensagens
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const msg = change?.messages?.[0];

    if (msg?.type === "text") {
      const from = msg.from as string;
      const texto = msg.text?.body as string;
      const nome = change?.contacts?.[0]?.profile?.name as string | undefined;
      await processarMensagemRecebida("whatsapp", from, texto, nome);
    }
  } catch (e) {
    console.error("Webhook WhatsApp erro:", e);
  }
  // Sempre 200 para a Meta não reenviar em loop
  return NextResponse.json({ ok: true });
}

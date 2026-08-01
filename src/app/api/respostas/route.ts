import { NextRequest, NextResponse } from "next/server";
import { listQuickReplies, createQuickReply } from "@/lib/repo";

export async function GET() {
  const respostas = await listQuickReplies();
  return NextResponse.json({ respostas });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const titulo = String(body?.titulo ?? "").trim();
  const texto = String(body?.texto ?? "").trim();
  if (!titulo || !texto) {
    return NextResponse.json({ error: "Informe título e texto." }, { status: 400 });
  }
  try {
    const resposta = await createQuickReply(titulo, texto);
    return NextResponse.json({ ok: true, resposta });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

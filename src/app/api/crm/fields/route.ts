import { NextRequest, NextResponse } from "next/server";
import { listCustomFields, createCustomField } from "@/lib/repo";
import type { CustomFieldTipo } from "@/lib/types";

const TIPOS: CustomFieldTipo[] = ["texto", "numero", "data", "selecao"];

export async function GET() {
  return NextResponse.json({ fields: await listCustomFields() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const nome = String(body?.nome ?? "").trim();
  const tipo: CustomFieldTipo = TIPOS.includes(body?.tipo) ? body.tipo : "texto";
  const opcoes = Array.isArray(body?.opcoes)
    ? body.opcoes.map((o: unknown) => String(o).trim()).filter(Boolean)
    : [];
  if (!nome) return NextResponse.json({ error: "Informe o nome do campo." }, { status: 400 });
  try {
    const field = await createCustomField(nome, tipo, opcoes);
    return NextResponse.json({ ok: true, field });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

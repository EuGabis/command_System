import { NextRequest, NextResponse } from "next/server";
import { updateCustomField, deleteCustomField } from "@/lib/repo";
import type { CustomFieldTipo } from "@/lib/types";

const TIPOS: CustomFieldTipo[] = ["texto", "numero", "data", "selecao"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const patch: Partial<{ nome: string; tipo: CustomFieldTipo; opcoes: string[] }> = {};
  if (typeof body.nome === "string") patch.nome = body.nome.trim();
  if (TIPOS.includes(body.tipo)) patch.tipo = body.tipo;
  if (Array.isArray(body.opcoes)) {
    patch.opcoes = body.opcoes.map((o: unknown) => String(o).trim()).filter(Boolean);
  }
  try {
    await updateCustomField(id, patch);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await deleteCustomField(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

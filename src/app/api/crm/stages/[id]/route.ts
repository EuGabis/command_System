import { NextRequest, NextResponse } from "next/server";
import { updateStage, deleteStage } from "@/lib/repo";
import type { StageTipo } from "@/lib/types";

const TIPOS: StageTipo[] = ["em_processo", "ganho", "perdido"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const patch: Partial<{ nome: string; cor: string; tipo: StageTipo; ordem: number }> = {};
  if (typeof body.nome === "string") patch.nome = body.nome.trim();
  if (typeof body.cor === "string") patch.cor = body.cor;
  if (TIPOS.includes(body.tipo)) patch.tipo = body.tipo;
  if (typeof body.ordem === "number") patch.ordem = body.ordem;
  try {
    await updateStage(id, patch);
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
    await deleteStage(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

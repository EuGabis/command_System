import { NextRequest, NextResponse } from "next/server";
import { listStages, createStage } from "@/lib/repo";
import type { StageTipo } from "@/lib/types";

const TIPOS: StageTipo[] = ["em_processo", "ganho", "perdido"];

export async function GET() {
  return NextResponse.json({ stages: await listStages() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const nome = String(body?.nome ?? "").trim();
  const cor = String(body?.cor ?? "#f2871e");
  const tipo: StageTipo = TIPOS.includes(body?.tipo) ? body.tipo : "em_processo";
  if (!nome) return NextResponse.json({ error: "Informe o nome da etapa." }, { status: 400 });
  try {
    const stage = await createStage(nome, cor, tipo);
    return NextResponse.json({ ok: true, stage });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

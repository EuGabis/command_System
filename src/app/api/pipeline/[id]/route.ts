import { NextRequest, NextResponse } from "next/server";
import { setPipelineStage } from "@/lib/repo";
import { PIPELINE_STAGES, type PipelineStage } from "@/lib/types";

const VALID = new Set(PIPELINE_STAGES.map((s) => s.key));

// Move um lead de estágio (manual). Trava a IA de sobrescrever depois.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const stage = body?.stage as string | undefined;
  if (!stage || !VALID.has(stage as PipelineStage)) {
    return NextResponse.json({ error: "Estágio inválido" }, { status: 400 });
  }
  try {
    await setPipelineStage(id, stage as PipelineStage, true);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

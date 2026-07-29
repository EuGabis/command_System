import { NextRequest, NextResponse } from "next/server";
import { saveAiConfig } from "@/lib/repo";
import type { AiConfig } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const cfg = (await req.json()) as AiConfig;
    await saveAiConfig(cfg);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

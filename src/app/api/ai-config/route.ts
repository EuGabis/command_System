import { NextRequest, NextResponse } from "next/server";
import { saveAiConfig } from "@/lib/repo";
import type { AiConfig, Platform } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AiConfig & { platform?: string };
    const platform = body.platform;
    if (platform !== "whatsapp" && platform !== "instagram") {
      return NextResponse.json({ error: "Canal inválido." }, { status: 400 });
    }
    await saveAiConfig(platform as Platform, body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { listConversations, listConversationsByPlatform } from "@/lib/repo";
import type { Platform } from "@/lib/types";

// Lista conversas (todas ou por plataforma). Usado pelo polling do inbox.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("platform");
  const platform: Platform | null = p === "whatsapp" || p === "instagram" ? p : null;
  const conversas = platform
    ? await listConversationsByPlatform(platform, 200)
    : await listConversations();
  return NextResponse.json({ conversas });
}

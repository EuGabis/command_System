import { NextResponse } from "next/server";
import { listConversations } from "@/lib/repo";

// Lista todos os leads (conversas) para o quadro do pipeline.
export async function GET() {
  const conversas = await listConversations();
  return NextResponse.json({ conversas });
}

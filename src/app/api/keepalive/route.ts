import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

// Ping diário (Vercel Cron) para manter o projeto Supabase ativo e evitar a
// pausa por inatividade do plano gratuito. Faz uma leitura mínima no banco.
export async function GET(req: NextRequest) {
  // Se CRON_SECRET estiver definido, exige o header do Vercel Cron.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "não autorizado" }, { status: 401 });
    }
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, reason: "supabase não configurado" });
  }

  try {
    // leitura leve só para tocar o banco e mantê-lo ativo
    await supabaseAdmin().from("ai_config").select("platform", { head: true, count: "exact" });
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

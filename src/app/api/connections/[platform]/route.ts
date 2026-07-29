import { NextRequest, NextResponse } from "next/server";
import { saveConnection, setConnectionStatus, getCredentials } from "@/lib/repo";
import { whatsappTest, instagramTest } from "@/lib/meta";
import type { Platform, WhatsAppCredentials, InstagramCredentials } from "@/lib/types";

function parsePlatform(p: string): Platform | null {
  return p === "whatsapp" || p === "instagram" ? p : null;
}

// Salvar credenciais + verify token
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform: raw } = await params;
  const platform = parsePlatform(raw);
  if (!platform) return NextResponse.json({ error: "Plataforma inválida" }, { status: 400 });

  const body = await req.json();
  const { verifyToken, ...credentials } = body;
  try {
    await saveConnection(platform, credentials, verifyToken ?? "");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// Testar conexão
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform: raw } = await params;
  const platform = parsePlatform(raw);
  if (!platform) return NextResponse.json({ error: "Plataforma inválida" }, { status: 400 });

  try {
    if (platform === "whatsapp") {
      const creds = await getCredentials<WhatsAppCredentials>("whatsapp");
      if (!creds) throw new Error("Sem credenciais salvas.");
      await whatsappTest(creds);
    } else {
      const creds = await getCredentials<InstagramCredentials>("instagram");
      if (!creds) throw new Error("Sem credenciais salvas.");
      await instagramTest(creds);
    }
    await setConnectionStatus(platform, "conectado", null);
    return NextResponse.json({ ok: true, status: "conectado" });
  } catch (e) {
    await setConnectionStatus(platform, "erro", String(e));
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

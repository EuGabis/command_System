import { NextRequest, NextResponse } from "next/server";
import {
  isEvolutionConfigured,
  defaultInstance,
  evolutionEnsureInstance,
  evolutionConnect,
  evolutionStatus,
  evolutionSetWebhook,
  evolutionLogout,
} from "@/lib/evolution";
import { saveConnection, setConnectionStatus, getCredentials } from "@/lib/repo";
import type { EvolutionCredentials } from "@/lib/types";

// Descobre a URL pública do app para configurar o webhook da Evolution.
function appUrl(req: NextRequest): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, "");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return `${proto}://${host}`;
}

async function resolveInstance(bodyInstance?: string): Promise<string> {
  if (bodyInstance && bodyInstance.trim()) return bodyInstance.trim();
  const saved = await getCredentials<EvolutionCredentials>("whatsapp");
  if (saved?.provider === "evolution" && saved.instanceName) return saved.instanceName;
  return defaultInstance();
}

export async function POST(req: NextRequest) {
  if (!isEvolutionConfigured()) {
    return NextResponse.json(
      { error: "Evolution API não configurada (EVOLUTION_API_URL / EVOLUTION_API_KEY)." },
      { status: 400 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const action = body?.action as string | undefined;
  const instance = await resolveInstance(body?.instanceName);

  try {
    if (action === "status") {
      const st = await evolutionStatus(instance);
      const status = st.state === "open" ? "conectado" : st.state === "connecting" ? "pendente" : "desconectado";
      await setConnectionStatus("whatsapp", status, null);
      return NextResponse.json({ ok: true, instance, ...st, status });
    }

    if (action === "connect") {
      await evolutionEnsureInstance(instance);
      // aponta o webhook para o nosso endpoint (ignora erro se o app não for público ainda)
      try {
        await evolutionSetWebhook(instance, `${appUrl(req)}/api/webhook/evolution`);
      } catch (e) {
        console.warn("Falha ao configurar webhook Evolution:", e);
      }

      const st = await evolutionStatus(instance);
      let base64: string | null = null;
      let pairingCode: string | null = null;
      if (st.state !== "open") {
        const qr = await evolutionConnect(instance);
        base64 = qr.base64;
        pairingCode = qr.pairingCode;
      }

      const creds: EvolutionCredentials = { provider: "evolution", instanceName: instance };
      const status = st.state === "open" ? "conectado" : "pendente";
      await saveConnection("whatsapp", creds as unknown as Record<string, string>, "", status);

      return NextResponse.json({ ok: true, instance, state: st.state, status, base64, pairingCode, number: st.number, profileName: st.profileName });
    }

    if (action === "logout") {
      await evolutionLogout(instance);
      await setConnectionStatus("whatsapp", "desconectado", null);
      return NextResponse.json({ ok: true, instance, status: "desconectado" });
    }

    return NextResponse.json({ error: "Ação inválida (use connect | status | logout)." }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await setConnectionStatus("whatsapp", "erro", msg).catch(() => {});
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}

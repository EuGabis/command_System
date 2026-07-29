import Link from "next/link";
import ChannelStats from "@/components/ChannelStats";
import { getConnection, getPlatformStats, isSupabaseConfigured } from "@/lib/repo";
import { isOpenAIConfigured } from "@/lib/ai";
import { isEncryptionConfigured } from "@/lib/crypto";
import type { Platform, ConnectionStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [wa, ig, waStats, igStats] = await Promise.all([
    getConnection("whatsapp"),
    getConnection("instagram"),
    getPlatformStats("whatsapp"),
    getPlatformStats("instagram"),
  ]);

  const checks = [
    { label: "Supabase (banco)", ok: isSupabaseConfigured() },
    { label: "OpenAI (IA)", ok: isOpenAIConfigured() },
    { label: "Chave de criptografia", ok: isEncryptionConfigured() },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Dashboard</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Visão geral de cada canal separadamente.
      </p>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <ChannelCard
          platform="whatsapp"
          titulo="🟢 WhatsApp"
          status={wa.status}
          total={waStats.total}
          aguardando={waStats.aguardando}
        />
        <ChannelCard
          platform="instagram"
          titulo="📸 Instagram"
          status={ig.status}
          total={igStats.total}
          aguardando={igStats.aguardando}
        />
      </div>

      <div className="card">
        <strong>Checklist de configuração</strong>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {checks.map((c) => (
            <div key={c.label} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}>
              <span>{c.ok ? "✅" : "⚠️"}</span>
              <span style={{ color: c.ok ? "var(--text)" : "var(--muted)" }}>
                {c.label} {c.ok ? "" : "— pendente"}
              </span>
            </div>
          ))}
        </div>
        {!isSupabaseConfigured() && (
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 12 }}>
            Rode <code>supabase/schema.sql</code> no SQL Editor do Supabase para criar as tabelas.
          </p>
        )}
      </div>
    </div>
  );
}

function ChannelCard({
  platform,
  titulo,
  status,
  total,
  aguardando,
}: {
  platform: Platform;
  titulo: string;
  status: ConnectionStatus;
  total: number;
  aguardando: number;
}) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <strong style={{ fontSize: 16 }}>{titulo}</strong>
      </div>
      <ChannelStats status={status} total={total} aguardando={aguardando} />
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <Link href={`/${platform}`} className="btn secondary" style={{ fontSize: 13 }}>
          Abrir canal
        </Link>
        <Link
          href={`/conversas?platform=${platform}`}
          className="btn secondary"
          style={{ fontSize: 13 }}
        >
          Ver conversas
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import ChannelStats from "@/components/ChannelStats";
import Icon, { type IconName } from "@/components/Icon";
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
    { label: "Banco de dados (Supabase)", ok: isSupabaseConfigured() },
    { label: "Inteligência artificial (OpenAI)", ok: isOpenAIConfigured() },
    { label: "Chave de criptografia", ok: isEncryptionConfigured() },
  ];

  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Central de Comando</div>
      <h1 style={{ fontSize: 25, fontWeight: 700, marginBottom: 4 }}>Painel</h1>
      <p style={{ color: "var(--muted)", marginBottom: 26 }}>
        Situação de cada canal em tempo real.
      </p>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <ChannelCard
          platform="whatsapp"
          icon="whatsapp"
          nome="WhatsApp"
          status={wa.status}
          total={waStats.total}
          aguardando={waStats.aguardando}
        />
        <ChannelCard
          platform="instagram"
          icon="instagram"
          nome="Instagram"
          status={ig.status}
          total={igStats.total}
          aguardando={igStats.aguardando}
        />
      </div>

      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 14 }}>Configuração</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {checks.map((c) => (
            <div key={c.label} style={{ display: "flex", gap: 11, alignItems: "center", fontSize: 14 }}>
              <span
                style={{
                  width: 18, height: 18, borderRadius: 5, display: "grid", placeItems: "center",
                  color: c.ok ? "var(--green)" : "var(--amber)",
                  border: `1px solid ${c.ok ? "var(--green)" : "var(--amber)"}`,
                }}
              >
                {c.ok ? <Icon name="check" size={13} /> : <span style={{ fontSize: 11, fontWeight: 700 }}>!</span>}
              </span>
              <span style={{ color: c.ok ? "var(--text)" : "var(--muted)" }}>
                {c.label}
                {!c.ok && <span style={{ color: "var(--amber)" }}> — pendente</span>}
              </span>
            </div>
          ))}
        </div>
        {!isSupabaseConfigured() && (
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 14 }}>
            Rode <code>supabase/schema.sql</code> no SQL Editor do Supabase para criar as tabelas.
          </p>
        )}
      </div>
    </div>
  );
}

function ChannelCard({
  platform,
  icon,
  nome,
  status,
  total,
  aguardando,
}: {
  platform: Platform;
  icon: IconName;
  nome: string;
  status: ConnectionStatus;
  total: number;
  aguardando: number;
}) {
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span
          style={{
            width: 38, height: 38, borderRadius: 9, display: "grid", placeItems: "center",
            background: "var(--panel-2)", border: "1px solid var(--border)", color: "var(--brand)",
          }}
        >
          <Icon name={icon} size={20} />
        </span>
        <strong style={{ fontSize: 16, fontWeight: 600 }}>{nome}</strong>
      </div>
      <ChannelStats status={status} total={total} aguardando={aguardando} />
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Link href={`/${platform}`} className="btn">
          Abrir canal
          <Icon name="arrow" size={15} />
        </Link>
        <Link href={`/painel/conversas?platform=${platform}`} className="btn secondary">
          Ver conversas
        </Link>
      </div>
    </div>
  );
}

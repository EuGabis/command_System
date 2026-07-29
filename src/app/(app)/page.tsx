import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { getConnection, listConversations, isSupabaseConfigured } from "@/lib/repo";
import { isOpenAIConfigured } from "@/lib/ai";
import { isEncryptionConfigured } from "@/lib/crypto";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [wa, ig, conversas] = await Promise.all([
    getConnection("whatsapp"),
    getConnection("instagram"),
    listConversations(),
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
        Visão geral das conexões e do atendimento.
      </p>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>🟢 WhatsApp</strong>
            <StatusBadge status={wa.status} />
          </div>
          <Link href="/whatsapp" className="btn secondary" style={{ marginTop: 14, display: "inline-block" }}>
            Configurar
          </Link>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>📸 Instagram</strong>
            <StatusBadge status={ig.status} />
          </div>
          <Link href="/instagram" className="btn secondary" style={{ marginTop: 14, display: "inline-block" }}>
            Configurar
          </Link>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <Metric label="Conversas" value={conversas.length} />
        <Metric label="IA" value="⚙️" hint="Veja em Configuração da IA" />
        <Metric label="Plataformas conectadas" value={[wa, ig].filter((c) => c.status === "conectado").length} />
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

function Metric({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="card">
      <div style={{ color: "var(--muted)", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{value}</div>
      {hint && <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";
import { getConnection, getPlatformStats, isSupabaseConfigured } from "@/lib/repo";
import { isOpenAIConfigured } from "@/lib/ai";
import { isEncryptionConfigured } from "@/lib/crypto";
import type { Platform, ConnectionStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS: Record<ConnectionStatus, { label: string; color: string; live?: boolean }> = {
  conectado: { label: "Online", color: "var(--green)", live: true },
  pendente: { label: "Pendente", color: "var(--amber)" },
  erro: { label: "Erro", color: "var(--red)" },
  desconectado: { label: "Offline", color: "var(--muted)" },
};

const CHAN: Record<Platform, { color: string; bg: string }> = {
  whatsapp: { color: "#34c66b", bg: "rgba(52,198,107,.14)" },
  instagram: { color: "#e1508a", bg: "rgba(225,80,138,.14)" },
};

export default async function Dashboard() {
  const [wa, ig, waStats, igStats] = await Promise.all([
    getConnection("whatsapp"),
    getConnection("instagram"),
    getPlatformStats("whatsapp"),
    getPlatformStats("instagram"),
  ]);

  const totalConversas = waStats.total + igStats.total;
  const totalAguardando = waStats.aguardando + igStats.aguardando;
  const online = [wa, ig].filter((c) => c.status === "conectado").length;
  const iaOn = isOpenAIConfigured();

  const checks = [
    { label: "Banco de dados (Supabase)", ok: isSupabaseConfigured() },
    { label: "Inteligência artificial (OpenAI)", ok: iaOn },
    { label: "Chave de criptografia", ok: isEncryptionConfigured() },
  ];
  const tudoOk = checks.every((c) => c.ok);

  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Central de Comando</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Painel</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Visão geral do atendimento em tempo real.
      </p>

      {/* KPIs */}
      <div className="kpi-grid">
        <Kpi icon="chat" label="Conversas" num={totalConversas} sub="WhatsApp + Instagram" />
        <Kpi icon="user" label="Aguardando" num={totalAguardando} sub="atendimento humano" accentAmber={totalAguardando > 0} />
        <Kpi icon="rocket" label="Canais no ar" num={`${online}/2`} sub="conexões ativas" />
        <Kpi icon="ai" label="Inteligência" num={iaOn ? "Ativa" : "Off"} sub={iaOn ? "respondendo 24h" : "configure a OpenAI"} />
      </div>

      {/* Canais */}
      <div className="grid-2" style={{ marginBottom: 22 }}>
        <ChannelCard platform="whatsapp" icon="whatsapp" nome="WhatsApp" status={wa.status} total={waStats.total} aguardando={waStats.aguardando} />
        <ChannelCard platform="instagram" icon="instagram" nome="Instagram" status={ig.status} total={igStats.total} aguardando={igStats.aguardando} />
      </div>

      {/* Saúde do sistema */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div className="eyebrow">Saúde do sistema</div>
          <span
            className="status-pill"
            style={{
              color: tudoOk ? "var(--green)" : "var(--amber)",
              background: tudoOk ? "rgba(52,198,107,.12)" : "rgba(242,135,30,.12)",
            }}
          >
            <span className="dot" style={{ background: "currentColor" }} />
            {tudoOk ? "Operacional" : "Pendências"}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {checks.map((c) => (
            <div key={c.label} style={{ display: "flex", gap: 11, alignItems: "center", fontSize: 14, background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: "var(--r-ctrl)", padding: "11px 13px" }}>
              <span
                style={{
                  width: 22, height: 22, borderRadius: 6, flex: "none", display: "grid", placeItems: "center",
                  color: c.ok ? "var(--green)" : "var(--amber)",
                  background: c.ok ? "rgba(52,198,107,.14)" : "rgba(242,135,30,.14)",
                }}
              >
                {c.ok ? <Icon name="check" size={13} /> : <span style={{ fontSize: 12, fontWeight: 800 }}>!</span>}
              </span>
              <span style={{ color: c.ok ? "var(--text)" : "var(--muted)" }}>{c.label}</span>
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

function Kpi({ icon, label, num, sub, accentAmber }: { icon: IconName; label: string; num: number | string; sub: string; accentAmber?: boolean }) {
  return (
    <div className="kpi">
      <div className="kpi-top">
        <span className="eyebrow">{label}</span>
        <span className="kpi-ic"><Icon name={icon} size={18} /></span>
      </div>
      <div className="kpi-num" style={accentAmber ? { color: "var(--amber)" } : undefined}>{num}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  );
}

function ChannelCard({
  platform, icon, nome, status, total, aguardando,
}: {
  platform: Platform; icon: IconName; nome: string; status: ConnectionStatus; total: number; aguardando: number;
}) {
  const s = STATUS[status] ?? STATUS.desconectado;
  const c = CHAN[platform];
  return (
    <div className="chan">
      <div className="chan-head">
        <span className="chan-ic" style={{ background: c.bg, color: c.color }}>
          <Icon name={icon} size={22} />
        </span>
        <span className="chan-name">{nome}</span>
        <span className="status-pill" style={{ color: s.color, background: "var(--panel-2)" }}>
          <span className={`dot${s.live ? " live" : ""}`} style={{ background: "currentColor" }} />
          {s.label}
        </span>
      </div>

      <div className="chan-metrics">
        <div className="metric">
          <div className="lbl">Conversas</div>
          <div className="val">{total}</div>
        </div>
        <div className="metric">
          <div className="lbl">Aguardando</div>
          <div className="val" style={{ color: aguardando > 0 ? "var(--amber)" : "var(--text)" }}>{aguardando}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Link href={`/painel/${platform}`} className="btn">
          Abrir canal <Icon name="arrow" size={15} />
        </Link>
        <Link href={`/painel/conversas?platform=${platform}`} className="btn secondary">
          Ver conversas
        </Link>
      </div>
    </div>
  );
}

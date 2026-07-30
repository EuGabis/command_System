import type { ConnectionStatus } from "@/lib/types";

const statusMap: Record<ConnectionStatus, { label: string; color: string; live?: boolean }> = {
  conectado: { label: "Conectado", color: "var(--green)", live: true },
  pendente: { label: "Pendente", color: "var(--amber)" },
  erro: { label: "Erro", color: "var(--red)" },
  desconectado: { label: "Offline", color: "var(--muted)" },
};

function Cell({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0, padding: "13px 15px" }}>
      <div className="eyebrow" style={{ marginBottom: 9 }}>{label}</div>
      {children}
    </div>
  );
}

export default function ChannelStats({
  status,
  total,
  aguardando,
}: {
  status: ConnectionStatus;
  total: number;
  aguardando: number;
}) {
  const s = statusMap[status] ?? statusMap.desconectado;
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-ctrl)",
        background: "var(--panel-2)",
        overflow: "hidden",
      }}
    >
      <Cell label="Conexão">
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: s.color, height: 26 }}>
          <span className={`dot${s.live ? " live" : ""}`} style={{ background: "currentColor" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{s.label}</span>
        </div>
      </Cell>
      <div style={{ width: 1, background: "var(--border)" }} />
      <Cell label="Conversas">
        <div className="readout-num" style={{ fontSize: 24 }}>{total}</div>
      </Cell>
      <div style={{ width: 1, background: "var(--border)" }} />
      <Cell label="Aguardando">
        <div
          className="readout-num"
          style={{ fontSize: 24, color: aguardando > 0 ? "var(--amber)" : "var(--text)" }}
        >
          {aguardando}
        </div>
      </Cell>
    </div>
  );
}

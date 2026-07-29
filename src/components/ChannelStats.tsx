import StatusBadge from "./StatusBadge";
import type { ConnectionStatus } from "@/lib/types";

function Tile({ label, value, accent }: { label: string; value: React.ReactNode; accent?: string }) {
  return (
    <div
      style={{
        background: "var(--panel-2)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "12px 14px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ color: "var(--muted)", fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: accent ?? "var(--text)" }}>
        {value}
      </div>
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
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <div
        style={{
          background: "var(--panel-2)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "12px 14px",
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ color: "var(--muted)", fontSize: 12 }}>Conexão</div>
        <StatusBadge status={status} />
      </div>
      <Tile label="Conversas" value={total} />
      <Tile
        label="Aguardando"
        value={aguardando}
        accent={aguardando > 0 ? "var(--amber)" : "var(--text)"}
      />
    </div>
  );
}

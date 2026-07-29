import type { ConnectionStatus } from "@/lib/types";

const map: Record<ConnectionStatus, { label: string; color: string }> = {
  conectado: { label: "Conectado", color: "var(--green)" },
  pendente: { label: "Pendente", color: "var(--amber)" },
  erro: { label: "Erro", color: "var(--red)" },
  desconectado: { label: "Desconectado", color: "var(--muted)" },
};

export default function StatusBadge({ status }: { status: ConnectionStatus }) {
  const s = map[status] ?? map.desconectado;
  return (
    <span className="badge">
      <span className="dot" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

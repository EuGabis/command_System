import Link from "next/link";
import ChannelStats from "./ChannelStats";
import { getPlatformStats, listConversationsByPlatform } from "@/lib/repo";
import type { Platform, ConnectionStatus } from "@/lib/types";

const statusLabel: Record<string, string> = {
  aberta: "aberta",
  ia: "IA",
  humano: "humano",
  fechada: "fechada",
};

export default async function ChannelOverview({
  platform,
  status,
}: {
  platform: Platform;
  status: ConnectionStatus;
}) {
  const [stats, conversas] = await Promise.all([
    getPlatformStats(platform),
    listConversationsByPlatform(platform),
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
      <ChannelStats status={status} total={stats.total} aguardando={stats.aguardando} />

      <div className="card">
        <strong>Conversas deste canal</strong>
        {conversas.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>
            Nenhuma conversa ainda. Assim que chegar uma mensagem, ela aparece aqui.
          </p>
        ) : (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {conversas.map((c) => (
              <Link
                key={c.id}
                href={`/conversas?id=${c.id}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "var(--panel-2)",
                  textDecoration: "none",
                  color: "var(--text)",
                  fontSize: 14,
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.nome_contato ?? c.contato}
                </span>
                <span className="badge" style={{ fontSize: 11 }}>
                  {statusLabel[c.status] ?? c.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

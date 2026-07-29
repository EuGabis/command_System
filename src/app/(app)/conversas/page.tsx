import { listConversations, getMessages } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function ConversasPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const conversas = await listConversations();
  const selecionada = id ?? conversas[0]?.id;
  const mensagens = selecionada ? await getMessages(selecionada) : [];

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Conversas</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>Inbox unificado do WhatsApp e Instagram.</p>

      {conversas.length === 0 ? (
        <div className="card" style={{ color: "var(--muted)" }}>
          Nenhuma conversa ainda. Assim que chegar uma mensagem nos webhooks, ela aparecerá aqui.
        </div>
      ) : (
        <div className="grid-inbox">
          <div className="card" style={{ padding: 8, maxHeight: 560, overflowY: "auto" }}>
            {conversas.map((c) => (
              <a
                key={c.id}
                href={`/conversas?id=${c.id}`}
                style={{
                  display: "block",
                  padding: "10px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: "var(--text)",
                  background: c.id === selecionada ? "var(--panel-2)" : "transparent",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {c.platform === "whatsapp" ? "🟢" : "📸"} {c.nome_contato ?? c.contato}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{c.status}</div>
              </a>
            ))}
          </div>

          <div className="card" style={{ maxHeight: 560, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {mensagens.length === 0 ? (
              <span style={{ color: "var(--muted)" }}>Selecione uma conversa.</span>
            ) : (
              mensagens.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.direcao === "saida" ? "flex-end" : "flex-start",
                    maxWidth: "75%",
                    background: m.direcao === "saida" ? "var(--brand)" : "var(--panel-2)",
                    color: m.direcao === "saida" ? "#fff" : "var(--text)",
                    padding: "8px 12px",
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                >
                  <div>{m.conteudo}</div>
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
                    {m.autor} · {new Date(m.created_at).toLocaleString("pt-BR")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

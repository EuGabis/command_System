"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Conversation, Message, Platform } from "@/lib/types";

type Tab = "abertas" | "pendentes" | "resolvidas" | "todas";
type PlatFilter = "todos" | Platform;

const TABS: { key: Tab; label: string }[] = [
  { key: "abertas", label: "Abertas" },
  { key: "pendentes", label: "Pendentes" },
  { key: "resolvidas", label: "Resolvidas" },
  { key: "todas", label: "Todas" },
];

function icon(p: string) {
  return p === "whatsapp" ? "🟢" : "📸";
}

function hora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversasInbox({ initial }: { initial: Conversation[] }) {
  const [conversas, setConversas] = useState<Conversation[]>(initial);
  const [selectedId, setSelectedId] = useState<string | null>(initial[0]?.id ?? null);
  const [conversa, setConversa] = useState<Conversation | null>(initial[0] ?? null);
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [tab, setTab] = useState<Tab>("abertas");
  const [plat, setPlat] = useState<PlatFilter>("todos");
  const [busca, setBusca] = useState("");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastCountRef = useRef(0);

  const carregarLista = useCallback(async () => {
    try {
      const res = await fetch("/api/conversas", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data.conversas)) setConversas(data.conversas);
    } catch {
      /* silencioso */
    }
  }, []);

  const carregarDetalhe = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/conversas/${id}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.conversa) setConversa(data.conversa);
      if (Array.isArray(data.mensagens)) setMensagens(data.mensagens);
    } catch {
      /* silencioso */
    }
  }, []);

  // Polling: lista a cada 4s, detalhe da conversa aberta a cada 3s.
  useEffect(() => {
    const t = setInterval(carregarLista, 4000);
    return () => clearInterval(t);
  }, [carregarLista]);

  useEffect(() => {
    if (!selectedId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch assíncrono, não é setState síncrono
    void carregarDetalhe(selectedId);
    const t = setInterval(() => carregarDetalhe(selectedId), 3000);
    return () => clearInterval(t);
  }, [selectedId, carregarDetalhe]);

  // auto-scroll quando chega mensagem nova
  useEffect(() => {
    if (mensagens.length !== lastCountRef.current) {
      lastCountRef.current = mensagens.length;
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [mensagens]);

  const filtradas = useMemo(() => {
    return conversas.filter((c) => {
      if (plat !== "todos" && c.platform !== plat) return false;
      const resolvida = c.status === "fechada";
      if (tab === "abertas" && (resolvida || c.ia_ativa === false)) return false;
      if (tab === "pendentes" && (resolvida || c.ia_ativa !== false)) return false;
      if (tab === "resolvidas" && !resolvida) return false;
      if (busca.trim()) {
        const q = busca.toLowerCase();
        const alvo = `${c.nome_contato ?? ""} ${c.contato}`.toLowerCase();
        if (!alvo.includes(q)) return false;
      }
      return true;
    });
  }, [conversas, plat, tab, busca]);

  function selecionar(id: string) {
    setSelectedId(id);
    setMensagens([]);
    lastCountRef.current = 0;
    setMobileView("chat");
  }

  async function patch(body: Record<string, unknown>) {
    if (!selectedId) return;
    const res = await fetch(`/api/conversas/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.conversa) {
      setConversa(data.conversa);
      setConversas((prev) => prev.map((c) => (c.id === data.conversa.id ? data.conversa : c)));
    }
  }

  async function enviar() {
    const t = texto.trim();
    if (!t || !selectedId || enviando) return;
    setEnviando(true);
    try {
      const res = await fetch(`/api/conversas/${selectedId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: t }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setTexto("");
        await carregarDetalhe(selectedId);
      } else {
        alert(data.error ?? "Falha ao enviar");
      }
    } finally {
      setEnviando(false);
    }
  }

  const resolvida = conversa?.status === "fechada";
  const nome = conversa?.nome_contato ?? conversa?.contato ?? "";

  return (
    <div className="inbox" data-view={mobileView}>
      {/* ===== Coluna 1: lista ===== */}
      <div className="inbox-col inbox-list">
        <div style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <strong style={{ fontSize: 16 }}>Conversas</strong>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{filtradas.length}</span>
          </div>
          <input
            className="input"
            placeholder="Buscar conversa…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            {(["todos", "whatsapp", "instagram"] as PlatFilter[]).map((p) => (
              <button
                key={p}
                onClick={() => setPlat(p)}
                className="badge"
                style={{
                  cursor: "pointer",
                  border: "1px solid var(--border)",
                  background: plat === p ? "var(--brand)" : "var(--panel-2)",
                  color: plat === p ? "#fff" : "var(--text)",
                }}
              >
                {p === "todos" ? "Todos" : p === "whatsapp" ? "🟢 WA" : "📸 IG"}
              </button>
            ))}
          </div>
        </div>

        <div className="inbox-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`inbox-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="inbox-scroll">
          {filtradas.length === 0 ? (
            <div style={{ padding: 20, color: "var(--muted)", fontSize: 13 }}>Nenhuma conversa aqui.</div>
          ) : (
            filtradas.map((c) => (
              <button
                key={c.id}
                className={`conv-item${c.id === selectedId ? " active" : ""}`}
                onClick={() => selecionar(c.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {icon(c.platform)} {c.nome_contato ?? c.contato}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {new Date(c.updated_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                  {c.status === "fechada" ? "Resolvida" : c.ia_ativa === false ? "Pendente (humano)" : "Aberta"}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ===== Coluna 2: chat ===== */}
      <div className="inbox-col inbox-chat">
        {!conversa ? (
          <div style={{ margin: "auto", color: "var(--muted)" }}>Selecione uma conversa.</div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, borderBottom: "1px solid var(--border)" }}>
              <button
                className="btn secondary"
                onClick={() => setMobileView("list")}
                style={{ padding: "6px 10px", display: "none" }}
                data-mobile-back
              >
                ←
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {icon(conversa.platform)} {nome}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>+{conversa.contato}</div>
              </div>
              <button
                className="btn secondary"
                onClick={() => patch({ status: resolvida ? "aberta" : "fechada" })}
              >
                {resolvida ? "Reabrir" : "Resolver"}
              </button>
            </div>

            <div ref={scrollRef} className="inbox-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
              {mensagens.map((m) => {
                const cls = m.direcao === "entrada" ? "in" : m.autor === "humano" ? "human" : "out";
                return (
                  <div key={m.id} className={`bubble ${cls}`}>
                    <div>{m.conteudo}</div>
                    <div className="meta">
                      {m.autor} · {hora(m.created_at)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--border)" }}>
              <input
                className="input"
                placeholder="Digite uma mensagem…"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    enviar();
                  }
                }}
              />
              <button className="btn" onClick={enviar} disabled={enviando || !texto.trim()}>
                {enviando ? "…" : "Enviar"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ===== Coluna 3: painel do contato ===== */}
      <div className="inbox-col inbox-panel">
        {conversa && (
          <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, marginBottom: 8 }}>CONTATO</div>
              <div style={{ fontWeight: 700 }}>{nome}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>+{conversa.contato}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                Canal: {conversa.platform === "whatsapp" ? "WhatsApp" : "Instagram"}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, marginBottom: 8 }}>AGENTE IA</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14 }}>Respondendo automaticamente</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={conversa.ia_ativa !== false}
                    onChange={(e) => patch({ ia_ativa: e.target.checked })}
                  />
                  <span className="slider" />
                </label>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                {conversa.ia_ativa !== false
                  ? "A IA responde novas mensagens desta conversa."
                  : "IA pausada — assuma o atendimento manualmente."}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, marginBottom: 8 }}>STATUS</div>
              <span
                className="badge"
                style={{
                  background: resolvida ? "var(--panel-2)" : "rgba(34,197,94,.15)",
                  color: resolvida ? "var(--muted)" : "var(--green)",
                  borderColor: "var(--border)",
                }}
              >
                {resolvida ? "Resolvida" : conversa.ia_ativa === false ? "Pendente" : "Aberta"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

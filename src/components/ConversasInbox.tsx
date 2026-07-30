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

const AVATAR_COLORS = ["#4f8cff", "#22c55e", "#f59e0b", "#a855f7", "#ec4899", "#14b8a6", "#ef4444"];

function iniciais(nome: string) {
  const parts = nome.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function corAvatar(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function Avatar({ nome, seed, size = 40 }: { nome: string; seed: string; size?: number }) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: corAvatar(seed), fontSize: size * 0.4 }}
    >
      {iniciais(nome)}
    </span>
  );
}

// Render leve de markdown das mensagens: **negrito**, listas "- " e quebras de linha.
function MensagemTexto({ texto }: { texto: string }) {
  const linhas = texto.replace(/\r/g, "").split("\n");
  const nodes: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flush = (key: string) => {
    if (bullets.length) {
      nodes.push(
        <ul key={key}>
          {bullets.map((b, i) => (
            <li key={i}>{inline(b)}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };

  linhas.forEach((linha, i) => {
    const l = linha.trimEnd();
    const m = l.match(/^\s*[-*•]\s+(.*)$/);
    if (m) {
      bullets.push(m[1]);
    } else {
      flush(`ul-${i}`);
      if (l.trim()) nodes.push(<p key={`p-${i}`}>{inline(l)}</p>);
    }
  });
  flush("ul-end");
  return <>{nodes}</>;
}

function inline(s: string): React.ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p,
  );
}

function horaCurta(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function diaLabel(iso: string) {
  const d = new Date(iso);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(d, hoje)) return "Hoje";
  if (sameDay(d, ontem)) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
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

  useEffect(() => {
    const t = setInterval(carregarLista, 4000);
    return () => clearInterval(t);
  }, [carregarLista]);

  useEffect(() => {
    if (!selectedId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch assíncrono
    void carregarDetalhe(selectedId);
    const t = setInterval(() => carregarDetalhe(selectedId), 3000);
    return () => clearInterval(t);
  }, [selectedId, carregarDetalhe]);

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
        if (!`${c.nome_contato ?? ""} ${c.contato}`.toLowerCase().includes(q)) return false;
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
  const iaOn = conversa?.ia_ativa !== false;

  return (
    <div className="inbox" data-view={mobileView}>
      {/* ===== Coluna 1: lista ===== */}
      <div className="inbox-col inbox-list">
        <div style={{ padding: "14px 14px 10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <strong style={{ fontSize: 17 }}>Conversas</strong>
            <span
              style={{
                fontSize: 11, fontWeight: 700, color: "var(--muted)",
                background: "var(--panel-2)", padding: "2px 9px", borderRadius: 999,
              }}
            >
              {filtradas.length}
            </span>
          </div>
          <input
            className="input"
            placeholder="Buscar conversa…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ marginBottom: 10 }}
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
                {p === "todos" ? "Todos" : p === "whatsapp" ? "🟢 WhatsApp" : "📸 Instagram"}
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
            <div style={{ padding: 24, color: "var(--muted)", fontSize: 13, textAlign: "center" }}>
              Nenhuma conversa aqui.
            </div>
          ) : (
            filtradas.map((c) => {
              const cnome = c.nome_contato ?? c.contato;
              return (
                <button
                  key={c.id}
                  className={`conv-item${c.id === selectedId ? " active" : ""}`}
                  onClick={() => selecionar(c.id)}
                >
                  <Avatar nome={cnome} seed={c.contato} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cnome}
                      </span>
                      <span style={{ fontSize: 10.5, color: "var(--muted)", whiteSpace: "nowrap" }}>
                        {new Date(c.updated_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                      <span className="dot" style={{ background: c.status === "fechada" ? "var(--muted)" : c.ia_ativa === false ? "var(--amber)" : "var(--green)" }} />
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        {c.platform === "whatsapp" ? "WhatsApp" : "Instagram"}
                        {" · "}
                        {c.status === "fechada" ? "Resolvida" : c.ia_ativa === false ? "Pendente" : "Aberta"}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ===== Coluna 2: chat ===== */}
      <div className="inbox-col inbox-chat">
        {!conversa ? (
          <div style={{ margin: "auto", color: "var(--muted)" }}>Selecione uma conversa.</div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
              <button
                className="btn secondary"
                onClick={() => setMobileView("list")}
                style={{ padding: "6px 10px", display: "none" }}
                data-mobile-back
              >
                ←
              </button>
              <Avatar nome={nome} seed={conversa.contato} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {nome}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {conversa.platform === "whatsapp" ? "🟢 WhatsApp" : "📸 Instagram"} · +{conversa.contato}
                </div>
              </div>
              <button
                className="btn secondary"
                onClick={() => patch({ status: resolvida ? "aberta" : "fechada" })}
              >
                {resolvida ? "Reabrir" : "Resolver"}
              </button>
            </div>

            <div ref={scrollRef} className="chat-bg">
              {mensagens.map((m, i) => {
                const cls = m.direcao === "entrada" ? "in" : m.autor === "humano" ? "human" : "out";
                const prev = mensagens[i - 1];
                const novoDia = !prev || diaLabel(prev.created_at) !== diaLabel(m.created_at);
                return (
                  <div key={m.id} style={{ display: "contents" }}>
                    {novoDia && (
                      <div className="date-sep">
                        <span>{diaLabel(m.created_at)}</span>
                      </div>
                    )}
                    <div className={`msg-row${m.direcao === "entrada" ? "" : " right"}`}>
                      <div className={`bubble ${cls}`}>
                        <MensagemTexto texto={m.conteudo} />
                        <div className="meta">
                          {m.autor === "ia" ? "🤖 IA" : m.autor === "humano" ? "Você" : "Cliente"} · {horaCurta(m.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--border)", background: "var(--panel)" }}>
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
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
              <Avatar nome={nome} seed={conversa.contato} size={72} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{nome}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>+{conversa.contato}</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, marginBottom: 10 }}>AGENTE IA</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>Respondendo automaticamente</span>
                <label className="switch">
                  <input type="checkbox" checked={iaOn} onChange={(e) => patch({ ia_ativa: e.target.checked })} />
                  <span className="slider" />
                </label>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
                {iaOn
                  ? "A IA responde novas mensagens desta conversa automaticamente."
                  : "IA pausada — assuma o atendimento pelo campo de mensagem."}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, marginBottom: 10 }}>STATUS</div>
              <span
                className="badge"
                style={{
                  background: resolvida ? "var(--panel-2)" : iaOn ? "rgba(34,197,94,.15)" : "rgba(245,158,11,.15)",
                  color: resolvida ? "var(--muted)" : iaOn ? "var(--green)" : "var(--amber)",
                  borderColor: "var(--border)",
                  fontWeight: 600,
                }}
              >
                {resolvida ? "Resolvida" : iaOn ? "Aberta · IA ativa" : "Pendente · humano"}
              </span>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1, marginBottom: 10 }}>CANAL</div>
              <div style={{ fontSize: 14 }}>
                {conversa.platform === "whatsapp" ? "🟢 WhatsApp" : "📸 Instagram"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

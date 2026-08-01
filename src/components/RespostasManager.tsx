"use client";

import { useEffect, useState } from "react";
import type { QuickReply } from "@/lib/types";

export default function RespostasManager() {
  const [itens, setItens] = useState<QuickReply[]>([]);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    const res = await fetch("/api/respostas", { cache: "no-store" });
    const data = await res.json();
    if (Array.isArray(data.respostas)) setItens(data.respostas);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch assíncrono
    void carregar();
  }, []);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !texto.trim() || saving) return;
    setSaving(true);
    setErro(null);
    try {
      const res = await fetch("/api/respostas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, texto }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error ?? "Falha ao salvar");
      setTitulo("");
      setTexto("");
      await carregar();
    } catch (e) {
      setErro(String(e));
    } finally {
      setSaving(false);
    }
  }

  async function remover(id: string) {
    setItens((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/respostas/${id}`, { method: "DELETE" });
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 14 }}>Nova resposta</div>
        <form onSubmit={adicionar} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label className="label">Título</label>
            <input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Saudação inicial" />
          </div>
          <div>
            <label className="label">Texto</label>
            <textarea className="textarea" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Olá! Sou da GAABTUR. Como posso te ajudar hoje?" />
          </div>
          {erro && <div style={{ color: "var(--red)", fontSize: 13 }}>{erro}</div>}
          <button className="btn" disabled={saving} style={{ alignSelf: "flex-start" }}>
            {saving ? "Salvando…" : "Adicionar"}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 14 }}>Salvas ({itens.length})</div>
        {itens.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Nenhuma resposta rápida ainda.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {itens.map((r) => (
              <div key={r.id} style={{ border: "1px solid var(--border)", borderRadius: "var(--r-ctrl)", padding: "11px 13px", background: "var(--panel-2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <strong style={{ fontSize: 14 }}>{r.titulo}</strong>
                  <button
                    onClick={() => remover(r.id)}
                    title="Remover"
                    style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 15, lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 5, whiteSpace: "pre-wrap" }}>{r.texto}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

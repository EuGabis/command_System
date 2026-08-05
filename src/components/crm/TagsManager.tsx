"use client";

import { useEffect, useState } from "react";
import type { Tag } from "@/lib/types";

export default function TagsManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("#f2871e");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    const res = await fetch("/api/crm/tags", { cache: "no-store" });
    const data = await res.json();
    if (Array.isArray(data.tags)) setTags(data.tags);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, []);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || saving) return;
    setSaving(true);
    setErro(null);
    try {
      const res = await fetch("/api/crm/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cor }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error ?? "Falha ao salvar");
      setNome("");
      await carregar();
    } catch (e) {
      setErro(String(e));
    } finally {
      setSaving(false);
    }
  }

  async function remover(id: string) {
    setTags((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/crm/tags/${id}`, { method: "DELETE" });
  }

  return (
    <div className="card">
      <div className="eyebrow" style={{ marginBottom: 14 }}>Tags</div>

      <form onSubmit={adicionar} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 18 }}>
        <div style={{ flex: "1 1 180px" }}>
          <label className="label">Nova tag</label>
          <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: VIP, Orçamento, Retorno" />
        </div>
        <div>
          <label className="label">Cor</label>
          <input type="color" value={cor} onChange={(e) => setCor(e.target.value)} style={{ width: 44, height: 40, border: "1px solid var(--border)", borderRadius: "var(--r-ctrl)", background: "var(--panel-2)", padding: 3 }} />
        </div>
        <button className="btn" disabled={saving}>{saving ? "Salvando…" : "Adicionar"}</button>
      </form>

      {erro && <div style={{ color: "var(--red)", fontSize: 13, marginBottom: 10 }}>{erro}</div>}

      {tags.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Nenhuma tag ainda.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tags.map((t) => (
            <span
              key={t.id}
              className="badge"
              style={{ borderColor: t.cor, color: "var(--text)", gap: 8, paddingRight: 6 }}
            >
              <span className="dot" style={{ background: t.cor }} />
              {t.nome}
              <button
                onClick={() => remover(t.id)}
                title="Remover"
                style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, lineHeight: 1, padding: "0 2px" }}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

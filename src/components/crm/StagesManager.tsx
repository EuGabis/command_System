"use client";

import { useEffect, useState } from "react";
import type { PipelineStageRow, StageTipo } from "@/lib/types";

export default function StagesManager() {
  const [stages, setStages] = useState<PipelineStageRow[]>([]);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("#f2871e");
  const [tipo, setTipo] = useState<StageTipo>("em_processo");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    const res = await fetch("/api/crm/stages", { cache: "no-store" });
    const data = await res.json();
    if (Array.isArray(data.stages)) setStages(data.stages);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, []);

  async function patch(id: string, body: Record<string, unknown>) {
    await fetch(`/api/crm/stages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || saving) return;
    setSaving(true);
    setErro(null);
    try {
      const res = await fetch("/api/crm/stages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cor, tipo }),
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

  async function mover(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= stages.length) return;
    const a = stages[i];
    const b = stages[j];
    setStages((prev) => {
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
    await Promise.all([patch(a.id, { ordem: b.ordem }), patch(b.id, { ordem: a.ordem })]);
    carregar();
  }

  async function remover(id: string) {
    setStages((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/crm/stages/${id}`, { method: "DELETE" });
  }

  return (
    <div className="card">
      <div className="eyebrow" style={{ marginBottom: 14 }}>Etapas do funil</div>

      <form onSubmit={adicionar} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 18 }}>
        <div style={{ flex: "1 1 180px" }}>
          <label className="label">Nova etapa</label>
          <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Proposta enviada" />
        </div>
        <div>
          <label className="label">Cor</label>
          <input type="color" value={cor} onChange={(e) => setCor(e.target.value)} style={{ width: 44, height: 40, border: "1px solid var(--border)", borderRadius: "var(--r-ctrl)", background: "var(--panel-2)", padding: 3 }} />
        </div>
        <div>
          <label className="label">Tipo</label>
          <select className="select" value={tipo} onChange={(e) => setTipo(e.target.value as StageTipo)} style={{ width: "auto" }}>
            <option value="em_processo">Em processo</option>
            <option value="ganho">Ganho</option>
            <option value="perdido">Perdido</option>
          </select>
        </div>
        <button className="btn" disabled={saving}>{saving ? "Salvando…" : "Adicionar"}</button>
      </form>

      {erro && <div style={{ color: "var(--red)", fontSize: 13, marginBottom: 10 }}>{erro}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {stages.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: "var(--r-ctrl)" }}>
            <input
              type="color"
              defaultValue={s.cor}
              onChange={(e) => patch(s.id, { cor: e.target.value })}
              style={{ width: 30, height: 30, flex: "none", border: "none", background: "transparent", padding: 0 }}
              title="Cor"
            />
            <input
              className="input"
              defaultValue={s.nome}
              onBlur={(e) => e.target.value.trim() && patch(s.id, { nome: e.target.value })}
              style={{ flex: 1, minWidth: 0, padding: "7px 10px" }}
            />
            <select
              className="select"
              defaultValue={s.tipo}
              onChange={(e) => patch(s.id, { tipo: e.target.value })}
              style={{ width: "auto", padding: "7px 10px" }}
            >
              <option value="em_processo">Em processo</option>
              <option value="ganho">Ganho</option>
              <option value="perdido">Perdido</option>
            </select>
            <button onClick={() => mover(i, -1)} disabled={i === 0} title="Subir" style={btnIcon}>↑</button>
            <button onClick={() => mover(i, 1)} disabled={i === stages.length - 1} title="Descer" style={btnIcon}>↓</button>
            <button onClick={() => remover(s.id)} title="Remover" style={{ ...btnIcon, color: "var(--red)" }}>✕</button>
          </div>
        ))}
        {stages.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>Nenhuma etapa. Adicione a primeira acima.</p>}
      </div>

      <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 12 }}>
        A ordem e as cores aparecem no funil do Pipeline. Tipo <strong>Ganho</strong>/<strong>Perdido</strong> marcam o fechamento do lead.
      </p>
    </div>
  );
}

const btnIcon: React.CSSProperties = {
  background: "transparent", border: "1px solid var(--border)", color: "var(--muted)",
  cursor: "pointer", borderRadius: 7, width: 30, height: 30, flex: "none", fontSize: 14, lineHeight: 1,
};

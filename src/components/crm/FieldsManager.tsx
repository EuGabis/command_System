"use client";

import { useEffect, useState } from "react";
import type { CustomField, CustomFieldTipo } from "@/lib/types";

const TIPO_LABEL: Record<CustomFieldTipo, string> = {
  texto: "Texto",
  numero: "Número",
  data: "Data",
  selecao: "Seleção",
};

export default function FieldsManager() {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<CustomFieldTipo>("texto");
  const [opcoes, setOpcoes] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    const res = await fetch("/api/crm/fields", { cache: "no-store" });
    const data = await res.json();
    if (Array.isArray(data.fields)) setFields(data.fields);
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
      const lista = opcoes.split(/[\n,]/).map((o) => o.trim()).filter(Boolean);
      const res = await fetch("/api/crm/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, tipo, opcoes: lista }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error ?? "Falha ao salvar");
      setNome("");
      setOpcoes("");
      setTipo("texto");
      await carregar();
    } catch (e) {
      setErro(String(e));
    } finally {
      setSaving(false);
    }
  }

  async function remover(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
    await fetch(`/api/crm/fields/${id}`, { method: "DELETE" });
  }

  return (
    <div className="card">
      <div className="eyebrow" style={{ marginBottom: 6 }}>Campos personalizados</div>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>
        Campos extras que aparecem na ficha de cada contato — só o que o seu negócio precisa.
      </p>

      <form onSubmit={adicionar} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 8 }}>
        <div style={{ flex: "1 1 180px" }}>
          <label className="label">Novo campo</label>
          <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: CPF, Cidade, Nº do pedido" />
        </div>
        <div>
          <label className="label">Tipo</label>
          <select className="select" value={tipo} onChange={(e) => setTipo(e.target.value as CustomFieldTipo)} style={{ width: "auto" }}>
            <option value="texto">Texto</option>
            <option value="numero">Número</option>
            <option value="data">Data</option>
            <option value="selecao">Seleção</option>
          </select>
        </div>
        <button className="btn" disabled={saving}>{saving ? "Salvando…" : "Adicionar"}</button>
      </form>

      {tipo === "selecao" && (
        <div style={{ marginBottom: 16 }}>
          <label className="label">Opções (uma por linha ou separadas por vírgula)</label>
          <textarea className="textarea" value={opcoes} onChange={(e) => setOpcoes(e.target.value)} placeholder={"Pequeno\nMédio\nGrande"} style={{ minHeight: 70 }} />
        </div>
      )}

      {erro && <div style={{ color: "var(--red)", fontSize: 13, marginBottom: 10 }}>{erro}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
        {fields.map((f) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: "var(--r-ctrl)" }}>
            <strong style={{ fontSize: 14, flex: 1, minWidth: 0 }}>{f.nome}</strong>
            <span className="badge">{TIPO_LABEL[f.tipo]}</span>
            {f.tipo === "selecao" && f.opcoes.length > 0 && (
              <span style={{ color: "var(--muted)", fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {f.opcoes.join(" · ")}
              </span>
            )}
            <button onClick={() => remover(f.id)} title="Remover" style={{ background: "transparent", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>✕</button>
          </div>
        ))}
        {fields.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>Nenhum campo personalizado ainda.</p>}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { AiConfig } from "@/lib/types";

const MODELOS = ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1"];

export default function AiConfigForm({ initial }: { initial: AiConfig }) {
  const [cfg, setCfg] = useState<AiConfig>(initial);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof AiConfig>(k: K, v: AiConfig[K]) {
    setCfg({ ...cfg, [k]: v });
  }

  async function salvar() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cfg),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro ao salvar");
      setMsg({ type: "ok", text: "Configuração da IA salva." });
    } catch (e) {
      setMsg({ type: "err", text: String(e) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong>Status do atendimento automático</strong>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={cfg.ativo}
              onChange={(e) => set("ativo", e.target.checked)}
            />
            <span>{cfg.ativo ? "IA ativa" : "Somente humano"}</span>
          </label>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>
          Quando desativada, as mensagens são registradas mas não recebem resposta automática.
        </p>
      </div>

      <div className="card">
        <strong>Persona e comportamento</strong>
        <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
          <div>
            <label className="label">Persona / instrução principal</label>
            <textarea
              className="textarea"
              value={cfg.persona}
              onChange={(e) => set("persona", e.target.value)}
              placeholder="Ex: Você é o atendente da Loja X, ajuda clientes com pedidos e dúvidas."
            />
          </div>
          <div className="grid-2">
            <div>
              <label className="label">Tom de voz</label>
              <input className="input" value={cfg.tom} onChange={(e) => set("tom", e.target.value)} />
            </div>
            <div>
              <label className="label">Modelo OpenAI</label>
              <select className="select" value={cfg.modelo} onChange={(e) => set("modelo", e.target.value)}>
                {MODELOS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <strong>Base de conhecimento (FAQ / informações)</strong>
        <textarea
          className="textarea"
          style={{ marginTop: 12, minHeight: 160 }}
          value={cfg.base_conhecimento}
          onChange={(e) => set("base_conhecimento", e.target.value)}
          placeholder="Horário de funcionamento, formas de pagamento, política de troca, links, preços..."
        />
      </div>

      <div className="card">
        <strong>Regras de escalonamento para humano</strong>
        <textarea
          className="textarea"
          style={{ marginTop: 12 }}
          value={cfg.regras_escalonamento}
          onChange={(e) => set("regras_escalonamento", e.target.value)}
          placeholder="Ex: Se o cliente pedir reembolso ou falar com atendente, avise que um humano assumirá."
        />
      </div>

      {msg && (
        <div
          className="card"
          style={{
            borderColor: msg.type === "ok" ? "var(--green)" : "var(--red)",
            color: msg.type === "ok" ? "var(--green)" : "var(--red)",
            fontSize: 14,
          }}
        >
          {msg.text}
        </div>
      )}

      <div>
        <button className="btn" onClick={salvar} disabled={saving}>
          {saving ? "Salvando..." : "Salvar configuração"}
        </button>
      </div>
    </div>
  );
}

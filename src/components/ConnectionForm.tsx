"use client";

import { useState } from "react";
import type { Platform } from "@/lib/types";

interface Field {
  key: string;
  label: string;
  placeholder?: string;
  secret?: boolean;
  help?: string;
}

export default function ConnectionForm({
  platform,
  fields,
  initial,
  initialVerifyToken,
  webhookPath,
}: {
  platform: Platform;
  fields: Field[];
  initial: Record<string, string>;
  initialVerifyToken: string;
  webhookPath: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [verifyToken, setVerifyToken] = useState(initialVerifyToken);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  async function salvar() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/connections/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, verifyToken }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro ao salvar");
      setMsg({ type: "ok", text: "Credenciais salvas com segurança." });
    } catch (e) {
      setMsg({ type: "err", text: String(e) });
    } finally {
      setSaving(false);
    }
  }

  async function testar() {
    setTesting(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/connections/${platform}`, { method: "PUT" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha no teste");
      setMsg({ type: "ok", text: "Conexão validada! Status: conectado." });
    } catch (e) {
      setMsg({ type: "err", text: String(e) });
    } finally {
      setTesting(false);
    }
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://SEU-DOMINIO";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card">
        <strong>Credenciais da API</strong>
        <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
          {fields.map((f) => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input
                className="input"
                type={f.secret ? "password" : "text"}
                placeholder={f.placeholder}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
              {f.help && (
                <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>{f.help}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <strong>Webhook</strong>
        <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
          <div>
            <label className="label">URL de callback (configure no painel da Meta)</label>
            <input className="input" readOnly value={`${origin}${webhookPath}`} />
          </div>
          <div>
            <label className="label">Verify Token (defina o mesmo valor na Meta)</label>
            <input
              className="input"
              value={verifyToken}
              placeholder="ex: meu-token-secreto-123"
              onChange={(e) => setVerifyToken(e.target.value)}
            />
          </div>
        </div>
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

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn" onClick={salvar} disabled={saving}>
          {saving ? "Salvando..." : "Salvar credenciais"}
        </button>
        <button className="btn secondary" onClick={testar} disabled={testing}>
          {testing ? "Testando..." : "Testar conexão"}
        </button>
      </div>
    </div>
  );
}

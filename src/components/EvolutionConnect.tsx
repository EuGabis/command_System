"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type State = "open" | "connecting" | "close" | "unknown" | "desconhecido";

interface ConnectResult {
  ok?: boolean;
  error?: string;
  state?: State;
  status?: string;
  base64?: string | null;
  pairingCode?: string | null;
  number?: string | null;
  profileName?: string | null;
}

export default function EvolutionConnect({
  instanceName,
  initialState,
  initialNumber,
  initialProfileName,
}: {
  instanceName: string;
  initialState: State;
  initialNumber: string | null;
  initialProfileName: string | null;
}) {
  const [state, setState] = useState<State>(initialState);
  const [number, setNumber] = useState<string | null>(initialNumber);
  const [profileName, setProfileName] = useState<string | null>(initialProfileName);
  const [qr, setQr] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp/evolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", instanceName }),
      });
      const data: ConnectResult = await res.json();
      if (data.state) setState(data.state);
      if (data.number) setNumber(data.number);
      if (data.profileName) setProfileName(data.profileName);
      if (data.state === "open") {
        setQr(null);
        setPairingCode(null);
        stopPolling();
      }
    } catch {
      /* silencioso durante polling */
    }
  }, [instanceName, stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  async function conectar() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/whatsapp/evolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect", instanceName }),
      });
      const data: ConnectResult = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error ?? "Falha ao conectar");
      if (data.state) setState(data.state);
      if (data.number) setNumber(data.number);
      if (data.profileName) setProfileName(data.profileName);
      setQr(data.base64 ?? null);
      setPairingCode(data.pairingCode ?? null);

      if (data.state !== "open") {
        stopPolling();
        pollRef.current = setInterval(refreshStatus, 3000);
      }
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function desconectar() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/whatsapp/evolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout", instanceName }),
      });
      const data: ConnectResult = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.error ?? "Falha ao desconectar");
      setState("close");
      setNumber(null);
      setProfileName(null);
      setQr(null);
      setPairingCode(null);
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  const connected = state === "open";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Instância Evolution</strong>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
              <code>{instanceName}</code>
            </div>
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: connected ? "var(--green)" : state === "connecting" ? "var(--brand)" : "var(--muted)",
            }}
          >
            {connected ? "● Conectado" : state === "connecting" ? "○ Conectando…" : "○ Desconectado"}
          </span>
        </div>

        {connected && (
          <div style={{ marginTop: 14, fontSize: 14 }}>
            {profileName && <div><strong>{profileName}</strong></div>}
            {number && <div style={{ color: "var(--muted)" }}>+{number}</div>}
          </div>
        )}

        {qr && !connected && (
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 10 }}>
              Abra o WhatsApp no celular → <strong>Aparelhos conectados</strong> → <strong>Conectar aparelho</strong> e
              escaneie:
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr}
              alt="QR code de conexão"
              style={{ width: 260, height: 260, borderRadius: 8, background: "#fff", padding: 8 }}
            />
            {pairingCode && (
              <p style={{ marginTop: 10, fontSize: 13 }}>
                Ou use o código: <code style={{ fontWeight: 700 }}>{pairingCode}</code>
              </p>
            )}
          </div>
        )}

        {err && (
          <div style={{ marginTop: 14, color: "var(--red)", fontSize: 13 }}>{err}</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        {!connected ? (
          <button className="btn" onClick={conectar} disabled={busy}>
            {busy ? "Conectando…" : qr ? "Gerar novo QR" : "Conectar via QR"}
          </button>
        ) : (
          <button className="btn secondary" onClick={desconectar} disabled={busy}>
            {busy ? "Desconectando…" : "Desconectar"}
          </button>
        )}
        <button className="btn secondary" onClick={refreshStatus} disabled={busy}>
          Atualizar status
        </button>
      </div>
    </div>
  );
}

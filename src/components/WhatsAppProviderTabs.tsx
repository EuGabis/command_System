"use client";

import { useState } from "react";
import ConnectionForm from "./ConnectionForm";
import EvolutionConnect from "./EvolutionConnect";
import type { WhatsAppProvider } from "@/lib/types";

interface Field {
  key: string;
  label: string;
  placeholder?: string;
  secret?: boolean;
  help?: string;
}

type EvoState = "open" | "connecting" | "close" | "unknown" | "desconhecido";

export default function WhatsAppProviderTabs({
  defaultProvider,
  meta,
  evolution,
}: {
  defaultProvider: WhatsAppProvider;
  meta: {
    initial: Record<string, string>;
    initialVerifyToken: string;
    webhookPath: string;
    fields: Field[];
  };
  evolution: {
    configured: boolean;
    instanceName: string;
    initialState: EvoState;
    initialNumber: string | null;
    initialProfileName: string | null;
  };
}) {
  const [provider, setProvider] = useState<WhatsAppProvider>(defaultProvider);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid var(--border, #333)",
    background: active ? "var(--brand)" : "transparent",
    color: active ? "#fff" : "var(--muted)",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={tabStyle(provider === "evolution")} onClick={() => setProvider("evolution")}>
          Evolution (QR code)
        </button>
        <button style={tabStyle(provider === "meta")} onClick={() => setProvider("meta")}>
          Meta Cloud API
        </button>
      </div>

      {provider === "evolution" ? (
        evolution.configured ? (
          <EvolutionConnect
            instanceName={evolution.instanceName}
            initialState={evolution.initialState}
            initialNumber={evolution.initialNumber}
            initialProfileName={evolution.initialProfileName}
          />
        ) : (
          <div className="card" style={{ fontSize: 14, color: "var(--muted)" }}>
            Evolution API não configurada. Defina <code>EVOLUTION_API_URL</code> e{" "}
            <code>EVOLUTION_API_KEY</code> nas variáveis de ambiente.
          </div>
        )
      ) : (
        <ConnectionForm
          platform="whatsapp"
          webhookPath={meta.webhookPath}
          initialVerifyToken={meta.initialVerifyToken}
          initial={meta.initial}
          fields={meta.fields}
        />
      )}
    </div>
  );
}

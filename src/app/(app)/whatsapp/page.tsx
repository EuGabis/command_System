import WhatsAppProviderTabs from "@/components/WhatsAppProviderTabs";
import StatusBadge from "@/components/StatusBadge";
import ChannelOverview from "@/components/ChannelOverview";
import { getConnection } from "@/lib/repo";
import {
  isEvolutionConfigured,
  defaultInstance,
  evolutionStatus,
} from "@/lib/evolution";
import type { WhatsAppProvider } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function WhatsAppPage() {
  const conn = await getConnection("whatsapp");
  const c = conn.credentials ?? {};

  const evoConfigured = isEvolutionConfigured();
  const instanceName =
    c.provider === "evolution" && c.instanceName ? c.instanceName : defaultInstance();

  // Estado atual da instância Evolution (best-effort — não quebra a página se falhar).
  let evoState: "open" | "connecting" | "close" | "unknown" = "close";
  let evoNumber: string | null = null;
  let evoProfile: string | null = null;
  if (evoConfigured) {
    try {
      const st = await evolutionStatus(instanceName);
      evoState = st.state;
      evoNumber = st.number;
      evoProfile = st.profileName;
    } catch {
      /* servidor Evolution indisponível — mostra desconectado */
    }
  }

  const defaultProvider: WhatsAppProvider =
    c.provider === "evolution" || (evoConfigured && c.provider !== "meta" && !c.phoneNumberId)
      ? "evolution"
      : "meta";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Conexão WhatsApp</h1>
        <StatusBadge status={conn.status} />
      </div>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Conecte pelo <strong>Evolution</strong> (QR code, direto pelo sistema) ou pela{" "}
        <strong>Meta Cloud API</strong> oficial. Escolha o provedor abaixo.
      </p>
      {conn.lastError && (
        <div className="card" style={{ borderColor: "var(--red)", color: "var(--red)", marginBottom: 16, fontSize: 13 }}>
          Último erro: {conn.lastError}
        </div>
      )}

      <ChannelOverview platform="whatsapp" status={conn.status} />

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Configuração da conexão</h2>
      <WhatsAppProviderTabs
        defaultProvider={defaultProvider}
        meta={{
          webhookPath: "/api/webhook/whatsapp",
          initialVerifyToken: conn.verifyToken ?? "",
          initial: {
            phoneNumberId: c.phoneNumberId ?? "",
            wabaId: c.wabaId ?? "",
            accessToken: c.accessToken ?? "",
          },
          fields: [
            { key: "phoneNumberId", label: "Phone Number ID", placeholder: "1029384756..." },
            { key: "wabaId", label: "WhatsApp Business Account ID (WABA)", placeholder: "1122334455..." },
            { key: "accessToken", label: "Access Token", secret: true, help: "Token permanente do app/system user." },
          ],
        }}
        evolution={{
          configured: evoConfigured,
          instanceName,
          initialState: evoState,
          initialNumber: evoNumber,
          initialProfileName: evoProfile,
        }}
      />
    </div>
  );
}

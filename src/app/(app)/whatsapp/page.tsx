import ConnectionForm from "@/components/ConnectionForm";
import StatusBadge from "@/components/StatusBadge";
import { getConnection } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function WhatsAppPage() {
  const conn = await getConnection("whatsapp");
  const c = conn.credentials ?? {};

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Conexão WhatsApp</h1>
        <StatusBadge status={conn.status} />
      </div>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        WhatsApp Business Cloud API (Meta). Pegue os dados no{" "}
        <a href="https://developers.facebook.com/apps" target="_blank" style={{ color: "var(--brand)" }}>
          Meta for Developers
        </a>.
      </p>
      {conn.lastError && (
        <div className="card" style={{ borderColor: "var(--red)", color: "var(--red)", marginBottom: 16, fontSize: 13 }}>
          Último erro: {conn.lastError}
        </div>
      )}
      <ConnectionForm
        platform="whatsapp"
        webhookPath="/api/webhook/whatsapp"
        initialVerifyToken={conn.verifyToken ?? ""}
        initial={{
          phoneNumberId: c.phoneNumberId ?? "",
          wabaId: c.wabaId ?? "",
          accessToken: c.accessToken ?? "",
        }}
        fields={[
          { key: "phoneNumberId", label: "Phone Number ID", placeholder: "1029384756..." },
          { key: "wabaId", label: "WhatsApp Business Account ID (WABA)", placeholder: "1122334455..." },
          { key: "accessToken", label: "Access Token", secret: true, help: "Token permanente do app/system user." },
        ]}
      />
    </div>
  );
}

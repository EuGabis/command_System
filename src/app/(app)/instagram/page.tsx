import ConnectionForm from "@/components/ConnectionForm";
import StatusBadge from "@/components/StatusBadge";
import { getConnection } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function InstagramPage() {
  const conn = await getConnection("instagram");
  const c = conn.credentials ?? {};

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Conexão Instagram</h1>
        <StatusBadge status={conn.status} />
      </div>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Instagram Messaging via Graph API. Requer conta Business/Creator vinculada a uma Página do Facebook.
      </p>
      {conn.lastError && (
        <div className="card" style={{ borderColor: "var(--red)", color: "var(--red)", marginBottom: 16, fontSize: 13 }}>
          Último erro: {conn.lastError}
        </div>
      )}
      <ConnectionForm
        platform="instagram"
        webhookPath="/api/webhook/instagram"
        initialVerifyToken={conn.verifyToken ?? ""}
        initial={{
          pageId: c.pageId ?? "",
          igBusinessId: c.igBusinessId ?? "",
          accessToken: c.accessToken ?? "",
          appSecret: c.appSecret ?? "",
        }}
        fields={[
          { key: "pageId", label: "Page ID (Facebook)", placeholder: "1029384756..." },
          { key: "igBusinessId", label: "Instagram Business Account ID", placeholder: "1784..." },
          { key: "accessToken", label: "Access Token (Page)", secret: true },
          { key: "appSecret", label: "App Secret", secret: true, help: "Usado para validar a assinatura do webhook." },
        ]}
      />
    </div>
  );
}

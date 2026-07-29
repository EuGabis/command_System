import Link from "next/link";
import AiConfigForm from "@/components/AiConfigForm";
import { getAiConfig } from "@/lib/repo";
import { isOpenAIConfigured } from "@/lib/ai";
import type { Platform } from "@/lib/types";

export const dynamic = "force-dynamic";

const canais: { key: Platform; label: string }[] = [
  { key: "whatsapp", label: "🟢 WhatsApp" },
  { key: "instagram", label: "📸 Instagram" },
];

export default async function IaPage({
  searchParams,
}: {
  searchParams: Promise<{ canal?: string }>;
}) {
  const { canal } = await searchParams;
  const platform: Platform = canal === "instagram" ? "instagram" : "whatsapp";
  const cfg = await getAiConfig(platform);

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Configuração da IA</h1>
      <p style={{ color: "var(--muted)", marginBottom: 16 }}>
        Configure um atendente virtual diferente para cada canal.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {canais.map((c) => {
          const ativo = c.key === platform;
          return (
            <Link
              key={c.key}
              href={`/ia?canal=${c.key}`}
              className="badge"
              style={{
                textDecoration: "none",
                color: ativo ? "#fff" : "var(--text)",
                background: ativo ? "var(--brand)" : "var(--panel-2)",
                borderColor: ativo ? "var(--brand)" : "var(--border)",
                padding: "6px 14px",
                fontSize: 13,
              }}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {!isOpenAIConfigured() && (
        <div className="card" style={{ borderColor: "var(--amber)", color: "var(--amber)", marginBottom: 16, fontSize: 13 }}>
          ⚠️ OPENAI_API_KEY não configurada — a IA responderá em modo simulado até você definir a chave.
        </div>
      )}

      <AiConfigForm key={platform} initial={cfg} platform={platform} />
    </div>
  );
}

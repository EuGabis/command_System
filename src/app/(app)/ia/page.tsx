import Link from "next/link";
import AiConfigForm from "@/components/AiConfigForm";
import { getAiConfig } from "@/lib/repo";
import { isOpenAIConfigured } from "@/lib/ai";
import type { Platform } from "@/lib/types";

export const dynamic = "force-dynamic";

const canais: { key: Platform; label: string }[] = [
  { key: "whatsapp", label: "WhatsApp" },
  { key: "instagram", label: "Instagram" },
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
      <div className="eyebrow" style={{ marginBottom: 8 }}>Inteligência artificial</div>
      <h1 style={{ fontSize: 25, fontWeight: 700, marginBottom: 4 }}>Atendente virtual</h1>
      <p style={{ color: "var(--muted)", marginBottom: 16 }}>
        Configure um atendente diferente para cada canal.
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
                color: ativo ? "var(--on-brand)" : "var(--text)",
                background: ativo ? "var(--brand)" : "var(--panel-2)",
                borderColor: ativo ? "var(--brand)" : "var(--border)",
                padding: "7px 15px",
              }}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {!isOpenAIConfigured() && (
        <div className="card" style={{ borderColor: "var(--amber)", color: "var(--amber)", marginBottom: 16, fontSize: 13 }}>
          A chave da OpenAI ainda não foi configurada — a IA responde em modo simulado até você defini-la.
        </div>
      )}

      <AiConfigForm key={platform} initial={cfg} platform={platform} />
    </div>
  );
}

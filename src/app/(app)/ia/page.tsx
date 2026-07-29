import AiConfigForm from "@/components/AiConfigForm";
import { getAiConfig } from "@/lib/repo";
import { isOpenAIConfigured } from "@/lib/ai";

export const dynamic = "force-dynamic";

export default async function IaPage() {
  const cfg = await getAiConfig();

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Configuração da IA</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Defina como o atendente virtual se comporta nas duas plataformas.
      </p>
      {!isOpenAIConfigured() && (
        <div className="card" style={{ borderColor: "var(--amber)", color: "var(--amber)", marginBottom: 16, fontSize: 13 }}>
          ⚠️ OPENAI_API_KEY não configurada — a IA responderá em modo simulado até você definir a chave em .env.local.
        </div>
      )}
      <AiConfigForm initial={cfg} />
    </div>
  );
}

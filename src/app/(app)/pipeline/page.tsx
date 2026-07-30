import PipelineBoard from "@/components/PipelineBoard";
import { listConversations } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const conversas = await listConversations();
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Pipeline</h1>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>
        Leads organizados por estágio. A IA classifica automaticamente; arraste um card para ajustar
        manualmente (isso trava a classificação automática daquele lead).
      </p>
      <PipelineBoard initial={conversas} />
    </div>
  );
}

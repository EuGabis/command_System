import Link from "next/link";
import PipelineBoard, { type StageView } from "@/components/PipelineBoard";
import Icon from "@/components/Icon";
import { listConversations, listStages } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const [conversas, stages] = await Promise.all([listConversations(), listStages()]);
  const stageViews: StageView[] = stages.map((s) => ({ key: s.key, label: s.nome, cor: s.cor }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
        <h1 style={{ fontSize: 25, fontWeight: 700 }}>Pipeline</h1>
        <Link href="/painel/crm/config" className="btn secondary" style={{ fontSize: 13 }}>
          <Icon name="settings" size={15} />
          Configurar funil
        </Link>
      </div>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>
        Leads organizados por estágio. A IA classifica automaticamente; arraste um card para ajustar
        manualmente (isso trava a classificação automática daquele lead).
      </p>
      <PipelineBoard initial={conversas} stages={stageViews} />
    </div>
  );
}

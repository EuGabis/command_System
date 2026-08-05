import StagesManager from "@/components/crm/StagesManager";
import TagsManager from "@/components/crm/TagsManager";
import FieldsManager from "@/components/crm/FieldsManager";
import { isSupabaseConfigured } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default function CrmConfigPage() {
  return (
    <div style={{ paddingBottom: 40 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>CRM</div>
      <h1 style={{ fontSize: 25, fontWeight: 700, marginBottom: 4 }}>Configuração</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Personalize o funil, as tags e os campos do seu negócio.
      </p>

      {!isSupabaseConfigured() && (
        <div className="card" style={{ borderColor: "var(--amber)", color: "var(--amber)", marginBottom: 16, fontSize: 13 }}>
          Rode <code>supabase/crm-foundation.sql</code> no Supabase para ativar estes recursos.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <StagesManager />
        <TagsManager />
        <FieldsManager />
      </div>
    </div>
  );
}

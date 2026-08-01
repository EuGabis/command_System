import RespostasManager from "@/components/RespostasManager";

export const dynamic = "force-dynamic";

export default function RespostasPage() {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Atendimento</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Respostas rápidas</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Modelos prontos para responder no manual em 1 clique, direto nas conversas.
      </p>
      <RespostasManager />
    </div>
  );
}
